import React from 'react';
import { Icon } from './Icon';
import { StatusPill } from './Shell';

// ── Closing-timeline card (used at the top of every Tasks-tab status view) ─
// Renders 6 milestone circles connected by a progress line, like the one
// on the Approval view. Dates derive from the loan's days-in-stage + the
// industry-average duration of each prior stage.

const PIPELINE_STAGE_ORDER = ['Application', 'Processing', 'Underwriting', 'Approval', 'Closing', 'Funded'];
const TIMELINE_LABELS = {
  Application:  'Application',
  Processing:   'Processing',
  Underwriting: 'Underwriting',
  Approval:     'Conditional Approval',
  Closing:      'Clear to Close',
  Funded:       'Closing',
};
const STAGE_AVG_DAYS = { Application: 3, Processing: 10, Underwriting: 12, Approval: 5, Closing: 7, Funded: 0 };

function formatShortDate(d) {
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return `${m} ${d.getDate()}`;
}

function buildTimelineSteps(loan) {
  // Anchor: today (2026-05-27 to stay consistent with the Pipeline view's TODAY)
  const today = new Date('2026-05-27T00:00:00');
  const currentIdx = Math.max(0, PIPELINE_STAGE_ORDER.indexOf(loan?.status));
  const daysInCurrent = loan?.days ?? 0;

  return PIPELINE_STAGE_ORDER.map((stageId, i) => {
    const label = TIMELINE_LABELS[stageId];
    let date, done, active;
    if (i < currentIdx) {
      // Past stage — back-compute the END date of this stage
      let daysAfter = daysInCurrent;
      for (let j = i + 1; j < currentIdx; j++) daysAfter += STAGE_AVG_DAYS[PIPELINE_STAGE_ORDER[j]] || 7;
      const d = new Date(today); d.setDate(d.getDate() - daysAfter);
      date = formatShortDate(d);
      done = true;
    } else if (i === currentIdx) {
      const d = new Date(today); d.setDate(d.getDate() - daysInCurrent);
      date = formatShortDate(d);
      done = true; active = true;
    } else {
      // Future stage — forward-project from today
      let daysAhead = (STAGE_AVG_DAYS[loan?.status] || 7) - daysInCurrent;
      for (let j = currentIdx + 1; j < i; j++) daysAhead += STAGE_AVG_DAYS[PIPELINE_STAGE_ORDER[j]] || 7;
      daysAhead = Math.max(daysAhead, 0);
      const d = new Date(today); d.setDate(d.getDate() + daysAhead);
      date = `~${formatShortDate(d)}`;
      done = false;
    }
    return { id: stageId, label, date, done, active };
  });
}

export function ClosingTimelineCard({ loan, targetClosing }) {
  const steps = buildTimelineSteps(loan);
  const activeIdx = steps.findIndex(s => s.active);
  // Done segment count: number of fully-completed transitions
  const doneCount = activeIdx === -1
    ? steps.filter(s => s.done).length
    : activeIdx;
  const fillPct = steps.length > 1 ? (doneCount / (steps.length - 1)) * 100 : 0;

  // Days-to-close text in the header
  const daysToClose = (() => {
    if (!targetClosing && !loan?.closingDate) return null;
    const target = new Date((targetClosing || loan?.closingDate) + 'T00:00:00');
    const today = new Date('2026-05-27T00:00:00');
    return Math.round((target - today) / 86400000);
  })();
  const closingLabel = (() => {
    const iso = targetClosing || loan?.closingDate;
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00');
    return formatShortDate(d);
  })();

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 14, padding: '14px 18px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Closing timeline</div>
        {closingLabel && (
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'DM Mono' }}>
            Target {closingLabel}
            {daysToClose != null && (
              <span> · {daysToClose < 0 ? `${Math.abs(daysToClose)}d overdue` : daysToClose === 0 ? 'today' : `${daysToClose}d away`}</span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Background track */}
        <div style={{ position: 'absolute', top: 11, left: 11, right: 11, height: 2, background: 'var(--border-subtle)', zIndex: 0 }}/>
        {/* Filled track */}
        <div style={{
          position: 'absolute', top: 11, left: 11, height: 2,
          background: 'linear-gradient(90deg, #0A1F44, #0DBFA8)',
          width: `calc(${fillPct}% - ${fillPct === 0 ? 0 : 11}px)`,
          zIndex: 1, transition: 'width 0.5s ease',
        }}/>

        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: step.done && !step.active ? '#0A1F44' : step.active ? '#2453D6' : 'var(--bg-surface)',
              border: step.active ? '2px solid #2453D6' : step.done ? 'none' : '2px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: step.active ? '0 0 0 4px rgba(36,83,214,0.12)' : 'none',
              transition: 'all 0.3s',
            }}>
              {step.done && !step.active && (
                <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              )}
              {step.active && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }}/>
              )}
            </div>
            <div style={{
              fontSize: 10.5,
              fontWeight: step.active ? 700 : step.done ? 600 : 400,
              color: step.active ? '#2453D6' : step.done ? 'var(--text-primary)' : 'var(--text-tertiary)',
              marginTop: 6, textAlign: 'center', lineHeight: 1.3,
            }}>{step.label}</div>
            <div style={{
              fontSize: 10, marginTop: 2, fontFamily: 'DM Mono',
              color: step.active ? '#2453D6' : 'var(--text-tertiary)',
            }}>{step.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RichActionCard — full-width card with a colored gradient header bar ───
// Drop-in replacement for the per-file ActionCard. The header includes an
// icon tile, title, optional pill, and optional meta text on the right.
const HEADER_TONES = {
  green:   { bg: 'linear-gradient(90deg, #E7F8F1, #F0FDF4)', border: '#A7F3D0', iconBg: '#0E9F6E', iconColor: '#fff', titleColor: '#065F46', metaColor: '#059669' },
  amber:   { bg: 'linear-gradient(90deg, #FEF6E7, #FFF8F0)', border: '#FDE9C2', iconBg: '#D97706', iconColor: '#fff', titleColor: '#92400E', metaColor: '#A16207' },
  red:     { bg: 'linear-gradient(90deg, #FEE2E2, #FEF2F2)', border: '#FECACA', iconBg: '#B91C1C', iconColor: '#fff', titleColor: '#7F1D1D', metaColor: '#991B1B' },
  blue:    { bg: 'linear-gradient(90deg, #EEF3FE, #F5F8FF)', border: '#C7D2FE', iconBg: '#2453D6', iconColor: '#fff', titleColor: '#1E3A8A', metaColor: '#3730A3' },
  ai:      { bg: 'linear-gradient(90deg, #F4F1FE, #FAF8FF)', border: '#E4DEFA', iconBg: '#7E68FA', iconColor: '#fff', titleColor: '#3F2FBF', metaColor: '#6E59E8' },
  neutral: { bg: 'var(--bg-muted)', border: 'var(--border-subtle)', iconBg: 'var(--text-secondary)', iconColor: '#fff', titleColor: 'var(--text-primary)', metaColor: 'var(--text-tertiary)' },
};

export function RichActionCard({
  tone = 'neutral',
  icon,                  // Icon name (string)
  iconColor,             // overrides default
  title,
  meta,                  // line under the title in the header band (date, owner, etc.)
  pill,
  pillTone = 'neutral',
  headerRight,           // free-form node on the right of the header (eg. StatusPill)
  isActive,              // adds the left accent + glow used on Underwriting active card
  isWaiting,             // dims the card
  footer,
  children,
}) {
  const t = HEADER_TONES[tone] || HEADER_TONES.neutral;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${t.border}`,
      borderLeft: isActive ? '3px solid var(--ai-primary)' : `1px solid ${t.border}`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: isActive ? '0 2px 12px rgba(99,102,241,0.10)' : 'none',
      opacity: isWaiting ? 0.5 : 1,
      transition: 'opacity 0.2s, box-shadow 0.2s',
    }}>
      {/* Gradient header band */}
      {title && (
        <div style={{
          background: t.bg,
          padding: '12px 16px',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {icon && (
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: t.iconBg, color: iconColor || t.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name={icon} size={15} strokeWidth={2} color={iconColor || t.iconColor}/>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: t.titleColor }}>{title}</span>
              {pill && <StatusPill tone={pillTone}>{pill}</StatusPill>}
            </div>
            {meta && (
              <div style={{ fontSize: 11.5, color: t.metaColor, marginTop: 2 }}>{meta}</div>
            )}
          </div>
          {headerRight && (
            <div style={{ marginLeft: 'auto', flexShrink: 0 }}>{headerRight}</div>
          )}
        </div>
      )}

      {/* Body */}
      {(children || footer) && (
        <div style={{ padding: '14px 16px' }}>
          {children}
          {footer && (
            <div style={{
              marginTop: children ? 14 : 0,
              paddingTop: children ? 12 : 0,
              borderTop: children ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Per-stage timeline strip ──────────────────────────────────────────────
// Drop-in replacement for the local StageProgress component each NowTab*
// defines. Same prop shape (steps + completed Set) but uses the styling
// from the LOApprovalView "Closing timeline" — bigger circles, gradient
// progress line, navy/teal palette.
export function StageTimelineStrip({ steps, completed, title, stageName }) {
  const activeIdx = steps.findIndex(s => !completed.has(s.id));
  const allDone = activeIdx === -1;
  const doneCount = allDone ? steps.length : activeIdx;
  const fillPct = steps.length > 1 ? (doneCount / (steps.length - 1)) * 100 : 0;
  const completionPct = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 14, padding: '14px 18px',
      marginBottom: 16,
    }}>
      {/* Header: stage name (or custom title) on left, % complete on right */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14, gap: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          {title || (stageName ? `${stageName} progress` : 'Progress')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700,
            color: allDone ? 'var(--status-green)' : 'var(--text-primary)',
          }}>
            {completionPct}%
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            ({doneCount} of {steps.length})
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Background track */}
        <div style={{ position: 'absolute', top: 11, left: 11, right: 11, height: 2, background: 'var(--border-subtle)', zIndex: 0 }}/>
        {/* Filled track */}
        <div style={{
          position: 'absolute', top: 11, left: 11, height: 2,
          background: 'linear-gradient(90deg, #0A1F44, #0DBFA8)',
          width: `calc(${fillPct}% - ${fillPct === 0 ? 0 : 11}px)`,
          zIndex: 1, transition: 'width 0.5s ease',
        }}/>
        {steps.map((s, i) => {
          const done = i < doneCount;
          const isActive = i === activeIdx;
          return (
            <div key={s.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', position: 'relative', zIndex: 2,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done ? '#0A1F44' : isActive ? '#2453D6' : 'var(--bg-surface)',
                border: isActive ? '2px solid #2453D6' : done ? 'none' : '2px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isActive ? '0 0 0 4px rgba(36,83,214,0.12)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done && !isActive && (
                  <Icon name="check" size={10} color="#fff" strokeWidth={2.5}/>
                )}
                {isActive && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }}/>
                )}
              </div>
              <span style={{
                fontSize: 10.5,
                fontWeight: isActive ? 700 : done ? 600 : 400,
                color: isActive ? '#2453D6' : done ? 'var(--text-primary)' : 'var(--text-tertiary)',
                marginTop: 6, textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap',
              }}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Slim purple AI-insight strip (used inside cards)
export function AIInsight({ children }) {
  return (
    <div style={{
      marginTop: 12,
      background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
      borderRadius: 9, padding: '10px 13px',
      display: 'flex', alignItems: 'flex-start', gap: 9,
      fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.45,
    }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
      <span>{children}</span>
    </div>
  );
}
