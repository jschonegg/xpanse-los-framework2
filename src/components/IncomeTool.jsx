import React from 'react';
import { Icon } from './Icon';

// ─── Income source definitions ────────────────────────────────────────────────
const INCOME_TYPES = [
  { id: 'w2',          label: 'W-2 Employment',   icon: 'briefcase',  color: '#7E68FA' },
  { id: 'selfemployed',label: 'Self-Employed',     icon: 'building',   color: '#0EA5E9' },
  { id: 'rental',      label: 'Rental Income',     icon: 'home',       color: '#059669' },
  { id: 'retirement',  label: 'Retirement/Pension',icon: 'shield',     color: '#D97706' },
  { id: 'socialsec',   label: 'Social Security',   icon: 'heart',      color: '#7C3AED' },
  { id: 'other',       label: 'Other Income',      icon: 'plus-circle',color: '#6B7280' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => isNaN(n) || n === '' || n === null ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const parse = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;

function CurrencyInput({ value, onChange, placeholder = '0', disabled, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{
        position: 'absolute', left: 9, fontSize: 13, color: disabled ? 'var(--text-disabled, #ccc)' : 'var(--text-secondary)',
        pointerEvents: 'none', userSelect: 'none',
      }}>$</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', padding: '6px 8px 6px 20px', fontSize: 13,
          border: `1px solid ${focused ? 'var(--ai-primary, #6366F1)' : 'var(--border-subtle)'}`,
          borderRadius: 6, background: disabled ? 'var(--bg-muted)' : 'var(--bg-surface)',
          color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          ...style,
        }}
      />
    </div>
  );
}

function SelectInput({ value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)',
        borderRadius: 6, background: disabled ? 'var(--bg-muted)' : 'var(--bg-surface)',
        color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Label({ children, hint }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 6 }}>{hint}</span>}
    </div>
  );
}

function Row({ children, gap = 12, style }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${React.Children.count(children)}, 1fr)`, gap, ...style }}>{children}</div>;
}

function Field({ label, hint, children }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

function QualifyingResult({ label, monthly, annual, note, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--ai-surface, #F0EFFF)' : 'var(--bg-muted)',
      border: `1px solid ${accent ? 'var(--ai-primary, #6366F1)' : 'var(--border-subtle)'}`,
      borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: accent ? 'var(--ai-primary, #6366F1)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
        {note && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{note}</div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: accent ? 20 : 15, fontWeight: 700, color: accent ? 'var(--ai-primary, #6366F1)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(monthly)}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginLeft: 3 }}>/mo</span></div>
        {annual > 0 && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{fmt(annual)}/yr</div>}
      </div>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
      {label && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
    </div>
  );
}

// ─── W-2 Employment ───────────────────────────────────────────────────────────
function calcW2(d) {
  const base = d.payType === 'annual'
    ? parse(d.baseSalary) / 12
    : d.payType === 'hourly'
      ? parse(d.hourlyRate) * parse(d.hoursPerWeek) * (parse(d.weeksPerYear) || 52) / 12
      : parse(d.baseSalary) / 12;

  const overtimeMethod = d.overtimeMethod;
  const overtime = overtimeMethod === 'ytd'
    ? (parse(d.ytdOvertime) / Math.max(1, parse(d.ytdMonths)))
    : ((parse(d.yr1Overtime) + parse(d.yr2Overtime)) / 24);

  const bonusMethod = d.bonusMethod;
  const bonus = bonusMethod === 'ytd'
    ? (parse(d.ytdBonus) / Math.max(1, parse(d.ytdMonths)))
    : ((parse(d.yr1Bonus) + parse(d.yr2Bonus)) / 24);

  const commMethod = d.commissionMethod;
  const commission = commMethod === 'ytd'
    ? (parse(d.ytdCommission) / Math.max(1, parse(d.ytdMonths)))
    : ((parse(d.yr1Commission) + parse(d.yr2Commission)) / 24);

  const qualifying = base + overtime + bonus + commission;
  return { base, overtime, bonus, commission, qualifying };
}

function W2Form({ data, onChange }) {
  const r = calcW2(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Employer */}
      <Field label="Employer / Company">
        <input
          value={data.employer || ''}
          onChange={e => set('employer', e.target.value)}
          placeholder="Acme Corporation"
          style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--bg-surface)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </Field>

      {/* Pay type + base */}
      <Field label="Pay Type">
        <SelectInput value={data.payType || 'annual'} onChange={v => set('payType', v)} options={[
          { value: 'annual', label: 'Salaried (annual)' },
          { value: 'hourly', label: 'Hourly' },
        ]}/>
      </Field>

      {data.payType === 'hourly' ? (
        <Row>
          <Field label="Hourly Rate"><CurrencyInput value={data.hourlyRate || ''} onChange={v => set('hourlyRate', v)} placeholder="35.00"/></Field>
          <Field label="Hours/Week">
            <input value={data.hoursPerWeek || ''} onChange={e => set('hoursPerWeek', e.target.value)} placeholder="40"
              style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
          </Field>
        </Row>
      ) : (
        <Field label="Base Annual Salary"><CurrencyInput value={data.baseSalary || ''} onChange={v => set('baseSalary', v)} placeholder="85,000"/></Field>
      )}

      <QualifyingResult label="Base Qualifying Income" monthly={r.base} annual={r.base * 12}/>

      {/* Overtime */}
      <Divider label="Overtime"/>
      <Field label="Method">
        <SelectInput value={data.overtimeMethod || 'avg'} onChange={v => set('overtimeMethod', v)} options={[
          { value: 'avg', label: '24-Month Average (Yr1 + Yr2)' },
          { value: 'ytd',  label: 'YTD Annualized' },
          { value: 'none', label: 'Not applicable' },
        ]}/>
      </Field>
      {data.overtimeMethod !== 'none' && (
        data.overtimeMethod === 'ytd' ? (
          <Row>
            <Field label="YTD Overtime"><CurrencyInput value={data.ytdOvertime || ''} onChange={v => set('ytdOvertime', v)} placeholder="0"/></Field>
            <Field label="YTD Months">
              <input value={data.ytdMonths || ''} onChange={e => set('ytdMonths', e.target.value)} placeholder="5"
                style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
            </Field>
          </Row>
        ) : (
          <Row>
            <Field label="Year 1 Overtime"><CurrencyInput value={data.yr1Overtime || ''} onChange={v => set('yr1Overtime', v)} placeholder="0"/></Field>
            <Field label="Year 2 Overtime"><CurrencyInput value={data.yr2Overtime || ''} onChange={v => set('yr2Overtime', v)} placeholder="0"/></Field>
          </Row>
        )
      )}

      {/* Bonus */}
      <Divider label="Bonus"/>
      <Field label="Method">
        <SelectInput value={data.bonusMethod || 'avg'} onChange={v => set('bonusMethod', v)} options={[
          { value: 'avg', label: '24-Month Average (Yr1 + Yr2)' },
          { value: 'ytd',  label: 'YTD Annualized' },
          { value: 'none', label: 'Not applicable' },
        ]}/>
      </Field>
      {data.bonusMethod !== 'none' && (
        data.bonusMethod === 'ytd' ? (
          <Row>
            <Field label="YTD Bonus"><CurrencyInput value={data.ytdBonus || ''} onChange={v => set('ytdBonus', v)} placeholder="0"/></Field>
            <Field label="YTD Months">
              <input value={data.ytdMonths || data.ytdMonths || ''} onChange={e => set('ytdMonths', e.target.value)} placeholder="5"
                style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
            </Field>
          </Row>
        ) : (
          <Row>
            <Field label="Year 1 Bonus"><CurrencyInput value={data.yr1Bonus || ''} onChange={v => set('yr1Bonus', v)} placeholder="0"/></Field>
            <Field label="Year 2 Bonus"><CurrencyInput value={data.yr2Bonus || ''} onChange={v => set('yr2Bonus', v)} placeholder="0"/></Field>
          </Row>
        )
      )}

      {/* Commission */}
      <Divider label="Commission"/>
      <Field label="Method">
        <SelectInput value={data.commissionMethod || 'none'} onChange={v => set('commissionMethod', v)} options={[
          { value: 'none', label: 'Not applicable' },
          { value: 'avg', label: '24-Month Average (Yr1 + Yr2)' },
          { value: 'ytd',  label: 'YTD Annualized' },
        ]}/>
      </Field>
      {data.commissionMethod !== 'none' && (
        data.commissionMethod === 'ytd' ? (
          <Row>
            <Field label="YTD Commission"><CurrencyInput value={data.ytdCommission || ''} onChange={v => set('ytdCommission', v)} placeholder="0"/></Field>
            <Field label="YTD Months">
              <input value={data.ytdMonths || ''} onChange={e => set('ytdMonths', e.target.value)} placeholder="5"
                style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
            </Field>
          </Row>
        ) : (
          <Row>
            <Field label="Year 1 Commission"><CurrencyInput value={data.yr1Commission || ''} onChange={v => set('yr1Commission', v)} placeholder="0"/></Field>
            <Field label="Year 2 Commission"><CurrencyInput value={data.yr2Commission || ''} onChange={v => set('yr2Commission', v)} placeholder="0"/></Field>
          </Row>
        )
      )}

      <Divider/>
      <QualifyingResult label="Total Qualifying (W-2)" monthly={r.qualifying} annual={r.qualifying * 12} accent/>
    </div>
  );
}

// ─── Self-Employed (1084-style) ───────────────────────────────────────────────
function calcSelfEmployed(d) {
  const yr1 = parse(d.yr1Net) + parse(d.yr1Depreciation) + parse(d.yr1Depletion) + parse(d.yr1Amortization) + parse(d.yr1MileageHome) - parse(d.yr1BusinessUseHome);
  const yr2 = parse(d.yr2Net) + parse(d.yr2Depreciation) + parse(d.yr2Depletion) + parse(d.yr2Amortization) + parse(d.yr2MileageHome) - parse(d.yr2BusinessUseHome);
  const ownership = Math.min(100, Math.max(0, parse(d.ownership) || 100)) / 100;
  const avg = ((yr1 + yr2) / 24) * ownership;
  return { yr1, yr2, avg, ownership: ownership * 100 };
}

function SelfEmployedForm({ data, onChange }) {
  const r = calcSelfEmployed(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Business Name">
          <input value={data.businessName || ''} onChange={e => set('businessName', e.target.value)} placeholder="Business Name"
            style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
        </Field>
        <Field label="Ownership %" hint="for qualifying">
          <input value={data.ownership || ''} onChange={e => set('ownership', e.target.value)} placeholder="100"
            style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
        </Field>
      </Row>

      <Field label="Entity Type">
        <SelectInput value={data.entityType || 'schedule_c'} onChange={v => set('entityType', v)} options={[
          { value: 'schedule_c', label: 'Sole Proprietor (Schedule C)' },
          { value: 's_corp',     label: 'S-Corporation (1120-S)' },
          { value: 'partnership',label: 'Partnership (1065 / K-1)' },
          { value: 'c_corp',     label: 'C-Corporation (1120)' },
        ]}/>
      </Field>

      <Divider label="Year 1 (most recent)"/>
      <Row>
        <Field label="Net Profit/Loss"><CurrencyInput value={data.yr1Net || ''} onChange={v => set('yr1Net', v)} placeholder="0"/></Field>
        <Field label="Depreciation"><CurrencyInput value={data.yr1Depreciation || ''} onChange={v => set('yr1Depreciation', v)} placeholder="0"/></Field>
      </Row>
      <Row>
        <Field label="Depletion"><CurrencyInput value={data.yr1Depletion || ''} onChange={v => set('yr1Depletion', v)} placeholder="0"/></Field>
        <Field label="Amortization"><CurrencyInput value={data.yr1Amortization || ''} onChange={v => set('yr1Amortization', v)} placeholder="0"/></Field>
      </Row>
      <Row>
        <Field label="Mileage/Home Office Add-back"><CurrencyInput value={data.yr1MileageHome || ''} onChange={v => set('yr1MileageHome', v)} placeholder="0"/></Field>
        <Field label="Business Use of Home (deduct)"><CurrencyInput value={data.yr1BusinessUseHome || ''} onChange={v => set('yr1BusinessUseHome', v)} placeholder="0"/></Field>
      </Row>
      <QualifyingResult label="Year 1 Adjusted" monthly={r.yr1 / 12} annual={r.yr1}/>

      <Divider label="Year 2 (prior year)"/>
      <Row>
        <Field label="Net Profit/Loss"><CurrencyInput value={data.yr2Net || ''} onChange={v => set('yr2Net', v)} placeholder="0"/></Field>
        <Field label="Depreciation"><CurrencyInput value={data.yr2Depreciation || ''} onChange={v => set('yr2Depreciation', v)} placeholder="0"/></Field>
      </Row>
      <Row>
        <Field label="Depletion"><CurrencyInput value={data.yr2Depletion || ''} onChange={v => set('yr2Depletion', v)} placeholder="0"/></Field>
        <Field label="Amortization"><CurrencyInput value={data.yr2Amortization || ''} onChange={v => set('yr2Amortization', v)} placeholder="0"/></Field>
      </Row>
      <Row>
        <Field label="Mileage/Home Office Add-back"><CurrencyInput value={data.yr2MileageHome || ''} onChange={v => set('yr2MileageHome', v)} placeholder="0"/></Field>
        <Field label="Business Use of Home (deduct)"><CurrencyInput value={data.yr2BusinessUseHome || ''} onChange={v => set('yr2BusinessUseHome', v)} placeholder="0"/></Field>
      </Row>
      <QualifyingResult label="Year 2 Adjusted" monthly={r.yr2 / 12} annual={r.yr2}/>

      <Divider/>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', borderRadius: 6, padding: '7px 10px' }}>
        24-month average × {r.ownership.toFixed(0)}% ownership = qualifying income
      </div>
      <QualifyingResult label="Total Qualifying (Self-Employed)" monthly={r.avg} annual={r.avg * 12} accent/>
    </div>
  );
}

// ─── Rental Income (Schedule E) ───────────────────────────────────────────────
function calcRental(d) {
  const grossRent = parse(d.grossRent);
  const vacancyFactor = parse(d.vacancyFactor) || 25;
  const taxes = parse(d.taxes);
  const insurance = parse(d.insurance);
  const hoa = parse(d.hoa);
  const maintenance = parse(d.maintenance);
  const mortgage = parse(d.mortgage);
  const netAnnual = (grossRent * 12 * (1 - vacancyFactor / 100)) - taxes - insurance - hoa * 12 - maintenance - mortgage * 12;
  const qualifying = netAnnual > 0 ? netAnnual / 12 : 0;
  return { grossRent, netAnnual, qualifying };
}

function RentalForm({ data, onChange }) {
  const r = calcRental(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Property Address">
        <input value={data.address || ''} onChange={e => set('address', e.target.value)} placeholder="123 Oak Street, Denver CO"
          style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
      </Field>

      <Row>
        <Field label="Gross Monthly Rent"><CurrencyInput value={data.grossRent || ''} onChange={v => set('grossRent', v)} placeholder="2,400"/></Field>
        <Field label="Vacancy Factor %" hint="Fannie = 25%">
          <input value={data.vacancyFactor || ''} onChange={e => set('vacancyFactor', e.target.value)} placeholder="25"
            style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
        </Field>
      </Row>

      <Divider label="Annual Expenses"/>
      <Row>
        <Field label="Property Taxes (annual)"><CurrencyInput value={data.taxes || ''} onChange={v => set('taxes', v)} placeholder="0"/></Field>
        <Field label="Insurance (annual)"><CurrencyInput value={data.insurance || ''} onChange={v => set('insurance', v)} placeholder="0"/></Field>
      </Row>
      <Row>
        <Field label="HOA (monthly)"><CurrencyInput value={data.hoa || ''} onChange={v => set('hoa', v)} placeholder="0"/></Field>
        <Field label="Maintenance (annual)"><CurrencyInput value={data.maintenance || ''} onChange={v => set('maintenance', v)} placeholder="0"/></Field>
      </Row>
      <Field label="Mortgage Payment (monthly, if applicable)"><CurrencyInput value={data.mortgage || ''} onChange={v => set('mortgage', v)} placeholder="0"/></Field>

      <Divider/>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', borderRadius: 6, padding: '7px 10px' }}>
        Net rental = Gross × (1 − vacancy%) − annual expenses. Only positive net qualifies.
      </div>
      <QualifyingResult
        label="Net Qualifying Rental"
        monthly={r.qualifying}
        annual={r.qualifying * 12}
        note={r.netAnnual <= 0 ? 'Negative net — not included in qualifying income' : undefined}
        accent
      />
    </div>
  );
}

// ─── Retirement / Pension ─────────────────────────────────────────────────────
function calcRetirement(d) {
  const monthly = parse(d.monthly);
  const grossUp = d.taxable === 'false' ? monthly * 1.25 : monthly;
  return { monthly, grossUp };
}

function RetirementForm({ data, onChange }) {
  const r = calcRetirement(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Source">
        <input value={data.source || ''} onChange={e => set('source', e.target.value)} placeholder="401(k), IRA, Pension, etc."
          style={{ width: '100%', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border-subtle)', borderRadius: 6, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-surface)', boxSizing: 'border-box' }}/>
      </Field>
      <Field label="Monthly Distribution"><CurrencyInput value={data.monthly || ''} onChange={v => set('monthly', v)} placeholder="0"/></Field>
      <Field label="Is income taxable?">
        <SelectInput value={data.taxable ?? 'true'} onChange={v => set('taxable', v)} options={[
          { value: 'true',  label: 'Yes — taxable (no gross-up)' },
          { value: 'false', label: 'No — non-taxable (gross up 1.25×)' },
        ]}/>
      </Field>
      {data.taxable === 'false' && (
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', borderRadius: 6, padding: '7px 10px' }}>
          Non-taxable income can be grossed up 1.25× per Fannie/Freddie guidelines.
        </div>
      )}
      <QualifyingResult label="Total Qualifying (Retirement)" monthly={r.grossUp} annual={r.grossUp * 12} note={data.taxable === 'false' ? `Grossed up from ${fmt(r.monthly)}/mo` : undefined} accent/>
    </div>
  );
}

// ─── Social Security ──────────────────────────────────────────────────────────
function calcSS(d) {
  const monthly = parse(d.monthly);
  const grossUp = d.taxable === 'false' ? monthly * 1.25 : monthly;
  return { monthly, grossUp };
}

function SocialSecurityForm({ data, onChange }) {
  const r = calcSS(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Benefit Type">
        <SelectInput value={data.benefitType || 'retirement'} onChange={v => set('benefitType', v)} options={[
          { value: 'retirement', label: 'Retirement' },
          { value: 'disability', label: 'SSDI / Disability' },
          { value: 'survivor',   label: 'Survivor Benefits' },
          { value: 'ssi',        label: 'SSI' },
        ]}/>
      </Field>
      <Field label="Monthly Benefit"><CurrencyInput value={data.monthly || ''} onChange={v => set('monthly', v)} placeholder="0"/></Field>
      <Field label="Is benefit taxable?">
        <SelectInput value={data.taxable ?? 'false'} onChange={v => set('taxable', v)} options={[
          { value: 'false', label: 'No — non-taxable (gross up 1.25×)' },
          { value: 'true',  label: 'Yes — taxable (no gross-up)' },
        ]}/>
      </Field>
      {data.taxable === 'false' && (
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-muted)', borderRadius: 6, padding: '7px 10px' }}>
          Social Security is commonly non-taxable — grossed up 1.25× per Fannie/Freddie guidelines.
        </div>
      )}
      <QualifyingResult label="Total Qualifying (SS)" monthly={r.grossUp} annual={r.grossUp * 12} note={data.taxable === 'false' ? `Grossed up from ${fmt(r.monthly)}/mo` : undefined} accent/>
    </div>
  );
}

// ─── Other Income ─────────────────────────────────────────────────────────────
function calcOther(d) {
  return { qualifying: parse(d.monthly) };
}

function OtherForm({ data, onChange }) {
  const r = calcOther(data);
  const set = (k, v) => onChange({ ...data, [k]: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Row>
        <Field label="Income Type">
          <SelectInput value={data.otherType || 'alimony'} onChange={v => set('otherType', v)} options={[
            { value: 'alimony',        label: 'Alimony / Spousal Support' },
            { value: 'child_support',  label: 'Child Support' },
            { value: 'va_disability',  label: 'VA / Military Disability' },
            { value: 'foster_care',    label: 'Foster Care' },
            { value: 'trust',          label: 'Trust Income' },
            { value: 'royalties',      label: 'Royalties' },
            { value: 'note_receivable',label: 'Note Receivable' },
            { value: 'other',          label: 'Other' },
          ]}/>
        </Field>
        <Field label="Continuance" hint="required">
          <SelectInput value={data.continuance || '3yr'} onChange={v => set('continuance', v)} options={[
            { value: '3yr',      label: '3+ years documented' },
            { value: '1_3yr',    label: '1–3 years remaining' },
            { value: 'less_1yr', label: 'Less than 1 year' },
          ]}/>
        </Field>
      </Row>
      {data.continuance === 'less_1yr' && (
        <div style={{ fontSize: 12, color: '#B03025', background: '#FEF0ED', borderRadius: 6, padding: '7px 10px' }}>
          Income with less than 1 year continuance typically cannot be used for qualifying.
        </div>
      )}
      <Field label="Monthly Amount"><CurrencyInput value={data.monthly || ''} onChange={v => set('monthly', v)} placeholder="0"/></Field>
      <QualifyingResult
        label="Total Qualifying (Other)"
        monthly={data.continuance === 'less_1yr' ? 0 : r.qualifying}
        annual={data.continuance === 'less_1yr' ? 0 : r.qualifying * 12}
        note={data.continuance === 'less_1yr' ? 'Excluded — insufficient continuance' : undefined}
        accent
      />
    </div>
  );
}

// ─── Source card ──────────────────────────────────────────────────────────────
function getQualifyingMonthly(type, data) {
  if (!data) return 0;
  if (type === 'w2') return calcW2(data).qualifying;
  if (type === 'selfemployed') return calcSelfEmployed(data).avg;
  if (type === 'rental') return calcRental(data).qualifying;
  if (type === 'retirement') return calcRetirement(data).grossUp;
  if (type === 'socialsec') return calcSS(data).grossUp;
  if (type === 'other') return data.continuance === 'less_1yr' ? 0 : calcOther(data).qualifying;
  return 0;
}

function SourceCard({ typeId, data, onChange, onRemove, defaultOpen }) {
  const [open, setOpen] = React.useState(defaultOpen ?? true);
  const typeMeta = INCOME_TYPES.find(t => t.id === typeId);
  const qualifying = getQualifyingMonthly(typeId, data);

  return (
    <div style={{
      border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden',
      background: 'var(--bg-surface)',
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          width: 28, height: 28, borderRadius: 7, background: typeMeta?.color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={typeMeta?.icon || 'circle'} size={14} color={typeMeta?.color}/>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{typeMeta?.label}</div>
          {data?.employer && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{data.employer}</div>}
          {data?.businessName && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{data.businessName}</div>}
        </div>
        <div style={{ textAlign: 'right', marginRight: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(qualifying)}/mo</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{fmt(qualifying * 12)}/yr</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          title="Remove income source"
        >
          <Icon name="x" size={13} color="var(--text-tertiary)"/>
        </button>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} color="var(--text-tertiary)"/>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ height: 14 }}/>
          {typeId === 'w2' && <W2Form data={data || {}} onChange={onChange}/>}
          {typeId === 'selfemployed' && <SelfEmployedForm data={data || {}} onChange={onChange}/>}
          {typeId === 'rental' && <RentalForm data={data || {}} onChange={onChange}/>}
          {typeId === 'retirement' && <RetirementForm data={data || {}} onChange={onChange}/>}
          {typeId === 'socialsec' && <SocialSecurityForm data={data || {}} onChange={onChange}/>}
          {typeId === 'other' && <OtherForm data={data || {}} onChange={onChange}/>}
        </div>
      )}
    </div>
  );
}

// ─── Add income source picker ─────────────────────────────────────────────────
function AddSourcePicker({ onAdd }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '9px 14px', border: '1.5px dashed var(--border-subtle)', borderRadius: 10,
          background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ai-primary, #6366F1)'; e.currentTarget.style.color = 'var(--ai-primary, #6366F1)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <Icon name="plus" size={14}/> Add Income Source
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden',
        }}>
          {INCOME_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => { onAdd(t.id); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 6, background: t.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={t.icon} size={13} color={t.color}/>
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Borrower tab panel ───────────────────────────────────────────────────────
function BorrowerPanel({ sources, onSourcesChange }) {
  const addSource = (typeId) => {
    onSourcesChange([...sources, { id: Date.now(), type: typeId, data: {} }]);
  };
  const removeSource = (id) => onSourcesChange(sources.filter(s => s.id !== id));
  const updateSource = (id, data) => onSourcesChange(sources.map(s => s.id === id ? { ...s, data } : s));

  const totalMonthly = sources.reduce((acc, s) => acc + getQualifyingMonthly(s.type, s.data), 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sources.map((s, i) => (
        <SourceCard
          key={s.id}
          typeId={s.type}
          data={s.data}
          onChange={data => updateSource(s.id, data)}
          onRemove={() => removeSource(s.id)}
          defaultOpen={i === 0}
        />
      ))}
      <AddSourcePicker onAdd={addSource}/>
      {sources.length > 0 && (
        <QualifyingResult
          label="Total Qualifying Income"
          monthly={totalMonthly}
          annual={totalAnnual}
          accent
        />
      )}
    </div>
  );
}

// ─── Default data for the demo loan ──────────────────────────────────────────
const DEFAULT_BORROWER_SOURCES = [
  {
    id: 1,
    type: 'w2',
    data: {
      employer: 'Meridian Health Group',
      payType: 'annual',
      baseSalary: '92000',
      overtimeMethod: 'avg',
      yr1Overtime: '4200',
      yr2Overtime: '3800',
      bonusMethod: 'avg',
      yr1Bonus: '5000',
      yr2Bonus: '4500',
      commissionMethod: 'none',
    },
  },
];

const DEFAULT_COBORROWER_SOURCES = [
  {
    id: 2,
    type: 'w2',
    data: {
      employer: 'Denver Public Schools',
      payType: 'annual',
      baseSalary: '64000',
      overtimeMethod: 'none',
      bonusMethod: 'none',
      commissionMethod: 'none',
    },
  },
];

// ─── Summary sidebar ──────────────────────────────────────────────────────────
function SummaryPanel({ borrowerSources, coBorrowerSources, loanAmount }) {
  const bTotal = borrowerSources.reduce((acc, s) => acc + getQualifyingMonthly(s.type, s.data), 0);
  const cTotal = coBorrowerSources.reduce((acc, s) => acc + getQualifyingMonthly(s.type, s.data), 0);
  const combined = bTotal + cTotal;
  const loanAmt = parse(loanAmount) || 400000;
  // Estimated PITIA at ~7% 30yr
  const rate = 0.07 / 12;
  const n = 360;
  const pi = loanAmt * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  const estimatedPITIA = pi + 625; // + taxes + insurance estimate
  const frontDTI = combined > 0 ? (estimatedPITIA / combined * 100) : 0;
  // Back DTI assumes $500 in other obligations
  const backDTI = combined > 0 ? ((estimatedPITIA + 500) / combined * 100) : 0;

  const dtiColor = (pct) => pct <= 36 ? '#059669' : pct <= 43 ? '#D97706' : '#B03025';
  const dtiBg = (pct) => pct <= 36 ? '#F0FDF4' : pct <= 43 ? '#FEF7E8' : '#FEF0ED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Summary</div>

      {/* Income breakdown */}
      <div style={{ background: 'var(--bg-muted)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        {[
          { label: 'Borrower', monthly: bTotal },
          { label: 'Co-Borrower', monthly: cTotal },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(row.monthly)}/mo</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface)' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>Combined</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ai-primary, #6366F1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(combined)}/mo</span>
        </div>
      </div>

      {/* Annual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'var(--bg-muted)', borderRadius: 7, border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Annual (combined)</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(combined * 12)}</span>
      </div>

      <div style={{ height: 4 }}/>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>DTI Estimate</div>

      {/* Front / Back DTI */}
      {[
        { label: 'Front-end DTI', pct: frontDTI, note: 'Housing payment only' },
        { label: 'Back-end DTI', pct: backDTI, note: 'All obligations' },
      ].map(row => (
        <div key={row.label} style={{ background: dtiBg(row.pct), border: `1px solid ${dtiColor(row.pct)}30`, borderRadius: 8, padding: '9px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{row.note}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: dtiColor(row.pct), fontVariantNumeric: 'tabular-nums' }}>
              {combined > 0 ? row.pct.toFixed(1) + '%' : '—'}
            </div>
          </div>
          {combined > 0 && (
            <div style={{ marginTop: 7, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, row.pct)}%`, background: dtiColor(row.pct), borderRadius: 999, transition: 'width 0.3s' }}/>
            </div>
          )}
        </div>
      ))}

      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5, marginTop: 2 }}>
        DTI estimate uses $500/mo in assumed obligations. Based on {fmt(loanAmount || 400000)} loan at 7% / 30yr.
      </div>

      {/* Source breakdown */}
      {[...borrowerSources, ...coBorrowerSources].length > 0 && (
        <>
          <div style={{ height: 4 }}/>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Source Breakdown</div>
          <div style={{ background: 'var(--bg-muted)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            {[...borrowerSources, ...coBorrowerSources].map((s, i) => {
              const m = getQualifyingMonthly(s.type, s.data);
              const typeMeta = INCOME_TYPES.find(t => t.id === s.type);
              const pct = combined > 0 ? (m / combined * 100) : 0;
              return (
                <div key={s.id} style={{ padding: '8px 12px', borderBottom: i < borrowerSources.length + coBorrowerSources.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: typeMeta?.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{typeMeta?.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(m)}/mo</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: typeMeta?.color, borderRadius: 999 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IncomeTool({ loanId, borrowerName }) {
  const [activeTab, setActiveTab] = React.useState('borrower');
  const [borrowerSources, setBorrowerSources] = React.useState(DEFAULT_BORROWER_SOURCES);
  const [coBorrowerSources, setCoBorrowerSources] = React.useState(DEFAULT_COBORROWER_SOURCES);
  const [loanAmount, setLoanAmount] = React.useState('400000');

  const bTotal = borrowerSources.reduce((acc, s) => acc + getQualifyingMonthly(s.type, s.data), 0);
  const cTotal = coBorrowerSources.reduce((acc, s) => acc + getQualifyingMonthly(s.type, s.data), 0);
  const combined = bTotal + cTotal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-canvas, #F8F8F6)', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--ai-surface, #F0EFFF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="calculator" size={16} color="var(--ai-primary, #6366F1)"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Income Calculator</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{borrowerName || 'Borrower'} · {loanId}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Combined qualifying:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ai-primary, #6366F1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(combined)}/mo</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Left: input area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '0 20px', flexShrink: 0 }}>
            {[
              { id: 'borrower', label: `Borrower`, sub: fmt(bTotal) + '/mo' },
              { id: 'coborrower', label: 'Co-Borrower', sub: fmt(cTotal) + '/mo' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid var(--ai-primary, #6366F1)' : '2px solid transparent',
                  marginBottom: -1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 500, color: activeTab === tab.id ? 'var(--ai-primary, #6366F1)' : 'var(--text-secondary)' }}>{tab.label}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: activeTab === tab.id ? 'var(--ai-primary, #6366F1)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{tab.sub}</span>
              </button>
            ))}
          </div>

          {/* Scrollable sources */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTab === 'borrower' && (
              <BorrowerPanel sources={borrowerSources} onSourcesChange={setBorrowerSources}/>
            )}
            {activeTab === 'coborrower' && (
              <BorrowerPanel sources={coBorrowerSources} onSourcesChange={setCoBorrowerSources}/>
            )}
          </div>
        </div>

        {/* Right: summary sidebar */}
        <div style={{
          width: 260, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)', overflowY: 'auto', padding: '18px 16px',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* Loan amount for DTI */}
          <div style={{ marginBottom: 14 }}>
            <Label>Loan Amount</Label>
            <CurrencyInput value={loanAmount} onChange={setLoanAmount} placeholder="400,000"/>
          </div>
          <SummaryPanel borrowerSources={borrowerSources} coBorrowerSources={coBorrowerSources} loanAmount={loanAmount}/>
        </div>
      </div>
    </div>
  );
}
