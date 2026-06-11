import React from 'react';
import { Icon } from '../components/Icon';

const FEED_ITEMS = [
  {
    id: 'f1',
    category: 'Conditions',
    categoryColor: '#5B8DF6',
    headline: 'VOE clears Condition C-002 for Anderson',
    body: 'Uploaded verification of employment from Apex Technologies matches income on 1003. Employment dates and salary align. Ready to mark cleared.',
    loan: { id: 'LN-2024-0234', borrower: 'Sarah Anderson', initials: 'SA', color: '#A8541C', status: 'Underwriting' },
    confidence: 97,
    timeAgo: '2 min ago',
    action: 'Clear Condition',
    actionTab: 'conditions',
    secondaryAction: 'View Doc',
    urgency: null,
  },
  {
    id: 'f2',
    category: 'Rate Lock',
    categoryColor: '#E0A23A',
    headline: 'Lock expires in 4 days — Chen needs a decision',
    body: 'Current lock on FHA 30yr at 6.990% expires May 22. Extension costs $340. Closing target is July 8 — extension is likely needed. Act before Friday.',
    loan: { id: 'LN-2024-0189', borrower: 'David Chen', initials: 'DC', color: '#2A8C53', status: 'Processing' },
    confidence: 99,
    timeAgo: '8 min ago',
    action: 'Extend Lock',
    actionTab: 'pricing',
    secondaryAction: 'Review Pricing',
    urgency: 'high',
  },
  {
    id: 'f3',
    category: 'Income',
    categoryColor: '#3DB371',
    headline: 'Income calc ready — Rodriguez 1-yr W-2 scenario',
    body: 'AI calculated qualifying income at $8,420/mo using 12-month W-2 average. DTI drops to 31.2% from 34%. Recommend applying — improves AUS finding.',
    loan: { id: 'LN-2024-0301', borrower: 'Emily Rodriguez', initials: 'ER', color: '#C25535', status: 'Underwriting' },
    confidence: 91,
    timeAgo: '15 min ago',
    action: 'Apply Calc',
    actionTab: 'now',
    secondaryAction: 'Review Numbers',
    urgency: null,
  },
  {
    id: 'f4',
    category: 'Docs',
    categoryColor: '#7E68FA',
    headline: 'Request 2 months bank statements — Johnson',
    body: 'AUS returned Approve/Eligible but requires 60 days asset documentation. Johnson has not yet uploaded. Sending a request now prevents a condition later.',
    loan: { id: 'LN-2024-0267', borrower: 'Marcus Johnson', initials: 'MJ', color: '#7B3FA0', status: 'Application' },
    confidence: 85,
    timeAgo: '32 min ago',
    action: 'Send Request',
    actionTab: 'now',
    secondaryAction: 'View AUS',
    urgency: null,
  },
  {
    id: 'f5',
    category: 'Closing',
    categoryColor: '#D74C3C',
    headline: 'CD must be sent today — Wang closing in 4 days',
    body: 'TRID requires 3 business days between CD delivery and closing. Closing is May 22. CD has not been acknowledged. Send today or the closing date moves.',
    loan: { id: 'LN-2024-0211', borrower: 'Jennifer Wang', initials: 'JW', color: '#3A6BAD', status: 'Closing' },
    confidence: 99,
    timeAgo: '1 hr ago',
    action: 'Send CD',
    actionTab: 'closing',
    secondaryAction: 'Review CD',
    urgency: 'critical',
  },
  {
    id: 'f6',
    category: 'Conditions',
    categoryColor: '#5B8DF6',
    headline: '6 open conditions blocking UW — Chen needs action',
    body: 'LN-2024-0189 has been in Processing for 5 days with 6 uncleared conditions. 3 are non-blocking and can be cleared by LO now. Clearing them unblocks UW submission.',
    loan: { id: 'LN-2024-0189', borrower: 'David Chen', initials: 'DC', color: '#2A8C53', status: 'Processing' },
    confidence: 88,
    timeAgo: '2 hr ago',
    action: 'Review Conditions',
    actionTab: 'conditions',
    secondaryAction: 'View Loan',
    urgency: 'high',
  },
  {
    id: 'f7',
    category: 'AUS',
    categoryColor: '#3A8294',
    headline: 'AUS returned Approve/Eligible — Johnson clear to submit',
    body: 'DU run came back Approve/Eligible. DTI 29%, LTV 95%, credit score 722. 34 conditions generated — standard for FHA. Ready to submit to processing.',
    loan: { id: 'LN-2024-0267', borrower: 'Marcus Johnson', initials: 'MJ', color: '#7B3FA0', status: 'Application' },
    confidence: 95,
    timeAgo: '2 hr ago',
    action: 'Submit to Processing',
    actionTab: 'aus',
    secondaryAction: 'View Findings',
    urgency: null,
  },
  {
    id: 'f8',
    category: 'Pricing',
    categoryColor: '#E0A23A',
    headline: 'Rates dropped 12.5bps — Kim could save $87/mo',
    body: 'Current market on Conv 30yr is 6.500% vs Kim\'s locked 6.625%. Renegotiation window is open. Savings: $87/mo, $31K over loan life. Closing is June 15.',
    loan: { id: 'LN-2024-0289', borrower: 'Rachel Kim', initials: 'RK', color: '#7B3FA0', status: 'Approval' },
    confidence: 82,
    timeAgo: '3 hr ago',
    action: 'View Options',
    actionTab: 'pricing',
    secondaryAction: 'Dismiss',
    urgency: null,
  },
];

const URGENCY_CONFIG = {
  critical: { bg: '#FEF2F2', border: '#FECACA', badge: '#D74C3C', badgeText: 'URGENT' },
  high:     { bg: '#FFFBEB', border: '#FDE68A', badge: '#E0A23A', badgeText: 'ACTION NEEDED' },
};

function StatusDot({ status }) {
  const colors = { Underwriting: '#3A6BAD', Approval: '#2A8C53', Closing: '#2A8C53', Processing: '#9C6A1A', Application: '#888' };
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: colors[status] || '#888', display: 'inline-block', flexShrink: 0 }}/>;
}

function ConfidenceBar({ value }) {
  const color = value >= 90 ? '#3DB371' : value >= 75 ? '#E0A23A' : '#D74C3C';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 40, height: 3, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 999 }}/>
      </div>
      <span style={{ fontFamily: 'DM Sans', fontSize: 11, color, fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

function FeedCard({ item, onAct, onDismiss }) {
  const [acting, setActing] = React.useState(false);
  const urgency = URGENCY_CONFIG[item.urgency];

  const handleAct = () => {
    setActing(true);
    setTimeout(() => onAct(item), 400);
  };

  return (
    <div style={{
      background: urgency ? urgency.bg : 'var(--bg-surface)',
      border: `1px solid ${urgency ? urgency.border : 'var(--border-subtle)'}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 14,
      transition: 'opacity 0.3s, transform 0.3s',
      opacity: acting ? 0 : 1,
      transform: acting ? 'translateX(24px)' : 'none',
    }}>
      {/* Top row: category + urgency badge + time + dismiss */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: item.categoryColor, background: item.categoryColor + '18',
          padding: '3px 8px', borderRadius: 5,
        }}>{item.category}</span>
        {urgency && (
          <span style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
            color: '#fff', background: urgency.badge,
            padding: '3px 8px', borderRadius: 5,
          }}>{urgency.badgeText}</span>
        )}
        <span style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.timeAgo}</span>
        <button onClick={() => onDismiss(item.id)} style={{
          width: 26, height: 26, borderRadius: 6, border: 'none',
          background: 'transparent', cursor: 'pointer',
          color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        ><Icon name="x" size={14}/></button>
      </div>

      {/* Headline */}
      <div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          {item.headline}
        </h3>
        <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {item.body}
        </p>
      </div>

      {/* Loan chip + confidence */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--bg-muted)', borderRadius: 8, padding: '5px 10px',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: item.loan.color, color: '#fff',
            fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{item.loan.initials}</div>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{item.loan.borrower}</span>
          <StatusDot status={item.loan.status}/>
          <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-tertiary)' }}>{item.loan.id}</span>
        </div>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>AI confidence</span>
        <ConfidenceBar value={item.confidence}/>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
        <button onClick={handleAct} className="btn btn-ai" style={{ flex: 1, justifyContent: 'center', height: 40, fontSize: 14, fontWeight: 600 }}>
          <Icon name="sparkle" size={14} strokeWidth={1.8}/>
          {item.action}
        </button>
        <button onClick={() => onDismiss(item.id)} style={{
          height: 40, padding: '0 16px', border: '1px solid var(--border-subtle)',
          borderRadius: 10, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >Done</button>
      </div>
    </div>
  );
}

export function AIFeedView({ onOpenLoan }) {
  const [dismissed, setDismissed] = React.useState(new Set());
  const [filter, setFilter] = React.useState('all');

  const dismiss = (id) => setDismissed(prev => new Set([...prev, id]));

  const act = (item) => {
    dismiss(item.id);
    onOpenLoan(item.loan.id, item.actionTab);
  };

  const categories = ['all', ...Array.from(new Set(FEED_ITEMS.map(i => i.category)))];

  const visible = FEED_ITEMS.filter(i =>
    !dismissed.has(i.id) &&
    (filter === 'all' || i.category === filter)
  );

  const urgentCount = visible.filter(i => i.urgency).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-canvas)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>AI Feed</h1>
              {urgentCount > 0 && (
                <span style={{
                  background: '#D74C3C', color: '#fff',
                  fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                }}>{urgentCount} urgent</span>
              )}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-tertiary)' }}>
              {visible.length} action{visible.length !== 1 ? 's' : ''} waiting · sorted by priority
            </p>
          </div>
          <button onClick={() => setDismissed(new Set(FEED_ITEMS.map(i => i.id)))} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, color: 'var(--text-tertiary)', padding: '6px 0',
          }}>Clear all</button>
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {categories.map(c => {
            const active = filter === c;
            const count = c === 'all' ? FEED_ITEMS.filter(i => !dismissed.has(i.id)).length
              : FEED_ITEMS.filter(i => !dismissed.has(i.id) && i.category === c).length;
            return (
              <button key={c} onClick={() => setFilter(c)} style={{
                height: 30, padding: '0 12px', borderRadius: 999,
                border: active ? 'none' : '1px solid var(--border-subtle)',
                background: active ? 'var(--text-primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: 12.5, fontWeight: active ? 600 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.12s',
              }}>
                {c === 'all' ? 'All' : c}
                {count > 0 && (
                  <span style={{ fontSize: 11, opacity: active ? 0.8 : 0.6 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feed */}
        {visible.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            padding: '80px 20px', color: 'var(--text-tertiary)', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'var(--ai-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="sparkle" size={24} color="var(--ai-primary)" strokeWidth={1.5}/>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>All caught up</div>
              <div style={{ fontSize: 13 }}>No pending AI actions — check back later.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {visible.map(item => (
              <FeedCard key={item.id} item={item} onAct={act} onDismiss={dismiss}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
