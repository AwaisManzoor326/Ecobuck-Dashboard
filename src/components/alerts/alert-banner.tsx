import React from "react";
import { Alert } from "../../types";
import { AlertTriangle, X, CheckCircle2, ChevronRight } from "lucide-react";

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.severity === "critical";

        return (
          <div
            key={alert.id}
            className={`p-4 sm:p-5 rounded-2xl border shadow-lg flex items-start justify-between gap-3 sm:gap-4 transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
              isCritical
                ? "bg-rose-50 dark:bg-[#240A10] border-rose-300 dark:border-rose-500/70 text-rose-950 dark:text-rose-100"
                : "bg-amber-50 dark:bg-[#22180A] border-amber-300 dark:border-amber-500/70 text-amber-950 dark:text-amber-100"
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isCritical
                    ? "bg-rose-200/80 dark:bg-rose-500/30 text-rose-800 dark:text-rose-200"
                    : "bg-amber-200/80 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200"
                }`}
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`text-sm sm:text-base font-extrabold tracking-tight ${
                      isCritical
                        ? "text-rose-950 dark:text-rose-100"
                        : "text-amber-950 dark:text-amber-100"
                    }`}
                  >
                    {alert.title}
                  </h4>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isCritical
                        ? "bg-rose-200 dark:bg-rose-500/30 text-rose-950 dark:text-rose-100 border-rose-300 dark:border-rose-400/50"
                        : "bg-amber-200 dark:bg-amber-500/30 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-400/50"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-sm mt-1.5 leading-relaxed font-medium ${
                    isCritical
                      ? "text-rose-900 dark:text-rose-200"
                      : "text-amber-950 dark:text-amber-200"
                  }`}
                >
                  {alert.message}
                </p>

                <div
                  className={`mt-3 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    isCritical
                      ? "bg-rose-100/90 dark:bg-rose-950/70 border-rose-300/80 dark:border-rose-500/50 text-rose-950 dark:text-rose-100"
                      : "bg-amber-100/90 dark:bg-amber-950/70 border-amber-300/80 dark:border-amber-500/50 text-amber-950 dark:text-amber-100"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 shrink-0 text-[#299738] dark:text-[#25D366]" />
                  <span>
                    <strong className="font-bold">Action required:</strong> {alert.recommended_action}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/15 transition-colors shrink-0"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
