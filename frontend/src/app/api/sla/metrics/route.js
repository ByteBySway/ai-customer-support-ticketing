import { NextResponse } from 'next/server';
import { tickets } from '../../data';

export async function GET() {
  const now = new Date();
  let totalTickets = tickets.length;
  let breachedTickets = 0;
  let warningTickets = 0;

  tickets.forEach(t => {
    const deadline = new Date(t.slaDeadline);
    const isClosed = t.status === "Resolved" || t.status === "Closed";
    if (!isClosed && deadline < now) {
      breachedTickets++;
    } else if (!isClosed && (deadline - now) <= 3600 * 1000) {
      warningTickets++;
    }
  });

  const metTickets = totalTickets - breachedTickets;
  const complianceRate = totalTickets > 0 ? Number(((metTickets / totalTickets) * 100).toFixed(1)) : 100;

  return NextResponse.json({
    success: true,
    data: {
      totalTickets,
      metTickets,
      breachedTickets,
      warningTickets,
      complianceRate,
      targetRate: 95.0,
      avgResponseTimeMins: 14,
      avgResolutionTimeHours: 3.2
    }
  });
}
