import React from 'react';
import { Icon } from '../components/Icon';
import { Avatar, StatusPill } from '../components/Shell';

/* Workspaces: Conditions, AUS, Pricing & Lock, Closing, Audit
   All persona-agnostic — every role uses the same workspace, with permissions
   determining which buttons are enabled at runtime. */

/* ============================================================
   CONDITIONS WORKSPACE
   ============================================================ */

const CONDITIONS_DATA = [
  { id: 'C-001', category: 'prior-to-doc', source: 'Underwriter', sourceWho: 'Priya Shah',
    title: 'Letter of explanation — large deposit',
    detail: '$8,500 deposit on 3/14 not sourced. Need signed LOX + supporting docs.',
    status: 'open', assignee: 'Sarah Anderson', due: 'May 18', age: 2, blocking: true,
    docs: 0, notes: 1 },
  { id: 'C-002', category: 'prior-to-doc', source: 'AUS', sourceWho: 'DU',
    title: 'Updated VOE within 10 days of closing',
    detail: 'Re-verify employment status & income consistency.',
    status: 'open', assignee: 'Alex Martinez', due: 'May 22', age: 1, blocking: true,
    docs: 0, notes: 0 },
  { id: 'C-003', category: 'prior-to-funding', source: 'Underwriter', sourceWho: 'Priya Shah',
    title: 'Hazard insurance binder — 1 year prepaid',
    detail: 'Need declarations page showing dwelling coverage ≥ loan amount, paid in full.',
    status: 'open', assignee: 'Sarah Anderson', due: 'May 25', age: 1, blocking: false,
    docs: 0, notes: 0 },
  { id: 'C-004', category: 'prior-to-funding', source: 'Investor', sourceWho: 'FNMA',
    title: 'Subject property final inspection',
    detail: 'Appraiser to confirm completion of repairs noted in 1004D.',
    status: 'open', assignee: 'Alex Martinez', due: 'May 26', age: 0, blocking: false,
    docs: 0, notes: 2 },
  { id: 'C-005', category: 'at-closing', source: 'Compliance', sourceWho: 'System',
    title: 'Borrower acknowledgment of Closing Disclosure',
    detail: 'Initial CD must be acknowledged ≥3 business days before signing.',
    status: 'pending', assignee: 'Sarah Anderson', due: 'May 29', age: 0, blocking: true,
    docs: 0, notes: 0 },
  { id: 'C-006', category: 'post-closing', source: 'Investor', sourceWho: 'FNMA',
    title: 'Trailing docs — recorded mortgage',
    detail: 'Submit recorded mortgage and title policy to investor within 60 days.',
    status: 'pending', assignee: 'Priya Shah', due: 'Jul 30', age: 0, blocking: false,
    docs: 0, notes: 0 },
  { id: 'C-007', category: 'prior-to-doc', source: 'Underwriter', sourceWho: 'Priya Shah',
    title: 'Most recent 2 paystubs',
    detail: 'Within 30 days of note date.',
    status: 'cleared', assignee: 'Sarah Anderson', due: 'May 14', age: 0, blocking: false,
    clearedBy: 'Auto', clearedAt: 'May 13', docs: 2, notes: 1 },
  { id: 'C-008', category: 'prior-to-doc', source: 'Underwriter', sourceWho: 'Priya Shah',
    title: 'Verification of mortgage — current rental',
    detail: '12 months payment history.',
    status: 'cleared', assignee: 'Sarah Anderson', due: 'May 10', age: 0, blocking: false,
    clearedBy: 'Alex Martinez', clearedAt: 'May 11', docs: 1, notes: 0 },
];

const CONDITION_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'prior-to-doc', label: 'Prior to Doc' },
  { id: 'prior-to-funding', label: 'Prior to Funding' },
  { id: 'at-closing', label: 'At Closing' },
  { id: 'post-closing', label: 'Post-Closing' },
];

// AI analysis results keyed by condition id
const AI_ANALYSIS = {
  'C-001': {
    result: 'partial',
    docName: 'bank_statement_march.pdf',
    summary: 'Bank statement confirms $8,500 deposit on 3/14. Source appears to be a Zelle transfer from "Mom & Dad Whitfield" — consistent with gift funds, not income. However, a signed gift letter is still required to complete sourcing.',
    findings: [
      { label: 'Deposit amount', value: '$8,500', match: true },
      { label: 'Deposit date', value: 'March 14, 2026', match: true },
      { label: 'Source identified', value: 'Zelle — Whitfield (likely family)', match: true },
      { label: 'Gift letter on file', value: 'Missing', match: false },
    ],
    action: 'Request gift letter from borrower before clearing',
  },
  'C-002': {
    result: 'clear',
    docName: 'voe_apex_technologies.pdf',
    summary: 'VOE from Apex Technologies confirmed. Start date June 10, 2019 — 6 years 11 months of continuous employment. Current base salary $135,000/year matches stated income within 1%. Signed by HR Director on company letterhead.',
    findings: [
      { label: 'Employer', value: 'Apex Technologies Inc.', match: true },
      { label: 'Start date', value: 'June 10, 2019', match: true },
      { label: 'Current status', value: 'Active — Full Time', match: true },
      { label: 'Salary', value: '$135,000/yr (stated: $135,000)', match: true },
      { label: 'Document date', value: 'May 14, 2026 — within 10 days', match: true },
    ],
    action: null,
  },
  'C-003': {
    result: 'rejected',
    docName: 'homeowners_quote.pdf',
    summary: 'This document is a homeowner\'s insurance quote, not a binder. The condition requires a declarations page confirming coverage is bound, active, and paid in full for 1 year. A quote has no binding force and cannot satisfy this condition.',
    findings: [
      { label: 'Document type', value: 'Quote (not binder)', match: false },
      { label: 'Coverage bound', value: 'No — quote only', match: false },
      { label: 'Dwelling coverage', value: 'Not confirmed', match: false },
      { label: 'Paid in full', value: 'Not confirmed', match: false },
    ],
    action: 'Request declarations page from borrower\'s insurance agent',
  },
  'C-004': {
    result: 'review',
    docName: '1004d_inspection.pdf',
    summary: 'Document appears to be a 1004D appraisal update form. However, the appraiser\'s signature is partially cut off in the scan and the completion date is unclear — it may read May 12 or May 2. Recommend underwriter review before clearing.',
    findings: [
      { label: 'Form type', value: '1004D Appraisal Update', match: true },
      { label: 'Repairs noted', value: '0 open items', match: true },
      { label: 'Appraiser signature', value: 'Partially obscured', match: false },
      { label: 'Completion date', value: 'Ambiguous — May 2 or 12', match: false },
    ],
    action: 'Send to underwriter Priya Shah for manual review',
  },
};

// Simulated batch scan results
const BATCH_SCAN_RESULTS = [
  { conditionId: 'C-002', conditionTitle: 'Updated VOE within 10 days of closing', docName: 'voe_apex_technologies.pdf', result: 'clear', confidence: 97 },
  { conditionId: 'C-001', conditionTitle: 'Letter of explanation — large deposit', docName: 'bank_statement_march.pdf', result: 'partial', confidence: 78 },
  { conditionId: 'C-004', conditionTitle: 'Subject property final inspection', docName: '1004d_inspection.pdf', result: 'review', confidence: 61 },
];

function ConditionsTab() {
  const [cat, setCat] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('open');
  const [selected, setSelected] = React.useState(new Set());
  const [conditions, setConditions] = React.useState(CONDITIONS_DATA);
  const [expandedId, setExpandedId] = React.useState(null);
  const [batchScanState, setBatchScanState] = React.useState(null); // null | 'scanning' | 'results'
  const [batchResults, setBatchResults] = React.useState([]);

  const clearCondition = (id, method = 'manual') => {
    setConditions(prev => prev.map(c => c.id !== id ? c : {
      ...c, status: 'cleared', blocking: false,
      clearedBy: method === 'ai' ? 'AI — confirmed by Alex Martinez' : 'Alex Martinez',
      clearedAt: 'Today', docs: (c.docs || 0) + 1,
    }));
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
    if (expandedId === id) setExpandedId(null);
  };

  const submitForUW = (id) => {
    setConditions(prev => prev.map(c => c.id !== id ? c : {
      ...c, status: 'pending', assignee: 'Priya Shah (UW)',
    }));
    if (expandedId === id) setExpandedId(null);
  };

  const runBatchScan = () => {
    setBatchScanState('scanning');
    setTimeout(() => {
      setBatchResults(BATCH_SCAN_RESULTS);
      setBatchScanState('results');
    }, 2200);
  };

  const filtered = conditions.filter(c => {
    if (cat !== 'all' && c.category !== cat) return false;
    if (statusFilter === 'open' && (c.status === 'cleared')) return false;
    if (statusFilter === 'cleared' && c.status !== 'cleared') return false;
    return true;
  });

  const counts = {
    open: conditions.filter(c => c.status === 'open').length,
    pending: conditions.filter(c => c.status === 'pending').length,
    cleared: conditions.filter(c => c.status === 'cleared').length,
    blocking: conditions.filter(c => c.blocking && c.status !== 'cleared').length,
  };

  const totalOpen = counts.open + counts.pending;
  const totalAll = conditions.length;
  const pctDone = Math.round((counts.cleared / totalAll) * 100);

  return (
    <>
      <WorkspaceHeader
        title="Conditions"
        subtitle="AI-assisted document review and condition clearing"
        actions={<>
          <button className="btn btn-ai btn-sm" style={{ height: 32 }} onClick={runBatchScan} disabled={batchScanState === 'scanning'}>
            <Icon name="sparkle" size={13}/>
            {batchScanState === 'scanning' ? 'Scanning docs…' : 'Scan All Docs with AI'}
          </button>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }}>
            <Icon name="plus" size={13} strokeWidth={2.2}/>
            Add condition
          </button>
        </>}
      />

      {/* Progress bar */}
      <div style={{ marginBottom: 20, padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Clear-to-Close Readiness</span>
            <span style={{ fontSize: 12.5, color: counts.blocking > 0 ? 'var(--status-red)' : 'var(--status-green)', fontWeight: 600 }}>
              {counts.blocking > 0 ? `${counts.blocking} blocking remaining` : 'No blockers — ready for CTC'}
            </span>
          </div>
          <div style={{ height: 7, background: 'var(--bg-muted)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: pctDone + '%', height: '100%', background: counts.blocking > 0 ? 'var(--status-amber)' : 'var(--status-green)', borderRadius: 999, transition: 'width 0.4s' }}/>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
            <span><strong style={{ color: 'var(--status-red)', fontWeight: 600 }}>{counts.blocking}</strong> blocking</span>
            <span><strong style={{ color: 'var(--status-amber)', fontWeight: 600 }}>{counts.open}</strong> open</span>
            <span><strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{counts.pending}</strong> pending UW</span>
            <span><strong style={{ color: 'var(--status-green)', fontWeight: 600 }}>{counts.cleared}</strong> cleared</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: counts.blocking > 0 ? 'var(--status-amber)' : 'var(--status-green)' }}>{pctDone}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{counts.cleared} of {totalAll} cleared</div>
        </div>
      </div>

      {/* Batch scan results banner */}
      {batchScanState === 'results' && (
        <div style={{ marginBottom: 16, padding: '14px 18px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5}/>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ai-ink)' }}>AI scanned all docs — found matches for {batchResults.length} conditions</span>
            <button onClick={() => setBatchScanState(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}>
              <Icon name="x" size={14}/>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {batchResults.map(r => {
              const color = r.result === 'clear' ? 'var(--status-green)' : r.result === 'partial' ? 'var(--status-amber)' : 'var(--status-red)';
              const label = r.result === 'clear' ? '✓ Ready to clear' : r.result === 'partial' ? '⚠ Partial match' : '↗ Needs UW review';
              return (
                <div key={r.conditionId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>{r.conditionId}</span>
                  <span style={{ fontSize: 13, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.conditionTitle}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', flexShrink: 0 }}>{r.docName}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>{r.confidence}% conf.</span>
                  <button className="btn btn-outline btn-sm" style={{ height: 26, flexShrink: 0 }}
                    onClick={() => setExpandedId(r.conditionId)}>
                    Review
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {CONDITION_CATEGORIES.map(c => {
            const active = cat === c.id;
            const count = c.id === 'all' ? conditions.length : conditions.filter(cc => cc.category === c.id).length;
            return (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 12px', border: 'none', borderRadius: 7,
                background: active ? 'var(--text-primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {c.label}
                <span style={{ fontSize: 11, fontWeight: 600, background: active ? 'rgba(255,255,255,0.18)' : 'var(--bg-muted)', color: active ? '#fff' : 'var(--text-tertiary)', padding: '1px 6px', borderRadius: 999 }}>{count}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1 }}/>
        <SegmentedTabs value={statusFilter} onChange={setStatusFilter} options={[
          { value: 'open', label: 'Open' },
          { value: 'cleared', label: 'Cleared' },
          { value: 'all', label: 'All' },
        ]}/>
      </div>

      {/* Conditions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13.5 }}>
            No conditions match these filters
          </div>
        )}
        {filtered.map(c => (
          <ConditionRow
            key={c.id} c={c}
            expanded={expandedId === c.id}
            onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            onClear={(method) => clearCondition(c.id, method)}
            onSubmitUW={() => submitForUW(c.id)}
          />
        ))}
      </div>
    </>
  );
}

// ── AI result config ────────────────────────────────────────────────────────
const AI_RESULT_CONFIG = {
  clear:   { color: 'var(--status-green)', bg: 'var(--card-green-bg)', border: 'var(--card-green-border)', icon: 'checkCircle', label: 'AI — Ready to clear' },
  partial: { color: 'var(--status-amber)', bg: 'var(--card-amber-bg)', border: 'var(--card-amber-border)', icon: 'alertCircle', label: 'AI — Partial match' },
  rejected:{ color: 'var(--status-red)',   bg: 'var(--card-red-bg)',   border: 'var(--card-red-border)',   icon: 'x',           label: 'AI — Wrong document' },
  review:  { color: '#7B3FA0',             bg: '#F5EFFE',              border: '#D4B8F5',                  icon: 'sparkle',     label: 'AI — Needs UW review' },
};

function ConditionRow({ c, expanded, onToggle, onClear, onSubmitUW }) {
  const isCleared = c.status === 'cleared';
  const isPending = c.status === 'pending';
  const isBlocking = c.blocking;
  const [uploadState, setUploadState] = React.useState(null); // null | 'analyzing' | 'done'
  const [aiResult, setAiResult] = React.useState(AI_ANALYSIS[c.id] || null);
  const [dragOver, setDragOver] = React.useState(false);
  const fileRef = React.useRef(null);

  const handleUpload = () => {
    setUploadState('analyzing');
    setTimeout(() => {
      setUploadState('done');
      if (!aiResult && AI_ANALYSIS[c.id]) setAiResult(AI_ANALYSIS[c.id]);
    }, 2000);
  };

  const accentColor = isCleared ? 'var(--status-green)' : isPending ? '#7B3FA0' : isBlocking ? 'var(--status-red)' : 'var(--status-amber)';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid ' + (isBlocking && !isCleared ? 'var(--card-red-border)' : 'var(--border-subtle)'),
      borderLeft: '3px solid ' + accentColor,
      borderRadius: 10,
      opacity: isCleared ? 0.75 : 1,
      transition: 'opacity 0.2s',
      overflow: 'hidden',
    }}>
      {/* Row header — always visible */}
      <div style={{ display: 'flex', gap: 12, padding: '13px 16px', cursor: 'pointer', alignItems: 'flex-start' }} onClick={onToggle}>
        <div style={{ marginTop: 3, flexShrink: 0 }}>
          {isCleared
            ? <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--status-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={10} color="#fff" strokeWidth={2.5}/></div>
            : isPending
            ? <div style={{ width: 18, height: 18, borderRadius: 999, background: '#EDE4FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="clock" size={10} color="#7B3FA0"/></div>
            : isBlocking
            ? <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--card-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="alertCircle" size={10} color="var(--status-red)"/></div>
            : <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--card-amber-bg)', border: '1.5px solid var(--status-amber)' }}/>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text-tertiary)' }}>{c.id}</span>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: isCleared ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: isCleared ? 'line-through' : 'none' }}>{c.title}</span>
            {isBlocking && !isCleared && <StatusPill tone="red">Blocking</StatusPill>}
            {isPending && !isCleared && <StatusPill tone="neutral" style={{ color: '#7B3FA0' }}>Pending UW</StatusPill>}
            {isCleared && <StatusPill tone="green">Cleared</StatusPill>}
            {aiResult && !isCleared && !isPending && (
              <span style={{ fontSize: 11, fontWeight: 600, color: AI_RESULT_CONFIG[aiResult.result]?.color, background: AI_RESULT_CONFIG[aiResult.result]?.bg, border: '1px solid ' + AI_RESULT_CONFIG[aiResult.result]?.border, padding: '1px 7px', borderRadius: 999 }}>
                {AI_RESULT_CONFIG[aiResult.result]?.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>{c.detail}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11.5, color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
            <span>{c.source} · {c.sourceWho}</span>
            <span>Due {c.due}</span>
            <span>{c.assignee}</span>
            {isCleared && <span style={{ color: 'var(--status-green)' }}>Cleared {c.clearedAt} · {c.clearedBy}</span>}
          </div>
        </div>
        <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={14} color="var(--text-tertiary)" strokeWidth={2}/>
      </div>

      {/* Expanded detail */}
      {expanded && !isCleared && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 18px 18px', background: 'var(--bg-canvas)' }}>

          {/* Requirement box */}
          <div style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 5 }}>Requirement</div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{c.detail}</div>
            {c.uwNote && <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}><Icon name="user" size={12} style={{ flexShrink: 0, marginTop: 1 }}/> UW note: {c.uwNote}</div>}
          </div>

          {/* AI analysis result */}
          {uploadState === 'analyzing' && (
            <div style={{ marginBottom: 14, padding: '14px 16px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, border: '2px solid var(--ai-primary)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', flexShrink: 0 }}/>
              <span style={{ fontSize: 13, color: 'var(--ai-ink)' }}>AI is reading the document…</span>
            </div>
          )}

          {uploadState === 'done' && aiResult && (
            <AiAnalysisCard result={aiResult} blocking={c.blocking} onClear={() => onClear('ai')} onSubmitUW={onSubmitUW}/>
          )}

          {/* Drop zone — hide after analysis */}
          {uploadState !== 'done' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(); }}
              style={{
                marginBottom: 14,
                padding: '22px 16px',
                border: `2px dashed ${dragOver ? 'var(--ai-primary)' : 'var(--border-default)'}`,
                borderRadius: 10,
                background: dragOver ? 'var(--ai-bg)' : 'var(--bg-surface)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleUpload}/>
              <Icon name="upload" size={20} color={dragOver ? 'var(--ai-primary)' : 'var(--text-tertiary)'} strokeWidth={1.5}/>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, color: dragOver ? 'var(--ai-primary)' : 'var(--text-secondary)' }}>
                Drop document here or <span style={{ color: 'var(--ai-primary)', textDecoration: 'underline' }}>browse</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-tertiary)' }}>
                AI will read it and check if it satisfies this condition
              </div>
              <button className="btn btn-ai btn-sm" style={{ marginTop: 12 }} onClick={e => { e.stopPropagation(); handleUpload(); }}>
                <Icon name="sparkle" size={12}/> Simulate AI Upload
              </button>
            </div>
          )}

          {/* Manual actions footer */}
          {!aiResult && (
            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              {c.blocking
                ? <button className="btn btn-outline btn-sm" onClick={onSubmitUW}>Submit for UW Approval</button>
                : <button className="btn btn-success btn-sm" onClick={() => onClear('manual')}><Icon name="check" size={12} strokeWidth={2.5}/> Clear Manually</button>
              }
              <button className="btn btn-ghost btn-sm">Add note</button>
              <button className="btn btn-ghost btn-sm">Reassign</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AiAnalysisCard({ result, blocking, onClear, onSubmitUW }) {
  const cfg = AI_RESULT_CONFIG[result.result] || AI_RESULT_CONFIG.review;
  return (
    <div style={{ marginBottom: 14, background: cfg.bg, border: '1px solid ' + cfg.border, borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid ' + cfg.border }}>
        <Icon name={cfg.icon} size={15} color={cfg.color} strokeWidth={1.7}/>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>· {result.docName}</span>
      </div>

      {/* Summary */}
      <div style={{ padding: '12px 16px 10px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55 }}>
        {result.summary}
      </div>

      {/* Findings table */}
      <div style={{ margin: '0 16px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 7, border: '1px solid ' + cfg.border, overflow: 'hidden' }}>
        {result.findings.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '7px 12px', borderBottom: i < result.findings.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{f.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{f.value}</span>
            <span style={{ fontSize: 13, color: f.match ? 'var(--status-green)' : 'var(--status-red)', fontWeight: 700 }}>{f.match ? '✓' : '✗'}</span>
          </div>
        ))}
      </div>

      {/* Action row */}
      {result.action && (
        <div style={{ padding: '0 16px 12px', fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alertCircle" size={12} color="var(--status-amber)"/>
          {result.action}
        </div>
      )}

      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: 8, borderTop: '1px solid ' + cfg.border }}>
        {result.result === 'clear' && (
          <>
            <button className="btn btn-success btn-sm" onClick={onClear} style={{ fontWeight: 600 }}>
              <Icon name="check" size={13} strokeWidth={2.5}/> Confirm & Clear Condition
            </button>
            <button className="btn btn-ghost btn-sm">Reject AI result</button>
          </>
        )}
        {result.result === 'partial' && (
          <>
            <button className="btn btn-outline btn-sm"><Icon name="send" size={12}/> Request from borrower</button>
            {blocking
              ? <button className="btn btn-outline btn-sm" onClick={onSubmitUW}>Submit for UW Approval</button>
              : <button className="btn btn-success btn-sm" onClick={onClear}>Clear with flag noted</button>
            }
          </>
        )}
        {result.result === 'rejected' && (
          <>
            <button className="btn btn-primary btn-sm"><Icon name="send" size={12}/> Request correct document</button>
            <button className="btn btn-ghost btn-sm">Override & clear manually</button>
          </>
        )}
        {result.result === 'review' && (
          <>
            <button className="btn btn-primary btn-sm" onClick={onSubmitUW}><Icon name="send" size={12}/> Send to UW for review</button>
            <button className="btn btn-ghost btn-sm" onClick={onClear}>Override & clear anyway</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AUS WORKSPACE
   ============================================================ */

function AUSTab() {
  const [engine, setEngine] = React.useState('DU');

  return (
    <>
      <WorkspaceHeader
        title="AUS Findings"
        subtitle="Automated underwriting decision and conditions"
        actions={<>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }}>
            <Icon name="download" size={13}/>
            Download findings
          </button>
          <button className="btn btn-primary btn-sm" style={{ height: 32 }}>
            <Icon name="zap" size={13}/>
            Re-submit to AUS
          </button>
        </>}
      />

      {/* Engine tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 22,
      }}>
        {['DU', 'LP', 'Manual UW'].map(e => {
          const active = engine === e;
          return (
            <button key={e} onClick={() => setEngine(e)} style={{
              padding: '10px 16px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 500,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>{e === 'DU' ? 'Desktop Underwriter' : e === 'LP' ? 'Loan Product Advisor' : e}</button>
          );
        })}
      </div>

      {/* Decision card */}
      <div style={{
        background: 'linear-gradient(135deg, #ECF6EE 0%, #DCEFE0 100%)',
        border: '1px solid #C8E3D0',
        borderRadius: 14,
        padding: 22,
        marginBottom: 22,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Latest Decision · Run #{engine === 'DU' ? '3' : '1'} · May 12, 2026
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 6 }}>
            Approve / Eligible
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4 }}>
            Conventional 30yr fixed · Owner-occupied · Purchase
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <KeyMetric label="DTI" value="38%"/>
          <KeyMetric label="LTV" value="80%"/>
          <KeyMetric label="Reserves" value="6.2 mo"/>
          <KeyMetric label="Credit Score" value="742"/>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Conditions generated */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Conditions Generated" badge="6"/>
          <FindingRow
            tone="green" type="Verification"
            title="Credit report — Equifax tri-merge"
            detail="DU validated 742 / 718 / 731"
          />
          <FindingRow
            tone="green" type="Verification"
            title="Asset verification"
            detail="$148,500 verified across 3 accounts"
          />
          <FindingRow
            tone="amber" type="Prior to Doc"
            title="Updated VOE within 10 days of closing"
          />
          <FindingRow
            tone="amber" type="Prior to Doc"
            title="LOX — large deposit $8,500 on 3/14"
          />
          <FindingRow
            tone="blue" type="Prior to Funding"
            title="Hazard insurance binder — 1 year prepaid"
          />
          <FindingRow
            tone="blue" type="At Closing"
            title="Borrower CD acknowledgment ≥ 3 business days"
          />
        </div>

        {/* Run history */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Run History"/>
          <RunHistoryRow
            num={3} date="May 12, 2026 · 8:45 AM"
            result="Approve / Eligible" tone="green"
            who="System · auto"
          />
          <RunHistoryRow
            num={2} date="May 8, 2026 · 11:20 AM"
            result="Refer / Eligible" tone="amber"
            who="Alex Martinez"
            note="Re-ran after asset doc added"
          />
          <RunHistoryRow
            num={1} date="May 5, 2026 · 10:02 AM"
            result="Refer / Eligible" tone="amber"
            who="Alex Martinez"
            note="Initial submission"
          />
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <RiskRow label="Credit Risk" tone="green" detail="No derogatory accounts"/>
        <RiskRow label="Income Risk" tone="green" detail="DTI within guidelines"/>
        <RiskRow label="Property Risk" tone="amber" detail="Appraisal pending"/>
      </div>
    </>
  );
}

function FindingRow({ tone, type, title, detail }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 999, marginTop: 7,
        background: tone === 'green' ? 'var(--status-green)' :
                    tone === 'amber' ? 'var(--status-amber)' :
                    tone === 'red'   ? 'var(--status-red)' :
                                       'var(--status-blue)',
        flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div>
        {detail && <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>}
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>{type}</span>
    </div>
  );
}

function RunHistoryRow({ num, date, result, tone, who, note }) {
  return (
    <div style={{
      padding: '12px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6,
          background: 'var(--bg-muted)', color: 'var(--text-secondary)',
          fontSize: 11, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>#{num}</span>
        <StatusPill tone={tone}>{result}</StatusPill>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{date} · {who}</div>
      {note && <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>{note}</div>}
    </div>
  );
}

function RiskRow({ label, tone, detail }) {
  const bg = tone === 'green' ? 'var(--status-green-bg)' : tone === 'amber' ? 'var(--status-amber-bg)' : 'var(--status-red-bg)';
  const fg = tone === 'green' ? 'var(--status-green)' : tone === 'amber' ? 'var(--status-amber)' : 'var(--status-red)';
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: bg, color: fg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={tone === 'green' ? 'check' : 'alertCircle'} size={12} strokeWidth={2.5}/>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 6 }}>{detail}</div>
    </div>
  );
}

function KeyMetric({ label, value }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'DM Mono', marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* ============================================================
   PRICING & LOCK WORKSPACE
   ============================================================ */

function PricingLockTab() {
  const [toast, setToast] = React.useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 48, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1d23', color: '#fff', padding: '10px 20px', borderRadius: 10,
          fontSize: 13, fontWeight: 500, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="sparkle" size={13} color="#7E68FA" strokeWidth={1.6}/>{toast}
        </div>
      )}
      <WorkspaceHeader
        title="Pricing & Lock"
        subtitle="Rate scenarios, lock status, and price adjustments"
        actions={<>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }} onClick={() => showToast('Scenario comparison — PPE integration coming soon')}>
            <Icon name="trendingUp" size={13}/>
            Compare scenarios
          </button>
          <button className="btn btn-primary btn-sm" style={{ height: 32 }} onClick={() => showToast('Re-pricing against live PPE — coming soon')}>
            <Icon name="zap" size={13}/>
            Re-price
          </button>
        </>}
      />

      {/* Lock status hero */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1F2447 0%, #2B2F62 100%)',
        color: '#fff',
        borderRadius: 16,
        padding: 26,
        marginBottom: 22,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.08)',
            padding: '5px 12px 5px 10px',
            borderRadius: 999,
            fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: '#3DDB8C' }}/>
            Locked
          </div>
          <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 18 }}>
            6.875<span style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>%</span>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', marginTop: 8 }}>
            45-day lock · Conventional 30yr fixed · Locked May 10, 2026
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button style={lightButton}>Extend lock</button>
            <button style={lightButton}>Float down</button>
            <button style={lightButton}>Renegotiate</button>
          </div>
        </div>
        <div>
          <LockCountdown days={38}/>
        </div>
      </div>

      {/* Pricing breakdown + adjustments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Price Build-up"/>
          <PriceRow label="Base price (par)" value="100.250" mono/>
          <PriceRow label="SRP / Service Release" value="+0.625" tone="green" mono/>
          <PriceRow label="LLPA — Credit / LTV (742/80)" value="-0.250" tone="red" mono/>
          <PriceRow label="LLPA — Occupancy" value="0.000" mono/>
          <PriceRow label="Margin (branch)" value="-1.500" mono/>
          <PriceRow label="Lock period (45d)" value="-0.125" mono/>
          <PriceRow label="Total price" value="99.000" mono bold/>
          <PriceRow label="Discount / (rebate)" value="$2,656" mono tone="red"/>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Rate Comparison"/>
          <RateScenario rate="6.625" points="0.875" pi="$2,723" tone="neutral"/>
          <RateScenario rate="6.750" points="0.375" pi="$2,756" tone="neutral"/>
          <RateScenario rate="6.875" points="0.000" pi="$2,792" tone="active" badge="Locked"/>
          <RateScenario rate="7.000" points="-0.500" pi="$2,827" tone="neutral"/>
          <RateScenario rate="7.125" points="-1.125" pi="$2,861" tone="neutral"/>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <SummaryTile value="$425,000" label="Loan amount" tone="neutral"/>
        <SummaryTile value="$2,792" label="Monthly P&I" tone="neutral"/>
        <SummaryTile value="7.012%" label="APR" tone="neutral"/>
        <SummaryTile value="Jun 24" label="Lock expires" tone="amber"/>
      </div>
    </>
  );
}

function LockCountdown({ days }) {
  const pct = Math.min(100, (days / 45) * 100);
  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
        Days Remaining
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em' }}>{days}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>of 45</span>
      </div>
      <div style={{
        marginTop: 14,
        height: 6, borderRadius: 999,
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: pct + '%', height: '100%',
          background: pct < 25 ? '#FFB053' : '#7E68FA',
          borderRadius: 999,
        }}/>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
        Expires June 24, 2026
      </div>
    </div>
  );
}

const lightButton = {
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 8,
  height: 34, padding: '0 14px',
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer', fontFamily: 'inherit',
};

function PriceRow({ label, value, tone, mono, bold }) {
  const color = tone === 'green' ? 'var(--status-green)' : tone === 'red' ? 'var(--status-red)' : 'var(--text-primary)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 18px',
      borderBottom: '1px solid var(--border-subtle)',
      background: bold ? 'var(--bg-muted)' : 'transparent',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{
        fontFamily: mono ? 'DM Mono' : 'inherit',
        fontSize: 13.5, fontWeight: bold ? 700 : 500,
        color,
      }}>{value}</span>
    </div>
  );
}

function RateScenario({ rate, points, pi, tone, badge }) {
  const active = tone === 'active';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto auto',
      gap: 14, alignItems: 'center',
      padding: '11px 18px',
      borderBottom: '1px solid var(--border-subtle)',
      background: active ? 'var(--ai-bg)' : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'DM Mono', fontSize: 14, fontWeight: 600 }}>{rate}%</span>
        {badge && <StatusPill tone="ai">{badge}</StatusPill>}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'DM Mono' }}>{points}</span>
      <span style={{ fontSize: 13, fontFamily: 'DM Mono' }}>{pi}/mo</span>
      <button className="btn btn-outline btn-sm" style={{ visibility: active ? 'hidden' : 'visible' }}>
        Select
      </button>
    </div>
  );
}

/* ============================================================
   CLOSING WORKSPACE
   ============================================================ */

function ClosingTab() {
  return (
    <>
      <WorkspaceHeader
        title="Closing"
        subtitle="Closing Disclosure, signing schedule, and funding"
        actions={<>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }}>
            <Icon name="mail" size={13}/>
            Send CD
          </button>
          <button className="btn btn-primary btn-sm" style={{ height: 32 }}>
            <Icon name="zap" size={13}/>
            Generate closing package
          </button>
        </>}
      />

      {/* CD timeline */}
      <div className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>TRID Timeline</div>
          <StatusPill tone="green">On track</StatusPill>
        </div>
        <CDTimeline/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Closing schedule */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Signing Appointment"/>
          <div style={{ padding: 18, display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={{
              flexShrink: 0,
              width: 64, height: 64, borderRadius: 12,
              background: 'var(--ai-bg)',
              border: '1px solid var(--ai-border)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--ai-ink)', fontWeight: 600, letterSpacing: '0.06em' }}>JUN</div>
              <div style={{ fontSize: 24, color: 'var(--ai-ink)', fontWeight: 600, lineHeight: 1 }}>27</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Friday, June 27 · 2:00 PM MT</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                First American Title — 1700 Lincoln St, Denver CO
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="settings" size={12}/> Hybrid eClose
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="phone" size={12}/> Notary scheduled
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="checkCircle" size={12}/> Power of attorney N/A
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn btn-outline btn-sm">Reschedule</button>
                <button className="btn btn-outline btn-sm">Notify attendees</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <SubsectionTitle>Attendees</SubsectionTitle>
            <AttendeeRow name="Sarah Anderson" role="Borrower" status="confirmed"/>
            <AttendeeRow name="John Anderson" role="Co-borrower" status="confirmed"/>
            <AttendeeRow name="Maria Lopez" role="Settlement agent · First American" status="confirmed"/>
            <AttendeeRow name="Alex Martinez" role="Loan officer · Xpanse" status="optional"/>
          </div>
        </div>

        {/* Funding & wire */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <SectionHeader title="Funding & Wire" badge={
            <StatusPill tone="amber">2 of 4 ready</StatusPill>
          }/>
          <FundingRow label="Closing package" status="ready" detail="Generated May 14"/>
          <FundingRow label="Wire authorization" status="ready" detail="Approved by Alex Martinez"/>
          <FundingRow label="Funding conditions cleared" status="pending" detail="2 conditions outstanding"/>
          <FundingRow label="Wire sent" status="not-ready" detail="Scheduled for June 27"/>
          <div style={{ padding: 16, background: 'var(--bg-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Funding amount</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>$425,000.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cash to close</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>$87,235.18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doc checklist */}
      <div className="card" style={{ overflow: 'hidden', marginTop: 18 }}>
        <SectionHeader title="Closing Package" badge="14 of 16 prepared"/>
        <ClosingDocRow label="Note" status="ready"/>
        <ClosingDocRow label="Deed of Trust" status="ready"/>
        <ClosingDocRow label="Closing Disclosure (final)" status="ready"/>
        <ClosingDocRow label="Loan Estimate (initial + revised)" status="ready"/>
        <ClosingDocRow label="Settlement Statement" status="ready"/>
        <ClosingDocRow label="Compliance certifications (HMDA, TRID)" status="ready"/>
        <ClosingDocRow label="First payment letter" status="ready"/>
        <ClosingDocRow label="Servicing transfer disclosure" status="needs"/>
        <ClosingDocRow label="Wire instructions verification" status="needs"/>
      </div>
    </>
  );
}

function CDTimeline() {
  const steps = [
    { label: 'CD prepared', date: 'Jun 20', done: true },
    { label: 'CD delivered', date: 'Jun 21', done: true },
    { label: 'Acknowledgment', date: 'Jun 22', done: true },
    { label: '3-day waiting period', date: 'Jun 22–25', done: true, isPeriod: true },
    { label: 'Earliest signing', date: 'Jun 26', done: false, current: true },
    { label: 'Funding', date: 'Jun 27', done: false },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: s.done ? 'var(--status-green)' : s.current ? 'var(--ai-primary)' : 'var(--bg-surface)',
              border: '2px solid ' + (s.done ? 'var(--status-green)' : s.current ? 'var(--ai-primary)' : 'var(--border-default)'),
              margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.done || s.current ? '#fff' : 'var(--text-tertiary)',
              position: 'relative', zIndex: 2,
            }}>
              {s.done && <Icon name="check" size={14} strokeWidth={2.5}/>}
              {!s.done && !s.current && <span style={{ fontSize: 10, fontWeight: 600 }}>{i+1}</span>}
              {s.current && <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff' }}/>}
            </div>
            <div style={{
              fontSize: 12, fontWeight: s.current ? 600 : 500,
              color: s.current ? 'var(--text-primary)' : 'var(--text-secondary)',
              marginTop: 8,
            }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2, fontFamily: 'DM Mono' }}>{s.date}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flexShrink: 0, height: 2, width: 28,
              background: steps[i+1].done ? 'var(--status-green)' : 'var(--border-default)',
              marginBottom: 38,
            }}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SubsectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '14px 18px 6px',
    }}>{children}</div>
  );
}

function AttendeeRow({ name, role, status }) {
  const meta = {
    confirmed: { tone: 'green', label: 'Confirmed' },
    pending:   { tone: 'amber', label: 'Pending RSVP' },
    optional:  { tone: 'neutral', label: 'Optional' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <Avatar initials={name.split(' ').map(w => w[0]).join('').slice(0,2)} size={28} color="#E5E4E0" textColor="#3A3A38"/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{role}</div>
      </div>
      <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
    </div>
  );
}

function FundingRow({ label, status, detail }) {
  const meta = {
    ready:     { icon: 'check', tone: 'green', bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
    pending:   { icon: 'clock', tone: 'amber', bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
    'not-ready': { icon: 'clock', tone: 'neutral', bg: 'var(--bg-muted)', fg: 'var(--text-tertiary)' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background: meta.bg, color: meta.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={meta.icon} size={12} strokeWidth={2}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function ClosingDocRow({ label, status }) {
  const meta = {
    ready: { tone: 'green', label: 'Ready', icon: 'check' },
    needs: { tone: 'amber', label: 'Needs review', icon: 'alertCircle' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <Icon name="doc" size={14} color="var(--text-tertiary)"/>
      <span style={{ flex: 1, fontSize: 13.5 }}>{label}</span>
      <StatusPill tone={meta.tone}><Icon name={meta.icon} size={10} strokeWidth={2.5}/> {meta.label}</StatusPill>
      <button className="btn btn-outline btn-sm">Preview</button>
    </div>
  );
}

/* ============================================================
   AUDIT TRAIL WORKSPACE
   ============================================================ */

const AUDIT_DATA = [
  { ts: '2026-05-14 09:15:22', user: 'Sarah Anderson', userKind: 'borrower',
    type: 'doc', action: 'Uploaded document', target: 'Bank_Statement_March.pdf', meta: 'via Borrower Portal' },
  { ts: '2026-05-14 08:45:08', user: 'System · AI', userKind: 'system',
    type: 'auto', action: 'Income calculation completed', target: 'Income field updated to $100,000',
    meta: 'Confidence 95% · DTI auto-recomputed' },
  { ts: '2026-05-14 07:30:14', user: 'Alex Martinez', userKind: 'staff',
    type: 'stage', action: 'Moved to Underwriting', target: 'Status: Processing → Underwriting',
    meta: 'Workflow transition' },
  { ts: '2026-05-13 16:22:01', user: 'Alex Martinez', userKind: 'staff',
    type: 'comm', action: 'Sent email', target: 'sarah.anderson@email.com',
    meta: 'Subject: Additional documentation needed' },
  { ts: '2026-05-13 11:45:32', user: 'Alex Martinez', userKind: 'staff',
    type: 'order', action: 'Ordered appraisal', target: 'APR-29841 · ABC Appraisal Co.',
    meta: 'Fee: $625' },
  { ts: '2026-05-12 14:10:55', user: 'System · AI', userKind: 'system',
    type: 'auto', action: 'AUS rerun', target: 'DU Run #3 — Approve/Eligible',
    meta: 'Triggered by asset doc upload' },
  { ts: '2026-05-12 09:42:18', user: 'Priya Shah', userKind: 'staff',
    type: 'field', action: 'Field edited', target: 'Borrower.PhoneNumber',
    meta: '(303) 555-0100 → (303) 555-0142' },
  { ts: '2026-05-10 15:18:44', user: 'Alex Martinez', userKind: 'staff',
    type: 'lock', action: 'Rate locked', target: '6.875% · 45 days',
    meta: 'Lock expires June 24, 2026' },
  { ts: '2026-05-10 10:02:11', user: 'Sarah Anderson', userKind: 'borrower',
    type: 'app', action: 'Application submitted', target: 'LN-2024-0234 created',
    meta: 'Loan amount: $425,000 · Conv 30yr fixed' },
];

const AUDIT_TYPES = {
  doc:    { color: 'var(--text-secondary)',     bg: 'var(--bg-muted)',         icon: 'doc' },
  auto:   { color: 'var(--ai-primary)',         bg: 'var(--ai-bg)',            icon: 'sparkle' },
  stage:  { color: 'var(--status-green)',       bg: 'var(--status-green-bg)',  icon: 'trendingUp' },
  comm:   { color: 'var(--status-blue)',        bg: 'var(--status-blue-bg)',   icon: 'mail' },
  order:  { color: 'var(--status-amber)',       bg: 'var(--status-amber-bg)',  icon: 'shoppingCart' },
  field:  { color: '#8B5CF6',                   bg: '#F0E9FE',                 icon: 'settings' },
  lock:   { color: 'var(--ai-ink)',             bg: 'var(--ai-bg)',            icon: 'pin' },
  app:    { color: 'var(--text-primary)',       bg: 'var(--bg-muted)',         icon: 'doc' },
};

function AuditTab() {
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [userFilter, setUserFilter] = React.useState('all');

  const filtered = AUDIT_DATA.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (userFilter === 'staff' && e.userKind !== 'staff') return false;
    if (userFilter === 'borrower' && e.userKind !== 'borrower') return false;
    if (userFilter === 'system' && e.userKind !== 'system') return false;
    return true;
  });

  return (
    <>
      <WorkspaceHeader
        title="Audit Trail"
        subtitle="Every field change, user action, and system event"
        actions={<>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }}>
            <Icon name="filter" size={13}/>
            Advanced filter
          </button>
          <button className="btn btn-outline btn-sm" style={{ height: 32 }}>
            <Icon name="download" size={13}/>
            Export CSV
          </button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <SummaryTile value={AUDIT_DATA.length} label="Events (last 7 days)" tone="neutral"/>
        <SummaryTile value={AUDIT_DATA.filter(e => e.userKind === 'staff').length} label="Staff actions" tone="neutral"/>
        <SummaryTile value={AUDIT_DATA.filter(e => e.userKind === 'system').length} label="System / AI events" tone="ai"/>
        <SummaryTile value={AUDIT_DATA.filter(e => e.type === 'field').length} label="Field edits" tone="neutral"/>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Type:</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'field', label: 'Field' },
            { id: 'stage', label: 'Stage' },
            { id: 'comm', label: 'Comms' },
            { id: 'doc', label: 'Docs' },
            { id: 'auto', label: 'AI / Auto' },
            { id: 'order', label: 'Orders' },
            { id: 'lock', label: 'Lock' },
          ].map(opt => {
            const active = typeFilter === opt.id;
            return (
              <button key={opt.id} onClick={() => setTypeFilter(opt.id)} style={{
                height: 28, padding: '0 10px',
                borderRadius: 999,
                border: '1px solid ' + (active ? 'var(--text-primary)' : 'var(--border-subtle)'),
                background: active ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{opt.label}</button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 8px' }}/>

        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginRight: 4 }}>Actor:</span>
        <SegmentedTabs
          value={userFilter}
          onChange={setUserFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'staff', label: 'Staff' },
            { value: 'borrower', label: 'Borrower' },
            { value: 'system', label: 'System' },
          ]}
        />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)' }}>
              {['Time', 'Actor', 'Action', 'Target', 'Detail'].map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  fontSize: 11.5, fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const t = AUDIT_TYPES[e.type] || AUDIT_TYPES.doc;
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {e.ts}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar initials={e.user.split(' ').map(w => w[0]).join('').slice(0,2)} size={24}
                        color={e.userKind === 'system' ? 'var(--ai-bg-strong)' : e.userKind === 'borrower' ? '#FBEFD2' : '#E5E4E0'}
                        textColor={e.userKind === 'system' ? 'var(--ai-ink)' : e.userKind === 'borrower' ? '#9C6A1A' : '#3A3A38'}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.user}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{e.userKind}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: t.bg, color: t.color,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon name={t.icon} size={11} strokeWidth={1.85}/>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{e.action}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>
                    {e.target}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-tertiary)' }}>
                    {e.meta}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

function WorkspaceHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 16, marginBottom: 22,
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>{title}</h2>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>{subtitle}</div>
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

function SummaryTile({ value, label, tone = 'neutral' }) {
  const toneColors = {
    green: 'var(--status-green)',
    amber: 'var(--status-amber)',
    red:   'var(--status-red)',
    blue:  'var(--status-blue)',
    ai:    'var(--ai-primary)',
    neutral: 'var(--text-primary)',
  };
  return (
    <div className="card" style={{ padding: '14px 18px' }}>
      <div style={{
        fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1,
        color: toneColors[tone],
      }}>{value}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 8 }}>{label}</div>
    </div>
  );
}

function SectionHeader({ title, badge }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
      {typeof badge === 'string' || typeof badge === 'number' ? (
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{badge}</span>
      ) : badge}
    </div>
  );
}

function SegmentedTabs({ value, onChange, options }) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-muted)',
      borderRadius: 8, padding: 3, height: 32,
    }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            height: 26, padding: '0 12px',
            border: 'none', borderRadius: 6,
            background: active ? 'var(--bg-surface)' : 'transparent',
            boxShadow: active ? 'var(--shadow-sm)' : 'none',
            color: 'var(--text-primary)', fontSize: 12.5,
            fontWeight: active ? 600 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

export { ConditionsTab, AUSTab, PricingLockTab, ClosingTab, AuditTab };
