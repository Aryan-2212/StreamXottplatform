import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, UserProfile } from './types';

interface AppContextType {
  preferences: UserPreferences;
  profile: UserProfile;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  languages: ['english'],
  genres: [],
  contentTypes: ['movie', 'show', 'sports', 'kids'],
  onboardingCompleted: false,
};

const defaultProfile: UserProfile = {
  name: 'Aarav Mehta',
  avatarIndex: 0,
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

  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('streamx-profile');
    if (stored) {
      try {
        return { ...defaultProfile, ...JSON.parse(stored) };
      } catch {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('streamx-preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('streamx-profile', JSON.stringify(profile));
  }, [profile]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setPreferences(prev => ({ ...prev, onboardingCompleted: true }));
  };

  return (
    <AppContext.Provider value={{ preferences, profile, updatePreferences, updateProfile, completeOnboarding }}>
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
