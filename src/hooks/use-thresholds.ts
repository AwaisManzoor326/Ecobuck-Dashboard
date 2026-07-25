import { useState } from "react";
import { ThresholdConfig } from "../types";
import { DEFAULT_THRESHOLDS } from "../lib/constants";
import { getStoredThresholds, setStoredThresholds } from "../lib/storage";

export function useThresholds() {
  const [thresholds, setThresholdsState] = useState<ThresholdConfig>(() => getStoredThresholds());

  const updateThresholds = (newConfig: ThresholdConfig) => {
    // Basic validation
    if (newConfig.temp_normal_min >= newConfig.temp_normal_max) {
      throw new Error("Normal minimum temperature must be less than normal maximum.");
    }
    if (newConfig.temp_normal_max >= newConfig.temp_high) {
      throw new Error("Normal maximum temperature must be less than high alert threshold.");
    }
    if (newConfig.humidity_min >= newConfig.humidity_max) {
      throw new Error("Humidity minimum must be less than humidity maximum.");
    }
    if (newConfig.fill_attention >= newConfig.fill_full) {
      throw new Error("Fill attention threshold must be less than fill full threshold.");
    }

    setThresholdsState(newConfig);
    setStoredThresholds(newConfig);
  };

  const resetThresholds = () => {
    setThresholdsState(DEFAULT_THRESHOLDS);
    setStoredThresholds(DEFAULT_THRESHOLDS);
  };

  return {
    thresholds,
    updateThresholds,
    resetThresholds,
  };
}
