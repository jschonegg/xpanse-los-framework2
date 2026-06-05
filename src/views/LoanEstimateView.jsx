import React from 'react';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/Shell';
import { LOANS } from '../data/loans';

// ─── Pre-filled data keyed by loanId ──────────────────────────────────────────
const LOAN_LE_DATA = {
  'LN-2024-0234': {
    borrower:      'Sarah Anderson',
    coborrower:    'John Anderson',
    property:      '1842 Oak Street',
    cityStateZip:  'Denver, CO 80202',
    salePrice:     500000,
    loanAmount:    425000,
    loanTerm:      30,
    purpose:       'Purchase',
    product:       'Fixed Rate',
    loanType:      'Conventional',
    rate:          6.875,
    monthlyPI:     2792.34,
    miMonthly:     148,
    estimatedTaxes: 416,
    estimatedInsurance: 125,
    closingDate:   '2026-06-30',
    originator:    'Alex Martinez',
    originatorNMLSR: 'NMLS# 1234567',
    company:       'Xpanse Mortgage',
    companyNMLSR:  'NMLS# 9876543',
    fees: {
      originationPct: 1.0,
      originationAmt: 4250,
      appraisal:      650,
      creditReport:   72,
      floodDetermination: 12,
      taxService:     85,
      titleInsuranceLender: 825,
      titleSearch:    300,
      settlement:     595,
      recordingFees:  140,
      transferTax:    1250,
      prepaidInterestDays: 12,
      prepaidInterestAmt: 1117,
      homeownersInsurance12: 1500,
      homeownersInsuranceEscrow: 375,
      propertyTaxEscrow: 2498,
    },
  },
  'LN-2024-0391': {
    borrower:      'Carlos Rivera',
    coborrower:    '',
    property:      '4412 Coral Way',
    cityStateZip:  'Miami, FL 33146',
    salePrice:     660000,
    loanAmount:    520000,
    loanTerm:      30,
    purpose:       'Purchase',
    product:       'Fixed Rate',
    loanType:      'Conventional',
    rate:          6.75,
    monthlyPI:     3372.80,
    miMonthly:     0,
    estimatedTaxes: 834,
    estimatedInsurance: 280,
    closingDate:   '2026-06-10',
    originator:    'Jordan Schonegg',
    originatorNMLSR: 'NMLS# 7654321',
    company:       'Xpanse Mortgage',
    companyNMLSR:  'NMLS# 9876543',
    fees: {
      originationPct: 0.875,
      originationAmt: 4550,
      appraisal:      750,
      creditReport:   72,
      floodDetermination: 12,
      taxService:     85,
      titleInsuranceLender: 1050,
      titleSearch:    400,
      settlement:     695,
      recordingFees:  185,
      transferTax:    0,
      prepaidInterestDays: 20,
      prepaidInterestAmt: 1929,
      homeownersInsurance12: 3360,
      homeownersInsuranceEscrow: 840,
      propertyTaxEscrow: 5004,
    },
  },
};

const DEFAULT_LE = LOAN_LE_DATA['LN-2024-0234'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
const pct = (n) => Number(n).toFixed(3) + '%';

// ─── Editable field component ─────────────────────────────────────────────────
function LEField({ label, value, onChange, prefix = '', suffix = '', readOnly = false, highlight = false, wide = false, mono = false }) {
  const [focused, setFocused] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  // Sync if parent value changes (e.g. data re-init)
  React.useEffect(() => { setLocalVal(value); }, [value]);

  const handleChange = (v) => {
    setLocalVal(v);
    onChange && onChange(v);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: focused ? 'var(--bg-surface)' : 'var(--bg-muted)',
        border: `1px solid ${highlight ? '#F59E0B' : focused ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 7, overflow: 'hidden',
        boxShadow: highlight ? '0 0 0 2px rgba(245,158,11,0.12)' : focused ? '0 0 0 2px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 0.12s, box-shadow 0.12s',
      }}>
        {prefix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{prefix}</span>}
        <input
          value={localVal}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, height: 32, border: 'none', outline: 'none',
            background: 'transparent',
            fontSize: 13, fontWeight: 400,
            fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
            color: 'var(--text-primary)',
            padding: '0 10px', cursor: 'text',
            minWidth: 0,
          }}
        />
        {suffix && <span style={{ padding: '0 8px', fontSize: 13, color: 'var(--text-tertiary)', borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{suffix}</span>}
        {highlight && <span style={{ padding: '0 8px', height: 32, display: 'flex', alignItems: 'center', flexShrink: 0 }}><Icon name="alertOctagon" size={12} color="#F59E0B"/></span>}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({ label, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? 'var(--text-primary)' : 'var(--bg-muted)',
      color: accent ? '#fff' : 'var(--text-primary)',
      padding: '8px 14px',
      borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      {sub && <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7 }}>{sub}</span>}
    </div>
  );
}

// ─── Fee row — label + pre-filled editable amount ────────────────────────────
function FeeRow({ label, amount, onChange, sub, required = false, readOnly = false }) {
  const [val, setVal] = React.useState(amount !== undefined ? String(amount) : '');
  const handleChange = (v) => { setVal(v); onChange && onChange(v); };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 14px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: required ? 600 : 400, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ width: 120, flexShrink: 0 }}>
        {readOnly ? (
          <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 13, fontWeight: 600, fontFamily: 'DM Mono', color: 'var(--text-primary)', paddingRight: 10 }}>{fmt(val || 0)}</div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, overflow: 'hidden',
            height: 32,
          }}>
            <span style={{ padding: '0 7px', fontSize: 12, color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-subtle)', height: '100%', display: 'flex', alignItems: 'center' }}>$</span>
            <input
              value={val}
              onChange={e => handleChange(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12.5, fontFamily: 'DM Mono', padding: '0 8px', minWidth: 0, height: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comparison row ───────────────────────────────────────────────────────────
function CompRow({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'DM Mono' }}>{value}</div>
    </div>
  );
}

// ─── Page 1 ───────────────────────────────────────────────────────────────────
function Page1({ ld, loanId }) {
  const [f, setF] = React.useState({
    borrower:    ld.borrower,
    coborrower:  ld.coborrower,
    property:    ld.property,
    cityStateZip: ld.cityStateZip,
    salePrice:   fmtK(ld.salePrice),
    purpose:     ld.purpose,
    loanAmount:  fmtK(ld.loanAmount),
    loanTerm:    `${ld.loanTerm} years`,
    product:     ld.product,
    loanType:    ld.loanType,
    rate:        pct(ld.rate),
    monthlyPI:   fmt(ld.monthlyPI),
    miMonthly:   fmt(ld.miMonthly || 0),
    escrow:      fmt(ld.estimatedTaxes + ld.estimatedInsurance),
  });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const loanCosts = ld.fees.originationAmt + ld.fees.appraisal + ld.fees.creditReport + ld.fees.floodDetermination +
    ld.fees.taxService + ld.fees.titleInsuranceLender + ld.fees.titleSearch + ld.fees.settlement;
  const otherCosts = ld.fees.recordingFees + ld.fees.transferTax + ld.fees.prepaidInterestAmt +
    ld.fees.homeownersInsurance12 + ld.fees.homeownersInsuranceEscrow + ld.fees.propertyTaxEscrow;
  const totalClosing = loanCosts + otherCosts;
  const cashToClose = totalClosing + (ld.salePrice - ld.loanAmount);
  const totalMonthly = ld.monthlyPI + (ld.miMonthly || 0) + ld.estimatedTaxes + ld.estimatedInsurance;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Borrower & Property ─────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Applicant & Property Information"/>
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', background: 'var(--bg-surface)' }}>
          <LEField label="Borrower" value={f.borrower} onChange={v => set('borrower', v)}/>
          {ld.coborrower
            ? <LEField label="Co-Borrower" value={f.coborrower} onChange={v => set('coborrower', v)}/>
            : <div/>
          }
          <LEField label="Property Address" value={f.property} onChange={v => set('property', v)}/>
          <LEField label="City / State / ZIP" value={f.cityStateZip} onChange={v => set('cityStateZip', v)}/>
          <LEField label="Sale Price" value={f.salePrice} onChange={v => set('salePrice', v)} mono/>
          <LEField label="Loan Purpose" value={f.purpose} onChange={v => set('purpose', v)}/>
        </div>
      </div>

      {/* ── Loan Terms ──────────────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Loan Terms" accent/>
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 24px', background: 'var(--bg-surface)' }}>
          <LEField label="Loan Amount" value={f.loanAmount} onChange={v => set('loanAmount', v)} mono/>
          <LEField label="Loan Term" value={f.loanTerm} onChange={v => set('loanTerm', v)}/>
          <LEField label="Product" value={f.product} onChange={v => set('product', v)}/>
          <LEField label="Loan Type" value={f.loanType} onChange={v => set('loanType', v)}/>
          <LEField label="Interest Rate" value={f.rate} onChange={v => set('rate', v)} mono/>
          <LEField label="Monthly Principal & Interest" value={f.monthlyPI} onChange={v => set('monthlyPI', v)} mono/>
        </div>
        {/* Penalty row */}
        <div style={{ padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 32 }}>
          {[
            { label: 'Prepayment Penalty', value: 'NO' },
            { label: 'Balloon Payment', value: 'NO' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#DCFCE7', border: '1px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={11} color="#16A34A" strokeWidth={2.5}/>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{item.label}: <strong style={{ color: 'var(--status-green)' }}>{item.value}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Projected Payments ──────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Projected Payments" sub="Monthly payment estimate"/>
        <div style={{ background: 'var(--bg-surface)' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>Payment Component</div>
            <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textAlign: 'right' }}>Years 1–{ld.miMonthly > 0 ? '7' : `${ld.loanTerm}`}</div>
            {ld.miMonthly > 0 && <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textAlign: 'right' }}>Years 8+</div>}
          </div>
          {[
            { label: 'Principal & Interest', val1: f.monthlyPI, val2: f.monthlyPI, note: 'Fixed for loan term' },
            ...(ld.miMonthly > 0 ? [{ label: 'Mortgage Insurance', val1: f.miMonthly, val2: '—', note: 'Drops off when LTV reaches 78%' }] : []),
            { label: 'Estimated Escrow', val1: f.escrow, val2: f.escrow, note: 'Taxes & insurance (est.)' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' + (ld.miMonthly > 0 ? ' 1fr' : ''), borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center' }}>
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{row.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{row.note}</div>
              </div>
              <div style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13.5, fontWeight: 600, fontFamily: 'DM Mono' }}>{row.val1}</div>
              {ld.miMonthly > 0 && <div style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13.5, fontWeight: 600, fontFamily: 'DM Mono' }}>{row.val2}</div>}
            </div>
          ))}
          {/* Total row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '2px solid var(--border-strong)', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Estimated Total Monthly Payment</span>
            <span style={{ textAlign: 'right', fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono', color: 'var(--text-primary)' }}>{fmt(totalMonthly)}</span>
          </div>
        </div>
      </div>

      {/* ── Costs at Closing ────────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Costs at Closing" accent/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-surface)' }}>
          <div style={{ padding: '20px 22px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Closing Costs</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'DM Mono' }}>{fmtK(totalClosing)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Includes {fmtK(loanCosts)} in loan costs + {fmtK(otherCosts)} in other costs</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((loanCosts / totalClosing) * 100)}%`, height: '100%', background: 'var(--text-primary)', borderRadius: 999 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-tertiary)' }}>
                <span>Loan costs ({Math.round((loanCosts / totalClosing) * 100)}%)</span>
                <span>Other costs ({Math.round((otherCosts / totalClosing) * 100)}%)</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Cash to Close</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'DM Mono' }}>{fmtK(cashToClose)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Down payment {fmtK(ld.salePrice - ld.loanAmount)} + closing costs {fmtK(totalClosing)}</div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--status-green)', fontWeight: 600 }}>
              <Icon name="check" size={12} strokeWidth={2.5}/>
              Funds confirmed in borrower's account
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Page 2 ───────────────────────────────────────────────────────────────────
function Page2({ ld }) {
  const [fees, setFees] = React.useState({ ...ld.fees });
  const setFee = (k, v) => setFees(prev => ({ ...prev, [k]: parseFloat(v.replace(/[^0-9.]/g, '')) || 0 }));

  const loanCosts = fees.originationAmt + fees.appraisal + fees.creditReport + fees.floodDetermination +
    fees.taxService + fees.titleInsuranceLender + fees.titleSearch + fees.settlement;
  const otherCosts = fees.recordingFees + fees.transferTax + fees.prepaidInterestAmt +
    fees.homeownersInsurance12 + fees.homeownersInsuranceEscrow + fees.propertyTaxEscrow;
  const totalJ = loanCosts + otherCosts;
  const cashToClose = totalJ + (ld.salePrice - ld.loanAmount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── A. Origination Charges ─────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="A. Origination Charges" sub={`${fmtK(fees.originationAmt)}`}/>
        <FeeRow label={`Origination Fee (${ld.fees.originationPct}% of loan amount)`} amount={fees.originationAmt} onChange={v => setFee('originationAmt', v)} sub="Lender charge for originating the loan" required/>
        <div style={{ padding: '10px 14px', background: 'var(--bg-muted)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>No other origination charges apply to this loan</div>
        </div>
      </div>

      {/* ── B. Services (Cannot Shop) ──────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="B. Services You Cannot Shop For" sub={`${fmtK(fees.appraisal + fees.creditReport + fees.floodDetermination + fees.taxService)}`}/>
        <FeeRow label="Appraisal Fee" amount={fees.appraisal} onChange={v => setFee('appraisal', v)} sub="Ordered · ABC Appraisal Co."/>
        <FeeRow label="Credit Report Fee" amount={fees.creditReport} onChange={v => setFee('creditReport', v)}/>
        <FeeRow label="Flood Determination" amount={fees.floodDetermination} onChange={v => setFee('floodDetermination', v)}/>
        <FeeRow label="Tax Service Fee" amount={fees.taxService} onChange={v => setFee('taxService', v)}/>
      </div>

      {/* ── C. Services (Can Shop) ─────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="C. Services You Can Shop For" sub={`${fmtK(fees.titleInsuranceLender + fees.titleSearch + fees.settlement)}`}/>
        <FeeRow label="Lender's Title Insurance" amount={fees.titleInsuranceLender} onChange={v => setFee('titleInsuranceLender', v)} sub="First American Title"/>
        <FeeRow label="Title Search" amount={fees.titleSearch} onChange={v => setFee('titleSearch', v)}/>
        <FeeRow label="Settlement / Closing Fee" amount={fees.settlement} onChange={v => setFee('settlement', v)} sub="Escrow / closing agent"/>
      </div>

      {/* ── Total Loan Costs ───────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-muted)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>D. Total Loan Costs (A + B + C)</span>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono' }}>{fmt(loanCosts)}</span>
        </div>
      </div>

      {/* ── E. Taxes & Gov Fees ────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="E. Taxes and Government Fees" sub={`${fmtK(fees.recordingFees + fees.transferTax)}`}/>
        <FeeRow label="Recording Fees — Deed + Mortgage" amount={fees.recordingFees} onChange={v => setFee('recordingFees', v)}/>
        <FeeRow label="Transfer Tax" amount={fees.transferTax} onChange={v => setFee('transferTax', v)} sub={fees.transferTax === 0 ? 'Not applicable in this state' : ''}/>
      </div>

      {/* ── F. Prepaids ────────────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="F. Prepaids" sub={`${fmtK(fees.prepaidInterestAmt + fees.homeownersInsurance12)}`}/>
        <FeeRow
          label={`Prepaid Interest (${fees.prepaidInterestDays || ld.fees.prepaidInterestDays} days @ ${pct(ld.rate / 365 * ld.loanAmount / 30)}/day)`}
          amount={fees.prepaidInterestAmt}
          onChange={v => setFee('prepaidInterestAmt', v)}
          highlight
          sub="Adjust days to match actual closing date"
        />
        <FeeRow label="Homeowner's Insurance Premium (12 mo.)" amount={fees.homeownersInsurance12} onChange={v => setFee('homeownersInsurance12', v)}/>
      </div>

      {/* ── G. Initial Escrow ──────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="G. Initial Escrow Payment at Closing" sub={`${fmtK(fees.homeownersInsuranceEscrow + fees.propertyTaxEscrow)}`}/>
        <FeeRow label="Homeowner's Insurance — 3 months" amount={fees.homeownersInsuranceEscrow} onChange={v => setFee('homeownersInsuranceEscrow', v)}/>
        <FeeRow label="Property Taxes — 6 months" amount={fees.propertyTaxEscrow} onChange={v => setFee('propertyTaxEscrow', v)}/>
      </div>

      {/* ── H & I placeholders ─────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="H. Other" sub="$0.00"/>
        <div style={{ padding: '14px', background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No other charges applicable</div>
        </div>
      </div>

      {/* ── J. Total Other Costs ───────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-muted)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>I. Total Other Costs (E + F + G + H)</span>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono' }}>{fmt(otherCosts)}</span>
        </div>
      </div>

      {/* ── J. Grand Total ─────────────────────────── */}
      <div style={{ border: '2px solid var(--text-primary)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--text-primary)' }}>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff' }}>J. Total Closing Costs (D + I)</span>
          <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'DM Mono', color: '#fff' }}>{fmt(totalJ)}</span>
        </div>
      </div>

      {/* ── Calculating Cash to Close ──────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Calculating Cash to Close" accent/>
        <div style={{ background: 'var(--bg-surface)' }}>
          {[
            { label: 'Loan Amount', value: fmtK(ld.loanAmount) },
            { label: 'Total Closing Costs (J)', value: fmt(totalJ) },
            { label: 'Down Payment / Funds from Borrower', value: fmtK(ld.salePrice - ld.loanAmount) },
            { label: 'Deposit', value: '($1,000.00)' },
            { label: 'Funds for Borrower', value: '$0.00' },
            { label: 'Seller Credits', value: '$0.00' },
            { label: 'Adjustments and Other Credits', value: '$0.00' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-muted)', borderTop: '2px solid var(--border-strong)' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Cash to Close</span>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'DM Mono' }}>{fmt(cashToClose - 1000)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Page 3 ───────────────────────────────────────────────────────────────────
function Page3({ ld, loanId }) {
  const [signed, setSigned] = React.useState(false);
  const [sigDate, setSigDate] = React.useState('');
  const loan = LOANS.find(l => l.id === loanId) || {};
  const loanCosts = ld.fees.originationAmt + ld.fees.appraisal + ld.fees.creditReport + ld.fees.floodDetermination +
    ld.fees.taxService + ld.fees.titleInsuranceLender + ld.fees.titleSearch + ld.fees.settlement;
  const otherCosts = ld.fees.recordingFees + ld.fees.transferTax + ld.fees.prepaidInterestAmt +
    ld.fees.homeownersInsurance12 + ld.fees.homeownersInsuranceEscrow + ld.fees.propertyTaxEscrow;
  const totalClosing = loanCosts + otherCosts;
  const apr = (ld.rate + 0.25).toFixed(3);
  const tip = ((ld.monthlyPI * ld.loanTerm * 12 - ld.loanAmount) / ld.loanAmount * 100).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Comparisons ────────────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Comparisons" sub="In 5 years" accent/>
        <div style={{ background: 'var(--bg-surface)' }}>
          <CompRow
            label="Total Payments"
            value={fmt(ld.monthlyPI * 60 + totalClosing)}
            sub="Principal, interest, mortgage insurance and loan costs over 5 years"
          />
          <CompRow
            label="Principal Paid"
            value={fmtK(ld.loanAmount * 0.05)}
            sub="Principal paid in 5 years, reducing your loan balance"
          />
          <CompRow
            label="Annual Percentage Rate (APR)"
            value={`${apr}%`}
            sub="Your costs over the loan term expressed as a rate. This is not your interest rate."
          />
          <CompRow
            label="Total Interest Percentage (TIP)"
            value={`${tip}%`}
            sub="Total amount of interest you will pay over the loan term as a percentage of the loan amount"
          />
        </div>
      </div>

      {/* ── Other Considerations ───────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Other Considerations"/>
        <div style={{ background: 'var(--bg-surface)' }}>
          {[
            { label: 'Appraisal', body: 'We may order an appraisal to determine the property\'s value and charge you for this appraisal. We will promptly give you a copy of any appraisal, even if your loan does not close.', status: 'Ordered — pending delivery' },
            { label: 'Assumption', body: 'If you sell or transfer this property to another person, we will not allow, under certain conditions, this person to assume this loan on the original terms.', status: null },
            { label: 'Homeowner\'s Insurance', body: 'This loan requires homeowner\'s insurance on the property, which you may obtain from a company of your choice that we find acceptable.', status: 'Binder received', ok: true },
            { label: 'Late Payment', body: 'If your payment is more than 15 days late, we will charge a late fee of 5% of the monthly principal and interest payment.', status: null },
            { label: 'Refinance', body: 'Refinancing this loan will depend on your future financial situation, the property value, and market conditions. You may not be able to refinance this loan.', status: null },
            { label: 'Servicing', body: 'We intend to service your loan. If so, you will make your payments to us.', status: null },
          ].map((item, i, arr) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', gap: 16 }}>
              <div style={{ width: 140, flexShrink: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{item.label}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.body}</div>
                {item.status && (
                  <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: item.ok ? 'var(--status-green)' : 'var(--status-amber)', background: item.ok ? 'var(--card-green-bg)' : 'var(--card-amber-bg)', padding: '2px 8px', borderRadius: 5 }}>
                    <Icon name={item.ok ? 'check' : 'clock'} size={11} strokeWidth={2}/> {item.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact Information ────────────────────── */}
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        <SectionHead label="Contact Information"/>
        <div style={{ background: 'var(--bg-surface)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            { role: 'Lender', name: ld.company, nmls: ld.companyNMLSR, license: 'Licensed in all 50 states' },
            { role: 'Loan Officer', name: ld.originator, nmls: ld.originatorNMLSR, license: 'CO, WA, TX, OR, ID, AZ, TN' },
          ].map((contact, i) => (
            <div key={i} style={{ padding: '16px 14px', borderRight: i === 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>{contact.role}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{contact.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{contact.nmls}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{contact.license}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confirm Receipt ───────────────────────── */}
      <div style={{ border: `1px solid ${signed ? 'var(--card-green-border)' : 'var(--border-subtle)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <SectionHead label="Confirm Receipt" sub={signed ? '✓ Acknowledged' : 'Required'}/>
        <div style={{ padding: '18px 16px', background: signed ? 'var(--card-green-bg)' : 'var(--bg-surface)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
            By confirming receipt, you are stating that you have received this Loan Estimate and acknowledge its contents.
            This is not a loan approval or commitment to lend. Receipt of this document does not obligate you to obtain a loan from us.
          </p>
          {signed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--status-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={14} color="#fff" strokeWidth={2.5}/>
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--status-green)' }}>Receipt Confirmed</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Acknowledged on {sigDate} · {ld.borrower}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <LEField label="Date of Acknowledgment" value={sigDate} onChange={setSigDate} suffix="MM/DD/YYYY"/>
              </div>
              <button
                className="btn btn-primary"
                style={{ height: 36, flexShrink: 0 }}
                onClick={() => { if (sigDate) setSigned(true); }}
              >
                <Icon name="check" size={14}/> Confirm Receipt
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function LoanEstimateView({ loanId = 'LN-2024-0234', initialPage = 1, standalone = false }) {
  const [page, setPage] = React.useState(initialPage);
  const [saved, setSaved] = React.useState(false);
  const ld = LOAN_LE_DATA[loanId] || DEFAULT_LE;

  const handlePopOut = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=le&loanId=${encodeURIComponent(loanId)}&page=${page}`;
    window.open(url, `le-${loanId}`, 'width=1100,height=860,left=120,top=60,resizable=yes,scrollbars=yes');
  };

  const pages = [
    { num: 1, label: 'Page 1', sub: 'Loan Terms & Payments' },
    { num: 2, label: 'Page 2', sub: 'Closing Cost Details' },
    { num: 3, label: 'Page 3', sub: 'Comparisons & Receipt' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Doc header ──────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 0 16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 22, flexShrink: 0,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="doc" size={19} color="var(--text-secondary)" strokeWidth={1.6}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Loan Estimate</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
            TRID-compliant · {ld.borrower}{ld.coborrower ? ` + ${ld.coborrower}` : ''} · {ld.property}, {ld.cityStateZip}
          </div>
        </div>
        <StatusPill tone="green">LE Sent</StatusPill>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm"><Icon name="download" size={13}/> Export PDF</button>
          {!standalone && (
            <button className="btn btn-outline btn-sm" onClick={handlePopOut} title="Open in new window">
              <Icon name="externalLink" size={13}/> Pop out
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ minWidth: 80 }}>
            {saved ? <><Icon name="check" size={13}/> Saved</> : <><Icon name="doc" size={13}/> Save</>}
          </button>
        </div>
      </div>

      {/* ── Page tabs ───────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: 'var(--bg-muted)', padding: '4px 4px',
        borderRadius: 10, flexShrink: 0, alignSelf: 'flex-start',
      }}>
        {pages.map(p => {
          const active = page === p.num;
          return (
            <button key={p.num} onClick={() => setPage(p.num)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '6px 16px',
              border: 'none', borderRadius: 7, cursor: 'pointer',
              background: active ? 'var(--bg-surface)' : 'transparent',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.12s', fontFamily: 'inherit',
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{p.label}</span>
              <span style={{ fontSize: 11, color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)', marginTop: 1 }}>{p.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        {page === 1 && <Page1 ld={ld} loanId={loanId}/>}
        {page === 2 && <Page2 ld={ld}/>}
        {page === 3 && <Page3 ld={ld} loanId={loanId}/>}
      </div>

      {/* ── Page nav footer ─────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0 0', borderTop: '1px solid var(--border-subtle)',
        marginTop: 8, flexShrink: 0,
      }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          <Icon name="arrowLeft" size={13}/> Previous
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Page {page} of 3</span>
        <button className="btn btn-primary btn-sm" onClick={() => setPage(p => Math.min(3, p + 1))} disabled={page === 3}>
          Next <Icon name="arrowRight" size={13}/>
        </button>
      </div>

    </div>
  );
}

export default LoanEstimateView;
