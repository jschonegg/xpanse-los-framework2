import React from 'react';
import { Icon } from '../components/Icon';

const S = {
  wrap: { flex: 1, overflow: 'auto', background: 'var(--bg-app)', padding: '32px 40px 64px' },
  inner: { maxWidth: 880, margin: '0 auto' },
  greeting: { fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: 4 },
  sub: { fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 },

  prequal: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 24, boxShadow: 'var(--shadow-xs)' },
  prequalHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  prequalLabel: { fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  activeBadge: { background: 'var(--success-soft)', color: 'var(--success)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--r-full)' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  metricCard: { background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', padding: '14px 16px' },
  metricLabel: { fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 },
  metricVal: { fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 500, color: 'var(--text-primary)' },
  metricSub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  expire: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', marginTop: 16 },

  journey: { marginBottom: 24 },
  journeyTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 },
  steps: { display: 'flex', alignItems: 'flex-start', position: 'relative' },
  step: { flex: 1, textAlign: 'center', position: 'relative' },
  dotDone: { width: 32, height: 32, borderRadius: '50%', background: 'var(--success-soft)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', position: 'relative', zIndex: 2 },
  dotActive: { width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary)', border: '2px solid var(--brand-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', position: 'relative', zIndex: 2 },
  dotUpcoming: { width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-sunken)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', position: 'relative', zIndex: 2 },
  stepLabel: { fontSize: 12, color: 'var(--text-tertiary)' },
  stepLabelActive: { fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 },
  connector: { position: 'absolute', top: 16, left: 'calc(50% + 20px)', right: 'calc(-50% + 20px)', height: 2, background: 'var(--border-subtle)', zIndex: 1 },
  connectorDone: { position: 'absolute', top: 16, left: 'calc(50% + 20px)', right: 'calc(-50% + 20px)', height: 2, background: 'var(--success)', zIndex: 1 },

  cta: { background: 'var(--bg-surface)', border: '2px solid var(--brand-primary-border)', borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' },
  ctaIcon: { width: 48, height: 48, borderRadius: '50%', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ctaText: { flex: 1 },
  ctaTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, marginBottom: 2, color: 'var(--text-primary)' },
  ctaDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)', padding: '16px 20px', boxShadow: 'var(--shadow-xs)' },
  cardTitle: { fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 },

  docItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' },
  docItemLast: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
  docIcon: (bg, color) => ({ width: 28, height: 28, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }),
  docName: { fontSize: 13, flex: 1, color: 'var(--text-primary)' },
  docTag: (bg, color) => ({ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', fontWeight: 600, background: bg, color }),
  uploadZone: { border: '1.5px dashed var(--border-default)', borderRadius: 'var(--r-sm)', padding: 14, textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer' },

  loInfo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  loAvatar: { width: 44, height: 44, borderRadius: '50%', background: 'var(--brand-primary-soft)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15, flexShrink: 0, fontFamily: "'DM Sans', sans-serif" },
  loName: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  loRole: { fontSize: 12, color: 'var(--text-tertiary)' },
  loDetail: { fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0' },
  loActions: { display: 'flex', gap: 8, marginTop: 12 },

  timeline: { display: 'flex', gap: 12, padding: '6px 0' },
  tlDotWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tlDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', flexShrink: 0, marginTop: 5 },
  tlLine: { width: 1, flex: 1, background: 'var(--border-subtle)', marginTop: 4 },
  tlText: { fontSize: 13, lineHeight: 1.4, color: 'var(--text-primary)' },
  tlDate: { color: 'var(--text-tertiary)', fontSize: 12 },

  tip: { background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 },
};

const JOURNEY_STEPS = [
  { label: 'Prequalified', icon: 'check', status: 'done' },
  { label: 'Application', icon: 'doc', status: 'active' },
  { label: 'Processing', icon: 'search', status: 'upcoming' },
  { label: 'Underwriting', icon: 'check', status: 'upcoming' },
  { label: 'Closing', icon: 'home', status: 'upcoming' },
];

const DOCS = [
  { name: 'Pay stubs (last 30 days)', icon: 'doc', required: true },
  { name: 'W-2s (last 2 years)', icon: 'doc', required: true },
  { name: 'Bank statements (2 months)', icon: 'doc', required: true },
  { name: 'Tax returns (if self-employed)', icon: 'doc', required: false },
];

export function ConsumerDashboard({ onStartApplication }) {
  return (
    <div style={S.wrap}>
      <div style={S.inner}>

        <h1 style={S.greeting}>Welcome back, Jordan</h1>
        <p style={S.sub}>You're prequalified — here's your snapshot and what comes next.</p>

        {/* ── Prequal summary ── */}
        <div style={S.prequal}>
          <div style={S.prequalHeader}>
            <Icon name="doc" size={16} color="var(--text-tertiary)" />
            <span style={S.prequalLabel}>Prequalification summary</span>
            <span style={S.activeBadge}>Active</span>
          </div>
          <div style={S.metrics}>
            <div style={S.metricCard}>
              <div style={S.metricLabel}>Approved up to</div>
              <div style={S.metricVal}>$425,000</div>
              <div style={S.metricSub}>Purchase price</div>
            </div>
            <div style={S.metricCard}>
              <div style={S.metricLabel}>Estimated rate</div>
              <div style={S.metricVal}>6.25%</div>
              <div style={S.metricSub}>30-yr fixed</div>
            </div>
            <div style={S.metricCard}>
              <div style={S.metricLabel}>Est. monthly</div>
              <div style={S.metricVal}>$2,617</div>
              <div style={S.metricSub}>Principal + interest</div>
            </div>
          </div>
          <div style={S.expire}>
            <Icon name="clock" size={14} color="var(--text-tertiary)" />
            Your prequalification is valid through August 14, 2026
          </div>
        </div>

        {/* ── Journey stepper ── */}
        <div style={S.journey}>
          <div style={S.journeyTitle}>Your loan journey</div>
          <div style={S.steps}>
            {JOURNEY_STEPS.map((s, i) => (
              <div key={i} style={S.step}>
                {i < JOURNEY_STEPS.length - 1 && (
                  <div style={s.status === 'done' ? S.connectorDone : S.connector} />
                )}
                <div style={s.status === 'done' ? S.dotDone : s.status === 'active' ? S.dotActive : S.dotUpcoming}>
                  <Icon name={s.icon} size={14} />
                </div>
                <div style={s.status === 'active' ? S.stepLabelActive : S.stepLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Primary CTA ── */}
        <div style={S.cta}>
          <div style={S.ctaIcon}>
            <Icon name="sparkle" size={22} color="var(--brand-primary)" />
          </div>
          <div style={S.ctaText}>
            <div style={S.ctaTitle}>Continue your application</div>
            <div style={S.ctaDesc}>We'll ask about income, employment, and property details. Takes about 15–20 min — save and return anytime.</div>
          </div>
          <button className="btn btn-primary" onClick={onStartApplication}>
            Start
            <Icon name="chevronRight" size={14} color="#fff" />
          </button>
        </div>

        {/* ── Two-column: Docs + LO ── */}
        <div style={S.twoCol}>

          {/* Documents */}
          <div style={S.card}>
            <div style={S.cardTitle}>
              <Icon name="doc" size={15} color="var(--text-tertiary)" />
              Documents needed
            </div>
            {DOCS.map((d, i) => (
              <div key={i} style={i < DOCS.length - 1 ? S.docItem : S.docItemLast}>
                <div style={S.docIcon(d.required ? 'var(--warning-soft)' : 'var(--bg-sunken)', d.required ? 'var(--warning)' : 'var(--text-muted)')}>
                  <Icon name={d.icon} size={13} />
                </div>
                <span style={S.docName}>{d.name}</span>
                <span style={S.docTag(
                  d.required ? 'var(--warning-soft)' : 'var(--bg-sunken)',
                  d.required ? 'var(--warning)' : 'var(--text-muted)'
                )}>
                  {d.required ? 'Required' : 'If applicable'}
                </span>
              </div>
            ))}
            <div style={S.uploadZone}>
              <Icon name="upload" size={16} color="var(--text-tertiary)" style={{ verticalAlign: -3, marginRight: 4 }} />
              Drop files or browse to upload early
            </div>
          </div>

          {/* Loan officer + activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={S.card}>
              <div style={S.cardTitle}>
                <Icon name="user" size={15} color="var(--text-tertiary)" />
                Your loan officer
              </div>
              <div style={S.loInfo}>
                <div style={S.loAvatar}>SR</div>
                <div>
                  <div style={S.loName}>Sarah Reeves</div>
                  <div style={S.loRole}>NMLS #284710</div>
                </div>
              </div>
              <div style={S.loDetail}><Icon name="phone" size={14} color="var(--text-tertiary)" /> (512) 555-0198</div>
              <div style={S.loDetail}><Icon name="mail" size={14} color="var(--text-tertiary)" /> s.reeves@lender.com</div>
              <div style={S.loActions}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Icon name="chat" size={14} /> Message
                </button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, border: '1px solid var(--border-subtle)' }}>
                  <Icon name="calendar" size={14} /> Schedule
                </button>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>
                <Icon name="check" size={15} color="var(--text-tertiary)" />
                Recent activity
              </div>
              {[
                { text: 'Prequalification approved', date: 'June 15, 2026' },
                { text: 'Prequal letter available', date: 'June 15, 2026' },
                { text: 'Credit check completed', date: 'June 14, 2026' },
              ].map((item, i, arr) => (
                <div key={i} style={S.timeline}>
                  <div style={S.tlDotWrap}>
                    <div style={S.tlDot} />
                    {i < arr.length - 1 && <div style={S.tlLine} />}
                  </div>
                  <div>
                    <div style={S.tlText}>{item.text}</div>
                    <div style={S.tlDate}>{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tip bar ── */}
        <div style={S.tip}>
          <Icon name="sparkle" size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div><strong>Tip:</strong> Uploading documents early can speed up your approval. Your data is encrypted end-to-end and only visible to your loan team.</div>
        </div>

      </div>
    </div>
  );
}
