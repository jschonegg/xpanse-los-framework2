import React from 'react';
import { WireCard, WirePlaceholder, WireListRows, WireKpiStrip } from './wireframePrimitives';

// Processor wireframe — queue-first reshape. Different anchor than the
// existing ProcessorHomeView: today's queue + bulk operations lead, then
// SLA / workload.

export function ProcessorHomeWireframe({ persona, onOpenLoan }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0F1117' }}>

      {/* Hero — operations dispatcher */}
      <div style={{
        background: 'linear-gradient(135deg, #0F1733 0%, #19224B 50%, #14233E 100%)',
        padding: '20px 32px', color: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>
              PROCESSOR DESK · CAMP HILL
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', margin: '6px 0 0', lineHeight: 1.1 }}>
              Good morning, {persona?.name?.split(' ')[0] || 'Priya'}.
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              18 files assigned · 4 ready to submit · 2 borrowers overdue
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              background: '#fff', color: '#111', border: 'none', borderRadius: 8, padding: '9px 16px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Open my queue →</button>
            <button style={{
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, padding: '9px 14px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Bulk actions</button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px', background: '#F4F5F7' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 14 }}>
          Your queue · today
        </div>

        <WireKpiStrip stats={[
          { label: 'Assigned',         value: '18', sub: '4 ready · 2 stuck' },
          { label: 'Cleared today',    value: '9',  sub: 'team goal 8' },
          { label: 'Avg cycle time',   value: '12d', sub: 'best in branch' },
          { label: 'SLA breach risk',  value: '3',  sub: 'within 24h' },
        ]}/>

        <div style={{ height: 18 }}/>

        {/* Today's queue — the anchor */}
        <WireCard
          title="Today's queue · ranked by SLA"
          accent="#7E68FA" icon="listCheck"
          hint="Click rows to open file · use selection for bulk actions"
          footer="Bulk: clear N conditions · submit N to UW · remind N borrowers"
        >
          <WireListRows accent="#7E68FA" rows={[
            { tag: '!', title: 'Anderson · LN-2024-0234', sub: '2 conditions cleared, awaiting bank statement · SLA in 18h',
              actions: [{ label: 'Open', primary: true }, { label: 'Remind' }] },
            { tag: '!', title: 'Martinez · LN-2024-0207', sub: '3 conditions outstanding · borrower silent 3d',
              actions: [{ label: 'Open', primary: true }, { label: 'Escalate' }] },
            { tag: '2', title: 'Wang · LN-2024-0211', sub: 'All conditions met · ready to submit to UW',
              actions: [{ label: 'Submit to UW', primary: true }] },
            { tag: '3', title: 'Garcia · LN-2024-0198', sub: 'Insurance binder needed · borrower confirmed today',
              actions: [{ label: 'Open', primary: true }, { label: 'Mark cleared' }] },
            { tag: '4', title: 'Thompson · LN-2024-0223', sub: 'Manual gift letter review · pending',
              actions: [{ label: 'Open', primary: true }] },
          ]}/>
        </WireCard>

        <div style={{ height: 14 }}/>

        {/* Two-up: Ready to submit + Borrower waiting */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <WireCard title="Ready to submit · UW" accent="#10B981" icon="checkCircle"
            hint="4 files cleared · bulk action available"
            footer="Bulk submit all 4 to underwriting →">
            <WireListRows accent="#10B981" rows={[
              { tag: '✓', title: 'Wang · LN-2024-0211', sub: 'All PTD conditions cleared · AI verified' },
              { tag: '✓', title: 'Liu · LN-2024-0289',  sub: 'Income, assets, appraisal verified' },
              { tag: '✓', title: 'Sharma · LN-2024-0312', sub: 'Closing prep complete' },
              { tag: '✓', title: 'Kim · LN-2024-0298',   sub: 'Clean file · AI verified' },
            ]}/>
          </WireCard>

          <WireCard title="Borrowers waiting · 2d+" accent="#D97706" icon="mail"
            hint="5 outstanding · bulk-remind available"
            footer="Bulk remind all 5 via email + SMS →">
            <WireListRows accent="#D97706" rows={[
              { tag: '4d', title: 'Anderson', sub: '2023 W-2 and final pay stub' },
              { tag: '3d', title: 'Martinez', sub: 'Two months of bank statements' },
              { tag: '2d', title: 'Chen',     sub: 'Homeowners insurance binder' },
              { tag: '2d', title: 'Rivera',   sub: 'Gift letter source documentation' },
            ]}/>
          </WireCard>
        </div>

        <div style={{ height: 14 }}/>

        {/* Team load */}
        <WireCard title="Team load · Camp Hill" accent="#6B7280" icon="trendingUp"
          hint="Visibility, not assignment — coordinate coverage if someone is drowning">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <WirePlaceholder label="You · 18 files" sub="2 SLA risk · on track" accent="#7E68FA"/>
            <WirePlaceholder label="Marcus · 22 files" sub="4 SLA risk · needs help" accent="#EF4444"/>
            <WirePlaceholder label="Riley · 14 files" sub="capacity for ~4 more"/>
            <WirePlaceholder label="Tom · 19 files" sub="on PTO Thursday"/>
          </div>
        </WireCard>
      </div>
    </div>
  );
}
