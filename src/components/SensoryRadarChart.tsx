// ============================================================================
// Apps4Brew Studio — FERMENT 6-Axis Sensory Radar Chart
// SVG Polar Coordinate Visualizer for Organoleptic Cheese & Ferment Profiling
// ============================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { t } from '../lib/i18n';

export interface SensoryProfile {
  acidity: number;   // 1–10
  salinity: number;  // 1–10
  firmness: number;  // 1–10
  creaminess: number;// 1–10
  pungency: number;  // 1–10
  nuttiness: number; // 1–10
}

interface SensoryRadarChartProps {
  profile: SensoryProfile;
  size?: number;
}

export const SensoryRadarChart: React.FC<SensoryRadarChartProps> = ({
  profile,
  size = 280,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  const axes = [
    { key: 'acidity', label: t('Kwasowość'), value: profile.acidity || 1 },
    { key: 'salinity', label: t('Słoność'), value: profile.salinity || 1 },
    { key: 'firmness', label: t('Twardość'), value: profile.firmness || 1 },
    { key: 'creaminess', label: t('Kremowość'), value: profile.creaminess || 1 },
    { key: 'pungency', label: t('Ostrość'), value: profile.pungency || 1 },
    { key: 'nuttiness', label: t('Orzechowość'), value: profile.nuttiness || 1 },
  ];

  const angleStep = (2 * Math.PI) / axes.length;

  // Concentric polygon web levels (2, 4, 6, 8, 10)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (value: number, index: number, maxVal = 10) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.max(1, Math.min(10, value)) / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.value, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background web polygons */}
        {levels.map((level, lvlIdx) => {
          const webPoints = axes
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = level * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <Polygon
              key={`web-${lvlIdx}`}
              points={webPoints}
              stroke="#E7E5E4"
              strokeWidth={1}
              fill="none"
            />
          );
        })}

        {/* Axis radial spokes */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(10, i);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#D6D3D1"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          );
        })}

        {/* Data polygon filled */}
        <Polygon
          points={polygonPoints}
          stroke="#B45309" // Amber 700
          strokeWidth={2.5}
          fill="rgba(217, 119, 6, 0.35)"
        />

        {/* Data points (circles) */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(axis.value, i);
          return (
            <Circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={4.5}
              fill="#78350F"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Axis labels */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y + 4}
              fontSize={10}
              fontWeight="600"
              fill="#44403C"
              textAnchor="middle"
            >
              {`${axis.label} (${axis.value})`}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});
