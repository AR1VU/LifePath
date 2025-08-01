import React, { useState } from 'react';
import { User, Globe, Heart } from 'lucide-react';

interface CharacterCreationProps {
  onCreateCharacter: (name: string, gender: 'male' | 'female', country: string) => void;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 
  'Argentina', 'India', 'China', 'Russia', 'Sweden', 'Norway', 'Denmark', 
  'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Portugal', 'Ireland'
];

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [country, setCountry] = useState('United States');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCharacter(name.trim(), gender, country);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="glass-card rounded-3xl premium-shadow dark:premium-shadow-dark p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Create Your Life
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your identity and begin your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">👨</div>
                <div className="font-semibold">Male</div>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">👩</div>
                <div className="font-semibold">Female</div>
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white transition-all duration-200 appearance-none"
              >
                {COUNTRIES.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <Heart className="w-5 h-5" />
            <span>Begin Life</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your choices will shape your destiny
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;