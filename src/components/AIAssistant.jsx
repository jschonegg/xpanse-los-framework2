import React from 'react';
import { Icon } from './Icon';

// ─── Master action list ────────────────────────────────────────────────────────
// type:'ai'  — AI did the work, LO just approves. Stays in panel.
// type:'nav' — LO needs the loan file. Navigates to exact tab.
const ALL_ACTIONS = [
  // ── URGENT ──
  {
    id: 'a1', type: 'nav', priority: 'urgent', confidence: 96,
    loan: 'Jennifer Wang', loanId: 'LN-2024-0211', category: 'TRID',
    title: 'Send Closing Disclosure',
    why: 'Closing is May 22. CD must be acknowledged by May 19 or closing must move. You need to review the full CD before sending — compliance risk.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Review & send CD',
  },
  {
    id: 'a2', type: 'ai', priority: 'urgent', eta: '30 sec', confidence: 95,
    loan: 'Sarah Anderson', loanId: 'LN-2024-0234', category: 'Income',
    title: 'Apply income calc — Anderson',
    why: 'I pulled the W-2 and VOE. Numbers check out — qualifying income is $8,750/mo, DTI 38%. Safe to apply directly to the loan file.',
    cta: 'Apply to loan file',
    detail: [
      { label: 'W-2 Base', value: '$105,000' },
      { label: 'Overtime (2-yr avg)', value: '$7,200' },
      { label: 'Qualifying income', value: '$8,750/mo' },
      { label: 'DTI', value: '38% ✓' },
    ],
  },
  {
    id: 'a3', type: 'nav', priority: 'urgent', confidence: 91,
    loan: 'David Chen', loanId: 'LN-2024-0189', category: 'Rate Lock',
    title: 'Order appraisal — lock expires in 7 days',
    why: 'You need to select a vendor, confirm the property address, and submit through the AMC portal. Missing the window costs ~$1,312.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Open loan to order',
  },
  // ── HIGH ──
  {
    id: 'a4', type: 'ai', priority: 'high', eta: '1 min', confidence: 78,
    loan: 'David Chen', loanId: 'LN-2024-0189', category: 'Income',
    title: 'Flag income calc — Chen (1-yr OT only)',
    why: "Fannie Mae requires 2-yr OT history. Chen only has 1 year. Base income qualifies fine — flagging sends it for manual UW sign-off.",
    cta: 'Flag for manual review', flag: true,
    detail: [
      { label: 'W-2 Base', value: '$82,000' },
      { label: 'Overtime (1-yr only)', value: '$3,200 ⚠' },
      { label: 'Qualifying (base only)', value: '$6,833/mo' },
      { label: 'DTI', value: '43% ✓' },
    ],
  },
  {
    id: 'a5', type: 'ai', priority: 'high', eta: '30 sec', confidence: 91,
    loan: 'Emily Rodriguez', loanId: 'LN-2024-0301', category: 'Income',
    title: 'Apply income calc — Rodriguez',
    why: 'W-2 base $79K + $3K OT (2-yr avg). Clean approval — DTI 41%, within Conv 45% max.',
    cta: 'Apply to loan file',
    detail: [
      { label: 'W-2 Base', value: '$79,000' },
      { label: 'Overtime (2-yr avg)', value: '$3,000' },
      { label: 'Qualifying income', value: '$6,833/mo' },
      { label: 'DTI', value: '41% ✓' },
    ],
  },
  {
    id: 'a6', type: 'nav', priority: 'high', confidence: 89,
    loan: 'Michael Oben', loanId: 'LN-2024-0245', category: 'Conditions',
    title: 'Clear 2 blocking PTF conditions',
    why: 'You need to review the supporting docs before clearing P-001 (VOE) and P-002 (CD acknowledgment). Closing is June 12.',
    navTab: 'conditions', navTabLabel: 'Conditions',
    cta: 'Open conditions tab',
  },
  {
    id: 'a7', type: 'ai', priority: 'high', eta: '30 sec', confidence: 94,
    loan: 'Sarah Anderson', loanId: 'LN-2024-0234', category: 'Docs',
    title: 'Request 2 missing bank statements',
    why: "Anderson was active on the portal 15 min ago. I've drafted the message — approve to send.",
    cta: 'Approve & send',
    preview: '"Hi Sarah — we need your March and April bank statements to finish underwriting. Upload via the portal link. Should take 30 seconds. — Alex"',
  },
  // ── MEDIUM ──
  {
    id: 'a8', type: 'nav', priority: 'medium', confidence: 87,
    loan: 'Rachel Kim', loanId: 'LN-2024-0289', category: 'Approval',
    title: 'Review conditional approval — Kim',
    why: 'You need to read the full approval terms and formally acknowledge before PTF conditions can be tracked. Closing target June 15.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Review approval',
  },
  {
    id: 'a9', type: 'nav', priority: 'medium', confidence: 92,
    loan: 'Thomas Park', loanId: 'LN-2024-0312', category: 'Processing',
    title: 'Order title search — Park',
    why: 'Vendor selection and address confirmation required before ordering. 16 days in Processing — 6 over average.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Open loan to order',
  },
  {
    id: 'a10', type: 'ai', priority: 'medium', eta: '30 sec', confidence: 89,
    loan: 'Marcus Johnson', loanId: 'LN-2024-0267', category: 'Docs',
    title: 'Send doc checklist — Johnson',
    why: '6 required docs outstanding. Checklist pre-generated and ready to send via borrower portal.',
    cta: 'Send checklist',
    preview: 'Checklist: W-2 (2024, 2023), Paystubs (60-day), Bank statements (2-mo), Photo ID, Signed 4506-C.',
  },
  {
    id: 'a11', type: 'nav', priority: 'medium', confidence: 96,
    loan: 'Jennifer Wang', loanId: 'LN-2024-0211', category: 'Wire',
    title: 'Confirm wire instructions — Wang',
    why: 'You need to verify the wire amounts against the final title commitment before sending to borrower.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Review wire details',
  },
  {
    id: 'a12', type: 'nav', priority: 'medium', confidence: 83,
    loan: 'Marcus Johnson', loanId: 'LN-2024-0267', category: 'AUS',
    title: 'Run initial AUS — Johnson',
    why: 'Verify loan data is complete before submitting to DU. One bad field causes a Refer — better to check first.',
    navTab: 'aus', navTabLabel: 'AUS',
    cta: 'Open AUS tab',
  },
];

// ─── Processor action queue ────────────────────────────────────────────────────
const ALL_ACTIONS_PROCESSOR = [
  // ── URGENT ──
  {
    id: 'p1', type: 'nav', priority: 'urgent', confidence: 99,
    loan: 'Jennifer Wang', loanId: 'LN-2024-0211', category: 'TRID',
    title: 'Send Closing Disclosure — Wang',
    why: 'CD must be acknowledged by May 19 or closing moves. 3-business-day rule is non-negotiable. Review the full CD before sending.',
    navTab: 'closing', navTabLabel: 'Closing',
    cta: 'Open Closing tab',
  },
  {
    id: 'p2', type: 'nav', priority: 'urgent', confidence: 94,
    loan: 'Michael Oben', loanId: 'LN-2024-0245', category: 'Rate Lock',
    title: 'Extend rate lock — Oben expiring in 3 days',
    why: 'Lock expires May 21. Extension window closes at 3 PM today. Missing it costs ~$1,700 in renegotiation fees and delays closing.',
    navTab: 'pricing', navTabLabel: 'Pricing & Lock',
    cta: 'Open Pricing & Lock',
  },
  {
    id: 'p3', type: 'ai', priority: 'urgent', eta: '45 sec', confidence: 97,
    loan: 'Sarah Anderson', loanId: 'LN-2024-0234', category: 'Conditions',
    title: 'Clear C-002 + C-007 — Anderson upload matches',
    why: "Anderson uploaded 2 bank statements 8 minutes ago. I've compared them against both conditions — balances match, format is acceptable, dates are within the 60-day window. Safe to clear both now.",
    cta: 'Clear both conditions',
    detail: [
      { label: 'C-002 Bank Statement — March', value: '$45,210 ✓' },
      { label: 'C-007 Bank Statement — April', value: '$43,880 ✓' },
      { label: '60-day window', value: 'Within range ✓' },
      { label: 'Source match', value: 'Chase ending 4421 ✓' },
    ],
  },
  // ── HIGH ──
  {
    id: 'p4', type: 'ai', priority: 'high', eta: '30 sec', confidence: 91,
    loan: 'Rachel Kim', loanId: 'LN-2024-0289', category: 'Conditions',
    title: 'Clear C-011 gift letter — Kim',
    why: "UW returned C-011 requiring a signed gift letter for the $18,000 down payment gift. Kim uploaded a signed letter yesterday — I've verified the donor name, relationship, and amount match the 1003. Ready to clear.",
    cta: 'Clear condition',
    detail: [
      { label: 'Donor name', value: 'James Kim (father) ✓' },
      { label: 'Gift amount', value: '$18,000 ✓' },
      { label: 'No repayment clause', value: 'Present ✓' },
      { label: 'Donor signature', value: 'Signed ✓' },
    ],
  },
  {
    id: 'p5', type: 'ai', priority: 'high', eta: '2 min', confidence: 88,
    loan: 'David Chen', loanId: 'LN-2024-0189', category: 'Docs',
    title: 'Draft doc request — Chen (updated paystub)',
    why: "Chen's current paystub expired May 24. He hasn't responded to the verbal request. I've drafted a portal message — plain language, specific doc name, upload instructions, and a 3-day deadline.",
    cta: 'Approve & send',
    preview: '"Hi David — your most recent paystub has expired and we need an updated one (dated within the last 30 days) to complete your file. Please upload via your portal. This takes about 2 minutes and keeps your closing on track. — Jordan"',
  },
  {
    id: 'p6', type: 'nav', priority: 'high', confidence: 85,
    loan: 'David Chen', loanId: 'LN-2024-0189', category: 'Appraisal',
    title: 'Review appraisal gap — Chen ($7K below contract)',
    why: "Appraisal came in at $518K vs. $525K contract price. You need to review the report and flag options to the LO: price reduction, borrower covers gap, or rebuttal. This needs a human decision — I can prep the options summary.",
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Open loan to review',
  },
  {
    id: 'p7', type: 'ai', priority: 'high', eta: '1 min', confidence: 93,
    loan: 'Sarah Anderson', loanId: 'LN-2024-0234', category: 'Data Validation',
    title: 'Validate income — Anderson W-2 vs. system',
    why: "Anderson's W-2 shows $105,000. The system has $108,500. I've flagged the $3,500 discrepancy — likely a data entry error on the 1003. You need to confirm and correct before UW sees it.",
    cta: 'View discrepancy',
    detail: [
      { label: 'W-2 base income', value: '$105,000' },
      { label: 'System (1003)', value: '$108,500 ⚠' },
      { label: 'Discrepancy', value: '$3,500' },
      { label: 'Action', value: 'Correct before UW submit' },
    ],
  },
  // ── MEDIUM ──
  {
    id: 'p8', type: 'nav', priority: 'medium', confidence: 87,
    loan: 'Thomas Park', loanId: 'LN-2024-0312', category: 'Third Party',
    title: 'Follow up on title — Park (9 days, no response)',
    why: 'Title was ordered May 10 — 9 days without a commitment. Average turn time for Nashville is 6 days. Call Chicago Title directly to confirm receipt and get an ETA.',
    navTab: 'now', navTabLabel: 'Now',
    cta: 'Open loan to escalate',
  },
  {
    id: 'p9', type: 'ai', priority: 'medium', eta: '30 sec', confidence: 89,
    loan: 'Emily Rodriguez', loanId: 'LN-2024-0301', category: 'Conditions',
    title: 'Send condition status update to LO — Rodriguez',
    why: "Rodriguez has been in UW for 4 days. Jamie Lee (processor) is working the conditions but the LO hasn't been looped in. I've drafted a brief status note: 3 open conditions, 2 borrower-side, 1 employer VOE in progress.",
    cta: 'Approve & send to LO',
    preview: '"Rodriguez update: 3 conditions open. C-003 (paystub) and C-005 (bank statement) are borrower-side — portal requests sent. C-008 VOE is with Acme Corp, ETA 2 days. No blockers yet. — Jordan"',
  },
  {
    id: 'p10', type: 'nav', priority: 'medium', confidence: 82,
    loan: 'Rachel Kim', loanId: 'LN-2024-0289', category: 'Conditions',
    title: 'Clear C-012 VOE — Kim employment confirmed',
    why: 'C-012 requires VOE for Rachel Kim. The Work Number returned results — employment is confirmed active at current employer. You need to review the findings and mark cleared.',
    navTab: 'conditions', navTabLabel: 'Conditions',
    cta: 'Review & clear condition',
  },
];

const PROCESSOR_UI_STRINGS = {
  en: {
    queue: 'Queue', done: 'Done', ask: 'Ask AI', coach: 'Processor Coach',
    clear: 'Queue clear', clearSub: "All conditions and tasks actioned. I'll surface new items as they come in.",
    placeholder: 'Ask about conditions, docs, SLAs...',
    prompts: [
      "What conditions can I clear right now?",
      "Which files are at SLA risk this week?",
      "Draft a doc request for David Chen",
      "What's blocking Kim from final approval?",
      "Show me all expiring or expired docs",
    ],
  },
};

const PROCESSOR_REPLIES = {
  en: {
    plan:      "Start with Wang's CD — hard TRID deadline, can't slip. Then clear Anderson C-002 + C-007 (AI-ready, 45 sec). Extend Oben's lock before 3 PM. Chen's appraisal gap needs LO input — flag it now.",
    block:     "Two hard blockers today: Wang's CD (TRID window closes tonight) and Oben's lock expiring May 21. After those: Anderson C-002/C-007 are clearable right now. Chen needs LO decision on the appraisal gap.",
    condition: "3 conditions clearable right now: Anderson C-002 + C-007 (bank statements match), Kim C-011 gift letter (verified). Kim C-012 VOE findings are back — needs your review. 14 total open across 7 loans.",
    doc:       "5 docs outstanding: Chen paystub (expired, draft request ready to send), Rodriguez C-003 paystub + C-005 bank statement (portal requests sent May 16, no response), Park title commitment (9 days, follow up with Chicago Title).",
    sla:       "3 SLA risks: Wang CD delivery breaches at 5 PM today. Chen has had no borrower response in 5 days — escalation threshold. Park title order is 9 days old, 3 days over average turn time.",
    validate:  "One income discrepancy flagged: Anderson W-2 shows $105K, system has $108,500 — $3,500 gap. Needs correction before UW submit. Chen income is clean (base only, OT excluded per Fannie guidelines).",
    draft:     "Drafted doc request for Chen ready to send — plain language, 3-day deadline, portal upload link included. Want me to pull up the preview?",
    snooze:    "Snoozed items resurface first thing tomorrow. You can always find them in the Done tab.",
    default:   "Ask me about conditions, doc requests, data validation, SLA risks, or status updates to the LO. I know every open item across your 7 active files.",
  },
};

const PRIORITY_META = {
  urgent: { label: 'Urgent', dot: '#D74C3C', headerBg: '#FEF0ED', headerText: '#B03025' },
  high:   { label: 'High',   dot: '#E0A23A', headerBg: '#FEF7E8', headerText: '#9C6A1A' },
  medium: { label: 'Medium', dot: '#5C7CFA', headerBg: '#EEF3FE', headerText: '#3553CC' },
};

// ─── Persistence ───────────────────────────────────────────────────────────────
const TODAY_KEY = new Date().toISOString().slice(0, 10);
const STORE_KEY = `los-coach-${TODAY_KEY}`;
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { completed: {}, snoozed: {} }; }
  catch { return { completed: {}, snoozed: {} }; }
}
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

// ─── Dialects ─────────────────────────────────────────────────────────────────
export const DIALECTS = [
  { id: 'en',  label: 'English',        flag: '🇺🇸', name: 'English' },
  { id: 'zh',  label: '上海话',           flag: '🇨🇳', name: 'Shanghai' },
  { id: 'pa',  label: 'ਪੰਜਾਬੀ',          flag: '🇮🇳', name: 'Punjabi' },
  { id: 'es',  label: 'Español MX',     flag: '🇲🇽', name: 'Mexico City' },
  { id: 'fr',  label: 'Français',       flag: '🇫🇷', name: 'French' },
];

const UI_STRINGS = {
  en: { queue: 'Queue', done: 'Done', ask: 'Ask AI', coach: 'AI Coach', clear: 'Queue clear', clearSub: "All items actioned. I'll surface new items as things change.", placeholder: 'Ask anything...', prompts: ["What can I action right now?", "What's blocked?", "Show at-risk loans", "What's blocking Anderson?", "What can I snooze?"] },
  zh: { queue: '待办', done: '完成', ask: '问AI', coach: 'AI 教练', clear: '全部完成', clearSub: '所有任务已处理，有新内容我会及时通知你。', placeholder: '问任何问题…', prompts: ['现在可以处理什么？', '什么被阻塞了？', '显示风险贷款', 'Anderson的问题是什么？', '什么可以稍后处理？'] },
  pa: { queue: 'ਕਤਾਰ', done: 'ਮੁਕੰਮਲ', ask: 'AI ਪੁੱਛੋ', coach: 'AI ਕੋਚ', clear: 'ਕਤਾਰ ਸਾਫ਼', clearSub: 'ਸਾਰੇ ਕੰਮ ਮੁਕੰਮਲ। ਨਵੀਆਂ ਚੀਜ਼ਾਂ ਆਉਣ ਤੇ ਮੈਂ ਦੱਸਾਂਗਾ।', placeholder: 'ਕੁਝ ਵੀ ਪੁੱਛੋ…', prompts: ['ਹੁਣ ਕੀ ਕਰ ਸਕਦਾ ਹਾਂ?', 'ਕੀ ਰੁਕਿਆ ਹੋਇਆ ਹੈ?', 'ਖ਼ਤਰੇ ਵਾਲੇ ਕਰਜ਼ੇ ਦਿਖਾਓ', 'Anderson ਦੀ ਸਮੱਸਿਆ ਕੀ ਹੈ?', 'ਕੀ ਬਾਅਦ ਵਿੱਚ ਕਰ ਸਕਦਾ ਹਾਂ?'] },
  es: { queue: 'Cola', done: 'Listo', ask: 'Preguntar', coach: 'Coach IA', clear: 'Cola vacía', clearSub: 'Todo atendido. Te aviso cuando haya algo nuevo.', placeholder: 'Pregunta lo que quieras…', prompts: ['¿Qué puedo hacer ahorita?', '¿Qué está bloqueado?', 'Ver préstamos en riesgo', '¿Qué bloquea a Anderson?', '¿Qué puedo posponer?'] },
  fr: { queue: 'File', done: 'Fait', ask: 'Demander', coach: 'Coach IA', clear: 'File vide', clearSub: 'Tout est traité. Je te signale les nouvelles tâches dès qu\'elles arrivent.', placeholder: 'Pose n\'importe quelle question…', prompts: ['Que puis-je faire maintenant ?', 'Qu\'est-ce qui bloque ?', 'Voir les prêts à risque', 'Qu\'est-ce qui bloque Anderson ?', 'Que puis-je reporter ?'] },
};

const REPLIES = {
  en: {
    plan:      "Start with Wang's CD — hard TRID deadline May 19. Then knock out the 3 income calcs (Anderson, Rodriguez, Chen) — those are AI-ready, 30 seconds each. Snooze AUS and title until afternoon.",
    block:     "Two hard blockers: Anderson's bank statements (she's active on the portal now) and Chen's appraisal order. Everything else is actionable.",
    chen:      "Chen only has 1 year of overtime history. Fannie Mae B3-3.1-02 requires 2 years documented to use OT income. His base salary alone still qualifies — DTI is 43%, within the 45% max.",
    risk:      "Three flags: Chen (lock + appraisal), Wang (TRID window closes May 19), Park (16 days in processing). Wang is the most time-sensitive.",
    income:    "Three income calcs pending: Anderson (apply — 95% conf), Rodriguez (apply — 91% conf), Chen (flag — 1-yr OT issue). All AI-ready, action them right here.",
    condition: "7 open conditions across 3 loans. Oben has 2 blocking PTFs (closing June 12). Anderson has a blocking LOX the borrower needs to write.",
    snooze:    "Snoozed items resurface first thing tomorrow. You can always find them in the Done tab.",
    default:   "Happy to dig into any loan or category. Try asking about what's blocked, at-risk loans, or a specific borrower.",
  },
  zh: {
    plan:      '先处理Wang的CD——TRID截止日期是5月19日，不能拖。然后搞定三个收入计算（Anderson、Rodriguez、Chen）——AI已准备好，每个只需30秒。AUS和产权可以下午再说。',
    block:     '两个硬卡点：Anderson的银行流水（她现在在线）和Chen的评估订单。其他的都可以推进。',
    chen:      'Chen只有1年加班记录。房利美B3-3.1-02要求至少2年才能使用加班收入。但他的基本工资单独计算DTI是43%，在45%上限以内，没问题。',
    risk:      '三个风险点：Chen（锁定期+评估）、Wang（TRID窗口5月19日关闭）、Park（已在处理中16天）。Wang最紧急。',
    income:    '三个待处理收入计算：Anderson（直接应用，95%置信度）、Rodriguez（直接应用，91%）、Chen（需标记，加班只有1年）。AI全部就绪，可以直接在这里操作。',
    condition: '3个贷款共7个待处理条件。Oben有2个阻碍PTF的条件（结案6月12日）。Anderson有一个需要借款人填写的说明信。',
    snooze:    '推迟的任务明天一早会重新出现。在"完成"标签里随时可以查看。',
    default:   '可以查看任何贷款或类别。试着问问哪里卡住了、有哪些高风险贷款或某个借款人的情况。',
  },
  pa: {
    plan:      'Wang ਦਾ CD ਪਹਿਲਾਂ ਕਰੋ — TRID ਦੀ ਅੰਤਮ ਤਾਰੀਖ਼ 19 ਮਈ ਹੈ। ਫਿਰ ਤਿੰਨ ਆਮਦਨ ਗਣਨਾਵਾਂ (Anderson, Rodriguez, Chen) ਮੁਕਾਓ — ਹਰੇਕ 30 ਸਕਿੰਟ। AUS ਅਤੇ title ਦੁਪਹਿਰ ਲਈ ਛੱਡੋ।',
    block:     'ਦੋ ਮੁੱਖ ਰੁਕਾਵਟਾਂ: Anderson ਦੇ ਬੈਂਕ ਸਟੇਟਮੈਂਟ (ਉਹ ਹੁਣ ਪੋਰਟਲ ਤੇ ਹੈ) ਅਤੇ Chen ਦਾ ਮੁਲਾਂਕਣ ਆਰਡਰ। ਬਾਕੀ ਸਭ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।',
    chen:      'Chen ਕੋਲ ਸਿਰਫ਼ 1 ਸਾਲ ਦਾ ਓਵਰਟਾਈਮ ਇਤਿਹਾਸ ਹੈ। Fannie Mae ਨੂੰ 2 ਸਾਲ ਚਾਹੀਦੇ ਹਨ। ਪਰ ਬੇਸ ਤਨਖ਼ਾਹ ਨਾਲ DTI 43% ਹੈ — ਸੀਮਾ 45% ਤੋਂ ਘੱਟ।',
    risk:      'ਤਿੰਨ ਝੰਡੇ: Chen (ਤਾਲਾ + ਮੁਲਾਂਕਣ), Wang (TRID ਵਿੰਡੋ 19 ਮਈ), Park (16 ਦਿਨ ਪ੍ਰੋਸੈਸਿੰਗ ਵਿੱਚ)। Wang ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ।',
    income:    'ਤਿੰਨ ਆਮਦਨ ਗਣਨਾਵਾਂ ਬਾਕੀ: Anderson (ਲਾਗੂ ਕਰੋ, 95%), Rodriguez (ਲਾਗੂ ਕਰੋ, 91%), Chen (ਝੰਡਾ, 1 ਸਾਲ OT)। ਸਭ AI ਤਿਆਰ।',
    condition: '3 ਕਰਜ਼ਿਆਂ ਵਿੱਚ 7 ਖੁੱਲ੍ਹੀਆਂ ਸ਼ਰਤਾਂ। Oben ਕੋਲ 2 PTF ਰੋਕਣ ਵਾਲੀਆਂ (ਬੰਦ 12 ਜੂਨ)। Anderson ਕੋਲ ਇੱਕ LOX ਚਾਹੀਦੀ ਹੈ।',
    snooze:    'ਮੁਲਤਵੀ ਕੀਤੇ ਕੰਮ ਕੱਲ੍ਹ ਸਵੇਰੇ ਵਾਪਸ ਆਉਣਗੇ। "ਮੁਕੰਮਲ" ਟੈਬ ਵਿੱਚ ਦੇਖੋ।',
    default:   'ਕੋਈ ਵੀ ਕਰਜ਼ਾ ਜਾਂ ਸ਼੍ਰੇਣੀ ਪੁੱਛੋ। ਰੁਕਾਵਟਾਂ, ਜੋਖ਼ਮ ਵਾਲੇ ਕਰਜ਼ੇ ਜਾਂ ਕਿਸੇ ਖ਼ਾਸ ਉਧਾਰਕਰਤਾ ਬਾਰੇ ਦੱਸੋ।',
  },
  es: {
    plan:      'Empieza con el CD de Wang — la fecha límite TRID es el 19 de mayo, no hay margen. Luego ataca los 3 cálculos de ingresos (Anderson, Rodriguez, Chen) — listos por IA, 30 segundos cada uno. El AUS y el título pueden esperar a la tarde.',
    block:     'Dos bloqueos fuertes: los estados de cuenta de Anderson (está en el portal ahorita) y la orden de avalúo de Chen. Todo lo demás está accionable.',
    chen:      'Chen solo tiene 1 año de historial de tiempo extra. Fannie Mae B3-3.1-02 exige 2 años documentados para usar ese ingreso. Con solo el salario base, el DTI es 43% — dentro del límite del 45%.',
    risk:      'Tres alertas: Chen (bloqueo + avalúo), Wang (ventana TRID cierra el 19 de mayo), Park (16 días en procesamiento). Wang es la más urgente.',
    income:    'Tres cálculos de ingresos pendientes: Anderson (aplicar — 95% conf), Rodriguez (aplicar — 91%), Chen (marcar — solo 1 año de OT). Todos listos por IA, puedes accionarlos aquí mismo.',
    condition: '7 condiciones abiertas en 3 préstamos. Oben tiene 2 PTF bloqueantes (cierre 12 de junio). Anderson necesita una carta de explicación del acreditado.',
    snooze:    'Los elementos pospuestos reaparecen mañana a primera hora. Los encuentras siempre en la pestaña Listo.',
    default:   'Con gusto reviso cualquier préstamo o categoría. Pregunta qué está bloqueado, préstamos en riesgo o algún acreditado específico.',
  },
  fr: {
    plan:      "Commence par la CD de Wang — date limite TRID le 19 mai, sans marge. Ensuite, traite les 3 calculs de revenus (Anderson, Rodriguez, Chen) — prêts par IA, 30 secondes chacun. L'AUS et le titre peuvent attendre l'après-midi.",
    block:     "Deux blocages importants : les relevés bancaires d'Anderson (elle est active sur le portail maintenant) et la commande d'évaluation de Chen. Tout le reste est actionnable.",
    chen:      "Chen n'a qu'un an d'historique d'heures supplémentaires. Fannie Mae B3-3.1-02 exige 2 ans documentés pour utiliser ce revenu. Avec le salaire de base seul, le DTI est à 43 % — dans la limite de 45 %.",
    risk:      "Trois signalements : Chen (blocage + évaluation), Wang (fenêtre TRID ferme le 19 mai), Park (16 jours en traitement). Wang est la plus urgente.",
    income:    "Trois calculs de revenus en attente : Anderson (appliquer — 95 % conf), Rodriguez (appliquer — 91 %), Chen (signaler — 1 an de HS seulement). Tous prêts IA, tu peux les traiter directement ici.",
    condition: "7 conditions ouvertes sur 3 prêts. Oben a 2 PTF bloquants (clôture le 12 juin). Anderson nécessite une lettre d'explication de l'emprunteur.",
    snooze:    "Les éléments reportés réapparaissent demain matin. Tu les retrouves toujours dans l'onglet Fait.",
    default:   "Je peux creuser n'importe quel prêt ou catégorie. Essaie de demander ce qui est bloqué, les prêts à risque ou un emprunteur spécifique.",
  },
};

// ─── Chat ──────────────────────────────────────────────────────────────────────
function composeReply(q, dialectId = 'en') {
  const t = q.toLowerCase();
  const R = REPLIES[dialectId] || REPLIES.en;
  if (t.includes('plan') || t.includes('day') || t.includes('今天') || t.includes('ਕੀ ਕਰ') || t.includes('ahorita') || t.includes('maintenant')) return R.plan;
  if (t.includes('block') || t.includes('卡') || t.includes('ਰੁਕ') || t.includes('bloque') || t.includes('bloque')) return R.block;
  if (t.includes('chen') || t.includes('flag') || t.includes('ਝੰਡ')) return R.chen;
  if (t.includes('risk') || t.includes('风险') || t.includes('ਜੋਖ਼ਮ') || t.includes('riesgo') || t.includes('risque')) return R.risk;
  if (t.includes('income') || t.includes('batch') || t.includes('收入') || t.includes('ਆਮਦਨ') || t.includes('ingreso') || t.includes('revenu')) return R.income;
  if (t.includes('condition') || t.includes('条件') || t.includes('ਸ਼ਰਤ') || t.includes('condici')) return R.condition;
  if (t.includes('snooze') || t.includes('推迟') || t.includes('ਮੁਲਤ') || t.includes('poster') || t.includes('reporter')) return R.snooze;
  return R.default;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function LoanChip({ loan }) {
  const initials = loan.split(' ').map(w => w[0]).join('').slice(0, 2);
  const colors = { SA: '#A8541C', MO: '#A8541C', JW: '#3A6BAD', DC: '#2A8C53', MJ: '#7B3FA0', ER: '#C25535', TP: '#3A8294', RK: '#7B3FA0' };
  const bg = colors[initials] || '#5246C7';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 7px 2px 4px', background: 'var(--bg-muted)', borderRadius: 999, border: '1px solid var(--border-subtle)', flexShrink: 0 }}>
      <span style={{ width: 15, height: 15, borderRadius: 999, background: bg, color: '#fff', fontSize: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{loan.split(' ')[1]}</span>
    </span>
  );
}

function CategoryChip({ label }) {
  return <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', background: 'var(--bg-muted)', borderRadius: 5, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>{label}</span>;
}

function NavDestChip({ label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', background: '#EEF3FE', borderRadius: 5, color: '#3553CC', border: '1px solid #C5D5F8', whiteSpace: 'nowrap' }}>
      <Icon name="arrowRight" size={9} strokeWidth={2.5}/>
      Opens in {label}
    </span>
  );
}

// AI-resolved card — work is done, LO approves in-place
function AICard({ action, onComplete, onSnooze }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--ai-border)', borderRadius: 11, overflow: 'hidden' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, #8A77FF 0%, #5C49E8 100%)' }}/>
      <div style={{ padding: '12px 14px' }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <LoanChip loan={action.loan}/>
          <CategoryChip label={action.category}/>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', background: 'var(--ai-bg-strong)', borderRadius: 5, color: 'var(--ai-ink)', border: '1px solid var(--ai-border)', whiteSpace: 'nowrap' }}>
            <Icon name="sparkle" size={9} color="var(--ai-primary)" strokeWidth={1.5}/>
            AI Ready
          </span>
          <div style={{ flex: 1 }}/>
          {action.eta && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="clock" size={10}/>{action.eta}</span>}
          <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: 'var(--text-tertiary)' }}>{action.confidence}%</span>
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 5 }}>{action.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{action.why}</div>

        {/* Expandable detail table */}
        {action.detail && (
          <>
            <button onClick={() => setExpanded(e => !e)} style={{ fontSize: 11.5, color: 'var(--ai-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={11}/>
              {expanded ? 'Hide' : 'Show'} breakdown
            </button>
            {expanded && (
              <div style={{ marginTop: 6, background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 7, padding: '9px 11px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {action.detail.map(d => (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{d.label}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: d.value.includes('⚠') ? 'var(--status-amber)' : 'var(--ai-ink)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pre-drafted message preview */}
        {action.preview && (
          <div style={{ marginTop: 8, background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: '8px 10px', fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
            {action.preview}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <button
            className={action.flag ? 'btn btn-outline btn-sm' : 'btn btn-ai btn-sm'}
            style={{ flex: 1, justifyContent: 'center', ...(action.flag ? { color: 'var(--status-amber)', borderColor: 'var(--status-amber)' } : {}) }}
            onClick={() => onComplete(action)}
          >
            <Icon name={action.flag ? 'alertCircle' : 'check'} size={12} strokeWidth={2.2}/>
            {action.cta}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => onSnooze(action)} title="Snooze to tomorrow">
            <Icon name="clock" size={12}/> Snooze
          </button>
        </div>
      </div>
    </div>
  );
}

// Navigate card — LO needs the loan file to complete
function NavCard({ action, onNavigate, onSnooze }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 11, overflow: 'hidden' }}>
      <div style={{ height: 3, background: 'var(--border-default)' }}/>
      <div style={{ padding: '12px 14px' }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <LoanChip loan={action.loan}/>
          <CategoryChip label={action.category}/>
          <NavDestChip label={action.navTabLabel}/>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: 'var(--text-tertiary)' }}>{action.confidence}%</span>
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 5 }}>{action.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{action.why}</div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => onNavigate(action)}
          >
            {action.cta}
            <Icon name="arrowRight" size={12} strokeWidth={2.2}/>
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => onSnooze(action)} title="Snooze to tomorrow">
            <Icon name="clock" size={12}/> Snooze
          </button>
        </div>
      </div>
    </div>
  );
}

function PriorityGroup({ priority, actions, onComplete, onNavigate, onSnooze }) {
  const p = PRIORITY_META[priority];
  if (actions.length === 0) return null;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: p.headerBg, borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 2 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: p.dot, flexShrink: 0 }}/>
        <span style={{ fontSize: 11, fontWeight: 700, color: p.headerText, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.label}</span>
        <div style={{ flex: 1 }}/>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: p.headerText, opacity: 0.7 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Icon name="sparkle" size={9} color={p.headerText} strokeWidth={1.5}/>
            {actions.filter(a => a.type === 'ai').length} AI-ready
          </span>
          <span>·</span>
          <span>{actions.filter(a => a.type === 'nav').length} need loan</span>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 12px' }}>
        {actions.map(a => a.type === 'ai'
          ? <AICard key={a.id} action={a} onComplete={onComplete} onSnooze={onSnooze}/>
          : <NavCard key={a.id} action={a} onNavigate={onNavigate} onSnooze={onSnooze}/>
        )}
      </div>
    </div>
  );
}

function DoneItem({ entry, onUndo, showUndo }) {
  const time = new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 20, height: 20, borderRadius: 999, background: entry.snoozed ? 'var(--card-amber-bg)' : 'var(--card-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon name={entry.snoozed ? 'clock' : 'check'} size={10} color={entry.snoozed ? 'var(--status-amber)' : 'var(--status-green)'} strokeWidth={2.5}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.3 }}>{entry.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
          {entry.loan} · {entry.snoozed ? 'Snoozed to tomorrow' : `Done at ${time}`}
          {entry.navType && <span style={{ marginLeft: 4, color: 'var(--text-tertiary)' }}>· opened in loan</span>}
        </div>
      </div>
      {showUndo && (
        <button onClick={onUndo} className="btn btn-outline btn-sm" style={{ fontSize: 11, height: 24, padding: '0 8px', flexShrink: 0 }}>Undo</button>
      )}
    </div>
  );
}

function composeProcessorReply(q) {
  const t = q.toLowerCase();
  const R = PROCESSOR_REPLIES.en;
  if (t.includes('block') || t.includes('blocking')) return R.block;
  if (t.includes('condition') || t.includes('clear')) return R.condition;
  if (t.includes('doc') || t.includes('expir') || t.includes('missing')) return R.doc;
  if (t.includes('sla') || t.includes('risk') || t.includes('overdue')) return R.sla;
  if (t.includes('validat') || t.includes('income') || t.includes('discrepan')) return R.validate;
  if (t.includes('draft') || t.includes('request') || t.includes('chen')) return R.draft;
  if (t.includes('plan') || t.includes('today') || t.includes('start')) return R.plan;
  if (t.includes('snooze')) return R.snooze;
  return R.default;
}

function ChatBody({ dialectId = 'en', persona = 'LO', contextPrompts, contextNote }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  // Reset conversation when context changes
  const prevContextRef = React.useRef(contextNote);
  React.useEffect(() => {
    if (prevContextRef.current !== contextNote) {
      setMessages([]);
      prevContextRef.current = contextNote;
    }
  }, [contextNote]);
  const scrollRef = React.useRef(null);
  const isProcessor = persona === 'Processor';
  const ui = isProcessor
    ? PROCESSOR_UI_STRINGS.en
    : (UI_STRINGS[dialectId] || UI_STRINGS.en);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages.length]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }, { role: 'ai', text: '…' }]);
    setInput('');
    setTimeout(() => setMessages(prev => [...prev.slice(0, -1), { role: 'ai', text: isProcessor ? composeProcessorReply(text) : composeReply(text, dialectId) }]), 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.length === 0 ? (
          <>
            {contextNote && (
              <div style={{ fontSize: 12, color: 'var(--ai-ink)', background: 'var(--ai-bg)', border: '1px solid var(--ai-border)', borderRadius: 8, padding: '8px 11px', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 7, lineHeight: 1.5 }}>
                <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
                {contextNote}
              </div>
            )}
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Try asking</div>
            {(contextPrompts || ui.prompts).map(p => (
              <button key={p} onClick={() => send(p)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12.5, color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ai-bg)'; e.currentTarget.style.borderColor = 'var(--ai-border)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <Icon name="sparkle" size={11} color="var(--ai-primary)" strokeWidth={1.6}/>{p}
              </button>
            ))}
          </>
        ) : messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '88%', padding: '7px 11px', background: m.role === 'user' ? 'var(--text-primary)' : 'var(--ai-bg)', color: m.role === 'user' ? '#fff' : 'var(--ai-ink)', borderRadius: m.role === 'user' ? '11px 11px 4px 11px' : '11px 11px 11px 4px', fontSize: 12.5, lineHeight: 1.45, border: m.role === 'user' ? 'none' : '1px solid var(--ai-border)' }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px 8px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-muted)' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(input); }} placeholder={ui.placeholder}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', height: 30, fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)' }}/>
        <button onClick={() => send(input)} disabled={!input.trim()} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: input.trim() ? 'var(--ai-primary)' : 'var(--border-default)', color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrowRight" size={12} strokeWidth={2.4}/>
        </button>
      </div>
    </div>
  );
}

// ─── Context presets ───────────────────────────────────────────────────────────
const LOAN_META_BRIEF = {
  'LN-2024-0234': { name: 'Sarah Anderson', status: 'Underwriting', closing: 'Jun 30', risk: 'medium' },
  'LN-2024-0211': { name: 'Jennifer Wang',  status: 'Closing',      closing: 'May 22', risk: 'urgent' },
  'LN-2024-0245': { name: 'Michael Oben',   status: 'Approval',     closing: 'Jun 12', risk: 'high'   },
  'LN-2024-0189': { name: 'David Chen',     status: 'Underwriting', closing: 'Jun 18', risk: 'high'   },
  'LN-2024-0289': { name: 'Rachel Kim',     status: 'Approval',     closing: 'Jun 15', risk: 'medium' },
  'LN-2024-0301': { name: 'Emily Rodriguez',status: 'Processing',   closing: 'Jul 2',  risk: 'medium' },
  'LN-2024-0312': { name: 'Thomas Park',    status: 'Processing',   closing: 'Jul 8',  risk: 'medium' },
  'LN-2024-0267': { name: 'Marcus Johnson', status: 'Application',  closing: '—',      risk: 'medium' },
};

function getCtxConfig(ctx, actions, dialectId) {
  const route  = ctx?.route   || 'home';
  const loanId = ctx?.loanId  || null;
  const loanTab= ctx?.loanTab || null;
  const loan   = loanId ? LOAN_META_BRIEF[loanId] : null;

  if (route === 'loan' && loan) {
    const loanActions = actions.filter(a => a.loanId === loanId);
    return {
      mode: 'loan',
      label: loan.name,
      sublabel: `${loan.status} · Closing ${loan.closing}`,
      accentColor: { urgent: '#D74C3C', high: '#E0A23A', medium: '#5C7CFA' }[loan.risk] || '#5C7CFA',
      filteredActions: loanActions,
      contextNote: loanActions.length > 0
        ? `${loanActions.length} item${loanActions.length > 1 ? 's' : ''} for this loan`
        : 'No pending items for this loan',
      prompts: [
        `What's the next step for ${loan.name.split(' ')[1]}?`,
        'What conditions are still open?',
        'Draft a status update to the borrower',
        'Any rate lock risks on this file?',
        'What docs are still missing?',
      ],
      chatContext: `You're coaching on ${loan.name}'s loan (${loanId}) — ${loan.status} stage, closing ${loan.closing}.`,
    };
  }

  if (route === 'pipeline') {
    const urgentActions = actions.filter(a => a.priority === 'urgent');
    return {
      mode: 'pipeline',
      label: 'Pipeline',
      sublabel: '9 active loans · 3 need attention',
      accentColor: '#5C7CFA',
      filteredActions: actions,
      contextNote: urgentActions.length > 0
        ? `${urgentActions.length} urgent across pipeline`
        : 'Pipeline looks healthy today',
      prompts: [
        'Which loans are most at risk today?',
        'What can I do without opening a loan?',
        'Who has a lock expiring this week?',
        'Which loans are stuck in stage?',
        'What income calcs are ready to run?',
      ],
      chatContext: "You're coaching across the full pipeline.",
    };
  }

  // Home (default)
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return {
    mode: 'home',
    label: greeting,
    sublabel: 'Here\'s your day at a glance',
    accentColor: '#8A77FF',
    filteredActions: actions.filter(a => a.priority === 'urgent' || a.priority === 'high'),
    contextNote: `${actions.filter(a => a.priority === 'urgent').length} urgent · ${actions.filter(a => a.type === 'ai').length} AI-ready`,
    prompts: [
      'What should I start with this morning?',
      'Which loans need my attention today?',
      'What can AI handle for me right now?',
      'Any TRID or lock deadlines today?',
      'Give me a full pipeline summary',
    ],
    chatContext: "You're on the home dashboard. Give a morning briefing.",
  };
}

// Context banner shown in the panel header
function ContextBadge({ mode, label, sublabel, accentColor }) {
  const icons = { home: 'home', pipeline: 'listCheck', loan: 'doc' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 2, marginBottom: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: 5, background: accentColor + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icons[mode] || 'sparkle'} size={11} color={accentColor} strokeWidth={1.8}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{label}</span>
        {sublabel && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginLeft: 6 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

// ─── Main panel ────────────────────────────────────────────────────────────────
export function AIAssistantPanel({ ctx, onClose, onOpenLoan, persona = 'LO' }) {
  const [store, setStore] = React.useState(loadStore);
  const [tab, setTab] = React.useState('queue');
  const [recentUndo, setRecentUndo] = React.useState(null);
  const [minimized, setMinimized] = React.useState(false);
  const [dialectId, setDialectId] = React.useState(() => localStorage.getItem('los-dialect') || 'en');
  const [dialectOpen, setDialectOpen] = React.useState(false);

  const setDialect = (id) => { setDialectId(id); localStorage.setItem('los-dialect', id); setDialectOpen(false); };
  const currentDialect = DIALECTS.find(d => d.id === dialectId) || DIALECTS[0];

  const persist = (next) => { setStore(next); saveStore(next); };

  const ACTION_SOURCE = persona === 'Processor' ? ALL_ACTIONS_PROCESSOR : ALL_ACTIONS;

  const allPending = React.useMemo(() => {
    const done = new Set(Object.keys(store.completed));
    const snoozed = new Set(Object.keys(store.snoozed));
    return ACTION_SOURCE.filter(a => !done.has(a.id) && !snoozed.has(a.id));
  }, [store, persona]);

  const ctxConfig = React.useMemo(() => getCtxConfig(ctx, allPending, dialectId), [ctx, allPending, dialectId]);
  const pendingIds = ctxConfig.filteredActions;

  const completedEntries = React.useMemo(() => {
    return [
      ...Object.entries(store.completed).map(([id, v]) => ({ id, ...v })),
      ...Object.entries(store.snoozed).map(([id, v]) => ({ id, ...v, snoozed: true })),
    ].sort((a, b) => (b.at || 0) - (a.at || 0));
  }, [store]);

  const markDone = (action, extra = {}) => {
    const next = { ...store, completed: { ...store.completed, [action.id]: { at: Date.now(), title: action.title, loan: action.loan, ...extra } } };
    persist(next);
    if (recentUndo?.timer) clearTimeout(recentUndo.timer);
    const timer = setTimeout(() => setRecentUndo(null), 10000);
    setRecentUndo({ id: action.id, timer });
  };

  const handleComplete = (action) => { markDone(action); };

  const handleNavigate = (action) => {
    markDone(action, { navType: true });
    if (onOpenLoan) onOpenLoan(action.loanId, action.navTab);
  };

  const handleSnooze = (action) => {
    const next = { ...store, snoozed: { ...store.snoozed, [action.id]: { at: Date.now(), title: action.title, loan: action.loan } } };
    persist(next);
  };

  const handleUndo = (id) => {
    const next = { ...store };
    delete next.completed[id];
    delete next.snoozed[id];
    persist(next);
    if (recentUndo?.timer) clearTimeout(recentUndo.timer);
    setRecentUndo(null);
  };

  const urgentCount = pendingIds.filter(a => a.priority === 'urgent').length;
  const aiReadyCount = pendingIds.filter(a => a.type === 'ai').length;
  const doneCount = Object.keys(store.completed).length + Object.keys(store.snoozed).length;
  const pct = Math.round((doneCount / ALL_ACTIONS.length) * 100);
  const ui = persona === 'Processor'
    ? PROCESSOR_UI_STRINGS.en
    : (UI_STRINGS[dialectId] || UI_STRINGS.en);

  if (minimized) {
    return (
      <div style={{ position: 'fixed', bottom: 56, right: 20, zIndex: 60 }}>
        <button onClick={() => setMinimized(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px 0 10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #0E1124 0%, #1A1A45 100%)', color: '#fff', borderRadius: 999, boxShadow: '0 12px 28px -8px rgba(74,57,201,0.45)', fontFamily: 'inherit' }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #8A77FF 0%, #5C49E8 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="sparkle" size={12} color="#fff" strokeWidth={1.6}/>
          </span>
          {urgentCount > 0
            ? <><span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>Urgent:</span><span style={{ fontSize: 12.5, fontWeight: 600 }}>{urgentCount} item{urgentCount > 1 ? 's' : ''}</span><span style={{ background: '#D74C3C', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 999 }}>{urgentCount}</span></>
            : <span style={{ fontSize: 12.5, fontWeight: 600 }}>{doneCount} / {ALL_ACTIONS.length} done</span>
          }
          <Icon name="chevronUp" size={12} color="rgba(255,255,255,0.7)"/>
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 56, right: 20, zIndex: 60, width: 384 }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, boxShadow: '0 24px 48px -16px rgba(15,17,21,0.22), 0 4px 16px rgba(15,17,21,0.08)', display: 'flex', flexDirection: 'column', maxHeight: '78vh', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0E1124 0%, #1A1A45 100%)', color: '#fff', padding: '12px 14px 0', borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #8A77FF 0%, #5C49E8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="sparkle" size={13} color="#fff" strokeWidth={1.6}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{ui.coach}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>


            {/* Dialect picker */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDialectOpen(o => !o)} style={{ ...hBtn, gap: 4, width: 'auto', padding: '0 8px', fontSize: 12 }}>
                <span>{currentDialect.flag}</span>
                <Icon name="chevronDown" size={10} color="rgba(255,255,255,0.6)"/>
              </button>
              {dialectOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 400, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 5, width: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
                  onMouseLeave={() => setDialectOpen(false)}>
                  {DIALECTS.map(d => (
                    <button key={d.id} onClick={() => setDialect(d.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 10px', border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, background: dialectId === d.id ? 'var(--bg-muted)' : 'transparent', color: 'var(--text-primary)', textAlign: 'left' }}
                      onMouseEnter={e => { if (dialectId !== d.id) e.currentTarget.style.background = 'var(--bg-muted)'; }}
                      onMouseLeave={e => { if (dialectId !== d.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 16 }}>{d.flag}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12.5 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{d.label}</div>
                      </div>
                      {dialectId === d.id && <Icon name="check" size={12} color="var(--ai-primary)" strokeWidth={2.5} style={{ marginLeft: 'auto' }}/>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setMinimized(true)} style={hBtn}><Icon name="chevronDown" size={13}/></button>
            <button onClick={onClose} style={hBtn}><Icon name="x" size={13}/></button>
          </div>

          {/* Context badge */}
          <ContextBadge mode={ctxConfig.mode} label={ctxConfig.label} sublabel={ctxConfig.sublabel} accentColor={ctxConfig.accentColor}/>

          {/* Progress */}
          <div style={{ marginBottom: 10, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
                {ctxConfig.contextNote}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {aiReadyCount > 0 && (
                  <span style={{ fontSize: 11, color: '#B8AEFF', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Icon name="sparkle" size={10} color="#B8AEFF" strokeWidth={1.5}/>{aiReadyCount} AI-ready
                  </span>
                )}
                {urgentCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#FFAA88', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#D74C3C' }}/>{urgentCount} urgent
                  </span>
                )}
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${ctxConfig.accentColor} 0%, #5C49E8 100%)`, borderRadius: 999, transition: 'width 0.4s ease-out' }}/>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[{ id: 'ask', label: ui.ask }, { id: 'queue', label: ui.queue, badge: pendingIds.length }, { id: 'done', label: ui.done, badge: doneCount }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, height: 34, border: 'none', cursor: 'pointer', background: tab === t.id ? 'var(--bg-surface)' : 'transparent', color: tab === t.id ? 'var(--text-primary)' : 'rgba(255,255,255,0.5)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, borderRadius: '7px 7px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background 0.12s' }}>
                {t.label}
                {t.badge > 0 && <span style={{ fontSize: 10.5, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 999, background: tab === t.id ? (t.id === 'queue' && urgentCount > 0 ? '#D74C3C' : 'var(--bg-muted)') : 'rgba(255,255,255,0.15)', color: tab === t.id ? (t.id === 'queue' && urgentCount > 0 ? '#fff' : 'var(--text-secondary)') : 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {tab === 'queue' && (
            pendingIds.length === 0
              ? <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 999, background: 'var(--card-green-bg)', color: 'var(--status-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Icon name="check" size={20} strokeWidth={2.2}/></div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{ui.clear}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{ui.clearSub}</div>
                </div>
              : ['urgent', 'high', 'medium'].map(priority => (
                  <PriorityGroup key={priority} priority={priority} actions={pendingIds.filter(a => a.priority === priority)} onComplete={handleComplete} onNavigate={handleNavigate} onSnooze={handleSnooze}/>
                ))
          )}

          {tab === 'done' && (
            completedEntries.length === 0
              ? <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>Nothing actioned yet today.</div>
              : <div>
                  <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today · {completedEntries.length} actioned</div>
                  {completedEntries.map(e => <DoneItem key={e.id} entry={e} showUndo={recentUndo?.id === e.id} onUndo={() => handleUndo(e.id)}/>)}
                </div>
          )}

          {tab === 'ask' && <ChatBody dialectId={dialectId} persona={persona} contextPrompts={ctxConfig.prompts} contextNote={ctxConfig.chatContext}/>}
        </div>
      </div>
    </div>
  );
}

const hBtn = { width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

export default AIAssistantPanel;
