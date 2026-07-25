import React from "react";
import { ActiveTab } from "../../types";
import { LayoutDashboard, History, Sparkles, Settings } from "lucide-react";

interface MobileNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "assistant", label: "Assistant", icon: <Sparkles className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)]/95 dark:bg-[#163320]/95 border-t border-[var(--border)] px-2 sm:px-4 flex items-center justify-around z-50 select-none shadow-[0_-4px_25px_rgba(0,0,0,0.12)] backdrop-blur-2xl pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-[#299738] text-white font-bold shadow-md shadow-[#299738]/25"
                : "text-[#556B5C] dark:text-[#A3B8A8] hover:text-[#299738] hover:bg-[#E8F8EE]/60 dark:hover:bg-[#1C3826]/60"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
