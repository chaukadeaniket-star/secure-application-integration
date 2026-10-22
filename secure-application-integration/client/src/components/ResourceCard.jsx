import { ArrowUpRight, BookOpen, Braces, ClipboardCheck, FileText, Download } from 'lucide-react';

const resources = [
  { title: 'Step-by-step task guide', subtitle: 'Beginner guide with passing checklist', icon: BookOpen, href: '/task-04-guide.md', download: 'task-04-guide.md' },
  { title: 'Starter checklist', subtitle: 'Download and mark each required step', icon: ClipboardCheck, href: '/task-04-checklist.txt', download: 'task-04-checklist.txt' },
  { title: 'Internship board product brief', subtitle: 'Requirements, acceptance criteria, and API contract', icon: FileText, href: '/task-04-product-brief.md', download: 'task-04-product-brief.md' },
  { title: 'Integration test records (JSON)', subtitle: 'Predictable records for loading, filtering, and applications', icon: Braces, href: '/integration-test-records.json', download: 'integration-test-records.json' }
];

export default function ResourceCard({ compact = false }) {
  return (
    <section className={`panel resources-panel ${compact ? 'compact-resources' : ''}`}>
      <div className="panel-heading">
        <div className="heading-icon resources-heading"><BookOpen size={19} /></div>
        <div><h2>Resources</h2><p>Use these materials before starting the task.</p></div>
      </div>
      {resources.map(({ title, subtitle, icon: Icon, href, download }) => (
        <a className="resource-link" href={href} download={download} key={title}>
          <span className="resource-icon"><Icon size={17} /></span>
          <span className="resource-copy"><strong>{title}</strong><small>{subtitle}</small></span>
          {compact ? <Download size={15} className="resource-action" /> : <ArrowUpRight size={15} className="resource-action" />}
        </a>
      ))}
    </section>
  );
}
