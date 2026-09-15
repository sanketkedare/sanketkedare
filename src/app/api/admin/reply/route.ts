import { NextResponse } from 'next/server';
import { sendGmailReply } from '@/lib/send-gmail';
import { dbConnect, Inquiry } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inquiryId, toEmail, toName, subject, replyMessage, originalMessage } = body;

    if (!toEmail || !replyMessage || !replyMessage.trim()) {
      return NextResponse.json(
        { success: false, error: 'Recipient email and reply message are required.' },
        { status: 400 }
      );
    }

    // 1. Send the email directly to the recipient via Gmail SMTP
    await sendGmailReply({
      toEmail: toEmail.trim(),
      toName: (toName || toEmail).trim(),
      subject: (subject || '').trim() || `Re: Your message to Sanket Kedare`,
      replyMessage: replyMessage.trim(),
      originalMessage: originalMessage ? originalMessage.trim() : undefined,
    });

    // 2. Mark inquiry as replied in MongoDB
    let updatedInquiry = null;
    if (inquiryId) {
      await dbConnect();
      updatedInquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
        {
          replied: true,
          repliedAt: new Date(),
          replyText: replyMessage.trim(),
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Reply email sent directly to ${toEmail}!`,
      inquiry: updatedInquiry,
    });
  } catch (error: any) {
    console.error('[Admin Reply API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send reply email.' },
      { status: 500 }
    );
  }
}
