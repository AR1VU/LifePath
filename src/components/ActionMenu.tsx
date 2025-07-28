import React from 'react';
import { Play, RotateCcw, Calendar, Skull } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const ActionMenu: React.FC = () => {
  const { character, isPlaying, startNewLife, ageUp, resetGame } = useGameStore();

  const handleAgeUp = () => {
    if (character?.isAlive) {
      ageUp();
    }
  };

  return (
    <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
          <span className="text-white text-lg">⚡</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Actions</h3>
      </div>
      
      <div className="space-y-4">
        {!isPlaying ? (
          <button
            onClick={startNewLife}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <Play className="w-5 h-5" />
            </div>
            <span className="text-lg">Start New Life</span>
          </button>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-5">
              <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-300 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-bold">Use the floating button to age up</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 ml-11">
                The floating button stays visible while you scroll through your life story
              </p>
            </div>

            {!character?.isAlive && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl p-5">
                <div className="flex items-center justify-center space-x-3 text-red-600 dark:text-red-400">
                  <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
                    <Skull className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">Game Over</span>
                </div>
                <p className="text-center text-sm text-red-500 dark:text-red-400 mt-2">
                  Your life has come to an end
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => {
            if (confirm('Are you sure you want to start over? This will delete your current life.')) {
              resetGame();
            }
          }}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="p-2 bg-white/20 rounded-lg">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span>Reset Game</span>
        </button>
      </div>

      {character && (
        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-bold text-gray-800 dark:text-white mb-4">Life Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{character.age}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Years Old</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{useGameStore.getState().events.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Life Events</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${
              character.isAlive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              <span className="mr-2">{character.isAlive ? '🟢' : '💀'}</span>
              {character.isAlive ? 'Living' : 'Deceased'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;