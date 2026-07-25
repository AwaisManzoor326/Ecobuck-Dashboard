import React, { useState } from "react";
import { User, ActiveTab, ScenarioState } from "../../types";
import { DashboardHeader } from "./dashboard-header";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileNavigation } from "./mobile-navigation";
import { OverviewPanel } from "./overview-panel";
import { HistoryPanel } from "./history-panel";
import { AssistantPanel } from "./assistant-panel";
import { SettingsPanel } from "./settings-panel";
import { AppToast, ToastMessage } from "../ui/app-toast";
import { useDevice } from "../../hooks/use-device";
import { useLiveReadings } from "../../hooks/use-live-readings";
import { useReadingHistory } from "../../hooks/use-reading-history";
import { useThresholds } from "../../hooks/use-thresholds";
import { useAlerts } from "../../hooks/use-alerts";
import { useAssistant } from "../../hooks/use-assistant";

interface DashboardShellProps {
  user: User;
  onUpdateUser: (fields: Partial<User>) => void;
  isAdmin: boolean;
  theme: "light" | "dark" | "system";
  onToggleTheme: (t: "light" | "dark" | "system") => void;
  onLogout: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  onUpdateUser,
  isAdmin,
  theme,
  onToggleTheme,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [currentScenario, setCurrentScenario] = useState<ScenarioState>("live");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Custom Hooks Data Managers
  const { devices, activeDevice, activeDeviceId, selectDevice, updateDeviceSettings } = useDevice();
  const { currentReading, isLoading: isLoadingReading, error: readingError, lastSyncTime, retry: retryReading } = useLiveReadings(activeDeviceId, currentScenario);
  const { readings: historyReadings } = useReadingHistory(activeDeviceId);
  const { thresholds, updateThresholds, resetThresholds } = useThresholds();
  const { visibleAlerts, dismissAlert } = useAlerts(currentReading, thresholds);
  const { dailyTip } = useAssistant(currentReading || undefined);

  const showToast = (title: string, message?: string, type: "success" | "error" | "info" = "info") => {
    setToast({
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    });
  };

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case "overview": return "Live Telemetry Overview";
      case "history": return "Sensor Reading History";
      case "assistant": return "AI Sustainability Assistant";
      case "settings": return "System Settings & Thresholds";
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col eco-mesh-bg text-[var(--text-primary)] overflow-hidden select-none">
      
      {/* Top Header */}
      <DashboardHeader
        user={user}
        devices={devices}
        activeDevice={activeDevice}
        onSelectDevice={selectDevice}
        activeTabTitle={getTabTitle(activeTab)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        currentScenario={currentScenario}
        onSelectScenario={setCurrentScenario}
        unreadAlertsCount={visibleAlerts.length}
      />

      {/* Main Body Area: Sidebar + Active Panel View Container */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        
        {/* Desktop Vertical Slim Sidebar Rail */}
        <DesktopSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Controlled Internal Scrollable Panel View */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-6 lg:p-8">
          {activeTab === "overview" && (
            <OverviewPanel
              device={activeDevice}
              currentReading={currentReading}
              historicalReadings={historyReadings}
              thresholds={thresholds}
              alerts={visibleAlerts}
              onDismissAlert={dismissAlert}
              lastSyncTime={lastSyncTime}
              isLoading={isLoadingReading}
              error={readingError}
              dailyTip={dailyTip}
              onNavigateTab={setActiveTab}
              onRefreshTelemetry={retryReading}
            />
          )}

          {activeTab === "history" && (
            <HistoryPanel deviceId={activeDeviceId} />
          )}

          {activeTab === "assistant" && (
            <AssistantPanel currentReading={currentReading} />
          )}

          {activeTab === "settings" && (
            <SettingsPanel
              user={user}
              isAdmin={isAdmin}
              onUpdateUser={onUpdateUser}
              activeDevice={activeDevice}
              onUpdateDevice={updateDeviceSettings}
              thresholds={thresholds}
              onUpdateThresholds={updateThresholds}
              onResetThresholds={resetThresholds}
              theme={theme}
              onToggleTheme={onToggleTheme}
              onShowToast={showToast}
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Toast Host */}
      <AppToast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
};
