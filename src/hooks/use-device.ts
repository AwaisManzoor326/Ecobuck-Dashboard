import { useState } from "react";
import { Device } from "../types";
import { INITIAL_DEVICES } from "../lib/constants";

export function useDevice() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [activeDeviceId, setActiveDeviceId] = useState<string>(INITIAL_DEVICES[0].id);

  const activeDevice = devices.find((d) => d.id === activeDeviceId) || devices[0];

  const selectDevice = (id: string) => {
    if (devices.some((d) => d.id === id)) {
      setActiveDeviceId(id);
    }
  };

  const updateDeviceSettings = (deviceId: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, ...updates } : d))
    );
  };

  return {
    devices,
    activeDevice,
    activeDeviceId,
    selectDevice,
    updateDeviceSettings,
  };
}
