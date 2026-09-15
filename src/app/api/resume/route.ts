import { NextResponse } from 'next/server';
import { getActiveResumeFromDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = await getActiveResumeFromDb();

    if (!url) {
      return NextResponse.json({ success: false, url: null, error: 'No active resume configured.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, url: null, error: error?.message || 'Database error' },
      { status: 500 }
    );
  }
}
