// ─── Workflow navigation data model ─────────────────────────────────────────
// Shapes and seed data for the Admin Workflow Navigation console. Everything
// here is plain data so it could later be served by / persisted through an API
// without touching the UI or resolver layers.
//
// Key concept: a "page" in a workflow carries its own stable id. That id maps
// (via PAGE_CONTENT_TAB) onto the content-tab id the Loan Level View already
// switches on — so a configured workflow drives the real loan nav with no
// changes to the loan content router.

// Fixed system links — always rendered at the top of the loan nav, never
// configurable. `tab` is the Loan Level View content id each one activates.
export const FIXED_SYSTEM_LINKS = [
  { id: 'tasks',      label: 'Tasks',      icon: 'target', tab: 'now' },
  { id: 'loan-story', label: 'Loan Story', icon: 'book',   tab: 'story' },
];

// Every page an admin can place into a workflow section. `tab` is the existing
// Loan Level View content id; several 1003 subsections intentionally share the
// 'urla1003' content tab (the 1003 view contains those sections).
export const AVAILABLE_PAGES = [
  { id: 'borrower-summary',  label: 'Borrower Summary',   icon: 'doc',        tab: 'borrowerSummary' },
  { id: 'borrower-info',     label: 'Borrower Info',      icon: 'doc',        tab: 'borrowerSummary' },
  { id: '1003',              label: '1003',               icon: 'doc',        tab: 'urla1003' },
  { id: 'assets-liabilities',label: 'Assets & Liabilities', icon: 'database', tab: 'urla1003' },
  { id: 'real-estate-owned', label: 'Real Estate Owned',  icon: 'home',       tab: 'urla1003' },
  { id: 'loan-property',     label: 'Loan & Property',    icon: 'home',       tab: 'urla1003' },
  { id: 'declarations',      label: 'Declarations',       icon: 'checkCircle',tab: 'urla1003' },
  { id: 'file-review',       label: 'File Review',        icon: 'listCheck',  tab: 'filereview' },
  { id: 'conditions',        label: 'Conditions',         icon: 'listCheck',  tab: 'conditions', badge: 4 },
  { id: 'aus',               label: 'AUS',                icon: 'zap',        tab: 'aus' },
  { id: 'credit-liabilities',label: 'Credit & Liabilities', icon: 'database', tab: 'credit' },
  { id: 'pricing-lock',      label: 'Pricing & Lock',     icon: 'dollar',     tab: 'pricing' },
  { id: 'documents',         label: 'Documents',          icon: 'doc',        tab: 'documents' },
  { id: 'closing',           label: 'Closing',            icon: 'calculator', tab: 'closing' },
  { id: 'audit',             label: 'Audit',              icon: 'fileSearch', tab: 'audit' },
  { id: 'services',          label: 'Services',           icon: 'settings',   tab: 'services' },
];

const PAGE_BY_ID = AVAILABLE_PAGES.reduce((m, p) => { m[p.id] = p; return m; }, {});

export function getPage(id) { return PAGE_BY_ID[id] || null; }

// page id → Loan Level View content tab id (used by the loan nav renderer).
export const PAGE_CONTENT_TAB = AVAILABLE_PAGES.reduce((m, p) => { m[p.id] = p.tab; return m; }, {});

// Suggested section names admins commonly use (free-form titles still allowed).
export const SECTION_NAME_SUGGESTIONS = [
  'Forms', 'Workspaces', 'Review', 'Closing', 'Intake', 'Processing', 'Decisioning', 'Audit',
];

// ─── Rule builder field + operator definitions ──────────────────────────────
export const RULE_FIELD_DEFS = [
  { id: 'role',        label: 'Role',         values: ['Sales', 'Processor', 'Underwriter', 'Closer', 'Admin'] },
  { id: 'loanStatus',  label: 'Loan Status',  values: ['New', 'Processing', 'Underwriting', 'Conditional Approval', 'Clear to Close', 'Closing', 'Funded'] },
  { id: 'milestone',   label: 'Milestone',    values: ['Application Started', 'Disclosures Sent', 'Credit Pulled', 'Submitted to Underwriting', 'Conditions Requested', 'Conditions Cleared', 'Docs Out', 'Closing Scheduled'] },
  { id: 'loanPurpose', label: 'Loan Purpose', values: ['Purchase', 'Rate/Term Refinance', 'Cash-out Refinance'] },
  { id: 'channel',     label: 'Channel',      values: ['Retail', 'Wholesale', 'Correspondent'] },
  { id: 'productType', label: 'Product Type', values: ['Conventional', 'FHA', 'VA', 'Jumbo'] },
  { id: 'state',       label: 'State',        values: ['CA', 'TN', 'MA', 'TX', 'FL'] },
  { id: 'investor',    label: 'Investor',     values: ['Default', 'Investor A', 'Investor B'] },
  { id: 'branch',      label: 'Branch',       values: ['Nashville', 'Boston', 'Irvine', 'Remote'] },
];

const FIELD_BY_ID = RULE_FIELD_DEFS.reduce((m, f) => { m[f.id] = f; return m; }, {});
export function getFieldDef(id) { return FIELD_BY_ID[id] || null; }

// Operators. `value: 'none'` → no value control; `value: 'multi'` → multi-select.
export const OPERATORS = [
  { id: 'is',           label: 'is',               value: 'single' },
  { id: 'is_not',       label: 'is not',           value: 'single' },
  { id: 'includes',     label: 'includes',         value: 'single' },
  { id: 'not_includes', label: 'does not include', value: 'single' },
  { id: 'one_of',       label: 'is one of',        value: 'multi' },
  { id: 'is_empty',     label: 'is empty',         value: 'none' },
  { id: 'is_not_empty', label: 'is not empty',     value: 'none' },
];

const OPERATOR_BY_ID = OPERATORS.reduce((m, o) => { m[o.id] = o; return m; }, {});
export function getOperator(id) { return OPERATOR_BY_ID[id] || null; }

// All loan/user context fields the mock context switcher can drive. Mirrors the
// rule fields (role is "user" context; the rest are "loan" context).
export const CONTEXT_FIELDS = RULE_FIELD_DEFS;

// Default mock context (per spec) — a Processor on a Processing cash-out refi
// in Nashville. With the seed workflows this matches "Processing Cash-out
// Refinance".
export const DEFAULT_PREVIEW_CONTEXT = {
  role: 'Processor',
  loanStatus: 'Processing',
  milestone: 'Credit Pulled',
  loanPurpose: 'Cash-out Refinance',
  channel: 'Retail',
  productType: 'Conventional',
  state: 'TN',
  investor: 'Default',
  branch: 'Nashville',
};

// ─── id + factory helpers ───────────────────────────────────────────────────
let _seq = 0;
export function newId(prefix = 'id') {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq.toString(36)}`;
}

export function makeCondition(field = 'role', operator = 'is', value = '') {
  return { id: newId('cond'), field, operator, value };
}

export function makeGroup(logic = 'AND') {
  return { id: newId('grp'), logic, conditions: [makeCondition()] };
}

export function makeSection(title = 'New workflow section', pageIds = []) {
  return {
    id: newId('sec'),
    title,
    pages: pageIds.map(id => {
      const p = getPage(id);
      return p ? { id: p.id, label: p.label, icon: p.icon } : null;
    }).filter(Boolean),
  };
}

export function makeWorkflow(partial = {}) {
  return {
    id: newId('wf'),
    name: 'New Workflow',
    description: '',
    status: 'draft',
    priority: 100,
    rules: { logic: 'AND', conditions: [], groups: [] },
    sections: [],
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
    ...partial,
  };
}

// Short human summary of who/what a workflow applies to, for the list cards.
export function appliesToSummary(workflow) {
  if (workflow.id === 'default') return 'All roles · all loans (fallback)';
  const conds = (workflow.rules?.conditions || []);
  if (!conds.length && !(workflow.rules?.groups || []).length) return 'All loans';
  const parts = conds.slice(0, 3).map(c => {
    const f = getFieldDef(c.field);
    const op = getOperator(c.operator);
    const val = Array.isArray(c.value) ? c.value.join(', ') : c.value;
    if (op && op.value === 'none') return `${f?.label || c.field} ${op.label}`;
    return `${f?.label || c.field} ${op?.label || c.operator} ${val || '—'}`;
  });
  const extra = conds.length > 3 ? ` +${conds.length - 3} more` : '';
  return parts.join(` ${workflow.rules.logic} `) + extra;
}

// ─── Seed workflows ─────────────────────────────────────────────────────────
// Used when localStorage has no saved workflows. Section/condition ids are
// generated so each install gets stable-enough ids for the session.
export function buildDefaultWorkflows() {
  return [
    {
      id: 'default',
      name: 'Default Workflow',
      description: 'Fallback navigation applied when no other active workflow matches the loan and user context.',
      status: 'active',
      priority: 999,
      rules: { logic: 'AND', conditions: [], groups: [] },
      sections: [
        makeSection('Forms', ['borrower-info', '1003']),
        makeSection('Workspaces', ['file-review', 'conditions', 'aus', 'credit-liabilities', 'pricing-lock', 'documents', 'closing', 'audit', 'services']),
      ],
      updatedAt: new Date().toISOString(),
      updatedBy: 'System',
    },
    {
      id: 'processing-purchase',
      name: 'Processing Purchase Workflow',
      description: 'Streamlined navigation for processors working purchase loans in Processing.',
      status: 'active',
      priority: 10,
      rules: {
        logic: 'AND',
        conditions: [
          makeCondition('role', 'is', 'Processor'),
          makeCondition('loanPurpose', 'is', 'Purchase'),
          makeCondition('loanStatus', 'is', 'Processing'),
        ],
        groups: [],
      },
      sections: [
        makeSection('Intake', ['borrower-summary', '1003', 'credit-liabilities']),
        makeSection('Processing', ['file-review', 'conditions', 'documents']),
        makeSection('Decisioning', ['aus', 'pricing-lock']),
      ],
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    },
    {
      id: 'processing-cashout',
      name: 'Processing Cash-out Refinance Workflow',
      description: 'Navigation tuned for processors on cash-out refinances, surfacing review and closing prep earlier.',
      status: 'active',
      priority: 20,
      rules: {
        logic: 'AND',
        conditions: [
          makeCondition('role', 'is', 'Processor'),
          makeCondition('loanPurpose', 'is', 'Cash-out Refinance'),
          makeCondition('loanStatus', 'is', 'Processing'),
        ],
        groups: [],
      },
      sections: [
        makeSection('Intake', ['borrower-summary', '1003', 'credit-liabilities']),
        makeSection('Review', ['file-review', 'aus', 'pricing-lock']),
        makeSection('Conditions', ['conditions', 'documents']),
        makeSection('Closing Prep', ['closing', 'audit']),
      ],
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    },
    {
      id: 'underwriting-refi',
      name: 'Underwriting Refinance Workflow',
      description: 'Underwriter-focused navigation for refinance loans. Draft — not yet applied to loans.',
      status: 'draft',
      priority: 30,
      rules: {
        logic: 'AND',
        conditions: [
          makeCondition('role', 'is', 'Underwriter'),
          makeCondition('loanPurpose', 'one_of', ['Rate/Term Refinance', 'Cash-out Refinance']),
        ],
        groups: [],
      },
      sections: [
        makeSection('Review', ['file-review', 'credit-liabilities', 'aus']),
        makeSection('Conditions', ['conditions', 'documents']),
        makeSection('Audit', ['audit']),
      ],
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
    },
  ];
}
