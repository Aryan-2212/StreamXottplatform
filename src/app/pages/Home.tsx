import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Clapperboard,
  Crown,
  Flame,
  Info,
  Play,
  Search,
  Sparkles,
  Star,
  Tv2,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { mockContent } from '../data/mockData';
import { Content } from '../types';
import { HeroSkeleton, ContentRowSkeleton } from '../components/SkeletonLoader';
import MediaCard from '../components/MediaCard';

export default function Home() {
  const navigate = useNavigate();
  const { preferences, profile } = useApp();
  const [heroIndex, setHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const heroContent = mockContent.filter((content) => content.isHero);
  const currentHero = heroContent[heroIndex];

  const continueWatching = mockContent.filter((content) => content.progress && content.progress > 0);
  const trending = mockContent.filter((content) => content.trending);
  const includedMovies = mockContent.filter((content) => content.type === 'movie' && content.accessType === 'included');
  const premiumMovies = mockContent.filter((content) => content.type === 'movie' && content.accessType === 'premium');
  const tvShows = mockContent.filter((content) => content.type === 'show');
  const sports = mockContent.filter((content) => content.type === 'sports');
  const kids = mockContent.filter((content) => content.type === 'kids');

  const getRecommendationLabel = () => {
    if (preferences.genres.length > 0) {
      const genre = preferences.genres[0];
      return `Because you like ${genre.charAt(0).toUpperCase() + genre.slice(1)}`;
    }
    if (preferences.languages.length > 0) {
      const language = preferences.languages[0];
      return `Trending in ${language.charAt(0).toUpperCase() + language.slice(1)}`;
    }
    return 'Top Picks for You';
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const interval = setInterval(() => {
      setHeroIndex((previous) => (previous + 1) % heroContent.length);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [heroContent.length]);

  const handleContentClick = (content: Content) => {
    navigate(`/content/${content.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02060c] text-white">
        <nav className="fixed left-0 right-0 top-0 z-50 bg-[#02060c]/85 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              StreamX
            </h1>
          </div>
        </nav>
        <HeroSkeleton />
        <div className="relative mt-8 space-y-8 pb-12">
          <ContentRowSkeleton />
          <ContentRowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#02060c]/94 shadow-lg backdrop-blur-md' : 'bg-gradient-to-b from-[#02060c]/92 via-[#02060c]/48 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 lg:gap-8">
            <motion.h1
              className="cursor-pointer bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              StreamX
            </motion.h1>
            <div className="hidden gap-6 text-sm font-medium md:flex">
              <button className="group relative text-white transition-colors hover:text-cyan-300">
                Home
                <span className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-100 bg-cyan-400 transition-transform" />
              </button>
              <button
                className="group relative text-gray-300 transition-colors hover:text-cyan-300"
                onClick={() => navigate('/discovery')}
              >
                Browse
                <span className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100" />
              </button>
              <button
                className="group relative text-gray-300 transition-colors hover:text-cyan-300"
                onClick={() => navigate('/watchlist')}
              >
                My List
                <span className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/discovery')}
              className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/profile')}
              className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10"
              aria-label={profile.name}
            >
              <User className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative h-[78vh] overflow-hidden pt-22 sm:h-[86vh] sm:pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 20, ease: 'linear' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentHero.backdrop || currentHero.thumbnail})`,
                filter: 'brightness(0.78)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#02060c] via-[#02060c]/72 to-[#02060c]/18" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02060c] via-[#02060c]/18 to-[#02060c]/28" />
          </motion.div>
        </AnimatePresence>

        <div className="relative flex h-full items-end">
          <div className="max-w-3xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-5 sm:space-y-6"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
                {currentHero.accessType === 'included' ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" />
                    Included
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/14 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 shadow-lg">
                    <Crown className="h-3.5 w-3.5" />
                    Premium
                  </span>
                )}
              </motion.div>

              <h2 className="text-4xl font-bold leading-tight drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                {currentHero.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1.5 text-white">
                  <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                  {currentHero.rating}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{currentHero.year}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{currentHero.duration}</span>
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
                  {currentHero.language}
                </span>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-gray-200/92 drop-shadow-lg sm:text-lg">
                {currentHero.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={() => handleContentClick(currentHero)}
                  size="lg"
                  className="bg-white px-8 py-6 text-base font-bold text-black shadow-xl transition-all hover:scale-[1.03] hover:bg-gray-200 hover:shadow-2xl active:scale-95"
                >
                  <Play className="mr-2 h-6 w-6 fill-current" />
                  Play Now
                </Button>
                <Button
                  onClick={() => handleContentClick(currentHero)}
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-black/20 px-8 py-6 text-base font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.03] hover:border-white/45 hover:bg-white/10 active:scale-95"
                >
                  <Info className="mr-2 h-6 w-6" />
                  More Info
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-32 right-6 rounded-full border border-white/18 bg-black/45 p-3 transition-all hover:scale-110 hover:bg-black/70 sm:bottom-40 sm:right-8"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </motion.button>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-2 sm:bottom-8 sm:right-8">
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`h-1 rounded-full transition-all ${
                index === heroIndex ? 'w-12 bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'w-6 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-1 space-y-11 pb-12 sm:mt-0 sm:space-y-12">
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            items={continueWatching}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/continue-watching')}
            showProgress
          />
        )}

        <ContentRow
          title={getRecommendationLabel()}
          subtitle="Curated around your recent taste"
          subtitleIcon={Sparkles}
          items={trending.slice(0, 6)}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/recommended')}
        />

        <ContentRow
          title="Trending Now"
          subtitle="Most watched this week"
          subtitleIcon={Flame}
          items={trending}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/trending')}
        />

        <ContentRow
          title="Included Movies"
          subtitle="Free with your subscription"
          subtitleIcon={Sparkles}
          items={includedMovies}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/movies')}
        />

        <ContentRow
          title="Premium Movies"
          subtitle="Subscribe to watch"
          subtitleIcon={Crown}
          items={premiumMovies}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/movies')}
        />

        <ContentRow
          title="TV Shows"
          subtitle="Binge-worthy series"
          subtitleIcon={Tv2}
          items={tvShows}
          onItemClick={handleContentClick}
          onSeeAll={() => navigate('/see-all/shows')}
        />

        {sports.length > 0 && (
          <ContentRow
            title="Sports"
            subtitle="Live matches and highlights"
            subtitleIcon={Clapperboard}
            items={sports}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/see-all/sports')}
          />
        )}

        {kids.length > 0 && (
          <ContentRow
            title="Kids & Family"
            subtitle="Safe content for all ages"
            subtitleIcon={Sparkles}
            items={kids}
            onItemClick={handleContentClick}
            onSeeAll={() => navigate('/see-all/kids')}
          />
        )}
      </div>
    </div>
  );
}

interface ContentRowProps {
  title: string;
  subtitle?: string;
  subtitleIcon?: React.ElementType;
  items: Content[];
  onItemClick: (content: Content) => void;
  onSeeAll?: () => void;
  showProgress?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  subtitle,
  subtitleIcon: SubtitleIcon,
  items,
  onItemClick,
  onSeeAll,
  showProgress,
}) => {
  return (
    <div className="px-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold sm:text-2xl">{title}</h3>
          {subtitle && (
            <p className="mt-1 inline-flex items-center gap-2 text-sm text-gray-400">
              {SubtitleIcon ? <SubtitleIcon className="h-4 w-4 text-cyan-300" /> : null}
              {subtitle}
            </p>
          )}
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} className="flex items-center gap-1 text-sm text-cyan-400 transition-all hover:gap-2 active:scale-95">
            See All <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-start gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, index) => (
          <div key={item.id} className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[235px] 2xl:w-[250px]">
            <MediaCard
              content={item}
              index={index}
              onClick={() => onItemClick(item)}
              showProgress={showProgress}
              secondaryMeta="duration"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
