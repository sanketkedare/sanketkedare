import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addAndActivateResume } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET — returns Cloudinary cloud name for admin UI reference
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  });
}

/**
 * POST (multipart) — Upload PDF to Cloudinary, insert resume record, set as active.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ success: false, error: 'Only file uploads are accepted here.' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are accepted.' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: 'Cloudinary credentials not configured.' }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder    = 'resumes';
    const publicId  = `resume_${Date.now()}`;

    const stringToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature    = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const fileBuffer = await file.arrayBuffer();
    const base64File = `data:${file.type || 'application/pdf'};base64,${Buffer.from(fileBuffer).toString('base64')}`;

    const uploadForm = new FormData();
    uploadForm.append('file',       base64File);
    uploadForm.append('api_key',    apiKey);
    uploadForm.append('timestamp',  String(timestamp));
    uploadForm.append('folder',     folder);
    uploadForm.append('public_id',  publicId);
    uploadForm.append('signature',  signature);

    const cloudRes  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: uploadForm,
    });
    const cloudData = await cloudRes.json();

    if (!cloudRes.ok || cloudData.error) {
      return NextResponse.json(
        { success: false, error: cloudData.error?.message || 'Cloudinary upload failed.' },
        { status: 500 }
      );
    }

    const secureUrl = cloudData.secure_url as string;

    // Insert new record into resumes collection and set as active
    const doc = await addAndActivateResume(secureUrl, file.name, publicId);

    return NextResponse.json({
      success:  true,
      message:  'Uploaded to Cloudinary & saved in MongoDB.',
      resume:   { _id: doc._id, url: secureUrl, filename: file.name, isActive: true, uploadedAt: doc.uploadedAt },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
