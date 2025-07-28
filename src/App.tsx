import React, { useEffect } from 'react';
import { Home } from 'lucide-react';
import { useGameStore } from './stores/gameStore';
import StatPanel from './components/StatPanel';
import LifeLog from './components/LifeLog';
import ActionMenu from './components/ActionMenu';
import Settings from './components/Settings';

function App() {
  const { settings, loadGame } = useGameStore();

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
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 min-h-[calc(100vh-240px)]">
          {/* Stats Panel */}
          <div className="xl:col-span-1">
            <StatPanel />
          </div>

          {/* Life Log */}
          <div className="lg:col-span-1 xl:col-span-2">
            <LifeLog />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <ActionMenu />
            <Settings />
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