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
    <div className="w-full space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
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
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="documentation">Documentation</option>
            <option value="code_snippet">Code Snippets</option>
            <option value="tutorial">Tutorials</option>
          </select>

          {/* Difficulty Select */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold"
          >
            <option value="score">Sort: Relevance</option>
            <option value="newest">Sort: Newest</option>
            <option value="views">Sort: Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              No matching content found
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
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
              className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
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
