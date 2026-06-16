import React from 'react';
import { Icon } from '../components/Icon';
import { IMS_FORMS, AGENCIES, loanAgencies, isApplicable, formAgencyKeys, formById } from '../data/imsForms';

// Agency badge tones (conventional = blue, FHA = amber, VA = green, USDA = purple).
const AGENCY_TONE = {
  fnma:  { bg: 'var(--status-blue-bg)',  fg: 'var(--status-blue)' },
  fhlmc: { bg: 'var(--status-blue-bg)',  fg: 'var(--status-blue)' },
  fha:   { bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
  va:    { bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
  usda:  { bg: 'var(--ai-bg)',           fg: 'var(--ai-ink)' },
};

function AgencyBadges({ form, compact }) {
  const keys = formAgencyKeys(form);
  if (keys.length === AGENCIES.length) {
    return <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>All agencies</span>;
  }
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4 }}>
      {keys.map(k => {
        const a = AGENCIES.find(x => x.key === k);
        const t = AGENCY_TONE[k];
        return (
          <span key={k} style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
            background: t.bg, color: t.fg, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>{a.label}</span>
        );
      })}
    </span>
  );
}

function FavStar({ active, onClick, size = 15 }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      style={{
        background: 'none', border: 'none', padding: 4, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: active ? '#E0A23A' : 'var(--text-tertiary)',
        transition: 'color 0.12s, transform 0.08s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#E0A23A'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
    >
      <Icon name="star" size={size} color={active ? '#E0A23A' : 'currentColor'} style={{ fill: active ? '#E0A23A' : 'none' }}/>
    </button>
  );
}

// ─── Forms list page ─────────────────────────────────────────────────────────
export function FormsView({ loan, favorites = [], onToggleFavorite, onOpenForm }) {
  const applicableKeys = loanAgencies(loan);
  const loanLabel = applicableKeys.map(k => AGENCIES.find(a => a.key === k)?.label).join(' / ');

  const TABS = [
    { id: 'loan', label: 'This loan', filter: (f) => isApplicable(f, loan) },
    { id: 'all',  label: 'All forms', filter: () => true },
    ...AGENCIES.map(a => ({ id: a.key, label: a.label, filter: (f) => !!f[a.key] })),
  ];
  const [activeTab, setActiveTab] = React.useState('loan');
  const [query, setQuery] = React.useState('');

  const tab = TABS.find(t => t.id === activeTab) || TABS[0];
  const q = query.trim().toLowerCase();
  const rows = IMS_FORMS.filter(tab.filter).filter(f =>
    !q || f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)
  );
  const countFor = (t) => IMS_FORMS.filter(t.filter).length;

  const isFav = (id) => favorites.includes(id);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Forms</h2>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
          IMS data forms &amp; collectors you may need to reference. Showing what applies to this {loanLabel || 'loan'} loan by default.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, borderBottom: '1px solid var(--border-subtle)', marginBottom: 14, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {t.label}
              <span style={{
                fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans',
                color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                background: 'var(--bg-muted)', borderRadius: 999, padding: '1px 7px',
              }}>{countFor(t)}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14, maxWidth: 320 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'inline-flex' }}>
          <Icon name="search" size={14}/>
        </span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search forms…"
          style={{
            width: '100%', height: 34, padding: '0 12px 0 32px', boxSizing: 'border-box',
            border: '1px solid var(--border-default)', borderRadius: 8, background: 'var(--bg-surface)',
            fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)', outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', textAlign: 'left' }}>
              <th style={thStyle(44)}></th>
              <th style={thStyle(48)}>#</th>
              <th style={thStyle()}>Form</th>
              <th style={thStyle(160)}>Applies to</th>
              <th style={thStyle(220)}>Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(f => (
              <tr
                key={f.id}
                onClick={() => onOpenForm && onOpenForm(f.id)}
                style={{ borderTop: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                  <FavStar active={isFav(f.id)} onClick={() => onToggleFavorite && onToggleFavorite(f.id)}/>
                </td>
                <td style={{ ...tdStyle, color: 'var(--text-tertiary)', fontFamily: 'DM Sans' }}>{f.id}</td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, maxWidth: 520, lineHeight: 1.4 }}>{f.desc}</div>
                </td>
                <td style={tdStyle}><AgencyBadges form={f}/></td>
                <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 12.5 }}>{f.link}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
                No forms match.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function thStyle(w) {
  return {
    padding: '10px 14px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
    width: w ? w : 'auto',
  };
}
const tdStyle = { padding: '11px 14px', verticalAlign: 'top' };

// ─── Single form reference page ──────────────────────────────────────────────
export function FormDetailView({ formId, loan, favorites = [], onToggleFavorite, onBack }) {
  const form = formById(formId);
  if (!form) {
    return (
      <div>
        <Breadcrumb onBack={onBack} name="Not found"/>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>That form could not be found.</div>
      </div>
    );
  }
  const fav = favorites.includes(form.id);
  const applicable = isApplicable(form, loan);

  return (
    <div>
      <Breadcrumb onBack={onBack} name={form.name}/>

      <div style={{ maxWidth: 720, border: '1px solid var(--border-subtle)', borderRadius: 14, background: 'var(--bg-surface)', overflow: 'hidden' }}>
        {/* Header band */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'var(--ai-bg)', color: 'var(--ai-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="doc" size={20} strokeWidth={1.7}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{form.name}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'DM Sans', background: 'var(--bg-muted)', borderRadius: 999, padding: '2px 8px' }}>#{form.id}</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{form.desc}</div>
          </div>
          <FavStar active={fav} onClick={() => onToggleFavorite && onToggleFavorite(form.id)} size={20}/>
        </div>

        {/* Meta rows */}
        <div style={{ padding: '6px 20px 14px' }}>
          <MetaRow label="Applies to"><AgencyBadges form={form}/></MetaRow>
          <MetaRow label="This loan">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: applicable ? 'var(--status-green)' : 'var(--text-tertiary)' }}>
              <Icon name={applicable ? 'checkCircle' : 'x'} size={14}/>
              {applicable ? 'Applicable to this loan' : 'Not applicable to this loan'}
            </span>
          </MetaRow>
          <MetaRow label="Model form">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{form.link}</span>
          </MetaRow>
        </div>

        {/* Reference note */}
        <div style={{ margin: '0 20px 18px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
          <span style={{ fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.45 }}>
            Reference entry from the IMS forms catalog. Favorite it to pin it to this loan's left navigation under Favorites.
          </span>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ onBack, name }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 13 }}>
      <button onClick={onBack} style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', padding: 0,
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <Icon name="arrowLeft" size={14}/> Forms
      </button>
      <Icon name="chevronRight" size={13} color="var(--text-tertiary)"/>
      <span style={{ color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

function MetaRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 110, flexShrink: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', paddingTop: 2 }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
