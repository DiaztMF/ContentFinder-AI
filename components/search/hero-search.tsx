'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 flex flex-col justify-center">

      <div className="max-w-3xl">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]"
        >
          What knowledge will you explore today?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mt-6 leading-relaxed max-w-2xl"
        >
          Instant AI intent analysis, 768d vector embeddings, and real-time semantic reranking across technical articles, documentation, videos, and tutorials.
        </motion.p>

        {/* Search Bar Container */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-3xl mt-10 w-full"
        >
          <div className="relative flex-1 w-full flex items-center bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-within:border-zinc-500 focus-within:ring-4 focus-within:ring-zinc-500/10 transition-all px-3 h-12 sm:h-14 shadow-sm">
            <div className="pl-2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across articles, docs, and tutorials..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-medium"
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer mr-1 rounded-full"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl active:scale-[0.98] font-semibold flex items-center justify-center gap-1.5 h-12 sm:h-14 px-6 text-sm sm:text-base shadow-sm w-full sm:w-auto shrink-0"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Wait...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.form>

        {/* Sample Query Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 flex-wrap text-xs pt-6"
        >
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mr-1">Try Searching:</span>
          {SAMPLE_QUERIES.map((sample, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              onClick={() => handleSampleClick(sample)}
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer font-medium hover:-translate-y-0.5 transition-all border-none"
            >
              {sample}
            </Badge>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

