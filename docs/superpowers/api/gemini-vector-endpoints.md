# ContentFinder-AI — API & Gemini Vector Endpoints Specification

> **Module**: API & AI Specifications  
> **Parent Document**: [2026-07-30-contentfinder-ai-design.md](../specs/2026-07-30-contentfinder-ai-design.md)

---

## 1. Route Handler Specifications

### 1. `POST /api/gemini/search`

Performs intent parsing and vector-assisted semantic search reranking over indexed content.

#### Request Body
```json
{
  "query": "how to handle server actions in Next.js 15"
}
```

#### Response Body (`200 OK`)
```json
{
  "intent": {
    "query": "how to handle server actions in Next.js 15",
    "primaryGoal": "Learn implementation patterns for Server Actions in Next.js 15 App Router",
    "keyConcepts": ["Server Actions", "Next.js 15", "Form Handling", "Mutations"],
    "suggestedFilters": {
      "contentType": "tutorial",
      "difficulty": "Intermediate"
    }
  },
  "itemScores": {
    "content-id-123": {
      "score": 95,
      "explanation": "Direct tutorial on Next.js 15 server actions with form mutation examples."
    },
    "content-id-456": {
      "score": 82,
      "explanation": "Covers React 19 action hooks used alongside Next.js server actions."
    }
  }
}
```

---

### 2. `POST /api/gemini/index`

Extracts content metadata, auto-summarizes, and generates vector embeddings for new articles or URLs.

#### Request Body
```json
{
  "url": "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations",
  "title": "Server Actions and Mutations",
  "rawContent": "Optional raw text if URL scraping is unavailable..."
}
```

#### Response Body (`201 Created`)
```json
{
  "item": {
    "id": "cnt_9a8b7c6d",
    "title": "Server Actions and Mutations",
    "url": "https://nextjs.org/docs/...",
    "summary": "Official Next.js documentation covering server actions, mutation patterns, and form handling.",
    "keyTakeaways": [
      "Server Actions are asynchronous functions executed on the server.",
      "Can be invoked in Server and Client Components using startTransition.",
      "Integrates seamlessly with revalidatePath and revalidateTag."
    ],
    "category": "Web Development",
    "contentType": "documentation",
    "readTime": "6 min read",
    "difficulty": "Intermediate",
    "views": 0,
    "createdAt": "2026-07-30T10:15:00.000Z"
  }
}
```

---

### 3. `POST /api/gemini/chat`

Conversational assistant endpoint for asking natural language questions about selected content or indexed topics.

#### Request Body
```json
{
  "contentId": "cnt_9a8b7c6d",
  "messages": [
    { "role": "user", "content": "How do I revalidate data after a server action?" }
  ]
}
```

#### Response Body (`200 OK`)
```json
{
  "reply": "You can call `revalidatePath('/posts')` or `revalidateTag('posts')` inside your Server Action to trigger cache invalidation and purge stale data."
}
```

---

## 2. Gemini SDK Configuration & System Prompts

- **SDK Package**: `@google/genai`
- **Embedding Model**: `text-embedding-004` (Dimension: `768`)
- **Generative Model**: `gemini-2.5-flash` / `gemini-1.5-flash`
- **JSON Schema Output Control**: Enforced using `responseSchema` options in `@google/genai` SDK calls to guarantee deterministic JSON structural output.
