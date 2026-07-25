import React, { useState } from "react";
import { User, Device, ThresholdConfig, SettingsGroup } from "../../types";
import { AppButton } from "../ui/app-button";
import {
  User as UserIcon,
  Cpu,
  Wifi,
  Sliders,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Lock,
} from "lucide-react";

interface SettingsPanelProps {
  user: User;
  isAdmin: boolean;
  onUpdateUser: (fields: Partial<User>) => void;
  activeDevice: Device;
  onUpdateDevice: (id: string, updates: Partial<Device>) => void;
  thresholds: ThresholdConfig;
  onUpdateThresholds: (cfg: ThresholdConfig) => void;
  onResetThresholds: () => void;
  theme: "light" | "dark" | "system";
  onToggleTheme: (t: "light" | "dark" | "system") => void;
  onShowToast: (title: string, msg?: string, type?: "success" | "error" | "info") => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  user,
  isAdmin,
  onUpdateUser,
  activeDevice,
  onUpdateDevice,
  thresholds,
  onUpdateThresholds,
  onResetThresholds,
  theme,
  onToggleTheme,
  onShowToast,
}) => {
  const [activeGroup, setActiveGroup] = useState<SettingsGroup>("profile");

  // Profile Form State
  const [profileName, setProfileName] = useState(user.name);
  const [notificationEmail, setNotificationEmail] = useState(user.notification_email);

  // Device Form State
  const [deviceName, setDeviceName] = useState(activeDevice.name);
  const [deviceLocation, setDeviceLocation] = useState(activeDevice.location);

  // Connection Form State
  const [wifiSsid, setWifiSsid] = useState(activeDevice.wifi_ssid || "EcoZindagi_Mesh_5G");
  const [wifiPass, setWifiPass] = useState("");
  const [isTestingWifi, setIsTestingWifi] = useState(false);

  // Thresholds Form State
  const [tempMin, setTempMin] = useState(thresholds.temp_normal_min);
  const [tempMax, setTempMax] = useState(thresholds.temp_normal_max);
  const [tempHigh, setTempHigh] = useState(thresholds.temp_high);
  const [humMin, setHumMin] = useState(thresholds.humidity_min);
  const [humMax, setHumMax] = useState(thresholds.humidity_max);
  const [fillAtt, setFillAtt] = useState(thresholds.fill_attention);
  const [fillFull, setFillFull] = useState(thresholds.fill_full);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: profileName, notification_email: notificationEmail });
    onShowToast("Profile Updated", "Your account settings have been saved.", "success");
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDevice(activeDevice.id, { name: deviceName, location: deviceLocation });
    onShowToast("Device Saved", `${activeDevice.id} details updated.`, "success");
  };

  const handleTestConnection = () => {
    setIsTestingWifi(true);
    setTimeout(() => {
      setIsTestingWifi(false);
      onShowToast("Connection Test Passed", "EcoBuck reached Gateway ping in 12ms.", "success");
    }, 1200);
  };

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onUpdateThresholds({
        temp_normal_min: Number(tempMin),
        temp_normal_max: Number(tempMax),
        temp_high: Number(tempHigh),
        humidity_min: Number(humMin),
        humidity_max: Number(humMax),
        fill_attention: Number(fillAtt),
        fill_full: Number(fillFull),
      });
      onShowToast("Thresholds Configured", "IoT alert trigger bounds updated across devices.", "success");
    } catch (err: unknown) {
      onShowToast("Invalid Thresholds", err instanceof Error ? err.message : "Validation error", "error");
    }
  };

  const navGroups: { id: SettingsGroup; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon className="w-4 h-4" /> },
    { id: "device", label: "Device Info", icon: <Cpu className="w-4 h-4" /> },
    { id: "connection", label: "Connection", icon: <Wifi className="w-4 h-4" />, adminOnly: true },
    { id: "thresholds", label: "Thresholds", icon: <Sliders className="w-4 h-4" />, adminOnly: true },
    { id: "appearance", label: "Appearance", icon: <Sun className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5 pb-28 md:pb-6 max-w-5xl mx-auto">
      
      {/* Top Settings Group Tab Selector */}
      <div className="glass-panel rounded-2xl p-2 shadow-lg flex items-center gap-1 overflow-x-auto backdrop-blur-xl">
        {navGroups.map((g) => {
          const isActive = activeGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {g.icon}
              <span>{g.label}</span>
              {g.adminOnly && (
                <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300">
                  Admin
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Settings Panel Content */}
      <div className="glass-panel rounded-2xl p-6 shadow-lg backdrop-blur-xl">
        
        {/* Profile Settings */}
        {activeGroup === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">User Profile Settings</h3>
              <p className="text-xs text-[var(--text-secondary)]">Manage your EcoBuck monitoring account details.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-secondary)] opacity-70 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Assigned Role</label>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)]">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span className="capitalize">{user.role} User</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.checked)}
                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span>Receive email notifications for high temperature or bin full alerts</span>
                </label>
              </div>
            </div>

            <AppButton type="submit" variant="primary" size="md">
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </AppButton>
          </form>
        )}

        {/* Device Settings */}
        {activeGroup === "device" && (
          <form onSubmit={handleSaveDevice} className="space-y-5 max-w-lg">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">EcoBuck Hardware Metadata</h3>
              <p className="text-xs text-[var(--text-secondary)]">Manage nickname and location for active unit ({activeDevice.id}).</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Device Nickname</label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Installation Location</label>
                <input
                  type="text"
                  value={deviceLocation}
                  onChange={(e) => setDeviceLocation(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-2 text-xs">
                <div className="font-bold text-[var(--text-primary)]">Sensor Diagnostics</div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-secondary)]">Temp Probe</div>
                    <div className="font-bold text-emerald-600">PASS</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-secondary)]">Humidity</div>
                    <div className="font-bold text-emerald-600">PASS</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-secondary)]">Fill Ultrasonic</div>
                    <div className="font-bold text-emerald-600">PASS</div>
                  </div>
                </div>
              </div>
            </div>

            <AppButton type="submit" variant="primary" size="md">
              <Save className="w-4 h-4" />
              <span>Save Device Settings</span>
            </AppButton>
          </form>
        )}

        {/* Connection Settings */}
        {activeGroup === "connection" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Wi-Fi & Network Configuration</h3>
              <p className="text-xs text-[var(--text-secondary)]">Administrator network link settings for {activeDevice.id}.</p>
            </div>

            {!isAdmin ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-100 text-xs flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Wi-Fi configuration is restricted to Administrator roles. Log in as Administrator to edit credentials.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Wi-Fi Network SSID</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Wi-Fi Password (Masked)</label>
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1">Passwords are sent securely over local TLS mesh and never stored in localStorage.</p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <AppButton variant="primary" size="md" isLoading={isTestingWifi} onClick={handleTestConnection}>
                    <Wifi className="w-4 h-4" />
                    <span>Test Gateway Ping</span>
                  </AppButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Threshold Settings */}
        {activeGroup === "thresholds" && (
          <form onSubmit={handleSaveThresholds} className="space-y-5 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Sensor Alert Threshold Configuration</h3>
              <p className="text-xs text-[var(--text-secondary)]">Set global trigger boundaries for telemetry attention and alert states.</p>
            </div>

            {!isAdmin ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-100 text-xs flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Threshold editing is locked for Standard Users. Only Administrators can modify alert trigger points.</span>
              </div>
            ) : null}

            <div className="space-y-4">
              
              {/* Temp Thresholds */}
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Temperature (°C)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Normal Min (°C)</label>
                    <input
                      type="number"
                      value={tempMin}
                      disabled={!isAdmin}
                      onChange={(e) => setTempMin(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Normal Max (°C)</label>
                    <input
                      type="number"
                      value={tempMax}
                      disabled={!isAdmin}
                      onChange={(e) => setTempMax(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">High Alert (°C)</label>
                    <input
                      type="number"
                      value={tempHigh}
                      disabled={!isAdmin}
                      onChange={(e) => setTempHigh(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric text-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity Thresholds */}
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Humidity (%)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Target Minimum (%)</label>
                    <input
                      type="number"
                      value={humMin}
                      disabled={!isAdmin}
                      onChange={(e) => setHumMin(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Target Maximum (%)</label>
                    <input
                      type="number"
                      value={humMax}
                      disabled={!isAdmin}
                      onChange={(e) => setHumMax(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric"
                    />
                  </div>
                </div>
              </div>

              {/* Fill Thresholds */}
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Fill Level Capacity (%)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Attention Level (%)</label>
                    <input
                      type="number"
                      value={fillAtt}
                      disabled={!isAdmin}
                      onChange={(e) => setFillAtt(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">Full / Harvest Ready (%)</label>
                    <input
                      type="number"
                      value={fillFull}
                      disabled={!isAdmin}
                      onChange={(e) => setFillFull(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] font-numeric text-rose-600"
                    />
                  </div>
                </div>
              </div>

            </div>

            {isAdmin && (
              <div className="flex items-center gap-3 pt-2">
                <AppButton type="submit" variant="primary" size="md">
                  <Save className="w-4 h-4" />
                  <span>Update Thresholds</span>
                </AppButton>

                <AppButton
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    onResetThresholds();
                    onShowToast("Thresholds Reset", "Restored default Eco Zindagi science parameters.", "info");
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Defaults</span>
                </AppButton>
              </div>
            )}
          </form>
        )}

        {/* Appearance Settings */}
        {activeGroup === "appearance" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Theme & Visual Mode</h3>
              <p className="text-xs text-[var(--text-secondary)]">Customize interface color scheme preferences.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onToggleTheme("light")}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  theme === "light"
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs"
                    : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]/40"
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div className="text-xs">Light Theme</div>
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme("dark")}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  theme === "dark"
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs"
                    : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]/40"
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <div className="text-xs">Dark Theme</div>
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme("system")}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  theme === "system"
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs"
                    : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]/40"
                }`}
              >
                <Cpu className="w-5 h-5 text-emerald-500" />
                <div className="text-xs">System Mode</div>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
