import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreateModalOpen } = useApp();
  const { t } = useLanguage();

  const items: { id: NavTab; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'home', labelKey: 'home', icon: <Home className="w-5 h-5" /> },
    { id: 'discover', labelKey: 'discover', icon: <Compass className="w-5 h-5" /> },
    { id: 'create', labelKey: 'create', icon: <PlusCircle className="w-6 h-6 text-brand-bronze" /> },
    { id: 'messages', labelKey: 'messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'profile', labelKey: 'profile', icon: <User className="w-5 h-5" /> }
  ];

  const handleNav = (id: NavTab) => {
    if (id === 'create') {
      setIsCreateModalOpen(true);
    } else {
      setActiveTab(id);
    }
  };

  // Hide bottom nav on splash/onboarding if desired
  if (activeTab === 'welcome' || activeTab === 'onboarding') {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 max-w-md mx-auto px-4">
      <nav className="bg-brand-surface/95 backdrop-blur-md border border-brand-border/80 rounded-nav p-2 shadow-elevated flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 ${
                isActive ? 'text-brand-bronze scale-105' : 'text-brand-muted hover:text-brand-cream'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-bronze rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-medium">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
