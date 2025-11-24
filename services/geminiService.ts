import { GoogleGenAI } from "@google/genai";
import { Habit, UserStats } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTacticalAnalysis = async (habits: Habit[], stats: UserStats): Promise<string> => {
  const ai = getClient();
  if (!ai) return "err: no_uplink // api_key_missing";

  const prompt = `
    SYSTEM ROLE: You are a system interface AI for a code-styled habit tracker.
    TONE: Minimalist, lower-case, technical but calm.
    TASK: Analyze the user's current habit performance and generate a short status update.
    
    DATA:
    Current Rank: ${stats.rankTitle}
    Current XP: ${stats.xp}
    Habits:
    ${habits.map(h => `- ${h.name}: Streak ${h.streak}`).join('\n')}

    INSTRUCTIONS:
    - Output must be strictly lowercase.
    - If streaks are high, output "efficiency: optimal".
    - If streaks are low, output "status: degradation detected".
    - Keep it under 30 words.
    - Style it like a system log message or a code comment.
    - No markdown formatting.
    - Use snake_case where appropriate for technical terms.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.toLowerCase() || "err: empty_response";
  } catch (error) {
    console.error("Gemini uplink failed:", error);
    return "err: uplink_failed // retry_later";
  }
};