# AGENTS.md — AI Agent Guidance for `sanketkedare` Portfolio

> This file governs how AI agents (Copilot, Cursor, Antigravity, OpenAI Codex, etc.)
> should understand, navigate, and extend this codebase.

---

## Project Overview

| Property      | Value |
|---------------|-------|
| Framework     | **Next.js 16.2** (App Router) |
| Language      | **TypeScript 5.x** (strict mode) |
| UI Library    | **Tailwind CSS v4** + Ant Design 5 |
| Animation     | **Framer Motion 12** |
| React Version | **19.x** (Server Components enabled) |
| Bundler       | **Turbopack** (dev + build) |
| Email         | **EmailJS v4** (client-side, Contact form only) |

---

## Architecture Rules

### 1. Server vs Client Boundary
- **Default to Server Components.** Never add `'use client'` unless strictly necessary.
- A component **MUST** have `'use client'` if it uses:
  - `useState`, `useEffect`, `useRef`, `useReducer`, `useContext`
  - `document`, `window`, `localStorage`, `sessionStorage`
  - `framer-motion` (`motion.*` components)
  - Event handlers (`onClick`, `onChange`, etc.)
- Keep `'use client'` components as **leaf nodes** — push interactivity as far down the tree as possible.

### 2. Data Fetching
- Fetch data in **async Server Components** — never in `useEffect`.
- Use `'use cache'` directive with `cacheLife` and `cacheTag` for any server-side fetch:

```ts
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function fetchData() {
  'use cache';
  cacheLife('hours');
  cacheTag('my-tag');
  return fetch('...').then(r => r.json());
}
```

- On-demand revalidation: `revalidateTag('my-tag')` in a Server Action.

### 3. Routing
- This is a **single-page portfolio** — all sections live under `app/page.tsx`.
- Navigation uses **native anchor links** (`href="#section-id"`) with `scroll-behavior: smooth` in CSS.
- Do **NOT** add `react-router-dom` or any client-side router.

### 4. Styling
- **Tailwind v4** — use `@import "tailwindcss"` in `globals.css`. No `tailwind.config.js` needed for basic usage.
- **Font Family (Strict Rule):** Do NOT change or remove the font family defined in `src/app/globals.css` (`Cambria, Cochin, Georgia, Times, 'Times New Roman', serif`). This font selection is intentional and bulletproof.
- SASS files (`.scss`) have been migrated to **CSS Modules** (`.module.css`).
- Antd components require `AntdRegistry` wrapper in `app/layout.tsx` to avoid SSR flash.

### 5. TypeScript
- Strict mode is **on** (`"strict": true`). No `any` types unless explicitly justified with a comment.
- All props interfaces must be named `{ComponentName}Props`.
- Use `as const` for static data objects (e.g., `PersonalInfo`).

---

## File Map (Enterprise `src/` Directory Layout)

```
src/
  app/
    layout.tsx          Root HTML shell (Server) — Navbar, Footer, AntdRegistry
    page.tsx            Page composition (Server) — all section imports
    globals.css         Tailwind v4 + imports src/styles/index.css
  components/
    Navbar/             Client (scroll state & logo)
    Sidebar/            Client (Framer Motion)
    Home/               Client (Framer Motion)
    About/              Client (Framer Motion)
    Experience/         Client (Framer Motion timeline & highlights)
    Skills/             Server (static data) & SkillsMarquee (Client)
    Projects/           Server & ProjectsComponent (Client)
    Resume/             Server & DownloadResumeButton (Client)
    Contact/            Client (EmailJS form)
    Footer/             Server & ScrollToTopButton (Client)
    Parallax/           Client (scroll effects)
  lib/
    personal-info.ts    Static personal data (Server-safe)
  styles/
    index.css           Global font definitions (Cambria serif)
  proxy.ts              Next.js 16 Routing & Subdomain Proxy
```

---

## Commands

```bash
npm run dev         # Turbopack dev server → http://localhost:3010
npm run build       # Turbopack production build
npm run start       # Start production server
npm run lint        # ESLint with next/core-web-vitals ruleset
npm run type-check  # tsc --noEmit
```

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| `useEffect` for data fetching | `async` Server Component + `fetch` |
| `import 'react-scroll'` | Native `<a href="#id">` |
| SCSS imports at component level | CSS Modules (`*.module.css`) |
| `'use client'` on layout | Keep layout a Server Component |
| `any` TypeScript type | Explicit typed interfaces |
| `react-router-dom` `<Link>` | `next/link` `<Link>` |
| `next/image` without `alt` | Always provide meaningful `alt` |

---

## Adding New Sections

1. Create `components/NewSection/NewSection.tsx` (Server Component by default).
2. Import and mount in `app/page.tsx`.
3. Add a `<section id="new-section">` anchor in `page.tsx`.
4. Add nav link `<a href="#new-section">` in `Navbar`.
5. If interactive → add `'use client'` directive.

---

## Caching Strategy Reference

| Scope | API | Use Case |
|---|---|---|
| Static (build-time) | `export const dynamic = 'force-static'` | Fully static sections |
| Hourly | `cacheLife('hours')` | GitHub repo list, blog posts |
| Per-request | No cache | Real-time data |
| On-demand | `revalidateTag('tag')` | CMS webhook triggers |
