import React, { useState } from 'react';
import { Shield, Hand as Handcuffs, AlertTriangle, Gavel, DollarSign, Zap } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { CRIME_ACTIONS, commitCrime, attemptPrisonEscape, bribePrisonGuard } from '../utils/criminal';

const CriminalTab: React.FC = () => {
  const { character, setCharacter, addEvent } = useGameStore();
  const [showCrimeMenu, setShowCrimeMenu] = useState(false);

  if (!character) return null;

  const handleCommitCrime = (crimeId: string) => {
    try {
      const result = commitCrime(character, crimeId);
      setCharacter(result.character);
      addEvent(result.event);
      setShowCrimeMenu(false);
    } catch (error) {
      console.error('Failed to commit crime:', error);
    }
  };

  const handlePrisonEscape = () => {
    try {
      const result = attemptPrisonEscape(character);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to escape prison:', error);
    }
  };

  const handleBribery = () => {
    try {
      const result = bribePrisonGuard(character);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to bribe guard:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'extreme': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getWantedLevelColor = (level: number) => {
    if (level === 0) return 'text-green-500';
    if (level <= 2) return 'text-yellow-500';
    if (level <= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getWantedLevelStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  };

  if (character.age < 13) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Criminal Activities</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The dark side of life awaits
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">👶</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Too Young for Crime
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You're too young to engage in criminal activities. Focus on your education and stay out of trouble!
          </p>
        </div>
      </div>
    );
  }

  if (!character.isAlive) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Criminal Activities</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your criminal career has ended
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">💀</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Game Over
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your life of crime has come to an end.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Criminal Activities</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Walk on the dark side of life
        </p>
      </div>

      {/* Criminal Status */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Criminal Status</h3>
            <p className="text-gray-600 dark:text-gray-400">Your current standing with the law</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${getWantedLevelColor(character.criminalStatus.wantedLevel)}`}>
              {getWantedLevelStars(character.criminalStatus.wantedLevel)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Wanted Level</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {character.criminalStatus.totalCrimesCommitted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Crimes Committed</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {character.criminalStatus.timesSentenced}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Times Sentenced</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {Math.ceil(character.criminalStatus.totalJailTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years in Prison</div>
          </div>
        </div>
      </div>

      {/* Prison Status */}
      {character.isInPrison && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl">
              <Handcuffs className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Currently Imprisoned</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Release scheduled for age {character.prisonReleaseAge}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.ceil((character.prisonReleaseAge || character.age) - character.age)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Remaining</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {character.age - (character.prisonRecord[character.prisonRecord.length - 1]?.enteredAt || character.age)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Served</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                State Prison
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Location</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handlePrisonEscape}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Attempt Escape</span>
            </button>
            
            <button
              onClick={handleBribery}
              disabled={character.stats.money < 10000}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <DollarSign className="w-5 h-5" />
              <span>Bribe Guard ($10k+)</span>
            </button>
          </div>
        </div>
      )}

      {/* Crime Menu */}
      {!character.isInPrison && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Criminal Activities</h3>
            <button
              onClick={() => setShowCrimeMenu(!showCrimeMenu)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{showCrimeMenu ? 'Hide Crimes' : 'View Crimes'}</span>
            </button>
          </div>

          {showCrimeMenu && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-bold text-red-700 dark:text-red-300">Warning</span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Criminal activities are dangerous and can result in imprisonment, injury, or death. Proceed with caution!
                </p>
              </div>

              {CRIME_ACTIONS.map((crime) => (
                <div key={crime.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">{crime.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{crime.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(crime.difficulty)}`}>
                      {crime.difficulty}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${crime.minReward.toLocaleString()} - ${crime.maxReward.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Potential Reward</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(crime.baseSuccessRate * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Base Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {crime.jailTimeRange[0]}-{crime.jailTimeRange[1]} years
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Prison Sentence</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCommitCrime(crime.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Attempt Crime
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Criminal Record */}
      {character.criminalRecord.length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Criminal Record</h3>
            </div>
          </div>

          <div className="space-y-3">
            {character.criminalRecord.slice(-5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">{record.crime}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    (Age {record.age})
                  </span>
                </div>
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {record.punishment}
                </span>
              </div>
            ))}
            {character.criminalRecord.length > 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                +{character.criminalRecord.length - 5} more offenses
              </p>
            )}
          </div>
        </div>
      )}

      {/* Clean Record */}
      {character.criminalRecord.length === 0 && !character.isInPrison && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-600 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-green-500 dark:text-green-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Clean Record
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You have a clean criminal record. Will you stay on the right side of the law, or venture into the criminal underworld?
          </p>
        </div>
      )}
    </div>
  );
};

export default CriminalTab;