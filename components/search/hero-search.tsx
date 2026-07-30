'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  initialQuery?: string;
  onClearSearch?: () => void;
}

const SAMPLE_QUERIES = [
  'React 19 Server Actions for beginners',
  'Gemini 3.6 tool hybrid mode & grounding',
  'Tailwind CSS v4 Oxide engine rewrite',
  'System design caching patterns & Redis',
  'Retrieval Augmented Generation RAG architecture'
];

export function HeroSearch({ onSearch, isSearching = false, initialQuery = '', onClearSearch }: HeroSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="relative w-full max-w-4xl mx-auto text-center space-y-6 pt-8 pb-4">
      {/* Background Ambient Radial Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-mono uppercase tracking-wider shadow-xs backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
        <span>Gemini 3.6 Hybrid Vector RAG Search</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent leading-none"
      >
        What knowledge will you explore today?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed"
      >
        Instant AI intent analysis, 768d vector embeddings, and real-time semantic reranking across technical articles, documentation, videos, and tutorials.
      </motion.p>

      {/* Search Bar Container */}
      <motion.form
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto pt-2"
      >
        <div className="relative flex items-center bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-2 shadow-lg dark:shadow-2xl backdrop-blur-xl">
          <div className="pl-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across articles, docs, and tutorials (e.g. Next.js 15 cache)..."
            className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-medium"
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
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px] font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 shadow-2xs">
              ⌘K
            </kbd>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Reranking...</span>
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
      </motion.form>

      {/* Sample Query Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-2 flex-wrap text-xs text-zinc-500 dark:text-zinc-400 pt-2"
      >
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-semibold mr-1">Try Searching:</span>
        {SAMPLE_QUERIES.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSampleClick(sample)}
            className="px-3 py-1 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full text-xs text-zinc-700 dark:text-zinc-300 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer font-medium shadow-2xs hover:-translate-y-0.5"
          >
            {sample}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

