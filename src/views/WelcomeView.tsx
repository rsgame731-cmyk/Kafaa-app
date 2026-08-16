import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { WilayaSelect } from '../components/WilayaSelect';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User, MapPin, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { loginUser, registerUser, setActiveTab, showToast } = useApp();
  const { t } = useLanguage();

  const [authMode, setAuthMode] = useState<'none' | 'login' | 'register'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regWilaya, setRegWilaya] = useState('Algiers');
  const [regCity, setRegCity] = useState('Bab Ezzouar');
  const [regRole, setRegRole] = useState('Professional');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !isValidEmail(loginEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser({ email: loginEmail.trim(), password: loginPassword });
      setAuthMode('none');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter your first and last name.');
      return;
    }
    if (!regEmail.trim() || !isValidEmail(regEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        wilaya: regWilaya,
        city: regCity.trim() || 'Algiers',
        role: regRole
      });
      setAuthMode('none');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-between text-center px-6 py-8 animate-view-transition max-w-md mx-auto">
      {/* Top Status / Branding */}
      <div className="pt-4 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-bronze/60 flex items-center justify-center text-brand-bronze text-2xl font-bold shadow-bronze-glow mb-3 bronze-glow-hover">
          ك
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-cream font-sans">
          Kafa'a <span className="text-brand-bronze text-sm font-normal">كفاءة</span>
        </h1>
        <p className="text-xs text-brand-muted uppercase tracking-widest mt-1">
          Algerian Professional Network
        </p>
      </div>

      {/* Central Hero Visual */}
      <div className="my-8 relative group w-full max-w-[280px]">
        <div className="absolute inset-0 bg-brand-bronze/10 rounded-full blur-2xl group-hover:bg-brand-bronze/20 transition-all duration-500" />
        <div className="relative rounded-card overflow-hidden border border-brand-border/60 bg-brand-surface p-2 shadow-elevated">
          <img
            src="/kafaa_hero_symbol.jpg"
            alt="Kafa'a Executive Visual Symbol"
            className="w-full h-auto rounded-card object-cover aspect-square hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 border border-brand-bronze/30 rounded-card pointer-events-none" />
        </div>
      </div>

      {/* Main Tagline & CTAs */}
      <div className="w-full space-y-4 pb-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-brand-cream">
            {t('brand_tagline')}
          </h2>
          <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
            Connect with top Algerian engineers, recruiters, businesses & freelancers across all 58 Wilayas.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setActiveTab('onboarding')}
          >
            Create an Account
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              setErrorMessage('');
              setAuthMode('login');
            }}
          >
            Already have an account? Sign In
          </Button>
        </div>
      </div>

      {/* LOGIN MODAL */}
      <Modal
        isOpen={authMode === 'login'}
        onClose={() => setAuthMode('none')}
        title="Sign In to Kafa'a"
      >
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <p className="text-xs text-brand-muted">
            Access your Algerian professional profile, messages & opportunities.
          </p>

          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-input flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.dz"
            icon={<Mail className="w-4 h-4" />}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          <div className="pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
            <button
              type="button"
              onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
              className="text-xs text-brand-bronze hover:underline text-center mt-1"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </Modal>

      {/* REGISTER MODAL */}
      <Modal
        isOpen={authMode === 'register'}
        onClose={() => setAuthMode('none')}
        title="Join Kafa'a Community"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          <p className="text-xs text-brand-muted">
            Create your account to connect with Algerian professionals.
          </p>

          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-input flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <Input
              label="First Name"
              placeholder="Amine"
              icon={<User className="w-4 h-4" />}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Benaissa"
              icon={<User className="w-4 h-4" />}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Verified Email"
            type="email"
            placeholder="amine@domain.dz"
            icon={<Mail className="w-4 h-4" />}
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-2.5">
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 chars"
              icon={<Lock className="w-4 h-4" />}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat"
              icon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <WilayaSelect
            label="Wilaya (Location)"
            value={regWilaya}
            onChange={setRegWilaya}
          />

          <Input
            label="City / Commune"
            placeholder="e.g. Bab Ezzouar"
            icon={<MapPin className="w-4 h-4" />}
            value={regCity}
            onChange={(e) => setRegCity(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-brand-cream mb-1">
              Professional Status
            </label>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border text-brand-cream text-xs rounded-input p-3 focus:outline-none focus:border-brand-bronze"
            >
              <option value="Professional">Professional / Engineer</option>
              <option value="Student">Student / Graduate</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Freelancer">Freelancer / Consultant</option>
              <option value="Entrepreneur">Entrepreneur / Founder</option>
            </select>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

