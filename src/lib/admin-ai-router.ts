import { dbConnect, Inquiry, Resume } from '@/lib/mongodb';
import PersonalInfo from '@/lib/personal-info';

export interface LocalQueryResult {
  text: string;
  modelUsed: string;
  isLocal: boolean;
}

/**
 * Local-First Platform Query Engine
 *
 * Inspects incoming admin prompts for deterministic queries regarding:
 * - Unread / pending / total contact inquiries in MongoDB
 * - Active resume status & Cloudinary URL
 * - Database health & connection latency
 * - Portfolio tech stack & flagship projects
 *
 * Returns structured markdown if a match is found (0 LLM tokens, 0ms API latency).
 * Returns `null` if the prompt requires generative reasoning / email drafting.
 */
export async function queryLocalPlatformState(prompt: string): Promise<LocalQueryResult | null> {
  const p = prompt.trim().toLowerCase();
  const cleanP = p
    .replace(/^(hey|hi|hello)\s+(copilot|assistant|bot|ai)\s*/i, '$1')
    .replace(/[!.,?~:;)\-_/\\#]/g, '')
    .trim();

  // ──────────────────────────────────────────────────────────────────────────
  // 0. GREETINGS & CASUAL SALUTATIONS (Zero LLM Tokens)
  // ──────────────────────────────────────────────────────────────────────────
  const isGreetingQuery =
    /^(hi+|hey+|hello+|hola|howdy|yo+|sup|what'?s up|namaste|greetings|hi there|hey there|hello there|hi how are you|hey how are you|hello how are you)$/i.test(cleanP) ||
    /^(good (morning|afternoon|evening|day|night))$/i.test(cleanP) ||
    /^(how are you|how are you doing|how's it going|hows it going|what can you do|who are you|help|commands|menu)$/i.test(cleanP);

  const isThanksQuery =
    /^(thanks|thank you|thx|ty|thank you so much|thanks a lot|great|awesome|cool|nice|ok|okay|got it|perfect|done)$/i.test(cleanP);

  const isGoodbyeQuery =
    /^(bye|goodbye|see you|cya|catch you later|take care)$/i.test(cleanP);

  if (isGreetingQuery) {
    const currentHour = new Date().getHours();
    const timeGreeting =
      currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
    const firstName = PersonalInfo.name.split(' ')[0];

    return {
      text:
        `👋 **${timeGreeting}, ${firstName}!** I'm your Executive Admin Copilot & Platform Intelligence Hub.\n\n` +
        `I am connected directly to your MongoDB database, resume CDN, and portfolio microservices. How can I assist you today?\n\n` +
        `### ⚡ Quick Zero-Token Actions:\n` +
        `- 📬 **Inbox Telemetry**: Ask *"How many unread messages do I have?"* or *"Show unread emails"*\n` +
        `- 📄 **Resume Status**: Ask *"What is my active resume status and link?"*\n` +
        `- 🟢 **Database Health**: Ask *"Check MongoDB database health and latency"*\n` +
        `- 🛠️ **Platform Tech Stack**: Ask *"What is my tech stack?"*\n\n` +
        `### 🤖 AI Copilot Reasoning & Drafting:\n` +
        `- ✉️ *"Draft a recruiter reply for a Senior Full Stack Engineer role"*\n` +
        `- 🚀 *"Write 4 high-impact resume bullets with Google XYZ formula for React 19 / Next 16"*\n` +
        `- 💼 *"Generate a technical consulting proposal for App Router architecture"*`,
      modelUsed: 'Local Platform Engine (0 LLM Tokens)',
      isLocal: true,
    };
  }

  if (isThanksQuery) {
    const firstName = PersonalInfo.name.split(' ')[0];
    return {
      text:
        `🤝 **You're welcome, ${firstName}!**\n\n` +
        `Let me know if you need to draft replies, check incoming inquiries, or inspect system telemetry. I'm always on standby!`,
      modelUsed: 'Local Platform Engine (0 LLM Tokens)',
      isLocal: true,
    };
  }

  if (isGoodbyeQuery) {
    return {
      text:
        `👋 **Goodbye!** All chat history and admin telemetry remain securely saved in MongoDB. Have a productive day!`,
      modelUsed: 'Local Platform Engine (0 LLM Tokens)',
      isLocal: true,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. INQUIRIES & INBOX QUERIES (Zero LLM Tokens)
  // ──────────────────────────────────────────────────────────────────────────
  const isMessageRelated = /(message|email|inquir|mail|inbox|submission|contact)/i.test(p);
  const isUnreadKeyword = /(unread|not.*(read|rade)|un-read|new)/i.test(p);
  const isPendingKeyword = /(pending|unreplied|not.*replied|un-replied|waiting)/i.test(p);
  const isRecycleKeyword = /(recycle|trash|deleted|bin|archived)/i.test(p);
  const isCountOrList = /(how many|count|number|total|any|status|summary|list|show|get|tell|check|give|view|latest|recent)/i.test(p);

  // Match: Unread inquiries (order-independent: "how many unread messages" OR "how many messages ... not read")
  const isUnreadQuery =
    (isUnreadKeyword && (isMessageRelated || isCountOrList)) ||
    /^(unread|un-read|unread messages|unread emails|unread inquiries)\??$/i.test(cleanP);

  // Match: Pending inquiries
  const isPendingQuery =
    (isPendingKeyword && (isMessageRelated || isCountOrList)) ||
    /^(pending|pending messages|pending replies|pending inquiries)\??$/i.test(cleanP);

  // Match: Recycle bin / deleted
  const isRecycleBinQuery =
    (isRecycleKeyword && (isMessageRelated || isCountOrList)) ||
    /^(recycle|recycle bin|trash|deleted messages)\??$/i.test(cleanP);

  // Match: Inbox overview / total count
  const isInboxOverviewQuery =
    (isMessageRelated && isCountOrList && !/(draft|reply|respond|write|compose)/i.test(p)) ||
    /^(inbox|messages|inquiries|emails|inbox status|messages status|inbox summary)\??$/i.test(cleanP);

  // Match: Latest inquiry received
  const isLatestMessageQuery =
    /(who sent|show|latest|recent|last).*(message|email|inquiry|contact submission)/i.test(p) &&
    !/(draft|reply|respond|write|compose)/i.test(p);

  if (isUnreadQuery || isPendingQuery || isInboxOverviewQuery || isLatestMessageQuery || isRecycleBinQuery) {
    try {
      await dbConnect();

      const [unreadCount, pendingCount, totalActive, recycleCount, latestInquiries] = await Promise.all([
        Inquiry.countDocuments({ read: false, deleted: { $ne: true } }),
        Inquiry.countDocuments({ replied: false, deleted: { $ne: true } }),
        Inquiry.countDocuments({ deleted: { $ne: true } }),
        Inquiry.countDocuments({ deleted: true }),
        Inquiry.find({ deleted: { $ne: true } }).sort({ createdAt: -1 }).limit(3).lean() as Promise<any[]>,
      ]);

      if (isUnreadQuery) {
        if (unreadCount === 0) {
          return {
            text:
              `📬 **Inbox Status**: You have **0 unread messages**!\n\n` +
              `All **${totalActive}** active inquiries in your MongoDB collection have been reviewed. ` +
              `(${pendingCount} pending reply).`,
            modelUsed: 'Local Platform Engine (0 LLM Tokens)',
            isLocal: true,
          };
        }

        const unreadList = await Inquiry.find({ read: false, deleted: { $ne: true } })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean() as any[];

        let response =
          `📬 **You have ${unreadCount} unread message${unreadCount === 1 ? '' : 's'}** in your Inbox:\n\n`;

        unreadList.forEach((inq, idx) => {
          const dateStr = new Date(inq.createdAt).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          });
          response += `${idx + 1}. **${inq.name}** (\`${inq.email}\`) — *${dateStr}*\n   > "${inq.message.slice(0, 120)}${inq.message.length > 120 ? '...' : ''}"\n\n`;
        });

        response += `\n*Tip: Go to **Inbox** (/admin/inbox) to open and send direct replies.*`;

        return {
          text: response,
          modelUsed: 'Local Platform Engine (0 LLM Tokens)',
          isLocal: true,
        };
      }

      if (isPendingQuery) {
        return {
          text:
            `⏳ **Pending Inquiries Telemetry**:\n\n` +
            `- **Pending Replies**: **${pendingCount}** inquiry${pendingCount === 1 ? '' : 's'}\n` +
            `- **Unread Messages**: **${unreadCount}**\n` +
            `- **Total Active Messages**: **${totalActive}**\n` +
            `- **In Recycle Bin**: **${recycleCount}**\n\n` +
            `*Tip: You can use the In-Portal AI Reply composer in /admin/inbox to answer recruiters.*`,
          modelUsed: 'Local Platform Engine (0 LLM Tokens)',
          isLocal: true,
        };
      }

      if (isRecycleBinQuery) {
        return {
          text:
            `🗑️ **Recycle Bin Status**:\n\n` +
            `You currently have **${recycleCount}** deleted message${recycleCount === 1 ? '' : 's'} in the Recycle Bin.\n\n` +
            `*Note: No messages are permanently deleted. You can restore them anytime in /admin/inbox.*`,
          modelUsed: 'Local Platform Engine (0 LLM Tokens)',
          isLocal: true,
        };
      }

      // Default Inbox Summary / Latest
      let summary =
        `📊 **Live Inbox Telemetry**:\n\n` +
        `- **Total Active Messages**: **${totalActive}**\n` +
        `- **Unread Messages**: **${unreadCount}**\n` +
        `- **Pending Replies**: **${pendingCount}**\n` +
        `- **Recycle Bin (Soft Deleted)**: **${recycleCount}**\n\n`;

      if (latestInquiries.length > 0) {
        summary += `**Latest Inquiries Received**:\n`;
        latestInquiries.forEach((inq, idx) => {
          const dateStr = new Date(inq.createdAt).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          });
          const statusIcon = inq.replied ? '✓ Replied' : inq.read ? 'Read' : '🔵 Unread';
          summary += `${idx + 1}. **${inq.name}** (\`${inq.email}\`) · *${statusIcon}* · *${dateStr}*\n   "${inq.message.slice(0, 100)}${inq.message.length > 100 ? '...' : ''}"\n\n`;
        });
      }

      return {
        text: summary,
        modelUsed: 'Local Platform Engine (0 LLM Tokens)',
        isLocal: true,
      };
    } catch (err: any) {
      console.warn('[Local Platform Query Error - Inquiries]:', err?.message);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. RESUME QUERIES (Zero LLM Tokens)
  // ──────────────────────────────────────────────────────────────────────────
  const isResumeKeyword = /(resume|cv)/i.test(p);
  const isResumeQuery =
    isResumeKeyword &&
    (/(active|current|link|url|download|status|show|get|where|latest|which|what is|how many|view|open)/i.test(p) ||
      /^(resume|cv|active resume|my resume|current resume)\??$/i.test(cleanP)) &&
    !/(review|analyze|bullet|keywords|rewrite|optimize|tailor|ats|format)/i.test(p);

  if (isResumeQuery) {
    try {
      await dbConnect();
      const [activeResume, totalResumes] = await Promise.all([
        Resume.findOne({ isActive: true }).lean() as Promise<any>,
        Resume.countDocuments({}),
      ]);

      if (!activeResume) {
        return {
          text:
            `📄 **Resume Telemetry**: No active resume found in MongoDB.\n\n` +
            `Upload your latest PDF in the **Resumes** tab (/admin/resume) to automatically serve it.`,
          modelUsed: 'Local Platform Engine (0 LLM Tokens)',
          isLocal: true,
        };
      }

      const uploadDate = new Date(activeResume.uploadedAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return {
        text:
          `📄 **Active Resume Telemetry**:\n\n` +
          `- **Filename**: \`${activeResume.filename}\`\n` +
          `- **Status**: **Active (Publicly Served)**\n` +
          `- **Uploaded On**: *${uploadDate}*\n` +
          `- **Total Saved Versions**: **${totalResumes}** version${totalResumes === 1 ? '' : 's'}\n` +
          `- **Cloudinary CDN Link**: [${activeResume.filename}](${activeResume.url})\n\n` +
          `*This version is dynamically served to all visitors on the public portfolio website.*`,
        modelUsed: 'Local Platform Engine (0 LLM Tokens)',
        isLocal: true,
      };
    } catch (err: any) {
      console.warn('[Local Platform Query Error - Resume]:', err?.message);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. DATABASE & SYSTEM HEALTH QUERIES (Zero LLM Tokens)
  // ──────────────────────────────────────────────────────────────────────────
  const isHealthQuery =
    /(mongodb|database|db|postgres|redis|server|backend).*(health|status|ping|latency|connected|connection|alive|state)/i.test(p) ||
    /(health|status|ping|latency|connected|state).*(mongodb|database|db)/i.test(p) ||
    /^(db|database|mongodb|db status|health check|system health|ping)\??$/i.test(cleanP);

  if (isHealthQuery) {
    try {
      const start = Date.now();
      const conn = await dbConnect();
      const latencyMs = Date.now() - start;

      const [inqCount, resumeCount] = await Promise.all([
        Inquiry.countDocuments({}),
        Resume.countDocuments({}),
      ]);

      return {
        text:
          `🟢 **Database & Infrastructure Health**:\n\n` +
          `- **MongoDB Connection**: **Connected & Healthy**\n` +
          `- **Ping Latency**: **${latencyMs} ms**\n` +
          `- **Database Host**: \`${conn.connection.host}\`\n` +
          `- **Database Name**: \`${conn.connection.name}\`\n` +
          `- **Inquiry Records**: **${inqCount}**\n` +
          `- **Resume Records**: **${resumeCount}**\n\n` +
          `All platform microservices are operating with nominal latency.`,
        modelUsed: 'Local Platform Engine (0 LLM Tokens)',
        isLocal: true,
      };
    } catch (err: any) {
      return {
        text: `🔴 **Database Health Warning**: MongoDB connection failed (${err?.message}).`,
        modelUsed: 'Local Platform Engine (0 LLM Tokens)',
        isLocal: true,
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PORTFOLIO TECH STACK & PROJECTS INFO (Zero LLM Tokens)
  // ──────────────────────────────────────────────────────────────────────────
  const isStackQuery =
    /(what is my stack|list my tech stack|what technologies|skills list|stack|tech stack|technologies)/i.test(p) &&
    !/(draft|reply|respond|write|proposal)/i.test(p);

  if (isStackQuery) {
    return {
      text:
        `🛠️ **Core Platform Engineering Stack**:\n\n` +
        `- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.x, Tailwind CSS v4, Framer Motion 12, Ant Design 5.\n` +
        `- **Backend & Database**: Node.js, Express, MongoDB (Mongoose), PostgreSQL, Redis, REST APIs, WebSockets.\n` +
        `- **Performance Algorithms**: TanStack Virtual (10,000-row virtualization), LTTB geometric downsampling (50,000+ data points at 60 FPS).\n` +
        `- **Cloud & AI**: Cloudinary CDN, Google Gemini Multi-Model Cascade, Docker, AWS (EC2, S3).\n\n` +
        `*Profile configured for **${PersonalInfo.name}** (${PersonalInfo.role}).*`,
      modelUsed: 'Local Platform Engine (0 LLM Tokens)',
      isLocal: true,
    };
  }

  // No local match -> Pass to LLM Cascade Engine
  return null;
}
