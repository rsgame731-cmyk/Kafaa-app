import React from 'react';
import { Search, Bell, Sparkles, Shield, Globe, Briefcase, GraduationCap, Grid, Monitor, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    deviceViewMode, 
    setDeviceViewMode 
  } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (activeTab === 'welcome' || activeTab === 'onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border/60 py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Emblem & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-bronze/50 flex items-center justify-center text-brand-bronze shadow-bronze-glow group-hover:scale-105 transition-transform">
            <span className="font-bold text-xs tracking-wider">ك</span>
          </div>
          <div>
            <span className="font-bold text-base tracking-wide text-brand-cream font-sans group-hover:text-brand-bronze transition-colors">
              Kafa'a <span className="text-xs text-brand-bronze font-normal">🇩🇿</span>
            </span>
          </div>
        </div>

        {/* Quick Route Shortcuts (Desktop / Wide) */}
        <div className="hidden md:flex items-center gap-1 bg-brand-surface/80 p-1 rounded-full border border-brand-border">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'jobs' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            {t('jobs')}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'services' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {t('services')}
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'learn' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {t('learn')}
          </button>

          <button
            onClick={() => setActiveTab('career_ai')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'career_ai' ? 'bg-brand-bronze text-brand-cream' : 'text-brand-muted hover:text-brand-cream'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-bronze" />
            {t('career_ai')}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Quick Launcher */}
          <button
            onClick={() => setActiveTab('career_ai')}
            className="p-2 text-brand-bronze hover:bg-brand-surface rounded-full transition-colors relative"
            title="Career AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Search Launcher */}
          <button
            onClick={() => setActiveTab('search')}
            className="p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-bronze rounded-full animate-pulse" />
            )}
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 py-1 px-2.5 bg-brand-surface border border-brand-border rounded-full text-xs text-brand-muted hover:text-brand-cream transition-colors">
              <Globe className="w-3.5 h-3.5 text-brand-bronze" />
              <span className="uppercase font-semibold text-[11px]">{language}</span>
            </button>
            <div className="absolute right-0 ltr:right-0 rtl:left-0 top-full mt-1 bg-brand-elevated border border-brand-border rounded-card py-2 px-1 shadow-elevated hidden group-hover:block z-50 min-w-[130px]">
              {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left rtl:text-right px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                    language === lang ? 'bg-brand-bronze/20 text-brand-bronze font-semibold' : 'text-brand-cream hover:bg-brand-surface'
                  }`}
                >
                  <span>{lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}</span>
                  {lang === 'ar' && <span className="text-[10px] text-brand-muted">(RTL)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Device Frame View Toggle (Mobile / Responsive) */}
          <button
            onClick={() => setDeviceViewMode(deviceViewMode === 'mobile' ? 'responsive' : 'mobile')}
            className="hidden sm:flex items-center gap-1 py-1 px-2.5 bg-brand-surface border border-brand-border rounded-full text-xs text-brand-muted hover:text-brand-cream transition-colors"
            title="Toggle Mobile Viewframe / Responsive"
          >
            {deviceViewMode === 'mobile' ? (
              <Monitor className="w-3.5 h-3.5 text-brand-bronze" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-brand-bronze" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
