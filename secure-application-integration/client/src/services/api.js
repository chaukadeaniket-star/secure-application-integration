const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(payload?.error?.message || 'The request could not be completed.');
      error.status = response.status;
      error.details = payload?.error?.details || [];
      throw error;
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('The server returned an invalid response. Please try again.');
    }
    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Could not reach the internship API. Check your connection and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const api = {
  getInternships: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const result = await request(`/internships${query ? `?${query}` : ''}`);
    if (!Array.isArray(result.data) || !Array.isArray(result.meta?.categories)) {
      throw new Error('The internships response was incomplete. Please retry.');
    }
    return result;
  },
  getInternship: async (id) => {
    const result = await request(`/internships/${encodeURIComponent(id)}`);
    if (!result.data || typeof result.data !== 'object' || Array.isArray(result.data)) {
      throw new Error('The internship response was incomplete. Please retry.');
    }
    return result;
  },
  getInternshipCategories: async () => {
    const result = await request('/internships');
    return result.meta.categories;
  },
  submitApplication: (token, application) => request('/applications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(application)
  }),
  getMyApplications: (token) => request('/applications/mine', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getApplicationsForReview: (token, reviewKey) => request('/applications/review', {
    headers: { Authorization: `Bearer ${token}`, 'X-Review-Key': reviewKey }
  }),
  reviewApplication: (token, reviewKey, applicationId, status) => request(`/applications/${encodeURIComponent(applicationId)}/review`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'X-Review-Key': reviewKey },
    body: JSON.stringify({ status })
  }),
  register: (account) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(account)
  }),
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getSession: (token) => request('/auth/session', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  logout: (token) => request('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  }),
  getTaskSubmission: (token) => request('/submissions/task-04', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  submitTask: (token, submission, files = []) => {
    const body = new FormData();
    body.append('taskId', submission.taskId);
    if (submission.githubUrl) body.append('githubUrl', submission.githubUrl);
    files.forEach((file) => body.append('files', file));
    return request('/submissions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body
    });
  },
  downloadTaskSubmissionFile: async (token, fileId) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/files/${encodeURIComponent(fileId)}`, {
        signal: controller.signal,
        headers: { Accept: 'application/octet-stream', Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error?.message || 'Could not download the submission file.');
      }
      return response.blob();
    } finally {
      window.clearTimeout(timeoutId);
    }
  },
  getHealth: () => request('/health')
};

export { API_BASE_URL };
