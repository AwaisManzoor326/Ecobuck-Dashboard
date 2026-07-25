import React from "react";
import { Device, CompostReading } from "../../types";
import { DeviceIllustration } from "./device-illustration";
import { formatRelativeTime } from "../../lib/date-utils";
import { Cpu, Wifi, WifiOff, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface DeviceOverviewProps {
  device: Device;
  currentReading: CompostReading | null;
  lastSyncTime: string;
  isSyncing?: boolean;
  onRefresh?: () => void;
}

export const DeviceOverview: React.FC<DeviceOverviewProps> = ({
  device,
  currentReading,
  lastSyncTime,
  isSyncing = false,
  onRefresh,
}) => {
  const isOnline = currentReading ? currentReading.connection_status === "online" : device.status === "online";
  const temp = currentReading?.temperature_c ?? 36.8;
  const humidity = currentReading?.humidity_percent ?? 64;
  const fill = currentReading?.fill_level_percent ?? 82;

  const sensorHealthOk = device.sensor_health.temp_ok && device.sensor_health.humidity_ok && device.sensor_health.fill_ok;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-xl bg-grain">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Device Hardware Render & Primary Metadata */}
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          <div className="shrink-0">
            <DeviceIllustration
              status={isOnline ? "online" : "offline"}
              fillPercent={fill}
              temp={temp}
              humidity={humidity}
              className="w-20 h-28 sm:w-24 sm:h-32"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-bold tracking-wide rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                {device.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-slate-400" />
                    <span>Disconnected</span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1.5 truncate">
              {device.name}
            </h2>

            <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Location: <strong>{device.location}</strong></span>
              <span className="text-[var(--border)]">•</span>
              <span>Cycle: <strong className="text-[var(--primary)]">{device.cycle_status}</strong></span>
            </p>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[var(--primary)]" />
                FW v{device.firmware_version}
              </span>

              <span className="flex items-center gap-1">
                {sensorHealthOk ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>3 of 3 Sensors Healthy</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sync Status & Refresh Trigger */}
        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
          <div className="text-left md:text-right">
            <div className="text-xs text-[var(--text-secondary)]">Last Synchronization</div>
            <div className="text-sm font-semibold text-[var(--text-primary)] font-numeric">
              {formatRelativeTime(lastSyncTime)}
            </div>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface-soft)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--primary)] ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Telemetry"}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
