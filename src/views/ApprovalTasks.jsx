import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { TaskCard, AIInsight, ProgressRing, StatGrid } from '../components/TaskCard';
import { LOANS } from '../data/loans';

// Tasks tab for a loan in Approval (shown for every persona). Surfaces the
// conditional-approval decision, prior-to-funding condition progress, and a
// rate-lock-expiry nudge. Built on the shared TaskCard kit + design tokens and
// driven entirely by the opened loan's data.

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Representative PTF condition templates. Counts come from the loan; the
// specific items are illustrative for the demo.
const PTF_POOL = [
  { title: 'Updated VOE — within 10 days of closing', owner: 'processor', due: 'Jun 8' },
  { title: 'Signed CD acknowledgment from borrower',  owner: 'borrower',  due: 'Jun 5' },
  { title: 'Hazard insurance binder for full coverage', owner: 'processor', due: 'Jun 10' },
  { title: 'Final appraisal review sign-off',         owner: 'processor', due: 'Jun 10' },
  { title: 'Verification of funds to close',          owner: 'borrower',  due: 'Jun 9' },
  { title: 'Title commitment — updated effective date', owner: 'processor', due: 'Jun 11' },
];

const OWNER_META = {
  processor: { label: 'Processor', fg: 'var(--status-blue)',  bg: 'var(--status-blue-bg)' },
  borrower:  { label: 'Borrower',  fg: 'var(--status-amber)', bg: 'var(--status-amber-bg)' },
};

export function ApprovalTasks({ loanId }) {
  const loan = LOANS.find(l => l.id === loanId)
    || LOANS.find(l => l.status === 'Approval')
    || LOANS[0];

  const [lockExtended, setLockExtended] = React.useState(false);
  const [lockModalOpen, setLockModalOpen] = React.useState(false);
  const [selectedExtension, setSelectedExtension] = React.useState(null);

  const total    = loan.conditionsTotal || 0;
  const openN    = loan.conditionsOpen || 0;
  const clearedN = Math.max(0, total - openN);
  const clearPct = total ? (clearedN / total) * 100 : 100;

  const openItems    = PTF_POOL.slice(0, Math.min(openN, 4));
  const clearedItems = PTF_POOL.slice(0, Math.min(clearedN, 4));
  const openMore     = Math.max(0, openN - openItems.length);
  const clearedMore  = Math.max(0, clearedN - clearedItems.length);

  const lockExpiring = !lockExtended && loan.lockStatus && loan.lockStatus !== 'Floating'
    && (loan.lockStatus === 'Expiring' || (loan.lockDays != null && loan.lockDays <= 5));
  const repriceRate  = loan.rate != null ? (Number(loan.rate) + 0.4).toFixed(3) : null;
  const repriceDelta = loan.estPI ? `+$${Math.round(loan.estPI * 0.05).toLocaleString()}/mo` : 'a higher payment';
  const ausApprove   = loan.aus && /approve/i.test(loan.aus);

  const terms = [
    { label: 'Loan Amount', value: loan.amount != null ? `$${loan.amount.toLocaleString()}` : '—' },
    { label: 'Product',     value: loan.product || '—' },
    { label: 'Rate',        value: loan.rate != null ? `${loan.rate}%` : '—' },
    { label: 'LTV',         value: loan.ltv != null ? `${loan.ltv}%` : '—' },
    { label: 'DTI',         value: loan.dti != null ? `${loan.dti}%` : '—' },
    { label: 'FICO',        value: loan.credit?.fico ?? '—' },
  ];

  return (
    <>
      {/* Lock-expiry nudge */}
      {lockExpiring && (
        <TaskCard
          tone="amber"
          icon="lock"
          title={`Rate lock expires in ${loan.lockDays} day${loan.lockDays === 1 ? '' : 's'}`}
          subtitle={repriceRate
            ? `${loan.product || 'Loan'} · ${loan.rate}% locked. Without extension it reprices to ${repriceRate}% (${repriceDelta}).`
            : 'Extend the lock to preserve the current rate.'}
          pill={`${loan.lockDays}d left`}
          pillTone="red"
          footer={
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setLockModalOpen(true)}>
                <Icon name="lock" size={13}/> Extend lock
              </button>
              <button className="btn btn-outline btn-sm">Float-down options</button>
            </>
          }
        />
      )}

      {lockExtended && (
        <TaskCard
          tone="green"
          icon="checkCircle"
          title="Rate lock extended"
          subtitle={`${selectedExtension}-day extension confirmed · ${selectedExtension === 30 ? '$850' : '$425'} fee logged to file`}
          pill="Locked"
          pillTone="green"
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: (lockExpiring || lockExtended) ? 16 : 0 }}>

        {/* Conditional approval decision */}
        <TaskCard
          tone="green"
          icon="checkCircle"
          title="Conditional Approval"
          subtitle={`${loan.milestone || 'Approved'} · UW: ${loan.assignee || '—'}`}
          pill={ausApprove ? 'DU Approve / Eligible' : (loan.aus || 'Approved')}
          pillTone="green"
          collapsible
          footer={
            <>
              <button className="btn btn-outline btn-sm">View approval letter</button>
              <button className="btn btn-outline btn-sm">Full UW decision</button>
            </>
          }
        >
          <StatGrid items={terms} cols={6}/>
          <AIInsight>
            {loan.borrower}'s file is clean — DTI at {loan.dti}% is inside guideline and the appraisal supports value.
            Underwriting issued conditional approval with {total} prior-to-funding condition{total === 1 ? '' : 's'};
            closing targets {fmtDate(loan.closingDate)}. No surprises expected.
          </AIInsight>
        </TaskCard>

        {/* Prior-to-funding conditions — collapsible, loan-driven counts */}
        <TaskCard
          tone={openN === 0 ? 'green' : 'amber'}
          iconNode={<ProgressRing pct={clearPct} size={34} stroke={4}/>}
          title="Prior-to-Funding Conditions"
          subtitle={`${clearedN} cleared · ${openN} open${loan.closingDate ? ` · on track for ${fmtDate(loan.closingDate)}` : ''}`}
          collapsible
          defaultOpen={false}
        >
          <div>
              {/* Linear progress */}
              <div style={{ height: 4, background: 'var(--bg-muted)', borderRadius: 999, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: 'var(--status-green)', width: `${clearPct}%`, transition: 'width 0.5s ease' }}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Cleared */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--status-green)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Cleared ({clearedN})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {clearedItems.map(c => (
                      <div key={c.title} style={{ padding: '8px 10px', background: 'var(--card-green-bg)', border: '1px solid var(--card-green-border)', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--status-green)', lineHeight: 1.35 }}>{c.title}</div>
                      </div>
                    ))}
                    {clearedN === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>None cleared yet.</div>}
                    {clearedMore > 0 && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>+{clearedMore} more</div>}
                  </div>
                </div>

                {/* Open */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--status-amber)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    In progress ({openN})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {openItems.map(c => {
                      const o = OWNER_META[c.owner];
                      return (
                        <div key={c.title} style={{ padding: '8px 10px', background: 'var(--card-amber-bg)', border: '1px solid var(--card-amber-border)', borderRadius: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--status-amber)', lineHeight: 1.35 }}>{c.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: o.bg, color: o.fg }}>{o.label}</span>
                            <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>Due {c.due}</span>
                          </div>
                        </div>
                      );
                    })}
                    {openN === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>All conditions cleared.</div>}
                    {openMore > 0 && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>+{openMore} more</div>}
                  </div>
                </div>
              </div>

              <AIInsight>
                {openN === 0
                  ? 'All prior-to-funding conditions are cleared — the file is ready for the closing department.'
                  : `At the current pace, the remaining ${openN} condition${openN === 1 ? '' : 's'} clear before closing. Blocking items are flagged for the processor and ${loan.borrower}.`}
              </AIInsight>
            </div>
        </TaskCard>

      </div>

      {/* Lock-extension modal */}
      {lockModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,21,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.target === e.currentTarget && setLockModalOpen(false)}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 16, width: 420, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Extend rate lock</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 3 }}>{loan.borrower} · {loan.id} · Currently {loan.rate}%</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 14 }}>
                Lock expires in <b style={{ color: 'var(--status-amber)' }}>{loan.lockDays} days</b>. Select an extension term:
              </div>
              {[
                { days: 15, fee: '$425', note: '7-day buffer before closing' },
                { days: 30, fee: '$850', note: 'Recommended — wider buffer' },
              ].map(opt => {
                const on = selectedExtension === opt.days;
                return (
                  <div key={opt.days} onClick={() => setSelectedExtension(opt.days)} style={{
                    padding: '14px 16px', borderRadius: 10, marginBottom: 10, cursor: 'pointer',
                    border: `2px solid ${on ? 'var(--ai-primary)' : 'var(--border-subtle)'}`,
                    background: on ? 'var(--ai-bg)' : 'var(--bg-app)', transition: 'all 0.12s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{opt.days}-day extension</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ai-ink)' }}>{opt.fee}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{opt.note}</div>
                  </div>
                );
              })}
              <div style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                The extension fee is logged to the loan file and disclosed on the CD amendment. The {loan.rate}% rate is preserved.
              </div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setLockModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2, opacity: selectedExtension ? 1 : 0.5, pointerEvents: selectedExtension ? 'auto' : 'none' }}
                onClick={() => { setLockExtended(true); setLockModalOpen(false); }}>
                Confirm extension{selectedExtension ? ` — ${selectedExtension === 15 ? '$425' : '$850'}` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApprovalTasks;
