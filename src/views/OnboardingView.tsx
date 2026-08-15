import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { WilayaSelect } from '../components/WilayaSelect';
import { useApp } from '../context/AppContext';
import { Check, User, Briefcase, GraduationCap, Sparkles, Building } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { setActiveTab, setUser, user } = useApp();
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Professional' | 'Job Seeker' | 'Freelancer' | 'Entrepreneur'>('Professional');
  const [selectedWilaya, setSelectedWilaya] = useState('Algiers');
  const [city, setCity] = useState('Bab Ezzouar');
  const [field, setField] = useState('Software Engineering');

  const roles = [
    { id: 'Professional', label: 'Professional', desc: 'Working in industry or enterprise', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'Student', label: 'Student / Graduate', desc: 'University student or recent graduate', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'Job Seeker', label: 'Job Seeker', desc: 'Actively searching for opportunities', icon: <User className="w-5 h-5" /> },
    { id: 'Freelancer', label: 'Freelancer / Consultant', desc: 'Providing independent expert services', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'Entrepreneur', label: 'Entrepreneur / Founder', desc: 'Building a startup or business in Algeria', icon: <Building className="w-5 h-5" /> }
  ] as const;

  const handleCompleteOnboarding = () => {
    setUser({
      ...user,
      role: selectedRole,
      wilaya: selectedWilaya,
      city: city || 'Algiers',
      headline: `${field} Specialist @ ${selectedWilaya}`
    });
    setActiveTab('discover');
  };

  return (
    <div className="min-h-[85vh] py-6 px-4 max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-bronze/10 border border-brand-bronze/30 text-brand-bronze text-xs font-semibold uppercase tracking-wider">
          Step 1 of 2
        </div>
        <h1 className="text-2xl font-bold text-brand-cream">
          Welcome to Kafa'a
        </h1>
        <p className="text-xs text-brand-muted">
          Build your professional identity native to Algeria.
        </p>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-medium uppercase tracking-wider text-brand-muted">
          What describes you best?
        </label>
        <div className="space-y-2.5">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <Card
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-bronze bg-brand-elevated shadow-bronze-glow'
                    : 'hover:border-brand-border/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-full ${isSelected ? 'bg-brand-bronze text-brand-cream' : 'bg-brand-dark text-brand-muted'}`}>
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-cream">{role.label}</h3>
                    <p className="text-xs text-brand-muted">{role.desc}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-brand-bronze bg-brand-bronze text-brand-cream' : 'border-brand-border'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Location Selector */}
      <div className="space-y-3 pt-2">
        <WilayaSelect
          label="Where are you based in Algeria?"
          value={selectedWilaya}
          onChange={setSelectedWilaya}
        />

        <Input
          label="City / Commune"
          placeholder="e.g. Bab Ezzouar, Es-Senia, El Khroub"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <Input
          label="Primary Field or Specialization"
          placeholder="e.g. Software Engineering, Energy, UI/UX, Finance"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCompleteOnboarding}
        >
          Continue to Discover
        </Button>
      </div>
    </div>
  );
};
