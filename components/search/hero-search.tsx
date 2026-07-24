'use client';

import React, { useState } from 'react';
import { Search, Sparkles, X, ArrowRight, Loader2, Filter, Zap, Lightbulb } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  initialQuery?: string;
  onClearSearch?: () => void;
}

const SAMPLE_QUERIES = [
  'React 19 Server Actions for beginners',
  'Gemini 3 tool hybrid mode & grounding',
  'Tailwind CSS v4 Oxide engine rewrite',
  'System design caching patterns & Redis',
  'Retrieval Augmented Generation RAG architecture'
];

export function HeroSearch({ onSearch, isSearching = false, initialQuery = '', onClearSearch }: HeroSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSampleClick = (sample: string) => {
    setQuery(sample);
    onSearch(sample);
  };

  const handleClear = () => {
    setQuery('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto text-center space-y-5 pt-6 pb-2">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        <span>Gemini 3.6 Semantic Search & Discovery</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent leading-snug">
        What do you want to learn today?
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
        Search across technical articles, documentation, videos, and tutorials indexed by Gemini AI.
      </p>

      {/* Search Bar Container */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto pt-1">
        <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all p-1.5 shadow-sm dark:shadow-2xl">
          <div className="pl-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across articles, docs, and videos..."
            className="w-full bg-transparent px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 pr-1">
            <div className="hidden sm:flex px-2 py-1 items-center bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              ⌘ K
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Sample Query Chips */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-zinc-500 dark:text-zinc-400 pt-1">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold mr-1">Popular:</span>
        {SAMPLE_QUERIES.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSampleClick(sample)}
            className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer font-medium shadow-xs"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
