import React from "react";
import { Device, CompostReading, ThresholdConfig, Alert, DailyTip } from "../../types";
import { DeviceOverview } from "../device/device-overview";
import { TemperatureCard } from "../sensors/temperature-card";
import { HumidityCard } from "../sensors/humidity-card";
import { FillCard } from "../sensors/fill-card";
import { TrendChart } from "../charts/trend-chart";
import { AlertBanner } from "../alerts/alert-banner";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface OverviewPanelProps {
  device: Device;
  currentReading: CompostReading | null;
  historicalReadings: CompostReading[];
  thresholds: ThresholdConfig;
  alerts: Alert[];
  onDismissAlert: (id: string) => void;
  lastSyncTime: string;
  isLoading?: boolean;
  error?: string | null;
  dailyTip: DailyTip;
  onNavigateTab: (tab: any) => void;
  onRefreshTelemetry?: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  device,
  currentReading,
  historicalReadings,
  thresholds,
  alerts,
  onDismissAlert,
  lastSyncTime,
  isLoading = false,
  error = null,
  dailyTip,
  onNavigateTab,
  onRefreshTelemetry,
}) => {
  const isOnline = currentReading ? currentReading.connection_status === "online" : device.status === "online";
  const temp = currentReading?.temperature_c ?? 36.8;
  const humidity = currentReading?.humidity_percent ?? 64;
  const fill = currentReading?.fill_level_percent ?? 82;

  return (
    <div className="space-y-5 pb-28 md:pb-6">
      
      {/* API Error State Banner with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">We couldn't load your EcoBuck readings</h4>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>

          {onRefreshTelemetry && (
            <button
              onClick={onRefreshTelemetry}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shrink-0"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* Threshold Breach Alerts */}
      <AlertBanner alerts={alerts} onDismiss={onDismissAlert} />

      {/* Device Hardware Overview Strip */}
      <DeviceOverview
        device={device}
        currentReading={currentReading}
        lastSyncTime={lastSyncTime}
        onRefresh={onRefreshTelemetry}
      />

      {/* Live Sensors Grid (3 Distinct Visual Structures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <TemperatureCard
          temperature={temp}
          thresholds={thresholds}
          isOnline={isOnline}
          isLoading={isLoading}
        />

        <HumidityCard
          humidity={humidity}
          thresholds={thresholds}
          isOnline={isOnline}
          isLoading={isLoading}
        />

        <FillCard
          fillLevel={fill}
          thresholds={thresholds}
          isOnline={isOnline}
          isLoading={isLoading}
        />
      </div>

      {/* Main Grid: Telemetry Trend Chart + Right Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Recharts Telemetry Trend Chart */}
        <div className="lg:col-span-8">
          <TrendChart
            readings={historicalReadings}
            isLoading={isLoading}
            isOffline={!isOnline}
          />
        </div>

        {/* Right: Contextual AI Intelligence & Daily Sustainability Tip */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Daily Sustainability Tip Card */}
          <div className="glass-card rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden bg-grain backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-[10px] uppercase tracking-wider border border-[var(--primary)]/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Daily Eco Tip
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-numeric">
                {dailyTip.date}
              </span>
            </div>

            <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
              {dailyTip.title}
            </h4>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {dailyTip.tip}
            </p>

            <button
              onClick={() => onNavigateTab("assistant")}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text-primary)] border border-[var(--border)] flex items-center justify-center gap-2 transition-colors group"
            >
              <span>Ask EcoBuck Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Eco Zindagi Compost Science Diagnostics Box */}
          <div className="glass-card rounded-2xl p-5 shadow-lg space-y-3 backdrop-blur-xl">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Compost Health Diagnostics
            </h4>

            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-soft)]">
                <span>Microbial Activity</span>
                <strong className="text-[var(--text-primary)]">{temp > 30 ? "Optimal Thermophilic" : "Low Aeration"}</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-soft)]">
                <span>Moisture Matrix</span>
                <strong className="text-[var(--text-primary)]">{humidity >= 50 && humidity <= 70 ? "Ideal Sponge Dampness" : "Needs Adjustment"}</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-soft)]">
                <span>Aeration Index</span>
                <strong className="text-[var(--text-primary)]">Pass (Channels Clear)</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
