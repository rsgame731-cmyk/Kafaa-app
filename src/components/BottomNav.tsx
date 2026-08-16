import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreateModalOpen, deviceViewMode } = useApp();
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
      // Step 1 of Create Flow: Navigate to Create selection screen first
      setActiveTab('create');
      setIsCreateModalOpen(false);
    } else {
      setActiveTab(id);
    }
  };

  if (activeTab === 'welcome' || activeTab === 'onboarding') {
    return null;
  }

  // Handle position based on deviceViewMode (mobile preview frame vs full screen)
  const containerClass = deviceViewMode === 'mobile'
    ? 'absolute bottom-2 left-2 right-2 z-40'
    : 'fixed bottom-3 left-0 right-0 z-40 max-w-md mx-auto px-4';

  return (
    <div className={containerClass}>
      <nav className="bg-brand-surface/95 backdrop-blur-md border border-brand-border/80 rounded-nav p-2 shadow-elevated flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const isCreateBtn = item.id === 'create';

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-300 ease-out relative select-none ${
                isCreateBtn
                  ? 'active:scale-90 transition-transform duration-150'
                  : 'btn-press'
              }`}
            >
              {/* Icon Container with Floating Elevation Effect */}
              <div className={`relative flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? '-translate-y-1.5 scale-115 text-brand-bronze shadow-bronze-glow'
                  : 'translate-y-0 scale-100 text-brand-muted opacity-65 hover:opacity-100 hover:text-brand-cream'
              }`}>
                {item.icon}
              </div>

              {/* Label text */}
              <span className={`text-[10px] tracking-tight mt-0.5 font-medium transition-all duration-300 ${
                isActive
                  ? 'text-brand-bronze font-semibold scale-105'
                  : 'text-brand-muted/80 opacity-70'
              } ${isCreateBtn && !isActive ? 'text-brand-bronze/90' : ''}`}>
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};


