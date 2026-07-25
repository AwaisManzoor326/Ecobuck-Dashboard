import React, { useState } from "react";
import { ScenarioState } from "../../types";
import { Sliders, Check } from "lucide-react";

interface ScenarioSelectorProps {
  currentScenario: ScenarioState;
  onSelectScenario: (scenario: ScenarioState) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onSelectScenario,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const scenarios: { id: ScenarioState; label: string; desc: string }[] = [
    { id: "live", label: "Live Telemetry", desc: "5-second smooth IoT telemetry stream" },
    { id: "loading", label: "Loading Skeletons", desc: "Simulates initial payload fetch" },
    { id: "empty", label: "Empty Dataset", desc: "No readings collected yet" },
    { id: "offline", label: "Device Offline", desc: "Simulates disconnected hardware snapshot" },
    { id: "api_error", label: "API Failure (503)", desc: "Simulates gateway communication fault" },
    { id: "invalid_data", label: "Invalid Sensor Value", desc: "Simulates glitchy NaN temperature sensor" },
    { id: "high_temp", label: "High Temp Alert (>55°C)", desc: "Triggers thermophilic heat warning" },
    { id: "high_humidity", label: "High Humidity Alert (>75%)", desc: "Triggers wet moisture warning" },
    { id: "full_bin", label: "Bin Full Alert (96%)", desc: "Triggers harvest ready warning" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#E8F8EE] dark:bg-[#1C3826] text-[#299738] dark:text-[#25D366] border border-[#299738]/20 hover:bg-[#299738]/20 transition-colors leading-none"
        title="Test state scenarios (Dev Tools)"
      >
        <Sliders className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline font-medium text-xs leading-none">Scenario:</span>
        <strong className="capitalize text-xs font-bold leading-none max-w-[90px] sm:max-w-none truncate">
          {currentScenario.replace("_", " ")}
        </strong>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Dev Scenario Selector
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Test UI state variations instantly.
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {scenarios.map((sc) => {
                const isSelected = currentScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      onSelectScenario(sc.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between gap-2 transition-colors ${
                      isSelected
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                        : "hover:bg-[var(--surface-soft)] text-[var(--text-primary)]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{sc.label}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{sc.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
