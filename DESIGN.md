# ContentFinder AI - Design System & Guidelines

This document serves as the absolute source of truth for the visual design, UI architecture, and styling rules of the ContentFinder AI project. 
**For any future AI agents or developers contributing to this repository: You MUST adhere to these guidelines strictly to prevent UI degradation ("AI Slop").**

## 1. Core Aesthetic (The Vibe)
- **Theme:** Dark Tech / Pro-Tool / Industrial Minimalist.
- **Inspiration:** Vercel Dashboard, Linear app, Stripe Docs, GitHub PR logs.
- **Anti-Pattern:** Marketing landing pages. Do NOT use bubbly shapes, glowing radial backgrounds, heavy drop shadows, or gradient text. 

## 2. Color Palette (Monochrome Dominance)
- **Primary Scale:** The `zinc` scale (`zinc-50` to `zinc-950`).
- **Backgrounds:** `bg-white` (Light) and `bg-zinc-950` or `bg-[#09090b]` (Dark). Avoid off-whites or blue-tinted darks (`slate`, `gray`).
- **Text:** High contrast for primary text (`zinc-900` / `zinc-100`), muted for descriptions (`zinc-500` / `zinc-400`).
- **Accents:** Use color sparingly. Do NOT use pastel colors (emerald, sky, rose) for category badges. If a color must be used for a critical state (e.g. Error = Red), keep it flat. 

## 3. Typography Hierarchy
- **Primary Font (Sans):** Used for titles, descriptions, and readable content.
- **Metadata Font (Mono):** Used for tags, badges, system logs, dates, and small metadata. 
  - *Standard Mono Utility:* `font-mono text-[10px] sm:text-xs uppercase tracking-wider font-semibold`.
- **Data Density:** Keep text dense and compact. Avoid excessive line heights (`leading-loose`).

## 4. Layout & Grid Architecture
- **Alignment (The Invisible Line):** All main containers must share the exact same max-width to create a perfect vertical alignment line from top to bottom. Currently standardized around `max-w-5xl` or `max-w-6xl` (depending on user preference) with `mx-auto`.
- **Bento & Borders:** 
  - When grouping information, prefer "Bento Box" layouts (gapless compartments separated by 1px borders) over floating gray bubbles.
  - Use `border-zinc-200` (Light) and `border-zinc-800` (Dark) for all borders.
  - Use `divide-x` and `divide-y` for seamless data separation.

## 5. Component Patterns
- **Badges/Tags:** Must be monochrome. Example: `bg-zinc-100 text-zinc-500 dark:bg-zinc-900`. 
- **Lists:** Do not use colorful marketing checkmarks (✅). Use simple terminal-style characters like `-` or `>` for bullet points.
- **Cards:** Prefer horizontal, linear rows (Data List style) over tall, wide grids, especially for search results, as it enhances scanning speed and feels more academic/technical.
- **Buttons:** Sharp, solid colors (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`). No gradients.

## 6. Execution Rule for Agents
If asked to build a new feature:
1. Do not import random colored Lucide icons.
2. Strip out default generic Tailwind colors from templates.
3. Treat every UI element as if it is a dashboard for a senior engineer. Data > Decoration.
