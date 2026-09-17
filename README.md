# ContentFinder-AI

A modern content discovery and semantic search platform that indexes, organizes, and explores web content using Gemini AI and Next.js 15.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange)](https://orm.drizzle.team/)
[![Gemini](https://img.shields.io/badge/Gemini-2.0-purple)](https://ai.google.dev/)

## Installation

Clone the repository and install dependencies using pnpm:

```bash
git clone https://github.com/DiaztMF/ContentFinder-AI.git
cd ContentFinder-AI
pnpm install
```

## Quick Start

1. Create a `.env.local` file with your database and API keys:

```bash
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
```

2. Push database schema and start the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the application.

## What is ContentFinder-AI?

`ContentFinder-AI` is an AI-native content discovery engine designed to ingest, index, and organize web media, articles, and research resources. It uses Gemini semantic embeddings and natural language chat interfaces to let users discover relevant content by concept and context rather than exact keyword matches.

## Why ContentFinder-AI?

Traditional bookmark managers and content archives suffer from manual tagging overhead and keyword-only search failures. `ContentFinder-AI` combines automated content summarization, semantic clustering into collections, and an interactive conversational AI layer to retrieve knowledge instantly.

## API / Routes

### Server Actions
- `searchContentAction(query, options)`: Performs vector and relational search over curated resources.
- `saveToCollectionAction(contentId, collectionId)`: Organizes discovery items into custom user collections.

### Route Handlers
- `POST /api/gemini/search`: Semantic vector query endpoint matching natural language queries to content items.
- `POST /api/gemini/chat`: Conversational RAG endpoint answering questions based on indexed materials.
- `POST /api/gemini/index`: Background ingestion pipeline analyzing and embedding new content entries.

## Examples

Semantic content query with the search endpoint:

```typescript
export async function performSemanticSearch(prompt: string) {
  const response = await fetch('/api/gemini/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: prompt, limit: 5 }),
  });

  if (!response.ok) {
    throw new Error('Semantic search failed');
  }

  const { data } = await response.json();
  return data;
}
```

## Architecture & Development Guides

- Frontend Framework: Next.js 15 App Router with React 19 and Tailwind CSS v4.
- UI & Interactions: Base UI, Motion, Sonner notifications, and Lucide icons.
- Database: Drizzle ORM configured with Neon Serverless Postgres.
- AI Pipeline: `@google/genai` client interacting with Gemini multimodal models for summarization and vector ranking.

## License

MIT License. See [LICENSE](LICENSE) for full details.