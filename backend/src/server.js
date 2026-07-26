/**
 * AI Customer Support Ticketing System - Native Express-like REST API Server
 * Zero-dependency standalone server using native Node.js HTTP module.
 */

const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;

// Data Stores (In-Memory Database)
let agents = [
  {
    id: "agent_101",
    name: "Sarah Chen",
    email: "sarah.chen@supportai.com",
    role: "Senior Technical Lead",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialties: ["Technical & Bugs", "Account & Security"],
    activeTickets: 3,
    maxCapacity: 8,
    ticketsResolved: 142,
    avgHandleTimeMinutes: 24,
    rating: 4.9,
    status: "Available"
  },
  {
    id: "agent_102",
    name: "Marcus Vance",
    email: "marcus.vance@supportai.com",
    role: "Billing & Finance Specialist",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    specialties: ["Billing & Payments", "General Inquiries"],
    activeTickets: 2,
    maxCapacity: 10,
    ticketsResolved: 189,
    avgHandleTimeMinutes: 18,
    rating: 4.8,
    status: "Available"
  },
  {
    id: "agent_103",
    name: "Elena Rostova",
    email: "elena.rostova@supportai.com",
    role: "Security & Escalations Agent",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    specialties: ["Account & Security", "Technical & Bugs"],
    activeTickets: 1,
    maxCapacity: 5,
    ticketsResolved: 96,
    avgHandleTimeMinutes: 35,
    rating: 4.95,
    status: "Available"
  },
  {
    id: "agent_104",
    name: "David Kim",
    email: "david.kim@supportai.com",
    role: "Customer Success Representative",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    specialties: ["Feature Requests", "General Inquiries"],
    activeTickets: 4,
    maxCapacity: 8,
    ticketsResolved: 115,
    avgHandleTimeMinutes: 21,
    rating: 4.75,
    status: "Available"
  }
];

let tickets = [
  {
    id: "TCK-8901",
    customerName: "Alex Rivera",
    customerEmail: "alex.rivera@techcorp.io",
    subject: "Urgent: API 500 error during checkout payment webhooks",
    description: "Our production server is receiving HTTP 500 Internal Server Error when processing checkout webhooks. Payment captures are failing!",
    category: "Technical & Bugs",
    priority: "Urgent",
    status: "In Progress",
    assignedAgentId: "agent_101",
    assignedAgentName: "Sarah Chen",
    sentiment: "Frustrated",
    sentimentScore: 0.12,
    confidenceScore: 0.94,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    slaBreached: false,
    csatScore: null,
    feedback: null
  },
  {
    id: "TCK-8902",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@designs.co",
    subject: "Double billing on Enterprise subscription invoice #INV-4029",
    description: "I noticed my credit card was charged twice ($299 x 2) for our monthly plan this morning. Kindly reverse the duplicate charge.",
    category: "Billing & Payments",
    priority: "High",
    status: "Open",
    assignedAgentId: "agent_102",
    assignedAgentName: "Marcus Vance",
    sentiment: "Negative",
    sentimentScore: 0.35,
    confidenceScore: 0.91,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 150 * 60 * 1000).toISOString(),
    slaBreached: false,
    csatScore: null,
    feedback: null
  },
  {
    id: "TCK-8903",
    customerName: "Jordan Lee",
    customerEmail: "j.lee@fintech.net",
    subject: "2FA authentication code not delivering via SMS",
    description: "I'm locked out of my team administrator account because SMS verification codes aren't arriving. Need immediate password reset or 2FA override.",
    category: "Account & Security",
    priority: "Urgent",
    status: "In Progress",
    assignedAgentId: "agent_103",
    assignedAgentName: "Elena Rostova",
    sentiment: "Negative",
    sentimentScore: 0.28,
    confidenceScore: 0.96,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    slaBreached: false,
    csatScore: null,
    feedback: null
  },
  {
    id: "TCK-8899",
    customerName: "Emily Watson",
    customerEmail: "emily@analytics.com",
    subject: "Feature Request: Export agent performance reports to CSV / PDF",
    description: "It would be super helpful if our managers could schedule automated weekly PDF exports of agent resolution times.",
    category: "Feature Requests",
    priority: "Low",
    status: "Resolved",
    assignedAgentId: "agent_104",
    assignedAgentName: "David Kim",
    sentiment: "Positive",
    sentimentScore: 0.88,
    confidenceScore: 0.87,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    slaBreached: false,
    csatScore: 5,
    feedback: "Awesome support! David listened attentively and logged the feature request."
  },
  {
    id: "TCK-8895",
    customerName: "Michael Chang",
    customerEmail: "m.chang@devops.org",
    subject: "Database connection timeout during peak hours",
    description: "Database connection pools are dropping connections under high concurrent load.",
    category: "Technical & Bugs",
    priority: "High",
    status: "Closed",
    assignedAgentId: "agent_101",
    assignedAgentName: "Sarah Chen",
    sentiment: "Neutral",
    sentimentScore: 0.52,
    confidenceScore: 0.89,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    slaBreached: false,
    csatScore: 5,
    feedback: "Resolved quickly with optimized connection pool configuration guidelines."
  }
];

// AI Classifier Engine
function classifyTicketAI(subject, description) {
  const text = `${subject} ${description}`.toLowerCase();

  const categories = {
    "Billing & Payments": ["invoice", "billing", "charge", "refund", "credit card", "payment", "subscription", "pricing", "cost", "receipt"],
    "Technical & Bugs": ["bug", "error", "crash", "api", "timeout", "500", "404", "exception", "glitch", "server", "code", "database"],
    "Account & Security": ["login", "password", "2fa", "authentication", "mfa", "unauthorized", "hacked", "lockout", "access", "security"],
    "Feature Requests": ["feature", "enhancement", "integration", "suggestion", "add support", "dark mode", "request", "export"],
    "General Inquiries": ["help", "question", "how to", "documentation", "guide", "onboarding", "demo", "info"]
  };

  let scores = {};
  let totalScore = 0;
  for (let cat in categories) {
    scores[cat] = 0;
    categories[cat].forEach(kw => {
      if (text.includes(kw)) scores[cat] += 2;
    });
    totalScore += scores[cat];
  }

  let predictedCategory = "General Inquiries";
  let maxScore = -1;
  for (let cat in scores) {
    if (scores[cat] > maxScore) {
      maxScore = scores[cat];
      predictedCategory = cat;
    }
  }
  let confidenceScore = totalScore > 0 ? Math.min(0.98, Math.max(0.65, Number((maxScore / Math.max(1, totalScore) * 0.9).toFixed(2)))) : 0.75;

  let priority = "Medium";
  let slaHours = 12;

  const urgentKeywords = ["critical", "down", "outage", "emergency", "production", "data loss", "blocked", "asap", "immediately"];
  const highKeywords = ["error", "failing", "broken", "security", "urgent", "cannot", "impacted"];

  if (urgentKeywords.some(kw => text.includes(kw)) || predictedCategory === "Account & Security") {
    priority = "Urgent";
    slaHours = 1;
  } else if (highKeywords.some(kw => text.includes(kw)) || predictedCategory === "Technical & Bugs") {
    priority = "High";
    slaHours = 4;
  } else if (predictedCategory === "Feature Requests") {
    priority = "Low";
    slaHours = 24;
  }

  let sentiment = "Neutral";
  let sentimentScore = 0.50;

  if (/terrible|worst|unacceptable|furious|disaster|money lost|rage|lawsuit/.test(text)) {
    sentiment = "Frustrated";
    sentimentScore = 0.10;
  } else if (/broken|bad|annoying|disappointed|not working|fail|useless/.test(text)) {
    sentiment = "Negative";
    sentimentScore = 0.32;
  } else if (/great|love|thanks|awesome|excellent|helpful/.test(text)) {
    sentiment = "Positive";
    sentimentScore = 0.92;
  }

  let bestAgent = null;
  let bestRoutingScore = -1;

  agents.forEach(agent => {
    if (agent.status !== "Available") return;
    const capacityRemaining = agent.maxCapacity - agent.activeTickets;
    if (capacityRemaining <= 0) return;

    const specialtyMatch = agent.specialties.includes(predictedCategory) ? 1.0 : 0.3;
    const loadFactor = capacityRemaining / agent.maxCapacity;
    const ratingScore = agent.rating / 5.0;

    const score = (specialtyMatch * 0.5) + (loadFactor * 0.3) + (ratingScore * 0.2);

    if (score > bestRoutingScore) {
      bestRoutingScore = score;
      bestAgent = agent;
    }
  });

  if (!bestAgent) bestAgent = agents[0];

  return {
    category: predictedCategory,
    confidenceScore,
    priority,
    slaTargetHours: slaHours,
    sentiment,
    sentimentScore,
    assignedAgentId: bestAgent.id,
    assignedAgentName: bestAgent.name,
    routingMatchScore: Number((bestRoutingScore * 100).toFixed(1)),
    routingReason: `Automated match based on domain specialty (${predictedCategory}) and active capacity (${bestAgent.activeTickets}/${bestAgent.maxCapacity}).`
  };
}

// Helper: Read JSON Body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// HTTP Server Entry Point
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. GET /api/tickets
    if (pathname === '/api/tickets' && req.method === 'GET') {
      let result = [...tickets];
      if (query.category) result = result.filter(t => t.category === query.category);
      if (query.priority) result = result.filter(t => t.priority === query.priority);
      if (query.status) result = result.filter(t => t.status === query.status);
      if (query.search) {
        const q = query.search.toLowerCase();
        result = result.filter(t => t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q));
      }

      const now = new Date();
      result = result.map(t => ({
        ...t,
        slaBreached: new Date(t.slaDeadline) < now && t.status !== "Resolved" && t.status !== "Closed"
      }));

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: result.length, data: result }));
      return;
    }

    // 2. POST /api/tickets
    if (pathname === '/api/tickets' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.subject || !body.description) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: "Subject and description are required." }));
        return;
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
      const agent = agents.find(a => a.id === aiResult.assignedAgentId);
      if (agent) agent.activeTickets += 1;

      res.writeHead(201);
      res.end(JSON.stringify({ success: true, message: "Ticket created and AI routed", data: newTicket }));
      return;
    }

    // 3. POST /api/ai/classify
    if (pathname === '/api/ai/classify' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = classifyTicketAI(body.subject || "", body.description || "");
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: result }));
      return;
    }

    // 4. PUT /api/tickets/:id
    if (pathname.startsWith('/api/tickets/') && req.method === 'PUT') {
      const ticketId = pathname.replace('/api/tickets/', '');
      const body = await parseBody(req);
      const ticket = tickets.find(t => t.id === ticketId);

      if (!ticket) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, message: "Ticket not found." }));
        return;
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

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: "Ticket updated", data: ticket }));
      return;
    }

    // 5. GET /api/sla/metrics
    if (pathname === '/api/sla/metrics' && req.method === 'GET') {
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

      res.writeHead(200);
      res.end(JSON.stringify({
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
      }));
      return;
    }

    // 6. GET /api/agents
    if (pathname === '/api/agents' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: agents }));
      return;
    }

    // 7. GET /api/analytics/csat
    if (pathname === '/api/analytics/csat' && req.method === 'GET') {
      const ratedTickets = tickets.filter(t => t.csatScore !== null);
      const totalRatings = ratedTickets.length;
      const avgCsat = totalRatings > 0 
        ? Number((ratedTickets.reduce((acc, t) => acc + t.csatScore, 0) / totalRatings).toFixed(2)) 
        : 4.85;

      let sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0, Frustrated: 0 };
      tickets.forEach(t => {
        if (sentimentCounts[t.sentiment] !== undefined) sentimentCounts[t.sentiment]++;
      });

      res.writeHead(200);
      res.end(JSON.stringify({
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
      }));
      return;
    }

    // 8. GET /api/health
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: "online", timestamp: new Date().toISOString(), service: "AI Support Ticketing API" }));
      return;
    }

    // Fallback 404
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, message: "Endpoint not found." }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Zero-dependency AI Support Ticketing Backend running on http://localhost:${PORT}`);
});
