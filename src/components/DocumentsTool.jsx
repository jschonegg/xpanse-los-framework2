import React from 'react';
import { Icon } from './Icon';

// ─── Document data ─────────────────────────────────────────────────────────────
const DOC_TYPES = [
  { id: 'income',      label: 'Income',       color: '#7E68FA' },
  { id: 'assets',      label: 'Assets',       color: '#0EA5E9' },
  { id: 'property',    label: 'Property',     color: '#059669' },
  { id: 'identity',    label: 'Identity',     color: '#D97706' },
  { id: 'disclosures', label: 'Disclosures',  color: '#7C3AED' },
  { id: 'title',       label: 'Title',        color: '#0F766E' },
  { id: 'insurance',   label: 'Insurance',    color: '#C2410C' },
  { id: 'other',       label: 'Other',        color: '#6B7280' },
];

const PHASES = ['All', 'Application', 'Processing', 'Underwriting', 'Closing'];

const STATUS_META = {
  missing:   { label: 'Missing',   bg: '#FEF0ED', color: '#B03025', dot: '#D74C3C' },
  requested: { label: 'Requested', bg: '#FEF7E8', color: '#9C6A1A', dot: '#E0A23A' },
  received:  { label: 'Received',  bg: '#EEF3FE', color: '#3553CC', dot: '#5C7CFA' },
  reviewed:  { label: 'Reviewed',  bg: '#F0FDF4', color: '#166534', dot: '#3DA866' },
  approved:  { label: 'Approved',  bg: '#F0FDF4', color: '#166534', dot: '#16A34A' },
};

const INITIAL_DOCS = [
  // Income
  { id: 'd1',  type: 'income',      phase: 'Processing',   name: 'W-2 (2024)',                   status: 'approved', uploadedBy: 'Sarah Anderson', uploadedAt: 'May 8, 9:14 AM',  size: '142 KB', versions: [{ at: 'May 8, 9:14 AM', by: 'Sarah Anderson', note: 'Initial upload' }], annotations: [], requests: [] },
  { id: 'd2',  type: 'income',      phase: 'Processing',   name: 'W-2 (2023)',                   status: 'approved', uploadedBy: 'Sarah Anderson', uploadedAt: 'May 8, 9:14 AM',  size: '138 KB', versions: [{ at: 'May 8, 9:14 AM', by: 'Sarah Anderson', note: 'Initial upload' }], annotations: [], requests: [] },
  { id: 'd3',  type: 'income',      phase: 'Processing',   name: 'Paystubs — last 2 months',     status: 'approved', uploadedBy: 'Sarah Anderson', uploadedAt: 'May 8, 9:15 AM',  size: '284 KB', versions: [{ at: 'May 8, 9:15 AM', by: 'Sarah Anderson', note: 'Initial upload' }], annotations: [], requests: [] },
  { id: 'd4',  type: 'income',      phase: 'Underwriting', name: 'Tax Returns (2023, 2024)',      status: 'missing',  uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [{ at: 'May 16', to: 'Sarah Anderson', by: 'Alex Torres', channel: 'portal' }] },
  // Assets
  { id: 'd5',  type: 'assets',      phase: 'Processing',   name: 'Bank Statements — March',      status: 'requested',uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [{ at: 'May 16', to: 'Sarah Anderson', by: 'Alex Torres', channel: 'portal' }] },
  { id: 'd6',  type: 'assets',      phase: 'Processing',   name: 'Bank Statements — April',      status: 'requested',uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [{ at: 'May 16', to: 'Sarah Anderson', by: 'Alex Torres', channel: 'portal' }] },
  { id: 'd7',  type: 'assets',      phase: 'Closing',      name: 'Gift Letter — $18,000',        status: 'reviewed', uploadedBy: 'Sarah Anderson', uploadedAt: 'May 20, 2:30 PM', size: '89 KB',  versions: [{ at: 'May 20, 2:30 PM', by: 'Sarah Anderson', note: 'Signed and uploaded' }], annotations: [{ by: 'Alex Torres', at: 'May 20, 3:01 PM', text: 'Donor name and amount match 1003 — ready to clear C-011' }], requests: [] },
  // Property
  { id: 'd8',  type: 'property',    phase: 'Processing',   name: 'Purchase Contract',            status: 'approved', uploadedBy: 'Maria Gonzalez', uploadedAt: 'May 5, 11:20 AM', size: '512 KB', versions: [{ at: 'May 5, 11:20 AM', by: 'Maria Gonzalez', note: 'Initial contract' }], annotations: [], requests: [] },
  { id: 'd9',  type: 'property',    phase: 'Underwriting', name: 'Appraisal Report',             status: 'received', uploadedBy: 'Derek Yun',      uploadedAt: 'May 21, 4:15 PM', size: '2.4 MB', versions: [{ at: 'May 21, 4:15 PM', by: 'Derek Yun', note: 'Final appraisal' }], annotations: [{ by: 'Alex Torres', at: 'May 21, 5:00 PM', text: 'Value came in at $500K — matches contract. No gap issue.' }], requests: [] },
  { id: 'd10', type: 'property',    phase: 'Underwriting', name: 'Hazard Insurance Binder',      status: 'missing',  uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [] },
  // Identity
  { id: 'd11', type: 'identity',    phase: 'Application',  name: 'Photo ID — Sarah Anderson',   status: 'approved', uploadedBy: 'Sarah Anderson', uploadedAt: 'May 6, 10:45 AM', size: '1.1 MB', versions: [{ at: 'May 6, 10:45 AM', by: 'Sarah Anderson', note: 'Driver\'s license' }], annotations: [], requests: [] },
  { id: 'd12', type: 'identity',    phase: 'Application',  name: 'Photo ID — John Anderson',    status: 'approved', uploadedBy: 'John Anderson',  uploadedAt: 'May 6, 11:02 AM', size: '980 KB', versions: [{ at: 'May 6, 11:02 AM', by: 'John Anderson', note: 'Passport' }], annotations: [], requests: [] },
  // Disclosures
  { id: 'd13', type: 'disclosures', phase: 'Application',  name: 'Loan Estimate — Signed',      status: 'approved', uploadedBy: 'Alex Torres',    uploadedAt: 'May 6, 8:00 AM',  size: '210 KB', versions: [{ at: 'May 6, 8:00 AM', by: 'Alex Torres', note: 'Initial LE issued' }, { at: 'May 14, 8:00 AM', by: 'Alex Torres', note: 'Revised LE — rate change' }], annotations: [], requests: [] },
  { id: 'd14', type: 'disclosures', phase: 'Closing',      name: 'Closing Disclosure',           status: 'missing',  uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [] },
  // Title
  { id: 'd15', type: 'title',       phase: 'Closing',      name: 'Title Commitment',             status: 'received', uploadedBy: 'Apex Title Co.', uploadedAt: 'May 19, 1:30 PM', size: '3.2 MB', versions: [{ at: 'May 19, 1:30 PM', by: 'Apex Title Co.', note: 'Preliminary commitment' }], annotations: [], requests: [] },
  { id: 'd16', type: 'title',       phase: 'Closing',      name: 'Wire Instructions',            status: 'missing',  uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [] },
  // Insurance
  { id: 'd17', type: 'insurance',   phase: 'Closing',      name: 'Homeowners Policy',            status: 'missing',  uploadedBy: null,             uploadedAt: null,              size: null,     versions: [], annotations: [], requests: [] },
];

// ─── Small pieces ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.missing;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: m.bg, color: m.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot, flexShrink: 0 }}/>
      {m.label}
    </span>
  );
}

function TypeTag({ typeId }) {
  const t = DOC_TYPES.find(d => d.id === typeId);
  if (!t) return null;
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: t.color + '18', color: t.color, border: `1px solid ${t.color}30` }}>
      {t.label}
    </span>
  );
}

// ─── Document row ──────────────────────────────────────────────────────────────
function DocRow({ doc, onSelect, isSelected, onUpdate }) {
  const [hovered, setHovered] = React.useState(false);
  const hasMissing = doc.status === 'missing' || doc.status === 'requested';

  return (
    <div
      onClick={() => onSelect(doc.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 14px',
        background: isSelected ? 'var(--ai-bg)' : hovered ? 'var(--bg-muted)' : 'transparent',
        borderLeft: isSelected ? '3px solid var(--ai-primary)' : '3px solid transparent',
        cursor: 'pointer', transition: 'background 0.1s',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* File icon */}
      <div style={{ width: 28, height: 28, borderRadius: 6, background: hasMissing ? 'var(--bg-muted)' : 'var(--card-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={hasMissing ? 'fileText' : 'doc'} size={14} color={hasMissing ? 'var(--text-tertiary)' : 'var(--status-green)'} strokeWidth={1.6}/>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: hasMissing ? 'var(--text-tertiary)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {doc.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <TypeTag typeId={doc.type}/>
          {doc.uploadedAt
            ? <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.uploadedAt.split(',')[0]}</span>
            : <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.requests.length > 0 ? `Requested ${doc.requests[0].at}` : 'Not yet requested'}</span>
          }
          {doc.annotations.length > 0 && (
            <span style={{ fontSize: 10.5, color: 'var(--ai-primary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Icon name="messageSquare" size={10}/>{doc.annotations.length}
            </span>
          )}
          {doc.versions.length > 1 && (
            <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>v{doc.versions.length}</span>
          )}
        </div>
      </div>

      <StatusBadge status={doc.status}/>
    </div>
  );
}

// ─── Detail panel ──────────────────────────────────────────────────────────────
function DocDetail({ doc, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = React.useState('info');
  const [editingName, setEditingName] = React.useState(false);
  const [draftName, setDraftName] = React.useState(doc.name);
  const [annotationText, setAnnotationText] = React.useState('');
  const [requestTo, setRequestTo] = React.useState('');
  const [requestSent, setRequestSent] = React.useState(false);

  const commitName = () => {
    if (draftName.trim() && draftName !== doc.name) onUpdate(doc.id, { name: draftName.trim() });
    setEditingName(false);
  };

  const addAnnotation = () => {
    if (!annotationText.trim()) return;
    const newAnnotation = { by: 'Alex Torres', at: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), text: annotationText.trim() };
    onUpdate(doc.id, { annotations: [...doc.annotations, newAnnotation] });
    setAnnotationText('');
  };

  const sendRequest = () => {
    if (!requestTo.trim()) return;
    const req = { at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), to: requestTo, by: 'Alex Torres', channel: 'portal' };
    onUpdate(doc.id, { requests: [...doc.requests, req], status: 'requested' });
    setRequestSent(true);
    setRequestTo('');
    setTimeout(() => setRequestSent(false), 2000);
  };

  const t = DOC_TYPES.find(d => d.id === doc.type);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-subtle)' }}>
      {/* Detail header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <input autoFocus value={draftName} onChange={e => setDraftName(e.target.value)}
                onBlur={commitName} onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setDraftName(doc.name); setEditingName(false); } }}
                style={{ width: '100%', fontSize: 13.5, fontWeight: 600, border: '1.5px solid var(--ai-primary)', borderRadius: 5, padding: '3px 7px', fontFamily: 'inherit', outline: 'none', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}/>
            ) : (
              <div onClick={() => setEditingName(true)} title="Click to rename"
                style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, cursor: 'text', padding: '3px 7px', margin: '0 -7px', borderRadius: 5, border: '1.5px solid transparent', transition: 'border-color 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                {doc.name}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
              <StatusBadge status={doc.status}/>
              <select value={doc.status} onChange={e => onUpdate(doc.id, { status: e.target.value })}
                style={{ fontSize: 11, border: '1px solid var(--border-subtle)', borderRadius: 5, padding: '1px 5px', background: 'var(--bg-muted)', color: 'var(--text-secondary)', fontFamily: 'inherit', cursor: 'pointer' }}>
                {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="x" size={12}/>
          </button>
        </div>
      </div>

      {/* Detail tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, padding: '0 4px' }}>
        {[{ id: 'info', label: 'Info' }, { id: 'notes', label: `Notes${doc.annotations.length > 0 ? ` (${doc.annotations.length})` : ''}` }, { id: 'request', label: 'Request' }, { id: 'history', label: `History${doc.versions.length > 0 ? ` (${doc.versions.length})` : ''}` }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: activeTab === t.id ? 600 : 400,
            color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom: `2px solid ${activeTab === t.id ? 'var(--ai-primary)' : 'transparent'}`,
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Detail body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>

        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Type + Phase */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Type</div>
                <select value={doc.type} onChange={e => onUpdate(doc.id, { type: e.target.value })}
                  style={{ width: '100%', padding: '5px 8px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--bg-muted)', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  {DOC_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Phase</div>
                <select value={doc.phase} onChange={e => onUpdate(doc.id, { phase: e.target.value })}
                  style={{ width: '100%', padding: '5px 8px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--bg-muted)', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  {PHASES.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* File info */}
            {doc.uploadedAt ? (
              <div style={{ background: 'var(--bg-muted)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Uploaded by', value: doc.uploadedBy },
                  { label: 'Upload date', value: doc.uploadedAt },
                  { label: 'File size', value: doc.size },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{r.label}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: STATUS_META[doc.status]?.bg || 'var(--bg-muted)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: STATUS_META[doc.status]?.color || 'var(--text-secondary)', lineHeight: 1.5 }}>
                {doc.status === 'requested'
                  ? `Requested on ${doc.requests[0]?.at || '—'} · Awaiting upload from ${doc.requests[0]?.to || 'borrower'}`
                  : 'Document not yet received. Use the Request tab to send a document request.'}
              </div>
            )}

            {/* Upload stub */}
            <div style={{ border: '2px dashed var(--border-default)', borderRadius: 8, padding: '16px', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ai-primary)'; e.currentTarget.style.background = 'var(--ai-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'transparent'; }}>
              <Icon name="upload" size={18} color="var(--text-tertiary)" strokeWidth={1.5}/>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 6 }}>Drop file or click to upload</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>PDF, JPG, PNG — max 25 MB</div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doc.annotations.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '8px 0' }}>No notes yet. Add a note below.</div>
            )}
            {doc.annotations.map((a, i) => (
              <div key={i} style={{ background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{a.by}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.at}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.5 }}>{a.text}</div>
              </div>
            ))}
            <div style={{ marginTop: 4 }}>
              <textarea value={annotationText} onChange={e => setAnnotationText(e.target.value)}
                placeholder="Add a note about this document…"
                rows={3}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 7, fontFamily: 'inherit', fontSize: 12.5, resize: 'none', outline: 'none', background: 'var(--bg-muted)', color: 'var(--text-primary)', boxSizing: 'border-box', lineHeight: 1.5 }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--ai-primary)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button onClick={addAnnotation} disabled={!annotationText.trim()} className="btn btn-primary btn-sm" style={{ opacity: annotationText.trim() ? 1 : 0.4 }}>
                  <Icon name="plus" size={12}/> Add note
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {doc.requests.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Previous requests</div>
                {doc.requests.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-muted)', borderRadius: 7, marginBottom: 6, fontSize: 12 }}>
                    <Icon name="send" size={12} color="var(--text-tertiary)"/>
                    <span style={{ flex: 1, color: 'var(--text-secondary)' }}>Sent to <strong>{r.to}</strong> via {r.channel}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{r.at}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Send new request</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Send to</label>
                  <select value={requestTo} onChange={e => setRequestTo(e.target.value)}
                    style={{ width: '100%', padding: '6px 9px', border: '1px solid var(--border-subtle)', borderRadius: 7, background: 'var(--bg-muted)', fontFamily: 'inherit', fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
                    <option value="">Select recipient…</option>
                    <option value="Sarah Anderson">Sarah Anderson (Borrower)</option>
                    <option value="John Anderson">John Anderson (Co-Borrower)</option>
                    <option value="Maria Gonzalez">Maria Gonzalez (Buyer's Agent)</option>
                    <option value="Apex Title Co.">Apex Title Co. (Title)</option>
                    <option value="Priya Nair">Priya Nair (Processor)</option>
                    <option value="David Kim">David Kim (Underwriter)</option>
                  </select>
                </div>
                <div style={{ padding: '10px 12px', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 8, fontSize: 12, color: 'var(--ai-ink)', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', gap: 7 }}>
                    <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
                    <span>AI will draft a plain-language request message for <strong>{doc.name}</strong> with upload instructions.</span>
                  </div>
                </div>
                <button onClick={sendRequest} disabled={!requestTo} className="btn btn-primary"
                  style={{ opacity: requestTo ? 1 : 0.4, justifyContent: 'center' }}>
                  {requestSent ? <><Icon name="check" size={13}/>Request sent!</> : <><Icon name="send" size={13}/>Send request</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {doc.versions.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '8px 0' }}>No upload history yet.</div>
            ) : [...doc.versions].reverse().map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < doc.versions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--ai-primary)' : 'var(--border-strong)' }}/>
                  {i < doc.versions.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', margin: '3px 0' }}/>}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {i === 0 ? `v${doc.versions.length} (current)` : `v${doc.versions.length - i}`}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1 }}>{v.by} · {v.at}</div>
                  {v.note && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2, fontStyle: 'italic' }}>{v.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sort helpers ──────────────────────────────────────────────────────────────
const STATUS_ORDER = { missing: 0, requested: 1, received: 2, reviewed: 3, approved: 4 };

function sortDocs(docs, sortKey) {
  const arr = [...docs];
  if (sortKey === 'alpha-asc')  return arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sortKey === 'alpha-desc') return arr.sort((a, b) => b.name.localeCompare(a.name));
  if (sortKey === 'status')     return arr.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  if (sortKey === 'date')       return arr.sort((a, b) => {
    if (!a.uploadedAt && !b.uploadedAt) return 0;
    if (!a.uploadedAt) return 1;
    if (!b.uploadedAt) return -1;
    return b.uploadedAt.localeCompare(a.uploadedAt);
  });
  return arr;
}

// ─── View mode toggle ──────────────────────────────────────────────────────────
function ViewToggle({ value, onChange }) {
  const opts = [
    { id: 'alpha',   label: 'Alpha',   icon: 'a-z',    title: 'Flat A–Z list — quick scanning by file name' },
    { id: 'grouped', label: 'Grouped', icon: 'layers',  title: 'Grouped by type — workflow & routing view' },
    { id: 'phase',   label: 'By Stage',icon: 'milestone',title: 'Grouped by loan stage — Application → Closing' },
  ];
  return (
    <div style={{ display: 'flex', background: 'var(--bg-muted)', borderRadius: 7, padding: 2, gap: 1, flexShrink: 0 }}>
      {opts.map(o => (
        <button
          key={o.id}
          title={o.title}
          onClick={() => onChange(o.id)}
          style={{
            padding: '3px 9px', border: 'none', borderRadius: 5, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600,
            background: value === o.id ? 'var(--bg-surface)' : 'transparent',
            color: value === o.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            boxShadow: value === o.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.12s',
            whiteSpace: 'nowrap',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export function DocumentsTool({ loanId, onClose }) {
  const [docs, setDocs] = React.useState(INITIAL_DOCS);
  const [selectedId, setSelectedId] = React.useState(null);
  const [phase, setPhase] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState('grouped');   // 'alpha' | 'grouped' | 'phase'
  const [sortKey, setSortKey] = React.useState('alpha-asc');   // only active in alpha view

  const selectedDoc = docs.find(d => d.id === selectedId) || null;

  const updateDoc = (id, changes) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d));
  };

  // Filter
  const visible = docs.filter(d => {
    const phaseOk  = phase === 'All' || d.phase === phase;
    const typeOk   = typeFilter === 'all' || d.type === typeFilter;
    const searchOk = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return phaseOk && typeOk && searchOk;
  });

  // Stats (always over full doc set)
  const missing   = docs.filter(d => d.status === 'missing').length;
  const requested = docs.filter(d => d.status === 'requested').length;
  const approved  = docs.filter(d => d.status === 'approved').length;
  const total     = docs.length;

  // Build display list based on view mode
  const alphaList = sortDocs(visible, sortKey);

  const groupedByType = DOC_TYPES.map(t => ({
    key: t.id, label: t.label, color: t.color,
    docs: visible.filter(d => d.type === t.id),
  })).filter(g => g.docs.length > 0);

  const groupedByPhase = PHASES.filter(p => p !== 'All').map(p => ({
    key: p, label: p, color: '#6B7280',
    docs: sortDocs(visible.filter(d => d.phase === p), 'alpha-asc'),
  })).filter(g => g.docs.length > 0);

  const renderGrouped = (groups) => (
    <>
      {groups.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>No documents match your filters.</div>
      ) : groups.map(group => (
        <div key={group.key}>
          <div style={{
            padding: '7px 14px 5px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: group.color, background: group.color + '0A',
            borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0 }}/>
            {group.label}
            <span style={{ marginLeft: 'auto', fontWeight: 500, color: 'var(--text-tertiary)', fontSize: 10 }}>{group.docs.length}</span>
          </div>
          {group.docs.map(doc => (
            <DocRow key={doc.id} doc={doc} isSelected={selectedId === doc.id} onSelect={setSelectedId} onUpdate={updateDoc}/>
          ))}
        </div>
      ))}
    </>
  );

  const renderAlpha = () => (
    <>
      {alphaList.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>No documents match your filters.</div>
      ) : (
        <>
          {/* Alpha index spine — letter dividers */}
          {(() => {
            let lastLetter = null;
            return alphaList.map(doc => {
              const letter = doc.name[0]?.toUpperCase() || '#';
              const showDivider = sortKey === 'alpha-asc' && letter !== lastLetter;
              lastLetter = letter;
              return (
                <React.Fragment key={doc.id}>
                  {showDivider && (
                    <div style={{
                      padding: '4px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                      color: 'var(--text-tertiary)', background: 'var(--bg-muted)',
                      borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)',
                      textTransform: 'uppercase',
                    }}>{letter}</div>
                  )}
                  <DocRow doc={doc} isSelected={selectedId === doc.id} onSelect={setSelectedId} onUpdate={updateDoc}/>
                </React.Fragment>
              );
            });
          })()}
        </>
      )}
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>

      {/* Left: list */}
      <div style={{ width: selectedDoc ? 320 : '100%', display: 'flex', flexDirection: 'column', minHeight: 0, flexShrink: 0 }}>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          {[
            { label: 'Total', value: total, color: 'var(--text-primary)' },
            { label: 'Approved', value: approved, color: '#059669' },
            { label: 'Requested', value: requested, color: '#D97706' },
            { label: 'Missing', value: missing, color: '#B03025' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '10px 0', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* View toggle + sort row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <ViewToggle value={viewMode} onChange={v => { setViewMode(v); if (v !== 'alpha') setSortKey('alpha-asc'); }}/>
          <div style={{ flex: 1 }}/>
          {viewMode === 'alpha' && (
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              style={{ padding: '3px 8px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--bg-muted)', fontFamily: 'inherit', fontSize: 11.5, color: 'var(--text-secondary)', cursor: 'pointer', height: 26 }}
            >
              <option value="alpha-asc">A → Z</option>
              <option value="alpha-desc">Z → A</option>
              <option value="status">By status</option>
              <option value="date">By date</option>
            </select>
          )}
        </div>

        {/* Phase filter — hidden in phase-grouped view since grouping IS phase */}
        {viewMode !== 'phase' && (
          <div style={{ display: 'flex', gap: 4, padding: '7px 12px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto', flexShrink: 0 }}>
            {PHASES.map(p => (
              <button key={p} onClick={() => setPhase(p)} style={{
                padding: '3px 10px', border: '1px solid', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap',
                background: phase === p ? 'var(--text-primary)' : 'transparent',
                color: phase === p ? '#fff' : 'var(--text-secondary)',
                borderColor: phase === p ? 'var(--text-primary)' : 'var(--border-subtle)',
                transition: 'all 0.1s',
              }}>{p}</button>
            ))}
          </div>
        )}

        {/* Search + type filter */}
        <div style={{ display: 'flex', gap: 6, padding: '7px 12px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-muted)', borderRadius: 6, padding: '0 9px', height: 28 }}>
            <Icon name="search" size={11} color="var(--text-tertiary)"/>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search documents…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: 'inherit', color: 'var(--text-primary)' }}/>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <Icon name="x" size={10} color="var(--text-tertiary)"/>
              </button>
            )}
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: '0 8px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--bg-muted)', fontFamily: 'inherit', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', height: 28 }}>
            <option value="all">All types</option>
            {DOC_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* Doc list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {viewMode === 'alpha'   && renderAlpha()}
          {viewMode === 'grouped' && renderGrouped(groupedByType)}
          {viewMode === 'phase'   && renderGrouped(groupedByPhase)}
        </div>

        {/* Upload button */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Icon name="upload" size={13}/> Upload Document
          </button>
        </div>
      </div>

      {/* Right: detail panel */}
      {selectedDoc && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}>
          <DocDetail doc={selectedDoc} onUpdate={updateDoc} onClose={() => setSelectedId(null)}/>
        </div>
      )}
    </div>
  );
}
