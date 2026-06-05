import React from 'react';
import { Icon } from '../components/Icon';
import { LOANS } from '../data/loans';

// ─── Processor-specific data ──────────────────────────────────────────────────

const PROCESSOR_STATS = [
  { label: 'Conditions Open',   value: '14',      sub: '3 clearable today',        alert: true,  icon: 'listCheck' },
  { label: 'Docs Awaiting',     value: '5 files', sub: 'Chen · Wang · Johnson',    alert: true,  icon: 'doc'       },
  { label: 'Locks Expiring',    value: '2 loans', sub: 'Oben in 3d · Chen in 4d',  alert: true,  icon: 'clock'     },
  { label: 'Closing This Week', value: '1 loan',  sub: 'Wang · $780K · May 22',    alert: false, icon: 'target'    },
];

// My active file queue — processor's owned loans, sorted by urgency
const MY_QUEUE = [
  {
    loanId: 'LN-2024-0211', borrower: 'Jennifer Wang', initials: 'JW', color: '#3A6BAD',
    amount: '$780,000', status: 'Closing', statusTone: 'green',
    blocker: 'CD must be sent today — 3-day rule',  blockerTone: 'red',
    lockStatus: 'Locked', lockDays: 7, daysToClose: 3, tab: 'closing',
    conditions: { open: 0, total: 14 },
    milestone: 'Final docs',
  },
  {
    loanId: 'LN-2024-0245', borrower: 'Michael Oben', initials: 'MO', color: '#A8541C',
    amount: '$680,000', status: 'Approval', statusTone: 'green',
    blocker: 'Rate lock expires in 3 days — extend or close',  blockerTone: 'amber',
    lockStatus: 'Expiring', lockDays: 3, daysToClose: 24, tab: 'pricing',
    conditions: { open: 2, total: 9 },
    milestone: 'Conditional approval',
  },
  {
    loanId: 'LN-2024-0289', borrower: 'Rachel Kim', initials: 'RK', color: '#7B3FA0',
    amount: '$590,000', status: 'Approval', statusTone: 'green',
    blocker: 'UW returned 2 new conditions — C-011 gift letter, C-012 VOE',  blockerTone: 'amber',
    lockStatus: 'Locked', lockDays: 15, daysToClose: 27, tab: 'conditions',
    conditions: { open: 1, total: 11 },
    milestone: 'Final approval',
  },
  {
    loanId: 'LN-2024-0234', borrower: 'Sarah Anderson', initials: 'SA', color: '#A8541C',
    amount: '$425,000', status: 'Underwriting', statusTone: 'blue',
    blocker: 'Borrower uploaded docs — 2 conditions may auto-clear',  blockerTone: 'blue',
    lockStatus: 'Locked', lockDays: 38, daysToClose: 42, tab: 'conditions',
    conditions: { open: 4, total: 12 },
    milestone: 'Income verification',
  },
  {
    loanId: 'LN-2024-0189', borrower: 'David Chen', initials: 'DC', color: '#2A8C53',
    amount: '$525,000', status: 'Processing', statusTone: 'amber',
    blocker: 'Appraisal in — value gap $7K below contract price',  blockerTone: 'red',
    lockStatus: 'Expiring', lockDays: 4, daysToClose: 50, tab: 'now',
    conditions: { open: 6, total: 11 },
    milestone: 'Appraisal review',
  },
  {
    loanId: 'LN-2024-0301', borrower: 'Emily Rodriguez', initials: 'ER', color: '#C25535',
    amount: '$412,000', status: 'Underwriting', statusTone: 'blue',
    blocker: 'Waiting on updated paystub — borrower notified May 16',  blockerTone: 'neutral',
    lockStatus: 'Locked', lockDays: 28, daysToClose: 40, tab: 'conditions',
    conditions: { open: 3, total: 10 },
    milestone: 'Income verification',
  },
  {
    loanId: 'LN-2024-0312', borrower: 'Thomas Park', initials: 'TP', color: '#3A8294',
    amount: '$295,000', status: 'Processing', statusTone: 'amber',
    blocker: 'Title commitment not received — ordered May 10',  blockerTone: 'neutral',
    lockStatus: 'Locked', lockDays: 19, daysToClose: 44, tab: 'now',
    conditions: { open: 5, total: 9 },
    milestone: 'Title commitment',
  },
];

const PROCESSOR_TASKS = [
  { id: 't1', loanId: 'LN-2024-0211', borrower: 'Jennifer Wang', initials: 'JW', color: '#3A6BAD',
    label: 'Send Closing Disclosure', context: 'Required 3 business days before May 22 closing',
    dueLabel: 'Today', urgent: true, tab: 'closing', done: false },
  { id: 't2', loanId: 'LN-2024-0245', borrower: 'Michael Oben', initials: 'MO', color: '#A8541C',
    label: 'Extend rate lock', context: 'Expires May 21 · 6.625% Conv 30yr · call lender by 3PM',
    dueLabel: 'May 21', urgent: true, tab: 'pricing', done: false },
  { id: 't3', loanId: 'LN-2024-0289', borrower: 'Rachel Kim', initials: 'RK', color: '#7B3FA0',
    label: 'Clear C-011 gift letter', context: 'Letter received — upload and mark cleared',
    dueLabel: 'May 20', urgent: false, tab: 'conditions', done: false },
  { id: 't4', loanId: 'LN-2024-0189', borrower: 'David Chen', initials: 'DC', color: '#2A8C53',
    label: 'Review appraisal — value gap', context: '$518K vs $525K contract · flag to LO',
    dueLabel: 'Today', urgent: true, tab: 'now', done: false },
  { id: 't5', loanId: 'LN-2024-0234', borrower: 'Sarah Anderson', initials: 'SA', color: '#A8541C',
    label: 'Validate uploaded bank statements', context: 'Compare $45K balance to system — C-002 clearable',
    dueLabel: 'May 20', urgent: false, tab: 'conditions', done: false },
];

const SLA_ALERTS = [
  { loanId: 'LN-2024-0211', borrower: 'Jennifer Wang', message: 'CD delivery SLA breached at 5 PM today', tone: 'red' },
  { loanId: 'LN-2024-0189', borrower: 'David Chen', message: 'No borrower response in 5 days — escalate?', tone: 'amber' },
  { loanId: 'LN-2024-0312', borrower: 'Thomas Park', message: 'Title ordered 9 days ago — follow up with provider', tone: 'amber' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const WEATHER = { temp: 68, condition: 'Mostly Cloudy', icon: '🌥️', city: 'Greenwood, IN' };

const statusTones = {
  green:   { bg: 'var(--status-green-bg)',  fg: 'var(--status-green)'  },
  blue:    { bg: 'var(--status-blue-bg)',   fg: 'var(--status-blue)'   },
  amber:   { bg: 'var(--status-amber-bg)',  fg: 'var(--status-amber)'  },
  neutral: { bg: 'var(--bg-muted)',         fg: 'var(--text-secondary)'},
};

function StatusPill({ tone = 'neutral', children }) {
  const t = statusTones[tone] || statusTones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, flexShrink: 0,
      letterSpacing: '0.02em',
    }}>{initials}</div>
  );
}

function blockerColor(tone) {
  return {
    red:     { bg: 'var(--card-red-bg)',   fg: 'var(--status-red)',   dot: '#D74C3C' },
    amber:   { bg: 'var(--card-amber-bg)', fg: 'var(--status-amber)', dot: '#C08C2A' },
    blue:    { bg: 'var(--ai-bg)',         fg: 'var(--ai-ink)',       dot: '#5B8DF6' },
    neutral: { bg: 'var(--bg-muted)',      fg: 'var(--text-secondary)',dot: '#9AA0A6' },
  }[tone] || { bg: 'var(--bg-muted)', fg: 'var(--text-secondary)', dot: '#9AA0A6' };
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function ProcessorHomeView({ onNavigate, onOpenLoan, onOpenAi, onOpenDepositReview }) {
  const [tasks, setTasks] = React.useState(PROCESSOR_TASKS);
  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const openCount = tasks.filter(t => !t.done).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', background: 'var(--bg-app)' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1535 0%, #1e1b4b 60%, #16202e 100%)',
        padding: '28px 32px 32px',
        display: 'flex', gap: 32, alignItems: 'flex-start',
      }}>
        {/* Left — greeting */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(61,219,140,0.15)', border: '1px solid rgba(61,219,140,0.25)',
              borderRadius: 999, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, color: '#3DDB8C',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#3DDB8C', boxShadow: '0 0 6px #3DDB8C' }}/>
              Processor Mode
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {WEATHER.icon} {WEATHER.temp}° {WEATHER.condition} · {WEATHER.city} · 📍 Greenwood Branch
            </span>
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {greeting()}, Jordan
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            You have{' '}
            <span style={{ color: '#f87171', fontWeight: 600 }}>2 urgent items</span>
            {' '}and{' '}
            <span style={{ color: '#facc15', fontWeight: 600 }}>3 conditions clearable today</span>
            {' '}across your 7 active files.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ai" onClick={() => onOpenAi({ tab: 'ask', prompt: "What's blocking my loans today?" })}>
              <Icon name="sparkle" size={14} strokeWidth={1.8}/>
              What's blocking me today?
            </button>
            <button className="btn btn-outline" style={{ color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => onNavigate('pipeline')}>
              <Icon name="listCheck" size={14}/>
              View full pipeline
            </button>
          </div>
        </div>

        {/* Right — KPI tiles */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          {PROCESSOR_STATS.map(s => (
            <div key={s.label} style={{
              background: s.alert ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (s.alert ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'),
              borderRadius: 14, padding: '16px 18px', minWidth: 120,
            }}>
              <Icon name={s.icon} size={16} color={s.alert ? '#facc15' : 'rgba(255,255,255,0.4)'} strokeWidth={1.6}/>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '8px 0 2px', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.alert ? '#facc15' : 'rgba(255,255,255,0.3)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', gap: 0, flex: 1, minHeight: 0 }}>

        {/* ── Center: Active File Queue ── */}
        <div style={{ flex: 1, padding: '28px 28px 40px', minWidth: 0, borderRight: '1px solid var(--border-subtle)' }}>

          {/* SLA alerts strip */}
          {SLA_ALERTS.length > 0 && (
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SLA_ALERTS.map((a, i) => {
                const c = blockerColor(a.tone);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: c.bg, border: '1px solid ' + (a.tone === 'red' ? 'var(--status-red-bg)' : 'var(--border-subtle)'),
                    borderRadius: 9, padding: '9px 14px', fontSize: 12.5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: c.dot, flexShrink: 0 }}/>
                    <span style={{ fontWeight: 600, color: c.fg }}>{a.borrower}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>—</span>
                    <span style={{ color: 'var(--text-primary)', flex: 1 }}>{a.message}</span>
                    <button style={{ fontSize: 11.5, fontWeight: 600, color: c.fg, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                      View →
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Queue header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>My Active Files</h2>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>Sorted by urgency · {MY_QUEUE.length} loans</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('pipeline')}>
              <Icon name="filter" size={12}/> All loans
            </button>
          </div>

          {/* Queue rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MY_QUEUE.map((loan, i) => {
              const bc = blockerColor(loan.blockerTone);
              const lockColor = loan.lockStatus === 'Expiring' ? '#E0A23A' : loan.lockStatus === 'Floating' ? '#9AA0A6' : '#3DA866';
              const condPct = loan.conditions.total > 0
                ? Math.round(((loan.conditions.total - loan.conditions.open) / loan.conditions.total) * 100)
                : 100;

              return (
                <div key={loan.loanId} style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 12, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
                onClick={() => loan.loanId === 'LN-2024-0234' && onOpenDepositReview ? onOpenDepositReview() : onOpenLoan(loan.loanId, loan.tab)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Priority rank */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: i < 2 ? 'var(--status-red)' : i < 4 ? 'var(--status-amber)' : 'var(--text-tertiary)', width: 16, textAlign: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>

                  <Avatar initials={loan.initials} color={loan.color} size={36}/>

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{loan.borrower}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'DM Mono' }}>{loan.loanId}</span>
                      <StatusPill tone={loan.statusTone}>{loan.status}</StatusPill>
                    </div>
                    {/* Blocker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: bc.dot, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12.5, color: bc.fg, fontWeight: 500 }}>{loan.blocker}</span>
                    </div>
                  </div>

                  {/* Conditions bar */}
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conditions</div>
                    <div style={{ height: 4, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden', marginBottom: 3 }}>
                      <div style={{ width: condPct + '%', height: '100%', background: condPct === 100 ? '#3DA866' : 'var(--text-primary)', borderRadius: 999 }}/>
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{loan.conditions.open} open of {loan.conditions.total}</div>
                  </div>

                  {/* Lock */}
                  <div style={{ width: 72, flexShrink: 0 }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lock</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: lockColor }}>{loan.lockStatus}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{loan.lockDays != null ? `${loan.lockDays}d left` : '—'}</div>
                  </div>

                  {/* Closing */}
                  <div style={{ width: 68, flexShrink: 0 }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Close</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: loan.daysToClose <= 7 ? 'var(--status-red)' : 'var(--text-primary)' }}>{loan.daysToClose}d</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{loan.amount}</div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={e => { e.stopPropagation(); loan.loanId === 'LN-2024-0234' && onOpenDepositReview ? onOpenDepositReview() : onOpenLoan(loan.loanId, loan.tab); }}
                    className="btn btn-outline btn-sm"
                    style={{ flexShrink: 0, fontSize: 12, background: loan.loanId === 'LN-2024-0234' ? '#FEF6E7' : undefined, borderColor: loan.loanId === 'LN-2024-0234' ? '#D97706' : undefined, color: loan.loanId === 'LN-2024-0234' ? '#D97706' : undefined }}
                  >
                    {loan.loanId === 'LN-2024-0234' ? '⚠ Review' : 'Open'} <Icon name="arrowRight" size={11}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right rail: Tasks + SLA ── */}
        <div style={{ width: 320, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0, overflowY: 'auto' }}>

          {/* Today's tasks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Today's Tasks</div>
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{openCount} remaining</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map(task => (
                <div key={task.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: task.done ? 'transparent' : 'var(--bg-surface)',
                  border: '1px solid ' + (task.done ? 'transparent' : task.urgent ? 'var(--status-red-bg)' : 'var(--border-subtle)'),
                  borderRadius: 10, padding: task.done ? '6px 4px' : '10px 12px',
                  opacity: task.done ? 0.45 : 1, transition: 'all 0.15s',
                }}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                      border: '1.5px solid ' + (task.done ? '#3DA866' : task.urgent ? 'var(--status-red)' : 'var(--border-default)'),
                      background: task.done ? '#3DA866' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {task.done && <Icon name="check" size={11} color="#fff" strokeWidth={2.5}/>}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Avatar initials={task.initials} color={task.color} size={16}/>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'DM Mono' }}>{task.loanId}</span>
                      {task.urgent && !task.done && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--status-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urgent</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{task.context}</div>
                  </div>
                  <div style={{ fontSize: 11, color: task.dueLabel === 'Today' ? 'var(--status-red)' : 'var(--text-tertiary)', fontWeight: 600, flexShrink: 0 }}>
                    {task.dueLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Ready */}
          <div style={{
            background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="sparkle" size={15} color="var(--ai-primary)" strokeWidth={1.5}/>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ai-ink)' }}>AI Processor Assistant</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
              Ask me to draft doc requests, clear conditions, validate data, or flag SLA risks.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                "What conditions can I clear right now?",
                "Draft a doc request for David Chen",
                "Which loans are at SLA risk this week?",
              ].map(prompt => (
                <button key={prompt} onClick={() => onOpenAi({ tab: 'ask', prompt })}
                  style={{
                    textAlign: 'left', fontSize: 12, padding: '7px 10px',
                    background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(223,215,251,0.6)',
                    borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
                    color: 'var(--text-primary)', lineHeight: 1.4,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { initials: 'SA', color: '#A8541C', text: 'Anderson uploaded paystub + bank statements', time: '8m ago', actionable: true, loanId: 'LN-2024-0234', tab: 'conditions' },
                { initials: 'UW', color: '#2563EB', text: 'UW returned Kim — 2 new conditions added', time: '42m ago', actionable: true, loanId: 'LN-2024-0289', tab: 'conditions' },
                { initials: 'AP', color: '#D97706', text: 'Appraisal in — Chen · $518K · gap flag', time: '1h ago', actionable: true, loanId: 'LN-2024-0189', tab: 'now' },
                { initials: 'TI', color: '#059669', text: 'Title commitment received — Rodriguez', time: '3h ago', actionable: false, loanId: 'LN-2024-0301', tab: 'now' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                  onClick={() => item.actionable && onOpenLoan(item.loanId, item.tab)}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: item.actionable ? 'pointer' : 'default' }}
                >
                  <Avatar initials={item.initials} color={item.color} size={28}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.time}</div>
                  </div>
                  {item.actionable && <Icon name="arrowRight" size={12} color="var(--text-tertiary)"/>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
