import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Award, FileText } from 'lucide-react';

export const CareerStateView: React.FC = () => {
  const { user, setActiveTab } = useApp();

  return (
    <div className="min-h-[85vh] py-8 px-6 max-w-md mx-auto flex flex-col justify-between text-center animate-fade-in">
      {/* Top Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-bronze">
          Career Milestone
        </span>
        <h1 className="text-2xl font-bold text-brand-cream">
          Your professional journey starts here.
        </h1>
        <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
          Complete your profile details to unlock premium job matches across Algiers, Oran & Constantine.
        </p>
      </div>

      {/* Large Circular Progress Graphic */}
      <div className="my-8 flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Subtle Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-brand-bronze/10 blur-xl animate-pulse" />

          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-brand-surface"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-brand-bronze transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - user.profileCompletion / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Inner Percentage */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-brand-cream">{user.profileCompletion}%</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <Card className="bg-brand-surface p-4 text-left rtl:text-right space-y-3 border-brand-border/60">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-brand-cream">Verified Algerian Wilaya location</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-brand-cream">Degree from ESI / USTHB</span>
        </div>
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-brand-bronze shrink-0" />
          <span className="text-xs text-brand-muted">Add 3 more technical skills (Missing)</span>
        </div>
      </Card>

      {/* Single Dominant Primary CTA */}
      <div className="pt-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setActiveTab('profile')}
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
};
