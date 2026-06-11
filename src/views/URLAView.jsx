import React from 'react';
import { Icon } from '../components/Icon';

// ─── AI pre-fill data ─────────────────────────────────────────────────────────
// Simulates data extracted from pre-app, credit pull, uploaded docs
const AI_PREFILL = {
  // Loan & Property
  loanPurpose: { value: 'Purchase', conf: 99, source: 'Application' },
  propertyAddress: { value: '2847 Westbrook Lane', conf: 97, source: 'Application' },
  propertyCity: { value: 'Austin', conf: 97, source: 'Application' },
  propertyState: { value: 'TX', conf: 97, source: 'Application' },
  propertyZip: { value: '78745', conf: 97, source: 'Application' },
  propertyType: { value: 'Single Family', conf: 95, source: 'Application' },
  propertyUse: { value: 'Primary Residence', conf: 99, source: 'Application' },
  loanAmount: { value: '450000', conf: 99, source: 'Application' },
  purchasePrice: { value: '495000', conf: 99, source: 'Application' },
  loanType: { value: 'Conventional', conf: 98, source: 'Application' },
  loanTerm: { value: '30', conf: 99, source: 'Application' },
  // Borrower
  firstName: { value: 'James', conf: 99, source: 'Application' },
  lastName: { value: 'Whitfield', conf: 99, source: 'Application' },
  ssn: { value: '***-**-4821', conf: 99, source: 'Credit pull' },
  dob: { value: '1985-03-14', conf: 99, source: 'Application' },
  maritalStatus: { value: 'Married', conf: 98, source: 'Application' },
  dependents: { value: '2', conf: 95, source: 'Application' },
  currentAddress: { value: '1104 Cedar Ridge Blvd', conf: 97, source: 'Application' },
  currentCity: { value: 'Austin', conf: 97, source: 'Application' },
  currentState: { value: 'TX', conf: 97, source: 'Application' },
  currentZip: { value: '78704', conf: 97, source: 'Application' },
  yearsAtAddress: { value: '4', conf: 90, source: 'Application' },
  housingStatus: { value: 'Rent', conf: 95, source: 'Application' },
  monthlyRent: { value: '2200', conf: 88, source: 'Application' },
  phone: { value: '(512) 408-9931', conf: 99, source: 'Application' },
  email: { value: 'james.whitfield@email.com', conf: 99, source: 'Application' },
  // Employment
  employerName: { value: 'Apex Technologies Inc.', conf: 96, source: 'VOE' },
  employerAddress: { value: '500 Congress Ave, Austin TX 78701', conf: 92, source: 'VOE' },
  position: { value: 'Senior Software Engineer', conf: 96, source: 'VOE' },
  employmentType: { value: 'W-2 Employee', conf: 99, source: 'VOE' },
  startDate: { value: '2019-06-10', conf: 95, source: 'VOE' },
  yearsEmployed: { value: '5.9', conf: 95, source: 'VOE' },
  baseSalary: { value: '135000', conf: 94, source: 'W-2 / VOE' },
  bonus: { value: '12000', conf: 82, source: 'W-2 (1yr only)', flag: 'Only 1 year of bonus history — may not qualify without 2-yr avg' },
  // Assets
  checkingBalance: { value: '28400', conf: 91, source: 'Bank statements' },
  savingsBalance: { value: '64200', conf: 91, source: 'Bank statements' },
  retirementBalance: { value: '187500', conf: 84, source: 'Application' },
  giftFunds: { value: '', conf: 0, source: '' },
  // Liabilities
  carLoan: { value: '425', conf: 88, source: 'Credit pull' },
  studentLoan: { value: '310', conf: 88, source: 'Credit pull' },
  creditCard: { value: '145', conf: 88, source: 'Credit pull' },
};

const SECTIONS = [
  { id: 'loan',        label: 'Loan & Property', icon: 'home' },
  { id: 'borrower',   label: 'Borrower Info',   icon: 'user' },
  { id: 'employment', label: 'Employment',       icon: 'briefcase' },
  { id: 'assets',     label: 'Assets & Debts',  icon: 'dollar' },
  { id: 'declarations', label: 'Declarations',  icon: 'listCheck' },
];

// ─── Small components ─────────────────────────────────────────────────────────
function AIBadge({ conf, source, flag }) {
  const color = flag ? 'var(--status-amber)' : conf >= 90 ? 'var(--status-green)' : 'var(--ai-primary)';
  const bg    = flag ? 'var(--card-amber-bg)' : conf >= 90 ? 'var(--card-green-bg)' : 'var(--ai-bg)';
  return (
    <span title={`Source: ${source}${flag ? ' · ' + flag : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 600, color, background: bg, padding: '1px 6px', borderRadius: 5, cursor: 'default', whiteSpace: 'nowrap' }}>
      <Icon name={flag ? 'alertCircle' : 'sparkle'} size={9} color={color} strokeWidth={1.5}/>
      {flag ? 'Review' : `${conf}%`}
    </span>
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

function Field({ label, name, type = 'text', prefill, value, onChange, required, options, hint }) {
  const hasPrefill = prefill && prefill.conf > 0;
  const isEdited = hasPrefill && value !== prefill.value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {toSentenceCase(label)}{required && <span style={{ color: 'var(--status-red)', marginLeft: 2 }}>*</span>}
        </label>
        {hasPrefill && !isEdited && <AIBadge conf={prefill.conf} source={prefill.source} flag={prefill.flag}/>}
        {isEdited && <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>edited</span>}
      </div>

      {options ? (
        <div style={{ position: 'relative' }}>
          <select
            value={value}
            onChange={e => onChange(name, e.target.value)}
            style={{ ...inputStyle(hasPrefill && !isEdited, prefill?.flag), paddingRight: 30, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
            <Icon name="chevronDown" size={13}/>
          </span>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={hasPrefill ? '' : '—'}
          style={inputStyle(hasPrefill && !isEdited, prefill?.flag)}
        />
      )}
      {hint && <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{hint}</div>}
      {prefill?.flag && <div style={{ fontSize: 11, color: 'var(--status-amber)', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="alertCircle" size={11} color="var(--status-amber)"/>{prefill.flag}</div>}
    </div>
  );
}

function inputStyle(aiPrefilled, flag) {
  return {
    height: 36, padding: '0 10px',
    border: `1px solid ${flag ? 'var(--status-amber)' : aiPrefilled ? 'var(--card-green-border)' : 'var(--border-default)'}`,
    borderRadius: 7, fontSize: 13.5, fontFamily: 'inherit',
    background: flag ? 'var(--card-amber-bg)' : aiPrefilled ? 'var(--card-green-bg)' : 'var(--bg-surface)',
    color: 'var(--text-primary)', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  };
}

function SectionHeader({ title, subtitle, aiCount, flagCount }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>
        {aiCount > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-green)', background: 'var(--card-green-bg)', padding: '2px 8px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="sparkle" size={9} color="var(--status-green)" strokeWidth={1.5}/>{aiCount} AI-filled
          </span>
        )}
        {flagCount > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-amber)', background: 'var(--card-amber-bg)', padding: '2px 8px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="alertCircle" size={9} color="var(--status-amber)"/>{flagCount} need review
          </span>
        )}
      </div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function Grid({ cols = 2, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px 16px', marginBottom: 20 }}>{children}</div>;
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
    </div>
  );
}

// ─── Summary rail ─────────────────────────────────────────────────────────────
function SummaryRail({ fields, sectionStatus }) {
  const loanAmt  = parseFloat((fields.loanAmount || '').replace(/[^0-9.]/g, '')) || 0;
  const purchase = parseFloat((fields.purchasePrice || '').replace(/[^0-9.]/g, '')) || 0;
  const ltv      = purchase > 0 ? Math.round((loanAmt / purchase) * 100) : 0;
  const base     = parseFloat((fields.baseSalary || '').replace(/[^0-9.]/g, '')) || 0;
  const monthlyIncome = base / 12;
  const monthlyDebts = [fields.carLoan, fields.studentLoan, fields.creditCard].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const estPITI  = loanAmt > 0 ? Math.round(loanAmt * 0.006) : 0;
  const totalDebt = monthlyDebts + estPITI;
  const dti      = monthlyIncome > 0 ? Math.round((totalDebt / monthlyIncome) * 100) : 0;
  const totalAssets = [fields.checkingBalance, fields.savingsBalance, fields.retirementBalance].reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const downPmt  = purchase - loanAmt;

  const ltvColor = ltv <= 80 ? 'var(--status-green)' : ltv <= 95 ? 'var(--status-amber)' : 'var(--status-red)';
  const dtiColor = dti <= 36 ? 'var(--status-green)' : dti <= 45 ? 'var(--status-amber)' : 'var(--status-red)';

  const completedSections = Object.values(sectionStatus).filter(s => s === 'complete').length;
  const pct = Math.round((completedSections / SECTIONS.length) * 100);

  return (
    <aside style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Completion */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>Completion</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-muted)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--status-green)' : 'var(--ai-primary)', borderRadius: 999, transition: 'width 0.3s' }}/>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SECTIONS.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sectionStatus[s.id] === 'complete' ? 'var(--status-green)' : sectionStatus[s.id] === 'review' ? 'var(--status-amber)' : 'var(--bg-muted)', border: sectionStatus[s.id] ? 'none' : '1.5px solid var(--border-default)' }}>
                {sectionStatus[s.id] === 'complete' && <Icon name="check" size={9} color="#fff" strokeWidth={2.8}/>}
                {sectionStatus[s.id] === 'review' && <Icon name="alertCircle" size={9} color="#fff" strokeWidth={2}/>}
              </div>
              <span style={{ fontSize: 12, color: sectionStatus[s.id] ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: sectionStatus[s.id] === 'complete' ? 600 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live metrics */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Live Metrics</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Metric label="Loan Amount" value={loanAmt ? '$' + loanAmt.toLocaleString() : '—'}/>
          <Metric label="Purchase Price" value={purchase ? '$' + purchase.toLocaleString() : '—'}/>
          <Metric label="Down Payment" value={downPmt > 0 ? '$' + downPmt.toLocaleString() : '—'}/>
          <Metric label="LTV" value={ltv ? ltv + '%' : '—'} color={ltv ? ltvColor : undefined}
            note={ltv > 80 ? 'PMI required' : ltv > 0 ? 'No PMI' : undefined}/>
          <div style={{ height: 1, background: 'var(--border-subtle)' }}/>
          <Metric label="Monthly Income" value={monthlyIncome ? '$' + Math.round(monthlyIncome).toLocaleString() : '—'}/>
          <Metric label="Est. PITI" value={estPITI ? '$' + estPITI.toLocaleString() : '—'}/>
          <Metric label="Other Debts" value={monthlyDebts ? '$' + monthlyDebts.toLocaleString() : '—'}/>
          <Metric label="DTI" value={dti ? dti + '%' : '—'} color={dti ? dtiColor : undefined}
            note={dti > 45 ? 'Exceeds limit' : dti > 36 ? 'Acceptable' : dti > 0 ? 'Excellent' : undefined}/>
          <div style={{ height: 1, background: 'var(--border-subtle)' }}/>
          <Metric label="Total Assets" value={totalAssets ? '$' + Math.round(totalAssets).toLocaleString() : '—'}/>
        </div>
      </div>

      {/* AI summary */}
      <div style={{ background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 12, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ai-ink)' }}>AI Assessment</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ai-ink)', lineHeight: 1.5 }}>
          {dti > 0 && ltv > 0
            ? dti <= 45 && ltv <= 95
              ? `Strong file. DTI ${dti}% and LTV ${ltv}% are within Conv guidelines. Recommend submitting to DU after declarations.`
              : `DTI at ${dti}% is ${dti > 45 ? 'above' : 'near'} the 45% max. Review bonus income qualification before AUS submission.`
            : 'Complete the form sections to see an AI assessment of this loan.'}
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value, color, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
        {note && <div style={{ fontSize: 10.5, color, marginTop: 1 }}>{note}</div>}
      </div>
    </div>
  );
}

// ─── Section panels ────────────────────────────────────────────────────────────
function LoanSection({ f, onChange }) {
  return (
    <>
      <SectionHeader title="Loan & Property Information" subtitle="Basic loan parameters and subject property details." aiCount={9} flagCount={0}/>
      <Divider label="Loan Details"/>
      <Grid cols={3}>
        <Field label="Loan Purpose" name="loanPurpose" options={['Purchase', 'Refinance – Rate/Term', 'Refinance – Cash-out', 'Construction']} prefill={AI_PREFILL.loanPurpose} value={f.loanPurpose} onChange={onChange} required/>
        <Field label="Loan Type" name="loanType" options={['Conventional', 'FHA', 'VA', 'USDA']} prefill={AI_PREFILL.loanType} value={f.loanType} onChange={onChange} required/>
        <Field label="Loan Term (yrs)" name="loanTerm" options={['30', '20', '15', '10']} prefill={AI_PREFILL.loanTerm} value={f.loanTerm} onChange={onChange} required/>
      </Grid>
      <Grid cols={2}>
        <Field label="Loan Amount" name="loanAmount" prefill={AI_PREFILL.loanAmount} value={f.loanAmount} onChange={onChange} required hint="Principal loan amount requested"/>
        <Field label="Purchase Price" name="purchasePrice" prefill={AI_PREFILL.purchasePrice} value={f.purchasePrice} onChange={onChange} required/>
      </Grid>
      <Divider label="Subject Property"/>
      <Grid cols={1}>
        <Field label="Street Address" name="propertyAddress" prefill={AI_PREFILL.propertyAddress} value={f.propertyAddress} onChange={onChange} required/>
      </Grid>
      <Grid cols={3}>
        <Field label="City" name="propertyCity" prefill={AI_PREFILL.propertyCity} value={f.propertyCity} onChange={onChange} required/>
        <Field label="State" name="propertyState" prefill={AI_PREFILL.propertyState} value={f.propertyState} onChange={onChange} required/>
        <Field label="ZIP" name="propertyZip" prefill={AI_PREFILL.propertyZip} value={f.propertyZip} onChange={onChange} required/>
      </Grid>
      <Grid cols={2}>
        <Field label="Property Type" name="propertyType" options={['Single Family', 'Condo', 'Townhouse', '2-4 Unit', 'Manufactured']} prefill={AI_PREFILL.propertyType} value={f.propertyType} onChange={onChange} required/>
        <Field label="Intended Use" name="propertyUse" options={['Primary Residence', 'Second Home', 'Investment']} prefill={AI_PREFILL.propertyUse} value={f.propertyUse} onChange={onChange} required/>
      </Grid>
    </>
  );
}

function BorrowerSection({ f, onChange }) {
  return (
    <>
      <SectionHeader title="Borrower Information" subtitle="Personal details as they appear on government-issued ID." aiCount={10} flagCount={0}/>
      <Divider label="Personal"/>
      <Grid cols={3}>
        <Field label="First Name" name="firstName" prefill={AI_PREFILL.firstName} value={f.firstName} onChange={onChange} required/>
        <Field label="Last Name" name="lastName" prefill={AI_PREFILL.lastName} value={f.lastName} onChange={onChange} required/>
        <Field label="Date of Birth" name="dob" type="date" prefill={AI_PREFILL.dob} value={f.dob} onChange={onChange} required/>
      </Grid>
      <Grid cols={3}>
        <Field label="Social Security #" name="ssn" prefill={AI_PREFILL.ssn} value={f.ssn} onChange={onChange} required hint="Pulled from credit"/>
        <Field label="Marital Status" name="maritalStatus" options={['Single', 'Married', 'Separated']} prefill={AI_PREFILL.maritalStatus} value={f.maritalStatus} onChange={onChange}/>
        <Field label="Dependents" name="dependents" prefill={AI_PREFILL.dependents} value={f.dependents} onChange={onChange}/>
      </Grid>
      <Grid cols={2}>
        <Field label="Phone" name="phone" prefill={AI_PREFILL.phone} value={f.phone} onChange={onChange} required/>
        <Field label="Email" name="email" type="email" prefill={AI_PREFILL.email} value={f.email} onChange={onChange} required/>
      </Grid>
      <Divider label="Current Address"/>
      <Grid cols={1}>
        <Field label="Street Address" name="currentAddress" prefill={AI_PREFILL.currentAddress} value={f.currentAddress} onChange={onChange} required/>
      </Grid>
      <Grid cols={3}>
        <Field label="City" name="currentCity" prefill={AI_PREFILL.currentCity} value={f.currentCity} onChange={onChange} required/>
        <Field label="State" name="currentState" prefill={AI_PREFILL.currentState} value={f.currentState} onChange={onChange} required/>
        <Field label="ZIP" name="currentZip" prefill={AI_PREFILL.currentZip} value={f.currentZip} onChange={onChange} required/>
      </Grid>
      <Grid cols={3}>
        <Field label="Years at Address" name="yearsAtAddress" prefill={AI_PREFILL.yearsAtAddress} value={f.yearsAtAddress} onChange={onChange}/>
        <Field label="Housing Status" name="housingStatus" options={['Rent', 'Own', 'Living with Family', 'Other']} prefill={AI_PREFILL.housingStatus} value={f.housingStatus} onChange={onChange}/>
        <Field label="Monthly Rent/Mortgage" name="monthlyRent" prefill={AI_PREFILL.monthlyRent} value={f.monthlyRent} onChange={onChange}/>
      </Grid>
    </>
  );
}

function EmploymentSection({ f, onChange }) {
  return (
    <>
      <SectionHeader title="Employment & Income" subtitle="Current employer and income sources. All figures are annual." aiCount={6} flagCount={1}/>
      <Divider label="Current Employer"/>
      <Grid cols={2}>
        <Field label="Employer Name" name="employerName" prefill={AI_PREFILL.employerName} value={f.employerName} onChange={onChange} required/>
        <Field label="Employment Type" name="employmentType" options={['W-2 Employee', 'Self-Employed', '1099 Contractor', 'Retired']} prefill={AI_PREFILL.employmentType} value={f.employmentType} onChange={onChange}/>
      </Grid>
      <Grid cols={1}>
        <Field label="Employer Address" name="employerAddress" prefill={AI_PREFILL.employerAddress} value={f.employerAddress} onChange={onChange}/>
      </Grid>
      <Grid cols={3}>
        <Field label="Position / Title" name="position" prefill={AI_PREFILL.position} value={f.position} onChange={onChange}/>
        <Field label="Start Date" name="startDate" type="date" prefill={AI_PREFILL.startDate} value={f.startDate} onChange={onChange}/>
        <Field label="Years Employed" name="yearsEmployed" prefill={AI_PREFILL.yearsEmployed} value={f.yearsEmployed} onChange={onChange}/>
      </Grid>
      <Divider label="Income (Annual)"/>
      <Grid cols={2}>
        <Field label="Base Salary" name="baseSalary" prefill={AI_PREFILL.baseSalary} value={f.baseSalary} onChange={onChange} required hint="From W-2 Box 1 or VOE"/>
        <Field label="Bonus / Overtime" name="bonus" prefill={AI_PREFILL.bonus} value={f.bonus} onChange={onChange} hint="2-year average required"/>
      </Grid>
      <Grid cols={2}>
        <Field label="Commission" name="commission" value={f.commission || ''} onChange={onChange}/>
        <Field label="Other Income" name="otherIncome" value={f.otherIncome || ''} onChange={onChange} hint="Rental, alimony, etc."/>
      </Grid>
    </>
  );
}

function AssetsSection({ f, onChange }) {
  return (
    <>
      <SectionHeader title="Assets & Liabilities" subtitle="Accounts used for down payment, closing costs, and reserves." aiCount={4} flagCount={0}/>
      <Divider label="Assets"/>
      <Grid cols={2}>
        <Field label="Checking Account Balance" name="checkingBalance" prefill={AI_PREFILL.checkingBalance} value={f.checkingBalance} onChange={onChange} hint="From 2-month bank statements"/>
        <Field label="Savings Account Balance" name="savingsBalance" prefill={AI_PREFILL.savingsBalance} value={f.savingsBalance} onChange={onChange}/>
      </Grid>
      <Grid cols={2}>
        <Field label="Retirement / 401(k)" name="retirementBalance" prefill={AI_PREFILL.retirementBalance} value={f.retirementBalance} onChange={onChange} hint="Use 60% for qualifying"/>
        <Field label="Gift Funds" name="giftFunds" prefill={AI_PREFILL.giftFunds} value={f.giftFunds || ''} onChange={onChange} hint="Requires gift letter"/>
      </Grid>
      <Divider label="Monthly Liabilities (from credit report)"/>
      <Grid cols={3}>
        <Field label="Auto Loan Payment" name="carLoan" prefill={AI_PREFILL.carLoan} value={f.carLoan} onChange={onChange} hint="Min monthly payment"/>
        <Field label="Student Loan Payment" name="studentLoan" prefill={AI_PREFILL.studentLoan} value={f.studentLoan} onChange={onChange}/>
        <Field label="Credit Card Min. Payment" name="creditCard" prefill={AI_PREFILL.creditCard} value={f.creditCard} onChange={onChange}/>
      </Grid>
      <Grid cols={2}>
        <Field label="Other Monthly Debts" name="otherDebts" value={f.otherDebts || ''} onChange={onChange}/>
        <Field label="Child Support / Alimony" name="childSupport" value={f.childSupport || ''} onChange={onChange}/>
      </Grid>
    </>
  );
}

function DeclarationsSection({ f, onChange }) {
  const declarations = [
    { id: 'outstanding_judgments', label: 'Are there any outstanding judgments against you?' },
    { id: 'bankrupt', label: 'Have you declared bankruptcy in the past 7 years?' },
    { id: 'foreclosure', label: 'Have you had property foreclosed upon in the past 7 years?' },
    { id: 'lawsuit', label: 'Are you currently a party to a lawsuit?' },
    { id: 'federal_debt', label: 'Have you directly or indirectly been obligated on any federal debt that is delinquent?' },
    { id: 'alimony', label: 'Are you obligated to pay alimony, child support, or separate maintenance?' },
    { id: 'down_payment_borrowed', label: 'Is any part of the down payment borrowed?' },
    { id: 'co_maker', label: 'Are you a co-maker or endorser on a note?' },
    { id: 'us_citizen', label: 'Are you a U.S. citizen or permanent resident alien?' },
    { id: 'primary_residence', label: 'Do you intend to occupy the property as your primary residence?' },
  ];

  return (
    <>
      <SectionHeader title="Declarations" subtitle="Required disclosures per Regulation B and RESPA. Answer yes or no to each." aiCount={0} flagCount={0}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {declarations.map((d, i) => (
          <label key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 14px', background: i % 2 === 0 ? 'transparent' : 'var(--bg-muted)', borderRadius: 8, cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 14, marginTop: 1, flexShrink: 0 }}>
              {['Yes', 'No'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                  <input
                    type="radio"
                    name={d.id}
                    value={opt}
                    checked={f[d.id] === opt}
                    onChange={() => onChange(d.id, opt)}
                    style={{ accentColor: 'var(--ai-primary)', width: 15, height: 15 }}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-primary)', paddingTop: 1 }}>{d.label}</span>
          </label>
        ))}
      </div>
      <div style={{ marginTop: 20, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 10, padding: '12px 14px', fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
        <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }}/>
        <span>I've pre-checked the credit report against these declarations. No judgments, bankruptcies, or foreclosures found. Verify "Primary Residence" intent manually before signing.</span>
      </div>
    </>
  );
}

// ─── Main view ─────────────────────────────────────────────────────────────────
export function URLAView({ borrowerName = 'James Whitfield', loanId, onClose, onSubmit, embedded = false }) {
  const [activeSection, setActiveSection] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  // Seed all fields from AI prefill
  const [fields, setFields] = React.useState(() => {
    const init = {};
    Object.entries(AI_PREFILL).forEach(([k, v]) => { init[k] = v.value; });
    return init;
  });

  const onChange = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  const sectionStatus = React.useMemo(() => {
    const status = {};
    // Loan section — check required fields
    status.loan = (fields.loanPurpose && fields.loanAmount && fields.purchasePrice && fields.propertyAddress) ? 'complete' : '';
    status.borrower = (fields.firstName && fields.lastName && fields.ssn && fields.email) ? 'complete' : '';
    status.employment = fields.baseSalary ? (AI_PREFILL.bonus?.flag ? 'review' : 'complete') : '';
    status.assets = (fields.checkingBalance || fields.savingsBalance) ? 'complete' : '';
    status.declarations = '';
    return status;
  }, [fields]);

  const section = SECTIONS[activeSection];
  const isFirst = activeSection === 0;
  const isLast  = activeSection === SECTIONS.length - 1;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { if (onSubmit) onSubmit(); }, 2000);
  };

  if (submitted) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="checkCircle" size={28} strokeWidth={1.7}/>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>URLA submitted to DU</div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, textAlign: 'center', lineHeight: 1.5 }}>
          {borrowerName}'s 1003 has been sent to Fannie Mae Desktop Underwriter. AUS findings typically return in 60–90 seconds.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Header — hidden when embedded in floating window */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '14px 32px', display: embedded ? 'none' : 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
          <Icon name="arrowLeft" size={14} strokeWidth={2}/> Back
        </button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Uniform Residential Loan Application (1003)</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            {loanId && <span style={{ fontFamily: 'DM Mono', fontSize: 11, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 6px' }}>{loanId}</span>}
            <span>{borrowerName} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--status-green)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
          <Icon name="sparkle" size={13} color="var(--status-green)" strokeWidth={1.5}/>
          {Object.values(AI_PREFILL).filter(v => v.conf > 0).length} fields AI-prefilled
        </span>
        <button className="btn btn-outline btn-sm">Save Draft</button>
      </div>

      {/* Step tabs */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '0 32px', display: 'flex', gap: 0 }}>
        {SECTIONS.map((s, i) => {
          const active = i === activeSection;
          const status = sectionStatus[s.id];
          return (
            <button key={s.id} onClick={() => setActiveSection(i)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 44, padding: '0 18px',
              border: 'none', borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500,
              transition: 'color 0.12s',
            }}>
              {status === 'complete' && <span style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={9} color="#fff" strokeWidth={2.8}/></span>}
              {status === 'review' && <span style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--status-amber)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="alertCircle" size={9} color="#fff"/></span>}
              {!status && <span style={{ width: 16, height: 16, borderRadius: 999, border: '1.5px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-tertiary)' }}>{i + 1}</span>}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', gap: 0, minHeight: 0, overflowY: 'auto' }}>
        {/* Form */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', minWidth: 0 }}>
          {section.id === 'loan'         && <LoanSection       f={fields} onChange={onChange}/>}
          {section.id === 'borrower'     && <BorrowerSection   f={fields} onChange={onChange}/>}
          {section.id === 'employment'   && <EmploymentSection f={fields} onChange={onChange}/>}
          {section.id === 'assets'       && <AssetsSection     f={fields} onChange={onChange}/>}
          {section.id === 'declarations' && <DeclarationsSection f={fields} onChange={onChange}/>}

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
            {!isFirst && (
              <button className="btn btn-outline" onClick={() => setActiveSection(i => i - 1)}>
                <Icon name="arrowLeft" size={14} strokeWidth={2}/> Previous
              </button>
            )}
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Section {activeSection + 1} of {SECTIONS.length}</span>
            {!isLast ? (
              <button className="btn btn-primary" onClick={() => setActiveSection(i => i + 1)}>
                Next: {SECTIONS[activeSection + 1].label} <Icon name="arrowRight" size={14} strokeWidth={2}/>
              </button>
            ) : (
              <button className="btn btn-ai" style={{ padding: '0 24px' }} onClick={handleSubmit}>
                <Icon name="send" size={14}/> Submit to AUS (DU)
              </button>
            )}
          </div>
        </div>

        {/* Summary rail */}
        <div style={{ width: 280, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', padding: '20px 20px', overflowY: 'auto', background: 'var(--bg-muted)' }}>
          <SummaryRail fields={fields} sectionStatus={sectionStatus}/>
        </div>
      </div>
    </div>
  );
}

export default URLAView;
