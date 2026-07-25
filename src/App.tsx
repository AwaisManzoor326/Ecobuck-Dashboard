import React from "react";
import { useAuth } from "./hooks/use-auth";
import { useTheme } from "./hooks/use-theme";
import { LoginPanel } from "./components/auth/login-panel";
import { DashboardShell } from "./components/dashboard/dashboard-shell";

export default function App() {
  const { user, isAuthenticated, isAdmin, isLoading, login, logout, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[var(--background)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
          <div className="text-xs font-semibold tracking-wide text-[var(--text-secondary)]">
            Connecting to EcoBuck IoT Gateway...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <LoginPanel
        onLogin={login}
        theme={theme}
        onToggleTheme={setTheme}
      />
    );
  }

  return (
    <DashboardShell
      user={user}
      onUpdateUser={updateUserProfile}
      isAdmin={isAdmin}
      theme={theme}
      onToggleTheme={setTheme}
      onLogout={logout}
    />
  );
}
