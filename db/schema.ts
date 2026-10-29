import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk ID or custom ID
  name: text("name"),
  email: text("email").unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  data?: string; // base64 or text preview
  url?: string;
}

export interface SearchSource {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  attachments: jsonb("attachments").$type<AttachmentItem[]>(),
  sources: jsonb("sources").$type<SearchSource[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  customInstructions: text("custom_instructions").default(""),
  preferredModel: text("preferred_model").default("llama-3.3-70b-versatile"),
  searchAuto: boolean("search_auto").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
