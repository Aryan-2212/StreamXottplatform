import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, ArrowLeft, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { mockContent } from '../data/mockData';
import { Content, Language, Genre, ContentType, AccessType } from '../types';
import { GridSkeleton } from '../components/SkeletonLoader';

const languages: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'marathi', label: 'Marathi' },
];

const genres: { value: Genre; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'horror', label: 'Horror' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'animation', label: 'Animation' },
  { value: 'sports', label: 'Sports' },
  { value: 'kids', label: 'Kids' },
];

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'show', label: 'TV Shows' },
  { value: 'sports', label: 'Sports' },
  { value: 'kids', label: 'Kids' },
];

export default function Discovery() {
  const navigate = useNavigate();
  const { preferences } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccessType, setSelectedAccessType] = useState<AccessType | 'all'>('all');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(preferences.languages);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<ContentType[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year'>('relevance');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let results = [...mockContent];

    // Search query
    if (debouncedSearch) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Access type filter
    if (selectedAccessType !== 'all') {
      results = results.filter(item => item.accessType === selectedAccessType);
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      results = results.filter(item => selectedLanguages.includes(item.language));
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      results = results.filter(item =>
        item.genre.some(g => selectedGenres.includes(g))
      );
    }

    // Content type filter
    if (selectedContentTypes.length > 0) {
      results = results.filter(item => selectedContentTypes.includes(item.type));
    }

    // Sort
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      results.sort((a, b) => b.year - a.year);
    }

    return results;
  }, [debouncedSearch, selectedAccessType, selectedLanguages, selectedGenres, selectedContentTypes, sortBy]);

  const toggleLanguage = (lang: Language) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleContentType = (type: ContentType) => {
    setSelectedContentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedAccessType('all');
    setSelectedLanguages(preferences.languages);
    setSelectedGenres([]);
    setSelectedContentTypes([]);
    setSortBy('relevance');
  };

  const activeFiltersCount = 
    (selectedAccessType !== 'all' ? 1 : 0) +
    selectedGenres.length +
    selectedContentTypes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Bar */}
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Browse & Discover
            </h1>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies, shows, sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/80 text-white pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-800 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-500"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`bg-gray-900/80 border-gray-700 hover:bg-gray-800 transition-all ${
                showFilters ? 'border-cyan-500 bg-cyan-500/10' : ''
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 px-2 py-0.5 bg-cyan-500 text-black text-xs font-bold rounded-full"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'rating' | 'year')}
              className="px-4 py-2.5 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Rating</option>
              <option value="year">Sort: Year</option>
            </select>

            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={clearFilters}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
              >
                Clear All
              </motion.button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-800/50 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {/* Access Type */}
                <div>
                  <h3 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                    Content Access
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'included', 'premium'].map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAccessType(type as AccessType | 'all')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedAccessType === type
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {type === 'all' ? 'All Content' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLanguage(lang.value)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedLanguages.includes(lang.value)
                            ? 'bg-cyan-500 text-black shadow-md'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {lang.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <motion.button
                        key={genre.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleGenre(genre.value)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedGenres.includes(genre.value)
                            ? 'bg-cyan-500 text-black shadow-md'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {genre.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <h3 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                    Content Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contentTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleContentType(type.value)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedContentTypes.includes(type.value)
                            ? 'bg-cyan-500 text-black shadow-md'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters Display */}
        <AnimatePresence>
          {(selectedAccessType !== 'all' || selectedGenres.length > 0 || selectedContentTypes.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Active Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAccessType !== 'all' && (
                  <FilterChip
                    label={selectedAccessType}
                    onRemove={() => setSelectedAccessType('all')}
                  />
                )}
                {selectedGenres.map((genre) => (
                  <FilterChip
                    key={genre}
                    label={genre}
                    onRemove={() => toggleGenre(genre)}
                  />
                ))}
                {selectedContentTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={contentTypes.find(t => t.value === type)?.label || type}
                    onRemove={() => toggleContentType(type)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {isLoading ? (
              <span className="skeleton h-4 w-32 rounded inline-block" />
            ) : (
              <>
                Showing <span className="font-bold text-cyan-400">{filteredContent.length}</span> results
                {searchQuery && (
                  <> for "<span className="font-semibold text-white">{searchQuery}</span>"</>
                )}
              </>
            )}
          </p>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <GridSkeleton count={12} />
        ) : filteredContent.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-semibold"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredContent.map((item, idx) => (
              <ContentCard
                key={item.id}
                content={item}
                index={idx}
                onClick={() => navigate(`/content/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Chip Component
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    onClick={onRemove}
    className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm hover:bg-cyan-500/30 transition-all group"
  >
    <span className="capitalize font-medium">{label}</span>
    <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
  </motion.button>
);

// Content Card Component
const ContentCard = ({ 
  content, 
  index, 
  onClick 
}: { 
  content: Content; 
  index: number; 
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.03 }}
    whileHover={{ scale: 1.05, zIndex: 10 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="cursor-pointer group"
  >
    <div className="relative rounded-xl overflow-hidden mb-3 shadow-lg hover:shadow-2xl transition-shadow">
      <img
        src={content.thumbnail}
        alt={content.title}
        className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      
      {/* Badges */}
      <div className="absolute top-2 left-2">
        {content.accessType === 'included' ? (
          <span className="badge-included">Included</span>
        ) : (
          <span className="badge-premium">Premium</span>
        )}
      </div>
      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded uppercase">
          {content.language}
        </span>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-gray-300 mb-1">
            ⭐ {content.rating} • {content.year}
          </p>
          <p className="text-xs text-gray-400 line-clamp-2">{content.description}</p>
        </div>
      </div>
    </div>
    
    <h4 className="text-sm font-semibold line-clamp-1 mb-1">{content.title}</h4>
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="flex items-center gap-1">
        ⭐ {content.rating}
      </span>
      <span>•</span>
      <span>{content.duration}</span>
    </div>
  </motion.div>
);
