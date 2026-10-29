import { AttachmentItem, SearchSource } from "@/db/schema";

export interface StoredMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: AttachmentItem[];
  sources?: SearchSource[];
  createdAt: string;
}

export interface StoredChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

const STORAGE_KEY_CHATS = "portal_ai_chats_v1";
const STORAGE_KEY_MESSAGES_PREFIX = "portal_ai_msgs_";

/**
 * Generate a smart, concise chat title from user's first prompt (Gemini-style)
 */
export function generateSmartTitle(prompt: string): string {
  if (!prompt || !prompt.trim()) return "New Chat";
  
  // Clean up markdown / symbols
  let clean = prompt.replace(/[#*`_~]/g, "").trim();
  
  // Cut down question words
  clean = clean.replace(/^(can you |please |how do i |how to |what is |tell me about |explain )/i, "");
  
  // Capitalize first letter
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  
  // Truncate to maximum ~36 characters nicely
  if (clean.length > 36) {
    const truncated = clean.substring(0, 36);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 18 ? truncated.substring(0, lastSpace) : truncated) + "...";
  }
  return clean;
}

export function loadLocalChats(): StoredChat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHATS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read local chats:", e);
    return [];
  }
}

export function saveLocalChats(chats: StoredChat[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to save local chats:", e);
  }
}

export function loadLocalMessages(chatId: string): StoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES_PREFIX + chatId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read local messages:", e);
    return [];
  }
}

export function saveLocalMessages(chatId: string, messages: StoredMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MESSAGES_PREFIX + chatId, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save local messages:", e);
  }
}

export function deleteLocalChat(chatId: string): void {
  if (typeof window === "undefined") return;
  try {
    const chats = loadLocalChats().filter((c) => c.id !== chatId);
    saveLocalChats(chats);
    localStorage.removeItem(STORAGE_KEY_MESSAGES_PREFIX + chatId);
  } catch (e) {
    console.error("Failed to delete local chat:", e);
  }
}
