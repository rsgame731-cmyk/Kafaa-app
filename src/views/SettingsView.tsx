import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { Globe, Shield, Lock, Bell, ShieldCheck, CreditCard, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const settingSections = [
    { id: 'language', label: 'Language System', icon: <Globe className="w-4 h-4 text-brand-bronze" /> },
    { id: 'security', label: 'Security & 2FA', icon: <Lock className="w-4 h-4 text-brand-bronze" /> },
    { id: 'privacy', label: 'Privacy & Visibility', icon: <Shield className="w-4 h-4 text-brand-bronze" /> },
    { id: 'verification', label: 'Algerian Identity Verification', icon: <ShieldCheck className="w-4 h-4 text-brand-bronze" /> },
    { id: 'subscription', label: 'Executive Membership', icon: <CreditCard className="w-4 h-4 text-brand-bronze" /> },
    { id: 'admin', label: 'Admin Management Portal', icon: <LayoutDashboard className="w-4 h-4 text-brand-bronze" /> }
  ];

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('settings')}
        </h1>
        <p className="text-xs text-brand-muted">
          Manage your account, language & preferences.
        </p>
      </div>

      {/* Language Selector Selector Card */}
      <Card className="p-5 space-y-3 bg-brand-surface border-brand-border">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-bronze" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            {t('language')} Mode
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {(['en', 'fr', 'ar'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`py-2.5 px-3 rounded-input text-xs font-semibold transition-all border ${
                language === lang
                  ? 'bg-brand-bronze text-brand-cream border-brand-bronze shadow-bronze-glow'
                  : 'bg-brand-dark text-brand-muted border-brand-border hover:text-brand-cream'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية (RTL)'}
            </button>
          ))}
        </div>
      </Card>

      {/* Settings Options List */}
      <div className="space-y-2.5">
        {settingSections.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => {
              if (item.id === 'admin') setActiveTab('admin');
            }}
            className="p-4 flex items-center justify-between border-brand-border/80"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-brand-dark border border-brand-border">
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-brand-cream">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-muted rtl-flip" />
          </Card>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-4">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => setActiveTab('welcome')}
          className="text-red-400 border-red-900/40 hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
};
