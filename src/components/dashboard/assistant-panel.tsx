import React, { useState } from "react";
import { CompostReading, DailyTip } from "../../types";
import { useAssistant } from "../../hooks/use-assistant";
import { Sparkles, Send, Trash2, Bot, User, HelpCircle, CornerDownLeft } from "lucide-react";

interface AssistantPanelProps {
  currentReading?: CompostReading | null;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ currentReading }) => {
  const { messages, isTyping, dailyTip, sendMessage, clearChat } = useAssistant(currentReading || undefined);
  const [input, setInput] = useState("");

  const suggestedQuestions = [
    "Why is my compost warm?",
    "Is moisture level healthy?",
    "When should I empty EcoBuck?",
    "What should I add next?",
    "How can I reduce odor?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleChipClick = (q: string) => {
    sendMessage(q);
  };

  return (
    <div className="space-y-5 pb-28 md:pb-6 max-w-4xl mx-auto">
      
      {/* Daily Sustainability Tip Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Daily Composting Intelligence
          </span>
          <span className="text-[11px] text-emerald-300 font-numeric">{dailyTip.date}</span>
        </div>

        <h3 className="text-base font-bold leading-snug">{dailyTip.title}</h3>
        <p className="text-xs text-emerald-100 leading-relaxed">{dailyTip.tip}</p>
      </div>

      {/* Main Q&A Chat Container */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100dvh-280px)] sm:h-[520px] min-h-[380px] backdrop-blur-2xl">
        
        {/* Assistant Header Bar */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-soft)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                EcoBuck Sustainability Assistant
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Compost Science AI • Context Aware Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-grain">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)]"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[var(--primary)]" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-[var(--primary)] text-white rounded-tr-none"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div
                    className={`text-[10px] text-[var(--text-secondary)] font-numeric ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-center gap-1.5 rounded-tl-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts Bar */}
        <div className="px-4 py-2.5 bg-[var(--surface-soft)] border-t border-[var(--border)] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(q)}
              className="px-3 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap text-xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about compost temperature, humidity, odor, or bin harvest..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] disabled:opacity-40 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
};
