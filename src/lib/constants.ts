import { Device, ThresholdConfig, User, DailyTip } from "../types";

export const BRAND_TAGLINE = "Segregate today. Compost tomorrow. Zero waste every day.";
export const BRAND_COMPANY = "Eco Zindagi Pvt Ltd";
export const PRODUCT_NAME = "EcoBuck";

export const MOCK_USERS: User[] = [
  {
    id: "user-01",
    name: "Ayesha Khan",
    email: "ayesha@ecobuck.demo",
    role: "standard",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    notification_email: true,
    created_at: "2025-11-12T10:00:00Z",
  },
  {
    id: "user-02",
    name: "Eco Zindagi Admin",
    email: "admin@ecobuck.demo",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    notification_email: true,
    created_at: "2025-01-01T08:00:00Z",
  },
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: "EB-RWP-0248",
    name: "EcoBuck Kitchen",
    location: "Main Kitchen",
    status: "online",
    firmware_version: "1.8.4",
    sensor_health: {
      temp_ok: true,
      humidity_ok: true,
      fill_ok: true,
      overall_status: "healthy",
    },
    cycle_status: "Active composting",
    last_sync: new Date().toISOString(),
    ip_address: "192.168.1.104",
    wifi_ssid: "EcoZindagi_Mesh_5G",
  },
  {
    id: "EB-ISB-0112",
    name: "EcoBuck Terrace",
    location: "Rooftop Garden",
    status: "offline",
    firmware_version: "1.7.9",
    sensor_health: {
      temp_ok: true,
      humidity_ok: false,
      fill_ok: true,
      overall_status: "degraded",
    },
    cycle_status: "Curing phase",
    last_sync: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    ip_address: "192.168.1.112",
    wifi_ssid: "EcoZindagi_Terrace_Ext",
  },
];

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  temp_normal_min: 25,
  temp_normal_max: 45,
  temp_high: 55,
  humidity_min: 50,
  humidity_max: 70,
  fill_attention: 80,
  fill_full: 95,
};

export const DAILY_TIPS: DailyTip[] = [
  {
    id: "tip-01",
    date: "2026-07-23",
    title: "Moisture Balance Tip",
    tip: "Your moisture level is balanced today. Add a small layer of dry browns (shredded cardboard, dry leaves) after food scraps to preserve airflow and reduce odor.",
    category: "moisture",
  },
  {
    id: "tip-02",
    date: "2026-07-24",
    title: "Microbial Temperature Care",
    tip: "Temperatures between 35°C and 45°C indicate thermophilic bacteria are efficiently breaking down food waste. Avoid adding large quantities of cold citrus or acidic items at once.",
    category: "temperature",
  },
  {
    id: "tip-03",
    date: "2026-07-25",
    title: "Aeration Routine",
    tip: "Gentle agitation every 3-4 days redistributes oxygen to anaerobic pockets. EcoBuck's internal aeration chamber works best when compost density is balanced with dry fiber.",
    category: "aeration",
  },
  {
    id: "tip-04",
    date: "2026-07-26",
    title: "Harvest Readiness",
    tip: "When fill level reaches 90% and dark crumbly compost forms at the bottom chamber, allow 48 hours curing before applying directly to garden soil.",
    category: "harvesting",
  },
];
