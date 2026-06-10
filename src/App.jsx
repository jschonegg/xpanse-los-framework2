import React from 'react';
import { StatusBar, AIFab, LeftNav } from './components/Shell';
import { LoginScreen } from './components/LoginScreen';
import { ProcessorHomeView } from './views/ProcessorHome';
import { LOANS } from './data/loans';
import { AIAssistantPanel } from './components/AIAssistant';
import { CommandPalette } from './components/CommandPalette';
import { HomeView } from './views/Home';
import { PipelineView } from './views/Pipeline';
import { LoanDetailView } from './views/LoanDetail';
import { URLAView } from './views/URLAView';
import { LoanEstimateView } from './views/LoanEstimateView';
import { AIFeedView } from './views/AIFeed';
import { LargeDepositReviewView } from './views/LargeDepositReview';
import { PreferencesModal } from './components/PreferencesModal';
import { AdminWorkflowsView } from './views/AdminWorkflows';
import { WorkflowProvider } from './workflows/WorkflowContext';

// ── Standalone URLA window (opened via window.open) ──────────────────────────
function StandaloneURLA() {
  const params = new URLSearchParams(window.location.search);
  const borrower = params.get('borrower') || 'Borrower';
  const loanId   = params.get('loanId')   || '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-app)' }}>
      <URLAView
        borrowerName={borrower}
        loanId={loanId}
        onClose={() => window.close()}
        onSubmit={() => { window.opener?.postMessage({ type: 'urla-submitted', loanId }, '*'); window.close(); }}
        embedded={false}
      />
    </div>
  );
}

// ── Standalone Loan Estimate window ──────────────────────────────────────────
function StandaloneLoanEstimate() {
  const params  = new URLSearchParams(window.location.search);
  const loanId  = params.get('loanId') || 'LN-2024-0234';
  const page    = parseInt(params.get('page') || '1', 10);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-app)' }}>
      {/* Minimal chrome for standalone window */}
      <div style={{
        padding: '10px 24px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>X</span>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Xpanse</span>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>Loan Estimate · {loanId}</span>
        <div style={{ flex: 1 }}/>
        <button onClick={() => window.close()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'inherit', padding: '4px 10px', borderRadius: 6 }}>
          Close window ✕
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
        <LoanEstimateView loanId={loanId} initialPage={page} standalone={true}/>
      </div>
    </div>
  );
}

export default function App() {
  // Render standalone URLA if this is a popup window
  if (window.location.search.includes('view=urla')) return <StandaloneURLA/>;
  if (window.location.search.includes('view=le'))   return <StandaloneLoanEstimate/>;

  // Auth gate — login is shown until the user authenticates (or until they've
  // authenticated once on this device). Pass ?login to force-show login again.
  const forceLogin = window.location.search.includes('login');
  const [authed, setAuthed] = React.useState(() => !forceLogin && localStorage.getItem('los-authed') === '1');

  // All remaining hooks are declared above the auth early-return so the
  // hook order stays stable across renders (Rules of Hooks).
  const [route, setRoute] = React.useState(() => localStorage.getItem('los-route') || 'home');
  const [currentLoan, setCurrentLoan] = React.useState(() => localStorage.getItem('los-loan') || 'LN-2024-0234');
  const [loanTab, setLoanTab] = React.useState(() => localStorage.getItem('los-loan-tab') || 'now');
  const [urlaBorrower, setUrlaBorrower] = React.useState(null);
  const [urlaLoanId, setUrlaLoanId] = React.useState(null);
  const [persona, setPersona] = React.useState(() => localStorage.getItem('los-persona') || 'LO');
  const changePersona = (p) => { setPersona(p); localStorage.setItem('los-persona', p); };
  const [aiOpen, setAiOpen] = React.useState(() => localStorage.getItem('los-ai-open') === '1');
  const [aiOverride, setAiOverride] = React.useState(null);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [prefsOpen, setPrefsOpen] = React.useState(false);
  const [pipelineIntent, setPipelineIntent] = React.useState(null);

  // Global keyboard shortcuts — guarded so it's effectively a no-op until
  // the user is authenticated, but still registered on every render.
  React.useEffect(() => {
    if (!authed) return;
    const handler = (e) => {
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      if (e.key === 'p' && !cmdOpen) { e.preventDefault(); setRoute('pipeline'); localStorage.setItem('los-route', 'pipeline'); }
      if (e.key === 'h' && !cmdOpen) { e.preventDefault(); setRoute('home');     localStorage.setItem('los-route', 'home'); }
      if (e.key === 'n' && !cmdOpen) { e.preventDefault(); setCmdOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cmdOpen, authed]);

  // If unauthenticated, render the Xpanse split-panel login screen.
  if (!authed) {
    return <LoginScreen onLogin={() => {
      localStorage.setItem('los-authed', '1');
      localStorage.setItem('los-route', 'home');
      if (forceLogin) window.history.replaceState({}, '', window.location.pathname);
      setAuthed(true);
    }}/>;
  }

  const navigate = (r, intent) => {
    setRoute(r); localStorage.setItem('los-route', r);
    if (r === 'pipeline') setPipelineIntent(intent || null);
  };
  const openLoan = (id, tab) => {
    setCurrentLoan(id); localStorage.setItem('los-loan', id);
    if (tab) { setLoanTab(tab); localStorage.setItem('los-loan-tab', tab); }
    navigate('loan');
  };
  const changeLoanTab = (t) => { setLoanTab(t); localStorage.setItem('los-loan-tab', t); };
  const openURLA = (name) => {
    const year = new Date().getFullYear();
    const id = `LN-${year}-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`;
    setUrlaBorrower(name);
    setUrlaLoanId(id);
    navigate('urla');
  };
  const toggleAi = () => { setAiOverride(null); setAiOpen(o => { const next = !o; localStorage.setItem('los-ai-open', next ? '1' : '0'); return next; }); };
  const openAiWith = (override) => { setAiOverride(override); setAiOpen(true); localStorage.setItem('los-ai-open', '1'); };

  const ctx = { route, loanId: currentLoan, loanTab, override: aiOverride };

  const activeCount = LOANS.filter(l => l.status !== 'Funded').length;
  const attentionCount = LOANS.filter(l => l.flag || l.lockStatus === 'Expiring' || (l.conditionsOpen / (l.conditionsTotal || 1)) > 0.5).length;

  const isAdmin = route === 'admin';

  // The Admin Console is a parallel app: full-screen, with its own dark global
  // rail and navigation, completely replacing the LOS shell.
  if (isAdmin) {
    return (
      <WorkflowProvider>
        <AdminWorkflowsView onExit={() => navigate('home')}/>
        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} onNavigate={navigate} onOpenLoan={openLoan} onOpenAi={openAiWith} onOpenURLA={(name) => { setCmdOpen(false); openURLA(name); }}/>}
        {prefsOpen && <PreferencesModal onClose={() => setPrefsOpen(false)}/>}
      </WorkflowProvider>
    );
  }

  return (
    <WorkflowProvider>
      <LeftNav route={route} onNavigate={navigate} onOpenCmd={() => setCmdOpen(true)} onOpenPrefs={() => setPrefsOpen(true)}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, paddingBottom: 36, paddingLeft: 44 }}>
        {route === 'deposit-review' && <LargeDepositReviewView onBack={() => navigate('home')}/>}
        {route !== 'deposit-review' && (
          <>
            {route === 'home' && persona === 'Processor' && <ProcessorHomeView onNavigate={navigate} onOpenLoan={openLoan} onOpenAi={openAiWith} onOpenDepositReview={() => navigate('deposit-review')}/>}
            {route === 'home' && persona === 'LO' && <HomeView onNavigate={navigate} onOpenLoan={openLoan} onOpenAi={openAiWith}/>}
            {route === 'pipeline' && <PipelineView onOpenLoan={openLoan} persona={persona} intent={pipelineIntent}/>}
            {route === 'feed' && <AIFeedView onOpenLoan={openLoan}/>}
            {route === 'loan' && <LoanDetailView loanId={currentLoan} tab={loanTab} onTab={changeLoanTab} persona={persona}/>}
            {route === 'urla' && <URLAView borrowerName={urlaBorrower} loanId={urlaLoanId} onClose={() => navigate('home')} onSubmit={() => { navigate('pipeline'); }}/>}
          </>
        )}
      </div>
      <StatusBar activeCount={activeCount} attentionCount={attentionCount}/>
      {!aiOpen && <AIFab onClick={toggleAi}/>}
      {aiOpen && <AIAssistantPanel ctx={ctx} onClose={toggleAi} onOpenLoan={openLoan} persona={persona}/>}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} onNavigate={navigate} onOpenLoan={openLoan} onOpenAi={openAiWith} onOpenURLA={(name) => { setCmdOpen(false); openURLA(name); }}/>}
      {prefsOpen && <PreferencesModal onClose={() => setPrefsOpen(false)}/>}
    </WorkflowProvider>
  );
}
