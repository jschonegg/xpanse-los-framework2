import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill, PageHeader } from '../components/Shell';
import { LOANS } from '../data/loans';

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
    coborrower:  { name: 'John Anderson',  ssn: '***-**-7733', dob: '11/02/1984', citizenship: 'U.S. Citizen', maritalStatus: 'Married', dependents: 2, dependentsAges: '8, 5', email: 'john.anderson@example.com', phoneHome: '(303) 555-0142', phoneCell: '(303) 555-0119' },
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

// Parse a loan's free-form property string into URLA street/city/state/zip parts.
// Tolerates missing pieces; falls back to placeholders.
function parsePropertyAddress(propStr) {
  if (!propStr) return { street: '— TBD —', city: '', state: '', zip: '' };
  // Match: "<street>, <city> <ST>[ <zip>]"
  const m = propStr.match(/^(.+?),\s*(.+?)\s+([A-Z]{2})(?:\s+(\d{5}))?$/);
  if (!m) return { street: propStr, city: '', state: '', zip: '' };
  return { street: m[1].trim(), city: m[2].trim(), state: m[3], zip: m[4] || '' };
}

// Map a loan's product label into URLA loan-type / amortization fields.
function deriveLoanTerms(loan) {
  const product = loan.product || 'Conv 30yr';
  let type = 'Conventional';
  if (/FHA/i.test(product))   type = 'FHA';
  else if (/VA/i.test(product))    type = 'VA';
  else if (/USDA/i.test(product))  type = 'USDA-RD';
  else if (/Jumbo/i.test(product)) type = 'Conventional (Jumbo)';
  const termMatch = product.match(/(\d+)\s*yr/i);
  const term = termMatch ? Number(termMatch[1]) : 30;
  return { type, term, amortization: 'Fixed' };
}

// Build a complete URLA shape from a loan record, using realistic placeholder
// values for PII/financial fields the loan record doesn't track (SSN, DOB,
// employment, assets, liabilities). The borrower name, co-borrower (if any),
// property, and loan terms always reflect the loan record so the form stays
// in sync with the rest of the app.
function buildURLAFromLoan(loan) {
  if (!loan) return DEFAULT_URLA;
  const propParts = parsePropertyAddress(loan.property);
  const terms = deriveLoanTerms(loan);
  const sameAddr = !!loan.coborrower;
  return {
    borrower: {
      name: loan.borrower,
      ssn: '***-**-0000', dob: '01/01/1985', citizenship: 'U.S. Citizen',
      maritalStatus: loan.coborrower ? 'Married' : 'Single',
      dependents: 0, dependentsAges: '—',
      email: '— TBD —', phoneHome: '— TBD —', phoneCell: '— TBD —',
    },
    coborrower: loan.coborrower ? {
      name: loan.coborrower.name,
      ssn: '***-**-0000', dob: '01/01/1985', citizenship: 'U.S. Citizen',
      maritalStatus: 'Married',
      dependents: 0, dependentsAges: '—',
      email: '— TBD —', phoneHome: '— TBD —', phoneCell: '— TBD —',
    } : null,
    currentAddress: {
      street: propParts.street || '— TBD —',
      city: propParts.city || '— TBD —',
      state: propParts.state || '—',
      zip: propParts.zip || '—',
      yearsAtAddress: 3, housing: 'Rent',
    },
    coborrowerAddress: sameAddr ? {
      street: propParts.street || '— TBD —',
      city: propParts.city || '— TBD —',
      state: propParts.state || '—',
      zip: propParts.zip || '—',
      yearsAtAddress: 3, housing: 'Rent',
    } : null,
    employment: { employer: '— TBD —', position: '— TBD —', startDate: '—', yearsInLine: 0, monthlyIncome: 0, selfEmployed: false },
    additionalIncome: { source: '—', monthlyAmt: 0 },
    coborrowerEmployment: loan.coborrower
      ? { employer: '— TBD —', position: '— TBD —', startDate: '—', yearsInLine: 0, monthlyIncome: 0, selfEmployed: false }
      : null,
    coborrowerAdditionalIncome: loan.coborrower ? { source: '—', monthlyAmt: 0 } : null,
    assets: [],
    liabilities: [],
    realEstate: [],
    loan: {
      amount: loan.amount || 0,
      term: terms.term,
      type: terms.type,
      purpose: loan.loanPurpose || 'Purchase',
      amortization: terms.amortization,
      rate: loan.rate || 0,
      occupancy: 'Primary Residence',
    },
    property: {
      street: propParts.street || '— TBD —',
      city: propParts.city || '— TBD —',
      state: propParts.state || '—',
      zip: propParts.zip || '—',
      salePrice: loan.amount && loan.ltv ? Math.round(loan.amount / (loan.ltv / 100)) : 0,
      propertyType: 'Single Family Detached',
      yearBuilt: null,
    },
    declarations: {
      willOccupyAsPrimary: 'Yes', ownershipPriorThreeYears: 'No', haveAnyOutstandingJudgments: 'No',
      delinquentOrInDefault: 'No', partyToLawsuit: 'No', conveyedTitleInLieu: 'No',
      preForeclosureOrShortSale: 'No', borrowedDownPayment: 'No', coSignerOnAnotherLoan: 'No',
      usCitizen: 'Yes', bankruptcyLast7Years: 'No',
    },
    coborrowerDeclarations: loan.coborrower ? {
      willOccupyAsPrimary: 'Yes', ownershipPriorThreeYears: 'No', haveAnyOutstandingJudgments: 'No',
      delinquentOrInDefault: 'No', partyToLawsuit: 'No', conveyedTitleInLieu: 'No',
      preForeclosureOrShortSale: 'No', borrowedDownPayment: 'No', coSignerOnAnotherLoan: 'No',
      usCitizen: 'Yes', bankruptcyLast7Years: 'No',
    } : null,
    originator: { name: loan.assignee || 'Alex Martinez', nmlsr: 'NMLS# 1234567', company: 'Xpanse Mortgage', companyNmlsr: 'NMLS# 9876543' },
  };
}

// Stand-in second-application borrower (used when user splits or adds App 2).
const SECOND_APP_TEMPLATE = {
  borrower:    { name: 'Dwight Schrute', ssn: '***-**-8810', dob: '01/20/1973', citizenship: 'U.S. Citizen', maritalStatus: 'Single', dependents: 0, dependentsAges: '—', email: 'dwight.schrute@dundermifflin.com', phoneHome: '(570) 555-0182', phoneCell: '(570) 555-0193' },
  coborrower:  null,
  currentAddress: { street: '1725 Schrute Farms Rd', city: 'Honesdale', state: 'PA', zip: '18431', yearsAtAddress: 12, housing: 'Own' },
  coborrowerAddress: null,
  coborrowerSameAddress: true,
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
    // Default to "same as primary" — true for typical joint apps (married
    // couples cohabiting). User can uncheck if co-borrower lives elsewhere.
    coborrowerSameAddress:   true,
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

// ─── Editable field ─────────────────────────────────────────────────────────
// `onCommit(nextValue)` fires on blur when the value changed — used by the
// linked Borrower Summary tab to push edits back to shared app state.
// When `options` is passed, renders a select; commits immediately on change.
function URLAField({ label, hint, value, prefix = '', suffix = '', readOnly = false, mono = false, options, onCommit }) {
  const [focused, setFocused] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  React.useEffect(() => { setLocalVal(value); }, [value]);
  const handleBlur = () => {
    setFocused(false);
    if (onCommit && localVal !== value) onCommit(localVal);
  };
  const isSelect = Array.isArray(options);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{toSentenceCase(label)}</label>
        {hint && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{hint}</span>}
      </div>
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 0,
        background: focused ? 'var(--bg-surface)' : 'var(--bg-muted)',
        border: `1px solid ${focused ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 7, overflow: 'hidden',
        boxShadow: focused ? '0 0 0 2px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 0.12s, box-shadow 0.12s',
      }}>
        {prefix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{prefix}</span>}
        {isSelect ? (
          <>
            <select
              value={localVal ?? ''} disabled={readOnly}
              onChange={e => { setLocalVal(e.target.value); onCommit && onCommit(e.target.value); }}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{
                flex: 1, height: 32, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 400, fontFamily: 'inherit',
                color: 'var(--text-primary)', padding: '0 28px 0 10px', cursor: readOnly ? 'default' : 'pointer', minWidth: 0,
                appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
              }}
            >
              {options.map(opt => <option key={opt} value={opt}>{opt || '—'}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' }}>
              <Icon name="chevronDown" size={12}/>
            </span>
          </>
        ) : (
          <input
            value={localVal ?? ''} readOnly={readOnly}
            onChange={e => setLocalVal(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={handleBlur}
            style={{
              flex: 1, height: 32, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, fontWeight: 400, fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
              color: 'var(--text-primary)', padding: '0 10px', cursor: readOnly ? 'default' : 'text', minWidth: 0,
            }}
          />
        )}
        {suffix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-tertiary)', borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{suffix}</span>}
      </div>
    </div>
  );
}

const NAME_SUFFIXES = ['', 'Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
const MARITAL_STATUSES = ['Single', 'Married', 'Separated', 'Divorced', 'Widowed', 'Domestic Partnership'];
const US_STATES = [
  '', 'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO',
  'MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

// Compute integer years between a date string and today. Accepts MM/DD/YYYY,
// YYYY-MM-DD, or any string Date can parse. Returns null when unparseable.
function calcAge(dobStr) {
  if (!dobStr || typeof dobStr !== 'string') return null;
  let d = null;
  const mdy = dobStr.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}|\d{4})$/);
  if (mdy) {
    let [, mm, dd, yy] = mdy;
    if (yy.length === 2) yy = (parseInt(yy, 10) > 30 ? '19' : '20') + yy;
    d = new Date(parseInt(yy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  } else {
    const parsed = new Date(dobStr);
    if (!isNaN(parsed.getTime())) d = parsed;
  }
  if (!d || isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  if (age < 0 || age > 130) return null;
  return age;
}

// Parse a full name string into first/middle/last/suffix parts. Treats a
// trailing token matching NAME_SUFFIXES as the suffix; everything between
// first and last becomes the middle name (so "James M O'Connor" yields
// firstName: "James", middleName: "M", lastName: "O'Connor").
function splitName(name) {
  if (!name || typeof name !== 'string') return { firstName: '', middleName: '', lastName: '', suffix: '' };
  const parts = name.trim().split(/\s+/);
  let suffix = '';
  if (parts.length >= 2 && NAME_SUFFIXES.includes(parts[parts.length - 1])) suffix = parts.pop();
  if (parts.length === 0) return { firstName: '', middleName: '', lastName: '', suffix };
  if (parts.length === 1) return { firstName: parts[0], middleName: '', lastName: '', suffix };
  if (parts.length === 2) return { firstName: parts[0], middleName: '', lastName: parts[1], suffix };
  return { firstName: parts[0], middleName: parts.slice(1, -1).join(' '), lastName: parts[parts.length - 1], suffix };
}

function joinName({ firstName, middleName, lastName, suffix }) {
  return [firstName, middleName, lastName, suffix].filter(s => s && String(s).trim()).join(' ');
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
// Same exact field set for both borrowers so the two 1a cards line up.
// `onChange(field, value)` (optional) — fires when a field is edited.
function PersonalInfoFields({ person, onChange }) {
  const commit = (field) => onChange ? (v) => onChange(field, v) : undefined;
  const nameParts = splitName(person.name || '');
  const commitName = (key) => (v) => onChange && onChange('name', joinName({ ...nameParts, [key]: v }));
  return (
    <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
      <URLAField label="First Name"      value={nameParts.firstName}   onCommit={commitName('firstName')}/>
      <URLAField label="Middle Name"     value={nameParts.middleName}  onCommit={commitName('middleName')}/>
      <URLAField label="Last Name"       value={nameParts.lastName}    onCommit={commitName('lastName')}/>
      <URLAField label="Suffix"          value={nameParts.suffix} options={NAME_SUFFIXES} onCommit={commitName('suffix')}/>
      <URLAField label="Social Security" value={person.ssn} mono       onCommit={commit('ssn')}/>
      <URLAField label="Date of Birth"   value={person.dob} mono       onCommit={commit('dob')}
        hint={calcAge(person.dob) != null ? `Age ${calcAge(person.dob)}` : null}/>
      <URLAField label="Citizenship"     value={person.citizenship}    onCommit={commit('citizenship')}/>
      <URLAField label="Marital Status"  value={person.maritalStatus} options={MARITAL_STATUSES} onCommit={commit('maritalStatus')}/>
      <URLAField label="# of Dependents" value={person.dependents != null ? String(person.dependents) : ''}
        onCommit={onChange ? (v) => onChange('dependents', v === '' ? null : parseInt(v, 10) || 0) : undefined}/>
      <URLAField label="Dependent Ages"  value={person.dependentsAges || ''} onCommit={commit('dependentsAges')} hint="Comma-separated"/>
      <URLAField label="Home Phone"      value={person.phoneHome || '—'} onCommit={commit('phoneHome')}/>
      <URLAField label="Cell Phone"      value={person.phoneCell || '—'} onCommit={commit('phoneCell')}/>
      <div style={{ gridColumn: '1 / -1' }}>
        <URLAField label="Email"         value={person.email}            onCommit={commit('email')}/>
      </div>
    </div>
  );
}

export function SectionBorrowerInfo({ app, onAddCo, onRemoveCo, onUpdateApp }) {
  const hasCo = !!app.coborrower;
  const b = app.borrower;
  // Build nested-object field-change handlers that delegate to onUpdateApp.
  const mkSubChange = (key) => (field, value) =>
    onUpdateApp && onUpdateApp({ [key]: { ...(app[key] || {}), [field]: value } });
  const onBorrowerChange   = mkSubChange('borrower');
  const onCoborrowerChange = mkSubChange('coborrower');
  const onAddressChange    = mkSubChange('currentAddress');
  const onCoAddressChange  = mkSubChange('coborrowerAddress');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1a — Personal (anchor for "1. Borrower Info") */}
      <div id="urla1003-1a" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start', scrollMarginTop: 8 }}>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          <SectionHead label="1a · Personal Information" sub="Borrower"/>
          <PersonalInfoFields person={app.borrower} onChange={onBorrowerChange}/>
        </div>

        {hasCo ? (
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
            <SectionHead label="1a · Personal Information" sub="Co-Borrower"/>
            <PersonalInfoFields person={app.coborrower} onChange={onCoborrowerChange}/>
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
        <AddressCard sub="Borrower" address={app.currentAddress} narrow={hasCo} onChange={onAddressChange}/>
        {hasCo && (
          <AddressCard
            sub="Co-Borrower"
            address={app.coborrowerSameAddress ? app.currentAddress : (app.coborrowerAddress || app.currentAddress)}
            narrow
            sameAsPrimary={!!app.coborrowerSameAddress}
            onToggleSameAsPrimary={() => onUpdateApp && onUpdateApp({ coborrowerSameAddress: !app.coborrowerSameAddress })}
            primaryBorrowerName={app.borrower.name}
            onChange={app.coborrowerSameAddress ? onAddressChange : onCoAddressChange}
          />
        )}
      </div>

      {/* 1b — Employment & Income (unified table for both borrowers) */}
      <IncomeTable app={app} onUpdateApp={onUpdateApp}/>
    </div>
  );
}

function AddressCard({ sub, address, narrow, sameAsPrimary, onToggleSameAsPrimary, primaryBorrowerName, onChange }) {
  const commit = (field) => onChange ? (v) => onChange(field, v) : undefined;
  if (!address) return null;
  const canToggle = typeof onToggleSameAsPrimary === 'function';
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      {/* Header — when this card has a "same as primary" toggle, inline the
          checkbox in the header so both borrower and co-borrower cards keep
          identical header heights and the form bodies stay aligned. */}
      {canToggle ? (
        <div style={{
          background: 'var(--bg-muted)', color: 'var(--text-primary)',
          padding: '8px 14px', borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Address</span>
            {sub && <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7 }}>{sub}</span>}
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit' }}>
            <input
              type="checkbox"
              checked={!!sameAsPrimary}
              onChange={onToggleSameAsPrimary}
              style={{ accentColor: 'var(--text-primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Same as primary borrower
            </span>
          </label>
        </div>
      ) : (
        <SectionHead label="Current Address" sub={sub}/>
      )}
      {/* Address fields — hidden when "same as primary" is checked */}
      {sameAsPrimary ? (
        <div style={{
          padding: '20px 14px', background: 'var(--bg-surface)',
          fontSize: 12.5, color: 'var(--text-tertiary)', fontStyle: 'italic',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          Inherits the primary borrower's current address.<br/>
          <span style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>
            {address.street} · {address.city}, {address.state} {address.zip}
          </span>
        </div>
      ) : (
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: narrow ? '2fr 1fr' : '2fr 1fr 1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
          {narrow ? (
            <>
              <div style={{ gridColumn: '1 / -1' }}><URLAField label="Street" value={address.street} onCommit={commit('street')}/></div>
              <URLAField label="City"  value={address.city}  onCommit={commit('city')}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <URLAField label="State" options={US_STATES} value={address.state} onCommit={commit('state')}/>
                <URLAField label="ZIP"   value={address.zip} mono onCommit={commit('zip')}/>
              </div>
              <URLAField label="Years at Address" value={`${address.yearsAtAddress} yrs`}/>
              <URLAField label="Housing" value={address.housing} onCommit={commit('housing')}/>
            </>
          ) : (
            <>
              <URLAField label="Street" value={address.street} onCommit={commit('street')}/>
              <URLAField label="City"   value={address.city}   onCommit={commit('city')}/>
              <URLAField label="State"  options={US_STATES} value={address.state} onCommit={commit('state')}/>
              <URLAField label="ZIP"    value={address.zip} mono onCommit={commit('zip')}/>
              <URLAField label="Years at Address" value={`${address.yearsAtAddress} yrs`}/>
              <URLAField label="Housing" value={address.housing} onCommit={commit('housing')}/>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const INCOME_TYPES = ['Base Employment', 'Self-Employment', 'Bonus', 'Commission', 'Overtime', 'Rental', 'Investment', 'Social Security', 'Pension', 'Other'];

// Build an income list from the legacy per-borrower employment/additional
// income shape. Used as a fallback when an app hasn't migrated to the unified
// `incomes` array yet.
function deriveIncomesFromLegacy(app) {
  const out = [];
  let id = 1;
  if (app.employment && app.employment.monthlyIncome) {
    out.push({
      id: id++, owner: 'borrower',
      type: app.employment.selfEmployed ? 'Self-Employment' : 'Base Employment',
      source: app.employment.employer || 'Employer',
      monthlyAmount: app.employment.monthlyIncome,
    });
  }
  if (app.additionalIncome && app.additionalIncome.monthlyAmt) {
    out.push({
      id: id++, owner: 'borrower', type: 'Other',
      source: app.additionalIncome.source || 'Other income',
      monthlyAmount: app.additionalIncome.monthlyAmt,
    });
  }
  if (app.coborrower && app.coborrowerEmployment && app.coborrowerEmployment.monthlyIncome) {
    out.push({
      id: id++, owner: 'coborrower',
      type: app.coborrowerEmployment.selfEmployed ? 'Self-Employment' : 'Base Employment',
      source: app.coborrowerEmployment.employer || 'Employer',
      monthlyAmount: app.coborrowerEmployment.monthlyIncome,
    });
  }
  if (app.coborrowerAdditionalIncome && app.coborrowerAdditionalIncome.monthlyAmt) {
    out.push({
      id: id++, owner: 'coborrower', type: 'Other',
      source: app.coborrowerAdditionalIncome.source || 'Other income',
      monthlyAmount: app.coborrowerAdditionalIncome.monthlyAmt,
    });
  }
  return out;
}

function ownerLabel(owner, app) {
  const p = owner === 'coborrower' ? app.coborrower : app.borrower;
  const parts = splitName((p && p.name) || '');
  return parts.firstName || (owner === 'coborrower' ? 'Co-borrower' : 'Borrower');
}

function IncomeTable({ app, onUpdateApp }) {
  const hasCo = !!app.coborrower;
  const incomes = app.incomes || deriveIncomesFromLegacy(app);
  const ownerOptions = hasCo
    ? [{ value: 'borrower', label: ownerLabel('borrower', app) }, { value: 'coborrower', label: ownerLabel('coborrower', app) }]
    : [{ value: 'borrower', label: ownerLabel('borrower', app) }];

  const persist = (next) => onUpdateApp && onUpdateApp({ incomes: next });
  const updateRow = (id, patch) => persist(incomes.map(inc => inc.id === id ? { ...inc, ...patch } : inc));
  const deleteRow = (id) => persist(incomes.filter(inc => inc.id !== id));
  const addRow = () => {
    const nextId = incomes.reduce((max, inc) => Math.max(max, inc.id || 0), 0) + 1;
    persist([...incomes, { id: nextId, owner: 'borrower', type: 'Base Employment', source: '', monthlyAmount: 0 }]);
  };

  const borrowerTotal = incomes.filter(i => i.owner === 'borrower').reduce((s, i) => s + (Number(i.monthlyAmount) || 0), 0);
  const coTotal = incomes.filter(i => i.owner === 'coborrower').reduce((s, i) => s + (Number(i.monthlyAmount) || 0), 0);
  const combined = borrowerTotal + coTotal;

  const cellTd = { padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle' };
  const cellInput = {
    width: '100%', height: 30, padding: '0 8px', border: '1px solid var(--border-subtle)',
    borderRadius: 6, background: 'var(--bg-surface)', fontSize: 13, fontFamily: 'inherit',
    color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
  };
  const cellSelect = { ...cellInput, paddingRight: 26, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' };
  const chevronWrap = { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)', display: 'flex' };

  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label="1b · Current Employment & Income"/>
      <div style={{ background: 'var(--bg-surface)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '18%' }}/>
            <col style={{ width: '22%' }}/>
            <col style={{ width: '32%' }}/>
            <col style={{ width: '20%' }}/>
            <col style={{ width: '8%' }}/>
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--bg-muted)' }}>
              <th style={{ ...cellTd, fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textAlign: 'left' }}>Borrower</th>
              <th style={{ ...cellTd, fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textAlign: 'left' }}>Type</th>
              <th style={{ ...cellTd, fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textAlign: 'left' }}>Source / Employer</th>
              <th style={{ ...cellTd, fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)', textAlign: 'right' }}>Monthly amount</th>
              <th style={{ ...cellTd }}/>
            </tr>
          </thead>
          <tbody>
            {incomes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '20px 14px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
                  No income entries — click <strong>Add income</strong> to start.
                </td>
              </tr>
            ) : incomes.map(inc => (
              <tr key={inc.id}>
                <td style={cellTd}>
                  <div style={{ position: 'relative' }}>
                    <select value={inc.owner} onChange={e => updateRow(inc.id, { owner: e.target.value })} style={cellSelect}>
                      {ownerOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <span style={chevronWrap}><Icon name="chevronDown" size={12}/></span>
                  </div>
                </td>
                <td style={cellTd}>
                  <div style={{ position: 'relative' }}>
                    <select value={inc.type} onChange={e => updateRow(inc.id, { type: e.target.value })} style={cellSelect}>
                      {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={chevronWrap}><Icon name="chevronDown" size={12}/></span>
                  </div>
                </td>
                <td style={cellTd}>
                  <input value={inc.source || ''} onChange={e => updateRow(inc.id, { source: e.target.value })} placeholder="Employer or source" style={cellInput}/>
                </td>
                <td style={cellTd}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>$</span>
                    <input type="number" min="0" step="100" value={inc.monthlyAmount || 0}
                      onChange={e => updateRow(inc.id, { monthlyAmount: parseFloat(e.target.value) || 0 })}
                      style={{ ...cellInput, fontFamily: 'DM Mono, monospace', textAlign: 'right' }}/>
                  </div>
                </td>
                <td style={{ ...cellTd, textAlign: 'center' }}>
                  <button onClick={() => deleteRow(inc.id)} aria-label="Delete income"
                    style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--card-red-bg)'; e.currentTarget.style.color = 'var(--status-red)'; e.currentTarget.style.borderColor = 'var(--status-red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                    <Icon name="x" size={12}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bg-muted)' }}>
              <td colSpan={3} style={{ ...cellTd, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {ownerLabel('borrower', app)} total
              </td>
              <td style={{ ...cellTd, textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{fmtK(borrowerTotal)}</td>
              <td style={cellTd}/>
            </tr>
            {hasCo && (
              <tr style={{ background: 'var(--bg-muted)' }}>
                <td colSpan={3} style={{ ...cellTd, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {ownerLabel('coborrower', app)} total
                </td>
                <td style={{ ...cellTd, textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{fmtK(coTotal)}</td>
                <td style={cellTd}/>
              </tr>
            )}
            <tr style={{ background: 'var(--bg-muted)', borderTop: '2px solid var(--border-strong)' }}>
              <td colSpan={3} style={{ ...cellTd, borderBottom: 'none', fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                Combined monthly income
              </td>
              <td style={{ ...cellTd, borderBottom: 'none', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 800, fontSize: 14 }}>{fmtK(combined)}</td>
              <td style={{ ...cellTd, borderBottom: 'none' }}/>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <button onClick={addRow}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={12}/> Add income
        </button>
      </div>
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

// Build the initial app data for a loan — used by both URLA1003View and the
// Borrower Summary tab when state is being lifted to a shared parent so the
// two views can render linked fields against the same object.
export function buildInitialAppsForLoan(loanId) {
  const ld = LOAN_URLA_DATA[loanId] || buildURLAFromLoan(LOANS.find(l => l.id === loanId));
  return [buildAppFromLoanData(ld)];
}

// ─── Borrower application tabs + "manage borrowers" menu ────────────────────
// Encapsulates the per-app tab strip and the ellipsis menu (add/remove
// co-borrower, add/remove second app, split, combine). Renders against the
// shared apps state so the 1003 and Borrower Summary stay in sync.
export function BorrowerApplicationTabs({ loanId, apps, setApps, activeApp, setActiveApp }) {
  const ld = React.useMemo(
    () => LOAN_URLA_DATA[loanId] || buildURLAFromLoan(LOANS.find(l => l.id === loanId)),
    [loanId]
  );
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
    updateApp(activeApp, {
      coborrower:                 ld.coborrower      || SECOND_APP_TEMPLATE.borrower,
      coborrowerAddress:          ld.coborrowerAddress || ld.currentAddress,
      coborrowerEmployment:       ld.coborrowerEmployment || ld.employment,
      coborrowerAdditionalIncome: ld.coborrowerAdditionalIncome || ld.additionalIncome,
      coborrowerDeclarations:     ld.coborrowerDeclarations || ld.declarations,
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
    setActiveApp(apps.length);
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
    if (apps.length < 2) return;
    const otherIdx = activeApp === 0 ? 1 : 0;
    const other = apps[otherIdx];
    setApps(prev => {
      const merged = prev.map((a, i) => i === activeApp ? {
        ...a,
        coborrower:                 other.borrower,
        coborrowerAddress:          other.currentAddress,
        coborrowerEmployment:       other.employment,
        coborrowerAdditionalIncome: other.additionalIncome,
        coborrowerDeclarations:     other.declarations,
      } : a);
      return merged.filter((_, i) => i !== otherIdx);
    });
    setActiveApp(0);
    setMenuOpen(false);
  };

  return (
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
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────
// `apps`/`setApps`/`activeApp`/`setActiveApp` are optional — when provided
// (from LoanDetailView), this view becomes controlled and shares state with
// the Borrower Summary tab. Without them, it manages its own state.
export function URLA1003View({ loanId = 'LN-2024-0234', apps: appsProp, setApps: setAppsProp, activeApp: activeAppProp, setActiveApp: setActiveAppProp }) {
  const ld = LOAN_URLA_DATA[loanId] || buildURLAFromLoan(LOANS.find(l => l.id === loanId));
  const [localApps, setLocalApps] = React.useState(() => [buildAppFromLoanData(ld)]);
  const [localActiveApp, setLocalActiveApp] = React.useState(0);
  const apps = appsProp || localApps;
  const setApps = setAppsProp || setLocalApps;
  const activeApp = activeAppProp != null ? activeAppProp : localActiveApp;
  const setActiveApp = setActiveAppProp || setLocalActiveApp;
  const [saved, setSaved] = React.useState(false);
  const current = apps[activeApp];
  const updateApp = (idx, patch) => {
    setApps(prev => prev.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };
  const handleAddCo = () => {
    updateApp(activeApp, {
      coborrower:                ld.coborrower      || SECOND_APP_TEMPLATE.borrower,
      coborrowerAddress:         ld.coborrowerAddress || ld.currentAddress,
      coborrowerEmployment:      ld.coborrowerEmployment || ld.employment,
      coborrowerAdditionalIncome:ld.coborrowerAdditionalIncome || ld.additionalIncome,
      coborrowerDeclarations:    ld.coborrowerDeclarations || ld.declarations,
    });
  };
  const handleRemoveCo = () => {
    updateApp(activeApp, {
      coborrower: null, coborrowerAddress: null, coborrowerEmployment: null,
      coborrowerAdditionalIncome: null, coborrowerDeclarations: null,
    });
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <PageHeader
        icon="doc"
        title="Uniform Residential Loan Application"
        subtitle="Form 1003"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon name="download" size={13}/> Export PDF</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ minWidth: 80 }}>
            {saved ? <><Icon name="check" size={13}/> Saved</> : <><Icon name="doc" size={13}/> Save</>}
          </button>
        </>}
      />


      <BorrowerApplicationTabs
        loanId={loanId}
        apps={apps}
        setApps={setApps}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
      />

      {/* Form sections — anchor IDs live on the inner cards (1a, 2a, 3, 4a, 5)
          so clicking a sub-link in the LeftRail jumps directly to that
          subsection without any intermediate header banners. */}
      <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <SectionBorrowerInfo
          app={current}
          onAddCo={handleAddCo}
          onRemoveCo={handleRemoveCo}
          onUpdateApp={(patch) => updateApp(activeApp, patch)}
        />
        <SectionAssetsLiabilities ld={ld}/>
        <SectionLoanProperty ld={ld}/>
        <SectionDeclarations ld={ld} app={current}/>
      </div>
    </div>
  );
}

export default URLA1003View;
