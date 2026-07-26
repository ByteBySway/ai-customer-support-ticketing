'use client';

import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

// Crisp, Resolution-Independent SVG Icons (Zero string emojis to eliminate question mark rendering bugs)
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconTicket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0-2-2H4a2 2 0 0-2 2Z" />
    <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);

const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconStar = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMessage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconBrain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 5.562 5.562A3 3 0 1 0 12 15" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-5.562 5.562A3 3 0 1 1 12 15" />
    <path d="M12 4v16" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// Stitch Donut SLA Gauge Component
const StitchSLADonut = ({ percentage = 96.4 }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '10px 0' }}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="url(#stitchGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="stitchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{percentage}%</span>
        <p style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 600, marginTop: '-2px' }}>Optimal</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [slaMetrics, setSlaMetrics] = useState(null);
  const [csatData, setCsatData] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Ticket Modal Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);

  // Ticket Detail Drawer State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [aiDraftReply, setAiDraftReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // CSAT Rating Modal State
  const [csatModalTicket, setCsatModalTicket] = useState(null);
  const [csatRating, setCsatRating] = useState(5);
  const [csatFeedbackText, setCsatFeedbackText] = useState('');

  const fetchData = async () => {
    try {
      const [ticketsRes, agentsRes, slaRes, csatRes] = await Promise.all([
        fetch(`${API_BASE}/tickets`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/agents`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/sla/metrics`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/analytics/csat`).then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (ticketsRes.success) setTickets(ticketsRes.data);
      if (agentsRes.success) setAgents(agentsRes.data);
      if (slaRes.success) setSlaMetrics(slaRes.data);
      if (csatRes.success) setCsatData(csatRes.data);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Live AI Classification Debounce
  useEffect(() => {
    if (!newSubject && !newDesc) {
      setAiPreview(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const res = await fetch(`${API_BASE}/ai/classify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: newSubject, description: newDesc })
        }).then(r => r.json());
        if (res.success) setAiPreview(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsClassifying(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [newSubject, newDesc]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject || !newDesc) return;

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newCustomerName || 'Alex Customer',
          customerEmail: newCustomerEmail || 'customer@company.com',
          subject: newSubject,
          description: newDesc
        })
      }).then(r => r.json());

      if (res.success) {
        setShowCreateModal(false);
        setNewSubject('');
        setNewDesc('');
        setNewCustomerName('');
        setNewCustomerEmail('');
        setAiPreview(null);
        fetchData();
      }
    } catch (err) {
      alert('Failed to submit ticket');
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await fetch(`${API_BASE}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openTicketDetail = async (ticket) => {
    setSelectedTicket(ticket);
    setAiDraftReply('');
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticket.id}/comments`).then(r => r.json());
      if (res.success) setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText || !selectedTicket) return;

    try {
      const res = await fetch(`${API_BASE}/tickets/${selectedTicket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCommentText, author: "Agent Support", role: "Agent" })
      }).then(r => r.json());

      if (res.success) {
        setComments([...comments, res.data]);
        setNewCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateAIReplyDraft = async () => {
    if (!selectedTicket) return;
    setIsGeneratingReply(true);
    try {
      const res = await fetch(`${API_BASE}/ai/suggest-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTicket)
      }).then(r => r.json());

      if (res.success) {
        setAiDraftReply(res.data.suggestedReply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleSubmitCsat = async (e) => {
    e.preventDefault();
    if (!csatModalTicket) return;

    try {
      await fetch(`${API_BASE}/tickets/${csatModalTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csatScore: csatRating, feedback: csatFeedbackText, status: 'Closed' })
      });
      setCsatModalTicket(null);
      setCsatFeedbackText('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (tickets.length === 0) return;
    const headers = ['ID', 'Customer', 'Email', 'Subject', 'Category', 'Priority', 'Status', 'Assigned Agent', 'Sentiment', 'SLA Deadline'];
    const rows = tickets.map(t => [
      t.id, `"${t.customerName}"`, `"${t.customerEmail}"`, `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.category}"`, t.priority, t.status, `"${t.assignedAgentName}"`, t.sentiment, t.slaDeadline
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `support_tickets_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTickets = tickets.filter(t => {
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px' }}>
      {/* Top Header */}
      <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '10px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconZap />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SupportPulse AI Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Automated Ticket Routing, SLA Tracking & Analytics</p>
          </div>
        </div>

        {/* Top Navigation Tabs + Explicit Close View Option */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
          {['Dashboard', 'Analytics', 'Team', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'Dashboard' && <IconTicket />}
              {tab === 'Analytics' && <IconChart />}
              {tab === 'Team' && <IconUsers />}
              {tab === 'Settings' && <IconBot />}
              {tab}
            </button>
          ))}

          {activeTab !== 'Dashboard' && (
            <button
              onClick={() => setActiveTab('Dashboard')}
              style={{
                background: 'rgba(244, 63, 94, 0.2)',
                color: '#F43F5E',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Close Feature View & Return to Main Dashboard"
            >
              <IconClose /> Close View
            </button>
          )}
        </div>

        {/* Action Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }}>
            <IconBell />
          </div>
          <button onClick={exportToCSV} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <IconDownload /> Export CSV
          </button>
          <button onClick={() => setShowCreateModal(true)} className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <IconPlus /> Create AI Ticket
          </button>
        </div>
      </header>

      {/* KPI Cards Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Total Tickets</span>
            <IconTicket />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: '#F3F4F6' }}>{tickets.length || 148}</h2>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>+12% growth</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>SLA Compliance</span>
            <IconClock />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: '#38BDF8' }}>
            {slaMetrics ? `${slaMetrics.complianceRate}%` : '96.4%'}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Target 95%</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Avg CSAT</span>
            <IconStar filled />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: '#FBBF24' }}>
            {csatData ? csatData.averageCsat : 4.85} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </h2>
          <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
            {[1, 2, 3, 4, 5].map(s => <IconStar key={s} filled />)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Available Agents</span>
            <IconUsers />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: '#A7F3D0' }}>
            {agents.filter(a => a.status === 'Available').length} / {agents.length || 4}
          </h2>
          <span style={{ color: '#34D399', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span className="live-dot"></span> Online & Operational
          </span>
        </div>
      </div>

      {/* SUB-VIEW 1: ANALYTICS FEATURE VIEW (WITH CLOSE OPTION) */}
      {activeTab === 'Analytics' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconChart /> Analytics & CSAT Insights Dashboard
            </h2>
            <button onClick={() => setActiveTab('Dashboard')} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <IconClose /> Close View
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#A5B4FC', marginBottom: '10px' }}>Net Promoter Score (NPS)</h3>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981' }}>+78</h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Tier Customer Satisfaction</p>
            </div>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#A5B4FC', marginBottom: '10px' }}>First Contact Resolution (FCR)</h3>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38BDF8' }}>88.4%</h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved on first response</p>
            </div>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#A5B4FC', marginBottom: '10px' }}>Avg Handle Time (AHT)</h3>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FBBF24' }}>14m 20s</h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>32% faster with AI Assistance</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: TEAM FEATURE VIEW (WITH CLOSE OPTION) */}
      {activeTab === 'Team' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconUsers /> Support Agent Performance & Workload
            </h2>
            <button onClick={() => setActiveTab('Dashboard')} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <IconClose /> Close View
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {agents.map(a => (
              <div key={a.id} className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>{a.name}</span>
                  <span className={`badge ${a.status === 'Available' ? 'badge-resolved' : 'badge-urgent'}`}>{a.status}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#A5B4FC', marginBottom: '6px' }}>Role: {a.role}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Active Load: <strong>{a.activeTickets} / {a.maxCapacity} tickets</strong></span>
                  <span>Specialties: {a.specialties ? a.specialties.join(', ') : 'General Support'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SETTINGS FEATURE VIEW (WITH CLOSE OPTION) */}
      {activeTab === 'Settings' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBot /> SLA Policy & AI Routing Settings
            </h2>
            <button onClick={() => setActiveTab('Dashboard')} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <IconClose /> Close View
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#A5B4FC', marginBottom: '12px' }}>SLA Target Rules</h3>
              <ul style={{ fontSize: '0.85rem', color: '#E5E7EB', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                <li>🔥 Urgent Priority SLA Target: <strong>1 Hour</strong></li>
                <li>⚡ High Priority SLA Target: <strong>4 Hours</strong></li>
                <li>🔹 Medium Priority SLA Target: <strong>12 Hours</strong></li>
                <li>🟢 Low Priority SLA Target: <strong>24 Hours</strong></li>
              </ul>
            </div>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#A5B4FC', marginBottom: '12px' }}>AI Routing Parameters</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Minimum Confidence Threshold for Auto Routing: <strong>85%</strong></p>
              <input type="range" min="50" max="95" defaultValue="85" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Stitch Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: STITCH INFOGRAPHICS STACK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Donut Infographic */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconClock /> SLA Compliance Gauge
            </h3>
            <StitchSLADonut percentage={slaMetrics?.complianceRate || 96.4} />
          </div>

          {/* Sentiment Distribution Bars */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconBrain /> Sentiment Analytics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Positive</span>
                  <span style={{ color: 'var(--text-muted)' }}>60%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '60%', background: '#10B981', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#38BDF8', fontWeight: 600 }}>Neutral</span>
                  <span style={{ color: 'var(--text-muted)' }}>20%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '20%', background: '#38BDF8', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>Negative</span>
                  <span style={{ color: 'var(--text-muted)' }}>15%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '15%', background: '#F59E0B', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#F43F5E', fontWeight: 600 }}>Frustrated</span>
                  <span style={{ color: 'var(--text-muted)' }}>5%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '5%', background: '#F43F5E', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Queue Workload Infographic */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconUsers /> Queue Workload
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Tier 1 Support</span>
                  <span style={{ fontWeight: 600, color: '#EC4899' }}>85%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '85%', background: '#EC4899', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Tier 2 Specialists</span>
                  <span style={{ fontWeight: 600, color: '#8B5CF6' }}>45%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: '45%', background: '#8B5CF6', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TICKETS WORKSPACE TABLE & CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <input
                  type="text"
                  placeholder="Search tickets, customers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#FFF', padding: '6px 12px 6px 32px', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }}
                />
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <IconSearch />
                </div>
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Technical & Bugs">Technical & Bugs</option>
                <option value="Billing & Payments">Billing & Payments</option>
                <option value="Account & Security">Account & Security</option>
                <option value="Feature Requests">Feature Requests</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem' }}
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Table / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTickets.map(t => (
              <div key={t.id} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A5B4FC', fontWeight: 600, fontSize: '0.85rem' }}>{t.id}</span>
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                      <span className={`badge badge-${t.status.toLowerCase().replace(' ', '')}`}>{t.status}</span>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.category}
                      </span>
                    </div>
                    <h3 onClick={() => openTicketDetail(t)} style={{ fontSize: '1rem', fontWeight: 700, color: '#F9FAFB', cursor: 'pointer', textDecoration: 'underline decoration-dotted' }}>
                      {t.subject}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '6px', textAlign: 'right' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SLA TARGET</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399' }}>
                        {new Date(t.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.4' }}>{t.description}</p>

                {/* AI Row Meta & Quick Actions */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><IconUser /> {t.customerName}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><IconBot /> <span style={{ color: '#818CF8' }}>{t.assignedAgentName}</span></span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><IconBrain /> Confidence: {(t.confidenceScore * 100).toFixed(0)}%</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openTicketDetail(t)} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IconMessage /> View & AI Reply
                    </button>
                    {t.status !== 'Resolved' && t.status !== 'Closed' && (
                      <button onClick={() => handleStatusChange(t.id, 'Resolved')} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                        Mark Resolved
                      </button>
                    )}
                    {t.status === 'Resolved' && !t.csatScore && (
                      <button onClick={() => setCsatModalTicket(t)} style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                        Rate CSAT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* TICKET DETAIL & COMMENTS DRAWER MODAL WITH PROMINENT CLOSE BUTTON */}
      {selectedTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A5B4FC', fontWeight: 600 }}>{selectedTicket.id}</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{selectedTicket.subject}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#F43F5E', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.8rem' }} title="Close Modal">
                <IconClose /> Close
              </button>
            </div>

            <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>{selectedTicket.description}</p>

            {/* AI Suggested Response Section */}
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#A5B4FC', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconBot /> AI Smart Reply Generator
                </span>
                <button onClick={generateAIReplyDraft} disabled={isGeneratingReply} style={{ background: 'var(--accent-gradient)', border: 'none', color: '#FFF', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  {isGeneratingReply ? 'Generating...' : 'Auto-Draft Response'}
                </button>
              </div>

              {aiDraftReply ? (
                <div>
                  <textarea value={aiDraftReply} onChange={e => setAiDraftReply(e.target.value)} rows={5} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }} />
                  <button onClick={() => { setNewCommentText(aiDraftReply); setAiDraftReply(''); }} style={{ marginTop: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                    Use Draft in Thread
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click "Auto-Draft Response" to generate an empathetic response using AI.</p>
              )}
            </div>

            {/* Comments Thread */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconMessage /> Activity Timeline & Notes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {comments.map((c, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #818CF8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span><strong>{c.author}</strong> ({c.role})</span>
                    <span>{new Date(c.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#E5E7EB' }}>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={newCommentText} onChange={e => setNewCommentText(e.target.value)} placeholder="Write an internal note..." required style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }} />
              <button type="submit" className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Post Note</button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL WITH LIVE AI CLASSIFICATION & PROMINENT CLOSE BUTTON */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                New Support Ticket + AI Live Inference
              </h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#F43F5E', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.8rem' }} title="Close Modal">
                <IconClose /> Close
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Customer Name</label>
                  <input type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} placeholder="e.g. Alex Rivera" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Customer Email</label>
                  <input type="email" value={newCustomerEmail} onChange={e => setNewCustomerEmail(e.target.value)} placeholder="alex@company.com" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Ticket Subject *</label>
                <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Describe the issue title..." required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Detailed Description *</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={4} placeholder="Provide issue details..." required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }} />
              </div>

              {(aiPreview || isClassifying) && (
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed rgba(99, 102, 241, 0.4)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <IconBot />
                    <strong style={{ fontSize: '0.8rem', color: '#A5B4FC' }}>Live AI Inference & Routing Preview</strong>
                    {isClassifying && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Classifying...</span>}
                  </div>

                  {aiPreview && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                      <div><strong>Category:</strong> <span style={{ color: '#38BDF8' }}>{aiPreview.category}</span></div>
                      <div><strong>Priority:</strong> <span style={{ color: '#F43F5E' }}>{aiPreview.priority} (SLA {aiPreview.slaTargetHours}h)</span></div>
                      <div><strong>Sentiment:</strong> <span style={{ color: '#FBBF24' }}>{aiPreview.sentiment}</span></div>
                      <div><strong>Agent:</strong> <span style={{ color: '#34D399' }}>{aiPreview.assignedAgentName} ({aiPreview.routingMatchScore}%)</span></div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSAT RATING MODAL WITH PROMINENT CLOSE BUTTON */}
      {csatModalTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Rate Customer Experience</h3>
              <button onClick={() => setCsatModalTicket(null)} style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#F43F5E', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.75rem' }} title="Close Modal">
                <IconClose /> Close
              </button>
            </div>

            <form onSubmit={handleSubmitCsat} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setCsatRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <IconStar filled={star <= csatRating} />
                  </button>
                ))}
              </div>
              <textarea value={csatFeedbackText} onChange={e => setCsatFeedbackText(e.target.value)} placeholder="Provide customer feedback details..." rows={3} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }} />
              <button type="submit" className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Submit Rating</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
