import React from "react";
import { Thermometer, Info } from "lucide-react";
import { evaluateTemperatureStatus, getStatusBadgeProperties } from "../../lib/threshold-engine";
import { ThresholdConfig } from "../../types";

interface TemperatureCardProps {
  temperature: number;
  thresholds: ThresholdConfig;
  isOnline?: boolean;
  isLoading?: boolean;
}

export const TemperatureCard: React.FC<TemperatureCardProps> = ({
  temperature,
  thresholds,
  isOnline = true,
  isLoading = false,
}) => {
  const isInvalid = Number.isNaN(temperature);
  const status = evaluateTemperatureStatus(temperature, thresholds, isOnline);
  const badgeProps = getStatusBadgeProperties(status);

  // Calculate rotation angle for semi-circle arc gauge (from -90deg to +90deg)
  // Temp scale: 0°C to 70°C
  const minTemp = 0;
  const maxTemp = 70;
  const clampedTemp = Math.min(maxTemp, Math.max(minTemp, isInvalid ? 0 : temperature));
  const ratio = (clampedTemp - minTemp) / (maxTemp - minTemp);
  const strokeDashoffset = 188.5 * (1 - ratio);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-xl flex flex-col justify-between group">
      
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Temperature</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Internal Core Probe</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeProps.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeProps.dotClass}`} />
          {badgeProps.label}
        </span>
      </div>

      {/* Card Content / Arc Gauge */}
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
              {isInvalid ? "ERR" : `${temperature.toFixed(1)}°C`}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Target: <strong className="text-[var(--text-primary)]">{thresholds.temp_normal_min}°C–{thresholds.temp_normal_max}°C</strong>
            </p>
          </div>

          {/* Custom SVG Arc Gauge */}
          <div className="relative w-20 h-16 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 80 50" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 10 45 A 30 30 0 0 1 70 45"
                fill="none"
                stroke="var(--surface-soft)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Active Arc */}
              {!isInvalid && isOnline && (
                <path
                  d="M 10 45 A 30 30 0 0 1 70 45"
                  fill="none"
                  stroke={status === "high" ? "#E5533D" : status === "attention" ? "#D9A441" : "#3FAE6A"}
                  strokeWidth="8"
                  strokeDasharray="188.5"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              )}
            </svg>
          </div>

        </div>
      )}

      {/* Recommended Operating Range / Interpretation Footer */}
      <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
        <span>
          {isInvalid
            ? "Sensor output out of range. Check probe jack connection."
            : status === "normal"
            ? "Healthy thermophilic microbial breakdown activity."
            : status === "high"
            ? "Heat spike detected. Vent top lid gently."
            : "Core heat low. Mix fresh kitchen scraps."}
        </span>
      </div>

    </div>
  );
};
