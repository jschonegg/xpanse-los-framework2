import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Shell';
import { LoanDetailView } from './LoanDetail';
import { LOANS } from '../data/loans';
import { useWorkflows } from '../workflows/WorkflowContext';
import {
  AVAILABLE_PAGES, getPage, RULE_FIELD_DEFS, getFieldDef, OPERATORS, getOperator,
  CONTEXT_FIELDS, SECTION_NAME_SUGGESTIONS, appliesToSummary, ALL_VALUE,
  makeCondition, makeGroup, makeSection, newId,
} from '../workflows/workflowModel';

const clone = (o) => JSON.parse(JSON.stringify(o));

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Admin console categories ───────────────────────────────────────────────
// Each category is a top-level destination in the navy global rail. Selecting
// one opens its (always-maximized) white sub-nav listing its pages. Only
// Loan Configuration → Workflows is built today; the rest are placeholders.
const ADMIN_CATEGORIES = [
  {
    id: 'loan-config', label: 'Loan Configuration', icon: 'settings', ready: true,
    desc: 'Configure loan-level navigation and workflows — how pages appear by role, status, milestone, purpose, and more.',
    pages: [{ id: 'workflows', label: 'Workflows', icon: 'workflow' }],
  },
  {
    id: 'organization', label: 'Organization', icon: 'building',
    desc: 'Manage org hierarchy, users, contacts, environments, licensing, and billing.',
    pages: [
      { id: 'org-hierarchy', label: 'Hierarchy', icon: 'pipeline' },
      { id: 'org-users', label: 'User Management', icon: 'command' },
      { id: 'org-contacts', label: 'Contact Management', icon: 'mail' },
      { id: 'org-environment', label: 'Environment', icon: 'settings' },
      { id: 'org-license', label: 'License & Entitlement', icon: 'checkCircle' },
      { id: 'org-thirdparty', label: 'Third Party Management', icon: 'externalLink' },
      { id: 'org-billing', label: 'Billing', icon: 'dollar' },
    ],
  },
  {
    id: 'dashboard', label: 'Dashboard', icon: 'trendingUp',
    desc: 'Configure branding, announcements, and the pipeline dashboard.',
    pages: [
      { id: 'dash-branding', label: 'Branding', icon: 'sparkle' },
      { id: 'dash-announcements', label: 'Announcements', icon: 'bell' },
      { id: 'dash-pipeline', label: 'Pipeline', icon: 'pipeline' },
    ],
  },
  { id: 'conditions', label: 'Conditions', icon: 'listCheck', desc: 'Manage condition templates and libraries.', pages: [] },
  { id: 'rules',      label: 'Rules',      icon: 'filter',    desc: 'Define business rules and automation logic.', pages: [] },
  { id: 'tasks',      label: 'Tasks',      icon: 'target',    desc: 'Configure task templates and assignment.', pages: [] },
  {
    id: 'documents', label: 'Documents', icon: 'doc',
    desc: 'Manage document taxonomy, hierarchy, automation, and work queues.',
    pages: [
      { id: 'doc-taxonomy', label: 'Taxonomy', icon: 'book' },
      { id: 'doc-hierarchy', label: 'Hierarchy', icon: 'pipeline' },
      { id: 'doc-automation', label: 'Automation', icon: 'zap' },
      { id: 'doc-workqueues', label: 'Work Queues', icon: 'listCheck' },
    ],
  },
];

// Default page to open when a category is selected (its first page, or itself
// for single-page/standalone categories).
const defaultPageOf = (cat) => (cat.pages.length ? cat.pages[0].id : cat.id);
// Resolve which category a page id belongs to.
const categoryForPage = (pageId) => ADMIN_CATEGORIES.find(c => c.id === pageId || c.pages.some(p => p.id === pageId));

// ─── Small shared form controls ─────────────────────────────────────────────
function AdminSelect({ value, options, onChange, placeholder, disabled, width, size = 'md' }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const h = size === 'sm' ? 28 : 32;
  return (
    <div style={{ position: 'relative', width: width || '100%' }}>
      <select
        value={value ?? ''} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: h, padding: '0 26px 0 10px',
          border: '1px solid var(--border-subtle)', borderRadius: 7,
          background: disabled ? 'var(--bg-muted)' : 'var(--bg-surface)',
          color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          fontSize: 13, fontFamily: 'inherit', outline: 'none',
          cursor: disabled ? 'default' : 'pointer',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
        <Icon name="chevronDown" size={12}/>
      </span>
    </div>
  );
}

function MultiSelect({ value = [], options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const toggle = (opt) => {
    const set = new Set(value);
    set.has(opt) ? set.delete(opt) : set.add(opt);
    onChange([...set]);
  };
  const label = value.length === 0 ? 'Select values…' : value.length === 1 ? value[0] : `${value.length} selected`;
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: '100%', height: 32, padding: '0 26px 0 10px', textAlign: 'left',
        border: '1px solid var(--border-subtle)', borderRadius: 7,
        background: 'var(--bg-surface)', color: value.length ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', position: 'relative',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
        <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}><Icon name="chevronDown" size={12}/></span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8,
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)', padding: 4, maxHeight: 220, overflowY: 'auto',
        }}>
          {options.map(opt => {
            const on = value.includes(opt);
            return (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <input type="checkbox" checked={on} onChange={() => toggle(opt)} style={{ accentColor: 'var(--text-primary)' }}/>
                {opt}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 999,
      background: active ? 'var(--status-green-bg)' : 'var(--bg-muted)',
      color: active ? 'var(--status-green)' : 'var(--text-secondary)',
      border: active ? 'none' : '1px solid var(--border-subtle)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: active ? 'var(--status-green)' : 'var(--text-tertiary)' }}/>
      {active ? 'Active' : 'Draft'}
    </span>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{children}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{hint}</span>}
    </div>
  );
}

function PanelTitle({ title, helper, right }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>
        <div style={{ flex: 1 }}/>
        {right}
      </div>
      {helper && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.45 }}>{helper}</p>}
    </div>
  );
}

const cardStyle = {
  border: '1px solid var(--border-subtle)', borderRadius: 12,
  background: 'var(--bg-surface)', padding: 18,
};

// ─── Admin global rail ──────────────────────────────────────────────────────
// The Admin Console runs as a parallel app with its own dark global rail,
// replacing the LOS rail entirely. It is expanded (with labels) on the admin
// home page and minimizes to an icon rail once you open a tool page.
function NavyRailItem({ icon, label, active, onClick, expanded }) {
  const base = {
    border: 'none', fontFamily: 'inherit', cursor: onClick ? 'pointer' : 'default',
    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
    color: active ? '#fff' : 'rgba(225,228,245,0.62)',
    transition: 'background 0.12s, color 0.12s',
  };
  const enter = e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } };
  const leave = e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(225,228,245,0.62)'; } };
  if (expanded) {
    return (
      <button onClick={onClick} aria-label={label} onMouseEnter={enter} onMouseLeave={leave}
        style={{ ...base, display: 'flex', alignItems: 'center', gap: 11, width: '100%', height: 38, padding: '0 12px', borderRadius: 9, fontSize: 13, fontWeight: active ? 600 : 500, textAlign: 'left' }}>
        <Icon name={icon} size={18} strokeWidth={1.8}/>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </button>
    );
  }
  return (
    <button data-tooltip={label} aria-label={label} title={label} onClick={onClick} onMouseEnter={enter} onMouseLeave={leave}
      style={{ ...base, width: 38, height: 38, borderRadius: 9, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={19} strokeWidth={1.8}/>
    </button>
  );
}

function AdminGlobalRail({ onExit, onHome, onOpenCategory, expanded, adminPage, activeCatId }) {
  return (
    <aside style={{
      width: expanded ? 212 : 44, flexShrink: 0,
      background: 'linear-gradient(180deg, #0C0E2A 0%, #131638 60%, #1A1A45 100%)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', flexDirection: 'column', alignItems: expanded ? 'stretch' : 'center',
      padding: expanded ? '14px 10px' : '14px 0', gap: 4,
      // No overflow clipping so the minimized-rail hover tooltips can escape
      // the 44px rail and render to the right.
      transition: 'width 0.16s ease',
    }}>
      {/* Brand / home */}
      <button onClick={onHome} aria-label="Admin home" title="Admin home"
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 6, padding: expanded ? '4px 6px 10px' : 0, justifyContent: expanded ? 'flex-start' : 'center', flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #5B7BFF 0%, #8E5BF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)', flexShrink: 0 }}>
          <Icon name="sliders" size={16} strokeWidth={1.7}/>
        </div>
        {expanded && (
          <span style={{ minWidth: 0, textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Admin Console</span>
            <span style={{ display: 'block', fontSize: 10.5, color: 'rgba(225,228,245,0.5)' }}>Configuration</span>
          </span>
        )}
      </button>

      <NavyRailItem icon="home" label="Admin Home" active={adminPage === 'home'} onClick={onHome} expanded={expanded}/>
      {ADMIN_CATEGORIES.map(cat => (
        <NavyRailItem key={cat.id} icon={cat.icon} label={cat.label} active={activeCatId === cat.id} onClick={() => onOpenCategory(cat)} expanded={expanded}/>
      ))}

      <div style={{ flex: 1, minHeight: 8 }}/>

      <NavyRailItem icon="arrowLeft" label="Back to LOS" onClick={onExit} expanded={expanded}/>

      <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: expanded ? 'flex-start' : 'center', padding: expanded ? '12px 8px 0' : '12px 0 0', flexShrink: 0 }}>
        <Avatar initials="J" size={30} color="#3D49E6"/>
        {expanded && <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Jordan</span>}
      </div>
    </aside>
  );
}

// ─── Admin sidebar (secondary nav) ──────────────────────────────────────────
// Expanded on the landing page; collapses to an icon-only rail on tool pages.
function SidebarNavItem({ icon, label, active, collapsed, disabled, soon, onClick }) {
  if (collapsed) {
    return (
      <button onClick={disabled ? undefined : onClick} title={soon ? `${label} — coming soon` : label} aria-label={label}
        style={{
          width: 38, height: 38, margin: '0 auto', borderRadius: 8, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? 'var(--text-primary)' : 'transparent',
          color: active ? '#fff' : disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
          opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer', transition: 'background 0.12s',
        }}
        onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'var(--bg-muted)'; }}
        onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent'; }}>
        <Icon name={icon} size={16} strokeWidth={1.7}/>
      </button>
    );
  }
  return (
    <button onClick={disabled ? undefined : onClick} title={soon ? 'Coming soon' : undefined} aria-label={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, height: 36, width: '100%', padding: '0 12px',
        borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 500, border: 'none', fontFamily: 'inherit',
        background: active ? 'var(--text-primary)' : 'transparent',
        color: active ? '#fff' : disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
        opacity: disabled ? 0.7 : 1, cursor: disabled ? 'default' : 'pointer', textAlign: 'left', transition: 'background 0.12s',
      }}
      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'var(--bg-muted)'; }}
      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent'; }}>
      <Icon name={icon} size={15} strokeWidth={1.7}/>
      <span style={{ flex: 1 }}>{label}</span>
      {soon && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', background: 'var(--bg-muted)', padding: '1px 6px', borderRadius: 4 }}>Soon</span>}
    </button>
  );
}

// Always-maximized secondary nav for the active category. Shown on tool pages
// only (hidden on the admin home page). Houses just the links for its category.
function AdminSidebar({ category, adminPage, onNavigate, onExit }) {
  // Standalone categories (no sub-pages) get a single self-link.
  const items = category.pages.length ? category.pages : [{ id: category.id, label: category.label, icon: category.icon }];

  return (
    <aside style={{
      width: 224, flexShrink: 0, background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: 0,
    }}>
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={category.icon} size={16} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{category.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Admin Console</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => (
          <SidebarNavItem key={it.id} icon={it.icon} label={it.label} collapsed={false}
            active={adminPage === it.id} onClick={() => onNavigate(it.id)}/>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 10 }}>
        <button onClick={onExit} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }}>
          <Icon name="arrowLeft" size={14}/> Back to workspace
        </button>
      </div>
    </aside>
  );
}

// Generic placeholder shown for not-yet-built category pages.
function AdminPlaceholderPage({ category, pageId }) {
  const page = category.pages.find(p => p.id === pageId);
  const title = page ? page.label : category.label;
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{category.label}</div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--bg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name={page ? page.icon : category.icon} size={24} color="var(--text-tertiary)" strokeWidth={1.5}/>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            This section is a placeholder. Configuration for {title.toLowerCase()} will live here.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Workflow list (table) ──────────────────────────────────────────────────
function WorkflowTable({ workflows, onEdit, onPreview, onNew, onDuplicate, onDelete }) {
  const [menuId, setMenuId] = React.useState(null);
  const sorted = [...workflows].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  const th = { textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const td = { padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle', fontSize: 13 };
  const iconBtn = { width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Page header */}
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>Workflow Navigation</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 760, lineHeight: 1.5 }}>
            Configure which pages appear in the loan navigation based on role, loan status, milestone, purpose, and other loan attributes.
          </p>
        </div>
        <button onClick={onNew} className="btn btn-primary btn-sm" style={{ gap: 6, flexShrink: 0, marginTop: 2 }}>
          <Icon name="plus" size={13} strokeWidth={2}/> New Workflow
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 24px' }}>
        <div className="card" style={{ overflow: 'visible', border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'var(--bg-surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)' }}>
                <th style={{ ...th, borderTopLeftRadius: 12 }}>Workflow</th>
                <th style={th}>Applies to</th>
                <th style={th}>Status</th>
                <th style={th}>Priority</th>
                <th style={th}>Updated</th>
                <th style={{ ...th, borderTopRightRadius: 12, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((wf, i) => {
                const last = i === sorted.length - 1;
                const cellStyle = last ? { ...td, borderBottom: 'none' } : td;
                return (
                  <tr key={wf.id} onClick={() => onEdit(wf.id)} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={cellStyle}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{wf.name}</div>
                      {wf.description && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.description}</div>}
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--text-secondary)', fontSize: 12.5, maxWidth: 280 }}>{appliesToSummary(wf)}</td>
                    <td style={cellStyle}><StatusBadge status={wf.status}/></td>
                    <td style={cellStyle}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 5, padding: '1px 8px' }}>
                        {wf.id === 'default' ? 'Fallback' : wf.priority}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--text-tertiary)', fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(wf.updatedAt)}</td>
                    <td style={{ ...cellStyle, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                        <button title="Preview in loan view" aria-label="Preview" onClick={() => onPreview(wf)} style={iconBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                          <Icon name="eye" size={14}/>
                        </button>
                        <button onClick={() => onEdit(wf.id)} className="btn btn-outline btn-sm">Edit</button>
                        <button title="More" aria-label="More options" onClick={() => setMenuId(menuId === wf.id ? null : wf.id)} style={iconBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                          <Icon name="moreV" size={15}/>
                        </button>
                        {menuId === wf.id && (
                          <div onMouseLeave={() => setMenuId(null)} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 30, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', padding: 4, minWidth: 150, textAlign: 'left' }}>
                            <button onClick={() => { setMenuId(null); onDuplicate(wf); }} style={menuItemStyle()}><Icon name="copy" size={13}/> Duplicate</button>
                            <button disabled={wf.id === 'default'} onClick={() => { setMenuId(null); if (wf.id !== 'default') onDelete(wf.id); }}
                              title={wf.id === 'default' ? 'The Default Workflow cannot be deleted' : 'Delete workflow'}
                              style={menuItemStyle(wf.id === 'default' ? 'disabled' : 'danger')}><Icon name="trash" size={13}/> Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Rule builder ───────────────────────────────────────────────────────────
function ConditionRow({ condition, onChange, onRemove }) {
  const field = getFieldDef(condition.field);
  const op = getOperator(condition.operator);
  const values = field ? field.values : [];
  const setField = (f) => onChange({ ...condition, field: f, value: '' });
  const setOp = (o) => {
    const next = getOperator(o);
    let value = condition.value;
    if (next.value === 'multi') value = Array.isArray(condition.value) ? condition.value : [];
    else if (next.value === 'none') value = '';
    else value = Array.isArray(condition.value) ? '' : condition.value;
    onChange({ ...condition, operator: o, value });
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <AdminSelect width={150} value={condition.field} options={RULE_FIELD_DEFS.map(f => ({ value: f.id, label: f.label }))} onChange={setField} size="sm"/>
      <AdminSelect width={140} value={condition.operator} options={OPERATORS.map(o => ({ value: o.id, label: o.label }))} onChange={setOp} size="sm"/>
      <div style={{ flex: 1 }}>
        {op?.value === 'none' ? (
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No value needed</span>
        ) : op?.value === 'multi' ? (
          <MultiSelect value={Array.isArray(condition.value) ? condition.value : []} options={values} onChange={(v) => onChange({ ...condition, value: v })}/>
        ) : (
          <AdminSelect value={condition.value} options={values} placeholder="Select value…" onChange={(v) => onChange({ ...condition, value: v })} size="sm"/>
        )}
      </div>
      <button onClick={onRemove} aria-label="Remove condition" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--status-red)'; e.currentTarget.style.borderColor = 'var(--status-red)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
        <Icon name="x" size={13}/>
      </button>
    </div>
  );
}

function LogicToggle({ value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: 2 }}>
      {['AND', 'OR'].map(l => {
        const active = value === l;
        return (
          <button key={l} onClick={() => onChange(l)} style={{
            height: 22, padding: '0 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
            background: active ? 'var(--text-primary)' : 'transparent',
            color: active ? '#fff' : 'var(--text-secondary)', fontFamily: 'inherit',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
          }}>{l === 'AND' ? 'Match ALL' : 'Match ANY'}</button>
        );
      })}
    </div>
  );
}

function RuleBuilder({ rules, isDefault, onChange }) {
  if (isDefault) {
    return (
      <div style={cardStyle}>
        <PanelTitle title="Rules" helper="Rules determine when this workflow navigation appears for a loan."/>
        <div style={{ padding: '14px 16px', background: 'var(--bg-muted)', borderRadius: 8, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          The <strong>Default Workflow</strong> is the system fallback. It always applies when no other active workflow matches, so it has no matching rules.
        </div>
      </div>
    );
  }
  const setConditions = (conditions) => onChange({ ...rules, conditions });
  const setGroups = (groups) => onChange({ ...rules, groups });
  return (
    <div style={cardStyle}>
      <PanelTitle title="Rules" helper="Rules determine when this workflow navigation appears for a loan." right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Top-level logic</span>
          <LogicToggle value={rules.logic} onChange={(l) => onChange({ ...rules, logic: l })}/>
        </div>
      }/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(rules.conditions || []).map((c, i) => (
          <React.Fragment key={c.id}>
            {i > 0 && <LogicChip logic={rules.logic}/>}
            <ConditionRow condition={c}
              onChange={(next) => setConditions(rules.conditions.map(x => x.id === c.id ? next : x))}
              onRemove={() => setConditions(rules.conditions.filter(x => x.id !== c.id))}/>
          </React.Fragment>
        ))}
        {(rules.conditions || []).length === 0 && (rules.groups || []).length === 0 && (
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '4px 0' }}>
            No conditions yet — this workflow would match all loans. Add a condition to scope it.
          </div>
        )}
      </div>

      {/* Condition groups */}
      {(rules.groups || []).map((g) => (
        <div key={g.id} style={{ marginTop: 12, border: '1px dashed var(--border-default)', borderRadius: 10, padding: 12, background: 'var(--bg-app)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>Group</span>
            <LogicToggle value={g.logic} onChange={(l) => setGroups(rules.groups.map(x => x.id === g.id ? { ...x, logic: l } : x))}/>
            <div style={{ flex: 1 }}/>
            <button onClick={() => setGroups(rules.groups.filter(x => x.id !== g.id))} className="btn btn-ghost btn-sm" style={{ color: 'var(--status-red)', gap: 5 }}>
              <Icon name="trash" size={12}/> Remove group
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.conditions.map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 && <LogicChip logic={g.logic}/>}
                <ConditionRow condition={c}
                  onChange={(next) => setGroups(rules.groups.map(x => x.id === g.id ? { ...x, conditions: x.conditions.map(y => y.id === c.id ? next : y) } : x))}
                  onRemove={() => setGroups(rules.groups.map(x => x.id === g.id ? { ...x, conditions: x.conditions.filter(y => y.id !== c.id) } : x))}/>
              </React.Fragment>
            ))}
          </div>
          <button onClick={() => setGroups(rules.groups.map(x => x.id === g.id ? { ...x, conditions: [...x.conditions, makeCondition()] } : x))} className="btn btn-ghost btn-sm" style={{ marginTop: 8, gap: 6 }}>
            <Icon name="plus" size={12} strokeWidth={2}/> Add condition
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={() => setConditions([...(rules.conditions || []), makeCondition()])} className="btn btn-outline btn-sm" style={{ gap: 6 }}>
          <Icon name="plus" size={13} strokeWidth={2}/> Add condition
        </button>
        <button onClick={() => setGroups([...(rules.groups || []), makeGroup(rules.logic === 'AND' ? 'OR' : 'AND')])} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
          <Icon name="plus" size={13} strokeWidth={2}/> Add condition group
        </button>
      </div>
    </div>
  );
}

function LogicChip({ logic }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-tertiary)', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 5, padding: '1px 7px' }}>{logic}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
    </div>
  );
}

// ─── Navigation builder ─────────────────────────────────────────────────────
function NavigationBuilder({ sections, onChange }) {
  // Native HTML5 drag payload: { type:'page', from, pageId } | { type:'section', sectionId }
  const dragRef = React.useRef(null);
  const [dropHint, setDropHint] = React.useState(null); // { sectionId } | 'tray' | { sectionId, idx }
  const [editingTitleId, setEditingTitleId] = React.useState(null);
  const [menuId, setMenuId] = React.useState(null);

  const usedIds = new Set(sections.flatMap(s => s.pages.map(p => p.id)));
  const tray = AVAILABLE_PAGES.filter(p => !usedIds.has(p.id));

  const setSections = (next) => onChange(next);

  const removeFromAll = (list, pageId) => list.map(s => ({ ...s, pages: s.pages.filter(p => p.id !== pageId) }));

  const dropPageIntoSection = (sectionId, idx = null) => {
    const payload = dragRef.current;
    dragRef.current = null;
    setDropHint(null);
    if (!payload || payload.type !== 'page') return;
    const page = getPage(payload.pageId);
    if (!page) return;
    let next = removeFromAll(sections, payload.pageId);
    next = next.map(s => {
      if (s.id !== sectionId) return s;
      const pages = [...s.pages];
      const insertAt = idx == null ? pages.length : idx;
      pages.splice(insertAt, 0, { id: page.id, label: page.label, icon: page.icon });
      return { ...s, pages };
    });
    setSections(next);
  };

  const dropPageToTray = () => {
    const payload = dragRef.current;
    dragRef.current = null;
    setDropHint(null);
    if (!payload || payload.type !== 'page') return;
    setSections(removeFromAll(sections, payload.pageId));
  };

  const dropSectionBefore = (targetId) => {
    const payload = dragRef.current;
    dragRef.current = null;
    setDropHint(null);
    if (!payload || payload.type !== 'section' || payload.sectionId === targetId) return;
    const arr = [...sections];
    const fromIdx = arr.findIndex(s => s.id === payload.sectionId);
    const [moved] = arr.splice(fromIdx, 1);
    let toIdx = arr.findIndex(s => s.id === targetId);
    if (toIdx === -1) toIdx = arr.length;
    arr.splice(toIdx, 0, moved);
    setSections(arr);
  };

  const renameSection = (id, title) => setSections(sections.map(s => s.id === id ? { ...s, title } : s));
  const deleteSection = (id) => { setSections(sections.filter(s => s.id !== id)); setMenuId(null); };
  const addSection = () => setSections([...sections, makeSection('New workflow section', [])]);

  return (
    <div style={cardStyle}>
      <PanelTitle title="Navigation Builder" helper="Configure the sections and pages that appear in the loan view for this workflow."/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: 8, marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
        <Icon name="target" size={13} color="var(--text-tertiary)"/>
        System links such as <strong style={{ margin: '0 3px' }}>Tasks</strong> and <strong style={{ margin: '0 3px' }}>Loan Story</strong> are always included in the loan view.
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((section) => {
          const isSectionDrop = dropHint && dropHint.sectionDropId === section.id;
          return (
            <div key={section.id}
              onDragOver={(e) => { if (dragRef.current?.type === 'section') { e.preventDefault(); setDropHint({ sectionDropId: section.id }); } }}
              onDrop={(e) => { if (dragRef.current?.type === 'section') { e.preventDefault(); dropSectionBefore(section.id); } }}
              style={{ border: `1px solid ${isSectionDrop ? 'var(--text-primary)' : 'var(--border-subtle)'}`, borderRadius: 10, background: 'var(--bg-app)', overflow: 'hidden' }}>
              {/* Section header */}
              <div
                draggable
                onDragStart={() => { dragRef.current = { type: 'section', sectionId: section.id }; }}
                onDragEnd={() => { dragRef.current = null; setDropHint(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)', cursor: 'grab' }}>
                <Icon name="grip" size={13} color="var(--text-tertiary)"/>
                {editingTitleId === section.id ? (
                  <input autoFocus value={section.title}
                    onChange={e => renameSection(section.id, e.target.value)}
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitleId(null); }}
                    placeholder="New workflow section"
                    style={{ flex: 1, height: 24, padding: '0 8px', border: '1px solid var(--border-default)', borderRadius: 5, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}/>
                ) : (
                  <span onClick={() => setEditingTitleId(section.id)} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)', cursor: 'text' }}>
                    {section.title || 'New workflow section'}
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{section.pages.length} page{section.pages.length !== 1 ? 's' : ''}</span>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setMenuId(menuId === section.id ? null : section.id)} aria-label="Section options"
                    style={{ width: 24, height: 24, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="moreV" size={14}/>
                  </button>
                  {menuId === section.id && (
                    <div onMouseLeave={() => setMenuId(null)} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 30, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', padding: 4, minWidth: 150 }}>
                      <button onClick={() => { setMenuId(null); setEditingTitleId(section.id); }} style={menuItemStyle()}>Rename</button>
                      <button disabled={section.pages.length > 0} onClick={() => deleteSection(section.id)}
                        title={section.pages.length > 0 ? 'Move pages out before deleting' : 'Delete section'}
                        style={menuItemStyle(section.pages.length > 0 ? 'disabled' : 'danger')}>Delete section</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section pages */}
              <div
                onDragOver={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); setDropHint({ sectionId: section.id }); } }}
                onDrop={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); dropPageIntoSection(section.id); } }}
                style={{
                  padding: 8, display: 'flex', flexDirection: 'column', gap: 4,
                  minHeight: section.pages.length === 0 ? 56 : undefined,
                  background: dropHint?.sectionId === section.id ? 'var(--bg-muted)' : 'transparent',
                  alignItems: section.pages.length === 0 ? 'center' : 'stretch',
                  justifyContent: section.pages.length === 0 ? 'center' : undefined,
                }}>
                {section.pages.length === 0 ? (
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Drag pages here</span>
                ) : section.pages.map((p, idx) => (
                  <div key={p.id}
                    draggable
                    onDragStart={(e) => { dragRef.current = { type: 'page', from: section.id, pageId: p.id }; e.stopPropagation(); }}
                    onDragEnd={() => { dragRef.current = null; setDropHint(null); }}
                    onDragOver={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); e.stopPropagation(); setDropHint({ sectionId: section.id, idx }); } }}
                    onDrop={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); e.stopPropagation(); dropPageIntoSection(section.id, idx); } }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 7,
                      cursor: 'grab',
                      borderTop: dropHint?.sectionId === section.id && dropHint?.idx === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    }}>
                    <Icon name="grip" size={12} color="var(--text-tertiary)"/>
                    <Icon name={p.icon} size={14} color="var(--text-secondary)" strokeWidth={1.7}/>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{p.label}</span>
                    <button onClick={() => setSections(removeFromAll(sections, p.id))} aria-label={`Remove ${p.label}`}
                      style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--status-red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                      <Icon name="x" size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addSection} className="btn btn-outline btn-sm" style={{ marginTop: 12, gap: 6 }}>
        <Icon name="plus" size={13} strokeWidth={2}/> Add Section
      </button>

      {/* Available pages tray */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Available Pages</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Drag a page into a section above. Drag a page here to remove it from the workflow.</span>
          <div style={{ flex: 1 }}/>
          {/* Placeholder — custom page creation coming later. */}
          <button type="button" title="Create a custom page (coming soon)"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--ai-primary)', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Icon name="plus" size={12} strokeWidth={2.2}/> Create Page
          </button>
        </div>
        <div
          onDragOver={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); setDropHint('tray'); } }}
          onDrop={(e) => { if (dragRef.current?.type === 'page') { e.preventDefault(); dropPageToTray(); } }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: 12, borderRadius: 10, border: '1px dashed var(--border-default)', background: dropHint === 'tray' ? 'var(--bg-muted)' : 'var(--bg-app)', minHeight: 52 }}>
          {tray.length === 0 ? (
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>All pages are in use.</span>
          ) : tray.map(p => (
            <div key={p.id}
              draggable
              onDragStart={() => { dragRef.current = { type: 'page', from: 'tray', pageId: p.id }; }}
              onDragEnd={() => { dragRef.current = null; setDropHint(null); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 999, cursor: 'grab', fontSize: 12.5 }}>
              <Icon name={p.icon} size={13} color="var(--text-secondary)" strokeWidth={1.7}/>
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function menuItemStyle(kind) {
  return {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px',
    border: 'none', background: 'transparent', borderRadius: 5, textAlign: 'left', fontFamily: 'inherit', fontSize: 12.5,
    cursor: kind === 'disabled' ? 'not-allowed' : 'pointer',
    color: kind === 'danger' ? 'var(--status-red)' : kind === 'disabled' ? 'var(--text-tertiary)' : 'var(--text-primary)',
    opacity: kind === 'disabled' ? 0.55 : 1,
  };
}

// ─── Live loan nav preview ──────────────────────────────────────────────────
function LoanNavPreview({ workflow }) {
  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <PanelTitle title="Loan Navigation Preview" helper="How the loan view left nav will render for this workflow."/>
      </div>
      <div style={{ background: 'var(--bg-surface)', padding: '12px 10px' }}>
        {/* Fixed system links */}
        <PreviewItem icon="target" label="Tasks" system/>
        <PreviewItem icon="book" label="Loan Story" system/>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 6px' }}/>
        {/* Configured sections */}
        {(workflow.sections || []).length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '8px 10px' }}>No sections configured.</div>
        )}
        {(workflow.sections || []).map(section => (
          <div key={section.id} style={{ marginTop: 6 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 10px 4px' }}>{section.title}</div>
            {section.pages.map(p => <PreviewItem key={p.id} icon={p.icon} label={p.label} badge={getPage(p.id)?.badge}/>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '9px 14px', background: 'var(--bg-muted)', fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="workflow" size={12} color="var(--text-tertiary)"/>
        Workflow: <strong style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{workflow.name}</strong>
      </div>
    </div>
  );
}

function PreviewItem({ icon, label, system, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 32, padding: '0 10px', borderRadius: 7, color: 'var(--text-secondary)' }}>
      <Icon name={icon} size={14} strokeWidth={1.7}/>
      <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {badge && <span style={{ background: 'var(--card-red-bg)', color: 'var(--status-red)', fontSize: 10.5, fontWeight: 600, minWidth: 17, height: 17, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{badge}</span>}
      {system && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', background: 'var(--bg-muted)', padding: '1px 6px', borderRadius: 4 }}>System</span>}
    </div>
  );
}

// ─── Preview context switcher ───────────────────────────────────────────────
export function PreviewContextSwitcher({ compact }) {
  const { previewContext, setPreviewContext, resolvedWorkflow } = useWorkflows();
  return (
    <div style={compact ? {} : { ...cardStyle, padding: 16 }}>
      {!compact && <PanelTitle title="Preview Context" helper="Mock user + loan attributes used to resolve which active workflow the loan view shows."/>}
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr', gap: 9 }}>
        {CONTEXT_FIELDS.map(f => (
          <div key={f.id}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 3 }}>{f.label}</div>
            <AdminSelect value={previewContext[f.id]} options={[{ value: ALL_VALUE, label: f.allLabel }, ...f.values]} onChange={(v) => setPreviewContext({ [f.id]: v })} size="sm"/>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '9px 11px', borderRadius: 8, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Resolves to</span>
        <strong style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{resolvedWorkflow?.name || '—'}</strong>
        {resolvedWorkflow && <StatusBadge status={resolvedWorkflow.status}/>}
      </div>
    </div>
  );
}

// ─── Workflow editor ────────────────────────────────────────────────────────
function WorkflowEditor({ editing, setEditing, dirty, onBack, onPreview, onSave, onPublish, onSaveDraft, onDuplicate, onCancel }) {
  const isDefault = editing.id === 'default';
  const patch = (p) => setEditing(prev => ({ ...prev, ...p }));

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', paddingRight: 4 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'var(--text-secondary)', padding: 0, fontWeight: 600 }}>
          <Icon name="arrowLeft" size={13}/> Workflows
        </button>
        <Icon name="chevronRight" size={12}/>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editing.name || 'Untitled workflow'}</span>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg-app)', paddingBottom: 4 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editing.name || 'Untitled workflow'}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>
            Last edited {fmtDate(editing.updatedAt)} by {editing.updatedBy || 'Admin'}
            {dirty && <span style={{ marginLeft: 8, color: 'var(--status-amber)', fontWeight: 600 }}>• Unsaved changes</span>}
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <button onClick={() => onPreview(editing)} className="btn btn-outline btn-sm" style={{ gap: 6 }}><Icon name="eye" size={13}/> Preview</button>
        <button onClick={onCancel} disabled={!dirty} className="btn btn-ghost btn-sm" style={{ opacity: dirty ? 1 : 0.5 }}>Cancel</button>
        <button onClick={onDuplicate} className="btn btn-outline btn-sm" style={{ gap: 6 }}><Icon name="copy" size={13}/> Duplicate</button>
        <button onClick={onSaveDraft} className="btn btn-outline btn-sm">Save as Draft</button>
        <button onClick={onPublish} className="btn btn-outline btn-sm" style={{ gap: 6, color: 'var(--status-green)', borderColor: 'var(--status-green)' }}><Icon name="checkCircle" size={13}/> Publish</button>
        <button onClick={onSave} className="btn btn-primary btn-sm">Save Workflow</button>
      </div>

      {/* Metadata */}
      <div style={cardStyle}>
        <PanelTitle title="Workflow Details"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <FieldLabel>Workflow Name</FieldLabel>
            <input value={editing.name} onChange={e => patch({ name: e.target.value })}
              style={inputStyle}/>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <FieldLabel>Description</FieldLabel>
            <textarea value={editing.description} onChange={e => patch({ description: e.target.value })} rows={2}
              style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical', lineHeight: 1.5 }}/>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <div style={{ display: 'inline-flex', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: 2 }}>
              {[['active', 'Active'], ['draft', 'Draft']].map(([v, l]) => {
                const on = editing.status === v;
                return (
                  <button key={v} onClick={() => patch({ status: v })} style={{
                    height: 26, padding: '0 14px', borderRadius: 5, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                    background: on ? (v === 'active' ? 'var(--status-green)' : 'var(--text-primary)') : 'transparent',
                    color: on ? '#fff' : 'var(--text-secondary)',
                  }}>{l}</button>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>Only Active workflows apply to loans.</div>
          </div>
          <div>
            <FieldLabel hint="Lower number wins">Priority</FieldLabel>
            <input type="number" min="1" value={editing.priority} disabled={isDefault}
              onChange={e => patch({ priority: parseInt(e.target.value, 10) || 0 })}
              style={{ ...inputStyle, width: 120, background: isDefault ? 'var(--bg-muted)' : 'var(--bg-surface)' }}/>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>{isDefault ? 'Default is always the lowest-priority fallback.' : 'Determines which workflow wins when several match.'}</div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <RuleBuilder rules={editing.rules} isDefault={isDefault} onChange={(rules) => patch({ rules })}/>

      {/* Navigation builder */}
      <NavigationBuilder sections={editing.sections} onChange={(sections) => patch({ sections })}/>
    </div>
  );
}

const inputStyle = {
  width: '100%', height: 34, padding: '0 10px', boxSizing: 'border-box',
  border: '1px solid var(--border-subtle)', borderRadius: 7,
  background: 'var(--bg-surface)', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none',
};

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      background: 'var(--text-primary)', color: '#fff', padding: '11px 18px', borderRadius: 10,
      fontSize: 13, fontWeight: 500, boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 9, maxWidth: 460,
    }}>
      <Icon name="checkCircle" size={16} color="#5BE3A0"/>
      {message}
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────
// ─── Workflow Navigation tool page ──────────────────────────────────────────
// Full-screen preview: renders the real loan view with the given workflow's
// navigation applied, on a sample loan whose attributes match the workflow's
// rules (purpose / status) so the preview feels coherent.
const PREVIEW_LOAN_ID = 'LN-2024-0341';
// Rule-vocabulary → loan-data vocabulary.
const PURPOSE_TO_LOAN = { 'Purchase': 'Purchase', 'Rate/Term Refinance': 'Rate/term refi', 'Cash-out Refinance': 'Cash-out refi' };
const STATUS_TO_LOAN = { 'New': 'Application', 'Processing': 'Processing', 'Underwriting': 'Underwriting', 'Conditional Approval': 'Approval', 'Clear to Close': 'Approval', 'Closing': 'Closing', 'Funded': 'Funded' };

// Pull the first concrete value targeted by a rule for a given field.
function ruleTarget(rules, field) {
  const conds = [...(rules?.conditions || []), ...((rules?.groups || []).flatMap(g => g.conditions || []))];
  const c = conds.find(c => c.field === field && (c.operator === 'is' || c.operator === 'one_of'));
  if (!c) return null;
  return Array.isArray(c.value) ? c.value[0] : c.value;
}

// Choose the sample loan that best matches the workflow's purpose/status rules.
function pickPreviewLoan(workflow) {
  const wantPurpose = PURPOSE_TO_LOAN[ruleTarget(workflow.rules, 'loanPurpose')] || null;
  const wantStatus = STATUS_TO_LOAN[ruleTarget(workflow.rules, 'loanStatus')] || null;
  const fallback = LOANS.find(l => l.id === PREVIEW_LOAN_ID) || LOANS[0];
  if (!wantPurpose && !wantStatus) return fallback;
  let best = fallback, bestScore = 0;
  for (const l of LOANS) {
    let score = 0;
    if (wantPurpose && l.loanPurpose === wantPurpose) score += 1;
    if (wantStatus && l.status === wantStatus) score += 1;
    if (score > bestScore) { bestScore = score; best = l; }
  }
  return best;
}

function LoanPreviewOverlay({ workflow, onClose }) {
  const [tab, setTab] = React.useState('now');
  const loan = React.useMemo(() => pickPreviewLoan(workflow), [workflow]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Preview top bar */}
      <div style={{ height: 48, flexShrink: 0, background: '#16181d', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Icon name="eye" size={15} color="#b8a9fc"/>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>Loan preview</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)' }}>{workflow.name}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999, background: 'rgba(126,104,250,0.22)', color: '#b8a9fc' }}>Sample data</span>
        <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>{loan.borrower} · {loan.loanPurpose} · {loan.status}</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>Click any page in the nav to preview it</span>
        <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
          <Icon name="x" size={14}/> Close preview
        </button>
      </div>
      {/* Real loan view, forced to this workflow + a matching sample loan */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <LoanDetailView loanId={loan.id} tab={tab} onTab={setTab} previewWorkflow={workflow}/>
      </div>
    </div>,
    document.body,
  );
}

// ─── Workflow Navigation tool page — two-step: table list → edit screen ──────
function WorkflowNavPage() {
  const {
    workflows, saveWorkflow, publishWorkflow, saveWorkflowAsDraft,
    duplicateWorkflow, deleteWorkflow, createWorkflow,
  } = useWorkflows();

  const [mode, setMode] = React.useState('list');          // 'list' | 'edit'
  const [editingId, setEditingId] = React.useState(null);
  const [editing, setEditing] = React.useState(null);      // working draft
  const [toast, setToast] = React.useState(null);
  const [previewWf, setPreviewWf] = React.useState(null);  // full-preview overlay
  const toastTimer = React.useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const selected = workflows.find(w => w.id === editingId) || null;

  // Refresh the draft when the stored workflow identity changes after a save.
  React.useEffect(() => {
    if (mode === 'edit' && selected) setEditing(clone(selected));
  }, [editingId, selected, mode]);

  const openEdit = (id) => {
    const wf = workflows.find(w => w.id === id);
    if (!wf) return;
    setEditingId(id); setEditing(clone(wf)); setMode('edit');
  };
  const backToList = () => { setMode('list'); setEditingId(null); setEditing(null); };

  const dirty = editing && selected ? JSON.stringify(editing) !== JSON.stringify(selected) : false;

  const handleSave = () => { saveWorkflow(editing); showToast('Workflow saved. Loan navigation will update for matching loans.'); };
  const handlePublish = () => { const s = publishWorkflow(editing); setEditing(clone(s)); showToast('Workflow published. It can now apply to matching loans.'); };
  const handleSaveDraft = () => { const s = saveWorkflowAsDraft(editing); setEditing(clone(s)); showToast('Saved as draft. Draft workflows don’t apply to the loan view.'); };
  const handleDuplicate = () => { const copy = duplicateWorkflow(editing); setEditingId(copy.id); setEditing(clone(copy)); showToast('Workflow duplicated as a draft copy.'); };
  const handleCancel = () => { if (selected) setEditing(clone(selected)); };
  const handleNew = () => { const wf = createWorkflow(); setEditingId(wf.id); setEditing(clone(wf)); setMode('edit'); showToast('New workflow created.'); };
  const handleDuplicateFromList = (wf) => { const copy = duplicateWorkflow(wf); setEditingId(copy.id); setEditing(clone(copy)); setMode('edit'); showToast('Workflow duplicated as a draft copy.'); };
  const handleDelete = (id) => { deleteWorkflow(id); showToast('Workflow deleted.'); };

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {mode === 'list' ? (
        <WorkflowTable workflows={workflows} onEdit={openEdit} onPreview={setPreviewWf} onNew={handleNew} onDuplicate={handleDuplicateFromList} onDelete={handleDelete}/>
      ) : editing ? (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 18, padding: '18px 24px 24px', overflow: 'hidden' }}>
          <WorkflowEditor
            editing={editing} setEditing={setEditing} dirty={dirty}
            onBack={backToList} onPreview={setPreviewWf}
            onSave={handleSave} onPublish={handlePublish} onSaveDraft={handleSaveDraft}
            onDuplicate={handleDuplicate} onCancel={handleCancel}/>

          <div style={{ width: 288, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', paddingRight: 2 }}>
            <LoanNavPreview workflow={editing}/>
            <button onClick={() => setPreviewWf(editing)} className="btn btn-outline btn-sm" style={{ gap: 6, justifyContent: 'center' }}>
              <Icon name="eye" size={13}/> Full loan preview
            </button>
          </div>
        </div>
      ) : null}

      <Toast message={toast}/>
      {previewWf && <LoanPreviewOverlay workflow={previewWf} onClose={() => setPreviewWf(null)}/>}
    </div>
  );
}

// ─── Admin landing (placeholder) ────────────────────────────────────────────
function AdminLanding({ onOpen }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>Admin Console</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 760, lineHeight: 1.5 }}>
          Configure platform-wide settings for your loan origination system. Select a category to begin.
        </p>
      </div>
      <div style={{ padding: 28, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, maxWidth: 960 }}>
          {ADMIN_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onOpen(cat)}
              style={{
                textAlign: 'left', border: '1px solid var(--border-subtle)', borderRadius: 12,
                background: 'var(--bg-surface)', padding: 18, fontFamily: 'inherit', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 10, minHeight: 132,
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={cat.icon} size={18} color="var(--text-secondary)" strokeWidth={1.6}/>
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{cat.label}</div>
                {!cat.ready && <span style={{ marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', background: 'var(--bg-muted)', padding: '2px 7px', borderRadius: 999 }}>Placeholder</span>}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{cat.desc}</div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Open <Icon name="arrowRight" size={13}/></div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
          Most console modules are placeholders for now — Loan Configuration is the live one.
        </div>
      </div>
    </div>
  );
}

// ─── Root: Admin Console shell ──────────────────────────────────────────────
export function AdminWorkflowsView({ onExit }) {
  // Land on the overview. The navy global rail is expanded on home and
  // minimizes to icons on tool pages; the white sub-nav stays maximized but
  // only appears on tool pages.
  const [adminPage, setAdminPage] = React.useState('home');
  const isHome = adminPage === 'home';
  const activeCat = isHome ? null : categoryForPage(adminPage);

  let main;
  if (isHome) main = <AdminLanding onOpen={(cat) => setAdminPage(defaultPageOf(cat))}/>;
  else if (adminPage === 'workflows') main = <WorkflowNavPage/>;
  else if (activeCat) main = <AdminPlaceholderPage category={activeCat} pageId={adminPage}/>;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, height: '100%', background: 'var(--bg-app)' }}>
      <AdminGlobalRail onExit={onExit} onHome={() => setAdminPage('home')} onOpenCategory={(cat) => setAdminPage(defaultPageOf(cat))} expanded={isHome} adminPage={adminPage} activeCatId={activeCat?.id}/>
      {!isHome && activeCat && <AdminSidebar category={activeCat} adminPage={adminPage} onNavigate={setAdminPage} onExit={onExit}/>}
      {main}
    </div>
  );
}

export default AdminWorkflowsView;
