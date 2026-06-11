import React from 'react';
import { Icon } from '../components/Icon';
import { LOANS } from '../data/loans';
import { flags } from '../flags';

const COACH_NAME = flags.aiCoachBrand ? 'AI Coach' : 'Halo';

// ── AI Insights (Halo) ──────────────────────────────────────────────────────
// Four-column layout: Halo identity card on the left, then 3 insight cards
// (Doing Well / Nudge / Heads Up). Replaces the single-row banner on Home.

function pickInsights() {
  // Heads Up — closest lock expiration
  const headsUp = LOANS
    .filter(l => l.lockStatus === 'Expiring' && l.lockDays != null)
    .sort((a, b) => a.lockDays - b.lockDays)[0];

  // Nudge — files in Application stage (untouched leads)
  const nudgePool = LOANS.filter(l => l.status === 'Application');
  const nudge = nudgePool[0];

  // Doing Well — a real "on track" file
  const doingWell = LOANS.find(l => l.aiStatus === 'On Track' && l.status === 'Closing')
                  || LOANS.find(l => l.aiStatus === 'On Track');

  return { doingWell, nudge: { sample: nudge, total: nudgePool.length }, headsUp };
}

function InsightCard({ tone, eyebrow, icon, headline, body, onTry }) {
  const tones = {
    green: { fg: '#059669', bg: '#E6F5EF' },
    blue:  { fg: '#5B21B6', bg: '#EDE9FE' },
    amber: { fg: '#92400E', bg: '#FFF3CD' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
      padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: t.bg, color: t.fg,
        padding: '4px 10px 4px 8px', borderRadius: 999,
        alignSelf: 'flex-start',
        fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>
        <Icon name={icon} size={12} strokeWidth={2}/>
        {eyebrow}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
        {headline}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5, flex: 1 }}>
        {body}
      </p>
      <button onClick={onTry} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        color: '#5B21B6', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
      }}>
        Try this <Icon name="arrowRight" size={12} strokeWidth={2.4}/>
      </button>
    </div>
  );
}

export function AIInsightsCards({ onOpenLoan }) {
  const { doingWell, nudge, headsUp } = pickInsights();

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr 1.2fr', gap: 14,
      alignItems: 'stretch',
    }}>
      {/* Halo identity card */}
      <div style={{ padding: '6px 6px 6px 8px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'linear-gradient(135deg, #7E68FA 0%, #5B21B6 100%)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(91,33,182,0.22)',
          }}>
            <Icon name="sparkle" size={18} strokeWidth={1.6}/>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{COACH_NAME} <span style={{ color: '#6B7280', fontWeight: 600 }}>· your AI supervisor</span></div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Updated 4 minutes ago</div>
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 'auto' }}>
          Here's how you're doing — and three small moves to perform even better today.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button style={{
            background: '#5B21B6', color: '#fff', border: 'none',
            borderRadius: 9, padding: '8px 14px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Open in {COACH_NAME} <Icon name="arrowRight" size={12} strokeWidth={2.4}/>
          </button>
          <button style={{
            background: '#fff', color: '#374151', border: '1px solid #E5E7EB',
            borderRadius: 9, padding: '8px 12px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Why this?
          </button>
        </div>
      </div>

      <InsightCard
        tone="green" eyebrow="Doing well" icon="checkCircle"
        headline="You're on pace to hit 110% of May plan."
        body="Pull-through is up 6 pts vs April. Keep prioritizing Clear-to-Close loans early in the day."
        onTry={() => doingWell && onOpenLoan && onOpenLoan(doingWell.id)}
      />

      <InsightCard
        tone="blue" eyebrow="Nudge" icon="zap"
        headline={`${nudge.total || 2} leads from yesterday haven't been called.`}
        body={nudge.sample
          ? `${nudge.sample.borrower} and others. Industry data shows a 6× contact-to-app lift when reached within 5 minutes.`
          : `Industry data shows a 6× contact-to-app lift when reached within 5 minutes.`}
        onTry={() => nudge.sample && onOpenLoan && onOpenLoan(nudge.sample.id)}
      />

      <InsightCard
        tone="amber" eyebrow="Heads up" icon="clock"
        headline={headsUp
          ? `${headsUp.borrower}'s lock expires in ${headsUp.lockDays} day${headsUp.lockDays === 1 ? '' : 's'}.`
          : `A rate lock is approaching expiration.`}
        body={headsUp
          ? `Disclosures are sent but UW is light. Suggest a ${headsUp.lockDays + 4}-day extension or expedite the CD prep today.`
          : `Suggest extending or expediting the CD prep today.`}
        onTry={() => headsUp && onOpenLoan && onOpenLoan(headsUp.id, 'pricing')}
      />
    </div>
  );
}
