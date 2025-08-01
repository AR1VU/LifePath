import React from 'react';
import { GraduationCap, BookOpen, Users, Trophy } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { EDUCATION_LEVELS, SCHOOL_SUBJECTS } from '../utils/education';

const EducationTab: React.FC = () => {
  const { character } = useGameStore();

  if (!character) return null;

  const currentEducation = EDUCATION_LEVELS[character.education.currentLevel];
  
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-500';
    if (grade >= 80) return 'text-blue-500';
    if (grade >= 70) return 'text-yellow-500';
    if (grade >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGradeBarColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-500';
    if (grade >= 80) return 'bg-blue-500';
    if (grade >= 70) return 'bg-yellow-500';
    if (grade >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Education</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your academic journey and achievements
        </p>
      </div>

      {/* Current Education Level */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Current Level
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentEducation.name}
            </p>
          </div>
        </div>

        {character.education.currentLevel !== 'none' && character.education.currentLevel !== 'graduated' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Age Range: {currentEducation.ageRange[0]} - {currentEducation.ageRange[1]} years
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                Age {character.age}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grades */}
      {Object.keys(character.education.grades).length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Current Grades
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                GPA: {character.education.gpa.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(character.education.grades).map(([subject, grade]) => (
              <div key={subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {subject}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-lg ${getGradeColor(grade)}`}>
                      {getGradeLetter(grade)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({grade}%)
                    </span>
                  </div>
                </div>
                <div className="stat-bar">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getGradeBarColor(grade)}`}
                    style={{ width: `${grade}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clubs and Activities */}
      {character.education.clubs.length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Clubs & Activities
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {character.education.clubs.map((club, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold"
              >
                {club}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Academic Achievements */}
      {character.education.achievements.length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Academic Achievements
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {character.education.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
              >
                <span className="text-xl">🏆</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {achievement}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Education Message */}
      {character.education.currentLevel === 'none' && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">👶</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Too Young for School
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You're still too young to start your educational journey. Enjoy being a kid!
          </p>
        </div>
      )}

      {/* Graduated Message */}
      {character.education.currentLevel === 'graduated' && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Graduated!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Congratulations! You've completed your basic education. Time to enter the real world!
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationTab;