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
    <div className="h-full w-full flex items-center justify-center eco-mesh-bg p-4 sm:p-6 overflow-y-auto relative">
      
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => onToggleTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-2xl glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-md transition-colors flex items-center gap-2 text-xs font-medium"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span className="hidden sm:inline capitalize">{theme} Mode</span>
        </button>
      </div>

      <div className="max-w-4xl w-full glass-panel rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto backdrop-blur-2xl relative z-10 border border-emerald-500/20">
        
        {/* Left Column: Visual EcoBuck Device Showcase & Brand Story */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-900 to-emerald-950 p-5 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-lime-400/15 rounded-full blur-3xl" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-1">
            <a
              href="https://www.ecozindagi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
            >
              <span>{BRAND_COMPANY}</span>
              <span className="text-[9px] opacity-75">ecozindagi.com ↗</span>
            </a>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              {PRODUCT_NAME}
            </h1>
          </div>

          {/* Device Showcase Vector */}
          <div className="my-4 sm:my-6 relative z-10 flex flex-col items-center">
            <DeviceIllustration
              status="online"
              fillPercent={82}
              temp={36.8}
              humidity={64}
              className="w-32 h-44 sm:w-40 sm:h-52"
            />
            <div className="mt-3 sm:mt-4 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-[11px] text-emerald-200 font-medium tracking-wide">
              IoT Telemetry v1.8.4
            </div>
          </div>

          {/* Brand Tagline */}
          <div className="relative z-10 border-t border-emerald-800/80 pt-4">
            <p className="text-xs text-emerald-100 font-medium italic leading-relaxed">
              "{BRAND_TAGLINE}"
            </p>
          </div>
        </div>

        {/* Right Column: Authenticated Login Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Welcome back to EcoBuck
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Monitor compost health, receive intelligent recommendations, and turn everyday food waste into living soil.
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Forgot Password Notice */}
            {forgotMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-medium">
                Passcode reset link dispatched to demo inbox. Use demo shortcuts below to test instant login.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
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
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
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
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In to Dashboard
              </AppButton>
            </form>
          </div>

          {/* Demo Account Quick Shortcuts */}
          <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-2">
            <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Instant Demo Account Access
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount("ayesha@ecobuck.demo")}
                className="p-2.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] border border-[var(--border)] text-left transition-colors flex items-center gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <UserCheck className="w-4 h-4" />
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
                className="p-2.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--border)] border border-[var(--border)] text-left transition-colors flex items-center gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
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
