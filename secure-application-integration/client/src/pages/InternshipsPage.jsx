import { useState } from 'react';
import { ArrowRight, BriefcaseBusiness, MapPin, RefreshCw, Search } from 'lucide-react';
import { useInternships } from '../hooks/useInternships.js';

export default function InternshipsPage({ onApply, onViewTasks }) {
  const { internships, categories, loading, error, reload } = useInternships();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  function searchInternships(event) {
    event.preventDefault();
    reload({ search: search.trim(), location: location.trim(), category });
  }

  return (
    <main className="page-content internships-page">
      <div className="page-title">
        <div className="title-badge"><BriefcaseBusiness size={24} /></div>
        <div><h1>Explore internships</h1><p>Search opportunities by role, company, skill, or location.</p></div>
      </div>
      <form className="internship-search panel" onSubmit={searchInternships}>
        <label><span>Role, company, or skill</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. frontend, design, product" /></label>
        <label><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Any location or remote" /></label>
        <label><span>Internship track</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All tracks</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <button className="primary-inline-button" type="submit" disabled={loading}><Search size={16} /> Search</button>
      </form>

      <div className="internship-results-heading">
        <div><h2>Available opportunities</h2><p>{loading ? 'Searching internships…' : error || `${internships.length} matching internships`}</p></div>
        <button className="outline-button" type="button" onClick={() => reload({ search: search.trim(), location: location.trim(), category })} disabled={loading}><RefreshCw size={14} /> Refresh</button>
      </div>

      {error ? (
        <section className="panel internship-empty" role="alert">
        <p>{error}</p><button className="outline-button" type="button" onClick={() => reload({ search: search.trim(), location: location.trim(), category })}>Try again</button>
        </section>
      ) : !loading && internships.length === 0 ? (
        <section className="panel internship-empty"><h2>No matching internships</h2><p>Try a broader role or location search.</p></section>
      ) : (
        <section className="internship-results" aria-live="polite">
          {internships.map((internship) => (
            <article className="panel internship-card" key={internship.id}>
              <div className="internship-card-heading">
                <span className="internship-company-mark">{internship.company.slice(0, 1)}</span>
                <div><h3>{internship.title}</h3><p>{internship.company}</p></div>
                <span className="internship-category">{internship.category}</span>
              </div>
              <p className="internship-description">{internship.description}</p>
              <div className="internship-skills" aria-label="Skills covered">{internship.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="internship-meta"><span><MapPin size={14} /> {internship.location}</span><span>{internship.duration}</span><strong>₹{internship.stipend.toLocaleString('en-IN')} / month</strong></div>
              <div className="internship-card-actions">
                <button className="outline-button" type="button" onClick={() => onViewTasks(internship)}>View tasks <ArrowRight size={14} /></button>
                <button className="primary-inline-button" type="button" onClick={() => onApply(internship)}>Apply now</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
