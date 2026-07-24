import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const contents = pgTable('contents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  source: text('source'),
  author: text('author'),
  summary: text('summary').notNull(),
  keyTakeaways: jsonb('key_takeaways').$type<string[]>().notNull(),
  category: text('category').notNull(),
  contentType: text('content_type').notNull(), // 'article' | 'video' | 'documentation' | 'code_snippet' | 'tutorial'
  readTime: text('read_time').default('5 min read'),
  difficulty: text('difficulty').default('Intermediate'),
  relevanceScore: integer('relevance_score').default(90),
  views: integer('views').default(0),
  imageUrl: text('image_url'),
  rawContent: text('raw_content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const contentTags = pgTable('content_tags', {
  contentId: text('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('blue'),
  icon: text('icon').default('folder'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const savedItems = pgTable('saved_items', {
  id: text('id').primaryKey(),
  collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  contentId: text('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  notes: text('notes'),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
});
