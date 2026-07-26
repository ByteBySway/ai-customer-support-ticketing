// Shared In-Memory Data Store for Next.js Serverless API Route Handlers

export let agents = [
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

export let tickets = [
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

export let comments = {
  "TCK-8901": [
    { id: "c1", author: "Support AI System", role: "AI Bot", text: "Ticket auto-classified as Technical & Bugs (94% confidence). Priority set to Urgent. Routed to Sarah Chen.", timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
    { id: "c2", author: "Sarah Chen", role: "Agent", text: "Investigating the webhook payload logs for 500 status codes now.", timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() }
  ]
};

export function classifyTicketAI(subject, description) {
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

export function generateAIReply(ticket) {
  const { customerName, subject, category, priority, sentiment } = ticket;
  const greeting = `Hello ${customerName || 'Valued Customer'},`;

  let responseBody = '';
  if (category === 'Billing & Payments') {
    responseBody = `Thank you for reaching out regarding invoice "${subject}". We take billing inquiries very seriously. I have prioritized your request and initiated a audit with our Finance team. Any duplicate or erroneous charges will be refunded immediately within 1-2 business days.`;
  } else if (category === 'Technical & Bugs') {
    responseBody = `We apologize for the technical inconvenience regarding "${subject}". Our engineering team has received your ticket and is inspecting server logs to diagnose the issue. We are applying a resolution patch and will update you shortly.`;
  } else if (category === 'Account & Security') {
    responseBody = `Security is our highest priority. Regarding "${subject}", I am verifying your account credentials and preparing an expedited verification override so you can regain access safely.`;
  } else {
    responseBody = `Thank you for contacting support regarding "${subject}". We have logged your request and assigned our senior specialist to review and provide assistance.`;
  }

  const closing = `\n\nBest regards,\nSupportPulse AI Specialist`;
  return `${greeting}\n\n${responseBody}${closing}`;
}
