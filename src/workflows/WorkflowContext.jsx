import React from 'react';
import { buildDefaultWorkflows, makeWorkflow, DEFAULT_PREVIEW_CONTEXT, newId } from './workflowModel';
import { getMatchingWorkflow } from './workflowResolver';

// ─── Persistence ────────────────────────────────────────────────────────────
// localStorage-backed for the POC. Isolated here so a real API client could be
// dropped in without touching the provider or any UI.
const WORKFLOWS_KEY = 'los-workflows';
const PREVIEW_CTX_KEY = 'los-preview-context';

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

  // Persist whenever either store changes.
  React.useEffect(() => { saveWorkflowsToLocalStorage(workflows); }, [workflows]);
  React.useEffect(() => {
    try { localStorage.setItem(PREVIEW_CTX_KEY, JSON.stringify(previewContext)); } catch (_) {}
  }, [previewContext]);

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
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflows() {
  const ctx = React.useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflows must be used within a WorkflowProvider');
  return ctx;
}
