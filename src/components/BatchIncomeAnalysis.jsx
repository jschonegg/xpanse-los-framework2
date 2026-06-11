import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icon';
import { StatusPill } from './Shell';

const LOANS = [
  {
    id: 'LN-2024-0234',
    borrower: 'Sarah Anderson',
    initials: 'SA',
    color: '#A8541C',
    status: 'Underwriting',
    qualifying: '$8,750/mo',
    dti: '38%',
    dtiOk: true,
    base: '$105,000',
    overtime: '$7,200',
    otNote: '2-yr avg',
    midScore: 720,
    loanAmt: '$425,000',
    decision: 'DU Approve/Eligible',
    flag: null,
    lines: [
      { label: 'W-2 Base (2025)', value: '$105,000', ok: true },
      { label: 'Overtime (2-yr avg)', value: '$7,200', ok: true },
      { label: 'Gross Monthly', value: '$9,350', ok: true },
      { label: 'Qualifying Income', value: '$8,750/mo', ok: true },
      { label: 'DTI', value: '38%', ok: true },
    ],
  },
  {
    id: 'LN-2024-0189',
    borrower: 'David Chen',
    initials: 'DC',
    color: '#2A8C53',
    status: 'Processing',
    qualifying: '$7,100/mo',
    dti: '43%',
    dtiOk: true,
    base: '$82,000',
    overtime: '$3,200',
    otNote: '1-yr only',
    midScore: 698,
    loanAmt: '$525,000',
    decision: 'DU Approve/Eligible',
    flag: '1-yr overtime may not qualify — needs 2-yr history',
    lines: [
      { label: 'W-2 Base (2025)', value: '$82,000', ok: true },
      { label: 'Overtime (1-yr)', value: '$3,200', ok: false },
      { label: 'Gross Monthly', value: '$7,100', ok: true },
      { label: 'Qualifying Income', value: '$7,100/mo', ok: true },
      { label: 'DTI', value: '43%', ok: true },
    ],
  },
  {
    id: 'LN-2024-0301',
    borrower: 'Emily Rodriguez',
    initials: 'ER',
    color: '#C25535',
    status: 'Underwriting',
    qualifying: '$6,833/mo',
    dti: '41%',
    dtiOk: true,
    base: '$79,000',
    overtime: '$3,000',
    otNote: '2-yr avg',
    midScore: 711,
    loanAmt: '$412,000',
    decision: 'DU Approve/Eligible',
    flag: null,
    lines: [
      { label: 'W-2 Base (2025)', value: '$79,000', ok: true },
      { label: 'Overtime (2-yr avg)', value: '$3,000', ok: true },
      { label: 'Gross Monthly', value: '$6,833', ok: true },
      { label: 'Qualifying Income', value: '$6,833/mo', ok: true },
      { label: 'DTI', value: '41%', ok: true },
    ],
  },
];

function LoanColumn({ loan, approved, flagged, onApprove, onFlag, scanning }) {
  const [scanDone, setScanDone] = React.useState(false);

  React.useEffect(() => {
    if (scanning) {
      const t = setTimeout(() => setScanDone(true), 1200 + Math.random() * 600);
      return () => clearTimeout(t);
    }
  }, [scanning]);

  const borderColor = approved ? 'var(--card-green-border)' : flagged ? 'var(--card-amber-border)' : 'var(--border-subtle)';
  const bgColor = approved ? 'var(--card-green-bg)' : flagged ? 'var(--card-amber-bg)' : 'var(--bg-surface)';

  return (
    <div style={{
      flex: 1, minWidth: 0,
      border: `1.5px solid ${borderColor}`,
      borderRadius: 14,
      background: bgColor,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: loan.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>{loan.initials}</div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>{loan.borrower}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'DM Sans' }}>{loan.id}</div>
          </div>
          {approved && <StatusPill tone="green" style={{ marginLeft: 'auto' }}>Approved</StatusPill>}
          {flagged && <StatusPill tone="amber" style={{ marginLeft: 'auto' }}>Flagged</StatusPill>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip label="Loan" value={loan.loanAmt}/>
          <Chip label="Score" value={loan.midScore}/>
          <Chip label="Status" value={loan.status}/>
        </div>
      </div>

      {/* Income breakdown */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5}/>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ai-ink)' }}>AI Income Analysis</span>
          {scanDone
            ? <span style={{ fontSize: 11, color: 'var(--status-green)', marginLeft: 'auto', fontWeight: 600 }}>✓ Complete</span>
            : <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Scanning…</span>
          }
        </div>

        {!scanDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[80, 60, 70, 55, 45].map((w, i) => (
              <div key={i} style={{ height: 12, borderRadius: 6, background: 'var(--bg-muted)', width: `${w}%`, animation: 'pulse 1.4s ease-in-out infinite' }}/>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {loan.lines.map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{l.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: l.ok ? 'var(--text-primary)' : 'var(--status-amber)' }}>{l.value}</span>
              </div>
            ))}

            <div style={{ marginTop: 4, padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 8, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Qualifying Income</div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{loan.qualifying}</div>
              <div style={{ fontSize: 12, color: loan.dtiOk ? 'var(--status-green)' : 'var(--status-red)', marginTop: 2, fontWeight: 600 }}>
                DTI {loan.dti} — {loan.dtiOk ? 'Within guidelines' : 'Exceeds limit'}
              </div>
            </div>

            {loan.flag && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '9px 11px', background: 'var(--card-amber-bg)', border: '1px solid var(--card-amber-border)', borderRadius: 8, fontSize: 12, color: 'var(--status-amber)', lineHeight: 1.4 }}>
                <Icon name="alertCircle" size={13} color="var(--status-amber)" strokeWidth={1.7} style={{ flexShrink: 0, marginTop: 1 }}/>
                {loan.flag}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {scanDone && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
          {approved ? (
            <div style={{ fontSize: 12.5, color: 'var(--status-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="checkCircle" size={14} color="var(--status-green)"/> Applied to loan file
            </div>
          ) : flagged ? (
            <div style={{ fontSize: 12.5, color: 'var(--status-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="alertCircle" size={14} color="var(--status-amber)"/> Flagged for review
            </div>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onApprove}>
                <Icon name="check" size={13}/> Apply
              </button>
              <button className="btn btn-outline btn-sm" onClick={onFlag} style={{ color: 'var(--status-amber)', borderColor: 'var(--status-amber)' }}>
                <Icon name="alertCircle" size={13}/> Flag
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 6, padding: '4px 8px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

export function BatchIncomeAnalysis({ onClose }) {
  const [approved, setApproved] = React.useState(new Set());
  const [flagged, setFlagged] = React.useState(new Set());
  const [scanning] = React.useState(true);

  const approve = (id) => {
    setApproved(prev => new Set(prev).add(id));
    setFlagged(prev => { const s = new Set(prev); s.delete(id); return s; });
  };
  const flag = (id) => {
    setFlagged(prev => new Set(prev).add(id));
    setApproved(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const allActioned = LOANS.every(l => approved.has(l.id) || flagged.has(l.id));
  const approvedCount = approved.size;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10, 10, 20, 0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 960,
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 18,
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '88vh',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--ai-bg-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="sparkles" size={16} color="var(--ai-primary)" strokeWidth={1.5}/>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Batch Income Analysis</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>3 loans in underwriting · income verification pending</div>
          </div>
          <div style={{ flex: 1 }}/>
          {allActioned && (
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--status-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="checkCircle" size={15} color="var(--status-green)"/>
              {approvedCount} of {LOANS.length} applied
            </div>
          )}
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'var(--bg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Icon name="x" size={15}/>
          </button>
        </div>

        {/* AI context bar */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--ai-bg)',
          borderBottom: '1px solid var(--ai-border)',
          display: 'flex', alignItems: 'center', gap: 9,
          fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.4,
        }}>
          <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5} style={{ flexShrink: 0 }}/>
          I've pulled W-2s and VOE docs for all 3 loans and calculated qualifying income. Review each analysis and apply or flag — applied results write directly to the loan file.
        </div>

        {/* Columns */}
        <div style={{ display: 'flex', gap: 16, padding: 20, overflowY: 'auto', flex: 1 }}>
          {LOANS.map(loan => (
            <LoanColumn
              key={loan.id}
              loan={loan}
              approved={approved.has(loan.id)}
              flagged={flagged.has(loan.id)}
              onApprove={() => approve(loan.id)}
              onFlag={() => flag(loan.id)}
              scanning={scanning}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', flex: 1 }}>
            {allActioned
              ? `Done — ${approvedCount} income calc${approvedCount !== 1 ? 's' : ''} applied to loan files, ${flagged.size} flagged for manual review`
              : `${LOANS.length - approved.size - flagged.size} remaining — approve to apply to loan file or flag for manual review`}
          </span>
          {allActioned && (
            <button className="btn btn-primary" onClick={onClose}>
              <Icon name="check" size={14}/> Done
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default BatchIncomeAnalysis;
