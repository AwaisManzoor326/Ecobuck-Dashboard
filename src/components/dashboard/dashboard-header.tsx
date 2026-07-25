import React, { useState } from "react";
import { User, Device, ScenarioState } from "../../types";
import { ScenarioSelector } from "../dev/scenario-selector";
import { BRAND_COMPANY, PRODUCT_NAME } from "../../lib/constants";
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DashboardHeaderProps {
  user: User;
  devices: Device[];
  activeDevice: Device;
  onSelectDevice: (id: string) => void;
  activeTabTitle: string;
  theme: "light" | "dark" | "system";
  onToggleTheme: (theme: "light" | "dark" | "system") => void;
  onLogout: () => void;
  currentScenario: ScenarioState;
  onSelectScenario: (sc: ScenarioState) => void;
  unreadAlertsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  devices,
  activeDevice,
  onSelectDevice,
  activeTabTitle,
  theme,
  onToggleTheme,
  onLogout,
  currentScenario,
  onSelectScenario,
  unreadAlertsCount = 0,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const isAdmin = user.role === "admin";

  return (
    <header className="h-16 glass-header px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
      
      {/* Left: Section Title & Device Switcher */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        
        {/* Eco Zindagi Brand Badge */}
        <a
          href="https://www.ecozindagi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2.5 pr-3.5 border-r border-[var(--border)] group hover:opacity-90 transition-opacity"
          title="Visit Eco Zindagi Official Website (ecozindagi.com)"
        >
          <div className="w-8 h-8 rounded-xl bg-[#299738] text-white font-black flex items-center justify-center text-xs shadow-md shadow-[#299738]/20 group-hover:scale-105 transition-transform">
            EZ
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="text-xs font-extrabold text-[#1A3B24] dark:text-[#F0F7F2] leading-tight tracking-tight">
                {PRODUCT_NAME}
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#E8F8EE] dark:bg-[#1C3826] text-[#299738] dark:text-[#25D366] font-bold uppercase tracking-wide">
                Eco Zindagi
              </span>
            </div>
            <p className="text-[10px] text-[#556B5C] dark:text-[#A3B8A8] truncate font-medium">
              ecozindagi.com
            </p>
          </div>
        </a>

        {/* Device Switcher Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[var(--surface-soft)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors text-xs font-semibold text-[var(--text-primary)]"
          >
            <Cpu className="w-3.5 h-3.5 text-[#299738] shrink-0" />
            <span className="truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[180px]">{activeDevice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          </button>

          {showDeviceMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDeviceMenu(false)} />
              <div className="absolute left-0 mt-2 w-64 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border)] mb-1">
                  Connected EcoBuck Devices
                </div>
                {devices.map((d) => {
                  const isSelected = d.id === activeDevice.id;
                  const isOnline = d.status === "online";
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDevice(d.id);
                        setShowDeviceMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                          : "hover:bg-[var(--surface-soft)] text-[var(--text-primary)]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate">{d.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">{d.id} • {d.location}</div>
                      </div>

                      <span className="flex items-center gap-1 text-[10px]">
                        {isOnline ? (
                          <Wifi className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Section Heading Label */}
        <div className="hidden lg:block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pl-2 border-l border-[var(--border)]">
          {activeTabTitle}
        </div>
      </div>

      {/* Right Controls: Dev Scenario Selector, Notifications, Theme, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Dev Scenario Selector */}
        <ScenarioSelector
          currentScenario={currentScenario}
          onSelectScenario={onSelectScenario}
        />

        {/* Theme Switcher */}
        <button
          onClick={() => onToggleTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Toggle color theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Role Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-purple-600 dark:text-purple-400">Admin</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span className="text-[var(--text-primary)]">Standard</span>
            </>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--surface-soft)] transition-colors"
          >
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover border border-[var(--border)]"
            />
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)] hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
};
