import { useState, useEffect } from "react";
import { Alert, CompostReading, ThresholdConfig } from "../types";
import { generateAlertsFromReading } from "../lib/threshold-engine";

export function useAlerts(reading: CompostReading | null, thresholds: ThresholdConfig) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!reading) {
      setAlerts([]);
      return;
    }

    const generated = generateAlertsFromReading(reading, thresholds);
    const activeAlerts = generated.map((alt) => ({
      ...alt,
      dismissed: dismissedIds.has(alt.id),
    }));

    setAlerts(activeAlerts);
  }, [reading, thresholds, dismissedIds]);

  const dismissAlert = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const clearDismissed = () => {
    setDismissedIds(new Set());
  };

  const visibleAlerts = alerts.filter((a) => !a.dismissed);

  return {
    alerts,
    visibleAlerts,
    dismissAlert,
    clearDismissed,
  };
}
