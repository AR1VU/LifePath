import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const AchievementsTab: React.FC = () => {
  const { character } = useGameStore();

  if (!character) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Achievements</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your life accomplishments and milestones
        </p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {character.achievements.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Total Achievements
          </div>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {character.age}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Years Lived
          </div>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {Math.round((character.achievements.length / Math.max(character.age, 1)) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Achievement Rate
          </div>
        </div>
      </div>

      {/* Achievements List */}
      {character.achievements.length > 0 ? (
        <div className="space-y-4">
          {character.achievements
            .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
            .map((achievement) => (
              <div
                key={achievement.id}
                className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {achievement.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">
                        {formatDate(new Date(achievement.unlockedAt))}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Achievements Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
            Live your life and unlock achievements by reaching milestones, making choices, and experiencing different events!
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <span className="font-semibold text-blue-700 dark:text-blue-300">💡 Tip:</span>
              <p className="text-blue-600 dark:text-blue-400 mt-1">
                Try different interactions with family members
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <span className="font-semibold text-green-700 dark:text-green-300">🎯 Goal:</span>
              <p className="text-green-600 dark:text-green-400 mt-1">
                Focus on school and maintain good grades
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;