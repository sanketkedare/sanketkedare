import { NextResponse } from 'next/server';
import { dbConnect, Inquiry } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view'); // 'active' | 'recycle_bin' | 'all'

    await dbConnect();

    let query: any = { deleted: { $ne: true } };

    if (view === 'recycle_bin') {
      query = { deleted: true };
    } else if (view === 'all') {
      query = {};
    }

    const [inquiries, totalActive, unreadCount, pendingCount, recycleCount] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      Inquiry.countDocuments({ deleted: { $ne: true } }),
      Inquiry.countDocuments({ read: false, deleted: { $ne: true } }),
      Inquiry.countDocuments({ replied: false, deleted: { $ne: true } }),
      Inquiry.countDocuments({ deleted: true }),
    ]);

    return NextResponse.json({
      success: true,
      inquiries,
      total: inquiries.length,
      counts: {
        active: totalActive,
        unread: unreadCount,
        pending: pendingCount,
        recycle: recycleCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    await dbConnect();

    // Batch actions
    if (action === 'soft_delete_all') {
      await Inquiry.updateMany(
        { deleted: { $ne: true } },
        { $set: { deleted: true, deletedAt: new Date() } }
      );
      return NextResponse.json({ success: true, message: 'All active messages moved to Recycle Bin' });
    }

    if (action === 'restore_all') {
      await Inquiry.updateMany(
        { deleted: true },
        { $set: { deleted: false, deletedAt: null } }
      );
      return NextResponse.json({ success: true, message: 'All messages restored to Inbox' });
    }

    if (action === 'mark_all_read') {
      await Inquiry.updateMany(
        { deleted: { $ne: true }, read: false },
        { $set: { read: true, readAt: new Date() } }
      );
      return NextResponse.json({ success: true, message: 'All messages marked as read' });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required for single item actions' },
        { status: 400 }
      );
    }

    let update: any = {};

    switch (action) {
      case 'mark_read':
        update = { $set: { read: true, readAt: new Date() } };
        break;
      case 'mark_unread':
        update = { $set: { read: false, readAt: null } };
        break;
      case 'soft_delete':
        update = { $set: { deleted: true, deletedAt: new Date() } };
        break;
      case 'restore':
        update = { $set: { deleted: false, deletedAt: null } };
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Invalid action: ${action}` },
          { status: 400 }
        );
    }

    const updated = await Inquiry.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: action === 'soft_delete' ? 'Moved to Recycle Bin' : action === 'restore' ? 'Restored to Inbox' : 'Updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update inquiry status' },
      { status: 500 }
    );
  }
}

// DELETE triggers soft-delete to Recycle Bin
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';

    await dbConnect();

    if (id) {
      // Soft-delete to Recycle Bin
      await Inquiry.findByIdAndUpdate(id, {
        $set: { deleted: true, deletedAt: new Date() },
      });
      return NextResponse.json({ success: true, message: 'Message moved to Recycle Bin' });
    }

    if (all) {
      // Soft-delete all active messages
      await Inquiry.updateMany(
        { deleted: { $ne: true } },
        { $set: { deleted: true, deletedAt: new Date() } }
      );
      return NextResponse.json({ success: true, message: 'All messages moved to Recycle Bin' });
    }

    return NextResponse.json(
      { success: false, error: 'Inquiry ID is required' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process delete request' },
      { status: 500 }
    );
  }
}

