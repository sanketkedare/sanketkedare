import { NextResponse } from 'next/server';
import { dbConnect, Inquiry } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({
      success: true,
      inquiries,
      total: inquiries.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();

    if (id) {
      await Inquiry.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Inquiry deleted' });
    }

    await Inquiry.deleteMany({});
    return NextResponse.json({ success: true, message: 'All inquiries cleared' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
