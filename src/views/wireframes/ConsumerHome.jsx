import React from 'react';
import { Icon } from '../../components/Icon';

// Consumer / Borrower wireframe — completely different visual language
// from the internal LOS dashboards. Calm, plain language, mobile-first
// proportions even at desktop width.

const STAGES = [
  { id: 'application', label: 'Application', done: true },
  { id: 'disclosures', label: 'Disclosures',  done: true },
  { id: 'underwriting', label: 'Underwriting', current: true },
  { id: 'approval',    label: 'Approval' },
  { id: 'closing',     label: 'Closing' },
];

const TODO = [
  { id: 't1', icon: 'upload', title: 'Upload your most recent bank statement',
    sub: 'We need January and February to verify your assets.', cta: 'Upload' },
  { id: 't2', icon: 'send', title: 'Sign your initial disclosures',
    sub: 'Sent to your email on June 8 · 6 documents · ~5 minutes.', cta: 'Sign now' },
  { id: 't3', icon: 'calculator', title: 'Confirm your homeowners insurance',
    sub: 'Forward your policy declarations page from your insurer.', cta: 'Add' },
];

function StageDot({ stage, idx, last }) {
  const fill = stage.done ? '#10B981' : stage.current ? '#7E68FA' : '#E5E7EB';
  const lineFill = stage.done ? '#10B981' : '#E5E7EB';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1, height: 3, background: idx === 0 ? 'transparent' : lineFill }}/>
        <div style={{
          width: stage.current ? 28 : 22, height: stage.current ? 28 : 22,
          borderRadius: '50%', background: fill,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: stage.current ? '0 0 0 6px rgba(126,104,250,0.18)' : 'none',
          color: '#fff', fontSize: 12, fontWeight: 800, flexShrink: 0,
        }}>
          {stage.done ? '✓' : idx + 1}
        </div>
        <div style={{ flex: 1, height: 3, background: last ? 'transparent' : (stage.done ? '#10B981' : '#E5E7EB') }}/>
      </div>
      <div style={{
        marginTop: 10, fontSize: 12.5,
        fontWeight: stage.current ? 800 : 600,
        color: stage.current ? '#111827' : (stage.done ? '#374151' : '#9CA3AF'),
        whiteSpace: 'nowrap',
      }}>{stage.label}</div>
    </div>
  );
}

export function ConsumerHomeWireframe({ persona }) {
  const firstName = persona?.name?.split(' ')[0] || 'Sarah';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#F8FAFC' }}>

      {/* Hero — warm, plain-language */}
      <div style={{ padding: '32px 32px 8px', maxWidth: 980, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#10B981', marginBottom: 6 }}>
          On track · estimated close <span style={{ color: '#111827' }}>July 14</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 10px', color: '#111827', lineHeight: 1.1 }}>
          Welcome back, {firstName}.
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: '#4B5563', lineHeight: 1.55, maxWidth: 620 }}>
          You're three steps away from your new home. There are <strong style={{ color: '#111827' }}>3 things to do</strong> below.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '24px 32px 8px', maxWidth: 980, margin: '0 auto', width: '100%' }}>
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
          padding: '28px 28px 22px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {STAGES.map((s, i) => (
              <StageDot key={s.id} stage={s} idx={i} last={i === STAGES.length - 1}/>
            ))}
          </div>
        </div>
      </div>

      {/* Things to do */}
      <div style={{ padding: '24px 32px 8px', maxWidth: 980, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
            Things to do
          </h2>
          <span style={{ fontSize: 13, color: '#6B7280' }}>3 of 3 left · ~12 minutes</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TODO.map(t => (
            <div key={t.id} style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
              padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#EDE9FE', color: '#7E68FA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={t.icon} size={20} strokeWidth={1.6}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{t.sub}</div>
              </div>
              <button style={{
                background: '#111827', color: '#fff', border: 'none', borderRadius: 10,
                padding: '11px 18px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{t.cta} →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Loan summary + LO contact */}
      <div style={{ padding: '24px 32px 48px', maxWidth: 980, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          <div style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 22px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>
              Your loan, in plain English
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 2 }}>Loan amount</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', fontFamily: 'DM Mono' }}>$425,000</div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 2 }}>Monthly payment</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', fontFamily: 'DM Mono' }}>$2,847</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Principal + interest, est.</div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 2 }}>Rate</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', fontFamily: 'DM Mono' }}>6.875%</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>30-year fixed</div>
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 2 }}>Close by</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>July 14</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>33 days away</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 22px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
              Your loan officer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#4A39C9', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800,
              }}>AT</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Alex Torres</div>
                <div style={{ fontSize: 12.5, color: '#6B7280' }}>Loan Officer · Xpanse</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button style={{
                flex: 1, background: '#7E68FA', color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Message</button>
              <button style={{
                flex: 1, background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 10,
                padding: '10px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
