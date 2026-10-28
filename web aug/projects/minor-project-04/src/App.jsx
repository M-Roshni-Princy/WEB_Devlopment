import { useState } from 'react';
import { CheckSquare, NotebookPen, Sparkles } from 'lucide-react';
import TodoApp from './components/TodoApp.jsx';
import NotesApp from './components/NotesApp.jsx';

export default function App() {
  const [page, setPage] = useState('tasks');

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => setPage('tasks')}>
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>daybook<small>your little space</small></span>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <button className={`nav-item ${page === 'tasks' ? 'active' : ''}`} onClick={() => setPage('tasks')}><CheckSquare size={18} /> My tasks</button>
        <button className={`nav-item ${page === 'notes' ? 'active' : ''}`} onClick={() => setPage('notes')}><NotebookPen size={18} /> My notes</button>
        <div className="sidebar-bottom"><div className="tiny-flower">✳</div><p>A calmer way to<br />get things done.</p></div>
      </aside>
      <section className="main-panel">
        <header className="topbar"><span className="date-label">YOUR PERSONAL SPACE</span><span className="avatar">D</span></header>
        {page === 'tasks' ? <TodoApp /> : <NotesApp />}
        <footer className="footer">Made for your everyday thoughts <span>✦</span></footer>
      </section>
    </main>
  );
}
