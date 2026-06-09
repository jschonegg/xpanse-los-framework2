import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { StageTimelineStrip } from '../components/WorkspaceCards';

function ActionCard({ tone = 'neutral', icon, iconBg, iconColor, header, children, footer }) {
  const toneStyles = {
    red:     { bg: 'var(--card-red-bg)',   border: 'var(--card-red-border)' },
    green:   { bg: 'var(--card-green-bg)', border: 'var(--card-green-border)' },
    amber:   { bg: 'var(--card-amber-bg)', border: 'var(--card-amber-border)' },
    neutral: { bg: 'var(--bg-surface)',    border: 'var(--border-subtle)' },
    ai:      { bg: 'var(--ai-bg)',         border: 'var(--ai-border)' },
  };
  const t = toneStyles[tone] || toneStyles.neutral;
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, display: 'flex', gap: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: iconBg || 'rgba(255,255,255,0.7)', color: iconColor || 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

function CardHeader({ title, pill, pillTone = 'amber', eta }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
      <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{title}</span>
      {pill && <StatusPill tone={pillTone}>{pill}</StatusPill>}
      {eta && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-tertiary)' }}>
          <Icon name="clock" size={12}/>{eta}
        </span>
      )}
    </div>
  );
}

const STEPS = [
  { id: 'appraisal', label: 'Appraisal' },
  { id: 'title',     label: 'Title & Flood' },
  { id: 'voe',       label: 'VOE / VOI' },
  { id: 'aus',       label: 'AUS Submit' },
  { id: 'stacking',  label: 'Stacking Order' },
  { id: 'submit',    label: 'Submit to UW' },
];

export function NowTabProcessing({ borrowerName = 'David Chen', loanId = 'LN-2024-0189', loan }) {
  const [completed, setCompleted] = React.useState(new Set());
  const [advanced, setAdvanced] = React.useState(false);

  const complete = (id) => setCompleted(prev => new Set(prev).add(id));
  const done = (id) => completed.has(id);

  const remaining = STEPS.filter(s => !completed.has(s.id)).length;
  const allDone = remaining === 0;

  if (advanced) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name="checkCircle" size={26} strokeWidth={1.85}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Loan submitted to Underwriting</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>Priya Shah will review the file and issue a decision within 2–3 business days.</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Processing Checklist</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            AI-guided path to underwriting — {remaining} of {STEPS.length} steps remaining
          </div>
        </div>
      </div>

      <StageTimelineStrip steps={STEPS} completed={completed}/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 1. APPRAISAL */}
        <ActionCard
          tone={done('appraisal') ? 'green' : 'amber'}
          icon={<Icon name="home" size={18} color={done('appraisal') ? '#1F7A45' : '#9C6A1A'} strokeWidth={1.7}/>}
          iconBg={done('appraisal') ? 'rgba(223,241,229,0.9)' : '#F6E6BD'}
          header={<CardHeader
            title={done('appraisal') ? 'Appraisal Ordered ✓' : 'Order Appraisal'}
            pill={done('appraisal') ? 'ETA May 24' : 'Required'}
            pillTone={done('appraisal') ? 'neutral' : 'amber'}
            eta={done('appraisal') ? undefined : '~2 min'}
          />}
          footer={done('appraisal') ? (
            <>
              <button className="btn btn-outline btn-sm">Track order</button>
              <button className="btn btn-outline btn-sm">Contact AMC</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('appraisal')}>
                <Icon name="send" size={13}/> Order via AMC
              </button>
              <button className="btn btn-outline btn-sm">Choose appraiser</button>
            </>
          )}
        >
          {!done('appraisal') && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                FHA requires appraisal within 120 days of closing. Property: 511 Birch Rd, Portland OR 97201.
              </div>
              <AIInsight>
                Based on the zip code and FHA loan type, typical turn time is 7–10 days. Order now to stay on track for the July 8 closing. I've pre-filled the AMC order form with the property address and loan details.
              </AIInsight>
            </>
          )}
        </ActionCard>

        {/* 2. TITLE & FLOOD */}
        <ActionCard
          tone={done('title') ? 'green' : 'neutral'}
          icon={<Icon name="fileSearch" size={18} color={done('title') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
          iconBg={done('title') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('title') ? 'Title & Flood Ordered ✓' : 'Order Title Commitment & Flood Cert'}
            pill={done('title') ? 'In progress' : '2 orders'}
            pillTone={done('title') ? 'neutral' : 'ai'}
            eta={done('title') ? undefined : '~1 min'}
          />}
          footer={done('title') ? (
            <>
              <button className="btn btn-outline btn-sm">View title order</button>
              <button className="btn btn-outline btn-sm">View flood cert</button>
            </>
          ) : (
            <>
              <button className="btn btn-ai btn-sm" onClick={() => complete('title')}>
                <Icon name="sparkle" size={13}/> Order Both — AI Handles
              </button>
              <button className="btn btn-outline btn-sm">Order separately</button>
            </>
          )}
        >
          {!done('title') && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>• Title commitment — Chicago Title (preferred vendor)</div>
                <div>• Flood certification — FEMA zone lookup + life-of-loan tracking</div>
              </div>
              <AIInsight>
                I've pulled the property from the 1003. Portland OR 97201 is in FEMA Zone X (minimal risk) — flood insurance likely not required. I'll confirm when the cert returns.
              </AIInsight>
            </>
          )}
        </ActionCard>

        {/* 3. VOE / VOI */}
        <ActionCard
          tone={done('voe') ? 'green' : 'neutral'}
          icon={<Icon name="upload" size={18} color={done('voe') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
          iconBg={done('voe') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('voe') ? 'VOE / VOI Verified ✓' : 'Verify Employment & Income'}
            pill={done('voe') ? 'Complete' : 'Fannie requirement'}
            pillTone={done('voe') ? 'green' : 'neutral'}
            eta={done('voe') ? undefined : '~3 min'}
          />}
          footer={done('voe') ? (
            <>
              <button className="btn btn-outline btn-sm">View VOE</button>
              <button className="btn btn-outline btn-sm">View income calc</button>
            </>
          ) : (
            <>
              <button className="btn btn-ai btn-sm" onClick={() => complete('voe')}>
                <Icon name="sparkle" size={13}/> Run Instant VOE via Equifax
              </button>
              <button className="btn btn-outline btn-sm">Manual VOE</button>
              <button className="btn btn-outline btn-sm">Written VOE</button>
            </>
          )}
        >
          {!done('voe') && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Confirm {borrowerName}'s employment status, title, and income consistency with 1003 data.
              </div>
              <AIInsight>
                W-2 shows $124,500 at Acme Corporation. I can run instant VOE through The Work Number (Equifax) in ~30 seconds — no employer contact needed. Saves 3–5 days vs. written VOE.
              </AIInsight>
            </>
          )}
        </ActionCard>

        {/* 4. AUS SUBMIT */}
        <ActionCard
          tone={done('aus') ? 'green' : done('voe') ? 'neutral' : 'neutral'}
          icon={<Icon name="zap" size={18} color={done('aus') ? '#1F7A45' : done('voe') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('aus') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('aus') ? 'AUS Approved ✓' : 'Submit to AUS'}
            pill={done('aus') ? 'DU Approve/Eligible' : done('voe') ? 'Ready' : 'Waiting on VOE'}
            pillTone={done('aus') ? 'green' : done('voe') ? 'ai' : 'neutral'}
            eta={done('aus') ? undefined : '~30 sec'}
          />}
          footer={done('aus') ? (
            <>
              <button className="btn btn-outline btn-sm">View DU findings</button>
              <button className="btn btn-outline btn-sm">Re-submit</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-ai btn-sm"
                disabled={!done('voe')}
                style={{ opacity: done('voe') ? 1 : 0.45, cursor: done('voe') ? 'pointer' : 'not-allowed' }}
                onClick={() => done('voe') && complete('aus')}
              >
                <Icon name="sparkle" size={13}/> Submit to Desktop Underwriter
              </button>
              <button className="btn btn-outline btn-sm" disabled={!done('voe')} style={{ opacity: done('voe') ? 1 : 0.45 }}>
                Submit to LP
              </button>
            </>
          )}
        >
          {!done('aus') && (
            <AIInsight>
              {done('voe')
                ? `VOE confirmed. Income and employment verified — 1003 data matches. DU submission is ready. Based on the data profile (720 mid-score, 36% DTI, 82% LTV, FHA), I'm projecting an Approve/Eligible finding.`
                : 'Complete VOE/VOI first — AUS findings are only valid when income is fully verified.'}
            </AIInsight>
          )}
        </ActionCard>

        {/* 5. STACKING ORDER */}
        <ActionCard
          tone={done('stacking') ? 'green' : done('aus') ? 'neutral' : 'neutral'}
          icon={<Icon name="listCheck" size={18} color={done('stacking') ? '#1F7A45' : done('aus') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('stacking') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('stacking') ? 'Loan Package Ready ✓' : 'Build Stacking Order'}
            pill={done('stacking') ? 'Complete' : done('aus') ? `${6} docs to review` : 'Waiting on AUS'}
            pillTone={done('stacking') ? 'green' : done('aus') ? 'amber' : 'neutral'}
            eta={done('stacking') ? undefined : '~5 min'}
          />}
          footer={done('stacking') ? (
            <>
              <button className="btn btn-outline btn-sm">View package</button>
              <button className="btn btn-outline btn-sm">Print stacking order</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm"
                disabled={!done('aus')}
                style={{ opacity: done('aus') ? 1 : 0.45, cursor: done('aus') ? 'pointer' : 'not-allowed' }}
                onClick={() => done('aus') && complete('stacking')}
              >
                <Icon name="check" size={13}/> Confirm Package Complete
              </button>
              <button className="btn btn-outline btn-sm" disabled={!done('aus')} style={{ opacity: done('aus') ? 1 : 0.45 }}>
                Review docs
              </button>
            </>
          )}
        >
          {!done('stacking') && done('aus') && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--status-green)', fontWeight: 600 }}>✓</span> 1003 · W-2 (2024, 2025) · Bank statements · DU findings
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--status-amber)', fontWeight: 600 }}>⏳</span> Appraisal (ordered) · Title commitment (ordered)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--status-red)', fontWeight: 600 }}>✗</span> Gift letter (flagged by AUS) — needs borrower signature
                </div>
              </div>
              <AIInsight>
                AUS returned 1 outstanding condition: gift letter for the $12,000 down payment contribution. I can draft the letter for {borrowerName} to sign — takes 30 seconds.
              </AIInsight>
            </>
          )}
          {!done('stacking') && !done('aus') && (
            <AIInsight>Complete AUS submission first — stacking order is generated from the DU findings report.</AIInsight>
          )}
        </ActionCard>

        {/* 6. SUBMIT TO UNDERWRITING */}
        {allDone && (
          <ActionCard
            tone="ai"
            icon={<Icon name="sparkles" size={18} color="var(--ai-primary)" strokeWidth={1.5}/>}
            iconBg="var(--ai-bg-strong)"
            header={<CardHeader title="Submit to Underwriting" pill="All items complete" pillTone="green"/>}
            footer={
              <>
                <button className="btn btn-ai" onClick={() => setAdvanced(true)}>
                  <Icon name="arrowRight" size={14} strokeWidth={2.2}/> Submit Loan Package
                </button>
                <button className="btn btn-ghost">Review first</button>
              </>
            }
          >
            <AIInsight>
              All 6 processing items are complete. Appraisal and title are in flight — UW can begin review now and receive those docs when they arrive. Recommended: submit today to protect the July 8 closing date.
            </AIInsight>
          </ActionCard>
        )}

      </div>
    </>
  );
}

export default NowTabProcessing;
