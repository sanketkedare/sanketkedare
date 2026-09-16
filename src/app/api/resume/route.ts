import { NextResponse } from 'next/server';
import { getActiveResumeRecordFromDb } from '@/lib/mongodb';
import { getDownloadableResumeUrl, RESUME_FILENAME } from '@/lib/resume-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const record = await getActiveResumeRecordFromDb();

    if (!record || !record.url) {
      return NextResponse.json({ success: false, url: null, error: 'No active resume configured.' }, { status: 404 });
    }

    const filename = record.filename || 'resume.pdf';
    const downloadUrl = getDownloadableResumeUrl(record.url, filename);

    return NextResponse.json({
      success: true,
      url: record.url,
      filename,
      downloadUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, url: null, error: error?.message || 'Database error' },
      { status: 500 }
    );
  }
}
