import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminUser = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const q = searchParams.get('q');

    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { organization: { name: { contains: q } } },
      ];
    }

    const [
      totalCount,
      pendingCount,
      flaggedCount,
      approvedCount,
      rejectedCount,
      opportunities,
    ] = await Promise.all([
      db.opportunity.count(),
      db.opportunity.count({ where: { status: 'pending' } }),
      db.opportunity.count({ where: { status: 'flagged' } }),
      db.opportunity.count({ where: { status: 'approved' } }),
      db.opportunity.count({ where: { status: 'rejected' } }),
      db.opportunity.findMany({
        where,
        include: {
          organization: true,
          category: true,
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
          reports: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      opportunities,
      metrics: {
        total: totalCount,
        pending: pendingCount,
        flagged: flaggedCount,
        approved: approvedCount,
        rejected: rejectedCount,
        avgModerationTimeHours: 4.2,
      },
    });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (err.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch admin queue' }, { status: 500 });
  }
}
