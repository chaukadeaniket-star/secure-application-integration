import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Check, Clock3, Flame, RefreshCw } from 'lucide-react';
import { api } from '../services/api.js';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard({ onOpenInternship, onExplore, onApplications, displayName, activity, token }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const maxActivity = Math.max(1, ...activity);
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getMyApplications(token);
      setApplications(result.data);
    } catch (requestError) {
      setError(requestError.message || 'Could not load your internship access status.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const approved = applications.filter((application) => application.status === 'approved');

  return (
    <main className="page-content dashboard-page">
      <div className="welcome-row"><div><span className="eyebrow">{today.toUpperCase()}</span><h1>{approved.length ? 'Intern dashboard' : `Welcome, ${displayName.split(' ')[0]}`} <span>✦</span></h1><p>{approved.length ? 'Your approved internship tracks and learning tasks.' : 'Apply to an internship and wait for approval to unlock your intern dashboard.'}</p></div><div className="streak-card"><Flame size={20} /><strong>Your learning activity</strong></div></div>

      {error && <section className="panel internship-empty" role="alert"><p>{error}</p><button className="outline-button" type="button" onClick={loadApplications}>Try again</button></section>}
      {loading && <section className="panel dashboard-access-card" role="status"><span className="spinner" /> Checking your internship approvals…</section>}
      {!loading && !error && approved.length > 0 && (
        <section className="approved-internships">
          <div className="dashboard-section-title"><div><h2>Your approved internships</h2><p>These learning tracks are open and ready.</p></div><button className="outline-button" type="button" onClick={loadApplications} disabled={loading}><RefreshCw size={14} /> Refresh</button></div>
          {approved.map((application) => (
            <article className="panel approved-internship-card" key={application.id}>
              <span className="internship-company-mark"><BriefcaseBusiness size={20} /></span>
              <div className="approved-internship-copy"><span className="application-status-badge status-approved">Approved</span><h3>{application.internship?.title}</h3><p>{application.internship?.company} · {application.internship?.duration} · {application.internship?.tasks.length || 0} guided tasks</p></div>
              <button className="primary-inline-button" type="button" onClick={() => onOpenInternship(application.internship)}>Open intern dashboard <ArrowRight size={14} /></button>
            </article>
          ))}
        </section>
      )}
      {!loading && !error && approved.length === 0 && (
        <section className="panel dashboard-access-card">
          {applications.length ? (
            <>
              <span className="application-status-icon"><Clock3 size={22} /></span>
              <div className="dashboard-access-copy"><h2>{applications.some((item) => item.status === 'pending') ? 'Application under review' : 'Approval required'}</h2>
                {applications.map((application) => <p key={application.id}><strong>{application.internship?.title}</strong> — <span className={`application-status-badge status-${application.status}`}>{application.status}</span>{application.status === 'pending' ? ' · Your intern dashboard opens after approval.' : ' · You can apply for another internship.'}</p>)}
                <button className="outline-button" type="button" onClick={onApplications}>View application details <ArrowRight size={14} /></button>
              </div>
            </>
          ) : (
            <div className="dashboard-access-copy"><h2>Your intern dashboard starts with an approved application</h2><p>Explore web, app, IoT, electronics, finance, data, and other internship tracks. Apply first; your guided task dashboard opens after the team approves your application.</p><button className="primary-inline-button" type="button" onClick={onExplore}>Explore internships <ArrowRight size={14} /></button></div>
          )}
        </section>
      )}

      <section className="panel dashboard-task">
        <div className="dashboard-task-icon"><Check size={25} /></div>
        <div className="dashboard-task-copy"><span className="eyebrow">APPLICATION PROCESS</span><h2>Apply → Approval → Intern dashboard</h2><p>Applications are reviewed before the internship’s guided tasks become available.</p><div className="dashboard-task-tags"><span>Verified approval</span><span>Track-specific tasks</span><span>Submission guidance</span></div></div>
        {applications.length > 0 && <button className="primary-inline-button" onClick={onApplications}>My applications <ArrowRight size={15} /></button>}
      </section>

      <div className="dashboard-bottom">
        <section className="panel weekly-panel"><div className="panel-title-row"><div><h2>Your weekly activity</h2><p>Sign-ins, applications, and task submissions this session</p></div><span className="week-label">This week</span></div><div className="activity-chart" role="img" aria-label={`Weekly activity: ${activity.reduce((sum, value) => sum + value, 0)} actions`}>
          {activity.map((count, index) => {
            const height = count ? Math.max(12, (count / maxActivity) * 100) : 5;
            return <div className={`chart-column ${count ? 'chart-column-active' : ''}`} key={weekdays[index]} title={`${weekdays[index]}: ${count} ${count === 1 ? 'activity' : 'activities'}`}><span style={{ height: `${height}%` }} /><small>{weekdays[index]}</small><em>{count}</em></div>;
          })}
        </div></section>
        <section className="panel next-panel"><h2>Next step</h2><p>{approved.length ? 'Continue learning in your approved internship track.' : 'Submit an application to begin the approval process.'}</p><div className="next-task"><span className="next-task-number">{approved.length ? '01' : '→'}</span><div><strong>{approved.length ? 'Open your internship dashboard' : 'Explore internship tracks'}</strong><small>{approved.length ? approved[0].internship?.title : 'Web · App · IoT · Finance · More'}</small></div><Clock3 size={16} /></div></section>
      </div>
    </main>
  );
}
