"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Sparkles, Sliders, Globe, ShieldCheck, Check } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/groq";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredModel: string;
  setPreferredModel: (model: string) => void;
  customInstructions: string;
  setCustomInstructions: (instructions: string) => void;
  searchAuto: boolean;
  setSearchAuto: (val: boolean) => void;
  customGroqKey: string;
  setCustomGroqKey: (key: string) => void;
  customTavilyKey: string;
  setCustomTavilyKey: (key: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  preferredModel,
  setPreferredModel,
  customInstructions,
  setCustomInstructions,
  searchAuto,
  setSearchAuto,
  customGroqKey,
  setCustomGroqKey,
  customTavilyKey,
  setCustomTavilyKey,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "keys" | "instructions">("general");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Persist to localStorage
    try {
      localStorage.setItem("portal_groq_key", customGroqKey);
      localStorage.setItem("portal_tavily_key", customTavilyKey);
      localStorage.setItem("portal_model", preferredModel);
      localStorage.setItem("portal_instructions", customInstructions);
      localStorage.setItem("portal_search_auto", JSON.stringify(searchAuto));
    } catch (e) {
      console.error(e);
    }
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#14161f] border border-white/10 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181a24]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">Portal.AI Settings</h3>
              <p className="text-xs text-white/50">Personalize intelligence, model engines, and API keys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/5 bg-[#12131b] px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-2.5 px-3 text-sm font-medium transition-all relative ${
              activeTab === "general"
                ? "text-white border-b-2 border-indigo-500"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Model & Search
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`pb-2.5 px-3 text-sm font-medium transition-all relative ${
              activeTab === "instructions"
                ? "text-white border-b-2 border-indigo-500"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Custom Instructions
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`pb-2.5 px-3 text-sm font-medium transition-all relative ${
              activeTab === "keys"
                ? "text-white border-b-2 border-indigo-500"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            API Credentials
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === "general" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">
                  Active AI Model
                </label>
                <div className="grid gap-2.5">
                  {AVAILABLE_MODELS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPreferredModel(m.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        preferredModel === m.id
                          ? "bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                          : "bg-[#181a24]/60 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white/90">{m.name}</span>
                          {m.recommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60">{m.description}</p>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-300/80 bg-white/5 px-2 py-1 rounded">
                        {m.speed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tavily Search Toggle */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-medium text-white/90">
                    <Globe className="w-4 h-4 text-sky-400" />
                    <span>Autonomous Web Grounding</span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Automatically trigger live Tavily search when query needs current news or data.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchAuto}
                    onChange={(e) => setSearchAuto(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                  How would you like Portal.AI to respond?
                </label>
                <p className="text-xs text-white/50 mb-3">
                  Set rules for tone, formatting preferences, coding languages, or your profession. Portal.AI will remember these across chats.
                </p>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Always respond in concise TypeScript, prioritize clean functional programming, and explain algorithms with step-by-step analogies..."
                  rows={6}
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 resize-none font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">
                  System core rules (including attribution to Luis Dem, CEO of Demlabs Inc.) remain active alongside your instructions.
                </p>
              </div>
            </div>
          )}

          {activeTab === "keys" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">
                  Groq API Key
                </label>
                <p className="text-xs text-white/40 mb-2">
                  Optional. If empty, uses server `.env` or Portal.AI intelligent fallback.
                </p>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-white/40" />
                  <input
                    type="password"
                    value={customGroqKey}
                    onChange={(e) => setCustomGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">
                  Tavily Search API Key
                </label>
                <p className="text-xs text-white/40 mb-2">
                  Optional. Powers real-time live web browsing results.
                </p>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-sky-400/50" />
                  <input
                    type="password"
                    value={customTavilyKey}
                    onChange={(e) => setCustomTavilyKey(e.target.value)}
                    placeholder="tvly-..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Keys are stored locally in your browser session for direct encrypted communication with Groq and Tavily endpoints.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#181a24] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40">Portal.AI • Demlabs Inc.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
