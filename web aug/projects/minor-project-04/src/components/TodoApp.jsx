import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, Pencil, Plus, Trash2, X } from 'lucide-react';

const readTasks = () => {
  try { return JSON.parse(localStorage.getItem('daybook-tasks')) || []; } catch { return []; }
};

export default function TodoApp() {
  const [tasks, setTasks] = useState(readTasks);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { localStorage.setItem('daybook-tasks', JSON.stringify(tasks)); }, [tasks]);

  const visibleTasks = useMemo(() => tasks.filter(task => filter === 'All' || (filter === 'Completed' ? task.done : !task.done)), [tasks, filter]);
  const completed = tasks.filter(task => task.done).length;

  function submitTask(event) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;
    if (editingId) {
      setTasks(current => current.map(task => task.id === editingId ? { ...task, title: cleanText, dueDate } : task));
      setEditingId(null);
    } else {
      setTasks(current => [{ id: crypto.randomUUID(), title: cleanText, dueDate, done: false, createdAt: Date.now() }, ...current]);
    }
    setText('');
    setDueDate('');
  }

  function editTask(task) {
    setText(task.title);
    setDueDate(task.dueDate || '');
    setEditingId(task.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setText('');
    setDueDate('');
  }

  return (
    <div className="content-wrap">
      <div className="page-heading"><div><p className="eyebrow">A FRESH START, EVERY DAY</p><h1>Make room for <em>what matters.</em></h1><p className="subheading">A few small steps can make a good day.</p></div><div className="heading-art">☀</div></div>
      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon peach">◷</span><div><strong>{tasks.length}</strong><small>Total tasks</small></div></div>
        <div className="stat-card"><span className="stat-icon green">✓</span><div><strong>{completed}</strong><small>Completed</small></div></div>
        <div className="stat-card"><span className="stat-icon lavender">✦</span><div><strong>{tasks.length - completed}</strong><small>Still to do</small></div></div>
      </div>
      <section className="panel task-panel">
        <div className="section-heading"><div><h2>Today's tasks</h2><p>Keep it simple. One thing at a time.</p></div><span className="count-pill">{tasks.length - completed} left</span></div>
        <form className="task-form" onSubmit={submitTask}>
          <input aria-label="Task name" value={text} onChange={event => setText(event.target.value)} placeholder="What would you like to get done?" />
          <input className="date-input" aria-label="Due date" type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} />
          <button className="primary-button" type="submit">{editingId ? <Check size={17} /> : <Plus size={17} />}{editingId ? 'Save' : 'Add task'}</button>
          {editingId && <button className="icon-button cancel-button" type="button" aria-label="Cancel edit" onClick={cancelEdit}><X size={17} /></button>}
        </form>
        <div className="filter-row">{['All', 'Pending', 'Completed'].map(option => <button key={option} className={`filter-button ${filter === option ? 'selected' : ''}`} onClick={() => setFilter(option)}>{option}</button>)}</div>
        <div className="task-list">
          {visibleTasks.map(task => <article className={`task-item ${task.done ? 'is-done' : ''}`} key={task.id}>
            <button className={`check-button ${task.done ? 'checked' : ''}`} aria-label={task.done ? 'Mark pending' : 'Mark completed'} onClick={() => setTasks(current => current.map(item => item.id === task.id ? { ...item, done: !item.done } : item))}>{task.done ? <Check size={15} /> : <Circle size={18} />}</button>
            <div className="task-copy"><span className="task-title">{task.title}</span>{task.dueDate && <span className="task-due">Due {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}</div>
            <span className={`status ${task.done ? 'status-done' : 'status-pending'}`}>{task.done ? 'Completed' : 'Pending'}</span>
            <button className="icon-button" aria-label="Edit task" onClick={() => editTask(task)}><Pencil size={16} /></button>
            <button className="icon-button delete-button" aria-label="Delete task" onClick={() => setTasks(current => current.filter(item => item.id !== task.id))}><Trash2 size={16} /></button>
          </article>)}
          {visibleTasks.length === 0 && <div className="empty-state"><span>✿</span><strong>{tasks.length ? 'Nothing in this list' : 'A little space to begin'}</strong><p>{tasks.length ? 'Try another filter or add a new task.' : 'Add your first task above and take it from there.'}</p></div>}
        </div>
      </section>
    </div>
  );
}
