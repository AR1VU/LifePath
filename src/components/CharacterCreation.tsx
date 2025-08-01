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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="pixel-modal p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="pixel-heart mx-auto mb-4"></div>
          <h1 className="text-pixel-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            CREATE LIFE
          </h1>
          <div className="flex items-center justify-center mb-2">
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500 mr-1"></div>
            <div className="w-4 h-1 bg-red-500"></div>
          </div>
          <p className="text-pixel-xs text-red-500 dark:text-red-400 font-bold uppercase">
            CHOOSE YOUR DESTINY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-pixel-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER NAME"
              className="w-full pixel-input"
              required
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-pixel-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
              GENDER
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-4 border-4 border-black transition-all duration-200 ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">👨</div>
                <div className="font-semibold text-pixel-xs">MALE</div>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-4 border-4 border-black transition-all duration-200 ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">👩</div>
                <div className="font-semibold text-pixel-xs">FEMALE</div>
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-pixel-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              COUNTRY
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 pixel-input appearance-none"
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
            className="w-full pixel-button blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>BEGIN LIFE</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-pixel-xs text-gray-500 dark:text-gray-400 uppercase">
            CHOICES SHAPE DESTINY
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;