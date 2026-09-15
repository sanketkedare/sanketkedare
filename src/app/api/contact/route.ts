import { NextResponse } from 'next/server';
import { sendGmailInquiry } from '@/lib/send-gmail';
import { dbConnect, Inquiry } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // 1. Guarantee saving to MongoDB Inbox FIRST
    await dbConnect();
    const inquiry = await Inquiry.create({ name, email, message });

    // 2. Send Gmail notification (secondary notification, do not block DB save if SMTP fails)
    try {
      await sendGmailInquiry({ name, email, message });
    } catch (mailErr) {
      console.warn('[Contact API] Gmail notification failed (saved in MongoDB):', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry message sent successfully!',
      inquiryId: inquiry._id,
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to send inquiry message.',
      },
      { status: 500 }
    );
  }
}
