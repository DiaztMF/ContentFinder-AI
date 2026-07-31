'use client';

import React from 'react';
import { Sparkles, Database, Cpu, Zap, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] py-3.5 px-4 sm:px-8 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-300">ContentFinder Agent Active</span>
          <span>&mdash; Powered by Gemini 3.6 Flash</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            ENGINE: GEMINI-3.6-FLASH
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-zinc-500" />
            NODES INDEXED: 6,420,102
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-500" />
            LATENCY: 128MS
          </span>
        </div>
      </div>
    </footer>
  );
}
