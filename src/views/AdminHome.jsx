import React from 'react';
import { Icon } from '../components/Icon';

// ── Admin Onboarding Home ────────────────────────────────────────────────────
// First-impression home for the Admin persona. Designed to feel like the
// Xpanse onboarding team is in the room — finite checklist, smart defaults,
// real co-pilot card. Skip-and-come-back is fine; no gated wizard.

const SETUP_STEPS = [
  { id: 'brand',       label: 'Brand your portal',        time: '5 min',  done: true,
    sub: 'Logo, lender name, primary color' },
  { id: 'products',    label: 'Loan products & rates',    time: '8 min',  done: true,
    sub: 'Conforming, FHA, VA, Jumbo · rate sheet source' },
  { id: 'forms',       label: 'Build your forms',         time: '12 min', done: false, recommended: true,
    sub: '1003, pre-qual, disclosure pack, condition library' },
  { id: 'team',        label: 'Invite your advisors',     time: '6 min',  done: false,
    sub: 'Send invites · assign branches & roles' },
  { id: 'branches',    label: 'Branches & regions',       time: '4 min',  done: false,
    sub: '1 branch configured · add more if needed' },
  { id: 'integrations',label: 'Connect your stack',       time: '10 min', done: false,
    sub: 'Credit bureaus, AUS (DU/LP), doc gen, e-sign, CRM' },
  { id: 'compliance',  label: 'Compliance & licensing',   time: '7 min',  done: false,
    sub: 'NMLS, state coverage, disclosure rules, audit log' },
  { id: 'ai-rules',    label: 'AI guardrails',            time: '5 min',  done: false,
    sub: 'When AI flags · escalation policy · approval gates' },
  { id: 'go-live',     label: 'Go live',                  time: '2 min',  done: false,
    sub: 'Final review, invite blast, launch ceremony' },
];

const ONBOARDING_TEAM = [
  { name: 'Maya Reyes',  role: 'Onboarding Lead',    initials: 'MR', color: '#7E68FA' },
  { name: 'Devin Park',  role: 'Solutions Engineer', initials: 'DP', color: '#0EA5E9' },
  { name: 'Jess Kuhn',   role: 'Customer Success',   initials: 'JK', color: '#059669' },
];

// ── ProgressRing ────────────────────────────────────────────────────────────
function ProgressRing({ done, total, size = 64 }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? done / total : 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke="#A78BFA" strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{done}<span style={{ opacity: 0.45, fontWeight: 600, fontSize: 13 }}>/{total}</span></div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>set up</div>
      </div>
    </div>
  );
}

// ── Setup checklist row ─────────────────────────────────────────────────────
function StepRow({ step, onOpen, onSkip }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      borderTop: '1px solid #F3F4F6',
      background: step.recommended ? '#FAF5FF' : 'transparent',
      transition: 'background 0.12s',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 999,
        background: step.done ? '#059669' : '#fff',
        border: step.done ? 'none' : '1.5px solid #D1D5DB',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {step.done && <Icon name="check" size={13} color="#fff" strokeWidth={2.6}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: step.done ? '#9CA3AF' : '#111827',
            textDecoration: step.done ? 'line-through' : 'none',
          }}>{step.label}</span>
          {step.recommended && !step.done && (
            <span style={{
              background: '#5B21B6', color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase',
            }}>Start here</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{step.sub}</div>
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, flexShrink: 0 }}>{step.time}</div>
      {!step.done && (
        <>
          <button onClick={() => onOpen && onOpen(step)} style={{
            background: step.recommended ? '#5B21B6' : '#fff',
            color: step.recommended ? '#fff' : '#111827',
            border: step.recommended ? 'none' : '1px solid #E5E7EB',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            {step.recommended ? 'Start' : 'Open'}
            <Icon name="arrowRight" size={11} strokeWidth={2.4}/>
          </button>
          <button onClick={() => onSkip && onSkip(step)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12, color: '#9CA3AF', padding: '6px 4px',
          }}>Skip</button>
        </>
      )}
    </div>
  );
}

// ── Showcase tile (links to Form Tool, Team, Connections, Compliance) ───────
function ShowcaseTile({ icon, eyebrow, title, body, footer, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
      padding: 20, textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 184,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'border-color 0.12s, box-shadow 0.12s, transform 0.06s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 4px 20px ${accent}22`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: accent + '15', color: accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} strokeWidth={1.8}/>
      </div>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>{eyebrow}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', letterSpacing: '-0.015em', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.45, flex: 1 }}>{body}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{footer}</span>
        <Icon name="arrowRight" size={14} color={accent} strokeWidth={2.4}/>
      </div>
    </button>
  );
}

// ── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ num, eyebrow, title, sublede }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>
        {String(num).padStart(2, '0')} · {eyebrow}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#111827', lineHeight: 1.2 }}>{title}</h2>
      {sublede && <p style={{ fontSize: 13, color: '#6B7280', margin: 0, maxWidth: 640 }}>{sublede}</p>}
    </div>
  );
}

// ── Main view ───────────────────────────────────────────────────────────────
export function AdminHomeView({ onNavigate }) {
  const [steps, setSteps] = React.useState(SETUP_STEPS);
  const doneCount = steps.filter(s => s.done).length;
  const totalCount = steps.length;

  const handleOpen = (step) => {
    if (step.id === 'forms')   { onNavigate && onNavigate('admin-forms'); return; }
    // Other steps: mark done (prototype-only — would route to a real flow)
    setSteps(prev => prev.map(s => s.id === step.id ? { ...s, done: true } : s));
  };

  const handleSkip = (step) => {
    setSteps(prev => prev.map(s => s.id === step.id ? { ...s, done: true, skipped: true } : s));
  };

  return (
    <div style={{ background: '#F4F5F7', overflowY: 'auto', flex: 1 }}>
      {/* ── Welcome hero ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1535 0%, #1e1b4b 40%, #1a1d3a 100%)',
        color: '#fff',
        padding: '24px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: 200, width: 340, height: 340, borderRadius: 999,
          background: 'radial-gradient(circle, rgba(126,104,250,0.18) 0%, transparent 70%)', pointerEvents: 'none',
        }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
              Day 1 with Xpanse
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              Welcome, Sue. Let's get your team running.
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, maxWidth: 560 }}>
              Most lenders are fully set up in under an hour. We've pre-configured smart defaults for everything — your job is to review, adjust, and invite your team.
            </p>
          </div>
          <ProgressRing done={doneCount} total={totalCount} size={86}/>
        </div>

        {/* Onboarding co-pilot card */}
        <div style={{
          marginTop: 22,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
          backdropFilter: 'blur(6px)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex' }}>
            {ONBOARDING_TEAM.map((p, i) => (
              <div key={p.name} style={{
                width: 32, height: 32, borderRadius: 999,
                background: p.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                border: '2px solid #1a1d3a',
                marginLeft: i === 0 ? 0 : -10,
              }}>{p.initials}</div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Your Xpanse onboarding team is here</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              Maya, Devin & Jess — set up your portal alongside you. Avg response: 11 min.
            </div>
          </div>
          <button style={{
            background: '#fff', color: '#1e1b4b', border: 'none',
            borderRadius: 9, padding: '8px 14px',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="phone" size={12} strokeWidth={2}/>
            Schedule a call
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.10)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 9, padding: '8px 14px',
            fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="messageSquare" size={12} strokeWidth={2}/>
            Chat now
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '4px 36px 60px', maxWidth: 1280, margin: '0 auto' }}>

        {/* ─── 01 · Setup checklist ────────────────────────────────── */}
        <SectionHeader
          num={1}
          eyebrow="Set up your portal"
          title={`${doneCount} of ${totalCount} configured — keep going`}
          sublede="Smart defaults are already in place. Open any item to review or have our team do it for you."
        />
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          {steps.map(step => (
            <StepRow key={step.id} step={step} onOpen={handleOpen} onSkip={handleSkip}/>
          ))}
          <div style={{
            padding: '12px 16px',
            background: '#FAFAFA',
            borderTop: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 12, color: '#6B7280',
          }}>
            <span>Estimated time remaining: <strong style={{ color: '#111827' }}>49 minutes</strong></span>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12.5, fontWeight: 700, color: '#5B21B6',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              Have our team do it all <Icon name="arrowRight" size={11} strokeWidth={2.4}/>
            </button>
          </div>
        </div>

        {/* ─── 02 · Form tool — the showcase ───────────────────────── */}
        <SectionHeader
          num={2}
          eyebrow="Build your forms"
          title="The form tool — drag, drop, done"
          sublede="Start from an Xpanse template, customize fields, and preview the LO experience in real time."
        />
        <div style={{
          background: 'linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 60%)',
          border: '1px solid #DDD6FE', borderRadius: 16,
          padding: 22,
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EDE9FE', color: '#5B21B6', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, marginBottom: 12 }}>
              <Icon name="sparkle" size={11}/>
              AI form builder
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
              "Build a pre-qual form for purchase loans with FHA option."
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 16 }}>
              Describe what you need in plain language. Xpanse generates the fields, suggests compliance checks, and shows you exactly what your LOs will see.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onNavigate && onNavigate('admin-forms')} style={{
                background: '#5B21B6', color: '#fff', border: 'none',
                borderRadius: 9, padding: '10px 18px',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}>
                Open form builder <Icon name="arrowRight" size={13} strokeWidth={2.4}/>
              </button>
              <button style={{
                background: '#fff', color: '#374151', border: '1px solid #E5E7EB',
                borderRadius: 9, padding: '10px 16px',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Browse templates
              </button>
            </div>
          </div>
          <div style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
            padding: 14,
            display: 'flex', flexDirection: 'column', gap: 8,
            boxShadow: '0 4px 16px rgba(91,33,182,0.08)',
          }}>
            {[
              { name: 'Form 1003 (URLA)',        fields: 312, status: 'Default · active' },
              { name: 'Pre-qualification',       fields:  18, status: 'Template · ready' },
              { name: 'Document checklist',      fields:  24, status: 'Default · active' },
              { name: 'Closing disclosure pack', fields:  47, status: 'Default · active' },
            ].map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: '#FAFAFA' }}>
                <Icon name="doc" size={14} color="#5B21B6"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{f.fields} fields · {f.status}</div>
                </div>
                <Icon name="arrowRight" size={12} color="#9CA3AF"/>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 03 · Team & Connections & Compliance ────────────────── */}
        <SectionHeader
          num={3}
          eyebrow="Get the rest in place"
          title="People, integrations, and compliance"
          sublede="Three other surfaces you'll want before going live. Each takes under 10 minutes."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <ShowcaseTile
            icon="building"
            eyebrow="Your team"
            title="12 advisors invited"
            body="8 active · 4 pending invite acceptance. Assign branches, set roles, and send a welcome blast."
            footer="Manage advisors →"
            accent="#0EA5E9"
            onClick={() => onNavigate && onNavigate('admin-team')}
          />
          <ShowcaseTile
            icon="zap"
            eyebrow="Connections"
            title="6 of 10 integrations live"
            body="Credit (Equifax · Experian · TransUnion), AUS (DU · LP), e-sign (DocuSign). Add doc gen, CRM, and ordering."
            footer="View integrations →"
            accent="#7E68FA"
            onClick={() => onNavigate && onNavigate('admin-integrations')}
          />
          <ShowcaseTile
            icon="shieldCheck"
            eyebrow="Compliance"
            title="Licensed in 4 states"
            body="PA, NJ, DE, MD active. NMLS tracking, disclosure rules, and audit log all configured. Add states as you grow."
            footer="Open compliance →"
            accent="#059669"
            onClick={() => onNavigate && onNavigate('admin-compliance')}
          />
        </div>

        {/* ─── Go live bar ────────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
          padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 999,
            background: doneCount === totalCount ? '#059669' : '#F3F4F6',
            color: doneCount === totalCount ? '#fff' : '#9CA3AF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="checkCircle" size={20} strokeWidth={2}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
              {doneCount === totalCount
                ? "You're ready to launch."
                : `${totalCount - doneCount} step${totalCount - doneCount === 1 ? '' : 's'} to go before launch`}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              {doneCount === totalCount
                ? 'Send your advisors their invitations and switch the portal live.'
                : 'Once everything is green, hit Go live and we\'ll send invitations to your team.'}
            </div>
          </div>
          <button disabled={doneCount !== totalCount} style={{
            background: doneCount === totalCount ? '#059669' : '#E5E7EB',
            color: doneCount === totalCount ? '#fff' : '#9CA3AF',
            border: 'none', borderRadius: 9,
            padding: '10px 20px',
            fontSize: 13.5, fontWeight: 700,
            cursor: doneCount === totalCount ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            Go live <Icon name="arrowRight" size={13} strokeWidth={2.4}/>
          </button>
        </div>
      </div>
    </div>
  );
}
