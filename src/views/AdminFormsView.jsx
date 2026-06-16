import React from 'react';

export function AdminFormsView({ onBack }) {
  return (
    <iframe
      src="/formos.html"
      title="Form builder"
      style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#FAFAF9' }}
    />
  );
}
