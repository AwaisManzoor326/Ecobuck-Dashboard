export type MetricStatus = "normal" | "attention" | "high" | "offline" | "invalid";

export type CompostReading = {
  device_id: string;
  timestamp: string;
  temperature_c: number;
  humidity_percent: number;
  fill_level_percent: number;
  connection_status: "online" | "offline";
  is_invalid?: boolean;
};

export type UserRole = "standard" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  notification_email: boolean;
  created_at: string;
};

export type SensorHealth = {
  temp_ok: boolean;
  humidity_ok: boolean;
  fill_ok: boolean;
  overall_status: "healthy" | "degraded" | "failing";
};

export type Device = {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  firmware_version: string;
  sensor_health: SensorHealth;
  cycle_status: string;
  last_sync: string;
  ip_address?: string;
  wifi_ssid?: string;
};

export type ThresholdConfig = {
  temp_normal_min: number;
  temp_normal_max: number;
  temp_high: number;
  humidity_min: number;
  humidity_max: number;
  fill_attention: number;
  fill_full: number;
};

export type AlertSeverity = "info" | "attention" | "critical";

export type Alert = {
  id: string;
  device_id: string;
  type: "fill" | "temp" | "humidity" | "offline";
  severity: AlertSeverity;
  title: string;
  message: string;
  recommended_action: string;
  timestamp: string;
  dismissed: boolean;
};

export type AssistantMessage = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isTyping?: boolean;
};

export type DailyTip = {
  id: string;
  date: string;
  title: string;
  tip: string;
  category: "moisture" | "temperature" | "aeration" | "harvesting";
};

export type ScenarioState =
  | "live"
  | "loading"
  | "empty"
  | "offline"
  | "api_error"
  | "invalid_data"
  | "high_temp"
  | "high_humidity"
  | "full_bin";

export type ActiveTab = "overview" | "history" | "assistant" | "settings";

export type SettingsGroup = "profile" | "device" | "connection" | "thresholds" | "appearance";

export type SupportMessage = {
  id: string;
  sender: "user" | "bot" | "agent";
  text: string;
  timestamp: string;
};
