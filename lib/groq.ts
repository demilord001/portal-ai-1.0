import Groq from "groq-sdk";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const AVAILABLE_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Portal Ultra (Llama 3.3 70B)",
    description: "Flagship intelligence, complex reasoning, and coding",
    speed: "Ultra-fast (~300 tps)",
    recommended: true,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Portal Flash (Llama 3.1 8B)",
    description: "Instantaneous responses for quick daily tasks",
    speed: "Blazing (~750 tps)",
    recommended: false,
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "Portal Reasoner (DeepSeek R1 70B)",
    description: "Deep chain-of-thought mathematical & logical deduction",
    speed: "Fast (~250 tps)",
    recommended: false,
  },
  {
    id: "gemma2-9b-it",
    name: "Portal Lite (Google Gemma 2 9B)",
    description: "Google's lightweight and nuanced conversational model",
    speed: "High (~500 tps)",
    recommended: false,
  },
];

export function getGroqClient(apiKey?: string): Groq | null {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key || key.trim() === "" || key.includes("placeholder")) {
    return null;
  }
  return new Groq({ apiKey: key });
}
