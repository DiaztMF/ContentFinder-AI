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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        return { label: 'Video', icon: Video, color: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20' };
      case 'documentation':
        return { label: 'Docs', icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'code_snippet':
        return { label: 'Code', icon: Code, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'tutorial':
        return { label: 'Tutorial', icon: GraduationCap, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      default:
        return { label: 'Article', icon: FileText, color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
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
    <Card
      onClick={() => onSelect(item)}
      className="group relative bg-card border-border rounded-2xl p-5 shadow-xs dark:shadow-xl hover:border-primary/50 hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      <CardHeader className="p-0 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Content Type Badge */}
            <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-xs font-semibold ${badge.color}`}>
              <IconComponent className="size-3.5" />
              <span>{badge.label}</span>
            </Badge>

            {/* Category */}
            <Badge variant="secondary" className="text-xs font-medium bg-muted text-muted-foreground border-border">
              {item.category}
            </Badge>

            {/* Difficulty */}
            <Badge variant="outline" className={`text-[10px] font-bold ${getDifficultyBadge(item.difficulty)}`}>
              {item.difficulty}
            </Badge>
          </div>

          {/* Bookmark CTA */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(item);
            }}
            className={`rounded-xl transition-colors cursor-pointer ${
              isSaved
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title={isSaved ? 'Saved in collection' : 'Bookmark content'}
          >
            <Bookmark className={`size-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Title */}
        <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {item.title}
        </CardTitle>

        {/* AI Match Explanation */}
        {item.matchExplanation && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-xs text-primary dark:text-blue-300 flex items-start gap-2">
            <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed italic text-[11px]">
              &quot;{item.matchExplanation}&quot;
            </p>
          </div>
        )}

        {/* Summary */}
        <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {item.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 pt-3 space-y-3">
        {/* Key Takeaways Highlights */}
        {item.keyTakeaways && item.keyTakeaways.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-muted-foreground">
              Key Takeaways:
            </span>
            <ul className="space-y-1">
              {item.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                <li key={idx} className="text-xs text-foreground/90 flex items-start gap-1.5 line-clamp-1">
                  <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 pt-4 border-t border-border flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {/* Match Score Badge */}
          <div className="flex items-center gap-1 font-bold text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            <Sparkles className="size-3 text-primary" />
            <span>{matchScore}% Match</span>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-1 text-muted-foreground font-medium">
            <Clock className="size-3" />
            <span>{item.readTime}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground rounded-lg"
            title="Share content link"
          >
            <Share2 className="size-3.5" />
          </Button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg"
            title="Visit source website"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
