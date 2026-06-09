import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { StageTimelineStrip } from '../components/WorkspaceCards';

function ActionCard({ tone = 'neutral', icon, iconBg, header, children, footer }) {
  const tones = {
    red:     { bg: 'var(--card-red-bg)',   border: 'var(--card-red-border)' },
    green:   { bg: 'var(--card-green-bg)', border: 'var(--card-green-border)' },
    amber:   { bg: 'var(--card-amber-bg)', border: 'var(--card-amber-border)' },
    neutral: { bg: 'var(--bg-surface)',    border: 'var(--border-subtle)' },
    ai:      { bg: 'var(--ai-bg)',         border: 'var(--ai-border)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, display: 'flex', gap: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: iconBg || 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {header}
        {children}
        {footer && <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </div>
  );
}

function AIInsight({ children }) {
  return (
    <div style={{ marginTop: 12, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.45 }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
      <span>{children}</span>
    </div>
  );
}

function CardHeader({ title, pill, pillTone = 'blue', eta }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
      <span style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</span>
      {pill && <StatusPill tone={pillTone}>{pill}</StatusPill>}
      {eta && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-tertiary)' }}><Icon name="clock" size={12}/>{eta}</span>}
    </div>
  );
}

const STEPS = [
  { id: 'review',     label: 'Review Approval' },
  { id: 'ptf',        label: 'PTF Conditions' },
  { id: 'finaldocs',  label: 'Final Docs' },
  { id: 'ctc',        label: 'Clear to Close' },
  { id: 'notify',     label: 'Notify Parties' },
];

const PTF_CONDITIONS = [
  { id: 'P-001', title: 'Updated VOE — within 10 days of closing', due: 'Jun 8', blocking: true },
  { id: 'P-002', title: 'Signed CD acknowledgment from borrower', due: 'Jun 5', blocking: true },
  { id: 'P-003', title: 'Hazard insurance binder — $680,000 coverage', due: 'Jun 10', blocking: false },
  { id: 'P-004', title: 'Final appraisal review sign-off', due: 'Jun 10', blocking: false },
];

export function NowTabApproval({ borrowerName = 'Michael Oben', loanId = 'LN-2024-0245', loan }) {
  const [completed, setCompleted] = React.useState(new Set());
  const [clearedPTF, setClearedPTF] = React.useState(new Set());
  const [advanced, setAdvanced] = React.useState(false);

  const complete = (id) => setCompleted(prev => new Set(prev).add(id));
  const done = (id) => completed.has(id);
  const clearPTF = (id) => setClearedPTF(prev => new Set(prev).add(id));

  const remaining = STEPS.filter(s => !completed.has(s.id)).length;
  const allDone = remaining === 0;
  const openPTF = PTF_CONDITIONS.filter(c => !clearedPTF.has(c.id));
  const ptfDone = openPTF.length === 0;

  if (advanced) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name="checkCircle" size={26} strokeWidth={1.85}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Clear to Close Issued</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6, maxWidth: 400, margin: '8px auto 0' }}>
          {borrowerName}'s loan is clear to close. All parties have been notified and the closing is scheduled for June 12.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Approval Stage</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Path to Clear to Close — {remaining} of {STEPS.length} steps remaining
          </div>
        </div>
      </div>

      <StageTimelineStrip steps={STEPS} completed={completed}/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 1. REVIEW CONDITIONAL APPROVAL */}
        <ActionCard
          tone={done('review') ? 'green' : 'neutral'}
          icon={<Icon name="fileSearch" size={18} color={done('review') ? '#1F7A45' : '#5246C7'} strokeWidth={1.7}/>}
          iconBg={done('review') ? 'rgba(223,241,229,0.9)' : 'var(--ai-bg-strong)'}
          header={<CardHeader title={done('review') ? 'Conditional Approval Reviewed ✓' : 'Review Conditional Approval'} pill={done('review') ? 'Approved' : 'Action needed'} pillTone={done('review') ? 'green' : 'blue'} eta={done('review') ? undefined : '~2 min'}/>}
          footer={done('review') ? (
            <button className="btn btn-outline btn-sm">View approval letter</button>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('review')}>
                <Icon name="check" size={13}/> Acknowledge Approval
              </button>
              <button className="btn btn-outline btn-sm">View full decision</button>
            </>
          )}
        >
          {!done('review') && (
            <AIInsight>
              Conditional approval issued by underwriting. Loan amount: $680,000, Conv 30yr, 7.125% rate locked through May 24. 4 prior-to-funding conditions remain — 2 blocking, 2 non-blocking. Closing target: June 12.
            </AIInsight>
          )}
        </ActionCard>

        {/* 2. CLEAR PTF CONDITIONS */}
        <ActionCard
          tone={done('ptf') ? 'green' : done('review') ? (ptfDone ? 'green' : 'amber') : 'neutral'}
          icon={<Icon name="listCheck" size={18} color={done('ptf') ? '#1F7A45' : done('review') ? '#9C6A1A' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('ptf') ? 'rgba(223,241,229,0.9)' : done('review') ? '#F6E6BD' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('ptf') ? 'PTF Conditions Cleared ✓' : 'Clear Prior-to-Funding Conditions'}
            pill={done('ptf') ? 'All clear' : done('review') ? `${openPTF.length} remaining` : 'Waiting on approval review'}
            pillTone={done('ptf') ? 'green' : done('review') ? 'amber' : 'neutral'}
          />}
          footer={done('ptf') ? (
            <button className="btn btn-outline btn-sm">View conditions log</button>
          ) : done('review') ? (
            ptfDone ? (
              <button className="btn btn-primary btn-sm" onClick={() => complete('ptf')}>
                <Icon name="check" size={13}/> Mark PTF Conditions Cleared
              </button>
            ) : null
          ) : null}
        >
          {!done('ptf') && done('review') && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {openPTF.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-surface)', border: `1px solid ${c.blocking ? 'var(--card-red-border)' : 'var(--border-subtle)'}`, borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>Due {c.due}</div>
                    </div>
                    {c.blocking && <StatusPill tone="red">Blocking</StatusPill>}
                    <button className="btn btn-success btn-sm" onClick={() => clearPTF(c.id)}>
                      <Icon name="check" size={12} strokeWidth={2.5}/> Clear
                    </button>
                  </div>
                ))}
              </div>
              {!ptfDone && <AIInsight>P-001 (VOE) and P-002 (CD acknowledgment) are blocking conditions. {borrowerName} has been notified via borrower portal. Rate lock expires May 24 — prioritize P-001 to avoid extension fees.</AIInsight>}
              {ptfDone && <AIInsight>All PTF conditions cleared. Ready to confirm final loan docs.</AIInsight>}
            </div>
          )}
          {!done('ptf') && !done('review') && (
            <AIInsight>Review the conditional approval letter first to unlock PTF condition tracking.</AIInsight>
          )}
        </ActionCard>

        {/* 3. CONFIRM FINAL DOCS */}
        <ActionCard
          tone={done('finaldocs') ? 'green' : done('ptf') ? 'ai' : 'neutral'}
          icon={<Icon name="doc" size={18} color={done('finaldocs') ? '#1F7A45' : done('ptf') ? 'var(--ai-primary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('finaldocs') ? 'rgba(223,241,229,0.9)' : done('ptf') ? 'var(--ai-bg-strong)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('finaldocs') ? 'Final Docs Confirmed ✓' : 'Confirm Final Loan Documents'}
            pill={done('finaldocs') ? 'Complete' : done('ptf') ? 'Ready to review' : 'Waiting on PTF conditions'}
            pillTone={done('finaldocs') ? 'green' : done('ptf') ? 'ai' : 'neutral'}
            eta={done('finaldocs') ? undefined : done('ptf') ? '~3 min' : undefined}
          />}
          footer={done('finaldocs') ? (
            <button className="btn btn-outline btn-sm">View closing package</button>
          ) : done('ptf') ? (
            <>
              <button className="btn btn-ai btn-sm" onClick={() => complete('finaldocs')}>
                <Icon name="sparkle" size={13}/> AI Doc Validation
              </button>
              <button className="btn btn-outline btn-sm">Manual review</button>
            </>
          ) : null}
        >
          {!done('finaldocs') && done('ptf') && (
            <AIInsight>
              AI has pre-checked the closing package: Note, Deed of Trust, and CD all match loan terms. 1 discrepancy flagged — CD seller credit ($3,500) differs from final HUD by $12. Review before issuing CTC.
            </AIInsight>
          )}
          {!done('finaldocs') && !done('ptf') && (
            <AIInsight>Final doc review unlocks after all PTF conditions are cleared.</AIInsight>
          )}
        </ActionCard>

        {/* 4. ISSUE CLEAR TO CLOSE */}
        <ActionCard
          tone={done('ctc') ? 'green' : done('finaldocs') ? 'neutral' : 'neutral'}
          icon={<Icon name="checkCircle" size={18} color={done('ctc') ? '#1F7A45' : done('finaldocs') ? '#2A8C53' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('ctc') ? 'rgba(223,241,229,0.9)' : done('finaldocs') ? 'rgba(223,241,229,0.6)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('ctc') ? 'Clear to Close Issued ✓' : 'Issue Clear to Close'}
            pill={done('ctc') ? 'CTC Issued' : done('finaldocs') ? 'Ready' : 'Waiting on docs'}
            pillTone={done('ctc') ? 'green' : done('finaldocs') ? 'green' : 'neutral'}
          />}
          footer={done('ctc') ? (
            <button className="btn btn-outline btn-sm">View CTC letter</button>
          ) : done('finaldocs') ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('ctc')}>
                <Icon name="send" size={13}/> Issue CTC
              </button>
              <button className="btn btn-ghost">Hold — needs review</button>
            </>
          ) : null}
        >
          {!done('ctc') && done('finaldocs') && (
            <AIInsight>
              All conditions cleared, docs validated. {borrowerName}'s loan is ready for Clear to Close. CTC letter will be auto-generated and sent to borrower, title, and realtor.
            </AIInsight>
          )}
        </ActionCard>

        {/* 5. NOTIFY BORROWER & AGENTS */}
        {done('ctc') && (
          <ActionCard
            tone={done('notify') ? 'green' : 'ai'}
            icon={<Icon name="send" size={18} color={done('notify') ? '#1F7A45' : 'var(--ai-primary)'} strokeWidth={1.5}/>}
            iconBg={done('notify') ? 'rgba(223,241,229,0.9)' : 'var(--ai-bg-strong)'}
            header={<CardHeader title={done('notify') ? 'All Parties Notified ✓' : 'Notify Borrower & Agents'} pill={done('notify') ? 'Sent' : 'Ready'} pillTone={done('notify') ? 'green' : 'ai'}/>}
            footer={done('notify') ? undefined : (
              <>
                <button className="btn btn-ai" onClick={() => { complete('notify'); setAdvanced(true); }}>
                  <Icon name="send" size={14}/> Send CTC + Schedule Closing
                </button>
                <button className="btn btn-ghost">Preview notifications</button>
              </>
            )}
          >
            {!done('notify') && (
              <AIInsight>
                I'll send the CTC letter to {borrowerName}, confirmation to the listing and buyer's agents, and wire instructions to the title company. Closing is set for June 12 at 2:00 PM — I can add this to all calendars automatically.
              </AIInsight>
            )}
          </ActionCard>
        )}

      </div>
    </>
  );
}

export default NowTabApproval;
