import { NextResponse } from 'next/server';
import { generateGeminiResponse } from '@/lib/gemini';
import { matchPredefinedFAQ } from '@/lib/chat-faq-matcher';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    // 1. Validation & sanitization
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A valid text message is required.' },
        { status: 400 }
      );
    }

    if (message.length > 1500) {
      return NextResponse.json(
        { success: false, error: 'Message exceeds maximum length of 1500 characters.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    // 2. Zero-Token Instant FAQ & Greeting Matching
    const faqMatch = matchPredefinedFAQ(trimmedMessage);
    if (faqMatch.matched && faqMatch.response) {
      return NextResponse.json({
        success: true,
        text: faqMatch.response,
        model: 'Instant FAQ Engine (Zero-Latency)',
        isPredefined: true,
        suggestions: faqMatch.suggestions || [],
      });
    }

    // 3. Check for Gemini API key configuration
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({
        success: true,
        text:
          "Hello! 👋 I am **Sanket's Portfolio AI Assistant**.\n\n" +
          "I can help you explore everything about Sanket's technical engineering background:\n\n" +
          "- 🚀 **Core Technical Stack** (Next.js 16, React 19, Node.js, GenAI)\n" +
          "- 📁 **Architecture Case Studies** (ReactForge & CryptoDash Pro)\n" +
          "- 💼 **Engineering Tenure** at VisionTech Group\n" +
          "- 📄 **Verified Resume & Credentials**\n" +
          "- ✉️ **Direct Contact & Hiring Information**\n\n" +
          "Feel free to select one of the suggested prompts below or ask any question!",
        model: 'Portfolio Intelligence',
        isPredefined: true,
        suggestions: [
          "🚀 Core Tech Stack",
          "📁 Architecture Case Studies",
          "💼 Work Experience",
          "📄 View Resume",
          "✉️ Contact Sanket"
        ]
      });
    }

    // 4. Live Completion with Automatic Multi-Model Fallback
    const response = await generateGeminiResponse(trimmedMessage, history);

    return NextResponse.json({
      success: true,
      text: response.text,
      model: response.modelUsed,
      fallbackOccurred: response.fallbackOccurred,
      isPredefined: false,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process AI chat inquiry.',
      },
      { status: 500 }
    );
  }
}
