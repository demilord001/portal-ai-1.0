import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { chats, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ success: true, dbActive: false, messages: [] });
  }

  try {
    const { id } = await params;
    const msgList = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, id))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ success: true, dbActive: true, messages: msgList });
  } catch (error: any) {
    console.warn("DB query messages failed:", error.message);
    return NextResponse.json({ success: false, dbActive: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ success: true, dbActive: false });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { messageId, role, content, attachments = [], sources = [] } = body;

    const [savedMsg] = await db
      .insert(messages)
      .values({
        id: messageId,
        chatId: id,
        role,
        content,
        attachments,
        sources,
      })
      .returning();

    // Update parent chat's updatedAt
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, id));

    return NextResponse.json({ success: true, dbActive: true, message: savedMsg });
  } catch (error: any) {
    console.warn("DB insert message failed:", error.message);
    return NextResponse.json({ success: false, dbActive: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ success: true, dbActive: false });
  }

  try {
    const { id } = await params;
    await db.delete(chats).where(eq(chats.id, id));
    return NextResponse.json({ success: true, dbActive: true });
  } catch (error: any) {
    console.warn("DB delete chat failed:", error.message);
    return NextResponse.json({ success: false, dbActive: false, error: error.message }, { status: 500 });
  }
}
