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
  Gauge,
  Clock,
  Flame,
  Search,
  Code,
  Sliders,
  Compass,
  Lock,
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
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

  useEffect(() => {
    if (isSignedIn) {
      // User is authenticated, primed for chat
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
                Ultra-Fast Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#speed" className="hover:text-white transition-colors">
              Speed Engine
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
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
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/90 mb-6 backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-indigo-300 font-semibold">Portal 2.0</span>
          <span className="text-white/30">•</span>
          <span>Ultra-Fast Intelligent Gateway</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400 font-mono text-[11px] font-semibold">&lt;80ms Response</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          The AI Portal Built for{" "}
          <span className="gemini-gradient-text">Instant Velocity & Deep Intelligence</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-10">
          Break free from lag and slow inference. Portal delivers instantaneous token streaming, autonomous real-time web intelligence, deep multimodal reasoning, and an interactive 3D spatial cognition engine.
        </p>

        {/* Hero CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-12">
          <Link
            href="/chat"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Free Portal</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <a
            href="#speed"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Explore Speed Engine</span>
          </a>
        </div>

        {/* Live Velocity Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-14 text-left">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50">First Token</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">&lt;80ms</div>
            <div className="text-[11px] text-white/40 mt-0.5">Instantaneous launch</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50">Stream Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">300+ tps</div>
            <div className="text-[11px] text-white/40 mt-0.5">Fluid zero-wait reading</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <Globe className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50">Web Knowledge</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Live</div>
            <div className="text-[11px] text-white/40 mt-0.5">Real-time web verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/50">Queue Delay</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">0.0s</div>
            <div className="text-[11px] text-white/40 mt-0.5">Direct portal routing</div>
          </div>
        </div>

        {/* Interactive 3D Portal Visualizer Showcase */}
        <div className="relative w-full max-w-4xl rounded-3xl bg-[#12141d]/90 border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col items-center">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Visualizer Status Bar */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-white/5 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-white/80">PORTAL_CORE_ONLINE</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] hidden sm:flex">
              <span>LATENCY: 12ms</span>
              <span>NODES: 120 PARTICLE MESH</span>
              <span>STATE: STREAMING READY</span>
            </div>
          </div>

          <div className="w-56 h-56 sm:w-72 sm:h-72 my-4">
            <PortalVisualizer3D intensity={1.1} interactive={true} />
          </div>

          <div className="relative z-10 text-center max-w-lg space-y-2">
            <h3 className="font-heading font-semibold text-lg text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Dimensional Quantum Visualizer</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/50">
              Interactive 3D particle sphere responding to spatial mouse movement and dynamic neural generation states in real time. Experience your assistant's cognition brought to life.
            </p>
          </div>
        </div>
      </section>

      {/* Speed Engine Section */}
      <section id="speed" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Built From First Principles For Pure Speed</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            Latency Is the Enemy of Thought
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Traditional AI chatbots make you stare at loading spinners. Portal was engineered to mirror human reaction speed with instant token streaming and parallelized execution.
          </p>
        </div>

        {/* Speed Comparison Visualizer Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {/* Legacy Side */}
          <div className="p-6 sm:p-8 rounded-3xl bg-red-950/10 border border-red-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                Traditional Chatbots
              </span>
              <span className="text-xs font-mono text-red-400/80">Avg 3,200ms Delay</span>
            </div>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span>Long queue buffers and spinning indicator before any text appears</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span>Chunked, stuttering token streaming that disrupts flow of thought</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span>Manual web searches require waiting for slow scraping cycles</span>
              </div>
            </div>
            <div className="pt-4 border-t border-red-500/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span>RESPONSE STREAM:</span>
              <span className="text-red-400 font-semibold">~25 TOKENS/SEC</span>
            </div>
          </div>

          {/* Portal Side */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#131525] to-[#11121d] border border-indigo-500/40 shadow-xl shadow-indigo-500/10 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                Portal Accelerated Engine
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">&lt;80ms First Token</span>
            </div>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Immediate token streaming the moment you hit Enter</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ultra-high throughput exceeding 300 tokens per second</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Autonomous parallel web retrieval without blocking generation</span>
              </div>
            </div>
            <div className="pt-4 border-t border-indigo-500/20 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50">RESPONSE STREAM:</span>
              <span className="text-emerald-400 font-bold">300+ TOKENS/SEC (INSTANT)</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Portal Speed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Zero-Buffer Token Streaming
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Engineered with optimized pipeline conduits to deliver immediate token-by-token output. Sentences render as fast as your brain can read.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Parallel Web Knowledge
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Portal automatically assesses when queries need live data, simultaneously scouring current web sources while synthesizing your answer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Optimized Memory Architecture
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Lightning multi-turn context retention allows long-running technical dialogues, deep code synthesis, and multi-file analysis without bogging down.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            Next-Gen Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Everything You Need In an Intelligent Portal
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            A comprehensive workspace built for researchers, developers, creators, and leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Autonomous Real-Time Grounding
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Never worry about training cutoffs. Portal automatically detects when your query requires current information, pulls verified real-time sources, and synthesizes citations automatically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Paperclip className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Universal Multimodal Analysis
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Attach any file format: images, PDFs, source code (.ts, .py, .json), datasets, or text files for instant multimodal inspection, debugging, and structured data extraction.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Custom Personas & Directives
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Tailor Portal's demeanor to your exact workflow. Choose from Executive, Technical Architect, Creative, or configure custom persistent system prompts in seconds.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Interactive Code Sandbox
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Rich syntax-highlighted code blocks with one-click copying, error debugging, refactoring tools, and language-aware formatting for 40+ programming languages.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Client-First Sovereign Security
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Your keys and prompts remain in your control. Stored encrypted in your browser session with zero unauthorized tracking, third-party reselling, or model retraining on your private data.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-[#13151f] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Dynamic Spatial Visualizer
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Fluid 3D particle sphere that pulses with neural reasoning activity, spatial cursor feedback, and state awareness. An interface designed to feel genuinely alive.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Spotlight: Luis Dem & Demlabs Inc. */}
      <section id="creator" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/5">
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Instant Access • No Delay</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Ready to Step Into the Next Dimension?
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
          No waiting, no friction. Experience Gemini-tier fluid intelligence with ultra-fast streaming responses and customizable personas.
        </p>
        <div className="pt-2">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
