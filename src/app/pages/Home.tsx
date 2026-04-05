import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, Info, Search, User, ChevronRight, Plus, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { mockContent } from '../data/mockData';
import { Content } from '../types';
import { HeroSkeleton, ContentRowSkeleton } from '../components/SkeletonLoader';

export default function Home() {
  const navigate = useNavigate();
  const { preferences } = useApp();
  const [heroIndex, setHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Get hero content
  const heroContent = mockContent.filter(c => c.isHero);
  const currentHero = heroContent[heroIndex];

  // Get content by categories
  const continueWatching = mockContent.filter(c => c.progress && c.progress > 0);
  const trending = mockContent.filter(c => c.trending);
  const includedMovies = mockContent.filter(c => c.type === 'movie' && c.accessType === 'included');
  const premiumMovies = mockContent.filter(c => c.type === 'movie' && c.accessType === 'premium');
  const tvShows = mockContent.filter(c => c.type === 'show');
  const sports = mockContent.filter(c => c.type === 'sports');
  const kids = mockContent.filter(c => c.type === 'kids');

  // Get smart recommendation label
  const getRecommendationLabel = () => {
    if (preferences.genres.length > 0) {
      const genre = preferences.genres[0];
      return `Because you like ${genre.charAt(0).toUpperCase() + genre.slice(1)}`;
    }
    if (preferences.languages.length > 0) {
      const lang = preferences.languages[0];
      return `Trending in ${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    }
    return 'Top Picks for You';
  };

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate hero content & simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroContent.length);
    }, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleContentClick = (content: Content) => {
    navigate(`/content/${content.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              StreamX
            </h1>
          </div>
        </nav>
        <HeroSkeleton />
        <div className="relative -mt-16 sm:-mt-24 space-y-8 pb-12">
          <ContentRowSkeleton />
          <ContentRowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              StreamX
            </motion.h1>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <button className="text-white hover:text-cyan-400 transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 scale-x-100 transition-transform group-hover:scale-x-100" />
              </button>
              <button 
                className="text-gray-300 hover:text-cyan-400 transition-colors relative group" 
                onClick={() => navigate('/discovery')}
              >
                Browse
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 transition-transform group-hover:scale-x-100" />
              </button>
              <button 
                className="text-gray-300 hover:text-cyan-400 transition-colors relative group"
                onClick={() => navigate('/watchlist')}
              >
                My List
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 transition-transform group-hover:scale-x-100" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/discovery')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative h-[75vh] sm:h-[85vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 20, ease: 'linear' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${currentHero.thumbnail})`,
                filter: 'brightness(0.7)'
              }}
            />
            
            {/* Enhanced Gradients */}
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 gradient-hero-bottom" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full flex items-end">
          <div className="px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 max-w-3xl">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Badge with Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                {currentHero.accessType === 'included' ? (
                  <span className="inline-block badge-included shadow-lg">
                    ✨ INCLUDED
                  </span>
                ) : (
                  <span className="inline-block badge-premium shadow-lg">
                    ⭐ PREMIUM
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl">
                {currentHero.title}
              </h2>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="text-green-400 flex items-center gap-1">
                  ⭐ {currentHero.rating}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{currentHero.year}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{currentHero.duration}</span>
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-bold uppercase">
                  {currentHero.language}
                </span>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed line-clamp-3 max-w-2xl drop-shadow-lg">
                {currentHero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={() => handleContentClick(currentHero)}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-base font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
                  Play Now
                </Button>
                <Button
                  onClick={() => handleContentClick(currentHero)}
                  size="lg"
                  variant="outline"
                  className="glass-effect-strong border-white/30 hover:border-white/50 text-white px-8 py-6 text-base font-semibold hover:scale-105 active:scale-95 transition-all"
                >
                  <Info className="w-6 h-6 mr-2" />
                  More Info
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Mute Button (simulated) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-32 sm:bottom-40 right-6 sm:right-8 p-3 bg-black/50 hover:bg-black/70 border border-white/30 rounded-full transition-all hover:scale-110"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Enhanced Hero Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex gap-2">
          {heroContent.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-1 rounded-full transition-all ${
                idx === heroIndex 
                  ? 'w-12 bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                  : 'w-6 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative -mt-20 sm:-mt-32 space-y-10 sm:space-y-12 pb-12">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={continueWatching}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/continue-watching')}
            showProgress
          />
        )}

        {/* Recommended for You */}
        <ContentRow
          title={getRecommendationLabel()}
          items={trending.slice(0, 6)}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/recommended')}
        />

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          subtitle="🔥 Most watched this week"
          items={trending}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/trending')}
        />

        {/* Included Movies */}
        <ContentRow
          title="Included Movies"
          subtitle="✨ Free with your subscription"
          items={includedMovies}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/movies')}
        />

        {/* Premium Movies */}
        <ContentRow
          title="Premium Movies"
          subtitle="⭐ Subscribe to watch"
          items={premiumMovies}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/movies')}
        />

        {/* TV Shows */}
        <ContentRow
          title="TV Shows"
          subtitle="📺 Binge-worthy series"
          items={tvShows}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/shows')}
        />

        {/* Sports */}
        {sports.length > 0 && (
          <ContentRow
            title="Sports"
            subtitle="⚽ Live matches & highlights"
            items={sports}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/see-all/sports')}
          />
        )}

        {/* Kids */}
        {kids.length > 0 && (
          <ContentRow
            title="Kids & Family"
            subtitle="👨‍👩‍👧‍👦 Safe content for all ages"
            items={kids}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/see-all/kids')}
          />
        )}
      </div>
    </div>
  );
}

// Content Row Component
interface ContentRowProps {
  title: string;
  subtitle?: string;
  items: Content[];
  onItemClick: (content: Content) => void;
  onSeeAll?: () => void;
  showProgress?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, subtitle, items, onItemClick, onSeeAll, showProgress }) => {
  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-cyan-400 text-sm flex items-center gap-1 hover:gap-2 transition-all active:scale-95"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-40 sm:w-48 cursor-pointer group"
            onClick={() => onItemClick(item)}
          >
            <div className="relative rounded-lg overflow-hidden mb-2">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Access Type Badge */}
              <div className="absolute top-2 left-2">
                {item.accessType === 'included' ? (
                  <span className="px-2 py-1 bg-cyan-500 text-black text-xs font-bold rounded">
                    Included
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
                    Premium
                  </span>
                )}
              </div>
              {/* Language Tag */}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded uppercase">
                  {item.language}
                </span>
              </div>
              {/* Progress Bar */}
              {showProgress && item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white fill-current" />
              </div>
            </div>
            <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>⭐ {item.rating}</span>
              <span>•</span>
              <span>{item.duration}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};