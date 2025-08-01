import React, { useEffect } from 'react';
import { Home, Users, GraduationCap, Trophy, BarChart3, Menu, X, Heart } from 'lucide-react';
import { useGameStore } from './stores/gameStore';
import CharacterCreation from './components/CharacterCreation';
import StatPanel from './components/StatPanel';
import LifeLog from './components/LifeLog';
import ActionMenu from './components/ActionMenu';
import Settings from './components/Settings';
import FamilyTab from './components/FamilyTab';
import EducationTab from './components/EducationTab';
import AchievementsTab from './components/AchievementsTab';
import RelationshipsTab from './components/RelationshipsTab';
import CareerTab from './components/CareerTab';
import HealthTab from './components/HealthTab';
import AssetsTab from './components/AssetsTab';
import CriminalTab from './components/CriminalTab';
import ChildrenTab from './components/ChildrenTab';

function App() {
  const { character, settings, currentTab, setCurrentTab, loadGame, startNewLife } = useGameStore();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = React.useState(false);

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

  const handleCreateCharacter = (name: string, gender: 'male' | 'female', country: string) => {
    startNewLife(name, gender, country);
    setShowCharacterCreation(false);
  };

  // Show character creation if no character exists
  if (!character && !showCharacterCreation) {
    return <CharacterCreation onCreateCharacter={handleCreateCharacter} />;
  }

  const tabs = [
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
    { id: 'health' as const, label: 'Health', icon: Heart },
    { id: 'family' as const, label: 'Family', icon: Users },
    { id: 'children' as const, label: 'Children', icon: () => <span className="text-sm">👶</span> },
    { id: 'education' as const, label: 'Education', icon: GraduationCap },
    { id: 'career' as const, label: 'Career', icon: () => <span className="text-sm">💼</span> },
    { id: 'relationships' as const, label: 'Love', icon: () => <span className="text-sm">💕</span> },
    { id: 'assets' as const, label: 'Assets', icon: () => <span className="text-sm">🏠</span> },
    { id: 'criminal' as const, label: 'Crime', icon: () => <span className="text-sm">🚔</span> },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'stats':
        return <StatPanel />;
      case 'health':
        return <HealthTab />;
      case 'family':
        return <FamilyTab />;
      case 'children':
        return <ChildrenTab />;
      case 'education':
        return <EducationTab />;
      case 'career':
        return <CareerTab />;
      case 'relationships':
        return <RelationshipsTab />;
      case 'assets':
        return <AssetsTab />;
      case 'criminal':
        return <CriminalTab />;
      case 'achievements':
        return <AchievementsTab />;
      default:
        return <StatPanel />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 text-pixel">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="pixel-heart"></div>
            <h1 className="text-pixel-2xl sm:text-pixel-3xl font-bold text-purple-600 dark:text-purple-400 pixel-pulse">
              LIFE PATH
            </h1>
            <div className="pixel-heart"></div>
          </div>
          <div className="flex items-center justify-center mb-2">
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500"></div>
          </div>
          <p className="text-pixel-sm text-red-500 dark:text-red-400 font-bold uppercase tracking-wider">
            Virtual Life Simulator
          </p>
          <div className="flex items-center justify-center mt-2">
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500"></div>
          </div>
          
          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 pixel-button blue"
          >
            {showMenu ? <X className="w-3 h-3 sm:w-4 sm:h-4" /> : <Menu className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
          
          {/* Popup Menu */}
          {showMenu && (
            <div className="absolute top-16 right-4 sm:top-20 sm:right-6 z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)]">
              <div className="pixel-modal dark:pixel-modal p-6 space-y-6">
                <ActionMenu />
                <Settings />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="pixel-card p-2">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex-shrink-0 flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-3 font-semibold text-pixel-xs sm:text-pixel-sm whitespace-nowrap min-w-0 ${
                      currentTab === tab.id
                        ? 'pixel-tab active'
                        : 'pixel-tab'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[600px]">
          {/* Stats Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {renderTabContent()}
          </div>

          {/* Life Log */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <LifeLog />
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
      className="floating-pixel-button flex items-center space-x-2 sm:space-x-3 group"
    >
      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
        <span className="text-xl">🎂</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-pixel-xs opacity-90 font-medium hidden sm:inline">AGE UP</span>
        <span className="text-pixel-xs sm:text-pixel-sm font-bold">{character.age} → {character.age + 1}</span>
      </div>
    </button>
  );
};

export default App;