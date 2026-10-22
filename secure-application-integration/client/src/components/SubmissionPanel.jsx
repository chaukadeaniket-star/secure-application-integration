import { useEffect, useState } from 'react';
import { Check, Circle, Download, FileText, GitBranch, Send, Shield, Upload, X } from 'lucide-react';
import { api } from '../services/api.js';

const maxFiles = 5;
const maxFileSize = 10 * 1024 * 1024;
const acceptedFileTypes = '.pdf,.zip,.txt,.json,.png,.jpg,.jpeg';
const requirements = [
  { label: 'Integrated repository', description: 'Frontend + backend code', icon: GitBranch },
  { label: 'Test report', description: 'Unit/integration test results', icon: FileText },
  { label: 'Security checklist', description: 'Rate limits, headers, validation', icon: Shield }
];

export default function SubmissionPanel({ token, onActivity }) {
  const [checked, setChecked] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getTaskSubmission(token)
      .then((result) => {
        if (!active) return;
        setSubmission(result.data);
        if (result.data) setGithubUrl(result.data.githubUrl);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not load your submission status.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  function toggle(label) {
    setChecked((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  }

  function selectFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length > maxFiles) {
      setError(`Choose no more than ${maxFiles} files.`);
      return;
    }
    const oversizedFile = files.find((file) => file.size > maxFileSize);
    if (oversizedFile) {
      setError(`${oversizedFile.name} is larger than the 10 MB per-file limit.`);
      return;
    }
    setSelectedFiles(files);
    setError('');
  }

  async function downloadFile(file) {
    setDownloading(file.fileId);
    setError('');
    try {
      const blob = await api.downloadTaskSubmissionFile(token, file.fileId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) {
      setError(requestError.message || 'Could not download the submission file.');
    } finally {
      setDownloading('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (checked.length !== requirements.length) {
      setError('Complete every requirement before submitting.');
      return;
    }
    if (!githubUrl.trim() && selectedFiles.length === 0 && !submission?.files?.length) {
      setError('Add a GitHub repository link or upload at least one file.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.submitTask(token, { taskId: 'task-04', githubUrl: githubUrl.trim() }, selectedFiles);
      setSubmission(result.data);
      setSelectedFiles([]);
      onActivity?.();
    } catch (requestError) {
      setError(requestError.message || 'Could not submit your task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel submission-panel">
      <div className="submission-heading"><Upload size={19} /><div><h2>Submit this task</h2><p>Share your GitHub repository or upload your deliverables.</p></div></div>
      <div className="proof-note"><span><Check size={14} /></span><div><strong>One proof option is enough</strong><small>Use a GitHub link or upload up to 5 files (10 MB each).</small></div></div>
      <div className="requirements-list">
        {requirements.map(({ label, description, icon: Icon }) => {
          const done = checked.includes(label);
          return (
            <button type="button" className={`requirement ${done ? 'requirement-checked' : ''}`} key={label} onClick={() => toggle(label)} aria-pressed={done}>
              <Icon className="requirement-icon" size={18} />
              <span><strong>{label}</strong><small>{description}</small></span>
              {done ? <Check className="requirement-check" size={16} /> : <Circle className="requirement-circle" size={16} />}
            </button>
          );
        })}
      </div>
      <form className="task-submission-form" onSubmit={handleSubmit}>
        <label htmlFor="github-repo-url">GitHub repository URL <span className="submission-optional">Optional if you upload files</span></label>
        <input id="github-repo-url" type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} placeholder="https://github.com/you/project" />
        <label htmlFor="submission-files">Or upload task files</label>
        <input id="submission-files" type="file" accept={acceptedFileTypes} multiple onChange={selectFiles} aria-describedby="submission-file-help" />
        <small id="submission-file-help" className="submission-file-help">PDF, ZIP, TXT, JSON, PNG, or JPEG · 5 files maximum · 10 MB per file</small>
        {selectedFiles.length > 0 && (
          <ul className="selected-upload-list" aria-label="Files ready to upload">
            {selectedFiles.map((file, index) => (
              <li key={`${file.name}-${file.lastModified}`}>
                <span>{file.name} <small>({(file.size / 1024 / 1024).toFixed(2)} MB)</small></span>
                <button type="button" onClick={() => setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`}><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        {submission && <div className="submission-success" role="status">
          <p className="form-success">Submitted {new Date(submission.submittedAt).toLocaleDateString()}</p>
          {submission.githubUrl && <a href={submission.githubUrl} target="_blank" rel="noreferrer">View GitHub repository</a>}
          {submission.files?.map((file) => <button className="uploaded-file-link" type="button" key={file.fileId} onClick={() => downloadFile(file)} disabled={Boolean(downloading)}><Download size={13} /> {downloading === file.fileId ? 'Downloading…' : file.originalName}</button>)}
        </div>}
        {!submission && !loading && <button className="submit-task-button" type="submit" disabled={submitting || checked.length !== requirements.length}>{submitting ? 'Submitting…' : <><Send size={15} /> Submit task</>}</button>}
        {submission && <button className="submit-task-button" type="submit" disabled={submitting || checked.length !== requirements.length}>{submitting ? 'Uploading…' : 'Update submission'}</button>}
        {loading && <p className="submission-status" role="status">Checking submission status…</p>}
      </form>
    </section>
  );
}
