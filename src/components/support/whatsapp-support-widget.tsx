import React, { useState } from "react";
import { MessageSquare, X, Send, UserCheck, ShieldAlert, Sparkles, PhoneCall } from "lucide-react";
import { SupportMessage } from "../../types";

export const WhatsappSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "sup-01",
      sender: "bot",
      text: "Assalamu Alaikum! Welcome to Eco Zindagi EcoBuck Support. How can we assist your compost bin today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg: SupportMessage = {
      id: `sup-user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Automated smart support response with human escalation
    setTimeout(() => {
      let botText = "Thank you for contacting Eco Zindagi support. I’ll pass this conversation to the Eco Zindagi support team.";

      const lower = userText.toLowerCase();
      if (lower.includes("wifi") || lower.includes("connect") || lower.includes("offline")) {
        botText = "For Wi-Fi connectivity issues, hold the EcoBuck rear reset button for 5 seconds until the status LED flashes blue. Ensure 2.4GHz network is active.";
      } else if (lower.includes("odor") || lower.includes("smell")) {
        botText = "Odor usually stems from excess moisture. Add shredded dry cardboard or dry leaves and mix the top layer.";
      } else if (lower.includes("human") || lower.includes("agent") || lower.includes("help")) {
        botText = "I’ll pass this conversation to the Eco Zindagi support team. An Eco Zindagi engineer will contact you shortly.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `sup-bot-${Date.now()}`,
          sender: "bot",
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-40 select-none">
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="relative group p-3.5 rounded-full bg-[#299738] hover:bg-[#1A3B24] text-white shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-95 border-2 border-white/20"
          title="Eco Zindagi WhatsApp Support"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      ) : (
        <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[480px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 backdrop-blur-2xl border border-[#299738]/30">
          
          {/* Header */}
          <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 font-bold text-sm">
                  EZ
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Eco Zindagi Support</h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3 h-3 text-emerald-300" />
                  EcoBuck Technical Desk
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-2 bg-[var(--surface-soft)] border-b border-[var(--border)] flex items-center gap-2 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInput("How do I fix offline Wi-Fi connection?")}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0 transition-colors"
            >
              Wi-Fi Setup
            </button>
            <button
              onClick={() => setInput("How to eliminate compost odor?")}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0 transition-colors"
            >
              Odor Control
            </button>
            <button
              onClick={() => setInput("Request human support engineer")}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-emerald-600 dark:text-emerald-400 font-medium shrink-0 transition-colors"
            >
              Human Agent
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-grain">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)] mt-1 px-1 font-numeric">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Eco Zindagi support..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
