'use client';

import React from 'react';
import { SearchIntent } from '@/lib/types';
import { Sparkles, Target, Layers, Tag, HelpCircle, CheckCircle2 } from 'lucide-react';

interface SearchIntentCardProps {
  intent: SearchIntent;
  onClear: () => void;
}

export function SearchIntentCard({ intent, onClear }: SearchIntentCardProps) {
  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              Gemini AI Intent Analysis
            </h3>
            <p className="text-xs text-zinc-400">
              Query: &quot;<span className="font-semibold text-blue-400">{intent.query}</span>&quot;
            </p>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-zinc-400 hover:text-zinc-100 underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>

      {/* Intent Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Primary Learning Objective */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-blue-400">
            <Target className="w-3.5 h-3.5" />
            <span>Primary Learning Objective</span>
          </div>
          <p className="text-zinc-300 font-medium leading-relaxed">
            {intent.primaryIntent}
          </p>
        </div>

        {/* Extracted Topics & Level */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Extracted Topics
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[10px]">
              {intent.recommendedLevel} Depth
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {intent.extractedTopics.map((topic, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-700/60">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Query Expansion & Keywords */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center gap-1 font-semibold text-blue-400">
            <Tag className="w-3.5 h-3.5" />
            <span>Semantic Expansion Keywords</span>
          </div>
          <p className="text-zinc-400 italic text-[11px] leading-snug">
            &quot;{intent.expandedQuery}&quot;
          </p>
          <div className="flex flex-wrap gap-1 text-[10px] text-zinc-400">
            {intent.searchKeywords.slice(0, 4).map((kw, idx) => (
              <span key={idx} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Rationale */}
      <div className="text-[11px] text-zinc-400 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/80 flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">AI Match Rationale: </span>
          <span>{intent.aiReasoning}</span>
        </div>
      </div>
    </div>
  );
}
