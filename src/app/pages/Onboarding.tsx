import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Baby,
  BookOpenText,
  Check,
  ChevronRight,
  Clapperboard,
  Globe2,
  Heart,
  Languages,
  MonitorPlay,
  ShieldAlert,
  Sparkles,
  Swords,
  Trophy,
  Tv,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { Language, Genre, ContentType } from '../types';

const languages: { value: Language; label: string; icon: React.ReactNode }[] = [
  { value: 'english', label: 'English', icon: <Globe2 className="h-5 w-5" /> },
  { value: 'hindi', label: 'Hindi', icon: <Languages className="h-5 w-5" /> },
  { value: 'tamil', label: 'Tamil', icon: <Languages className="h-5 w-5" /> },
  { value: 'telugu', label: 'Telugu', icon: <Languages className="h-5 w-5" /> },
  { value: 'malayalam', label: 'Malayalam', icon: <Languages className="h-5 w-5" /> },
  { value: 'kannada', label: 'Kannada', icon: <Languages className="h-5 w-5" /> },
  { value: 'marathi', label: 'Marathi', icon: <Languages className="h-5 w-5" /> },
];

const genres: { value: Genre; label: string; icon: React.ReactNode }[] = [
  { value: 'action', label: 'Action', icon: <Zap className="h-5 w-5" /> },
  { value: 'comedy', label: 'Comedy', icon: <Sparkles className="h-5 w-5" /> },
  { value: 'drama', label: 'Drama', icon: <Heart className="h-5 w-5" /> },
  { value: 'thriller', label: 'Thriller', icon: <Swords className="h-5 w-5" /> },
  { value: 'horror', label: 'Horror', icon: <ShieldAlert className="h-5 w-5" /> },
  { value: 'romance', label: 'Romance', icon: <Heart className="h-5 w-5" /> },
  { value: 'sci-fi', label: 'Sci-Fi', icon: <WandSparkles className="h-5 w-5" /> },
  { value: 'documentary', label: 'Documentary', icon: <BookOpenText className="h-5 w-5" /> },
  { value: 'animation', label: 'Animation', icon: <Sparkles className="h-5 w-5" /> },
  { value: 'sports', label: 'Sports', icon: <Trophy className="h-5 w-5" /> },
  { value: 'kids', label: 'Kids', icon: <Baby className="h-5 w-5" /> },
];

const contentTypes: { value: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'movie', label: 'Movies', icon: <Clapperboard className="h-8 w-8" />, description: 'Feature films' },
  { value: 'show', label: 'TV Shows', icon: <Tv className="h-8 w-8" />, description: 'Series and episodes' },
  { value: 'sports', label: 'Sports', icon: <Trophy className="h-8 w-8" />, description: 'Live and highlights' },
  { value: 'kids', label: 'Kids', icon: <MonitorPlay className="h-8 w-8" />, description: 'Family friendly' },
];

function SelectionState({ selected }: { selected: boolean }) {
  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
        selected ? 'scale-100 bg-cyan-400' : 'scale-0 bg-white/10'
      }`}
    >
      {selected && <Check className="h-4 w-4 text-black" strokeWidth={3} />}
    </div>
  );
}

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
    setSelectedLanguages((prev) => (prev.includes(lang) ? prev.filter((item) => item !== lang) : [...prev, lang]));
  };

  const toggleGenre = (genre: Genre) => {
    setShowValidation(false);
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]));
  };

  const toggleContentType = (type: ContentType) => {
    setShowValidation(false);
    setSelectedContentTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  };

  const canProceed = () => {
    if (step === 1) return selectedLanguages.length > 0;
    if (step === 2) return selectedGenres.length > 0;
    if (step === 3) return selectedContentTypes.length > 0;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) {
      setShowValidation(true);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      setShowValidation(false);
      return;
    }

    updatePreferences({
      languages: selectedLanguages,
      genres: selectedGenres,
      contentTypes: selectedContentTypes,
    });
    completeOnboarding();
    navigate('/home');
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1);
      setShowValidation(false);
      return;
    }

    updatePreferences({
      languages: selectedLanguages,
      genres: selectedGenres.length > 0 ? selectedGenres : ['action', 'drama'],
      contentTypes: selectedContentTypes,
    });
    completeOnboarding();
    navigate('/home');
  };

  const getStepTitle = () => {
    if (step === 1) return 'Select Your Languages';
    if (step === 2) return 'Choose Your Genres';
    return 'Content Preferences';
  };

  const getStepDescription = () => {
    if (step === 1) return 'Choose one or more languages for your content.';
    if (step === 2) return 'Select the genres you want to see more often.';
    return 'Pick the content types that should shape your home screen.';
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-linear-to-b from-[#05070b] to-[#0b1220] text-white">
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
            StreamX
          </h1>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-cyan-300"
          >
            Skip
          </button>
        </motion.div>
      </div>

      <div className="mb-6 px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-400">Step {step} of 3</span>
            <span className="text-sm font-medium text-cyan-300">{Math.round((step / 3) * 100)}% Complete</span>
          </motion.div>

          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: item * 0.1 }}
                className="h-2 flex-1 origin-left overflow-hidden rounded-full bg-white/8"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: item <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[calc(9rem+env(safe-area-inset-bottom))] md:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center md:text-left">
                <h2 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">{getStepTitle()}</h2>
                <p className="max-w-2xl text-base leading-relaxed text-[#a3a3a3] md:text-lg">{getStepDescription()}</p>
              </div>

              <AnimatePresence>
                {showValidation && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm text-red-400">Please select at least one option to continue.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === 1 && (
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {languages.map((lang, idx) => {
                    const selected = selectedLanguages.includes(lang.value);

                    return (
                      <motion.button
                        key={lang.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.015, y: -2 }}
                        onClick={() => toggleLanguage(lang.value)}
                        className={`group relative w-full overflow-hidden rounded-2xl border bg-[#111827]/86 p-4 text-left transition-all duration-200 sm:w-[calc(50%-0.5rem)] md:p-5 ${
                          selected
                            ? 'border-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_18px_40px_rgba(8,145,178,0.18)]'
                            : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_32px_rgba(6,182,212,0.12)]'
                        }`}
                      >
                        {selected && (
                          <motion.div
                            layoutId={`glow-${lang.value}`}
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/14 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}

                        <div className="relative flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                              selected ? 'border-cyan-400/40 bg-cyan-400/12 text-cyan-300' : 'border-white/10 bg-white/5 text-slate-300'
                            }`}
                          >
                            {lang.icon}
                          </div>
                          <div className="flex-1">
                            <span className="text-base font-semibold md:text-lg">{lang.label}</span>
                          </div>
                          <SelectionState selected={selected} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {genres.map((genre, idx) => {
                    const selected = selectedGenres.includes(genre.value);

                    return (
                      <motion.button
                        key={genre.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => toggleGenre(genre.value)}
                        className={`group relative w-[calc(50%-0.375rem)] overflow-hidden rounded-2xl border bg-[#111827]/86 p-4 transition-all duration-200 sm:w-[calc(33.333%-0.5rem)] md:p-5 lg:w-[calc(25%-0.75rem)] ${
                          selected
                            ? 'border-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_18px_40px_rgba(8,145,178,0.18)]'
                            : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_32px_rgba(6,182,212,0.12)]'
                        }`}
                      >
                        {selected && (
                          <motion.div
                            layoutId={`genre-glow-${genre.value}`}
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/14 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}

                        <div className="relative flex flex-col items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                              selected ? 'border-cyan-400/40 bg-cyan-400/12 text-cyan-300' : 'border-white/10 bg-white/5 text-slate-300'
                            }`}
                          >
                            {genre.icon}
                          </div>
                          <span className="text-center text-sm font-semibold md:text-base">{genre.label}</span>
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400"
                            >
                              <Check className="h-3 w-3 text-black" strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <div className="mx-auto flex max-w-3xl flex-wrap gap-4 md:gap-5">
                  {contentTypes.map((type, idx) => {
                    const selected = selectedContentTypes.includes(type.value);

                    return (
                      <motion.button
                        key={type.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => toggleContentType(type.value)}
                        className={`group relative w-full overflow-hidden rounded-[24px] border bg-[#111827]/86 p-6 transition-all duration-200 sm:w-[calc(50%-0.625rem)] md:p-8 ${
                          selected
                            ? 'border-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_18px_40px_rgba(8,145,178,0.18)]'
                            : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_12px_32px_rgba(6,182,212,0.12)]'
                        }`}
                      >
                        {selected && (
                          <motion.div
                            layoutId={`content-glow-${type.value}`}
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/14 via-cyan-500/5 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}

                        <div className="relative flex flex-col items-center gap-4">
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
                              selected ? 'border-cyan-400/40 bg-cyan-400/12 text-cyan-300' : 'border-white/10 bg-white/5 text-slate-300'
                            }`}
                          >
                            {type.icon}
                          </div>
                          <div className="text-center">
                            <h3 className="mb-1 text-lg font-bold md:text-xl">{type.label}</h3>
                            <p className="text-sm text-[#a3a3a3]">{type.description}</p>
                          </div>
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400"
                            >
                              <Check className="h-4 w-4 text-black" strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-white/8 bg-[#05070b]/96 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-8 md:pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-2xl gap-3 md:gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="h-12 flex-1 rounded-2xl border-white/10 bg-white/5 text-base font-semibold text-white hover:bg-white/10 md:h-14"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={`h-12 flex-1 rounded-2xl text-base font-semibold transition-all md:h-14 ${
              canProceed()
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black shadow-[0_18px_40px_rgba(6,182,212,0.28)] hover:from-cyan-300 hover:to-cyan-500'
                : 'cursor-not-allowed bg-white/8 text-gray-400'
            }`}
          >
            {step === 3 ? (
              <>
                Get Started
                <ChevronRight className="ml-1 h-5 w-5" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="ml-1 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
