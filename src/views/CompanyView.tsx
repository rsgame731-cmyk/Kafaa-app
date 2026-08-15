import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { MOCK_COMPANIES, MOCK_JOBS } from '../data/algerianData';
import { Building2, MapPin, Users, Globe, ShieldCheck, Briefcase, Check } from 'lucide-react';

export const CompanyView: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>(MOCK_COMPANIES[0].id);
  const [isFollowing, setIsFollowing] = useState(false);

  const company = MOCK_COMPANIES.find(c => c.id === selectedCompId) || MOCK_COMPANIES[0];
  const companyJobs = MOCK_JOBS.filter(j => j.companyName.toLowerCase().includes(company.name.toLowerCase().split(' ')[0]));

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Selector pills for demo companies */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MOCK_COMPANIES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCompId(c.id);
              setIsFollowing(false);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCompId === c.id
                ? 'bg-brand-bronze text-brand-cream'
                : 'bg-brand-surface text-brand-muted border border-brand-border'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Company Header Card */}
      <Card className="bg-brand-surface border-brand-border p-6 text-center space-y-4">
        <div className="flex justify-center">
          <img
            src={company.logo}
            alt={company.name}
            className="w-20 h-20 rounded-card object-cover border-2 border-brand-border shadow-elevated"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl font-bold text-brand-cream">{company.name}</h1>
            {company.verified && <ShieldCheck className="w-5 h-5 text-brand-bronze" />}
          </div>
          <p className="text-xs text-brand-bronze font-medium">{company.industry}</p>
          <div className="flex items-center justify-center gap-3 text-xs text-brand-muted pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-bronze" /> {company.wilaya}, Algeria
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-bronze" /> {company.employeesCount} Employees
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            fullWidth
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Following
              </span>
            ) : "Follow Company"}
          </Button>

          <Button variant="outline" size="sm" fullWidth>
            Visit Website
          </Button>
        </div>
      </Card>

      {/* About Company */}
      <Card className="p-5 space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted">About Organization</h2>
        <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed">
          {company.about}
        </p>
      </Card>

      {/* Open Opportunities */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted px-1">
          Open Positions ({companyJobs.length})
        </h2>
        {companyJobs.length === 0 ? (
          <Card className="p-4 text-center text-xs text-brand-muted">
            No active positions listed at this time.
          </Card>
        ) : (
          companyJobs.map((job) => (
            <Card key={job.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-brand-cream">{job.title}</h3>
                  <span className="text-xs text-brand-muted">{job.wilaya} · {job.worktype}</span>
                </div>
                <Badge variant="bronze" className="text-[10px]">
                  {job.salaryMinDZD.toLocaleString()} DZD
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
