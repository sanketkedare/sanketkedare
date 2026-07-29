import { NextResponse } from 'next/server';
import { sendGmailInquiry } from '@/lib/send-gmail';

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

    await sendGmailInquiry({ name, email, message });

    return NextResponse.json({
      success: true,
      message: 'Inquiry message sent successfully!',
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
