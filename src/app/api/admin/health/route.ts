import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  try {
    await dbConnect();
    const latency = Date.now() - start;
    return NextResponse.json({
      success: true,
      status: 'connected',
      latencyMs: latency,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'disconnected',
        error: error?.message || 'MongoDB connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
