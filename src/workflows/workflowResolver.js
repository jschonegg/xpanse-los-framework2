// ─── Workflow resolver ──────────────────────────────────────────────────────
// Pure functions that decide which workflow applies to a given user + loan
// context. No React, no storage — easy to unit test and to move server-side.
import { ALL_VALUE } from './workflowModel';

function isEmpty(v) {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  return String(v).trim() === '';
}

// Evaluate a single condition against the merged context object.
export function evaluateCondition(condition, context) {
  if (!condition || !condition.field) return true;
  const actual = context[condition.field];
  const { operator, value } = condition;
  // Wildcard ("All …") context value: the attribute is unspecified for this
  // preview, so a workflow's requirement on this field is NOT satisfied — the
  // targeted workflow won't claim the loan (it falls back toward Default).
  // Only an explicit emptiness check is considered met.
  if (actual === ALL_VALUE) return operator === 'is_empty';
  switch (operator) {
    case 'is':
      return actual === value;
    case 'is_not':
      return actual !== value;
    case 'one_of':
      return Array.isArray(value) && value.includes(actual);
    case 'includes':
      return Array.isArray(actual)
        ? actual.includes(value)
        : String(actual ?? '').toLowerCase().includes(String(value ?? '').toLowerCase());
    case 'not_includes':
      return Array.isArray(actual)
        ? !actual.includes(value)
        : !String(actual ?? '').toLowerCase().includes(String(value ?? '').toLowerCase());
    case 'is_empty':
      return isEmpty(actual);
    case 'is_not_empty':
      return !isEmpty(actual);
    default:
      return true;
  }
}

// A condition group is its own list of conditions combined by its own logic.
// `ignoreFields` drops conditions on those fields (e.g. role) before evaluating.
export function evaluateGroup(group, context, ignoreFields = []) {
  const conditions = (group?.conditions || []).filter(c => !ignoreFields.includes(c.field));
  if (!conditions.length) return true;
  const results = conditions.map(c => evaluateCondition(c, context));
  return group.logic === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

// Evaluate a workflow's full rule set: top-level conditions plus any groups,
// combined by the top-level logic. No rules → always matches. `ignoreFields`
// lets a caller skip matching on certain fields (e.g. role in the loan view,
// where workflows are resolved purely from loan purpose + status).
export function evaluateRules(rules, context, ignoreFields = []) {
  if (!rules) return true;
  const condResults = (rules.conditions || [])
    .filter(c => !ignoreFields.includes(c.field))
    .map(c => evaluateCondition(c, context));
  const groupResults = (rules.groups || []).map(g => evaluateGroup(g, context, ignoreFields));
  const all = [...condResults, ...groupResults];
  if (!all.length) return true;
  return rules.logic === 'OR' ? all.some(Boolean) : all.every(Boolean);
}

// Find the workflow that should drive the loan nav for this context.
//   1. Active workflows only (drafts never apply).
//   2. Non-default matches sorted by priority (lower number wins).
//   3. Fall back to the Default Workflow if nothing else matches.
export function getMatchingWorkflow(workflows, userContext = {}, loanContext = {}, ignoreFields = []) {
  const context = { ...userContext, ...loanContext };
  const active = (workflows || []).filter(w => w.status === 'active');
  const defaultWorkflow = active.find(w => w.id === 'default')
    || (workflows || []).find(w => w.id === 'default')
    || null;

  const matches = active
    .filter(w => w.id !== 'default' && evaluateRules(w.rules, context, ignoreFields))
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  return matches[0] || defaultWorkflow;
}
