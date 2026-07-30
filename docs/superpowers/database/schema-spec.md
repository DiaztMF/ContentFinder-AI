# ContentFinder-AI — Database & Schema Specification

> **Module**: Database & ORM  
> **Parent Document**: [2026-07-30-contentfinder-ai-design.md](../specs/2026-07-30-contentfinder-ai-design.md)

---

## 1. Drizzle ORM Schema Overview

The database uses **Drizzle ORM** with **Neon PostgreSQL**. Vector search is supported via the `pgvector` extension (`customType` / `vector` column type).

### Table Definitions

```typescript
// db/schema.ts
import { pgTable, text, timestamp, integer, jsonb, customType } from 'drizzle-orm/pg-core';

// Custom vector column for pgvector (768 dimensions for Gemini text-embedding-004)
export const vector768 = customType<{ data: number[] }>({
  dataType() {
    return 'vector(768)';
  },
});

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

export const contentEmbeddings = pgTable('content_embeddings', {
  contentId: text('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  embedding: vector768('embedding').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
```

---

## 2. Vector Indexing & Query SQL

### Extension & Index Creation
```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Cosine Distance HNSW Index for rapid vector similarity search
CREATE INDEX IF NOT EXISTS content_embeddings_idx 
ON content_embeddings 
USING hnsw (embedding vector_cosine_ops);
```

### Vector Cosine Distance Query Example
```sql
SELECT c.*, (1 - (ce.embedding <=> $1::vector)) AS similarity_score
FROM contents c
JOIN content_embeddings ce ON c.id = ce.content_id
ORDER BY ce.embedding <=> $1::vector ASC
LIMIT 20;
```
