import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { Language } from '../types';

const availableLanguages: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'marathi', label: 'Marathi' },
];

export default function LanguagePreferences() {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useApp();
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(preferences.languages);

  const toggleLanguage = (lang: Language) => {
    if (selectedLanguages.includes(lang)) {
      // Keep at least one language selected
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSave = () => {
    updatePreferences({ languages: selectedLanguages });
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Language Preferences</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-400 mb-6">
            Select your preferred languages to personalize your content recommendations.
          </p>

          {/* Language Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {availableLanguages.map((lang, idx) => {
              const isSelected = selectedLanguages.includes(lang.value);
              return (
                <motion.button
                  key={lang.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLanguage(lang.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{lang.label}</span>
                    {isSelected && <Check className="w-5 h-5" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Count */}
          <div className="mb-6 p-4 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-white">{selectedLanguages.length}</span> language
              {selectedLanguages.length !== 1 && 's'} selected
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLanguages.map((lang) => {
                const langObj = availableLanguages.find(l => l.value === lang);
                return (
                  <span key={lang} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
                    {langObj?.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            size="lg"
          >
            Save Preferences
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
