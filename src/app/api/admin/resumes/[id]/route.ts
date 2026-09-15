import { NextResponse } from 'next/server';
import { dbConnect, Resume, setActiveResume } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

/** PATCH — Set this resume as active OR rename filename */
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const body = await req.json().catch(() => ({}));

    await dbConnect();

    // 1. If filename is provided, update filename (Rename action)
    if (typeof body.filename === 'string' && body.filename.trim()) {
      let cleanName = body.filename.trim();
      if (!cleanName.toLowerCase().endsWith('.pdf')) {
        cleanName = `${cleanName}.pdf`;
      }

      const updated = await Resume.findByIdAndUpdate(
        id,
        { $set: { filename: cleanName } },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ success: false, error: 'Resume not found.' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Resume renamed successfully.',
        resume: updated,
      });
    }

    // 2. Default: Set this resume as active
    const doc = await setActiveResume(id);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Resume not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Resume set as active.', resume: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

/** DELETE — Remove a single resume record and auto-activate latest if needed */
export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    await dbConnect();

    const doc = await Resume.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Resume not found.' }, { status: 404 });
    }

    let newlyActivatedResume = null;

    // Check if an active resume still remains
    const hasActive = await Resume.findOne({ isActive: true });
    if (!hasActive) {
      // Automatically select and activate the most recent remaining resume
      const latestRemaining = await Resume.findOne().sort({ uploadedAt: -1 });
      if (latestRemaining) {
        newlyActivatedResume = await Resume.findByIdAndUpdate(
          latestRemaining._id,
          { $set: { isActive: true } },
          { new: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: newlyActivatedResume
        ? `Resume deleted. "${newlyActivatedResume.filename}" is now active.`
        : 'Resume deleted.',
      newActiveResume: newlyActivatedResume,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
