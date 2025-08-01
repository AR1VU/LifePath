import React from 'react';
import { Heart, MessageCircle, Gift, DollarSign, Frown } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { FamilyMember } from '../types/game';

const FamilyTab: React.FC = () => {
  const { character, interactWithFamilyMember } = useGameStore();

  if (!character) return null;

  const allFamilyMembers = [
    character.family.mother,
    character.family.father,
    ...character.family.siblings
  ];

  const getPersonalityColor = (personality: FamilyMember['personality']) => {
    switch (personality) {
      case 'loving': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      case 'strict': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'supportive': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'distant': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      case 'rebellious': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getClosenessColor = (closeness: number) => {
    if (closeness >= 80) return 'text-green-500';
    if (closeness >= 60) return 'text-yellow-500';
    if (closeness >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getClosenessBarColor = (closeness: number) => {
    if (closeness >= 80) return 'bg-green-500';
    if (closeness >= 60) return 'bg-yellow-500';
    if (closeness >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRelationIcon = (relation: FamilyMember['relation']) => {
    switch (relation) {
      case 'mother': return '👩';
      case 'father': return '👨';
      case 'sibling': return '👶';
      default: return '👤';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Family</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Build relationships with your family members
        </p>
      </div>

      <div className="grid gap-6">
        {allFamilyMembers.map((member) => (
          <div
            key={member.id}
            className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                  {getRelationIcon(member.relation)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {member.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {member.relation} • Age {member.age}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getPersonalityColor(member.personality)}`}>
                      {member.personality}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                member.isAlive 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  member.isAlive ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {member.isAlive ? 'Alive' : 'Deceased'}
              </div>
            </div>

            {/* Closeness Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Heart className={`w-4 h-4 ${getClosenessColor(member.closeness)}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Closeness
                  </span>
                </div>
                <span className={`font-bold ${getClosenessColor(member.closeness)}`}>
                  {member.closeness}
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getClosenessBarColor(member.closeness)}`}
                  style={{ width: `${member.closeness}%` }}
                />
              </div>
            </div>

            {/* Interaction Buttons */}
            {member.isAlive && character.age >= 3 && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => interactWithFamilyMember(member.id, 'talk')}
                  className="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk</span>
                </button>
                
                <button
                  onClick={() => interactWithFamilyMember(member.id, 'compliment')}
                  className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Gift className="w-4 h-4" />
                  <span>Compliment</span>
                </button>
                
                <button
                  onClick={() => interactWithFamilyMember(member.id, 'insult')}
                  className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Frown className="w-4 h-4" />
                  <span>Insult</span>
                </button>
                
                {(member.relation === 'mother' || member.relation === 'father') && character.age >= 5 && (
                  <button
                    onClick={() => interactWithFamilyMember(member.id, 'ask_money')}
                    className="flex items-center justify-center space-x-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Ask Money</span>
                  </button>
                )}
              </div>
            )}

            {!member.isAlive && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {member.name} is no longer with us.
                </p>
              </div>
            )}

            {character.age < 3 && member.isAlive && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You're too young to interact with family members.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyTab;