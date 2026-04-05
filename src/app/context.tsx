import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, Language, Genre, ContentType } from './types';

interface AppContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  languages: ['english'],
  genres: [],
  contentTypes: ['movie', 'show', 'sports', 'kids'],
  onboardingCompleted: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('streamx-preferences');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('streamx-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setPreferences(prev => ({ ...prev, onboardingCompleted: true }));
  };

  return (
    <AppContext.Provider value={{ preferences, updatePreferences, completeOnboarding }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
