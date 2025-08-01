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
    <div className="pixel-card p-4 sm:p-6 max-h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-purple-500 border-2 border-black flex items-center justify-center">
          <span className="text-white text-pixel-sm">📖</span>
        </div>
        <h3 className="text-pixel-base sm:text-pixel-lg font-bold text-gray-800 dark:text-white">LIFE STORY</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 scrollbar-pixel pr-1 sm:pr-2">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gray-300 dark:bg-gray-600 border-4 border-black flex items-center justify-center mb-4">
              <span className="text-3xl">🌟</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-pixel-sm sm:text-pixel-base font-medium">
              YOUR STORY BEGINS HERE
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-pixel-xs sm:text-pixel-sm mt-2">
              START A NEW LIFE TO BEGIN!
            </p>
            <button
              onClick={startNewLife}
              className="mt-4 pixel-button blue mx-auto"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span>START GAME</span>
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-3 sm:p-4 border-2 border-black transition-all duration-300 hover:transform hover:translate-x-1 hover:translate-y-1 ${getEventTypeColor(event.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-pixel-sm sm:text-pixel-base">{getEventIcon(event.type)}</span>
                  <h4 className="font-bold text-gray-800 dark:text-white text-pixel-xs sm:text-pixel-sm">{event.title}</h4>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-pixel-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    AGE
                  </span>
                  <span className="text-pixel-xs sm:text-pixel-sm font-bold text-gray-700 dark:text-gray-300">
                    {event.age}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 text-pixel-xs sm:text-pixel-sm">
                {event.description}
              </p>
              {Object.keys(event.statChanges).length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {Object.entries(event.statChanges).map(([stat, change]) => (
                    change !== 0 && (
                      <span
                        key={stat}
                        className={`text-pixel-xs px-2 py-1 border border-black font-bold uppercase tracking-wide ${
                          change! > 0
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
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
        <div ref={logEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default LifeLog;