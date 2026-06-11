import React from 'react';
import { Icon } from '../components/Icon';
import { LOANS } from '../data/loans';

// ── Loan Health Monitor ─────────────────────────────────────────────────────
// High-impact dashboard widget that surfaces every loan's vitals on one row:
// stage, days-in-stage, completeness, risk flags, AI signal, next action.
//
// Each row has a 3px left border that color-codes overall severity so a
// scanning LO immediately sees which files are in trouble. Filter chips at
// the top let the user narrow to At Risk / Stalled / On Track in one click.
//
// Color semantics (per WidgetGrid.jsx color rules):
//   RED   = critical (flagged, lock expiring ≤3d, AI blocked, overdue close)
//   AMBER = warning  (AI needs review, lock expiring ≤7d, DTI > 43)
//   GREEN = on track (AI green tone, no flags)
//   GRAY  = neutral  (no signal yet — Scanning, Application stage)

const STAGES = ['Application', 'Processing', 'Underwriting', 'Approval', 'Closing', 'Funded'];

const stageIndex = (status) => STAGES.indexOf(status);

const SEVERITY_BORDER = {
  critical: '#EF4444',
  warning:  '#D97706',
  ok:       '#10B981',
  neutral:  '#E5E7EB',
};

function computeRowSeverity(loan) {
  const overdueClosing = loan.closingDate && new Date(loan.closingDate) < new Date() && loan.status !== 'Funded';
  const lockCritical = loan.lockStatus === 'Expiring' && loan.lockDays != null && loan.lockDays <= 3;
  if (loan.flag || lockCritical || loan.aiTone === 'red' || overdueClosing) return 'critical';
  if (loan.aiTone === 'amber' || (loan.lockStatus === 'Expiring' && loan.lockDays <= 7) || loan.dti > 43) return 'warning';
  if (loan.aiTone === 'green') return 'ok';
  return 'neutral';
}

function nextAction(loan) {
  if (loan.aiTone === 'red' || loan.flag) return { label: 'Triage',       tab: 'now',        tone: 'risk' };
  if (loan.lockStatus === 'Expiring' && loan.lockDays != null && loan.lockDays <= 7)
                                          return { label: 'Extend lock',  tab: 'pricing',    tone: 'warn' };
  if (loan.aiStatus === 'Needs Review')   return { label: 'Review',       tab: 'conditions', tone: 'warn' };
  if (loan.conditionsOpen === 0 && loan.status === 'Underwriting')
                                          return { label: 'Submit',       tab: 'now',        tone: 'positive' };
  if (loan.status === 'Application')      return { label: 'Open file',    tab: 'now',        tone: 'neutral' };
  return { label: 'Open file', tab: 'now', tone: 'neutral' };
}

// ── Sub-components ──────────────────────────────────────────────────────────
function StageProgress({ currentIndex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
        {STAGES.map((_, i) => (
          <span key={i} style={{
            width: i === currentIndex ? 14 : 8, height: 5, borderRadius: 999,
            background: i < currentIndex ? '#10B981' : i === currentIndex ? '#5B21B6' : '#E5E7EB',
          }}/>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{STAGES[currentIndex] || '—'}</div>
    </div>
  );
}

function CompletenessBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const color = pct === 100 ? '#10B981' : pct >= 50 ? '#5B21B6' : '#D97706';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <div style={{ flex: 1, height: 5, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden', minWidth: 60 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.3s' }}/>
      </div>
      <span style={{
        fontSize: 11, color: '#6B7280', fontFamily: 'DM Sans',
        minWidth: 36, textAlign: 'right', flexShrink: 0,
      }}>{done}/{total}</span>
    </div>
  );
}

function RiskFlags({ loan }) {
  const flags = [];
  if (loan.flag) flags.push({ icon: 'alertCircle', label: 'Flagged', color: '#EF4444' });
  if (loan.lockStatus === 'Expiring' && loan.lockDays != null && loan.lockDays <= 7) {
    flags.push({ icon: 'clock', label: `${loan.lockDays}d lock`, color: loan.lockDays <= 3 ? '#EF4444' : '#D97706' });
  }
  if (loan.dti > 43)                       flags.push({ icon: 'alertOctagon', label: `DTI ${loan.dti}%`, color: '#EF4444' });
  if (loan.credit?.fico && loan.credit.fico < 680)
                                            flags.push({ icon: 'alertCircle', label: `FICO ${loan.credit.fico}`, color: '#D97706' });
  if (flags.length === 0) {
    return <span style={{ fontSize: 11, color: '#9CA3AF' }}>No flags</span>;
  }
  return (
    <div style={{ display: 'inline-flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
      {flags.slice(0, 3).map((f, i) => (
        <span key={i} title={f.label} style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: f.color + '15', color: f.color,
          fontSize: 11, fontWeight: 700,
          padding: '2px 6px', borderRadius: 4,
          whiteSpace: 'nowrap',
        }}>
          <Icon name={f.icon} size={10}/>
          {f.label}
        </span>
      ))}
    </div>
  );
}

function AISignal({ loan }) {
  const map = {
    'On Track':     { color: '#059669', icon: 'checkCircle' },
    'Needs Review': { color: '#D97706', icon: 'alertCircle' },
    'Blocked':      { color: '#EF4444', icon: 'alertOctagon' },
    'Running':      { color: '#7E68FA', icon: 'sparkle' },
    'Scanning':     { color: '#9CA3AF', icon: 'sparkle' },
  };
  const m = map[loan.aiStatus] || map['Scanning'];
  // Confidence — derived from aiTone for the prototype
  const conf = loan.aiTone === 'green' ? 94 : loan.aiTone === 'red' ? 62 : loan.aiTone === 'amber' ? 78 : 71;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 11, fontWeight: 700, color: m.color,
      }}>
        <Icon name={m.icon} size={11} strokeWidth={1.9}/>
        {loan.aiStatus}
      </span>
      <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'DM Sans' }}>{conf}%</span>
    </span>
  );
}

// ── Row ─────────────────────────────────────────────────────────────────────
function LoanHealthRow({ loan, onOpen }) {
  const sev = computeRowSeverity(loan);
  const action = nextAction(loan);
  const actionColors = {
    risk:     { bg: '#FEF2F2', fg: '#B91C1C', border: '#FECACA' },
    warn:     { bg: '#FFFBEB', fg: '#92400E', border: '#FCD34D' },
    positive: { bg: '#ECFDF5', fg: '#065F46', border: '#A7F3D0' },
    neutral:  { bg: '#fff',    fg: '#111827', border: '#E5E7EB' },
  }[action.tone];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen && onOpen(loan.id, action.tab)}
      onKeyDown={e => { if (e.key === 'Enter') onOpen && onOpen(loan.id, action.tab); }}
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 110px 56px 1fr 1fr 100px',
        gap: 14,
        alignItems: 'center',
        padding: '13px 18px 13px 15px',
        borderLeft: `3px solid ${SEVERITY_BORDER[sev]}`,
        borderTop: '1px solid #F3F4F6',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 999,
          background: loan.avatarColor, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{loan.initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loan.borrower}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Sans' }}>
            {loan.id} · ${(loan.amount/1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Stage */}
      <StageProgress currentIndex={stageIndex(loan.status)}/>

      {/* Days in stage */}
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: loan.days > 7 ? '#D97706' : loan.days > 3 ? '#374151' : '#9CA3AF',
        fontFamily: 'DM Sans',
      }}>{loan.days}d</div>

      {/* Conditions completeness */}
      <CompletenessBar done={loan.conditionsTotal - loan.conditionsOpen} total={loan.conditionsTotal}/>

      {/* Risk flags + AI signal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <RiskFlags loan={loan}/>
        <AISignal loan={loan}/>
      </div>

      {/* Next action */}
      <button
        onClick={e => { e.stopPropagation(); onOpen && onOpen(loan.id, action.tab); }}
        style={{
          background: actionColors.bg, color: actionColors.fg,
          border: `1px solid ${actionColors.border}`,
          borderRadius: 7, padding: '6px 11px',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'inherit', justifySelf: 'flex-end',
          whiteSpace: 'nowrap',
          transition: 'filter 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'none'}
      >
        {action.label}
        <Icon name="arrowRight" size={11} strokeWidth={2.4}/>
      </button>
    </div>
  );
}

// ── Widget ──────────────────────────────────────────────────────────────────
export function LoanHealthMonitorWidget({ onOpenLoan }) {
  const [filter, setFilter] = React.useState('all');

  // Pre-compute severity for the dataset so we can count + filter consistently
  const annotated = React.useMemo(() => LOANS.map(l => ({ loan: l, sev: computeRowSeverity(l) })), []);

  const counts = React.useMemo(() => ({
    all: annotated.length,
    risk: annotated.filter(a => a.sev === 'critical' || a.sev === 'warning').length,
    stalled: annotated.filter(a => a.loan.days > 7).length,
    'on-track': annotated.filter(a => a.sev === 'ok').length,
  }), [annotated]);

  const filtered = annotated.filter(a => {
    if (filter === 'risk')     return a.sev === 'critical' || a.sev === 'warning';
    if (filter === 'stalled')  return a.loan.days > 7;
    if (filter === 'on-track') return a.sev === 'ok';
    return true;
  });

  // Sort: critical first, then warning, then by days descending
  const sorted = filtered.sort((a, b) => {
    const order = { critical: 0, warning: 1, neutral: 2, ok: 3 };
    if (order[a.sev] !== order[b.sev]) return order[a.sev] - order[b.sev];
    return b.loan.days - a.loan.days;
  });

  const tabs = [
    { id: 'all',     label: 'All' },
    { id: 'risk',    label: 'At risk' },
    { id: 'stalled', label: 'Stalled' },
    { id: 'on-track',label: 'On track' },
  ];

  const visibleCount = Math.min(sorted.length, 8);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid #F3F4F6',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #7E68FA 0%, #5B21B6 100%)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(91,33,182,0.20)',
          }}>
            <Icon name="pipeline" size={15} strokeWidth={1.9}/>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>Loan Health Monitor</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>
              Showing {visibleCount} of {sorted.length} {sorted.length === 1 ? 'file' : 'files'} · sorted by risk
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F9FAFB', padding: 3, borderRadius: 8 }}>
          {tabs.map(t => {
            const active = filter === t.id;
            const alertOnIdle = t.id === 'risk' && counts.risk > 0 && !active;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '5px 11px', fontSize: 12, fontWeight: 700,
                border: 'none', borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit',
                background: active ? '#fff' : 'transparent',
                color: active ? '#111827' : '#6B7280',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {t.label}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: alertOnIdle ? '#FEE2E2' : active ? '#F3F4F6' : '#E5E7EB',
                  color: alertOnIdle ? '#B91C1C' : '#374151',
                  padding: '1px 5px', borderRadius: 4, minWidth: 16, textAlign: 'center',
                }}>{counts[t.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 110px 56px 1fr 1fr 100px',
        gap: 14, padding: '8px 18px 8px 21px',
        fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
        color: '#9CA3AF',
        background: '#FAFAFA',
        borderBottom: '1px solid #F3F4F6',
      }}>
        <div>File</div>
        <div>Stage</div>
        <div>Days</div>
        <div>Conditions</div>
        <div>Signals</div>
        <div style={{ justifySelf: 'flex-end' }}>Next</div>
      </div>

      {/* Rows or empty state */}
      {sorted.length === 0 ? (
        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>✓</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Nothing to triage here.</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>All files in this filter are healthy.</div>
        </div>
      ) : (
        sorted.slice(0, 8).map(({ loan }) => (
          <LoanHealthRow key={loan.id} loan={loan} onOpen={onOpenLoan}/>
        ))
      )}

      {sorted.length > 8 && (
        <div style={{
          padding: '11px 18px', borderTop: '1px solid #F3F4F6',
          fontSize: 12, color: '#6B7280', textAlign: 'center',
        }}>
          Showing top 8 of {sorted.length} ·{' '}
          <a href="#" style={{ color: '#5B21B6', fontWeight: 700, textDecoration: 'none' }}>View all in Pipeline →</a>
        </div>
      )}
    </div>
  );
}
