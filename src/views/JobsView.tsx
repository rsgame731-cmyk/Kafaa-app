import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { WilayaSelect } from '../components/WilayaSelect';
import { MOCK_JOBS } from '../data/algerianData';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, MapPin, DollarSign, Building2, CheckCircle2, Bookmark, Share2 } from 'lucide-react';
import { Job } from '../types';

export const JobsView: React.FC = () => {
  const { 
    selectedJob, 
    setSelectedJob, 
    savedJobIds, 
    toggleSaveJob, 
    appliedJobIds, 
    applyToJob 
  } = useApp();
  const { t } = useLanguage();

  const [selectedWilaya, setSelectedWilaya] = useState('All');
  const [selectedWorktype, setSelectedWorktype] = useState<string>('All');

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchWilaya = selectedWilaya === 'All' || job.wilaya === selectedWilaya;
    const matchWorktype = selectedWorktype === 'All' || job.worktype === selectedWorktype;
    return matchWilaya && matchWorktype;
  });

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Header Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('jobs')}
        </h1>
        <p className="text-xs text-brand-muted">
          Opportunities matched specifically for you in Algeria.
        </p>
      </div>

      {/* Wilaya & Worktype Filters */}
      <div className="grid grid-cols-2 gap-3">
        <WilayaSelect
          label="Filter Wilaya"
          value={selectedWilaya}
          onChange={setSelectedWilaya}
          includeAll
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-brand-muted">
            Work Mode
          </label>
          <select
            value={selectedWorktype}
            onChange={(e) => setSelectedWorktype(e.target.value)}
            className="w-full bg-brand-surface border border-brand-border text-brand-cream text-sm rounded-input py-3 px-3 focus:outline-none focus:border-brand-bronze"
          >
            <option value="All">All Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3.5">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <Card
              key={job.id}
              hoverable
              onClick={() => setSelectedJob(job)}
              className="p-5 space-y-3 border-brand-border/80"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-10 h-10 rounded-card object-cover border border-brand-border"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-brand-cream">{job.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <span className="text-brand-bronze font-medium">{job.companyName}</span>
                      <span>·</span>
                      <span>{job.wilaya} ({job.worktype})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className={`p-1.5 rounded-full hover:bg-brand-elevated transition-colors ${
                    isSaved ? 'text-brand-bronze' : 'text-brand-muted'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-bronze' : ''}`} />
                </button>
              </div>

              {/* Salary in DZD */}
              <div className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-1 text-brand-cream font-semibold bg-brand-elevated px-3 py-1 rounded-full border border-brand-border">
                  <span>{job.salaryMinDZD.toLocaleString()} – {job.salaryMaxDZD.toLocaleString()} DZD</span>
                  <span className="text-[10px] text-brand-muted">/month</span>
                </div>
                <span className="text-[10px] text-brand-muted">{job.postedAt}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="dark" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-brand-muted">{job.applicantsCount} applicants</span>
                <Button
                  variant={isApplied ? "outline" : "primary"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                  }}
                >
                  {isApplied ? "Applied ✓" : t('view_job')}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* JOB DETAIL EXPERIENCE MODAL */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title="Opportunity Details"
        >
          <div className="space-y-5 text-left rtl:text-right">
            {/* Header info */}
            <div className="flex items-start gap-4 pb-4 border-b border-brand-border/60">
              <img
                src={selectedJob.companyLogo}
                alt={selectedJob.companyName}
                className="w-14 h-14 rounded-card object-cover border border-brand-border"
              />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-brand-cream">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-brand-bronze font-semibold">{selectedJob.companyName}</span>
                  {selectedJob.verifiedCompany && (
                    <Badge variant="success" className="py-0 px-1.5">Verified Company</Badge>
                  )}
                </div>
                <p className="text-xs text-brand-muted">
                  {selectedJob.wilaya}, Algeria · {selectedJob.worktype} · {selectedJob.contractType}
                </p>
              </div>
            </div>

            {/* Compensation & Highlights */}
            <Card className="bg-brand-surface p-4 grid grid-cols-2 gap-3 text-center border-brand-border">
              <div>
                <span className="text-[10px] text-brand-muted uppercase font-medium">Monthly Salary</span>
                <p className="text-sm font-bold text-brand-bronze">
                  {selectedJob.salaryMinDZD.toLocaleString()} – {selectedJob.salaryMaxDZD.toLocaleString()} DZD
                </p>
              </div>
              <div>
                <span className="text-[10px] text-brand-muted uppercase font-medium">Experience Level</span>
                <p className="text-sm font-bold text-brand-cream">{selectedJob.experienceLevel}</p>
              </div>
            </Card>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Role Overview</h3>
              <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Key Requirements</h3>
              <ul className="space-y-1.5 text-xs text-brand-cream/90">
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-bronze shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  applyToJob(selectedJob.id);
                }}
              >
                {appliedJobIds.includes(selectedJob.id) ? "Application Submitted Successfully ✓" : "Apply Now"}
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => toggleSaveJob(selectedJob.id)}
              >
                {savedJobIds.includes(selectedJob.id) ? "Saved in Bookmarks ✓" : "Save Job"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
