'use client';

import React from 'react';
import { SearchIntent } from '@/lib/types';
import { Terminal, Target, Layers, Tag, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchIntentCardProps {
  intent: SearchIntent;
  onClear: () => void;
}

export function SearchIntentCard({ intent, onClear }: SearchIntentCardProps) {
  return (
    <Card className="w-full overflow-hidden my-6 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex  items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider hidden sm:inline-block">
            Intent Analysis
          </span>
          <ChevronRight className="w-3 h-3 text-zinc-400 hidden sm:inline-block" />
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-[300px]">
            "{intent.query}"
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider"
        >
          [Reset]
        </button>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-zinc-200 dark:border-zinc-800">
        
        {/* Primary Learning Objective */}
        <div className="p-4 flex flex-col space-y-3 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Objective</span>
          </div>
          <p className="text-xs text-zinc-800 dark:text-zinc-300 font-medium leading-relaxed">
            {intent.primaryIntent}
          </p>
        </div>

        {/* Extracted Topics */}
        <div className="p-4 flex flex-col space-y-3 bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Topics</span>
            </div>
            <span className="text-[9px] font-mono border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 bg-zinc-50 dark:bg-zinc-900">
              {intent.recommendedLevel}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {intent.extractedTopics.map((topic, i) => (
              <Badge key={i} variant="secondary" className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-md">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="p-4 flex flex-col space-y-3 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Tag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {intent.searchKeywords.slice(0, 4).map((kw, idx) => (
              <span key={idx} className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                #{kw}
              </span>
            ))}
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 italic text-[10px] leading-snug mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-900/50">
            &quot;{intent.expandedQuery}&quot;
          </p>
        </div>
      </div>

      {/* AI Rationale Footer */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
        <div className="flex items-start gap-2 text-[11px] font-mono">
          <span className="text-zinc-400 shrink-0 select-none">&gt;</span>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold mr-2">[AI_RATIONALE]</span>
            {intent.aiReasoning}
          </p>
        </div>
      </div>
    </Card>
  );
}
