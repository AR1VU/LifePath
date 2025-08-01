import React, { useState } from 'react';
import { Heart, Users, Gift, MessageCircle, UserX, Zap } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { Relationship } from '../types/game';

const RelationshipsTab: React.FC = () => {
  const { character, startDating, breakUp, cheatOnPartner, giveGift, flirtWithPartner } = useGameStore();
  const [showFlirtGame, setShowFlirtGame] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  if (!character) return null;

  const activeRelationships = character.relationships.filter(r => r.isActive);
  const exRelationships = character.relationships.filter(r => !r.isActive);

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStatBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const FlirtMiniGame: React.FC<{ partner: Relationship; onClose: () => void }> = ({ partner, onClose }) => {
    const [flirtOptions] = useState([
      { text: "Compliment their eyes", success: 0.7, trust: 2, attraction: 5 },
      { text: "Tell a funny joke", success: 0.6, trust: 3, attraction: 3 },
      { text: "Be overly forward", success: 0.3, trust: -2, attraction: 2 },
      { text: "Give a sweet smile", success: 0.8, trust: 1, attraction: 4 }
    ]);

    const handleFlirt = (option: typeof flirtOptions[0]) => {
      if (!character.isAlive || character.isInPrison) return;
      
      const success = Math.random() < option.success;
      flirtWithPartner(partner.id, option.text, success, {
        trust: option.trust,
        attraction: option.attraction,
        loyalty: success ? 1 : -1
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 max-w-md w-full mx-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Flirt with {partner.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Choose your approach carefully!
          </p>
          <div className="space-y-3">
            {flirtOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFlirt(option)}
                className="w-full p-4 text-left bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 rounded-xl transition-all duration-200 border border-pink-200/50 dark:border-pink-800/50"
              >
                <span className="text-gray-800 dark:text-white font-medium">{option.text}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (character.age < 13) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Love Life</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your romantic journey awaits
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-700 dark:to-rose-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">👶</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Too Young for Love
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You're still too young to start dating. Focus on school and family for now!
          </p>
        </div>
      </div>
    );
  }

  if (!character.isAlive || character.isInPrison) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Love Life</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your romantic journey has ended
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">{character.isInPrison ? '🔒' : '💀'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {character.isInPrison ? 'Love Life on Hold' : 'Love Life Ended'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {character.isInPrison 
              ? 'Your romantic relationships are on hold while you serve your prison sentence.'
              : 'Your romantic journey has come to an end.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Love Life</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your romantic relationships and dating history
        </p>
      </div>

      {/* Dating Actions */}
      {character.isAlive && !character.isInPrison && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Dating Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => startDating()}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            <span>Start Dating</span>
          </button>
          
          {activeRelationships.length > 0 && (
            <button
              onClick={() => {
                const partner = activeRelationships[0];
                setSelectedPartner(partner.id);
                setShowFlirtGame(true);
              }}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Flirt</span>
            </button>
          )}
        </div>
        </div>
      )}

      {/* Active Relationships */}
      {activeRelationships.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Current Relationships</h3>
          {activeRelationships.map((relationship) => (
            <div key={relationship.id} className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-2xl">
                    💕
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">{relationship.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Age {relationship.age} • Dating for {character.age - relationship.startedAt} years
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold">
                  Dating
                </span>
              </div>

              {/* Relationship Stats */}
              <div className="space-y-4 mb-6">
                {Object.entries(relationship.stats).map(([stat, value]) => (
                  <div key={stat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{stat}</span>
                      <span className={`font-bold ${getStatColor(value)}`}>{value}</span>
                    </div>
                    <div className="stat-bar">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getStatBarColor(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Relationship Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => giveGift(relationship.id)}
                  className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  <Gift className="w-4 h-4" />
                  <span>Gift</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedPartner(relationship.id);
                    setShowFlirtGame(true);
                  }}
                  className="flex items-center justify-center space-x-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Flirt</span>
                </button>
                
                <button
                  onClick={() => cheatOnPartner(relationship.id)}
                  className="flex items-center justify-center space-x-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  <span className="text-sm">😈</span>
                  <span>Cheat</span>
                </button>
                
                <button
                  onClick={() => breakUp(relationship.id)}
                  className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  <UserX className="w-4 h-4" />
                  <span>Break Up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ex Relationships */}
      {exRelationships.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Past Relationships</h3>
          <div className="grid gap-4">
            {exRelationships.map((relationship) => (
              <div key={relationship.id} className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-lg">
                      💔
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white">{relationship.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dated from age {relationship.startedAt} to {relationship.endedAt}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                    Ex
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Relationships */}
      {activeRelationships.length === 0 && exRelationships.length === 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-700 dark:to-rose-600 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-pink-500 dark:text-pink-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Single and Ready to Mingle
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            You haven't started dating yet. Click "Start Dating" to find your first love!
          </p>
        </div>
      )}

      {/* Flirt Mini Game */}
      {showFlirtGame && selectedPartner && (
        <FlirtMiniGame
          partner={activeRelationships.find(r => r.id === selectedPartner)!}
          onClose={() => {
            setShowFlirtGame(false);
            setSelectedPartner(null);
          }}
        />
      )}
    </div>
  );
};

export default RelationshipsTab;