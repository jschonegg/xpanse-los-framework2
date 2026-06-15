import React from 'react';
import { Icon } from '../components/Icon';

// ── Admin Forms Builder ─────────────────────────────────────────────────────
// Wraps the FormOS standalone prototype (public/formos.html) in our app
// chrome. The inner HTML is self-contained — iframe keeps it intact so we
// don't have to port 1100+ lines of vanilla JS into React.
//
// When the team wants to refactor, swap the <iframe> for a real React
// implementation behind the same route.

export function AdminFormsView({ onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#F0F0EE' }}>
      {/* Chrome strip — matches the section eyebrow pattern used elsewhere */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '14px 28px',
        display: 'flex', alignItems: 'center', gap: 16,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid #E5E7EB',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 12.5, fontWeight: 600, color: '#374151',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Icon name="arrowLeft" size={13} strokeWidth={2}/>
          Back to admin
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #7E68FA 0%, #5B21B6 100%)',
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(91,33,182,0.20)',
          }}>
            <Icon name="doc" size={15} strokeWidth={1.9}/>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5B21B6' }}>
              Admin · Forms
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Form builder
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#EDE9FE', color: '#5B21B6',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <Icon name="sparkle" size={11} strokeWidth={1.9}/>
          AI-powered
        </span>
      </div>

      {/* Iframe takes the rest of the screen */}
      <iframe
        src="/formos.html"
        title="Form builder"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#F0F0EE',
        }}
      />
    </div>
  );
}
