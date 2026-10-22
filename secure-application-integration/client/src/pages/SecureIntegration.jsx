import { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Clock3, ShieldCheck } from 'lucide-react';
import ApiPreview from '../components/ApiPreview.jsx';
import ChecklistItem from '../components/ChecklistItem.jsx';
import ProgressSteps from '../components/ProgressSteps.jsx';
import ResourceCard from '../components/ResourceCard.jsx';
import SubmissionPanel from '../components/SubmissionPanel.jsx';
import TestRunner from '../components/TestRunner.jsx';
import { api } from '../services/api.js';
import { validateApplication } from '../utils/validators.js';

const initialValues = { name: '', email: '', portfolioUrl: '', message: '' };

export default function SecureIntegration({ onNotice, token, selectedInternship, onActivity }) {
  const [expanded, setExpanded] = useState(1);
  const [showForm, setShowForm] = useState(Boolean(selectedInternship));
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const internshipId = selectedInternship?.id || 'internship-1';

  useEffect(() => {
    if (selectedInternship) setShowForm(true);
  }, [selectedInternship]);

  async function submitApplication(event) {
    event.preventDefault();
    const validationErrors = validateApplication(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setSubmitting(true);
    setSubmitted('');
    try {
      const result = await api.submitApplication(token, { ...values, internshipId });
      setSubmitted(`Application ${result.data.id} submitted successfully.`);
      onActivity?.();
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setSubmitted(error.message || 'Could not submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-content integration-page">
      <div className="integration-title">
        <div className="title-badge large-badge"><ShieldCheck size={27} fill="currentColor" /></div>
        <div className="integration-title-copy">
          <div className="title-line"><h1>Secure Application Integration</h1><span className="blue-pill"><i /> In progress</span><span className="purple-pill"><Clock3 size={13} /> 90 – 120 min</span></div>
          <p>Connect the internship frontend to the API with secure validation and reliable UI states.</p>
        </div>
      </div>
      <ProgressSteps current={1} />
      <div className="integration-grid">
        <div className="integration-main-column">
          <section className="task-guide panel" id="guide">
            <details open>
              <summary>Open step-by-step guide</summary>
              <div className="task-guide-body">
                <p><strong>Objective:</strong> Integrate the internship frontend and backend safely while handling loading, validation, retry, and failure states.</p>
                <p><strong>Deliverable:</strong> Integrated repository, test report, and short security checklist.</p>
                <div className="task-tags"><span>Beginner-friendly</span><span>90–120 minutes</span><span>One proof link</span></div>
                <h2>Do these steps to pass</h2>
                <ol>
                  <li>Load and render API data with visible loading and failure states. Add search and retry behavior.</li>
                  <li>Build an internship application form validated in the browser and again on the server.</li>
                  <li>Protect the API with rate limits, secure headers, and parameterized queries. Run the tests and include the report.</li>
                </ol>
                <p className="guide-submit"><strong>Submit:</strong> Provide one public or view-only GitHub repository link. Keep supporting files in the same repository so one link is enough.</p>
                <details className="portfolio-upgrade"><summary>Optional portfolio upgrade</summary><p>Add a README with screenshots, setup instructions, API examples, and a short note explaining one security decision.</p></details>
              </div>
            </details>
          </section>
          <section className="panel checklist-panel">
            <div className="panel-heading">
              <div className="heading-icon checklist-heading"><Check size={19} /></div>
              <div><h2>Implementation checklist</h2><p>Follow these steps to complete the task successfully.</p></div>
            </div>
            <div className="checklist-items">
              <ChecklistItem number={1} title="Connect the API" description="Fetch and render internship data from the API with proper error handling." status="Completed" expanded={expanded === 1} onToggle={() => setExpanded(expanded === 1 ? 0 : 1)} />
              <ChecklistItem number={2} title="Handle UI states" description="Show loading state, empty state, error state and retry option." status="In progress" expanded={expanded === 2} onToggle={() => setExpanded(expanded === 2 ? 0 : 2)} />
              <ChecklistItem number={3} title="Validate applications" description="Add client-side and server-side validation for the application form." status="Not started" expanded={expanded === 3} onToggle={() => { setExpanded(expanded === 3 ? 0 : 3); setShowForm(true); }} />
              <ChecklistItem number={4} title="Secure the backend" description="Implement rate limits, secure headers, and parameterized queries." status="Not started" expanded={expanded === 4} onToggle={() => setExpanded(expanded === 4 ? 0 : 4)} />
            </div>
          </section>
          <ApiPreview />
          <section className="panel application-panel">
            <button className="application-toggle" onClick={() => setShowForm(!showForm)} aria-expanded={showForm}>
              <span className="heading-icon form-heading"><ShieldCheck size={19} /></span>
              <span><strong>Secure application form</strong><small>Validated in your browser and again on the server.</small></span>
              {showForm ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
            </button>
            {showForm && (
              <form className="application-form" onSubmit={submitApplication} noValidate>
                {selectedInternship && <p className="application-target">Applying for <strong>{selectedInternship.title}</strong> at {selectedInternship.company}</p>}
                <div className="form-grid">
                  <label>Full name<input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Your name" maxLength={80} aria-invalid={Boolean(errors.name)} />{errors.name && <small className="field-error">{errors.name}</small>}</label>
                  <label>Email address<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" maxLength={254} aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
                </div>
                <label>Portfolio URL <span className="optional-label">Optional</span><input value={values.portfolioUrl} onChange={(event) => setValues({ ...values, portfolioUrl: event.target.value })} placeholder="https://yourportfolio.com" maxLength={2048} aria-invalid={Boolean(errors.portfolioUrl)} />{errors.portfolioUrl && <small className="field-error">{errors.portfolioUrl}</small>}</label>
                <label>Why are you interested?<textarea value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} placeholder="Tell us a little about yourself…" rows={4} maxLength={1200} aria-invalid={Boolean(errors.message)} />{errors.message && <small className="field-error">{errors.message}</small>}</label>
                {submitted && <p className={submitted.startsWith('Application') ? 'form-success' : 'form-error'} role="status">{submitted}</p>}
                <button className="primary-inline-button" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'}</button>
              </form>
            )}
          </section>
        </div>
        <aside className="integration-side-column">
          <SubmissionPanel token={token} onActivity={onActivity} />
          <ResourceCard />
          <TestRunner />
        </aside>
      </div>
    </main>
  );
}
