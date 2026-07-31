'use client';

import React, { useState } from 'react';
import { X, Sparkles, Link as LinkIcon, FileText, Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ContentItem } from '@/lib/types';

interface IndexContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: ContentItem) => void;
}

export function IndexContentDialog({ isOpen, onClose, onSuccess }: IndexContentDialogProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'url' && !url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    if (activeTab === 'text' && !text.trim()) {
      toast.error('Please paste or type content text');
      return;
    }

    setIsSubmitting(true);
    toast.info('Indexing content with Gemini AI...');

    try {
      const res = await fetch('/api/gemini/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: activeTab === 'url' ? url.trim() : undefined,
          title: title.trim() || undefined,
          text: activeTab === 'text' ? text.trim() : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.item) {
        toast.success('Content successfully indexed and saved!');
        onSuccess(data.item);
        setUrl('');
        setTitle('');
        setText('');
        onClose();
      } else {
        toast.error(data.error || 'Failed to index content.');
      }
    } catch {
      toast.error('Error submitting content to index.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Submit & Index Content
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gemini automatically extracts metadata, summaries & key takeaways
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Index Web Link / URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Raw Content / Text</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'url' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Article or Video URL <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://dev.to/article-title or https://youtube.com/watch?v=..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Optional Custom Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave empty for auto-generation..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Article or Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Key Learnings from Systems Architecture paper"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Raw Content / Markdown <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste article text, documentation notes, or tutorial transcript here..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-medium resize-none placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>
            </div>
          )}

          {/* AI Processing Note */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500 shrink-0 mt-0.5" />
            <span>
              Gemini AI will parse content, categorize domain, extract 4 key takeaways, estimate reading time, and store in database.
            </span>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Indexing with AI...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Index Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
