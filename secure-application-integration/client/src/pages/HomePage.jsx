import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function HomePage({ onAuthenticate, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const submittedEmail = formData.get('email');

    if (mode === 'register' && password !== formData.get('confirmPassword')) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setNotice('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const name = formData.get('name')?.trim();
        await onAuthenticate({ mode, name, email: submittedEmail, password });
        setEmail(submittedEmail);
        setMode('login');
        setNotice('Account created. Log in with your new credentials to continue.');
      } else {
        await onAuthenticate({ mode, email: submittedEmail, password });
      }
    } catch (requestError) {
      setError(requestError.message || 'Could not complete the request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="home-page">
      <header className="home-nav">
        <a className="home-brand" href="#home" aria-label="Edvyro Internship home">
          <img src={logo} alt="Edvyro Internship" />
        </a>
        <nav className="home-nav-links" aria-label="Home navigation">
          <a href="#benefits">Why Edvyro</a>
          <a href="#auth" className="home-nav-cta">Get started <ArrowRight size={15} /></a>
        </nav>
      </header>

      <section className="home-hero" id="home">
        <div className="home-copy">
          <span className="home-eyebrow"><GraduationCap size={16} /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Turn your skills into <span>real experience.</span></h1>
          <p className="home-description">Build practical projects, grow your confidence, and take the next step in your technology career with Edvyro Internship.</p>
          <div className="home-benefits" id="benefits">
            <div><CheckCircle2 size={18} /><span>Guided, practical tasks</span></div>
            <div><CheckCircle2 size={18} /><span>Learn by building real projects</span></div>
            <div><CheckCircle2 size={18} /><span>Track your progress in one place</span></div>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-icon"><BookOpen size={19} /></span>
            <div><strong>Learn at your own pace</strong><span>Clear steps, useful resources, and hands-on practice.</span></div>
          </div>
        </div>

        <section className="auth-card" id="auth" aria-labelledby="auth-title">
          <div className="auth-card-heading">
            <span className="auth-shield"><ShieldCheck size={20} /></span>
            <span className="auth-eyebrow">EDVYRO INTERNSHIP</span>
            <h2 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>{mode === 'login' ? 'Sign in to continue your learning journey.' : 'Join us and start building your skills.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'selected' : ''} onClick={() => changeMode('login')}>Log in</button>
            <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'selected' : ''} onClick={() => changeMode('register')}>Register</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label>
                Full name
                <input name="name" type="text" placeholder="Your name" autoComplete="name" minLength={2} maxLength={80} required />
              </label>
            )}
            <label>
              Email address
              <input name="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input name="password" type="password" placeholder="At least 8 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required />
            </label>
            {mode === 'register' && (
              <label>
                Confirm password
                <input name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" minLength={8} required />
              </label>
            )}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-success" role="status">{notice}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Log in to your workspace' : 'Create account'} <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-demo-note">Your account is validated by the internship API. This learning demo stores accounts in memory.</p>
        </section>
      </section>
      <footer className="home-footer">© 2026 Edvyro Internship <span>Learn by doing. Grow by building.</span></footer>
    </main>
  );
}
