import { useState } from 'react';
import { Check, FlaskConical, Play, RotateCw } from 'lucide-react';
import { api } from '../services/api.js';

export default function TestRunner() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  async function runTests() {
    setRunning(true);
    setResult(null);
    try {
      const response = await api.getHealth();
      setResult({ passed: response.status === 'ok' ? 1 : 0, total: 1, label: 'Latest API check just now' });
    } catch (error) {
      setResult({ passed: 0, total: 1, label: error.message });
    } finally {
      setRunning(false);
    }
  }

  const passed = result?.passed ?? 0;
  return (
    <div className="test-card">
      <div className="test-title"><span className="test-icon"><FlaskConical size={17} /></span><div><strong>Test your integration</strong><span>Check the live API connection.</span></div></div>
      <div className="test-stats"><strong>API health check</strong><span>{result ? `${passed} / 1 passed` : 'Ready to run'}</span></div>
      <div className="test-progress"><i style={{ width: `${passed / 1 * 100}%` }} /></div>
      <button className="run-button" onClick={runTests} disabled={running}>
        {running ? <RotateCw className="spin-animation" size={15} /> : <Play size={15} fill="currentColor" />}
        {running ? 'Checking…' : 'Run tests again'}
      </button>
      <div className={`latest-run ${result && passed < 1 ? 'run-failed' : ''}`}>
        {result && passed < 1 ? <span className="failed-dot">!</span> : result ? <Check size={13} /> : <span className="failed-dot">i</span>}
        {result?.label || 'No check run yet'}
      </div>
    </div>
  );
}
