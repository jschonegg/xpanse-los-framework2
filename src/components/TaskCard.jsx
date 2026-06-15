import React from 'react';
import { Icon } from './Icon';
import { StatusPill } from './Shell';

// ─── Shared Tasks-tab card kit ───────────────────────────────────────────────
// One source of truth for the cards rendered in the loan "Tasks" (Now) tab,
// across every status. The styling and hierarchy are lifted from the Approval
// view's cards — a tinted gradient header band (icon chip · title · subtitle ·
// right-aligned pill) over a white body — but expressed entirely in design
// tokens so it themes correctly and stays consistent with the rest of the app.

// Tone → header tint + border + accent ink, all from tokens.
const TONES = {
  green:   { tint: 'var(--card-green-bg)',  border: 'var(--card-green-border)',  ink: 'var(--status-green)' },
  amber:   { tint: 'var(--card-amber-bg)',  border: 'var(--card-amber-border)',  ink: 'var(--status-amber)' },
  red:     { tint: 'var(--card-red-bg)',    border: 'var(--card-red-border)',    ink: 'var(--status-red)' },
  blue:    { tint: 'var(--status-blue-bg)', border: 'var(--status-blue-bg)',     ink: 'var(--status-blue)' },
  ai:      { tint: 'var(--ai-bg)',          border: 'var(--ai-border)',          ink: 'var(--ai-primary)' },
  neutral: { tint: 'var(--bg-muted)',       border: 'var(--border-subtle)',      ink: 'var(--text-secondary)' },
};

function toneOf(name) { return TONES[name] || TONES.neutral; }

// The core card. `header` lets callers fully control the header content; for
// the common case pass `icon`/`title`/`subtitle`/`pill` and it builds the
// standard hierarchy. `onToggle`/`open` turn the header into a collapse control.
export function TaskCard({
  tone = 'neutral', icon, iconNode, title, subtitle, eta,
  pill, pillTone, headerRight, header, footer, children,
  collapsible = false, defaultOpen = true, open: openProp, onToggle,
  elevated, dim,
}) {
  const t = toneOf(tone);
  const controlled = onToggle != null || openProp != null;
  const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
  const hasBody = children != null || footer != null;
  // Toggleable when the caller opts in (collapsible) or drives it (controlled),
  // and there is actually a body to hide.
  const toggleable = (collapsible || controlled) && hasBody;
  const open = controlled ? !!openProp : selfOpen;
  const handleToggle = controlled ? onToggle : () => setSelfOpen(o => !o);
  const showBody = hasBody && (!toggleable || open);
  const HeaderTag = toggleable ? 'button' : 'div';

  // A custom `header` only replaces the middle text block; the icon chip,
  // pill, and collapse chevron always render in the surrounding layout.
  const titleBlock = header || (
    <>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{title}</div>
      {(subtitle || eta) && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
          {eta && <Icon name="clock" size={11}/>}
          <span>{eta || subtitle}</span>
        </div>
      )}
    </>
  );

  return (
    <div style={{
      background: 'var(--bg-surface)', border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden',
      boxShadow: elevated ? 'var(--shadow-md)' : 'none', opacity: dim ? 0.5 : 1,
      transition: 'opacity 0.2s, box-shadow 0.2s',
    }}>
      <HeaderTag
        onClick={toggleable ? handleToggle : undefined}
        style={{
          width: '100%', textAlign: 'left', font: 'inherit', cursor: toggleable ? 'pointer' : 'default',
          background: `linear-gradient(90deg, ${t.tint}, var(--bg-surface))`,
          border: toggleable ? 'none' : undefined,
          borderBottom: showBody ? `1px solid ${t.border}` : 'none',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        {(icon || iconNode) && (
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'var(--bg-surface)', border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink,
          }}>
            {iconNode || <Icon name={icon} size={17} strokeWidth={1.7}/>}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{titleBlock}</div>
        {pill && <StatusPill tone={pillTone || tone}>{pill}</StatusPill>}
        {headerRight}
        {toggleable && (
          <Icon name="chevronDown" size={16} color="var(--text-tertiary)"
            style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
        )}
      </HeaderTag>

      {showBody && (
        <div style={{ padding: '14px 16px' }}>
          {children}
          {footer && (
            <div style={{
              marginTop: children != null ? 14 : 0,
              paddingTop: children != null ? 12 : 0,
              borderTop: children != null ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>{footer}</div>
          )}
        </div>
      )}
    </div>
  );
}

// Back-compat adapter for the NowTab* checklist views. Maps their existing
// call shape (a JSX `icon` node + a custom `header`) onto TaskCard. Cards are
// collapsible and start collapsed by default — callers pass `defaultOpen` to
// expand only the topmost card in a stack. `iconBg`/`iconColor` are accepted
// but ignored — TaskCard derives the chip styling from `tone`.
export function ActionCard({ tone = 'neutral', icon, iconBg, iconColor, header, footer, children, collapsible = true, defaultOpen = false, isActive, isWaiting }) {
  return (
    <TaskCard tone={tone} iconNode={icon} header={header} footer={footer}
      collapsible={collapsible} defaultOpen={defaultOpen} elevated={isActive} dim={isWaiting}>
      {children}
    </TaskCard>
  );
}

// AI insight callout — the purple note used inside cards.
export function AIInsight({ children }) {
  return (
    <div style={{ marginTop: 12, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.45 }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
      <span>{children}</span>
    </div>
  );
}

// Compact "X of Y complete" counter shown next to a Tasks-tab section title.
// Reads neutral while work remains and flips green once everything is done.
export function StepCounter({ done = 0, total = 0 }) {
  const allDone = total > 0 && done >= total;
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1.5,
      color: allDone ? 'var(--status-green)' : 'var(--text-secondary)',
      background: allDone ? 'var(--status-green-bg)' : 'var(--bg-muted)',
      borderRadius: 999, padding: '2px 10px',
    }}>
      {done} of {total} complete
    </span>
  );
}

// Circular progress indicator with a centered percentage.
export function ProgressRing({ pct = 0, size = 40, stroke = 4, color = 'var(--status-green)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--bg-muted)" strokeWidth={stroke}/>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`} transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size <= 40 ? 10 : 12, fontWeight: 800, color: 'var(--text-primary)' }}>{Math.round(pct)}%</div>
    </div>
  );
}

// Compact label/value grid for loan-terms summaries.
export function StatGrid({ items, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || items.length}, 1fr)`, gap: 12 }}>
      {items.map(s => (
        <div key={s.label}>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontWeight: 600 }}>{s.label}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export default TaskCard;
