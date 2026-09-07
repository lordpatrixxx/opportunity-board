import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await requireAdmin();
    const { id } = params;
    const body = await req.json();
    const { action, notes } = body; // action: 'approve' | 'reject' | 'flag' | 'request_changes'

    const opportunity = await db.opportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    let nextStatus = opportunity.status;
    let notificationTitle = 'Moderation Update';
    let notificationMessage = '';

    if (action === 'approve') {
      nextStatus = 'approved';
      notificationTitle = 'Opportunity Approved & Live!';
      notificationMessage = `Your listing "${opportunity.title}" has been approved by our moderation team and is now live.`;
    } else if (action === 'reject') {
      nextStatus = 'rejected';
      notificationTitle = 'Opportunity Listing Rejected';
      notificationMessage = `Your listing "${opportunity.title}" was not approved. Reason: ${notes || 'Did not meet listing quality standards'}.`;
    } else if (action === 'flag') {
      nextStatus = 'flagged';
      notificationTitle = 'Listing Flagged for Review';
      notificationMessage = `Your listing "${opportunity.title}" has been flagged for legal or policy review.`;
    } else if (action === 'request_changes') {
      nextStatus = 'flagged';
      notificationTitle = 'Changes Requested on Listing';
      notificationMessage = `Revisions requested for "${opportunity.title}": ${notes || 'Please update the application link and eligibility details'}.`;
    }

    const updated = await db.opportunity.update({
      where: { id },
      data: { status: nextStatus },
      include: { organization: true },
    });

    // Record in moderation log
    await db.moderationRecord.create({
      data: {
        opportunityId: id,
        moderatorId: adminUser.id,
        action: action.toUpperCase(),
        notes: notes || null,
      },
    });

    // Notify the opportunity poster
    await db.notification.create({
      data: {
        userId: opportunity.userId,
        type: 'STATUS',
        title: notificationTitle,
        message: notificationMessage,
        actionUrl: `/opportunities/${id}`,
      },
    });

    return NextResponse.json({
      message: `Listing ${nextStatus} successfully`,
      opportunity: updated,
    });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update moderation state' }, { status: 500 });
  }
}
