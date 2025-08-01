import React from 'react';
import { Baby, Heart, Users, Trophy, Play, BookOpen, AlertTriangle, DollarSign } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { haveChild, interactWithChild } from '../utils/children';

const ChildrenTab: React.FC = () => {
  const { character, setCharacter, addEvent } = useGameStore();

  if (!character) return null;

  const handleHaveChild = () => {
    if (!character.isAlive || character.isInPrison || character.age < 18) return;
    
    const activeRelationship = character.relationships.find(r => r.isActive);
    const partnerName = activeRelationship?.name;
    
    try {
      const result = haveChild(character, partnerName);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to have child:', error);
    }
  };

  const handleChildInteraction = (childId: string, action: 'play' | 'teach' | 'punish' | 'support' | 'ignore') => {
    if (!character.isAlive || character.isInPrison) return;
    
    try {
      const result = interactWithChild(character, childId, action);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to interact with child:', error);
    }
  };

  const getRelationshipColor = (relationship: number) => {
    if (relationship >= 80) return 'text-green-500';
    if (relationship >= 60) return 'text-yellow-500';
    if (relationship >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRelationshipBarColor = (relationship: number) => {
    if (relationship >= 80) return 'bg-green-500';
    if (relationship >= 60) return 'bg-yellow-500';
    if (relationship >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const canHaveChildren = character.age >= 18 && character.age <= 50 && character.isAlive && !character.isInPrison;

  return (
    <div className="space-y-6 h-full overflow-y-auto custom-scrollbar">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Children & Family</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Raise the next generation and build your legacy
        </p>
      </div>

      {/* Have Child Action */}
      {canHaveChildren && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Start a Family</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {character.relationships.find(r => r.isActive) 
                  ? 'Have a child with your partner' 
                  : 'Have a child as a single parent'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleHaveChild}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Baby className="w-5 h-5" />
              <span>Have Baby</span>
            </button>
            
            <button
              onClick={handleHaveChild}
              disabled={character.stats.money < 20000}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-sm">🧬</span>
              <span>Surrogacy ($20k)</span>
            </button>
            
            <button
              onClick={handleHaveChild}
              disabled={character.stats.money < 15000}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              <span>Adopt ($15k)</span>
            </button>
          </div>
        </div>
      )}

      {/* Children List */}
      {character.children.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Children</h3>
          {character.children.map((child) => (
            <div key={child.id} className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                    {child.gender === 'male' ? '👦' : '👧'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">{child.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Age {child.age} • Born when you were {child.bornAt}
                    </p>
                    {child.otherParent && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Other parent: {child.otherParent}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  child.isAlive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    child.isAlive ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {child.isAlive ? 'Alive' : 'Deceased'}
                </div>
              </div>

              {child.isAlive && (
                <>
                  {/* Current Activity */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-semibold">Currently:</span> {child.currentActivity}
                    </p>
                  </div>

                  {/* Child Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(child.stats).map(([stat, value]) => (
                      <div key={stat} className="text-center">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          {value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {stat}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Relationship Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Heart className={`w-4 h-4 ${getRelationshipColor(child.relationship)}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Relationship
                        </span>
                      </div>
                      <span className={`font-bold ${getRelationshipColor(child.relationship)}`}>
                        {Math.round(child.relationship)}
                      </span>
                    </div>
                    <div className="stat-bar">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getRelationshipBarColor(child.relationship)}`}
                        style={{ width: `${child.relationship}%` }}
                      />
                    </div>
                  </div>

                  {/* Achievements */}
                  {child.achievements.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {child.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs font-semibold"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                      onClick={() => handleChildInteraction(child.id, 'play')}
                      className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </button>
                    
                    <button
                      onClick={() => handleChildInteraction(child.id, 'teach')}
                      className="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Teach</span>
                    </button>
                    
                    <button
                      onClick={() => handleChildInteraction(child.id, 'punish')}
                      className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Punish</span>
                    </button>
                    
                    <button
                      onClick={() => handleChildInteraction(child.id, 'support')}
                      className="flex items-center justify-center space-x-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Support</span>
                    </button>
                    
                    <button
                      onClick={() => handleChildInteraction(child.id, 'ignore')}
                      className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      <span className="text-sm">😶</span>
                      <span>Ignore</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Children Message */}
      {character.children.length === 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-700 dark:to-rose-600 rounded-full flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-pink-500 dark:text-pink-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Children Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {canHaveChildren 
              ? 'Start building your family legacy by having children!'
              : character.age < 18 
                ? 'You\'re too young to have children. Focus on growing up first!'
                : character.age > 50
                  ? 'You\'re past the typical age for having children.'
                  : 'You cannot have children in your current situation.'
            }
          </p>
        </div>
      )}

      {/* Age Restriction Message */}
      {character.age > 50 && character.children.length === 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="font-bold text-orange-700 dark:text-orange-300">Late in Life</span>
            </div>
            <p className="text-orange-600 dark:text-orange-400 text-sm">
              While it's still possible to have children through adoption or surrogacy, natural conception becomes much more difficult after age 50.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrenTab;