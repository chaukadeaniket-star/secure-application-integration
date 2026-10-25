import { useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3 } from 'lucide-react';
import { api } from '../services/api.js';
import { validateApplication } from '../utils/validators.js';

const emptyValues = {
  name: '',
  email: '',
  phone: '',
  college: '',
  course: '',
  skills: '',
  resumeUrl: '',
  portfolioUrl: '',
  message: ''
};

export default function ApplyPage({ internship, token, displayName, onBack, onApplySuccess, onViewApplications }) {
  const [values, setValues] = useState({ ...emptyValues, name: displayName });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [application, setApplication] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateApplication(values);
    setErrors(validationErrors);
    setError('');
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      const result = await api.submitApplication(token, { ...values, internshipId: internship.id });
      setApplication(result.data);
      onApplySuccess?.();
    } catch (requestError) {
      if (requestError.details?.length) {
        setErrors(Object.fromEntries(requestError.details.map(({ field, message }) => [field, message])));
      }
      setError(requestError.message || 'Could not submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!internship) {
    return <main className="page-content apply-page"><section className="panel internship-empty"><h1>Choose an internship first</h1><p>Browse the available tracks before starting an application.</p><button className="primary-inline-button" type="button" onClick={onBack}>Explore internships</button></section></main>;
  }

  return (
    <main className="page-content apply-page">
      <button className="track-back-button" type="button" onClick={onBack}><ArrowLeft size={15} /> Back to internships</button>
      <div className="page-title"><div className="title-badge"><BriefcaseBusiness size={24} /></div><div><h1>Apply for this internship</h1><p>Complete the application procedure. Your internship dashboard unlocks after approval.</p></div></div>
      <div className="application-procedure" aria-label={application ? 'Application submitted and awaiting review' : 'Application steps'}>
        <div className={`procedure-step ${application ? 'procedure-step-done' : 'procedure-step-current'}`}><span>{application ? '✓' : '1'}</span><div><strong>Submit application</strong><small>{application ? 'Submitted successfully' : 'Share your details and interest'}</small></div></div>
        <i />
        <div className={`procedure-step ${application ? 'procedure-step-current' : ''}`}><span>2</span><div><strong>Application review</strong><small>Wait for a reviewer decision</small></div></div>
        <i />
        <div className="procedure-step"><span>3</span><div><strong>Intern dashboard</strong><small>Opens after approval</small></div></div>
      </div>
      <div className="apply-layout">
        <section className="panel apply-form-panel">
          {application ? (
            <div className="application-pending">
              <span className="application-status-icon"><Clock3 size={23} /></span>
              <h2>Application submitted</h2>
              <p>Your application for <strong>{internship.title}</strong> is now <span className="application-status-badge status-pending">Pending review</span>.</p>
              <p>You’ll get access to the internship dashboard when a reviewer approves your application. Track the decision and next steps in My applications.</p>
              <button className="primary-inline-button" type="button" onClick={onViewApplications}>View application status <ArrowRight size={15} /></button>
            </div>
          ) : (
            <>
              <div className="panel-heading"><div className="heading-icon form-heading"><BriefcaseBusiness size={19} /></div><div><h2>Application form</h2><p>Apply to {internship.company} · {internship.duration}</p></div></div>
              <form className="application-form apply-form" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <label>Full name<input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Your name" maxLength={80} aria-invalid={Boolean(errors.name)} />{errors.name && <small className="field-error">{errors.name}</small>}</label>
                  <label>Email address<input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" maxLength={254} aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
                </div>
                <div className="form-grid">
                  <label>Phone number<input type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} placeholder="+1 415 555 0134" maxLength={24} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
                  <label>College name<input value={values.college} onChange={(event) => setValues({ ...values, college: event.target.value })} placeholder="Your college or university" maxLength={120} aria-invalid={Boolean(errors.college)} />{errors.college && <small className="field-error">{errors.college}</small>}</label>
                </div>
                <div className="form-grid">
                  <label>Course or degree<input value={values.course} onChange={(event) => setValues({ ...values, course: event.target.value })} placeholder="BSc Computer Science" maxLength={120} aria-invalid={Boolean(errors.course)} />{errors.course && <small className="field-error">{errors.course}</small>}</label>
                  <label>Skills<input value={values.skills} onChange={(event) => setValues({ ...values, skills: event.target.value })} placeholder="React, research, data analysis" maxLength={500} aria-invalid={Boolean(errors.skills)} />{errors.skills && <small className="field-error">{errors.skills}</small>}</label>
                </div>
                <label>Resume URL<input type="url" value={values.resumeUrl} onChange={(event) => setValues({ ...values, resumeUrl: event.target.value })} placeholder="https://example.com/resume.pdf" maxLength={2048} aria-invalid={Boolean(errors.resumeUrl)} />{errors.resumeUrl && <small className="field-error">{errors.resumeUrl}</small>}</label>
                <label>Portfolio URL <span className="optional-label">Optional</span><input value={values.portfolioUrl} onChange={(event) => setValues({ ...values, portfolioUrl: event.target.value })} placeholder="https://yourportfolio.com" maxLength={2048} aria-invalid={Boolean(errors.portfolioUrl)} />{errors.portfolioUrl && <small className="field-error">{errors.portfolioUrl}</small>}</label>
                <label>Why are you interested?<textarea value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} placeholder="Tell us about your interest and relevant experience…" rows={5} maxLength={1200} aria-invalid={Boolean(errors.message)} />{errors.message && <small className="field-error">{errors.message}</small>}</label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="primary-inline-button" type="submit" disabled={submitting}>{submitting ? 'Submitting application…' : <>Submit application <ArrowRight size={15} /></>}</button>
              </form>
            </>
          )}
        </section>
        <aside className="panel apply-track-summary">
          <span className="internship-category">{internship.category}</span>
          <h2>{internship.title}</h2>
          <p>{internship.company} · {internship.location}</p>
          <p>{internship.description}</p>
          <div className="application-summary-row"><Clock3 size={14} /> {internship.duration}</div>
          <div className="application-summary-row"><CheckCircle2 size={14} /> {internship.tasks.length} guided tasks after approval</div>
          <div className="internship-skills">{internship.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </aside>
      </div>
    </main>
  );
}
