import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';

// ─── Oben loan data ───────────────────────────────────────────────────────────
const OBEN = {
  borrower: 'Michael Oben',
  loanId: 'LN-2024-0245',
  amount: '$680,000',
  product: 'Conv 30yr Fixed',
  rate: '6.625%',
  ltv: '75%',
  dti: '32%',
  fico: '761',
  property: '3156 Maple Ave, Seattle WA 98103',
  lockExpiry: 'May 21, 2026',
  lockDaysLeft: 3,
  lockExtend30Cost: '$850',
  lockExtend15Cost: '$425',
  repriceRate: '7.02%',
  repriceDelta: '+$287/mo',
  closingTarget: 'Jun 12, 2026',
  closingDays: 23,
  uwDecisionDate: 'May 18, 2026',
  uwName: 'J. Thompson',
  processor: 'J. Miller',
  title: 'Fidelity National Title',
  realtor: 'K. Walsh, Compass',
  approvalDate: 'May 18, 2026',
};

const PTF_CONDITIONS = [
  { id: 'P-001', owner: 'processor', title: 'Updated VOE — within 10 days of closing', due: 'Jun 8',  status: 'in-progress', note: 'Processor requested from The Work Number' },
  { id: 'P-002', owner: 'borrower',  title: 'Signed CD acknowledgment',               due: 'Jun 5',  status: 'pending',     note: 'Sent to borrower portal May 18' },
  { id: 'P-003', owner: 'processor', title: 'Hazard insurance binder — $680K',         due: 'Jun 10', status: 'received',    note: 'Received — under UW review' },
  { id: 'P-004', owner: 'processor', title: 'Final appraisal review sign-off',         due: 'Jun 10', status: 'received',    note: 'Cleared by UW May 19' },
];

const TIMELINE = [
  { label: 'Application',         date: 'May 7',  done: true },
  { label: 'Processing',          date: 'May 9',  done: true },
  { label: 'Submitted to UW',     date: 'May 15', done: true },
  { label: 'Conditional Approval',date: 'May 18', done: true, active: true },
  { label: 'Clear to Close',      date: '~Jun 6', done: false },
  { label: 'Closing',             date: 'Jun 12', done: false },
];

const statusMeta = {
  'received':    { label: 'Received',    dot: '#0E9F6E', text: '#065F46', bg: '#E7F8F1' },
  'in-progress': { label: 'In progress', dot: '#2453D6', text: '#1E3A8A', bg: '#EEF3FE' },
  'pending':     { label: 'Pending',     dot: '#D97706', text: '#7A3D00', bg: '#FEF6E7' },
};

function ConditionStatusPill({ status }) {
  const m = statusMeta[status] || statusMeta['pending'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: m.bg, color: m.text, borderRadius: 999,
      fontSize: 11, fontWeight: 600, padding: '2px 9px', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot }}/>
      {m.label}
    </span>
  );
}

export function LOApprovalView() {
  const [lockExtended, setLockExtended] = React.useState(false);
  const [lockModalOpen, setLockModalOpen] = React.useState(false);
  const [selectedExtension, setSelectedExtension] = React.useState(null);
  const [conditionsExpanded, setConditionsExpanded] = React.useState(false);

  const clearPct = Math.round((PTF_CONDITIONS.filter(c => c.status === 'received').length / PTF_CONDITIONS.length) * 100);

  return (
    <>
      {/* ── Closing timeline — top of page, always visible ─────────────────── */}
      <div style={{ background: '#fff', border: '1px solid #E5E8F0', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1B2B' }}>Closing timeline</div>
          <div style={{ fontSize: 12, color: '#8B95A6', fontFamily: 'JetBrains Mono, monospace' }}>Target {OBEN.closingTarget} · {OBEN.closingDays}d away</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 11, left: 11, right: 11, height: 2, background: '#E5E8F0', zIndex: 0 }}/>
          <div style={{ position: 'absolute', top: 11, left: 11, height: 2, background: 'linear-gradient(90deg, #0A1F44, #0DBFA8)', width: (4 / TIMELINE.length * 100) + '%', zIndex: 1, transition: 'width 0.5s ease' }}/>
          {TIMELINE.map((step, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: step.done ? '#0A1F44' : step.active ? '#2453D6' : '#fff',
                border: step.active ? '2px solid #2453D6' : step.done ? 'none' : '2px solid #D1D6E1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: step.active ? '0 0 0 4px #EEF3FE' : 'none',
                transition: 'all 0.3s',
              }}>
                {step.done && <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>}
                {step.active && !step.done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2453D6' }}/>}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: step.active ? 700 : step.done ? 600 : 400, color: step.active ? '#2453D6' : step.done ? '#0B1B2B' : '#8B95A6', marginTop: 6, textAlign: 'center', lineHeight: 1.3 }}>{step.label}</div>
              <div style={{ fontSize: 10, color: step.active ? '#2453D6' : '#8B95A6', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{step.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lock Expiry Banner ─────────────────────────────────────────────── */}
      {!lockExtended && (
        <div style={{
          background: 'linear-gradient(90deg, #FEF6E7, #FFF8F0)',
          border: '1px solid #FDE9C2',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 20,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FDE9C2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" fill="none" stroke="#D97706" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>Rate lock expires {OBEN.lockExpiry}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, background: '#EF4444', color: '#fff',
                padding: '2px 8px', borderRadius: 999,
              }}>{OBEN.lockDaysLeft} days</span>
            </div>
            <div style={{ fontSize: 12.5, color: '#7A3D00', marginTop: 3 }}>
              {OBEN.product} · <b>{OBEN.rate}</b> locked. Without extension, loan reprices at <b>{OBEN.repriceRate}</b> (<b>{OBEN.repriceDelta}</b>).
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setLockModalOpen(true)} style={{
              height: 34, padding: '0 16px', borderRadius: 7, border: 'none',
              background: '#D97706', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Extend lock →</button>
            <button style={{
              height: 34, padding: '0 14px', borderRadius: 7,
              border: '1px solid #FDE9C2', background: 'transparent',
              color: '#92400E', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>Float-down options</button>
          </div>
        </div>
      )}

      {lockExtended && (
        <div style={{
          background: '#E7F8F1', border: '1px solid #A7F3D0', borderRadius: 12,
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        }}>
          <svg width="16" height="16" fill="none" stroke="#0E9F6E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#065F46' }}>Rate lock extended to Jun {selectedExtension === 30 ? '21' : '7'}, 2026 ✓</span>
          <span style={{ fontSize: 12, color: '#059669', marginLeft: 4 }}>Confirmation sent to file · {selectedExtension === 30 ? '$850' : '$425'} fee logged</span>
        </div>
      )}

      {/* ── Single column layout ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left: Main content ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* UW Decision card */}
          <div style={{
            background: '#fff', border: '1px solid #E5E8F0', borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{ background: 'linear-gradient(90deg, #E7F8F1, #F0FDF4)', padding: '14px 18px', borderBottom: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#0E9F6E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#065F46' }}>Conditional Approval</div>
                <div style={{ fontSize: 11.5, color: '#059669' }}>Issued {OBEN.approvalDate} · UW: {OBEN.uwName}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <StatusPill tone="green">DU Approve / Eligible</StatusPill>
              </div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              {/* Loan terms grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 14 }}>
                {[
                  { label: 'Loan Amount', value: OBEN.amount, mono: true },
                  { label: 'Product', value: OBEN.product },
                  { label: 'Rate', value: OBEN.rate, mono: true },
                  { label: 'LTV', value: OBEN.ltv, mono: true },
                  { label: 'DTI', value: OBEN.dti, mono: true },
                  { label: 'FICO', value: OBEN.fico, mono: true },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 10, color: '#8B95A6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1B2B', fontFamily: s.mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* AI insight */}
              <div style={{ background: '#F9FAFC', border: '1px solid #E5E8F0', borderRadius: 9, padding: '10px 13px', display: 'flex', gap: 9, fontSize: 13, color: '#5A6577', lineHeight: 1.55 }}>
                <Icon name="sparkle" size={13} color="#7E68FA" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
                <span>Oben's file is clean. DTI at 32% is well inside guideline. Appraisal came in at value. Strongest risk factor is employment gap in 2022 — UW approved with standard conditions. <b style={{ color: '#0B1B2B' }}>No surprises expected at closing.</b></span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button style={{ height: 30, padding: '0 12px', borderRadius: 6, border: '1px solid #E5E8F0', background: '#fff', color: '#5A6577', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>View approval letter</button>
                <button style={{ height: 30, padding: '0 12px', borderRadius: 6, border: '1px solid #E5E8F0', background: '#fff', color: '#5A6577', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Full UW decision</button>
              </div>
            </div>
          </div>

          {/* PTF Conditions (read-only for LO) — collapsible */}
          {(() => {
            const cleared = PTF_CONDITIONS.filter(c => c.status === 'received');
            const open = PTF_CONDITIONS.filter(c => c.status !== 'received');
            const ownerLabel = { processor: 'Processor', borrower: 'Borrower' };
            const ownerColor = { processor: '#2453D6', borrower: '#D97706' };
            return (
              <div style={{ background: '#fff', border: '1px solid #E5E8F0', borderRadius: 14, overflow: 'hidden' }}>
                {/* ── Clickable header row ── */}
                <button
                  onClick={() => setConditionsExpanded(e => !e)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {/* Progress ring */}
                  <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#F1F2F5" strokeWidth="4"/>
                      <circle cx="20" cy="20" r="16" fill="none"
                        stroke="#0DBFA8" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 16 * clearPct / 100} ${2 * Math.PI * 16}`}
                        strokeLinecap="round"
                        transform="rotate(-90 20 20)"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#0B1B2B',
                    }}>{clearPct}%</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1B2B' }}>Prior-to-Funding Conditions</div>
                    <div style={{ fontSize: 12, color: '#8B95A6', marginTop: 2 }}>
                      <span style={{ color: '#0E9F6E', fontWeight: 600 }}>{cleared.length} cleared</span>
                      <span style={{ margin: '0 5px', color: '#D1D6E1' }}>·</span>
                      <span style={{ color: '#D97706', fontWeight: 600 }}>{open.length} open</span>
                      <span style={{ margin: '0 5px', color: '#D1D6E1' }}>·</span>
                      on track for Jun 5
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="16" height="16" fill="none" stroke="#8B95A6" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: conditionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* ── Expandable body ── */}
                <div style={{
                  maxHeight: conditionsExpanded ? 600 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}>
                  <div style={{ padding: '0 18px 16px' }}>
                    {/* Linear progress bar */}
                    <div style={{ height: 4, background: '#F1F2F5', borderRadius: 999, marginBottom: 16, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 999,
                        background: 'linear-gradient(90deg, #0A1F44, #0DBFA8)',
                        width: clearPct + '%', transition: 'width 0.5s ease',
                      }}/>
                    </div>

                    {/* 2-column grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {/* Cleared column */}
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0E9F6E', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                          ✓ Cleared ({cleared.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {cleared.map(c => (
                            <div key={c.id} style={{
                              padding: '8px 10px', background: '#F0FDF8',
                              border: '1px solid #A7F3D0', borderRadius: 8,
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#065F46', lineHeight: 1.35 }}>{c.title}</div>
                              <div style={{ fontSize: 11, color: '#059669', marginTop: 3 }}>{c.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Open column */}
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                          ⏳ In progress ({open.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {open.map(c => (
                            <div key={c.id} style={{
                              padding: '8px 10px', background: '#FFFBF0',
                              border: '1px solid #FDE9C2', borderRadius: 8,
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#7A3D00', lineHeight: 1.35 }}>{c.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                                  background: ownerColor[c.owner] + '18', color: ownerColor[c.owner],
                                }}>{ownerLabel[c.owner]}</span>
                                <span style={{ fontSize: 10.5, color: '#A16207' }}>Due {c.due}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI pace note */}
                    <div style={{ marginTop: 12, padding: '9px 12px', background: '#EEF3FE', borderRadius: 8, fontSize: 12.5, color: '#2453D6', display: 'flex', gap: 8 }}>
                      <Icon name="sparkle" size={12} color="#2453D6" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }}/>
                      At this pace, all PTF conditions clear by <b style={{ marginLeft: 4 }}>Jun 5</b> — 7 days before closing. You're on track.
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

      {/* ── Lock Extension Modal ──────────────────────────────────────────── */}
      {lockModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.target === e.currentTarget && setLockModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E5E8F0' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0B1B2B' }}>Extend rate lock</div>
              <div style={{ fontSize: 12.5, color: '#8B95A6', marginTop: 3 }}>Michael Oben · LN-2024-0245 · Currently {OBEN.rate}</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12.5, color: '#5A6577', marginBottom: 14 }}>Current lock expires <b style={{ color: '#D97706' }}>May 21</b>. Select extension term:</div>

              {[
                { days: 15, expires: 'Jun 7, 2026',  fee: '$425',  note: '7-day buffer before closing' },
                { days: 30, expires: 'Jun 21, 2026', fee: '$850',  note: 'Recommended — 9-day buffer' },
              ].map(opt => (
                <div key={opt.days} onClick={() => setSelectedExtension(opt.days)} style={{
                  padding: '14px 16px', borderRadius: 10, marginBottom: 10, cursor: 'pointer',
                  border: `2px solid ${selectedExtension === opt.days ? '#2453D6' : '#E5E8F0'}`,
                  background: selectedExtension === opt.days ? '#EEF3FE' : '#F9FAFC',
                  transition: 'all 0.12s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1B2B' }}>{opt.days}-day extension</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#2453D6', fontFamily: 'JetBrains Mono, monospace' }}>{opt.fee}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#8B95A6', marginTop: 4 }}>New expiry: {opt.expires} · {opt.note}</div>
                  {opt.days === 30 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#2453D6', fontWeight: 600 }}>⭐ Recommended</div>
                  )}
                </div>
              ))}

              <div style={{ background: '#F9FAFC', border: '1px solid #E5E8F0', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: '#5A6577', marginBottom: 16 }}>
                Extension fee will be logged to loan file and disclosed on CD amendment. {OBEN.rate} rate is preserved.
              </div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
              <button onClick={() => setLockModalOpen(false)} style={{ flex: 1, height: 38, borderRadius: 8, border: '1px solid #E5E8F0', background: '#fff', color: '#5A6577', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button
                disabled={!selectedExtension}
                onClick={() => { setLockExtended(true); setLockModalOpen(false); }}
                style={{
                  flex: 2, height: 38, borderRadius: 8, border: 'none',
                  background: selectedExtension ? '#2453D6' : '#E5E8F0',
                  color: selectedExtension ? '#fff' : '#8B95A6',
                  fontSize: 13, fontWeight: 700, cursor: selectedExtension ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                }}>
                Confirm extension{selectedExtension ? ` — ${selectedExtension === 15 ? '$425' : '$850'}` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default LOApprovalView;
