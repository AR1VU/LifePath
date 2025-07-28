import React from 'react';
import { Moon, Sun, Save, Bell, BellOff } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const Settings: React.FC = () => {
  const { 
    settings, 
    toggleDarkMode, 
    toggleAutoSave, 
    toggleNotifications,
    saveGame,
    loadGame 
  } = useGameStore();

  return (
    <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl">
          <span className="text-white text-lg">⚙️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${settings.darkMode ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100'}`}>
              {settings.darkMode ? <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <Sun className="w-4 h-4 text-yellow-600" />}
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
              settings.darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Save className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Auto Save</span>
          </div>
          <button
            onClick={toggleAutoSave}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
              settings.autoSave ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                settings.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              {settings.notifications ? 
                <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : 
                <BellOff className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              }
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Notifications</span>
          </div>
          <button
            onClick={toggleNotifications}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
              settings.notifications ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="space-y-3">
            <button
              onClick={saveGame}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="p-1 bg-white/20 rounded">
                <Save className="w-4 h-4" />
              </div>
              <span>Save Game</span>
            </button>
            
            <button
              onClick={loadGame}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="p-1 bg-white/20 rounded">
                <span className="text-sm">📁</span>
              </div>
              <span>Load Game</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-4">
            <div className="text-center space-y-2">
              <h4 className="font-bold text-gray-800 dark:text-white">LifePath</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">A BitLife-style life simulation</p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                <span>v1.0.0</span>
                <span>•</span>
                <span>React + TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;