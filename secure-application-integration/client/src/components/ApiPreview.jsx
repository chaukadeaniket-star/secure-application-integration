import { useState } from 'react';
import { Braces, Check, Clipboard, Code2, RefreshCw } from 'lucide-react';
import { useInternships } from '../hooks/useInternships.js';

export default function ApiPreview() {
  const { internships, loading, error, reload } = useInternships();
  const [tab, setTab] = useState('Response (200)');
  const [copied, setCopied] = useState(false);
  const response = loading
    ? '{\n  "status": "loading"\n}'
    : error
      ? JSON.stringify({ error: { message: error } }, null, 2)
      : JSON.stringify({ data: internships.slice(0, 2), meta: { count: internships.length } }, null, 2);

  async function copyEndpoint() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin.replace(':5173', ':4000')}/api/internships`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="panel api-panel">
      <div className="panel-heading api-heading">
        <div className="heading-icon code-heading"><Code2 size={20} /></div>
        <div><h2>API Preview</h2><p>Use this endpoint to fetch internship data. You can test it in your frontend.</p></div>
        <button className="outline-button copy-button" onClick={copyEndpoint}>
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          {copied ? 'Copied' : 'Copy Endpoint'}
        </button>
      </div>
      <div className="endpoint-row"><span className="method-tag">GET</span><code>/api/internships</code><button onClick={() => reload()} aria-label="Reload API data"><RefreshCw size={15} /></button></div>
      <div className="api-lower">
        <div className="response-card">
          <div className="tab-row">
            {['Response (200)', 'Parameters', 'Headers'].map((name) => (
              <button className={tab === name ? 'selected' : ''} key={name} onClick={() => setTab(name)}>{name}</button>
            ))}
          </div>
          <div className="code-window">
            {tab === 'Response (200)' ? (
              <pre><code>{response}</code></pre>
            ) : tab === 'Parameters' ? (
              <pre><code>search: optional text filter{'\n'}location: optional location filter</code></pre>
            ) : (
              <pre><code>Content-Type: application/json{'\n'}X-Request-Id: unique request identifier</code></pre>
            )}
            <span className="code-language"><Braces size={13} /> JSON</span>
          </div>
        </div>
        <div className="api-note">
          <div className="note-title"><span className="flask-icon">⌁</span><div><strong>Live API response</strong><span>{loading ? 'Loading internships…' : error ? 'Could not reach the API' : `${internships.length} opportunities available`}</span></div></div>
          {error ? <div className="api-error" role="alert">{error}</div> : <div className="api-success"><Check size={14} /> {loading ? 'Fetching data' : 'Connection healthy'}</div>}
          <button className="text-button" onClick={() => reload()}><RefreshCw size={13} /> Refresh data</button>
        </div>
      </div>
    </section>
  );
}
