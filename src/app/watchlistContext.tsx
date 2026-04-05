import React, { createContext, useContext, useState, useEffect } from 'react';
import { Content } from './types';

interface WatchlistContextType {
  watchlist: string[]; // Array of content IDs
  addToWatchlist: (contentId: string) => void;
  removeFromWatchlist: (contentId: string) => void;
  isInWatchlist: (contentId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const stored = localStorage.getItem('smartstream-watchlist');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('smartstream-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (contentId: string) => {
    setWatchlist(prev => {
      if (prev.includes(contentId)) return prev;
      return [...prev, contentId];
    });
  };

  const removeFromWatchlist = (contentId: string) => {
    setWatchlist(prev => prev.filter(id => id !== contentId));
  };

  const isInWatchlist = (contentId: string) => {
    return watchlist.includes(contentId);
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
};
