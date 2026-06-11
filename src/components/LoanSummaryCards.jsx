import React from 'react';
import { Icon } from './Icon';

// ── Helpers ─────────────────────────────────────────────────────────────────
function ficoTier(fico) {
  if (fico == null) return { label: 'Unknown', tone: 'neutral', note: 'No score on file' };
  if (fico >= 760) return { label: 'Excellent', tone: 'green',   note: 'Top-tier pricing eligible' };
  if (fico >= 720) return { label: 'Very Good', tone: 'green',   note: 'Strong pricing eligible' };
  if (fico >= 680) return { label: 'Good',      tone: 'green',   note: 'Standard pricing' };
  if (fico >= 640) return { label: 'Fair',      tone: 'amber',   note: 'Pricing adjustments likely' };
  return { label: 'Poor', tone: 'red', note: 'Limited product eligibility' };
}

function dtiTone(dti) {
  if (dti == null) return { tone: 'neutral', note: '—' };
  if (dti >= 45) return { tone: 'red',   note: 'Exceeds limit — escalate' };
  if (dti >= 43) return { tone: 'red',   note: 'Tight — review' };
  if (dti >= 36) return { tone: 'amber', note: 'Within standard guidelines' };
  return { tone: 'green', note: 'Comfortable margin' };
}

function lockTone(loan) {
  if (!loan?.lockStatus || loan.lockStatus === 'Floating') return { label: 'FLOATING', tone: 'neutral' };
  if (loan.lockStatus === 'Expiring' || (loan.lockDays != null && loan.lockDays <= 3)) {
    return { label: `EXP. ${loan.lockDays}D`, tone: 'red' };
  }
  return { label: `${loan.lockDays}D LOCK`, tone: 'ai' };
}

function ausEngineLabel(aus) {
  if (!aus) return 'Not yet run';
  if (/^DU/i.test(aus)) return 'via Desktop Underwriter';
  if (/^LP/i.test(aus)) return 'via Loan Product Advisor';
  return 'via Manual UW';
}

function ausResultLabel(aus) {
  if (!aus) return 'Pending';
  if (/Approve/i.test(aus)) return 'Approve / Eligible';
  if (/Refer/i.test(aus))   return 'Refer with Caution';
  if (/Manual/i.test(aus))  return 'Manual Review';
  return aus;
}

function ausResultTone(aus) {
  if (!aus) return 'neutral';
  if (/Approve/i.test(aus)) return 'green';
  if (/Refer/i.test(aus))   return 'amber';
  return 'neutral';
}

function buildFindings(loan) {
  // 4 standard categories — derived from the loan's AUS + conditions state
  const allClear = loan?.aus && /Approve/i.test(loan.aus);
  const refer    = loan?.aus && /Refer/i.test(loan.aus);
  const hasOpen  = (loan?.conditionsOpen || 0) > 0;

  return [
    { label: 'Income calculation',     status: refer ? 'review' : 'ok' },
    { label: 'Asset reserves',         status: 'ok' },
    { label: 'Outstanding conditions', status: hasOpen ? 'review' : 'ok' },
    { label: 'Credit eligibility',     status: allClear || !loan?.aus ? 'ok' : 'review' },
  ];
}

function parseTerm(product) {
  if (!product) return null;
  const m = product.match(/(\d+)\s*yr/i);
  return m ? `${m[1]} yr` : null;
}

function formatDate(iso) {
  if (!iso) return '—';
  // ISO YYYY-MM-DD → MM/DD/YY
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y.slice(2)}`;
}

function formatAmount(n) {
  if (n == null) return '—';
  return `$${n.toLocaleString('en-US')}`;
}

// ── Shared bits ─────────────────────────────────────────────────────────────
function Badge({ tone = 'neutral', icon, children }) {
  const map = {
    green:   { bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
    amber:   { bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
    red:     { bg: 'var(--status-red-bg)',   fg: 'var(--status-red)'   },
    ai:      { bg: 'var(--ai-bg, #F4F1FE)',  fg: 'var(--ai-ink, #3F2FBF)' },
    neutral: { bg: 'var(--bg-muted)',        fg: 'var(--text-secondary)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: map.bg, color: map.fg,
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {icon && <Icon name={icon} size={10} color={map.fg} strokeWidth={2.2}/>}
      {children}
    </span>
  );
}

function CardHeader({ icon, iconBg, title, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        background: iconBg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={14} color="var(--text-secondary)"/>
      </span>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      {right}
    </div>
  );
}

function CardLink({ icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
        color: 'var(--ai-primary, #6E59E8)', padding: 0,
      }}
    >
      {icon && <Icon name={icon} size={11}/>}
      {children}
    </button>
  );
}

// ── FicoDonut: 64px ring, stroke proportional to score (300-850) ───────────
function FicoDonut({ fico, tone }) {
  const min = 300, max = 850;
  const pct = fico == null ? 0 : Math.max(0, Math.min(1, (fico - min) / (max - min)));
  const size = 64, stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const color = tone === 'green' ? '#2C8F5A' : tone === 'amber' ? '#C97A1B' : tone === 'red' ? '#C2362A' : '#9AA0A6';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--bg-muted)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
    </svg>
  );
}

// ── Card 1: Credit Summary ─────────────────────────────────────────────────
function CreditCard({ loan }) {
  const credit = loan?.credit || {};
  const tier = ficoTier(credit.fico);
  const dti = dtiTone(loan?.dti);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <CardHeader
        icon="doc"
        iconBg="#EFEEFD"
        title="Credit Summary"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge tone={tier.tone} icon={tier.tone === 'green' ? 'check' : tier.tone === 'red' ? 'alertCircle' : null}>
              {tier.label}
            </Badge>
            <CardLink>View report</CardLink>
          </div>
        }
      />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Score row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <FicoDonut fico={credit.fico} tone={tier.tone}/>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {credit.fico ?? '—'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>MID</span>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
              FICO · Tri-merge · {formatDate(credit.pullDate)}
            </span>
          </div>
        </div>

        {/* Per-bureau row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'EQUIFAX',     score: credit.equifax },
            { label: 'EXPERIAN',    score: credit.experian },
            { label: 'TRANSUNION',  score: credit.transunion },
          ].map(b => (
            <div key={b.label}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>{b.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1, fontFamily: 'DM Sans' }}>
                {b.score ?? '—'}
              </div>
            </div>
          ))}
        </div>

        {/* DTI + Tier footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>DTI</div>
            <div style={{
              fontSize: 16, fontWeight: 600, marginTop: 2,
              color: dti.tone === 'red' ? 'var(--status-red)' : dti.tone === 'amber' ? 'var(--status-amber)' : 'var(--status-green)',
            }}>
              {loan?.dti != null ? `${loan.dti}%` : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{dti.note}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>TIER</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, color: 'var(--text-primary)' }}>
              {tier.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{tier.note}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card 2: AUS Results ────────────────────────────────────────────────────
function FindingRow({ label, status }) {
  const map = {
    ok:      { icon: 'checkCircle', color: 'var(--status-green)', label: 'OK',      tone: 'var(--status-green)' },
    review:  { icon: 'alertCircle', color: 'var(--status-amber)', label: 'REVIEW',  tone: 'var(--status-amber)' },
    pending: { icon: 'clock',       color: 'var(--text-tertiary)', label: 'PENDING', tone: 'var(--text-tertiary)' },
  }[status] || { icon: 'clock', color: 'var(--text-tertiary)', label: '—', tone: 'var(--text-tertiary)' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
      <Icon name={map.icon} size={13} color={map.color}/>
      <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: map.tone }}>{map.label}</span>
    </div>
  );
}

function AUSCard({ loan }) {
  const tone = ausResultTone(loan?.aus);
  const findings = buildFindings(loan);
  const pendingCount = findings.filter(f => f.status === 'review' || f.status === 'pending').length;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <CardHeader
        icon="checkCircle"
        iconBg="#E3F1E8"
        title="AUS Results"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge tone={tone} icon={tone === 'green' ? 'check' : tone === 'amber' ? 'alertCircle' : null}>
              {ausResultLabel(loan?.aus).split(' ')[0]}{tone === 'green' ? '/Eligible' : ''}
            </Badge>
            <CardLink icon="zap">Re-run</CardLink>
          </div>
        }
      />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
            color: tone === 'green' ? 'var(--status-green)' : tone === 'amber' ? 'var(--status-amber)' : 'var(--text-primary)',
          }}>
            {ausResultLabel(loan?.aus)}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{ausEngineLabel(loan?.aus)}</span>
        </div>

        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
          Last run {formatDate(loan?.credit?.pullDate)} · {findings.length} findings ({pendingCount} pending)
        </div>

        <div style={{ marginTop: 4 }}>
          {findings.map(f => <FindingRow key={f.label} label={f.label} status={f.status}/>)}
        </div>
      </div>
    </div>
  );
}

// ── Card 3: Loan Product ───────────────────────────────────────────────────
function ProductStat({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  );
}

function ProductCard({ loan }) {
  const lock = lockTone(loan);
  const term = parseTerm(loan?.product);
  const lockExpiresLine = loan?.lockDays != null
    ? `Lock expires in ${loan.lockDays}d`
    : loan?.lockStatus === 'Floating' ? 'Rate floating' : 'Not locked';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <CardHeader
        icon="dollar"
        iconBg="#FBEFE5"
        title="Loan Product"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge tone={lock.tone} icon="pin">{lock.label}</Badge>
            <CardLink>Compare</CardLink>
          </div>
        }
      />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Headline row: product + rate */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {loan?.product || '—'}
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{lockExpiresLine}</span>
          </div>
          <span style={{
            fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
            color: 'var(--ai-primary, #6E59E8)',
            fontFamily: 'DM Sans',
          }}>
            {loan?.rate != null ? `${loan.rate.toFixed(3)}%` : '—'}
          </span>
        </div>

        {/* 6-stat grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 12px',
          paddingTop: 10, borderTop: '1px solid var(--border-subtle)',
        }}>
          <ProductStat label="Loan amount" value={formatAmount(loan?.amount)}/>
          <ProductStat label="LTV"         value={loan?.ltv != null ? `${loan.ltv}%` : '—'}/>
          <ProductStat label="Points"      value={loan?.points != null ? loan.points.toFixed(2).replace(/\.?0+$/, '') || '0' : '—'}/>
          <ProductStat label="Term"        value={term || '—'}/>
          <ProductStat label="Est. P&I"    value={loan?.estPI != null ? `$${loan.estPI.toLocaleString('en-US')}/mo` : '—'}/>
          <ProductStat label="Est. close"  value={formatDate(loan?.closingDate)}/>
        </div>
      </div>
    </div>
  );
}

// ── Public: the 3-card row ─────────────────────────────────────────────────
export function LoanSummaryCards({ loan, meta }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: 12,
      marginBottom: 20,
    }}>
      <CreditCard loan={loan} meta={meta}/>
      <AUSCard loan={loan} meta={meta}/>
      <ProductCard loan={loan} meta={meta}/>
    </div>
  );
}

export default LoanSummaryCards;
