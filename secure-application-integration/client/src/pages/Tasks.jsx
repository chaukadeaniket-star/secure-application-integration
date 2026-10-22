import { ArrowRight, Check, Clock3, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useInternships } from '../hooks/useInternships.js';

export default function Tasks({ onOpenTask }) {
  const { internships, loading, error, reload } = useInternships();
  return (
    <main className="page-content tasks-page">
      <div className="page-title"><div className="title-badge"><ShieldCheck size={24} /></div><div><div className="title-line"><h1>Internship tasks</h1><span className="soft-pill">3 of 6 completed</span></div><p>Work through each challenge to build practical engineering skills.</p></div></div>
      <section className="task-list panel">
        <article className="task-row task-done"><span className="task-number done-number"><Check size={17} /></span><div className="task-info"><small>TASK 01</small><h2>Getting Started with Git</h2><p>Learn the basics of version control and collaboration.</p></div><span className="task-state completed-state">Completed</span><Check className="task-check" size={19} /></article>
        <article className="task-row task-done"><span className="task-number done-number"><Check size={17} /></span><div className="task-info"><small>TASK 02</small><h2>Responsive Web Fundamentals</h2><p>Create accessible, responsive layouts for the modern web.</p></div><span className="task-state completed-state">Completed</span><Check className="task-check" size={19} /></article>
        <article className="task-row task-done"><span className="task-number done-number"><Check size={17} /></span><div className="task-info"><small>TASK 03</small><h2>Working with REST APIs</h2><p>Fetch, filter, and display data from an API.</p></div><span className="task-state completed-state">Completed</span><Check className="task-check" size={19} /></article>
        <article className="task-row task-current"><span className="task-number current-number">04</span><div className="task-info"><small>TASK 04 · CURRENT</small><h2>Secure Application Integration</h2><p>Connect the internship frontend to the API and add a secure application form.</p><div className="task-meta"><span><Clock3 size={13} /> 90–120 min</span><span>Beginner-friendly</span></div></div><span className="task-state in-progress-state"><span className="spinner" /> In progress</span><button className="task-open-button" onClick={onOpenTask} aria-label="Open Secure Application Integration"><ArrowRight size={18} /></button></article>
        {[5, 6].map((number) => <article className="task-row task-locked" key={number}><span className="task-number locked-number">{number.toString().padStart(2, '0')}</span><div className="task-info"><small>TASK {String(number).padStart(2, '0')}</small><h2>{number === 5 ? 'Build a Portfolio Project' : 'Final Review & Showcase'}</h2><p>{number === 5 ? 'Put your new skills into practice with a project.' : 'Share your progress and celebrate your work.'}</p></div><span className="task-state locked-state"><LockKeyhole size={13} /> Locked</span></article>)}
      </section>
      <section className="panel task-data-panel"><div><h2>Live internship opportunities</h2><p>{loading ? 'Loading opportunities…' : error ? error : `${internships.length} opportunities available through the connected API`}</p></div><button className="outline-button" onClick={() => reload()} disabled={loading}>{loading ? 'Loading…' : 'Refresh API data'}</button></section>
    </main>
  );
}
