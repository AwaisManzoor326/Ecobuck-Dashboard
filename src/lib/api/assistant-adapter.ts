import { AssistantMessage, CompostReading } from "../../types";

export interface AssistantAdapter {
  generateResponse(query: string, currentReading?: CompostReading): Promise<AssistantMessage>;
}

export class MockAssistantAdapter implements AssistantAdapter {
  async generateResponse(query: string, currentReading?: CompostReading): Promise<AssistantMessage> {
    await new Promise((res) => setTimeout(res, 600));

    const lower = query.toLowerCase();
    let text = "";

    const temp = currentReading?.temperature_c ?? 36.8;
    const humidity = currentReading?.humidity_percent ?? 64;
    const fill = currentReading?.fill_level_percent ?? 82;

    if (lower.includes("warm") || lower.includes("temp") || lower.includes("heat") || lower.includes("hot")) {
      text = `Your EcoBuck core temperature is currently ${temp.toFixed(1)}°C. Heat in a compost bin is a sign of active aerobic microbial digestion breaking down nitrogenous food waste. Temperatures between 30°C and 45°C are ideal. If temperature exceeds 55°C, gently turn the top layer to release excess heat and prevent moisture evaporation.`;
    } else if (lower.includes("moist") || lower.includes("humid") || lower.includes("water") || lower.includes("wet") || lower.includes("dry")) {
      if (humidity > 70) {
        text = `Your current humidity reading is ${humidity}%, which is above the optimal 50%–70% range. High moisture slows airflow and causes foul odors. Add dry carbon materials like shredded cardboard, egg cartons, or dry leaves, and stir the top layer.`;
      } else if (humidity < 50) {
        text = `Your humidity is currently ${humidity}%, slightly dry for optimal bacterial breakdown. Add fresh food scraps (like fruit peels or coffee grounds) or sprinkle a small mist of clean water.`;
      } else {
        text = `Your moisture level is currently balanced at ${humidity}%. This creates the ideal sponge-like dampness for thermophilic micro-organisms to multiply cleanly without odor.`;
      }
    } else if (lower.includes("empty") || lower.includes("full") || lower.includes("harvest") || lower.includes("capacity")) {
      if (fill >= 90) {
        text = `EcoBuck is currently ${fill}% full. You should harvest the finished compost from the lower tray within 24-48 hours. This clears room in the upper chamber and ensures proper airflow across the internal aeration channels.`;
      } else if (fill >= 80) {
        text = `EcoBuck is currently ${fill}% full (Attention zone). Prepare to empty or harvest the bottom compost layer soon. You can continue adding daily scraps for another 2-3 days.`;
      } else {
        text = `EcoBuck fill level is currently ${fill}%. There is plenty of space in the primary digestion chamber. You can keep adding daily household organic waste.`;
      }
    } else if (lower.includes("odor") || lower.includes("smell") || lower.includes("stink")) {
      text = `Healthy aerobic compost smells like rich, damp forest soil. If you notice sour or unpleasant odors, it typically means excess moisture (${humidity}%) or lack of oxygen. Stir the top layer thoroughly and cover fresh food scraps with a 2cm layer of dry brown carbon material.`;
    } else if (lower.includes("add") || lower.includes("scraps") || lower.includes("what can i")) {
      text = `You can safely add: fruit & vegetable peels, coffee grounds, tea bags, eggshells, crushed nut shells, shredded unprinted cardboard, and dry leaves. Avoid meat, dairy, oily foods, plastics, or pet waste in household compost bins.`;
    } else {
      text = `Based on your EcoBuck telemetry (${temp.toFixed(1)}°C, ${humidity}% humidity, ${fill}% fill level), your compost bin is operating in a stable state. Is there a specific sensor reading or composting step you'd like guidance on?`;
    }

    return {
      id: `msg-asst-${Date.now()}`,
      sender: "assistant",
      text,
      timestamp: new Date().toISOString(),
    };
  }
}

export const assistantAdapter = new MockAssistantAdapter();
