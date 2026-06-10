import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../components/Icon';
import { WidgetGrid, PipelineSnapshotWidget, ClosingCountdownWidget, RateWatchWidget, ConditionsTrackerWidget, QuickActionsWidget, RecentActivityWidget,
         FilesAtRiskWidget, ReadyForUWWidget, LockClockWidget, WaitingOnBorrowerWidget } from './WidgetGrid';
import { AIInsightsBanner } from './Pipeline';
import { AIInsightsCards } from './AIInsightsCards';
import { LoanHealthMonitorWidget } from './LoanHealthMonitor';
import { LOANS } from '../data/loans';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAM = [
  { name: 'Jordan Schonegg', initials: 'JS', color: '#4A39C9', loans: 4, online: true,  you: true  },
  { name: 'Jamie Lee',     initials: 'JL', color: '#C25535', loans: 2, online: true,  you: false },
  { name: 'Priya Shah',    initials: 'PS', color: '#2A8C53', loans: 2, online: false, you: false },
];

const STATS = [
  { label: 'Open Conditions',   value: '14',      delta: '−3 cleared yesterday', up: true,  alert: false },
  { label: 'Awaiting Docs',     value: '3 files', sub: 'Chen · Wang · Johnson',             alert: true  },
  { label: 'Locks Expiring',    value: '2 loans', delta: 'Next: Oben in 3 days', up: false, alert: true  },
  { label: 'Closing This Week', value: '1 loan',  sub: 'Wang · $780K · May 22',             alert: false },
];

const TASKS = [
  { id: 't7', loanId: 'LN-2024-0391', borrower: 'Carlos Rivera', initials: 'CR', color: '#B91C1C',
    label: 'FEMA disaster review — Rivera', context: 'Property in DR-4830-FL disaster zone · Hurricane Milton · Action required',
    dueLabel: 'Today', daysLeft: 0, tab: 'now', urgent: true, fema: true },
  { id: 't6', loanId: 'LN-2024-0267', borrower: 'Marcus Johnson', initials: 'MJ', color: '#7B3FA0',
    label: 'Send pre-approval letter', context: 'Marcus texted — making an offer on 74 Pine Ridge',
    dueLabel: 'Today', daysLeft: 0, tab: 'now', urgent: true },
  { id: 't1', loanId: 'LN-2024-0211', borrower: 'Jennifer Wang', initials: 'JW', color: '#3A6BAD',
    label: 'Send Closing Disclosure', context: 'Required 3 business days before closing',
    dueLabel: 'Today', daysLeft: 0, tab: 'closing', urgent: true },
  { id: 't2', loanId: 'LN-2024-0245', borrower: 'Michael Oben', initials: 'MO', color: '#A8541C',
    label: 'Extend rate lock — Oben', context: 'Expires May 21 · 2.875% / Conv 30yr',
    dueLabel: 'May 21', daysLeft: 3, tab: 'pricing', urgent: true },
  { id: 't3', loanId: 'LN-2024-0189', borrower: 'David Chen', initials: 'DC', color: '#2A8C53',
    label: 'Chase updated paystub', context: 'Current doc expires May 24 · 30-day window',
    dueLabel: 'May 22', daysLeft: 3, tab: 'conditions', urgent: false },
  { id: 't4', loanId: 'LN-2024-0289', borrower: 'Rachel Kim', initials: 'RK', color: '#7B3FA0',
    label: 'Clear 2 UW conditions', context: 'C-004 VOE · C-009 gift letter both received',
    dueLabel: 'May 20', daysLeft: 2, tab: 'conditions', urgent: false },
  { id: 't5', loanId: 'LN-2024-0312', borrower: 'Thomas Park', initials: 'TP', color: '#3A8294',
    label: 'Follow up on appraisal', context: 'Ordered May 10 · 9 days out · ETA unknown',
    dueLabel: 'May 23', daysLeft: 5, tab: 'now', urgent: false },
];

const AI_ACTIONS = [
  { id: 'a1', loanId: 'LN-2024-0234', initials: 'SA', color: '#A8541C', label: 'Anderson upload clears C-002 + C-007', conf: 97, tab: 'conditions' },
  { id: 'a2', loanId: 'LN-2024-0189', initials: 'DC', color: '#2A8C53', label: 'Appraisal gap — suggest rebuttal for Chen', conf: 88, tab: 'now' },
  { id: 'a3', loanId: 'LN-2024-0289', initials: 'RK', color: '#7B3FA0', label: 'Gift letter satisfies C-009 — Kim', conf: 91, tab: 'conditions' },
];

const ACTIVITY = [
  { initials: 'SA', color: '#A8541C', loanId: 'LN-2024-0234', tab: 'conditions', text: 'Anderson uploaded paystub + bank statements', time: '8m ago', actionable: true },
  { initials: 'UW', color: '#2563EB', loanId: 'LN-2024-0289', tab: 'conditions', text: 'UW returned Kim — 2 new conditions', time: '42m ago', actionable: true },
  { initials: 'AP', color: '#D97706', loanId: 'LN-2024-0189', tab: 'now', text: 'Appraisal in — Chen · $518K · 3% below contract', time: '1h ago', actionable: true },
  { initials: 'TI', color: '#059669', loanId: 'LN-2024-0301', tab: 'now', text: 'Title commitment received — Rodriguez', time: '3h ago', actionable: false },
];

// Rich leaderboard data per period
// volume in thousands, pipeline in thousands, avgDays lower = better
const LB_DATA = {
  MTD: [
    { id: 'js', name: 'Jordan Schonegg', initials: 'JS', color: '#4A39C9', you: true,  title: 'Sr. Loan Officer', volume: 1970, units: 3, avgDays: 24, pipeline: 2540, delta: 0,  goal: 2500 },
    { id: 'jl', name: 'Jamie Lee',       initials: 'JL', color: '#C25535', you: false, title: 'Loan Officer',     volume: 1420, units: 2, avgDays: 28, pipeline: 1980, delta: 1,  goal: 2000 },
    { id: 'ps', name: 'Priya Shah',      initials: 'PS', color: '#2A8C53', you: false, title: 'Loan Officer',     volume: 1080, units: 2, avgDays: 31, pipeline: 1640, delta: -1, goal: 2000 },
    { id: 'mw', name: 'Marcus Webb',     initials: 'MW', color: '#7B3FA0', you: false, title: 'Jr. Loan Officer', volume:  610, units: 1, avgDays: 36, pipeline:  890, delta: 0,  goal: 1500 },
    { id: 'rn', name: 'Riley Nash',      initials: 'RN', color: '#0E9F6E', you: false, title: 'Jr. Loan Officer', volume:  480, units: 1, avgDays: 41, pipeline:  720, delta: 1,  goal: 1200 },
    { id: 'ac', name: 'Alex Chen',       initials: 'AC', color: '#D97706', you: false, title: 'Loan Officer',     volume:  320, units: 1, avgDays: 44, pipeline:  550, delta: -1, goal: 1500 },
  ],
  QTD: [
    { id: 'js', name: 'Jordan Schonegg', initials: 'JS', color: '#4A39C9', you: true,  title: 'Sr. Loan Officer', volume: 7400, units: 11, avgDays: 23, pipeline: 2540, delta: 0,  goal: 10000 },
    { id: 'ps', name: 'Priya Shah',      initials: 'PS', color: '#2A8C53', you: false, title: 'Loan Officer',     volume: 5900, units:  9, avgDays: 27, pipeline: 1640, delta: 2,  goal: 8000 },
    { id: 'jl', name: 'Jamie Lee',       initials: 'JL', color: '#C25535', you: false, title: 'Loan Officer',     volume: 5200, units:  8, avgDays: 29, pipeline: 1980, delta: -1, goal: 8000 },
    { id: 'mw', name: 'Marcus Webb',     initials: 'MW', color: '#7B3FA0', you: false, title: 'Jr. Loan Officer', volume: 2800, units:  5, avgDays: 34, pipeline:  890, delta: 0,  goal: 5000 },
    { id: 'ac', name: 'Alex Chen',       initials: 'AC', color: '#D97706', you: false, title: 'Loan Officer',     volume: 2100, units:  3, avgDays: 39, pipeline:  550, delta: 1,  goal: 5000 },
    { id: 'rn', name: 'Riley Nash',      initials: 'RN', color: '#0E9F6E', you: false, title: 'Jr. Loan Officer', volume: 1600, units:  3, avgDays: 42, pipeline:  720, delta: -1, goal: 4000 },
  ],
  YTD: [
    { id: 'js', name: 'Jordan Schonegg', initials: 'JS', color: '#4A39C9', you: true,  title: 'Sr. Loan Officer', volume: 18200, units: 27, avgDays: 24, pipeline: 2540, delta: 0,  goal: 30000 },
    { id: 'ps', name: 'Priya Shah',      initials: 'PS', color: '#2A8C53', you: false, title: 'Loan Officer',     volume: 15800, units: 22, avgDays: 26, pipeline: 1640, delta: 1,  goal: 24000 },
    { id: 'jl', name: 'Jamie Lee',       initials: 'JL', color: '#C25535', you: false, title: 'Loan Officer',     volume: 14300, units: 20, avgDays: 28, pipeline: 1980, delta: -1, goal: 24000 },
    { id: 'mw', name: 'Marcus Webb',     initials: 'MW', color: '#7B3FA0', you: false, title: 'Jr. Loan Officer', volume:  8400, units: 13, avgDays: 33, pipeline:  890, delta: 2,  goal: 15000 },
    { id: 'ac', name: 'Alex Chen',       initials: 'AC', color: '#D97706', you: false, title: 'Loan Officer',     volume:  7200, units: 11, avgDays: 37, pipeline:  550, delta: 0,  goal: 15000 },
    { id: 'rn', name: 'Riley Nash',      initials: 'RN', color: '#0E9F6E', you: false, title: 'Jr. Loan Officer', volume:  5600, units:  9, avgDays: 40, pipeline:  720, delta: -1, goal: 12000 },
  ],
};

const RANK_MEDALS = ['🥇', '🥈', '🥉', '', '', ''];

// ─── Leaderboard widget ───────────────────────────────────────────────────────
const LB_METRICS = [
  { id: 'volume',   label: 'Volume',    fmt: (v) => v >= 1000 ? `$${(v/1000).toFixed(2)}M` : `$${v}K` },
  { id: 'units',    label: 'Units',     fmt: (v) => `${v} loans` },
  { id: 'avgDays',  label: 'Avg Days',  fmt: (v) => `${v}d`, invert: true },
  { id: 'pipeline', label: 'Pipeline',  fmt: (v) => v >= 1000 ? `$${(v/1000).toFixed(2)}M` : `$${v}K` },
];

function DeltaBadge({ delta }) {
  if (delta === 0) return <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>—</span>;
  const up = delta > 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 1,
      fontSize: 11, fontWeight: 700,
      color: up ? '#059669' : '#EF4444',
    }}>
      {up ? '↑' : '↓'}{Math.abs(delta)}
    </span>
  );
}

function Leaderboard() {
  const [period, setPeriod] = React.useState('MTD');
  const [metric, setMetric] = React.useState('volume');
  const [expanded, setExpanded] = React.useState(null);
  const [prevMetric, setPrevMetric] = React.useState('volume');
  const [animKey, setAnimKey] = React.useState(0);

  const changeMetric = (m) => {
    setPrevMetric(metric);
    setMetric(m);
    setAnimKey(k => k + 1);
  };

  const rawData = LB_DATA[period];
  const metaDef = LB_METRICS.find(m => m.id === metric);
  const invert = metaDef?.invert;

  // Sort by chosen metric (avgDays: lower = better → sort ascending)
  const sorted = [...rawData].sort((a, b) => invert ? a[metric] - b[metric] : b[metric] - a[metric]);
  const maxVal = Math.max(...sorted.map(p => p[metric]));
  const minVal = invert ? Math.min(...sorted.map(p => p[metric])) : 0;

  // Bar width: for invert metrics, longest bar = best (lowest val)
  const barPct = (val) => invert
    ? Math.round(((maxVal - val) / (maxVal - minVal + 1)) * 100)
    : Math.round((val / maxVal) * 100);

  const you = sorted.find(p => p.you);
  const youRank = sorted.findIndex(p => p.you) + 1;
  const leader = sorted[0];
  const gapToLeader = you && leader && !you.you === false && youRank > 1
    ? metaDef.fmt(leader[metric] - you[metric])
    : null;

  const periodLabels = { MTD: 'Resets Jun 1 · 11 days left', QTD: 'Q2 ends Jun 30', YTD: 'Jan – May 2026' };

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>

      {/* ── Header ───────────────────────────────── */}
      <div style={{ padding: '14px 18px 0', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>🏆 Leaderboard</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>Branch-wide</span>
          </div>
          {/* Period pills */}
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 7, padding: 3, gap: 2 }}>
            {['MTD', 'QTD', 'YTD'].map(p => (
              <button key={p} onClick={() => { setPeriod(p); setAnimKey(k => k + 1); }} style={{
                padding: '3px 10px', fontSize: 12, fontWeight: 700,
                border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit',
                background: period === p ? '#fff' : 'transparent',
                color: period === p ? '#111827' : '#6B7280',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Metric tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
          {LB_METRICS.map(m => {
            const active = metric === m.id;
            return (
              <button key={m.id} onClick={() => changeMetric(m.id)} style={{
                padding: '7px 14px', fontSize: 12, fontWeight: 600,
                border: 'none', borderBottom: active ? '2px solid #111827' : '2px solid transparent',
                background: 'transparent', color: active ? '#111827' : '#9CA3AF',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.12s, border-color 0.12s',
              }}>{m.label}</button>
            );
          })}
        </div>
      </div>

      {/* ── Rows ─────────────────────────────────── */}
      <div>
        {sorted.map((p, i) => {
          const isExpanded = expanded === p.id;
          const pct = barPct(p[metric]);
          const isYou = p.you;
          const goalPct = Math.min(100, Math.round((p[metric] / p.goal) * (invert ? 120 : 100)));

          return (
            <div key={p.id}
              onClick={() => setExpanded(isExpanded ? null : p.id)}
              style={{
                borderBottom: i < sorted.length - 1 ? '1px solid #F3F4F6' : 'none',
                background: isYou ? 'linear-gradient(90deg, rgba(126,104,250,0.05) 0%, transparent 80%)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!isYou) e.currentTarget.style.background = '#FAFAFA'; }}
              onMouseLeave={e => { if (!isYou) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Main row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px' }}>
                {/* Rank */}
                <div style={{ width: 22, flexShrink: 0, textAlign: 'center' }}>
                  {i < 3
                    ? <span style={{ fontSize: 15 }}>{RANK_MEDALS[i]}</span>
                    : <span style={{ fontSize: 12, fontWeight: 700, color: '#D1D5DB' }}>#{i+1}</span>
                  }
                </div>

                {/* Avatar */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.initials}
                </div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: isYou ? 700 : 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </span>
                    {isYou && <span style={{ fontSize: 10, fontWeight: 700, color: '#7E68FA', background: '#EDE9FE', padding: '1px 6px', borderRadius: 4, flexShrink: 0 }}>You</span>}
                    <DeltaBadge delta={p.delta}/>
                  </div>
                  {/* Animated bar */}
                  <div style={{ height: 4, borderRadius: 999, background: '#F3F4F6', overflow: 'hidden' }}>
                    <div
                      key={`${animKey}-${p.id}`}
                      style={{
                        height: '100%', borderRadius: 999,
                        background: i === 0 ? '#111827' : isYou ? '#7E68FA' : p.color,
                        width: `${pct}%`,
                        animation: 'lbBarGrow 0.55s cubic-bezier(0.4,0,0.2,1) both',
                      }}
                    />
                  </div>
                </div>

                {/* Value */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 70 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono', color: '#111827' }}>
                    {metaDef.fmt(p[metric])}
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                    {Math.round(goalPct)}% of goal
                  </div>
                </div>

                {/* Chevron */}
                <div style={{ marginLeft: 4, color: '#D1D5DB', transition: 'transform 0.15s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                  <Icon name="chevronDown" size={14}/>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  margin: '0 18px 14px',
                  background: isYou ? '#FAF9FF' : '#FAFAFA',
                  border: `1px solid ${isYou ? '#DDD6FE' : '#F3F4F6'}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex', gap: 16, flexWrap: 'wrap',
                }}>
                  {/* Stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 20px', flex: 1, minWidth: 0 }}>
                    {LB_METRICS.map(m => (
                      <div key={m.id}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9CA3AF', marginBottom: 3 }}>{m.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono', color: m.id === metric ? (isYou ? '#7E68FA' : '#111827') : '#374151' }}>
                          {m.fmt(p[m.id])}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Goal progress */}
                  <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: 16, minWidth: 140 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9CA3AF', marginBottom: 6 }}>Goal Progress</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#E5E7EB', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          background: isYou ? '#7E68FA' : p.color,
                          width: `${Math.min(100, Math.round((p.volume / p.goal) * 100))}%`,
                          transition: 'width 0.5s ease',
                        }}/>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                        {Math.min(100, Math.round((p.volume / p.goal) * 100))}%
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      {LB_METRICS[0].fmt(p.volume)} of {LB_METRICS[0].fmt(p.goal)} target
                    </div>
                    {isYou && youRank > 1 && (
                      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: '#7E68FA', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="trendingUp" size={12} strokeWidth={2}/>
                        {LB_METRICS[0].fmt(leader.volume - p.volume)} behind {leader.name.split(' ')[0]}
                      </div>
                    )}
                    {isYou && youRank === 1 && (
                      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="check" size={12} strokeWidth={2.5}/>
                        Leading by {LB_METRICS[0].fmt(p.volume - sorted[1]?.volume)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <div style={{ padding: '9px 18px', background: '#FAFAFA', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{periodLabels[period]}</span>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{sorted.length} loan officers</span>
      </div>

      {/* Bar grow keyframe injected once */}
      <style>{`@keyframes lbBarGrow { from { width: 0% } }`}</style>
    </div>
  );
}

// Scrollable company feed — more items so it actually scrolls
const FEED = [
  { id: 'f1',  icon: '🎂', tag: 'Today',       tagColor: '#F59E0B', title: "Jamie Lee's birthday today!", body: "Drop a message or grab them a coffee ☕ — they're in the office today.", time: 'Just now' },
  { id: 'f2',  icon: '📣', tag: 'Compliance',   tagColor: '#EF4444', title: 'New FHA guideline effective June 1', body: 'DTI cap drops from 57% to 55% for manual underwrites. Review your pipeline for any files at risk.', time: 'Today, 9:00 AM' },
  { id: 'f3',  icon: '🏆', tag: 'Milestone',    tagColor: '#7E68FA', title: 'Team hit $10M funded in May!', body: "Best month since Q4 last year. We're on pace for a record quarter — keep pushing.", time: 'Yesterday' },
  { id: 'f4',  icon: '🎊', tag: 'Celebration',  tagColor: '#059669', title: "Priya Shah's 3-year workiversary", body: "Three years of crushing it. Give Priya some love this week 🙌", time: 'Yesterday' },
  { id: 'f5',  icon: '💡', tag: 'Product',      tagColor: '#2563EB', title: 'Lock confirmations now auto-attach', body: 'PPE confirmations save directly to the pricing tab when you lock. No more manual uploads.', time: 'May 17' },
  { id: 'f6',  icon: '📊', tag: 'Market',       tagColor: '#6B7280', title: '30yr fixed avg 6.82% this week', body: 'Rates ticked up 7bps from last week. Jumbo spread holding steady at +18bps.', time: 'May 17' },
  { id: 'f7',  icon: '🎯', tag: 'Goal',         tagColor: '#7E68FA', title: 'Q2 volume goal: 74% to target', body: "We're at $7.4M of a $10M Q2 goal with 6 weeks left. On track if May closes strong.", time: 'May 16' },
  { id: 'f8',  icon: '🛠️', tag: 'Maintenance', tagColor: '#9CA3AF', title: 'System maintenance Sunday 2–4 AM', body: 'Brief downtime scheduled for infrastructure updates. No action needed — saves automatically.', time: 'May 15' },
  { id: 'f9',  icon: '🤖', tag: 'Industry',    tagColor: '#7E68FA', title: 'How mortgage leaders are really approaching AI in 2026', body: 'New HousingWire research reveals how lenders are deploying AI across origination, underwriting, and servicing — and where the biggest productivity gains are landing.', time: 'May 14', link: 'https://www.housingwire.com/articles/how-mortgage-leaders-are-really-approaching-ai-in-2026/' },
];

const CELEBRATIONS = [
  { emoji: '🎂', name: 'Jamie Lee',   sub: 'Birthday today',       color: '#C25535', initials: 'JL', today: true  },
  { emoji: '🎊', name: 'Priya Shah',  sub: '3-year workiversary',  color: '#2A8C53', initials: 'PS', today: false },
];

// Mock weather + branch + lender (would be live via API + auth context in production)
const WEATHER = { temp: 68, condition: 'Mostly Cloudy', icon: '🌥️', city: 'Camp Hill, PA' };
const BRANCH  = { name: 'Camp Hill Branch', code: 'CHL-04' };
const LENDER  = { name: 'Lakeside Mortgage', tagline: 'Lending built on trust since 1987', mark: 'L' };

// Personal scorecard — surfaced as a strip right under the hero so the LO
// always knows where they stand. In production these would come from a
// real performance service.
const SCORECARD = {
  pct: 72,
  units: { current: 10, total: 14, deltaLabel: '+3 vs Apr' },
  volume:       { value: '$4.62M', deltaLabel: '+12.4%' },
  pullThrough:  { value: '78%',    deltaLabel: '+6 pts' },
  appToClose:   { value: '31d',    deltaLabel: '-2 days' },
};

// Severity tones for hero KPI tiles — three levels of urgency so the row
// doesn't read as four identical tiles. Colors are tuned for the dark hero.
const SEVERITY = {
  critical: {
    bg:           'rgba(255, 90, 80, 0.10)',
    bgHover:      'rgba(255, 90, 80, 0.16)',
    border:       'rgba(255, 90, 80, 0.30)',
    borderHover:  'rgba(255, 90, 80, 0.48)',
    iconBg:       'rgba(255, 90, 80, 0.18)',
    iconColor:    '#FF8A82',
    subColor:     'rgba(255, 154, 148, 0.85)',
  },
  deadline: {
    bg:           'rgba(255, 184, 0, 0.07)',
    bgHover:      'rgba(255, 184, 0, 0.13)',
    border:       'rgba(255, 184, 0, 0.22)',
    borderHover:  'rgba(255, 184, 0, 0.38)',
    iconBg:       'rgba(255, 184, 0, 0.16)',
    iconColor:    '#FFC857',
    subColor:     'rgba(255, 209, 122, 0.80)',
  },
  routine: {
    bg:           'rgba(255,255,255,0.06)',
    bgHover:      'rgba(255,255,255,0.10)',
    border:       'rgba(255,255,255,0.12)',
    borderHover:  'rgba(255,255,255,0.22)',
    iconBg:       'rgba(255,255,255,0.10)',
    iconColor:    'rgba(255,255,255,0.85)',
    subColor:     'rgba(255,255,255,0.5)',
  },
};

// Hero KPI tiles — each carries an `intent` that pre-filters the pipeline
// so clicks land on a curated view rather than the full list.
// `severity` differentiates the tiles visually: critical tiles get a red
// pulse dot, deadline tiles get amber, routine tiles render neutral. Stops
// the row from reading as four identical numbers.
const HERO_TILES = [
  { icon: 'calculator', value: '7', label: 'Due today',           sub: '2 high priority',    severity: 'deadline',
    intent: { view: 'urgent', label: 'Due today' } },
  { icon: 'fileSearch', value: '3', label: 'Awaiting your review', sub: 'Clear to close',     severity: 'routine',
    intent: { filters: [{ field: 'aiStatus', op: 'is', value: 'Needs Review' }], label: 'Awaiting your review' } },
  { icon: 'clock',      value: '2', label: 'Locks expiring ≤7d',  sub: 'Action required',    severity: 'critical',
    intent: { filters: [{ field: 'lockStatus', op: 'is', value: 'Expiring' }], label: 'Locks expiring ≤7d' } },
  { icon: 'zap',        value: '5', label: 'New leads',            sub: 'Assigned overnight', severity: 'routine',
    intent: { filters: [{ field: 'status', op: 'is', value: 'Application' }], label: 'New leads' } },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// Circular progress ring
function RingGauge({ value, size = 110, stroke = 7, color = '#818CF8', trackColor = 'rgba(255,255,255,0.1)', label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}<span style={{ fontSize: 12, fontWeight: 600 }}>%</span></span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Task impact data ─────────────────────────────────────────────────────────
const TASK_IMPACTS = {
  't1': {
    headline: 'CD sent to Jennifer Wang',
    loanChange: 'Closing window opens — 3 days to review',
    detail: 'Loan clears for closing on Jun 15 if no objections.',
    nextLabel: 'Next: Extend Oben lock before May 21',
    isMilestone: true,
    milestoneEmoji: '📋',
    milestoneTitle: 'Closing Disclosure Sent',
    milestoneSubtitle: 'Jennifer Wang · LN-2024-0211',
    milestoneImpacts: [
      { icon: '📅', label: 'Closing date confirmed', value: 'Jun 15, 2026' },
      { icon: '⏱️', label: '3-day CD review window', value: 'Started today' },
      { icon: '🔒', label: 'Rate lock buffer', value: '3 days remaining' },
    ],
    milestoneNext: ['Confirm final walk-through date', 'Verify wire instructions with title', 'Queue closing package'],
  },
  't2': {
    headline: "Rate lock extended — Oben",
    loanChange: 'Lock expiry pushed May 21 → Jun 15',
    detail: '2.875% Conv 30yr secured for 25 more days.',
    nextLabel: 'Next: Chase updated paystub — Chen',
    isMilestone: false,
  },
  't3': {
    headline: 'Paystub request sent — Chen',
    loanChange: 'C-003 moved to Awaiting Borrower',
    detail: 'Borrower notified. 30-day window restarts on receipt.',
    nextLabel: 'Next: Clear 2 UW conditions — Kim',
    isMilestone: false,
  },
  't4': {
    headline: '2 conditions cleared — Kim',
    loanChange: 'Conditions: 9 of 11 complete (82%)',
    detail: 'C-004 VOE and C-009 gift letter both resolved.',
    nextLabel: 'Next: Follow up on appraisal — Park',
    isMilestone: true,
    milestoneEmoji: '✅',
    milestoneTitle: 'Conditions Cleared',
    milestoneSubtitle: 'Rachel Kim · LN-2024-0289',
    milestoneImpacts: [
      { icon: '📊', label: 'Conditions complete', value: '9 of 11 (82%)' },
      { icon: '🚀', label: 'File ready for', value: 'Final approval' },
      { icon: '📅', label: 'On track to close', value: 'Jun 2, 2026' },
    ],
    milestoneNext: ['Request final approval from UW', 'Order closing disclosure', 'Confirm title is clear'],
  },
  't5': {
    headline: 'Appraisal follow-up sent — Park',
    loanChange: 'ETA requested from AMC',
    detail: 'Ordered May 10. Appraiser has 10 business days by contract.',
    nextLabel: 'All tasks complete for today 🎉',
    isMilestone: false,
  },
};

// ─── Task Drawer content per task ────────────────────────────────────────────
const TASK_DRAWER = {
  't1': {
    title: 'Send Closing Disclosure',
    subtitle: 'Jennifer Wang · LN-2024-0211 · Closing Jun 15',
    urgency: 'Must send today — 3-day rule requires CD 3 business days before closing',
    urgencyTone: 'red',
    body: (onComplete) => (
      <TaskDrawerCD onComplete={onComplete}/>
    ),
  },
  't2': {
    title: 'Extend rate lock — Oben',
    subtitle: 'Michael Oben · LN-2024-0245 · Conv 30yr 6.625%',
    urgency: 'Lock expires May 21 — reprices to 7.02% (+$287/mo) if not extended',
    urgencyTone: 'amber',
    body: (onComplete) => (
      <TaskDrawerLock onComplete={onComplete}/>
    ),
  },
  't3': {
    title: 'Chase updated paystub — Chen',
    subtitle: 'David Chen · LN-2024-0189 · Processing',
    urgency: 'Current doc expires May 24 — 30-day window. Condition C-003 blocking.',
    urgencyTone: 'amber',
    body: (onComplete) => (
      <TaskDrawerPaystub onComplete={onComplete}/>
    ),
  },
  't4': {
    title: 'Clear 2 UW conditions — Kim',
    subtitle: 'Rachel Kim · LN-2024-0289 · Conditional Approval',
    urgency: 'C-004 VOE and C-009 gift letter both received — ready to clear now',
    urgencyTone: 'blue',
    body: (onComplete) => (
      <TaskDrawerConditions onComplete={onComplete}/>
    ),
  },
  't5': {
    title: 'Follow up on appraisal — Park',
    subtitle: 'Thomas Park · LN-2024-0312 · Processing',
    urgency: 'Ordered May 10 · 9 days elapsed · ETA not confirmed by AMC',
    urgencyTone: 'neutral',
    body: (onComplete) => (
      <TaskDrawerAppraisal onComplete={onComplete}/>
    ),
  },
};

// ─── Drawer: Send CD ──────────────────────────────────────────────────────────
function TaskDrawerCD({ onComplete }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#F9FAFC', border: '1px solid #E5E8F0', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#8B95A6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>CD Summary</div>
        {[
          { label: 'Loan Amount', value: '$780,000' },
          { label: 'Rate', value: '6.750% · Conv 30yr' },
          { label: 'Monthly P&I', value: '$5,061.92' },
          { label: 'Cash to Close', value: '$162,400' },
          { label: 'Closing Date', value: 'Jun 15, 2026' },
          { label: 'Closing Agent', value: 'Fidelity National Title' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
            <span style={{ color: '#5A6577' }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: '#0B1B2B', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#EEF3FE', borderRadius: 9, padding: '10px 13px', fontSize: 13, color: '#2453D6', display: 'flex', gap: 8, lineHeight: 1.5 }}>
        <Icon name="sparkle" size={13} color="#2453D6" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }}/>
        CD pre-filled from final UW approval. Seller credit ($3,500) reconciled with HUD. Ready to send.
      </div>
      {sent ? (
        <div style={{ background: '#E7F8F1', border: '1px solid #A7F3D0', borderRadius: 9, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="#0E9F6E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          CD sent to Jennifer Wang — 3-day clock started
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { setSent(true); setTimeout(onComplete, 800); }} style={{ height: 42, borderRadius: 9, border: 'none', background: '#2453D6', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Closing Disclosure
          </button>
          <button style={{ height: 36, borderRadius: 8, border: '1px solid #E5E8F0', background: '#fff', color: '#5A6577', fontSize: 13, cursor: 'pointer' }}>Preview CD first</button>
        </div>
      )}
    </div>
  );
}

// ─── Drawer: Rate Lock Extension ──────────────────────────────────────────────
function TaskDrawerLock({ onComplete }) {
  const [selected, setSelected] = React.useState(null);
  const [done, setDone] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#F9FAFC', border: '1px solid #E5E8F0', borderRadius: 10, padding: '14px 16px' }}>
        {[
          { label: 'Current rate', value: '6.625% Conv 30yr' },
          { label: 'Lock expires', value: 'May 21, 2026' },
          { label: 'Reprice rate', value: '7.02% (+$287/mo)' },
          { label: 'Closing target', value: 'Jun 12, 2026' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
            <span style={{ color: '#5A6577' }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: '#0B1B2B', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5A6577', marginBottom: -6 }}>Select extension:</div>
      {[{ days: 15, expires: 'Jun 7', fee: '$425', note: '7-day buffer' }, { days: 30, expires: 'Jun 21', fee: '$850', note: 'Recommended — 9-day buffer' }].map(opt => (
        <div key={opt.days} onClick={() => !done && setSelected(opt.days)} style={{ padding: '13px 15px', borderRadius: 10, cursor: done ? 'default' : 'pointer', border: `2px solid ${selected === opt.days ? '#2453D6' : '#E5E8F0'}`, background: selected === opt.days ? '#EEF3FE' : '#F9FAFC', transition: 'all 0.12s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0B1B2B' }}>{opt.days}-day · expires {opt.expires}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#2453D6', fontFamily: 'JetBrains Mono, monospace' }}>{opt.fee}</span>
          </div>
          <div style={{ fontSize: 12, color: '#8B95A6', marginTop: 3 }}>{opt.note}</div>
        </div>
      ))}
      {done ? (
        <div style={{ background: '#E7F8F1', border: '1px solid #A7F3D0', borderRadius: 9, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="#0E9F6E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          Lock extended to {selected === 30 ? 'Jun 21' : 'Jun 7'} — {selected === 30 ? '$850' : '$425'} logged to file
        </div>
      ) : (
        <button disabled={!selected} onClick={() => { setDone(true); setTimeout(onComplete, 800); }} style={{ height: 42, borderRadius: 9, border: 'none', background: selected ? '#D97706' : '#E5E8F0', color: selected ? '#fff' : '#8B95A6', fontSize: 14, fontWeight: 700, cursor: selected ? 'pointer' : 'default', transition: 'all 0.15s' }}>
          {selected ? `Confirm ${selected}-day extension — ${selected === 30 ? '$850' : '$425'}` : 'Select extension term'}
        </button>
      )}
    </div>
  );
}

// ─── Drawer: Chase Paystub ────────────────────────────────────────────────────
function TaskDrawerPaystub({ onComplete }) {
  const [sent, setSent] = React.useState(false);
  const [msg, setMsg] = React.useState(`Hi David,\n\nWe need an updated paystub to keep your loan on track. The most recent one on file expires May 24.\n\nPlease upload your two most recent paystubs (covering the last 30 days) to your borrower portal.\n\nThis is needed for condition C-003. Let me know if you have questions!\n\nJordan Schonegg`);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#FEF6E7', border: '1px solid #FDE9C2', borderRadius: 9, padding: '10px 13px', fontSize: 13, color: '#7A3D00', lineHeight: 1.5 }}>
        ⚠ Condition C-003 is blocking. Current paystub expires <b>May 24</b>. Borrower has been in portal but hasn't uploaded.
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#5A6577', marginBottom: 6 }}>Message to borrower</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} style={{ width: '100%', height: 160, border: '1px solid #E5E8F0', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', lineHeight: 1.6, resize: 'none', outline: 'none', boxSizing: 'border-box', color: '#0B1B2B' }}/>
      </div>
      {sent ? (
        <div style={{ background: '#E7F8F1', border: '1px solid #A7F3D0', borderRadius: 9, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="#0E9F6E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          Reminder sent via borrower portal — C-003 updated to Awaiting
        </div>
      ) : (
        <button onClick={() => { setSent(true); setTimeout(onComplete, 800); }} style={{ height: 42, borderRadius: 9, border: 'none', background: '#2453D6', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Send reminder to David Chen
        </button>
      )}
    </div>
  );
}

// ─── Drawer: Clear Conditions ─────────────────────────────────────────────────
function TaskDrawerConditions({ onComplete }) {
  const [cleared, setCleared] = React.useState(new Set());
  const conditions = [
    { id: 'C-004', title: 'VOE — The Work Number', detail: 'Received May 18 via employer portal. Matches 1003 income.', doc: 'VOE_Kim_TheWorkNumber_051826.pdf' },
    { id: 'C-009', title: 'Gift letter — $25,000 down payment gift', detail: 'Signed gift letter + donor bank statement both on file.', doc: 'GiftLetter_Kim_signed.pdf' },
  ];
  const allCleared = cleared.size === conditions.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#EEF3FE', borderRadius: 9, padding: '10px 13px', fontSize: 13, color: '#2453D6', display: 'flex', gap: 8, lineHeight: 1.5 }}>
        <Icon name="sparkle" size={13} color="#2453D6" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }}/>
        Both docs received and validated by AI. Ready to mark cleared and forward to UW.
      </div>
      {conditions.map(c => (
        <div key={c.id} style={{ background: cleared.has(c.id) ? '#E7F8F1' : '#F9FAFC', border: `1px solid ${cleared.has(c.id) ? '#A7F3D0' : '#E5E8F0'}`, borderRadius: 10, padding: '13px 14px', transition: 'all 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1B2B' }}>{c.id} · {c.title}</div>
              <div style={{ fontSize: 12, color: '#5A6577', marginTop: 4, lineHeight: 1.45 }}>{c.detail}</div>
              <div style={{ fontSize: 12, color: '#8B95A6', marginTop: 5 }}>📎 {c.doc}</div>
            </div>
            {cleared.has(c.id) ? (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0E9F6E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            ) : (
              <button onClick={() => setCleared(prev => new Set([...prev, c.id]))} style={{ height: 30, padding: '0 12px', borderRadius: 7, border: 'none', background: '#2453D6', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                Clear
              </button>
            )}
          </div>
        </div>
      ))}
      {allCleared ? (
        <button onClick={onComplete} style={{ height: 42, borderRadius: 9, border: 'none', background: '#0E9F6E', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          Submit cleared conditions to UW
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#8B95A6', textAlign: 'center' }}>Clear both conditions to submit</div>
      )}
    </div>
  );
}

// ─── Drawer: Appraisal Follow-up ──────────────────────────────────────────────
function TaskDrawerAppraisal({ onComplete }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#F9FAFC', border: '1px solid #E5E8F0', borderRadius: 10, padding: '14px 16px' }}>
        {[
          { label: 'AMC', value: 'ValueLink Appraisal' },
          { label: 'Ordered', value: 'May 10, 2026' },
          { label: 'Appraiser', value: 'R. Nguyen (assigned)' },
          { label: 'Inspection scheduled', value: 'May 22, 2026' },
          { label: 'Expected report', value: 'Not confirmed' },
          { label: 'Contract price', value: '$512,000' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
            <span style={{ color: '#5A6577' }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: '#0B1B2B', fontSize: 13 }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#EEF3FE', borderRadius: 9, padding: '10px 13px', fontSize: 13, color: '#2453D6', display: 'flex', gap: 8, lineHeight: 1.5 }}>
        <Icon name="sparkle" size={13} color="#2453D6" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }}/>
        Inspection is May 22 — report typically follows in 2–3 business days. Expected by May 27.
      </div>
      {sent ? (
        <div style={{ background: '#E7F8F1', border: '1px solid #A7F3D0', borderRadius: 9, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" stroke="#0E9F6E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          Follow-up sent to ValueLink · ETA requested by end of day
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { setSent(true); setTimeout(onComplete, 800); }} style={{ height: 42, borderRadius: 9, border: 'none', background: '#2453D6', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Send follow-up to AMC
          </button>
          <button style={{ height: 36, borderRadius: 8, border: '1px solid #E5E8F0', background: '#fff', color: '#5A6577', fontSize: 13, cursor: 'pointer' }}>
            Call appraiser directly
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Task Drawer Shell ────────────────────────────────────────────────────────
function TaskDrawer({ task, onClose, onComplete }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => { setVisible(false); setTimeout(onClose, 280); };
  const drawerData = TASK_DRAWER[task.id];
  if (!drawerData) return null;

  const urgencyColors = {
    red:     { bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D', dot: '#EF4444' },
    amber:   { bg: '#FEF6E7', border: '#FDE9C2', text: '#7A3D00', dot: '#D97706' },
    blue:    { bg: '#EEF3FE', border: '#DDE6FD', text: '#1E3A8A', dot: '#2453D6' },
    neutral: { bg: '#F9FAFC', border: '#E5E8F0', text: '#5A6577', dot: '#8B95A6' },
  };
  const uc = urgencyColors[drawerData.urgencyTone] || urgencyColors.neutral;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.3)', zIndex: 300, opacity: visible ? 1 : 0, transition: 'opacity 0.25s' }}/>
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#fff', zIndex: 301, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E8F0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              {/* Borrower avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: task.color, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.initials}</div>
                <span style={{ fontSize: 12, color: '#8B95A6', fontFamily: 'JetBrains Mono, monospace' }}>{task.loanId}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0B1B2B', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{drawerData.title}</div>
              <div style={{ fontSize: 13, color: '#8B95A6', marginTop: 4 }}>{drawerData.subtitle}</div>
            </div>
            <button onClick={close} style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid #E5E8F0', background: '#F9FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" fill="none" stroke="#8B95A6" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Urgency bar */}
          <div style={{ marginTop: 12, background: uc.bg, border: `1px solid ${uc.border}`, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: uc.dot, flexShrink: 0 }}/>
            <span style={{ fontSize: 13, color: uc.text, fontWeight: 500, lineHeight: 1.4 }}>{drawerData.urgency}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {drawerData.body(() => { setTimeout(close, 1200); onComplete(task.id); })}
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── Milestone Celebration Overlay ────────────────────────────────────────────
function MilestoneCelebration({ impact, onClose }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const stars = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 0.6,
    color: ['#7E68FA', '#34D399', '#F59E0B', '#60A5FA', '#F472B6'][Math.floor(Math.random() * 5)],
  })), []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(10,15,30,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Stars */}
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.x + '%', top: s.y + '%',
          width: s.size, height: s.size, borderRadius: '50%', background: s.color,
          opacity: visible ? 0.85 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
          transition: `all 0.5s ease ${s.delay}s`,
        }}/>
      ))}

      {/* Card */}
      <div style={{
        background: 'linear-gradient(145deg, #1a1535, #1e2a4a)',
        border: '1px solid rgba(126,104,250,0.3)',
        borderRadius: 20, padding: '40px 44px', maxWidth: 480, width: '90%',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: 999, background: 'radial-gradient(circle, rgba(126,104,250,0.25) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        <div style={{ fontSize: 52, marginBottom: 12, lineHeight: 1 }}>{impact.milestoneEmoji}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>{impact.milestoneTitle}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>{impact.milestoneSubtitle}</div>

        {/* Impact tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
          {impact.milestoneImpacts.map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 10px' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Next steps</div>
          {impact.milestoneNext.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < impact.milestoneNext.length - 1 ? 8 : 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(126,104,250,0.2)', border: '1px solid rgba(126,104,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA' }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{step}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: '100%', height: 44, borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #7E68FA, #5B4FD4)',
          color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(126,104,250,0.4)',
        }}>Continue →</button>
      </div>
    </div>
  );
}

// ─── Task Impact Toast ─────────────────────────────────────────────────────────
function TaskImpactToast({ task, impact, onDismiss, onOpenLoan }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 20);
    const t2 = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      background: '#F0FDF4', border: '1px solid #BBF7D0',
      borderLeft: '4px solid #22C55E', borderRadius: 10,
      padding: '12px 13px', marginBottom: 8,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scaleY(1)' : 'translateY(-8px) scaleY(0.95)',
      transformOrigin: 'top',
      transition: 'all 0.25s cubic-bezier(0.34,1.2,0.64,1)',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="check" size={9} color="#fff" strokeWidth={3}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>{impact.headline}</span>
          </div>
          {/* Impact line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', background: 'rgba(34,197,94,0.1)', borderRadius: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#166534' }}>⚡</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>{impact.loanChange}</span>
          </div>
          <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.45, marginBottom: 6 }}>{impact.detail}</div>
          <div style={{ fontSize: 11, color: '#7E68FA', fontWeight: 600 }}>{impact.nextLabel}</div>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', flexShrink: 0, padding: 0, lineHeight: 1 }}>
          <Icon name="x" size={12}/>
        </button>
      </div>
    </div>
  );
}

// ─── Animated Task Row ────────────────────────────────────────────────────────
function TaskRow({ task, onComplete, onOpenLoan }) {
  const [state, setState] = React.useState('idle'); // idle → completing → done
  const isUrgent = task.urgent;

  const handleCheck = (e) => {
    e.stopPropagation();
    setState('completing');
    setTimeout(() => { setState('done'); onComplete(task.id); }, 480);
  };

  return (
    <div style={{
      padding: '10px 11px',
      background: state === 'completing' ? '#F0FDF4' : isUrgent ? '#FFF7F7' : '#F9FAFB',
      border: '1px solid ' + (state === 'completing' ? '#BBF7D0' : isUrgent ? '#FECACA' : '#E5E7EB'),
      borderLeft: '3px solid ' + (state === 'completing' ? '#22C55E' : task.daysLeft === 0 ? '#EF4444' : task.daysLeft <= 3 ? '#F59E0B' : '#D1D5DB'),
      borderRadius: 8, cursor: 'pointer',
      opacity: state === 'done' ? 0 : 1,
      transform: state === 'done' ? 'translateX(12px)' : 'translateX(0)',
      maxHeight: state === 'done' ? 0 : 200,
      marginBottom: state === 'done' ? 0 : 6,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }} onClick={() => state === 'idle' && onOpenLoan(task.loanId)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: task.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{task.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: state === 'completing' ? '#166534' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: state === 'completing' ? 'line-through' : 'none', transition: 'color 0.2s', flex: 1, minWidth: 0 }}>{task.label}</div>
            {task.fema && <span style={{ fontSize: 10, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>FEMA</span>}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, lineHeight: 1.4 }}>{task.context}</div>
          <div style={{ fontSize: 11, color: task.daysLeft === 0 ? '#EF4444' : '#9CA3AF', fontWeight: task.daysLeft === 0 ? 700 : 400, marginTop: 4 }}>{task.borrower.split(' ').slice(-1)} · {task.dueLabel}</div>
        </div>
        {/* Animated checkbox */}
        <button onClick={handleCheck} style={{
          width: 22, height: 22, borderRadius: 999, border: 'none',
          background: state === 'completing' ? '#22C55E' : 'transparent',
          borderColor: state === 'completing' ? '#22C55E' : '#D1D5DB',
          outline: state !== 'completing' ? '1.5px solid #D1D5DB' : 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
          transition: 'all 0.2s ease',
          transform: state === 'completing' ? 'scale(1.15)' : 'scale(1)',
        }}
        onMouseEnter={e => { if (state === 'idle') { e.currentTarget.style.background = '#DCFCE7'; e.currentTarget.style.outline = '1.5px solid #22C55E'; }}}
        onMouseLeave={e => { if (state === 'idle') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.outline = '1.5px solid #D1D5DB'; }}}
        >
          <Icon name="check" size={11} color={state === 'completing' ? '#fff' : '#D1D5DB'} strokeWidth={3}/>
        </button>
      </div>
    </div>
  );
}

// ─── Daily progress bar ───────────────────────────────────────────────────────
function DayProgress({ done, total }) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div style={{ padding: '0 18px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          {done === total && total > 0
            ? <span style={{ color: '#22C55E', fontWeight: 700 }}>All done today 🎉</span>
            : <span><b style={{ color: '#111827' }}>{done}</b> of {total} tasks done</span>
          }
        </span>
        <span style={{ fontSize: 11, color: pct === 100 ? '#22C55E' : '#9CA3AF', fontWeight: 600 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: pct === 100 ? '#22C55E' : 'linear-gradient(90deg, #7E68FA, #34D399)',
          width: pct + '%', transition: 'width 0.5s cubic-bezier(0.34,1.2,0.64,1)',
        }}/>
      </div>
    </div>
  );
}

// ─── Widget wrappers that need local data ─────────────────────────────────────

function CompanyFeedWidget({ feed }) {
  return (
    <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
      {feed.map(item => (
        <div key={item.id} style={{ display: 'flex', gap: 12, padding: '11px 13px', background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{item.title}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: item.tagColor, background: item.tagColor + '18', padding: '1px 6px', borderRadius: 3, flexShrink: 0 }}>{item.tag}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#4B5563', lineHeight: 1.5 }}>{item.body}</p>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>
              {item.time}
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: '#7E68FA', textDecoration: 'none', marginLeft: 10 }}>Read →</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AIActionsWidget({ actions, onOpen, onDismiss }) {
  if (actions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF', fontSize: 13 }}>All AI actions cleared ✓</div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {actions.map(a => (
        <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', background: '#FAF8FF', border: '1px solid #EDE9FE', borderRadius: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: a.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.label}</div>
            <div style={{ fontSize: 11, color: '#A78BFA', marginTop: 1 }}>{a.conf}% confidence</div>
          </div>
          <button onClick={() => onOpen(a.loanId, a.tab)} style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#7E68FA', border: 'none', borderRadius: 5, padding: '3px 9px', cursor: 'pointer', flexShrink: 0 }}>Go</button>
          <button onClick={() => onDismiss(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B5FD', padding: 0, display: 'flex' }}><Icon name="x" size={12}/></button>
        </div>
      ))}
    </div>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────

// Compact donut for the scorecard strip
function MiniDonut({ pct, size = 56, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke="#7E68FA" strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, color: '#111827',
        fontFamily: 'DM Mono',
      }}>{pct}%</div>
    </div>
  );
}

// ── Section header — restores the numbered IA from the old prototype. ───────
// Consistent eyebrow + headline + sublede so the home reads as 3 distinct
// bands instead of one undifferentiated scroll.
function SectionHeader({ number, eyebrow, title, sublede, tone = 'default', right }) {
  const eyebrowColor = tone === 'ai' ? '#5B21B6' : '#9CA3AF';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 16, marginTop: 28, marginBottom: 14,
    }}>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: eyebrowColor, marginBottom: 6,
        }}>
          {number ? `${String(number).padStart(2, '0')} · ` : ''}{eyebrow}
        </div>
        <h2 style={{
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
          margin: '0 0 4px', color: '#111827', lineHeight: 1.2,
        }}>{title}</h2>
        {sublede && (
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0, maxWidth: 640 }}>{sublede}</p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

function ScorecardStrip() {
  const Stat = ({ label, value, delta }) => (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#111827', letterSpacing: '-0.015em', fontFamily: 'DM Mono' }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#E6F5EF', padding: '2px 6px', borderRadius: 999 }}>{delta}</span>
      </div>
    </div>
  );
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: '14px 18px',
      marginBottom: 18,
      display: 'flex', alignItems: 'center', gap: 22,
    }}>
      <MiniDonut pct={SCORECARD.pct}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 2 }}>This month</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
          {SCORECARD.units.current} of {SCORECARD.units.total} units
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>On pace for 13.8 · {SCORECARD.units.deltaLabel}</div>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
        <Stat label="Volume"       value={SCORECARD.volume.value}      delta={SCORECARD.volume.deltaLabel}/>
        <Stat label="Pull-through" value={SCORECARD.pullThrough.value} delta={SCORECARD.pullThrough.deltaLabel}/>
        <Stat label="App-to-close" value={SCORECARD.appToClose.value}  delta={SCORECARD.appToClose.deltaLabel}/>
      </div>
    </div>
  );
}

export function HomeView({ onNavigate, onOpenLoan }) {
  const [doneTasks, setDoneTasks] = React.useState(new Set());
  const [doneAI, setDoneAI]       = React.useState(new Set());
  const [impactToast, setImpactToast] = React.useState(null);
  const [celebration, setCelebration] = React.useState(null);
  const visibleTasks = TASKS.filter(t => !doneTasks.has(t.id));
  const visibleAI    = AI_ACTIONS.filter(a => !doneAI.has(a.id));
  const urgentCount  = visibleTasks.filter(t => t.urgent).length;
  const doneCount    = doneTasks.size;

  const handleTaskComplete = (taskId) => {
    const impact = TASK_IMPACTS[taskId];
    setDoneTasks(prev => new Set([...prev, taskId]));
    if (impact) {
      setImpactToast({ taskId, impact });
      if (impact.isMilestone) {
        setTimeout(() => setCelebration(impact), 600);
      }
    }
  };

  return (
    <>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0F1117' }}>

      {/* ── Hero ── (compact: same info, less vertical space) */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1535 0%, #1e1b4b 40%, #1a1d3a 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '14px 32px 20px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow blob */}
        <div style={{ position: 'absolute', top: -60, right: 200, width: 340, height: 340, borderRadius: 999, background: 'radial-gradient(circle, rgba(126,104,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        {/* Top utility row — brand left, branch + weather right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: '#fff', color: '#1e1b4b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em',
              flexShrink: 0,
            }}>{LENDER.mark}</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{LENDER.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{LENDER.tagline}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="pin" size={12} strokeWidth={1.7}/>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{BRANCH.name}</span>
            </span>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.25)' }}/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>{WEATHER.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{WEATHER.temp}°</span>
              <span>{WEATHER.condition}</span>
            </span>
          </div>
        </div>

        {/* Main row — greeting block left, 2x2 KPI grid right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 28, alignItems: 'center', position: 'relative' }}>

          {/* Left — greeting block */}
          <div style={{ minWidth: 0 }}>
            {/* Date + greeting + subcopy as a tight block */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 8,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.5)' }}/>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </div>

            <h1 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.1 }}>
              {greeting()}, Jordan.
            </h1>

            <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, maxWidth: 480 }}>
              Glad to see you back. Pick up where you left off, or jump straight into your pipeline.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => onNavigate('pipeline')} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                height: 34, padding: '0 16px',
                background: '#fff', color: '#1e1b4b',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              }}>
                Open my pipeline <Icon name="arrowRight" size={12} strokeWidth={2.5}/>
              </button>
              <button onClick={() => onNavigate('pipeline')} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                height: 34, padding: '0 14px',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 600,
              }}>
                <Icon name="plus" size={13} strokeWidth={2.4}/>
                Start application
              </button>
            </div>
          </div>

          {/* Right — 2x2 KPI tile grid with severity tone differentiation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignSelf: 'center' }}>
            {HERO_TILES.map((t, i) => {
              const sev = SEVERITY[t.severity] || SEVERITY.routine;
              return (
              <button key={i} onClick={() => onNavigate('pipeline', t.intent)} style={{
                position: 'relative',
                background: sev.bg,
                border: `1px solid ${sev.border}`,
                borderRadius: 10,
                padding: '10px 12px 9px',
                color: '#fff',
                display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'background 0.15s, border-color 0.15s, transform 0.08s',
                minWidth: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = sev.bgHover; e.currentTarget.style.borderColor = sev.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = sev.bg;      e.currentTarget.style.borderColor = sev.border; }}
              >
                {t.severity === 'critical' && (
                  <span title="Critical — needs attention now" style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 7, height: 7, borderRadius: 999,
                    background: '#FF4D4F',
                    boxShadow: '0 0 0 3px rgba(255, 77, 79, 0.30)',
                    animation: 'sevPulse 1.6s ease-in-out infinite',
                  }}/>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: sev.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: sev.iconColor,
                  }}>
                    <Icon name={t.icon} size={12} strokeWidth={1.85}/>
                  </div>
                  {t.severity !== 'critical' && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1 }}>↗</span>
                  )}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'DM Mono' }}>{t.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: 4 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: sev.subColor, marginTop: 1 }}>{t.sub}</div>
              </button>);
            })}
            <style>{`
              @keyframes sevPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50%      { opacity: 0.55; transform: scale(1.15); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F4F5F7' }}>

        {/* ── Center ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px', minWidth: 0 }}>
          {/* 01 · Today's priorities — operational triage */}
          <SectionHeader
            number={1}
            eyebrow="Today's priorities"
            title="Files that need a decision"
            sublede="Risks to resolve, locks to extend, and borrowers to chase."
          />
          <WidgetGrid renderWidget={(id) => {
            if (id === 'leaderboard')       return <Leaderboard/>;
            if (id === 'company-feed')      return <CompanyFeedWidget feed={FEED}/>;
            if (id === 'ai-actions')        return <AIActionsWidget actions={visibleAI} onOpen={onOpenLoan} onDismiss={(aid) => setDoneAI(prev => new Set([...prev, aid]))}/>;
            if (id === 'pipeline-snapshot') return <PipelineSnapshotWidget/>;
            if (id === 'closing-countdown') return <ClosingCountdownWidget/>;
            if (id === 'rate-watch')        return <RateWatchWidget/>;
            if (id === 'conditions-tracker')return <ConditionsTrackerWidget/>;
            if (id === 'quick-actions')     return <QuickActionsWidget/>;
            if (id === 'recent-activity')   return <RecentActivityWidget/>;
            // Ported from old prototype
            if (id === 'ai-coach-brief')      return <AIInsightsCards       onOpenLoan={onOpenLoan}/>;
            if (id === 'loan-health-monitor') return <LoanHealthMonitorWidget onOpenLoan={onOpenLoan}/>;
            if (id === 'files-at-risk')       return <FilesAtRiskWidget       onOpenLoan={onOpenLoan}/>;
            if (id === 'ready-for-uw')        return <ReadyForUWWidget        onOpenLoan={onOpenLoan}/>;
            if (id === 'lock-clock')          return <LockClockWidget         onOpenLoan={onOpenLoan}/>;
            if (id === 'waiting-on-borrower') return <WaitingOnBorrowerWidget onOpenLoan={onOpenLoan}/>;
            return null;
          }}/>

          {/* 02 · Performance — personal scorecard + branch leaderboard */}
          <SectionHeader
            number={2}
            eyebrow="Performance"
            title="Where you stand"
            sublede="Your monthly progress and how you compare across the branch."
          />
          <ScorecardStrip/>
          <div style={{ height: 14 }}/>
          <Leaderboard/>

          {/* 03 · From your team — culture / company feed */}
          <SectionHeader
            number={3}
            eyebrow="From your team"
            title="What's happening at Lakeside"
            sublede="Announcements, wins, and updates from across the company."
          />
          <CompanyFeedWidget feed={FEED}/>
        </div>

        {/* ── Right Rail ── */}
        <div style={{ width: 316, flexShrink: 0, borderLeft: '1px solid #E5E7EB', background: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ padding: '18px 18px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', color: '#111827' }}>Your day</div>
              {urgentCount > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, background: '#FEF2F2', color: '#EF4444', padding: '2px 8px', borderRadius: 999 }}>🔥 {urgentCount} urgent</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ padding: '12px 18px 0' }}>
            <DayProgress done={doneCount} total={TASKS.length}/>
          </div>

          <div style={{ height: 1, background: '#F3F4F6', margin: '2px 0 12px' }}/>

          {/* Impact toast */}
          {impactToast && (
            <div style={{ padding: '0 14px' }}>
              <TaskImpactToast
                task={impactToast.taskId}
                impact={impactToast.impact}
                onDismiss={() => setImpactToast(null)}
                onOpenLoan={onOpenLoan}
              />
            </div>
          )}

          {/* Tasks */}
          <div style={{ padding: '0 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Tasks</div>
            {visibleTasks.length === 0 && doneCount === TASKS.length ? (
              <div style={{ padding: '18px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Pipeline's moving.</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>All tasks done for today.</div>
              </div>
            ) : (
              visibleTasks.map(t => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onComplete={handleTaskComplete}
                  onOpenLoan={onOpenLoan}
                />
              ))
            )}
          </div>

          <div style={{ height: 1, background: '#F3F4F6', margin: '16px 0' }}/>

          {/* AI Ready */}
          <div style={{ padding: '0 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="sparkle" size={11} color="#7E68FA" strokeWidth={1.6}/>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF' }}>AI Ready</span>
              </div>
              <button onClick={() => onNavigate('feed')} style={{ fontSize: 12, color: '#7E68FA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {visibleAI.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#FAF8FF', border: '1px solid #EDE9FE', borderRadius: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: a.color, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.initials}</div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.label}</div>
                  <button onClick={() => onOpenLoan(a.loanId, a.tab)} style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#7E68FA', border: 'none', borderRadius: 5, padding: '3px 8px', cursor: 'pointer', flexShrink: 0 }}>Go</button>
                  <button onClick={() => setDoneAI(prev => new Set([...prev, a.id]))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B5FD', padding: 0, flexShrink: 0, display: 'flex' }}><Icon name="x" size={11}/></button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#F3F4F6', margin: '16px 0' }}/>

          {/* Activity */}
          <div style={{ padding: '0 14px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ACTIVITY.map((item, i) => (
                <button key={i} onClick={() => onOpenLoan(item.loanId, item.tab)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 0',
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid #F3F4F6' : 'none',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: item.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{item.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: item.actionable ? 600 : 400, color: '#374151', lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{item.time}</div>
                  </div>
                  {item.actionable && <div style={{ width: 6, height: 6, borderRadius: 999, background: '#7E68FA', flexShrink: 0, marginTop: 5 }}/>}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Milestone celebration overlay */}
    {celebration && <MilestoneCelebration impact={celebration} onClose={() => setCelebration(null)}/>}
    </>
  );
}

export default HomeView;
