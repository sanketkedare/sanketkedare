# AGENTS.md — AI Agent Guidance for `sanketkedare-portfolio` (Public Portfolio)

> This file governs how AI agents (Copilot, Cursor, Antigravity, OpenAI Codex, etc.)
> should understand, navigate, and extend the **Public Portfolio codebase** at `https://www.sanketkedare.com`.

---

## Project Overview

| Property      | Value |
|---------------|-------|
| Target URL    | `https://www.sanketkedare.com` (Primary Apex & WWW) |
| Framework     | **Next.js 16.2** (App Router, Turbopack) |
| Language      | **TypeScript 5.x** (strict mode) |
| UI Library    | **Tailwind CSS v4** + Ant Design 5 |
| Animation     | **Framer Motion 12** |
| React Version | **19.x** (Server Components enabled) |
| Database      | **MongoDB Atlas** (Shared with Admin Portal) |
| Email Service | **EmailJS v4** (Client-side) + **Nodemailer / Gmail API** (`/api/contact`) |

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

### 2. Public Data Plane & MongoDB Integration
- **Contact Form**: Submissions post to `/api/contact` which atomically inserts inquiries into the shared MongoDB `inquiries` collection.
- **Dynamic Resume**: The public resume button queries `/api/resume` to retrieve the latest active resume PDF URL uploaded from the Admin Portal.
- **Visitor AI Assistant**: Optional interactive AI chatbot queries `/api/chat` with strict guardrails on Sanket's verified profile.

### 3. Routing & Single-Page Flow
- This is a **single-page portfolio** — all main sections live under `app/page.tsx`.
- Navigation uses **native anchor links** (`href="#section-id"`) with `scroll-behavior: smooth` in CSS.
- Do **NOT** add `react-router-dom` or any client-side router.

### 4. Styling & Typography (Strict Rules)
- **Tailwind v4** — use `@import "tailwindcss"` in `globals.css`.
- **Font Family (Strict Rule):** Do NOT change or remove the font family defined in `src/app/globals.css` (`Cambria, Cochin, Georgia, Times, 'Times New Roman', serif`). This font selection is intentional and bulletproof.
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
    api/
      contact/route.ts    POST: Inserts contact inquiry into MongoDB + sends email notification
      resume/route.ts     GET: Fetches active resume PDF from MongoDB
      chat/route.ts       POST: Public visitor AI FAQ assistant
    offline/page.tsx      PWA offline fallback
    layout.tsx            Root HTML shell (Server) — Navbar, Footer, AntdRegistry, SEO
    page.tsx              Main single-page portfolio sections composition
    globals.css           Tailwind v4 + serif font definitions
  components/
    Navbar/               Client (scroll state, desktop links & logo)
    Sidebar/              Client (mobile slide-out drawer)
    Home/                 Client (Hero section & Framer Motion intro)
    About/                Client (bio, journey & philosophy)
    Experience/           Client (work history timeline & achievements)
    Skills/               Server & SkillsMarquee (Client)
    Projects/             Server & ProjectsComponent (Client)
    Resume/               Server & DownloadResumeButton (Client dynamic downloader)
    Contact/              Client (EmailJS & MongoDB contact form)
    Footer/               Server & ScrollToTopButton (Client)
    Parallax/             Client (background ambient effects)
    Pwa/                  Client (PWA install prompts & ServiceWorker)
    Toaster/              Client (toast notification system)
  lib/
    mongodb.ts            MongoDB Atlas Mongoose connector & schemas
    personal-info.ts      Static personal data & profile content
    send-gmail.ts         Email notification dispatcher
    toast.ts              Toast notification triggers
```

---

## Commands

```bash
npm run dev         # Turbopack dev server → http://localhost:3000
npm run build       # Turbopack production build
npm run start       # Start production server
npm run lint        # ESLint with next/core-web-vitals ruleset
npm run type-check  # tsc --noEmit
```

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| `useEffect` for static data fetching | `async` Server Component + MongoDB queries |
| `import 'react-scroll'` | Native `<a href="#id">` |
| Changing Cambria serif font in `globals.css` | Keep Cambria serif font family intact |
| Hardcoding resume PDF links | Always fetch active resume dynamically via `/api/resume` |
| Adding administrative routes to this repo | Keep all admin workflows in `sanketkedare-admin` |
| Unsolicited `npm run build` or `git push` | **STRICT RULE**: Never build or push code unless explicitly requested by the user |
