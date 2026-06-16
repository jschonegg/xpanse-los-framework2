// IMS required forms / data collectors — reference catalog.
// Source: "IMS Required Forms_Data Collectors" spreadsheet.
// Each form carries agency-applicability flags (fnma/fhlmc/fha/va/usda).
// Conventional (and Jumbo) loans map to the Fannie/Freddie (fnma+fhlmc) set.

export const AGENCIES = [
  { key: 'fnma',  label: 'FNMA',  full: 'Fannie Mae' },
  { key: 'fhlmc', label: 'FHLMC', full: 'Freddie Mac' },
  { key: 'fha',   label: 'FHA',   full: 'FHA' },
  { key: 'va',    label: 'VA',    full: 'VA' },
  { key: 'usda',  label: 'USDA',  full: 'USDA' },
];

// Only the applicable agency flags are listed per form (truthy check).
export const IMS_FORMS = [
  { id: 1,  name: '1003', desc: 'Standard mortgage application used to collect borrower, income, asset, liability, and property information.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1003 / Form 65' },
  { id: 2,  name: '1008', desc: 'Summary form lenders use to document underwriting analysis and loan transmittal information.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1008 / Form 1077' },
  { id: 3,  name: '1103', desc: 'Optional borrower demographic and homeownership education information collected with the loan application.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1103' },
  { id: 4,  name: '1005', desc: "Form used to verify a borrower's current or prior employment and income.", fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1005' },
  { id: 5,  name: '1006', desc: "Form used to verify a borrower's deposit accounts and asset balances.", fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1006' },
  { id: 6,  name: 'Credit Report', desc: 'Credit history report used to evaluate borrower credit obligations, scores, and tradelines.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'N/A — no listed-agency model form' },
  { id: 7,  name: '1098 Mortgage Interest Form', desc: 'Tax form reporting mortgage interest received from a borrower during the year.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'N/A — IRS form' },
  { id: 8,  name: 'Loan Estimate (LE)', desc: 'Disclosure summarizing estimated loan terms, projected payments, and closing costs.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'N/A — CFPB TRID form' },
  { id: 9,  name: 'Closing Disclosure (CD)', desc: 'Final disclosure summarizing actual loan terms, payments, closing costs, and cash to close.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'N/A — CFPB TRID form' },
  { id: 10, name: '1084 Cash Flow Analysis', desc: 'Worksheet used to analyze self-employed borrower income from tax returns.', fnma: true, fhlmc: true, fha: true, va: true, usda: true, link: 'Form 1084' },
  { id: 11, name: '1037 Rental Income Worksheet', desc: 'Worksheet used to calculate rental income for investment property qualifying.', fnma: true, link: 'Form 1037 (Fannie guide forms)' },
  { id: 12, name: '1038 Rental Income Worksheet', desc: 'Worksheet used to calculate rental income for subject property or departing residence qualifying.', fnma: true, link: 'Form 1038 (Fannie guide forms)' },
  { id: 13, name: 'Form 65', desc: 'Freddie Mac version of the Uniform Residential Loan Application.', fhlmc: true, link: 'Freddie Form 65 URLA' },
  { id: 14, name: 'Form 1077', desc: 'Freddie Mac underwriting summary used to document loan risk and transmittal details.', fhlmc: true, link: 'Freddie Form 1077' },
  { id: 15, name: 'Form 720', desc: 'Freddie Mac form used to support borrower income and employment information.', fhlmc: true, link: 'Form 720' },
  { id: 16, name: 'Form 1006 (Freddie)', desc: 'Freddie Mac form used to verify deposit accounts and asset balances.', fhlmc: true, link: 'Form 1006' },
  { id: 17, name: 'Form 1000', desc: 'Freddie Mac form used to document income from a trust.', fhlmc: true, link: 'Freddie Form 1000' },
  { id: 18, name: 'Form 72', desc: 'Freddie Mac form used to analyze income from a small residential rental property.', fhlmc: true, link: 'Freddie Form 72' },
  { id: 19, name: 'Form 465', desc: 'Freddie Mac form used to verify borrower employment information.', fhlmc: true, link: 'Freddie Form 465' },
  { id: 20, name: 'Form 466', desc: "Freddie Mac form used to verify a borrower's deposit accounts.", fhlmc: true, link: 'Freddie Form 466' },
  { id: 21, name: 'HUD 1004 Addendum', desc: 'FHA addendum used with the appraisal report for certain HUD-insured mortgage transactions.', fha: true, link: 'N/A — no exact HUD model form' },
  { id: 22, name: 'HUD-92900-A', desc: 'HUD/FHA loan application addendum and certifications for insured mortgage transactions.', fha: true, link: 'HUD-92900-A' },
  { id: 23, name: 'HUD-92900-LT', desc: 'HUD/FHA loan transmittal form used to summarize borrower and mortgage information.', fha: true, link: 'HUD-92900-LT' },
  { id: 24, name: 'HUD 92800.5b', desc: 'HUD/FHA conditional commitment or direct endorsement statement of appraised value.', fha: true, link: 'HUD-92800.5B' },
  { id: 25, name: 'HUD-56001', desc: 'HUD form used for property improvement loan eligibility and related borrower certifications.', fha: true, link: 'HUD-56001' },
  { id: 26, name: 'FHA Case Number Assignment', desc: 'FHA process used to obtain and assign a unique case number for an insured loan.', fha: true, link: 'N/A — FHA Connection process' },
  { id: 27, name: 'FHA Amendatory Clause', desc: 'FHA clause confirming the buyer is not obligated if the property does not appraise sufficiently.', fha: true, link: 'FHA amendatory clause text' },
  { id: 28, name: 'Real Estate Certification', desc: 'Certification used to confirm the sales contract reflects the complete real estate agreement.', fha: true, link: 'N/A — no exact HUD model form' },
  { id: 29, name: 'VA Form 26-1802a', desc: 'VA loan application-related form formerly used for lender and veteran certifications.', va: true, link: 'VA Form 26-1820 (replacement)' },
  { id: 30, name: 'VA Form 26-1805', desc: 'VA request form used to obtain a determination of reasonable value or appraisal support.', va: true, link: 'N/A — no current public VA form page' },
  { id: 31, name: 'VA Form 26-1880', desc: 'VA form used by eligible applicants to request a Certificate of Eligibility.', va: true, link: 'VA Form 26-1880' },
  { id: 32, name: 'VA Form 26-6393', desc: 'VA loan analysis form used to document underwriting calculations and residual income.', va: true, link: 'VA Form 26-6393' },
  { id: 33, name: 'VA Form 26-8923', desc: 'VA worksheet used to compare payment changes for interest rate reduction refinance loans.', va: true, link: 'VA Form 26-8923' },
  { id: 34, name: 'VA Form 26-1820', desc: 'VA report and certification used to document loan closing and disbursement information.', va: true, link: 'VA Form 26-1820' },
  { id: 35, name: 'VA Form 26-8261A', desc: 'VA form used to certify veteran status for loan eligibility purposes.', va: true, link: 'N/A — no current public VA form page' },
  { id: 36, name: 'VA Form 26-0286', desc: 'VA loan summary sheet used to summarize key loan and borrower information.', va: true, link: 'VA Form 26-0286' },
  { id: 37, name: 'VA Form 26-6393 (Analysis)', desc: 'VA loan analysis form used to document underwriting calculations and residual income.', va: true, link: 'VA Form 26-6393' },
  { id: 38, name: 'VA Certificate of Eligibility', desc: "VA document confirming a borrower's eligibility for VA home loan benefits.", va: true, link: 'VA COE request' },
  { id: 39, name: 'USDA Form RD 3555-21', desc: 'USDA form used to request a Single Family Housing Loan Guarantee.', usda: true, link: 'USDA RD 3555-21' },
  { id: 40, name: 'USDA Form RD 3555-18', desc: 'USDA conditional commitment documenting loan guarantee approval terms.', usda: true, link: 'USDA RD 3555-18' },
  { id: 41, name: 'USDA Income Calculation Worksheet', desc: 'USDA worksheet used to calculate household income, adjusted income, and repayment income.', usda: true, link: 'USDA income worksheet / Attachment 9-B' },
];

// Which agency categories apply to a loan, derived from its product string.
// Conventional and Jumbo fall back to the Fannie/Freddie set.
export function loanAgencies(loan) {
  const p = (loan?.product || '').toLowerCase();
  if (p.includes('fha'))  return ['fha'];
  if (p.includes('va'))   return ['va'];
  if (p.includes('usda')) return ['usda'];
  return ['fnma', 'fhlmc'];
}

// True if the form applies to any of the loan's agency categories.
export function isApplicable(form, loan) {
  return loanAgencies(loan).some(k => !!form[k]);
}

// Agency keys a given form applies to (for badges).
export function formAgencyKeys(form) {
  return AGENCIES.filter(a => !!form[a.key]).map(a => a.key);
}

export function formById(id) {
  return IMS_FORMS.find(f => f.id === Number(id)) || null;
}
