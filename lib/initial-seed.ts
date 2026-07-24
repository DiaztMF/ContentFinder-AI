import { ContentItem, Collection } from './types';

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt_react19_server_actions',
    title: 'Mastering React 19 Server Actions & Async Transitions',
    url: 'https://react.dev/reference/rsc/server-actions',
    source: 'react.dev',
    author: 'React Core Team',
    summary: 'An end-to-end deep dive into React 19 Server Actions, Server Components, and seamless optimistic updates. Learn how async transitions reduce client boilerplate while boosting performance.',
    keyTakeaways: [
      'Server Actions run securely on the server without creating explicit REST endpoints.',
      'React 19 introduces useActionState and useOptimistic for immediate UI state feedback.',
      'Progressive enhancement ensures forms work even before client-side JavaScript hydration completes.',
      'Automatic revalidation keeps React Server Components synced with database updates.'
    ],
    category: 'Web Dev',
    contentType: 'documentation',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    relevanceScore: 98,
    views: 1420,
    tags: ['React 19', 'Next.js', 'Server Actions', 'Frontend', 'JavaScript'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    imageUrl: 'https://picsum.photos/seed/react19/800/450'
  },
  {
    id: 'cnt_gemini_35_architecture',
    title: 'Inside Google Gemini 3.5: Multimodal Grounding & Tool Hybrid Modes',
    url: 'https://ai.google.dev/gemini-api/docs',
    source: 'ai.google.dev',
    author: 'DeepMind Engineering',
    summary: 'Technical architecture overview of the latest Gemini 3 model series. Highlights how hybrid tool execution seamlessly combines Google Search grounding with custom function declarations.',
    keyTakeaways: [
      'Hybrid tool mode enables concurrent real-time search grounding and function calling.',
      'Thinking levels (HIGH, LOW, MINIMAL) allow developers to balance latency and complex reasoning.',
      'Native structured outputs with strict responseSchema validation ensure zero JSON parsing errors.',
      'Server-side SDK integration prevents API key leaks while maintaining low latency.'
    ],
    category: 'AI & ML',
    contentType: 'article',
    readTime: '12 min read',
    difficulty: 'Advanced',
    relevanceScore: 96,
    views: 2150,
    tags: ['Gemini API', 'AI Architecture', 'LLM', 'Machine Learning', 'Function Calling'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    imageUrl: 'https://picsum.photos/seed/gemini35/800/450'
  },
  {
    id: 'cnt_tailwind_v4_guide',
    title: 'Tailwind CSS v4 Engine Rewrite: Performance & CSS-First Config',
    url: 'https://tailwindcss.com/blog/tailwindcss-v4',
    source: 'tailwindcss.com',
    author: 'Adam Wathan',
    summary: 'Tailwind CSS v4 introduces Oxide—a Rust-powered build engine that compiles CSS up to 10x faster with pure CSS configuration replacing Javascript tailwind.config.js files.',
    keyTakeaways: [
      'Oxide engine offers 10x faster build times with zero dependencies.',
      'Configuration moves to @import "tailwindcss" in pure CSS using standard CSS variables.',
      'Full modern CSS features supported natively including container queries and @starting-style.',
      'Simplified setup with built-in PostCSS plugin @tailwindcss/postcss.'
    ],
    category: 'Web Dev',
    contentType: 'article',
    readTime: '6 min read',
    difficulty: 'Beginner',
    relevanceScore: 92,
    views: 980,
    tags: ['Tailwind CSS', 'CSS', 'Web Development', 'UI Engineering'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    imageUrl: 'https://picsum.photos/seed/tailwind4/800/450'
  },
  {
    id: 'cnt_drizzle_orm_neon',
    title: 'Building Serverless PostgreSQL Apps with Drizzle ORM & Neon',
    url: 'https://orm.drizzle.team/docs/get-started-neon',
    source: 'drizzle.team',
    author: 'Drizzle ORM Team',
    summary: 'A step-by-step tutorial on building ultra-fast serverless applications with Neon Postgres and Drizzle ORM, highlighting type-safe SQL queries and zero-overhead connection pooling.',
    keyTakeaways: [
      'Drizzle ORM provides 100% type safety with zero runtime overhead or code generation.',
      'Neon HTTP driver connects to serverless Postgres instances in milliseconds.',
      'Drizzle Kit generates human-readable SQL migrations from TypeScript schema files.',
      'Supports relational queries, transactions, and automated schema synchronization.'
    ],
    category: 'Database',
    contentType: 'tutorial',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    relevanceScore: 94,
    views: 1210,
    tags: ['PostgreSQL', 'Drizzle ORM', 'Neon DB', 'Serverless', 'TypeScript'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    imageUrl: 'https://picsum.photos/seed/drizzle/800/450'
  },
  {
    id: 'cnt_vector_search_rag',
    title: 'Retrieval Augmented Generation (RAG) Architecture Patterns in 2026',
    url: 'https://arxiv.org/abs/2312.10997',
    source: 'arxiv.org',
    author: 'Dr. Elena Vance et al.',
    summary: 'Comprehensive analysis of modern enterprise RAG architectures, comparing hybrid BM25 + dense vector embeddings, reranking models, and contextual compression strategies.',
    keyTakeaways: [
      'Hybrid search combining BM25 keyword matching with dense embeddings outperforms single-method retrieval.',
      'Cross-encoder reranking improves retrieval precision for complex multi-part queries.',
      'Contextual compression reduces token window overhead by extracting key paragraphs.',
      'Evaluation metrics like Faithfulness and Answer Relevance ensure accurate RAG output.'
    ],
    category: 'AI & ML',
    contentType: 'article',
    readTime: '15 min read',
    difficulty: 'Advanced',
    relevanceScore: 95,
    views: 1890,
    tags: ['RAG', 'Vector Search', 'Embeddings', 'AI Research', 'Python'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    imageUrl: 'https://picsum.photos/seed/ragai/800/450'
  },
  {
    id: 'cnt_system_design_caching',
    title: 'Distributed Caching Strategies: Redis vs Memcached in High-Scale Systems',
    url: 'https://highscalability.com/caching-patterns',
    source: 'highscalability.com',
    author: 'Marcus Brody',
    summary: 'System design breakdown of read-through, write-through, write-behind, and cache-aside patterns. Learn how tier 1 tech companies avoid cache stampedes and thundering herds.',
    keyTakeaways: [
      'Cache-aside pattern is ideal for read-heavy workloads with dynamic cache invalidation.',
      'Probabilistic early expiration (XFetch) effectively eliminates cache stampedes.',
      'Redis cluster sharding and read replicas distribute high-throughput traffic.',
      'Consistency guarantees require explicit TTLs and pub/sub cache invalidation hooks.'
    ],
    category: 'Systems',
    contentType: 'article',
    readTime: '11 min read',
    difficulty: 'Advanced',
    relevanceScore: 91,
    views: 1650,
    tags: ['System Design', 'Redis', 'Caching', 'Architecture', 'Backend'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    imageUrl: 'https://picsum.photos/seed/sysdesign/800/450'
  },
  {
    id: 'cnt_rust_wasm_web',
    title: 'High-Performance Web Applications with Rust and WebAssembly',
    url: 'https://rustwasm.github.io/docs/book/',
    source: 'rustwasm.github.io',
    author: 'Rust Wasm Working Group',
    summary: 'Practical guide to compiling Rust code into WebAssembly to achieve near-native execution speed in web browsers for audio processing, 3D graphics, and heavy computations.',
    keyTakeaways: [
      'WebAssembly enables Rust functions to run inside standard JavaScript runtimes.',
      'wasm-bindgen seamlessly bridges Rust memory and Javascript DOM objects.',
      'Memory sharing via SharedArrayBuffer allows multi-threaded browser computing.',
      'Ideal for heavy image processing, physics engines, and audio synthesizers.'
    ],
    category: 'Web Dev',
    contentType: 'code_snippet',
    readTime: '9 min read',
    difficulty: 'Intermediate',
    relevanceScore: 89,
    views: 840,
    tags: ['Rust', 'WebAssembly', 'Wasm', 'Performance', 'Browser'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    imageUrl: 'https://picsum.photos/seed/rustwasm/800/450'
  },
  {
    id: 'cnt_ui_ux_accessibility',
    title: 'WCAG 2.2 Design System Guidelines & Inclusive Interaction',
    url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    source: 'w3.org',
    author: 'W3C Accessibility Initiative',
    summary: 'Actionable accessibility principles for modern design systems. Covers minimum focus target sizes, keyboard navigation traps, ARIA roles, and high-contrast color math.',
    keyTakeaways: [
      'Minimum touch target size increased to 24x24px with clear spacing between controls.',
      'Focus indicators must have at least a 3:1 contrast ratio against adjacent colors.',
      'Redundant entry prevention streamlines forms by pre-filling recurring user information.',
      'Screen reader aria-live regions notify users of async content updates without losing context.'
    ],
    category: 'Design',
    contentType: 'documentation',
    readTime: '7 min read',
    difficulty: 'Beginner',
    relevanceScore: 88,
    views: 720,
    tags: ['Accessibility', 'WCAG', 'Design Systems', 'UI/UX', 'A11y'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    imageUrl: 'https://picsum.photos/seed/designsystem/800/450'
  },
  {
    id: 'cnt_next15_app_router',
    title: 'Next.js 15 App Router Best Practices: Async Request API & Caching',
    url: 'https://nextjs.org/blog/next-15',
    source: 'nextjs.org',
    author: 'Vercel Engineering',
    summary: 'Detailed explanation of breaking changes and improvements in Next.js 15, including un-cached fetch by default, async params/searchParams handling, and React 19 support.',
    keyTakeaways: [
      'Fetch requests in Next.js 15 are un-cached by default to prevent stale data surprises.',
      'Page props like params and searchParams are now asynchronous Promises.',
      'Improved build times with Turbopack for production builds.',
      'Enhanced error overlays and server component debugging tools.'
    ],
    category: 'Web Dev',
    contentType: 'video',
    readTime: '14 min video',
    difficulty: 'Intermediate',
    relevanceScore: 97,
    views: 3100,
    tags: ['Next.js 15', 'React', 'Fullstack', 'TypeScript', 'Vercel'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(),
    imageUrl: 'https://picsum.photos/seed/next15/800/450'
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col_web_dev_2026',
    name: 'Web Dev 2026',
    description: 'Essential articles and documentation on React 19, Next.js 15, and modern CSS.',
    color: 'indigo',
    icon: 'code',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    itemIds: ['cnt_react19_server_actions', 'cnt_tailwind_v4_guide', 'cnt_next15_app_router']
  },
  {
    id: 'col_ai_research',
    name: 'AI Research & LLMs',
    description: 'Deep dives into Gemini 3, RAG systems, vector embeddings, and prompt engineering.',
    color: 'violet',
    icon: 'sparkles',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    itemIds: ['cnt_gemini_35_architecture', 'cnt_vector_search_rag']
  },
  {
    id: 'col_system_architecture',
    name: 'System Architecture',
    description: 'Caching, databases, microservices, and high-performance serverless patterns.',
    color: 'emerald',
    icon: 'cpu',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    itemIds: ['cnt_drizzle_orm_neon', 'cnt_system_design_caching']
  }
];
