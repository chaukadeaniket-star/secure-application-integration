import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Clock3, RefreshCw } from 'lucide-react';
import { api } from '../services/api.js';

function ApplicationTimeline({ status }) {
  const thirdStage = status === 'approved'
    ? { title: 'Dashboard ready', detail: 'Intern tasks unlocked', className: 'timeline-stage-done', marker: '✓' }
    : status === 'rejected'
      ? { title: 'Decision', detail: 'Application declined', className: 'timeline-stage-rejected', marker: '!' }
      : { title: 'Dashboard', detail: 'Unlocked after approval', className: '', marker: '3' };
  const reviewStage = status === 'pending'
    ? { title: 'Review', detail: 'Awaiting the internship team', className: 'timeline-stage-current' }
    : { title: 'Review', detail: status === 'approved' ? 'Application approved' : 'Review complete', className: 'timeline-stage-done' };

  return (
    <ol className="application-timeline" aria-label={`Application progress: ${status}`}>
      <li className="timeline-stage timeline-stage-done"><span>✓</span><div><strong>Application sent</strong><small>Submitted successfully</small></div></li>
      <li className="timeline-connector" aria-hidden="true" />
      <li className={`timeline-stage ${reviewStage.className}`}><span>{status === 'pending' ? <Clock3 size={13} /> : '✓'}</span><div><strong>{reviewStage.title}</strong><small>{reviewStage.detail}</small></div></li>
      <li className="timeline-connector" aria-hidden="true" />
      <li className={`timeline-stage ${thirdStage.className}`}><span>{thirdStage.marker}</span><div><strong>{thirdStage.title}</strong><small>{thirdStage.detail}</small></div></li>
    </ol>
  );
}

export default function ApplicationsPage({ token, onExplore, onOpenInternship }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getMyApplications(token);
      setApplications(result.data);
    } catch (requestError) {
      setError(requestError.message || 'Could not load your applications.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  return (
    <main className="page-content applications-page">
      <div className="page-title"><div className="title-badge"><BriefcaseBusiness size={24} /></div><div><h1>My applications</h1><p>Track each application from submission through review to dashboard access.</p></div><button className="outline-button application-refresh" type="button" onClick={loadApplications} disabled={loading}><RefreshCw size={14} /> Refresh</button></div>
      {error && <section className="panel internship-empty" role="alert"><p>{error}</p><button className="outline-button" type="button" onClick={loadApplications}>Try again</button></section>}
      {loading && <p className="applications-loading" role="status">Loading your applications…</p>}
      {!loading && !error && applications.length === 0 && <section className="panel internship-empty"><h2>No applications yet</h2><p>Explore an internship track and submit an application to get started.</p><button className="primary-inline-button" type="button" onClick={onExplore}>Explore internships <ArrowRight size={14} /></button></section>}
      <section className="my-application-list">
        {applications.map((application) => (
          <article className="panel my-application-card" key={application.id}>
            <div className="my-application-heading"><span className="internship-company-mark">{application.internship?.company.slice(0, 1) || 'I'}</span><div><h2>{application.internship?.title || 'Internship'}</h2><p>{application.internship?.company} · Applied {new Date(application.createdAt).toLocaleDateString()}</p></div><span className={`application-status-badge status-${application.status}`}>{application.status}</span></div>
            <div className="application-status-detail">
              {application.status === 'pending' ? <><Clock3 size={15} /><span>Your application is under review. The internship dashboard will unlock after approval.</span></>
                : application.status === 'approved' ? <><span className="approved-mark">✓</span><span>Approved. Your internship task dashboard is ready.</span></>
                  : <><span className="rejected-mark">!</span><span>This application was declined. You can apply for another internship track.</span></>}
            </div>
            <ApplicationTimeline status={application.status} />
            {application.status === 'approved' && <button className="primary-inline-button" type="button" onClick={() => onOpenInternship(application.internship)}>Open intern dashboard <ArrowRight size={14} /></button>}
            {application.status === 'rejected' && <button className="outline-button" type="button" onClick={onExplore}>Explore other internships</button>}
          </article>
        ))}
      </section>
    </main>
  );
}
