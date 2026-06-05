import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icon';

const LOANS = [
  { id: 'LN-2024-0234', borrower: 'Sarah Anderson', property: '1842 Oak Street, Denver CO', status: 'Underwriting', amount: '$425K', health: 90, initials: 'SA', color: '#A8541C' },
  { id: 'LN-2024-0245', borrower: 'Michael Oben',   property: '3156 Maple Ave, Seattle WA',  status: 'Approval',    amount: '$680K', health: 93, initials: 'MO', color: '#A8541C' },
  { id: 'LN-2024-0211', borrower: 'Jennifer Wang',  property: '892 Cedar Lane, Austin TX',   status: 'Closing',     amount: '$780K', health: 53, initials: 'JW', color: '#3A6BAD' },
  { id: 'LN-2024-0189', borrower: 'David Chen',     property: '511 Birch Rd, Portland OR',   status: 'Processing',  amount: '$525K', health: 49, initials: 'DC', color: '#2A8C53' },
  { id: 'LN-2024-0267', borrower: 'Marcus Johnson', property: '74 Pine Ridge, Boise ID',     status: 'Application', amount: '$345K', health: 62, initials: 'MJ', color: '#7B3FA0' },
  { id: 'LN-2024-0301', borrower: 'Emily Rodriguez',property: '2210 Elm Court, Phoenix AZ',  status: 'Underwriting',amount: '$412K', health: 91, initials: 'ER', color: '#C25535' },
  { id: 'LN-2024-0312', borrower: 'Thomas Park',    property: '88 River Walk, Nashville TN', status: 'Processing',  amount: '$295K', health: 83, initials: 'TP', color: '#3A8294' },
  { id: 'LN-2024-0289', borrower: 'Rachel Kim',     property: '1455 Hillside Dr, Denver CO', status: 'Approval',    amount: '$590K', health: 97, initials: 'RK', color: '#7B3FA0' },
];

const LOAN_ACTIONS = [
  { id: 'now',        icon: 'target',    label: 'Now',              desc: 'AI-guided next steps',         tab: 'now' },
  { id: 'conditions', icon: 'listCheck', label: 'Conditions',       desc: '4 open · 2 blocking',          tab: 'conditions' },
  { id: 'aus',        icon: 'zap',       label: 'AUS Findings',     desc: 'DU Approve/Eligible',          tab: 'aus' },
  { id: 'pricing',    icon: 'dollar',    label: 'Pricing & Lock',   desc: 'Rate lock and pricing tools',  tab: 'pricing' },
  { id: 'closing',    icon: 'calculator',label: 'Closing',          desc: 'CD, wire, and closing tools',  tab: 'closing' },
  { id: 'audit',      icon: 'fileSearch',label: 'Audit Log',        desc: 'Change history and trail',     tab: 'audit' },
];

const statusColor = {
  Underwriting: '#3A6BAD', Approval: '#2A8C53', Closing: '#2A8C53',
  Processing: '#9C6A1A', Application: '#888',
};

function healthColor(s) { return s >= 75 ? '#3DB371' : s >= 50 ? '#E0A23A' : '#D74C3C'; }

// Recent loans stored in localStorage
const RECENT_KEY = 'los-recent-loans';
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
}
function pushRecent(loanId) {
  const prev = getRecent().filter(id => id !== loanId);
  localStorage.setItem(RECENT_KEY, JSON.stringify([loanId, ...prev].slice(0, 3)));
}

function exportCSV() {
  const headers = ['ID', 'Borrower', 'Property', 'Status', 'Amount', 'Health Score'];
  const rows = LOANS.map(l => [l.id, l.borrower, l.property, l.status, l.amount, l.health]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function CommandPalette({ onClose, onNavigate, onOpenLoan, onOpenAi, onOpenURLA }) {
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [mode, setMode] = React.useState('root'); // root | loan | new-loan
  const [selectedLoan, setSelectedLoan] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [newLoanName, setNewLoanName] = React.useState('');
  const [newLoanAmount, setNewLoanAmount] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, [mode]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // Build result list
  const results = React.useMemo(() => {
    if (mode === 'loan' && selectedLoan) {
      return LOAN_ACTIONS.map(a => ({ type: 'loan-action', ...a, loan: selectedLoan }));
    }
    if (mode === 'new-loan') return [];

    const q = query.toLowerCase().trim();
    const items = [];

    if (!q) {
      // Recent loans first
      const recentIds = getRecent();
      const recentLoans = recentIds.map(id => LOANS.find(l => l.id === id)).filter(Boolean);
      if (recentLoans.length) items.push(...recentLoans.map(l => ({ type: 'loan', recent: true, ...l })));

      // Quick actions
      items.push(
        { type: 'action', id: 'new-loan',  icon: 'plus',      label: 'New Loan',              desc: 'Start a new loan application', shortcut: 'N', category: 'Actions' },
        { type: 'action', id: 'pipeline',  icon: 'pipeline',  label: 'Go to Pipeline',        desc: 'View all 8 active loans',      shortcut: 'P', category: 'Navigate' },
        { type: 'action', id: 'home',      icon: 'home',      label: 'Go to Home',            desc: 'Dashboard and daily summary',  shortcut: 'H', category: 'Navigate' },
        { type: 'action', id: 'coach',     icon: 'sparkles',  label: 'Open AI Coach',         desc: '4 AI-ready actions waiting',   shortcut: '',  category: 'AI' },
        { type: 'action', id: 'at-risk',   icon: 'alertCircle',label: 'Show At-Risk Loans',   desc: '3 loans with health score < 65', shortcut: '', category: 'Actions' },
        { type: 'action', id: 'export',    icon: 'download',  label: 'Export Pipeline to CSV',desc: 'Download all 8 loans',         shortcut: '',  category: 'Actions' },
      );

      // All loans (excluding recent already shown)
      const shownIds = new Set(getRecent());
      items.push(...LOANS.filter(l => !shownIds.has(l.id)).map(l => ({ type: 'loan', ...l })));
    } else {
      const matchedActions = [
        { id: 'new-loan',  icon: 'plus',       label: 'New Loan',               desc: 'Start a new loan application',   shortcut: 'N', category: 'Actions' },
        { id: 'pipeline',  icon: 'pipeline',   label: 'Go to Pipeline',         desc: 'View all 8 active loans',        shortcut: 'P', category: 'Navigate' },
        { id: 'home',      icon: 'home',       label: 'Go to Home',             desc: 'Dashboard and daily summary',    shortcut: 'H', category: 'Navigate' },
        { id: 'coach',     icon: 'sparkles',   label: 'Open AI Coach',          desc: '4 AI-ready actions waiting',     shortcut: '',  category: 'AI' },
        { id: 'at-risk',   icon: 'alertCircle',label: 'Show At-Risk Loans',     desc: '3 loans with health score < 65', shortcut: '',  category: 'Actions' },
        { id: 'export',    icon: 'download',   label: 'Export Pipeline to CSV', desc: 'Download all 8 loans',           shortcut: '',  category: 'Actions' },
      ].filter(a => a.label.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));

      const matchedLoans = LOANS.filter(l =>
        l.borrower.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.property.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
      );
      items.push(...matchedActions.map(a => ({ type: 'action', ...a })));
      items.push(...matchedLoans.map(l => ({ type: 'loan', ...l })));
    }
    return items;
  }, [query, mode, selectedLoan]);

  React.useEffect(() => { setActiveIdx(0); }, [results]);

  const select = (item) => {
    if (item.type === 'action') {
      if (item.id === 'pipeline') { onClose(); onNavigate('pipeline'); }
      else if (item.id === 'home') { onClose(); onNavigate('home'); }
      else if (item.id === 'new-loan') { setMode('new-loan'); setQuery(''); }
      else if (item.id === 'coach') { onClose(); if (onOpenAi) onOpenAi(null); }
      else if (item.id === 'at-risk') { onClose(); onNavigate('home'); }
      else if (item.id === 'export') { exportCSV(); showToast('Exported pipeline-' + new Date().toISOString().slice(0,10) + '.csv'); }
    } else if (item.type === 'loan') {
      pushRecent(item.id);
      setSelectedLoan(item);
      setMode('loan');
      setQuery('');
    } else if (item.type === 'loan-action') {
      onClose();
      onOpenLoan(item.loan.id, item.tab);
    }
  };

  const handleKey = (e) => {
    if (mode === 'new-loan') {
      if (e.key === 'Escape') { setMode('root'); setNewLoanName(''); setNewLoanAmount(''); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) select(results[activeIdx]);
    if (e.key === 'Escape') {
      if (mode === 'loan') { setMode('root'); setSelectedLoan(null); setQuery(''); }
      else onClose();
    }
    if (e.key === 'Backspace' && query === '' && mode === 'loan') {
      setMode('root'); setSelectedLoan(null);
    }
  };

  // Group display
  const groups = React.useMemo(() => {
    if (mode === 'loan') return [{ label: `Actions — ${selectedLoan?.borrower}`, items: results }];
    if (mode === 'new-loan') return [];

    const q = query.toLowerCase().trim();
    if (q) {
      const actions = results.filter(r => r.type === 'action');
      const loans   = results.filter(r => r.type === 'loan');
      const g = [];
      if (actions.length) g.push({ label: 'Actions', items: actions });
      if (loans.length)   g.push({ label: 'Loans', items: loans });
      return g;
    }

    const recent  = results.filter(r => r.recent);
    const actions = results.filter(r => r.type === 'action');
    const loans   = results.filter(r => r.type === 'loan' && !r.recent);
    const g = [];
    if (recent.length)  g.push({ label: 'Recent', items: recent });
    if (actions.length) g.push({ label: 'Actions', items: actions });
    if (loans.length)   g.push({ label: 'All Loans', items: loans });
    return g;
  }, [results, mode, selectedLoan, query]);

  let globalIdx = 0;

  const placeholder =
    mode === 'loan'     ? `Actions for ${selectedLoan?.borrower}…` :
    mode === 'new-loan' ? '' :
    'Search loans, borrowers, actions…';

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={onClose}/>

      <div style={{ position: 'relative', zIndex: 1, width: 640, maxHeight: 520, background: 'var(--bg-surface)', borderRadius: 14, boxShadow: '0 32px 80px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.12)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Icon name={mode === 'new-loan' ? 'plus' : 'search'} size={16} color="var(--text-tertiary)"/>

          {/* Breadcrumb chips */}
          {mode === 'loan' && selectedLoan && (
            <button onClick={() => { setMode('root'); setSelectedLoan(null); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '3px 8px', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            >
              <span style={{ width: 16, height: 16, borderRadius: 4, background: selectedLoan.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>{selectedLoan.initials}</span>
              {selectedLoan.borrower}
              <Icon name="x" size={11} color="var(--text-tertiary)"/>
            </button>
          )}
          {mode === 'new-loan' && (
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>New Loan</span>
          )}

          {mode !== 'new-loan' && (
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholder}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
          )}
          {mode === 'new-loan' && <div style={{ flex: 1 }}/>}
          <kbd style={{ fontFamily: 'DM Mono', fontSize: 11, padding: '2px 6px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 5, color: 'var(--text-tertiary)', flexShrink: 0 }}>ESC</kbd>
        </div>

        {/* New Loan inline form */}
        {mode === 'new-loan' && (
          <NewLoanForm
            name={newLoanName} setName={setNewLoanName}
            amount={newLoanAmount} setAmount={setNewLoanAmount}
            onSubmit={() => {
              if (onOpenURLA) { onOpenURLA(newLoanName.trim() || 'New Borrower'); }
              else { onClose(); onNavigate('pipeline'); }
            }}
            onCancel={() => { setMode('root'); setNewLoanName(''); setNewLoanAmount(''); }}
          />
        )}

        {/* Results */}
        {mode !== 'new-loan' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
            {groups.length === 0 && query && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                No results for "<strong>{query}</strong>"
              </div>
            )}
            {groups.map(group => (
              <div key={group.label}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 10px 4px' }}>
                  {group.label}
                </div>
                {group.items.map(item => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIdx;
                  return (
                    <ResultRow key={item.id + (item.loan?.id || '')} item={item} active={isActive} onHover={() => setActiveIdx(idx)} onSelect={() => select(item)}/>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {mode !== 'new-loan' && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            <KbdHint keys="↑↓" label="navigate"/>
            <KbdHint keys="↵" label="select"/>
            {mode === 'loan' && <KbdHint keys="⌫" label="back"/>}
            <div style={{ flex: 1 }}/>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="sparkle" size={11} color="var(--ai-primary)" strokeWidth={1.5}/>
              AI-powered search
            </span>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{ position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: '#fff', fontSize: 12.5, fontWeight: 500, padding: '8px 16px', borderRadius: 8, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 10 }}>
            {toast}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function NewLoanForm({ name, setName, amount, setAmount, onSubmit, onCancel }) {
  const nameRef = React.useRef(null);
  React.useEffect(() => { nameRef.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key === 'Escape') onCancel();
    if (e.key === 'Enter' && name.trim()) onSubmit();
  };

  return (
    <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Enter the borrower's name to create a new loan application.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Borrower Name</label>
          <input
            ref={nameRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. James Whitfield"
            style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', background: 'var(--bg-surface)', boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--ai-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
          />
        </div>
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan Amount <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. $450,000"
            style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', background: 'var(--bg-surface)', boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--ai-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: name.trim() ? 1 : 0.45, cursor: name.trim() ? 'pointer' : 'not-allowed' }} onClick={() => name.trim() && onSubmit()} disabled={!name.trim()}>
          <Icon name="plus" size={14} strokeWidth={2.2}/> Create Loan
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <Icon name="sparkle" size={11} color="var(--ai-primary)" strokeWidth={1.5}/>
        AI will pre-fill property, income, and credit fields from the application once created.
      </div>
    </div>
  );
}

function KbdHint({ keys, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <kbd style={{ fontFamily: 'DM Mono', fontSize: 10, padding: '1px 5px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>{keys}</kbd>
      {label}
    </span>
  );
}

function ResultRow({ item, active, onHover, onSelect }) {
  const base = { display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', background: active ? 'var(--bg-muted)' : 'transparent', transition: 'background 0.08s' };

  if (item.type === 'loan') {
    const hc = healthColor(item.health);
    return (
      <div style={base} onMouseEnter={onHover} onClick={onSelect}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: item.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {item.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{item.borrower}</span>
            {item.recent && <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', padding: '1px 6px', borderRadius: 4 }}>Recent</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'DM Mono', fontSize: 11 }}>{item.id}</span>
            <span style={{ margin: '0 5px' }}>·</span>
            {item.property}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: statusColor[item.status] || '#888', background: (statusColor[item.status] || '#888') + '18', padding: '2px 8px', borderRadius: 999 }}>
            {item.status}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 32, height: 4, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
              <div style={{ width: `${item.health}%`, height: '100%', background: hc, borderRadius: 999 }}/>
            </div>
            <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: hc, fontWeight: 600 }}>{item.health}</span>
          </div>
          <Icon name="chevronRight" size={13} color="var(--text-tertiary)" strokeWidth={2}/>
        </div>
      </div>
    );
  }

  if (item.type === 'loan-action') {
    return (
      <div style={base} onMouseEnter={onHover} onClick={onSelect}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-muted)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={item.icon} size={15} strokeWidth={1.7}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{item.desc}</div>
        </div>
        <Icon name="arrowRight" size={13} color="var(--text-tertiary)" strokeWidth={2}/>
      </div>
    );
  }

  // quick action
  const isAI = item.id === 'coach';
  return (
    <div style={base} onMouseEnter={onHover} onClick={onSelect}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: isAI ? 'var(--ai-bg-strong)' : 'var(--bg-muted)', color: isAI ? 'var(--ai-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={item.icon} size={15} strokeWidth={1.7}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{item.desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {item.shortcut && (
          <kbd style={{ fontFamily: 'DM Mono', fontSize: 11, padding: '2px 6px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 5, color: 'var(--text-tertiary)' }}>⌘{item.shortcut}</kbd>
        )}
        <Icon name="arrowRight" size={13} color="var(--text-tertiary)" strokeWidth={2}/>
      </div>
    </div>
  );
}
