/**
 * Deterministic FAQ & Quick-Response Matcher for Portfolio AI Assistant.
 * Provides instant (<5ms), zero-token-consumption answers for common queries,
 * greetings, and high-frequency portfolio topics.
 */

export interface FAQMatchResult {
  matched: boolean;
  response?: string;
  suggestions?: string[];
  intent?: string;
}

interface PatternEntry {
  intent: string;
  patterns: RegExp[];
  response: string;
  suggestions: string[];
}

const FAQ_ENTRIES: PatternEntry[] = [
  {
    intent: 'greeting',
    patterns: [
      /^(hi|hello|hey|greetings|hola|namaste|good\s*(morning|afternoon|evening))\b/i,
      /^who are you\??$/i,
      /^what can you do\??$/i,
    ],
    response: 
      "Hello! 👋 I'm **Sanket's Portfolio AI Assistant**.\n\nI'm here to answer questions about Sanket's technical architecture, production projects, engineering experience, case studies, and hiring availability.\n\nHow can I help you today?",
    suggestions: [
      "🚀 Core Tech Stack",
      "📁 Architecture Case Studies",
      "💼 Work Experience",
      "📄 View Resume",
      "✉️ Contact Sanket"
    ]
  },
  {
    intent: 'tech_stack',
    patterns: [
      /\b(tech\s*stack|technologies|skills|tools|what\s*(do\s*you|does\s*he)\s*use|languages|frameworks)\b/i,
    ],
    response:
      "### 🛠️ Sanket's Core Technical Stack\n\n" +
      "- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Ant Design 5.\n" +
      "- **Performance**: TanStack Virtual (10,000+ row virtualization), LTTB downsampling (60 FPS charting), Web Vitals telemetry.\n" +
      "- **Backend & Cloud**: Node.js, Express, REST APIs, WebSockets (throttled streaming), MongoDB, PostgreSQL, Redis, Docker, AWS (EC2, S3).\n" +
      "- **Generative AI**: Multi-model LLM cascading, structured JSON outputs, prompt orchestration pipelines, agentic workflows.\n\n" +
      "Would you like to explore his production systems or read a case study?",
    suggestions: [
      "📁 Architecture Case Studies",
      "🌟 Featured Projects",
      "💼 Work Experience"
    ]
  },
  {
    intent: 'case_studies',
    patterns: [
      /\b(case\s*stud(y|ies)|architecture\s*deep\s*dive|reactforge\s*case|crypto(dash)?\s*case)\b/i,
    ],
    response:
      "### 📁 Production Architecture Case Studies\n\n" +
      "Sanket has documented comprehensive technical case studies for his flagship systems:\n\n" +
      "1. **[ReactForge Engineering Laboratory](https://www.reactforge.sanketkedare.com/case-study)**\n" +
      "   - *Highlights*: 100 machine coding challenges, TanStack Virtual 10,000-row virtualization benchmarks, real-time Web Vitals HUD, and an interactive Production Incident Simulator with 8 real-world postmortems.\n\n" +
      "2. **[CryptoDash Pro FinTech Terminal](https://cyptodashpro.sanketkedare.com/casestudy)**\n" +
      "   - *Highlights*: Institutional FinTech trading terminal, AI market research workspace with dynamic multi-model cascading, 1.5s throttled WebSocket ticker batching, and LTTB geometric downsampling rendering 50,000+ points at 60 FPS.\n\n" +
      "Both links are accessible directly via the links above or in the [#projects](#projects) section!",
    suggestions: [
      "🚀 Core Tech Stack",
      "🌟 Featured Projects",
      "✉️ Contact Sanket"
    ]
  },
  {
    intent: 'experience',
    patterns: [
      /\b(experience|work\s*history|company|visiontech|tenure|career|jobs|how\s*much\s*experience)\b/i,
    ],
    response:
      "### 💼 Professional Experience\n\n" +
      "Sanket has been actively engineering production systems since **January 2024** (~2.5+ years of professional software engineering experience):\n\n" +
      "- **VisionTech Group** *(Jun 2025 – Present)*\n" +
      "  - **Senior Full Stack Developer** *(Jul 2026 – Present)*: Promoted to Senior Full Stack Developer, leading core platform architecture for VisionTech Academy, LMS, and EMS applications.\n" +
      "  - **Full Stack Developer** *(Jun 2025 – Jul 2026)*: Engineered SSR Next.js 16 systems, real-time MongoDB microservices, and automated grading pipelines.\n\n" +
      "- **ViaCerta Abroad** *(Feb 2025 – Jun 2025)*\n" +
      "  - Frontend Developer: Engineered interactive portals, component design systems, and cut bundle sizes by 40%.\n\n" +
      "- **Commercial Freelance Practice** *(Jan 2024 – Feb 2025)*\n" +
      "  - JavaScript Developer Freelancer: Delivered full-stack SaaS MVPs, dashboard analytics, and Stripe/Razorpay integrations.\n\n" +
      "You can explore his complete interactive timeline in the [#experience](#experience) section!",
    suggestions: [
      "📄 View Resume",
      "📁 Architecture Case Studies",
      "✉️ Contact Sanket"
    ]
  },
  {
    intent: 'resume',
    patterns: [
      /\b(resume|cv|curriculum\s*vitae|download\s*resume)\b/i,
    ],
    response:
      "### 📄 Sanket's Resume\n\n" +
      "You can view and download Sanket's verified engineering resume directly on this page:\n\n" +
      "- **Interactive Viewer & Download**: Navigate to the [#resume](#resume) section to inspect or download the latest cloud-hosted PDF.\n\n" +
      "Would you like to schedule a conversation or send an inquiry?",
    suggestions: [
      "✉️ Contact Sanket",
      "💼 Work Experience",
      "🚀 Core Tech Stack"
    ]
  },
  {
    intent: 'contact_or_hire',
    patterns: [
      /\b(hire|contact|email|phone|call|touch|reach|freelance|contract|job\s*offer)\b/i,
    ],
    response:
      "### ✉️ Get in Touch with Sanket\n\n" +
      "Sanket is currently open to full-time engineering opportunities, architectural consulting, and high-impact contracts.\n\n" +
      "- **Email**: [sanketkedare200@gmail.com](mailto:sanketkedare200@gmail.com)\n" +
      "- **Phone / WhatsApp**: [+91 8624851910](tel:+918624851910)\n" +
      "- **LinkedIn**: [linkedin.com/in/sanket-kedare-dev](https://www.linkedin.com/in/sanket-kedare-dev/)\n" +
      "- **GitHub**: [github.com/sanketkedare](https://github.com/sanketkedare)\n" +
      "- **Location**: Hyderabad, India (Open to Remote Worldwide & Relocation)\n\n" +
      "You can also use the live message form right in the [#contact](#contact) section below!",
    suggestions: [
      "📄 View Resume",
      "📁 Architecture Case Studies",
      "🚀 Core Tech Stack"
    ]
  },
  {
    intent: 'location',
    patterns: [
      /\b(where\s*(are\s*you|is\s*he)\s*(from|based|located)|location|city|country)\b/i,
    ],
    response:
      "Sanket is based in **Hyderabad, Telangana, India** 🇮🇳.\n\nHe operates seamlessly across global distributed teams, working remotely with teams across North America, Europe, and Asia-Pacific.",
    suggestions: [
      "✉️ Contact Sanket",
      "💼 Work Experience"
    ]
  }
];

/**
 * Check if the user query matches any predefined portfolio FAQ.
 */
export function matchPredefinedFAQ(message: string): FAQMatchResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return { matched: false };
  }

  for (const entry of FAQ_ENTRIES) {
    for (const pattern of entry.patterns) {
      if (pattern.test(trimmed)) {
        return {
          matched: true,
          response: entry.response,
          suggestions: entry.suggestions,
          intent: entry.intent,
        };
      }
    }
  }

  return { matched: false };
}
