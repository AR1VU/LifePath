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

  return (
    <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-4 sm:p-6 space-y-4 sm:space-y-6 h-full overflow-y-auto custom-scrollbar">
      <div className="text-center border-b border-gray-200/50 dark:border-gray-700/50 pb-4 sm:pb-6">
        <div className="mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-lg sm:text-xl text-white font-bold">
              {character.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 break-words">{character.name}</h2>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2 font-medium">
          <div className="flex items-center justify-center space-x-4">
            <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
              Age {character.age}
            </span>
            <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold capitalize">
              {character.gender}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm break-words">{character.country}</p>
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

      <div className="space-y-3 sm:space-y-4">
        {Object.entries(character.stats).map(([statName, value]) => {
          const Icon = getStatIcon(statName);
          const statChange = getStatChangeForStat(statName as keyof typeof character.stats);
          
          return (
            <div key={statName} className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    value >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                    value >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    value >= 40 ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${getStatColor(value)}`} />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize text-xs sm:text-sm">
                    {getStatDisplayName(statName)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-sm ${getStatColor(value)}`}>
                    {Math.round(value)}
                  </span>
                  {statChange && (
                    <span 
                      className={`text-xs font-bold px-2 py-1 rounded-full transition-all duration-500 ${
                        statChange.change > 0 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 animate-pulse' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse'
                      }`}
                    >
                      {statChange.change > 0 ? '+' : ''}{Math.round(statChange.change)}
                    </span>
                  )}
                </div>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getStatBarColor(value)} relative overflow-hidden`}
                  style={{ width: `${Math.round(value)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Children Summary */}
      {character.children.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Children</h4>
          <div className="space-y-2">
            {character.children.slice(0, 3).map((child) => (
              <div key={child.id} className="flex items-center space-x-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${child.isAlive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {child.name} (Age {child.age})
                </span>
              </div>
            ))}
            {character.children.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                +{character.children.length - 3} more children
              </p>
            )}
          </div>
        </div>
      )}

      {/* Health Status */}
      {character.diseases.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Health Conditions</h4>
          <div className="space-y-2">
            {character.diseases.slice(0, 3).map((disease) => (
              <div key={disease.id} className="flex items-center space-x-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${
                  disease.severity === 'terminal' ? 'bg-red-500' :
                  disease.severity === 'severe' ? 'bg-orange-500' :
                  disease.severity === 'moderate' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {disease.name} ({disease.severity})
                </span>
              </div>
            ))}
            {character.diseases.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic text-xs">
                +{character.diseases.length - 3} more conditions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insurance Status */}
      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Insurance</h4>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {character.insurance.type} Insurance
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {Math.round(character.insurance.coverage)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Premium: ${Math.round(character.insurance.monthlyPremium)}/month • 
            Deductible: ${character.insurance.deductible.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Special Status Indicators */}
      {(character.isGrounded || character.hasJob || character.isPregnant || character.isInPrison) && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Status</h4>
          <div className="space-y-2">
            {character.isGrounded && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Grounded until age {character.groundedUntilAge}
                </span>
              </div>
            )}
            {character.hasJob && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Working as {character.jobTitle}
                </span>
              </div>
            )}
            {character.isPregnant && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span className="text-pink-600 dark:text-pink-400 font-medium">
                  Pregnant (due at age {character.pregnancyDueAge})
                </span>
              </div>
            )}
            {character.isInPrison && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  In prison until age {character.prisonReleaseAge}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Financial Overview</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                ${Math.round(character.stats.money).toLocaleString()}
              </span>
            </div>
          </div>
          {character.finances?.debt && character.finances.debt > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Debt</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  ${Math.round(character.finances.debt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {character.hasJob && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Salary</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ${Math.round(character.salary || 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          {character.finances?.savings && character.finances.savings > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  ${Math.round(character.finances.savings).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Career Information */}
      {character.hasJob && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Career</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="text-xs">Job: {character.jobTitle}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-xs">Level: {character.jobLevel || 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="text-xs">Performance: {Math.round(character.jobPerformance || 50)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-xs">Experience: {character.workExperience || 0} years</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Family</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
            <span className="text-xs">Mother: {character.family.mother.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-xs">Father: {character.family.father.name}</span>
          </div>
        {character.family.siblings.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            <span className="text-xs">Siblings: {character.family.siblings.map(s => s.name).join(', ')}</span>
          </div>
        )}
        </div>
      </div>

      {/* Criminal Record */}
      {character.criminalRecord.length > 0 && (
        <div className="pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Criminal Record</h4>
          <div className="space-y-2 text-sm">
            {character.criminalRecord.slice(-3).map((record) => (
              <div key={record.id} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span className="text-red-600 dark:text-red-400 text-xs">
                  {record.crime} (Age {record.age})
                </span>
              </div>
            ))}
            {character.criminalRecord.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
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