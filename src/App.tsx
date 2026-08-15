import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kafa\'a React ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border border-red-500/40">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 max-w-md mb-6 text-sm">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all shadow-lg"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <Header />
      <main className="w-full">
        {deviceViewMode === 'mobile' ? (
          <div className="py-6 px-2 flex justify-center bg-[#0a0a0c]">
            <div className="w-full max-w-[390px] min-h-[844px] bg-brand-dark border-4 border-brand-border/80 rounded-[40px] shadow-2xl overflow-hidden relative pb-12 my-2">
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
      <BottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};
