'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CollectionsManager } from '@/components/collections/collections-manager';
import { ContentReaderDialog } from '@/components/content/content-reader-dialog';
import { IndexContentDialog } from '@/components/content/index-content-dialog';
import { ContentItem, Collection } from '@/lib/types';
import {
  fetchContentsAction,
  fetchCollectionsAction,
  createCollectionAction,
  toggleSaveAction,
  incrementViewsAction
} from '@/app/actions/content';
import { toast } from 'sonner';

export default function CollectionsPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cList, colList] = await Promise.all([
          fetchContentsAction(),
          fetchCollectionsAction()
        ]);
        setContents(cList);
        setCollections(colList);
      } catch (err) {
        console.error('Error loading collections page:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const savedItemIds = Array.from(
    new Set(collections.flatMap((col) => col.itemIds))
  );

  const handleCreateCollection = async (
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ) => {
    const col = await createCollectionAction(name, description, color, icon);
    const updatedCols = await fetchCollectionsAction();
    setCollections(updatedCols);
    return col;
  };

  const handleToggleSave = async (contentId: string, collectionId: string) => {
    const res = await toggleSaveAction(contentId, collectionId);
    const updatedCols = await fetchCollectionsAction();
    setCollections(updatedCols);
    return res;
  };

  const handleBookmarkContent = async (item: ContentItem) => {
    const targetColId = collections[0]?.id;
    if (targetColId) {
      await handleToggleSave(item.id, targetColId);
    }
  };

  const handleSelectContent = (item: ContentItem) => {
    setSelectedItem(item);
    incrementViewsAction(item.id).catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header
        onOpenIndexModal={() => setIsIndexModalOpen(true)}
        savedCount={savedItemIds.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionsManager
          collections={collections}
          contents={contents}
          onCreateCollection={handleCreateCollection}
          onToggleSave={handleToggleSave}
          onSelectContent={handleSelectContent}
          onBookmarkContent={handleBookmarkContent}
          savedItemIds={savedItemIds}
        />
      </main>

      <Footer />

      <ContentReaderDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBookmark={handleBookmarkContent}
        isSaved={selectedItem ? savedItemIds.includes(selectedItem.id) : false}
      />

      <IndexContentDialog
        isOpen={isIndexModalOpen}
        onClose={() => setIsIndexModalOpen(false)}
        onSuccess={(newItem) => {
          setContents((prev) => [newItem, ...prev]);
        }}
      />
    </div>
  );
}
