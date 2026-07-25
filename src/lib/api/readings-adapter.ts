import { CompostReading, ScenarioState } from "../../types";

export interface ReadingsAdapter {
  getCurrentReading(deviceId: string, scenario?: ScenarioState): Promise<CompostReading>;
  getReadingHistory(deviceId: string, days?: number): Promise<CompostReading[]>;
  subscribeToReadings(
    deviceId: string,
    callback: (reading: CompostReading) => void,
    scenario?: ScenarioState
  ): () => void;
}

// Deterministic baseline state for simulation
let baseTemperature = 36.8;
let baseHumidity = 64;
let baseFillLevel = 82;

export function generateHistoricalDataset(deviceId: string, days: number = 7): CompostReading[] {
  const readings: CompostReading[] = [];
  const now = new Date();
  const totalReadings = days * 24; // hourly data

  for (let i = totalReadings - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600 * 1000).toISOString();
    
    // Sine wave variance over 24-hour cycle + noise
    const hour = (totalReadings - i) % 24;
    const tempOffset = Math.sin((hour / 24) * Math.PI * 2) * 4.2;
    const humidityOffset = Math.cos((hour / 24) * Math.PI * 2) * 5.5;
    
    // Fill level slowly increases over time from ~40% to current
    const fillProgress = 40 + ((totalReadings - i) / totalReadings) * 42;

    const isOfflineDevice = deviceId === "EB-ISB-0112" && i < 3;

    readings.push({
      device_id: deviceId,
      timestamp,
      temperature_c: Number((34 + tempOffset + (Math.random() * 1.2 - 0.6)).toFixed(1)),
      humidity_percent: Math.min(95, Math.max(30, Math.round(58 + humidityOffset + (Math.random() * 3 - 1.5)))),
      fill_level_percent: Math.min(99, Math.round(fillProgress)),
      connection_status: isOfflineDevice ? "offline" : "online",
      is_invalid: Math.random() < 0.015, // occasional sensor glitch row for test robustness
    });
  }

  return readings;
}

export class MockReadingsAdapter implements ReadingsAdapter {
  private historyCache: Map<string, CompostReading[]> = new Map();

  async getCurrentReading(deviceId: string, scenario: ScenarioState = "live"): Promise<CompostReading> {
    if (scenario === "api_error") {
      throw new Error("Failed to reach EcoBuck IoT Gateway (HTTP 503 Service Unavailable).");
    }

    if (scenario === "offline" || deviceId === "EB-ISB-0112") {
      return {
        device_id: deviceId,
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        temperature_c: 28.4,
        humidity_percent: 44,
        fill_level_percent: 65,
        connection_status: "offline",
      };
    }

    if (scenario === "high_temp") {
      return {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        temperature_c: 58.2,
        humidity_percent: 54,
        fill_level_percent: 78,
        connection_status: "online",
      };
    }

    if (scenario === "high_humidity") {
      return {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        temperature_c: 35.1,
        humidity_percent: 79,
        fill_level_percent: 82,
        connection_status: "online",
      };
    }

    if (scenario === "full_bin") {
      return {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        temperature_c: 38.6,
        humidity_percent: 62,
        fill_level_percent: 96,
        connection_status: "online",
      };
    }

    if (scenario === "invalid_data") {
      return {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        temperature_c: NaN, // invalid temp
        humidity_percent: 64,
        fill_level_percent: 82,
        connection_status: "online",
        is_invalid: true,
      };
    }

    // Default live calculation
    return {
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      temperature_c: Number(baseTemperature.toFixed(1)),
      humidity_percent: baseHumidity,
      fill_level_percent: baseFillLevel,
      connection_status: "online",
    };
  }

  async getReadingHistory(deviceId: string, days: number = 7): Promise<CompostReading[]> {
    await new Promise((res) => setTimeout(res, 200));
    if (!this.historyCache.has(deviceId)) {
      this.historyCache.set(deviceId, generateHistoricalDataset(deviceId, days));
    }
    return this.historyCache.get(deviceId) || [];
  }

  subscribeToReadings(
    deviceId: string,
    callback: (reading: CompostReading) => void,
    scenario: ScenarioState = "live"
  ): () => void {
    if (scenario !== "live") {
      // In specific non-live static scenarios, emit once and stop
      this.getCurrentReading(deviceId, scenario)
        .then(callback)
        .catch(() => {});
      return () => {};
    }

    const intervalId = setInterval(() => {
      // Smooth continuous fluctuation simulating real IoT telemetry
      baseTemperature += (Math.random() - 0.48) * 0.2;
      baseTemperature = Math.max(30, Math.min(48, baseTemperature));

      baseHumidity += Math.round((Math.random() - 0.5) * 1.2);
      baseHumidity = Math.max(48, Math.min(76, baseHumidity));

      // Fill level stays steady or creeps up slightly
      if (Math.random() > 0.85 && baseFillLevel < 98) {
        baseFillLevel += 1;
      }

      const reading: CompostReading = {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        temperature_c: Number(baseTemperature.toFixed(1)),
        humidity_percent: baseHumidity,
        fill_level_percent: baseFillLevel,
        connection_status: deviceId === "EB-ISB-0112" ? "offline" : "online",
      };

      callback(reading);
    }, 5000); // simulate 5s interval

    return () => clearInterval(intervalId);
  }
}

export const readingsAdapter = new MockReadingsAdapter();
