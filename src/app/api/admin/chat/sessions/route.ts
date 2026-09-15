import { NextResponse } from 'next/server';
import { dbConnect, AdminChatSession } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();

    // Fetch single session by ID
    if (id) {
      const session = await AdminChatSession.findById(id).lean();
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Chat session not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, session });
    }

    // List all sessions
    const sessions = await AdminChatSession.find({})
      .sort({ updatedAt: -1 })
      .limit(50)
      .select('title createdAt updatedAt messages')
      .lean();

    const formatted = sessions.map((s: any) => ({
      _id: s._id,
      title: s.title || 'Conversation',
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: Array.isArray(s.messages) ? s.messages.length : 0,
      lastMessage: Array.isArray(s.messages) && s.messages.length > 0
        ? s.messages[s.messages.length - 1].text.slice(0, 80)
        : '',
    }));

    return NextResponse.json({ success: true, sessions: formatted });
  } catch (error: any) {
    console.error('[Admin Chat Sessions GET Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title = 'New Conversation', initialMessage } = body;

    await dbConnect();

    const messages = initialMessage ? [initialMessage] : [];

    const newSession = await AdminChatSession.create({
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages,
    });

    return NextResponse.json({ success: true, session: newSession });
  } catch (error: any) {
    console.error('[Admin Chat Sessions POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create chat session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';

    await dbConnect();

    if (id) {
      await AdminChatSession.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Chat session deleted' });
    }

    if (all) {
      await AdminChatSession.deleteMany({});
      return NextResponse.json({ success: true, message: 'All chat history cleared' });
    }

    return NextResponse.json(
      { success: false, error: 'Session ID is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Admin Chat Sessions DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete chat session' },
      { status: 500 }
    );
  }
}
