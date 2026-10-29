"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Paperclip,
  Globe,
  Mic,
  MicOff,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RefreshCw,
  Menu,
  ChevronDown,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SettingsModal } from "@/components/SettingsModal";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { FileAttachmentPreview } from "@/components/FileAttachmentPreview";
import { PortalVisualizer3D } from "@/components/PortalVisualizer3D";
import { AttachmentItem, SearchSource } from "@/db/schema";
import {
  StoredChat,
  StoredMessage,
  loadLocalChats,
  saveLocalChats,
  loadLocalMessages,
  saveLocalMessages,
  deleteLocalChat,
  generateSmartTitle,
} from "@/lib/chat-storage";
import { AVAILABLE_MODELS } from "@/lib/groq";

export default function ChatPage() {
  // Clerk User hook
  let user: any = null;
  try {
    const clerkUser = useUser();
    user = clerkUser.user;
  } catch (e) {}

  // Sidebar & Settings states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // User Settings states
  const [preferredModel, setPreferredModel] = useState("llama-3.3-70b-versatile");
  const [customInstructions, setCustomInstructions] = useState("");
  const [searchAuto, setSearchAuto] = useState(true);
  const [customGroqKey, setCustomGroqKey] = useState("");
  const [customTavilyKey, setCustomTavilyKey] = useState("");
  const [forceSearch, setForceSearch] = useState(false);

  // Chat Data states
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);

  // Input states
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const storedChats = loadLocalChats();
      setChats(storedChats);

      const savedModel = localStorage.getItem("portal_model");
      if (savedModel) setPreferredModel(savedModel);

      const savedInstructions = localStorage.getItem("portal_instructions");
      if (savedInstructions) setCustomInstructions(savedInstructions);

      const savedGroqKey = localStorage.getItem("portal_groq_key");
      if (savedGroqKey) setCustomGroqKey(savedGroqKey);

      const savedTavilyKey = localStorage.getItem("portal_tavily_key");
      if (savedTavilyKey) setCustomTavilyKey(savedTavilyKey);

      const savedAuto = localStorage.getItem("portal_search_auto");
      if (savedAuto) setSearchAuto(JSON.parse(savedAuto));

      // Mobile screen collapses sidebar by default
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 2. Load Messages when currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      const msgs = loadLocalMessages(currentChatId);
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  // 3. Scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // 4. Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputValue]);

  // Dynamic Greeting Generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    else if (hour >= 17) timeGreeting = "Good evening";

    const name = user?.firstName || user?.fullName || "Explorer";
    return {
      title: `${timeGreeting}, ${name}`,
      subtitle: "Where will your curiosity take you today?",
    };
  };

  // Setup Voice Input (Web Speech API)
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join("");
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition initialization failed:", err);
      setIsListening(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          const newAttachment: AttachmentItem = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string,
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      } else {
        // Text/Code/PDF/Document extraction preview
        reader.onload = () => {
          const content = typeof reader.result === "string" ? reader.result : "";
          const newAttachment: AttachmentItem = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            data: content.slice(0, 15000), // First 15KB text sample
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsText(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle New Chat
  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInputValue("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle Select Chat
  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Handle Delete Chat
  const handleDeleteChat = (id: string) => {
    deleteLocalChat(id);
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) {
      handleNewChat();
    }
  };

  // Handle Message Submission
  const handleSubmit = async (overridePrompt?: string) => {
    const textToSend = overridePrompt !== undefined ? overridePrompt : inputValue;
    if ((!textToSend || !textToSend.trim()) && attachments.length === 0) return;
    if (isGenerating) return;

    let activeChatId = currentChatId;
    let updatedChats = [...chats];

    // Create new chat if none is selected
    if (!activeChatId) {
      activeChatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const title = generateSmartTitle(textToSend || attachments[0]?.name || "New Chat");
      const newChat: StoredChat = {
        id: activeChatId,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedChats = [newChat, ...chats];
      saveLocalChats(updatedChats);
      setChats(updatedChats);
      setCurrentChatId(activeChatId);
    }

    // Add User Message
    const userMessage: StoredMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: textToSend,
      attachments: [...attachments],
      createdAt: new Date().toISOString(),
    };

    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    saveLocalMessages(activeChatId, newMessagesList);

    // Clear input & attachments
    setInputValue("");
    setAttachments([]);
    setIsGenerating(true);

    // Temporary placeholder for Assistant Message
    const assistantMessageId = `msg_${Date.now()}_assistant`;
    let assistantContent = "";
    let retrievedSources: SearchSource[] = [];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessagesList.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          model: preferredModel,
          customInstructions,
          forceSearch,
          searchAuto,
          customGroqKey,
          customTavilyKey,
          chatId: activeChatId,
          userId: user?.id || "guest",
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No readable stream received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        // Check if stream starts with __SOURCES__:
        if (textChunk.includes("__SOURCES__:")) {
          const match = /__SOURCES__:(.*?)\n\n/.exec(textChunk);
          if (match && match[1]) {
            try {
              retrievedSources = JSON.parse(match[1]);
            } catch (e) {
              console.error("Failed to parse sources metadata:", e);
            }
          }
          const cleanedChunk = textChunk.replace(/__SOURCES__:.*?\n\n/, "");
          assistantContent += cleanedChunk;
        } else {
          assistantContent += textChunk;
        }

        // Live stream update
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== assistantMessageId);
          return [
            ...filtered,
            {
              id: assistantMessageId,
              role: "assistant",
              content: assistantContent,
              sources: retrievedSources.length > 0 ? retrievedSources : undefined,
              createdAt: new Date().toISOString(),
            },
          ];
        });
      }

      // Persist finalized conversation
      const finalizedMessages: StoredMessage[] = [
        ...newMessagesList,
        {
          id: assistantMessageId,
          role: "assistant",
          content: assistantContent,
          sources: retrievedSources.length > 0 ? retrievedSources : undefined,
          createdAt: new Date().toISOString(),
        },
      ];
      saveLocalMessages(activeChatId, finalizedMessages);

      // Update chat's updatedAt
      const updatedChatList = updatedChats.map((c) =>
        c.id === activeChatId ? { ...c, updatedAt: new Date().toISOString() } : c
      );
      saveLocalChats(updatedChatList);
      setChats(updatedChatList);
    } catch (err: any) {
      console.error("Chat generation failed:", err);
      const errorMessage: StoredMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: `⚠️ **Connection Error**: ${err.message || "Failed to complete inference"}.\n\nPlease verify your network or check your API keys in Settings.`,
        createdAt: new Date().toISOString(),
      };
      setMessages([...newMessagesList, errorMessage]);
      saveLocalMessages(activeChatId, [...newMessagesList, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Gemini starter suggestion prompts
  const suggestionCards = [
    {
      title: "Draft High-Speed API",
      desc: "Create a Next.js App Router route with TypeScript & caching",
      prompt: "Write a high-speed Next.js 16 App Router API endpoint in TypeScript with strict request validation, error handling, and performance caching.",
      gradient: "from-blue-500/20 to-indigo-500/10",
      border: "hover:border-blue-500/40",
      icon: "⚡",
    },
    {
      title: "Search Latest Tech News",
      desc: "Use live Tavily search to ground recent AI breakthroughs",
      prompt: "What are the latest breakthroughs and releases in generative AI and reasoning models this week?",
      gradient: "from-sky-500/20 to-teal-500/10",
      border: "hover:border-sky-500/40",
      icon: "🌐",
    },
    {
      title: "Architecture & Reasoning",
      desc: "Deep analysis for microservices and database schemas",
      prompt: "Compare PostgreSQL with Vector indexing versus dedicated vector databases like Pinecone for scalable production AI applications.",
      gradient: "from-purple-500/20 to-pink-500/10",
      border: "hover:border-purple-500/40",
      icon: "🧠",
    },
    {
      title: "Meet the Creator",
      desc: "Discover Demlabs Inc. and Luis Dem's vision for Portal.AI",
      prompt: "Tell me about Portal.AI, its developer Luis Dem, Demlabs Inc., and what makes this system unique.",
      gradient: "from-amber-500/20 to-orange-500/10",
      border: "hover:border-amber-500/40",
      icon: "✨",
    },
  ];

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === preferredModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex h-screen w-full bg-[#0b0c10] text-[#e3e3e3] overflow-hidden font-sans">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Workspace */}
      <div
        className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-[68px]"
        }`}
      >
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/5 bg-[#0e0f14]/80 backdrop-blur-md flex items-center justify-between px-4 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Model Selector Badge */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/80 transition-all cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="group-hover:text-white">{currentModelObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Grounding Indicator */}
            <button
              onClick={() => setForceSearch(!forceSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                forceSearch
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-500/20"
                  : "bg-white/[0.03] text-white/50 border border-white/5 hover:text-white/80"
              }`}
              title={forceSearch ? "Live Web Search is FORCED ON" : "Web Search is AUTOMATIC"}
            >
              <Globe className={`w-3.5 h-3.5 ${forceSearch ? "text-sky-400" : ""}`} />
              <span className="hidden sm:inline">
                {forceSearch ? "Web Search: ON" : "Web Search: Auto"}
              </span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Portal Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Chat Stream & Visualizer Container */}
        <div className="flex-1 overflow-y-auto relative flex flex-col items-center px-4 pt-4 pb-36">
          {messages.length === 0 ? (
            /* Gemini-style Zero State / Welcome Screen */
            <div className="w-full max-w-3xl my-auto py-8 flex flex-col items-center text-center space-y-6 relative z-10 animate-in fade-in duration-500">
              {/* 3D Interactive Dimension Visualizer */}
              <div className="w-48 h-48 -mb-4">
                <PortalVisualizer3D isThinking={false} intensity={1} />
              </div>

              {/* Dynamic User Greeting */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight gemini-gradient-text">
                  {getGreeting().title}
                </h1>
                <p className="text-base sm:text-lg text-white/60 font-light">
                  {getGreeting().subtitle}
                </p>
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                {suggestionCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSubmit(card.prompt)}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} bg-[#14151e]/80 border border-white/5 ${card.border} text-left transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 shadow-lg shadow-black/20`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{card.icon}</span>
                      <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider group-hover:text-indigo-300 transition-colors">
                        Prompt →
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-white/95 group-hover:text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages Stream */
            <div className="w-full max-w-3xl space-y-6 pt-2">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id || index}
                    className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 mt-1">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 ${
                        isUser
                          ? "bg-[#1f212f] border border-white/10 text-white rounded-tr-sm shadow-md"
                          : "bg-transparent text-[#e3e3e3] rounded-tl-sm w-full"
                      }`}
                    >
                      {/* Attached Files on User Message */}
                      {isUser && msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-3 pb-2 border-b border-white/10">
                          <FileAttachmentPreview attachments={msg.attachments} readOnly />
                        </div>
                      )}

                      {/* Web Search Sources Pill Grid (Gemini Style) */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mb-4 p-3 rounded-xl bg-[#141620] border border-white/5 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Tavily Search Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-white/80 hover:text-white transition-all max-w-[240px] truncate"
                                title={src.title}
                              >
                                <ExternalLink className="w-3 h-3 text-sky-400 shrink-0" />
                                <span className="truncate">{src.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content Render */}
                      {isUser ? (
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>
                      ) : (
                        <MarkdownMessage content={msg.content} />
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/80 shrink-0 mt-1">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Streaming Indicator */}
              {isGenerating && (
                <div className="flex gap-3 sm:gap-4 justify-start items-center text-xs text-white/50 animate-pulse pl-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <span className="font-medium">Portal.AI is processing and reasoning...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Gemini-Style Floating Pill Input Box */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/95 to-transparent z-20">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative rounded-3xl bg-[#181a24]/90 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 focus-within:border-indigo-500/70 transition-all shadow-2xl p-2.5 flex flex-col gap-2">
              {/* File Attachment Previews inside input box */}
              {attachments.length > 0 && (
                <div className="px-2 pt-1 border-b border-white/5">
                  <FileAttachmentPreview
                    attachments={attachments}
                    onRemove={removeAttachment}
                  />
                </div>
              )}

              {/* Textarea */}
              <div className="flex items-center px-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    attachments.length > 0
                      ? "Add instructions for attached file(s)..."
                      : "Ask Portal.AI anything, attach files, or request code..."
                  }
                  rows={1}
                  className="w-full bg-transparent text-white placeholder-white/40 text-[14.5px] resize-none focus:outline-none max-h-44 leading-relaxed font-sans"
                />
              </div>

              {/* Input Action Buttons Bar */}
              <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1">
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Attach any file, image, code, or document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Web Search Quick Toggle */}
                  <button
                    type="button"
                    onClick={() => setForceSearch(!forceSearch)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      forceSearch
                        ? "text-sky-400 bg-sky-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title={forceSearch ? "Web Search Forced On" : "Toggle Forced Web Search"}
                  >
                    <Globe className="w-4 h-4" />
                  </button>

                  {/* Voice Input Mic Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isListening
                        ? "text-rose-400 bg-rose-500/20 animate-pulse"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title={isListening ? "Listening... (Click to stop)" : "Voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={(!inputValue.trim() && attachments.length === 0) || isGenerating}
                  className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                    (inputValue.trim() || attachments.length > 0) && !isGenerating
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center mt-2">
              <span className="text-[11px] text-white/30">
                Portal.AI may produce inaccurate information. Powered by Demlabs Inc. & Luis Dem.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        preferredModel={preferredModel}
        setPreferredModel={setPreferredModel}
        customInstructions={customInstructions}
        setCustomInstructions={setCustomInstructions}
        searchAuto={searchAuto}
        setSearchAuto={setSearchAuto}
        customGroqKey={customGroqKey}
        setCustomGroqKey={setCustomGroqKey}
        customTavilyKey={customTavilyKey}
        setCustomTavilyKey={setCustomTavilyKey}
      />
    </div>
  );
}
