"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  MessageSquare,
  Trash2,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  Bot,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { StoredChat } from "@/lib/chat-storage";

interface ChatSidebarProps {
  chats: StoredChat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  isOpen,
  onToggleOpen,
}: ChatSidebarProps) {
  // Gracefully handle Clerk user hook
  let user: any = null;
  try {
    const clerkUser = useUser();
    user = clerkUser.user;
  } catch (e) {
    // ClerkProvider not mounted or placeholder
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#111218] border-r border-white/5 transition-all duration-300 ease-in-out ${
          isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[68px]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
          {isOpen ? (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  Portal<span className="gemini-gradient-text">.AI</span>
                </span>
                <span className="text-[10px] text-white/40 tracking-wider uppercase font-medium">
                  Next-Gen Intelligence
                </span>
              </div>
            </Link>
          ) : (
            <button
              onClick={onToggleOpen}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 mx-auto hover:scale-105 transition-transform cursor-pointer"
              title="Expand Sidebar"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          )}

          {isOpen && (
            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-2xl bg-[#1b1d28] hover:bg-[#232635] border border-white/10 hover:border-indigo-500/40 text-white font-medium text-sm transition-all shadow-sm hover:shadow-indigo-500/10 cursor-pointer group active:scale-[0.98] ${
              !isOpen && "lg:p-2 lg:aspect-square"
            }`}
            title="Start New Chat"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            {isOpen && <span>New chat</span>}
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {isOpen && (
            <div className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
              Recent Conversations
            </div>
          )}

          {chats.length === 0 ? (
            isOpen && (
              <div className="p-4 text-center text-xs text-white/30 space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto opacity-30 mb-2" />
                <p>No chats yet</p>
                <p className="text-[11px]">Start a conversation to see it here</p>
              </div>
            )
          ) : (
            chats.map((c) => {
              const isActive = c.id === currentChatId;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectChat(c.id)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600/20 text-white font-medium border border-indigo-500/30 shadow-sm"
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                  title={c.title}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-400" : "text-white/40 group-hover:text-white/60"
                      }`}
                    />
                    {isOpen && <span className="truncate">{c.title}</span>}
                  </div>

                  {isOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-rose-400 transition-opacity hover:bg-white/5 rounded cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area with Settings and User Button */}
        <div className="p-3 border-t border-white/5 bg-[#0e0f14] space-y-2">
          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer ${
              !isOpen && "justify-center"
            }`}
            title="Settings & Custom Instructions"
          >
            <Settings className="w-4 h-4 text-white/60 shrink-0" />
            {isOpen && <span>Settings</span>}
          </button>

          {/* User Profile / Clerk UserButton */}
          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 ${
              !isOpen && "justify-center"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {user ? (
                <UserButton />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  P
                </div>
              )}
              {isOpen && (
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-medium text-white/90 truncate">
                    {user?.fullName || user?.firstName || "Portal Explorer"}
                  </span>
                  <span className="text-[10px] text-white/40 truncate">
                    {user?.primaryEmailAddress?.emailAddress || "Demlabs Network"}
                  </span>
                </div>
              )}
            </div>

            {isOpen && (
              <Link
                href="/"
                className="text-white/30 hover:text-white/80 p-1 transition-colors"
                title="Return to Landing Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
