import { Check, ChevronDown, ChevronRight, Circle, Database, FileText, Monitor, Shield } from 'lucide-react';

const icons = [Database, Monitor, FileText, Shield];

export default function ChecklistItem({ number, title, description, status, expanded, onToggle }) {
  const Icon = icons[number - 1] || Circle;
  const isComplete = status === 'Completed';
  return (
    <article className={`checklist-item ${expanded ? 'expanded' : ''}`}>
      <span className={`item-number ${isComplete ? 'number-complete' : ''}`}>
        {isComplete ? <Check size={15} /> : number}
      </span>
      <button className="checklist-main" onClick={onToggle} aria-expanded={expanded}>
        <span className={`check-icon icon-tone-${number}`}><Icon size={20} strokeWidth={2.4} /></span>
        <span className="checklist-copy"><strong>{title}</strong><span>{description}</span></span>
        <span className={`status-pill ${status === 'In progress' ? 'status-progress' : isComplete ? 'status-complete' : 'status-idle'}`}>
          {isComplete ? <Check size={13} /> : status === 'In progress' ? <span className="spinner" /> : <Circle size={12} fill="currentColor" />}
          {status}
        </span>
        {expanded ? <ChevronDown className="expand-icon" size={16} /> : <ChevronRight className="expand-icon" size={16} />}
      </button>
      {expanded && <div className="checklist-detail">{description} Use the API preview and test panel below to verify this requirement.</div>}
    </article>
  );
}
