import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, Upload } from 'lucide-react';

export default function InternshipTrackPage({ internship, onBack, onApply, isApproved = false }) {
  const [expandedTask, setExpandedTask] = useState(0);

  if (!internship) {
    return (
      <main className="page-content internship-track-page">
        <section className="panel internship-empty">
          <h1>Choose an internship track</h1>
          <p>Browse available opportunities to see their guided tasks and deliverables.</p>
          <button className="primary-inline-button" type="button" onClick={onBack}>Browse internships</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-content internship-track-page">
      <button className="track-back-button" type="button" onClick={onBack}><ArrowLeft size={15} /> {isApproved ? 'Intern dashboard' : 'All internships'}</button>
      <header className="panel track-hero">
        <div className="track-company-mark"><BriefcaseBusiness size={24} /></div>
        <div className="track-hero-copy">
          <span className="eyebrow">{isApproved ? 'APPROVED INTERN DASHBOARD' : `${internship.category} · ${internship.level} · TRACK PREVIEW`}</span>
          <h1>{isApproved ? 'Intern Dashboard' : internship.title}</h1>
          {isApproved && <h2 className="track-approved-title">{internship.title}</h2>}
          <p>{internship.company} · {internship.location} · {internship.duration}</p>
          <p>{internship.description}</p>
          <div className="internship-skills">{internship.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        {!isApproved && <button className="primary-inline-button" type="button" onClick={() => onApply(internship)}>Apply to this internship <ArrowRight size={15} /></button>}
      </header>

      <div className="track-overview">
        <section className="panel track-overview-card"><BookOpen size={19} /><div><strong>{internship.tasks.length} practical tasks</strong><span>Follow each guide and build toward a final project.</span></div></section>
        <section className="panel track-overview-card"><Clock3 size={19} /><div><strong>{internship.duration}</strong><span>Flexible, self-paced learning track.</span></div></section>
        <section className="panel track-overview-card"><Upload size={19} /><div><strong>Project-based deliverables</strong><span>Submit your repository and supporting evidence.</span></div></section>
      </div>

      <div className="track-section-heading"><div><h2>{isApproved ? 'Your learning plan and tasks' : 'Track task preview'}</h2><p>{isApproved ? 'Your application is approved. Work through each guide and submit the deliverable.' : 'Apply to this track and receive approval to unlock your intern dashboard.'}</p></div></div>
      <section className="track-task-list">
        {internship.tasks.map((task, index) => {
          const isExpanded = expandedTask === index;
          return (
            <article className={`panel track-task-card ${isExpanded ? 'track-task-expanded' : ''}`} key={task.title}>
              <button className="track-task-toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpandedTask(isExpanded ? -1 : index)}>
                <span className="track-task-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="track-task-title"><strong>{task.title}</strong><small>{task.description}</small></span>
                <span className="track-task-duration"><Clock3 size={13} /> {task.duration}</span>
                <ArrowRight className={isExpanded ? 'track-task-arrow expanded' : 'track-task-arrow'} size={17} />
              </button>
              {isExpanded && (
                <div className="track-task-details">
                  <h3><CheckCircle2 size={15} /> Step-by-step guide</h3>
                  <ol>{task.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  <div className="track-deliverable"><strong>What to submit</strong><span>{task.deliverable}</span></div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
