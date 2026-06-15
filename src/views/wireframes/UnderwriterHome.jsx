import React from 'react';
import { Icon } from '../../components/Icon';
import { WireCard, WirePlaceholder, WireListRows, WireKpiStrip } from './wireframePrimitives';

export function UnderwriterHomeWireframe({ persona, onOpenLoan }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0F1117' }}>

      {/* Hero — calm, decision-oriented */}
      <div style={{
        background: 'linear-gradient(135deg, #122 0%, #143 40%, #0F2 100%)',
        backgroundImage: 'linear-gradient(135deg, #0A1F1A 0%, #0F2F26 40%, #0F1F1A 100%)',
        padding: '20px 32px', color: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>
              UNDERWRITER DESK
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', margin: '6px 0 0' }}>
              Good morning, {persona?.name?.split(' ')[0] || 'David'}.
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              12 files awaiting decision · 3 over SLA · 5 marked AI-VERIFIED
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              background: '#fff', color: '#111', border: 'none', borderRadius: 8, padding: '9px 16px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Open queue →</button>
            <button style={{
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, padding: '9px 14px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Today's stats</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px', background: '#F4F5F7' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 14 }}>
          Your desk
        </div>

        {/* KPI strip */}
        <WireKpiStrip stats={[
          { label: 'In my queue',    value: '12',  sub: '3 over SLA' },
          { label: 'Cleared today',  value: '7',   sub: '+2 vs avg' },
          { label: 'Avg turn time',  value: '4.2h', sub: 'team avg 5.1h' },
          { label: 'Exceptions open', value: '2',   sub: 'awaiting review' },
        ]}/>

        <div style={{ height: 18 }}/>

        {/* Decision queue */}
        <WireCard
          title="Decision queue"
          hint="Ranked by lock proximity + risk score"
          accent="#7E68FA"
          icon="listCheck"
          footer="Click any row to open the file in review mode."
        >
          <WireListRows accent="#7E68FA" rows={[
            { tag: '!', title: 'Anderson · LN-2024-0234', sub: 'Lock expires in 2d · DTI 41% · LTV 78% · Conv 30yr',
              actions: [{ label: 'Review', primary: true }, { label: 'Decline' }] },
            { tag: '!', title: "O'Connor · LN-2024-0341", sub: 'Lock expires in 4d · Manual gift letter · FHA 30yr',
              actions: [{ label: 'Review', primary: true }, { label: 'Suspend' }] },
            { tag: '2', title: 'Wang · LN-2024-0211', sub: 'All PTD conditions met · AI verified · Conv 30yr',
              actions: [{ label: 'Approve', primary: true }, { label: 'Condition' }] },
            { tag: '3', title: 'Garcia · LN-2024-0198', sub: 'Clean file · DTI 38% · LTV 78%',
              actions: [{ label: 'Approve', primary: true }, { label: 'Condition' }] },
            { tag: '4', title: 'Thompson · LN-2024-0223', sub: 'Manual review on gift letter complete',
              actions: [{ label: 'Review', primary: true }] },
          ]}/>
        </WireCard>

        <div style={{ height: 14 }}/>

        {/* Two-up: Risk flags + Recent decisions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <WireCard title="Risk flags · your queue" accent="#EF4444" icon="alertOctagon"
            hint="Auto-surfaced by AI screener">
            <WirePlaceholder label="DTI > 43% · 2 files"
              sub="Wang and Rodriguez — both have compensating factors flagged by AI"/>
            <div style={{ height: 8 }}/>
            <WirePlaceholder label="LTV > 95% · 1 file" sub="Anderson — MI quote on file"/>
            <div style={{ height: 8 }}/>
            <WirePlaceholder label="Fraud signal · 0 files" sub="No alerts from CoreLogic LoanSafe today" accent="#10B981"/>
          </WireCard>

          <WireCard title="Recent decisions · last 10" accent="#0EA5E9" icon="checkCircle"
            hint="Audit trail · click to revisit">
            <WireListRows accent="#0EA5E9" rows={[
              { tag: '✓', title: 'Liu · LN-2024-0289', sub: 'Approved · 11 min ago' },
              { tag: '✓', title: 'Sharma · LN-2024-0312', sub: 'Approved with condition · 1h ago' },
              { tag: '×', title: 'Bell · LN-2024-0276', sub: 'Suspended — income docs · 2h ago' },
              { tag: '✓', title: 'Kim · LN-2024-0298', sub: 'Approved · 3h ago' },
            ]}/>
          </WireCard>
        </div>

        <div style={{ height: 14 }}/>

        {/* Guideline quick links */}
        <WireCard title="Guidelines · quick reference" accent="#6B7280" icon="book"
          hint="Saved matrices and exception templates">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {['FHA 30yr matrix', 'Conv FNMA DU', 'Jumbo · in-house', 'VA · IRRRL'].map(g => (
              <div key={g} style={{
                border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 12px',
                background: '#FAFAFB', fontSize: 12.5, fontWeight: 600, color: '#374151',
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              }}>
                <Icon name="book" size={13} color="#6B7280"/>
                {g}
              </div>
            ))}
          </div>
        </WireCard>
      </div>
    </div>
  );
}
