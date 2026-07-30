# Hybrid Vector RAG Search & Gemini AI Indexing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement pgvector vector embeddings, Gemini AI semantic search intent parsing with real-time match explanations, and dynamic content indexing pipeline.

**Architecture:** Hybrid search using Neon pgvector (768-dimension `text-embedding-004`) for fast cosine-similarity candidate retrieval, followed by a Gemini 1.5/2.5 Flash LLM pass for query intent parsing, relevance scoring (0-100), and short match explanations.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Drizzle ORM, `@neondatabase/serverless`, `@google/genai`, Tailwind CSS v4, Motion.

## Global Constraints

- **Node / Runtime**: Next.js 15 App Router with Node.js & Server Actions.
- **AI SDK**: `@google/genai` (Gemini API SDK v2.4+).
- **Database**: Drizzle ORM with `@neondatabase/serverless` (PostgreSQL with `pgvector` extension).
- **Path formatting**: Use clean relative paths for doc links.

---

### Task 1: Drizzle Database Vector Schema & Migration Setup

**Files:**
- Modify: `db/schema.ts`
- Modify: `db/index.ts`

**Interfaces:**
- Consumes: Existing `contents` table definition in `db/schema.ts`.
- Produces: `contentEmbeddings` table schema and `vector768` custom type for Drizzle ORM.

- [ ] **Step 1: Write schema update for vector embeddings**

```typescript
// db/schema.ts
import { pgTable, text, timestamp, integer, jsonb, customType } from 'drizzle-orm/pg-core';

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
  contentType: text('content_type').notNull(),
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add db/schema.ts
git commit -m "feat(db): add contentEmbeddings table schema with pgvector 768d"
```

---

### Task 2: Gemini Embeddings Service & Indexing Route Handler

**Files:**
- Modify: `lib/gemini.ts`
- Modify: `app/api/gemini/index/route.ts`

**Interfaces:**
- Consumes: `@google/genai` SDK and `GEMINI_API_KEY` env variable.
- Produces: `generateTextEmbedding(text: string): Promise<number[]>` and updated `POST /api/gemini/index` handler.

- [ ] **Step 1: Write embedding helper in `lib/gemini.ts`**

```typescript
// lib/gemini.ts snippet
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: [{ parts: [{ text }] }]
    });
    return response.embedding?.values || [];
  } catch (error) {
    console.error('Gemini Embedding Error:', error);
    return [];
  }
}
```

- [ ] **Step 2: Update `app/api/gemini/index/route.ts` to save embeddings**

Update route handler to generate summary, key takeaways, AND call `generateTextEmbedding()` to store vector in `content_embeddings` table.

- [ ] **Step 3: Test TypeScript build**

Run: `npx tsc --noEmit`  
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add lib/gemini.ts app/api/gemini/index/route.ts
git commit -m "feat(ai): integrate text-embedding-004 in gemini index route"
```

---

### Task 3: Hybrid Search API Handler & Gemini Intent Reranking

**Files:**
- Modify: `app/api/gemini/search/route.ts`
- Modify: `lib/types.ts`

**Interfaces:**
- Consumes: User search query `string`.
- Produces: `POST /api/gemini/search` response with `intent` object and `itemScores` record (`score` and `explanation`).

- [ ] **Step 1: Implement Two-Pass RAG Search in `app/api/gemini/search/route.ts`**

1. Pass 1: Parse user intent with Gemini Flash LLM.
2. Pass 2: Query candidate vector embeddings or perform keyword fallback match.
3. Pass 3: Rerank top candidate items with Gemini LLM to output contextual relevance score (0-100) and 1-sentence match explanation.

- [ ] **Step 2: Test Route Handler**

Run: `npm run lint`  
Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/gemini/search/route.ts lib/types.ts
git commit -m "feat(search): implement two-pass hybrid vector RAG and Gemini reranker"
```

---

### Task 4: UI Integration (HeroSearch & ContentCard Match Explanations)

**Files:**
- Modify: `components/content/content-card.tsx`
- Modify: `components/search/search-intent-card.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: Scored content items with `matchScore` and `matchExplanation`.
- Produces: Visual score badge, match explanation tooltip/text, and Framer Motion animated search intent card.

- [ ] **Step 1: Update `ContentCard` component to display match explanation**

Add AI relevance badge (e.g., `95% Match`) and match explanation snippet when searching.

- [ ] **Step 2: Verify Next.js dev server build**

Run: `npm run build`  
Expected: Successful static/dynamic route generation with zero build errors.

- [ ] **Step 3: Commit**

```bash
git add components/content/content-card.tsx components/search/search-intent-card.tsx app/page.tsx
git commit -m "feat(ui): display Gemini match score badge and explanation on ContentCard"
```
