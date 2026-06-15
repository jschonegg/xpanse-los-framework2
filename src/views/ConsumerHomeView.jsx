import React from 'react';

// ── Consumer Home ───────────────────────────────────────────────────────────
// Wraps the HomeKey borrower 1003 prototype (public/homekey.html). Same
// pattern as AdminFormsView — iframe keeps the standalone HTML intact.
// Consumer persona lands directly into the form; no extra chrome so the
// borrower sees a focused experience.

export function ConsumerHomeView() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', background: '#F5F1E8' }}>
      <iframe
        src="/homekey.html"
        title="HomeKey loan application"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#F5F1E8',
        }}
      />
    </div>
  );
}
