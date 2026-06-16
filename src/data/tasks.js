// Task data for the Tasks view + Hybrid sidebar
// Categories: 'overdue' | 'today' | 'upcoming'
// "Today" tab counts overdue + today (both are due-today actionable).

// Task types — used to organize the queue by the kind of work involved.
// Each task carries a `type` key that maps into this table.
export const TASK_TYPES = {
  phone:     { label: 'Phone Task',          icon: 'phone',       color: '#3A6BAD' },
  email:     { label: 'Email Task',          icon: 'mail',        color: '#7B3FA0' },
  file:      { label: 'File Task',           icon: 'doc',         color: '#A8541C' },
  meeting:   { label: 'Meeting',             icon: 'book',        color: '#2A8C53' },
  rate:      { label: 'Rate Task',           icon: 'trendingUp',  color: '#C97A1B' },
  // Processor / Underwriter work types
  processing: { label: 'Processing',          icon: 'fileSearch', color: '#3A6BAD' },
  review:     { label: 'Underwriting Review', icon: 'fileSearch', color: '#3A6BAD' },
  condition:  { label: 'Conditions',          icon: 'listCheck',  color: '#C97A1B' },
  vendor:     { label: 'Vendor / Orders',     icon: 'home',       color: '#2A8C53' },
};

// Display order when grouping the list by type (LO default).
export const TASK_TYPE_ORDER = ['phone', 'file', 'email', 'meeting', 'rate'];

export const TASKS = [
  {
    id: 't-001',
    type: 'phone',
    loanTab: 'pricing', // rate quote → Pricing & Lock
    title: 'Call back on rate quote',
    description: 'Quoted 7.125% Friday. He asked for a callback Monday AM. No reply to SMS.',
    action: { label: 'Call', icon: 'phone' },
    due: { category: 'overdue', display: 'Overdue · 1d', tone: 'red' },
    lastTouch: '4d ago — outbound call (vm)',
    borrower: { name: 'Marcus Johnson', initials: 'MJ', avatarColor: '#7B3FA0', loanId: 'LN-2024-0267', amount: 345000, product: 'FHA 30yr' },
    channel: 'Phone · prefers AM',
    source: 'Lisa Chen, Compass',
    suggestedScript: 'open with the rate context, then offer the lock extension before pitching the float-down. Borrower typically replies within 2 hrs by email.',
    primaryCta: { label: 'Call now', icon: 'phone' },
  },
  {
    id: 't-002',
    type: 'rate',
    loanTab: 'pricing', // lock extension → Pricing & Lock
    title: 'Confirm Anderson lock extension',
    description: 'Lock expires Thu. Market drifted +0.125 — extend now or repricing risk.',
    action: { label: 'Rate watch', icon: 'trendingUp' },
    due: { category: 'today', display: 'Today · 4h left', tone: 'amber' },
    lastTouch: 'Yesterday — email (read 2:18pm)',
    borrower: { name: 'Sarah Anderson', initials: 'SA', avatarColor: '#4A39C9', loanId: 'LN-2024-0234', amount: 425000, product: 'Conv 30yr' },
    channel: 'Email · same-day reply',
    source: 'Repeat client',
    suggestedScript: 'lead with the +0.125 market move and the cost of waiting. Offer the 15-day extension at current rate as the path of least resistance.',
    primaryCta: { label: 'Send extension', icon: 'mail' },
  },
  {
    id: 't-003',
    type: 'email',
    loanTab: 'credit', // refresh credit pull → Credit & Liabilities
    title: 'Pre-approval expires Friday',
    description: 'Pre-approval issued 88d ago. House-hunting since April — refresh credit pull.',
    action: { label: 'Follow-up', icon: 'arrowRight' },
    due: { category: 'today', display: 'Today · 2:00pm', tone: 'amber' },
    lastTouch: '6d ago — SMS check-in',
    borrower: { name: 'Rachel Kim', initials: 'RK', avatarColor: '#7B3FA0', loanId: 'LN-2024-0289', amount: 590000, product: 'Conv 30yr' },
    channel: 'SMS · responsive evenings',
    source: 'Self-referred',
    suggestedScript: 'reference how long she has been searching, then frame the refreshed pre-approval as protection against credit drift if she finds a home.',
    primaryCta: { label: 'Send refresh', icon: 'send' },
  },
  {
    id: 't-004',
    type: 'email',
    loanTab: 'conditions', // UW conditions → Conditions
    title: 'Send conditional approval letter',
    description: 'UW cleared with 2 conditions. Listing agent asked for letter by tonight.',
    action: { label: 'Email', icon: 'mail' },
    due: { category: 'today', display: 'Today · EOD', tone: 'amber' },
    lastTouch: 'Today — borrower call (12 min)',
    borrower: { name: 'Michael Oben', initials: 'MO', avatarColor: '#A8541C', loanId: 'LN-2024-0245', amount: 680000, product: 'Conv 30yr' },
    channel: 'Email · listing agent CC',
    source: 'Realtor referral — Aria Patel',
    suggestedScript: 'short and confident — note the 2 remaining conditions are routine, and the offer is competitive without a financing contingency tweak.',
    primaryCta: { label: 'Send letter', icon: 'mail' },
  },
  {
    id: 't-005',
    type: 'file',
    loanTab: 'documents', // missing docs → Documents
    title: 'Chase missing W-2s',
    description: 'Need 2023 W-2 + last 30d paystubs. Borrower said he’d send Friday.',
    action: { label: 'Docs', icon: 'doc' },
    due: { category: 'upcoming', display: 'Tomorrow', tone: 'neutral' },
    lastTouch: '3d ago — email reminder',
    borrower: { name: 'Thomas Park', initials: 'TP', avatarColor: '#3A8294', loanId: 'LN-2024-0312', amount: 295000, product: 'Conv 30yr' },
    channel: 'Email · responsive evenings',
    source: 'Self-referred',
    suggestedScript: 'keep tone light — frame as a quick clean-up so UW can clear the file this week.',
    primaryCta: { label: 'Send reminder', icon: 'mail' },
  },
  {
    id: 't-006',
    type: 'meeting',
    loanTab: 'closing', // CD + closing logistics → Closing
    title: 'Pre-closing walkthrough call',
    description: 'CTC issued. Walk through CD, wire instructions, day-of closing logistics.',
    action: { label: 'Meeting', icon: 'book' },
    due: { category: 'upcoming', display: 'Thu · 10:30am', tone: 'neutral' },
    lastTouch: '2d ago — email (CD sent)',
    borrower: { name: 'Jennifer Wang', initials: 'JW', avatarColor: '#3A6BAD', loanId: 'LN-2024-0211', amount: 780000, product: 'Jumbo 30yr' },
    channel: 'Video · prefers Zoom',
    source: 'Repeat client',
    suggestedScript: 'cover the CD line items, then wire-fraud awareness, then logistics. Keep under 15 minutes.',
    primaryCta: { label: 'Join call', icon: 'phone' },
  },
  {
    id: 't-007',
    type: 'phone',
    title: 'Quarterly check-in — referral partner',
    description: 'Lisa has sent 4 leads in 90d. Touch base on Q3 pipeline and co-marketing.',
    action: { label: 'Connect', icon: 'phone' },
    due: { category: 'upcoming', display: 'Fri · 11:00am', tone: 'neutral' },
    lastTouch: '14d ago — coffee meeting',
    borrower: { name: 'Lisa Chen', initials: 'LC', avatarColor: '#2A8C53', loanId: null, amount: null, product: 'Compass — Realtor' },
    channel: 'Phone · prefers AM',
    source: 'Long-term referral partner',
    suggestedScript: 'thank her for the recent Marcus Johnson lead, then ask which listings she expects to come live in Q3 so we can pre-stage pre-approvals.',
    primaryCta: { label: 'Call Lisa', icon: 'phone' },
  },
  {
    id: 't-008',
    type: 'phone',
    title: 'Discovery call — new lead',
    description: 'Brandon was referred by Aria Patel after losing 2 offers. Pre-approval first call.',
    action: { label: 'Call', icon: 'phone' },
    due: { category: 'upcoming', display: 'Next Mon · 9:00am', tone: 'neutral' },
    lastTouch: 'Yesterday — intake form',
    borrower: { name: 'Brandon Mitchell', initials: 'BM', avatarColor: '#B26500', loanId: null, amount: null, product: 'Discovery' },
    channel: 'Phone · prefers AM',
    source: 'Aria Patel, Compass',
    suggestedScript: 'lead with empathy on the lost offers, then walk through the difference a same-day pre-approval makes vs. the typical 2-day turn from a bank.',
    primaryCta: { label: 'Call Brandon', icon: 'phone' },
  },
];

// ── Processor task queue ─────────────────────────────────────────────────────
// Doc collection, vendor follow-up, condition clearing, and submission to UW —
// the processing work, not the LO's sales/relationship tasks.
const PROCESSOR_TASKS = [
  {
    id: 'pt-001', type: 'condition', loanTab: 'conditions',
    title: 'Review docs uploaded overnight — Chen',
    description: 'Paystubs + bank statements came in. Map to C-002, C-007 and clear if complete.',
    action: { label: 'Review', icon: 'fileSearch' },
    due: { category: 'today', display: 'Today · 6 docs', tone: 'amber' },
    lastTouch: 'Today — borrower upload',
    borrower: { name: 'David Chen', initials: 'DC', avatarColor: '#2A8C53', loanId: 'LN-2024-0189', amount: 525000, product: 'FHA 30yr' },
    channel: 'Doc portal', source: 'Borrower upload',
    aiLabel: 'Suggested approach',
    suggestedScript: 'two of the six docs satisfy C-002 and C-007. The 2023 W-2 is still missing — request it in the same pass so the file clears in one touch.',
    primaryCta: { label: 'Open docs', icon: 'fileSearch' },
  },
  {
    id: 'pt-002', type: 'vendor', loanTab: 'now',
    title: 'Escalate title exception — Washington',
    description: 'Title review delayed 11 days. Closing July 12 at risk — escalate with the title company.',
    action: { label: 'Vendor', icon: 'home' },
    due: { category: 'overdue', display: 'Overdue · 2d', tone: 'red' },
    lastTouch: '2d ago — email to title',
    borrower: { name: 'Aria Washington', initials: 'AW', avatarColor: '#2A8C53', loanId: 'LN-2024-0344', amount: 415000, product: 'Conv 30yr' },
    channel: 'Email · Chicago Title', source: 'Vendor SLA breach',
    aiLabel: 'Suggested approach',
    suggestedScript: 'the commitment has been open 11 days vs the 5-day SLA. Escalate to the title rep with the closing date in the subject line and CC the branch manager.',
    primaryCta: { label: 'Escalate', icon: 'mail' },
  },
  {
    id: 'pt-003', type: 'vendor', loanTab: 'now',
    title: 'Follow up on appraisal — Chen',
    description: 'FHA appraisal ordered May 10. No ETA from the AMC — 120-day window applies.',
    action: { label: 'Vendor', icon: 'home' },
    due: { category: 'today', display: 'Today', tone: 'amber' },
    lastTouch: '3d ago — AMC portal',
    borrower: { name: 'David Chen', initials: 'DC', avatarColor: '#2A8C53', loanId: 'LN-2024-0189', amount: 525000, product: 'FHA 30yr' },
    channel: 'AMC portal', source: 'Ordered May 10',
    aiLabel: 'Suggested approach',
    suggestedScript: 'request an ETA and confirm the appraiser has property access. A 7–10 day turn is typical for this zip — flag it if it slips past day 12.',
    primaryCta: { label: 'Request ETA', icon: 'send' },
  },
  {
    id: 'pt-004', type: 'processing', loanTab: 'now',
    title: 'Run instant VOE — Castillo',
    description: 'VOE pending on a jumbo file. Blocks AUS submission — run The Work Number.',
    action: { label: 'Verify', icon: 'zap' },
    due: { category: 'today', display: 'Today', tone: 'amber' },
    lastTouch: 'Yesterday — file review',
    borrower: { name: 'Mia Castillo', initials: 'MC', avatarColor: '#C25535', loanId: 'LN-2024-0350', amount: 1150000, product: 'Jumbo 30yr' },
    channel: 'Equifax / TWN', source: 'Processing checklist',
    aiLabel: 'Suggested approach',
    suggestedScript: 'instant VOE via The Work Number returns in ~30 seconds and unblocks the DU submission today — no employer contact needed.',
    primaryCta: { label: 'Run VOE', icon: 'zap' },
  },
  {
    id: 'pt-005', type: 'condition', loanTab: 'conditions',
    title: 'Clear 2 conditions — Friedman',
    description: 'VOE and asset statements received. Map and clear C-004, C-006.',
    action: { label: 'Conditions', icon: 'listCheck' },
    due: { category: 'upcoming', display: 'Tomorrow', tone: 'neutral' },
    lastTouch: '1d ago — docs received',
    borrower: { name: 'Noah Friedman', initials: 'NF', avatarColor: '#4A39C9', loanId: 'LN-2024-0347', amount: 385000, product: 'Conv 30yr' },
    channel: 'Doc portal', source: 'Borrower upload',
    aiLabel: 'Suggested approach',
    suggestedScript: 'both docs are complete and match the 1003 — clear the two conditions and the file is ready for the stacking order.',
    primaryCta: { label: 'Clear conditions', icon: 'check' },
  },
  {
    id: 'pt-006', type: 'processing', loanTab: 'now',
    title: 'Build stacking order & submit — Park',
    description: 'Conditions cleared and AUS is Approve/Eligible. Assemble the package and submit to UW.',
    action: { label: 'Submit', icon: 'arrowRight' },
    due: { category: 'upcoming', display: 'Thu', tone: 'neutral' },
    lastTouch: 'Today — conditions cleared',
    borrower: { name: 'Thomas Park', initials: 'TP', avatarColor: '#3A8294', loanId: 'LN-2024-0312', amount: 295000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'Processing checklist',
    aiLabel: 'Suggested approach',
    suggestedScript: 'all six processing items are complete — generate the stacking order from the DU findings and submit today to protect the close date.',
    primaryCta: { label: 'Submit to UW', icon: 'arrowRight' },
  },
  {
    id: 'pt-007', type: 'email', loanTab: 'conditions',
    title: 'Request gift letter signature — Chen',
    description: 'AUS flagged a $12K gift. Draft the gift letter for the borrower to sign.',
    action: { label: 'Email', icon: 'mail' },
    due: { category: 'upcoming', display: 'Fri', tone: 'neutral' },
    lastTouch: '2d ago — AUS findings',
    borrower: { name: 'David Chen', initials: 'DC', avatarColor: '#2A8C53', loanId: 'LN-2024-0189', amount: 525000, product: 'FHA 30yr' },
    channel: 'Email · e-sign', source: 'DU finding',
    aiLabel: 'Suggested approach',
    suggestedScript: "I drafted the gift letter with the $12K amount and donor fields pre-filled — send for e-signature; it takes the borrower under a minute.",
    primaryCta: { label: 'Send for signature', icon: 'mail' },
  },
];

// ── Underwriter task queue ───────────────────────────────────────────────────
// Decisions, condition sign-off, exceptions, and manual underwriting.
const UNDERWRITER_TASKS = [
  {
    id: 'ut-001', type: 'review', loanTab: 'underwriting',
    title: 'Manual decision — Romano (DU Refer)',
    description: 'DU returned Refer with Caution. Lock expires in 3 days — needs a manual decision.',
    action: { label: 'Underwrite', icon: 'fileSearch' },
    due: { category: 'overdue', display: 'Overdue · 1d', tone: 'red' },
    lastTouch: 'Today — file in queue',
    borrower: { name: 'Isabella Romano', initials: 'IR', avatarColor: '#A8541C', loanId: 'LN-2024-0356', amount: 475000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'AUS Refer',
    aiLabel: 'Suggested approach',
    suggestedScript: 'the Refer is driven by reserves, not credit. With 6 months reserves documented, the file supports a manual Approve — cite the compensating factor in the decision.',
    primaryCta: { label: 'Open decision', icon: 'fileSearch' },
  },
  {
    id: 'ut-002', type: 'condition', loanTab: 'conditions',
    title: 'Review income calculation — Anderson',
    description: 'VOE returned. Verify calculated income against the 1003 and clear the 4 open conditions.',
    action: { label: 'Conditions', icon: 'listCheck' },
    due: { category: 'today', display: 'Today', tone: 'amber' },
    lastTouch: 'Today — VOE received',
    borrower: { name: 'Sarah Anderson', initials: 'SA', avatarColor: '#4A39C9', loanId: 'LN-2024-0234', amount: 425000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'Conditions queue',
    aiLabel: 'Suggested approach',
    suggestedScript: 'the VOE base pay matches the 1003 within tolerance. Bonus income needs a 2-year average — apply it and three of the four conditions clear.',
    primaryCta: { label: 'Review income', icon: 'fileSearch' },
  },
  {
    id: 'ut-003', type: 'review', loanTab: 'underwriting',
    title: 'Review VA certification — Schmidt',
    description: 'VA streamline (IRRRL). Confirm COE, prior-loan seasoning, and lender certification.',
    action: { label: 'Underwrite', icon: 'fileSearch' },
    due: { category: 'today', display: 'Today', tone: 'amber' },
    lastTouch: 'Yesterday — file assigned',
    borrower: { name: 'Lucas Schmidt', initials: 'LS', avatarColor: '#6E5527', loanId: 'LN-2024-0353', amount: 285000, product: 'VA 30yr' },
    channel: 'LOS', source: 'UW queue',
    aiLabel: 'Suggested approach',
    suggestedScript: 'seasoning and the net-tangible-benefit test both pass. Confirm the COE entitlement code, then the streamline is clear to approve.',
    primaryCta: { label: 'Open file', icon: 'fileSearch' },
  },
  {
    id: 'ut-004', type: 'review', loanTab: 'now',
    title: 'FEMA disaster review — Rivera',
    description: 'Property in DR-4830-FL disaster zone. Re-inspection required before clearing to close.',
    action: { label: 'Review', icon: 'alertOctagon' },
    due: { category: 'today', display: 'Today', tone: 'red' },
    lastTouch: 'Today — FEMA flag',
    borrower: { name: 'Carlos Rivera', initials: 'CR', avatarColor: '#B91C1C', loanId: 'LN-2024-0391', amount: 520000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'FEMA declaration',
    aiLabel: 'Suggested approach',
    suggestedScript: 'the property sits inside the Hurricane Milton declaration area. Require a post-disaster re-inspection (1004D) before final approval.',
    primaryCta: { label: 'Add condition', icon: 'listCheck' },
  },
  {
    id: 'ut-005', type: 'condition', loanTab: 'conditions',
    title: 'Sign off 3 conditions — Rodriguez',
    description: 'Income and asset docs submitted today. Review and sign off if they satisfy the conditions.',
    action: { label: 'Conditions', icon: 'listCheck' },
    due: { category: 'upcoming', display: 'Tomorrow', tone: 'neutral' },
    lastTouch: 'Today — docs submitted',
    borrower: { name: 'Emily Rodriguez', initials: 'ER', avatarColor: '#C25535', loanId: 'LN-2024-0301', amount: 412000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'Conditions queue',
    aiLabel: 'Suggested approach',
    suggestedScript: 'all three docs are legible and current. They satisfy the conditions as written — sign off and move the file toward clear-to-close.',
    primaryCta: { label: 'Sign off', icon: 'check' },
  },
  {
    id: 'ut-006', type: 'review', loanTab: 'underwriting',
    title: 'Issue initial decision — Lee',
    description: 'Clean file, DU Approve/Eligible. Ready for an initial underwriting decision.',
    action: { label: 'Decision', icon: 'checkCircle' },
    due: { category: 'upcoming', display: 'Thu', tone: 'neutral' },
    lastTouch: 'Yesterday — submitted',
    borrower: { name: 'Benjamin Lee', initials: 'BL', avatarColor: '#3A8294', loanId: 'LN-2024-0359', amount: 365000, product: 'Conv 30yr' },
    channel: 'LOS', source: 'UW queue',
    aiLabel: 'Suggested approach',
    suggestedScript: 'income, assets, and credit all clear with no overlays triggered. Issue the conditional approval — the standard doc conditions are pre-listed.',
    primaryCta: { label: 'Issue decision', icon: 'checkCircle' },
  },
];

// Counts for KPIs and tab badges
function countsFor(tasks, completed7d) {
  return {
    dueToday: tasks.filter(t => t.due.category === 'today' || t.due.category === 'overdue').length,
    overdue: tasks.filter(t => t.due.category === 'overdue').length,
    thisWeek: tasks.filter(t => t.due.category === 'upcoming').length,
    completed7d, // illustrative — no completed-task store
    total: tasks.length,
  };
}

export const TASK_COUNTS = countsFor(TASKS, 14);
const PROCESSOR_COUNTS = countsFor(PROCESSOR_TASKS, 22);
const UNDERWRITER_COUNTS = countsFor(UNDERWRITER_TASKS, 18);

// ── Persona selectors ────────────────────────────────────────────────────────
export function getTasks(persona) {
  if (persona === 'Processor')   return PROCESSOR_TASKS;
  if (persona === 'Underwriter') return UNDERWRITER_TASKS;
  return TASKS;
}
export function getTaskCounts(persona) {
  if (persona === 'Processor')   return PROCESSOR_COUNTS;
  if (persona === 'Underwriter') return UNDERWRITER_COUNTS;
  return TASK_COUNTS;
}
export function getTaskTypeOrder(persona) {
  if (persona === 'Processor')   return ['processing', 'condition', 'vendor', 'file', 'email', 'phone'];
  if (persona === 'Underwriter') return ['review', 'condition', 'email', 'phone'];
  return TASK_TYPE_ORDER;
}
