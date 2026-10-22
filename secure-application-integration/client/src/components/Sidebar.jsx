import {
  Award, BookOpen, BriefcaseBusiness, ChartNoAxesColumn, House, ListChecks, Send, ShieldCheck, UserCheck
} from 'lucide-react';
import logo from '../assets/logo.svg';

const items = [
  { label: 'Dashboard', icon: House },
  { label: 'Internships', icon: BriefcaseBusiness },
  { label: 'Applications', icon: Send },
  { label: 'Review', icon: UserCheck },
  { label: 'Tasks', icon: ListChecks },
  { label: 'Progress', icon: ChartNoAxesColumn },
  { label: 'Resources', icon: BookOpen },
  { label: 'Submissions', icon: Send },
  { label: 'Certificates', icon: Award }
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onNavigate('Dashboard'); }}>
        <img src={logo} alt="Edvyro Internship" />
      </a>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map(({ label, icon: Icon }) => (
          <button
            className={`nav-item ${activePage === label ? 'active' : ''}`}
            key={label}
            onClick={() => onNavigate(label)}
            aria-current={activePage === label ? 'page' : undefined}
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="sidebar-foot-icon"><ShieldCheck size={19} /></div>
        <div><strong>Keep learning</strong><span>You're doing great!</span></div>
      </div>
    </aside>
  );
}
