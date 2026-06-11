import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { W2Viewer } from '../components/W2Viewer';
import { URLAView } from './URLAView';

function URLAWindow({ onClose, onSubmit, borrowerName, loanId }) {
  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.45)',
        zIndex: 300, backdropFilter: 'blur(2px)',
      }}/>

      {/* Floating window */}
      <div style={{
        position: 'fixed', top: '4%', left: '50%', transform: 'translateX(-50%)',
        width: '92vw', maxWidth: 1100, height: '90vh',
        background: '#fff', borderRadius: 14,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          height: 44, background: '#F5F6F8', borderBottom: '1px solid #E5E8F0',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          flexShrink: 0,
        }}>
          {/* Traffic light buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: 'none', cursor: 'pointer', padding: 0 }}/>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }}/>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }}/>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#5A6577' }}>
            Form 1003 (URLA) — {borrowerName} · {loanId}
          </div>
          <div style={{ width: 42 }}/>
        </div>

        {/* URLA content — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <URLAView
            borrowerName={borrowerName}
            loanId={loanId}
            onClose={onClose}
            onSubmit={() => { onSubmit && onSubmit(); onClose(); }}
            embedded
          />
        </div>
      </div>
    </>,
    document.body
  );
}

/* Shared primitives (duplicated from LoanDetail to keep this file self-contained) */

// Gradient-header + white-body card, matching the LOApprovalView style.
function ActionCard({ tone = 'neutral', icon, iconBg, iconColor, header, children, footer }) {
  const toneStyles = {
    red:     { bg: 'linear-gradient(90deg, #FEE2E2, #FEF2F2)', border: '#FECACA' },
    green:   { bg: 'linear-gradient(90deg, #E7F8F1, #F0FDF4)', border: '#A7F3D0' },
    amber:   { bg: 'linear-gradient(90deg, #FEF6E7, #FFF8F0)', border: '#FDE9C2' },
    blue:    { bg: 'linear-gradient(90deg, #EEF3FE, #F5F8FF)', border: '#C7D2FE' },
    ai:      { bg: 'linear-gradient(90deg, #F4F1FE, #FAF8FF)', border: '#E4DEFA' },
    neutral: { bg: 'var(--bg-muted)',                          border: 'var(--border-subtle)' },
  };
  const t = toneStyles[tone] || toneStyles.neutral;
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${t.border}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        background: t.bg, borderBottom: `1px solid ${t.border}`,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg || 'rgba(255,255,255,0.65)', color: iconColor || 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
      </div>
      {(children || footer) && (
        <div style={{ padding: '14px 16px' }}>
          {children}
          {footer && (
            <div style={{
              marginTop: children ? 14 : 0, paddingTop: children ? 12 : 0,
              borderTop: children ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>{footer}</div>
          )}
        </div>
      )}
    </div>
  );
}

function AIInsight({ children }) {
  return (
    <div style={{ marginTop: 12, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.4 }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
      <span>{children}</span>
    </div>
  );
}

function CardHeader({ title, pill, pillTone = 'amber', eta }) {
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

/* Step tracker shown at the top of the Now tab */

const STEPS = [
  { id: 'urla',        label: 'URLA' },
  { id: 'disclosures', label: 'Disclosures' },
  { id: 'docs',        label: 'Doc Collection' },
  { id: 'credit',      label: 'Credit' },
  { id: 'aus',         label: 'AUS' },
  { id: 'appraisal',   label: 'Appraisal' },
  { id: 'title',       label: 'Title & Flood' },
  { id: 'ready',       label: 'Ready' },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

function PreApprovalCard({ borrowerName }) {
  const [sent, setSent]         = React.useState(false);
  const [amount, setAmount]     = React.useState('345,000');
  const [sending, setSending]   = React.useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  if (sent) {
    return (
      <div style={{ background: 'var(--card-green-bg)', border: '1px solid var(--card-green-border)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(223,241,229,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="check" size={16} color="#1F7A45" strokeWidth={2.5}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Pre-Approval Letter Sent ✓</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {borrowerName} · ${amount} · FHA 30yr Fixed · Valid Aug 18, 2026 · PDF logged to file
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm">View PDF</button>
          <button className="btn btn-outline btn-sm">Resend</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 18 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF3FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="doc" size={16} color="#2453D6" strokeWidth={1.7}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Send Pre-Approval Letter</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 999 }}>Requested today</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Marcus texted 8:52 AM — making an offer on 74 Pine Ridge today</div>
        </div>
      </div>

      {/* Amount + details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #2453D6', borderRadius: 8, overflow: 'hidden' }}>
            <span style={{ padding: '6px 9px', fontSize: 13, fontWeight: 700, color: '#2453D6', background: '#EEF3FE' }}>$</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
              style={{ border: 'none', outline: 'none', padding: '6px 9px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', width: 100, background: '#fff', fontFamily: 'DM Sans' }}/>
          </div>
        </div>
        {[{ label: 'Loan Type', val: 'FHA 30yr Fixed' }, { label: 'Valid Through', val: 'Aug 18, 2026' }].map(f => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
            <div style={{ padding: '6px 11px', background: 'var(--bg-muted)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.val}</div>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <div style={{ background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '9px 12px', display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.5, marginBottom: 14 }}>
        <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>Marcus qualifies up to <b>$390K</b>. Issuing for <b>${amount}</b> leaves negotiation headroom for the offer.</span>
      </div>

      {/* Actions — only these change state */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSend} disabled={sending} style={{ height: 34, padding: '0 16px', borderRadius: 8, border: 'none', background: sending ? '#93C5FD' : '#2453D6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}>
          {sending
            ? <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/> Sending…</>
            : <><Icon name="send" size={13}/> Generate &amp; Send</>}
        </button>
        <button className="btn btn-outline btn-sm">Preview letter</button>
      </div>
    </div>
  );
}

export function NowTabApplication({ borrowerName = 'Marcus Johnson', loanId, loan, onOpenURLA }) {
  const [completed, setCompleted] = React.useState(new Set());
  const [dismissed, setDismissed] = React.useState(new Set());
  const [w2Open, setW2Open]       = React.useState(false);

  const complete = (id) => setCompleted(prev => new Set(prev).add(id));
  const dismiss  = (id) => setDismissed(prev => new Set(prev).add(id));
  const done = (id) => completed.has(id);
  const hidden = (id) => dismissed.has(id);

  const remaining  = STEPS.filter(s => !completed.has(s.id)).length;
  const doneCount  = STEPS.length - remaining;
  const pct        = Math.round((doneCount / STEPS.length) * 100);
  const [taskTab, setTaskTab] = React.useState('todo');

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Application Intake</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            AI-guided path to submit
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
        {[
          { id: 'todo', label: `To-Do (${remaining})` },
          { id: 'done', label: `Done (${doneCount})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTaskTab(t.id)} style={{
            padding: '8px 16px', border: 'none', background: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, fontWeight: taskTab === t.id ? 700 : 500,
            color: taskTab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom: taskTab === t.id ? '2px solid var(--text-primary)' : '2px solid transparent',
            marginBottom: -1, transition: 'all 0.12s',
          }}>{t.label}</button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: taskTab === 'done' ? 'none' : 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 0. COMPLETE URLA */}
        <ActionCard
          tone={done('urla') ? 'green' : 'ai'}
          icon={<Icon name="doc" size={18} color={done('urla') ? '#1F7A45' : 'var(--ai-primary)'} strokeWidth={1.7}/>}
          iconBg={done('urla') ? 'rgba(223,241,229,0.9)' : 'var(--ai-bg-strong)'}
          header={
            <CardHeader
              title={done('urla') ? 'URLA Complete ✓' : 'Complete URLA (Form 1003)'}
              pill={done('urla') ? 'Submitted to DU' : 'AI pre-filled · 40 fields ready'}
              pillTone={done('urla') ? 'green' : 'ai'}
              eta={done('urla') ? undefined : '~5 min'}
            />
          }
          footer={done('urla') ? (
            <>
              <button className="btn btn-outline btn-sm" onClick={onOpenURLA}>View 1003</button>
              <button className="btn btn-outline btn-sm">View AUS Findings</button>
            </>
          ) : (
            <>
              <button className="btn btn-ai btn-sm" onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?view=urla&borrower=${encodeURIComponent(borrowerName)}&loanId=${encodeURIComponent(loanId || 'LN-2024-0267')}`;
                const win = window.open(url, 'urla-window', 'width=1280,height=860,left=100,top=60,resizable=yes,scrollbars=yes');
                win?.focus();
                // Listen for submit message from the new window
                const handler = (e) => { if (e.data?.type === 'urla-submitted') { complete('urla'); window.removeEventListener('message', handler); } };
                window.addEventListener('message', handler);
              }}>
                <Icon name="sparkle" size={13}/> Open URLA with AI Pre-fill
              </button>
            </>
          )}
        >
          {!done('urla') && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                AI has pre-filled 40 fields from the pre-application, credit pull, and uploaded documents. Review, confirm, and submit to Desktop Underwriter.
              </div>
              <AIInsight>
                I found property address, income, employment, and asset data from the pre-app. Only a few declarations and signatures remain — estimated completion time 5 minutes.
              </AIInsight>
            </>
          )}
        </ActionCard>

        {/* 1. SEND LOAN ESTIMATE — urgent deadline */}
        {!hidden('disclosures') && (
          <ActionCard
            tone={done('disclosures') ? 'green' : 'red'}
            icon={<Icon name="mail" size={18} color={done('disclosures') ? '#1F7A45' : '#B33222'} strokeWidth={1.7}/>}
            iconBg={done('disclosures') ? 'rgba(223,241,229,0.9)' : '#F8DCD4'}
            header={
              <CardHeader
                title={done('disclosures') ? 'Loan Estimate Sent ✓' : 'Send Loan Estimate'}
                pill={done('disclosures') ? 'Complete' : '3-Day Deadline'}
                pillTone={done('disclosures') ? 'green' : 'red'}
                eta={done('disclosures') ? undefined : '~2 min'}
              />
            }
            footer={done('disclosures') ? (
              <>
                <button className="btn btn-outline btn-sm">View LE</button>
                <button className="btn btn-outline btn-sm">Resend</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => complete('disclosures')}>
                  <Icon name="send" size={13}/> Generate & Send LE
                </button>
                <button className="btn btn-outline btn-sm">Preview first</button>
                <button className="btn btn-outline btn-sm">Schedule send</button>
              </>
            )}
          >
            {!done('disclosures') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Required within 3 business days of application. Locking in rate and loan terms protects {borrowerName}.
                </div>
                <AIInsight>
                  I pre-filled the LE from the 1003. Loan amount $345,000 · Rate 7.125% · APR 7.28% · Est. cash to close $18,400. Ready to send — review takes ~60 seconds.
                </AIInsight>
              </>
            )}
          </ActionCard>
        )}

        {/* 2. DOC COLLECTION */}
        {!hidden('docs') && (
          <ActionCard
            tone={done('docs') ? 'green' : 'amber'}
            icon={<Icon name="upload" size={18} color={done('docs') ? '#1F7A45' : '#9C6A1A'} strokeWidth={1.7}/>}
            iconBg={done('docs') ? 'rgba(223,241,229,0.9)' : '#F6E6BD'}
            header={
              <CardHeader
                title={done('docs') ? 'Doc Request Sent ✓' : 'Request Initial Documents'}
                pill={done('docs') ? 'Pending borrower' : '7 docs needed'}
                pillTone={done('docs') ? 'neutral' : 'amber'}
                eta={done('docs') ? undefined : '~1 min'}
              />
            }
            footer={done('docs') ? (
              <>
                <button className="btn btn-outline btn-sm">View checklist</button>
                <button className="btn btn-outline btn-sm">Send reminder</button>
                <button className="btn btn-outline btn-sm" onClick={() => setW2Open(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="doc" size={13}/> View W-2
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => complete('docs')}>
                  <Icon name="send" size={13}/> Send Doc Request
                </button>
                <button className="btn btn-outline btn-sm">Customize list</button>
                <button className="btn btn-outline btn-sm">Upload myself</button>
              </>
            )}
          >
            {!done('docs') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div>• Most recent 2 paystubs (within 30 days)</div>
                  <div>• W-2s — last 2 years</div>
                  <div>• Federal tax returns — last 2 years</div>
                  <div>• Bank statements — last 2 months (all accounts)</div>
                  <div>• Government-issued photo ID</div>
                </div>
                <AIInsight>
                  {borrowerName} connected their bank via portal last week — I can auto-import 2 months of statements if you authorize. Saves ~3 days of back-and-forth.
                </AIInsight>
              </>
            )}
          </ActionCard>
        )}

        {/* 3. CREDIT PULL */}
        {!hidden('credit') && (
          <ActionCard
            tone={done('credit') ? 'green' : 'neutral'}
            icon={<Icon name="fileSearch" size={18} color={done('credit') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
            iconBg={done('credit') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
            header={
              <CardHeader
                title={done('credit') ? 'Credit Report Pulled ✓' : 'Pull Tri-Merge Credit Report'}
                pill={done('credit') ? '720 mid-score' : 'Quick — AI handles'}
                pillTone={done('credit') ? 'green' : 'ai'}
                eta={done('credit') ? undefined : '~30 sec'}
              />
            }
            footer={done('credit') ? (
              <>
                <button className="btn btn-outline btn-sm">View report</button>
                <button className="btn btn-outline btn-sm">Re-pull</button>
              </>
            ) : (
              <>
                <button className="btn btn-ai btn-sm" onClick={() => complete('credit')}>
                  <Icon name="sparkle" size={13}/> Pull Credit Now
                </button>
                <button className="btn btn-outline btn-sm">Schedule soft pull first</button>
              </>
            )}
          >
            {!done('credit') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Tri-merge report from Experian, Equifax, and TransUnion. Borrower authorization on file from the 1003.
                </div>
                <AIInsight>
                  Based on the 1003 data, I'm projecting a 715–730 mid-score. DTI looks clean at 29%. AUS should return Approve/Eligible — high confidence.
                </AIInsight>
              </>
            )}
          </ActionCard>
        )}

        {/* 4. AUS */}
        {!hidden('aus') && (
          <ActionCard
            tone={done('aus') ? 'green' : 'neutral'}
            icon={<Icon name="zap" size={18} color={done('aus') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
            iconBg={done('aus') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
            header={
              <CardHeader
                title={done('aus') ? 'AUS Complete — DU Approve/Eligible ✓' : 'Submit to AUS (DU)'}
                pill={done('aus') ? '29% DTI · 95% LTV' : 'Needs credit first'}
                pillTone={done('aus') ? 'green' : 'neutral'}
                eta={done('aus') ? undefined : '~1 min'}
              />
            }
            footer={done('aus') ? (
              <>
                <button className="btn btn-outline btn-sm">View findings</button>
                <button className="btn btn-outline btn-sm">Run LP comparison</button>
              </>
            ) : (
              <>
                <button className="btn btn-ai btn-sm" onClick={() => complete('aus')} disabled={!done('credit')} style={{ opacity: done('credit') ? 1 : 0.4, cursor: done('credit') ? 'pointer' : 'not-allowed' }}>
                  <Icon name="zap" size={13}/> Submit to DU
                </button>
                <button className="btn btn-outline btn-sm" disabled={!done('credit')} style={{ opacity: done('credit') ? 1 : 0.4 }}>Submit to LP instead</button>
              </>
            )}
          >
            {!done('aus') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Desktop Underwriter runs eligibility and conditions automatically. Required before ordering appraisal on FHA loans.
                </div>
                {!done('credit') && (
                  <AIInsight>Pull credit first — AUS needs the tri-merge to determine eligibility conditions.</AIInsight>
                )}
                {done('credit') && (
                  <AIInsight>Credit pulled successfully. Ready to submit — I'll pre-fill all DU fields from the 1003 and credit data.</AIInsight>
                )}
              </>
            )}
          </ActionCard>
        )}

        {/* 5. APPRAISAL ORDER */}
        {!hidden('appraisal') && (
          <ActionCard
            tone={done('appraisal') ? 'green' : 'neutral'}
            icon={<Icon name="pin" size={18} color={done('appraisal') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
            iconBg={done('appraisal') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
            header={
              <CardHeader
                title={done('appraisal') ? 'Appraisal Ordered ✓' : 'Order Appraisal'}
                pill={done('appraisal') ? 'ETA 5–7 days' : 'After intent to proceed'}
                pillTone={done('appraisal') ? 'neutral' : 'neutral'}
                eta={done('appraisal') ? undefined : '~2 min'}
              />
            }
            footer={done('appraisal') ? (
              <>
                <button className="btn btn-outline btn-sm">Track order</button>
                <button className="btn btn-outline btn-sm">Contact appraiser</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => complete('appraisal')} disabled={!done('aus')} style={{ opacity: done('aus') ? 1 : 0.4, cursor: done('aus') ? 'pointer' : 'not-allowed' }}>
                  <Icon name="building" size={13}/> Order via AMC
                </button>
                <button className="btn btn-outline btn-sm" disabled={!done('aus')} style={{ opacity: done('aus') ? 1 : 0.4 }}>Select appraiser</button>
              </>
            )}
          >
            {!done('appraisal') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  FHA requires appraisal ordered through an approved AMC. Cannot order before AUS approval on government loans.
                </div>
                {done('aus') ? (
                  <AIInsight>
                    AUS approved — clear to order. I found 3 FHA-certified appraisers active in Boise, ID with 5–7 day ETAs. Closest match: Mountain West Appraisal Co.
                  </AIInsight>
                ) : (
                  <AIInsight>Complete AUS first — FHA requires Approve/Eligible before ordering the appraisal.</AIInsight>
                )}
              </>
            )}
          </ActionCard>
        )}

        {/* 6. TITLE & FLOOD — parallel */}
        {!hidden('title') && (
          <ActionCard
            tone={done('title') ? 'green' : 'neutral'}
            icon={<Icon name="fileSearch" size={18} color={done('title') ? '#1F7A45' : 'var(--text-secondary)'} strokeWidth={1.7}/>}
            iconBg={done('title') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
            header={
              <CardHeader
                title={done('title') ? 'Title & Flood Ordered ✓' : 'Order Title Search & Flood Cert'}
                pill={done('title') ? 'In progress' : 'Can run in parallel'}
                pillTone={done('title') ? 'neutral' : 'ai'}
                eta={done('title') ? undefined : '~1 min'}
              />
            }
            footer={done('title') ? (
              <>
                <button className="btn btn-outline btn-sm">Track title</button>
                <button className="btn btn-outline btn-sm">View flood cert</button>
              </>
            ) : (
              <>
                <button className="btn btn-ai btn-sm" onClick={() => complete('title')}>
                  <Icon name="sparkle" size={13}/> Order Both Now
                </button>
                <button className="btn btn-outline btn-sm">Order separately</button>
              </>
            )}
          >
            {!done('title') && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div>• Title search — verifies clean ownership chain, no liens</div>
                  <div>• Flood cert (FEMA) — required for all FHA loans</div>
                </div>
                <AIInsight>
                  These can run in parallel with the appraisal — no dependency. I can order both in one click through your preferred title company. Saves 1–2 days.
                </AIInsight>
              </>
            )}
          </ActionCard>
        )}

        {/* 7. READY — summary */}
        {done('disclosures') && done('docs') && done('credit') && done('aus') && done('appraisal') && done('title') && !hidden('ready') && (
          <ActionCard
            tone="green"
            icon={<Icon name="checkCircle" size={18} color="#1F7A45" strokeWidth={1.85}/>}
            iconBg="rgba(223,241,229,0.9)"
            header={<CardHeader title="Application Complete — Move to Processing" pill="All steps done" pillTone="green"/>}
            footer={
              <>
                <button className="btn btn-primary btn-sm" onClick={() => complete('ready')}>
                  <Icon name="arrowRight" size={13}/> Advance to Processing
                </button>
                <button className="btn btn-outline btn-sm">Review checklist</button>
              </>
            }
          >
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              All required application tasks are complete. The loan is ready to move to Processing for full underwriting review.
            </div>
            <AIInsight>
              Everything checks out. AUS Approve/Eligible, LE sent, docs requested, appraisal and title in progress. Estimated time to clear processing: 5–7 business days.
            </AIInsight>
          </ActionCard>
        )}

        {/* All done */}
        {done('ready') && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon name="checkCircle" size={24} strokeWidth={1.85}/>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Loan advanced to Processing</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>The AI coach will surface the next set of actions once underwriting begins.</div>
          </div>
        )}

      </div>

      {/* Done tab panel */}
      {taskTab === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {doneCount === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>No steps completed yet.</div>
          ) : (
            [
              { id: 'urla',        label: 'Complete URLA (Form 1003)',          sub: 'Submitted to DU' },
              { id: 'disclosures', label: 'Send Loan Estimate',                 sub: 'Delivered to borrower' },
              { id: 'docs',        label: 'Request Initial Documents',          sub: 'Sent to borrower portal' },
              { id: 'credit',      label: 'Pull Tri-Merge Credit Report',       sub: '720 mid-score · DTI 29%' },
              { id: 'aus',         label: 'Submit to AUS (DU)',                 sub: 'DU Approve/Eligible' },
              { id: 'appraisal',   label: 'Order Appraisal',                   sub: 'Ordered via AMC · ETA 5–7 days' },
              { id: 'title',       label: 'Order Title Search & Flood Cert',   sub: 'In progress' },
              { id: 'ready',       label: 'Advance to Processing',             sub: 'Loan moved to Processing' },
            ].filter(s => done(s.id)).map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--card-green-bg)', border: '1px solid var(--card-green-border)', borderRadius: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(223,241,229,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={12} color="#1F7A45" strokeWidth={2.5}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>{s.label}</div>
                  <div style={{ fontSize: 11.5, color: '#059669', marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {w2Open && <W2Viewer onClose={() => setW2Open(false)}/>}
    </>
  );
}

export default NowTabApplication;
