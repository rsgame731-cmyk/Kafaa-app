import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_SERVICES } from '../data/algerianData';
import { useApp } from '../context/AppContext';
import { Search, Briefcase, Building2, Wrench, Users, ArrowRight } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedJob, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Jobs', 'Companies', 'Services'];

  const filteredJobs = MOCK_JOBS.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.wilaya.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = MOCK_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = MOCK_SERVICES.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Large Rounded Search Input */}
      <div className="space-y-3">
        <Input
          placeholder="Search people, companies, jobs in Algeria..."
          icon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-bronze text-brand-cream'
                  : 'bg-brand-surface text-brand-muted border border-brand-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Stream */}
      <div className="space-y-4">
        {/* Jobs Section */}
        {(activeCategory === 'All' || activeCategory === 'Jobs') && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-brand-bronze" /> Jobs ({filteredJobs.length})
            </h3>
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                hoverable
                onClick={() => setSelectedJob(job)}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-sm font-semibold text-brand-cream">{job.title}</h4>
                  <span className="text-xs text-brand-muted">{job.companyName} · {job.wilaya}</span>
                </div>
                <Badge variant="bronze">{job.salaryMinDZD.toLocaleString()} DZD</Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Companies Section */}
        {(activeCategory === 'All' || activeCategory === 'Companies') && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-bronze" /> Companies ({filteredCompanies.length})
            </h3>
            {filteredCompanies.map((c) => (
              <Card
                key={c.id}
                hoverable
                onClick={() => setActiveTab('company')}
                className="p-4 flex items-center gap-3"
              >
                <img src={c.logo} alt={c.name} className="w-9 h-9 rounded-card object-cover border border-brand-border" />
                <div>
                  <h4 className="text-sm font-semibold text-brand-cream">{c.name}</h4>
                  <span className="text-xs text-brand-muted">{c.industry} · {c.wilaya}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
