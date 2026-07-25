import React from "react";
import { ActiveTab } from "../../types";
import { LayoutDashboard, History, Sparkles, Settings } from "lucide-react";

interface DesktopSidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "assistant", label: "AI Assistant", icon: <Sparkles className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-56 glass-panel border-r border-[var(--border)] py-6 px-3 shrink-0 justify-between select-none backdrop-blur-xl">
      
      {/* Navigation Items */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                isActive
                  ? "bg-[#299738] text-white shadow-md shadow-[#299738]/25 scale-[1.02]"
                  : "text-[#556B5C] dark:text-[#A3B8A8] hover:text-[#299738] hover:bg-[#E8F8EE] dark:hover:bg-[#1C3826]"
              }`}
              title={item.label}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="hidden lg:inline tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Eco Zindagi Footer Micro-Badge */}
      <div className="hidden lg:block pt-4 border-t border-[var(--border)] px-1">
        <a
          href="https://www.ecozindagi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3.5 rounded-2xl bg-[#163320] text-[#A3B8A8] space-y-1 hover:bg-[#1A3B24] transition-all group border border-[#243B2A] shadow-md"
        >
          <div className="font-extrabold text-white flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            Eco Zindagi Platform
          </div>
          <p className="text-[10px] leading-snug text-[#A3B8A8] group-hover:text-white transition-colors">
            Zero Waste • Segregate Today, Compost Tomorrow
          </p>
        </a>
      </div>

    </aside>
  );
};
