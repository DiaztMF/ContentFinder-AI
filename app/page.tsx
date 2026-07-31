'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSearch } from '@/components/search/hero-search';
import { SearchIntentCard } from '@/components/search/search-intent-card';
import { ContentGrid } from '@/components/content/content-grid';
import { ContentReaderDialog } from '@/components/content/content-reader-dialog';
import { IndexContentDialog } from '@/components/content/index-content-dialog';
import { ContentItem, SearchIntent, Collection } from '@/lib/types';
import {
  fetchContentsAction,
  fetchCollectionsAction,
  toggleSaveAction,
  createCollectionAction,
  incrementViewsAction
} from '@/app/actions/content';
import { toast } from 'sonner';

export default function HomePage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);
  const [scoredItems, setScoredItems] = useState<(ContentItem & { matchScore?: number; matchExplanation?: string })[]>([]);

  // Dialog states
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);

  // Load initial contents & collections
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cList, colList] = await Promise.all([
          fetchContentsAction(),
          fetchCollectionsAction()
        ]);
        setContents(cList);
        setScoredItems(cList);
        setCollections(colList);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Collect all saved content IDs across collections
  const savedItemIds = Array.from(
    new Set(collections.flatMap((col) => col.itemIds))
  );

  // Perform AI Semantic Search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      if (res.ok && data.intent && data.itemScores) {
        setSearchIntent(data.intent);

        const updated = contents.map((item) => {
          const scoreInfo = data.itemScores[item.id];
          return {
            ...item,
            matchScore: scoreInfo ? scoreInfo.score : 50,
            matchExplanation: scoreInfo ? scoreInfo.explanation : undefined
          };
        });

        // Filter out items with very low relevance score if query is specific
        const sorted = updated.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setScoredItems(sorted);
        toast.success(`Gemini AI expanded search for "${query}"`);
      } else {
        toast.error('Search query analysis failed');
      }
    } catch {
      toast.error('Error conducting AI search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchIntent(null);
    setScoredItems(contents);
  };

  const handleSelectContent = (item: ContentItem) => {
    setSelectedItem(item);
    incrementViewsAction(item.id).catch(() => {});
  };

  const handleBookmarkContent = async (item: ContentItem) => {
    // Default save to first collection or create 'Web Dev 2026'
    let targetColId = collections[0]?.id;
    if (!targetColId) {
      const newCol = await createCollectionAction('Saved Favorites', 'Default saved items collection');
      setCollections([newCol]);
      targetColId = newCol.id;
    }

    try {
      const { saved } = await toggleSaveAction(item.id, targetColId);
      // Reload collections to update counts
      const updatedCols = await fetchCollectionsAction();
      setCollections(updatedCols);

      if (saved) {
        toast.success(`Saved "${item.title.slice(0, 30)}..." to collection!`);
      } else {
        toast.info(`Removed from collection`);
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const handleIndexSuccess = (newItem: ContentItem) => {
    setContents((prev) => [newItem, ...prev]);
    setScoredItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header
        onOpenIndexModal={() => setIsIndexModalOpen(true)}
        savedCount={savedItemIds.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Search Section */}
        <HeroSearch
          onSearch={handleSearch}
          isSearching={isSearching}
          initialQuery={searchQuery}
          onClearSearch={handleClearSearch}
        />

        {/* Gemini Intent Analysis Card */}
        {searchIntent && (
          <SearchIntentCard
            intent={searchIntent}
            onClear={handleClearSearch}
          />
        )}

        {/* Main Content Discovery Section */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {searchQuery ? `Search Results (${scoredItems.length})` : 'Explore Knowledge Index'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {searchQuery
                  ? 'Ranked by Gemini AI semantic vector matching'
                  : 'Curated articles, documentation, videos, and tutorials indexed by AI'}
              </p>
            </div>
          </div>

          <ContentGrid
            items={scoredItems}
            onSelectContent={handleSelectContent}
            onBookmarkContent={handleBookmarkContent}
            savedItemIds={savedItemIds}
            onOpenIndexModal={() => setIsIndexModalOpen(true)}
          />
        </section>
      </main>

      <Footer />

      {/* Reader Modal */}
      <ContentReaderDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBookmark={handleBookmarkContent}
        isSaved={selectedItem ? savedItemIds.includes(selectedItem.id) : false}
      />

      {/* Index Content Submission Modal */}
      <IndexContentDialog
        isOpen={isIndexModalOpen}
        onClose={() => setIsIndexModalOpen(false)}
        onSuccess={handleIndexSuccess}
      />
    </div>
  );
}
