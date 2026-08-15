import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, Briefcase, FileCheck, AlertTriangle, Activity, Check, X } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeTabSection, setActiveTabSection] = useState<'verifications' | 'jobs' | 'analytics'>('verifications');

  const [pendingVerifications, setPendingVerifications] = useState([
    { id: 'v1', name: 'Yassine Brahimi', role: 'DevOps Lead', company: 'Sonatrach', wilaya: 'Ouargla' },
    { id: 'v2', name: 'Lina Cherif', role: 'UI Designer', company: 'TechDz', wilaya: 'Oran' }
  ]);

  const handleApprove = (id: string) => {
    setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Admin Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-bronze/15 border border-brand-bronze/40 text-brand-bronze text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kafa'a Executive Portal</span>
        </div>
        <h1 className="text-xl font-bold text-brand-cream pt-1">
          Platform Governance & Security
        </h1>
        <p className="text-xs text-brand-muted">
          58 Wilayas verification queue & moderation system.
        </p>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center bg-brand-surface border-brand-border">
          <span className="text-base font-extrabold text-brand-cream">12,480</span>
          <span className="text-[10px] text-brand-muted uppercase block">Active Talents</span>
        </Card>
        <Card className="p-3 text-center bg-brand-surface border-brand-border">
          <span className="text-base font-extrabold text-brand-bronze">480</span>
          <span className="text-[10px] text-brand-muted uppercase block">Companies</span>
        </Card>
        <Card className="p-3 text-center bg-brand-surface border-brand-border">
          <span className="text-base font-extrabold text-emerald-400">99.8%</span>
          <span className="text-[10px] text-brand-muted uppercase block">Uptime</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2">
        <button
          onClick={() => setActiveTabSection('verifications')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            activeTabSection === 'verifications' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
          }`}
        >
          Verifications ({pendingVerifications.length})
        </button>
        <button
          onClick={() => setActiveTabSection('jobs')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            activeTabSection === 'jobs' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
          }`}
        >
          Job Posting Queue
        </button>
      </div>

      {/* Verification Queue Stream */}
      {activeTabSection === 'verifications' && (
        <div className="space-y-3">
          {pendingVerifications.length === 0 ? (
            <Card className="p-6 text-center text-xs text-brand-muted">
              All identity verifications processed. No pending requests.
            </Card>
          ) : (
            pendingVerifications.map((v) => (
              <Card key={v.id} className="p-4 space-y-3 border-brand-border/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-cream">{v.name}</h3>
                    <p className="text-xs text-brand-muted">{v.role} @ {v.company}</p>
                    <Badge variant="dark" className="text-[10px] mt-1">{v.wilaya}</Badge>
                  </div>
                  <Badge variant="bronze">Pending Review</Badge>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-brand-border/40">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleApprove(v.id)}
                  >
                    <Check className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1" /> Approve Badge
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleApprove(v.id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Back to App button */}
      <div className="pt-4">
        <Button variant="outline" size="md" fullWidth onClick={() => setActiveTab('home')}>
          Return to Member App
        </Button>
      </div>
    </div>
  );
};
