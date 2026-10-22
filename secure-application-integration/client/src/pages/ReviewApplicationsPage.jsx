import { useState } from 'react';
import { Check, Clock3, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api.js';

export default function ReviewApplicationsPage({ token }) {
  const [reviewKey, setReviewKey] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewing, setReviewing] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [notice, setNotice] = useState('');

  async function loadApplications(key = reviewKey) {
    if (!key.trim()) {
      setError('Enter the reviewer key configured on the server.');
      return;
    }
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const result = await api.getApplicationsForReview(token, key.trim());
      setApplications([...result.data].sort((left, right) => {
        if (left.status === 'pending' && right.status !== 'pending') return -1;
        if (left.status !== 'pending' && right.status === 'pending') return 1;
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }));
      setHasLoaded(true);
    } catch (requestError) {
      setHasLoaded(false);
      setApplications([]);
      setError(requestError.message || 'Could not load applications for review.');
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  }

  async function decide(applicationId, status) {
    setReviewing(applicationId);
    setError('');
    try {
      const result = await api.reviewApplication(token, reviewKey.trim(), applicationId, status);
      const refreshed = await loadApplications();
      setNotice(refreshed
        ? `Application ${result.data.status === 'approved' ? 'approved' : 'declined'} successfully.`
        : 'Decision saved. Refresh the queue to see the latest status.');
    } catch (requestError) {
      setError(requestError.message || 'Could not update the application status.');
    } finally {
      setReviewing('');
    }
  }

  function updateKey(value) {
    setReviewKey(value);
    setHasLoaded(false);
    setApplications([]);
    setError('');
    setNotice('');
  }

  return (
    <main className="page-content review-page">
      <div className="page-title"><div className="title-badge"><ShieldCheck size={24} /></div><div><h1>Review internship applications</h1><p>Enter the reviewer key configured in the server environment to approve or decline candidates.</p></div></div>
      <form className="panel reviewer-key-form" onSubmit={(event) => { event.preventDefault(); loadApplications(); }}>
        <label htmlFor="review-key">Reviewer key</label>
        <input id="review-key" type="password" value={reviewKey} onChange={(event) => updateKey(event.target.value)} autoComplete="off" placeholder="Enter the server-configured reviewer key" />
        <button className="primary-inline-button" type="submit" disabled={loading}>{loading ? 'Loading…' : <><RefreshCw size={14} /> Load applications</>}</button>
      </form>
      {error && <p className="review-error" role="alert">{error}</p>}
      {notice && <p className="review-notice" role="status">{notice}</p>}
      {hasLoaded && <div className="review-queue-summary"><strong>{applications.filter((application) => application.status === 'pending').length} pending</strong><span>{applications.length} total applications</span></div>}
      <section className="review-list">
        {applications.map((application) => (
          <article className="panel review-card" key={application.id}>
            <div className="review-card-heading"><div><span className={`application-status-badge status-${application.status}`}>{application.status}</span><h2>{application.name}</h2><p>{application.email} · Applied {new Date(application.createdAt).toLocaleDateString()}</p></div><strong>{application.internship?.title}</strong></div>
            <p className="review-message">{application.message}</p>
            {application.portfolioUrl && <a href={application.portfolioUrl} target="_blank" rel="noreferrer">View portfolio</a>}
            {application.status === 'pending' ? <div className="review-actions"><button className="approve-button" type="button" onClick={() => decide(application.id, 'approved')} disabled={Boolean(reviewing)}><Check size={15} /> {reviewing === application.id ? 'Saving…' : 'Approve'}</button><button className="reject-button" type="button" onClick={() => decide(application.id, 'rejected')} disabled={Boolean(reviewing)}><X size={15} /> Decline</button></div> : <p className="reviewed-at"><Clock3 size={13} /> Reviewed {new Date(application.reviewedAt).toLocaleString()}</p>}
          </article>
        ))}
        {!loading && hasLoaded && !error && applications.length === 0 && <section className="panel internship-empty"><h2>No applications yet</h2><p>Applications will appear here when candidates apply.</p></section>}
      </section>
    </main>
  );
}
