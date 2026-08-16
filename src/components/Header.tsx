import React from 'react';
import { Search, Bell, Sparkles, Globe, Briefcase, GraduationCap, Grid, Monitor, Smartphone, LogOut, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    deviceViewMode, 
    setDeviceViewMode,
    user,
    isAuthenticated,
    logoutUser
  } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (activeTab === 'welcome' || activeTab === 'onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border/60 py-2.5 px-4 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Emblem & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group btn-press"
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
        <div className="hidden md:flex items-center gap-1.5 bg-brand-surface/80 p-1.5 rounded-full border border-brand-border/90 shadow-dark-soft">
          {[
            { id: 'jobs' as const, label: t('jobs'), icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'services' as const, label: t('services'), icon: <Grid className="w-3.5 h-3.5" /> },
            { id: 'learn' as const, label: t('learn'), icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'career_ai' as const, label: t('career_ai'), icon: <Sparkles className="w-3.5 h-3.5 text-brand-bronze" /> }
          ].map((navItem) => {
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => setActiveTab(navItem.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-250 flex items-center gap-1.5 btn-press select-none group ${
                  isActive
                    ? 'text-brand-cream font-semibold bg-brand-bronze/15 border border-brand-bronze/40 shadow-bronze-glow'
                    : 'text-brand-muted hover:text-brand-cream hover:bg-brand-elevated/60'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-brand-bronze' : 'group-hover:scale-105'}`}>
                  {navItem.icon}
                </div>
                <span>{navItem.label}</span>

                {/* Animated Underline Active Indicator */}
                <span className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-brand-bronze shadow-bronze-glow rounded-full transition-all duration-300 ease-out ${
                  isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-75'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Launcher */}
          <button
            onClick={() => setActiveTab('career_ai')}
            className="p-2 text-brand-bronze hover:bg-brand-surface rounded-full transition-colors relative btn-press"
            title="Career AI Assistant"
          >
            <Sparkles className="w-4 h-4 animate-pulse-glow" />
          </button>

          {/* Search Launcher */}
          <button
            onClick={() => setActiveTab('search')}
            className="p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors btn-press"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="p-2 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors relative btn-press"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-bronze rounded-full animate-pulse" />
            )}
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 py-1 px-2.5 bg-brand-surface border border-brand-border rounded-full text-xs text-brand-muted hover:text-brand-cream transition-colors btn-press">
              <Globe className="w-3.5 h-3.5 text-brand-bronze" />
              <span className="uppercase font-semibold text-[11px]">{language}</span>
            </button>
            <div className="absolute right-0 ltr:right-0 rtl:left-0 top-full mt-1 bg-brand-elevated border border-brand-border rounded-card py-2 px-1 shadow-elevated hidden group-hover:block z-50 min-w-[130px] animate-fade-scale">
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

          {/* Mobile Viewframe Toggle */}
          <button
            onClick={() => setDeviceViewMode(deviceViewMode === 'mobile' ? 'responsive' : 'mobile')}
            className="hidden sm:flex items-center gap-1 py-1 px-2.5 bg-brand-surface border border-brand-border rounded-full text-xs text-brand-muted hover:text-brand-cream transition-colors btn-press"
            title="Toggle Mobile Viewframe / Responsive"
          >
            {deviceViewMode === 'mobile' ? (
              <Monitor className="w-3.5 h-3.5 text-brand-bronze" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-brand-bronze" />
            )}
            <span className="text-[10px] hidden lg:inline font-medium">
              {deviceViewMode === 'mobile' ? 'Desktop' : 'Mobile'}
            </span>
          </button>

          {/* Authenticated User Menu */}
          {isAuthenticated && (
            <div className="relative group">
              <button className="flex items-center gap-1.5 p-1 bg-brand-surface border border-brand-border rounded-full hover:border-brand-bronze/50 transition-colors btn-press">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-brand-bronze/40"
                />
              </button>
              <div className="absolute right-0 top-full mt-1.5 bg-brand-elevated border border-brand-border rounded-card p-2 shadow-elevated hidden group-hover:block z-50 min-w-[180px] animate-fade-scale">
                <div className="px-2 py-1.5 border-b border-brand-border/60 mb-1">
                  <p className="text-xs font-semibold text-brand-cream truncate">{user.name}</p>
                  <p className="text-[10px] text-brand-muted truncate">{user.headline}</p>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-brand-cream hover:bg-brand-surface rounded-lg flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-brand-bronze" />
                  View Profile
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 mt-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

