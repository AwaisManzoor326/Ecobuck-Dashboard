import React, { useState } from "react";
import { DeviceIllustration } from "../device/device-illustration";
import { AppButton } from "../ui/app-button";
import { BRAND_COMPANY, BRAND_TAGLINE, PRODUCT_NAME } from "../../lib/constants";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserCheck, Sun, Moon } from "lucide-react";

interface LoginPanelProps {
  onLogin: (email: string, pass: string, remember: boolean) => Promise<any>;
  theme: "light" | "dark" | "system";
  onToggleTheme: (theme: "light" | "dark" | "system") => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  onLogin,
  theme,
  onToggleTheme,
}) => {
  const [email, setEmail] = useState("ayesha@ecobuck.demo");
  const [password, setPassword] = useState("ecobuck123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await onLogin(email, password, rememberMe);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication error.");
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("ecobuck123");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center eco-mesh-bg p-3 sm:p-6 md:p-8 relative overflow-x-hidden">
      
      <div className="max-w-4xl w-full glass-panel rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto backdrop-blur-2xl relative z-10 border border-emerald-500/20">
        
        {/* Left Column: Visual EcoBuck Device Showcase & Brand Header */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-900 to-emerald-950 p-4 sm:p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-lime-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header: Brand Logo + Theme Toggle in Green Section */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                {PRODUCT_NAME}
              </h1>
              <p className="text-[11px] text-emerald-200/90 font-medium hidden md:block mt-0.5">
                IoT Compost Intelligence
              </p>
            </div>
            
            {/* Theme Toggle Button inside Green Header */}
            <button
              type="button"
              onClick={() => onToggleTheme(theme === "dark" ? "light" : "dark")}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="text-emerald-100">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  <span className="text-emerald-100">Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Device Showcase Vector - Nicely Proportioned in Green Area */}
          <div className="flex flex-col items-center my-3 sm:my-4 md:my-6 relative z-10">
            <DeviceIllustration
              status="online"
              fillPercent={82}
              temp={36.8}
              humidity={64}
              className="w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48"
            />
          </div>

          {/* Brand Tagline (Desktop/Tablet view) */}
          <div className="hidden md:block relative z-10 border-t border-emerald-800/80 pt-3 mt-auto">
            <p className="text-xs text-emerald-100 font-medium italic leading-relaxed">
              "{BRAND_TAGLINE}"
            </p>
          </div>
        </div>

        {/* Right Column: Authenticated Login Panel */}
        <div className="md:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-[var(--surface)]">
          <div>
            {/* Form Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Welcome back
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Sign in to monitor compost health & recommendations.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Forgot Password Notice */}
            {forgotMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-medium">
                Passcode reset link dispatched. Use demo shortcuts below for instant testing.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
              
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                    placeholder="ayesha@ecobuck.demo"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotMsg(true)}
                  className="text-[var(--primary)] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in Button */}
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-1"
              >
                Sign In to Dashboard
              </AppButton>
            </form>
          </div>

          {/* Demo Account Quick Shortcuts */}
          <div className="mt-4 pt-3.5 border-t border-[var(--border)] space-y-1.5">
            <div className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Instant Demo Account Access
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount("ayesha@ecobuck.demo")}
                className="p-2 sm:p-2.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] border border-[var(--border)] text-left transition-colors flex items-center gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] truncate">
                    Ayesha Khan
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Standard User</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount("admin@ecobuck.demo")}
                className="p-2 sm:p-2.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] border border-[var(--border)] text-left transition-colors flex items-center gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] truncate">
                    Eco Zindagi Admin
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Administrator</div>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
