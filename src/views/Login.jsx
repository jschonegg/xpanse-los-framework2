import React from 'react';
import { Icon } from '../components/Icon';
import { IMSLogoMonogram } from '../components/IMSLogo';

// ── Traditional centered login with SSO ─────────────────────────────────────
// Light background, single centered card, email + password as primary,
// SSO providers (Microsoft / Google / Okta) above. Matches B2B finance
// conventions (Encompass / SimpleNexus / Blend style).

export function LoginView({ onAuthenticated }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(null);    // 'password' | 'ms' | 'google' | 'okta' | 'sso'
  const [error, setError] = React.useState(null);
  const [remember, setRemember] = React.useState(true);

  const signIn = (method) => {
    setError(null);
    if (method === 'password' && (!email || !password)) {
      setError('Enter your email and password to continue.');
      return;
    }
    setBusy(method);
    setTimeout(() => {
      if (onAuthenticated) onAuthenticated({ method, user: { email } });
    }, 900);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F5F7',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'inherit',
    }}>
      {/* ── Top brand strip ───────────────────────────────────────────────── */}
      <div style={{
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <IMSLogoMonogram size={30}/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>IMS</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Intelligent Mortgage Solutions</span>
        </div>
      </div>

      {/* ── Centered card ─────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(15, 17, 21, 0.04), 0 12px 32px -8px rgba(15, 17, 21, 0.08)',
          padding: '36px 32px 28px',
        }}>
          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{
              fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em',
              margin: '0 0 6px', color: '#111827',
            }}>Sign in to IMS</h1>
            <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>
              Use your work account to continue.
            </p>
          </div>

          {/* ── SSO providers ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <SSOButton provider="microsoft" onClick={() => signIn('ms')}     busy={busy === 'ms'}/>
            <SSOButton provider="google"    onClick={() => signIn('google')} busy={busy === 'google'}/>
            <SSOButton provider="okta"      onClick={() => signIn('okta')}   busy={busy === 'okta'}/>
            <SSOButton provider="sso"       onClick={() => signIn('sso')}    busy={busy === 'sso'}/>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }}/>
            <span style={{
              fontSize: 11, color: '#9CA3AF',
              letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600,
            }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }}/>
          </div>

          {/* ── Email + password ───────────────────────────────────────── */}
          <form onSubmit={e => { e.preventDefault(); signIn('password'); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email" type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={inputStyle}
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#5B21B6', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot?
                </a>
              </div>
              <input
                id="password" type="password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#374151',
              userSelect: 'none', cursor: 'pointer',
              marginTop: 2,
            }}>
              <input
                type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#5B21B6', cursor: 'pointer' }}
              />
              Keep me signed in
            </label>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, color: '#B91C1C',
                background: '#FEF2F2', border: '1px solid #FECACA',
                padding: '8px 12px', borderRadius: 8,
              }}>
                <Icon name="alertCircle" size={14} strokeWidth={2}/>
                {error}
              </div>
            )}

            <button type="submit" disabled={busy === 'password'}
              style={{
                ...primaryBtn,
                opacity: busy === 'password' ? 0.7 : 1,
                cursor: busy === 'password' ? 'wait' : 'pointer',
                marginTop: 6,
              }}
            >
              {busy === 'password' ? 'Signing in…' : 'Sign in'}
              {busy !== 'password' && <Icon name="arrowRight" size={14} strokeWidth={2.4}/>}
            </button>
          </form>

          {/* Help row */}
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#6B7280' }}>
            Trouble signing in?{' '}
            <a href="#" style={{ color: '#5B21B6', textDecoration: 'none', fontWeight: 600 }}>
              Contact your administrator
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: '#9CA3AF',
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
function SSOButton({ provider, onClick, busy }) {
  const config = {
    microsoft: { label: 'Continue with Microsoft', logo: <MicrosoftLogo/> },
    google:    { label: 'Continue with Google',    logo: <GoogleLogo/> },
    okta:      { label: 'Continue with Okta',      logo: <OktaLogo/> },
    sso:       { label: 'Sign in with SSO',        logo: <Icon name="building" size={16} strokeWidth={2} color="#5B21B6"/> },
  }[provider];

  return (
    <button onClick={onClick} disabled={busy} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', height: 42, padding: '0 14px',
      background: '#fff', color: '#111827',
      border: '1px solid #D9DCE2', borderRadius: 9,
      cursor: busy ? 'wait' : 'pointer',
      fontFamily: 'inherit',
      fontSize: 13.5, fontWeight: 600,
      transition: 'border-color 0.12s, background 0.12s',
      opacity: busy ? 0.7 : 1,
    }}
    onMouseEnter={e => { if (!busy) { e.currentTarget.style.borderColor = '#9CA3AF'; e.currentTarget.style.background = '#FAFAFA'; } }}
    onMouseLeave={e => { if (!busy) { e.currentTarget.style.borderColor = '#D9DCE2'; e.currentTarget.style.background = '#fff'; } }}
    >
      <span style={{ width: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {config.logo}
      </span>
      <span style={{ flex: 1, textAlign: 'left' }}>{busy ? 'Redirecting…' : config.label}</span>
    </button>
  );
}

// Compact provider logos (4-color Microsoft, multi-color Google, blue Okta circle).
function MicrosoftLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="0" y="0" width="7" height="7" fill="#F25022"/>
      <rect x="9" y="0" width="7" height="7" fill="#7FBA00"/>
      <rect x="0" y="9" width="7" height="7" fill="#00A4EF"/>
      <rect x="9" y="9" width="7" height="7" fill="#FFB900"/>
    </svg>
  );
}
function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
function OktaLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="#007DC1"/>
    </svg>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const labelStyle = {
  display: 'block',
  fontSize: 12, fontWeight: 700,
  color: '#374151',
  marginBottom: 6,
};

const inputStyle = {
  display: 'block',
  width: '100%',
  height: 42, padding: '0 14px',
  background: '#fff',
  border: '1px solid #D9DCE2',
  borderRadius: 9,
  color: '#111827',
  fontSize: 14, fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.12s, box-shadow 0.12s',
};

const primaryBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', height: 44, padding: '0 18px',
  background: '#5B21B6', color: '#fff',
  border: 'none', borderRadius: 9,
  cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em',
  boxShadow: '0 2px 8px rgba(91, 33, 182, 0.20)',
  transition: 'background 0.12s',
};

const footerLink = {
  color: '#9CA3AF',
  textDecoration: 'none',
  fontSize: 12,
};
