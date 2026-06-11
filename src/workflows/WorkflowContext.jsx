import React from 'react';
import { buildDefaultWorkflows, makeWorkflow, makeCustomPage, loanToWorkflowContext, DEFAULT_PREVIEW_CONTEXT, newId } from './workflowModel';
import { getMatchingWorkflow } from './workflowResolver';

// ─── Persistence ────────────────────────────────────────────────────────────
// localStorage-backed for the POC. Isolated here so a real API client could be
// dropped in without touching the provider or any UI.
const WORKFLOWS_KEY = 'los-workflows';
const PREVIEW_CTX_KEY = 'los-preview-context';
const CUSTOM_PAGES_KEY = 'los-custom-pages';

function loadCustomPages() {
  try {
    const raw = localStorage.getItem(CUSTOM_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

export function loadWorkflowsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(WORKFLOWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (_) { /* fall through to seed */ }
  return buildDefaultWorkflows();
}

export function saveWorkflowsToLocalStorage(workflows) {
  try { localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows)); } catch (_) {}
}

function loadPreviewContext() {
  try {
    const raw = localStorage.getItem(PREVIEW_CTX_KEY);
    if (raw) return { ...DEFAULT_PREVIEW_CONTEXT, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...DEFAULT_PREVIEW_CONTEXT };
}

// ─── Context ────────────────────────────────────────────────────────────────
const WorkflowContext = React.createContext(null);

export function WorkflowProvider({ children }) {
  const [workflows, setWorkflows] = React.useState(loadWorkflowsFromLocalStorage);
  const [previewContext, setPreviewContextState] = React.useState(loadPreviewContext);
  // Admin-created custom pages, available in the page palette alongside the
  // built-in custom pages. Each maps to its own (placeholder) content tab.
  const [customPages, setCustomPages] = React.useState(loadCustomPages);

  // Persist whenever either store changes.
  React.useEffect(() => { saveWorkflowsToLocalStorage(workflows); }, [workflows]);
  React.useEffect(() => {
    try { localStorage.setItem(PREVIEW_CTX_KEY, JSON.stringify(previewContext)); } catch (_) {}
  }, [previewContext]);
  React.useEffect(() => {
    try { localStorage.setItem(CUSTOM_PAGES_KEY, JSON.stringify(customPages)); } catch (_) {}
  }, [customPages]);

  // Create a new custom page and return it so the caller can place it.
  const addCustomPage = React.useCallback((label) => {
    const page = makeCustomPage(label);
    setCustomPages(prev => [...prev, page]);
    return page;
  }, []);

  const stamp = (wf) => ({ ...wf, updatedAt: new Date().toISOString(), updatedBy: 'Admin' });

  // Insert or replace a workflow by id.
  const upsertWorkflow = React.useCallback((wf) => {
    setWorkflows(prev => {
      const exists = prev.some(w => w.id === wf.id);
      const next = exists ? prev.map(w => (w.id === wf.id ? wf : w)) : [...prev, wf];
      return next;
    });
  }, []);

  // Save current edits (keeps whatever status the workflow already has).
  const saveWorkflow = React.useCallback((wf) => {
    const saved = stamp(wf);
    upsertWorkflow(saved);
    return saved;
  }, [upsertWorkflow]);

  const publishWorkflow = React.useCallback((wf) => {
    const saved = stamp({ ...wf, status: 'active' });
    upsertWorkflow(saved);
    return saved;
  }, [upsertWorkflow]);

  const saveWorkflowAsDraft = React.useCallback((wf) => {
    const saved = stamp({ ...wf, status: 'draft' });
    upsertWorkflow(saved);
    return saved;
  }, [upsertWorkflow]);

  const duplicateWorkflow = React.useCallback((wf) => {
    const copy = makeWorkflow({
      ...wf,
      id: newId('wf'),
      name: `${wf.name} Copy`,
      status: 'draft',
      // deep-ish clone of nested structures so edits don't alias the original
      rules: JSON.parse(JSON.stringify(wf.rules || { logic: 'AND', conditions: [], groups: [] })),
      sections: JSON.parse(JSON.stringify(wf.sections || [])),
    });
    upsertWorkflow(copy);
    return copy;
  }, [upsertWorkflow]);

  const deleteWorkflow = React.useCallback((id) => {
    if (id === 'default') return; // never delete the fallback
    setWorkflows(prev => prev.filter(w => w.id !== id));
  }, []);

  const createWorkflow = React.useCallback(() => {
    const wf = makeWorkflow({
      name: 'New Workflow',
      priority: 50,
      sections: [],
    });
    upsertWorkflow(wf);
    return wf;
  }, [upsertWorkflow]);

  const setPreviewContext = React.useCallback((patch) => {
    setPreviewContextState(prev => ({ ...prev, ...patch }));
  }, []);

  const resetWorkflows = React.useCallback(() => {
    setWorkflows(buildDefaultWorkflows());
  }, []);

  // The workflow that currently drives the loan nav for the mock context.
  const resolvedWorkflow = React.useMemo(() => {
    const { role, ...loanContext } = previewContext;
    return getMatchingWorkflow(workflows, { role }, loanContext);
  }, [workflows, previewContext]);

  // Resolve the workflow for an actual loan from its purpose + status. Role is
  // ignored for now (role-based targeting is config-example only), so the loan
  // view reflects the loan's real purpose/status.
  const resolveWorkflowForLoan = React.useCallback((loan) => {
    return getMatchingWorkflow(workflows, {}, loanToWorkflowContext(loan), ['role']);
  }, [workflows]);

  const value = {
    workflows,
    saveWorkflow,
    publishWorkflow,
    saveWorkflowAsDraft,
    duplicateWorkflow,
    deleteWorkflow,
    createWorkflow,
    resetWorkflows,
    previewContext,
    setPreviewContext,
    resolvedWorkflow,
    resolveWorkflowForLoan,
    customPages,
    addCustomPage,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflows() {
  const ctx = React.useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflows must be used within a WorkflowProvider');
  return ctx;
}
