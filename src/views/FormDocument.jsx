import React from 'react';
import { Icon } from '../components/Icon';
import { AGENCIES, formAgencyKeys, isApplicable } from '../data/imsForms';
import { buildFormProfile } from '../data/imsFormSchemas';

// Schema-driven, read-only rendering of an IMS reference form, prefilled from
// the open loan. Mirrors the URLA1003View visual language (section heads +
// field grids) so every generated form looks at home in the app. Section
// kinds: 'fields' (default), 'kv', 'attestations', 'signatures', 'note'.

// Agency badge tones — kept in step with FormsLibrary's catalog badges.
const AGENCY_TONE = {
  fnma:  { bg: 'var(--status-blue-bg)',  fg: 'var(--status-blue)' },
  fhlmc: { bg: 'var(--status-blue-bg)',  fg: 'var(--status-blue)' },
  fha:   { bg: 'var(--status-amber-bg)', fg: 'var(--status-amber)' },
  va:    { bg: 'var(--status-green-bg)', fg: 'var(--status-green)' },
  usda:  { bg: 'var(--ai-bg)',           fg: 'var(--ai-ink)' },
};

function SectionHead({ label, sub }) {
  return (
    <div style={{
      background: 'var(--bg-muted)', color: 'var(--text-primary)',
      padding: '8px 14px', borderRadius: '8px 8px 0 0',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      {sub && <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7 }}>{sub}</span>}
    </div>
  );
}

// Read-only labeled value, styled like a filled (disabled) URLA field.
function ReadField({ label, value, mono, full }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: full ? '1 / -1' : undefined }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      <div style={{
        minHeight: 32, display: 'flex', alignItems: 'center',
        padding: '0 10px', background: 'var(--bg-muted)',
        border: '1px solid var(--border-subtle)', borderRadius: 7,
        fontSize: 13, color: 'var(--text-primary)',
        fontFamily: mono ? 'DM Sans' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  );
}

function FieldsSection({ section, p }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label={section.label} sub={section.sub}/>
      <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', background: 'var(--bg-surface)' }}>
        {section.fields.map((f, i) => (
          <ReadField key={i} label={f.label} mono={f.mono} full={f.full}
            value={typeof f.value === 'function' ? f.value(p) : f.value}/>
        ))}
      </div>
    </div>
  );
}

function KeyValueSection({ section, p }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label={section.label} sub={section.sub}/>
      <div style={{ background: 'var(--bg-surface)' }}>
        {section.rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            padding: '11px 14px', borderBottom: i < section.rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>
              {typeof r.value === 'function' ? r.value(p) : r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttestationsSection({ section }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label={section.label}/>
      <div style={{ padding: '14px 14px', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {section.items.map((text, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="checkCircle" size={15} color="var(--text-tertiary)" strokeWidth={1.8} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignaturesSection({ section, p }) {
  const signers = typeof section.signers === 'function' ? section.signers(p) : section.signers;
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label={section.label}/>
      <div style={{ padding: '24px 14px', background: 'var(--bg-surface)', display: 'grid', gridTemplateColumns: signers.length > 1 ? '1fr 1fr' : '1fr', gap: '20px 24px' }}>
        {signers.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ height: 44, borderBottom: '1.5px dashed var(--border-default)', display: 'flex', alignItems: 'flex-end', paddingBottom: 4, fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Awaiting signature</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteSection({ section }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <SectionHead label={section.label}/>
      <div style={{ padding: '24px 14px', background: 'var(--bg-surface)', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
        {section.note}
      </div>
    </div>
  );
}

function renderSection(section, i, p) {
  switch (section.kind) {
    case 'kv':           return <KeyValueSection key={i} section={section} p={p}/>;
    case 'attestations': return <AttestationsSection key={i} section={section}/>;
    case 'signatures':   return <SignaturesSection key={i} section={section} p={p}/>;
    case 'note':         return <NoteSection key={i} section={section}/>;
    default:             return <FieldsSection key={i} section={section} p={p}/>;
  }
}

function AgencyBadges({ form }) {
  const keys = formAgencyKeys(form);
  if (keys.length === AGENCIES.length) {
    return <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>All agencies</span>;
  }
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4 }}>
      {keys.map(k => {
        const a = AGENCIES.find(x => x.key === k);
        const t = AGENCY_TONE[k];
        return (
          <span key={k} style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
            background: t.bg, color: t.fg, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>{a.label}</span>
        );
      })}
    </span>
  );
}

export function FormDocument({ form, schema, loan }) {
  const p = React.useMemo(() => buildFormProfile(loan), [loan]);
  const applicable = isApplicable(form, loan);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header band — title, model form, agency badges, applicability */}
      <div style={{
        border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'var(--bg-surface)',
        padding: '16px 18px', marginBottom: 24,
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'var(--ai-bg)', color: 'var(--ai-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="doc" size={19} strokeWidth={1.7}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{schema.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 3 }}>{schema.subtitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <AgencyBadges form={form}/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: applicable ? 'var(--status-green)' : 'var(--text-tertiary)' }}>
              <Icon name={applicable ? 'checkCircle' : 'x'} size={13}/>
              {applicable ? 'Applies to this loan' : 'Not applicable to this loan'}
            </span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Icon name="download" size={13}/> Export PDF
        </button>
      </div>

      {/* Prefill notice */}
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 9, padding: '10px 13px', marginBottom: 24 }}>
        <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
        <span style={{ fontSize: 12.5, color: 'var(--ai-ink)', lineHeight: 1.45 }}>
          Prefilled from this loan’s data where fields map. Remaining fields use placeholder values for fields the file doesn’t yet track.
        </span>
      </div>

      {/* Sections */}
      <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {schema.sections.map((s, i) => renderSection(s, i, p))}
      </div>
    </div>
  );
}

export default FormDocument;
