import React from "react";
import { useReadingHistory, DateFilterPeriod } from "../../hooks/use-reading-history";
import { formatDateTime, formatShortTime } from "../../lib/date-utils";
import { AppButton } from "../ui/app-button";
import {
  History,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react";

interface HistoryPanelProps {
  deviceId: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ deviceId }) => {
  const {
    readings,
    totalCount,
    isLoading,
    error,
    filterPeriod,
    setFilterPeriod,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
    refetch,
  } = useReadingHistory(deviceId);

  // CSV Export helper
  const exportToCSV = () => {
    if (!readings || readings.length === 0) return;
    const headers = ["Timestamp,Device ID,Temp (°C),Humidity (%),Fill Level (%),Connection,Invalid Flag\n"];
    const rows = readings.map(
      (r) => `${r.timestamp},${r.device_id},${r.temperature_c},${r.humidity_percent},${r.fill_level_percent},${r.connection_status},${r.is_invalid ? "true" : "false"}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecobuck_${deviceId}_history.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 pb-28 md:pb-6">
      
      {/* Top Header & Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <History className="w-5 h-5 text-[var(--primary)]" />
              Sensor Reading History
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Comprehensive IoT telemetry log archive for <strong>{deviceId}</strong> ({totalCount} entries loaded).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <AppButton variant="outline" size="sm" onClick={exportToCSV}>
              <FileSpreadsheet className="w-4 h-4 text-[#299738]" />
              <span>Export CSV</span>
            </AppButton>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          
          {/* Quick Date Range Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[var(--text-secondary)] font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <button
              onClick={() => setFilterPeriod("today")}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                filterPeriod === "today"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              Today
            </button>

            <button
              onClick={() => setFilterPeriod("7days")}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                filterPeriod === "7days"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              7 Days
            </button>

            <button
              onClick={() => setFilterPeriod("30days")}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                filterPeriod === "30days"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              30 Days
            </button>

            {filterPeriod !== "7days" && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs text-rose-500 hover:underline font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <button
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>

        </div>
      </div>

      {/* Main Table / Cards View */}
      {error ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">Telemetry Log Fetch Failure</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">{error}</p>
          <AppButton variant="primary" size="md" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading History</span>
          </AppButton>
        </div>
      ) : isLoading ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-full animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : readings.length === 0 ? (
        <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl p-10 text-center space-y-3">
          <Calendar className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No Readings Match Filter</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
            Try expanding your date range filter or resetting query controls.
          </p>
          <AppButton variant="outline" size="sm" onClick={resetFilters}>
            Reset Filters
          </AppButton>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-soft)] border-b border-[var(--border)] text-[var(--text-secondary)] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Device ID</th>
                  <th className="py-3 px-4">Core Temp (°C)</th>
                  <th className="py-3 px-4">Humidity (%)</th>
                  <th className="py-3 px-4">Fill Level (%)</th>
                  <th className="py-3 px-4">Connection</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {readings.map((row, idx) => {
                  const isInvalid = row.is_invalid || Number.isNaN(row.temperature_c);
                  const isOffline = row.connection_status === "offline";

                  return (
                    <tr
                      key={`row-${idx}-${row.timestamp}`}
                      className={`hover:bg-[var(--surface-soft)]/60 transition-colors ${
                        isInvalid ? "bg-purple-500/5 dark:bg-purple-500/10" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-numeric font-medium text-[var(--text-primary)]">
                        {formatDateTime(row.timestamp)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[var(--primary)] font-numeric">
                        {row.device_id}
                      </td>
                      <td className="py-3 px-4 font-numeric font-bold">
                        {isInvalid ? (
                          <span className="text-purple-600 dark:text-purple-400">INVALID</span>
                        ) : (
                          `${row.temperature_c.toFixed(1)}°C`
                        )}
                      </td>
                      <td className="py-3 px-4 font-numeric font-bold">
                        {row.humidity_percent}%
                      </td>
                      <td className="py-3 px-4 font-numeric font-bold">
                        {row.fill_level_percent}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-medium">
                          {!isOffline ? (
                            <>
                              <Wifi className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Online</span>
                            </>
                          ) : (
                            <>
                              <WifiOff className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-500">Offline</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isInvalid ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            Glitch Flag
                          </span>
                        ) : row.fill_level_percent >= 95 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600">
                            Full
                          </span>
                        ) : row.fill_level_percent >= 80 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600">
                            Attention
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {readings.map((row, idx) => (
              <div key={`mob-${idx}-${row.timestamp}`} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--text-primary)] font-numeric">{formatDateTime(row.timestamp)}</span>
                  <span className="text-[var(--primary)]">{row.device_id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-[var(--surface-soft)] p-2 rounded-xl text-center">
                    <div className="text-[10px] text-[var(--text-secondary)]">Temp</div>
                    <div className="font-bold font-numeric">{row.temperature_c.toFixed(1)}°C</div>
                  </div>
                  <div className="bg-[var(--surface-soft)] p-2 rounded-xl text-center">
                    <div className="text-[10px] text-[var(--text-secondary)]">Humidity</div>
                    <div className="font-bold font-numeric">{row.humidity_percent}%</div>
                  </div>
                  <div className="bg-[var(--surface-soft)] p-2 rounded-xl text-center">
                    <div className="text-[10px] text-[var(--text-secondary)]">Fill</div>
                    <div className="font-bold font-numeric">{row.fill_level_percent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-soft)] flex items-center justify-between gap-3 text-xs">
            <span className="text-[var(--text-secondary)]">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
