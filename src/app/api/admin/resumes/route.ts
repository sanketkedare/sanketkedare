import { NextResponse } from 'next/server';
import { dbConnect, Resume } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/** GET — Returns all resumes, newest first */
export async function GET() {
  try {
    await dbConnect();
    const resumes = await Resume.find({}).sort({ uploadedAt: -1 }).lean();
    return NextResponse.json({ success: true, resumes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

/** DELETE (no id) — Clear all resumes */
export async function DELETE() {
  try {
    await dbConnect();
    await Resume.deleteMany({});
    return NextResponse.json({ success: true, message: 'All resumes deleted.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
