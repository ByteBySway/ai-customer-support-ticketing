import { NextResponse } from 'next/server';
import { tickets, agents, classifyTicketAI, comments } from '../data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const priority = searchParams.get('priority');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let result = [...tickets];
  if (category && category !== 'All') result = result.filter(t => t.category === category);
  if (priority && priority !== 'All') result = result.filter(t => t.priority === priority);
  if (status && status !== 'All') result = result.filter(t => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(t => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q));
  }

  const now = new Date();
  result = result.map(t => ({
    ...t,
    slaBreached: new Date(t.slaDeadline) < now && t.status !== "Resolved" && t.status !== "Closed"
  }));

  return NextResponse.json({ success: true, count: result.length, data: result });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.subject || !body.description) {
      return NextResponse.json({ success: false, message: "Subject and description are required." }, { status: 400 });
    }

    const aiResult = classifyTicketAI(body.subject, body.description);
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const slaDeadline = new Date(now.getTime() + aiResult.slaTargetHours * 3600 * 1000);

    const newTicket = {
      id: ticketId,
      customerName: body.customerName || "Customer",
      customerEmail: body.customerEmail || "customer@example.com",
      subject: body.subject,
      description: body.description,
      category: aiResult.category,
      priority: aiResult.priority,
      status: "Open",
      assignedAgentId: aiResult.assignedAgentId,
      assignedAgentName: aiResult.assignedAgentName,
      sentiment: aiResult.sentiment,
      sentimentScore: aiResult.sentimentScore,
      confidenceScore: aiResult.confidenceScore,
      createdAt: now.toISOString(),
      slaDeadline: slaDeadline.toISOString(),
      slaBreached: false,
      csatScore: null,
      feedback: null,
      aiRoutingInfo: {
        matchScore: aiResult.routingMatchScore,
        reason: aiResult.routingReason
      }
    };

    tickets.unshift(newTicket);
    comments[ticketId] = [
      { id: "c1", author: "Support AI Engine", role: "AI Bot", text: `Ticket auto-classified as ${aiResult.category} (${(aiResult.confidenceScore*100).toFixed(0)}% confidence). Assigned to ${aiResult.assignedAgentName}.`, timestamp: now.toISOString() }
    ];

    const agent = agents.find(a => a.id === aiResult.assignedAgentId);
    if (agent) agent.activeTickets += 1;

    return NextResponse.json({ success: true, message: "Ticket created and AI routed", data: newTicket }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
