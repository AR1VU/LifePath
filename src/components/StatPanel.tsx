import React from 'react';
import { Heart, Brain, Smile, Eye } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getStatColor, getStatBarColor } from '../utils/character';

const StatPanel: React.FC = () => {
  const { character, statChanges } = useGameStore();

  if (!character) return null;

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'health': return Heart;
      case 'smarts': return Brain;
      case 'happiness': return Smile;
      case 'looks': return Eye;
      default: return Heart;
    }
  };

  const getStatChangeForStat = (statName: keyof typeof character.stats) => {
    return statChanges.find(sc => sc.stat === statName);
  };

  return (
    <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 space-y-8 h-full">
      <div className="text-center border-b border-gray-200/50 dark:border-gray-700/50 pb-6">
        <div className="mb-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl text-white font-bold">
              {character.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{character.name}</h2>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 font-medium">
          <div className="flex items-center justify-center space-x-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
              Age {character.age}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold capitalize">
              {character.gender}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{character.country}</p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            character.isAlive 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              character.isAlive ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {character.isAlive ? 'Alive' : 'Deceased'}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(character.stats).map(([statName, value]) => {
          const Icon = getStatIcon(statName);
          const statChange = getStatChangeForStat(statName as keyof typeof character.stats);
          
          return (
            <div key={statName} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    value >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                    value >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    value >= 40 ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Icon className={`w-4 h-4 ${getStatColor(value)}`} />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">
                    {statName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-lg ${getStatColor(value)}`}>
                    {value}
                  </span>
                  {statChange && (
                    <span 
                      className={`text-sm font-bold px-2 py-1 rounded-full transition-all duration-500 ${
                        statChange.change > 0 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 animate-pulse' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse'
                      }`}
                    >
                      {statChange.change > 0 ? '+' : ''}{statChange.change}
                    </span>
                  )}
                </div>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getStatBarColor(value)} relative overflow-hidden`}
                  style={{ width: `${value}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Worth</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${character.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Family</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
            <span>Mother: {character.family.mother}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>Father: {character.family.father}</span>
          </div>
        {character.family.siblings.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            <span>Siblings: {character.family.siblings.join(', ')}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
