import React, { useEffect } from 'react';
import { Home, Users, GraduationCap, Trophy, BarChart3, Menu, X } from 'lucide-react';
import { useGameStore } from './stores/gameStore';
import StatPanel from './components/StatPanel';
import LifeLog from './components/LifeLog';
import ActionMenu from './components/ActionMenu';
import Settings from './components/Settings';
import FamilyTab from './components/FamilyTab';
import EducationTab from './components/EducationTab';
import AchievementsTab from './components/AchievementsTab';
import RelationshipsTab from './components/RelationshipsTab';
import CareerTab from './components/CareerTab';

function App() {
  const { settings, currentTab, setCurrentTab, loadGame } = useGameStore();
  const [showMenu, setShowMenu] = React.useState(false);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Load saved game state
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    // Apply dark mode to document
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const tabs = [
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
    { id: 'family' as const, label: 'Family', icon: Users },
    { id: 'education' as const, label: 'Education', icon: GraduationCap },
    { id: 'career' as const, label: 'Career', icon: () => <span className="text-sm">💼</span> },
    { id: 'relationships' as const, label: 'Love', icon: () => <span className="text-sm">💕</span> },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'stats':
        return <StatPanel />;
      case 'family':
        return <FamilyTab />;
      case 'education':
        return <EducationTab />;
      case 'career':
        return <CareerTab />;
      case 'relationships':
        return <RelationshipsTab />;
      case 'achievements':
        return <AchievementsTab />;
      default:
        return <StatPanel />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 pb-24">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              LifePath
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Live your digital life, one year at a time
          </p>
          
          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-6 right-6 p-3 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {showMenu ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
          
          {/* Popup Menu */}
          {showMenu && (
            <div className="absolute top-20 right-6 z-50 w-80">
              <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 space-y-6">
                <ActionMenu />
                <Settings />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-2">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      currentTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-240px)]">
          {/* Stats Panel */}
          <div className="lg:col-span-1">
            {renderTabContent()}
          </div>

          {/* Life Log */}
          <div className="lg:col-span-1">
            <LifeLog />
          </div>
        </div>

        {/* Mobile-optimized bottom controls */}
        <div className="lg:hidden mt-8">
          <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
              Swipe and scroll to navigate • Optimized for mobile
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Age Up Button */}
      <FloatingAgeButton />
    </div>
  );
}

const FloatingAgeButton: React.FC = () => {
  const { character, isPlaying, ageUp } = useGameStore();

  const handleAgeUp = () => {
    if (character?.isAlive) {
      ageUp();
    }
  };

  if (!isPlaying || !character?.isAlive) {
    return null;
  }

  return (
    <button
      onClick={handleAgeUp}
      className="floating-button flex items-center space-x-3 group"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-200">
        <span className="text-xl">🎂</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-90 font-medium">Age Up</span>
        <span className="text-sm font-bold">{character.age} → {character.age + 1}</span>
      </div>
    </button>
  );
};

export default App;