import { ThresholdConfig, User } from "../types";
import { DEFAULT_THRESHOLDS } from "./constants";

const USER_STORAGE_KEY = "ecobuck_user_session";
const THEME_STORAGE_KEY = "ecobuck_theme";
const THRESHOLDS_STORAGE_KEY = "ecobuck_thresholds";
const DAILY_TIP_KEY = "ecobuck_daily_tip";

export function getStoredUser(): User | null {
  try {
    const item = localStorage.getItem(USER_STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // Ignore quota errors in non-standard environments
  }
}

export function getStoredTheme(): "light" | "dark" | "system" {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if (theme === "light" || theme === "dark" || theme === "system") {
      return theme;
    }
  } catch {
    // Fall back to dark/light standard default
  }
  return "light";
}

export function setStoredTheme(theme: "light" | "dark" | "system"): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

export function getStoredThresholds(): ThresholdConfig {
  try {
    const item = localStorage.getItem(THRESHOLDS_STORAGE_KEY);
    return item ? JSON.parse(item) : DEFAULT_THRESHOLDS;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

export function setStoredThresholds(config: ThresholdConfig): void {
  try {
    localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function getStoredDailyTipDate(): string | null {
  try {
    return localStorage.getItem(DAILY_TIP_KEY);
  } catch {
    return null;
  }
}

export function setStoredDailyTipDate(dateStr: string): void {
  try {
    localStorage.setItem(DAILY_TIP_KEY, dateStr);
  } catch {
    // ignore
  }
}
