import React from 'react';
import { Heart, Brain, Smile, Eye, Activity, Shield, Zap } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getStatColor, getStatBarColor } from '../utils/character';

const StatPanel: React.FC = () => {
  const { character, statChanges } = useGameStore();

  if (!character) return null;

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'health': return Heart;
      case 'physicalHealth': return Activity;
      case 'mentalHealth': return Brain;
      case 'addictions': return Zap;
      case 'smarts': return Brain;
      case 'happiness': return Smile;
      case 'looks': return Eye;
      case 'reputation': return Shield;
      default: return Heart;
    }
  };

  const getStatDisplayName = (stat: string) => {
    switch (stat) {
      case 'physicalHealth': return 'Physical Health';
      case 'mentalHealth': return 'Mental Health';
      case 'addictions': return 'Addictions';
      default: return stat.charAt(0).toUpperCase() + stat.slice(1);
    }
  };

  const getStatChangeForStat = (statName: keyof typeof character.stats) => {
    return statChanges.find(sc => sc.stat === statName);
  };

  const getStatBarClass = (stat: string, value: number) => {
    if (value >= 80) return 'pixel-stat-fill health';
    if (value >= 60) return 'pixel-stat-fill happiness';
    if (value >= 40) return 'pixel-stat-fill smarts';
    return 'pixel-stat-fill low';
  };
  return (
    <div className="pixel-card p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[600px] overflow-y-auto scrollbar-pixel">
      <div className="text-center border-b border-gray-200/50 dark:border-gray-700/50 pb-6">
        <div className="mb-4">
          <div className="pixel-avatar mx-auto mb-4">
            <span className="text-pixel-sm text-white font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {character.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h2 className="text-pixel-base sm:text-pixel-lg font-bold text-gray-800 dark:text-white mb-2">{character.name}</h2>
        </div>
        <div className="text-pixel-xs text-gray-600 dark:text-gray-400 space-y-2 font-medium">
          <div className="flex items-center justify-center space-x-4">
            <span className="px-2 py-1 bg-blue-500 text-white border-2 border-black text-pixel-xs font-semibold">
              Age {character.age}
            </span>
            <span className="px-2 py-1 bg-purple-500 text-white border-2 border-black text-pixel-xs font-semibold capitalize">
              {character.gender}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-pixel-xs">{character.country}</p>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            character.isAlive 
              ? 'bg-green-500 text-white border-2 border-black' 
              : 'bg-red-500 text-white border-2 border-black'
          }`}>
            <div className={`pixel-status-indicator mr-2 ${
              character.isAlive ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {character.isAlive ? 'Alive' : 'Deceased'}
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {Object.entries(character.stats).map(([statName, value]) => {
          const Icon = getStatIcon(statName);
          const statChange = getStatChangeForStat(statName as keyof typeof character.stats);
          
          return (
            <div key={statName} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 border border-black flex items-center justify-center">
                    <Icon className="w-2 h-2 sm:w-3 sm:h-3 text-black" />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize text-pixel-xs sm:text-pixel-sm">
                    {statName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-pixel-xs text-black dark:text-white">
                    {value}
                  </span>
                  {statChange && (
                    <span 
                      className={`text-pixel-xs font-bold px-2 py-1 border-2 border-black transition-all duration-500 pixel-blink ${
                        statChange.change > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {statChange.change > 0 ? '+' : ''}{statChange.change}
                    </span>
                  )}
                </div>
              </div>
              <div className="pixel-stat-bar">
                <div 
                  className={`${getStatBarClass(statName, value)} transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Children Summary */}
      {character.children.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">CHILDREN</h4>
          <div className="space-y-2">
            {character.children.slice(0, 3).map((child) => (
              <div key={child.id} className="flex items-center space-x-2 text-pixel-xs">
                <span className={`pixel-status-indicator ${child.isAlive ? 'alive' : 'dead'}`}></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium text-pixel-xs">
                  {child.name} (Age {child.age})
                </span>
              </div>
            ))}
            {character.children.length > 3 && (
              <p className="text-pixel-xs text-gray-500 dark:text-gray-400 italic">
                +{character.children.length - 3} more children
              </p>
            )}
          </div>
        </div>
      )}

      {/* Health Status */}
      {character.diseases.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">HEALTH</h4>
          <div className="space-y-2">
            {character.diseases.slice(0, 3).map((disease) => (
              <div key={disease.id} className="flex items-center space-x-2 text-pixel-xs">
                <span className={`pixel-status-indicator ${
                  disease.severity === 'terminal' ? 'bg-red-500' :
                  disease.severity === 'severe' ? 'bg-orange-500' :
                  disease.severity === 'moderate' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium text-pixel-xs">
                  {disease.name} ({disease.severity})
                </span>
              </div>
            ))}
            {character.diseases.length > 3 && (
              <p className="text-pixel-xs text-gray-500 dark:text-gray-400 italic">
                +{character.diseases.length - 3} more conditions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insurance Status */}
      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">INSURANCE</h4>
        <div className="bg-blue-200 dark:bg-blue-800 border-2 border-black p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-pixel-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
              {character.insurance.type} Insurance
            </span>
            <span className="text-pixel-xs font-bold text-blue-600 dark:text-blue-400">
              {character.insurance.coverage}%
            </span>
          </div>
          <div className="text-pixel-xs text-gray-500 dark:text-gray-400">
            Premium: ${character.insurance.monthlyPremium}/month • 
            Deductible: ${character.insurance.deductible.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Special Status Indicators */}
      {(character.isGrounded || character.hasJob || character.isPregnant || character.isInPrison) && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">STATUS</h4>
          <div className="space-y-2">
            {character.isGrounded && (
              <div className="flex items-center space-x-2 text-pixel-xs">
                <span className="pixel-status-indicator bg-red-500"></span>
                <span className="text-red-600 dark:text-red-400 font-medium text-pixel-xs">
                  Grounded until age {character.groundedUntilAge}
                </span>
              </div>
            )}
            {character.hasJob && (
              <div className="flex items-center space-x-2 text-pixel-xs">
                <span className="pixel-status-indicator bg-green-500"></span>
                <span className="text-green-600 dark:text-green-400 font-medium text-pixel-xs">
                  Working as {character.jobTitle}
                </span>
              </div>
            )}
            {character.isPregnant && (
              <div className="flex items-center space-x-2 text-pixel-xs">
                <span className="pixel-status-indicator bg-pink-500"></span>
                <span className="text-pink-600 dark:text-pink-400 font-medium text-pixel-xs">
                  Pregnant (due at age {character.pregnancyDueAge})
                </span>
              </div>
            )}
            {character.isInPrison && (
              <div className="flex items-center space-x-2 text-pixel-xs">
                <span className="pixel-status-indicator bg-gray-500"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium text-pixel-xs">
                  In prison until age {character.prisonReleaseAge}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">MONEY</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-green-200 dark:bg-green-800 border-2 border-black p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-pixel-xs font-medium text-gray-600 dark:text-gray-400">CASH</span>
              <span className="text-pixel-xs font-bold text-green-600 dark:text-green-400">
                ${character.stats.money.toLocaleString()}
              </span>
            </div>
          </div>
          {character.finances?.debt && character.finances.debt > 0 && (
            <div className="bg-red-200 dark:bg-red-800 border-2 border-black p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-pixel-xs font-medium text-gray-600 dark:text-gray-400">DEBT</span>
                <span className="text-pixel-xs font-bold text-red-600 dark:text-red-400">
                  ${character.finances.debt.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {character.hasJob && (
            <div className="bg-blue-200 dark:bg-blue-800 border-2 border-black p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-pixel-xs font-medium text-gray-600 dark:text-gray-400">SALARY</span>
                <span className="text-pixel-xs font-bold text-blue-600 dark:text-blue-400">
                  ${(character.salary || 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {character.finances?.savings && character.finances.savings > 0 && (
            <div className="bg-purple-200 dark:bg-purple-800 border-2 border-black p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-pixel-xs font-medium text-gray-600 dark:text-gray-400">SAVINGS</span>
                <span className="text-pixel-xs font-bold text-purple-600 dark:text-purple-400">
                  ${character.finances.savings.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Career Information */}
      {character.hasJob && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">CAREER</h4>
          <div className="space-y-2 text-pixel-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="pixel-status-indicator bg-blue-500"></span>
              <span className="text-pixel-xs">JOB: {character.jobTitle}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="pixel-status-indicator bg-green-500"></span>
              <span className="text-pixel-xs">LVL: {character.jobLevel || 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="pixel-status-indicator bg-yellow-500"></span>
              <span className="text-pixel-xs">PERF: {character.jobPerformance || 50}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="pixel-status-indicator bg-purple-500"></span>
              <span className="text-pixel-xs">EXP: {character.workExperience || 0} YRS</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">FAMILY</h4>
        <div className="space-y-2 text-pixel-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="pixel-status-indicator bg-pink-500"></span>
            <span className="text-pixel-xs">MOM: {character.family.mother.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="pixel-status-indicator bg-blue-500"></span>
            <span className="text-pixel-xs">DAD: {character.family.father.name}</span>
          </div>
        {character.family.siblings.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="pixel-status-indicator bg-purple-500"></span>
            <span className="text-pixel-xs">SIBLINGS: {character.family.siblings.map(s => s.name).join(', ')}</span>
          </div>
        )}
        </div>
      </div>

      {/* Criminal Record */}
      {character.criminalRecord.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-pixel-sm">CRIMES</h4>
          <div className="space-y-2 text-pixel-xs">
            {character.criminalRecord.slice(-3).map((record) => (
              <div key={record.id} className="flex items-center space-x-2">
                <span className="pixel-status-indicator bg-red-500"></span>
                <span className="text-red-600 dark:text-red-400 text-pixel-xs">
                  {record.crime} (Age {record.age})
                </span>
              </div>
            ))}
            {character.criminalRecord.length > 3 && (
              <p className="text-pixel-xs text-gray-500 dark:text-gray-400 italic">
                +{character.criminalRecord.length - 3} more offenses
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatPanel;