import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import HomePage from './pages/HomePage.jsx';
import InternshipsPage from './pages/InternshipsPage.jsx';
import InternshipTrackPage from './pages/InternshipTrackPage.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import ReviewApplicationsPage from './pages/ReviewApplicationsPage.jsx';
import Tasks from './pages/Tasks.jsx';
import PortalPage from './pages/PortalPage.jsx';
import SecureIntegration from './pages/SecureIntegration.jsx';
import { api } from './services/api.js';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activePage, setActivePage] = useState('Dashboard');
  const [notice, setNotice] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [activity, setActivity] = useState(() => Array(7).fill(0));

  function recordActivity() {
    const todayIndex = (new Date().getDay() + 6) % 7;
    setActivity((current) => current.map((count, index) => index === todayIndex ? count + 1 : count));
  }

  useEffect(() => {
    let storedToken = '';
    try {
      storedToken = window.localStorage.getItem('edvyro-session') || '';
    } catch {
      setAuthError('Your browser could not access saved sign-in details. Please log in again.');
    }
    if (!storedToken) {
      setCheckingSession(false);
      return;
    }

    api.getSession(storedToken)
      .then((result) => {
        setToken(storedToken);
        setDisplayName(result.data.user.name);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        setAuthError(error.message || 'Your saved session expired. Please log in again.');
        try {
          window.localStorage.removeItem('edvyro-session');
        } catch {
          setAuthError('Your saved session expired. Please log in again; browser storage could not be cleared.');
        }
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleAuthentication(credentials) {
    if (credentials.mode === 'register') {
      await api.register({ name: credentials.name, email: credentials.email, password: credentials.password });
      return;
    }

    const result = await api.login({ email: credentials.email, password: credentials.password });
    setToken(result.data.token);
    setDisplayName(result.data.user.name);
    setIsAuthenticated(true);
    setAuthError('');
    recordActivity();
    try {
      window.localStorage.setItem('edvyro-session', result.data.token);
    } catch {
      showNotice('You are signed in, but this browser cannot remember your session after a reload.');
    }
  }

  async function handleLogout() {
    const currentToken = token;
    setIsAuthenticated(false);
    setToken('');
    setActivePage('Dashboard');
    try {
      window.localStorage.removeItem('edvyro-session');
    } catch {
      showNotice('Signed out, but the browser could not clear the saved session.');
    }
    try {
      if (currentToken) await api.logout(currentToken);
    } catch (error) {
      showNotice(error.message || 'Signed out locally, but the server session could not be closed.');
    }
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3600);
  }

  if (checkingSession) {
    return <main className="auth-loading" role="status">Checking your saved session…</main>;
  }

  if (!isAuthenticated) {
    return <HomePage onAuthenticate={handleAuthentication} initialError={authError} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="app-main">
        <Header displayName={displayName} onLogout={handleLogout} />
        {activePage === 'Dashboard' ? (
          <Dashboard
            token={token}
            onExplore={() => setActivePage('Internships')}
            onApplications={() => setActivePage('Applications')}
            onOpenInternship={(internship) => {
              setSelectedTrack(internship);
              setActivePage('InternDashboard');
            }}
            displayName={displayName}
            activity={activity}
          />
        ) : activePage === 'Tasks' ? (
          <Tasks onOpenTask={() => setActivePage('SecureIntegration')} />
        ) : activePage === 'Internships' ? (
          <InternshipsPage onApply={(internship) => {
            setSelectedInternship(internship);
            setActivePage('Apply');
          }} onViewTasks={(internship) => {
            setSelectedTrack(internship);
            setActivePage('InternshipTrack');
          }} />
        ) : activePage === 'Apply' ? (
          <ApplyPage
            internship={selectedInternship}
            token={token}
            displayName={displayName}
            onBack={() => setActivePage('Internships')}
            onApplySuccess={recordActivity}
            onViewApplications={() => setActivePage('Applications')}
          />
        ) : activePage === 'Applications' ? (
          <ApplicationsPage
            token={token}
            onExplore={() => setActivePage('Internships')}
            onOpenInternship={(internship) => {
              setSelectedTrack(internship);
              setActivePage('InternDashboard');
            }}
          />
        ) : activePage === 'Review' ? (
          <ReviewApplicationsPage token={token} />
        ) : activePage === 'InternDashboard' ? (
          <InternshipTrackPage internship={selectedTrack} isApproved onBack={() => setActivePage('Dashboard')} onApply={(internship) => {
            setSelectedInternship(internship);
            setActivePage('Apply');
          }} />
        ) : activePage === 'InternshipTrack' ? (
          <InternshipTrackPage internship={selectedTrack} isApproved={false} onBack={() => setActivePage('Internships')} onApply={(internship) => {
            setSelectedInternship(internship);
            setActivePage('Apply');
          }} />
        ) : ['Resources', 'Submissions', 'Certificates', 'Progress'].includes(activePage) ? (
          <PortalPage page={activePage} onNotice={showNotice} token={token} onActivity={recordActivity} />
        ) : (
          <SecureIntegration onNotice={showNotice} token={token} selectedInternship={selectedInternship} onActivity={recordActivity} />
        )}
      </div>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
