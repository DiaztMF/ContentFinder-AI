# Graph Report - .  (2026-07-30)

## Corpus Check
- Corpus is ~13,971 words - fits in a single context window. You may not need a graph.

## Summary
- 213 nodes · 348 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 10
- Community 11

## God Nodes (most connected - your core abstractions)
1. `ContentItem` - 18 edges
2. `compilerOptions` - 17 edges
3. `getDb()` - 9 edges
4. `Collection` - 8 edges
5. `incrementViewsAction()` - 7 edges
6. `getAllContents()` - 7 edges
7. `fetchCollectionsAction()` - 6 edges
8. `createCollectionAction()` - 6 edges
9. `toggleSaveAction()` - 6 edges
10. `getContentById()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ContentReaderDialogProps` --references--> `ContentItem`  [EXTRACTED]
  components/content/content-reader-dialog.tsx → lib/types.ts
- `fetchContentsAction()` --calls--> `getAllContents()`  [EXTRACTED]
  app/actions/content.ts → lib/data-store.ts
- `fetchCollectionsAction()` --calls--> `getAllCollections()`  [EXTRACTED]
  app/actions/content.ts → lib/data-store.ts
- `createCollectionAction()` --calls--> `createCollection()`  [EXTRACTED]
  app/actions/content.ts → lib/data-store.ts
- `toggleSaveAction()` --calls--> `toggleSaveToCollection()`  [EXTRACTED]
  app/actions/content.ts → lib/data-store.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (36): autoprefixer, class-variance-authority, clsx, drizzle-orm, @google/genai, @hookform/resolvers, useIsMobile(), lucide-react (+28 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (27): deleteContentAction(), getContentByIdAction(), indexContentAction(), POST(), POST(), POST(), getDb(), collections (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (23): CollectionsManager(), CollectionsManagerProps, COLORS, ICONS, ContentCard(), ContentCardProps, CATEGORIES, ContentGrid() (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (19): createCollectionAction(), fetchCollectionsAction(), fetchContentsAction(), incrementViewsAction(), toggleSaveAction(), CollectionsPage(), HomePage(), ChatMessage (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): drizzle-kit, eslint, eslint-config-next, firebase-tools, devDependencies, drizzle-kit, eslint, eslint-config-next (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (6): metadata, ThemeProvider(), Toaster(), extends, nextConfig, next

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, dev, lint, start (+1 more)

## Knowledge Gaps
- **79 isolated node(s):** `extends`, `metadata`, `COLORS`, `ICONS`, `CATEGORIES` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 0` to `Community 7`?**
  _High betweenness centrality (0.359) - this node is a cross-community bridge._
- **Why does `react` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Why does `useIsMounted()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.293) - this node is a cross-community bridge._
- **What connects `extends`, `metadata`, `COLORS` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12941176470588237 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11330049261083744 - nodes in this community are weakly interconnected._