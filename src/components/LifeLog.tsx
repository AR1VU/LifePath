import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

const LifeLog: React.FC = () => {
  const { events, startNewLife } = useGameStore();
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'negative': return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20';
      default: return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'positive': return '🎉';
      case 'negative': return '😔';
      default: return '📅';
    }
  };

  return (
    <div className="glass-card rounded-2xl premium-shadow dark:premium-shadow-dark p-6 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <span className="text-white text-lg">📖</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Life Story</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🌟</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
              Your story begins here
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Start a new life to begin your journey!
            </p>
            <button
              onClick={startNewLife}
              className="mt-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start New Life</span>
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] fade-in-up ${getEventTypeColor(event.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <h4 className="font-bold text-gray-800 dark:text-white text-base">{event.title}</h4>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Age
                  </span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {event.age}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 text-sm">
                {event.description}
              </p>
              {Object.keys(event.statChanges).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.statChanges).map(([stat, change]) => (
                    change !== 0 && (
                      <span
                        key={stat}
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                          change! > 0
                            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}
                      >
                        {stat}: {change! > 0 ? '+' : ''}{change}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default LifeLog;