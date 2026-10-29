"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Zap,
  Globe,
  Paperclip,
  Shield,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { PortalVisualizer3D } from "@/components/PortalVisualizer3D";
import { getLuisDemAge } from "@/lib/system-prompt";

export default function LandingPage() {
  const router = useRouter();

  // Check Clerk user status
  let user: any = null;
  let isSignedIn = false;
  try {
    const clerkUser = useUser();
    user = clerkUser.user;
    isSignedIn = clerkUser.isSignedIn || false;
  } catch (e) {
    // Clerk in placeholder mode
  }

  // If already signed in, check if user has visited and offer direct access
  useEffect(() => {
    if (isSignedIn) {
      // User is authenticated, keep them primed for chat
    }
  }, [isSignedIn, router]);

  const luisAge = getLuisDemAge();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e3e3e3] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white font-sans relative">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="fixed top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-pink-600/10 blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0e0f14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                Portal<span className="gemini-gradient-text">.AI</span>
              </span>
              <span className="text-[10px] text-white/40 tracking-wider uppercase font-medium">
                Next-Gen Assistance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Groq & Tavily
            </a>
            <a href="#creator" className="hover:text-white transition-colors">
              Demlabs Inc.
            </a>
          </nav>

          {/* Auth / Action CTA */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>Open Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Guest Access
                </Link>
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>Launch Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/80 mb-6 backdrop-blur-md animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Portal.AI 2.0 • Ultra-Fast Groq & Tavily Grounding</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Ultimate Access to{" "}
          <span className="gemini-gradient-text">Next-Gen Assistance</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-10">
          Engineered with the brilliance of Google Gemini. Experience instant Groq 70B reasoning, live Tavily web intelligence, multimodal file processing, and dimensional 3D visualization.
        </p>

        {/* Hero CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-14">
          <Link
            href="/chat"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Chatting Free</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Architecture</span>
          </a>
        </div>

        {/* Interactive 3D Portal Visualizer Showcase */}
        <div className="relative w-full max-w-4xl rounded-3xl bg-[#12141d]/90 border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col items-center">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="w-56 h-56 sm:w-72 sm:h-72 my-2">
            <PortalVisualizer3D intensity={1.1} interactive={true} />
          </div>

          <div className="relative z-10 text-center max-w-lg space-y-2">
            <h3 className="font-heading font-semibold text-lg text-white">
              Dimensional Quantum Visualizer
            </h3>
            <p className="text-xs sm:text-sm text-white/50">
              Interactive 3D particle sphere responding to spatial mouse movement and dynamic neural generation states in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Everything You Expect From Google Gemini, Reimagined
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Built from first principles for instant answers, grounded accuracy, and lovable interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Groq Ultra-Speed Inference
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Powered by Llama 3.3 70B and DeepSeek R1 models streaming tokens at ~300 tokens per second for lightning reasoning without lag.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Autonomous Tavily Grounding
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Intelligently detects when your query requires current information, pulls verified real-time sources, and synthesizes citations automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Paperclip className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Universal File Attachments
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Attach any file format: images, PDFs, source code (.ts, .py, .json), datasets, or text files for instant multimodal inspection.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Spotlight: Luis Dem & Demlabs Inc. */}
      <section id="creator" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#131520] to-[#12131b] border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-heading font-extrabold shadow-xl shadow-indigo-500/30 shrink-0">
              LD
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <span>The Visionary Behind Portal.AI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Luis Dem • CEO of Demlabs Inc.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Portal.AI was conceived and spearheaded by **Luis Dem**, the {luisAge}-year-old visionary founder and CEO of **Demlabs Inc.** Born on May 10, 2013, Luis exemplifies how youth and bold engineering redefine what is possible in AI assistance.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Born May 10, 2013 (Age {luisAge})
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Demlabs Inc. Founder
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Next-Gen Autonomous Architect
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
          Ready to Step Into the Next Dimension?
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
          No waiting, no friction. Experience Gemini-tier fluid intelligence with your own customizable system instructions.
        </p>
        <div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Portal.AI Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-xs text-white/40">
        <p>
          © {new Date().getFullYear()} Portal.AI • Demlabs Inc. Founded by Luis Dem. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
