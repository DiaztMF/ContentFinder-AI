'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem, ContentType, TechnicalDifficulty } from '@/lib/types';
import { ContentCard } from './content-card';
import {
  SlidersHorizontal,
  Grid,
  ListFilter,
  Sparkles,
  Inbox,
  PlusCircle,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface ContentGridProps {
  items: (ContentItem & { matchScore?: number; matchExplanation?: string })[];
  onSelectContent: (item: ContentItem) => void;
  onBookmarkContent: (item: ContentItem) => void;
  savedItemIds: string[];
  onOpenIndexModal?: () => void;
}

const CATEGORIES = ['All', 'Web Dev', 'AI & ML', 'Database', 'Systems', 'Design'];

export function ContentGrid({
  items,
  onSelectContent,
  onBookmarkContent,
  savedItemIds,
  onOpenIndexModal
}: ContentGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<TechnicalDifficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'newest' | 'views'>('score');

  const filteredItems = useMemo(() => {
    let list = [...items];

    if (selectedCategory !== 'All') {
      list = list.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedType !== 'all') {
      list = list.filter((i) => i.contentType === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      list = list.filter((i) => i.difficulty === selectedDifficulty);
    }

    list.sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.matchScore ?? a.relevanceScore ?? 0;
        const scoreB = b.matchScore ?? b.relevanceScore ?? 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return list;
  }, [items, selectedCategory, selectedType, selectedDifficulty, sortBy]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-xl shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer uppercase tracking-wider ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Format, Difficulty & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Format Select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-medium bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="documentation">Docs</option>
            <option value="code_snippet">Snippets</option>
            <option value="tutorial">Tutorials</option>
          </select>

          {/* Difficulty Select */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-medium bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
          >
            <option value="score">Sort: Relevance</option>
            <option value="newest">Sort: Newest</option>
            <option value="views">Sort: Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onSelect={onSelectContent}
              onBookmark={onBookmarkContent}
              isSaved={savedItemIds.includes(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No matching content found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
              Try adjusting your category filters or submit a new link/article to index with Gemini AI!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedType('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Reset Filters
            </button>
            {onOpenIndexModal && (
              <button
                onClick={onOpenIndexModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit & Index Content</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
