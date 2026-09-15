<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:050511,50:0e1a38,100:1e1b4b&height=220&section=header&text=Sanket%20Kedare&fontSize=50&fontColor=ffffff&animation=twinkling&fontAlignY=40&desc=Full%20Stack%20Developer%20%7C%20GenAI%20%26%20System%20Design&descAlignY=62&descAlign=50" />
</p>

<div align="center">

[![Live Portfolio](https://img.shields.io/badge/Production-www.sanketkedare.com-06b6d4?style=for-the-badge&logo=vercel&logoColor=white)](https://www.sanketkedare.com)
[![Admin Console](https://img.shields.io/badge/Admin_Portal-admin.sanketkedare.com-6366f1?style=for-the-badge&logo=shield&logoColor=white)](https://admin.sanketkedare.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2_(Turbopack)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas_Cluster-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

</div>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=24&duration=2500&pause=900&color=38BDF8&center=true&vCenter=true&width=900&lines=Full+Stack+Developer+%7C+GenAI+%26+System+Design;Next.js+16+%2B+React+19+%2B+TypeScript+%2B+Node.js;Clean+Architecture+%2B+Delightful+UI+%2B+Rock-Solid+Performance" alt="Typing animation" />
</div>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=sanketkedare&label=Profile%20Views&color=0e75b6&style=for-the-badge" />
  <img src="https://img.shields.io/github/followers/sanketkedare?label=Followers&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Open%20to%20Work-Yes-0A66C2?style=for-the-badge" />
</p>

---

## 🌟 About Sanket Kedare

I am a **Full Stack Developer** specializing in **GenAI, System Design, and Scalable Web Architecture**. I build resilient, high-performance web platforms and intelligent AI-driven systems engineered for speed, clean code, and intuitive user experiences.

* 🚀 **Core Focus**: Full Stack Web Development, Generative AI integration, and Distributed System Design.
* ⚡ **Performance & DX**: Sub-second First Contentful Paint (FCP), 95+ Core Web Vitals, and strict TypeScript types.
* 🌐 **Canonical Domain**: [https://www.sanketkedare.com](https://www.sanketkedare.com) (Enforced via 308 permanent redirect & edge middleware).

---

## 🏛️ Ecosystem & Micro-Frontend Topology

The portfolio ecosystem is separated into two decoupled, high-security repositories sharing a centralized MongoDB Atlas data plane:

```mermaid
flowchart TD
    subgraph Repositories["Micro-Frontend Topology"]
        Portfolio["🌐 sanketkedare-portfolio\n(www.sanketkedare.com)\n[Public Showcase & Lead Funnel]"]
        Admin["🛡️ sanketkedare-admin\n(admin.sanketkedare.com)\n[Private Executive Management]"]
    end

    subgraph DataPlane["Shared Live Infrastructure"]
        DB[("🍃 MongoDB Atlas\n(inquiries, resumes, admin_chat_sessions)")]
        CDN[("☁️ Cloudinary CDN\n(Dynamic PDF Resumes)")]
        AI[("✨ Google Gemini API\n(Cascading AI Model Pool)")]
        SMTP[("📬 Gmail SMTP TLS\n(Direct Recruiter Dispatcher)")]
    end

    Portfolio -->|1. Submit Contact Inquiries| DB
    Portfolio -->|2. Query Active Resume Pointer| DB
    Portfolio -.->|3. Serve Streamlined PDF| CDN
    Portfolio -->|4. Interactive AI Chat Assistant| AI

    Admin -->|Read, Filter & Soft-Delete Inquiries| DB
    Admin -->|Send Styled Reply Emails| SMTP
    Admin -->|Upload PDF & Switch Active Version| CDN
    Admin -->|Persist Resume Pointer & Copilot Sessions| DB
    Admin -->|Executive Copilot Reasoning| AI
```

* **Main Public Portfolio** ([sanketkedare-portfolio](https://github.com/sanketkedare/sanketkedare-portfolio)): Public showcase, interactive career timeline, enterprise deliverables, live AI chat widget, and dynamic PDF resume viewer.
* **Dedicated Executive Admin** ([sanketkedare-admin](https://github.com/sanketkedare/sanketkedare-admin)): Private command console with master SHA-256 zero-trust security gate, real-time inquiry inbox, in-portal Gmail SMTP dispatcher, Cloudinary PDF version switcher, and AI copilot.

---

## 🛠️ Tech Arsenal

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,js,nodejs,express,mongodb,tailwind,docker,aws,git,github,postman,vercel&perline=7" />
</div>

| Layer | Technologies |
| :--- | :--- |
| **Framework & UI** | Next.js 16.2 (Turbopack, App Router), React 19.1, Tailwind CSS v4, Framer Motion 12 |
| **Language & Typing** | TypeScript 5.8 (Strict Mode), ESNext, Node.js 22+ |
| **Database & Cache** | MongoDB Atlas, Mongoose 8.12, In-Memory Telemetry Cache |
| **AI & LLM Services** | Google Gemini API (2.5 Cascade), Hybrid Local 0-Token Intent Engine |
| **Media & Delivery** | Cloudinary CDN, Sharp Image Processing, Vercel Edge Network |
| **SEO & Telemetry** | Schema.org Person JSON-LD, OpenGraph 1200x630, Vercel Analytics, Canonical Edge Redirects |

---

## 📌 Featured Projects & Enterprise Deliverables

<table>
  <tr>
    <td width="50%">
      <h3>📈 CryptoDash Pro</h3>
      <p>Institutional crypto intelligence terminal with Gemini AI & LTTB downsampling (60 FPS).</p>
      <a href="https://www.cyptodashpro.sanketkedare.com/">🌐 Live Terminal</a> &bull; <a href="https://github.com/sanketkedare/CryptoDash-Pro">🔗 GitHub</a>
    </td>
    <td width="50%">
      <h3>⚒️ ReactForge</h3>
      <p>Frontend engineering lab with 100 React challenges, telemetry HUD & incident simulator.</p>
      <a href="https://www.reactforge.sanketkedare.com/">🌐 Live Studio</a> &bull; <a href="https://github.com/sanketkedare/ReactForge">🔗 GitHub</a>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🏢 VisionTech Group Ecosystem</h3>
      <p>Commercial web platforms, LMS video engines, and enterprise operations tooling.</p>
      <a href="https://www.sanketkedare.com/#projects">🌐 View Case Studies</a>
    </td>
    <td width="50%">
      <h3>🌋 Volcanic</h3>
      <p>Enterprise AI & scalable cloud software engineering platform.</p>
      <a href="https://www.volcanic.world/">🌐 Live Platform</a>
    </td>
  </tr>
</table>

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/sanketkedare/sanketkedare-portfolio.git
cd sanketkedare-portfolio

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local

# 4. Start Turbopack local development server on port 3010
npm run dev

# 5. Open in browser
# http://localhost:3010
```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js Turbopack dev server on port `3010` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production server on port `3010` |
| `npm run type-check` | Validates TypeScript types (`tsc --noEmit`) |
| `npm run lint` | Runs Next.js ESLint analyzer |

---

## 🤝 Let's Connect

* 🌐 **Live Website**: [www.sanketkedare.com](https://www.sanketkedare.com)
* 💼 **LinkedIn**: [linkedin.com/in/sanket-kedare-dev](https://www.linkedin.com/in/sanket-kedare-dev)
* 🐙 **GitHub**: [github.com/sanketkedare](https://github.com/sanketkedare)
* 📧 **Email**: [sanketkedare200@gmail.com](mailto:sanketkedare200@gmail.com)
* 📍 **Location**: Hyderabad, India (Open to Remote Worldwide & Relocation)

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e1b4b,100:050511&height=120&section=footer" />
</p>
