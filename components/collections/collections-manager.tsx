'use client';

import React, { useState } from 'react';
import { Collection, ContentItem } from '@/lib/types';
import { ContentCard } from '../content/content-card';
import {
  Folder,
  Bookmark,
  Plus,
  Trash2,
  Sparkles,
  Code,
  Cpu,
  Star,
  Check,
  FolderPlus,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface CollectionsManagerProps {
  collections: Collection[];
  contents: ContentItem[];
  onCreateCollection: (name: string, description?: string, color?: string, icon?: string) => Promise<Collection>;
  onToggleSave: (contentId: string, collectionId: string) => Promise<{ saved: boolean }>;
  onSelectContent: (item: ContentItem) => void;
  onBookmarkContent: (item: ContentItem) => void;
  savedItemIds: string[];
}

const COLORS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-500' }
];

const ICONS = [
  { id: 'folder', label: 'Folder', icon: Folder },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'sparkles', label: 'AI', icon: Sparkles },
  { id: 'cpu', label: 'System', icon: Cpu },
  { id: 'star', label: 'Star', icon: Star }
];

export function CollectionsManager({
  collections,
  contents,
  onCreateCollection,
  onToggleSave,
  onSelectContent,
  onBookmarkContent,
  savedItemIds
}: CollectionsManagerProps) {
  const [selectedColId, setSelectedColId] = useState<string | null>(collections[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColColor, setNewColColor] = useState('indigo');
  const [newColIcon, setNewColIcon] = useState('folder');
  const [isCreating, setIsCreating] = useState(false);

  const selectedCollection = collections.find((c) => c.id === selectedColId);

  const collectionContents = contents.filter((item) =>
    selectedCollection?.itemIds.includes(item.id)
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    setIsCreating(true);
    try {
      const created = await onCreateCollection(
        newColName.trim(),
        newColDesc.trim() || undefined,
        newColColor,
        newColIcon
      );
      toast.success(`Collection "${created.name}" created!`);
      setSelectedColId(created.id);
      setNewColName('');
      setNewColDesc('');
      setShowCreateModal(false);
    } catch {
      toast.error('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return Code;
      case 'sparkles':
        return Sparkles;
      case 'cpu':
        return Cpu;
      case 'star':
        return Star;
      default:
        return Folder;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Saved Collections</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Organize bookmarked articles, documentation, videos, and tutorials into custom AI study lists.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Main Layout: Collection Sidebar & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Collection Selector Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-1">
            Your Collections ({collections.length})
          </h3>

          <div className="space-y-2">
            {collections.map((col) => {
              const IconComp = getCollectionIcon(col.icon);
              const isSelected = col.id === selectedColId;

              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-zinc-900 dark:text-zinc-100 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-500/30">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1">{col.name}</h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {col.description || 'Custom Collection'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
                    {col.itemIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Collection Contents View */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCollection ? (
            <div>
              {/* Collection Banner Header */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {selectedCollection.itemIds.length} Saved Items
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    {selectedCollection.name}
                  </h2>
                  {selectedCollection.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {selectedCollection.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              {collectionContents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collectionContents.map((item) => (
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
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    This collection is empty
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Browse content on the Discover page and click the bookmark icon to add articles to this collection!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Select a collection on the left to view saved contents.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Create New Collection
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Collection Name <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g., Web Dev 2026 or AI Research"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="Brief description of items saved in this collection..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Icon
                </label>
                <div className="flex gap-2">
                  {ICONS.map((i) => {
                    const IconComp = i.icon;
                    return (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => setNewColIcon(i.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          newColIcon === i.id
                            ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newColName.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
