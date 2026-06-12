import React from 'react';
import { Icon } from '../components/Icon';

// Placeholder home for personas without a built-out view yet.
// Renders inside the same outer chrome as HomeView (left nav, status bar)
// so the navigation + persona routing can be exercised end to end.
export function PersonaStubHome({ persona }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F4F5F7' }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
      }}>
        <div style={{
          maxWidth: 520, textAlign: 'center', background: '#fff',
          border: '1px solid #E5E7EB', borderRadius: 16, padding: '40px 36px',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: (persona?.badgeColor || '#7E68FA') + '18',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: persona?.badgeColor || '#7E68FA', marginBottom: 18,
          }}>
            <Icon name="sparkle" size={26} strokeWidth={1.5}/>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 6 }}>
            {persona?.role || 'Demo'} workspace
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px', color: '#111827' }}>
            Welcome, {persona?.name?.split(' ')[0] || 'there'}.
          </h1>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.55, margin: '0 0 18px' }}>
            This is a placeholder home for the <strong style={{ color: '#111827' }}>{persona?.role}</strong> persona. The login flow and routing
            are wired up — the real {persona?.role?.toLowerCase()} dashboard hasn't been built yet.
          </p>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>
            Use the left nav to explore pipeline, files, and other shared views.
          </p>
        </div>
      </div>
    </div>
  );
}
