import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const { user } = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(form) }); onLogin(user); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="auth-wrap"><section className="auth-card">
    <div className="logo">S</div><p className="eyebrow">YOUR STUDY SPACE</p>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
    <p className="muted">{mode === 'login' ? 'Sign in and pick up where you left off.' : 'A calmer way to keep track of your work.'}</p>
    <form onSubmit={submit} className="stack">
      {mode === 'register' && <label>Your name<input required minLength="2" maxLength="60" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label>}
      <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label>
      <label>Password<input required type="password" minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/><small>Use at least 8 characters.</small></label>
      {error && <p role="alert" className="error">{error}</p>}
      <button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    </form>
    <p className="switch">{mode === 'login' ? 'New here?' : 'Already have an account?'} <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
  </section></main>;
}

function TaskForm({ task, onSave, onCancel, busy }) {
  const [form, setForm] = useState({ title: task?.title || '', description: task?.description || '', dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '', status: task?.status || 'pending' });
  return <form className="task-form" onSubmit={e => { e.preventDefault(); const dueDate = form.dueDate ? new Date(`${form.dueDate}T12:00:00`).toISOString() : null; onSave({ ...form, dueDate }); }}>
    <label>Task title<input autoFocus required minLength="2" maxLength="100" placeholder="e.g. Finish biology notes" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/></label>
    <label>Notes <small>(optional)</small><textarea rows="3" maxLength="1000" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></label>
    <div className="form-row"><label>Due date<input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}/></label>
      <label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="pending">To do</option><option value="completed">Completed</option></select></label></div>
    <div className="actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : task ? 'Save changes' : 'Add task'}</button></div>
  </form>;
}

function Dashboard({ user, onSignOut }) {
  const [tasks, setTasks] = useState([]); const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false); const [busyId, setBusyId] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const result = await api('/tasks?limit=50'); setTasks(result.tasks); } catch (e) { setError(e.message); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const visible = useMemo(() => filter === 'all' ? tasks : tasks.filter(t => t.status === filter), [tasks, filter]);
  async function save(data) {
    setBusy(true); setError('');
    try { const result = await api(editing ? `/tasks/${editing._id}` : '/tasks', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(data) });
      setTasks(old => editing ? old.map(t => t._id === editing._id ? result.task : t) : [result.task, ...old]); setShowForm(false); setEditing(null);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function toggle(task) {
    setBusyId(task._id); setError('');
    try { const result = await api(`/tasks/${task._id}`, { method: 'PATCH', body: JSON.stringify({ status: task.status === 'pending' ? 'completed' : 'pending' }) }); setTasks(old => old.map(t => t._id === task._id ? result.task : t)); }
    catch (e) { setError(e.message); } finally { setBusyId(''); }
  }
  async function remove(task) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setBusyId(task._id); setError('');
    try { await api(`/tasks/${task._id}`, { method: 'DELETE' }); setTasks(old => old.filter(t => t._id !== task._id)); }
    catch (e) { setError(e.message); } finally { setBusyId(''); }
  }
  const count = tasks.filter(t => t.status === 'pending').length;
  return <main className="shell"><header className="topbar"><a className="wordmark" href="#home"><span className="logo small">S</span> studyflow</a><div className="user"><span className="avatar">{user.name[0].toUpperCase()}</span><span>{user.name}</span><button className="link" onClick={onSignOut}>Sign out</button></div></header>
    <section className="welcome"><div><p className="eyebrow">YOUR PERSONAL TASK SPACE</p><h1>Make room for what matters.</h1><p className="muted">One step at a time, {user.name.split(' ')[0]}.</p></div><div className="count"><strong>{count}</strong><span>{count === 1 ? 'task to go' : 'tasks to go'}</span></div></section>
    <section className="board"><div className="board-head"><div><p className="eyebrow">YOUR TASKS</p><h2>Keep moving forward</h2></div><button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}>＋ Add a task</button></div>
      {error && <p role="alert" className="notice">{error} <button className="link" onClick={load}>Try again</button></p>}
      <nav className="filters" aria-label="Filter tasks">{[['all','All'],['pending','To do'],['completed','Done']].map(([key,label]) => <button key={key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}<span>{key === 'all' ? tasks.length : tasks.filter(t => t.status === key).length}</span></button>)}</nav>
      {loading ? <div className="state" role="status"><span className="spinner"/> Loading your tasks…</div> : visible.length === 0 ? <div className="state empty"><span className="sparkle">✦</span><h3>{tasks.length ? 'Nothing in this view' : 'A fresh start'}</h3><p>{tasks.length ? 'Try another filter or add a task.' : 'Add your first task and make a little progress today.'}</p>{!tasks.length && <button className="primary" onClick={() => setShowForm(true)}>Add your first task</button>}</div> : <div className="task-list">{visible.map(task => <article className={`task ${task.status}`} key={task._id}>
        <button className={`check ${task.status}`} aria-label={task.status === 'pending' ? `Complete ${task.title}` : `Mark ${task.title} to do`} disabled={busyId === task._id} onClick={() => toggle(task)}>{task.status === 'completed' ? '✓' : ''}</button>
        <div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<div className="meta">{task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>}<span className={`badge ${task.status}`}>{task.status === 'pending' ? 'To do' : 'Done'}</span></div></div>
        <div className="task-buttons"><button className="quiet" onClick={() => { setEditing(task); setShowForm(true); }}>Edit</button><button className="quiet danger" disabled={busyId === task._id} onClick={() => remove(task)}>Delete</button></div>
      </article>)}</div>}
    </section><footer className="footer">A small step still counts. <span>Built for your study days.</span></footer>
    {showForm && <div className="backdrop" onMouseDown={e => { if (e.target === e.currentTarget && !busy) { setShowForm(false); setEditing(null); } }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-head"><div><p className="eyebrow">A LITTLE PROGRESS</p><h2 id="form-title">{editing ? 'Edit your task' : 'Add a task'}</h2></div><button className="close" aria-label="Close" onClick={() => { setShowForm(false); setEditing(null); }}>×</button></div>{error && <p className="notice">{error}</p>}<TaskForm key={editing?._id || 'new'} task={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} busy={busy}/></section></div>}
  </main>;
}

export default function App() {
  const [user, setUser] = useState(null); const [checking, setChecking] = useState(true);
  useEffect(() => { api('/auth/me').then(d => setUser(d.user)).catch(() => setUser(null)).finally(() => setChecking(false)); }, []);
  async function signOut() { try { await api('/auth/logout', { method: 'POST' }); } finally { setUser(null); } }
  if (checking) return <div className="full-state"><span className="spinner"/> Checking your session…</div>;
  return user ? <Dashboard user={user} onSignOut={signOut}/> : <Auth onLogin={setUser}/>;
}
