// IMS form schemas — structured, in-app renderings of each reference form.
//
// Each schema describes a form as an ordered list of sections; the
// FormDocument renderer turns a schema + a loan-derived "profile" into styled
// cards. Field `value` getters receive the profile (p) so the form stays in
// sync with the rest of the app.
//
// IMPORTANT: every value here is synthetic/demo data. Borrower/property/loan
// fields come from the (fictional) loan record; PII the loan record doesn't
// track (SSN, DOB, phone) is rendered as masked placeholders. No real client
// data is used.

// ─── Formatting helpers ──────────────────────────────────────────────────────
export const money = (n) => (n == null || isNaN(n)) ? '—' : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const rate = (r) => (r == null) ? '—' : Number(r).toFixed(3) + '%';
const pct  = (n) => (n == null) ? '—' : n + '%';

// Parse a loan's free-form property string into street/city/state/zip parts.
function parseProperty(propStr) {
  if (!propStr) return { full: '— TBD —', street: '— TBD —', city: '—', state: '—', zip: '—' };
  const m = propStr.match(/^(.+?),\s*(.+?)\s+([A-Z]{2})(?:\s+(\d{5}))?$/);
  if (!m) return { full: propStr, street: propStr, city: '—', state: '—', zip: '—' };
  return { full: propStr, street: m[1].trim(), city: m[2].trim(), state: m[3], zip: m[4] || '—' };
}

// Map a loan's product label into an agency loan-type descriptor.
function deriveType(product) {
  if (!product)             return { code: 'Conventional', long: 'Conventional' };
  if (/FHA/i.test(product))   return { code: 'FHA',          long: 'FHA — federally insured' };
  if (/VA/i.test(product))    return { code: 'VA',           long: 'VA — guaranteed' };
  if (/USDA/i.test(product))  return { code: 'USDA-RD',      long: 'USDA Rural Development — guaranteed' };
  if (/Jumbo/i.test(product)) return { code: 'Conventional', long: 'Conventional (Jumbo)' };
  return { code: 'Conventional', long: 'Conventional' };
}

function deriveTerm(product) {
  const m = (product || '').match(/(\d+)\s*yr/i);
  return m ? Number(m[1]) : 30;
}

// 10-digit FHA-style case number derived deterministically from the loan id,
// so the same loan always shows the same (synthetic) case number.
function syntheticCaseNumber(loanId, area = '023') {
  const digits = (loanId || '').replace(/\D/g, '');
  const last7 = (digits + '0000000').slice(-7);
  return `${area}-${last7}`;
}

// ─── Loan → form profile ─────────────────────────────────────────────────────
// One normalized object every schema reads from. Centralizes the synthetic
// underwriting math so all forms stay internally consistent.
export function buildFormProfile(loan) {
  loan = loan || {};
  const prop = parseProperty(loan.property);
  const type = deriveType(loan.product);
  const term = deriveTerm(loan.product);
  const salePrice = (loan.amount && loan.ltv) ? Math.round(loan.amount / (loan.ltv / 100)) : null;

  // Synthetic, internally-consistent qualifying figures. P&I (estPI) is the
  // anchor: monthly income ≈ 4× P&I (gives a ~25–28% front ratio), PITI ≈
  // 1.27× P&I (adds taxes/insurance/MI). Back-end ratio comes straight from
  // the loan record's DTI.
  const estPI = loan.estPI || null;
  const monthlyIncome = estPI ? Math.round(estPI * 4) : null;
  const piti = estPI ? Math.round(estPI * 1.27) : null;
  const frontRatio = (piti && monthlyIncome) ? Math.round((piti / monthlyIncome) * 100) : null;

  return {
    loanId: loan.id || '—',
    borrowerName: loan.borrower || '— TBD —',
    coborrowerName: loan.coborrower ? loan.coborrower.name : null,
    borrower: {
      name: loan.borrower || '— TBD —',
      ssn: '***-**-0000',
      dob: '01/01/1985',
      phone: '(000) 000-0000',
      email: '— TBD —',
      citizenship: 'U.S. Citizen',
    },
    property: prop,
    occupancy: 'Primary Residence',
    units: 1,
    propertyType: 'Single Family Detached',
    loan: {
      amount: loan.amount || null,
      rate: loan.rate || null,
      term,
      type: type.code,
      typeLong: type.long,
      purpose: loan.loanPurpose || 'Purchase',
      points: loan.points,
      estPI,
      ltv: loan.ltv,
      dti: loan.dti,
      lien: 'First',
      salePrice,
      appraisedValue: salePrice, // demo: appraisal meets contract price
    },
    qualifying: { monthlyIncome, piti, frontRatio, backRatio: loan.dti != null ? loan.dti : null },
    credit: loan.credit || {},
    fico: loan.credit ? loan.credit.fico : null,
    aus: loan.aus || 'DU Approve/Eligible',
    closingDate: loan.closingDate || '—',
    lock: { status: loan.lockStatus || '—', days: loan.lockDays },
    fhaCase: syntheticCaseNumber(loan.id, '023'),
    usdaId: syntheticCaseNumber(loan.id, '11'),
    originator: {
      name: loan.assignee || 'Alex Martinez',
      nmls: 'NMLS# 1234567',
      company: 'Xpanse Mortgage',
      companyNmls: 'NMLS# 9876543',
    },
  };
}

// ─── Form schemas ────────────────────────────────────────────────────────────
// Keyed by form id (matches IMS_FORMS). Form 1 (1003/URLA) intentionally has no
// schema — it reuses the full URLA1003View. Section kinds:
//   'fields' (default) · 'kv' · 'attestations' · 'signatures' · 'note'
export const FORM_SCHEMAS = {

  // ── 1008 · Uniform Underwriting and Transmittal Summary ──────────────────
  2: {
    title: 'Uniform Underwriting and Transmittal Summary',
    subtitle: 'Form 1008 / Form 1077',
    sections: [
      { label: 'I · Borrower & Property Information', fields: [
        { label: 'Borrower Name',    value: p => p.borrowerName },
        { label: 'Co-Borrower Name', value: p => p.coborrowerName || '—' },
        { label: 'Property Address', value: p => p.property.full, full: true },
        { label: 'Property Type',    value: p => p.propertyType },
        { label: 'Occupancy Status', value: p => p.occupancy },
        { label: 'Number of Units',  value: p => String(p.units), mono: true },
        { label: 'Sales Price',      value: p => money(p.loan.salePrice), mono: true },
        { label: 'Appraised Value',  value: p => money(p.loan.appraisedValue), mono: true },
      ]},
      { label: 'II · Mortgage Information', fields: [
        { label: 'Loan Type',        value: p => p.loan.typeLong },
        { label: 'Amortization Type',value: () => 'Fixed Rate' },
        { label: 'Loan Purpose',     value: p => p.loan.purpose },
        { label: 'Lien Position',    value: p => `${p.loan.lien} lien` },
        { label: 'Original Loan Amount', value: p => money(p.loan.amount), mono: true },
        { label: 'Note Rate',        value: p => rate(p.loan.rate), mono: true },
        { label: 'Loan Term',        value: p => `${p.loan.term} years (${p.loan.term * 12} mo)` },
        { label: 'LTV / CLTV',       value: p => p.loan.ltv != null ? `${p.loan.ltv}% / ${p.loan.ltv}%` : '—', mono: true },
      ]},
      { label: 'III · Underwriting Analysis', kind: 'kv', rows: [
        { label: 'Stable Monthly Income',            value: p => money(p.qualifying.monthlyIncome) },
        { label: 'Proposed Monthly Housing (PITI)',  value: p => money(p.qualifying.piti) },
        { label: 'Primary Housing Expense / Income', value: p => pct(p.qualifying.frontRatio) },
        { label: 'Total Obligations / Income (DTI)', value: p => pct(p.qualifying.backRatio) },
        { label: 'Qualifying Rate',                  value: p => rate(p.loan.rate) },
      ]},
      { label: 'IV · Risk Assessment', kind: 'kv', rows: [
        { label: 'Underwriting Method',        value: p => /manual/i.test(p.aus) ? 'Manual Underwriting' : 'AUS — Desktop Underwriter (DU)' },
        { label: 'AUS Recommendation',         value: p => p.aus },
        { label: 'Representative Credit Score',value: p => p.fico != null ? String(p.fico) : '—' },
      ]},
      { label: 'V · Seller / Lender Information', fields: [
        { label: 'Seller / Servicer',     value: p => p.originator.company },
        { label: 'Loan Originator',        value: p => p.originator.name },
        { label: 'Originator NMLSR ID',    value: p => p.originator.nmls, mono: true },
        { label: 'Underwriter',            value: () => 'Morgan Pierce' },
      ]},
    ],
  },

  // ── 1103 · Demographic Information Addendum ──────────────────────────────
  3: {
    title: 'Demographic Information Addendum',
    subtitle: 'Form 1103',
    sections: [
      { label: 'Purpose', kind: 'note',
        note: 'This information is requested by the Federal Government to monitor compliance with equal credit opportunity, fair housing, and home mortgage disclosure laws. Providing it is voluntary, and it will not affect the lending decision.' },
      { label: 'Ethnicity, Race & Sex — Borrower', fields: [
        { label: 'Borrower',   value: p => p.borrowerName },
        { label: 'Ethnicity',  value: () => 'I do not wish to provide this information' },
        { label: 'Race',       value: () => 'I do not wish to provide this information' },
        { label: 'Sex',        value: () => 'I do not wish to provide this information' },
        { label: 'Collected by', value: () => 'Not collected on the basis of visual observation or surname', full: true },
      ]},
      { label: 'Homeownership Education & Counseling', fields: [
        { label: 'Language Preference',         value: () => 'English' },
        { label: 'Homebuyer Education Completed',value: () => 'Not provided' },
        { label: 'Housing Counseling Agency',   value: () => '—' },
      ]},
    ],
  },

  // ── 1005 · Request for Verification of Employment ────────────────────────
  4: {
    title: 'Request for Verification of Employment',
    subtitle: 'Form 1005',
    sections: [
      { label: 'Part I · Request', fields: [
        { label: 'Lender',              value: p => p.originator.company },
        { label: 'Lender Loan Number',  value: p => p.loanId, mono: true },
        { label: 'Employee Name',       value: p => p.borrowerName },
        { label: 'Employer Name & Address', value: () => '— Employer on file —', full: true },
      ]},
      { label: 'Part II · Verification of Present Employment', kind: 'kv', rows: [
        { label: 'Current Position',                  value: () => 'On file' },
        { label: 'Employment Start Date',             value: () => '01/2018' },
        { label: 'Current Gross Base Pay',            value: p => `${money(p.qualifying.monthlyIncome)} / month` },
        { label: 'Pay Type',                          value: () => 'Salaried — W-2' },
        { label: 'Probability of Continued Employment', value: () => 'Likely / continued' },
      ]},
      { label: 'Part III · Verification of Previous Employment', kind: 'note',
        note: 'No previous-employment verification required for this file.' },
      { label: 'Part IV · Authorized Signature', kind: 'signatures',
        signers: () => [{ label: 'Employer Representative', name: '— Authorized signer —' }] },
    ],
  },

  // ── 1006 · Request for Verification of Deposit ───────────────────────────
  5: {
    title: 'Request for Verification of Deposit',
    subtitle: 'Form 1006',
    sections: [
      { label: 'Part I · Request', fields: [
        { label: 'Lender',                  value: p => p.originator.company },
        { label: 'Lender Loan Number',      value: p => p.loanId, mono: true },
        { label: 'Applicant',               value: p => p.borrowerName },
        { label: 'Depository Name & Address', value: () => '— Depository on file —', full: true },
      ]},
      { label: 'Part II · Verification of Depository', kind: 'kv', rows: [
        { label: 'Account Type',          value: () => 'Checking' },
        { label: 'Account Number',        value: () => '****0000' },
        { label: 'Current Balance',       value: () => '— Verified on file —' },
        { label: 'Average Balance (2 mo)',value: () => '— Verified on file —' },
        { label: 'Date Opened',           value: () => 'On file' },
      ]},
      { label: 'Part III · Loans', kind: 'note',
        note: 'No outstanding loans with this depository reported.' },
      { label: 'Authorized Signature', kind: 'signatures',
        signers: () => [{ label: 'Depository Representative', name: '— Authorized signer —' }] },
    ],
  },

  // ── Credit Report (generated output — structured summary) ────────────────
  6: {
    title: 'Credit Report Summary',
    subtitle: 'Tri-merge credit report',
    sections: [
      { label: 'Report Summary', fields: [
        { label: 'Borrower',    value: p => p.borrowerName },
        { label: 'Co-Borrower', value: p => p.coborrowerName || '—' },
        { label: 'Report Type', value: () => 'Tri-merge (TRI)' },
        { label: 'Report Date', value: p => p.credit.pullDate || '—', mono: true },
      ]},
      { label: 'Credit Scores', kind: 'kv', rows: [
        { label: 'Equifax (Beacon)',         value: p => p.credit.equifax    != null ? String(p.credit.equifax)    : '—' },
        { label: 'Experian (FICO)',          value: p => p.credit.experian   != null ? String(p.credit.experian)   : '—' },
        { label: 'TransUnion (FICO)',        value: p => p.credit.transunion != null ? String(p.credit.transunion) : '—' },
        { label: 'Representative (Mid) Score', value: p => p.fico != null ? String(p.fico) : '—' },
      ]},
      { label: 'Credit Profile', kind: 'kv', rows: [
        { label: 'Open Tradelines',            value: () => '8' },
        { label: 'Inquiries (last 90 days)',   value: () => '2' },
        { label: 'Public Records',             value: () => 'None' },
        { label: 'Collections / Charge-offs',  value: () => 'None' },
        { label: 'Oldest Tradeline',           value: () => '14 years' },
      ]},
      { label: 'About this summary', kind: 'note',
        note: 'Generated output — summarizes the tri-merge credit report retained in the loan file. Not a fillable agency form.' },
    ],
  },

  // ── 1098 · Mortgage Interest Statement (generated output) ────────────────
  7: {
    title: 'Mortgage Interest Statement',
    subtitle: 'IRS Form 1098',
    sections: [
      { label: 'Recipient / Lender', fields: [
        { label: 'Recipient Name',    value: p => p.originator.company },
        { label: "Recipient's TIN",   value: () => '**-***0000', mono: true },
        { label: 'Recipient Address', value: () => 'Camp Hill, PA', full: true },
      ]},
      { label: 'Payer / Borrower', fields: [
        { label: 'Payer Name',        value: p => p.borrowerName },
        { label: "Payer's TIN (SSN)", value: p => p.borrower.ssn, mono: true },
        { label: 'Property Securing Mortgage', value: p => p.property.full, full: true },
      ]},
      { label: 'Statement Detail', kind: 'kv', rows: [
        { label: 'Box 1 — Mortgage interest received',     value: p => money(p.loan.amount && p.loan.rate ? Math.round(p.loan.amount * p.loan.rate / 100) : null) },
        { label: 'Box 2 — Outstanding mortgage principal', value: p => money(p.loan.amount) },
        { label: 'Box 3 — Mortgage origination date',      value: p => p.closingDate },
        { label: 'Box 5 — Mortgage insurance premiums',    value: p => (p.loan.ltv != null && p.loan.ltv > 80) ? money(Math.round((p.loan.amount || 0) * 0.0085)) : '$0' },
        { label: 'Box 6 — Points paid on purchase',        value: p => money(p.loan.points ? Math.round(p.loan.amount * p.loan.points / 100) : 0) },
        { label: 'Tax Year',                               value: () => '2026' },
      ]},
      { label: 'About this statement', kind: 'note',
        note: 'Generated output — IRS Form 1098 produced from servicing data. Figures shown are first-year estimates.' },
    ],
  },

  // ── Loan Estimate (LE) — CFPB TRID (generated output) ────────────────────
  8: {
    title: 'Loan Estimate',
    subtitle: 'CFPB TRID disclosure',
    sections: [
      { label: 'Loan Information', fields: [
        { label: 'Loan Term',   value: p => `${p.loan.term} years` },
        { label: 'Purpose',     value: p => p.loan.purpose },
        { label: 'Product',     value: () => 'Fixed Rate' },
        { label: 'Loan Type',   value: p => p.loan.typeLong },
        { label: 'Loan Amount', value: p => money(p.loan.amount), mono: true },
        { label: 'Rate Lock',   value: p => p.lock.status === 'Locked' ? `Locked${p.lock.days ? ` · ${p.lock.days} days` : ''}` : (p.lock.status || '—') },
      ]},
      { label: 'Loan Terms', kind: 'kv', rows: [
        { label: 'Loan Amount',                 value: p => money(p.loan.amount) },
        { label: 'Interest Rate',               value: p => rate(p.loan.rate) },
        { label: 'Monthly Principal & Interest',value: p => money(p.loan.estPI) },
        { label: 'Prepayment Penalty',          value: () => 'No' },
        { label: 'Balloon Payment',             value: () => 'No' },
      ]},
      { label: 'Projected Payments', kind: 'kv', rows: [
        { label: 'Principal & Interest',                value: p => money(p.loan.estPI) },
        { label: 'Estimated Escrow (taxes & insurance)',value: p => money(p.loan.estPI ? Math.round(p.loan.estPI * 0.27) : null) },
        { label: 'Estimated Total Monthly Payment',     value: p => money(p.qualifying.piti) },
      ]},
      { label: 'Costs at Closing', kind: 'kv', rows: [
        { label: 'Estimated Closing Costs', value: p => money(p.loan.amount ? Math.round(p.loan.amount * 0.03) : null) },
        { label: 'Estimated Cash to Close', value: p => {
          const dp = (p.loan.salePrice && p.loan.amount) ? p.loan.salePrice - p.loan.amount : 0;
          const cc = p.loan.amount ? Math.round(p.loan.amount * 0.03) : 0;
          return money(dp + cc);
        }},
      ]},
      { label: 'About this disclosure', kind: 'note',
        note: 'Generated output — estimated terms and costs per TRID. Final figures appear on the Closing Disclosure.' },
    ],
  },

  // ── Closing Disclosure (CD) — CFPB TRID (generated output) ───────────────
  9: {
    title: 'Closing Disclosure',
    subtitle: 'CFPB TRID disclosure',
    sections: [
      { label: 'Closing Information', fields: [
        { label: 'Closing Date',      value: p => p.closingDate, mono: true },
        { label: 'Disbursement Date', value: p => p.closingDate, mono: true },
        { label: 'Sale Price',        value: p => money(p.loan.salePrice), mono: true },
        { label: 'Property',          value: p => p.property.full, full: true },
      ]},
      { label: 'Loan Terms', kind: 'kv', rows: [
        { label: 'Loan Amount',                 value: p => money(p.loan.amount) },
        { label: 'Interest Rate',               value: p => rate(p.loan.rate) },
        { label: 'Monthly Principal & Interest',value: p => money(p.loan.estPI) },
        { label: 'Prepayment Penalty',          value: () => 'No' },
        { label: 'Balloon Payment',             value: () => 'No' },
      ]},
      { label: 'Projected Payments', kind: 'kv', rows: [
        { label: 'Principal & Interest',            value: p => money(p.loan.estPI) },
        { label: 'Escrow (taxes & insurance)',      value: p => money(p.loan.estPI ? Math.round(p.loan.estPI * 0.27) : null) },
        { label: 'Total Monthly Payment',           value: p => money(p.qualifying.piti) },
      ]},
      { label: 'Costs at Closing', kind: 'kv', rows: [
        { label: 'Closing Costs', value: p => money(p.loan.amount ? Math.round(p.loan.amount * 0.03) : null) },
        { label: 'Cash to Close', value: p => {
          const dp = (p.loan.salePrice && p.loan.amount) ? p.loan.salePrice - p.loan.amount : 0;
          const cc = p.loan.amount ? Math.round(p.loan.amount * 0.03) : 0;
          return money(dp + cc);
        }},
      ]},
      { label: 'About this disclosure', kind: 'note',
        note: 'Generated output — final terms and costs per TRID, reflecting actual figures at consummation.' },
    ],
  },

  // ── 1084 · Cash Flow Analysis (self-employed income) ─────────────────────
  10: {
    title: 'Cash Flow Analysis',
    subtitle: 'Form 1084 — self-employed income',
    sections: [
      { label: 'Borrower & Business', fields: [
        { label: 'Borrower',           value: p => p.borrowerName },
        { label: 'Business Name',      value: () => '— On file —' },
        { label: 'Business Structure', value: () => 'Sole Proprietor (Schedule C)' },
        { label: 'Tax Years Analyzed', value: () => '2024 – 2025' },
      ]},
      { label: 'Income Analysis (2-year average)', kind: 'kv', rows: [
        { label: 'Net Profit (Schedule C)',              value: p => money(p.qualifying.monthlyIncome ? Math.round(p.qualifying.monthlyIncome * 12 * 0.90) : null) },
        { label: 'Add: Depreciation',                    value: p => money(p.qualifying.monthlyIncome ? Math.round(p.qualifying.monthlyIncome * 12 * 0.12) : null) },
        { label: 'Add: Depletion / Amortization',        value: () => '$0' },
        { label: 'Less: Meals & entertainment exclusion',value: p => money(p.qualifying.monthlyIncome ? Math.round(p.qualifying.monthlyIncome * 12 * 0.02) : null) },
      ]},
      { label: 'Qualifying Income', kind: 'kv', rows: [
        { label: 'Total Annual Qualifying Income', value: p => money(p.qualifying.monthlyIncome ? p.qualifying.monthlyIncome * 12 : null) },
        { label: 'Monthly Qualifying Income',      value: p => money(p.qualifying.monthlyIncome) },
      ]},
      { label: 'About this worksheet', kind: 'note',
        note: 'Applies to self-employed borrowers. Figures are illustrative, derived from the file’s qualifying income.' },
    ],
  },

  // ── HUD-92900-A · HUD/VA Addendum to the URLA ────────────────────────────
  22: {
    title: 'HUD/VA Addendum to Uniform Residential Loan Application',
    subtitle: 'Form HUD-92900-A',
    sections: [
      { label: 'Part I · Identifying Information', fields: [
        { label: 'Agency Case Number', value: p => p.fhaCase, mono: true },
        { label: 'Borrower Name',      value: p => p.borrowerName },
        { label: 'Co-Borrower Name',   value: p => p.coborrowerName || '—' },
        { label: 'Property Address',   value: p => p.property.full, full: true },
        { label: 'Loan Amount',        value: p => money(p.loan.amount), mono: true },
        { label: 'Interest Rate',      value: p => rate(p.loan.rate), mono: true },
        { label: 'Proposed Monthly Payment (PITI)', value: p => money(p.qualifying.piti), mono: true },
        { label: 'Loan Term',          value: p => `${p.loan.term} years` },
        { label: 'Loan Purpose',       value: p => p.loan.purpose },
        { label: 'Sponsor / Lender',   value: p => p.originator.company },
      ]},
      { label: 'Part II · Lender Certification', kind: 'attestations', items: [
        'The lender certifies to the integrity of the data supplied by the lender used to determine the quality of the loan, that the loan was reviewed in accordance with applicable underwriting requirements, and that the loan is eligible for HUD mortgage insurance under the Direct Endorsement program.',
        'The lender has not used any seller-funded down-payment assistance and certifies that no part of the cash investment was obtained from a prohibited source.',
      ]},
      { label: 'Part III · Notice to Borrowers', kind: 'attestations', items: [
        'I have read and understand the foregoing concerning my liability on the mortgage, the importance of property condition, and the prohibition against false statements.',
        'I certify that I will occupy the property as my primary residence and that the statements made in this application are true and complete to the best of my knowledge.',
        'Federal law provides penalties (fine and/or imprisonment) for knowingly making false statements on this application (18 U.S.C. 1010, 1012).',
      ]},
      { label: 'Part IV · Borrower Signatures', kind: 'signatures', signers: p =>
        [{ label: 'Borrower Signature', name: p.borrowerName },
         ...(p.coborrowerName ? [{ label: 'Co-Borrower Signature', name: p.coborrowerName }] : [])] },
      { label: 'Part V · Direct Endorsement Approval', fields: [
        { label: 'Underwriter (DE)',  value: () => 'Morgan Pierce' },
        { label: 'CHUMS ID',          value: () => 'D123456789', mono: true },
        { label: 'Approval Status',   value: p => /refer/i.test(p.aus) ? 'Referred — manual review' : 'Approved' },
        { label: 'Approval Date',     value: p => p.closingDate },
      ]},
    ],
  },

  // ── VA Form 26-1880 · Request for a Certificate of Eligibility ───────────
  31: {
    title: 'Request for a Certificate of Eligibility',
    subtitle: 'VA Form 26-1880',
    sections: [
      { label: 'Section I · Veteran Identification', fields: [
        { label: 'Veteran Name',     value: p => p.borrowerName },
        { label: 'Social Security',  value: p => p.borrower.ssn, mono: true },
        { label: 'Date of Birth',    value: p => p.borrower.dob, mono: true },
        { label: 'Daytime Phone',    value: p => p.borrower.phone, mono: true },
        { label: 'Email Address',    value: p => p.borrower.email },
        { label: 'Mailing Address',  value: p => p.property.full, full: true },
      ]},
      { label: 'Section II · Military Service Information', fields: [
        { label: 'Branch of Service',   value: () => 'U.S. Army' },
        { label: 'Service Number',      value: () => '—' },
        { label: 'Entry on Duty Date',  value: () => '06/15/2006' },
        { label: 'Release / Discharge', value: () => '06/14/2012' },
        { label: 'Entitlement Code',    value: () => '10 — Restored entitlement' },
        { label: 'Service Status',      value: () => 'Discharged — honorable' },
      ]},
      { label: 'Section III · Prior VA Loans', kind: 'note',
        note: 'No prior VA loans reported. Full entitlement available for this transaction.' },
      { label: 'Section IV · Certification', kind: 'attestations', items: [
        'I certify that the statements herein are true to the best of my knowledge and belief, and that the information is furnished for the purpose of obtaining a Certificate of Eligibility for VA home loan benefits.',
        'Existing law (38 U.S.C. 5301) prohibits assignment of this entitlement except as authorized by the Department of Veterans Affairs.',
      ]},
      { label: 'Signature', kind: 'signatures', signers: p =>
        [{ label: 'Veteran Signature', name: p.borrowerName }] },
    ],
  },

  // ── USDA Form RD 3555-21 · Request for SF Housing Loan Guarantee ─────────
  39: {
    title: 'Request for Single Family Housing Loan Guarantee',
    subtitle: 'USDA Form RD 3555-21',
    sections: [
      { label: 'Part A · Lender Information', fields: [
        { label: 'Lender Name',     value: p => p.originator.company },
        { label: 'Lender Tax ID',   value: () => '**-***0000', mono: true },
        { label: 'Lender Contact',  value: p => p.originator.name },
        { label: 'USDA Lender ID',  value: p => p.usdaId, mono: true },
      ]},
      { label: 'Part B · Loan Information', fields: [
        { label: 'Requested Loan Amount', value: p => money(p.loan.amount), mono: true },
        { label: 'Interest Rate',         value: p => rate(p.loan.rate), mono: true },
        { label: 'Loan Term',             value: p => `${p.loan.term} years` },
        { label: 'Amortization',          value: () => 'Fixed Rate' },
        { label: 'Loan Purpose',          value: p => p.loan.purpose },
        { label: 'Upfront Guarantee Fee (1.00%)', value: p => money(p.loan.amount ? Math.round(p.loan.amount * 0.01) : null), mono: true },
        { label: 'Annual Fee (0.35%)',    value: p => money(p.loan.amount ? Math.round(p.loan.amount * 0.0035) : null), mono: true },
      ]},
      { label: 'Part C · Borrower & Household', fields: [
        { label: 'Borrower Name',          value: p => p.borrowerName },
        { label: 'Co-Borrower Name',       value: p => p.coborrowerName || '—' },
        { label: 'Household Size',         value: p => String(p.coborrowerName ? 2 : 1), mono: true },
        { label: 'Annual Household Income',value: p => money(p.qualifying.monthlyIncome ? p.qualifying.monthlyIncome * 12 : null), mono: true },
        { label: 'Adjusted Annual Income', value: p => money(p.qualifying.monthlyIncome ? Math.round(p.qualifying.monthlyIncome * 12 * 0.95) : null), mono: true },
        { label: 'Monthly Repayment Income', value: p => money(p.qualifying.monthlyIncome), mono: true },
      ]},
      { label: 'Part D · Property Information', fields: [
        { label: 'Property Address',  value: p => p.property.full, full: true },
        { label: 'Property Type',     value: p => p.propertyType },
        { label: 'Rural Eligibility', value: () => 'Eligible — within designated rural area' },
      ]},
      { label: 'Part E · Underwriting (GUS)', kind: 'kv', rows: [
        { label: 'GUS Recommendation',         value: p => /refer/i.test(p.aus) ? 'Refer' : 'Accept' },
        { label: 'Representative Credit Score',value: p => p.fico != null ? String(p.fico) : '—' },
        { label: 'PITI / Income',              value: p => pct(p.qualifying.frontRatio) },
        { label: 'Total Debt / Income',        value: p => pct(p.qualifying.backRatio) },
      ]},
      { label: 'Part F · Lender Certification', kind: 'attestations', items: [
        'The undersigned lender certifies that the loan application has been underwritten in accordance with 7 CFR Part 3555 and the applicable Technical Handbook (HB-1-3555), and that the borrower(s) and property meet program eligibility requirements.',
        'The lender certifies that the information provided is true and accurate and that all required documentation is retained in the lender’s permanent case file.',
      ]},
      { label: 'Signature', kind: 'signatures', signers: p =>
        [{ label: 'Authorized Lender Representative', name: p.originator.name }] },
    ],
  },
};

export function getFormSchema(id) {
  return FORM_SCHEMAS[Number(id)] || null;
}
