import { useEffect, useState, useCallback } from "react";
import { CompostReading, ScenarioState } from "../types";
import { readingsAdapter } from "../lib/api/readings-adapter";

export function useLiveReadings(deviceId: string, scenario: ScenarioState = "live") {
  const [currentReading, setCurrentReading] = useState<CompostReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const fetchCurrentReading = useCallback(async () => {
    if (scenario === "loading") {
      setIsLoading(true);
      return;
    }
    if (scenario === "empty") {
      setIsLoading(false);
      setCurrentReading(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reading = await readingsAdapter.getCurrentReading(deviceId, scenario);
      setCurrentReading(reading);
      setLastSyncTime(reading.timestamp);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load EcoBuck readings.");
      setCurrentReading(null);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, scenario]);

  useEffect(() => {
    fetchCurrentReading();

    if (scenario !== "live") {
      return;
    }

    // Subscribe to simulated real-time updates
    const unsubscribe = readingsAdapter.subscribeToReadings(
      deviceId,
      (newReading) => {
        setCurrentReading(newReading);
        setLastSyncTime(newReading.timestamp);
        setError(null);
        setIsLoading(false);
      },
      scenario
    );

    return () => {
      unsubscribe();
    };
  }, [deviceId, scenario, fetchCurrentReading]);

  return {
    currentReading,
    isLoading,
    error,
    lastSyncTime,
    retry: fetchCurrentReading,
  };
}
