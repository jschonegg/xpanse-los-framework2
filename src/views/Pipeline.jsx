import React from 'react';
import { Icon } from '../components/Icon';
import { Avatar, StatusPill } from '../components/Shell';
import { LOANS as SHARED_LOANS } from '../data/loans';
import { TasksView, TasksSidebar } from './Tasks';

const TODAY = new Date('2026-05-27');
function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - TODAY) / 86400000);
}

function ClosingBadge({ dateStr }) {
  const d = daysUntil(dateStr);
  if (d === null) return <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>—</span>;
  const urgent = d <= 7, warn = d <= 14;
  const bg = urgent ? 'var(--card-red-bg)' : warn ? 'var(--status-amber-bg)' : 'var(--bg-muted)';
  const color = urgent ? 'var(--status-red)' : warn ? 'var(--status-amber)' : 'var(--text-secondary)';
  const label = d < 0 ? `${Math.abs(d)}d ago` : d === 0 ? 'Today' : `${d}d`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'DM Mono', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{dateStr}</span>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: bg, color, display: 'inline-block', width: 'fit-content' }}>{label}</span>
    </div>
  );
}

const STAGE_ORDER = ['Application', 'Processing', 'Underwriting', 'Approval', 'Closing', 'Funded'];
function StageProgress({ status }) {
  const idx = STAGE_ORDER.indexOf(status);
  const total = STAGE_ORDER.length;
  const pct = ((idx + 1) / total) * 100;
  const color = idx >= 4 ? '#3DB371' : idx >= 2 ? 'var(--ai-primary)' : 'var(--status-amber)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <StatusPill tone={{ Application: 'neutral', Processing: 'amber', Underwriting: 'blue', Approval: 'green', Closing: 'green', Funded: 'green' }[status] || 'neutral'}>{status}</StatusPill>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.3s' }}/>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'DM Mono', minWidth: 24 }}>{idx + 1}/{total}</span>
      </div>
    </div>
  );
}

function LockBadge({ lockStatus, lockDays }) {
  if (!lockStatus) return <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>—</span>;
  const expiring = lockStatus === 'Expiring' || (lockStatus === 'Locked' && lockDays != null && lockDays <= 7);
  const floating = lockStatus === 'Floating';
  if (expiring) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'var(--card-red-bg)', color: 'var(--status-red)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--status-red)', animation: 'pulse 1.5s infinite' }}/>
          Exp. {lockDays}d
        </span>
      </div>
    );
  }
  if (floating) {
    return <StatusPill tone="amber">Floating</StatusPill>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <StatusPill tone="green">Locked</StatusPill>
      {lockDays != null && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{lockDays}d</span>}
    </div>
  );
}

// Derive a specific, human-readable action item from a loan's state.
// Returns { label, detail, icon, iconColor, ctaLabel, ctaTab, severity }
function getLoanAction(l) {
  const d = daysUntil(l.closingDate);

  // Priority 1: lock expiring today or tomorrow
  if (l.lockStatus === 'Expiring' || (l.lockStatus === 'Locked' && l.lockDays != null && l.lockDays <= 3)) {
    return {
      icon: 'lock', iconColor: 'var(--status-red)',
      label: l.borrower,
      detail: `Rate lock expires in ${l.lockDays}d — extend before it reprices`,
      ctaLabel: 'Extend lock', ctaTab: 'pricing',
      severity: 'red',
    };
  }
  // Priority 2: closing very soon with open conditions
  if (d !== null && d <= 10 && d >= 0 && l.conditionsOpen > 0) {
    return {
      icon: 'alertOctagon', iconColor: 'var(--status-red)',
      label: l.borrower,
      detail: `${l.conditionsOpen} condition${l.conditionsOpen !== 1 ? 's' : ''} open · closes in ${d === 0 ? 'today' : `${d}d`}`,
      ctaLabel: 'Clear conditions', ctaTab: 'underwriting',
      severity: 'red',
    };
  }
  // Priority 3: lock expiring in a few days
  if (l.lockStatus === 'Locked' && l.lockDays != null && l.lockDays <= 7) {
    return {
      icon: 'lock', iconColor: 'var(--status-amber)',
      label: l.borrower,
      detail: `Rate lock expires in ${l.lockDays}d — monitor or extend`,
      ctaLabel: 'Review lock', ctaTab: 'pricing',
      severity: 'amber',
    };
  }
  // Priority 4: closing soon
  if (d !== null && d <= 10 && d >= 0) {
    return {
      icon: 'calendar', iconColor: 'var(--status-amber)',
      label: l.borrower,
      detail: `Closing ${d === 0 ? 'today' : `in ${d}d`} — verify all items are cleared`,
      ctaLabel: 'Open loan', ctaTab: null,
      severity: 'amber',
    };
  }
  // Priority 5: many open conditions
  if (l.conditionsOpen > 3) {
    return {
      icon: 'listCheck', iconColor: 'var(--status-amber)',
      label: l.borrower,
      detail: `${l.conditionsOpen} of ${l.conditionsTotal} conditions still open`,
      ctaLabel: 'Review', ctaTab: 'underwriting',
      severity: 'amber',
    };
  }
  // Fallback: general health issue
  return {
    icon: 'alert', iconColor: 'var(--status-amber)',
    label: l.borrower,
    detail: `Health score low — review loan status`,
    ctaLabel: 'Open', ctaTab: null,
    severity: 'amber',
  };
}

function DailyFocus({ loans, onOpenLoan }) {
  const [dismissed, setDismissed] = React.useState(new Set());

  const items = loans
    .filter(l => {
      const d = daysUntil(l.closingDate);
      const { score } = computeHealth(l);
      return !dismissed.has(l.id) && (
        score < 60 ||
        l.lockStatus === 'Expiring' ||
        (l.lockStatus === 'Locked' && l.lockDays != null && l.lockDays <= 7) ||
        (d !== null && d <= 10 && d >= 0)
      );
    })
    .map(l => ({ loan: l, action: getLoanAction(l) }))
    // Sort: red first, then amber
    .sort((a, b) => (a.action.severity === 'red' ? -1 : 1) - (b.action.severity === 'red' ? -1 : 1))
    .slice(0, 5);

  if (items.length === 0) return null;

  const redCount = items.filter(i => i.action.severity === 'red').length;

  return (
    <div style={{ marginBottom: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <Icon name="alert" size={13} color={redCount > 0 ? 'var(--status-red)' : 'var(--status-amber)'}/>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Action required</span>
        {redCount > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: 'var(--status-red-bg)', color: 'var(--status-red)' }}>
            {redCount} urgent
          </span>
        )}
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 2 }}>
          · {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Action rows */}
      {items.map(({ loan: l, action: a }) => {
        const isRed = a.severity === 'red';
        return (
          <div key={l.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '9px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            borderLeft: `3px solid ${isRed ? 'var(--status-red)' : 'var(--status-amber)'}`,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Icon */}
            <span style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              background: isRed ? 'var(--status-red-bg)' : 'var(--status-amber-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={a.icon} size={13} color={a.iconColor}/>
            </span>

            {/* Borrower + detail */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{a.label}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'DM Mono', flexShrink: 0 }}>{l.id}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a.detail}
              </div>
            </div>

            {/* Status context */}
            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{l.status}</span>

            {/* CTA */}
            <button
              onClick={() => onOpenLoan(l.id, a.ctaTab)}
              style={{
                flexShrink: 0, height: 28, padding: '0 12px',
                border: `1px solid ${isRed ? 'var(--card-red-border)' : 'var(--card-amber-border)'}`,
                background: isRed ? 'var(--status-red-bg)' : 'var(--status-amber-bg)',
                color: isRed ? 'var(--status-red)' : 'var(--status-amber)',
                borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                transition: 'filter 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              {a.ctaLabel}
            </button>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(prev => new Set([...prev, l.id]))}
              aria-label={`Dismiss ${l.borrower}`}
              style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="x" size={11} strokeWidth={2.5}/>
            </button>
          </div>
        );
      })}
    </div>
  );
}

const INITIAL_PIPELINE_LOANS = SHARED_LOANS.map(l => ({ ...l }));

// ── KPI summary cards ─────────────────────────────────────────────────────
function computeKpis(loans) {
  const activeStages = new Set(['Application','Processing','Underwriting','Approval','Closing']);
  const active = loans.filter(l => activeStages.has(l.status));

  // Total volume across all loans in pipeline
  const totalVolume = loans.reduce((sum, l) => sum + (l.amount || 0), 0);

  // Pipeline velocity: total days currently sitting across all in-process loans
  const totalDays = active.reduce((sum, l) => sum + (l.days || 0), 0);

  // Alerts: loans needing attention (low health, expiring lock, overdue closing, many open conditions)
  const alerts = loans.filter(l => {
    const d = daysUntil(l.closingDate);
    const { score } = computeHealth(l);
    return score < 65
      || l.lockStatus === 'Expiring'
      || (d !== null && d < 0)
      || (l.conditionsOpen || 0) > 4
      || l.flag;
  });

  return {
    totalPipeline: { value: loans.length,        detail: 'All stages' },
    totalVolume:   { value: `$${(totalVolume/1_000_000).toFixed(1)}M`, detail: 'Loan amount' },
    activeLoans:   { value: active.length,       detail: 'In process' },
    avgDays:       { value: totalDays,           detail: 'Pipeline velocity' },
    totalAlerts:   { value: alerts.length,       detail: 'Needs attention' },
  };
}

function KpiCard({ icon, iconColor, label, value, detail }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)', borderRadius: 10,
      padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 7 }}>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-tertiary)' }}>{label}</span>
        <Icon name={icon} size={14} color={iconColor}/>
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{detail}</div>
    </div>
  );
}

function KpiRow({ loans }) {
  const k = React.useMemo(() => computeKpis(loans), [loans]);
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
      <KpiCard icon="doc"         iconColor="var(--text-secondary)" label="Total Pipeline"  value={k.totalPipeline.value} detail={k.totalPipeline.detail}/>
      <KpiCard icon="dollar"      iconColor="#3A6BAD"               label="Total Volume"    value={k.totalVolume.value}   detail={k.totalVolume.detail}/>
      <KpiCard icon="trendingUp"  iconColor="#3DB371"               label="Active Loans"    value={k.activeLoans.value}   detail={k.activeLoans.detail}/>
      <KpiCard icon="clock"       iconColor="var(--text-secondary)" label="Avg Days/Stage"  value={k.avgDays.value}       detail={k.avgDays.detail}/>
      <KpiCard icon="alertCircle" iconColor="var(--status-red)"     label="Total Alerts"    value={k.totalAlerts.value}   detail={k.totalAlerts.detail}/>
    </div>
  );
}

// ── Single-line AI insights banner (replaces the bulkier multi-row DailyFocus) ─
function AIInsightsBanner({ loans, onOpenLoan }) {
  const [dismissedIds, setDismissedIds] = React.useState(new Set());
  const [cursor, setCursor] = React.useState(0);
  const [animDir, setAnimDir] = React.useState(0); // -1 prev, +1 next, 0 idle

  const items = React.useMemo(() => loans
    .filter(l => {
      if (dismissedIds.has(l.id)) return false;
      const d = daysUntil(l.closingDate);
      const { score } = computeHealth(l);
      return score < 60
        || l.lockStatus === 'Expiring'
        || (l.lockStatus === 'Locked' && l.lockDays != null && l.lockDays <= 7)
        || (d !== null && d <= 10 && d >= 0);
    })
    .map(l => ({ loan: l, action: getLoanAction(l) }))
    .sort((a, b) => (a.action.severity === 'red' ? -1 : 1) - (b.action.severity === 'red' ? -1 : 1)),
    [loans, dismissedIds]);

  // Reset animation flag shortly after each move so subsequent renders don't replay it
  React.useEffect(() => {
    if (animDir === 0) return;
    const t = setTimeout(() => setAnimDir(0), 260);
    return () => clearTimeout(t);
  }, [animDir, cursor]);

  if (items.length === 0) return null;
  const idx = ((cursor % items.length) + items.length) % items.length;
  const { loan: l, action: a } = items[idx];
  const isRed = a.severity === 'red';

  const goPrev = () => { setAnimDir(-1); setCursor(c => c - 1); };
  const goNext = () => { setAnimDir(1);  setCursor(c => c + 1); };

  // Subtle slide-in for the changing content area
  const slideKeyframes = animDir === 1 ? 'aiSlideInRight' : animDir === -1 ? 'aiSlideInLeft' : null;

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', gap: 0,
      background: 'var(--bg-surface)',
      border: '1px solid var(--ai-border, #E4DEFA)',
      borderRadius: 10, padding: 0, overflow: 'hidden',
      marginBottom: 14, fontSize: 13,
    }}>
      <style>{`
        @keyframes aiSlideInRight { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes aiSlideInLeft  { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ── Section 1: AI insights label (tinted background) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '10px 14px',
        background: 'rgba(110, 89, 232, 0.07)',
        borderRight: '1px solid var(--ai-border, #E4DEFA)',
        flexShrink: 0,
      }}>
        <Icon name="sparkle" size={15} color="var(--ai-primary, #6E59E8)"/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ai-ink, #3F2FBF)' }}>AI insights</span>
          <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>Updated just now</span>
        </div>
      </div>

      {/* ── Section 2: insight content (animated on flip) ── */}
      <div
        key={`${idx}-${l.id}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          flex: 1, minWidth: 0,
          animation: slideKeyframes ? `${slideKeyframes} 0.22s ease-out` : undefined,
        }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
          padding: '3px 9px', borderRadius: 999,
          background: isRed ? 'var(--status-red-bg)' : 'var(--status-amber-bg)',
          color: isRed ? 'var(--status-red)' : 'var(--status-amber)',
        }}>
          <Icon name="alertOctagon" size={11} color={isRed ? 'var(--status-red)' : 'var(--status-amber)'}/>
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Heads up</span>
        </span>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{l.borrower}</span>
        <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>— {a.detail}</span>
      </div>

      {/* ── Section 3: CTA ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 12px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => onOpenLoan(l.id, a.ctaTab)}
          style={{
            height: 30, padding: '0 13px', borderRadius: 7, fontFamily: 'inherit', cursor: 'pointer',
            border: `1px solid ${isRed ? 'var(--card-red-border, #F2C4BE)' : 'var(--card-amber-border, #F0D9A8)'}`,
            background: isRed ? 'var(--status-red-bg)' : 'var(--status-amber-bg)',
            color: isRed ? 'var(--status-red)' : 'var(--status-amber)',
            fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            transition: 'filter 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'none'}
        >
          {a.ctaLabel} <Icon name="arrowRight" size={12} strokeWidth={2.2}/>
        </button>
      </div>

      {/* ── Section 4: carousel controls ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '10px 10px',
        flexShrink: 0,
      }}>
        <CarouselBtn onClick={goPrev} disabled={items.length <= 1} dir="prev" aria-label="Previous insight"/>
        <span style={{ fontFamily: 'DM Mono', fontSize: 11.5, minWidth: 36, textAlign: 'center', color: 'var(--text-secondary)' }}>
          {idx + 1} / {items.length}
        </span>
        <CarouselBtn onClick={goNext} disabled={items.length <= 1} dir="next" aria-label="Next insight"/>
      </div>

      {/* ── Section 5: dismiss ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 12px 10px 6px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => { setDismissedIds(prev => new Set([...prev, l.id])); setCursor(0); }}
          aria-label="Dismiss insight"
          style={{
            width: 26, height: 26, border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: 6, color: 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          <Icon name="x" size={13}/>
        </button>
      </div>
    </div>
  );
}

function CarouselBtn({ onClick, disabled, dir, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 26, height: 26, borderRadius: 6,
        border: '1px solid var(--ai-border, #E4DEFA)',
        background: 'var(--bg-surface)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
        opacity: disabled ? 0.4 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(110, 89, 232, 0.08)'; e.currentTarget.style.color = 'var(--ai-primary, #6E59E8)'; e.currentTarget.style.borderColor = 'var(--ai-primary, #6E59E8)'; } }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--ai-border, #E4DEFA)'; }}
      {...rest}
    >
      <Icon name="chevronRight" size={13} strokeWidth={2.2} style={{ transform: dir === 'prev' ? 'rotate(180deg)' : 'none' }}/>
    </button>
  );
}


const COLUMN_DEFS = [
  { id: 'borrower', label: 'Borrower', width: 220, editType: 'text',
    render: (l) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar initials={l.initials} size={32} color={l.avatarColor}/>
          {l.flag && (
            <span style={{
              position: 'absolute', top: -3, right: -3,
              background: 'var(--status-red)', color: '#fff',
              fontSize: 10, fontWeight: 700, width: 15, height: 15, borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid var(--bg-surface)',
            }}>{l.flag}</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.25 }}>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)' }}>{l.borrower}</span>
          <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text-tertiary)' }}>{l.id}</span>
        </div>
      </div>
    )},
  { id: 'property', label: 'Property', width: 240, editType: 'text',
    render: (l) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{l.property}</span> },
  { id: 'amount', label: 'Amount', width: 110, align: 'right', editType: 'number', prefix: '$',
    render: (l) => <span style={{ fontSize: 13.5, fontWeight: 600 }}>${(l.amount/1000).toFixed(0)}K</span> },
  { id: 'product', label: 'Product', width: 120, editType: 'select',
    options: ['Conv 30yr','FHA 30yr','VA 30yr','Jumbo 30yr','USDA 30yr'],
    render: (l) => <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l.product}</span> },
  { id: 'rate', label: 'Rate', width: 80, align: 'right', editType: 'number', step: 0.125, suffix: '%',
    render: (l) => <span style={{ fontFamily: 'DM Mono', fontSize: 12.5 }}>{l.rate.toFixed(3)}%</span> },
  { id: 'status', label: 'Status', width: 150, editType: 'select',
    options: ['Application','Processing','Underwriting','Approval','Closing','Funded'],
    render: (l) => <StageProgress status={l.status}/> },
  { id: 'milestone', label: 'Milestone', width: 170, editType: 'text',
    render: (l) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{l.milestone}</span> },
  { id: 'days', label: 'Days', width: 70, align: 'center', editType: 'number',
    render: (l) => (
      <span style={{
        background: 'var(--bg-muted)', color: 'var(--text-secondary)',
        fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 999,
      }}>{l.days}d</span>
    )},
  { id: 'dti', label: 'DTI', width: 70, align: 'right', editType: 'number', suffix: '%',
    render: (l) => <span style={{ fontFamily: 'DM Mono', fontSize: 12.5 }}>{l.dti}%</span> },
  { id: 'ltv', label: 'LTV', width: 70, align: 'right', editType: 'number', suffix: '%',
    render: (l) => <span style={{ fontFamily: 'DM Mono', fontSize: 12.5 }}>{l.ltv}%</span> },
  { id: 'closingDate', label: 'Est. Closing', width: 130, editType: 'date',
    render: (l) => <ClosingBadge dateStr={l.closingDate}/> },
  { id: 'assignee', label: 'Assignee', width: 160, editType: 'select',
    options: ['Alex Martinez','Jamie Lee','Priya Shah','Morgan Pierce'],
    render: (l) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar initials={l.assigneeInitials} size={24} color="#E5E4E0" textColor="#3A3A38"/>
        <span style={{ fontSize: 13 }}>{l.assignee}</span>
      </div>
    )},
  { id: 'aiStatus', label: 'AI Status', width: 120, editType: 'select',
    options: ['On Track','Needs Review','Running','Scanning','Blocked'],
    render: (l) => <AIStatusCell loan={l}/> },
  { id: 'conditions', label: 'Conditions', width: 100, align: 'center',
    render: (l) => {
      const open = (l.conditionsOpen || 0);
      const total = (l.conditionsTotal || 0);
      const tone = open === 0 ? 'green' : open > 3 ? 'red' : 'amber';
      return (
        <span style={{
          fontSize: 12, fontWeight: 600,
          padding: '3px 8px', borderRadius: 999,
          background: tone === 'green' ? 'var(--status-green-bg)' : tone === 'red' ? 'var(--card-red-bg)' : 'var(--status-amber-bg)',
          color: tone === 'green' ? 'var(--status-green)' : tone === 'red' ? 'var(--status-red)' : 'var(--status-amber)',
        }}>{open}/{total}</span>
      );
    }},
  { id: 'lock', label: 'Rate Lock', width: 120,
    render: (l) => <LockBadge lockStatus={l.lockStatus} lockDays={l.lockDays}/> },
  { id: 'aus', label: 'AUS', width: 100,
    render: (l) => {
      if (!l.aus) return <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>—</span>;
      const tone = l.aus.endsWith('Approve') ? 'green' : l.aus.includes('Refer') ? 'amber' : 'neutral';
      return <StatusPill tone={tone}>{l.aus}</StatusPill>;
    }},
  { id: 'disclosures', label: 'Disclosures', width: 130,
    render: (l) => {
      if (!l.disclosures) return <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>—</span>;
      return <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{l.disclosures}</span>;
    }},
  { id: 'nextAction', label: 'Next Action', width: 220,
    render: (l) => {
      const na = NEXT_ACTIONS[l.id];
      if (!na) return <span style={{ color: 'var(--text-tertiary)', fontSize: 12.5 }}>—</span>;
      const dot = { red: '#D74C3C', amber: '#E0A23A', neutral: '#9AA0A6' }[na.tone] || '#9AA0A6';
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: dot, flexShrink: 0 }}/>
          <span style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.3 }}>{na.text}</span>
        </div>
      );
    }},
  { id: 'health', label: 'Health', width: 110,
    render: (l) => <HealthBar loan={l}/> },
];

// Stage average days benchmarks (industry baseline)
const STAGE_AVG_DAYS = { Application: 3, Processing: 10, Underwriting: 12, Approval: 5, Closing: 7 };

function computeHealth(l) {
  let score = 100;
  const reasons = [];

  // Conditions: each open condition costs points
  const condRatio = l.conditionsTotal > 0 ? l.conditionsOpen / l.conditionsTotal : 0;
  const condPenalty = Math.round(condRatio * 30);
  if (condPenalty > 0) {
    score -= condPenalty;
    reasons.push(`${l.conditionsOpen} of ${l.conditionsTotal} conditions still open`);
  }

  // Days in stage vs benchmark
  const avgDays = STAGE_AVG_DAYS[l.status] || 7;
  if (l.days > avgDays) {
    const overDays = l.days - avgDays;
    const dayPenalty = Math.min(25, overDays * 4);
    score -= dayPenalty;
    reasons.push(`${l.days} days in ${l.status} — ${overDays}d over average`);
  }

  // Lock expiry
  if (l.lockStatus === 'Expiring') {
    score -= 20;
    reasons.push(`Rate lock expires in ${l.lockDays} day${l.lockDays === 1 ? '' : 's'}`);
  } else if (l.lockStatus === 'Floating') {
    score -= 8;
    reasons.push('Rate is floating — not yet locked');
  } else if (l.lockStatus === 'Locked' && l.lockDays != null && l.lockDays <= 7) {
    score -= 12;
    reasons.push(`Rate lock expires in ${l.lockDays} day${l.lockDays === 1 ? '' : 's'}`);
  }

  // AUS result
  if (l.aus === 'DU Refer') {
    score -= 15;
    reasons.push('AUS returned Refer — manual underwrite required');
  } else if (!l.aus && l.status !== 'Application') {
    score -= 10;
    reasons.push('No AUS finding on file yet');
  }

  // Closing date pressure: days until closing
  if (l.closingDate) {
    const closing = new Date(l.closingDate);
    const daysLeft = Math.round((closing - TODAY) / 86400000);
    if (daysLeft < 14) {
      score -= 15;
      reasons.push(`Closing in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`);
    } else if (daysLeft < 21) {
      score -= 7;
      reasons.push(`Closing in ${daysLeft} days`);
    }
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reasons };
}

function HealthBar({ loan, compact }) {
  const [hover, setHover] = React.useState(false);
  const { score, reasons } = computeHealth(loan);
  // Use token values — #E0A23A amber fails WCAG AA (2.23:1); token #9C6A1A = 4.73:1 ✓
  const color = score >= 75 ? '#3DB371' : score >= 50 ? 'var(--status-amber)' : '#C2362A';
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'At Risk' : 'Critical';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 52, height: 5, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', borderRadius: 999, background: color, transition: 'width 0.3s' }}/>
        </div>
        <span style={{ fontFamily: 'DM Mono', fontSize: 11.5, fontWeight: 600, color, minWidth: 22 }}>{score}</span>
      </div>
      {hover && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 200, marginTop: 6,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '12px 14px', width: 260,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Loan Health</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color,
              background: color + '18', padding: '2px 8px', borderRadius: 999,
            }}>{score} · {label}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginBottom: 8 }}>
            Based on open conditions, time in stage, rate lock, and closing timeline.
          </div>
          {reasons.length === 0
            ? <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>✓ No issues detected</div>
            : reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: score < 50 ? '#C2362A' : 'var(--status-amber)', marginTop: 1, flexShrink: 0 }}>↓</span>
                {r}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function RowHealthAccent({ score, hovered }) {
  const healthColor = score >= 75 ? null : score >= 50 ? 'var(--status-amber)' : '#C2362A';
  const color = healthColor || (hovered ? 'var(--border-strong)' : 'transparent');
  return (
    <div style={{
      position: 'absolute', left: 0, top: 4, bottom: 4,
      width: 3, borderRadius: 999,
      background: color,
      transition: 'background 0.1s',
    }}/>
  );
}

function aiDot(tone) {
  return { green: '#3DA866', amber: 'var(--status-amber)', red: '#C2362A', ai: 'var(--ai-primary)', neutral: 'var(--text-tertiary)' }[tone] || 'var(--text-tertiary)';
}

function statusToneFor(s) {
  return { Application: 'neutral', Processing: 'amber', Underwriting: 'blue', Approval: 'green', Closing: 'green', Funded: 'green' }[s] || 'neutral';
}
function aiToneFor(s) {
  return { 'On Track': 'green', 'Needs Review': 'amber', 'Running': 'ai', 'Scanning': 'ai', 'Blocked': 'red' }[s] || 'neutral';
}
const AI_STATUS_DESCRIPTIONS = {
  'On Track':    'All automated checks passed. No action needed.',
  'Needs Review':'AI flagged an issue that needs your attention.',
  'Running':     'Running calculations — conditions checklist in progress.',
  'Scanning':    'Reviewing uploaded documents for completeness.',
  'Blocked':     'Missing information is preventing AI from proceeding.',
};

function AIStatusCell({ loan }) {
  const [hover, setHover] = React.useState(false);
  const desc = AI_STATUS_DESCRIPTIONS[loan.aiStatus];
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: aiDot(loan.aiTone), flexShrink: 0 }}/>
      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{loan.aiStatus}</span>
      {hover && desc && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 8, padding: '8px 11px', width: 220,
          boxShadow: 'var(--shadow-lg)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 3 }}>{loan.aiStatus}</span>
          {desc}
        </div>
      )}
    </div>
  );
}

function initialsFor(name) {
  return name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
}

// LO default: borrower-first, closing urgency, risk signals — no noise columns
const DEFAULT_COLUMN_ORDER = ['borrower','property','amount','product','status','milestone','days','assignee','aiStatus'];
const PROCESSOR_COLUMN_ORDER = ['borrower','status','conditions','lock','closingDate','milestone','nextAction','disclosures','aus','days','health'];
const ALL_COLUMN_IDS = COLUMN_DEFS.map(c => c.id);

// Processor next-action text per loan
const NEXT_ACTIONS = {
  'LN-2024-0211': { text: 'Send CD today — TRID deadline', tone: 'red' },
  'LN-2024-0245': { text: 'Extend lock by 3 PM today', tone: 'red' },
  'LN-2024-0289': { text: 'Clear C-011 gift letter', tone: 'amber' },
  'LN-2024-0234': { text: 'Validate Anderson upload → C-002/C-007', tone: 'amber' },
  'LN-2024-0189': { text: 'Review appraisal gap — flag to LO', tone: 'red' },
  'LN-2024-0301': { text: 'Chase updated paystub — 5d no response', tone: 'amber' },
  'LN-2024-0312': { text: 'Follow up title order — 9d overdue', tone: 'neutral' },
  'LN-2024-0267': { text: 'Send initial doc checklist', tone: 'neutral' },
};

const WATCHING_IDS = new Set(['LN-2024-0211', 'LN-2024-0245', 'LN-2024-0289']);

const SAVED_VIEWS = [
  { id: 'all',     label: 'All Loans' },
  { id: 'mine',    label: 'My Queue' },
  { id: 'urgent',  label: 'Need Attention' },
  { id: 'stuck',   label: 'Stuck' },
  { id: 'watching',label: 'Watching' },
];

function applyViewFilter(rows, viewId) {
  switch (viewId) {
    case 'mine':
      return rows.filter(l => l.assignee === CURRENT_USER);
    case 'urgent':
      return rows.filter(l => {
        const { score } = computeHealth(l);
        return score < 65 || l.lockStatus === 'Expiring' || l.flag || l.conditionsOpen > 4;
      });
    case 'stuck':
      return rows.filter(l => {
        const avg = STAGE_AVG_DAYS[l.status] || 7;
        return l.days > avg;
      });
    case 'watching':
      return rows.filter(l => WATCHING_IDS.has(l.id));
    default:
      return rows;
  }
}

const FILTER_FIELDS = [
  { id: 'status', label: 'Status', type: 'select', options: ['Application','Processing','Underwriting','Approval','Closing','Funded'] },
  { id: 'assignee', label: 'Assignee', type: 'select', options: ['Alex Martinez','Jamie Lee','Priya Shah'] },
  { id: 'product', label: 'Product', type: 'select', options: ['Conv 30yr','FHA 30yr','Jumbo 30yr','VA 30yr'] },
  { id: 'amount', label: 'Amount', type: 'number-range' },
  { id: 'days', label: 'Days in Stage', type: 'number-range' },
  { id: 'aiStatus', label: 'AI Status', type: 'select', options: ['On Track','Needs Review','Running','Scanning'] },
];

const CURRENT_USER = 'Jordan Schonegg'; // processor user
const CURRENT_USER_LO = 'Alex Martinez';  // LO fallback for My Loans filter
const TEAM_ASSIGNEES = ['Alex Martinez', 'Jamie Lee', 'Priya Shah'];

const SCOPE_OPTIONS = [
  { id: 'my', label: 'My Loans' },
  { id: 'team', label: 'Team' },
  { id: 'all', label: 'All' },
];

export function PipelineView({ onOpenLoan, persona = 'LO', intent }) {
  const isProcessor = persona === 'Processor';
  const initialCols = isProcessor ? PROCESSOR_COLUMN_ORDER : DEFAULT_COLUMN_ORDER;

  const [loans, setLoans] = React.useState(INITIAL_PIPELINE_LOANS);
  const [viewMode, setViewMode] = React.useState('pipeline'); // 'pipeline' | 'tasks' | 'hybrid'
  const [scope, setScope] = React.useState('my');
  const [view, setView] = React.useState(() => (intent && intent.view) || 'all');
  const [query, setQuery] = React.useState('');
  const [columnOrder, setColumnOrder] = React.useState(initialCols);
  const [columnsVisible, setColumnsVisible] = React.useState(new Set(initialCols));
  const [sort, setSort] = React.useState({ col: null, dir: 'asc' });
  const [filters, setFilters] = React.useState(() => (intent && intent.filters) || []);
  const intentLabel = intent && intent.label;
  const [colsMenuOpen, setColsMenuOpen] = React.useState(false);
  const [filterBuilderOpen, setFilterBuilderOpen] = React.useState(false);
  const [groupBy, setGroupBy] = React.useState(null);
  const [editingCell, setEditingCell] = React.useState(null);
  const [rowMenu, setRowMenu] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());
  const [viewsMenuOpen, setViewsMenuOpen] = React.useState(false);
  const [savingView, setSavingView] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState('');
  const [customViews, setCustomViews] = React.useState([]);
  const viewsMenuRef = React.useRef(null);

  const dragColRef = React.useRef(null);
  const [dragOverCol, setDragOverCol] = React.useState(null);

  React.useEffect(() => {
    if (!viewsMenuOpen) return;
    const handler = (e) => { if (viewsMenuRef.current && !viewsMenuRef.current.contains(e.target)) setViewsMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [viewsMenuOpen]);

  const updateCell = (rowId, colId, value) => {
    setLoans(prev => prev.map(l => {
      if (l.id !== rowId) return l;
      const next = { ...l, [colId]: value };
      if (colId === 'status') next.statusTone = statusToneFor(value);
      if (colId === 'assignee') next.assigneeInitials = initialsFor(value);
      if (colId === 'borrower') next.initials = initialsFor(value);
      if (colId === 'aiStatus') next.aiTone = aiToneFor(value);
      return next;
    }));
  };

  const addLoan = () => {
    const newId = 'LN-2024-' + String(400 + loans.length).padStart(4, '0');
    setLoans([{
      id: newId, borrower: 'New Borrower', initials: 'NB', avatarColor: '#5F6368',
      property: 'New property address', amount: 350000, status: 'Application', statusTone: 'neutral',
      milestone: 'Initial intake', days: 0, dti: 0, ltv: 0, rate: 6.875, product: 'Conv 30yr',
      assignee: 'Alex Martinez', assigneeInitials: 'AM', aiStatus: 'Scanning', aiTone: 'ai',
      closingDate: '2026-08-01',
    }, ...loans]);
    setEditingCell({ rowId: newId, colId: 'borrower' });
  };

  const duplicateLoan = (id) => {
    const src = loans.find(l => l.id === id);
    if (!src) return;
    const newId = 'LN-2024-' + String(400 + loans.length).padStart(4, '0');
    setLoans(prev => {
      const idx = prev.findIndex(l => l.id === id);
      const copy = { ...src, id: newId, flag: null };
      const next = prev.slice();
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setRowMenu(null);
  };

  const deleteLoan = (id) => { setLoans(prev => prev.filter(l => l.id !== id)); setRowMenu(null); };
  const deleteSelected = () => { setLoans(prev => prev.filter(l => !selected.has(l.id))); setSelected(new Set()); };

  // Scope-filtered base (used for view counts too)
  const scopedLoans = React.useMemo(() => {
    // Processor manages all loans in the pipeline — "My Loans" = all assigned files
    if (scope === 'my') return isProcessor ? loans.slice() : loans.filter(l => l.assignee === CURRENT_USER_LO);
    if (scope === 'team') return loans.filter(l => TEAM_ASSIGNEES.includes(l.assignee));
    return loans.slice();
  }, [loans, scope, isProcessor]);

  const visibleLoans = React.useMemo(() => {
    let rows = applyViewFilter(scopedLoans, view);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(l => l.borrower.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.property.toLowerCase().includes(q));
    }
    for (const f of filters) {
      if (f.value === '' || f.value === null || f.value === undefined) continue;
      if (f.field === 'status')   rows = rows.filter(l => l.status === f.value);
      if (f.field === 'assignee') rows = rows.filter(l => l.assignee === f.value);
      if (f.field === 'product')  rows = rows.filter(l => l.product === f.value);
      if (f.field === 'aiStatus') rows = rows.filter(l => l.aiStatus === f.value);
      if (f.field === 'amount' || f.field === 'days') {
        const val = parseFloat(f.value);
        if (!isNaN(val)) {
          if (f.op === '>' || f.op === 'greater than') rows = rows.filter(l => l[f.field] > val);
          else if (f.op === '<' || f.op === 'less than') rows = rows.filter(l => l[f.field] < val);
          else rows = rows.filter(l => l[f.field] === val);
        }
      }
    }
    if (sort.col) {
      const dir = sort.dir === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        const av = a[sort.col], bv = b[sort.col];
        if (typeof av === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }
    return rows;
  }, [scopedLoans, view, query, filters, sort]);

  const activeColumns = columnOrder.filter(id => columnsVisible.has(id)).map(id => COLUMN_DEFS.find(c => c.id === id)).filter(Boolean);

  const handleHeaderDragStart = (colId) => { dragColRef.current = colId; };
  const handleHeaderDragOver = (e, colId) => { e.preventDefault(); if (dragOverCol !== colId) setDragOverCol(colId); };
  const handleHeaderDrop = (targetId) => {
    const src = dragColRef.current;
    if (!src || src === targetId) { setDragOverCol(null); return; }
    const newOrder = columnOrder.filter(c => c !== src);
    const idx = newOrder.indexOf(targetId);
    newOrder.splice(idx, 0, src);
    setColumnOrder(newOrder);
    setDragOverCol(null);
    dragColRef.current = null;
  };

  const toggleColumn = (id) => {
    const next = new Set(columnsVisible);
    next.has(id) ? next.delete(id) : next.add(id);
    setColumnsVisible(next);
  };

  const resetCustomizations = () => {
    const base = isProcessor ? PROCESSOR_COLUMN_ORDER : DEFAULT_COLUMN_ORDER;
    setColumnOrder(base);
    setColumnsVisible(new Set(base));
    setSort({ col: null, dir: 'asc' });
    setFilters([]);
    setGroupBy(null);
  };

  const handleSort = (colId) => {
    setSort(prev => prev.col === colId ? { col: colId, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col: colId, dir: 'asc' });
  };

  const rowHeight = 40;
  const cellPad = '8px 14px';

  return (
    <div style={{ padding: '16px 32px 60px', maxWidth: 1440, margin: '0 auto' }}>

      {/* ── Header row: title + view-mode toggle + primary actions ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {viewMode === 'tasks' ? 'Tasks' : 'Pipeline'}
          </h1>
          {viewMode === 'tasks' && (
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>Your action queue, prioritized for the day</span>
          )}
        </div>

        {/* Subtle view-mode toggle */}
        <div role="tablist" aria-label="Pipeline view mode" style={{
          display: 'inline-flex', background: 'var(--bg-muted)',
          borderRadius: 7, padding: 2, gap: 1, marginTop: 4,
        }}>
          {[
            { id: 'pipeline', label: 'Pipeline' },
            { id: 'tasks',    label: 'Tasks' },
            { id: 'hybrid',   label: 'Hybrid' },
          ].map(m => {
            const active = viewMode === m.id;
            return (
              <button key={m.id} role="tab" aria-selected={active}
                onClick={() => setViewMode(m.id)}
                style={{
                  padding: '4px 11px', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 12,
                  fontWeight: active ? 600 : 500, borderRadius: 5,
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.12s',
                }}>
                {m.label}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }}/>
        {viewMode === 'tasks' ? (
          <>
            <button className="btn btn-ghost" style={{ height: 34, color: 'var(--text-secondary)', fontSize: 12.5, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}><Icon name="filter" size={13}/>Filters</button>
            <button className="btn btn-primary" style={{ height: 36 }}><Icon name="plus" size={13} strokeWidth={2.2}/>New task</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" style={{ height: 34, color: 'var(--text-secondary)', fontSize: 12.5, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}><Icon name="download" size={13}/>Export</button>
            <button className="btn btn-primary" onClick={addLoan} style={{ height: 36 }}><Icon name="plus" size={13} strokeWidth={2.2}/>New Loan</button>
          </>
        )}
      </div>

      {viewMode === 'tasks' ? (
        <TasksView onOpenLoan={onOpenLoan}/>
      ) : (
      <>
      {/* ── KPI summary cards ── */}
      <KpiRow loans={scopedLoans}/>

      {/* ── AI insights banner ── */}
      {!isProcessor && <AIInsightsBanner loans={scopedLoans} onOpenLoan={onOpenLoan}/>}

      <div style={viewMode === 'hybrid'
        ? { display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(280px, 1fr)', gap: 16, alignItems: 'flex-start' }
        : undefined}>
      <div style={{ minWidth: 0 }}>

      {/* ── View tabs (primary) + utility controls (secondary) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--border-subtle)', marginTop: 10, marginBottom: 12 }}>
        {SAVED_VIEWS.map(v => {
          const active = view === v.id;
          const count = applyViewFilter(scopedLoans, v.id).length;
          const isAlert = (v.id === 'urgent' || v.id === 'stuck') && count > 0;
          return (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px',
              border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.12s',
            }}>
              {v.label}
              {count > 0 && (
                <span style={{
                  background: active ? 'var(--text-primary)' : isAlert ? 'var(--status-red-bg)' : 'var(--bg-muted)',
                  color: active ? '#fff' : isAlert ? 'var(--status-red)' : 'var(--text-tertiary)',
                  fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 999,
                }}>{count}</span>
              )}
            </button>
          );
        })}
        {/* Custom views pinned as tabs */}
        {customViews.map(cv => {
          const active = view === cv.id;
          return (
            <button key={cv.id} onClick={() => setView(cv.id)} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px 8px 13px',
              border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {cv.label}
              <span onClick={e => { e.stopPropagation(); setCustomViews(prev => prev.filter(v => v.id !== cv.id)); if (view === cv.id) setView('all'); }}
                style={{ color: 'var(--text-tertiary)', lineHeight: 1, fontSize: 12, cursor: 'pointer', padding: '0 2px', borderRadius: 3 }}
                title="Remove view">×</span>
            </button>
          );
        })}

        {/* … views overflow menu */}
        <div ref={viewsMenuRef} style={{ position: 'relative', marginLeft: 2 }}>
          <button onClick={() => { setViewsMenuOpen(o => !o); setSavingView(false); setNewViewName(''); }}
            style={{ padding: '7px 9px', border: 'none', background: viewsMenuOpen ? 'var(--bg-muted)' : 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', fontSize: 16, lineHeight: 1, marginBottom: -1 }}
            title="Manage views" aria-label="Manage views" aria-expanded={viewsMenuOpen} aria-haspopup="menu">
            ···
          </button>
          {viewsMenuOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 120, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', minWidth: 220, padding: 8 }}
              onMouseDown={e => e.stopPropagation()}>
              {!savingView ? (
                <>
                  <div style={{ padding: '6px 10px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Views</div>
                  <button onClick={() => setSavingView(true)}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)', borderRadius: 6 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Icon name="plus" size={13} strokeWidth={2} color="var(--text-secondary)"/>
                    Save current view…
                  </button>
                  {customViews.length > 0 && (
                    <>
                      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 0' }}/>
                      <div style={{ padding: '4px 10px 2px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saved</div>
                      {customViews.map(cv => (
                        <div key={cv.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 6, gap: 6 }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => { setView(cv.id); setViewsMenuOpen(false); }}>{cv.label}</span>
                          <button onClick={() => { setCustomViews(prev => prev.filter(v => v.id !== cv.id)); if (view === cv.id) setView('all'); }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2, borderRadius: 4, display: 'flex' }}
                            title="Remove view"><Icon name="x" size={11}/></button>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div style={{ padding: '6px 8px 8px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Name this view</div>
                  <input autoFocus value={newViewName} onChange={e => setNewViewName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newViewName.trim()) {
                        const id = 'custom-' + Date.now();
                        setCustomViews(prev => [...prev, { id, label: newViewName.trim() }]);
                        setView(id);
                        setViewsMenuOpen(false); setSavingView(false); setNewViewName('');
                      }
                      if (e.key === 'Escape') { setSavingView(false); setNewViewName(''); }
                    }}
                    placeholder="e.g. My Underwriting Queue"
                    style={{ width: '100%', padding: '6px 9px', fontSize: 12.5, border: '1px solid var(--border-default)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', marginBottom: 8 }}
                  />
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => { setSavingView(false); setNewViewName(''); }}
                      className="btn btn-ghost" style={{ height: 28, fontSize: 12 }}>Cancel</button>
                    <button disabled={!newViewName.trim()}
                      onClick={() => {
                        const id = 'custom-' + Date.now();
                        setCustomViews(prev => [...prev, { id, label: newViewName.trim() }]);
                        setView(id); setViewsMenuOpen(false); setSavingView(false); setNewViewName('');
                      }}
                      className="btn btn-primary" style={{ height: 28, fontSize: 12 }}>Save</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}/>

        {/* Utility controls — ghost/muted, visually secondary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 6 }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, height: 28, padding: '0 9px',
            background: 'var(--bg-muted)', border: '1px solid transparent', borderRadius: 6,
            width: 180, transition: 'border-color 0.15s',
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <Icon name="search" size={12} color="var(--text-tertiary)"/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search loans…"
              aria-label="Search loans"
              style={{ flex: 1, height: '100%', border: 'none', outline: 'none', fontSize: 12, background: 'transparent', fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0 }}><Icon name="x" size={11}/></button>}
          </div>

          <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 2px' }}/>

          {/* Filter */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost" style={{ height: 28, fontSize: 12, gap: 5, color: filters.length > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)' }} onClick={() => setFilterBuilderOpen(v => !v)}>
              <Icon name="filter" size={12}/>Filter
              {filters.length > 0 && <span style={{ background: 'var(--text-primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '0 5px', borderRadius: 999, lineHeight: '16px' }}>{filters.length}</span>}
            </button>
            {filterBuilderOpen && <FilterBuilder filters={filters} onChange={setFilters} onClose={() => setFilterBuilderOpen(false)}/>}
          </div>

          {/* Columns */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost" style={{ height: 28, fontSize: 12, gap: 5, color: 'var(--text-tertiary)' }} onClick={() => setColsMenuOpen(v => !v)}>
              <Icon name="listCheck" size={12}/>Columns
            </button>
            {colsMenuOpen && <ColumnsMenu columnOrder={columnOrder} columnsVisible={columnsVisible} setColumnOrder={setColumnOrder} onToggle={toggleColumn} onClose={() => setColsMenuOpen(false)}/>}
          </div>

          {/* Group */}
          <select value={groupBy || ''} onChange={e => setGroupBy(e.target.value || null)}
            style={{ height: 28, padding: '0 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: groupBy ? 'var(--text-primary)' : 'var(--text-tertiary)', outline: 'none', borderRadius: 6 }}
            onFocus={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onBlur={e => e.currentTarget.style.background = 'transparent'}
          >
            <option value="">No grouping</option>
            <option value="status">Status</option>
            <option value="assignee">Assignee</option>
            <option value="product">Product</option>
          </select>

          {(filters.length > 0 || sort.col || groupBy) && (
            <button className="btn btn-ghost" style={{ height: 28, fontSize: 12, color: 'var(--text-tertiary)' }} onClick={resetCustomizations}>
              <Icon name="x" size={11}/>Reset
            </button>
          )}
        </div>
      </div>

      {selected.size > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '8px 14px', borderRadius: 9, background: 'var(--text-primary)', color: '#fff' }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{selected.size} selected</span>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}><Icon name="mail" size={12}/> Email</button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}><Icon name="sparkle" size={12}/> Bulk update</button>
          <button onClick={deleteSelected} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}><Icon name="x" size={12}/> Delete</button>
          <div style={{ flex: 1 }}/>
          <button onClick={() => setSelected(new Set())} className="btn btn-sm btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }}>Clear</button>
        </div>
      ) : filters.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {filters.map((f, i) => {
            const def = FILTER_FIELDS.find(x => x.id === f.field);
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 5px 5px 10px', height: 28, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 999, fontSize: 12.5, color: 'var(--ai-ink)', fontWeight: 500 }}>
                <span style={{ color: 'var(--ai-ink)', opacity: 0.7 }}>{def?.label}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{f.op}</span>
                <strong style={{ fontWeight: 600 }}>{f.value}</strong>
                <button onClick={() => setFilters(filters.filter((_, idx) => idx !== i))} style={{ width: 18, height: 18, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ai-ink)', opacity: 0.7 }}><Icon name="x" size={11} strokeWidth={2.5}/></button>
              </span>
            );
          })}
          <button onClick={() => setFilters([])} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--text-tertiary)', padding: '0 6px' }}>Clear all</button>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)' }}>
                <th style={{ width: 36, padding: '0 0 0 12px' }}>
                  <input type="checkbox"
                    aria-label="Select all loans"
                    checked={selected.size > 0 && selected.size === visibleLoans.length}
                    onChange={e => setSelected(e.target.checked ? new Set(visibleLoans.map(l => l.id)) : new Set())}
                    style={{ accentColor: '#0E1014' }}
                  />
                </th>
                {activeColumns.map(col => {
                  const isDraggedOver = dragOverCol === col.id;
                  const sortIcon = sort.col === col.id ? (sort.dir === 'asc' ? 'chevronUp' : 'chevronDown') : null;
                  return (
                    <th key={col.id} draggable
                      onDragStart={() => handleHeaderDragStart(col.id)}
                      onDragOver={(e) => handleHeaderDragOver(e, col.id)}
                      onDragLeave={() => setDragOverCol(null)}
                      onDrop={() => handleHeaderDrop(col.id)}
                      onClick={() => handleSort(col.id)}
                      style={{
                        textAlign: col.align || 'left', fontSize: 11.5, fontWeight: 600,
                        color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                        borderLeft: isDraggedOver ? '2px solid var(--ai-primary)' : '2px solid transparent',
                        cursor: 'grab', whiteSpace: 'nowrap', userSelect: 'none', width: col.width,
                      }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                        <span style={{ color: 'var(--text-tertiary)', opacity: 0.5, display: 'inline-flex' }}><Icon name="moreV" size={11}/></span>
                        {col.label}
                        {sortIcon && <Icon name={sortIcon} size={12} strokeWidth={2.2}/>}
                      </span>
                    </th>
                  );
                })}
                <th style={{ width: 40 }}/>
              </tr>
            </thead>
            <tbody>
              {visibleLoans.length === 0 ? (
                <tr><td colSpan={activeColumns.length + 2} style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13.5 }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Icon name="search" size={22} color="var(--text-tertiary)"/>
                    No loans match your filters
                  </div>
                </td></tr>
              ) : renderRows(visibleLoans, groupBy, activeColumns, onOpenLoan, cellPad, rowHeight, {
                editingCell, setEditingCell, updateCell,
                rowMenu, setRowMenu, duplicateLoan, deleteLoan,
                selected, setSelected,
              })}
            </tbody>
          </table>
        </div>
      </div>

      </div>{/* end pipeline column */}
      {viewMode === 'hybrid' && <TasksSidebar onOpenLoan={onOpenLoan}/>}
      </div>{/* end hybrid grid */}
      </>
      )}
    </div>
  );
}

function renderRows(loans, groupBy, columns, onOpenLoan, cellPad, rowHeight, rowProps) {
  if (!groupBy) return loans.map(loan => <LoanRow key={loan.id} loan={loan} columns={columns} onOpen={onOpenLoan} cellPad={cellPad} rowHeight={rowHeight} {...rowProps}/>);
  const groups = {};
  loans.forEach(l => { const k = l[groupBy] || 'Other'; groups[k] = groups[k] || []; groups[k].push(l); });
  return Object.entries(groups).map(([gk, gloans]) => (
    <React.Fragment key={gk}>
      <tr style={{ background: '#FBFBFA' }}>
        <td colSpan={columns.length + 2} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
          {gk} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>· {gloans.length}</span>
        </td>
      </tr>
      {gloans.map(loan => <LoanRow key={loan.id} loan={loan} columns={columns} onOpen={onOpenLoan} cellPad={cellPad} rowHeight={rowHeight} {...rowProps}/>)}
    </React.Fragment>
  ));
}

function LoanRow({ loan, columns, onOpen, cellPad, rowHeight, editingCell, setEditingCell, updateCell, rowMenu, setRowMenu, duplicateLoan, deleteLoan, selected, setSelected }) {
  const isSelected = selected.has(loan.id);
  const isMenuOpen = rowMenu === loan.id;
  const [hovered, setHovered] = React.useState(false);
  const toggleSelect = () => { const next = new Set(selected); next.has(loan.id) ? next.delete(loan.id) : next.add(loan.id); setSelected(next); };

  const { score } = computeHealth(loan);

  const rowBg = isSelected ? '#F4F1FE' : hovered ? 'var(--bg-muted)' : 'transparent';

  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)', height: rowHeight, background: rowBg, transition: 'background 0.1s', position: 'relative', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(loan.id)}
    >
      <td style={{ padding: '0 0 0 16px', position: 'relative', width: 16 }} onClick={e => e.stopPropagation()}>
        <RowHealthAccent score={score} hovered={hovered}/>
        <input type="checkbox" checked={isSelected} onChange={toggleSelect} aria-label={`Select loan ${loan.id} — ${loan.borrower}`} style={{ accentColor: '#0E1014' }}/>
      </td>
      {columns.map(col => {
        const isEditing = editingCell && editingCell.rowId === loan.id && editingCell.colId === col.id;
        const editable = col.editType && !col.locked;
        return (
          <td key={col.id} style={{ padding: isEditing ? 0 : cellPad, verticalAlign: 'middle', textAlign: col.align || 'left', position: 'relative', cursor: editable ? 'text' : 'default', outline: isEditing ? '2px solid var(--ai-primary)' : 'none', outlineOffset: -2 }}
            onClick={e => {
              if (e.target.closest('input,select,button')) { e.stopPropagation(); return; }
              if (editable) { e.stopPropagation(); setEditingCell({ rowId: loan.id, colId: col.id }); }
            }}>
            {isEditing ? (
              <CellEditor col={col} value={loan[col.id]} onCommit={(v) => { updateCell(loan.id, col.id, v); setEditingCell(null); }} onCancel={() => setEditingCell(null)} cellPad={cellPad}/>
            ) : col.render(loan)}
          </td>
        );
      })}
      <td style={{ padding: '0 8px 0 0', textAlign: 'right', position: 'relative', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, opacity: hovered ? 1 : 0, transition: 'opacity 0.12s' }}>
          <button title="Message borrower" onClick={e => { e.stopPropagation(); onOpen(loan.id, 'comms'); }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          ><Icon name="send" size={12}/></button>
          <button title="View conditions" onClick={e => { e.stopPropagation(); onOpen(loan.id, 'underwriting'); }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          ><Icon name="listCheck" size={12}/></button>
          <button onClick={() => setRowMenu(isMenuOpen ? null : loan.id)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: isMenuOpen ? 'var(--bg-muted)' : 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="moreH" size={15}/></button>
        </div>
        {isMenuOpen && <RowMenu onOpen={() => { onOpen(loan.id); setRowMenu(null); }} onDuplicate={() => duplicateLoan(loan.id)} onDelete={() => deleteLoan(loan.id)} onClose={() => setRowMenu(null)}/>}
      </td>
    </tr>
  );
}

function CellEditor({ col, value, onCommit, onCancel, cellPad }) {
  const [v, setV] = React.useState(value);
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (inputRef.current) { inputRef.current.focus(); if (inputRef.current.select) inputRef.current.select(); } }, []);
  const commit = () => { let out = v; if (col.editType === 'number') out = parseFloat(v) || 0; onCommit(out); };
  const commonStyle = { width: '100%', height: '100%', minHeight: 32, padding: cellPad, border: 'none', outline: 'none', background: 'var(--bg-surface)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', textAlign: col.align || 'left' };
  if (col.editType === 'select') return <select ref={inputRef} value={v} onChange={e => { setV(e.target.value); onCommit(e.target.value); }} onBlur={onCancel} onKeyDown={e => { if (e.key === 'Escape') onCancel(); }} style={commonStyle}>{col.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>;
  return <input ref={inputRef} type={col.editType === 'number' ? 'number' : col.editType === 'date' ? 'date' : 'text'} step={col.step || 1} value={v} onChange={e => setV(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') onCancel(); }} style={commonStyle}/>;
}

function RowMenu({ onOpen, onDuplicate, onDelete, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (!e.target.closest('.row-menu')) onClose(); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, []);
  return (
    <div className="row-menu" style={{ position: 'absolute', top: '100%', right: 12, width: 180, zIndex: 80, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: 5, boxShadow: 'var(--shadow-lg)', textAlign: 'left' }}>
      <MenuItem icon="arrowRight" label="Open loan" onClick={onOpen}/>
      <MenuItem icon="doc" label="Duplicate" onClick={onDuplicate}/>
      <MenuItem icon="mail" label="Email borrower" onClick={onClose}/>
      <MenuItem icon="download" label="Export row" onClick={onClose}/>
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }}/>
      <MenuItem icon="x" label="Delete" onClick={onDelete} danger/>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 6, fontFamily: 'inherit', fontSize: 13, color: danger ? 'var(--status-red)' : 'var(--text-primary)', textAlign: 'left' }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'var(--card-red-bg)' : 'var(--bg-muted)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <Icon name={icon} size={13}/>{label}
    </button>
  );
}

function ColumnsMenu({ columnOrder, columnsVisible, setColumnOrder, onToggle, onClose }) {
  const dragRef = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(null);
  const onDrop = (target) => {
    const src = dragRef.current;
    if (!src || src === target) { setDragOver(null); return; }
    const next = columnOrder.filter(c => c !== src);
    next.splice(next.indexOf(target), 0, src);
    setColumnOrder(next);
    setDragOver(null);
    dragRef.current = null;
  };
  React.useEffect(() => {
    const handler = (e) => { if (!e.target.closest('.cols-menu') && !e.target.closest('button')) onClose(); };
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, []);
  return (
    <div className="cols-menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 260, zIndex: 100, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 6 }}>
      <div style={{ padding: '8px 10px 6px', fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Columns</span><span style={{ textTransform: 'none', fontSize: 11, fontWeight: 500 }}>Drag to reorder</span>
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {columnOrder.map(colId => {
          const def = COLUMN_DEFS.find(c => c.id === colId);
          if (!def) return null;
          const visible = columnsVisible.has(colId);
          const isOver = dragOver === colId;
          return (
            <div key={colId} draggable onDragStart={() => { dragRef.current = colId; }} onDragOver={(e) => { e.preventDefault(); if (dragOver !== colId) setDragOver(colId); }} onDragLeave={() => setDragOver(null)} onDrop={() => onDrop(colId)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 7, cursor: 'grab', background: isOver ? 'var(--bg-muted)' : 'transparent', borderTop: isOver ? '2px solid var(--ai-primary)' : '2px solid transparent' }}
              onMouseEnter={e => { if (!isOver) e.currentTarget.style.background = '#FBFBFA'; }}
              onMouseLeave={e => { if (!isOver) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon name="moreV" size={13} color="var(--text-tertiary)"/>
              <input type="checkbox" checked={visible} onChange={() => onToggle(colId)} onClick={e => e.stopPropagation()} style={{ accentColor: '#0E1014' }}/>
              <span style={{ fontSize: 13, flex: 1 }}>{def.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterBuilder({ filters, onChange, onClose }) {
  React.useEffect(() => {
    const handler = (e) => { if (!e.target.closest('.filter-builder') && !e.target.closest('button')) onClose(); };
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, []);
  const addFilter = () => onChange([...filters, { field: 'status', op: 'is', value: '' }]);
  const updateFilter = (i, patch) => { const next = filters.slice(); next[i] = { ...next[i], ...patch }; onChange(next); };
  const removeFilter = (i) => onChange(filters.filter((_, idx) => idx !== i));
  return (
    <div className="filter-builder" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 460, zIndex: 100, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Filters</div>
      {filters.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '20px 0', textAlign: 'center' }}>No filters applied. Add one to narrow the list.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filters.map((f, i) => {
          const def = FILTER_FIELDS.find(x => x.id === f.field);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', width: 30, textAlign: 'right' }}>{i === 0 ? 'Where' : 'And'}</span>
              <select value={f.field} onChange={e => updateFilter(i, { field: e.target.value, value: '' })} className="input" style={{ width: 130, height: 32, fontSize: 12.5 }}>
                {FILTER_FIELDS.map(ff => <option key={ff.id} value={ff.id}>{ff.label}</option>)}
              </select>
              <select value={f.op} onChange={e => updateFilter(i, { op: e.target.value })} className="input" style={{ width: 90, height: 32, fontSize: 12.5 }}>
                {def?.type === 'number-range' ? (<><option value=">">{'>'}</option><option value="<">{'<'}</option><option value="=">{'='}</option></>) : (<><option value="is">is</option><option value="is not">is not</option></>)}
              </select>
              {def?.type === 'select' ? (
                <select value={f.value} onChange={e => updateFilter(i, { value: e.target.value })} className="input" style={{ flex: 1, height: 32, fontSize: 12.5 }}>
                  <option value="">Select...</option>
                  {def.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="number" value={f.value} onChange={e => updateFilter(i, { value: e.target.value })} className="input" style={{ flex: 1, height: 32, fontSize: 12.5 }} placeholder="Value..."/>
              )}
              <button onClick={() => removeFilter(i)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}><Icon name="x" size={13}/></button>
            </div>
          );
        })}
      </div>
      <button onClick={addFilter} style={{ marginTop: 10, background: 'transparent', border: '1px dashed var(--border-default)', color: 'var(--text-secondary)', borderRadius: 7, height: 32, width: '100%', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12.5, fontWeight: 500 }}>
        <Icon name="plus" size={13} strokeWidth={2.2}/>Add filter
      </button>
    </div>
  );
}

export default PipelineView;
