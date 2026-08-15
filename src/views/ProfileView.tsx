import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { MapPin, Briefcase, GraduationCap, Award, ExternalLink, Settings, ShieldCheck, Sparkles } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, setActiveTab } = useApp();

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Profile Header Card */}
      <Card className="bg-brand-surface border-brand-border p-6 text-center space-y-4 relative">
        <button
          onClick={() => setActiveTab('settings')}
          className="absolute top-4 right-4 ltr:right-4 rtl:left-4 p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-elevated rounded-full transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Circular Avatar with Verification */}
        <div className="flex justify-center pt-2">
          <Avatar src={user.avatar} alt={user.name} verified={user.verified} size="xl" />
        </div>

        {/* Identity Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl font-bold text-brand-cream">{user.name}</h1>
            <ShieldCheck className="w-4 h-4 text-brand-bronze" />
          </div>
          <p className="text-xs font-medium text-brand-bronze">{user.headline}</p>
          <div className="flex items-center justify-center gap-1 text-xs text-brand-muted pt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-bronze" />
            <span>{user.city}, Wilaya of {user.wilaya}, Algeria 🇩🇿</span>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-brand-border/60 text-center">
          <div>
            <span className="block text-base font-bold text-brand-cream">{user.connectionsCount}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider">Connections</span>
          </div>
          <div>
            <span className="block text-base font-bold text-brand-cream">{user.followersCount}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider">Followers</span>
          </div>
          <div>
            <span className="block text-base font-bold text-brand-cream">{user.profileViews}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider">Views</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="primary" size="sm" fullWidth onClick={() => setActiveTab('career_ai')}>
            <Sparkles className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1" />
            Optimize with AI
          </Button>
          <Button variant="secondary" size="sm" fullWidth onClick={() => setActiveTab('create')}>
            Share Post
          </Button>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-5 space-y-2.5">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted">About</h2>
        <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed">
          {user.bio}
        </p>
      </Card>

      {/* Experience Section */}
      <Card className="p-5 space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted">Experience</h2>
        <div className="space-y-4">
          {user.experiences.map((exp) => (
            <div key={exp.id} className="flex gap-3 items-start border-b border-brand-border/40 last:border-0 pb-3 last:pb-0">
              <div className="p-2.5 rounded-card bg-brand-dark text-brand-bronze border border-brand-border shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-brand-cream">{exp.role}</h3>
                <p className="text-xs text-brand-bronze font-medium">{exp.company}</p>
                <span className="text-[10px] text-brand-muted block">{exp.startDate} – {exp.endDate} · {exp.location}</span>
                <p className="text-xs text-brand-cream/80 mt-1 leading-normal">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted">Education</h2>
        {user.education.map((edu) => (
          <div key={edu.id} className="flex gap-3 items-start">
            <div className="p-2.5 rounded-card bg-brand-dark text-brand-bronze border border-brand-border shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-cream">{edu.institution}</h3>
              <p className="text-xs text-brand-muted">{edu.degree} in {edu.fieldOfStudy}</p>
              <span className="text-[10px] text-brand-muted">{edu.startYear} – {edu.endYear}</span>
            </div>
          </div>
        ))}
      </Card>

      {/* Technical Skills Pills */}
      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-brand-muted">Skills & Competencies</h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Badge key={skill} variant="bronze">{skill}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};
