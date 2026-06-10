import React from 'react';
import { Icon } from './Icon';
import { flags } from '../flags';

// ─── Default preferences ──────────────────────────────────────────────────────
const DEFAULTS = {
  // Profile
  firstName:    'Alex',
  lastName:     'Torres',
  title:        'Loan Officer',
  nmls:         '1084291',
  branch:       'Denver — West Region',
  phone:        '(303) 555-0501',
  email:        'atorres@xpanse.com',
  avatarColor:  '#4A39C9',
  signature:    'Alex Torres\nLoan Officer · Xpanse Mortgage\nNMLS #1084291\n(303) 555-0501',

  // Notifications
  notif_borrower_message:   true,
  notif_condition_added:    true,
  notif_lock_expiring:      true,
  notif_appraisal_update:   true,
  notif_doc_uploaded:       true,
  notif_milestone_change:   true,
  notif_team_mention:       true,
  notif_ai_insight:         false,
  notif_channel_email:      true,
  notif_channel_sms:        false,
  notif_channel_push:       true,

  // Defaults
  default_startup_view:     'home',
  default_loan_tab:         'now',
  default_pipeline_sort:    'closing_asc',
  default_compose_channel:  'email',
  ai_assist_level:          'balanced',   // minimal | balanced | proactive
  ai_auto_draft:            false,

  // Appearance
  density:                  'comfortable', // compact | comfortable
  theme:                    'light',

  // Language
  language:                 'en',
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('los-prefs') || '{}');
    return { ...DEFAULTS, ...saved };
  } catch { return { ...DEFAULTS }; }
}

function save(prefs) {
  localStorage.setItem('los-prefs', JSON.stringify(prefs));
}

// ─── Small reusable pieces ────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 12, marginTop: 4 }}>
      {children}
    </div>
  );
}

// Renders form labels in sentence case while preserving all-caps acronyms
// like ZIP, SSN, FHA, etc.
function toSentenceCase(label) {
  if (typeof label !== 'string' || !label) return label;
  return label.split(' ').map((word, i) => {
    if (word.length >= 2 && /[A-Z]/.test(word) && word === word.toUpperCase()) return word;
    if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  }).join(' ');
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {toSentenceCase(label)}
        {hint && <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: '7px 10px', border: '1px solid var(--border-subtle)',
  borderRadius: 7, background: 'var(--bg-muted)', fontSize: 13,
  fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none',
  width: '100%', boxSizing: 'border-box',
};

function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ ...inputStyle, fontFamily: mono ? 'DM Mono' : 'inherit' }}/>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '7px 0' }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 34, height: 20, borderRadius: 999, flexShrink: 0, marginTop: 1,
        background: checked ? '#7E68FA' : 'var(--border-strong)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.15s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 17 : 3,
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}/>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>{label}</div>
        {desc && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{desc}</div>}
      </div>
    </label>
  );
}

function SegmentControl({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-muted)', borderRadius: 8, padding: 3, gap: 2 }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          flex: 1, padding: '5px 0', border: 'none', borderRadius: 6, cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all 0.1s',
          background: value === opt.value ? 'var(--bg-surface)' : 'transparent',
          color: value === opt.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          boxShadow: value === opt.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, paddingRight: 30, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
        <Icon name="chevronDown" size={13}/>
      </span>
    </div>
  );
}

const AVATAR_COLORS = ['#4A39C9','#7E68FA','#059669','#D97706','#B91C1C','#0EA5E9','#7C3AED','#0F766E','#C2410C','#374151'];

// ─── Tab panels ───────────────────────────────────────────────────────────────
function ProfilePanel({ prefs, set }) {
  const initials = (prefs.firstName[0] || '') + (prefs.lastName[0] || '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: prefs.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Avatar color</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {AVATAR_COLORS.map(c => (
              <button key={c} onClick={() => set('avatarColor', c)} style={{
                width: 22, height: 22, borderRadius: '50%', background: c, border: 'none',
                cursor: 'pointer', outline: prefs.avatarColor === c ? '2.5px solid var(--text-primary)' : 'none',
                outlineOffset: 2,
              }}/>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="First name">
          <TextInput value={prefs.firstName} onChange={v => set('firstName', v)}/>
        </Field>
        <Field label="Last name">
          <TextInput value={prefs.lastName} onChange={v => set('lastName', v)}/>
        </Field>
      </div>

      <Field label="Title">
        <SelectInput value={prefs.title} onChange={v => set('title', v)} options={[
          { value: 'Loan Officer', label: 'Loan Officer' },
          { value: 'Senior Loan Officer', label: 'Senior Loan Officer' },
          { value: 'Processor', label: 'Processor' },
          { value: 'Underwriter', label: 'Underwriter' },
          { value: 'Branch Manager', label: 'Branch Manager' },
          { value: 'Loan Officer Assistant', label: 'LO Assistant' },
        ]}/>
      </Field>

      <Field label="NMLS #" hint="(required)">
        <TextInput value={prefs.nmls} onChange={v => set('nmls', v)} mono placeholder="e.g. 1084291"/>
      </Field>

      <Field label="Branch">
        <TextInput value={prefs.branch} onChange={v => set('branch', v)} placeholder="e.g. Denver — West Region"/>
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Phone">
          <TextInput value={prefs.phone} onChange={v => set('phone', v)} placeholder="(303) 555-0000"/>
        </Field>
        <Field label="Email">
          <TextInput value={prefs.email} onChange={v => set('email', v)} placeholder="you@lender.com"/>
        </Field>
      </div>

      <Field label="Email signature">
        <textarea value={prefs.signature} onChange={e => set('signature', e.target.value)}
          rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontSize: 12.5 }}/>
      </Field>

      <div style={{ height: 1, background: 'var(--border-subtle)' }}/>
      <SectionTitle>Language & Region</SectionTitle>

      <Field label="Preferred language" hint="— affects UI labels and AI-generated content">
        <SelectInput value={prefs.language} onChange={v => set('language', v)} options={[
          { value: 'en',    label: '🇺🇸  English (US)' },
          { value: 'en-gb', label: '🇬🇧  English (UK)' },
          { value: 'es',    label: '🇪🇸  Spanish — Español' },
          { value: 'es-mx', label: '🇲🇽  Spanish — México' },
          { value: 'pt-br', label: '🇧🇷  Portuguese — Brasil' },
          { value: 'zh',    label: '🇨🇳  Chinese — 中文' },
          { value: 'vi',    label: '🇻🇳  Vietnamese — Tiếng Việt' },
          { value: 'ko',    label: '🇰🇷  Korean — 한국어' },
          { value: 'tl',    label: '🇵🇭  Tagalog' },
          { value: 'ar',    label: '🇸🇦  Arabic — العربية' },
          { value: 'fr',    label: '🇫🇷  French — Français' },
          { value: 'de',    label: '🇩🇪  German — Deutsch' },
        ]}/>
        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 5, lineHeight: 1.5 }}>
          AI-drafted messages and borrower-facing content will be generated in this language. App interface language requires a page reload.
        </div>
      </Field>
    </div>
  );
}

function NotificationsPanel({ prefs, set }) {
  const events = [
    { key: 'notif_borrower_message',  label: 'Borrower sends a message',       desc: 'SMS, email, or portal message' },
    { key: 'notif_condition_added',   label: 'New condition added to file',     desc: 'UW or processor adds a condition' },
    { key: 'notif_lock_expiring',     label: 'Rate lock expiring in 3 days',   desc: 'Time-sensitive — recommended on' },
    { key: 'notif_appraisal_update',  label: 'Appraisal status update',        desc: 'Ordered, scheduled, or delivered' },
    { key: 'notif_doc_uploaded',      label: 'Borrower uploads documents',     desc: 'Via portal or email attachment' },
    { key: 'notif_milestone_change',  label: 'Loan stage changes',             desc: 'Processing → Underwriting, etc.' },
    { key: 'notif_team_mention',      label: 'Team member mentions you',       desc: 'In internal notes or comms' },
    { key: 'notif_ai_insight',        label: 'AI surfaces a new insight',      desc: 'Risk flag, opportunity, or suggestion' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <SectionTitle>Alert me when…</SectionTitle>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        {events.map((ev, i) => (
          <div key={ev.key} style={{
            padding: '2px 14px', borderBottom: i < events.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <Toggle checked={prefs[ev.key]} onChange={v => set(ev.key, v)} label={ev.label} desc={ev.desc}/>
          </div>
        ))}
      </div>

      <SectionTitle style={{ marginTop: 20 }}>Delivery channels</SectionTitle>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        {[
          { key: 'notif_channel_email', label: 'Email notifications',   desc: 'Sent to ' + prefs.email },
          { key: 'notif_channel_sms',   label: 'SMS notifications',     desc: 'Sent to ' + prefs.phone },
          { key: 'notif_channel_push',  label: 'In-app notifications',  desc: 'Bell icon in the top nav' },
        ].map((ch, i, arr) => (
          <div key={ch.key} style={{ padding: '2px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <Toggle checked={prefs[ch.key]} onChange={v => set(ch.key, v)} label={ch.label} desc={ch.desc}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function DefaultsPanel({ prefs, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionTitle>Startup</SectionTitle>

      <Field label="Open app to" hint="">
        <SelectInput value={prefs.default_startup_view} onChange={v => set('default_startup_view', v)} options={[
          { value: 'home',     label: 'Home dashboard' },
          { value: 'pipeline', label: 'Pipeline' },
          { value: 'feed',     label: 'AI Feed' },
        ]}/>
      </Field>

      <Field label="Default loan tab">
        <SelectInput value={prefs.default_loan_tab} onChange={v => set('default_loan_tab', v)} options={[
          { value: 'now',        label: 'Tasks (Now)' },
          { value: 'story',      label: 'Loan Story' },
          { value: 'data',       label: 'Documents' },
          { value: 'comms',      label: 'Comms' },
          { value: 'conditions', label: 'Conditions' },
        ]}/>
      </Field>

      <Field label="Pipeline default sort">
        <SelectInput value={prefs.default_pipeline_sort} onChange={v => set('default_pipeline_sort', v)} options={[
          { value: 'closing_asc',  label: 'Closing date (soonest first)' },
          { value: 'updated_desc', label: 'Last updated (newest first)' },
          { value: 'amount_desc',  label: 'Loan amount (largest first)' },
          { value: 'alpha',        label: 'Borrower name (A–Z)' },
        ]}/>
      </Field>

      <div style={{ height: 1, background: 'var(--border-subtle)' }}/>
      <SectionTitle>AI & Compose</SectionTitle>

      <Field label="AI assist level">
        <SegmentControl value={prefs.ai_assist_level} onChange={v => set('ai_assist_level', v)} options={[
          { value: 'minimal',    label: 'Minimal' },
          { value: 'balanced',   label: 'Balanced' },
          { value: 'proactive',  label: 'Proactive' },
        ]}/>
        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 6 }}>
          {{
            minimal:   'AI only responds when you ask — no auto-suggestions.',
            balanced:  'AI surfaces insights and drafts on key actions.',
            proactive: 'AI proactively flags risks, drafts messages, and queues tasks.',
          }[prefs.ai_assist_level]}
        </div>
      </Field>

      <Toggle
        checked={prefs.ai_auto_draft}
        onChange={v => set('ai_auto_draft', v)}
        label="Auto-generate message drafts"
        desc="Pre-fill compose when context makes the message obvious (e.g. requesting missing docs)"
      />

      <Field label="Default compose channel">
        <SegmentControl value={prefs.default_compose_channel} onChange={v => set('default_compose_channel', v)} options={[
          { value: 'email',    label: 'Email' },
          { value: 'sms',      label: 'SMS' },
          { value: 'internal', label: 'Note' },
        ]}/>
      </Field>
    </div>
  );
}

function AppearancePanel({ prefs, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SectionTitle>Display</SectionTitle>

      <Field label="Density">
        <SegmentControl value={prefs.density} onChange={v => set('density', v)} options={[
          { value: 'compact',      label: 'Compact' },
          { value: 'comfortable',  label: 'Comfortable' },
        ]}/>
        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 5 }}>
          Compact reduces row heights and padding throughout the LOS.
        </div>
      </Field>

      <Field label="Theme">
        <SegmentControl value={prefs.theme} onChange={v => set('theme', v)} options={[
          { value: 'light', label: '☀ Light' },
          { value: 'dark',  label: '◑ Dark' },
          { value: 'system',label: '⬡ System' },
        ]}/>
      </Field>

      <div style={{ height: 1, background: 'var(--border-subtle)' }}/>
      <SectionTitle>Keyboard shortcuts</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { keys: '⌘K',        action: 'Open command palette' },
          { keys: '⌘P',        action: 'Go to Pipeline' },
          { keys: '⌘H',        action: 'Go to Home' },
          { keys: '⌘↵',        action: 'Send message in compose' },
        ].map(s => (
          <div key={s.keys} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.action}</span>
            <kbd style={{ fontSize: 11, fontFamily: 'DM Mono', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 5, padding: '2px 7px', color: 'var(--text-secondary)' }}>{s.keys}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main drawer ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',       label: 'Profile',       icon: 'settings' },
  { id: 'notifications', label: 'Notifications', icon: 'bell'     },
  { id: 'defaults',      label: 'Defaults',      icon: 'target'   },
  { id: 'appearance',    label: 'Appearance',    icon: 'zap'      },
];

export function PreferencesModal({ onClose }) {
  const [prefs, setPrefs] = React.useState(load);
  const [tab,   setTab]   = React.useState('profile');
  const [saved, setSaved] = React.useState(false);

  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    save(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClose = () => {
    save(prefs);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.25)',
      }}/>

      {/* Drawer — flag leftNavPolish flips it to slide in from the left, anchored next to the LeftNav rail */}
      <div style={flags.leftNavPolish ? {
        position: 'fixed', top: 0, left: 44, bottom: 0, zIndex: 801,
        width: 480, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        boxShadow: '8px 0 40px rgba(0,0,0,0.14)',
        display: 'flex', flexDirection: 'column',
      } : {
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 801,
        width: 480, background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.14)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: prefs.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0, marginRight: 10,
          }}>
            {(prefs.firstName[0] || '') + (prefs.lastName[0] || '')}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
              {prefs.firstName} {prefs.lastName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {prefs.title} · NMLS #{prefs.nmls}
            </div>
          </div>
          <button onClick={handleClose} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-tertiary)', padding: 6, lineHeight: 0,
            borderRadius: 6,
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0, padding: '0 8px',
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 12px', border: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
              cursor: 'pointer', borderBottom: '2px solid',
              borderBottomColor: tab === t.id ? '#7E68FA' : 'transparent',
              marginBottom: -1,
            }}>
              <Icon name={t.icon} size={13} color={tab === t.id ? '#7E68FA' : 'var(--text-tertiary)'}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {tab === 'profile'       && <ProfilePanel       prefs={prefs} set={set}/>}
          {tab === 'notifications' && <NotificationsPanel prefs={prefs} set={set}/>}
          {tab === 'defaults'      && <DefaultsPanel      prefs={prefs} set={set}/>}
          {tab === 'appearance'    && <AppearancePanel    prefs={prefs} set={set}/>}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', borderTop: '1px solid var(--border-subtle)',
          flexShrink: 0, background: 'var(--bg-muted)',
        }}>
          <button onClick={handleClose} className="btn btn-outline btn-sm">Discard</button>
          <button onClick={handleSave} className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
            {saved
              ? <><Icon name="check" size={12} strokeWidth={2.5} color="#fff"/> Saved!</>
              : 'Save preferences'
            }
          </button>
        </div>
      </div>
    </>
  );
}

export { load as loadPrefs };
