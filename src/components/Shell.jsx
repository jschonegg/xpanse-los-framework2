import React from 'react';
import { Icon } from './Icon';

export function LogoMark({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'linear-gradient(135deg, #5B7BFF 0%, #6D5BF6 50%, #8E5BF6 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', flexShrink: 0,
      boxShadow: '0 1px 2px rgba(74, 57, 201, 0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
    }}>
      <Icon name="sparkle" size={size * 0.6} strokeWidth={1.6} />
    </div>
  );
}

export function Avatar({ initials, size = 32, color = '#5246C7', textColor = '#fff' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: color, color: textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 600,
      letterSpacing: '0.02em', flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Left nav (ported from old prototype, original design by Melissa) ────────
// Slim icon-only sidebar. Sits left of everything; the existing TopNav stays
// on top for actions (persona toggle, search, feed badge, prefs).

function LeftNavItem({ icon, label, active, onClick, disabled, iconSize = 19, strokeWidth = 1.8 }) {
  return (
    <button
      data-tooltip={label}
      aria-label={label}
      onClick={disabled ? undefined : onClick}
      style={{
        width: 38, height: 38,
        borderRadius: 9,
        border: 'none',
        background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
        color: active ? '#fff' : 'rgba(225,228,245,0.62)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
        transition: 'background 0.12s, color 0.12s',
        opacity: disabled ? 0.55 : 1,
        padding: 0,
      }}
      onMouseEnter={e => { if (!disabled && !active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (!disabled && !active) { e.currentTarget.style.background = 'transparent';            e.currentTarget.style.color = 'rgba(225,228,245,0.62)'; } }}
    >
      <Icon name={icon} size={iconSize} strokeWidth={strokeWidth} />
    </button>
  );
}

export function LeftNav({ route, onNavigate, onOpenCmd, onOpenPrefs }) {
  const topItems = [
    { id: 'home',     icon: 'home',     label: 'Home',     kind: 'route' },
    { id: 'pipeline', icon: 'pipeline', label: 'Pipeline', kind: 'route' },
    { id: 'feed',     icon: 'bell',     label: 'Feed',     kind: 'route' },
    { id: 'search',   icon: 'search',   label: 'Search (⌘K)', kind: 'action' },
  ];
  const bottomItems = [
    { id: 'settings', icon: 'settings', label: 'Settings', kind: 'action' },
  ];

  const handle = (item) => {
    if (item.kind === 'route' && onNavigate) onNavigate(item.id);
    else if (item.kind === 'action' && item.id === 'search' && onOpenCmd) onOpenCmd();
    else if (item.kind === 'action' && item.id === 'settings' && onOpenPrefs) onOpenPrefs();
  };

  return (
    <aside style={{
      width: 44,
      background: 'linear-gradient(180deg, #0C0E2A 0%, #131638 60%, #1A1A45 100%)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 0 14px',
      gap: 4,
      position: 'fixed', top: 0, left: 0, bottom: 0,
      zIndex: 60,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
        <LogoMark size={22}/>
      </div>

      {/* Top items */}
      {topItems.map(item => (
        <LeftNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={item.kind === 'route' && route === item.id}
          onClick={() => handle(item)}
        />
      ))}

      <div style={{ flex: 1 }} />

      {/* Bottom items */}
      {bottomItems.map(item => (
        <LeftNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={false}
          disabled={item.kind === 'disabled'}
          onClick={() => handle(item)}
        />
      ))}

      {/* Avatar */}
      <div style={{ marginTop: 8, padding: '12px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)', width: 28, display: 'flex', justifyContent: 'center' }}>
        <Avatar initials="J" size={30} color="#3D49E6" />
      </div>
    </aside>
  );
}

export function StatusPill({ tone = 'blue', children, dot, style }) {
  const tones = {
    blue:    { bg: 'var(--status-blue-bg)',  fg: 'var(--status-blue)' },
    green:   { bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
    amber:   { bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
    red:     { bg: 'var(--status-red-bg)',   fg: 'var(--status-red)' },
    ai:      { bg: 'var(--ai-bg-strong)',    fg: 'var(--ai-ink)' },
    neutral: { bg: 'var(--bg-muted)',        fg: 'var(--text-secondary)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span className="pill" style={{ background: t.bg, color: t.fg, ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg, marginRight: 2 }}/>}
      {children}
    </span>
  );
}

export function PersonaToggle({ persona, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: 3, gap: 2,
    }}>
      {['LO', 'Processor'].map(p => {
        const active = persona === p;
        return (
          <button key={p} onClick={() => onChange(p)} style={{
            height: 26, padding: '0 10px',
            borderRadius: 6, border: 'none',
            background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: active ? '#fff' : 'rgba(255,255,255,0.4)',
            fontSize: 12, fontWeight: active ? 600 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.12s',
            letterSpacing: '-0.01em',
          }}>{p}</button>
        );
      })}
    </div>
  );
}

function UserMenu({ onOpenPrefs, onPersonaChange, persona }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Load saved name/color from prefs
  const prefs = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('los-prefs') || '{}'); } catch { return {}; }
  }, [open]); // re-read when menu opens

  const initials = ((prefs.firstName || 'A')[0] + (prefs.lastName || 'T')[0]).toUpperCase();
  const color    = prefs.avatarColor || '#4A39C9';
  const name     = prefs.firstName ? `${prefs.firstName} ${prefs.lastName}` : 'Alex Torres';
  const title    = prefs.title || 'Loan Officer';

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        aria-label={`${name} — account menu`}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          width: 34, height: 34, borderRadius: 999, background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12.5, fontWeight: 800, color: '#fff', letterSpacing: '0.02em',
          cursor: 'pointer', border: open ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
          transition: 'border-color 0.1s',
        }}>
        {initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 900,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 6, width: 220,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
        }}>
          {/* Identity row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px 10px' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{title}</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 4px 4px' }}/>

          {[
            { label: 'Preferences', icon: 'settings', action: () => { setOpen(false); onOpenPrefs?.(); } },
            { label: 'Keyboard shortcuts', icon: 'command', action: () => setOpen(false) },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              display: 'flex', alignItems: 'center', gap: 9, width: '100%',
              padding: '8px 10px', border: 'none', background: 'transparent',
              borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, color: 'var(--text-primary)', textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name={item.icon} size={14} color="var(--text-secondary)"/>
              {item.label}
            </button>
          ))}

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 4px' }}/>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '8px 10px', border: 'none', background: 'transparent',
            borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, color: '#B91C1C', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="x" size={14} color="#B91C1C"/>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function TopNav({ route, onNavigate, currentLoan, urlaLoanId, urlaBorrower, onOpenCmd, feedCount = 0, persona, onPersonaChange, onOpenPrefs }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'feed', label: 'AI Feed', badge: feedCount > 0 ? feedCount : null },
  ];
  // Loan tab only appears when actively viewing a loan or URLA
  if (route === 'urla' && urlaLoanId) {
    tabs.push({ id: 'urla', label: urlaLoanId, sub: urlaBorrower, isLoan: true });
  } else if (route === 'loan' && currentLoan) {
    tabs.push({ id: 'loan', label: currentLoan, isLoan: true });
  }

  return (
    <header style={{
      height: 52,
      background: '#16181d',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      gap: 4,
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    }}>
      {/* Nav tabs */}
      {/* Logo */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#7E68FA', letterSpacing: '-0.02em', paddingRight: 20, marginRight: 4 }}>LOS</div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {tabs.map((t, i) => {
          const active = route === t.id;
          const isFirst = i === 0;
          return (
            <React.Fragment key={t.id}>
              {!isFirst && (
                <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.18)', fontSize: 15, margin: '0 4px', userSelect: 'none' }}>|</span>
              )}
              <button onClick={() => onNavigate(t.id)} aria-current={active ? 'page' : undefined} style={{
                display: 'flex', flexDirection: t.sub ? 'column' : 'row', alignItems: t.sub ? 'flex-start' : 'center',
                gap: 0, height: 34, padding: '0 12px',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                  background: t.isLoan
                  ? active ? 'rgba(126,104,250,0.25)' : 'rgba(126,104,250,0.1)'
                  : active ? 'rgba(255,255,255,0.13)' : 'transparent',
                border: t.isLoan ? '1px solid rgba(126,104,250,0.35)' : 'none',
                fontFamily: 'inherit',
                color: t.isLoan ? '#b8a9fc' : active ? '#ffffff' : 'rgba(255,255,255,0.6)',
                fontSize: 14, fontWeight: active ? 600 : 500,
                letterSpacing: '-0.01em',
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => { if (!active && !t.isLoan) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active && !t.isLoan) e.currentTarget.style.background = 'transparent'; }}
              >
                {t.sub ? (
                  <>
                    <span style={{ fontSize: 12, fontFamily: 'DM Mono', lineHeight: 1.2 }}>{t.label}</span>
                    <span style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.2 }}>{t.sub}</span>
                  </>
                ) : t.label}
                {t.badge && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, minWidth: 18, height: 18,
                    borderRadius: 999, background: '#7E68FA', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 5px', marginLeft: 7,
                  }}>{t.badge}</span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right: search, persona toggle, avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* PersonaToggle hidden for stakeholder demo */}
        <button onClick={onOpenCmd} aria-label="Search (⌘K)" style={{
          display: 'flex', alignItems: 'center', gap: 7,
          height: 32, padding: '0 12px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
          color: 'rgba(255,255,255,0.38)', fontSize: 13,
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <Icon name="search" size={13}/>
          <span>Search...</span>
          <span style={{
            fontFamily: 'DM Mono', fontSize: 10.5, padding: '1px 5px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4, color: 'rgba(255,255,255,0.28)', marginLeft: 4,
          }}>⌘K</span>
        </button>


        <UserMenu onOpenPrefs={onOpenPrefs} onPersonaChange={onPersonaChange} persona={persona}/>
      </div>
    </header>
  );
}

export function StatusBar({ activeCount = 0, attentionCount = 0 }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60000);
    return () => clearInterval(t);
  }, []);
  const now = new Date();
  const mins = now.getMinutes();
  const syncLabel = mins < 2 ? 'Just synced' : `Last sync: ${mins % 5 === 0 ? mins : mins - (mins % 5)} min ago`;

  return (
    <footer role="status" aria-live="polite" style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      height: 36,
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      fontSize: 12,
      color: 'var(--text-secondary)',
      gap: 18,
      /* Stick to viewport bottom so it's always reachable.
         left: 44 clears the LeftNav so the avatar doesn't overlap. */
      position: 'fixed', bottom: 0, left: 44, right: 0, zIndex: 40,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ai-ink)', fontWeight: 500 }}>
        <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
        AI Active
      </span>
      <Sep/>
      <span>{activeCount} active loan{activeCount !== 1 ? 's' : ''}</span>
      <Sep/>
      <span style={{ color: attentionCount > 0 ? 'var(--status-amber)' : 'var(--text-secondary)' }}>
        {attentionCount} need{attentionCount === 1 ? 's' : ''} attention
      </span>
      <Sep/>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#3DB371' }}/>
        All systems operational
      </span>
      <div style={{ flex: 1 }}/>
      <span>{syncLabel}</span>
      <Sep/>
      <span>Press <kbd style={{
        fontFamily: 'DM Mono', fontSize: 11, padding: '1px 5px',
        background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)',
        borderRadius: 4, marginRight: 3, marginLeft: 1,
      }}>⌘K</kbd> for quick actions</span>
    </footer>
  );
}

function Sep() {
  return <span style={{ color: 'var(--border-default)' }}>•</span>;
}

export function AIFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant — active"
      title="Open AI assistant (⌘J)"
      style={{
        position: 'fixed', bottom: 56, right: 24, zIndex: 40,
        width: 56, height: 56, borderRadius: 16,
        border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #7E68FA 0%, #5C49E8 100%)',
        color: '#fff',
        boxShadow: 'var(--shadow-fab)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      <Icon name="sparkles" size={22} strokeWidth={1.5} aria-hidden="true"/>
      {/* Green dot = AI is live/connected; decorative — hidden from a11y tree */}
      <span aria-hidden="true" style={{
        position: 'absolute', top: 6, right: 6,
        width: 9, height: 9, borderRadius: 999,
        background: '#3DDB8C', border: '2px solid #fff',
      }}/>
    </button>
  );
}

export function AISuggestionCard({
  iconBg, iconNode, title, body, confidence, whyNow,
  primaryLabel, primaryIcon = 'arrowRight', onPrimary, onDismiss,
}) {
  return (
    <div className="ai-card-bg" style={{
      borderRadius: 14,
      border: '1px solid var(--ai-border)',
      padding: 20,
      display: 'flex', gap: 18,
      position: 'relative',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: iconBg || 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      }}>
        {iconNode}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5}/>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ai-ink)', whiteSpace: 'nowrap' }}>AI Suggestion</span>
          <StatusPill tone="ai">{confidence}% confidence</StatusPill>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '6px 0 4px', letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{body}</p>

        {whyNow && (
          <div style={{
            marginTop: 14,
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(223, 215, 251, 0.7)',
            borderRadius: 10,
            padding: '11px 14px',
            display: 'flex', alignItems: 'flex-start', gap: 9,
            fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5,
          }}>
            <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 2 }}/>
            <div><strong style={{ fontWeight: 600 }}>Why now:</strong> {whyNow}</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <button className="btn btn-ai" onClick={onPrimary}>
            {primaryLabel}
            <Icon name={primaryIcon} size={14} strokeWidth={2.2}/>
          </button>
          <button className="btn btn-ghost">Maybe later</button>
        </div>
      </div>

      <button onClick={onDismiss} style={{
        position: 'absolute', top: 14, right: 14,
        width: 28, height: 28, borderRadius: 6,
        border: 'none', background: 'transparent', cursor: 'pointer',
        color: 'var(--text-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
