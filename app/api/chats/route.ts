import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { chats, messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ success: true, dbActive: false, chats: [] });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest";

    const chatList = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));

    return NextResponse.json({ success: true, dbActive: true, chats: chatList });
  } catch (error: any) {
    console.warn("DB query failed in /api/chats:", error.message);
    return NextResponse.json({ success: false, dbActive: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ success: true, dbActive: false, message: "Local fallback active" });
  }

  try {
    const body = await req.json();
    const { id, title, userId = "guest" } = body;

    const [newChat] = await db
      .insert(chats)
      .values({
        id,
        title,
        userId,
      })
      .onConflictDoUpdate({
        target: chats.id,
        set: { title, updatedAt: new Date() },
      })
      .returning();

    return NextResponse.json({ success: true, dbActive: true, chat: newChat });
  } catch (error: any) {
    console.warn("DB insert failed in /api/chats:", error.message);
    return NextResponse.json({ success: false, dbActive: false, error: error.message }, { status: 500 });
  }
}
