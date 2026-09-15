import { NextResponse } from 'next/server';
import { generateAdminGeminiResponse } from '@/lib/gemini';
import { queryLocalPlatformState } from '@/lib/admin-ai-router';
import { dbConnect, AdminChatSession } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, sessionId, history = [] } = body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A valid prompt message is required.' },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Message exceeds maximum length of 4000 characters.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    const timestampStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessageObj = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      text: trimmedMessage,
      timestamp: timestampStr,
      createdAt: new Date(),
    };

    // ── 1. Check Local-First Platform Query Router (Zero LLM Tokens) ────────
    const localResult = await queryLocalPlatformState(trimmedMessage);

    let assistantResponseText = '';
    let assistantModelUsed = '';
    let isLocalResponse = false;
    let fallbackOccurred = false;

    if (localResult) {
      assistantResponseText = localResult.text;
      assistantModelUsed = localResult.modelUsed;
      isLocalResponse = true;
    } else {
      // ── 2. Fallback to Gemini Cascade Engine ───────────────────────────────
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        assistantResponseText =
          "👋 **Welcome to your Executive Admin Copilot!**\n\n" +
          "I am your dedicated technical assistant and architecture copilot. Here is how I can assist you:\n\n" +
          "- ✉️ **Inquiry Reply Drafting**: Paste any recruiter or client message, and I'll draft a tailored response.\n" +
          "- 🏗️ **Architecture & System Design**: Discuss Next.js 16 App Router, MongoDB, and TanStack Virtual.\n" +
          "- 💼 **Client Pitch & Proposals**: Generate structured technical scopes, rate estimates, and proposals.\n" +
          "- 📄 **Resume Impact Enhancement**: Transform project bullets into quantifiable metrics using Google XYZ.\n\n" +
          "> *Tip: Configure your `GEMINI_API_KEY` in `.env.local` to enable live multi-model cascading.*";
        assistantModelUsed = 'Admin Copilot Engine (Offline Mode)';
      } else {
        const geminiRes = await generateAdminGeminiResponse(trimmedMessage, history);
        assistantResponseText = geminiRes.text;
        assistantModelUsed = geminiRes.modelUsed;
        fallbackOccurred = geminiRes.fallbackOccurred;
      }
    }

    const assistantMessageObj = {
      id: `assistant-${Date.now()}`,
      role: 'assistant' as const,
      text: assistantResponseText,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      modelUsed: assistantModelUsed,
      isLocal: isLocalResponse,
      createdAt: new Date(),
    };

    // ── 3. Persist Messages to MongoDB Chat Session ─────────────────────────
    let activeSessionId = sessionId;

    try {
      await dbConnect();

      if (activeSessionId) {
        // Append to existing session
        const existingSession = await AdminChatSession.findById(activeSessionId);
        if (existingSession) {
          existingSession.messages.push(userMessageObj as any, assistantMessageObj as any);
          existingSession.updatedAt = new Date();

          // Auto-generate title if default
          if (existingSession.title === 'New Conversation' || !existingSession.title) {
            existingSession.title = trimmedMessage.slice(0, 40) + (trimmedMessage.length > 40 ? '...' : '');
          }

          await existingSession.save();
        } else {
          // If ID not found, create new
          const created = await AdminChatSession.create({
            title: trimmedMessage.slice(0, 40) + (trimmedMessage.length > 40 ? '...' : ''),
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [userMessageObj, assistantMessageObj],
          });
          activeSessionId = created._id.toString();
        }
      } else {
        // Create new session in MongoDB
        const created = await AdminChatSession.create({
          title: trimmedMessage.slice(0, 40) + (trimmedMessage.length > 40 ? '...' : ''),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [userMessageObj, assistantMessageObj],
        });
        activeSessionId = created._id.toString();
      }
    } catch (dbErr: any) {
      console.warn('[MongoDB Chat Persistence Warning]:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      text: assistantResponseText,
      model: assistantModelUsed,
      isLocal: isLocalResponse,
      fallbackOccurred,
      sessionId: activeSessionId,
    });
  } catch (error: any) {
    console.error('[Admin Chat API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process Admin Copilot inquiry.',
      },
      { status: 500 }
    );
  }
}

