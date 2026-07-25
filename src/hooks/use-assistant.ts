import { useState, useEffect } from "react";
import { AssistantMessage, CompostReading, DailyTip } from "../types";
import { DAILY_TIPS } from "../lib/constants";
import { assistantAdapter } from "../lib/api/assistant-adapter";
import { getStoredDailyTipDate, setStoredDailyTipDate } from "../lib/storage";

export function useAssistant(currentReading?: CompostReading) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Hello! I am your EcoBuck Sustainability Assistant. I monitor your live IoT telemetry to help you optimize organic waste breakdown and keep moisture & temperature perfectly balanced. Ask me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [dailyTip, setDailyTip] = useState<DailyTip>(DAILY_TIPS[0]);

  // Daily tip persistence logic
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const storedDate = getStoredDailyTipDate();

    // Select tip deterministically based on date day index
    const dayHash = new Date().getDate() % DAILY_TIPS.length;
    const currentTip = DAILY_TIPS[dayHash];

    setDailyTip(currentTip);

    if (storedDate !== todayStr) {
      setStoredDailyTipDate(todayStr);
    }
  }, []);

  const sendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: queryText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await assistantAdapter.generateResponse(queryText, currentReading);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "assistant",
          text: "I experienced a temporary communication glitch with the compost intelligence server. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: "Conversation reset. How can I help you with your EcoBuck compost monitoring today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return {
    messages,
    isTyping,
    dailyTip,
    sendMessage,
    clearChat,
  };
}
