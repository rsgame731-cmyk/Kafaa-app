import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WilayaSelect } from '../components/WilayaSelect';
import { PasswordStrengthInput, evaluatePasswordStrength } from '../components/PasswordStrengthInput';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Check, User, Briefcase, GraduationCap, Sparkles, Building, ArrowLeft, Mail, MapPin } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { registerUser, setActiveTab } = useApp();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Conversational Form State
  const [selectedRole, setSelectedRole] = useState<'Professional' | 'Student' | 'Job Seeker' | 'Freelancer' | 'Entrepreneur'>('Professional');
  const [selectedWilaya, setSelectedWilaya] = useState('Algiers');
  const [city, setCity] = useState('Bab Ezzouar');
  const [field, setField] = useState('Software Engineering');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stepError, setStepError] = useState('');

  const roles = [
    { id: 'Professional' as const, label: 'Professional / Engineer', desc: 'Working in enterprise, energy or technology industry', Icon: Briefcase },
    { id: 'Student' as const, label: 'Student / Recent Graduate', desc: 'University student or recent university graduate', Icon: GraduationCap },
    { id: 'Job Seeker' as const, label: 'Job Seeker', desc: 'Actively seeking engineering or corporate roles in Algeria', Icon: User },
    { id: 'Freelancer' as const, label: 'Freelancer / Consultant', desc: 'Providing independent expert services in DZD', Icon: Sparkles },
    { id: 'Entrepreneur' as const, label: 'Entrepreneur / Founder', desc: 'Building a startup or innovative business in Algeria', Icon: Building }
  ];

  const fieldSuggestions = [
    'Software Engineering',
    'Energy & Petroleum',
    'UI/UX & Product Design',
    'Cybersecurity',
    'Finance & Accounting',
    'Civil Engineering'
  ];

  const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

  const handleNextStep = () => {
    setStepError('');

    // Step 1: Role
    if (currentStep === 1 && !selectedRole) {
      setStepError('Please select what describes you best.');
      return;
    }

    // Step 2: Location
    if (currentStep === 2 && (!selectedWilaya || !city.trim())) {
      setStepError('Please enter your Wilaya and City / Commune.');
      return;
    }

    // Step 3: Field
    if (currentStep === 3 && !field.trim()) {
      setStepError('Please enter your primary field or specialization.');
      return;
    }

    // Step 4: Name
    if (currentStep === 4 && (!firstName.trim() || !lastName.trim())) {
      setStepError('Please enter both your first and last name.');
      return;
    }

    // Step 5: Password
    if (currentStep === 5) {
      const pStrength = evaluatePasswordStrength(password);
      if (password.length < 8) {
        setStepError('Password must be at least 8 characters long.');
        return;
      }
      if (pStrength.score < 2) {
        setStepError('Please choose a stronger password.');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setActiveTab('welcome');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (!email.trim() || !isValidEmail(email)) {
      setStepError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        wilaya: selectedWilaya,
        city: city.trim() || 'Algiers',
        role: selectedRole
      });
    } catch (err: any) {
      setStepError(err.message || 'Registration failed. Email address may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-6 px-4 max-w-md mx-auto flex flex-col justify-between animate-view-transition pb-20">
      {/* Top Navigation & Step Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            className="p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors flex items-center gap-1 text-xs btn-press"
          >
            <ArrowLeft className="w-4 h-4 rtl-mirror" />
            <span>{t('back')}</span>
          </button>

          <span className="text-xs font-mono tracking-wider text-brand-bronze font-semibold">
            {t('step')} {currentStep} {t('of')} {totalSteps}
          </span>
        </div>

        {/* Animated Segmented Progress Bar */}
        <div className="grid grid-cols-6 gap-1.5 h-1.5 w-full bg-brand-surface rounded-full p-0.5 border border-brand-border/60">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-full rounded-full transition-all duration-300 ${
                s <= currentStep ? 'bg-brand-bronze shadow-bronze-glow' : 'bg-brand-border/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Error Banner */}
      {stepError && (
        <div className="p-3 my-3 bg-rose-950/90 border border-rose-500/40 rounded-input text-xs text-rose-200 animate-fade-scale">
          {stepError}
        </div>
      )}

      {/* STEP CONTENT CONTAINER */}
      <div className="my-auto py-6 space-y-5">
        {/* STEP 1: ROLE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                What describes you best?
              </h2>
              <p className="text-xs text-brand-muted">
                Select your current professional status in Algeria.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                const IconComp = r.Icon;
                return (
                  <Card
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    aria-selected={isSelected}
                    className={`flex items-center justify-between p-4 cursor-pointer btn-press transition-all duration-200 ${
                      isSelected
                        ? 'border-2 border-brand-bronze bg-brand-bronze/15 shadow-bronze-glow scale-[1.02]'
                        : 'border border-brand-border/80 bg-brand-surface hover:border-brand-bronze/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-full transition-colors ${
                        isSelected ? 'bg-brand-bronze text-brand-dark font-bold shadow-md' : 'bg-brand-dark text-brand-bronze border border-brand-border/60'
                      }`}>
                        <IconComp className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-brand-cream font-bold' : 'text-brand-cream/90'}`}>
                          {r.label}
                        </h3>
                        <p className="text-xs text-brand-muted leading-tight mt-0.5">{r.desc}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-brand-bronze bg-brand-bronze text-brand-dark' : 'border-brand-border bg-transparent'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                Where are you based?
              </h2>
              <p className="text-xs text-brand-muted">
                Kafa'a connects professionals across all 58 Wilayas of Algeria.
              </p>
            </div>

            <div className="space-y-3.5 pt-3">
              <WilayaSelect
                label={t('wilaya')}
                value={selectedWilaya}
                onChange={setSelectedWilaya}
              />

              <Input
                label={t('city')}
                placeholder="e.g. Bab Ezzouar, Oran, Constantine"
                icon={<MapPin className="w-4 h-4" />}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 3: SPECIALIZATION */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                What is your specialization?
              </h2>
              <p className="text-xs text-brand-muted">
                Enter your primary field or industry expertise.
              </p>
            </div>

            <div className="space-y-3.5 pt-3">
              <Input
                label={t('specialization')}
                placeholder="e.g. Software Engineering, Energy, UI/UX"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-brand-muted uppercase tracking-wider">
                  Popular Fields
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {fieldSuggestions.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setField(f)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors btn-press ${
                        field === f
                          ? 'bg-brand-bronze text-brand-cream font-semibold shadow-bronze-glow'
                          : 'bg-brand-surface border border-brand-border/80 text-brand-muted hover:text-brand-cream'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FULL NAME */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                What is your name?
              </h2>
              <p className="text-xs text-brand-muted">
                Your name will be visible to Algerian recruiters and professionals.
              </p>
            </div>

            <div className="space-y-3.5 pt-3">
              <Input
                label={t('first_name')}
                placeholder="Amine"
                icon={<User className="w-4 h-4" />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                label={t('last_name')}
                placeholder="Benaissa"
                icon={<User className="w-4 h-4" />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 5: PASSWORD WITH LIVE STRENGTH METER */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                Create a secure password
              </h2>
              <p className="text-xs text-brand-muted">
                Protect your Kafa'a professional identity.
              </p>
            </div>

            <div className="pt-2">
              <PasswordStrengthInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label={t('password')}
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>
        )}

        {/* STEP 6: EMAIL & FINAL CONFIRMATION */}
        {currentStep === 6 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fade-scale">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-brand-cream font-brand-display">
                What is your email address?
              </h2>
              <p className="text-xs text-brand-muted">
                We will send account updates and network notifications here.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <Input
                label={t('email')}
                type="email"
                placeholder="amine@company.dz"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Summary Card */}
              <div className="p-4 rounded-card bg-brand-surface border border-brand-border/80 space-y-2">
                <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-xs font-semibold text-brand-cream">{firstName} {lastName}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-brand-bronze/20 text-brand-bronze rounded-full font-medium">{selectedRole}</span>
                </div>
                <div className="text-[11px] text-brand-muted space-y-1">
                  <p>📍 Location: <span className="text-brand-cream">{selectedWilaya}, {city}</span></p>
                  <p>💼 Specialization: <span className="text-brand-cream">{field}</span></p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                {t('create_account')}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* BOTTOM ACTION BAR FOR STEPS 1 to 5 */}
      {currentStep < totalSteps && (
        <div className="pt-4 border-t border-brand-border/40">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNextStep}
          >
            {t('continue')}
          </Button>
        </div>
      )}
    </div>
  );
};
