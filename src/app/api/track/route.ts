import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect, Visit, TrafficSource } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const VALID_SOURCES: TrafficSource[] = ['linkedin', 'google', 'naukri', 'resume', 'direct', 'other'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      source = 'direct',
      rawReferrer = '',
      utmSource = '',
      utmMedium = '',
      utmCampaign = '',
      path = '/',
      device = 'desktop',
      browser = 'Other',
      os = 'Other',
    } = body;

    // Validate source enum
    const validatedSource: TrafficSource = VALID_SOURCES.includes(source) ? source : 'other';

    // Extract client IP and hash with today's date for privacy-safe daily unique visitor deduplication
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';
    
    const today = new Date().toISOString().slice(0, 10);
    const ipHash = crypto.createHash('sha256').update(`${clientIp}-${today}`).digest('hex').slice(0, 16);

    await dbConnect();

    // Create the visit record
    await Visit.create({
      source: validatedSource,
      rawReferrer: String(rawReferrer).slice(0, 500),
      utmSource: String(utmSource).slice(0, 100),
      utmMedium: String(utmMedium).slice(0, 100),
      utmCampaign: String(utmCampaign).slice(0, 100),
      path: String(path).slice(0, 200),
      device: ['mobile', 'desktop', 'tablet'].includes(device) ? device : 'desktop',
      browser: String(browser).slice(0, 50),
      os: String(os).slice(0, 50),
      ipHash,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.warn('[Visit Tracking Error]:', error?.message);
    // Return 200 anyway so tracking never throws errors or impacts the client
    return NextResponse.json({ success: false, error: 'Tracking silently handled' }, { status: 200 });
  }
}
