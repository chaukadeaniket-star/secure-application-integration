import { Award, BookOpen, ChartNoAxesColumn, LockKeyhole } from 'lucide-react';
import ResourceCard from '../components/ResourceCard.jsx';
import SubmissionPanel from '../components/SubmissionPanel.jsx';

const pageContent = {
  Resources: {
    icon: BookOpen,
    title: 'Learning resources',
    description: 'Reference materials to help you complete the Secure Application Integration task.'
  },
  Submissions: {
    icon: ChartNoAxesColumn,
    title: 'Task submissions',
    description: 'Review the deliverables you need before submitting your work.'
  },
  Certificates: {
    icon: Award,
    title: 'Certificates',
    description: 'Certificates become available when you complete the internship tasks.'
  },
  Progress: {
    icon: ChartNoAxesColumn,
    title: 'Your progress',
    description: 'Track your internship completion and keep moving toward your certificate.'
  }
};

export default function PortalPage({ page, onNotice, token, onActivity }) {
  const content = pageContent[page];
  const Icon = content.icon;

  return (
    <main className="page-content portal-page">
      <div className="page-title">
        <div className="title-badge"><Icon size={24} /></div>
        <div>
          <div className="title-line"><h1>{content.title}</h1></div>
          <p>{content.description}</p>
        </div>
      </div>

      {page === 'Resources' && <ResourceCard />}
      {page === 'Submissions' && (
        <div className="portal-submission">
          <SubmissionPanel token={token} onActivity={onActivity} />
        </div>
      )}
      {page === 'Certificates' && (
        <section className="panel certificate-card">
          <span className="certificate-icon"><LockKeyhole size={23} /></span>
          <div>
            <h2>No certificate yet</h2>
            <p>Complete all 6 internship tasks to unlock your completion certificate. You have completed 3 of 6 tasks.</p>
            <div className="certificate-progress" role="progressbar" aria-label="Internship completion" aria-valuemin="0" aria-valuemax="6" aria-valuenow="3">
              <span />
            </div>
            <small>3 of 6 tasks completed</small>
          </div>
        </section>
      )}
      {page === 'Progress' && (
        <section className="panel certificate-card">
          <span className="certificate-icon"><ChartNoAxesColumn size={23} /></span>
          <div>
            <h2>Halfway there</h2>
            <p>You have completed 3 of 6 tasks. Finish the current Secure Application Integration task to continue.</p>
            <div className="certificate-progress" role="progressbar" aria-label="Internship completion" aria-valuemin="0" aria-valuemax="6" aria-valuenow="3">
              <span />
            </div>
            <small>3 of 6 tasks completed</small>
          </div>
        </section>
      )}
    </main>
  );
}
