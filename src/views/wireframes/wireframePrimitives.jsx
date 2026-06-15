import React from 'react';
import { Icon } from '../../components/Icon';

// Light wireframe primitives — labeled placeholder blocks for layout-first
// design. Swap for real components once the structure is locked in.

export function WireCard({ title, hint, accent = '#7E68FA', icon = 'sparkle', height, children, footer }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', borderBottom: '1px solid #F3F4F6',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: accent + '18', color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={icon} size={12} color={accent}/>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', flex: 1 }}>{title}</span>
        {hint && <span style={{ fontSize: 11, color: '#9CA3AF' }}>{hint}</span>}
      </div>
      <div style={{ padding: '14px 18px', flex: 1, minHeight: height || 'auto' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '10px 18px', borderTop: '1px solid #F3F4F6', background: '#FAFAFB',
          fontSize: 11.5, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8,
        }}>{footer}</div>
      )}
    </div>
  );
}

// A labeled dashed placeholder — "this is where X goes."
export function WirePlaceholder({ label, sub, height = 90, accent = '#9CA3AF' }) {
  return (
    <div style={{
      border: `1.5px dashed ${accent}80`,
      borderRadius: 10, padding: '12px 14px',
      background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(156,163,175,0.04) 6px, rgba(156,163,175,0.04) 12px)',
      minHeight: height, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      color: '#6B7280',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#374151' }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 4, lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}

// A row of labeled fake list items (file rows / queue rows / etc.).
export function WireListRows({ rows, accent = '#7E68FA' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: accent }}>
            {r.tag || (i + 1)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827' }}>{r.title}</div>
            {r.sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{r.sub}</div>}
          </div>
          {r.action && (
            <button style={{
              background: accent, color: '#fff', border: 'none', borderRadius: 6,
              padding: '5px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}>{r.action}</button>
          )}
          {r.actions && (
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {r.actions.map((a, idx) => (
                <button key={idx} style={{
                  background: a.primary ? accent : '#fff',
                  color: a.primary ? '#fff' : '#374151',
                  border: a.primary ? 'none' : '1px solid #E5E7EB',
                  borderRadius: 6, padding: '5px 10px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// A KPI strip — small uniform stat tiles in a row.
export function WireKpiStrip({ stats, accent = '#7E68FA' }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 14,
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 18px',
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          borderRight: i < stats.length - 1 ? '1px solid #F3F4F6' : 'none',
          paddingRight: i < stats.length - 1 ? 12 : 0,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'DM Mono' }}>{s.value}</div>
          {s.sub && <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 3 }}>{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}
