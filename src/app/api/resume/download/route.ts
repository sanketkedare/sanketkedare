import { NextResponse } from 'next/server';
import { getActiveResumeRecordFromDb } from '@/lib/mongodb';
import { getDownloadableResumeUrl, RESUME_FILENAME } from '@/lib/resume-config';

export const dynamic = 'force-dynamic';

/**
 * GET /api/resume/download
 * Proxies and streams the active PDF resume directly from Cloudinary to the client.
 * Sets the proper Content-Disposition and application/pdf MIME headers to ensure
 * immediate file download with the official filename, avoiding cross-origin issues
 * and Cloudinary's default restricted in-browser PDF delivery rules.
 */
export async function GET() {
  try {
    const record = await getActiveResumeRecordFromDb();

    if (!record || !record.url) {
      return NextResponse.json(
        { success: false, error: 'No active resume found in database.' },
        { status: 404 }
      );
    }

    const filename = record.filename || 'resume.pdf';
    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    const attachmentUrl = getDownloadableResumeUrl(record.url, cleanFilename);

    // 1. Fetch PDF buffer from Cloudinary via attachment URL
    let cloudRes = await fetch(attachmentUrl);

    // 2. If attachment URL fails, attempt raw URL
    if (!cloudRes.ok && attachmentUrl !== record.url) {
      cloudRes = await fetch(record.url);
    }

    // 3. Fallback: if server fetch fails, redirect directly to Cloudinary attachment URL
    if (!cloudRes.ok) {
      console.warn(`[Resume Download] Cloudinary fetch returned ${cloudRes.status}. Redirecting directly.`);
      return NextResponse.redirect(attachmentUrl, { status: 307 });
    }

    const arrayBuffer = await cloudRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(cleanFilename)}"`,
        'Content-Length': String(arrayBuffer.byteLength),
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('[API Resume Download Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to download resume.' },
      { status: 500 }
    );
  }
}
