# ContentFinder-AI — Future Development Roadmap & Expansion Plan

> **Date**: 2026-07-30  
> **Status**: Proposed Expansion  
> **Parent Document**: [2026-07-30-contentfinder-ai-design.md](2026-07-30-contentfinder-ai-design.md)

---

## 1. Executive Summary & Future Vision

The core hybrid RAG architecture (pgvector + Gemini 1.5/2.5 Flash reranking) is fully operational in **ContentFinder-AI**. This roadmap outlines the next phase of advanced features designed to turn the platform into an enterprise-grade AI Knowledge Management System.

---

## 2. Strategic Roadmap Modules

### Phase 1: High-Precision Utilities & Auto-Categorization (Immediate)
1. **Dynamic Read Time & Word Metrics Calculator**: Automated parsing of article raw content to estimate reading speed (`calculateReadTime()`) and complexity indices.
2. **AI Content Summarization Helper**: Modular prompt builders and fallback formatting tools for robust Gemini AI output parsing.

### Phase 2: Automated Scraping & Web Crawler Pipeline (Short-Term)
1. **Headless Web Scraper**: Automatic extraction of main article text, open-graph metadata, and main hero images from any submitted URL.
2. **Batch URL Indexer**: Bulk import of bookmarks from Chrome, Pocket, or Raindrop.io into ContentFinder-AI collections.

### Phase 3: Advanced RAG & Multi-Modal Intelligence (Medium-Term)
1. **Multi-Modal Document Parsing**: Index PDF whitepapers, slide decks, and audio transcripts into vector embeddings.
2. **Interactive RAG Assistant Chat**: In-line floating chat interface for asking multi-document questions across entire collections.

---

## 3. Immediate TDD Target Feature

- **Target Module**: `lib/content-summary-helper.ts`
- **Responsibilities**:
  - `calculateReadTime(text: string): string` (calculates read time based on standard 200 wpm reading speed)
  - `cleanAndTruncateText(text: string, maxLength: number): string`
  - `formatKeyTakeaways(takeaways: string[]): string[]`
