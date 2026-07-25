import { useEffect, useState, useMemo } from "react";
import { CompostReading } from "../types";
import { readingsAdapter } from "../lib/api/readings-adapter";

export type DateFilterPeriod = "today" | "7days" | "30days" | "all";

export function useReadingHistory(deviceId: string) {
  const [readings, setReadings] = useState<CompostReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<DateFilterPeriod>("7days");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await readingsAdapter.getReadingHistory(deviceId, 30);
      setReadings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load reading history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [deviceId]);

  const filteredReadings = useMemo(() => {
    const now = new Date();
    let result = [...readings];

    if (filterPeriod === "today") {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      result = result.filter((r) => new Date(r.timestamp).getTime() >= startOfToday);
    } else if (filterPeriod === "7days") {
      const sevenDaysAgo = now.getTime() - 7 * 24 * 3600 * 1000;
      result = result.filter((r) => new Date(r.timestamp).getTime() >= sevenDaysAgo);
    } else if (filterPeriod === "30days") {
      const thirtyDaysAgo = now.getTime() - 30 * 24 * 3600 * 1000;
      result = result.filter((r) => new Date(r.timestamp).getTime() >= thirtyDaysAgo);
    }

    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [readings, filterPeriod, sortOrder]);

  const totalPages = Math.ceil(filteredReadings.length / pageSize) || 1;
  const paginatedReadings = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredReadings.slice(startIdx, startIdx + pageSize);
  }, [filteredReadings, currentPage, pageSize]);

  const resetFilters = () => {
    setFilterPeriod("7days");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  return {
    readings: paginatedReadings,
    totalCount: filteredReadings.length,
    isLoading,
    error,
    filterPeriod,
    setFilterPeriod: (period: DateFilterPeriod) => {
      setFilterPeriod(period);
      setCurrentPage(1);
    },
    sortOrder,
    setSortOrder: (order: "newest" | "oldest") => {
      setSortOrder(order);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
    refetch: fetchHistory,
  };
}
