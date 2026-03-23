# CLAUDE.md — Claude AI Guidance for `sanketkedare` Portfolio

> Optimized for Claude Sonnet/Opus working with this Next.js 16.2 codebase.
> Read AGENTS.md first for general architecture rules. This file adds Claude-specific context.

---

## How to Reason About This Codebase

This is a **single-page portfolio website** migrated from Create React App to Next.js 16.2.
It is not a data-heavy application — it renders static personal information with animations.

When asked to modify or debug:
1. **Check the component's classification** (Server vs Client) in AGENTS.md before writing code.
2. **Prefer Server Components.** If you're about to write `useState`, ask: can this be static?
3. **Never import** `react-router-dom` — routing is handled by Next.js App Router and anchor links.

---

## Debugging Checklist

When something doesn't render correctly:

- [ ] Is there a `'use client'` missing on a component that uses hooks/browser APIs?
- [ ] Is Antd rendering without the `AntdRegistry` SSR wrapper in `layout.tsx`?
- [ ] Did a Framer Motion `motion.*` component land in a Server Component?
- [ ] Is `react-scroll` being used instead of native anchor links?
- [ ] Is TypeScript strict mode catching a type error (`npm run type-check`)?
- [ ] Is Turbopack's cache stale? Try `rm -rf .next && npm run dev`.

---

## Code Style Expectations

### TypeScript
```ts
// Props interfaces — always explicit
interface NavbarProps {
  transparent?: boolean;
}

// Async Server Component — preferred data fetching pattern
export default async function Projects() {
  'use cache'; // only if fetching from external API
  const data = await fetch('...');
  return <ul>...</ul>;
}

// Client component — only when required
'use client';
import { useState } from 'react';
export default function ContactForm() { ... }
```

### Tailwind
- Use utility classes directly on JSX elements.
- For Tailwind v4, no config file is needed for standard colors/spacing.
- Custom design tokens go in `globals.css` using CSS custom properties:
```css
@layer base {
  :root { --brand-purple: #3e3e7e; }
}
```

---

## Project-Specific Patterns

### Personal Data Access
```ts
// Always import from lib, never hardcode strings
import PersonalInfo from '@/lib/personal-info';
// Usage: PersonalInfo.name, PersonalInfo.linkedIn, etc.
```

### Email Sending (Contact Form)
```ts
'use client';
import emailjs from '@emailjs/browser';
// Use environment variables for service/template/public key
// NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

### Smooth Scroll Navigation
```tsx
// Navbar link — no react-scroll needed
<a href="#skills" className="nav-link">Skills</a>
// globals.css already sets html { scroll-behavior: smooth; }
```

---

## Environment Variables

Store in `.env.local` (never commit):
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

Access in Client Components: `process.env.NEXT_PUBLIC_*`

---

## Key Files to Know

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root HTML, Navbar, Footer, AntdRegistry |
| `app/page.tsx` | All section assembly |
| `app/globals.css` | Tailwind v4 import + global resets |
| `lib/personal-info.ts` | Single source of truth for all personal data |
| `next.config.ts` | Turbopack, dynamicIO, React Compiler flags |
| `AGENTS.md` | General AI agent rulebook |

---

## What NOT to Do

- ❌ Do not add `pages/` directory — this project uses App Router exclusively.
- ❌ Do not use `getServerSideProps` or `getStaticProps` — use async Server Components.
- ❌ Do not use `next/head` — use the `metadata` export from `app/layout.tsx`.
- ❌ Do not add `sass` imports directly into Server Components (CSS Modules only in RSC).
- ❌ Do not wrap the entire app in `'use client'` — this defeats Server Components.

---

## Running the Project

```bash
npm run dev         # Start Turbopack dev server
npm run type-check  # Verify TypeScript types
npm run lint        # Check ESLint rules
npm run build       # Production build with Turbopack
```
