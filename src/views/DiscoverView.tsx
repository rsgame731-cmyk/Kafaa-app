import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { Briefcase, Users, Building2, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

export const DiscoverView: React.FC = () => {
  const { setActiveTab } = useApp();

  const categories: { id: NavTab; title: string; subtitle: string; count: string; icon: React.ReactNode }[] = [
    {
      id: 'jobs',
      title: 'Jobs & Opportunities',
      subtitle: 'Find your next high-growth opportunity in Algeria',
      count: '140+ Active Jobs',
      icon: <Briefcase className="w-6 h-6 text-brand-bronze" />
    },
    {
      id: 'network',
      title: 'Professionals & Talent',
      subtitle: 'Connect with Algerian tech leads, designers & engineers',
      count: '12,500+ Talents',
      icon: <Users className="w-6 h-6 text-brand-bronze" />
    },
    {
      id: 'company',
      title: 'Companies & Enterprises',
      subtitle: 'Explore verified companies from Algiers to Hassi Messaoud',
      count: '480+ Companies',
      icon: <Building2 className="w-6 h-6 text-brand-bronze" />
    },
    {
      id: 'services',
      title: 'Services & Freelancing',
      subtitle: 'Hire verified Algerian experts in DZD',
      count: '890+ Services',
      icon: <Wrench className="w-6 h-6 text-brand-bronze" />
    }
  ];

  return (
    <div className="min-h-[85vh] py-6 px-4 max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Screen Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold text-brand-cream">
          Discover
        </h1>
        <p className="text-xs text-brand-muted">
          Find what's next in the Algerian professional ecosystem.
        </p>
      </div>

      {/* Category Cards */}
      <div className="space-y-3.5">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            hoverable
            onClick={() => setActiveTab(cat.id)}
            className="flex items-center justify-between p-5 group border-brand-border/80 hover:border-brand-bronze/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-brand-dark border border-brand-border flex items-center justify-center group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-brand-cream group-hover:text-brand-bronze transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-brand-muted leading-tight">
                  {cat.subtitle}
                </p>
                <span className="inline-block text-[10px] font-semibold text-brand-bronze uppercase tracking-wider pt-1">
                  {cat.count}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-bronze group-hover:translate-x-1 transition-all" />
          </Card>
        ))}
      </div>

      {/* AI Career Assistant Feature Spotlight Card */}
      <Card
        hoverable
        onClick={() => setActiveTab('career_ai')}
        className="bg-gradient-to-r from-brand-surface to-brand-elevated border-brand-bronze/40 p-5"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-bronze" />
              <h4 className="text-sm font-semibold text-brand-cream">Career AI Assistant</h4>
            </div>
            <p className="text-xs text-brand-muted">
              Get automated CV feedback & job matching for the Algerian market.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Try AI
          </Button>
        </div>
      </Card>

      {/* Primary CTA */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setActiveTab('home')}
        >
          Explore Professional Home
        </Button>
      </div>
    </div>
  );
};
