import React from "react";
import { Layers, Info } from "lucide-react";
import { evaluateFillStatus, getStatusBadgeProperties } from "../../lib/threshold-engine";
import { ThresholdConfig } from "../../types";

interface FillCardProps {
  fillLevel: number;
  thresholds: ThresholdConfig;
  isOnline?: boolean;
  isLoading?: boolean;
}

export const FillCard: React.FC<FillCardProps> = ({
  fillLevel,
  thresholds,
  isOnline = true,
  isLoading = false,
}) => {
  const isInvalid = Number.isNaN(fillLevel);
  const status = evaluateFillStatus(fillLevel, thresholds, isOnline);
  const badgeProps = getStatusBadgeProperties(status);

  const clampedFill = Math.min(100, Math.max(0, isInvalid ? 0 : fillLevel));

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-xl flex flex-col justify-between group">
      
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Bin Fill Level</h3>
            <p className="text-[11px] text-[var(--text-secondary)]">Volume Capacity</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeProps.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeProps.dotClass}`} />
          {badgeProps.label}
        </span>
      </div>

      {/* Card Content / Bin Cross-Section */}
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
              {isInvalid ? "ERR" : `${fillLevel}%`}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Harvest Point: <strong className="text-[var(--text-primary)]">&ge;{thresholds.fill_full}%</strong>
            </p>
          </div>

          {/* Mini Bin Fill Visualizer */}
          <div className="relative w-14 h-16 shrink-0 border-2 border-[var(--border)] rounded-xl bg-[var(--surface-soft)] p-1 overflow-hidden flex flex-col justify-end">
            <div
              className={`w-full rounded-lg transition-all duration-500 relative overflow-hidden ${
                status === "high"
                  ? "bg-rose-500"
                  : status === "attention"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ height: `${clampedFill}%` }}
            >
              {/* Organic texture lines inside fill level */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
            </div>
          </div>

        </div>
      )}

      {/* Recommended Operating Range / Interpretation Footer */}
      <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
        <span>
          {isInvalid
            ? "Fill ultrasonic sensor error."
            : status === "high"
            ? "EcoBuck is ready to be emptied. Harvest bottom tray."
            : status === "attention"
            ? "Plan to empty EcoBuck compost chamber soon."
            : "Chamber capacity available for daily food scraps."}
        </span>
      </div>

    </div>
  );
};
