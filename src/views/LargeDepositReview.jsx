import React from 'react';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const T = {
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  surface2: '#F9FAFC',
  border: '#E5E8F0',
  borderStrong: '#D1D6E1',
  text: '#0B1B2B',
  textSec: '#5A6577',
  textTert: '#8B95A6',
  navy: '#0A1F44',
  primary: '#2453D6',
  primary50: '#EEF3FE',
  primary100: '#DDE6FD',
  teal: '#0DBFA8',
  amber: '#D97706',
  amber50: '#FEF6E7',
  amber100: '#FDE9C2',
  amberRow: '#FFF8E1',
  green: '#0E9F6E',
  green50: '#E7F8F1',
  red: '#DC2A2A',
  red50: '#FDECEC',
};

// ─── Pill component ───────────────────────────────────────────────────────────
function Pill({ dot, label, variant = 'neutral', style: extra }) {
  const variants = {
    success: { bg: T.green50, color: T.green, dotColor: T.green },
    warn:    { bg: T.amber50, color: T.amber, dotColor: T.amber },
    info:    { bg: T.primary50, color: T.primary, dotColor: T.primary },
    neutral: { bg: '#F1F2F5', color: T.textSec, dotColor: T.textTert },
    danger:  { bg: T.red50, color: T.red, dotColor: T.red },
  };
  const v = variants[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: v.bg, color: v.color,
      borderRadius: 999, padding: '2px 9px',
      fontSize: 11.5, fontWeight: 600, lineHeight: 1.4,
      whiteSpace: 'nowrap', ...extra,
    }}>
      {dot !== false && <span style={{ width: 6, height: 6, borderRadius: '50%', background: v.dotColor, flexShrink: 0 }}/>}
      {label}
    </span>
  );
}

// ─── Top App Nav ──────────────────────────────────────────────────────────────
function AppNav({ onBack }) {
  const navItems = [
    { label: 'Pipeline' },
    { label: 'Loans', active: true },
    { label: 'Tasks', badge: '12' },
    { label: 'Conditions' },
    { label: 'Reports' },
  ];
  return (
    <div style={{
      height: 56, background: T.navy, display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 8, flexShrink: 0, position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 28 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'linear-gradient(135deg, #2453D6, #0DBFA8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
        }}>X</div>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>Xpanse</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 400 }}>LOS</span>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {navItems.map(item => (
          <button key={item.label} style={{
            height: 32, padding: '0 12px', borderRadius: 6, border: 'none',
            background: item.active ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: item.active ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize: 13, fontWeight: item.active ? 600 : 400,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {item.label}
            {item.badge && (
              <span style={{ background: T.red, color: '#fff', fontSize: 10, fontWeight: 700, padding: '0 5px', borderRadius: 999, lineHeight: '16px' }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 7, padding: '0 11px', height: 32, width: 200,
        }}>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12.5 }}>Search loans…</span>
        </div>
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2453D6, #0DBFA8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer',
        }}>JM</div>
        {/* Back button */}
        {onBack && (
          <button onClick={onBack} style={{
            height: 30, padding: '0 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', marginLeft: 8,
          }}>← Back</button>
        )}
      </div>
    </div>
  );
}

// ─── Loan Header Strip ────────────────────────────────────────────────────────
function LoanHeaderStrip() {
  return (
    <div style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: '0 24px', height: 73, display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0,
    }}>
      {/* Loan ID + borrower */}
      <div style={{ minWidth: 160 }}>
        <div style={{ fontSize: 11, color: T.textTert, fontFamily: 'DM Sans', letterSpacing: '0.04em' }}>LN-2024-0234</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginTop: 1 }}>Marcus & Emily Chen</div>
      </div>

      <div style={{ width: 1, height: 36, background: T.border }}/>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
        {[
          { label: 'Loan Amount', value: '$485,000', mono: true },
          { label: 'Type', value: 'Conv · 30yr Fixed · 6.875%' },
          { label: 'Purpose', value: 'Purchase' },
          { label: 'Property', value: '1247 Maple Ave, Austin TX' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 10.5, color: T.textTert, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 2, fontFamily: s.mono ? 'DM Sans' : 'inherit' }}>{s.value}</div>
          </div>
        ))}

        {/* LTV/DTI/FICO */}
        <div>
          <div style={{ fontSize: 10.5, color: T.textTert, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LTV / DTI / FICO</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 2, fontFamily: 'DM Sans' }}>80% · 38% · 742</div>
        </div>

        {/* AUS */}
        <div>
          <div style={{ fontSize: 10.5, color: T.textTert, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AUS</div>
          <div style={{ marginTop: 2 }}>
            <Pill label="DU · Approve / Eligible" variant="success" dot={true}/>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {['Export', '1003'].map(b => (
          <button key={b} style={{
            height: 32, padding: '0 14px', borderRadius: 7,
            border: `1px solid ${T.borderStrong}`, background: T.surface,
            color: T.textSec, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{b}</button>
        ))}
        <button style={{
          height: 32, padding: '0 16px', borderRadius: 7, border: 'none',
          background: T.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Run AUS</button>
      </div>
    </div>
  );
}

// ─── Conditions data ──────────────────────────────────────────────────────────
const CONDITIONS = [
  { id: 1,  icon: 'check', title: 'W2s — 2024, 2025',                    tags: ['DU'],           state: 'Verified',         time: '2d ago',   status: 'done' },
  { id: 2,  icon: 'check', title: 'Pay stubs — last 30 days',             tags: ['DU'],           state: 'Verified',         time: '2d ago',   status: 'done' },
  { id: 3,  icon: 'check', title: 'VOE — The Work Number',                tags: ['DU'],           state: 'Verified',         time: '1d ago',   status: 'done' },
  { id: 4,  icon: 'warn',  title: 'Review large deposit — $12,500 on 4/12', tags: ['AI','Asset'], state: 'Open',             time: '2h ago',   status: 'warn', selected: true },
  { id: 5,  icon: 'user',  title: 'Source of funds letter — $12,500 deposit', tags: ['Manual'],  state: 'Awaiting borrower',time: '',         status: 'awaiting' },
  { id: 6,  icon: 'check', title: 'Bank statements — 2 mo Wells Fargo',   tags: ['DU'],           state: 'Received',         time: '2h ago',   status: 'done' },
  { id: 7,  icon: 'user',  title: 'Homeowners insurance binder',          tags: ['DU'],           state: 'Awaiting borrower',time: '',         status: 'awaiting' },
  { id: 8,  icon: 'check', title: 'Title commitment',                     tags: ['DU'],           state: 'Received',         time: '3d ago',   status: 'done' },
  { id: 9,  icon: 'clock', title: 'Appraisal — ordered, scheduled 5/22', tags: ['DU'],           state: 'In progress',      time: '',         status: 'pending' },
  { id: 10, icon: 'check', title: 'Credit report',                        tags: ['DU'],           state: 'Verified',         time: '5d ago',   status: 'done' },
  { id: 11, icon: 'clock', title: 'HOI policy declarations',              tags: ['Manual'],       state: 'Pending',          time: '',         status: 'pending' },
  { id: 12, icon: 'user',  title: 'Final 1003 — signed',                  tags: ['DU'],           state: 'Awaiting borrower',time: '',         status: 'awaiting' },
];

const STATUS_COLORS = {
  done:     { icon: T.green,   bg: 'transparent' },
  warn:     { icon: T.amber,   bg: T.amber50 },
  awaiting: { icon: T.primary, bg: 'transparent' },
  pending:  { icon: T.textTert,bg: 'transparent' },
};

function ConditionIcon({ type, color }) {
  const s = { width: 16, height: 16, flexShrink: 0 };
  if (type === 'check') return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
  );
  if (type === 'warn') return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="m10.29 3.86-8.49 14.7A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-3.44L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  );
  if (type === 'user') return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
  return (
    <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

// ─── Left Column ──────────────────────────────────────────────────────────────
function LeftColumn({ selectedId, setSelectedId, activeTab, setActiveTab }) {
  const filteredConditions = activeTab === 'outstanding'
    ? CONDITIONS.filter(c => c.status !== 'done')
    : activeTab === 'resolved'
    ? CONDITIONS.filter(c => c.status === 'done')
    : CONDITIONS;

  const outstandingCount = CONDITIONS.filter(c => c.status !== 'done').length;
  const resolvedCount = CONDITIONS.filter(c => c.status === 'done').length;

  return (
    <div style={{
      width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${T.border}`, overflowY: 'auto', background: T.surface,
    }}>
      {/* Loan Snapshot */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Loan Snapshot</div>
          <Pill label="In Processing" variant="info" dot/>
        </div>
        {[
          { label: 'Closing target', value: 'Jun 15, 2026' },
          { label: 'Days in processing', value: '11 days' },
          { label: 'Loan Officer', value: 'M. Alvarez' },
          { label: 'Processor', value: 'You · J. Miller', highlight: true },
          { label: 'Underwriter', value: 'Unassigned', muted: true },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: T.textTert }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: r.highlight ? 600 : 500, color: r.muted ? T.textTert : T.text }}>{r.value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: T.border, margin: '10px 0' }}/>
        <div style={{ fontSize: 12, color: T.textTert, marginBottom: 6 }}>Conditions complete</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>7 of 12</span>
          <span style={{ fontSize: 11, color: T.textTert }}>58%</span>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: T.border, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '58%', borderRadius: 999,
            background: `linear-gradient(90deg, ${T.navy}, ${T.teal})`,
          }}/>
        </div>
      </div>

      {/* 1003 At-a-Glance */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>1003 At-a-Glance</div>
        {[
          { label: 'Employer', value: 'Xpanse, Inc.' },
          { label: 'Job title', value: 'Sr. Product Manager' },
          { label: 'Start date', value: 'Mar 2022' },
          { label: 'Base income', value: '$145,000/yr', mono: true },
          { label: 'Monthly qualifying', value: '$12,083', mono: true, bold: true },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: T.textTert }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: r.bold ? 700 : 500, color: T.text, fontFamily: r.mono ? 'DM Sans' : 'inherit' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: T.border, margin: '8px 0' }}/>
        <div style={{ fontSize: 11.5, color: T.textTert, lineHeight: 1.6 }}>
          Liquid assets stated <b style={{ color: T.text }}>$112,400</b> · Liabilities <b style={{ color: T.text }}>2 auto, 1 credit</b> · REO owned <b style={{ color: T.text }}>None declared</b>
        </div>
      </div>

      {/* Conditions list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, padding: '0 8px' }}>
          {[
            { id: 'outstanding', label: 'Outstanding', count: outstandingCount },
            { id: 'resolved', label: 'Resolved', count: resolvedCount },
            { id: 'all', label: 'All', count: 12 },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, padding: '9px 0', border: 'none', background: 'transparent',
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? T.primary : T.textTert,
                borderBottom: active ? `2px solid ${T.primary}` : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.1s',
              }}>
                {tab.label} <span style={{ fontSize: 11, opacity: 0.8 }}>({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Condition rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConditions.map(c => {
            const selected = c.id === selectedId;
            const sc = STATUS_COLORS[c.status];
            return (
              <div key={c.id} onClick={() => setSelectedId(c.id)} style={{
                padding: '10px 14px',
                background: selected ? T.primary50 : 'transparent',
                borderLeft: selected ? `3px solid ${T.primary}` : '3px solid transparent',
                borderBottom: `1px solid ${T.border}`,
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <div style={{ marginTop: 1, flexShrink: 0 }}>
                    <ConditionIcon type={c.icon} color={sc.icon}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: c.status === 'warn' ? 700 : 500, color: T.text, lineHeight: 1.35 }}>{c.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
                      {c.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                          background: tag === 'AI' ? T.primary50 : tag === 'Manual' ? '#F1F2F5' : '#F1F2F5',
                          color: tag === 'AI' ? T.primary : T.textTert,
                        }}>{tag}</span>
                      ))}
                      <span style={{ fontSize: 11, color: c.status === 'warn' ? T.amber : T.textTert }}>{c.state}</span>
                      {c.time && <span style={{ fontSize: 11, color: T.textTert }}>· {c.time}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Transaction Table ─────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { date: '04/03', desc: 'XPANSE INC PAYROLL Direct Dep', amount: '+$5,247.18', balance: '$23,680.09', type: 'credit' },
  { date: '04/05', desc: 'RENT PAYMENT Zelle to Greystar', amount: '-$2,250.00', balance: '$21,430.09', type: 'debit' },
  { date: '04/07', desc: 'HEB #5172 Austin TX', amount: '-$142.83', balance: '$21,287.26', type: 'debit' },
  { date: '04/08', desc: 'AT&T Wireless Payment', amount: '-$95.00', balance: '$21,192.26', type: 'debit' },
  { date: '04/10', desc: 'CHASE CC PAYMENT', amount: '-$1,420.00', balance: '$19,772.26', type: 'debit' },
  { date: '04/12', desc: 'MOBILE DEPOSIT · CHECK', amount: '+$12,500.00', balance: '$32,272.26', type: 'flagged' },
  { date: '04/14', desc: 'SHELL OIL 12442', amount: '-$58.42', balance: '$32,213.84', type: 'debit' },
  { date: '04/17', desc: 'XPANSE INC PAYROLL Direct Dep', amount: '+$5,247.18', balance: '$37,461.02', type: 'credit' },
  { date: '04/19', desc: 'WHOLE FOODS MKT 10283', amount: '-$187.44', balance: '$37,273.58', type: 'debit' },
  { date: '04/22', desc: 'AMERICAN AIRLINES TKT', amount: '-$486.00', balance: '$36,787.58', type: 'debit' },
  { date: '04/24', desc: 'VENMO Cashout from K Chen', amount: '+$299.81', balance: '$37,087.39', type: 'credit' },
  { date: '04/28', desc: 'CITY OF AUSTIN UTIL', amount: '-$209.32', balance: '$36,878.07', type: 'debit' },
  { date: '04/30', desc: 'ALLSTATE INS PREM', amount: '-$157.00', balance: '$36,721.07', type: 'debit' },
  { date: '04/30', desc: 'SERVICE FEE', amount: '-$2,500.00', balance: '$34,221.07', type: 'debit' },
];

// ─── Center Column ─────────────────────────────────────────────────────────────
function CenterColumn() {
  const [page, setPage] = React.useState(2);

  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb + task header */}
      <div style={{ padding: '16px 24px 0', background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 11.5, color: T.textTert, marginBottom: 10 }}>
          Conditions &rsaquo; Assets &rsaquo; <span style={{ color: T.text, fontWeight: 600 }}>Large Deposit Review</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Verify $12,500 deposit on 4/12/2026</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, color: T.textSec, fontFamily: 'DM Sans' }}>Wells Fargo Checking ••4892</span>
              <span style={{ color: T.borderStrong }}>·</span>
              <span style={{ fontSize: 12.5, color: T.textSec }}>Statement: Apr 1 – Apr 30, 2026</span>
              <span style={{ color: T.borderStrong }}>·</span>
              <Pill label="Needs review" variant="warn" dot/>
              <span style={{ color: T.borderStrong }}>·</span>
              <span style={{ fontSize: 12, color: T.textTert }}>Condition #4 of 12</span>
            </div>
          </div>
          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button style={{
              height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${T.borderStrong}`,
              background: T.surface, color: T.textSec, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>← Prev</button>
            <button style={{
              height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${T.borderStrong}`,
              background: T.surface, color: T.textSec, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>Next →</button>
          </div>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* AI Flag callout */}
        <div style={{
          background: T.amber50, border: `1px solid ${T.amber100}`, borderRadius: 10,
          padding: '14px 16px', display: 'flex', gap: 12,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.amber, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>AI Flagged This Transaction</div>
            <div style={{ fontSize: 13, color: '#7A3D00', lineHeight: 1.55 }}>
              A single deposit of <b>$12,500.00</b> exceeds the <b>50% of monthly qualifying income threshold ($6,041.50)</b>. Source must be documented and sourced per agency guidelines <b>(Fannie Mae B3-4.2-02)</b>. No payroll memo or recurring pattern matched — likely non-payroll origin.
            </div>
          </div>
        </div>

        {/* Document viewer */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {/* Viewer toolbar */}
          <div style={{
            padding: '9px 14px', background: T.surface2, borderBottom: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {/* File icon */}
            <svg width="16" height="16" fill="none" stroke={T.textTert} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{ fontSize: 12, color: T.textSec, fontFamily: 'DM Sans', flex: 1 }}>WellsFargo_Checking_4892_Apr2026.pdf</span>
            {/* Classification chips */}
            <span style={{ fontSize: 11, fontWeight: 600, background: T.green50, color: T.green, padding: '2px 8px', borderRadius: 5 }}>Classified: Bank Statement</span>
            <span style={{ fontSize: 11, fontWeight: 600, background: T.primary50, color: T.primary, padding: '2px 8px', borderRadius: 5 }}>2 mo · req'd</span>
            {/* Page nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${T.borderStrong}`, background: T.surface, cursor: 'pointer', fontSize: 13 }}>‹</button>
              <span style={{ fontSize: 12, color: T.textSec, fontFamily: 'DM Sans' }}>{page}/4</span>
              <button onClick={() => setPage(p => Math.min(4, p + 1))} style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${T.borderStrong}`, background: T.surface, cursor: 'pointer', fontSize: 13 }}>›</button>
            </div>
            {/* Toolbar icons */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                <path key="z" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>,
                <><rect key="r" x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></>,
                <><path key="d" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
              ].map((icon, i) => (
                <button key={i} style={{ width: 26, height: 26, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke={T.textTert} strokeWidth="1.8" viewBox="0 0 24 24">{icon}</svg>
                </button>
              ))}
            </div>
          </div>

          {/* Faux PDF page */}
          <div style={{ padding: 20, background: '#EAEAEA' }}>
            <div style={{
              background: '#fff', maxWidth: 680, margin: '0 auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              borderRadius: 2, overflow: 'hidden', fontSize: 12,
            }}>
              {/* WF Header */}
              <div style={{ background: '#C8102E', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: '0.08em' }}>WELLS FARGO</div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, marginTop: 3 }}>Everyday Checking · Account ending in 4892</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Marcus & Emily Chen</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>1247 Maple Ave, Austin TX 78704</div>
                </div>
              </div>

              {/* Account summary */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', background: '#FAFAFA' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Statement Period</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>April 1 – April 30, 2026</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Page</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>2 of 4</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Account #</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'DM Sans' }}>****4892</div>
                </div>
              </div>

              {/* Summary grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #E5E7EB' }}>
                {[
                  { label: 'Beginning Balance', value: '$18,432.91' },
                  { label: 'Deposits/Credits', value: '+$23,294.17', color: '#0E9F6E' },
                  { label: 'Withdrawals/Debits', value: '-$7,506.01', color: '#DC2A2A' },
                  { label: 'Ending Balance', value: '$34,221.07', bold: true },
                ].map(s => (
                  <div key={s.label} style={{ padding: '10px 14px', borderRight: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: s.bold ? 700 : 600, color: s.color || '#111', fontFamily: 'DM Sans' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Transaction history */}
              <div style={{ padding: '12px 20px 4px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#444', marginBottom: 8 }}>Transaction History</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                      {['Date', 'Description', 'Amount', 'Balance'].map((h, i) => (
                        <th key={h} style={{ padding: '4px 6px', textAlign: i >= 2 ? 'right' : 'left', fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSACTIONS.map((tx, i) => {
                      const flagged = tx.type === 'flagged';
                      return (
                        <tr key={i} style={{
                          background: flagged ? '#FFF8E1' : 'transparent',
                          borderLeft: flagged ? '3px solid #D97706' : '3px solid transparent',
                          position: 'relative',
                        }}>
                          <td style={{ padding: '5px 6px', fontFamily: 'DM Sans', color: flagged ? '#7A3D00' : '#333', fontWeight: flagged ? 700 : 400 }}>{tx.date}</td>
                          <td style={{ padding: '5px 6px', color: flagged ? '#7A3D00' : '#222', fontWeight: flagged ? 700 : 400 }}>
                            {tx.desc}
                            {flagged && (
                              <span style={{
                                marginLeft: 8, fontSize: 10, fontWeight: 700,
                                background: '#D97706', color: '#fff', padding: '1px 7px', borderRadius: 999,
                              }}>Flagged · Source Unknown</span>
                            )}
                          </td>
                          <td style={{
                            padding: '5px 6px', textAlign: 'right', fontFamily: 'DM Sans',
                            fontWeight: flagged ? 700 : 500,
                            color: flagged ? '#7A3D00' : tx.type === 'credit' ? T.green : '#333',
                          }}>{tx.amount}</td>
                          <td style={{ padding: '5px 6px', textAlign: 'right', fontFamily: 'DM Sans', color: flagged ? '#7A3D00' : '#333', fontWeight: flagged ? 700 : 400 }}>{tx.balance}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ height: 16 }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Request Modal ─────────────────────────────────────────────────────────────
function RequestModal({ onClose }) {
  const [msg, setMsg] = React.useState(
`Hi Marcus & Emily,

We're reviewing your loan file and need to verify the source of a deposit that appeared on your April 2026 bank statement:

  • Date: April 12, 2026
  • Amount: $12,500.00
  • Description: MOBILE DEPOSIT · CHECK

Per agency guidelines, we need documentation that explains the origin of this deposit. Please upload one or more of the following that applies:

  □ Gift letter (signed by donor, with donor's bank statement)
  □ Brokerage or investment account withdrawal statement
  □ Copy of check + explanation letter
  □ Tax refund documentation (IRS notice or state refund confirmation)
  □ Sale of asset documentation (bill of sale, etc.)

Please respond within 3 business days. If you have any questions, don't hesitate to reach out.

Thank you,
J. Miller — Loan Processor, Xpanse Mortgage`
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,31,68,0.5)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: T.surface, borderRadius: 14, width: '100%', maxWidth: 560,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Request explanation from borrower</div>
            <div style={{ fontSize: 12, color: T.textTert, marginTop: 3 }}>Re: $12,500 deposit on 4/12/2026 · Marcus & Emily Chen</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: T.bg, cursor: 'pointer', fontSize: 16, color: T.textSec }}>×</button>
        </div>

        {/* To / From */}
        <div style={{ padding: '12px 20px', background: T.surface2, borderBottom: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'To', value: 'marcus.chen@email.com · emily.chen@email.com' },
            { label: 'From', value: 'jmiller@xpansemortgage.com (Borrower Portal)' },
            { label: 'Re', value: 'Loan LN-2024-0234 · Document Request #DR-04' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              <span style={{ color: T.textTert, width: 36, flexShrink: 0 }}>{r.label}</span>
              <span style={{ color: T.text, fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div style={{ padding: 16 }}>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            style={{
              width: '100%', height: 260, border: `1px solid ${T.borderStrong}`, borderRadius: 8,
              padding: '10px 12px', fontSize: 12.5, lineHeight: 1.6, fontFamily: 'inherit',
              color: T.text, resize: 'vertical', outline: 'none', background: T.surface,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, height: 38, borderRadius: 8, border: `1px solid ${T.borderStrong}`,
            background: T.surface, color: T.textSec, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => { console.log('Send request', msg); onClose(); }} style={{
            flex: 2, height: 38, borderRadius: 8, border: 'none',
            background: T.primary, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send via borrower portal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Right Column ─────────────────────────────────────────────────────────────
function RightColumn({ onRequestOpen }) {
  const crossChecks = [
    { icon: 'check', color: T.green, bg: T.green50, text: 'Stated income matches payroll pattern', detail: '2× $5,247.18 deposits in Apr.', sub: 'Cross-check vs. 1003 income · W2 verified' },
    { icon: 'warn',  color: T.amber, bg: T.amber50, text: 'Deposit not present on Mar statement. No recurring pattern.', detail: '', sub: '2-month statement analysis · prior month' },
    { icon: 'info',  color: T.primary, bg: T.primary50, text: 'Borrower listed Vanguard brokerage ($87.2k) and WF savings ($25.2k) on 1003. No transfer matched.', detail: '', sub: '1003 Section 2a · Other accounts' },
    { icon: 'info',  color: T.primary, bg: T.primary50, text: 'No REO owned per 1003 — sale of property unlikely as source.', detail: '', sub: '1003 Section 3 · Real estate owned' },
  ];

  return (
    <div style={{
      width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderLeft: `1px solid ${T.border}`, background: T.surface, overflowY: 'auto',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 160 }}>

        {/* AI Summary */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              background: `linear-gradient(90deg, ${T.primary}, ${T.teal})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Xpanse AI</div>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${T.primary}33, transparent)` }}/>
          </div>
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>
            Borrower's qualifying monthly income is <b style={{ color: T.text }}>$12,083</b>. The flagged deposit (<b style={{ color: T.text }}>$12,500</b>) is <b style={{ color: T.amber }}>103% of monthly income</b> and appears to be a one-time mobile check deposit — not payroll. Recurring Xpanse payroll deposits ($5,247.18 bi-weekly) line up with stated income on the 1003.
            <br/><br/>
            No matching transaction on the prior month statement. Source of funds documentation required before clear-to-close.
          </div>
        </div>

        {/* Cross-checked context */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Cross-checked context</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {crossChecks.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: c.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  {c.icon === 'check' && <svg width="11" height="11" fill="none" stroke={c.color} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>}
                  {c.icon === 'warn'  && <svg width="11" height="11" fill="none" stroke={c.color} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                  {c.icon === 'info'  && <svg width="11" height="11" fill="none" stroke={c.color} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="17" x2="12" y2="11"/><line x1="12" y1="7" x2="12.01" y2="7"/></svg>}
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.45 }}>
                    {c.text} {c.detail && <b style={{ color: T.text }}>{c.detail}</b>}
                  </div>
                  <div style={{ fontSize: 11, color: T.textTert, marginTop: 2, fontStyle: 'italic' }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Likely sources */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Likely sources — request docs</div>
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 9, padding: '10px 14px' }}>
            {[
              'Brokerage / investment account withdrawal',
              'Tax refund (IRS or state)',
              'Gift from family member (needs gift letter)',
              'Bonus or commission paycheck',
              'Sale of personal asset (vehicle, etc.)',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < 4 ? `1px solid ${T.border}` : 'none' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.primary, flexShrink: 0 }}/>
                <span style={{ fontSize: 12.5, color: T.textSec }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Activity</div>
          {[
            { initials: 'AI', color: T.primary, bg: T.primary50, body: 'Bank statement classified and parsed.', time: '2 hrs ago', source: 'Doc AI' },
            { initials: 'SC', color: T.green, bg: T.green50, body: 'Borrower uploaded WellsFargo_Checking_4892_Apr2026.pdf', time: '2 hrs ago', source: 'Borrower portal' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: a.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: a.color, flexShrink: 0,
              }}>{a.initials}</div>
              <div>
                <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.4 }}>{a.body}</div>
                <div style={{ fontSize: 11, color: T.textTert, marginTop: 3 }}>{a.time} · {a.source}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: T.surface, borderTop: `1px solid ${T.border}`,
        padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <button onClick={onRequestOpen} style={{
          width: '100%', height: 40, borderRadius: 8, border: 'none',
          background: T.primary, color: '#fff', fontSize: 13.5, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: `0 2px 8px ${T.primary}55`,
        }}>
          <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Request explanation from borrower
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Mark verified', 'Add note'].map(b => (
            <button key={b} onClick={() => console.log(b)} style={{
              flex: 1, height: 36, borderRadius: 7, border: `1px solid ${T.borderStrong}`,
              background: T.surface, color: T.textSec, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
            }}>{b}</button>
          ))}
        </div>
        <button onClick={() => console.log('Escalate to underwriter')} style={{
          width: '100%', height: 34, borderRadius: 7, border: 'none',
          background: 'transparent', color: T.textTert, fontSize: 12.5, fontWeight: 500,
          cursor: 'pointer', textDecoration: 'underline',
        }}>Escalate to underwriter</button>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export function LargeDepositReviewView({ onBack }) {
  const [selectedId, setSelectedId] = React.useState(4);
  const [activeTab, setActiveTab] = React.useState('outstanding');
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', fontFamily: 'DM Sans',
      fontSize: 13, color: T.text, background: T.bg, overflow: 'hidden',
    }}>
      <AppNav onBack={onBack}/>
      <LoanHeaderStrip/>

      {/* 3-column work area */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr 360px', minHeight: 0, overflow: 'hidden' }}>
        <LeftColumn selectedId={selectedId} setSelectedId={setSelectedId} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <CenterColumn/>
        <RightColumn onRequestOpen={() => setModalOpen(true)}/>
      </div>

      {modalOpen && <RequestModal onClose={() => setModalOpen(false)}/>}
    </div>
  );
}
