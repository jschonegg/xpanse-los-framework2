import React from 'react';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Shell';
import { TASKS, TASK_COUNTS, TASK_TYPES, TASK_TYPE_ORDER } from '../data/tasks';

// ── Shared bits ─────────────────────────────────────────────────────────────
function fmtAmount(n) {
  if (n == null) return null;
  return `$${(n / 1000).toFixed(0)}K`;
}

function ActionChip({ icon, label, size = 'md' }) {
  const small = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '2px 7px' : '3px 9px',
      border: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      borderRadius: 6,
      fontSize: small ? 11 : 11.5, fontWeight: 500,
      color: 'var(--text-secondary)', whiteSpace: 'nowrap',
    }}>
      <Icon name={icon} size={small ? 10 : 11} color="var(--text-secondary)"/>
      {label}
    </span>
  );
}

function DueTag({ due, size = 'md' }) {
  const small = size === 'sm';
  const tone = due.tone;
  const color = tone === 'red' ? 'var(--status-red)' : tone === 'amber' ? 'var(--status-amber)' : 'var(--text-tertiary)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: small ? 11 : 11.5, fontWeight: 500, color, whiteSpace: 'nowrap',
    }}>
      <Icon name="clock" size={small ? 10 : 11} color={color}/>
      {due.display}
    </span>
  );
}

// ── KPI mini-card (Tasks-specific) ─────────────────────────────────────────
function TaskKpi({ icon, iconColor, label, value }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)', borderRadius: 10,
      padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name={icon} size={13} color={iconColor}/>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: iconColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

// ── Compact quick-action CTA shown inline on each task row ──────────────────
function RowCta({ cta, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 30, padding: '0 12px', borderRadius: 7, flexShrink: 0,
        border: '1px solid', borderColor: hover ? 'var(--text-primary)' : 'var(--border-default)',
        background: hover ? 'var(--text-primary)' : 'var(--bg-surface)',
        color: hover ? '#fff' : 'var(--text-primary)',
        fontFamily: 'inherit', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <Icon name={cta.icon} size={12}/> {cta.label}
    </button>
  );
}

// ── Task row (full list) ───────────────────────────────────────────────────
function TaskRow({ task, selected, onSelect, checked, onToggle, onAction }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onSelect(task.id)}
      style={{
        position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px 14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        background: selected ? 'var(--bg-muted)' : hover ? 'rgba(0,0,0,0.015)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      {/* Selected indicator */}
      {selected && (
        <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 999, background: 'var(--text-primary)' }}/>
      )}

      <input
        type="checkbox" checked={checked} onChange={() => onToggle(task.id)}
        onClick={e => e.stopPropagation()}
        aria-label={`Mark complete: ${task.title}`}
        style={{ marginTop: 4, accentColor: '#0E1014', flexShrink: 0 }}
      />

      <Avatar initials={task.borrower.initials} size={30} color={task.borrower.avatarColor}/>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{task.borrower.name}</span>
          {task.borrower.loanId && <><span>·</span><span style={{ fontFamily: 'DM Mono', fontSize: 11.5 }}>{task.borrower.loanId}</span></>}
          {task.borrower.amount && <><span>·</span><span style={{ fontWeight: 500 }}>{fmtAmount(task.borrower.amount)}</span></>}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.45 }}>
          {task.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <ActionChip icon={task.action.icon} label={task.action.label}/>
          <DueTag due={task.due}/>
          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Last: {task.lastTouch}</span>
        </div>
      </div>

      {/* Inline quick-action CTA + chevron */}
      <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <RowCta
          cta={task.primaryCta}
          onClick={(e) => { e.stopPropagation(); onAction && onAction(task); }}
        />
        <div style={{ color: 'var(--text-tertiary)', opacity: selected || hover ? 1 : 0, transition: 'opacity 0.12s' }}>
          <Icon name="chevronRight" size={14}/>
        </div>
      </div>
    </div>
  );
}

// ── Section header when the list is grouped by task type ────────────────────
function TypeGroupHeader({ type, count }) {
  const def = TASK_TYPES[type];
  if (!def) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 16px',
      background: 'var(--bg-muted)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: def.color + '1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={def.icon} size={12} color={def.color}/>
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{def.label}</span>
      <span style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 999, padding: '0 7px', lineHeight: '17px',
      }}>{count}</span>
    </div>
  );
}

// ── Task detail panel ──────────────────────────────────────────────────────
function MetaRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 13, color: valueColor || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function TaskDetail({ task, onOpenLoan }) {
  if (!task) return null;
  const isRed = task.due.tone === 'red';
  return (
    <div style={{
      background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border-subtle)',
      padding: '18px 20px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 8 }}>
        <ActionChip icon={task.action.icon} label={task.action.label}/>
      </div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{task.title}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 16 }}>
        <Avatar initials={task.borrower.initials} size={32} color={task.borrower.avatarColor}/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{task.borrower.name}</span>
          {task.borrower.loanId && (
            <span style={{ fontFamily: 'DM Mono', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{task.borrower.loanId}</span>
          )}
        </div>
      </div>

      <div>
        <MetaRow label="Due"        value={task.due.display}           valueColor={isRed ? 'var(--status-red)' : task.due.tone === 'amber' ? 'var(--status-amber)' : 'var(--text-primary)'}/>
        <MetaRow label="Loan"       value={task.borrower.loanId ? `${fmtAmount(task.borrower.amount)} · ${task.borrower.product}` : task.borrower.product}/>
        <MetaRow label="Channel"    value={task.channel}/>
        <MetaRow label="Last touch" value={task.lastTouch}/>
        <MetaRow label="Source"     value={task.source}/>
      </div>

      {/* Suggested script (AI lavender block) */}
      <div style={{
        marginTop: 16, padding: '12px 14px',
        background: 'var(--ai-bg, #F4F1FE)', border: '1px solid var(--ai-border, #E4DEFA)', borderRadius: 8,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: 'rgba(110, 89, 232, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkle" size={12} color="var(--ai-primary, #6E59E8)"/>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ai-ink, #3F2FBF)', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>Suggested script: </span>
          {task.suggestedScript}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button style={{
          flex: 1, height: 38, border: 'none', borderRadius: 8,
          background: 'var(--text-primary)', color: '#fff',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <Icon name={task.primaryCta.icon} size={13}/> {task.primaryCta.label}
        </button>
        {task.borrower.loanId && (
          <button
            // Coming from a task → open the loan on the page relevant to this
            // task (e.g. Documents, Pricing). Falls back to Tasks if unmapped.
            onClick={() => onOpenLoan && onOpenLoan(task.borrower.loanId, task.loanTab || 'now')}
            style={{
              flex: 1, height: 38, borderRadius: 8,
              border: '1px solid var(--border-default)', background: 'var(--bg-surface)',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
            <Icon name="arrowRight" size={13}/> Open loan
          </button>
        )}
      </div>

      <button style={{
        marginTop: 12, alignSelf: 'center', background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 12.5, color: 'var(--text-tertiary)', padding: 4,
      }}>
        Snooze 1 day
      </button>
    </div>
  );
}

// ── Tab filter logic ───────────────────────────────────────────────────────
const TASK_TABS = [
  { id: 'all',      label: 'All',      filter: () => true },
  { id: 'today',    label: 'Today',    filter: t => t.due.category === 'today' || t.due.category === 'overdue' },
  { id: 'overdue',  label: 'Overdue',  filter: t => t.due.category === 'overdue' },
  { id: 'upcoming', label: 'Upcoming', filter: t => t.due.category === 'upcoming' },
];

// ── Full Tasks view ────────────────────────────────────────────────────────
export function TasksView({ onOpenLoan }) {
  const [tab, setTab] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(TASKS[0].id);
  const [checked, setChecked] = React.useState(new Set());
  const [groupByType, setGroupByType] = React.useState(true);

  const toggleChecked = (id) => {
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    setChecked(next);
  };

  const tabDef = TASK_TABS.find(t => t.id === tab) || TASK_TABS[0];
  const filtered = TASKS.filter(tabDef.filter);
  const selected = filtered.find(t => t.id === selectedId) || filtered[0];

  // The inline CTA focuses the task so its full action surface opens in the
  // detail panel (no backend wired in this prototype).
  const handleAction = (task) => setSelectedId(task.id);

  // Group the filtered rows by type, preserving the canonical type order.
  const groups = TASK_TYPE_ORDER
    .map(type => ({ type, tasks: filtered.filter(t => t.type === type) }))
    .filter(g => g.tasks.length > 0);

  const renderRow = (task) => (
    <TaskRow key={task.id} task={task}
      selected={selected && selected.id === task.id}
      onSelect={setSelectedId}
      checked={checked.has(task.id)}
      onToggle={toggleChecked}
      onAction={handleAction}
    />
  );

  return (
    <>
      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <TaskKpi icon="clock"        iconColor="#C97A1B"             label="Due today"     value={TASK_COUNTS.dueToday}/>
        <TaskKpi icon="alertOctagon" iconColor="var(--status-red)"   label="Overdue"       value={TASK_COUNTS.overdue}/>
        <TaskKpi icon="arrowRight"   iconColor="#3A6BAD"             label="This week"     value={TASK_COUNTS.thisWeek}/>
        <TaskKpi icon="checkCircle"  iconColor="#3DB371"             label="Completed (7d)" value={TASK_COUNTS.completed7d}/>
      </div>

      {/* Tab row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        marginBottom: 12,
      }}>
        {TASK_TABS.map(t => {
          const count = TASKS.filter(t.filter).length;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 7,
              border: '1px solid', borderColor: active ? 'var(--border-default)' : 'transparent',
              background: active ? 'var(--bg-surface)' : 'transparent',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              transition: 'all 0.12s',
            }}>
              {t.label}
              <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--text-tertiary)' : 'var(--text-tertiary)' }}>{count}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>

        {/* Group-by-type toggle */}
        <div role="group" aria-label="Group tasks" style={{
          display: 'inline-flex', alignItems: 'center', background: 'var(--bg-muted)',
          borderRadius: 7, padding: 2, gap: 1,
        }}>
          {[
            { id: false, label: 'List', icon: 'listCheck' },
            { id: true,  label: 'By type', icon: 'sliders' },
          ].map(opt => {
            const active = groupByType === opt.id;
            return (
              <button key={String(opt.id)} onClick={() => setGroupByType(opt.id)}
                aria-pressed={active}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: active ? 600 : 500,
                  borderRadius: 5,
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.12s',
                }}>
                <Icon name={opt.icon} size={12} color={active ? 'var(--text-primary)' : 'var(--text-tertiary)'}/>
                {opt.label}
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>No tasks in this view.</div>
          ) : groupByType ? (
            groups.map(g => (
              <div key={g.type}>
                <TypeGroupHeader type={g.type} count={g.tasks.length}/>
                {g.tasks.map(renderRow)}
              </div>
            ))
          ) : (
            filtered.map(renderRow)
          )}
        </div>

        <div style={{ position: 'sticky', top: 16 }}>
          <TaskDetail task={selected} onOpenLoan={onOpenLoan}/>
        </div>
      </div>
    </>
  );
}

// ── Compact sidebar for Hybrid mode ────────────────────────────────────────
export function TasksSidebar({ onOpenLoan }) {
  const [tab, setTab] = React.useState('today');
  const [checked, setChecked] = React.useState(new Set());
  const toggleChecked = (id) => {
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    setChecked(next);
  };
  const tabDef = TASK_TABS.find(t => t.id === tab) || TASK_TABS[0];
  const filtered = TASKS.filter(tabDef.filter).slice(0, 4);

  return (
    <aside style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Icon name="listCheck" size={14} color="var(--text-secondary)"/>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>My tasks</span>
          <div style={{ flex: 1 }}/>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
          }}>
            <Icon name="plus" size={11} strokeWidth={2.2}/> New
          </button>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
          {TASK_COUNTS.dueToday} due today · {TASK_COUNTS.overdue} overdue
        </div>
      </div>

      {/* Mini tabs */}
      <div style={{ display: 'flex', gap: 2, padding: '0 12px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        {[{ id: 'today', label: 'Today' }, { id: 'overdue', label: 'Overdue' }, { id: 'upcoming', label: 'Upcoming' }, { id: 'all', label: 'All' }].map(t => {
          const def = TASK_TABS.find(x => x.id === t.id);
          const count = TASKS.filter(def.filter).length;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 8px', borderRadius: 5,
              border: 'none', background: active ? 'var(--bg-muted)' : 'transparent',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 11.5, fontWeight: active ? 600 : 500,
              color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
              transition: 'background 0.12s',
            }}>
              {t.label}
              <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Compact task list */}
      <div>
        {filtered.map(task => {
          const isOverdue = task.due.category === 'overdue';
          return (
            <div key={task.id} style={{
              position: 'relative', display: 'flex', gap: 10,
              padding: '12px 14px 12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              {isOverdue && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 999, background: 'var(--status-red)' }}/>}
              <input type="checkbox" checked={checked.has(task.id)} onChange={() => toggleChecked(task.id)}
                aria-label={`Mark complete: ${task.title}`}
                style={{ marginTop: 3, accentColor: '#0E1014', flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>{task.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>
                  <Avatar initials={task.borrower.initials} size={16} color={task.borrower.avatarColor}/>
                  <span style={{ color: 'var(--text-secondary)' }}>{task.borrower.name}</span>
                  {task.borrower.loanId && <><span>·</span><span style={{ fontFamily: 'DM Mono', fontSize: 10.5 }}>{task.borrower.loanId}</span></>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <ActionChip icon={task.action.icon} label={task.action.label} size="sm"/>
                  <DueTag due={task.due} size="sm"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(0,0,0,0.01)',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{filtered.length} of {TASKS.length} tasks</span>
        <div style={{ flex: 1 }}/>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, color: 'var(--text-secondary)',
        }}>
          Open task center <Icon name="arrowRight" size={11}/>
        </button>
      </div>
    </aside>
  );
}

export default TasksView;
