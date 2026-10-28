import { useEffect, useMemo, useState } from 'react';
import { FilePlus2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';

const categories = ['Personal', 'College', 'Ideas', 'Work'];
const readNotes = () => {
  try { return JSON.parse(localStorage.getItem('daybook-notes')) || []; } catch { return []; }
};

export default function NotesApp() {
  const [notes, setNotes] = useState(readNotes);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Personal');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => { localStorage.setItem('daybook-notes', JSON.stringify(notes)); }, [notes]);

  const filteredNotes = useMemo(() => notes.filter(note => (activeCategory === 'All' || note.category === activeCategory) && `${note.title} ${note.body}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt), [notes, activeCategory, search]);

  function resetForm() {
    setTitle(''); setBody(''); setCategory('Personal'); setEditingId(null); setFormOpen(false);
  }

  function saveNote(event) {
    event.preventDefault();
    if (!title.trim() && !body.trim()) return;
    const now = Date.now();
    if (editingId) {
      setNotes(current => current.map(note => note.id === editingId ? { ...note, title: title.trim() || 'Untitled note', body: body.trim(), category, updatedAt: now } : note));
    } else {
      setNotes(current => [{ id: crypto.randomUUID(), title: title.trim() || 'Untitled note', body: body.trim(), category, createdAt: now, updatedAt: now }, ...current]);
    }
    resetForm();
  }

  function editNote(note) {
    setTitle(note.title); setBody(note.body); setCategory(note.category); setEditingId(note.id); setFormOpen(true);
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="content-wrap notes-content">
      <div className="page-heading"><div><p className="eyebrow">SAVE A THOUGHT FOR LATER</p><h1>Your mind, on <em>paper.</em></h1><p className="subheading">Little reminders, big ideas, and everything between.</p></div><div className="heading-art note-art">✎</div></div>
      <div className="notes-toolbar"><label className="search-box"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your notes..." aria-label="Search notes" /></label><button className="primary-button" onClick={() => { resetForm(); setFormOpen(true); }}><Plus size={17} /> New note</button></div>
      <div className="category-row">{['All', ...categories].map(item => <button key={item} className={`filter-button ${activeCategory === item ? 'selected' : ''}`} onClick={() => setActiveCategory(item)}>{item}</button>)}</div>
      {formOpen && <section className="panel note-editor"><div className="section-heading"><div><h2>{editingId ? 'Edit your note' : 'A new note'}</h2><p>Get it out of your head and down here.</p></div><button className="icon-button" onClick={resetForm} aria-label="Close note editor"><X size={18} /></button></div><form onSubmit={saveNote} className="note-form"><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Give your note a title" aria-label="Note title" /><select value={category} onChange={event => setCategory(event.target.value)} aria-label="Note category">{categories.map(item => <option key={item}>{item}</option>)}</select><textarea value={body} onChange={event => setBody(event.target.value)} placeholder="Start writing..." rows="5" aria-label="Note content" /><div className="editor-actions"><button type="button" className="secondary-button" onClick={resetForm}>Cancel</button><button type="submit" className="primary-button"><FilePlus2 size={16} /> Save note</button></div></form></section>}
      <div className="notes-grid">
        {filteredNotes.map((note, index) => <article className={`note-card note-color-${index % 4}`} key={note.id}><div className="note-card-top"><span className="note-category">{note.category}</span><div className="note-actions"><button className="icon-button" aria-label="Edit note" onClick={() => editNote(note)}><Pencil size={15} /></button><button className="icon-button delete-button" aria-label="Delete note" onClick={() => setNotes(current => current.filter(item => item.id !== note.id))}><Trash2 size={15} /></button></div></div><h3>{note.title}</h3><p className="note-body">{note.body || 'No extra details.'}</p><div className="note-date">Updated {formatDate(note.updatedAt)}</div></article>)}
        {filteredNotes.length === 0 && <div className="empty-state notes-empty"><span>✿</span><strong>{search ? 'No notes found' : 'Your notes will live here'}</strong><p>{search ? 'Try another word or clear your search.' : 'Save a thought, a plan, or something you do not want to forget.'}</p>{!search && <button className="secondary-button" onClick={() => setFormOpen(true)}>Write a note</button>}</div>}
      </div>
      <p className="notes-count">{filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} in your space</p>
    </div>
  );
}
