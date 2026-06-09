import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';

// ─── Section IDs (shared with LeftRail sub-nav so anchor scrolling works) ────
// Each ID is attached directly to its corresponding form card so clicking
// a sub-link in the LeftRail jumps straight to that subsection (no title
// banners in between).
export const URLA1003_SECTIONS = [
  { id: 'urla1003-1a', label: '1. Borrower Info' },
  { id: 'urla1003-2a', label: '2. Assets & Liabilities' },
  { id: 'urla1003-3',  label: '3. Real Estate Owned' },
  { id: 'urla1003-4a', label: '4. Loan & Property' },
  { id: 'urla1003-5',  label: '5. Declarations' },
];

// ─── Pre-filled URLA (1003) data keyed by loanId ──────────────────────────────
const LOAN_URLA_DATA = {
  'LN-2024-0234': {
    borrower:    { name: 'Sarah Anderson', ssn: '***-**-4521', dob: '03/14/1986', citizenship: 'U.S. Citizen', maritalStatus: 'Married', dependents: 2, dependentsAges: '8, 5', email: 'sarah.anderson@example.com', phoneHome: '(303) 555-0142', phoneCell: '(303) 555-0118' },
    coborrower:  { name: 'John Anderson',  ssn: '***-**-7733', dob: '11/02/1984', citizenship: 'U.S. Citizen', maritalStatus: 'Married', email: 'john.anderson@example.com', phoneCell: '(303) 555-0119' },
    currentAddress: { street: '422 Larkspur Way', city: 'Denver', state: 'CO', zip: '80206', yearsAtAddress: 4, housing: 'Own' },
    coborrowerAddress: { street: '422 Larkspur Way', city: 'Denver', state: 'CO', zip: '80206', yearsAtAddress: 4, housing: 'Own' },
    employment: { employer: 'Brightspoke Health', position: 'Director of Operations', startDate: '01/15/2018', yearsInLine: 9, monthlyIncome: 12500, selfEmployed: false },
    additionalIncome: { source: 'Bonus (annual avg)', monthlyAmt: 833 },
    coborrowerEmployment: { employer: 'Cascade Civil Engineering', position: 'Senior Civil Engineer', startDate: '06/03/2019', yearsInLine: 11, monthlyIncome: 9750, selfEmployed: false },
    coborrowerAdditionalIncome: { source: 'Consulting (avg)', monthlyAmt: 525 },
    assets: [
      { type: 'Checking', institution: 'First Republic', cashOrMarketValue: 18420 },
      { type: 'Savings',  institution: 'Ally Bank',      cashOrMarketValue: 62800 },
      { type: '401(k)',   institution: 'Fidelity',       cashOrMarketValue: 184300 },
      { type: 'Brokerage',institution: 'Schwab',         cashOrMarketValue: 41200 },
    ],
    liabilities: [
      { type: 'Credit Card', creditor: 'Chase Sapphire',  monthly: 250, balance: 4820 },
      { type: 'Auto Loan',   creditor: 'Toyota Financial',monthly: 412, balance: 18460 },
      { type: 'Student Loan',creditor: 'Nelnet',           monthly: 285, balance: 14730 },
    ],
    realEstate: [],
    loan: { amount: 425000, term: 30, type: 'Conventional', purpose: 'Purchase', amortization: 'Fixed', rate: 6.875, occupancy: 'Primary Residence' },
    property: { street: '1842 Oak Street', city: 'Denver', state: 'CO', zip: '80202', salePrice: 500000, propertyType: 'Single Family Detached', yearBuilt: 2003 },
    declarations:            { willOccupyAsPrimary: 'Yes', ownershipPriorThreeYears: 'No',  haveAnyOutstandingJudgments: 'No', delinquentOrInDefault: 'No', partyToLawsuit: 'No', conveyedTitleInLieu: 'No', preForeclosureOrShortSale: 'No', borrowedDownPayment: 'No', coSignerOnAnotherLoan: 'No', usCitizen: 'Yes', bankruptcyLast7Years: 'No' },
    coborrowerDeclarations:  { willOccupyAsPrimary: 'Yes', ownershipPriorThreeYears: 'Yes', haveAnyOutstandingJudgments: 'No', delinquentOrInDefault: 'No', partyToLawsuit: 'No', conveyedTitleInLieu: 'No', preForeclosureOrShortSale: 'No', borrowedDownPayment: 'No', coSignerOnAnotherLoan: 'No', usCitizen: 'Yes', bankruptcyLast7Years: 'No' },
    originator: { name: 'Alex Martinez', nmlsr: 'NMLS# 1234567', company: 'Xpanse Mortgage', companyNmlsr: 'NMLS# 9876543' },
  },
};
const DEFAULT_URLA = LOAN_URLA_DATA['LN-2024-0234'];

// Stand-in second-application borrower (used when user splits or adds App 2).
const SECOND_APP_TEMPLATE = {
  borrower:    { name: 'Dwight Schrute', ssn: '***-**-8810', dob: '01/20/1973', citizenship: 'U.S. Citizen', maritalStatus: 'Single', dependents: 0, dependentsAges: '—', email: 'dwight.schrute@dundermifflin.com', phoneHome: '(570) 555-0182', phoneCell: '(570) 555-0193' },
  coborrower:  null,
  currentAddress: { street: '1725 Schrute Farms Rd', city: 'Honesdale', state: 'PA', zip: '18431', yearsAtAddress: 12, housing: 'Own' },
  coborrowerAddress: null,
  employment: { employer: 'Dunder Mifflin Paper Co', position: 'Assistant Regional Manager', startDate: '03/15/2005', yearsInLine: 20, monthlyIncome: 6800, selfEmployed: false },
  additionalIncome: { source: 'Schrute Farms B&B', monthlyAmt: 1400 },
  coborrowerEmployment: null,
  coborrowerAdditionalIncome: null,
  declarations:           { willOccupyAsPrimary: 'Yes', ownershipPriorThreeYears: 'No', haveAnyOutstandingJudgments: 'No', delinquentOrInDefault: 'No', partyToLawsuit: 'No', conveyedTitleInLieu: 'No', preForeclosureOrShortSale: 'No', borrowedDownPayment: 'No', coSignerOnAnotherLoan: 'No', usCitizen: 'Yes', bankruptcyLast7Years: 'No' },
  coborrowerDeclarations: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtK = (n) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

function buildAppFromLoanData(ld) {
  return {
    borrower:                ld.borrower,
    coborrower:              ld.coborrower || null,
    currentAddress:          ld.currentAddress,
    coborrowerAddress:       ld.coborrowerAddress || null,
    employment:              ld.employment,
    additionalIncome:        ld.additionalIncome,
    coborrowerEmployment:    ld.coborrowerEmployment || null,
    coborrowerAdditionalIncome: ld.coborrowerAdditionalIncome || null,
    declarations:            ld.declarations,
    coborrowerDeclarations:  ld.coborrowerDeclarations || null,
  };
}

function appTabTitle(app) {
  if (app.coborrower) {
    const [bFirst, ...bRest] = app.borrower.name.split(' ');
    const [cFirst, ...cRest] = app.coborrower.name.split(' ');
    const bLast = bRest.join(' '), cLast = cRest.join(' ');
    if (bLast && bLast === cLast) return `${bFirst} & ${cFirst} ${bLast}`;
    return `${app.borrower.name} & ${app.coborrower.name}`;
  }
  return app.borrower.name;
}

// ─── Editable field ─────────────────────────────────────────────────────────
function URLAField({ label, value, prefix = '', suffix = '', readOnly = false, mono = false }) {
  const [focused, setFocused] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  React.useEffect(() => { setLocalVal(value); }, [value]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: focused ? 'var(--bg-surface)' : 'var(--bg-muted)',
        border: `1px solid ${focused ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 7, overflow: 'hidden',
        boxShadow: focused ? '0 0 0 2px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 0.12s, box-shadow 0.12s',
      }}>
        {prefix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{prefix}</span>}
        <input
          value={localVal ?? ''} readOnly={readOnly}
          onChange={e => setLocalVal(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, height: 32, border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontWeight: 400, fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
            color: 'var(--text-primary)', padding: '0 10px', cursor: readOnly ? 'default' : 'text', minWidth: 0,
          }}
        />
        {suffix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-tertiary)', borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SectionHead({ label, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? 'var(--text-primary)' : 'var(--bg-muted)',
      color: accent ? '#fff' : 'var(--text-primary)',
      padding: '8px 14px', borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      {sub && <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7 }}>{sub}</span>}
    </div>
  );
}

// ─── Borrower management menu ───────────────────────────────────────────────
function BorrowerMenu({
  app, appCount, isFirstApp,
  onAddCo, onRemoveCo,
  onAddSecondApp, onRemoveThisApp,
  onSplitToSeparate, onCombineIntoJoint,
}) {
  const hasCo = !!app.coborrower;
  return (
    <div role="menu" style={{
      position: 'absolute', top: 'calc(100% + 6px)', left: 0,
      width: 300, zIndex: 200,
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 10, boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.18))',
      padding: 6, fontSize: 13,
    }} onMouseDown={e => e.stopPropagation()}>
      <div style={{ padding: '6px 10px 4px', fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        This application
      </div>
      {hasCo
        ? <MenuItem icon="x"    label="Remove co-borrower" onClick={onRemoveCo} danger/>
        : <MenuItem icon="plus" label="Add co-borrower"    onClick={onAddCo}/>
      }
      {hasCo && (
        <MenuItem icon="arrowRight" label="Split into separate applications" desc="Moves the co-borrower into App 2"
          onClick={onSplitToSeparate}/>
      )}

      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 4px' }}/>

      <div style={{ padding: '6px 10px 4px', fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Linked applications
      </div>
      {appCount === 1
        ? <MenuItem icon="plus" label="Add second application" desc="Adds a linked 1003 for another borrower" onClick={onAddSecondApp}/>
        : <>
            {/* When 2 apps and second has no co-borrower (and first has none too?), allow combine */}
            {appCount === 2 && <MenuItem icon="arrowLeft" label="Combine into joint" desc="Moves the other app's borrower into this one as co-borrower" onClick={onCombineIntoJoint}/>}
            {!isFirstApp && <MenuItem icon="x" label="Remove this application" onClick={onRemoveThisApp} danger/>}
            {isFirstApp && appCount === 2 && (
              <div style={{ padding: '6px 10px', fontSize: 11.5, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Switch to App 2 to remove it.
              </div>
            )}
          </>
      }
    </div>
  );
}

function MenuItem({ icon, label, desc, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 9,
        width: '100%', padding: '8px 10px',
        border: 'none', background: 'transparent', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        color: danger ? 'var(--status-red)' : 'var(--text-primary)',
        textAlign: 'left', borderRadius: 6,
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'var(--card-red-bg)' : 'var(--bg-muted)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <Icon name={icon} size={13} color={danger ? 'var(--status-red)' : 'var(--text-secondary)'} strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }}/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span>{label}</span>
        {desc && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1, lineHeight: 1.35, fontWeight: 400 }}>{desc}</span>}
      </div>
    </button>
  );
}

// ─── Yes/No pills (declarations) ────────────────────────────────────────────
function YesNoPills({ value }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
      {['Yes', 'No'].map(opt => {
        const active = value === opt;
        return (
          <span key={opt} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 40, height: 26, padding: '0 10px', borderRadius: 6,
            fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em',
            background: active ? (opt === 'Yes' ? '#0F1014' : 'var(--status-amber-bg)') : 'var(--bg-muted)',
            color: active ? (opt === 'Yes' ? '#fff' : 'var(--status-amber)') : 'var(--text-tertiary)',
            border: active ? 'none' : '1px solid var(--border-subtle)',
          }}>{opt}</span>
        );
      })}
    </div>
  );
}

function YesNoRow({ label, value, coValue, showCoColumn }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: showCoColumn ? '1fr auto auto' : '1fr auto',
      alignItems: 'center', gap: 16,
      padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{label}</span>
      <YesNoPills value={value}/>
      {showCoColumn && <YesNoPills value={coValue}/>}
    </div>
  );
}

// ─── Section 1: Borrower Info ───────────────────────────────────────────────
function SectionBorrowerInfo({ app, onAddCo, onRemoveCo }) {
  const hasCo = !!app.coborrower;
  const b = app.borrower;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1a — Personal (anchor for "1. Borrower Info") */}
      <div id="urla1003-1a" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start', scrollMarginTop: 8 }}>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          <SectionHead label="1a · Personal Information" sub="Borrower"/>
          <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
            <URLAField label="Full Name"       value={b.name}/>
            <URLAField label="Social Security" value={b.ssn} mono/>
            <URLAField label="Date of Birth"   value={b.dob} mono/>
            <URLAField label="Citizenship"     value={b.citizenship}/>
            <URLAField label="Marital Status"  value={b.maritalStatus}/>
            <URLAField label="Dependents"      value={b.dependents != null ? `${b.dependents} (ages ${b.dependentsAges || '—'})` : '—'}/>
            {b.phoneHome && <URLAField label="Home Phone" value={b.phoneHome}/>}
            <URLAField label="Cell Phone"      value={b.phoneCell}/>
            <div style={{ gridColumn: '1 / -1' }}>
              <URLAField label="Email"         value={b.email}/>
            </div>
          </div>
        </div>

        {hasCo ? (
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              background: 'var(--bg-muted)', color: 'var(--text-primary)',
              padding: '8px 14px', borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>1a · Personal Information</span>
                <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7 }}>Co-Borrower</span>
              </div>
              <button onClick={onRemoveCo} title="Remove co-borrower"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', height: 24, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--card-red-bg)'; e.currentTarget.style.color = 'var(--status-red)'; e.currentTarget.style.borderColor = 'var(--card-red-border)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                <Icon name="x" size={11} strokeWidth={2.4}/> Remove
              </button>
            </div>
            <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
              <URLAField label="Full Name"       value={app.coborrower.name}/>
              <URLAField label="Social Security" value={app.coborrower.ssn} mono/>
              <URLAField label="Date of Birth"   value={app.coborrower.dob} mono/>
              <URLAField label="Citizenship"     value={app.coborrower.citizenship}/>
              <URLAField label="Marital Status"  value={app.coborrower.maritalStatus}/>
              {app.coborrower.phoneCell && <URLAField label="Cell Phone" value={app.coborrower.phoneCell}/>}
              <div style={{ gridColumn: '1 / -1' }}>
                <URLAField label="Email"         value={app.coborrower.email}/>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={onAddCo}
            style={{
              border: '1.5px dashed var(--border-default)', borderRadius: 10,
              background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              padding: '36px 18px', minHeight: 260,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: 'var(--text-tertiary)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={18} strokeWidth={2}/>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Add Co-Borrower</span>
            <span style={{ fontSize: 12, maxWidth: 220, textAlign: 'center', lineHeight: 1.45 }}>
              Adds a second applicant to this application.
            </span>
          </button>
        )}
      </div>

      {/* Current address (paired when co-borrower present) */}
      <div style={{ display: 'grid', gridTemplateColumns: hasCo ? '1fr 1fr' : '1fr', gap: 16, alignItems: 'flex-start' }}>
        <AddressCard sub="Borrower" address={app.currentAddress} narrow={hasCo}/>
        {hasCo && <AddressCard sub="Co-Borrower" address={app.coborrowerAddress || app.currentAddress} narrow/>}
      </div>

      {/* 1b — Employment (paired when co-borrower present) */}
      <div style={{ display: 'grid', gridTemplateColumns: hasCo ? '1fr 1fr' : '1fr', gap: 16, alignItems: 'flex-start' }}>
        <EmploymentCard sub="Borrower" employment={app.employment} additional={app.additionalIncome} narrow={hasCo}/>
        {hasCo && (
          <EmploymentCard sub="Co-Borrower" employment={app.coborrowerEmployment || app.employment} additional={app.coborrowerAdditionalIncome} narrow/>
        )}
      </div>
    </div>
  );
}

function AddressCard({ sub, address, narrow }) {
  if (!address) return null;
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label="Current Address" sub={sub}/>
      <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: narrow ? '2fr 1fr' : '2fr 1fr 1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
        {narrow ? (
          <>
            <div style={{ gridColumn: '1 / -1' }}><URLAField label="Street" value={address.street}/></div>
            <URLAField label="City"  value={address.city}/>
            <URLAField label="State / ZIP" value={`${address.state} ${address.zip}`} mono/>
            <URLAField label="Years at Address" value={`${address.yearsAtAddress} yrs`}/>
            <URLAField label="Housing" value={address.housing}/>
          </>
        ) : (
          <>
            <URLAField label="Street" value={address.street}/>
            <URLAField label="City"   value={address.city}/>
            <URLAField label="State"  value={address.state}/>
            <URLAField label="ZIP"    value={address.zip} mono/>
            <URLAField label="Years at Address" value={`${address.yearsAtAddress} yrs`}/>
            <URLAField label="Housing" value={address.housing}/>
          </>
        )}
      </div>
    </div>
  );
}

function EmploymentCard({ sub, employment, additional, narrow }) {
  if (!employment) return null;
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label="1b · Current Employment & Income" sub={sub}/>
      <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : '2fr 1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
        <div style={{ gridColumn: narrow ? '1 / -1' : 'auto' }}>
          <URLAField label="Employer" value={employment.employer}/>
        </div>
        <URLAField label="Position / Title" value={employment.position}/>
        <URLAField label="Start Date"       value={employment.startDate} mono/>
        <URLAField label="Years in Line of Work" value={`${employment.yearsInLine} yrs`}/>
        <URLAField label="Monthly Income"   value={fmtK(employment.monthlyIncome)} mono prefix="$"/>
        <URLAField label="Self-Employed"    value={employment.selfEmployed ? 'Yes' : 'No'}/>
      </div>
      {additional && (
        <div style={{ padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Income</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{additional.source}: <strong>{fmtK(additional.monthlyAmt)}/mo</strong></span>
        </div>
      )}
    </div>
  );
}

// ─── Section 2: Assets & Liabilities ────────────────────────────────────────
function SectionAssetsLiabilities({ ld }) {
  const totalAssets = ld.assets.reduce((s, a) => s + a.cashOrMarketValue, 0);
  const totalMonthlyLiab = ld.liabilities.reduce((s, l) => s + l.monthly, 0);
  const totalLiabBalance = ld.liabilities.reduce((s, l) => s + l.balance, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div id="urla1003-2a" style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden', scrollMarginTop: 8 }}>
        <SectionHead label="2a · Assets — Accounts" sub={`${ld.assets.length} accounts`}/>
        <div style={{ background: 'var(--bg-surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
            <span>Account Type</span><span>Institution</span><span style={{ textAlign: 'right' }}>Cash or Market Value</span>
          </div>
          {ld.assets.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-primary)' }}>{a.type}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{a.institution}</span>
              <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{fmtK(a.cashOrMarketValue)}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '2px solid var(--border-strong)', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 12 }}>Total Assets</span><span/>
            <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 800, fontSize: 14 }}>{fmtK(totalAssets)}</span>
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="2c · Liabilities" sub={`${ld.liabilities.length} accounts`}/>
        <div style={{ background: 'var(--bg-surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
            <span>Type</span><span>Creditor</span>
            <span style={{ textAlign: 'right' }}>Monthly Pmt</span>
            <span style={{ textAlign: 'right' }}>Unpaid Balance</span>
          </div>
          {ld.liabilities.map((l, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-primary)' }}>{l.type}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{l.creditor}</span>
              <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace' }}>{fmtK(l.monthly)}</span>
              <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{fmtK(l.balance)}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '2px solid var(--border-strong)', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 12 }}>Totals</span><span/>
            <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 800 }}>{fmtK(totalMonthlyLiab)}</span>
            <span style={{ textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 800, fontSize: 14 }}>{fmtK(totalLiabBalance)}</span>
          </div>
        </div>
      </div>

      <div id="urla1003-3" style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden', scrollMarginTop: 8 }}>
        <SectionHead label="3 · Real Estate Owned" sub="Other than subject property"/>
        <div style={{ padding: '24px 14px', background: 'var(--bg-surface)', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>No other properties reported.</div>
      </div>
    </div>
  );
}

// ─── Section 3: Loan & Property ─────────────────────────────────────────────
function SectionLoanProperty({ ld }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div id="urla1003-4a" style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden', scrollMarginTop: 8 }}>
        <SectionHead label="4a · Loan Information"/>
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 24px', background: 'var(--bg-surface)' }}>
          <URLAField label="Loan Amount"   value={fmtK(ld.loan.amount)} mono prefix="$"/>
          <URLAField label="Loan Purpose"  value={ld.loan.purpose}/>
          <URLAField label="Loan Type"     value={ld.loan.type}/>
          <URLAField label="Amortization"  value={ld.loan.amortization}/>
          <URLAField label="Loan Term"     value={`${ld.loan.term} yrs`}/>
          <URLAField label="Interest Rate" value={`${ld.loan.rate.toFixed(3)}%`} mono/>
          <URLAField label="Occupancy"     value={ld.loan.occupancy}/>
        </div>
      </div>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="4a · Subject Property"/>
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px 24px', background: 'var(--bg-surface)' }}>
          <URLAField label="Street Address" value={ld.property.street}/>
          <URLAField label="City"           value={ld.property.city}/>
          <URLAField label="State"          value={ld.property.state}/>
          <URLAField label="ZIP"            value={ld.property.zip} mono/>
          <URLAField label="Sale Price"     value={fmtK(ld.property.salePrice)} mono prefix="$"/>
          <URLAField label="Property Type"  value={ld.property.propertyType}/>
          <URLAField label="Year Built"     value={String(ld.property.yearBuilt)} mono/>
        </div>
      </div>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="4d · Gifts or Grants" sub="For this loan"/>
        <div style={{ padding: '24px 14px', background: 'var(--bg-surface)', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>No gifts or grants reported.</div>
      </div>
    </div>
  );
}

// ─── Section 4: Declarations & Signatures ───────────────────────────────────
function SectionDeclarations({ ld, app }) {
  const hasCo = !!app.coborrower;
  const d  = app.declarations || {};
  const cd = app.coborrowerDeclarations || {};
  const questions = [
    { key: 'willOccupyAsPrimary',         label: 'A. Will you occupy the property as your primary residence?' },
    { key: 'ownershipPriorThreeYears',    label: 'B. Have you had ownership interest in another property in the last three years?' },
    { key: 'haveAnyOutstandingJudgments', label: 'C. Are there any outstanding judgments against you?' },
    { key: 'delinquentOrInDefault',       label: 'D. Are you currently delinquent or in default on a Federal debt?' },
    { key: 'partyToLawsuit',              label: 'E. Are you a party to a lawsuit in which you potentially have any personal liability?' },
    { key: 'conveyedTitleInLieu',         label: 'F. Have you conveyed title to any property in lieu of foreclosure in the past 7 years?' },
    { key: 'preForeclosureOrShortSale',   label: 'G. Have you completed a pre-foreclosure sale or short sale in the past 7 years?' },
    { key: 'borrowedDownPayment',         label: 'H. Are you borrowing any money for this real estate transaction?' },
    { key: 'coSignerOnAnotherLoan',       label: 'I. Are you a co-signer or guarantor on any debt or loan that is not disclosed?' },
    { key: 'usCitizen',                   label: 'J. Are you a U.S. Citizen?' },
    { key: 'bankruptcyLast7Years',        label: 'K. Have you declared bankruptcy within the past 7 years?' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div id="urla1003-5" style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden', scrollMarginTop: 8 }}>
        <SectionHead label="5 · Declarations"
          sub={hasCo ? `${app.borrower.name.split(' ')[0]} & ${app.coborrower.name.split(' ')[0]}` : app.borrower.name}/>
        <div style={{ background: 'var(--bg-surface)' }}>
          {hasCo && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Question</span>
              <span style={{ minWidth: 88, textAlign: 'center' }}>Borrower</span>
              <span style={{ minWidth: 88, textAlign: 'center' }}>Co-Borrower</span>
            </div>
          )}
          {questions.map(q => (
            <YesNoRow key={q.key} label={q.label} value={d[q.key]} coValue={cd[q.key]} showCoColumn={hasCo}/>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="9 · Loan Originator Information"/>
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', background: 'var(--bg-surface)' }}>
          <URLAField label="Loan Originator"          value={ld.originator.name}/>
          <URLAField label="Loan Originator NMLSR ID" value={ld.originator.nmlsr} mono/>
          <URLAField label="Lender / Company"         value={ld.originator.company}/>
          <URLAField label="Company NMLSR ID"         value={ld.originator.companyNmlsr} mono/>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="6 · Acknowledgments & Agreements" sub="Signature lines"/>
        <div style={{ padding: '24px 14px', background: 'var(--bg-surface)', display: 'grid', gridTemplateColumns: hasCo ? '1fr 1fr' : '1fr', gap: '20px 24px' }}>
          {[
            { label: 'Borrower Signature', name: app.borrower.name },
            hasCo && { label: 'Co-Borrower Signature', name: app.coborrower.name },
          ].filter(Boolean).map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ height: 44, borderBottom: '1.5px dashed var(--border-default)', display: 'flex', alignItems: 'flex-end', paddingBottom: 4, fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Awaiting signature</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────
export function URLA1003View({ loanId = 'LN-2024-0234' }) {
  const ld = LOAN_URLA_DATA[loanId] || DEFAULT_URLA;
  const [apps, setApps] = React.useState(() => [buildAppFromLoanData(ld)]);
  const [activeApp, setActiveApp] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const current = apps[activeApp];

  const updateApp = (idx, patch) => {
    setApps(prev => prev.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };

  const handleAddCo = () => {
    // Reuse the loan's co-borrower data if available, otherwise a clean blank
    updateApp(activeApp, {
      coborrower:                ld.coborrower      || SECOND_APP_TEMPLATE.borrower,
      coborrowerAddress:         ld.coborrowerAddress || ld.currentAddress,
      coborrowerEmployment:      ld.coborrowerEmployment || ld.employment,
      coborrowerAdditionalIncome:ld.coborrowerAdditionalIncome || ld.additionalIncome,
      coborrowerDeclarations:    ld.coborrowerDeclarations || ld.declarations,
    });
    setMenuOpen(false);
  };
  const handleRemoveCo = () => {
    updateApp(activeApp, {
      coborrower: null, coborrowerAddress: null, coborrowerEmployment: null,
      coborrowerAdditionalIncome: null, coborrowerDeclarations: null,
    });
    setMenuOpen(false);
  };

  const handleAddSecondApp = () => {
    setApps(prev => [...prev, JSON.parse(JSON.stringify(SECOND_APP_TEMPLATE))]);
    setActiveApp(apps.length); // switch to the new tab
    setMenuOpen(false);
  };

  const handleRemoveThisApp = () => {
    if (apps.length <= 1) return;
    const idxToRemove = activeApp;
    setApps(prev => prev.filter((_, i) => i !== idxToRemove));
    setActiveApp(Math.max(0, idxToRemove - 1));
    setMenuOpen(false);
  };

  const handleSplitToSeparate = () => {
    // Move the active app's co-borrower into a new App 2
    if (!current.coborrower) return;
    const newApp2 = {
      borrower:                current.coborrower,
      coborrower:              null,
      currentAddress:          current.coborrowerAddress || current.currentAddress,
      coborrowerAddress:       null,
      employment:              current.coborrowerEmployment || current.employment,
      additionalIncome:        current.coborrowerAdditionalIncome || null,
      coborrowerEmployment:    null,
      coborrowerAdditionalIncome: null,
      declarations:            current.coborrowerDeclarations || current.declarations,
      coborrowerDeclarations:  null,
    };
    setApps(prev => {
      const next = prev.map((a, i) => i === activeApp
        ? { ...a, coborrower: null, coborrowerAddress: null, coborrowerEmployment: null, coborrowerAdditionalIncome: null, coborrowerDeclarations: null }
        : a);
      return [...next, newApp2];
    });
    setMenuOpen(false);
  };

  const handleCombineIntoJoint = () => {
    // Take the OTHER app's borrower and make it the current app's co-borrower
    if (apps.length < 2) return;
    const otherIdx = activeApp === 0 ? 1 : 0;
    const other = apps[otherIdx];
    setApps(prev => {
      const merged = prev.map((a, i) => i === activeApp ? {
        ...a,
        coborrower:                other.borrower,
        coborrowerAddress:         other.currentAddress,
        coborrowerEmployment:      other.employment,
        coborrowerAdditionalIncome:other.additionalIncome,
        coborrowerDeclarations:    other.declarations,
      } : a);
      return merged.filter((_, i) => i !== otherIdx);
    });
    // After collapse, only one app remains
    setActiveApp(0);
    setMenuOpen(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Doc header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 0 16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 22,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="doc" size={19} color="var(--text-secondary)" strokeWidth={1.6}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Uniform Residential Loan Application
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
            Form 1003 · {ld.property.street}, {ld.property.city} {ld.property.state}
          </div>
        </div>
        <StatusPill tone="blue">Draft</StatusPill>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm"><Icon name="download" size={13}/> Export PDF</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ minWidth: 80 }}>
            {saved ? <><Icon name="check" size={13}/> Saved</> : <><Icon name="doc" size={13}/> Save</>}
          </button>
        </div>
      </div>

      {/* Application tabs + borrower-management ellipsis (right of tabs) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--bg-muted)', padding: 4,
          borderRadius: 10,
        }}>
          {apps.map((app, i) => {
            const active = activeApp === i;
            return (
              <button key={i} onClick={() => setActiveApp(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '6px 14px', border: 'none', borderRadius: 7, cursor: 'pointer',
                background: active ? 'var(--bg-surface)' : 'transparent',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.12s', fontFamily: 'inherit',
                minWidth: 160, textAlign: 'left',
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                  {appTabTitle(app)}
                </span>
                <span style={{ fontSize: 11, color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)', marginTop: 1 }}>
                  Application {i + 1}
                </span>
              </button>
            );
          })}
        </div>
        {/* Borrower-management ellipsis */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            title="Manage borrowers" aria-label="Manage borrowers" aria-expanded={menuOpen}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              background: menuOpen ? 'var(--bg-muted)' : 'var(--bg-surface)',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'background 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = 'var(--bg-muted)'; }}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'var(--bg-surface)'; }}
          >
            <Icon name="moreV" size={15}/>
          </button>
          {menuOpen && (
            <BorrowerMenu
              app={current}
              appCount={apps.length}
              isFirstApp={activeApp === 0}
              onAddCo={handleAddCo}
              onRemoveCo={handleRemoveCo}
              onAddSecondApp={handleAddSecondApp}
              onRemoveThisApp={handleRemoveThisApp}
              onSplitToSeparate={handleSplitToSeparate}
              onCombineIntoJoint={handleCombineIntoJoint}
            />
          )}
        </div>
      </div>

      {/* Form sections — anchor IDs live on the inner cards (1a, 2a, 3, 4a, 5)
          so clicking a sub-link in the LeftRail jumps directly to that
          subsection without any intermediate header banners. */}
      <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <SectionBorrowerInfo app={current} onAddCo={handleAddCo} onRemoveCo={handleRemoveCo}/>
        <SectionAssetsLiabilities ld={ld}/>
        <SectionLoanProperty ld={ld}/>
        <SectionDeclarations ld={ld} app={current}/>
      </div>
    </div>
  );
}

export default URLA1003View;
