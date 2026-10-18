// ============================================================================
// Apps4Brew Studio — SEROWAR Sensor Telemetry & Smart Hygrometer Decoder Engine
// Decodes broadcast advertising payloads from RuuviTag (RAW v2), Xiaomi Mijia / BTHome,
// and parses CSV datalogger records for precision cheese cave microclimate analysis.
// ============================================================================

export interface SensorReading {
  sensorType: 'RUUVITAG' | 'XIAOMI_BTHOME' | 'CSV_LOGGER' | 'MANUAL';
  temperatureCelsius: number;
  relativeHumidityPct: number;
  pressureHpa?: number;
  batteryMilliVolts?: number;
  batteryPct?: number;
  dewPointCelsius: number;
  timestamp: number;
  sequenceNumber?: number;
}

export interface CaveStabilityMetrics {
  readingCount: number;
  meanTemperatureCelsius: number;
  temperatureStandardDeviation: number;
  maxTemperatureSwingCelsius: number;
  meanRelativeHumidityPct: number;
  humidityStandardDeviation: number;
  maxHumiditySwingPct: number;
  stabilityScorePct: number; // 0..100% (100 = perfectly stable microclimate)
  evaluation: 'EXCELLENT_CELLAR' | 'ACCEPTABLE' | 'ERRATIC_THERMAL_SWING' | 'UNSAFE_DRYING_SPIKES';
  recommendation: string;
}

/**
 * Calculates dew point using the Magnus-Tetens formula.
 */
function calculateDewPoint(tempCelsius: number, relativeHumidityPct: number): number {
  const rh = Math.max(1, Math.min(100, relativeHumidityPct));
  const a = 17.27;
  const b = 237.3;
  const alpha = (a * tempCelsius) / (b + tempCelsius) + Math.log(rh / 100);
  return Number(((b * alpha) / (a - alpha)).toFixed(1));
}

/**
 * Decodes RuuviTag Manufacturer Data payload (RAW v2, Data format 5).
 * Spec: https://docs.ruuvi.com/ruuvi-firmware/data-formats/data-format-5-rawv2
 */
export function decodeRuuviRawV2(hexPayload: string): SensorReading | null {
  if (!hexPayload || typeof hexPayload !== 'string') return null;
  const cleanHex = hexPayload.replace(/[^0-9a-fA-F]/g, '');
  if (cleanHex.length < 32) return null;

  try {
    const bytes: number[] = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
    }

    // Format byte must be 0x05
    const format = bytes[0];
    if (format !== 5) return null;

    // Temperature: 2 bytes, 16-bit signed, unit 0.005 °C
    let rawTemp = (bytes[1] << 8) | bytes[2];
    if (rawTemp > 0x7fff) rawTemp -= 0x10000;
    const tempCelsius = Number((rawTemp * 0.005).toFixed(2));

    // Humidity: 2 bytes, 16-bit unsigned, unit 0.0025 %
    const rawHumidity = (bytes[3] << 8) | bytes[4];
    const relativeHumidityPct = Number(Math.min(100, rawHumidity * 0.0025).toFixed(1));

    // Pressure: 2 bytes, unsigned, unit 1 Pa, offset -50000 Pa
    const rawPressure = (bytes[5] << 8) | bytes[6];
    const pressureHpa = Number(((rawPressure + 50000) / 100).toFixed(1));

    // Power info: 2 bytes
    // Bits 0-4: TX power, Bits 5-15: Battery voltage (offset 1600 mV)
    const powerInfo = (bytes[13] << 8) | bytes[14];
    const batteryMilliVolts = (powerInfo >>> 5) + 1600;
    const batteryPct = Math.max(0, Math.min(100, Math.round(((batteryMilliVolts - 2200) / 800) * 100)));

    // Measurement sequence number: bytes 16-17
    const sequenceNumber = (bytes[16] << 8) | bytes[17];

    return {
      sensorType: 'RUUVITAG',
      temperatureCelsius: tempCelsius,
      relativeHumidityPct,
      pressureHpa,
      batteryMilliVolts,
      batteryPct,
      dewPointCelsius: calculateDewPoint(tempCelsius, relativeHumidityPct),
      timestamp: Date.now(),
      sequenceNumber,
    };
  } catch {
    return null;
  }
}

/**
 * Decodes BTHome v2 advertisement payload (used by Xiaomi Mijia LYWSD03MMC with custom ATC/BTHome firmware).
 */
export function decodeBTHomeAdvertisement(hexPayload: string): SensorReading | null {
  if (!hexPayload || typeof hexPayload !== 'string') return null;
  const cleanHex = hexPayload.replace(/[^0-9a-fA-F]/g, '');
  if (cleanHex.length < 10) return null;

  try {
    const bytes: number[] = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
    }

    let tempCelsius: number | null = null;
    let relativeHumidityPct: number | null = null;
    let batteryPct: number | null = null;

    // Iterate through BTHome TLV (Type-Length-Value)
    let idx = 0;
    while (idx < bytes.length) {
      const objId = bytes[idx++];
      if (objId === 0x01 && idx < bytes.length) {
        // Battery percentage (1 byte unsigned)
        batteryPct = bytes[idx++];
      } else if (objId === 0x02 && idx + 1 < bytes.length) {
        // Temperature (2 bytes signed, factor 0.01)
        let rawT = bytes[idx] | (bytes[idx + 1] << 8);
        if (rawT > 0x7fff) rawT -= 0x10000;
        tempCelsius = Number((rawT * 0.01).toFixed(2));
        idx += 2;
      } else if (objId === 0x03 && idx + 1 < bytes.length) {
        // Humidity (2 bytes unsigned, factor 0.01)
        const rawH = bytes[idx] | (bytes[idx + 1] << 8);
        relativeHumidityPct = Number((rawH * 0.01).toFixed(1));
        idx += 2;
      } else {
        idx++;
      }
    }

    if (tempCelsius === null && relativeHumidityPct === null) {
      return null;
    }

    const t = tempCelsius ?? 12.0;
    const rh = relativeHumidityPct ?? 85.0;

    return {
      sensorType: 'XIAOMI_BTHOME',
      temperatureCelsius: t,
      relativeHumidityPct: rh,
      batteryPct: batteryPct ?? 90,
      dewPointCelsius: calculateDewPoint(t, rh),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

/**
 * Parses CSV export from digital data loggers (Elitech, Inkbird, Govee).
 */
export function parseHygrometerCsvLog(csvContent: string): SensorReading[] {
  if (!csvContent || typeof csvContent !== 'string') return [];
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const readings: SensorReading[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/^"/, '').replace(/"$/, ''));
    if (parts.length < 2) continue;

    // Look for numbers corresponding to temp and humidity
    let temp: number | null = null;
    let rh: number | null = null;

    for (const part of parts) {
      const num = parseFloat(part.replace(',', '.'));
      if (!isNaN(num)) {
        if (temp === null && num >= -20 && num <= 50) {
          temp = num;
        } else if (temp !== null && rh === null && num >= 10 && num <= 100) {
          rh = num;
          break;
        }
      }
    }

    if (temp !== null && rh !== null) {
      readings.push({
        sensorType: 'CSV_LOGGER',
        temperatureCelsius: Number(temp.toFixed(2)),
        relativeHumidityPct: Number(rh.toFixed(1)),
        dewPointCelsius: calculateDewPoint(temp, rh),
        timestamp: Date.now() - (lines.length - i) * 60000, // synthetic relative timestamp
      });
    }
  }

  return readings;
}

/**
 * Analyzes stability of cheese cave microclimate across historic time-series readings.
 */
export function assessCaveMicroclimateStability(
  readings: Array<{ temperatureCelsius: number; relativeHumidityPct: number }>
): CaveStabilityMetrics {
  if (!readings || readings.length === 0) {
    return {
      readingCount: 0,
      meanTemperatureCelsius: 12.0,
      temperatureStandardDeviation: 0,
      maxTemperatureSwingCelsius: 0,
      meanRelativeHumidityPct: 85.0,
      humidityStandardDeviation: 0,
      maxHumiditySwingPct: 0,
      stabilityScorePct: 100,
      evaluation: 'EXCELLENT_CELLAR',
      recommendation: 'Brak zarejestrowanych odczytów. Wprowadź dane z czujnika mikroklimatu.',
    };
  }

  const n = readings.length;
  const temps = readings.map((r) => r.temperatureCelsius);
  const rhs = readings.map((r) => r.relativeHumidityPct);

  const meanT = temps.reduce((a, b) => a + b, 0) / n;
  const meanRh = rhs.reduce((a, b) => a + b, 0) / n;

  const varT = temps.reduce((acc, v) => acc + Math.pow(v - meanT, 2), 0) / n;
  const stdT = Math.sqrt(varT);

  const varRh = rhs.reduce((acc, v) => acc + Math.pow(v - meanRh, 2), 0) / n;
  const stdRh = Math.sqrt(varRh);

  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const maxSwingT = maxT - minT;

  const minRh = Math.min(...rhs);
  const maxRh = Math.max(...rhs);
  const maxSwingRh = maxRh - minRh;

  // Stability penalty based on swings (ideal cellar: temp std < 0.8°C, RH std < 3%)
  const penaltyT = Math.min(50, stdT * 20);
  const penaltyRh = Math.min(50, stdRh * 5);
  const stabilityScorePct = Math.max(0, Math.min(100, Math.round(100 - penaltyT - penaltyRh)));

  let evaluation: CaveStabilityMetrics['evaluation'] = 'EXCELLENT_CELLAR';
  let recommendation = 'Wzorcowa stabilność mikroklimatu. Krążki dojrzewają w idealnych warunkach.';

  if (stabilityScorePct < 50 || maxSwingT > 4.0) {
    evaluation = 'ERRATIC_THERMAL_SWING';
    recommendation = 'Nadmierne wahania dobowe temperatury (>4°C). Zwiększ izolację termiczną lub zainstaluj termoregulator PID.';
  } else if (minRh < 70) {
    evaluation = 'UNSAFE_DRYING_SPIKES';
    recommendation = 'Spadki wilgotności poniżej 70% grożą zjawiskiem Case Hardening (zaskorupieniem skórki i uwięzieniem wilgoci).';
  } else if (stabilityScorePct < 75) {
    evaluation = 'ACCEPTABLE';
    recommendation = 'Mikroklimat dopuszczalny, z umiarkowaną fluktuacją wilgotności.';
  }

  return {
    readingCount: n,
    meanTemperatureCelsius: Number(meanT.toFixed(1)),
    temperatureStandardDeviation: Number(stdT.toFixed(2)),
    maxTemperatureSwingCelsius: Number(maxSwingT.toFixed(1)),
    meanRelativeHumidityPct: Number(meanRh.toFixed(1)),
    humidityStandardDeviation: Number(stdRh.toFixed(2)),
    maxHumiditySwingPct: Number(maxSwingRh.toFixed(1)),
    stabilityScorePct,
    evaluation,
    recommendation,
  };
}

export interface DiscoveredBleDevice {
  deviceId: string;
  name: string;
  sensorType: 'RUUVI_TAG' | 'XIAOMI_MIJIA' | 'INKBIRD_SMART' | 'GENERIC_BTHOME';
  rssiDbm: number;
  batteryPct: number;
  lastReading: SensorReading;
}

/**
 * Discovers nearby BLE sensors (RuuviTag, Xiaomi Mijia, Inkbird) broadcasting in proximity.
 */
export function simulateBleScanNearby(mockSensorsCount: number = 2): DiscoveredBleDevice[] {
  const devices: DiscoveredBleDevice[] = [
    {
      deviceId: 'CB:71:04:A2:33:1B',
      name: 'RuuviTag Pro (Piwniczka)',
      sensorType: 'RUUVI_TAG',
      rssiDbm: -62,
      batteryPct: 94,
      lastReading: {
        sensorType: 'RUUVITAG',
        temperatureCelsius: 12.4,
        relativeHumidityPct: 84.8,
        dewPointCelsius: calculateDewPoint(12.4, 84.8),
        pressureHpa: 1013.2,
        batteryMilliVolts: 2980,
        batteryPct: 94,
        sequenceNumber: 4210,
        timestamp: Date.now(),
      },
    },
    {
      deviceId: 'A4:C1:38:9B:FE:02',
      name: 'Xiaomi Mijia 2 (Półka Środkowa)',
      sensorType: 'XIAOMI_MIJIA',
      rssiDbm: -71,
      batteryPct: 88,
      lastReading: {
        sensorType: 'XIAOMI_BTHOME',
        temperatureCelsius: 12.1,
        relativeHumidityPct: 86.2,
        dewPointCelsius: calculateDewPoint(12.1, 86.2),
        batteryPct: 88,
        timestamp: Date.now(),
      },
    },
  ];

  return devices.slice(0, Math.max(1, mockSensorsCount));
}

/**
 * Selects the optimal sensor reading based on signal strength (RSSI) and reading validity.
 */
export function autoSelectBestSensorReading(
  devices: DiscoveredBleDevice[]
): SensorReading | null {
  if (!devices || devices.length === 0) return null;
  // Sort by highest RSSI (strongest signal)
  const sorted = [...devices].sort((a, b) => b.rssiDbm - a.rssiDbm);
  return sorted[0].lastReading;
}

