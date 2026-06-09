import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { StageTimelineStrip } from '../components/WorkspaceCards';

// Gradient-header + white-body card, matching the LOApprovalView
// "Conditional Approval" card. Tone drives the header bg only; body is white.
function ActionCard({ tone = 'neutral', icon, iconBg, header, children, footer, isActive, isWaiting }) {
  const tones = {
    red:     { bg: 'linear-gradient(90deg, #FEE2E2, #FEF2F2)', border: '#FECACA' },
    green:   { bg: 'linear-gradient(90deg, #E7F8F1, #F0FDF4)', border: '#A7F3D0' },
    amber:   { bg: 'linear-gradient(90deg, #FEF6E7, #FFF8F0)', border: '#FDE9C2' },
    blue:    { bg: 'linear-gradient(90deg, #EEF3FE, #F5F8FF)', border: '#C7D2FE' },
    ai:      { bg: 'linear-gradient(90deg, #F4F1FE, #FAF8FF)', border: '#E4DEFA' },
    neutral: { bg: 'var(--bg-muted)',                          border: 'var(--border-subtle)' },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      overflow: 'hidden',
      // Active task cards get a slightly elevated shadow instead of an
      // accent border — keeps the card chrome consistent across states.
      boxShadow: isActive
        ? '0 6px 20px rgba(15,16,20,0.10), 0 2px 4px rgba(15,16,20,0.04)'
        : 'none',
      opacity: isWaiting ? 0.5 : 1,
      transition: 'opacity 0.2s, box-shadow 0.2s',
    }}>
      {/* Gradient header band */}
      <div style={{
        background: t.bg,
        borderBottom: `1px solid ${t.border}`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: iconBg || 'rgba(255,255,255,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {header}
        </div>
      </div>

      {/* White body */}
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        {eta && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
            <Icon name="clock" size={11}/>{eta}
          </div>
        )}
      </div>
      {pill && <StatusPill tone={pillTone}>{pill}</StatusPill>}
    </div>
  );
}

const STEPS = [
  { id: 'aus',        label: 'AUS Review' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'income',     label: 'Income Calc' },
  { id: 'decision',   label: 'UW Decision' },
  { id: 'approval',   label: 'Cond. Approval' },
];

// Open conditions for this loan
const OPEN_CONDITIONS = [
  { id: 'C-001', title: 'Letter of explanation — large deposit', due: 'May 18', blocking: true, assignee: 'Sarah Anderson' },
  { id: 'C-002', title: 'Updated VOE within 10 days of closing', due: 'May 22', blocking: true, assignee: 'Alex Martinez' },
  { id: 'C-003', title: 'Hazard insurance binder', due: 'May 25', blocking: false, assignee: 'Sarah Anderson' },
  { id: 'C-004', title: 'Subject property final inspection', due: 'May 26', blocking: false, assignee: 'Alex Martinez' },
];

function FEMADisasterCard({ fema, borrowerName }) {
  const steps = [
    { id: 'contact', label: 'Contact borrower to confirm property status', desc: 'Verify no structural damage, flooding, or access issues at the subject property.' },
    { id: 'inspect', label: 'Request property re-inspection', desc: 'Order a disaster inspector or appraiser to confirm property condition post-incident.' },
    { id: 'lock',    label: 'File lock extension if needed', desc: fema?.lockExtensionAvailable ? 'FEMA lock extension available — file with secondary desk to protect the rate.' : 'Contact lock desk to assess extension options.' },
    { id: 'notify',  label: 'Notify processor and underwriter', desc: 'Send FEMA declaration details and property status update to the underwriting team.' },
    { id: 'insure',  label: 'Verify hazard insurance coverage', desc: 'Confirm policy covers the disaster type and is still in force. Request updated binder if needed.' },
  ];

  const [checkedSteps, setCheckedSteps] = React.useState(new Set());
  const [resolved, setResolved] = React.useState(false);
  const toggle = (id) => setCheckedSteps(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const allChecked = checkedSteps.size === steps.length;

  if (resolved) {
    return (
      <ActionCard tone="green"
        icon={<Icon name="checkCircle" size={18} color="#1F7A45" strokeWidth={1.85}/>}
        iconBg="rgba(223,241,229,0.9)"
        header={<CardHeader title="FEMA Disaster Review Complete ✓" pill="Resolved" pillTone="green"/>}
      >
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          All disaster review steps completed. Loan cleared to continue underwriting.
        </div>
      </ActionCard>
    );
  }

  return (
    <ActionCard tone="red" isActive
      icon={<Icon name="alertOctagon" size={18} color="#B91C1C" strokeWidth={1.85}/>}
      iconBg="#FEE2E2"
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{ fontSize: 14.5, fontWeight: 600 }}>FEMA Disaster Review Required</span>
          <StatusPill tone="red">Blocking</StatusPill>
          <span style={{ fontSize: 11.5, color: '#991B1B', background: '#FEE2E2', border: '1px solid #FECACA', padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>{fema?.declaration}</span>
        </div>
      }
      footer={allChecked ? (
        <button className="btn btn-primary btn-sm" style={{ background: '#166534', borderColor: '#166534' }} onClick={() => setResolved(true)}>
          <Icon name="check" size={13}/> Mark Disaster Review Complete
        </button>
      ) : (
        <>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{steps.length - checkedSteps.size} of {steps.length} steps remaining</span>
          <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
            <Icon name="send" size={12}/> Message Borrower
          </button>
        </>
      )}
    >
      <div style={{ fontSize: 12.5, color: '#991B1B', marginTop: 2, marginBottom: 12 }}>
        {fema?.incident} · {fema?.county} County · Declared {fema?.declaredDate} · Incident period {fema?.incidentPeriod}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map(step => {
          const checked = checkedSteps.has(step.id);
          return (
            <div key={step.id} onClick={() => toggle(step.id)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px',
              background: checked ? 'rgba(220,252,231,0.5)' : 'var(--bg-surface)',
              border: `1px solid ${checked ? '#86EFAC' : 'var(--border-subtle)'}`,
              borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                background: checked ? '#16A34A' : 'transparent',
                border: checked ? 'none' : '1.5px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}>
                {checked && <Icon name="check" size={11} color="#fff" strokeWidth={2.5}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: checked ? 500 : 600, color: checked ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: checked ? 'line-through' : 'none' }}>{step.label}</div>
                {!checked && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{step.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <AIInsight>FEMA declaration {fema?.declaration} covers the subject property's county. Fannie Mae requires re-inspection certification before loan can close. Lock extension may be available — contact secondary desk.</AIInsight>
    </ActionCard>
  );
}

export function NowTabUnderwriting({ borrowerName = 'Sarah Anderson', loanId = 'LN-2024-0234', loan, fema = null }) {
  const [completed, setCompleted] = React.useState(new Set());
  const [clearedConditions, setClearedConditions] = React.useState(new Set());
  const [advanced, setAdvanced] = React.useState(false);

  const complete = (id) => setCompleted(prev => new Set(prev).add(id));
  const done = (id) => completed.has(id);
  const clearCond = (id) => setClearedConditions(prev => new Set(prev).add(id));
  const remaining = STEPS.filter(s => !completed.has(s.id)).length;
  const allDone = remaining === 0;

  if (advanced) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name="checkCircle" size={26} strokeWidth={1.85}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Conditional Approval Issued</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6, maxWidth: 400, margin: '8px auto 0' }}>
          {borrowerName}'s loan has moved to Approval. 2 prior-to-funding conditions remain open.
        </div>
      </div>
    );
  }

  const openConds = OPEN_CONDITIONS.filter(c => !clearedConditions.has(c.id));
  const condsDone = openConds.length === 0;

  // Active step id
  const activeStepId = STEPS.find(s => !completed.has(s.id))?.id;

  // Subtitle — urgent when nothing done, encouraging as steps complete
  const subtitle = remaining === STEPS.length
    ? `${remaining} steps to close — start with AUS review`
    : remaining === 1
      ? 'Almost there — 1 step remaining'
      : `${STEPS.length - remaining} of ${STEPS.length} steps complete`;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Underwriting Review</h2>
          <div style={{ fontSize: 13, marginTop: 4, color: remaining === STEPS.length ? 'var(--status-amber)' : 'var(--text-tertiary)', fontWeight: remaining === STEPS.length ? 500 : 400 }}>
            {subtitle}
          </div>
        </div>
      </div>

      <StageTimelineStrip steps={STEPS} completed={completed} stageName="Underwriting"/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* FEMA DISASTER REVIEW — shown first if applicable */}
        {fema && <FEMADisasterCard fema={fema} borrowerName={borrowerName}/>}

        {/* 1. AUS REVIEW */}
        <ActionCard
          tone={done('aus') ? 'green' : 'neutral'}
          isActive={!done('aus') && activeStepId === 'aus'}
          isWaiting={false}
          icon={<Icon name="zap" size={18} color={done('aus') ? '#1F7A45' : '#5246C7'} strokeWidth={1.7}/>}
          iconBg={done('aus') ? 'rgba(223,241,229,0.9)' : 'var(--ai-bg-strong)'}
          header={<CardHeader title={done('aus') ? 'AUS Findings Reviewed ✓' : 'Review AUS Findings'} pill={done('aus') ? 'DU Approve/Eligible' : 'DU Approve/Eligible'} pillTone="green" eta={done('aus') ? undefined : '~1 min'}/>}
          footer={done('aus') ? (
            <button className="btn btn-outline btn-sm">View full DU findings</button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => complete('aus')} style={{ minWidth: 180 }}>
                <Icon name="check" size={13}/> Acknowledge Findings
              </button>
              <button className="btn btn-outline btn-sm">View DU report</button>
              <button className="btn btn-outline btn-sm">Re-submit to AUS</button>
            </>
          )}
        >
          {!done('aus') && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 4, marginTop: 4, alignItems: 'stretch' }}>
                {[
                  { label: 'Decision', value: 'Approve/Eligible', good: true },
                  { label: 'Risk Class', value: 'I', good: true },
                  { label: 'Loan Type', value: 'Conv 30yr', good: true },
                  { label: 'LTV', value: '80%', good: true },
                  { label: 'DTI', value: '38%', good: true },
                  { label: 'Mid Score', value: '720', good: true },
                ].map(f => (
                  <div key={f.label} style={{ background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: f.good ? 'var(--status-green)' : 'var(--status-red)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <AIInsight>All metrics within Fannie Mae guidelines. No manual underwriting required — this is a clean DU Approve. 3 AUS-generated conditions attached to the findings.</AIInsight>
            </>
          )}
        </ActionCard>

        {/* 2. CONDITIONS */}
        <ActionCard
          tone={done('conditions') ? 'green' : done('aus') ? (condsDone ? 'green' : 'amber') : 'neutral'}
          isActive={!done('conditions') && activeStepId === 'conditions'}
          isWaiting={!done('conditions') && !done('aus')}
          icon={<Icon name="listCheck" size={18} color={done('conditions') ? '#1F7A45' : done('aus') ? '#9C6A1A' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('conditions') ? 'rgba(223,241,229,0.9)' : done('aus') ? '#F6E6BD' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('conditions') ? 'Conditions Cleared ✓' : 'Clear Outstanding Conditions'}
            pill={done('conditions') ? 'All clear' : done('aus') ? `${openConds.length} remaining` : 'Waiting on AUS review'}
            pillTone={done('conditions') ? 'green' : done('aus') ? 'amber' : 'neutral'}
          />}
          footer={done('conditions') ? (
            <button className="btn btn-outline btn-sm">View conditions log</button>
          ) : done('aus') ? (
            condsDone ? (
              <button className="btn btn-primary" onClick={() => complete('conditions')} style={{ minWidth: 200 }}>
                <Icon name="check" size={13}/> Mark All Conditions Cleared
              </button>
            ) : (
              <button className="btn btn-outline btn-sm">Go to Conditions tab</button>
            )
          ) : null}
        >
          {!done('conditions') && done('aus') && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {openConds.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-surface)', border: `1px solid ${c.blocking ? 'var(--card-red-border)' : 'var(--border-subtle)'}`, borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>Due {c.due} · {c.assignee}</div>
                    </div>
                    {c.blocking && <StatusPill tone="red">Blocking</StatusPill>}
                    <button className="btn btn-outline btn-sm" title="Message assignee" style={{ padding: '4px 8px' }}>
                      <Icon name="send" size={12}/>
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => clearCond(c.id)}>
                      <Icon name="check" size={12} strokeWidth={2.5}/> Clear
                    </button>
                  </div>
                ))}
                {condsDone && <AIInsight>All conditions cleared. Ready to mark complete and proceed to income calculation.</AIInsight>}
              </div>
              {!condsDone && <AIInsight>2 blocking conditions need resolution before approval can be issued. C-001 (LOX) is the critical path — {borrowerName} has been notified via borrower portal.</AIInsight>}
            </>
          )}
          {!done('conditions') && !done('aus') && (
            <AIInsight>Complete AUS review first to see which conditions were generated by DU.</AIInsight>
          )}
        </ActionCard>

        {/* 3. INCOME CALC */}
        <ActionCard
          tone={done('income') ? 'green' : done('conditions') ? 'ai' : 'neutral'}
          isActive={!done('income') && activeStepId === 'income'}
          isWaiting={!done('income') && !done('conditions')}
          icon={<Icon name="dollar" size={18} color={done('income') ? '#1F7A45' : done('conditions') ? 'var(--ai-primary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('income') ? 'rgba(223,241,229,0.9)' : done('conditions') ? 'var(--ai-bg-strong)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('income') ? 'Income Analysis Complete ✓' : 'Verify Income Calculation'}
            pill={done('income') ? '$8,750/mo qualifying' : done('conditions') ? 'AI Ready' : 'Waiting on conditions'}
            pillTone={done('income') ? 'green' : 'ai'}
            eta={done('income') ? undefined : '~2 min'}
          />}
          footer={done('income') ? (
            <button className="btn btn-outline btn-sm">View income worksheet</button>
          ) : done('conditions') ? (
            <>
              <button className="btn btn-ai" onClick={() => complete('income')} style={{ minWidth: 200 }}>
                <Icon name="sparkle" size={13}/> Run AI Income Analysis
              </button>
              <button className="btn btn-outline btn-sm">Manual calculation</button>
            </>
          ) : null}
        >
          {!done('income') && done('conditions') && (
            <AIInsight>W-2 income $105,000 base + $7,200 OT (2-yr avg). Qualifying income: $8,750/mo. DTI: 38% — within Conv 45% max. No income layering issues detected.</AIInsight>
          )}
          {!done('income') && !done('conditions') && (
            <AIInsight>Income analysis unlocks after all blocking conditions are cleared.</AIInsight>
          )}
        </ActionCard>

        {/* 4. UW DECISION */}
        <ActionCard
          tone={done('decision') ? 'green' : done('income') ? 'neutral' : 'neutral'}
          isActive={!done('decision') && activeStepId === 'decision'}
          isWaiting={!done('decision') && !done('income')}
          icon={<Icon name="check" size={18} color={done('decision') ? '#1F7A45' : done('income') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={2}/>}
          iconBg={done('decision') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('decision') ? 'Underwriting Decision Made ✓' : 'Record UW Decision'}
            pill={done('decision') ? 'Approved with conditions' : done('income') ? 'Ready to decide' : 'Waiting on income'}
            pillTone={done('decision') ? 'green' : done('income') ? 'blue' : 'neutral'}
          />}
          footer={done('decision') ? (
            <button className="btn btn-outline btn-sm">View decision letter</button>
          ) : done('income') ? (
            <>
              <button className="btn btn-primary" onClick={() => complete('decision')} style={{ minWidth: 200 }}>
                <Icon name="check" size={13}/> Approve with Conditions
              </button>
              <button className="btn btn-outline btn-sm" style={{ color: 'var(--status-amber)' }}>Suspend</button>
              <button className="btn btn-outline btn-sm" style={{ color: 'var(--status-red)' }}>Deny</button>
            </>
          ) : null}
        >
          {!done('decision') && done('income') && (
            <AIInsight>All underwriting criteria met. Recommend Approve with Conditions — 2 prior-to-funding conditions remain open (C-003, C-004). These are non-blocking and can be cleared before closing.</AIInsight>
          )}
        </ActionCard>

        {/* 5. ISSUE CONDITIONAL APPROVAL */}
        {allDone && (
          <ActionCard
            tone="ai"
            isActive
            icon={<Icon name="sparkles" size={18} color="var(--ai-primary)" strokeWidth={1.5}/>}
            iconBg="var(--ai-bg-strong)"
            header={<CardHeader title="Issue Conditional Approval Letter" pill="Ready" pillTone="green"/>}
            footer={
              <>
                <button className="btn btn-ai" onClick={() => setAdvanced(true)} style={{ minWidth: 220 }}>
                  <Icon name="send" size={14}/> Generate & Send Approval Letter
                </button>
                <button className="btn btn-ghost">Preview first</button>
              </>
            }
          >
            <AIInsight>
              I've pre-drafted the conditional approval letter for {borrowerName}. It includes the loan terms, 2 remaining conditions, and an estimated closing date of June 30, 2026. Delivery via borrower portal takes ~30 seconds.
            </AIInsight>
          </ActionCard>
        )}

      </div>
    </>
  );
}

export default NowTabUnderwriting;
