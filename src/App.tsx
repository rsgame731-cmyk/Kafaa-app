import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

// Import Views
import { WelcomeView } from './views/WelcomeView';
import { OnboardingView } from './views/OnboardingView';
import { DiscoverView } from './views/DiscoverView';
import { HomeFeedView } from './views/HomeFeedView';
import { CareerStateView } from './views/CareerStateView';
import { ProfileView } from './views/ProfileView';
import { JobsView } from './views/JobsView';
import { NetworkView } from './views/NetworkView';
import { CreateView } from './views/CreateView';
import { LearnView } from './views/LearnView';
import { MessagesView } from './views/MessagesView';
import { ServicesView } from './views/ServicesView';
import { CompanyView } from './views/CompanyView';
import { CareerAIView } from './views/CareerAIView';
import { SearchView } from './views/SearchView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activeTab, deviceViewMode } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'welcome':
        return <WelcomeView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'discover':
        return <DiscoverView />;
      case 'home':
        return <HomeFeedView />;
      case 'career_state':
        return <CareerStateView />;
      case 'profile':
        return <ProfileView />;
      case 'jobs':
        return <JobsView />;
      case 'network':
        return <NetworkView />;
      case 'create':
        return <CreateView />;
      case 'learn':
        return <LearnView />;
      case 'messages':
        return <MessagesView />;
      case 'services':
        return <ServicesView />;
      case 'company':
        return <CompanyView />;
      case 'career_ai':
        return <CareerAIView />;
      case 'search':
        return <SearchView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeFeedView />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream selection:bg-brand-bronze selection:text-brand-dark">
      {/* Top Header */}
      <Header />

      {/* Main Container Viewport */}
      <main className="w-full">
        {deviceViewMode === 'mobile' ? (
          <div className="py-6 px-2 flex justify-center bg-[#0a0a0c]">
            <div className="w-full max-w-[390px] min-h-[844px] bg-brand-dark border-4 border-brand-border/80 rounded-[40px] shadow-2xl overflow-hidden relative pb-12 my-2">
              {/* Speaker / Notch simulator */}
              <div className="w-28 h-4 bg-brand-surface rounded-b-xl mx-auto mb-2 border-b border-brand-border/40" />
              {renderActiveView()}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {renderActiveView()}
          </div>
        )}
      </main>

      {/* Bottom Minimalist Navigation */}
      <BottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </LanguageProvider>
  );
};
