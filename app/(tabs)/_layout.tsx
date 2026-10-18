import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, ColorValue } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { t } from '../../src/lib/i18n';

interface TabIconProps {
  color: ColorValue | string;
  focused: boolean;
}

const CheeseIcon: React.FC<TabIconProps> = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L21 17L21 10L3 14V17Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M3 14L12 4L21 10"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="15" r="1" fill={color} />
    <Circle cx="15" cy="14" r="1.5" fill={color} />
    <Circle cx="12" cy="11" r="1" fill={color} />
  </Svg>
);

const DairyIcon: React.FC<TabIconProps> = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 7H17L15 3H9L7 7Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Rect
      x="6"
      y="7"
      width="12"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M10 11H14M10 15H14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

const CaveIcon: React.FC<TabIconProps> = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 20L12 6L21 20H3Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M9 20V15C9 13.8954 9.89543 13 11 13H13C14.1046 13 15 13.8954 15 15V20"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const PantryIcon: React.FC<TabIconProps> = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M4 10H20M4 15H20M10 4V20"
      stroke={color}
      strokeWidth={1.5}
    />
  </Svg>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#B86D3B',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('SEROWAR'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <CheeseIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dairy"
        options={{
          title: t('Nabiał'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <DairyIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cave"
        options={{
          title: t('Dojrzewalnia'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <CaveIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pantry-knowledge"
        options={{
          title: t('Spiżarnia'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <PantryIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1E2229',
    borderTopColor: '#374151',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.75,
  },
  tabIconActive: {
    opacity: 1.0,
    transform: [{ scale: 1.1 }],
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    opacity: 0.8,
  },
  iconWrapActive: {
    opacity: 1.0,
    transform: [{ scale: 1.08 }],
  },
});
