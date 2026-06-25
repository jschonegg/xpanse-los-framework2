// Recently opened loans — a small shared store backed by localStorage.
//
// Records the loans a user has opened, most-recent-first, deduped, capped at 15.
// Each entry remembers the last loan tab the user was on ({ id, tab }) so the
// Recents menu can both label the row and reopen the loan where they left off.
// Written from App.openLoan()/changeLoanTab() so every entry point (pipeline,
// home, command palette, AI panel) feeds the same history. Read by the ⌘K
// command palette and the left-nav "Recents" menu.
const RECENTS_KEY = 'los-recent-loans';
const MAX_RECENTS = 15;

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENTS_KEY));
    if (!Array.isArray(v)) return [];
    // Tolerate the legacy format (a plain array of id strings).
    return v.map(e => (typeof e === 'string' ? { id: e, tab: null } : e)).filter(e => e && e.id);
  } catch {
    return [];
  }
}

function write(entries) {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(entries.slice(0, MAX_RECENTS)));
  } catch {
    /* localStorage unavailable (private mode / quota) — recents are best-effort */
  }
}

// Full entries, most-recent-first: [{ id, tab }].
export function getRecentLoans() {
  return read();
}

// Convenience for callers that only care about ids (e.g. the command palette).
export function getRecentLoanIds() {
  return read().map(e => e.id);
}

// Move a loan to the front. An explicit `tab` is remembered for it; when omitted
// the loan keeps whatever tab it last had.
export function pushRecentLoan(loanId, tab) {
  if (!loanId) return;
  const entries = read();
  const existing = entries.find(e => e.id === loanId);
  const resolvedTab = tab || (existing && existing.tab) || null;
  write([{ id: loanId, tab: resolvedTab }, ...entries.filter(e => e.id !== loanId)]);
}

// Update the remembered tab for a loan already in recents, without reordering.
// Used as the user moves between tabs inside a loan so "where I left off" stays
// current right up until they navigate away.
export function setRecentLoanTab(loanId, tab) {
  if (!loanId) return;
  const entries = read();
  const idx = entries.findIndex(e => e.id === loanId);
  if (idx === -1) return;
  entries[idx] = { ...entries[idx], tab };
  write(entries);
}
