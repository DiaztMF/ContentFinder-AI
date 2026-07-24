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
  Eye,
  Clock,
  Sparkles,
  CheckCircle2,
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
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'video':
        return { label: 'Video', icon: Video, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'documentation':
        return { label: 'Docs', icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'code_snippet':
        return { label: 'Code', icon: Code, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'tutorial':
        return { label: 'Tutorial', icon: GraduationCap, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      default:
        return { label: 'Article', icon: FileText, color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  const badge = getContentTypeBadge(item.contentType);
  const IconComponent = badge.icon;
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
      className="group relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl hover:border-blue-500/50 hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Content Type Badge */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${badge.color}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>

            {/* Category */}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {item.category}
            </span>

            {/* Difficulty */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getDifficultyBadge(item.difficulty)}`}>
              {item.difficulty}
            </span>
          </div>

          {/* Bookmark CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(item);
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSaved
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title={isSaved ? 'Saved to collection' : 'Save to collection'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
          {item.title}
        </h3>

        {/* Source & Read time */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3 font-mono">
          <span className="font-semibold text-zinc-300">
            {item.source}
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {item.readTime}
          </span>
        </div>

        {/* AI Summary Preview */}
        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
          {item.summary}
        </p>

        {/* Key Takeaways Preview */}
        {item.keyTakeaways && item.keyTakeaways.length > 0 && (
          <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-800 text-[11px] space-y-1 mb-4">
            <div className="font-semibold flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-400">
              <Sparkles className="w-3 h-3" /> Key Takeaway
            </div>
            <div className="text-zinc-300 line-clamp-1 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item.keyTakeaways[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer info & tags */}
      <div>
        {/* Match Explanation if searching */}
        {item.matchExplanation && (
          <div className="text-[11px] text-blue-300 bg-blue-500/10 p-2 rounded-lg mb-3 italic border border-blue-500/20 line-clamp-1">
            &quot;{item.matchExplanation}&quot;
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Bar: Score, Views & Actions */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-xs">
          {/* AI Match Score */}
          <div className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{matchScore}% MATCH</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <span className="flex items-center gap-1 text-[11px] font-mono">
              <Eye className="w-3.5 h-3.5" />
              {item.views}
            </span>

            <button
              onClick={handleShare}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors"
              title="Copy original link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-zinc-500 hover:text-blue-400 transition-colors"
              title="Visit original source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
