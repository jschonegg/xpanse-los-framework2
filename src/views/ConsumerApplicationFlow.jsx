import React, { useState } from 'react';
import { Icon } from '../components/Icon';

const S = {
  wrap: { flex: 1, overflow: 'auto', background: 'var(--bg-app)', padding: '32px 40px 64px' },
  inner: { maxWidth: 760, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  backBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' },
  appTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' },
  savePill: { fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 },

  stepper: { display: 'flex', alignItems: 'flex-start', marginBottom: 24 },
  stItem: { flex: 1, textAlign: 'center', position: 'relative', cursor: 'pointer' },
  stNum: (status) => ({
    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 600, position: 'relative', zIndex: 2,
    ...(status === 'done' ? { background: 'var(--success-soft)', color: 'var(--success)' } :
      status === 'active' ? { background: 'var(--brand-primary)', color: '#fff' } :
      { background: 'var(--bg-sunken)', color: 'var(--text-muted)' })
  }),
  stLabel: (active) => ({ fontSize: 11, color: active ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: active ? 600 : 400 }),
  stLine: (done) => ({
    position: 'absolute', top: 14, left: 'calc(50% + 18px)', right: 'calc(-50% + 18px)',
    height: 2, zIndex: 1,
    background: done ? 'var(--success)' : 'var(--border-subtle)'
  }),

  progressRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  progressTrack: { flex: 1, height: 4, background: 'var(--bg-sunken)', borderRadius: 2, overflow: 'hidden' },
  progressFill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'var(--brand-primary)', borderRadius: 2, transition: 'width 0.4s ease' }),
  progressPct: { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 32 },

  formCard: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)', padding: '24px', marginBottom: 16, boxShadow: 'var(--shadow-xs)' },
  sectionHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  sectionIcon: (bg, color) => ({ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: bg, color }),
  sectionTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' },
  sectionDesc: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 },

  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fieldFull: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
  helper: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 },

  infoBanner: { background: 'var(--info-soft)', borderRadius: 'var(--r-sm)', padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--info)', lineHeight: 1.4 },

  radioGroup: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  radioOpt: (selected) => ({
    flex: 1, minWidth: 120, border: selected ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-default)',
    borderRadius: 'var(--r-sm)', padding: '12px 14px', cursor: 'pointer', textAlign: 'center',
    fontSize: 13, transition: 'all 0.15s',
    background: selected ? 'var(--brand-primary-soft)' : 'transparent',
    color: selected ? 'var(--brand-primary)' : 'var(--text-primary)',
    fontWeight: selected ? 600 : 400
  }),
  radioIcon: { display: 'block', marginBottom: 4 },

  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },

  toggleRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)' },
  toggleTrack: (on) => ({
    width: 36, height: 20, borderRadius: 10, position: 'relative', cursor: 'pointer',
    transition: 'background 0.2s', flexShrink: 0,
    background: on ? 'var(--brand-primary)' : 'var(--border-default)'
  }),
  toggleKnob: (on) => ({
    width: 16, height: 16, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 2, left: on ? 18 : 2, transition: 'left 0.2s'
  }),
  toggleLabel: { fontSize: 13, color: 'var(--text-secondary)' },

  reviewSection: { marginBottom: 16 },
  reviewTitle: { fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  reviewEdit: { fontSize: 12, color: 'var(--brand-primary)', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontWeight: 400 },
  reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' },
  reviewLabel: { fontSize: 12, color: 'var(--text-tertiary)' },
  reviewVal: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },

  consentRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' },
  consentLabel: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 },
  submitBtn: {
    width: '100%', background: 'var(--success)', color: '#fff', border: 'none',
    borderRadius: 'var(--r-sm)', padding: '14px', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', marginTop: 12, display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif"
  },
};

const STEPS = [
  { label: 'Personal', icon: 'user' },
  { label: 'Employment', icon: 'briefcase' },
  { label: 'Property', icon: 'home' },
  { label: 'Assets', icon: 'wallet' },
  { label: 'Review', icon: 'check' },
];

function Field({ label, children, full, helper }) {
  return (
    <div style={full ? S.fieldFull : undefined}>
      <label style={S.label}>{label}</label>
      {children}
      {helper && <div style={S.helper}><Icon name="info" size={12} color="var(--text-tertiary)" /> {helper}</div>}
    </div>
  );
}

function RadioGroup({ options, selected, onSelect }) {
  return (
    <div style={S.radioGroup}>
      {options.map(o => (
        <div key={o.value} style={S.radioOpt(selected === o.value)} onClick={() => onSelect(o.value)}>
          <Icon name={o.icon} size={18} style={S.radioIcon} />
          {o.label}
        </div>
      ))}
    </div>
  );
}

function PersonalStep() {
  const [coBorrower, setCoBorrower] = useState(false);
  return (
    <>
      <div style={S.infoBanner}>
        <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        Most fields are prefilled from your prequalification — just verify the info is current.
      </div>
      <div style={S.fieldGrid}>
        <Field label="First name"><input className="input" defaultValue="Jordan" /></Field>
        <Field label="Last name"><input className="input" defaultValue="Schonegg" /></Field>
        <Field label="Date of birth"><input className="input" type="date" defaultValue="1992-03-15" /></Field>
        <Field label="SSN" helper="Encrypted and secure"><input className="input" type="password" defaultValue="•••-••-4829" /></Field>
        <Field label="Phone"><input className="input" defaultValue="(512) 555-0142" /></Field>
        <Field label="Email"><input className="input" defaultValue="schonegg.jordan@gmail.com" /></Field>
        <Field label="Current address" full><input className="input" placeholder="Street address" /></Field>
        <Field label="City"><input className="input" placeholder="City" /></Field>
        <Field label="State">
          <select className="select"><option value="">Select</option><option>Texas</option><option>California</option><option>Florida</option><option>New York</option></select>
        </Field>
        <Field label="Zip"><input className="input" placeholder="ZIP code" /></Field>
        <Field label="Years at address" helper="If under 2 years, we'll ask for prior address">
          <input className="input" type="number" placeholder="e.g. 3" />
        </Field>
      </div>
      <div style={{ ...S.toggleRow, marginTop: 20 }}>
        <div style={S.toggleTrack(coBorrower)} onClick={() => setCoBorrower(!coBorrower)}>
          <div style={S.toggleKnob(coBorrower)} />
        </div>
        <span style={S.toggleLabel}>Adding a co-borrower to this application</span>
      </div>
    </>
  );
}

function EmploymentStep() {
  const [status, setStatus] = useState('employed');
  return (
    <>
      <div style={S.infoBanner}>
        <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        Include all income sources — salary, bonuses, freelance, rental income, etc.
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...S.label, marginBottom: 10 }}>Employment status</label>
        <RadioGroup
          options={[
            { value: 'employed', icon: 'home', label: 'Employed' },
            { value: 'self', icon: 'user', label: 'Self-employed' },
            { value: 'retired', icon: 'clock', label: 'Retired' },
            { value: 'other', icon: 'settings', label: 'Other' },
          ]}
          selected={status}
          onSelect={setStatus}
        />
      </div>
      <div style={S.fieldGrid}>
        <Field label="Employer name" full><input className="input" placeholder="Company name" /></Field>
        <Field label="Job title"><input className="input" placeholder="Your role" /></Field>
        <Field label="Years at job"><input className="input" type="number" placeholder="e.g. 4" /></Field>
        <Field label="Employer phone"><input className="input" placeholder="(___) ___-____" /></Field>
        <Field label="Work email"><input className="input" placeholder="you@company.com" /></Field>
        <Field label="Annual base salary" helper="Before taxes"><input className="input" placeholder="$0.00" /></Field>
        <Field label="Bonus / commission"><input className="input" placeholder="$0.00 (annual avg)" /></Field>
        <Field label="Other income"><input className="input" placeholder="$0.00" /></Field>
        <Field label="Other income source">
          <select className="select"><option value="">Select type</option><option>Rental income</option><option>Investments</option><option>Alimony / child support</option><option>Social security</option><option>Other</option></select>
        </Field>
      </div>
    </>
  );
}

function PropertyStep() {
  const [hasProperty, setHasProperty] = useState('yes');
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...S.label, marginBottom: 10 }}>Do you have a property in mind?</label>
        <RadioGroup
          options={[
            { value: 'yes', icon: 'home', label: 'Yes, I found one' },
            { value: 'no', icon: 'search', label: 'Still looking' },
          ]}
          selected={hasProperty}
          onSelect={setHasProperty}
        />
      </div>
      {hasProperty === 'yes' && (
        <div style={S.fieldGrid}>
          <Field label="Property address" full><input className="input" placeholder="Street address of the property" /></Field>
          <Field label="City"><input className="input" placeholder="City" /></Field>
          <Field label="State">
            <select className="select"><option value="">Select</option><option>Texas</option><option>California</option><option>Florida</option></select>
          </Field>
          <Field label="Zip"><input className="input" placeholder="ZIP" /></Field>
          <Field label="Property type">
            <select className="select"><option value="">Select</option><option>Single family</option><option>Condo</option><option>Townhouse</option><option>Multi-family (2-4)</option><option>Manufactured</option></select>
          </Field>
          <Field label="Intended use">
            <select className="select"><option value="">Select</option><option>Primary residence</option><option>Second home</option><option>Investment</option></select>
          </Field>
          <Field label="Purchase price"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Down payment" helper="Min. 3% for conventional"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Down payment source">
            <select className="select"><option value="">Select</option><option>Savings</option><option>Gift</option><option>Sale of property</option><option>401(k) / IRA</option><option>Other</option></select>
          </Field>
        </div>
      )}
    </>
  );
}

function AssetsStep() {
  return (
    <>
      <div style={S.infoBanner}>
        <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        We may verify accounts during underwriting. Include all accounts with a balance over $500.
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
          <Icon name="pipeline" size={15} color="var(--text-tertiary)" /> Assets
        </label>
        <div style={S.fieldGrid}>
          <Field label="Checking accounts"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Savings accounts"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Retirement (401k, IRA)"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Investment accounts"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Other assets"><input className="input" placeholder="$0.00" /></Field>
          <Field label="Other description"><input className="input" placeholder="e.g. crypto, business equity" /></Field>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
          <Icon name="pipeline" size={15} color="var(--text-tertiary)" /> Monthly liabilities
        </label>
        <div style={S.fieldGrid}>
          <Field label="Auto loan payment"><input className="input" placeholder="$0.00 / mo" /></Field>
          <Field label="Student loan payment"><input className="input" placeholder="$0.00 / mo" /></Field>
          <Field label="Credit card min. payments"><input className="input" placeholder="$0.00 / mo" /></Field>
          <Field label="Other debt payments"><input className="input" placeholder="$0.00 / mo" /></Field>
          <Field label="Alimony / child support"><input className="input" placeholder="$0.00 / mo" /></Field>
          <Field label="Current rent / mortgage"><input className="input" placeholder="$0.00 / mo" /></Field>
        </div>
      </div>
    </>
  );
}

function ReviewStep({ onGoTo }) {
  return (
    <>
      <div style={S.reviewSection}>
        <div style={S.reviewTitle}>
          Personal information
          <span style={S.reviewEdit} onClick={() => onGoTo(0)}><Icon name="edit" size={11} /> Edit</span>
        </div>
        <div style={S.reviewGrid}>
          <div><div style={S.reviewLabel}>Name</div><div style={S.reviewVal}>Jordan Schonegg</div></div>
          <div><div style={S.reviewLabel}>DOB</div><div style={S.reviewVal}>03/15/1992</div></div>
          <div><div style={S.reviewLabel}>Phone</div><div style={S.reviewVal}>(512) 555-0142</div></div>
          <div><div style={S.reviewLabel}>Email</div><div style={S.reviewVal}>schonegg.jordan@gmail.com</div></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, ...S.reviewSection }}>
        <div style={S.reviewTitle}>
          Employment & income
          <span style={S.reviewEdit} onClick={() => onGoTo(1)}><Icon name="edit" size={11} /> Edit</span>
        </div>
        <div style={S.reviewGrid}>
          <div><div style={S.reviewLabel}>Status</div><div style={S.reviewVal}>Employed</div></div>
          <div><div style={S.reviewLabel}>Base salary</div><div style={S.reviewVal}>—</div></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, ...S.reviewSection }}>
        <div style={S.reviewTitle}>
          Property
          <span style={S.reviewEdit} onClick={() => onGoTo(2)}><Icon name="edit" size={11} /> Edit</span>
        </div>
        <div style={S.reviewGrid}>
          <div><div style={S.reviewLabel}>Status</div><div style={S.reviewVal}>Property identified</div></div>
          <div><div style={S.reviewLabel}>Type</div><div style={S.reviewVal}>—</div></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, marginBottom: 20, ...S.reviewSection }}>
        <div style={S.reviewTitle}>
          Assets & liabilities
          <span style={S.reviewEdit} onClick={() => onGoTo(3)}><Icon name="edit" size={11} /> Edit</span>
        </div>
        <div style={S.reviewGrid}>
          <div><div style={S.reviewLabel}>Total assets</div><div style={S.reviewVal}>—</div></div>
          <div><div style={S.reviewLabel}>Monthly debts</div><div style={S.reviewVal}>—</div></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
        <div style={S.consentRow}>
          <input type="checkbox" id="c1" style={{ marginTop: 3 }} />
          <label htmlFor="c1" style={S.consentLabel}>I certify the information provided is true, complete, and correct to the best of my knowledge.</label>
        </div>
        <div style={S.consentRow}>
          <input type="checkbox" id="c2" style={{ marginTop: 3 }} />
          <label htmlFor="c2" style={S.consentLabel}>I authorize the lender to verify the information and obtain credit reports as needed.</label>
        </div>
        <div style={S.consentRow}>
          <input type="checkbox" id="c3" style={{ marginTop: 3 }} />
          <label htmlFor="c3" style={S.consentLabel}>I have read and agree to the terms of service and privacy policy.</label>
        </div>
        <button style={S.submitBtn}>
          <Icon name="send" size={15} color="#fff" /> Submit application
        </button>
      </div>
    </>
  );
}

const PAGE_META = [
  { icon: 'user', bg: 'var(--brand-violet-soft)', color: 'var(--brand-violet)', title: 'Personal information', desc: "We've prefilled what we can from your prequalification. Just verify and complete any missing details." },
  { icon: 'briefcase', bg: 'var(--info-soft)', color: 'var(--info)', title: 'Employment & income', desc: 'Tell us about your current employment and income sources.' },
  { icon: 'home', bg: 'var(--success-soft)', color: 'var(--success)', title: 'Property details', desc: "Tell us about the property you're looking to purchase, or let us know if you're still searching." },
  { icon: 'wallet', bg: 'var(--warning-soft)', color: 'var(--warning)', title: 'Assets & liabilities', desc: 'List your major financial accounts and any outstanding debts.' },
  { icon: 'check', bg: 'var(--success-soft)', color: 'var(--success)', title: 'Review & submit', desc: 'Double-check everything before submitting. You can edit any section by clicking the edit link.' },
];

const STEP_CONTENT = [PersonalStep, EmploymentStep, PropertyStep, AssetsStep, ReviewStep];

export function ConsumerApplicationFlow({ onBack }) {
  const [cur, setCur] = useState(0);
  const pct = Math.round((cur / STEPS.length) * 100);
  const meta = PAGE_META[cur];
  const StepComponent = STEP_CONTENT[cur];

  const goTo = (i) => setCur(i);
  const next = () => { if (cur < STEPS.length - 1) setCur(cur + 1); };
  const prev = () => { if (cur > 0) setCur(cur - 1); else if (onBack) onBack(); };

  return (
    <div style={S.wrap}>
      <div style={S.inner}>

        {/* Top bar */}
        <div style={S.topBar}>
          <div style={S.topLeft}>
            <button style={S.backBtn} onClick={prev}><Icon name="chevronLeft" size={18} /></button>
            <span style={S.appTitle}>Loan application</span>
          </div>
          <div style={S.savePill}><Icon name="check" size={13} color="var(--success)" /> Auto-saved</div>
        </div>

        {/* Stepper */}
        <div style={S.stepper}>
          {STEPS.map((s, i) => (
            <div key={i} style={S.stItem} onClick={() => goTo(i)}>
              {i < STEPS.length - 1 && <div style={S.stLine(i < cur)} />}
              <div style={S.stNum(i < cur ? 'done' : i === cur ? 'active' : 'upcoming')}>
                {i < cur ? <Icon name="check" size={12} /> : i + 1}
              </div>
              <div style={S.stLabel(i === cur)}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={S.progressRow}>
          <div style={S.progressTrack}><div style={S.progressFill(pct)} /></div>
          <span style={S.progressPct}>{pct}%</span>
        </div>

        {/* Form card */}
        <div style={S.formCard}>
          <div style={S.sectionHead}>
            <div style={S.sectionIcon(meta.bg, meta.color)}>
              <Icon name={meta.icon} size={15} />
            </div>
            <span style={S.sectionTitle}>{meta.title}</span>
          </div>
          <p style={S.sectionDesc}>{meta.desc}</p>
          <StepComponent onGoTo={goTo} />
        </div>

        {/* Navigation */}
        <div style={S.actions}>
          <button className="btn btn-secondary" onClick={prev} style={{ visibility: cur === 0 && !onBack ? 'hidden' : 'visible' }}>
            <Icon name="chevronLeft" size={14} /> Back
          </button>
          {cur < STEPS.length - 1 && (
            <button className="btn btn-primary" onClick={next}>
              Continue <Icon name="chevronRight" size={14} color="#fff" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
