import React from 'react';
import { Icon } from '../components/Icon';
import { IMSLogoMonogram, IMSWordmark } from '../components/IMSLogo';

// ── Smart Login screen for IMS ────────────────────────────────────────────────
// Two-column layout:
//   LEFT  — auth form (passkey-first, magic link second, password fallback)
//   RIGHT — "ready to work" preview that proves the system knows you before
//           you've completed auth: pipeline preview, NMLS license status,
//           branch identity, last sign-in, market context

// Mock recognized device + identity. In production this comes from
// device fingerprinting + a server-side identity service.
const KNOWN_USER = {
  firstName: 'Jordan',
  fullName:  'Jordan Schonegg',
  branch:    'Camp Hill Branch',
  branchSub: 'East Region · Pennsylvania',
  initials:  'JS',
  avatarColor: '#5B21B6',
  nmls: {
    number: '1234567',
    status: 'Active',
    states: ['PA', 'NJ', 'DE', 'MD'],
    ceDueDate: 'Aug 14',
    ceHoursRemaining: 12,
  },
  lastSignIn: {
    when: 'Yesterday · 5:42 PM',
    device: 'This device',
    location: 'Camp Hill, PA',
  },
};

const PIPELINE_PREVIEW = {
  needsToday: 3,
  topPriority: {
    borrower: 'Rodriguez',
    loanId:  'LN-2024-0218',
    detail:  'Lock expires in 2d 14h',
  },
};

const MARKET = {
  rateChange: '-0.04',
  rateNow:    '6.875%',
  marketOpensIn: '14 min',
};

const COMPLIANCE_BADGES = ['SOC 2 Type II', 'FIPS 140-2', 'GLBA', 'CCPA'];

// ─────────────────────────────────────────────────────────────────────────────
export function LoginView({ onAuthenticated }) {
  const [step, setStep] = React.useState('primary'); // 'primary' | 'password' | 'verifying'
  const [email, setEmail] = React.useState('jordan.schonegg@lakeside.com');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  const authenticate = (method) => {
    setStep('verifying');
    setError(null);
    // Simulate biometric / magic link / password verify
    setTimeout(() => {
      if (onAuthenticated) onAuthenticated({ method, user: KNOWN_USER });
    }, method === 'passkey' ? 900 : 1300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(60% 70% at 20% 20%, rgba(126, 104, 250, 0.18) 0%, transparent 60%),
        radial-gradient(50% 80% at 80% 80%, rgba(91, 33, 182, 0.20) 0%, transparent 65%),
        linear-gradient(135deg, #0F0B26 0%, #1A1535 45%, #1E1B4B 100%)
      `,
      color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '24px 40px',
      fontFamily: 'inherit',
    }}>
      {/* ── Top utility bar — brand left, compliance badges right ─────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IMSLogoMonogram size={36}/>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>IMS</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Intelligent Mortgage Solutions</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {COMPLIANCE_BADGES.map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.65)',
            }}>
              <Icon name="checkCircle" size={11} color="#86EFAC" strokeWidth={2}/>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main two-column area ──────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 56,
        alignItems: 'center',
        maxWidth: 1180,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* LEFT — auth form ───────────────────────────────────────────────── */}
        <div style={{ maxWidth: 440 }}>
          {step !== 'verifying' && (
            <>
              <h1 style={{
                fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em',
                margin: '0 0 8px', color: '#fff', lineHeight: 1.1,
              }}>
                {KNOWN_USER.firstName ? `Welcome back, ${KNOWN_USER.firstName}.` : 'Sign in to IMS'}
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: '0 0 32px', lineHeight: 1.5 }}>
                Sign in to your branch at <span style={{ color: 'rgba(255,255,255,0.85)' }}>Lakeside Mortgage</span>.
              </p>
            </>
          )}

          {/* Step 1 — primary methods */}
          {step === 'primary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Primary: passkey / Face ID */}
              <button onClick={() => authenticate('passkey')} style={primaryBtn}>
                <Icon name="lock" size={16} strokeWidth={2}/>
                Continue with Face ID
                <Icon name="arrowRight" size={14} strokeWidth={2.5} style={{ marginLeft: 'auto' }}/>
              </button>

              {/* Secondary: magic link */}
              <button onClick={() => authenticate('magic-link')} style={secondaryBtn}>
                <Icon name="mail" size={16} strokeWidth={2}/>
                Email me a magic link
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
              </div>

              {/* Tertiary: SSO and password */}
              <button onClick={() => authenticate('sso')} style={tertiaryBtn}>
                <Icon name="building" size={15} strokeWidth={1.9}/>
                Sign in with Lakeside SSO
              </button>
              <button onClick={() => setStep('password')} style={tertiaryBtn}>
                <Icon name="settings" size={15} strokeWidth={1.9}/>
                Use email and password
              </button>

              {/* Trust marker */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginTop: 22, padding: '10px 14px',
                background: 'rgba(34, 197, 94, 0.10)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: 10,
              }}>
                <Icon name="checkCircle" size={14} color="#86EFAC" strokeWidth={2.2}/>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                  Trusted device · Last signed in {KNOWN_USER.lastSignIn.when}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — password fallback */}
          {step === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={labelStyle}>Work email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                autoFocus style={inputStyle}
              />
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle}
              />
              <button onClick={() => authenticate('password')}
                disabled={!password}
                style={{ ...primaryBtn, opacity: password ? 1 : 0.5, cursor: password ? 'pointer' : 'not-allowed', marginTop: 6 }}
              >
                Sign in
                <Icon name="arrowRight" size={14} strokeWidth={2.5} style={{ marginLeft: 'auto' }}/>
              </button>
              <button onClick={() => setStep('primary')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)', fontFamily: 'inherit',
                fontSize: 13, marginTop: 4, alignSelf: 'flex-start',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <Icon name="arrowLeft" size={12} strokeWidth={2.2}/>
                Other ways to sign in
              </button>
            </div>
          )}

          {/* Step 3 — verifying */}
          {step === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(126, 104, 250, 0.18)',
                border: '1px solid rgba(126, 104, 250, 0.40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'imsPulse 1.4s ease-in-out infinite',
              }}>
                <Icon name="sparkle" size={22} color="#A78BFA" strokeWidth={1.8}/>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Verifying you…</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>
                  Confirming your identity and branch access.
                </div>
              </div>
              <style>{`
                @keyframes imsPulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50%      { transform: scale(1.05); opacity: 0.75; }
                }
              `}</style>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 16, fontSize: 13, color: '#FCA5A5' }}>{error}</div>
          )}
        </div>

        {/* RIGHT — "ready to work" preview ─────────────────────────────────── */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: 16,
          padding: 28,
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: KNOWN_USER.avatarColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700,
            }}>{KNOWN_USER.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{KNOWN_USER.fullName}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{KNOWN_USER.branchSub}</div>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(34, 197, 94, 0.15)', color: '#86EFAC',
              border: '1px solid rgba(34, 197, 94, 0.30)',
              fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em',
              padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#86EFAC' }}/>
              Recognized
            </span>
          </div>

          {/* AI pipeline preview */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '14px 16px',
            background: 'rgba(126, 104, 250, 0.10)',
            border: '1px solid rgba(126, 104, 250, 0.28)',
            borderRadius: 12,
          }}>
            <Icon name="sparkle" size={18} color="#C4B5FD" strokeWidth={1.7} style={{ marginTop: 1, flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
                <strong style={{ color: '#fff', fontWeight: 700 }}>{PIPELINE_PREVIEW.needsToday} files</strong> need you today.
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4, lineHeight: 1.4 }}>
                Most urgent: <strong style={{ color: '#fff', fontWeight: 600 }}>{PIPELINE_PREVIEW.topPriority.borrower}</strong> · {PIPELINE_PREVIEW.topPriority.detail}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Branch */}
            <PreviewTile icon="building" label="Branch">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{KNOWN_USER.branch}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{KNOWN_USER.branchSub}</div>
            </PreviewTile>

            {/* NMLS */}
            <PreviewTile icon="checkCircle" label="NMLS License" accent="#86EFAC">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'DM Mono' }}>#{KNOWN_USER.nmls.number}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {KNOWN_USER.nmls.status} · {KNOWN_USER.nmls.states.join(', ')}
              </div>
            </PreviewTile>

            {/* Last sign-in */}
            <PreviewTile icon="clock" label="Last sign-in">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{KNOWN_USER.lastSignIn.when}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{KNOWN_USER.lastSignIn.device}</div>
            </PreviewTile>

            {/* Market */}
            <PreviewTile icon="trendingUp" label="Market" accent="#86EFAC">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'DM Mono' }}>{MARKET.rateNow}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                30Y Conv · {MARKET.rateChange} · opens in {MARKET.marketOpensIn}
              </div>
            </PreviewTile>
          </div>

          {/* CE banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: 'rgba(245, 158, 11, 0.10)',
            border: '1px solid rgba(245, 158, 11, 0.30)',
            borderRadius: 10,
          }}>
            <Icon name="clock" size={14} color="#FBBF24" strokeWidth={2}/>
            <div style={{ flex: 1, fontSize: 12.5, color: 'rgba(255,255,255,0.78)' }}>
              <strong style={{ color: '#FBBF24' }}>CE due {KNOWN_USER.nmls.ceDueDate}</strong>
              {' · '}
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{KNOWN_USER.nmls.ceHoursRemaining} hours remaining</span>
            </div>
            <a href="#" style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24', textDecoration: 'none' }}>Schedule</a>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 32,
        fontSize: 12, color: 'rgba(255,255,255,0.4)',
      }}>
        <div>© 2026 IMS · Intelligent Mortgage Solutions</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a href="#" style={footerLink}>Status</a>
          <a href="#" style={footerLink}>Security</a>
          <a href="#" style={footerLink}>Privacy</a>
          <a href="#" style={footerLink}>Help</a>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────
function PreviewTile({ icon, label, accent, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 10.5, fontWeight: 700, letterSpacing: '0.10em',
        color: accent || 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        <Icon name={icon} size={11} strokeWidth={2} color={accent || 'rgba(255,255,255,0.55)'}/>
        {label}
      </div>
      {children}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const primaryBtn = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%',
  height: 48, padding: '0 18px',
  background: '#fff', color: '#1e1b4b',
  border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em',
  boxShadow: '0 4px 20px rgba(126, 104, 250, 0.18)',
  transition: 'transform 0.08s, box-shadow 0.15s',
};

const secondaryBtn = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%',
  height: 44, padding: '0 18px',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 14, fontWeight: 600,
  transition: 'background 0.12s',
};

const tertiaryBtn = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%',
  height: 40, padding: '0 14px',
  background: 'transparent', color: 'rgba(255,255,255,0.65)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 13.5, fontWeight: 500,
  transition: 'background 0.12s, color 0.12s',
};

const labelStyle = {
  fontSize: 11.5, fontWeight: 700,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
  marginBottom: 2,
};

const inputStyle = {
  height: 44, padding: '0 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 9,
  color: '#fff',
  fontSize: 14, fontFamily: 'inherit',
  outline: 'none',
};

const footerLink = {
  color: 'rgba(255,255,255,0.45)',
  textDecoration: 'none',
  fontSize: 12,
};
