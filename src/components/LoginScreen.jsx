import React from 'react';
import { flags } from '../flags';
import { PERSONAS, findPersonaByCredentials } from '../personas';
import { Icon } from './Icon';

const LOGIN_CSS = `
.lx-stage { min-height: 100vh; display: flex; background: var(--bg-app, #F8F8F6); font-family: inherit; }

.lx-brand {
  position: relative; overflow: hidden;
  flex: 1 1 46%;
  display: flex; flex-direction: column;
  padding: 48px 56px;
  color: #fff;
  background:
    radial-gradient(120% 90% at 12% 8%, color-mix(in srgb, var(--lx-glow) 60%, transparent) 0%, transparent 46%),
    radial-gradient(90% 80% at 96% 100%, color-mix(in srgb, var(--lx-glow) 34%, transparent) 0%, transparent 52%),
    linear-gradient(150deg, var(--lx-a) 0%, var(--lx-b) 78%);
}
.lx-brand::after {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(120% 100% at 30% 20%, #000 30%, transparent 78%);
          mask-image: radial-gradient(120% 100% at 30% 20%, #000 30%, transparent 78%);
  pointer-events: none;
}
.lx-brand > * { position: relative; z-index: 1; }

.lx-logo { height: 28px; display: flex; align-items: center; color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }

.lx-brand-mid { margin-top: auto; max-width: 32ch; }
.lx-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
  color: rgba(255,255,255,0.66); margin-bottom: 22px;
}
.lx-eyebrow .lx-dot { width: 6px; height: 6px; border-radius: 50%; background: #6FE0A8; box-shadow: 0 0 0 4px rgba(111,224,168,0.18); flex-shrink: 0; }
.lx-headline { font-size: 38px; line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
.lx-headline .lx-accent { color: #B7A8FE; }
.lx-sub { margin: 18px 0 0; font-size: 15.5px; line-height: 1.55; color: rgba(255,255,255,0.72); font-weight: 400; }

.lx-quote {
  margin-top: 36px; padding: 20px 22px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  backdrop-filter: blur(6px);
}
.lx-quote p { margin: 0; font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,0.88); font-style: italic; }
.lx-quote-by { display: flex; align-items: center; gap: 11px; margin-top: 16px; }
.lx-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #6FE0A8, #3F4CED);
  display: flex; align-items: center; justify-content: center;
  font-size: 12.5px; font-weight: 700; color: #fff;
}
.lx-quote-name { font-size: 13.5px; font-weight: 600; color: #fff; }
.lx-quote-role { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 1px; }

.lx-brand-foot {
  margin-top: 36px; display: flex; gap: 24px;
  font-size: 12px; color: rgba(255,255,255,0.45);
}

/* Form panel */
.lx-formwrap {
  flex: 1 1 54%;
  display: flex; align-items: center; justify-content: center;
  padding: 48px 40px;
  background: var(--bg-canvas, #F8F8F6);
}
.lx-form { width: 100%; max-width: 388px; }
.lx-title { font-size: 26px; font-weight: 600; letter-spacing: -0.02em; margin: 0; color: var(--text-primary, #0E1014); }
.lx-title-sub { margin: 8px 0 0; font-size: 14.5px; color: var(--text-secondary, #6B7280); line-height: 1.5; }

.lx-fields { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
.lx-field { display: flex; flex-direction: column; gap: 6px; }
.lx-label { font-size: 13px; font-weight: 500; color: var(--text-secondary, #374151); }
.lx-inputwrap { position: relative; }
.lx-input {
  width: 100%; height: 46px; padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--border-default, #D1D5DB);
  background: var(--bg-surface, #fff);
  color: var(--text-primary, #0E1014);
  font-size: 14.5px; outline: none; font-family: inherit;
  transition: border-color .15s, box-shadow .15s;
  box-sizing: border-box;
}
.lx-input::placeholder { color: var(--text-tertiary, #9CA3AF); }
.lx-input:hover { border-color: var(--border-strong, #9CA3AF); }
.lx-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.13); }
.lx-input.lx-has-trail { padding-right: 46px; }
.lx-eye {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  width: 34px; height: 34px; border: 0; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-tertiary, #9CA3AF); border-radius: 6px;
}
.lx-eye:hover { color: var(--text-secondary, #6B7280); background: var(--bg-muted, #F3F4F6); }

.lx-row-between { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.lx-check { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-secondary, #6B7280); cursor: pointer; user-select: none; }
.lx-check input { position: absolute; opacity: 0; width: 0; height: 0; }
.lx-box {
  width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
  border: 1.5px solid var(--border-strong, #9CA3AF); background: var(--bg-surface, #fff);
  display: flex; align-items: center; justify-content: center;
  transition: background .12s, border-color .12s;
}
.lx-check input:checked + .lx-box { background: #0E1014; border-color: #0E1014; }
.lx-box svg { opacity: 0; transition: opacity .12s; }
.lx-check input:checked + .lx-box svg { opacity: 1; }
.lx-link { font-size: 13.5px; font-weight: 500; color: #6366F1; text-decoration: none; }
.lx-link:hover { text-decoration: underline; }

.lx-btn-primary {
  width: 100%; height: 48px; margin-top: 24px;
  border: none; border-radius: 8px; cursor: pointer;
  font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: #0E1014; color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: background .14s, transform .05s;
  font-family: inherit;
}
.lx-btn-primary:hover { background: #22252B; }
.lx-btn-primary:active { transform: translateY(0.5px); }

.lx-divider { display: flex; align-items: center; gap: 14px; margin: 22px 0; color: var(--text-tertiary, #9CA3AF); font-size: 12.5px; }
.lx-divider::before, .lx-divider::after { content: ""; height: 1px; flex: 1; background: var(--border-subtle, #E5E7EB); }

.lx-sso { display: flex; flex-direction: column; gap: 10px; }
.lx-btn-sso {
  width: 100%; height: 44px; cursor: pointer;
  border: 1px solid var(--border-default, #D1D5DB); border-radius: 8px;
  background: var(--bg-surface, #fff); color: var(--text-primary, #0E1014);
  font-size: 14px; font-weight: 500; font-family: inherit;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  transition: background .12s, border-color .12s;
}
.lx-btn-sso:hover { background: var(--bg-muted, #F9FAFB); border-color: var(--border-strong, #9CA3AF); }

.lx-foot { margin-top: 28px; text-align: center; font-size: 13.5px; color: var(--text-secondary, #6B7280); }
.lx-secure { margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 11.5px; color: var(--text-tertiary, #9CA3AF); }

@media (max-width: 820px) {
  .lx-brand { display: none; }
  .lx-formwrap { flex: 1 1 100%; }
}
`;

function EyeIcon({ off }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function GoogleG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}

// Synchronous clipboard fallback for when the async Clipboard API is
// unavailable or rejects (e.g. the page isn't focused). Copies the exact text
// passed in, so the clicked value is what actually lands on the clipboard.
function legacyCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

export function LoginScreen({ onLogin }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [copiedId, setCopiedId] = React.useState(null);

  const copyEmail = (p) => {
    const onCopied = () => {
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(c => (c === p.id ? null : c)), 1400);
    };
    // The async Clipboard API can reject (page not focused, permissions); its
    // promise can't be caught by try/catch, so handle it here and fall back to
    // execCommand so the clicked email reliably reaches the clipboard.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(p.email).then(onCopied, () => { if (legacyCopy(p.email)) onCopied(); });
    } else if (legacyCopy(p.email)) {
      onCopied();
    }
  };

  React.useEffect(() => {
    if (document.getElementById('lx-login-css')) return;
    const el = document.createElement('style');
    el.id = 'lx-login-css';
    el.textContent = LOGIN_CSS;
    document.head.appendChild(el);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!flags.personaLogin) { onLogin(); return; }
    // Empty form = fast-path to LO (legacy demo behavior).
    if (!email && !password) { onLogin('LO'); return; }
    const match = findPersonaByCredentials(email, password);
    if (!match) { setError('No persona matches those credentials. See the demo accounts below.'); return; }
    setError('');
    onLogin(match.id);
  };

  // SSO buttons jump straight to LO since they don't carry credentials.
  const ssoLogin = () => onLogin(flags.personaLogin ? 'LO' : undefined);

  return (
    <div className="lx-stage" style={{ '--lx-a': '#1B1F66', '--lx-b': '#00023C', '--lx-glow': '#3F4CED' }}>

      {/* Brand panel */}
      <aside className="lx-brand">
        <div className="lx-logo">Xpanse</div>

        <div className="lx-brand-mid">
          <span className="lx-eyebrow">
            <span className="lx-dot"/>
            Loan Origination System
          </span>
          <h1 className="lx-headline">
            The <span className="lx-accent">AI-native</span> loan origination system.
          </h1>
          <p className="lx-sub">Originate, underwrite, and close faster — with an AI copilot working every file alongside your team.</p>

          <figure className="lx-quote" style={{ margin: 0 }}>
            <p>"We cut our average time-to-clear-to-close by nine days in the first quarter on Xpanse. The copilot catches conditions before they become delays."</p>
            <figcaption className="lx-quote-by">
              <div className="lx-avatar">MR</div>
              <div>
                <div className="lx-quote-name">Maya Reyes</div>
                <div className="lx-quote-role">VP of Lending, Meridian Mortgage</div>
              </div>
            </figcaption>
          </figure>
        </div>

        <div className="lx-brand-foot">
          <span>SOC 2 Type II</span>
          <span>256-bit encryption</span>
          <span>© 2026 Xpanse</span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="lx-formwrap">
        <form className="lx-form" onSubmit={handleSubmit}>
          <h2 className="lx-title">Welcome back</h2>
          <p className="lx-title-sub">Sign in to your Xpanse workspace.</p>

          <div className="lx-fields">
            <div className="lx-field">
              <label className="lx-label" htmlFor="lx-email">Work email</label>
              <div className="lx-inputwrap">
                <input
                  id="lx-email" className="lx-input" type="email"
                  placeholder="you@lender.com" autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="lx-field">
              <label className="lx-label" htmlFor="lx-pw">Password</label>
              <div className="lx-inputwrap">
                <input
                  id="lx-pw" className={`lx-input lx-has-trail`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••" autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="lx-eye" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <EyeIcon off={showPassword}/>
                </button>
              </div>
            </div>
          </div>

          <div className="lx-row-between" style={{ marginTop: 14 }}>
            <label className="lx-check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
              <span className="lx-box"><CheckIcon/></span>
              Keep me signed in
            </label>
            <a className="lx-link" href="#">Forgot password?</a>
          </div>

          {flags.personaLogin && error && (
            <div style={{
              fontSize: 12.5, color: '#B91C1C', background: '#FEF2F2',
              border: '1px solid #FECACA', borderRadius: 8, padding: '8px 10px',
              marginBottom: 10,
            }}>{error}</div>
          )}

          <button type="submit" className="lx-btn-primary">Sign in</button>

          {flags.personaLogin && (
            <div style={{
              marginTop: 14, padding: '10px 12px',
              background: 'rgba(126,104,250,0.06)', border: '1px solid rgba(126,104,250,0.18)',
              borderRadius: 8, fontSize: 11.5, color: '#374151',
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 5 }}>
                Demo accounts · password: <span style={{ fontFamily: 'DM Sans', color: '#111827' }}>1234</span>
              </div>
              {PERSONAS.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '2px 0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <span style={{ fontFamily: 'DM Sans', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</span>
                    <button
                      type="button"
                      onClick={() => copyEmail(p)}
                      title={copiedId === p.id ? 'Copied!' : 'Copy email'}
                      aria-label={`Copy ${p.email}`}
                      style={{
                        background: 'none', border: 'none', padding: 1, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                        color: copiedId === p.id ? 'var(--status-green, #1F7A45)' : '#9AA0A6',
                      }}
                    >
                      <Icon name={copiedId === p.id ? 'check' : 'copy'} size={12}/>
                    </button>
                  </span>
                  <span style={{ color: '#6B7280' }}>{p.role}</span>
                </div>
              ))}
            </div>
          )}

          <div className="lx-divider">or continue with</div>
          <div className="lx-sso">
            <button type="button" className="lx-btn-sso" onClick={ssoLogin}><GoogleG/> Google</button>
            <button type="button" className="lx-btn-sso" onClick={ssoLogin}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>
              SAML / Okta SSO
            </button>
          </div>

          <p className="lx-foot">New to Xpanse? <a className="lx-link" href="#">Talk to sales</a></p>

          <div className="lx-secure">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secured with 256-bit TLS encryption
          </div>
        </form>
      </main>
    </div>
  );
}
