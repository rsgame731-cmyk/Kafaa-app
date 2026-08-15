import React from 'react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const WelcomeView: React.FC = () => {
  const { setActiveTab } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-between text-center px-6 py-8 animate-fade-in max-w-md mx-auto">
      {/* Top Status / Branding */}
      <div className="pt-4 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-brand-surface border border-brand-bronze/60 flex items-center justify-center text-brand-bronze text-xl font-bold shadow-bronze-glow mb-3">
          ك
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-cream font-sans">
          Kafa'a <span className="text-brand-bronze text-sm font-normal">كفاءة</span>
        </h1>
        <p className="text-xs text-brand-muted uppercase tracking-widest mt-1">
          Algerian Professional Network
        </p>
      </div>

      {/* Central Hero Abstract Symbol Visual */}
      <div className="my-8 relative group w-full max-w-[280px]">
        <div className="absolute inset-0 bg-brand-bronze/10 rounded-full blur-2xl group-hover:bg-brand-bronze/20 transition-all duration-500" />
        <div className="relative rounded-card overflow-hidden border border-brand-border/60 bg-brand-surface p-2 shadow-elevated">
          <img
            src="/kafaa_hero_symbol.jpg"
            alt="Kafa'a Executive Visual Symbol"
            className="w-full h-auto rounded-card object-cover aspect-square hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Fallback to stylized dark bronze vector if image path fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Decorative subtle bronze ring */}
          <div className="absolute inset-0 border border-brand-bronze/30 rounded-card pointer-events-none" />
        </div>
      </div>

      {/* Main Tagline & CTAs */}
      <div className="w-full space-y-4 pb-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-brand-cream">
            {t('brand_tagline')}
          </h2>
          <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
            Connect with top Algerian engineers, recruiters, businesses & freelancers across all 58 Wilayas.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setActiveTab('onboarding')}
          >
            {t('get_started')}
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => setActiveTab('home')}
          >
            {t('sign_in')}
          </Button>
        </div>
      </div>
    </div>
  );
};
