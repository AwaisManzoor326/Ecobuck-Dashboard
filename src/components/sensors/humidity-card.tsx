import React from "react";
import { Droplets, Info } from "lucide-react";
import { evaluateHumidityStatus, getStatusBadgeProperties } from "../../lib/threshold-engine";
import { ThresholdConfig } from "../../types";

interface HumidityCardProps {
  humidity: number;
  thresholds: ThresholdConfig;
  isOnline?: boolean;
  isLoading?: boolean;
}

export const HumidityCard: React.FC<HumidityCardProps> = ({
  humidity,
  thresholds,
  isOnline = true,
  isLoading = false,
}) => {
  const isInvalid = Number.isNaN(humidity);
  const status = evaluateHumidityStatus(humidity, thresholds, isOnline);
  const badgeProps = getStatusBadgeProperties(status);

  const clampedHum = Math.min(100, Math.max(0, isInvalid ? 0 : humidity));

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-xl flex flex-col justify-between group">
      
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Humidity</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Moisture Matrix</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeProps.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeProps.dotClass}`} />
          {badgeProps.label}
        </span>
      </div>

      {/* Card Content / Droplet Gauge */}
      {isLoading ? (
        <div className="my-6 space-y-3">
          <div className="h-16 w-full animate-shimmer rounded-xl" />
          <div className="h-4 w-3/4 animate-shimmer rounded-lg" />
        </div>
      ) : (
        <div className="my-3 flex items-center justify-between gap-4">
          
          {/* Main Numeric Metric */}
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] font-numeric">
              {isInvalid ? "ERR" : `${humidity}%`}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Target Band: <strong className="text-[var(--text-primary)]">{thresholds.humidity_min}%–{thresholds.humidity_max}%</strong>
            </p>
          </div>

          {/* Droplet Vertical Progress Gauge */}
          <div className="relative w-12 h-16 shrink-0 flex flex-col items-center justify-end bg-[var(--surface-soft)] rounded-full p-1 border border-[var(--border)] overflow-hidden">
            <div
              className={`w-full rounded-full transition-all duration-500 ${
                status === "high"
                  ? "bg-rose-500"
                  : status === "attention"
                  ? "bg-amber-500"
                  : "bg-sky-500"
              }`}
              style={{ height: `${clampedHum}%` }}
            />
          </div>

        </div>
      )}

      {/* Recommended Operating Range / Interpretation Footer */}
      <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
        <span>
          {isInvalid
            ? "Sensor fault detected."
            : status === "normal"
            ? "Moisture balance is within the ideal damp-sponge range."
            : humidity > thresholds.humidity_max
            ? "Too wet. Add shredded dry brown cardboard."
            : "Too dry. Sprinkle a light mist or kitchen scraps."}
        </span>
      </div>

    </div>
  );
};
