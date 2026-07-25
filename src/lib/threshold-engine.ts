import { CompostReading, MetricStatus, ThresholdConfig, Alert } from "../types";

export function evaluateTemperatureStatus(
  temp: number,
  config: ThresholdConfig,
  isOnline: boolean = true
): MetricStatus {
  if (!isOnline) return "offline";
  if (temp < -10 || temp > 100 || Number.isNaN(temp)) return "invalid";
  if (temp > config.temp_high) return "high";
  if (temp < config.temp_normal_min || temp > config.temp_normal_max) return "attention";
  return "normal";
}

export function evaluateHumidityStatus(
  humidity: number,
  config: ThresholdConfig,
  isOnline: boolean = true
): MetricStatus {
  if (!isOnline) return "offline";
  if (humidity < 0 || humidity > 100 || Number.isNaN(humidity)) return "invalid";
  if (humidity < 40 || humidity > config.humidity_max + 10) return "high";
  if (humidity < config.humidity_min || humidity > config.humidity_max) return "attention";
  return "normal";
}

export function evaluateFillStatus(
  fill: number,
  config: ThresholdConfig,
  isOnline: boolean = true
): MetricStatus {
  if (!isOnline) return "offline";
  if (fill < 0 || fill > 100 || Number.isNaN(fill)) return "invalid";
  if (fill >= config.fill_full) return "high";
  if (fill >= config.fill_attention) return "attention";
  return "normal";
}

export function getStatusBadgeProperties(status: MetricStatus) {
  switch (status) {
    case "normal":
      return {
        label: "Normal",
        bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dotClass: "bg-emerald-500",
      };
    case "attention":
      return {
        label: "Attention",
        bgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        dotClass: "bg-amber-500",
      };
    case "high":
      return {
        label: "High Alert",
        bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        dotClass: "bg-rose-500",
      };
    case "offline":
      return {
        label: "Offline",
        bgClass: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
        dotClass: "bg-slate-400",
      };
    case "invalid":
      return {
        label: "Invalid Sensor",
        bgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        dotClass: "bg-purple-500",
      };
  }
}

export function generateAlertsFromReading(
  reading: CompostReading,
  config: ThresholdConfig
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date().toISOString();

  if (reading.connection_status === "offline") {
    alerts.push({
      id: `alert-offline-${reading.device_id}`,
      device_id: reading.device_id,
      type: "offline",
      severity: "attention",
      title: "EcoBuck is offline",
      message: "Showing last known sensor snapshot. Check power supply and local Wi-Fi mesh.",
      recommended_action: "Ensure EcoBuck is powered on and near your router.",
      timestamp: reading.timestamp || now,
      dismissed: false,
    });
    return alerts;
  }

  const fillStatus = evaluateFillStatus(reading.fill_level_percent, config);
  if (fillStatus === "high") {
    alerts.push({
      id: `alert-fill-full-${reading.device_id}`,
      device_id: reading.device_id,
      type: "fill",
      severity: "critical",
      title: "EcoBuck is ready to be emptied",
      message: `The fill level has reached ${reading.fill_level_percent}%. Empty the chamber to maintain airflow.`,
      recommended_action: "Remove organic compost from lower harvest tray to preserve aerobic mixing.",
      timestamp: reading.timestamp || now,
      dismissed: false,
    });
  } else if (fillStatus === "attention") {
    alerts.push({
      id: `alert-fill-att-${reading.device_id}`,
      device_id: reading.device_id,
      type: "fill",
      severity: "attention",
      title: `EcoBuck is ${reading.fill_level_percent}% full`,
      message: "Plan to empty the compost chamber within the next 24-48 hours.",
      recommended_action: "Prepare compost storage bag or garden bed for harvesting.",
      timestamp: reading.timestamp || now,
      dismissed: false,
    });
  }

  const humidityStatus = evaluateHumidityStatus(reading.humidity_percent, config);
  if (humidityStatus === "high" || humidityStatus === "attention") {
    const isHigh = reading.humidity_percent > config.humidity_max;
    alerts.push({
      id: `alert-humidity-${reading.device_id}`,
      device_id: reading.device_id,
      type: "humidity",
      severity: isHigh ? "critical" : "attention",
      title: isHigh ? "Moisture is above the ideal range" : "Moisture needs slight adjustment",
      message: `Current humidity is ${reading.humidity_percent}%. Target operating band is ${config.humidity_min}%–${config.humidity_max}%.`,
      recommended_action: isHigh
        ? "Add dry brown material such as shredded cardboard, dry leaves, or sawdust."
        : "Add a light handful of shredded dry paper with next batch.",
      timestamp: reading.timestamp || now,
      dismissed: false,
    });
  }

  const tempStatus = evaluateTemperatureStatus(reading.temperature_c, config);
  if (tempStatus === "high" || tempStatus === "attention") {
    const isCritical = reading.temperature_c > config.temp_high;
    alerts.push({
      id: `alert-temp-${reading.device_id}`,
      device_id: reading.device_id,
      type: "temp",
      severity: isCritical ? "critical" : "attention",
      title: isCritical ? "High temperature alert" : "Temperature needs attention",
      message: `Current core temp is ${reading.temperature_c.toFixed(1)}°C. Recommended normal range is ${config.temp_normal_min}°C–${config.temp_normal_max}°C.`,
      recommended_action: isCritical
        ? "Mix the compost gently to vent heat and check that top airflow vents are unobstructed."
        : "Gently stir food scraps to balance aerobic activity.",
      timestamp: reading.timestamp || now,
      dismissed: false,
    });
  }

  return alerts;
}
