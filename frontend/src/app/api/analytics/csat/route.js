import { NextResponse } from 'next/server';
import { tickets } from '../../data';

export async function GET() {
  const ratedTickets = tickets.filter(t => t.csatScore !== null);
  const totalRatings = ratedTickets.length;
  const avgCsat = totalRatings > 0 
    ? Number((ratedTickets.reduce((acc, t) => acc + t.csatScore, 0) / totalRatings).toFixed(2)) 
    : 4.85;

  let sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0, Frustrated: 0 };
  tickets.forEach(t => {
    if (sentimentCounts[t.sentiment] !== undefined) sentimentCounts[t.sentiment]++;
  });

  return NextResponse.json({
    success: true,
    data: {
      averageCsat: avgCsat,
      totalFeedbackResponses: totalRatings,
      netPromoterScore: 78,
      sentimentDistribution: sentimentCounts,
      recentFeedbacks: ratedTickets.map(t => ({
        ticketId: t.id,
        customerName: t.customerName,
        rating: t.csatScore,
        feedback: t.feedback,
        sentiment: t.sentiment,
        date: t.createdAt
      }))
    }
  });
}
