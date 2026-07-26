import { NextResponse } from 'next/server';
import { tickets, agents } from '../../data';

export async function GET(request, { params }) {
  const { id } = params;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) {
    return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: ticket });
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const ticket = tickets.find(t => t.id === id);

    if (!ticket) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    if (body.status) {
      if ((body.status === "Resolved" || body.status === "Closed") && (ticket.status !== "Resolved" && ticket.status !== "Closed")) {
        const agent = agents.find(a => a.id === ticket.assignedAgentId);
        if (agent && agent.activeTickets > 0) {
          agent.activeTickets -= 1;
          agent.ticketsResolved += 1;
        }
      }
      ticket.status = body.status;
    }

    if (body.assignedAgentId && body.assignedAgentId !== ticket.assignedAgentId) {
      const oldAgent = agents.find(a => a.id === ticket.assignedAgentId);
      if (oldAgent && oldAgent.activeTickets > 0) oldAgent.activeTickets -= 1;

      const newAgent = agents.find(a => a.id === body.assignedAgentId);
      if (newAgent) {
        newAgent.activeTickets += 1;
        ticket.assignedAgentId = newAgent.id;
        ticket.assignedAgentName = newAgent.name;
      }
    }

    if (body.csatScore !== undefined) ticket.csatScore = Number(body.csatScore);
    if (body.feedback !== undefined) ticket.feedback = body.feedback;

    return NextResponse.json({ success: true, message: "Ticket updated", data: ticket });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
