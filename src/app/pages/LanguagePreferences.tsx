import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Globe2, Languages } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { Language } from '../types';

const availableLanguages: { value: Language; label: string; icon: React.ReactNode }[] = [
  { value: 'english', label: 'English', icon: <Globe2 className="h-5 w-5" /> },
  { value: 'hindi', label: 'Hindi', icon: <Languages className="h-5 w-5" /> },
  { value: 'tamil', label: 'Tamil', icon: <Languages className="h-5 w-5" /> },
  { value: 'telugu', label: 'Telugu', icon: <Languages className="h-5 w-5" /> },
  { value: 'malayalam', label: 'Malayalam', icon: <Languages className="h-5 w-5" /> },
  { value: 'kannada', label: 'Kannada', icon: <Languages className="h-5 w-5" /> },
  { value: 'marathi', label: 'Marathi', icon: <Languages className="h-5 w-5" /> },
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
    <div className="min-h-screen bg-linear-to-b from-[#05070b] to-[#0b1220] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/6 bg-[#05070b]/90 backdrop-blur-xl">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="rounded-full p-2 transition-colors hover:bg-white/8"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Language Preferences</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-6 max-w-2xl text-[#a3a3a3]">
            Select your preferred languages to personalize your content recommendations.
          </p>

          {/* Language Chips Grid */}
          <div className="mb-8 flex flex-wrap gap-3 md:gap-4">
            {availableLanguages.map((lang, idx) => {
              const isSelected = selectedLanguages.includes(lang.value);
              return (
                <motion.button
                  key={lang.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLanguage(lang.value)}
                  className={`w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] rounded-2xl border bg-[#111827]/86 p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-400 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_18px_40px_rgba(8,145,178,0.18)]'
                      : 'border-white/10 text-gray-200 hover:border-cyan-500/40 hover:shadow-[0_12px_32px_rgba(6,182,212,0.12)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        isSelected ? 'border-cyan-400/40 bg-cyan-400/12 text-cyan-300' : 'border-white/10 bg-white/5 text-slate-300'
                      }`}>
                        {lang.icon}
                      </div>
                      <span className="font-semibold">{lang.label}</span>
                    </div>
                    {isSelected && <Check className="h-5 w-5" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Count */}
          <div className="mb-6 rounded-2xl border border-white/8 bg-[#111827]/86 p-4">
            <p className="text-sm text-[#a3a3a3]">
              <span className="font-semibold text-white">{selectedLanguages.length}</span> language
              {selectedLanguages.length !== 1 && 's'} selected
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLanguages.map((lang) => {
                const langObj = availableLanguages.find(l => l.value === lang);
                return (
                  <span key={lang} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                    {langObj?.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 font-semibold text-black shadow-[0_18px_40px_rgba(6,182,212,0.24)] hover:from-cyan-300 hover:to-cyan-500"
            size="lg"
          >
            Save Preferences
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
