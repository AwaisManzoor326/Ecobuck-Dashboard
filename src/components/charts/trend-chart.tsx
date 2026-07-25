import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CompostReading } from "../../types";
import { formatShortTime, formatShortDate } from "../../lib/date-utils";
import { Calendar, Eye, EyeOff } from "lucide-react";

interface TrendChartProps {
  readings: CompostReading[];
  isLoading?: boolean;
  isOffline?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  readings = [],
  isLoading = false,
  isOffline = false,
}) => {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [showTemp, setShowTemp] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [showFill, setShowFill] = useState(true);

  // Transform raw historical readings into daily (24h) or weekly (7d) aggregated points
  const chartData = useMemo(() => {
    if (!readings || readings.length === 0) return [];

    if (period === "daily") {
      // Return last 24 items
      const slice = readings.slice(-24);
      return slice.map((r) => ({
        label: formatShortTime(r.timestamp),
        rawTime: r.timestamp,
        temp: r.temperature_c,
        humidity: r.humidity_percent,
        fill: r.fill_level_percent,
      }));
    } else {
      // Group by date for 7 days average
      const groups: { [key: string]: { temps: number[]; hums: number[]; fills: number[] } } = {};

      readings.forEach((r) => {
        const dateKey = formatShortDate(r.timestamp);
        if (!groups[dateKey]) {
          groups[dateKey] = { temps: [], hums: [], fills: [] };
        }
        if (!r.is_invalid) {
          groups[dateKey].temps.push(r.temperature_c);
          groups[dateKey].hums.push(r.humidity_percent);
          groups[dateKey].fills.push(r.fill_level_percent);
        }
      });

      const dates = Object.keys(groups).slice(-7);
      return dates.map((d) => {
        const g = groups[d];
        const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
        return {
          label: d,
          temp: Number(avg(g.temps).toFixed(1)),
          humidity: Math.round(avg(g.hums)),
          fill: Math.round(avg(g.fills)),
        };
      });
    }
  }, [readings, period]);

  // Custom accessible Tooltip renderer
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-30">
        <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-1">
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-bold text-[var(--text-primary)] font-numeric">
              {entry.value}
              {entry.name === "Temperature" ? "°C" : "%"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 backdrop-blur-xl">
      
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--primary)]" />
            Telemetry Trends & Composting Metrics
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {period === "daily" ? "Last 24 hours (Hourly snapshots)" : "Last 7 days (Daily averages)"}
            {isOffline && " • Showing cached historical snapshot"}
          </p>
        </div>

        {/* Period Selector & Metric Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Toggle */}
          <div className="inline-flex p-0.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-medium">
            <button
              onClick={() => setPeriod("daily")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                period === "daily"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                period === "weekly"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              7 Days
            </button>
          </div>

          {/* Metric Toggle Chips */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTemp(!showTemp)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                showTemp
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] opacity-60"
              }`}
            >
              {showTemp ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Temp (°C)</span>
            </button>

            <button
              onClick={() => setShowHumidity(!showHumidity)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                showHumidity
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] opacity-60"
              }`}
            >
              {showHumidity ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Humidity (%)</span>
            </button>

            <button
              onClick={() => setShowFill(!showFill)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                showFill
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] opacity-60"
              }`}
            >
              {showFill ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Fill (%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Body */}
      {isLoading ? (
        <div className="h-64 w-full animate-shimmer rounded-2xl" />
      ) : chartData.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-2xl text-center p-6 space-y-2">
          <Calendar className="w-8 h-8 text-[var(--text-secondary)] opacity-50" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">No Telemetry Recorded</h4>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm">
            Once EcoBuck syncs readings over Wi-Fi, historical trends will populate automatically.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D9A441" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D9A441" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3FAE6A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3FAE6A" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />

              {showTemp && (
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#D9A441"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tempGrad)"
                />
              )}

              {showHumidity && (
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#humGrad)"
                />
              )}

              {showFill && (
                <Area
                  type="monotone"
                  dataKey="fill"
                  name="Fill Level"
                  stroke="#3FAE6A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fillGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};
