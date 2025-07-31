import React, { useState } from 'react';
import { Briefcase, DollarSign, TrendingUp, GraduationCap, Building, Award } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { getAvailableJobs, applyForJob, workAction, enrollInCollege, COLLEGE_MAJORS } from '../utils/jobs';

const CareerTab: React.FC = () => {
  const { character, events, setCharacter, addEvent } = useGameStore();
  const [showJobSearch, setShowJobSearch] = useState(false);
  const [showCollegeOptions, setShowCollegeOptions] = useState(false);

  if (!character) return null;

  const availableJobs = getAvailableJobs(character);
  const isAdult = character.age >= 18;
  const isInCollege = character.college?.isEnrolled;

  const handleApplyForJob = async (jobId: string) => {
    try {
      const result = applyForJob(character, jobId);
      setCharacter(result.character);
      addEvent(result.event);
      if (result.success) {
        setShowJobSearch(false);
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  const handleWorkAction = (action: 'work_harder' | 'slack_off' | 'ask_promotion' | 'quit') => {
    try {
      const result = workAction(character, action);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to perform work action:', error);
    }
  };

  const handleEnrollCollege = (major: string) => {
    try {
      const result = enrollInCollege(character, major);
      setCharacter(result.character);
      addEvent(result.event);
      setShowCollegeOptions(false);
    } catch (error) {
      console.error('Failed to enroll in college:', error);
    }
  };

  const getJobCategoryColor = (category: string) => {
    switch (category) {
      case 'entry': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'skilled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'professional': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'executive': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return 'text-green-500';
    if (performance >= 60) return 'text-yellow-500';
    if (performance >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPerformanceBarColor = (performance: number) => {
    if (performance >= 80) return 'bg-green-500';
    if (performance >= 60) return 'bg-yellow-500';
    if (performance >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Career</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Build your professional life and financial future
        </p>
      </div>

      {/* Age 18 Decision */}
      {character.age === 18 && !character.hasJob && !isInCollege && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🎓</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Life Decision Time!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've turned 18! It's time to decide your path: college or work?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowCollegeOptions(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Go to College</span>
            </button>
            <button
              onClick={() => setShowJobSearch(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Briefcase className="w-5 h-5" />
              <span>Find a Job</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Job Status */}
      {character.hasJob && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Current Job
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {character.jobTitle} • Level {character.jobLevel || 1}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Salary</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${(character.salary || 0).toLocaleString()}/year
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {character.workExperience || 0} years
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Performance</span>
                <span className={`font-bold ${getPerformanceColor(character.jobPerformance || 50)}`}>
                  {character.jobPerformance || 50}%
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getPerformanceBarColor(character.jobPerformance || 50)}`}
                  style={{ width: `${character.jobPerformance || 50}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleWorkAction('work_harder')}
              className="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Work Harder</span>
            </button>
            
            <button
              onClick={() => handleWorkAction('slack_off')}
              className="flex items-center justify-center space-x-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              <span className="text-sm">😴</span>
              <span>Slack Off</span>
            </button>
            
            <button
              onClick={() => handleWorkAction('ask_promotion')}
              className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              <Award className="w-4 h-4" />
              <span>Ask Promotion</span>
            </button>
            
            <button
              onClick={() => handleWorkAction('quit')}
              className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              <span className="text-sm">🚪</span>
              <span>Quit Job</span>
            </button>
          </div>
        </div>
      )}

      {/* College Status */}
      {isInCollege && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                College Student
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {character.college?.major} • Year {character.college?.year}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {character.college?.gpa?.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">GPA</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${(character.college?.scholarships || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Scholarships</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${(character.college?.loans || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Student Loans</div>
            </div>
          </div>
        </div>
      )}

      {/* Job Search */}
      {!character.hasJob && isAdult && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Job Search</h3>
            <button
              onClick={() => setShowJobSearch(!showJobSearch)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
            >
              {showJobSearch ? 'Hide Jobs' : 'Browse Jobs'}
            </button>
          </div>

          {showJobSearch && (
            <div className="space-y-4">
              {availableJobs.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No jobs available with your current qualifications. Consider improving your education or skills.
                </p>
              ) : (
                availableJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{job.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{job.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getJobCategoryColor(job.category)}`}>
                        {job.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Salary: ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleApplyForJob(job.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* College Options Modal */}
      {showCollegeOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Choose Your College Major
            </h3>
            <div className="space-y-4">
              {COLLEGE_MAJORS.map((major) => (
                <div key={major.name} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">{major.name}</h4>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${major.tuition.toLocaleString()}/year
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {major.jobBonus.length > 0 ? `Career boost: ${major.jobBonus.join(', ')}` : 'General education'}
                    </div>
                    <button
                      onClick={() => handleEnrollCollege(major.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCollegeOptions(false)}
              className="w-full mt-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Too Young Message */}
      {!isAdult && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">👶</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Too Young for Career
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Focus on your education and family for now. Career opportunities will open up when you turn 18!
          </p>
        </div>
      )}
    </div>
  );
};

export default CareerTab;