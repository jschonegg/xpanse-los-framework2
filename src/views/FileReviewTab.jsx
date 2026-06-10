import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill, PageHeader } from '../components/Shell';

// ─── Checklist data ────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'application',
    label: 'Application (1003)',
    icon: 'doc',
    items: [
      { id: 'a1', label: '1003 — All 4 pages complete',         source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'a2', label: 'Borrower signature — page 4',         source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'a3', label: 'Co-borrower signature (if applicable)',source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'a4', label: 'Credit authorization signed',         source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'a5', label: 'SSN / TIN confirmed for all borrowers',source: 'Borrower',  status: 'review',   received: '',       notes: 'Co-borrower SSN missing on page 1' },
    ],
  },
  {
    id: 'credit',
    label: 'Credit & Identity',
    icon: 'fileSearch',
    items: [
      { id: 'c1', label: 'Tri-merge credit report pulled',      source: 'Internal',  status: 'received', received: 'May 11', notes: '' },
      { id: 'c2', label: 'Mid-score confirmed (≥ guideline min)',source: 'Internal',  status: 'received', received: 'May 11', notes: '742 mid-score ✓' },
      { id: 'c3', label: 'Government ID — photo ID verified',   source: 'Borrower',  status: 'missing',  received: '',       notes: '' },
      { id: 'c4', label: 'OFAC / fraud indicator check',        source: 'Internal',  status: 'received', received: 'May 11', notes: 'No flags' },
    ],
  },
  {
    id: 'income',
    label: 'Income Documentation',
    icon: 'trendingUp',
    items: [
      { id: 'i1', label: 'W-2 — most recent year (2025)',       source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'i2', label: 'W-2 — prior year (2024)',             source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'i3', label: 'Paystubs — most recent 30-day',       source: 'Borrower',  status: 'review',   received: 'May 10', notes: 'Expires May 24 — request update within 3 days' },
      { id: 'i4', label: 'Employer name + address confirmed',   source: 'Borrower',  status: 'received', received: 'May 10', notes: '' },
      { id: 'i5', label: 'VOE — employment verification',       source: 'Employer',  status: 'ordered',  received: '',       notes: 'Sent via The Work Number — ETA 1–2 days' },
      { id: 'i6', label: 'Income calc completed + logged',      source: 'Internal',  status: 'missing',  received: '',       notes: '' },
    ],
  },
  {
    id: 'assets',
    label: 'Asset Documentation',
    icon: 'dollar',
    items: [
      { id: 'as1', label: 'Bank statements — 2 most recent months', source: 'Borrower', status: 'received', received: 'May 17', notes: 'Chase ending 4421 — $45,210 balance' },
      { id: 'as2', label: 'Large deposit explanation (>50% monthly income)', source: 'Borrower', status: 'missing', received: '', notes: '$12,000 deposit Apr 3 — needs LOX' },
      { id: 'as3', label: 'Gift letter (if down payment gifted)',   source: 'Borrower', status: 'received', received: 'May 12', notes: 'From James Anderson (father) — $25,000' },
      { id: 'as4', label: 'Reserves confirmed (≥ 2 months PITI)',  source: 'Internal', status: 'review',   received: '',       notes: 'Borderline — verify after updated statements' },
    ],
  },
  {
    id: 'property',
    label: 'Property & Third Party',
    icon: 'home',
    items: [
      { id: 'p1', label: 'Appraisal ordered',              source: 'Third Party', status: 'ordered',  received: '',       notes: 'ABC Appraisal — ordered May 11, ETA May 19' },
      { id: 'p2', label: 'Title commitment ordered',       source: 'Third Party', status: 'ordered',  received: '',       notes: 'Chicago Title — ordered May 11' },
      { id: 'p3', label: 'Flood certification',            source: 'Third Party', status: 'received', received: 'May 12', notes: 'Zone X — no flood insurance required' },
      { id: 'p4', label: 'HOI policy confirmed',           source: 'Borrower',   status: 'missing',  received: '',       notes: '' },
      { id: 'p5', label: 'Purchase agreement / sales contract', source: 'Borrower', status: 'received', received: 'May 10', notes: '$425,000 — executed May 8' },
    ],
  },
  {
    id: 'disclosures',
    label: 'Disclosures & Compliance',
    icon: 'listCheck',
    items: [
      { id: 'd1', label: 'Loan Estimate issued within 3 business days', source: 'Internal', status: 'received', received: 'May 12', notes: 'Issued May 12 — within window ✓' },
      { id: 'd2', label: 'Borrower intent to proceed received',         source: 'Borrower', status: 'received', received: 'May 13', notes: '' },
      { id: 'd3', label: 'HMDA data collected and confirmed',           source: 'Internal', status: 'received', received: 'May 10', notes: '' },
      { id: 'd4', label: 'ECOA adverse action notice (if applicable)',  source: 'Internal', status: 'received', received: 'May 10', notes: 'N/A — loan approved' },
    ],
  },
];

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_META = {
  received: { label: 'Received',     dot: '#3DA866', bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
  review:   { label: 'Needs Review', dot: '#E0A23A', bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
  missing:  { label: 'Missing',      dot: '#D74C3C', bg: 'var(--card-red-bg)',     fg: 'var(--status-red)'   },
  ordered:  { label: 'Ordered',      dot: '#5B8DF6', bg: 'var(--status-blue-bg)', fg: 'var(--status-blue)'  },
};

const SOURCE_COLORS = {
  Borrower:    { bg: 'rgba(124,111,205,0.1)', fg: '#7C6FCD' },
  Employer:    { bg: 'rgba(42,140,83,0.1)',   fg: '#2A8C53' },
  'Third Party':{ bg: 'rgba(58,130,148,0.1)', fg: '#3A8294' },
  Internal:    { bg: 'var(--bg-muted)',       fg: 'var(--text-tertiary)' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }) {
  const m = STATUS_META[status] || STATUS_META.missing;
  return <span style={{ width: size, height: size, borderRadius: 999, background: m.dot, flexShrink: 0, display: 'inline-block' }}/>;
}

function SourceTag({ source }) {
  const c = SOURCE_COLORS[source] || SOURCE_COLORS.Internal;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: c.bg, color: c.fg, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
      {source}
    </span>
  );
}

function ChecklistItem({ item, onStatusChange, onNoteChange }) {
  const [editingNote, setEditingNote] = React.useState(false);
  const [noteVal, setNoteVal] = React.useState(item.notes);
  const m = STATUS_META[item.status] || STATUS_META.missing;

  const cycleStatus = () => {
    const order = ['missing', 'ordered', 'review', 'received'];
    const next = order[(order.indexOf(item.status) + 1) % order.length];
    onStatusChange(item.id, next);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Status toggle dot */}
      <button
        onClick={cycleStatus}
        title={`Click to cycle status (current: ${m.label})`}
        style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: '1.5px solid ' + m.dot,
          background: item.status === 'received' ? m.dot : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
      >
        {item.status === 'received' && <Icon name="check" size={11} color="#fff" strokeWidth={2.5}/>}
        {item.status === 'review'   && <span style={{ fontSize: 10, color: m.dot, fontWeight: 700 }}>!</span>}
        {item.status === 'missing'  && <span style={{ fontSize: 11, color: m.dot, fontWeight: 700 }}>✕</span>}
        {item.status === 'ordered'  && <span style={{ width: 6, height: 6, borderRadius: 999, background: m.dot }}/>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{
            fontSize: 13, fontWeight: 500,
            color: item.status === 'received' ? 'var(--text-secondary)' : 'var(--text-primary)',
            textDecoration: item.status === 'received' ? 'line-through' : 'none',
            textDecorationColor: 'var(--border-default)',
          }}>{item.label}</span>
          <SourceTag source={item.source}/>
          {item.received && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'DM Mono' }}>{item.received}</span>
          )}
        </div>

        {/* Notes */}
        {editingNote ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <input
              autoFocus
              value={noteVal}
              onChange={e => setNoteVal(e.target.value)}
              onBlur={() => { onNoteChange(item.id, noteVal); setEditingNote(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { onNoteChange(item.id, noteVal); setEditingNote(false); } if (e.key === 'Escape') setEditingNote(false); }}
              style={{
                flex: 1, fontSize: 12, padding: '4px 8px', border: '1px solid var(--ai-border)',
                borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--ai-bg)', color: 'var(--ai-ink)',
              }}
              placeholder="Add a note..."
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.notes
              ? <span
                  onClick={() => setEditingNote(true)}
                  style={{ fontSize: 12, color: item.status === 'review' ? 'var(--status-amber)' : item.status === 'missing' ? 'var(--status-red)' : 'var(--text-tertiary)', cursor: 'text', lineHeight: 1.4 }}
                >{item.notes}</span>
              : <button
                  onClick={() => setEditingNote(true)}
                  style={{ fontSize: 11.5, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                >+ Add note</button>
            }
          </div>
        )}
      </div>

      {/* Status pill */}
      <span style={{
        fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
        background: m.bg, color: m.fg, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2,
      }}>{m.label}</span>
    </div>
  );
}

function Section({ section, filter, onStatusChange, onNoteChange }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const filtered = section.items.filter(i => filter === 'all' || i.status === filter);
  if (filtered.length === 0) return null;

  const counts = {
    received: section.items.filter(i => i.status === 'received').length,
    total:    section.items.length,
    issues:   section.items.filter(i => i.status === 'missing' || i.status === 'review').length,
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      {/* Section header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 16px', border: 'none', background: 'transparent',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <Icon name={section.icon} size={15} color="var(--text-secondary)" strokeWidth={1.7}/>
        <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{section.label}</span>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 4, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
            <div style={{
              width: `${(counts.received / counts.total) * 100}%`, height: '100%', borderRadius: 999,
              background: counts.issues > 0 ? '#E0A23A' : '#3DA866', transition: 'width 0.3s',
            }}/>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
            {counts.received}/{counts.total}
          </span>
          {counts.issues > 0 && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
              background: 'var(--card-red-bg)', color: 'var(--status-red)',
            }}>{counts.issues} issue{counts.issues > 1 ? 's' : ''}</span>
          )}
        </div>

        <Icon name={collapsed ? 'chevronDown' : 'chevronUp'} size={14} color="var(--text-tertiary)"/>
      </button>

      {/* Items */}
      {!collapsed && (
        <div style={{ padding: '0 16px 4px' }}>
          {filtered.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
              onStatusChange={onStatusChange}
              onNoteChange={onNoteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function FileReviewTab({ borrowerName = 'Sarah Anderson', loanId = 'LN-2024-0234' }) {
  const [sections, setSections] = React.useState(SECTIONS);
  const [filter, setFilter] = React.useState('all');
  const [logged, setLogged] = React.useState(false);
  const [loanStatus, setLoanStatus] = React.useState('In Processing');
  const [needsListOpen, setNeedsListOpen] = React.useState(false);

  const allItems = sections.flatMap(s => s.items);
  const counts = {
    total:    allItems.length,
    received: allItems.filter(i => i.status === 'received').length,
    missing:  allItems.filter(i => i.status === 'missing').length,
    review:   allItems.filter(i => i.status === 'review').length,
    ordered:  allItems.filter(i => i.status === 'ordered').length,
  };
  const readiness = Math.round((counts.received / counts.total) * 100);
  const readyColor = readiness >= 80 ? '#3DA866' : readiness >= 60 ? '#E0A23A' : '#D74C3C';
  const readyLabel = readiness >= 80 ? 'Ready to process' : readiness >= 60 ? 'Nearly ready' : 'Incomplete';

  const missingItems = allItems.filter(i => i.status === 'missing' || i.status === 'review');

  const onStatusChange = (itemId, newStatus) => {
    setSections(prev => prev.map(s => ({
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, status: newStatus } : i),
    })));
  };

  const onNoteChange = (itemId, note) => {
    setSections(prev => prev.map(s => ({
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, notes: note } : i),
    })));
  };

  const FILTERS = [
    { id: 'all',      label: 'All',          count: counts.total    },
    { id: 'missing',  label: 'Missing',       count: counts.missing  },
    { id: 'review',   label: 'Needs Review',  count: counts.review   },
    { id: 'ordered',  label: 'Ordered',       count: counts.ordered  },
    { id: 'received', label: 'Received',      count: counts.received },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <PageHeader
        icon="listCheck"
        title="File Review"
        subtitle={`Pre-submission completeness check — ${borrowerName} · ${loanId}`}
        actions={
          <select
            value={loanStatus}
            onChange={e => setLoanStatus(e.target.value)}
            style={{
              height: 34, padding: '0 10px', fontSize: 12.5, fontFamily: 'inherit',
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer',
            }}
          >
            <option>In Processing</option>
            <option>Suspended Pending Documents</option>
            <option>Ready for UW Submission</option>
          </select>
        }
      />

      {/* ── Readiness bar ── */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
          <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--bg-muted)" strokeWidth="5"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke={readyColor} strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - readiness / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: readyColor }}>{readiness}%</div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{readyLabel}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
              background: readyColor + '18', color: readyColor,
            }}>{counts.received} of {counts.total} items complete</span>
          </div>
          {/* Mini stat row */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Missing',      count: counts.missing,  color: '#D74C3C' },
              { label: 'Needs Review', count: counts.review,   color: '#E0A23A' },
              { label: 'Ordered',      count: counts.ordered,  color: '#5B8DF6' },
              { label: 'Received',     count: counts.received, color: '#3DA866' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: s.color }}/>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.count}</strong> {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI insight */}
        {missingItems.length > 0 && (
          <div style={{
            background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
            borderRadius: 9, padding: '10px 13px', maxWidth: 240,
            display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--ai-ink)', lineHeight: 1.4,
          }}>
            <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span>{missingItems.length} item{missingItems.length > 1 ? 's' : ''} need attention before you can submit. {counts.ordered > 0 ? `${counts.ordered} third-party order${counts.ordered > 1 ? 's' : ''} in flight.` : ''}</span>
          </div>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              height: 30, padding: '0 12px', borderRadius: 7, border: 'none',
              background: active ? 'var(--text-primary)' : 'var(--bg-muted)',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontSize: 12.5, fontWeight: active ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}>
              {f.label}
              {f.count > 0 && (
                <span style={{
                  fontSize: 10.5, fontWeight: 700, minWidth: 17, height: 17, borderRadius: 999,
                  background: active ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)',
                  color: active ? '#fff' : 'var(--text-tertiary)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{f.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Sections ── */}
      {sections.map(s => (
        <Section
          key={s.id}
          section={s}
          filter={filter}
          onStatusChange={onStatusChange}
          onNoteChange={onNoteChange}
        />
      ))}

      {/* ── Bottom actions ── */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)',
        padding: '14px 0', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginTop: 8,
      }}>
        {/* Generate needs list */}
        <button
          className="btn btn-outline"
          disabled={missingItems.length === 0}
          style={{ opacity: missingItems.length === 0 ? 0.45 : 1 }}
          onClick={() => setNeedsListOpen(v => !v)}
        >
          <Icon name="doc" size={13}/>
          Generate needs list
          {missingItems.length > 0 && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 999,
              background: 'var(--status-red)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
            }}>{missingItems.length}</span>
          )}
        </button>

        {/* Log review */}
        <button
          className={logged ? 'btn btn-outline' : 'btn btn-primary'}
          onClick={() => setLogged(true)}
          style={logged ? { color: 'var(--status-green)', borderColor: 'var(--status-green)' } : {}}
        >
          {logged
            ? <><Icon name="check" size={13} strokeWidth={2.2}/> Review logged — {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
            : <><Icon name="listCheck" size={13}/> Log file review</>
          }
        </button>

        <div style={{ flex: 1 }}/>

        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          Status: <strong style={{ color: 'var(--text-primary)' }}>{loanStatus}</strong>
        </span>
      </div>

      {/* ── Needs list modal ── */}
      {needsListOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setNeedsListOpen(false)}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 16, padding: '24px', width: 520, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: 'var(--shadow-lg)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Needs List</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {borrowerName} · {loanId} · {new Date().toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => setNeedsListOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <Icon name="x" size={18}/>
              </button>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {missingItems.map((item, i) => {
                const m = STATUS_META[item.status];
                return (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 8,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', width: 16, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <SourceTag source={item.source}/>
                        <span style={{ fontSize: 11, color: m.fg, fontWeight: 600 }}>{m.label}</span>
                        {item.notes && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· {item.notes}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI insight box */}
            <div style={{ background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 10 }}>
              <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }}/>
              <div style={{ fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.5 }}>
                {counts.missing} items are missing and {counts.review} need review. Most can be resolved by the borrower via the portal. Want me to draft a plain-language doc request now?
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ai" style={{ flex: 1, justifyContent: 'center' }}>
                <Icon name="sparkle" size={13}/> Draft doc request
              </button>
              <button className="btn btn-outline" onClick={() => setNeedsListOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileReviewTab;
