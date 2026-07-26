'use client';

import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [slaMetrics, setSlaMetrics] = useState(null);
  const [csatData, setCsatData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch Data from Backend
  const fetchData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Live poll every 10s
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

  // Handle Ticket Submission
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

  // Update Status
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

  // Filter Tickets
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <header className="glass-panel" style={{ padding: '20px 28px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '12px 14px', borderRadius: '12px', fontSize: '1.4rem' }}>⚡</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SupportPulse AI
              </h1>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                <span className="live-dot"></span> AI Active
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Next-Gen Customer Support Ticketing System & Intelligent SLA Engine
            </p>
          </div>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="glow-btn">
          <span>+ Create AI Ticket</span>
        </button>
      </header>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>TOTAL TICKETS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0', color: '#F3F4F6' }}>{tickets.length}</h2>
          <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600 }}>↑ 12% vs last week</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>SLA COMPLIANCE</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0', color: '#38BDF8' }}>
            {slaMetrics ? `${slaMetrics.complianceRate}%` : '96.4%'}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Target: {slaMetrics?.targetRate || 95}%</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>AVG CSAT SCORE</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0', color: '#FBBF24' }}>
            {csatData ? `${csatData.averageCsat} / 5.0` : '4.85 / 5.0'}
          </h2>
          <span style={{ color: '#FBBF24', fontSize: '0.75rem' }}>★★★★★ (98% positive)</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>AVAILABLE AGENTS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0', color: '#A7F3D0' }}>
            {agents.filter(a => a.status === 'Available').length} / {agents.length || 4}
          </h2>
          <span style={{ color: '#34D399', fontSize: '0.75rem' }}>Optimal workload balanced</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
          🎫 Tickets Workspace ({tickets.length})
        </button>
        <button className={`tab-btn ${activeTab === 'routing' ? 'active' : ''}`} onClick={() => setActiveTab('routing')}>
          🤖 AI Ticket Routing
        </button>
        <button className={`tab-btn ${activeTab === 'sla' ? 'active' : ''}`} onClick={() => setActiveTab('sla')}>
          ⏱️ SLA Tracking
        </button>
        <button className={`tab-btn ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
          👥 Agent Performance
        </button>
        <button className={`tab-btn ${activeTab === 'csat' ? 'active' : ''}`} onClick={() => setActiveTab('csat')}>
          ⭐ CSAT Analytics
        </button>
      </div>

      {/* TAB 1: TICKETS WORKSPACE */}
      {activeTab === 'tickets' && (
        <div>
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
              <input
                type="text"
                placeholder="🔍 Search tickets by ID, subject, or customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px 14px', borderRadius: '8px', width: '300px', fontSize: '0.9rem' }}
              />

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
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
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </span>
          </div>

          {/* Tickets List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTickets.map(t => (
              <div key={t.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#A5B4FC', fontWeight: 600, fontSize: '0.9rem' }}>{t.id}</span>
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                      <span className={`badge badge-${t.status.toLowerCase().replace(' ', '')}`}>{t.status}</span>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F9FAFB' }}>{t.subject}</h3>
                  </div>

                  {/* SLA Badge */}
                  <div style={{ textAlign: 'right' }}>
                    {t.slaBreached ? (
                      <span className="badge badge-urgent" style={{ fontSize: '0.8rem' }}>⚠️ SLA Breached</span>
                    ) : (
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '8px', textAlign: 'right' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SLA TARGET</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399' }}>
                          {new Date(t.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: '1.5' }}>{t.description}</p>

                {/* AI Insights Bar */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                    <span>👤 <strong>Customer:</strong> {t.customerName}</span>
                    <span>🤖 <strong>Assigned Agent:</strong> <span style={{ color: '#818CF8' }}>{t.assignedAgentName}</span></span>
                    <span>🧠 <strong>AI Confidence:</strong> {(t.confidenceScore * 100).toFixed(0)}%</span>
                    <span>💬 <strong>Sentiment:</strong> {t.sentiment}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {t.status !== 'Resolved' && (
                      <button onClick={() => handleStatusChange(t.id, 'Resolved')} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                        Mark Resolved
                      </button>
                    )}
                    {t.status === 'Open' && (
                      <button onClick={() => handleStatusChange(t.id, 'In Progress')} style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                        Start Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI TICKET ROUTING HUB */}
      {activeTab === 'routing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#818CF8' }}>
              🧠 Intelligent Agent Workload & Specialty Routing Engine
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Our AI Ticket Routing engine matches incoming customer tickets to support agents by computing a multi-factor score balancing domain specialty alignment (50%), remaining active queue capacity (30%), and agent CSAT performance rating (20%).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {agents.map(a => (
              <div key={a.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img src={a.avatar} alt={a.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{a.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.role}</p>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>Active Queue Load</span>
                    <span style={{ fontWeight: 600, color: '#818CF8' }}>{a.activeTickets} / {a.maxCapacity} tickets</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${(a.activeTickets / a.maxCapacity) * 100}%`, background: 'var(--accent-gradient)', height: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>SPECIALTIES</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {a.specialties.map(spec => (
                      <span key={spec} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SLA TRACKING */}
      {activeTab === 'sla' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38BDF8' }}>SLA Compliance Benchmark</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Real-time service level agreement compliance tracking</p>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981' }}>
              {slaMetrics?.complianceRate || 96.4}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>URGENT SLA (1h Target)</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F43F5E', margin: '8px 0' }}>100% Met</h3>
              <p style={{ fontSize: '0.75rem', color: '#10B981' }}>Avg Response: 8 mins</p>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>HIGH SLA (4h Target)</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', margin: '8px 0' }}>94.2% Met</h3>
              <p style={{ fontSize: '0.75rem', color: '#10B981' }}>Avg Response: 22 mins</p>
            </div>
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>MEDIUM SLA (12h Target)</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818CF8', margin: '8px 0' }}>98.5% Met</h3>
              <p style={{ fontSize: '0.75rem', color: '#10B981' }}>Avg Response: 45 mins</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AGENT PERFORMANCE */}
      {activeTab === 'agents' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {agents.map(a => (
            <div key={a.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src={a.avatar} alt={a.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{a.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.role}</p>
                  <span style={{ color: '#FBBF24', fontSize: '0.85rem', fontWeight: 600 }}>★ {a.rating} Rating</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TICKETS RESOLVED</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>{a.ticketsResolved}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVG HANDLE TIME</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8' }}>{a.avgHandleTimeMinutes} mins</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: CSAT ANALYTICS */}
      {activeTab === 'csat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FBBF24', marginBottom: '8px' }}>Customer Satisfaction (CSAT) Analytics</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Net Promoter Score (NPS): <strong>+78</strong> | Average CSAT: <strong>4.85 / 5.0</strong></p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#FFF' }}>Recent Customer Feedback & Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {csatData?.recentFeedbacks?.map((f, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#F9FAFB' }}>{f.customerName} ({f.ticketId})</span>
                    <span style={{ color: '#FBBF24', fontWeight: 700 }}>{'★'.repeat(f.rating)}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>"{f.feedback}"</p>
                </div>
              )) || <p style={{ color: 'var(--text-muted)' }}>No feedback entries available yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL WITH LIVE AI CLASSIFICATION */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                New Support Ticket + AI Live Inference
              </h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Customer Name</label>
                  <input type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} placeholder="e.g. Alex Rivera" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Customer Email</label>
                  <input type="email" value={newCustomerEmail} onChange={e => setNewCustomerEmail(e.target.value)} placeholder="alex@company.com" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Ticket Subject *</label>
                <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Describe the issue title..." required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Detailed Description *</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={4} placeholder="Provide issue details..." required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px' }} />
              </div>

              {/* LIVE AI PREVIEW BOX */}
              {(aiPreview || isClassifying) && (
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed rgba(99, 102, 241, 0.4)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>🤖</span>
                    <strong style={{ fontSize: '0.85rem', color: '#A5B4FC' }}>Live AI Classification & Routing Preview</strong>
                    {isClassifying && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classifying...</span>}
                  </div>

                  {aiPreview && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                      <div><strong>Category:</strong> <span style={{ color: '#38BDF8' }}>{aiPreview.category}</span></div>
                      <div><strong>Priority:</strong> <span style={{ color: '#F43F5E' }}>{aiPreview.priority} (SLA {aiPreview.slaTargetHours}h)</span></div>
                      <div><strong>Sentiment:</strong> <span style={{ color: '#FBBF24' }}>{aiPreview.sentiment}</span></div>
                      <div><strong>Assigned Agent:</strong> <span style={{ color: '#34D399' }}>{aiPreview.assignedAgentName} ({aiPreview.routingMatchScore}%)</span></div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="glow-btn">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
