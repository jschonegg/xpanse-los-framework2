import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icon';

const W2_FIELDS = [
  { box: 'a', label: 'Employee SSN', value: '***-**-6714' },
  { box: 'b', label: "Employer EIN", value: '47-3829104' },
  { box: 'c', label: 'Employer name, address', value: 'Acme Corporation\n3420 Commerce Blvd\nDenver, CO 80202' },
  { box: 'e', label: 'Employee name', value: 'Marcus Johnson' },
  { box: 'f', label: 'Employee address', value: '74 Pine Ridge\nBoise, ID 83701' },
  { box: '1', label: 'Wages, tips, other comp', value: '$124,500.00', highlight: true, aiKey: 'wages' },
  { box: '2', label: 'Federal income tax withheld', value: '$22,410.00', highlight: true, aiKey: 'fedTax' },
  { box: '3', label: 'Social security wages', value: '$124,500.00' },
  { box: '4', label: 'Social security tax withheld', value: '$7,719.00' },
  { box: '5', label: 'Medicare wages and tips', value: '$124,500.00' },
  { box: '6', label: 'Medicare tax withheld', value: '$1,805.25' },
  { box: '12a', label: 'Code / Amount', value: 'D  $8,500.00' },
  { box: '13', label: 'Statutory / Retirement / Third-party sick', value: '☐ / ☑ / ☐' },
  { box: '15', label: 'State / Employer state ID', value: 'CO  38-4920183' },
  { box: '16', label: 'State wages, tips, etc.', value: '$124,500.00' },
  { box: '17', label: 'State income tax', value: '$5,227.50' },
];

const AI_EXTRACTIONS = [
  { key: 'employer', label: 'Employer', value: 'Acme Corporation', status: 'verified', detail: 'IRS EIN match confirmed' },
  { key: 'wages', label: 'Box 1 Wages', value: '$124,500', status: 'extracted', detail: 'Used for qualifying income' },
  { key: 'fedTax', label: 'Federal Withheld', value: '$22,410', status: 'extracted', detail: '18% effective rate — normal range' },
  { key: 'retirement', label: 'Retirement (Box 12D)', value: '$8,500', status: 'flagged', detail: 'Pre-tax 401k — excluded from qualifying income per AUS guidelines' },
  { key: 'qualifying', label: 'Qualifying Income', value: '$116,000/yr', status: 'calculated', detail: '$124,500 − $8,500 deferred comp = $116,000 · $9,667/mo' },
  { key: 'dti', label: 'Updated DTI', value: '31%', status: 'good', detail: 'Below 43% Conv threshold — AUS eligible' },
];

const statusConfig = {
  verified:   { color: '#1F7A45', bg: 'rgba(223,241,229,0.8)', icon: 'check',    label: 'Verified' },
  extracted:  { color: '#3A6BAD', bg: 'rgba(220,232,248,0.8)', icon: 'sparkle',  label: 'Extracted' },
  flagged:    { color: '#9C6A1A', bg: '#F6E6BD',               icon: 'alert',    label: 'Flag' },
  calculated: { color: '#5246C7', bg: 'var(--ai-bg-strong)',   icon: 'sparkle',  label: 'Calculated' },
  good:       { color: '#1F7A45', bg: 'rgba(223,241,229,0.8)', icon: 'check',    label: 'Good' },
};

function W2Document({ activeBox, onBoxClick }) {
  const fieldStyle = (box, highlight) => ({
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: '6px 8px',
    background: activeBox === box ? '#EEF2FF' : highlight ? '#FFFDF0' : '#fff',
    cursor: 'pointer',
    transition: 'background 0.15s, box-shadow 0.15s',
    boxShadow: activeBox === box ? '0 0 0 2px #5246C7' : 'none',
  });

  const boxLabel = (num) => (
    <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600, letterSpacing: '0.02em' }}>
      Box {num}
    </div>
  );

  return (
    <div style={{
      fontFamily: 'DM Sans',
      background: '#fff',
      border: '2px solid #333',
      borderRadius: 4,
      padding: 16,
      fontSize: 11,
      color: '#111',
      userSelect: 'none',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '2px solid #333', paddingBottom: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: '#555' }}>Department of the Treasury — Internal Revenue Service</div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>W-2 Wage and Tax Statement</div>
          <div style={{ fontSize: 9, color: '#555' }}>Tax Year 2025</div>
        </div>
        <div style={{ fontSize: 9, textAlign: 'right', color: '#555' }}>
          <div>OMB No. 1545-0008</div>
          <div>Copy B — To Be Filed With Employee's FEDERAL Tax Return</div>
        </div>
      </div>

      {/* Row 1: SSN + EIN */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600 }}>Box a — Employee's social security number</div>
          <div style={fieldStyle('a')} onClick={() => onBoxClick('a')}>***-**-6714</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600 }}>Box b — Employer identification number (EIN)</div>
          <div style={fieldStyle('b')} onClick={() => onBoxClick('b')}>47-3829104</div>
        </div>
      </div>

      {/* Row 2: Employer */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600 }}>Box c — Employer's name, address, and ZIP code</div>
        <div style={{ ...fieldStyle('c'), whiteSpace: 'pre-line', lineHeight: 1.6 }} onClick={() => onBoxClick('c')}>
          {'Acme Corporation\n3420 Commerce Blvd\nDenver, CO 80202'}
        </div>
      </div>

      {/* Row 3: Employee name + address */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1.5 }}>
          <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600 }}>Box e — Employee's first name and initial / Last name</div>
          <div style={fieldStyle('e')} onClick={() => onBoxClick('e')}>Marcus Johnson</div>
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ fontSize: 9, color: '#555', marginBottom: 3, fontWeight: 600 }}>Box f — Employee's address and ZIP code</div>
          <div style={{ ...fieldStyle('f'), whiteSpace: 'pre-line', lineHeight: 1.6 }} onClick={() => onBoxClick('f')}>
            {'74 Pine Ridge\nBoise, ID 83701'}
          </div>
        </div>
      </div>

      {/* Boxes 1–6 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        {[
          { box: '1', label: 'Wages, tips, other compensation', val: '$124,500.00', h: true },
          { box: '2', label: 'Federal income tax withheld', val: '$22,410.00', h: true },
          { box: '3', label: 'Social security wages', val: '$124,500.00' },
          { box: '4', label: 'Social security tax withheld', val: '$7,719.00' },
          { box: '5', label: 'Medicare wages and tips', val: '$124,500.00' },
          { box: '6', label: 'Medicare tax withheld', val: '$1,805.25' },
        ].map(({ box, label, val, h }) => (
          <div key={box}>
            {boxLabel(box)}
            <div style={fieldStyle(box, h)} onClick={() => onBoxClick(box)}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Box 12 + 13 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 2 }}>
          {boxLabel('12a')}
          <div style={fieldStyle('12a')} onClick={() => onBoxClick('12a')}>
            <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>Code / Amount</div>
            <div style={{ fontWeight: 700 }}>D &nbsp; $8,500.00</div>
            <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>401(k) elective deferrals</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {boxLabel('13')}
          <div style={{ ...fieldStyle('13'), lineHeight: 1.8 }} onClick={() => onBoxClick('13')}>
            <div style={{ fontSize: 9 }}>☐ Statutory employee</div>
            <div style={{ fontSize: 9 }}>☑ Retirement plan</div>
            <div style={{ fontSize: 9 }}>☐ Third-party sick pay</div>
          </div>
        </div>
      </div>

      {/* State section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid #ccc', paddingTop: 8 }}>
        {[
          { box: '15', label: 'State / Employer state ID', val: 'CO  38-4920183' },
          { box: '16', label: 'State wages, tips, etc.', val: '$124,500.00' },
          { box: '17', label: 'State income tax', val: '$5,227.50' },
        ].map(({ box, label, val }) => (
          <div key={box}>
            {boxLabel(box)}
            <div style={fieldStyle(box)} onClick={() => onBoxClick(box)}>
              <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIPanel({ activeBox }) {
  const [phase, setPhase] = React.useState('scanning'); // scanning | done

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('done'), 1800);
    return () => clearTimeout(t);
  }, []);

  const boxToKey = {
    '1': 'wages', '2': 'fedTax', 'b': 'employer', 'c': 'employer', 'e': 'employer',
    '12a': 'retirement',
  };
  const highlighted = activeBox ? boxToKey[activeBox] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5}/>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ai-ink)' }}>AI Extraction</span>
        {phase === 'scanning' ? (
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ai-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ai-primary)', animation: 'pulse 1s infinite' }}/>
            Scanning...
          </span>
        ) : (
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#1F7A45', fontWeight: 500 }}>✓ Complete</span>
        )}
      </div>

      {/* Extractions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {phase === 'scanning' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
            {[140, 100, 120, 90, 130, 80].map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-muted)' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, borderRadius: 4, background: 'var(--bg-muted)', width: `${w}px`, marginBottom: 6 }}/>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-muted)', width: `${w - 30}px` }}/>
                </div>
              </div>
            ))}
          </div>
        ) : (
          AI_EXTRACTIONS.map(item => {
            const cfg = statusConfig[item.status];
            const isActive = highlighted === item.key;
            return (
              <div key={item.key} style={{
                borderRadius: 9,
                border: `1px solid ${isActive ? '#5246C7' : 'var(--border-subtle)'}`,
                background: isActive ? '#EEF2FF' : 'var(--bg-surface)',
                padding: '10px 12px',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 0 0 2px rgba(82,70,199,0.15)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                    background: cfg.bg, color: cfg.color,
                  }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{item.detail}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer actions */}
      {phase === 'done' && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9,
            padding: '10px 12px', fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.5,
          }}>
            <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5}/>{' '}
            Qualifying income updated to <strong>$9,667/mo</strong>. DTI improves to <strong>31%</strong> — ready to pre-fill AUS.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ai btn-sm" style={{ flex: 1 }}>
              <Icon name="check" size={13}/> Apply to Loan File
            </button>
            <button className="btn btn-outline btn-sm">Flag for Review</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function W2Viewer({ onClose }) {
  const [activeBox, setActiveBox] = React.useState(null);
  const [pos, setPos] = React.useState({ x: 40, y: 30 });
  const [size] = React.useState({ w: Math.min(1060, window.innerWidth - 80), h: Math.min(680, window.innerHeight - 80) });
  const dragRef = React.useRef(null);

  const handleDragStart = (e) => {
    dragRef.current = { startX: e.clientX - pos.x, startY: e.clientY - pos.y };
    const move = (ev) => setPos({ x: ev.clientX - dragRef.current.startX, y: ev.clientY - dragRef.current.startY });
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
      {/* Dim overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', pointerEvents: 'all' }} onClick={onClose}/>

      {/* Window */}
      <div style={{
        position: 'absolute', left: pos.x, top: pos.y,
        width: size.w, height: size.h,
        background: 'var(--bg-surface)',
        borderRadius: 12,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'all',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Title bar */}
        <div
          onMouseDown={handleDragStart}
          style={{
            height: 44, display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 16px',
            background: 'var(--bg-muted)',
            borderBottom: '1px solid var(--border-subtle)',
            cursor: 'grab', userSelect: 'none', flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: 999, background: '#FF5F57', border: 'none', cursor: 'pointer', padding: 0 }}/>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: '#FFBD2E' }}/>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: '#28C840' }}/>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            W-2 · Marcus Johnson · Tax Year 2025
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'DM Sans' }}>LN-2024-0267</span>
            <button onClick={onClose} className="btn btn-icon btn-ghost" style={{ width: 26, height: 26 }}>
              <Icon name="x" size={14}/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Document panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#F0F0F0' }}>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11.5, color: '#666' }}>Click any field to inspect · AI highlights extracted values</span>
            </div>
            <W2Document activeBox={activeBox} onBoxClick={setActiveBox}/>
          </div>

          {/* AI panel */}
          <div style={{ width: 300, borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', flexShrink: 0 }}>
            <AIPanel activeBox={activeBox}/>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
