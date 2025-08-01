import React, { useState } from 'react';
import { Heart, Activity, Brain, Zap, Guitar as Hospital, Shield, Skull, FileText } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { visitHospital } from '../utils/health';

const HealthTab: React.FC = () => {
  const { character, setCharacter, addEvent } = useGameStore();
  const [showLifeSummary, setShowLifeSummary] = useState(false);

  if (!character) return null;

  const handleHospitalVisit = (visitType: 'checkup' | 'surgery' | 'therapy' | 'rehab' | 'emergency') => {
    try {
      const result = visitHospital(character, visitType);
      setCharacter(result.character);
      addEvent(result.event);
    } catch (error) {
      console.error('Failed to visit hospital:', error);
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHealthBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'severe': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'terminal': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const LifeSummaryModal: React.FC = () => {
    if (!character?.lifeSummary) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mb-4">
              <Skull className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Life Summary: {character.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {character.lifeSummary.totalYearsLived} years • Died from {character.lifeSummary.causeOfDeath}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${Math.round(character.lifeSummary.totalWealth).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Wealth</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {character.lifeSummary.achievementsUnlocked}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {character.lifeSummary.relationshipsCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Relationships</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(character.lifeSummary.legacyScore)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Legacy Score</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Career History</h3>
              <div className="flex flex-wrap gap-2">
                {character.lifeSummary.jobsHeld.map((job, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {job}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Key Life Events</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {character.lifeSummary.keyEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-white">{event.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Age {event.age}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setShowLifeSummary(false)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // TODO: Implement new life with genetics inheritance
                setShowLifeSummary(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300"
            >
              Start New Life (Inherit Genetics)
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!character.isAlive) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Health & Medical</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your health journey has ended
          </p>
        </div>

        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-6">
            <Skull className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Rest in Peace
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            {character.name} died at age {character.deathAge} from {character.deathCause}
          </p>
          <button
            onClick={() => setShowLifeSummary(true)}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 mx-auto"
          >
            <FileText className="w-5 h-5" />
            <span>View Life Summary</span>
          </button>
        </div>

        {showLifeSummary && <LifeSummaryModal />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Health & Medical</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your health and access medical care
        </p>
      </div>

      {/* Health Stats */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Health Overview</h3>
            <p className="text-gray-600 dark:text-gray-400">Your current health status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className={`w-4 h-4 ${getHealthColor(character.stats.physicalHealth)}`} />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Physical Health</span>
                </div>
                <span className={`font-bold ${getHealthColor(character.stats.physicalHealth)}`}>
                  {Math.round(character.stats.physicalHealth)}
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getHealthBarColor(character.stats.physicalHealth)}`}
                  style={{ width: `${Math.round(character.stats.physicalHealth)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className={`w-4 h-4 ${getHealthColor(character.stats.mentalHealth)}`} />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Mental Health</span>
                </div>
                <span className={`font-bold ${getHealthColor(character.stats.mentalHealth)}`}>
                  {Math.round(character.stats.mentalHealth)}
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getHealthBarColor(character.stats.mentalHealth)}`}
                  style={{ width: `${Math.round(character.stats.mentalHealth)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className={`w-4 h-4 ${character.stats.addictions > 50 ? 'text-red-500' : 'text-green-500'}`} />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Addictions</span>
                </div>
                <span className={`font-bold ${character.stats.addictions > 50 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.round(character.stats.addictions)}
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${character.stats.addictions > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.round(character.stats.addictions)}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Life Expectancy</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.max(65, 85 - Math.floor((100 - character.genetics.longevityGenes) / 2))} years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Diseases */}
      {character.diseases.length > 0 && (
        <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <span className="text-white text-lg">🦠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Current Conditions</h3>
            </div>
          </div>

          <div className="space-y-4">
            {character.diseases.map((disease) => (
              <div key={disease.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">{disease.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{disease.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getSeverityColor(disease.severity)}`}>
                    {disease.severity}
                  </span>
                </div>
                
                <div className="mb-3">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Symptoms:</h5>
                  <div className="flex flex-wrap gap-2">
                    {disease.symptoms.map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Contracted at age {disease.contractedAt} • Treatment: ${disease.treatmentCost.toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {disease.isCurable && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                        Curable
                      </span>
                    )}
                    {disease.isFatal && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                        Fatal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hospital Services */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Hospital Services</h3>
            <p className="text-gray-600 dark:text-gray-400">Access medical care and treatments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleHospitalVisit('checkup')}
            className="flex flex-col items-center space-y-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 p-6 rounded-xl transition-all duration-200"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 dark:text-white">Health Checkup</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$200</p>
            </div>
          </button>

          <button
            onClick={() => handleHospitalVisit('surgery')}
            className="flex flex-col items-center space-y-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 p-6 rounded-xl transition-all duration-200"
          >
            <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-lg">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 dark:text-white">Surgery</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$15,000</p>
            </div>
          </button>

          <button
            onClick={() => handleHospitalVisit('therapy')}
            className="flex flex-col items-center space-y-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 p-6 rounded-xl transition-all duration-200"
          >
            <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 dark:text-white">Therapy</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$150</p>
            </div>
          </button>

          <button
            onClick={() => handleHospitalVisit('rehab')}
            className="flex flex-col items-center space-y-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 p-6 rounded-xl transition-all duration-200"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 dark:text-white">Rehabilitation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$8,000</p>
            </div>
          </button>

          <button
            onClick={() => handleHospitalVisit('emergency')}
            className="flex flex-col items-center space-y-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 p-6 rounded-xl transition-all duration-200"
          >
            <div className="p-3 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-800 dark:text-white">Emergency Care</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">$5,000</p>
            </div>
          </button>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Insurance Coverage</h3>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">
                {character.insurance.type}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Insurance Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(character.insurance.coverage)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${character.insurance.deductible.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deductible</div>
            </div>
          </div>
          {character.insurance.monthlyPremium > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Premium: ${Math.round(character.insurance.monthlyPremium)}/month
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTab;