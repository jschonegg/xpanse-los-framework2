import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';

// Gradient-header + white-body card, matching the LOApprovalView style.
function ActionCard({ tone = 'neutral', icon, iconBg, header, children, footer }) {
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
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        background: t.bg, borderBottom: `1px solid ${t.border}`,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg || 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
    <div style={{ marginTop: 12, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.45 }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
      <span>{children}</span>
    </div>
  );
}

function CardHeader({ title, pill, pillTone = 'neutral', eta, urgency }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          {urgency && (
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--status-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="alert" size={12}/>{urgency}
            </span>
          )}
          {eta && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
              <Icon name="clock" size={11}/>{eta}
            </span>
          )}
        </div>
      </div>
      {pill && <StatusPill tone={pillTone}>{pill}</StatusPill>}
    </div>
  );
}

// CD countdown — closing May 22, so CD must be sent by May 19 at latest (3 business days)
function CDCountdown({ sent }) {
  const deadline = 'May 19';
  const closing  = 'May 22';
  const daysLeft = 2; // today is May 17

  if (sent) {
    return (
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <div style={{ flex: 1, background: 'var(--card-green-bg)', border: '1px solid var(--card-green-border)', borderRadius: 9, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--status-green)', fontWeight: 600, marginBottom: 2 }}>CD SENT</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Today, May 17</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>3-day period begins</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>EARLIEST SIGNING</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>May 20, 2026</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>3 business days</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>CLOSING DATE</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{closing}, 2026</div>
          <div style={{ fontSize: 11.5, color: 'var(--status-green)', marginTop: 2 }}>✓ On schedule</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <div style={{ flex: 1, background: 'var(--card-red-bg)', border: '1px solid var(--card-red-border)', borderRadius: 9, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--status-red)', fontWeight: 600, marginBottom: 2 }}>SEND BY</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--status-red)' }}>{deadline}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{daysLeft} days remaining</div>
      </div>
      <div style={{ flex: 1, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>CLOSING DATE</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{closing}, 2026</div>
        <div style={{ fontSize: 11.5, color: 'var(--status-amber)', marginTop: 2 }}>⚠ 5 days away</div>
      </div>
      <div style={{ flex: 1, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 9, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>RATE LOCK</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Expires May 24</div>
        <div style={{ fontSize: 11.5, color: 'var(--status-red)', marginTop: 2 }}>7 days — act now</div>
      </div>
    </div>
  );
}

const STEPS = [
  { id: 'cd',       label: 'Send CD' },
  { id: 'finalvoe', label: 'Final VOE' },
  { id: 'title',    label: 'Title Review' },
  { id: 'wire',     label: 'Wire Confirm' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'fund',     label: 'Fund' },
];

export function NowTabClosing({ borrowerName = 'Jennifer Wang', loanId = 'LN-2024-0211', loan }) {
  const [completed, setCompleted] = React.useState(new Set());
  const [funded, setFunded] = React.useState(false);

  const complete = (id) => setCompleted(prev => new Set(prev).add(id));
  const done = (id) => completed.has(id);
  const remaining = STEPS.filter(s => !completed.has(s.id)).length;
  const allDone = remaining === 0;

  if (funded) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="checkCircle" size={32} strokeWidth={1.85}/>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>Loan Funded 🎉</div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 8, maxWidth: 380, margin: '10px auto 0' }}>
          {borrowerName}'s loan of $780,000 has been funded. Keys delivered May 22, 2026.
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-outline">Generate closing package</button>
          <button className="btn btn-outline">Submit to investor</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Closing Checklist</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            {remaining} of {STEPS.length} steps remaining
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 1. CLOSING DISCLOSURE */}
        <ActionCard
          tone={done('cd') ? 'green' : 'red'}
          icon={<Icon name="doc" size={18} color={done('cd') ? '#1F7A45' : '#B33222'} strokeWidth={1.7}/>}
          iconBg={done('cd') ? 'rgba(223,241,229,0.9)' : '#F8DCD4'}
          header={<CardHeader
            title={done('cd') ? 'Closing Disclosure Sent ✓' : 'Send Closing Disclosure'}
            pill={done('cd') ? 'CD delivered' : 'TRID — Must send today'}
            pillTone={done('cd') ? 'green' : 'red'}
            urgency={done('cd') ? undefined : 'Closing in 5 days'}
          />}
          footer={done('cd') ? (
            <>
              <button className="btn btn-outline btn-sm">View CD</button>
              <button className="btn btn-outline btn-sm">Resend to borrower</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('cd')}>
                <Icon name="send" size={13}/> Generate & Send CD
              </button>
              <button className="btn btn-outline btn-sm">Preview CD</button>
            </>
          )}
        >
          <CDCountdown sent={done('cd')}/>
          {!done('cd') && (
            <AIInsight>
              CD must be delivered by May 19 to close on May 22. Today is May 17 — you have 2 days. I've pre-filled all CD fields from the loan file. Final cash-to-close: $47,820. Review takes ~90 seconds.
            </AIInsight>
          )}
        </ActionCard>

        {/* 2. FINAL VOE */}
        <ActionCard
          tone={done('finalvoe') ? 'green' : done('cd') ? 'neutral' : 'neutral'}
          icon={<Icon name="fileSearch" size={18} color={done('finalvoe') ? '#1F7A45' : done('cd') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('finalvoe') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('finalvoe') ? 'Final VOE Complete ✓' : 'Final Verbal VOE'}
            pill={done('finalvoe') ? 'Employment confirmed' : done('cd') ? 'Due before closing' : 'After CD is sent'}
            pillTone={done('finalvoe') ? 'green' : 'neutral'}
            eta={done('finalvoe') ? undefined : '~5 min'}
          />}
          footer={done('finalvoe') ? (
            <button className="btn btn-outline btn-sm">View VOE record</button>
          ) : done('cd') ? (
            <>
              <button className="btn btn-ai btn-sm" onClick={() => complete('finalvoe')}>
                <Icon name="sparkle" size={13}/> Run Instant VOE
              </button>
              <button className="btn btn-outline btn-sm">Verbal VOE log</button>
            </>
          ) : null}
        >
          {!done('finalvoe') && done('cd') && (
            <AIInsight>
              FHA requires verbal VOE within 10 business days of closing. Must confirm {borrowerName} is still employed at same position. Instant VOE via The Work Number takes ~30 seconds.
            </AIInsight>
          )}
          {!done('finalvoe') && !done('cd') && (
            <AIInsight>Complete CD delivery first — final VOE must be within 10 days of closing date.</AIInsight>
          )}
        </ActionCard>

        {/* 3. TITLE REVIEW */}
        <ActionCard
          tone={done('title') ? 'green' : done('cd') ? 'neutral' : 'neutral'}
          icon={<Icon name="check" size={18} color={done('title') ? '#1F7A45' : done('cd') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={2}/>}
          iconBg={done('title') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('title') ? 'Title Commitment Approved ✓' : 'Review Title Commitment'}
            pill={done('title') ? 'Clear to close' : done('cd') ? 'Received from Chicago Title' : 'Waiting on CD'}
            pillTone={done('title') ? 'green' : done('cd') ? 'amber' : 'neutral'}
          />}
          footer={done('title') ? (
            <button className="btn btn-outline btn-sm">View title commitment</button>
          ) : done('cd') ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('title')}>
                <Icon name="check" size={13}/> Approve Title
              </button>
              <button className="btn btn-outline btn-sm">View title commitment</button>
              <button className="btn btn-outline btn-sm">Flag exception</button>
            </>
          ) : null}
        >
          {!done('title') && done('cd') && (
            <AIInsight>
              Title commitment received from Chicago Title. No exceptions or liens found. Vesting: Jennifer Wang, an unmarried woman. Property is clear to close.
            </AIInsight>
          )}
        </ActionCard>

        {/* 4. WIRE INSTRUCTIONS */}
        <ActionCard
          tone={done('wire') ? 'green' : done('title') ? 'amber' : 'neutral'}
          icon={<Icon name="dollar" size={18} color={done('wire') ? '#1F7A45' : done('title') ? '#9C6A1A' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('wire') ? 'rgba(223,241,229,0.9)' : done('title') ? '#F6E6BD' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('wire') ? 'Wire Instructions Confirmed ✓' : 'Confirm Wire Instructions'}
            pill={done('wire') ? '$780,000 ready' : done('title') ? 'Urgent' : 'Waiting on title'}
            pillTone={done('wire') ? 'green' : done('title') ? 'amber' : 'neutral'}
          />}
          footer={done('wire') ? (
            <button className="btn btn-outline btn-sm">View wire confirmation</button>
          ) : done('title') ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('wire')}>
                <Icon name="check" size={13}/> Confirm Wire
              </button>
              <button className="btn btn-outline btn-sm">Edit instructions</button>
            </>
          ) : null}
        >
          {!done('wire') && done('title') && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                {[
                  { label: 'Funding Amount', value: '$780,000.00' },
                  { label: 'Settlement Agent', value: 'Chicago Title — Austin TX' },
                  { label: 'Routing #', value: '•••••• 4891' },
                  { label: 'Account #', value: '•••••••• 2204' },
                ].map(f => (
                  <div key={f.label} style={{ background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <AIInsight>Wire instructions verified against prior closing. Confirm before May 21 to ensure same-day funding on May 22.</AIInsight>
            </>
          )}
        </ActionCard>

        {/* 5. SCHEDULE CLOSING */}
        <ActionCard
          tone={done('schedule') ? 'green' : done('wire') ? 'neutral' : 'neutral'}
          icon={<Icon name="calendar" size={18} color={done('schedule') ? '#1F7A45' : done('wire') ? 'var(--text-secondary)' : 'var(--text-tertiary)'} strokeWidth={1.7}/>}
          iconBg={done('schedule') ? 'rgba(223,241,229,0.9)' : 'var(--bg-muted)'}
          header={<CardHeader
            title={done('schedule') ? 'Closing Scheduled ✓' : 'Schedule Closing Appointment'}
            pill={done('schedule') ? 'May 22 · 10:00 AM' : done('wire') ? 'Ready to schedule' : 'Waiting on wire'}
            pillTone={done('schedule') ? 'green' : 'neutral'}
          />}
          footer={done('schedule') ? (
            <>
              <button className="btn btn-outline btn-sm">Send calendar invite</button>
              <button className="btn btn-outline btn-sm">Reschedule</button>
            </>
          ) : done('wire') ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => complete('schedule')}>
                <Icon name="check" size={13}/> Confirm May 22 · 10:00 AM
              </button>
              <button className="btn btn-outline btn-sm">Pick different time</button>
            </>
          ) : null}
        >
          {!done('schedule') && done('wire') && (
            <AIInsight>
              Proposed: May 22, 2026 at 10:00 AM at Chicago Title — 892 Cedar Lane, Austin TX. I've sent a calendar hold to {borrowerName} and the settlement agent. Confirm to finalize.
            </AIInsight>
          )}
        </ActionCard>

        {/* 6. FUND */}
        {allDone && (
          <ActionCard
            tone="ai"
            icon={<Icon name="sparkles" size={18} color="var(--ai-primary)" strokeWidth={1.5}/>}
            iconBg="var(--ai-bg-strong)"
            header={<CardHeader title="Fund the Loan" pill="All clear — ready to fund" pillTone="green"/>}
            footer={
              <>
                <button className="btn btn-ai" onClick={() => setFunded(true)}>
                  <Icon name="check" size={14}/> Authorize Funding
                </button>
                <button className="btn btn-ghost">Hold — needs review</button>
              </>
            }
          >
            <AIInsight>
              All 5 closing items are complete. Final cash-to-close confirmed at $47,820. Wire instructions verified. Closing appointment set for May 22 at 10:00 AM. Ready to authorize the $780,000 funding wire.
            </AIInsight>
          </ActionCard>
        )}

      </div>
    </>
  );
}

export default NowTabClosing;
