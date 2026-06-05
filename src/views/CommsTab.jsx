import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../components/Icon';
import { LOANS } from '../data/loans';

// ─── Contacts per loan ────────────────────────────────────────────────────────
const LOAN_CONTACTS = {
  'LN-2024-0234': {
    borrowers: [
      { id: 'b1', name: 'Sarah Anderson', role: 'Primary Borrower', initials: 'SA', color: '#7E68FA', phone: '(303) 555-0182', email: 'sarah.anderson@gmail.com' },
      { id: 'b2', name: 'John Anderson',  role: 'Co-Borrower',      initials: 'JA', color: '#6B7280', phone: '(303) 555-0183', email: 'john.anderson@gmail.com' },
    ],
    external: [
      { id: 'e1', name: 'Maria Gonzalez', role: "Buyer's Agent",   initials: 'MG', color: '#059669', phone: '(720) 555-0194', email: 'mgonzalez@remax.com',       company: 'RE/MAX Alliance' },
      { id: 'e2', name: 'Tom Fischer',    role: "Seller's Agent",  initials: 'TF', color: '#D97706', phone: '(720) 555-0241', email: 'tfischer@cbprime.com',      company: 'Coldwell Banker' },
      { id: 'e3', name: 'Apex Title',     role: 'Title & Escrow',  initials: 'AT', color: '#2563EB', phone: '(303) 555-0310', email: 'closings@apextitle.com',    company: 'Apex Title Co.' },
      { id: 'e4', name: 'Derek Yun',      role: 'Appraiser',       initials: 'DY', color: '#7C3AED', phone: '(720) 555-0419', email: 'derek@frontrangeappraisal.com', company: 'Front Range Appraisal' },
    ],
    team: [
      { id: 't1', name: 'Alex Torres', role: 'Loan Officer',  initials: 'AT', color: '#0EA5E9', phone: '(303) 555-0501', email: 'atorres@xpanse.com' },
      { id: 't2', name: 'Priya Nair',  role: 'Processor',     initials: 'PN', color: '#F59E0B', phone: '(303) 555-0502', email: 'pnair@xpanse.com' },
      { id: 't3', name: 'David Kim',   role: 'Underwriter',   initials: 'DK', color: '#10B981', phone: '(303) 555-0503', email: 'dkim@xpanse.com' },
    ],
  },
  'LN-2024-0391': {
    borrowers: [
      { id: 'b1', name: 'Carlos Rivera', role: 'Primary Borrower', initials: 'CR', color: '#B91C1C', phone: '(305) 555-0161', email: 'carlos.rivera@gmail.com' },
      { id: 'b2', name: 'Elena Rivera',  role: 'Co-Borrower',      initials: 'ER', color: '#6B7280', phone: '(305) 555-0162', email: 'elena.rivera@gmail.com' },
    ],
    external: [
      { id: 'e1', name: 'Rosa Diaz',   role: "Buyer's Agent",  initials: 'RD', color: '#059669', phone: '(786) 555-0281', email: 'rdiaz@floridarealty.com',  company: 'Florida Realty' },
      { id: 'e2', name: 'Miami Title', role: 'Title & Escrow', initials: 'MT', color: '#2563EB', phone: '(305) 555-0399', email: 'close@miamititle.com',      company: 'Miami Title Group' },
      { id: 'e3', name: 'Sam Okafor',  role: 'Appraiser',      initials: 'SO', color: '#7C3AED', phone: '(305) 555-0447', email: 'sokafor@valuepro.com',     company: 'ValuePro Appraisals' },
    ],
    team: [
      { id: 't1', name: 'Alex Torres', role: 'Loan Officer', initials: 'AT', color: '#0EA5E9', phone: '(303) 555-0501', email: 'atorres@xpanse.com' },
      { id: 't2', name: 'Priya Nair',  role: 'Processor',    initials: 'PN', color: '#F59E0B', phone: '(303) 555-0502', email: 'pnair@xpanse.com' },
      { id: 't3', name: 'David Kim',   role: 'Underwriter',  initials: 'DK', color: '#10B981', phone: '(303) 555-0503', email: 'dkim@xpanse.com' },
    ],
  },
  'LN-2024-0245': {
    borrowers: [
      { id: 'b1', name: 'Michael Chen', role: 'Primary Borrower', initials: 'MC', color: '#7E68FA', phone: '(206) 555-0141', email: 'mchen@gmail.com' },
    ],
    external: [
      { id: 'e1', name: 'Janet Wu',   role: "Buyer's Agent",  initials: 'JW', color: '#059669', phone: '(206) 555-0222', email: 'jwu@windermere.com',  company: 'Windermere' },
      { id: 'e2', name: 'Sound Title',role: 'Title & Escrow', initials: 'ST', color: '#2563EB', phone: '(206) 555-0333', email: 'close@soundtitle.com', company: 'Sound Title' },
    ],
    team: [
      { id: 't1', name: 'Alex Torres', role: 'Loan Officer', initials: 'AT', color: '#0EA5E9', phone: '(303) 555-0501', email: 'atorres@xpanse.com' },
      { id: 't2', name: 'Priya Nair',  role: 'Processor',    initials: 'PN', color: '#F59E0B', phone: '(303) 555-0502', email: 'pnair@xpanse.com' },
    ],
  },
};

const DEFAULT_CONTACTS = {
  borrowers: [{ id: 'b1', name: 'Borrower', role: 'Primary Borrower', initials: 'BR', color: '#7E68FA', phone: '—', email: '—' }],
  external: [],
  team: [{ id: 't1', name: 'Alex Torres', role: 'Loan Officer', initials: 'AT', color: '#0EA5E9', phone: '(303) 555-0501', email: 'atorres@xpanse.com' }],
};

// ─── Thread data ──────────────────────────────────────────────────────────────
const THREAD_DATA = {
  'LN-2024-0234': [
    { id: 1,  ts: '9:14 AM',  date: 'Today', channel: 'email', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Sarah Anderson', subject: 'Welcome to Xpanse — Next Steps',
      body: "Hi Sarah & John, welcome to the Xpanse mortgage process! I've attached a checklist of items we'll need to get started. Our target closing date is June 14th — let's make it happen.",
      attachments: ['Checklist.pdf'], read: true },
    { id: 2,  ts: '10:02 AM', date: 'Today', channel: 'sms', dir: 'in',
      from: 'Sarah Anderson', fromRole: 'Borrower', initials: 'SA', color: '#7E68FA',
      body: "Thank you Alex! Got the checklist. We'll get you the W-2s and bank statements today.", read: true },
    { id: 3,  ts: '10:45 AM', date: 'Today', channel: 'internal', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Priya Nair',
      body: 'Priya — borrowers are responsive, should have docs by EOD. Please order appraisal once we get bank statements confirmed.', read: true },
    { id: 4,  ts: '11:30 AM', date: 'Today', channel: 'sms', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Sarah Anderson',
      body: "Quick reminder — we need 2 months of bank statements for all accounts. You can upload them directly in the Xpanse portal anytime. 🏡", read: true },
    { id: 5,  ts: '1:18 PM',  date: 'Today', channel: 'email', dir: 'in',
      from: 'Maria Gonzalez', fromRole: "Buyer's Agent", initials: 'MG', color: '#059669',
      to: 'Alex Torres', subject: 'Purchase Agreement Update',
      body: "Alex, just confirming — sellers have signed the amendment. Closing date is firm at June 14th. Let me know if you need anything from our side to keep this on track.", read: true },
    { id: 6,  ts: '2:05 PM',  date: 'Today', channel: 'internal', dir: 'in',
      from: 'Priya Nair', fromRole: 'Processor', initials: 'PN', color: '#F59E0B',
      to: 'Alex Torres',
      body: 'Appraisal ordered with Derek Yun — ETA 5 business days. Condition #4 (HOI) still outstanding, borrower needs a nudge.', read: true },
    { id: 7,  ts: '3:47 PM',  date: 'Today', channel: 'sms', dir: 'in',
      from: 'Sarah Anderson', fromRole: 'Borrower', initials: 'SA', color: '#7E68FA',
      body: 'Just uploaded everything to the portal! Let me know if you need anything else 😊', read: false },
    { id: 8,  ts: '4:12 PM',  date: 'Today', channel: 'email', dir: 'in',
      from: 'Derek Yun', fromRole: 'Appraiser', initials: 'DY', color: '#7C3AED',
      to: 'Alex Torres', subject: 'Appraisal Scheduled — 1842 Oak Street',
      body: 'Inspection scheduled for Wednesday May 28 at 10:00 AM. Please ensure the property is accessible. Report delivered within 48 hours.', read: false },
  ],
  'LN-2024-0391': [
    { id: 1, ts: '8:30 AM', date: 'Today', channel: 'sms', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Carlos Rivera',
      body: "Carlos — urgent update. Your property is in the FEMA DR-4830-FL disaster zone (Hurricane Milton). We need to schedule a re-inspection ASAP. Can we connect today?", read: true },
    { id: 2, ts: '8:52 AM', date: 'Today', channel: 'sms', dir: 'in',
      from: 'Carlos Rivera', fromRole: 'Borrower', initials: 'CR', color: '#B91C1C',
      body: "Oh wow. Yes, please call me at 305-555-0161. Is this going to delay closing?", read: true },
    { id: 3, ts: '9:20 AM', date: 'Today', channel: 'internal', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Priya Nair',
      body: 'FEMA disaster review kicked off for Rivera file. Notifying UW, ordering re-inspection. Rate lock expires June 1 — need extension filed.', read: true },
    { id: 4, ts: '10:05 AM', date: 'Today', channel: 'email', dir: 'out',
      from: 'Alex Torres', fromRole: 'LO', initials: 'AT', color: '#0EA5E9',
      to: 'Sam Okafor', subject: 'Urgent — FEMA Re-Inspection: 4820 Brickell Ave',
      body: 'Sam, due to DR-4830-FL (Hurricane Milton), we need a post-disaster re-inspection ASAP. Please confirm your earliest availability. Lender requires report within 5 business days.', read: true },
  ],
};

// ─── Channel config ───────────────────────────────────────────────────────────
const CH = {
  email:    { label: 'Email',    color: '#4F46E5', bg: '#EEF2FF', icon: 'mail'   },
  sms:      { label: 'SMS',      color: '#059669', bg: '#ECFDF5', icon: 'phone'  },
  internal: { label: 'Note',     color: '#C2410C', bg: '#FFF7ED', icon: 'send'   },
};

// ─── Tiny avatar ──────────────────────────────────────────────────────────────
function Av({ initials, color, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color + '20', border: '1.5px solid ' + color + '50',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.35, fontWeight: 700, color, lineHeight: 1 }}>{initials}</span>
    </div>
  );
}

// ─── Party pill (horizontal strip) ───────────────────────────────────────────
function PartyPill({ contact, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px 4px 5px', borderRadius: 999, flexShrink: 0,
      border: '1px solid ' + (active ? contact.color + '80' : 'var(--border-subtle)'),
      background: active ? contact.color + '12' : 'transparent',
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.1s',
    }}>
      <Av initials={contact.initials} color={contact.color} size={20}/>
      <span style={{ fontSize: 12, fontWeight: 600, color: active ? contact.color : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {contact.name.split(' ')[0]}
      </span>
    </button>
  );
}

// ─── Contact popover ──────────────────────────────────────────────────────────
function ContactPopover({ contact, anchorRect, onClose, onCompose }) {
  const [copied, setCopied] = React.useState(null);
  const copy = (val, key) => { navigator.clipboard?.writeText(val); setCopied(key); setTimeout(() => setCopied(null), 1400); };

  // Position to the right of the sidebar, vertically aligned to the anchor
  const SIDEBAR_W = 200;
  const CARD_W    = 252;
  const left      = SIDEBAR_W + 8;
  const top       = Math.min(
    anchorRect ? anchorRect.top : 200,
    window.innerHeight - 280
  );

  return ReactDOM.createPortal(
    <>
      {/* Backdrop to close on outside click */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 499 }}/>
      <div style={{
        position: 'fixed', top, left, zIndex: 500, width: CARD_W,
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: '14px 14px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
      }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
        <Av initials={contact.initials} color={contact.color} size={34}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{contact.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{contact.role}</div>
          {contact.company && <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{contact.company}</div>}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2, lineHeight: 0 }}>
          <Icon name="x" size={12}/>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {[{ icon: 'mail', val: contact.email, key: 'email' }, { icon: 'phone', val: contact.phone, key: 'phone' }].map(r => (
          <button key={r.key} onClick={() => copy(r.val, r.key)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px',
            background: 'var(--bg-muted)', border: 'none', borderRadius: 7,
            cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left',
          }}>
            <Icon name={r.icon} size={12} color="var(--text-secondary)"/>
            <span style={{ fontSize: 12, flex: 1, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.val}</span>
            <span style={{ fontSize: 10.5, color: copied === r.key ? '#059669' : 'var(--text-tertiary)', flexShrink: 0 }}>{copied === r.key ? '✓' : 'Copy'}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {['Email', 'SMS'].map(ch => (
          <button key={ch} onClick={() => { onCompose(ch.toLowerCase(), contact.name); onClose(); }} className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11.5 }}>
            <Icon name={ch === 'Email' ? 'mail' : 'phone'} size={11}/> {ch}
          </button>
        ))}
      </div>
    </div>
    </>,
    document.body
  );
}

// ─── Message row ──────────────────────────────────────────────────────────────
function MessageRow({ msg }) {
  const isOut      = msg.dir === 'out';
  const isSMS      = msg.channel === 'sms';
  const isInternal = msg.channel === 'internal';
  const ch         = CH[msg.channel];

  // ── SMS: chat bubbles ────────────────────────────────────────────────────
  if (isSMS) {
    return (
      <div style={{ display: 'flex', flexDirection: isOut ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
        {!isOut && <Av initials={msg.initials} color={msg.color} size={26}/>}
        <div style={{ maxWidth: '60%' }}>
          {!isOut && (
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 3, marginLeft: 2 }}>
              {msg.from} · {msg.ts}
            </div>
          )}
          <div style={{
            padding: '8px 13px', lineHeight: 1.55, fontSize: 13.5,
            borderRadius: isOut ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
            background: isOut ? '#7E68FA' : 'var(--bg-muted)',
            color: isOut ? '#fff' : 'var(--text-primary)',
          }}>
            {msg.body}
          </div>
          {isOut && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, textAlign: 'right' }}>
              {msg.ts}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Internal note: amber-accented row ────────────────────────────────────
  if (isInternal) {
    return (
      <div style={{
        display: 'flex', gap: 10, padding: '10px 12px',
        background: '#FFFBEB', borderRadius: 8,
        borderLeft: '2.5px solid #F59E0B',
      }}>
        <Av initials={msg.initials} color={msg.color} size={26}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{msg.from}</span>
            <span style={{ fontSize: 11, color: '#92400E', background: '#FDE68A', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>Team note</span>
            {msg.to && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>→ {msg.to}</span>}
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{msg.ts}</span>
          </div>
          <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.55 }}>{msg.body}</div>
        </div>
      </div>
    );
  }

  // ── Email: clean row with subtle left accent ───────────────────────────
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '11px 12px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)', borderRadius: 8,
      borderLeft: '2.5px solid ' + (isOut ? '#7E68FA' : '#E5E7EB'),
    }}>
      <Av initials={msg.initials} color={msg.color} size={26}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{msg.from}</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{msg.fromRole}</span>
          {msg.to && <><span style={{ fontSize: 11, color: 'var(--border-strong)' }}>→</span><span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{msg.to}</span></>}
          <span style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: ch.bg, color: ch.color, marginLeft: 2 }}>Email</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{msg.ts}</span>
        </div>
        {msg.subject && (
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{msg.subject}</div>
        )}
        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{msg.body}</div>
        {msg.attachments?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
            {msg.attachments.map(a => (
              <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 5, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <Icon name="doc" size={11} color="var(--text-tertiary)"/>{a}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, alignSelf: 'flex-start', paddingTop: 2 }}>
        <button className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '3px 8px' }}>Reply</button>
      </div>
    </div>
  );
}

// ─── AI draft suggestions ─────────────────────────────────────────────────────
const AI_DRAFTS = {
  email: {
    subject: 'Documents Received — One Item Remaining',
    body: `Hi Sarah,

Great news — we've received your documents and everything looks complete! One item still needed:

⏳ Homeowner's insurance declarations page

Please contact your insurance agent and have them send the binder to us. Once we have that, your file goes straight to underwriting.

Estimated closing: June 14, 2025 — we're on track!

Best,
Alex Torres · Xpanse Mortgage`,
  },
  sms: { body: "Sarah — docs received, looks great! One more thing: homeowner's insurance declarations page. Can you get that from your agent? 🏠" },
  internal: { body: 'Priya — borrower has uploaded all docs. HOI still outstanding (condition #4). Please follow up and move to UW queue once received.' },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CommsTab({ loanId }) {
  const contacts   = LOAN_CONTACTS[loanId] || DEFAULT_CONTACTS;
  const allParties = [...contacts.borrowers, ...contacts.external, ...contacts.team];
  const rawThread  = THREAD_DATA[loanId] || [];

  const [filterParty,    setFilterParty]    = React.useState(null);
  const [filterChannel,  setFilterChannel]  = React.useState('all');
  const [activePopover,  setActivePopover]  = React.useState(null);  // { id, rect }

  const [composeChannel, setComposeChannel] = React.useState('email');
  const [composeTo,      setComposeTo]      = React.useState('');
  const [composeSubject, setComposeSubject] = React.useState('');
  const [composeBody,    setComposeBody]    = React.useState('');
  const [showDraft,      setShowDraft]      = React.useState(false);
  const [thread,         setThread]         = React.useState(rawThread);
  const [sent,           setSent]           = React.useState(false);
  const bottomRef = React.useRef(null);

  const unread = thread.filter(m => !m.read).length;

  const filtered = thread.filter(m => {
    const chOk = filterChannel === 'all' || m.channel === filterChannel;
    const partyOk = !filterParty || allParties.find(p => p.id === filterParty && (p.name === m.from || p.name === m.to));
    return chOk && partyOk;
  });

  const handleSend = () => {
    if (!composeBody.trim()) return;
    const me = contacts.team[0] || { name: 'Alex Torres', initials: 'AT', color: '#0EA5E9', role: 'LO' };
    setThread(prev => [...prev, {
      id: prev.length + 1,
      ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      date: 'Today', channel: composeChannel, dir: 'out',
      from: me.name, fromRole: me.role, initials: me.initials, color: me.color,
      to: composeTo, subject: composeSubject, body: composeBody, read: true,
    }]);
    setComposeBody(''); setComposeSubject(''); setComposeTo('');
    setSent(true); setTimeout(() => setSent(false), 2000);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const useDraft = (draft) => {
    setComposeBody(draft.body || '');
    if (draft.subject) setComposeSubject(draft.subject);
    setShowDraft(false);
  };

  const handleComposeForContact = (channel, name) => {
    setComposeChannel(channel);
    setComposeTo(name);
  };

  const CHANNEL_TABS = [
    { id: 'email',    label: 'Email',  icon: 'mail'  },
    { id: 'sms',      label: 'SMS',    icon: 'phone' },
    { id: 'internal', label: 'Note',   icon: 'send'  },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>

      {/* ── Left: Party directory ──────────────────────────────────────── */}
      <div style={{
        width: 200, flexShrink: 0, borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '14px 14px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: 8 }}>Parties</div>

          {/* All */}
          <button onClick={() => { setFilterParty(null); setFilterChannel('all'); }} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 8px',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
            background: !filterParty ? 'var(--bg-muted)' : 'transparent',
            color: !filterParty ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: !filterParty ? 600 : 400,
            marginBottom: 2,
          }}>
            <Icon name="mail" size={13} color="var(--text-tertiary)"/>
            All messages
            {unread > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: '#fff', background: '#7E68FA', borderRadius: 999, padding: '1px 6px' }}>{unread}</span>
            )}
          </button>

          {[
            { label: 'Borrowers', contacts: contacts.borrowers },
            { label: 'External',  contacts: contacts.external  },
            { label: 'Team',      contacts: contacts.team      },
          ].map(section => (
            <div key={section.label} style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: 4, paddingLeft: 8 }}>
                {section.label}
              </div>
              {section.contacts.map(c => {
                const isActive = filterParty === c.id;
                const msgCount = thread.filter(m => m.from === c.name || m.to === c.name).length;
                return (
                  <div key={c.id}>
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const isOpen = activePopover?.id === c.id;
                        setFilterParty(isOpen ? null : c.id);
                        setActivePopover(isOpen ? null : { id: c.id, rect });
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '6px 8px', border: 'none', borderRadius: 6, cursor: 'pointer',
                        fontFamily: 'inherit', background: isActive ? c.color + '12' : 'transparent',
                        textAlign: 'left',
                      }}
                    >
                      <Av initials={c.initials} color={c.color} size={24}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: isActive ? c.color : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role}</div>
                      </div>
                      {msgCount > 0 && <span style={{ fontSize: 10, color: 'var(--text-tertiary)', flexShrink: 0 }}>{msgCount}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Thread + compose ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}>

        {/* Contact header */}
        {(() => {
          const contact = filterParty
            ? allParties.find(p => p.id === filterParty)
            : contacts.borrowers[0];
          if (!contact) return null;
          return (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)', flexShrink: 0,
            }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: contact.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>{contact.initials}</div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{contact.name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', padding: '1px 7px', borderRadius: 999 }}>{contact.role}</span>
                  {contact.company && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{contact.company}</span>}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 3 }}>
                  {contact.phone && contact.phone !== '—' && (
                    <a href={`tel:${contact.phone}`} style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--ai-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                      <Icon name="phone" size={11}/>{contact.phone}
                    </a>
                  )}
                  {contact.email && contact.email !== '—' && (
                    <a href={`mailto:${contact.email}`} style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--ai-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                      <Icon name="mail" size={11}/>{contact.email}
                    </a>
                  )}
                </div>
              </div>
              {!filterParty && contacts.borrowers.length > 1 && (
                <div style={{ display: 'flex', gap: -4 }}>
                  {contacts.borrowers.slice(1).map(b => (
                    <div key={b.id} title={b.name} style={{ width: 24, height: 24, borderRadius: '50%', background: b.color, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-surface)', marginLeft: -6 }}>{b.initials}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)', flexShrink: 0,
        }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {filterParty ? allParties.find(p => p.id === filterParty)?.name : 'All Messages'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {filtered.length} messages{unread > 0 && !filterParty ? ` · ${unread} unread` : ''}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {['all', 'email', 'sms', 'internal'].map(ch => (
              <button key={ch} onClick={() => setFilterChannel(ch)} style={{
                padding: '3px 10px', borderRadius: 5, border: '1px solid',
                borderColor: filterChannel === ch ? '#7E68FA' : 'var(--border-subtle)',
                background: filterChannel === ch ? '#7E68FA' : 'transparent',
                color: filterChannel === ch ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
              }}>
                {ch === 'all' ? 'All' : ch === 'internal' ? 'Notes' : ch.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, paddingTop: 48 }}>No messages match the current filter.</div>
          ) : filtered.map((msg, i) => {
            const showDate = i === 0 || filtered[i - 1]?.date !== msg.date;
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{msg.date}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  {!msg.read && (
                    <div style={{ position: 'absolute', top: 10, right: -4, width: 7, height: 7, borderRadius: '50%', background: '#7E68FA' }}/>
                  )}
                  <MessageRow msg={msg}/>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={bottomRef}/>
        </div>

        {/* Compose */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '12px 16px', flexShrink: 0, position: 'relative' }}>

          {/* AI Draft overlay */}
          {showDraft && (() => {
            const draft = AI_DRAFTS[composeChannel] || AI_DRAFTS.email;
            return (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 4px)', left: 16, right: 16,
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: 14, boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
                zIndex: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: 'linear-gradient(135deg,#7E68FA,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="sparkle" size={11} color="#fff" strokeWidth={2}/>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>AI Draft</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>context-aware · {composeChannel}</span>
                  <button onClick={() => setShowDraft(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', lineHeight: 0, padding: 2 }}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
                {draft.subject && <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Subject: {draft.subject}</div>}
                <div style={{ background: 'var(--bg-muted)', borderRadius: 7, padding: '9px 11px', fontSize: 12.5, lineHeight: 1.65, color: 'var(--text-primary)', maxHeight: 160, overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: 10 }}>
                  {draft.body}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => useDraft(draft)} style={{ fontSize: 12 }}>
                    <Icon name="check" size={11} strokeWidth={2.5}/> Use draft
                  </button>
                  <button className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>Regenerate</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowDraft(false)} style={{ fontSize: 12 }}>Dismiss</button>
                </div>
              </div>
            );
          })()}

          {/* Channel tabs + To row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', background: 'var(--bg-muted)', borderRadius: 7, padding: 2, gap: 1 }}>
              {CHANNEL_TABS.map(ch => (
                <button key={ch.id} onClick={() => setComposeChannel(ch.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  borderRadius: 5, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.1s',
                  background: composeChannel === ch.id ? 'var(--bg-surface)' : 'transparent',
                  color: composeChannel === ch.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: composeChannel === ch.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                  <Icon name={ch.icon} size={11}/> {ch.label}
                </button>
              ))}
            </div>

            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>To:</span>
            <select value={composeTo} onChange={e => setComposeTo(e.target.value)} style={{
              flex: 1, maxWidth: 200, fontSize: 12, border: '1px solid var(--border-subtle)',
              borderRadius: 6, padding: '4px 8px', background: 'var(--bg-muted)',
              color: 'var(--text-primary)', fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <option value="">Select…</option>
              {allParties.map(c => <option key={c.id} value={c.name}>{c.name} ({c.role})</option>)}
            </select>

            {composeChannel === 'email' && (
              <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject…" style={{
                flex: 2, padding: '4px 9px', border: '1px solid var(--border-subtle)',
                borderRadius: 6, background: 'var(--bg-muted)', fontSize: 12,
                fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none',
              }}/>
            )}
          </div>

          {/* Body + actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)}
              placeholder={composeChannel === 'sms' ? 'Type a text message…' : composeChannel === 'internal' ? 'Leave a note for your team…' : 'Compose email…'}
              rows={composeChannel === 'sms' ? 2 : 3}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSend(); }}
              style={{
                flex: 1, padding: '9px 11px', border: '1px solid var(--border-subtle)',
                borderRadius: 7, background: 'var(--bg-muted)', fontSize: 13,
                fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: 1.5,
                color: 'var(--text-primary)',
                minHeight: composeChannel === 'sms' ? 64 : 88,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <button onClick={() => setShowDraft(d => !d)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px',
                border: '1.5px solid #7E68FA40', borderRadius: 7, cursor: 'pointer',
                background: 'linear-gradient(135deg,#7E68FA10,#a78bfa10)',
                color: '#7E68FA', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
              }}>
                <Icon name="sparkle" size={12} color="#7E68FA" strokeWidth={2}/> AI
              </button>
              <button onClick={handleSend} disabled={!composeBody.trim()} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '6px 11px', border: 'none', borderRadius: 7,
                background: sent ? '#059669' : '#7E68FA',
                color: '#fff', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                cursor: composeBody.trim() ? 'pointer' : 'not-allowed',
                opacity: composeBody.trim() ? 1 : 0.4, transition: 'background 0.18s',
              }}>
                {sent ? <Icon name="check" size={12} color="#fff" strokeWidth={2.5}/> : <Icon name="send" size={12} color="#fff"/>}
                {sent ? 'Sent' : 'Send'}
              </button>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>⌘↵ to send · All messages are logged to the loan file</div>
        </div>
      </div>

      {/* Portal contact popover — rendered outside sidebar so it's never clipped */}
      {activePopover && (() => {
        const contact = allParties.find(p => p.id === activePopover.id);
        return contact ? (
          <ContactPopover
            contact={contact}
            anchorRect={activePopover.rect}
            onClose={() => { setActivePopover(null); setFilterParty(null); }}
            onCompose={handleComposeForContact}
          />
        ) : null;
      })()}
    </div>
  );
}

export { LOAN_CONTACTS };
