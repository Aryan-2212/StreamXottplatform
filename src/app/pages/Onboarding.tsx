import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Globe, Film, Tv, Trophy, Heart, Zap, Sparkles, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { Language, Genre, ContentType } from '../types';

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'english', label: 'English', flag: '🇬🇧' },
  { value: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { value: 'tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { value: 'telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { value: 'malayalam', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { value: 'marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
];

const genres: { value: Genre; label: string; icon: React.ReactNode }[] = [
  { value: 'action', label: 'Action', icon: <Zap className="w-5 h-5" /> },
  { value: 'comedy', label: 'Comedy', icon: <span className="text-xl">😂</span> },
  { value: 'drama', label: 'Drama', icon: <Heart className="w-5 h-5" /> },
  { value: 'thriller', label: 'Thriller', icon: <span className="text-xl">🔪</span> },
  { value: 'horror', label: 'Horror', icon: <span className="text-xl">👻</span> },
  { value: 'romance', label: 'Romance', icon: <span className="text-xl">💕</span> },
  { value: 'sci-fi', label: 'Sci-Fi', icon: <span className="text-xl">🚀</span> },
  { value: 'documentary', label: 'Documentary', icon: <Film className="w-5 h-5" /> },
  { value: 'animation', label: 'Animation', icon: <Sparkles className="w-5 h-5" /> },
  { value: 'sports', label: 'Sports', icon: <Trophy className="w-5 h-5" /> },
  { value: 'kids', label: 'Kids', icon: <span className="text-xl">👶</span> },
];

const contentTypes: { value: ContentType; label: string; icon: string; description: string }[] = [
  { value: 'movie', label: 'Movies', icon: '🎬', description: 'Feature films' },
  { value: 'show', label: 'TV Shows', icon: '📺', description: 'Series & episodes' },
  { value: 'sports', label: 'Sports', icon: '⚽', description: 'Live & highlights' },
  { value: 'kids', label: 'Kids', icon: '👶', description: 'Family friendly' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updatePreferences, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['english']);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<ContentType[]>(['movie', 'show', 'sports', 'kids']);
  const [showValidation, setShowValidation] = useState(false);

  const toggleLanguage = (lang: Language) => {
    setShowValidation(false);
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleGenre = (genre: Genre) => {
    setShowValidation(false);
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleContentType = (type: ContentType) => {
    setShowValidation(false);
    setSelectedContentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (!canProceed()) {
      setShowValidation(true);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      setShowValidation(false);
    } else {
      updatePreferences({
        languages: selectedLanguages,
        genres: selectedGenres,
        contentTypes: selectedContentTypes,
      });
      completeOnboarding();
      navigate('/home');
    }
  };

  const handleSkip = () => {
    // Skip to next step or complete onboarding with defaults
    if (step < 3) {
      setStep(step + 1);
      setShowValidation(false);
    } else {
      updatePreferences({
        languages: selectedLanguages,
        genres: selectedGenres.length > 0 ? selectedGenres : ['action', 'drama'],
        contentTypes: selectedContentTypes,
      });
      completeOnboarding();
      navigate('/home');
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedLanguages.length > 0;
    if (step === 2) return selectedGenres.length > 0;
    if (step === 3) return selectedContentTypes.length > 0;
    return false;
  };

  const getStepTitle = () => {
    if (step === 1) return 'Select Your Languages';
    if (step === 2) return 'Choose Your Genres';
    return 'Content Preferences';
  };

  const getStepDescription = () => {
    if (step === 1) return 'Choose one or more languages for your content';
    if (step === 2) return 'Select genres you enjoy watching';
    return 'What type of content do you want to see?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            StreamX
          </h1>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors underline underline-offset-4"
          >
            Skip
          </button>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 md:px-8 mb-8">
        <div className="max-w-2xl mx-auto">
          {/* Step Label */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-3"
          >
            <span className="text-sm font-medium text-gray-400">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-cyan-400">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </motion.div>

          {/* Progress Bars */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: s * 0.1 }}
                className="h-2 flex-1 rounded-full bg-gray-800 overflow-hidden origin-left"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: s <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 md:px-8 pb-6 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Title */}
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{getStepTitle()}</h2>
                <p className="text-gray-400 text-base md:text-lg">
                  {getStepDescription()}
                </p>
              </div>

              {/* Validation Message */}
              <AnimatePresence>
                {showValidation && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">
                      ⚠️ Please select at least one option to continue
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {languages.map((lang, idx) => (
                    <motion.button
                      key={lang.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => toggleLanguage(lang.value)}
                      className={`p-4 md:p-5 rounded-xl border-2 transition-all text-left group relative overflow-hidden ${
                        selectedLanguages.includes(lang.value)
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
                      }`}
                    >
                      {/* Background Glow Effect */}
                      {selectedLanguages.includes(lang.value) && (
                        <motion.div
                          layoutId={`glow-${lang.value}`}
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}

                      <div className="relative flex items-center gap-3">
                        <span className="text-3xl">{lang.flag}</span>
                        <div className="flex-1">
                          <span className="text-base md:text-lg font-medium">{lang.label}</span>
                        </div>
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                          selectedLanguages.includes(lang.value)
                            ? 'bg-cyan-500 scale-100'
                            : 'bg-gray-700 scale-0 group-hover:scale-100'
                        }`}>
                          {selectedLanguages.includes(lang.value) && (
                            <Check className="w-4 h-4 text-black" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {genres.map((genre, idx) => (
                    <motion.button
                      key={genre.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => toggleGenre(genre.value)}
                      className={`p-4 md:p-5 rounded-xl border-2 transition-all relative overflow-hidden group ${
                        selectedGenres.includes(genre.value)
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
                      }`}
                    >
                      {selectedGenres.includes(genre.value) && (
                        <motion.div
                          layoutId={`genre-glow-${genre.value}`}
                          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}

                      <div className="relative flex flex-col items-center gap-2 md:gap-3">
                        <div className="text-cyan-400">
                          {genre.icon}
                        </div>
                        <span className="text-sm md:text-base font-medium text-center">{genre.label}</span>
                        {selectedGenres.includes(genre.value) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-black" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                  {contentTypes.map((type, idx) => (
                    <motion.button
                      key={type.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => toggleContentType(type.value)}
                      className={`p-6 md:p-8 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                        selectedContentTypes.includes(type.value)
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
                      }`}
                    >
                      {selectedContentTypes.includes(type.value) && (
                        <motion.div
                          layoutId={`content-glow-${type.value}`}
                          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}

                      <div className="relative flex flex-col items-center gap-3 md:gap-4">
                        <span className="text-5xl md:text-6xl">{type.icon}</span>
                        <div className="text-center">
                          <h3 className="text-lg md:text-xl font-semibold mb-1">{type.label}</h3>
                          <p className="text-sm text-gray-400">{type.description}</p>
                        </div>
                        {selectedContentTypes.includes(type.value) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-black" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 md:p-8 border-t border-gray-800/50 backdrop-blur-sm bg-black/50">
        <div className="max-w-2xl mx-auto flex gap-3 md:gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white h-12 md:h-14 text-base font-semibold"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={`flex-1 h-12 md:h-14 text-base font-semibold transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 3 ? (
              <>
                Get Started
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}