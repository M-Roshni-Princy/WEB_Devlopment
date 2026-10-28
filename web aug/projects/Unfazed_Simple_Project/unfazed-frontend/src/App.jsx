import React, { useEffect, useMemo, useState } from 'react';
import { Heart, CalendarDays, Users, MessageCircle, ArrowUpRight, Clock3, CheckCircle2, Leaf, Menu, X, LockKeyhole, Sparkles } from 'lucide-react';

const starterAppointments = [
  { id: 'a1', name: 'Aarav Mehta', email: 'aarav@example.com', date: '2026-11-02', time: '10:00', reason: 'Stress management', status: 'Confirmed' },
  { id: 'a2', name: 'Mira Shah', email: 'mira@example.com', date: '2026-11-03', time: '12:30', reason: 'Building confidence', status: 'Pending' },
];
const starterNotes = [
  { id: 'n1', client: 'Aarav Mehta', date: '2026-10-21', visibility: 'Shared', text: 'We discussed a few simple ways to create a calmer daily routine.' },
  { id: 'n2', client: 'Mira Shah', date: '2026-10-20', visibility: 'Private', text: 'Follow up on the goals discussed during the previous session.' },
];
const initialServices = [
  { title: 'Individual therapy', detail: 'A one-to-one space to talk through what is on your mind.', length: '50 minutes', price: '₹1,200' },
  { title: 'Stress & anxiety support', detail: 'Practical support for difficult days and changing routines.', length: '50 minutes', price: '₹1,200' },
  { title: 'Introductory conversation', detail: 'A short first conversation to see if this feels like the right fit.', length: '20 minutes', price: 'Free' },
];

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export default function App() {
  const [page, setPage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appointments, setAppointments] = useState(() => readStore('unfazed-appointments', starterAppointments));
  const [notes, setNotes] = useState(() => readStore('unfazed-notes', starterNotes));
  const [booking, setBooking] = useState({ name: '', email: '', date: '', time: '10:00', reason: '' });
  const [notice, setNotice] = useState('');
  const [noteForm, setNoteForm] = useState({ client: '', visibility: 'Shared', text: '' });

  useEffect(() => localStorage.setItem('unfazed-appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('unfazed-notes', JSON.stringify(notes)), [notes]);

  const clients = useMemo(() => {
    const map = new Map();
    appointments.forEach(a => map.set(a.email, { name: a.name, email: a.email }));
    return [...map.values()];
  }, [appointments]);

  function navigate(next) {
    setPage(next);
    setMobileOpen(false);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitBooking(event) {
    event.preventDefault();
    const item = { ...booking, id: Date.now().toString(), status: 'Pending' };
    setAppointments(current => [item, ...current]);
    setNotice('Your demo booking has been saved. The therapist can review it from the dashboard.');
    setBooking({ name: '', email: '', date: '', time: '10:00', reason: '' });
  }

  function addNote(event) {
    event.preventDefault();
    if (!noteForm.client.trim() || !noteForm.text.trim()) return;
    setNotes(current => [{ ...noteForm, id: Date.now().toString(), date: new Date().toISOString().slice(0, 10) }, ...current]);
    setNoteForm({ client: '', visibility: 'Shared', text: '' });
    setNotice('Session note added to this demo.');
  }

  function updateStatus(id, status) {
    setAppointments(current => current.map(a => a.id === id ? { ...a, status } : a));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')} aria-label="Unfazed home">
          <span className="brand-mark"><Leaf size={19} /></span><span>unfazed<span className="brand-dot">.</span></span>
        </button>
        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
        <nav className={mobileOpen ? 'nav nav-open' : 'nav'}>
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('home')}>Home</button>
          <button className={page === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('profile')}>Therapist profile</button>
          <button className={page === 'booking' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('booking')}>Book a session</button>
          <button className="nav-dashboard" onClick={() => navigate('dashboard')}>Dashboard <ArrowUpRight size={16} /></button>
        </nav>
      </header>

      {page === 'home' && <Home navigate={navigate} />}
      {page === 'profile' && <Profile navigate={navigate} />}
      {page === 'booking' && <Booking booking={booking} setBooking={setBooking} submitBooking={submitBooking} notice={notice} />}
      {page === 'dashboard' && <Dashboard appointments={appointments} clients={clients} notes={notes} updateStatus={updateStatus} noteForm={noteForm} setNoteForm={setNoteForm} addNote={addNote} notice={notice} />}
      <footer className="footer">
        <div className="footer-brand"><span className="brand-mark"><Leaf size={17} /></span> unfazed.</div>
        <p>A calmer way to manage a therapy practice.</p>
        <span className="footer-note">Student project · Demo data only</span>
      </footer>
    </div>
  );
}

function Home({ navigate }) {
  return <main>
    <section className="hero wrap">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"></span> A little more room to breathe</div>
        <h1>Care for people.<br /><em>Less admin</em> for you.</h1>
        <p className="hero-text">A simple home for your therapy practice. Let clients learn about your work, book a session, and stay connected — all in one place.</p>
        <div className="hero-actions"><button className="btn-primary" onClick={() => navigate('profile')}>Explore therapist profile <ArrowUpRight size={17} /></button><button className="btn-text" onClick={() => navigate('dashboard')}>Open dashboard</button></div>
        <div className="social-proof"><div className="avatar-stack"><span>A</span><span>M</span><span>S</span></div><div><strong>A more personal first step</strong><small>Clear, warm, and easy to use</small></div></div>
      </div>
      <div className="hero-art">
        <div className="sun-disc"></div><div className="plant plant-one">✳</div><div className="plant plant-two">✦</div>
        <div className="profile-card">
          <div className="profile-top"><div className="portrait"><span>DS</span></div><span className="online-pill"><i></i> Taking new clients</span></div>
          <div className="card-kicker">YOUR THERAPIST</div><h3>Dr. Samira Sharma</h3><p className="profile-role">Counselling Psychologist</p>
          <div className="thin-line"></div><p className="profile-quote">“You don't have to figure everything out on your own.”</p>
          <div className="profile-tags"><span>Stress</span><span>Life changes</span><span>Self-esteem</span></div>
          <button className="card-book" onClick={() => navigate('booking')}>Find a time <ArrowUpRight size={16} /></button>
        </div>
        <div className="floating-note"><span className="floating-icon"><CalendarDays size={18} /></span><div><strong>One less thing to worry about</strong><small>Appointments in one view</small></div><CheckCircle2 size={18} className="check" /></div>
        <div className="art-caption">A softer space to begin <span>✳</span></div>
      </div>
    </section>
    <section className="trust-strip"><div className="wrap trust-inner"><span><Heart size={18} /> People-first by design</span><span><CalendarDays size={18} /> Simple scheduling</span><span><LockKeyhole size={18} /> Thoughtful privacy design</span></div></section>
    <section className="wrap section-block"><div className="section-heading"><div><div className="eyebrow">MADE FOR THE EVERYDAY</div><h2>Your practice, in <em>one place.</em></h2></div><p>Spend less time jumping between tools and more time focusing on the people who come to you.</p></div>
      <div className="feature-grid"><Feature icon={<CalendarDays />} number="01" title="Bookings without back-and-forth" text="Let clients choose a date and time through a clear booking form."/><Feature icon={<Users />} number="02" title="A clearer client list" text="See client details and appointment status from your dashboard."/><Feature icon={<MessageCircle />} number="03" title="Notes that stay organised" text="Keep demo session notes marked as private or shared." /></div>
    </section>
    <section className="cta-band wrap"><div className="cta-leaf"><Sparkles size={25} /></div><div><h2>Start with one small step.</h2><p>Take a look at the profile or try a demo booking.</p></div><button className="btn-light" onClick={() => navigate('booking')}>Book a demo session <ArrowUpRight size={16}/></button></section>
  </main>;
}

function Feature({ icon, number, title, text }) {
  return <article className="feature-card"><div className="feature-card-top"><span className="feature-icon">{icon}</span><span className="feature-number">{number}</span></div><h3>{title}</h3><p>{text}</p></article>;
}

function Profile({ navigate }) {
  return <main className="wrap inner-page"><div className="eyebrow">THERAPIST PROFILE / DR. SHARMA</div><section className="profile-page-card"><div className="profile-page-art"><div className="portrait portrait-large"><span>DS</span></div><span className="profile-art-spark">✳</span></div><div className="profile-page-content"><span className="online-pill"><i></i> Accepting new clients</span><h1>Dr. Samira Sharma</h1><p className="profile-role">Counselling Psychologist</p><p className="profile-intro">Life can get heavy sometimes. My approach is to offer a welcoming, non-judgemental space where we can slow things down, understand what's happening, and find practical steps that feel right for you.</p><h3>Areas I work with</h3><div className="profile-tags"><span>Stress & anxiety</span><span>Self-esteem</span><span>Life transitions</span><span>Personal growth</span></div><div className="profile-facts"><span><Clock3 size={16}/> 50-minute sessions</span><span><Heart size={16}/> Online sessions</span></div><button className="btn-primary" onClick={() => navigate('booking')}>Book a session <ArrowUpRight size={17}/></button></div></section><div className="notice-box"><LockKeyhole size={18}/><p>This profile is sample content for a student project. It is not a real therapist listing or a substitute for professional care.</p></div></main>;
}

function Booking({ booking, setBooking, submitBooking, notice }) {
  return <main className="wrap inner-page"><div className="eyebrow">BOOKING / YOUR FIRST STEP</div><div className="booking-layout"><section className="booking-intro"><h1>Let's find a time <em>that works.</em></h1><p>Fill in a few details and choose a slot. This demo saves the appointment in your local browser so you can see how the flow works.</p><div className="booking-detail"><span><Clock3 size={19}/></span><div><strong>50 minutes</strong><small>Individual online session</small></div></div><div className="booking-detail"><span><Heart size={19}/></span><div><strong>₹1,200</strong><small>Sample session price · no payment taken</small></div></div></section>
    <form className="form-card" onSubmit={submitBooking}><h2>Request a session</h2><p className="form-subtitle">Fields marked with * are required.</p>
      <label>Full name *<input required value={booking.name} onChange={e => setBooking({...booking, name:e.target.value})} placeholder="Your name"/></label>
      <label>Email address *<input required type="email" value={booking.email} onChange={e => setBooking({...booking, email:e.target.value})} placeholder="you@example.com"/></label>
      <div className="form-row"><label>Date *<input required type="date" min={new Date().toISOString().slice(0,10)} value={booking.date} onChange={e => setBooking({...booking, date:e.target.value})}/></label><label>Time *<select required value={booking.time} onChange={e => setBooking({...booking, time:e.target.value})}>{['10:00','11:00','12:30','14:00','15:30','17:00'].map(t=><option key={t} value={t}>{t}</option>)}</select></label></div>
      <label>What would you like support with?<textarea rows="3" value={booking.reason} onChange={e => setBooking({...booking, reason:e.target.value})} placeholder="Optional — share only what you're comfortable sharing"/></label>
      <button className="btn-primary full-btn" type="submit">Save demo booking <ArrowUpRight size={17}/></button>
      {notice && <div className="success-message"><CheckCircle2 size={18}/>{notice}</div>}
      <small className="privacy-note"><LockKeyhole size={13}/> Please use sample details only. This demo is not secure for real health information.</small>
    </form></div></main>;
}

function Dashboard({ appointments, clients, notes, updateStatus, noteForm, setNoteForm, addNote, notice }) {
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  return <main className="wrap inner-page dashboard-page"><div className="dashboard-heading"><div><div className="eyebrow">YOUR PRACTICE / OVERVIEW</div><h1>A good day starts <em>organised.</em></h1><p>Here is a quick look at your demo practice.</p></div><span className="dashboard-date"><CalendarDays size={16}/> {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
    <div className="stats-grid"><Stat icon={<CalendarDays/>} label="Appointments" value={appointments.length} helper="All demo requests"/><Stat icon={<Users/>} label="Clients" value={clients.length} helper="Unique email addresses"/><Stat icon={<CheckCircle2/>} label="Confirmed" value={confirmed} helper="Approved appointments"/><Stat icon={<Heart/>} label="Session notes" value={notes.length} helper="Private and shared"/></div>
    <section className="dashboard-panel"><div className="panel-heading"><div><h2>Appointments</h2><p>Review booking requests and update their status.</p></div><span className="panel-count">{appointments.length} total</span></div>
      {appointments.length === 0 ? <div className="empty-state">No bookings yet. Try the booking page to add one.</div> : <div className="table-wrap"><table><thead><tr><th>Client</th><th>Date & time</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>{appointments.map(a=><tr key={a.id}><td><strong>{a.name}</strong><small>{a.email}</small></td><td>{a.date}<small>{a.time}</small></td><td>{a.reason || '—'}</td><td><span className={'status status-'+a.status.toLowerCase()}>{a.status}</span></td><td><select className="status-select" value={a.status} onChange={e=>updateStatus(a.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div>}
    </section>
    <section className="dashboard-lower"><div className="dashboard-panel client-panel"><div className="panel-heading"><div><h2>Clients</h2><p>People who have requested a session.</p></div></div>{clients.length===0?<div className="empty-state">Client list is empty.</div>:clients.map((c,i)=><div className="client-row" key={c.email}><span className="client-avatar">{c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span><div><strong>{c.name}</strong><small>{c.email}</small></div><span className="client-index">{String(i+1).padStart(2,'0')}</span></div>)}</div>
    <div className="dashboard-panel notes-panel"><div className="panel-heading"><div><h2>Session notes</h2><p>Choose whether a note is shared or private.</p></div></div><form className="note-form" onSubmit={addNote}><label>Client name<input required value={noteForm.client} onChange={e=>setNoteForm({...noteForm,client:e.target.value})} placeholder="Client name"/></label><label>Visibility<select value={noteForm.visibility} onChange={e=>setNoteForm({...noteForm,visibility:e.target.value})}><option>Shared</option><option>Private</option></select></label><label>Note<textarea required rows="3" value={noteForm.text} onChange={e=>setNoteForm({...noteForm,text:e.target.value})} placeholder="Write a short demo note"/></label><button className="btn-primary full-btn" type="submit">Add note</button>{notice && <div className="success-message"><CheckCircle2 size={17}/>{notice}</div>}</form>
      <div className="notes-list">{notes.map(n=><article className="note-item" key={n.id}><div className="note-item-top"><strong>{n.client}</strong><span className={n.visibility==='Private'?'note-private':'note-shared'}>{n.visibility==='Private'?<LockKeyhole size={12}/>:<Heart size={12}/>} {n.visibility}</span></div><small>{n.date}</small><p>{n.text}</p></article>)}</div>
    </div></section>
    <div className="notice-box"><LockKeyhole size={18}/><p>Demo only: these notes are saved in local browser storage and are not protected for real clinical use. The private/shared selector is a UI demonstration, not production access control.</p></div>
  </main>;
}

function Stat({ icon, label, value, helper }) {
  return <article className="stat-card"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong><small>{helper}</small></article>;
}
