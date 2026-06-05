import React from 'react';
import { Icon } from '../components/Icon';

// ─── Widget registry ──────────────────────────────────────────────────────────
// Each entry describes a widget: metadata + its render component.
// `defaultWidth` is the preferred width when first added.

// Bump the storage key when DEFAULT_LAYOUT changes meaningfully so existing
// users see the new default the next time they load the home.
const STORAGE_KEY = 'los-widget-layout-v4';

const DEFAULT_LAYOUT = [
  { id: 'ai-coach-brief',      width: 'full' },
  { id: 'files-at-risk',       width: 'half' },
  { id: 'ready-for-uw',        width: 'half' },
  { id: 'lock-clock',          width: 'half' },
  { id: 'waiting-on-borrower', width: 'half' },
  { id: 'leaderboard',         width: 'full' },
  { id: 'company-feed',        width: 'full' },
];

function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) ? saved : DEFAULT_LAYOUT;
  } catch { return DEFAULT_LAYOUT; }
}

function saveLayout(layout) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

// ─── Individual widget components ─────────────────────────────────────────────

// ── Pipeline Snapshot ──────────────────────────────────────────────────────
export function PipelineSnapshotWidget() {
  const stats = [
    { label: 'Closing this month', value: '8',   sub: 'next: Jun 14',   color: '#059669', icon: 'calculator' },
    { label: 'In Underwriting',    value: '3',   sub: '1 flagged',       color: '#7E68FA', icon: 'fileSearch' },
    { label: 'Needs Attention',    value: '5',   sub: 'conditions open', color: '#D97706', icon: 'alertCircle' },
    { label: 'Avg Days to Close',  value: '34d', sub: '↓3 vs last mo',  color: '#0EA5E9', icon: 'clock' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: s.color + '0D', border: '1px solid ' + s.color + '30', borderRadius: 10, padding: '13px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={s.icon} size={15} color={s.color}/>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', fontFamily: 'DM Mono', lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Closing Countdown ──────────────────────────────────────────────────────
export function ClosingCountdownWidget() {
  const closings = [
    { name: 'Sarah Anderson',  loanId: 'LN-2024-0234', days: 18, status: 'Underwriting', statusColor: '#3B82F6' },
    { name: 'James Liu',       loanId: 'LN-2024-0289', days: 23, status: 'Processing',   statusColor: '#D97706' },
    { name: 'Priya Sharma',    loanId: 'LN-2024-0312', days: 31, status: 'Closing',      statusColor: '#059669' },
    { name: 'Carlos Rivera',   loanId: 'LN-2024-0391', days: 35, status: 'Underwriting', statusColor: '#3B82F6' },
    { name: 'Rachel Kim',      loanId: 'LN-2024-0298', days: 42, status: 'Approval',     statusColor: '#7E68FA' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {closings.map((c, i) => (
        <div key={c.loanId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: i === 0 ? '#FFF7ED' : '#FAFAFA', border: '1px solid ' + (i === 0 ? '#FDE68A' : '#F3F4F6'), borderRadius: 8 }}>
          <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: i === 0 ? '#D97706' : '#374151', fontFamily: 'DM Mono', lineHeight: 1 }}>{c.days}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>days</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{c.loanId}</div>
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: c.statusColor, background: c.statusColor + '15', padding: '2px 7px', borderRadius: 4, flexShrink: 0 }}>{c.status}</span>
        </div>
      ))}
    </div>
  );
}

// ── Rate Watch ─────────────────────────────────────────────────────────────
export function RateWatchWidget() {
  const rates = [
    { label: '30-yr Fixed',  rate: '6.875%', change: '+0.03',  dir: 'up' },
    { label: '15-yr Fixed',  rate: '6.125%', change: '-0.08',  dir: 'down' },
    { label: '5/1 ARM',      rate: '6.250%', change: '+0.00',  dir: 'flat' },
    { label: 'FHA 30-yr',    rate: '6.500%', change: '-0.04',  dir: 'down' },
  ];
  const dirColor = { up: '#EF4444', down: '#059669', flat: '#9CA3AF' };
  const dirIcon  = { up: '↑', down: '↓', flat: '—' };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: '#059669' }}/>
        <span style={{ fontSize: 11.5, color: '#6B7280' }}>Market rates · Updated 2h ago</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {rates.map(r => (
          <div key={r.label} style={{ padding: '11px 13px', background: '#FAFAFA', border: '1px solid #F3F4F6', borderRadius: 9 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginBottom: 4 }}>{r.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'DM Mono', color: '#111827', letterSpacing: '-0.02em' }}>{r.rate}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: dirColor[r.dir] }}>{dirIcon[r.dir]}{r.change}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Conditions Tracker ─────────────────────────────────────────────────────
export function ConditionsTrackerWidget() {
  const cats = [
    { label: 'Income / Employment', open: 4, total: 6, color: '#7E68FA' },
    { label: 'Assets / Reserves',   open: 2, total: 4, color: '#0EA5E9' },
    { label: 'Property / Appraisal',open: 3, total: 5, color: '#D97706' },
    { label: 'Insurance',           open: 1, total: 3, color: '#059669' },
    { label: 'Title & Legal',       open: 0, total: 2, color: '#374151' },
  ];
  const totalOpen = cats.reduce((a, c) => a + c.open, 0);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'DM Mono', color: '#111827' }}>{totalOpen}</span>
        <span style={{ fontSize: 13, color: '#6B7280' }}>open conditions across 8 loans</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {cats.map(c => (
          <div key={c.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12.5, color: '#374151', fontWeight: 500 }}>{c.label}</span>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono', color: c.open > 0 ? '#374151' : '#9CA3AF' }}>{c.open}/{c.total}</span>
            </div>
            <div style={{ height: 5, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${(c.open / c.total) * 100}%`, height: '100%', background: c.color, borderRadius: 999, transition: 'width 0.3s' }}/>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Quick Actions ──────────────────────────────────────────────────────────
export function QuickActionsWidget() {
  const actions = [
    { label: 'New Loan',       icon: 'plus',        color: '#7E68FA', bg: '#EDE9FE' },
    { label: 'Upload Docs',    icon: 'upload',      color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Request Info',   icon: 'send',        color: '#059669', bg: '#DCFCE7' },
    { label: 'Run AUS',        icon: 'zap',         color: '#D97706', bg: '#FEF3C7' },
    { label: 'Generate LE',    icon: 'doc',         color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'Lock Rate',      icon: 'dollar',      color: '#0F766E', bg: '#CCFBF1' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {actions.map(a => (
        <button key={a.label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
          padding: '14px 10px', border: '1px solid ' + a.color + '30',
          borderRadius: 10, background: a.bg, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'transform 0.08s, box-shadow 0.08s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px ' + a.color + '25'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={a.icon} size={15} color="#fff"/>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Recent Activity ────────────────────────────────────────────────────────
export function RecentActivityWidget() {
  const activities = [
    { icon: 'check',        color: '#059669', bg: '#DCFCE7', text: 'Condition C-001 cleared', loan: 'Anderson',    time: '12m ago' },
    { icon: 'upload',       color: '#0EA5E9', bg: '#E0F2FE', text: 'Bank statements uploaded', loan: 'Rivera',      time: '1h ago'  },
    { icon: 'mail',         color: '#7E68FA', bg: '#EDE9FE', text: 'Email sent to borrower',   loan: 'Chen',        time: '2h ago'  },
    { icon: 'dollar',       color: '#D97706', bg: '#FEF3C7', text: 'Rate lock extended 7d',   loan: 'Anderson',    time: '3h ago'  },
    { icon: 'alertCircle',  color: '#EF4444', bg: '#FEE2E2', text: 'FEMA flag added',          loan: 'Rivera',      time: '5h ago'  },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {activities.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < activities.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={a.icon} size={12} color={a.color} strokeWidth={2}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{a.loan}</div>
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{a.time}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Widget registry ──────────────────────────────────────────────────────────
// ── Files at Risk ──────────────────────────────────────────────────────────
// Ported from old prototype: surfaces files with data inconsistencies,
// ceiling breaches, or value gaps. Mid-LOs' primary triage view.
export function FilesAtRiskWidget({ onOpenLoan }) {
  const rows = [
    { borrower: 'Sarah Anderson', loanId: 'LN-2024-0234', tone: 'risk',
      risk: 'VOE shows $98k, app says $112k — reconcile before UW.' },
    { borrower: 'David Chen', loanId: 'LN-2024-0189', tone: 'risk',
      risk: 'Appraisal came in 4% under contract — confirm value or restructure.' },
    { borrower: 'Priya Patel', loanId: 'LN-2024-0241', tone: 'deadline',
      risk: 'DTI at 44.8% — within 0.2 pts of ceiling. Any change pushes over.' },
  ];
  const toneColor = { risk: '#EF4444', deadline: '#D97706' };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.1 }}>5 files</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Need a decision · inconsistencies, ceiling breaches, value gaps</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#4338CA', padding: 0 }}>See all 5 →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={r.loanId} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: toneColor[r.tone], marginTop: 6, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.borrower}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Mono' }}>{r.loanId}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2, lineHeight: 1.4 }}>{r.risk}</div>
            </div>
            <button onClick={() => onOpenLoan && onOpenLoan(r.loanId)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: '#4338CA', flexShrink: 0, padding: '2px 0',
            }}>Review →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ready for UW ───────────────────────────────────────────────────────────
// Ported from old prototype: files where all PTD conditions are cleared
// and a one-click submit to underwriting is available.
export function ReadyForUWWidget({ onOpenLoan }) {
  const rows = [
    { borrower: 'Jennifer Wang', loanId: 'LN-2024-0211',
      note: 'All 6 PTD conditions cleared. Income, assets, appraisal verified.' },
    { borrower: 'Marco Garcia', loanId: 'LN-2024-0198',
      note: 'Conv 30yr · DTI 38% · LTV 78%. Clean file.' },
    { borrower: 'Linda Thompson', loanId: 'LN-2024-0223',
      note: 'FHA 30yr. Manual review on gift letter complete.' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.1 }}>3 files</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Cleared for UW · all PTD conditions met</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          background: '#EDE9FE', color: '#5B21B6',
          padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase',
        }}>AI VERIFIED</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={r.loanId} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
          }}>
            <div style={{ color: '#059669', flexShrink: 0, marginTop: 1 }}>
              <Icon name="checkCircle" size={16}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.borrower}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Mono' }}>{r.loanId}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2, lineHeight: 1.4 }}>{r.note}</div>
            </div>
            <button onClick={() => onOpenLoan && onOpenLoan(r.loanId)} style={{
              background: '#7E68FA', color: '#fff', border: 'none', borderRadius: 6,
              cursor: 'pointer', padding: '5px 10px',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>Submit →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lock Clock ─────────────────────────────────────────────────────────────
// Ported from old prototype: top 3 at-risk locks with day/hour countdown.
// Severity tint: <=72h red, <=120h amber, else neutral.
export function LockClockWidget({ onOpenLoan }) {
  const rows = [
    { borrower: 'Rodriguez', loanId: 'LN-2024-0218', rate: '6.875', days: 2, hours: 14 },
    { borrower: 'Chen',      loanId: 'LN-2024-0189', rate: '6.50',  days: 4, hours: 6  },
    { borrower: 'Garcia',    loanId: 'LN-2024-0198', rate: '7.125', days: 6, hours: 22 },
  ];
  const sevFor = (d, h) => {
    const total = d * 24 + h;
    if (total <= 72)  return { bg: '#FEF2F2', fg: '#EF4444' };
    if (total <= 120) return { bg: '#FFFBEB', fg: '#D97706' };
    return { bg: '#F9FAFB', fg: '#6B7280' };
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="clock" size={13} color="#D97706"/>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Top 3 expirations</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', background: '#FEF2F2', color: '#EF4444', padding: '2px 7px', borderRadius: 999 }}>1 CRITICAL</span>
      </div>
      {rows.map((r, i) => {
        const sev = sevFor(r.days, r.hours);
        return (
          <div key={r.loanId} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
          }}>
            <div style={{ background: sev.bg, color: sev.fg, borderRadius: 7, padding: '5px 9px', textAlign: 'center', minWidth: 58, flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1, fontFamily: 'DM Mono' }}>{r.days}d {r.hours}h</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', marginTop: 2 }}>LEFT</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.borrower}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Mono' }}>{r.loanId}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>Locked at {r.rate}%</div>
            </div>
            <button onClick={() => onOpenLoan && onOpenLoan(r.loanId)} style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6,
              cursor: 'pointer', padding: '4px 10px',
              fontSize: 12, fontWeight: 700, color: '#111827', flexShrink: 0,
            }}>Extend</button>
          </div>
        );
      })}
    </div>
  );
}

// ── Waiting on Borrower ────────────────────────────────────────────────────
// Ported from old prototype: outstanding doc requests by borrower. Days since
// asked surfaced prominently. Overdue (>=3d) highlighted red.
export function WaitingOnBorrowerWidget({ onOpenLoan }) {
  const rows = [
    { borrower: 'Anderson', loanId: 'LN-2024-0234', requested: '2023 W-2 and final pay stub', daysOpen: 4 },
    { borrower: 'Martinez', loanId: 'LN-2024-0207', requested: 'Two months of bank statements', daysOpen: 3 },
    { borrower: 'Chen',     loanId: 'LN-2024-0189', requested: 'Homeowners insurance binder', daysOpen: 2 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="mail" size={13} color="#4338CA"/>
          <span style={{ fontSize: 12, color: '#6B7280' }}>Doc requests outstanding</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, background: '#F3F4F6', color: '#374151', padding: '2px 7px', borderRadius: 999 }}>5</span>
      </div>
      {rows.map((r, i) => {
        const overdue = r.daysOpen >= 3;
        return (
          <div key={r.loanId} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: overdue ? '#FEF2F2' : '#F9FAFB',
              color: overdue ? '#EF4444' : '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <Icon name="mail" size={13}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.borrower}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'DM Mono' }}>{r.loanId}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{r.requested}</div>
              <div style={{ fontSize: 11, marginTop: 3, color: overdue ? '#EF4444' : '#9CA3AF', fontWeight: overdue ? 700 : 500 }}>
                {r.daysOpen}d since request
              </div>
            </div>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: '#4338CA', flexShrink: 0, padding: '2px 0',
            }}>Remind →</button>
          </div>
        );
      })}
    </div>
  );
}

// ── AI Coach Brief ─────────────────────────────────────────────────────────
// Ported from old prototype: single-row brief with 3 inline file-named insights.
// Designed to live full-width at the top of the home, complementing the
// floating AI panel rather than replacing it.
// ── Next Move ──────────────────────────────────────────────────────────────
// Single "your next move is this" card. Rotates through a prioritized action
// queue as items are completed or deferred. Each action carries everything
// the LO needs to act in one click: file, problem, recommended action,
// confidence, and a primary CTA that routes to the right place.

const NEXT_MOVE_QUEUE = [
  { id: 'm1', tone: 'risk',
    loanId: 'LN-2024-0218', borrower: 'Rodriguez',
    problem: 'Lock expires in 2d 14h, UW is light.',
    recommendation: 'Most likely path: file a 7-day extension at 0.125, or expedite the CD today.',
    confidence: 94, action: 'File 7-day extension', tab: 'pricing' },
  { id: 'm2', tone: 'risk',
    loanId: 'LN-2024-0234', borrower: 'Anderson',
    problem: 'VOE shows $98k. Application says $112k. $14k delta will block UW.',
    recommendation: 'Pull the latest pay stub and reconcile, or request a corrected VOE.',
    confidence: 91, action: 'Open income tool', tab: 'conditions' },
  { id: 'm3', tone: 'deadline',
    loanId: 'LN-2024-0241', borrower: 'Patel',
    problem: 'DTI at 44.8%, within 0.2 pts of ceiling. Any change in income pushes it over.',
    recommendation: 'Lock the file before debt updates land — submit to UW today.',
    confidence: 87, action: 'Submit to UW', tab: 'now' },
  { id: 'm4', tone: 'deadline',
    loanId: 'LN-2024-0189', borrower: 'Chen',
    problem: 'Appraisal came in 4% under contract.',
    recommendation: 'Draft a value rebuttal — comparable sales support a higher number.',
    confidence: 78, action: 'Open appraisal review', tab: 'now' },
];

export function AICoachBriefWidget({ onOpenLoan }) {
  const [idx, setIdx] = React.useState(() => {
    const saved = parseInt(localStorage.getItem('los-next-move-idx') || '0', 10);
    return isNaN(saved) ? 0 : saved % NEXT_MOVE_QUEUE.length;
  });
  const [dismissed, setDismissed] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('los-next-move-dismissed') || '[]')); }
    catch { return new Set(); }
  });

  const queue = NEXT_MOVE_QUEUE.filter(m => !dismissed.has(m.id));
  const current = queue.length === 0 ? null : queue[idx % queue.length];

  const advance = () => {
    const next = (idx + 1) % Math.max(queue.length, 1);
    setIdx(next);
    localStorage.setItem('los-next-move-idx', String(next));
  };

  const doItNow = () => {
    if (!current) return;
    if (onOpenLoan) onOpenLoan(current.loanId, current.tab);
    // Treat acting on it as resolving it for the demo
    const nextSet = new Set([...dismissed, current.id]);
    setDismissed(nextSet);
    localStorage.setItem('los-next-move-dismissed', JSON.stringify([...nextSet]));
  };

  const later = () => advance();

  const reset = () => {
    setDismissed(new Set());
    setIdx(0);
    localStorage.removeItem('los-next-move-dismissed');
    localStorage.removeItem('los-next-move-idx');
  };

  if (!current) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px', textAlign: 'center', gap: 8,
      }}>
        <div style={{ fontSize: 28 }}>✓</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>You're caught up.</div>
        <div style={{ fontSize: 12.5, color: '#6B7280' }}>No urgent files. Nice work.</div>
        <button onClick={reset} style={{
          marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 11.5, color: '#9CA3AF', textDecoration: 'underline',
        }}>Reset demo queue</button>
      </div>
    );
  }

  const toneColor = current.tone === 'risk' ? '#EF4444' : '#D97706';
  const toneBg    = current.tone === 'risk' ? '#FEF2F2' : '#FFFBEB';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#EDE9FE', color: '#5B21B6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="sparkle" size={17}/>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#5B21B6' }}>Your next move</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{queue.length} in your queue · {current.confidence}% confidence</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {queue.map((_, i) => (
            <span key={i} style={{
              width: i === (idx % queue.length) ? 18 : 6, height: 6, borderRadius: 999,
              background: i === (idx % queue.length) ? '#5B21B6' : '#E5E7EB',
              transition: 'width 0.2s',
            }}/>
          ))}
        </div>
      </div>

      <div style={{
        background: toneBg, border: `1px solid ${toneColor}30`, borderRadius: 10,
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.015em' }}>{current.borrower}</span>
          <span style={{ fontSize: 12, fontFamily: 'DM Mono', color: '#6B7280' }}>{current.loanId}</span>
        </div>
        <div style={{ fontSize: 13.5, color: '#111827', marginBottom: 6, lineHeight: 1.4 }}>
          <strong>The problem.</strong> {current.problem}
        </div>
        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.45 }}>
          <strong style={{ color: '#5B21B6' }}>What I'd do.</strong> {current.recommendation}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <button onClick={doItNow} style={{
          background: '#5B21B6', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {current.action} <Icon name="arrowRight" size={12} strokeWidth={2.4}/>
        </button>
        <button onClick={later} style={{
          background: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB',
          borderRadius: 8, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>Later</button>
        <div style={{ flex: 1 }}/>
        <button onClick={() => onOpenLoan && onOpenLoan(current.loanId, current.tab)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: '#6B7280',
          padding: 0,
        }}>Open file →</button>
      </div>
    </div>
  );
}

export const WIDGET_REGISTRY = [
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    desc: 'Branch rankings by volume, units, and speed.',
    icon: 'trendingUp',
    color: '#7E68FA',
    defaultWidth: 'full',
    category: 'Performance',
  },
  {
    id: 'pipeline-snapshot',
    label: 'Pipeline Snapshot',
    desc: 'Key stats across your active pipeline at a glance.',
    icon: 'pipeline',
    color: '#0EA5E9',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'ai-actions',
    label: 'AI Actions',
    desc: 'AI-surfaced tasks ready for your review.',
    icon: 'sparkle',
    color: '#7C3AED',
    defaultWidth: 'half',
    category: 'AI',
  },
  {
    id: 'company-feed',
    label: 'Company Feed',
    desc: 'Announcements, rate updates, and team news.',
    icon: 'bell',
    color: '#D97706',
    defaultWidth: 'full',
    category: 'Team',
  },
  {
    id: 'closing-countdown',
    label: 'Closing Countdown',
    desc: 'Upcoming closings ranked by days remaining.',
    icon: 'clock',
    color: '#D97706',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'rate-watch',
    label: 'Rate Watch',
    desc: 'Live market rates with daily movement.',
    icon: 'dollar',
    color: '#059669',
    defaultWidth: 'half',
    category: 'Market',
  },
  {
    id: 'conditions-tracker',
    label: 'Conditions Tracker',
    desc: 'Open conditions across all active loans by category.',
    icon: 'listCheck',
    color: '#EF4444',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'quick-actions',
    label: 'Quick Actions',
    desc: 'One-click shortcuts for common LOS tasks.',
    icon: 'zap',
    color: '#F59E0B',
    defaultWidth: 'half',
    category: 'Tools',
  },
  {
    id: 'recent-activity',
    label: 'Recent Activity',
    desc: 'Your latest actions and events across the pipeline.',
    icon: 'clock',
    color: '#374151',
    defaultWidth: 'half',
    category: 'Tools',
  },
  // ── Ported from old prototype ──────────────────────────────────────────
  {
    id: 'ai-coach-brief',
    label: 'Your Next Move',
    desc: "AI picks the one file most worth your time right now — with a one-click action.",
    icon: 'sparkle',
    color: '#5B21B6',
    defaultWidth: 'full',
    category: 'AI',
  },
  {
    id: 'files-at-risk',
    label: 'Files at Risk',
    desc: 'Inconsistencies, ceiling breaches, and value gaps that need a decision.',
    icon: 'alertCircle',
    color: '#EF4444',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'ready-for-uw',
    label: 'Ready for UW',
    desc: 'Files with all prior-to-doc conditions cleared. One-click submit.',
    icon: 'checkCircle',
    color: '#059669',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'lock-clock',
    label: 'Lock Clock',
    desc: 'Top expiring rate locks with day/hour countdowns.',
    icon: 'clock',
    color: '#D97706',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
  {
    id: 'waiting-on-borrower',
    label: 'Waiting on Borrower',
    desc: 'Outstanding doc requests with days-since-asked. Overdue highlighted.',
    icon: 'mail',
    color: '#4338CA',
    defaultWidth: 'half',
    category: 'Pipeline',
  },
];

// ─── Widget shell (title bar + content wrapper) ───────────────────────────────
function WidgetShell({ meta, width, onRemove, onToggleWidth, editMode, dragHandleProps, isDragging, children }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid ' + (isDragging ? meta.color : '#E5E7EB'),
        borderRadius: 14,
        overflow: 'hidden',
        opacity: isDragging ? 0.55 : 1,
        boxShadow: isDragging ? '0 8px 32px rgba(0,0,0,0.14)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'border-color 0.15s, opacity 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 14px 11px',
        borderBottom: '1px solid #F3F4F6',
        background: editMode ? '#FAFAFA' : 'transparent',
        cursor: editMode ? 'grab' : 'default',
      }} {...(editMode ? dragHandleProps : {})}>
        {editMode && (
          <Icon name="grip" size={14} color="#9CA3AF" style={{ flexShrink: 0 }}/>
        )}
        <div style={{ width: 22, height: 22, borderRadius: 6, background: meta.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={meta.icon} size={12} color={meta.color}/>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', flex: 1 }}>{meta.label}</span>

        {editMode && (
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {/* Width toggle */}
            <button onClick={onToggleWidth} title={width === 'full' ? 'Shrink to half' : 'Expand to full'} style={{
              display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px',
              border: '1px solid #E5E7EB', borderRadius: 5, background: '#fff',
              fontSize: 10.5, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {width === 'full' ? '½' : '⬛ Full'}
            </button>
            {/* Remove */}
            <button onClick={onRemove} style={{
              width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #FECACA', borderRadius: 5, background: '#FFF5F5', cursor: 'pointer',
            }}>
              <Icon name="x" size={11} color="#EF4444"/>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 14px 16px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Catalog drawer ───────────────────────────────────────────────────────────
import ReactDOM from 'react-dom';

const CATEGORIES = ['All', 'Pipeline', 'Performance', 'AI', 'Market', 'Team', 'Tools'];

function CatalogDrawer({ activeIds, onAdd, onClose }) {
  const [cat, setCat] = React.useState('All');
  const available = WIDGET_REGISTRY.filter(w =>
    (cat === 'All' || w.category === cat)
  );

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.2)' }}/>
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 801,
        width: 360, background: '#fff', borderLeft: '1px solid #E5E7EB',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Widget Library</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>{WIDGET_REGISTRY.length} widgets available</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, lineHeight: 0 }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 14px', flexWrap: 'wrap', borderBottom: '1px solid #F3F4F6' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '3px 10px', borderRadius: 5, border: '1px solid',
              borderColor: cat === c ? '#7E68FA' : '#E5E7EB',
              background: cat === c ? '#7E68FA' : 'transparent',
              color: cat === c ? '#fff' : '#6B7280',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>

        {/* Widget cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {available.map(w => {
            const active = activeIds.includes(w.id);
            return (
              <div key={w.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', border: '1px solid ' + (active ? w.color + '40' : '#F3F4F6'),
                borderRadius: 10, background: active ? w.color + '06' : '#FAFAFA',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: w.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={w.icon} size={17} color={w.color}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{w.label}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{w.desc}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: w.color, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{w.category}</div>
                </div>
                <button onClick={() => !active && onAdd(w.id)} style={{
                  flexShrink: 0, width: 30, height: 30,
                  border: '1.5px solid ' + (active ? '#D1FAE5' : w.color),
                  borderRadius: 8, cursor: active ? 'default' : 'pointer',
                  background: active ? '#ECFDF5' : w.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active
                    ? <Icon name="check" size={13} color="#059669" strokeWidth={2.5}/>
                    : <Icon name="plus" size={14} color="#fff" strokeWidth={2.5}/>
                  }
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          Drag widgets to reorder after closing this panel
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── Main WidgetGrid ──────────────────────────────────────────────────────────
export function WidgetGrid({ renderWidget }) {
  const [layout,   setLayout]   = React.useState(loadLayout);
  const [editMode, setEditMode] = React.useState(false);
  const [catalog,  setCatalog]  = React.useState(false);

  // Drag-and-drop state
  const dragIdx = React.useRef(null);
  const [dropIdx, setDropIdx] = React.useState(null);

  const activeIds = layout.map(w => w.id);

  const handleAdd = (id) => {
    const meta = WIDGET_REGISTRY.find(w => w.id === id);
    if (!meta || activeIds.includes(id)) return;
    const next = [...layout, { id, width: meta.defaultWidth }];
    setLayout(next);
    saveLayout(next);
  };

  const handleRemove = (id) => {
    const next = layout.filter(w => w.id !== id);
    setLayout(next);
    saveLayout(next);
  };

  const handleToggleWidth = (id) => {
    const next = layout.map(w => w.id === id ? { ...w, width: w.width === 'full' ? 'half' : 'full' } : w);
    setLayout(next);
    saveLayout(next);
  };

  const handleDragStart = (idx) => { dragIdx.current = idx; };
  const handleDragOver  = (idx) => { if (dragIdx.current !== idx) setDropIdx(idx); };
  const handleDrop      = (idx) => {
    const from = dragIdx.current;
    if (from === null || from === idx) { setDropIdx(null); return; }
    const next = [...layout];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setLayout(next);
    saveLayout(next);
    dragIdx.current = null;
    setDropIdx(null);
  };
  const handleDragEnd = () => { dragIdx.current = null; setDropIdx(null); };

  const toggleEdit = () => {
    if (editMode) saveLayout(layout);
    setEditMode(e => !e);
  };

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9CA3AF', flex: 1 }}>
          {editMode ? '✦ Drag to reorder · click × to remove' : 'Your dashboard'}
        </span>
        {editMode && (
          <button onClick={() => { setCatalog(true); }} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
            border: '1.5px solid #7E68FA', borderRadius: 7, background: '#7E68FA12',
            color: '#7E68FA', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          }}>
            <Icon name="plus" size={13} color="#7E68FA" strokeWidth={2.5}/> Add widget
          </button>
        )}
        <button onClick={toggleEdit} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
          border: '1px solid #E5E7EB', borderRadius: 7,
          background: editMode ? '#111827' : '#fff',
          color: editMode ? '#fff' : '#374151',
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          {editMode
            ? <><Icon name="check" size={12} color="#fff" strokeWidth={2.5}/> Done</>
            : <><Icon name="settings" size={12} color="#6B7280"/> Customize</>
          }
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'start',
      }}>
        {layout.map((item, idx) => {
          const meta = WIDGET_REGISTRY.find(w => w.id === item.id);
          if (!meta) return null;
          const isDropTarget = dropIdx === idx;

          return (
            <div
              key={item.id}
              draggable={editMode}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => { e.preventDefault(); handleDragOver(idx); }}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              style={{
                gridColumn: item.width === 'full' ? '1 / -1' : 'auto',
                outline: isDropTarget ? '2px dashed ' + meta.color : 'none',
                outlineOffset: 3,
                borderRadius: 14,
                transition: 'outline 0.1s',
              }}
            >
              <WidgetShell
                meta={meta}
                width={item.width}
                editMode={editMode}
                isDragging={false}
                onRemove={() => handleRemove(item.id)}
                onToggleWidth={() => handleToggleWidth(item.id)}
                dragHandleProps={{}}
              >
                {renderWidget(item.id)}
              </WidgetShell>
            </div>
          );
        })}

        {/* Empty state */}
        {layout.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', border: '2px dashed #E5E7EB', borderRadius: 14, color: '#9CA3AF' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⬡</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>No widgets yet</div>
            <div style={{ fontSize: 13, marginBottom: 16 }}>Add widgets from the library to build your dashboard.</div>
            <button onClick={() => { setEditMode(true); setCatalog(true); }} style={{
              padding: '8px 18px', border: '1.5px solid #7E68FA', borderRadius: 8,
              background: '#7E68FA', color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              Browse widget library
            </button>
          </div>
        )}
      </div>

      {catalog && (
        <CatalogDrawer
          activeIds={activeIds}
          onAdd={(id) => { handleAdd(id); }}
          onClose={() => setCatalog(false)}
        />
      )}
    </>
  );
}
