export type ContentType = 'article' | 'video' | 'documentation' | 'code_snippet' | 'tutorial';
export type TechnicalDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ContentItem {
  id: string;
  title: string;
  url: string;
  source: string;
  author?: string;
  summary: string;
  keyTakeaways: string[];
  category: string;
  contentType: ContentType;
  readTime: string;
  difficulty: TechnicalDifficulty;
  relevanceScore: number;
  views: number;
  tags: string[];
  createdAt: string;
  imageUrl?: string;
  rawContent?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string; // e.g. 'indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'
  icon: string; // e.g. 'folder', 'bookmark', 'code', 'cpu', 'star', 'sparkles'
  createdAt: string;
  itemIds: string[]; // List of content IDs in this collection
}

export interface SavedItem {
  id: string;
  collectionId: string;
  contentId: string;
  notes?: string;
  savedAt: string;
}

export interface SearchIntent {
  query: string;
  expandedQuery: string;
  primaryIntent: string;
  extractedTopics: string[];
  recommendedLevel: TechnicalDifficulty;
  suggestedFormats: ContentType[];
  searchKeywords: string[];
  aiReasoning: string;
}

export interface SearchResult {
  items: (ContentItem & { matchScore?: number; matchExplanation?: string })[];
  intent?: SearchIntent;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  contentType: ContentType | 'all';
  sortBy: 'relevance' | 'newest' | 'views' | 'score';
  difficulty: TechnicalDifficulty | 'all';
}
