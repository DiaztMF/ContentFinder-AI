'use client';

import React from 'react';
import { ContentItem } from '@/lib/types';
import {
  FileText,
  Video,
  BookOpen,
  Code,
  GraduationCap,
  Bookmark,
  ExternalLink,
  Clock,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentCardProps {
  item: ContentItem & { matchScore?: number; matchExplanation?: string };
  onSelect: (item: ContentItem) => void;
  onBookmark: (item: ContentItem) => void;
  isSaved?: boolean;
}

export function ContentCard({ item, onSelect, onBookmark, isSaved = false }: ContentCardProps) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'documentation': return BookOpen;
      case 'code_snippet': return Code;
      case 'tutorial': return GraduationCap;
      default: return FileText;
    }
  };

  const IconComponent = getContentTypeIcon(item.contentType);
  const matchScore = item.matchScore ?? item.relevanceScore ?? 90;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-start gap-4 md:gap-6"
    >
      {/* Left Column: Title & Description */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
            <IconComponent className="w-3 h-3" />
            {item.contentType === 'code_snippet' ? 'Snippet' : item.contentType}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 border-l border-zinc-300 dark:border-zinc-700 pl-2">
            {item.category}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 border-l border-zinc-300 dark:border-zinc-700 pl-2">
            {item.difficulty}
          </span>
        </div>
        
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {item.title}
        </h3>
        
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed max-w-2xl">
          {item.summary}
        </p>

        {item.matchExplanation && (
          <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 mt-2 flex items-start gap-1.5">
            <span className="text-zinc-400">&gt;</span> 
            <span className="italic line-clamp-1">{item.matchExplanation}</span>
          </p>
        )}
      </div>

      {/* Middle Column: Key Takeaways */}
      {item.keyTakeaways && item.keyTakeaways.length > 0 && (
        <div className="hidden md:flex flex-col w-64 shrink-0 space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-6">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Takeaways
          </span>
          <ul className="space-y-1">
            {item.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
              <li key={idx} className="text-[11px] text-zinc-600 dark:text-zinc-300 flex items-start gap-1.5 line-clamp-2 leading-snug">
                <span className="text-zinc-400 font-mono shrink-0">-</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Right Column: Meta & Actions */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-6 md:w-32">
        <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1">
          <div className="text-[11px] font-mono font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
            {matchScore}% Match
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
            <Clock className="w-3 h-3" />
            <span>{item.readTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:mt-auto">
          <button
            onClick={(e) => { e.stopPropagation(); onBookmark(item); }}
            className={`p-1.5 rounded-md transition-colors ${
              isSaved 
                ? 'text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800' 
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isSaved ? 'Saved in collection' : 'Bookmark content'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Share content link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Visit source website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
