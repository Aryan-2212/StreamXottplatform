import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, SlidersHorizontal, TrendingUp, X, SearchX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context';
import { mockContent } from '../data/mockData';
import { ContentType, Genre, Language, AccessType } from '../types';
import { GridSkeleton } from '../components/SkeletonLoader';
import MediaCard from '../components/MediaCard';

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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredContent = useMemo(() => {
    let results = [...mockContent];

    if (debouncedSearch) {
      results = results.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedAccessType !== 'all') {
      results = results.filter((item) => item.accessType === selectedAccessType);
    }

    if (selectedLanguages.length > 0) {
      results = results.filter((item) => selectedLanguages.includes(item.language));
    }

    if (selectedGenres.length > 0) {
      results = results.filter((item) => item.genre.some((genre) => selectedGenres.includes(genre)));
    }

    if (selectedContentTypes.length > 0) {
      results = results.filter((item) => selectedContentTypes.includes(item.type));
    }

    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      results.sort((a, b) => b.year - a.year);
    }

    return results;
  }, [debouncedSearch, selectedAccessType, selectedLanguages, selectedGenres, selectedContentTypes, sortBy]);

  const toggleLanguage = (lang: Language) => {
    setSelectedLanguages((prev) => (prev.includes(lang) ? prev.filter((item) => item !== lang) : [...prev, lang]));
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]));
  };

  const toggleContentType = (type: ContentType) => {
    setSelectedContentTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
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
    <div className="min-h-screen bg-linear-to-b from-[#02060c] to-[#09111d] text-white">
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#02060c]/94 shadow-xl backdrop-blur-xl">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/home')}
              className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              Browse & Discover
            </h1>
          </div>

          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies, shows, sports..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/88 py-3.5 pl-12 pr-12 text-white transition-all placeholder:text-gray-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 rounded-full border border-white/10 bg-white/5 p-1.5 transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                showFilters
                  ? 'border-cyan-400/70 bg-cyan-400/14 text-cyan-200 shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                  : 'border-white/12 bg-[#111827] text-white hover:border-cyan-400/45 hover:bg-[#162033]'
              }`}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-black"
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </Button>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as 'relevance' | 'rating' | 'year')}
              className="cursor-pointer rounded-2xl border border-white/12 bg-[#111827] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:border-cyan-400/45 focus:border-cyan-400/70 focus:outline-none"
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
                className="text-sm font-medium text-cyan-300 underline underline-offset-4 transition-colors hover:text-cyan-200"
              >
                Clear All
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden border-t border-white/8 bg-[#08111d]/96"
            >
              <div className="scrollbar-thin max-h-[60vh] space-y-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                <FilterSection title="Content Access">
                  {['all', 'included', 'premium'].map((type) => (
                    <FilterButton
                      key={type}
                      active={selectedAccessType === type}
                      label={type === 'all' ? 'All Content' : type.charAt(0).toUpperCase() + type.slice(1)}
                      onClick={() => setSelectedAccessType(type as AccessType | 'all')}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Languages">
                  {languages.map((language) => (
                    <FilterButton
                      key={language.value}
                      active={selectedLanguages.includes(language.value)}
                      label={language.label}
                      onClick={() => toggleLanguage(language.value)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Genres">
                  {genres.map((genre) => (
                    <FilterButton
                      key={genre.value}
                      active={selectedGenres.includes(genre.value)}
                      label={genre.label}
                      onClick={() => toggleGenre(genre.value)}
                    />
                  ))}
                </FilterSection>

                <FilterSection title="Content Type">
                  {contentTypes.map((type) => (
                    <FilterButton
                      key={type.value}
                      active={selectedContentTypes.includes(type.value)}
                      label={type.label}
                      onClick={() => toggleContentType(type.value)}
                    />
                  ))}
                </FilterSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence>
          {(selectedAccessType !== 'all' || selectedGenres.length > 0 || selectedContentTypes.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-2xl border border-white/8 bg-[#0f172a]/86 p-4 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-300">
                  <TrendingUp className="h-4 w-4 text-cyan-300" />
                  Active Filters
                </h3>
                <button onClick={clearFilters} className="text-xs font-medium text-cyan-300 hover:text-cyan-200">
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAccessType !== 'all' && <FilterChip label={selectedAccessType} onRemove={() => setSelectedAccessType('all')} />}
                {selectedGenres.map((genre) => (
                  <FilterChip key={genre} label={genre} onRemove={() => toggleGenre(genre)} />
                ))}
                {selectedContentTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={contentTypes.find((entry) => entry.value === type)?.label || type}
                    onRemove={() => toggleContentType(type)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {isLoading ? (
              <span className="skeleton inline-block h-4 w-32 rounded" />
            ) : (
              <>
                Showing <span className="font-bold text-cyan-300">{filteredContent.length}</span> results
                {searchQuery && (
                  <>
                    {' '}for "<span className="font-semibold text-white">{searchQuery}</span>"
                  </>
                )}
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <GridSkeleton count={12} />
        ) : filteredContent.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/8 bg-[#111827]">
              <SearchX className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">No results found</h3>
            <p className="mb-6 text-gray-400">Try adjusting your filters or search query.</p>
            <Button onClick={clearFilters} className="bg-gradient-to-r from-cyan-400 to-cyan-500 font-semibold text-black hover:from-cyan-300 hover:to-cyan-500">
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {filteredContent.map((item, index) => (
              <MediaCard
                key={item.id}
                content={item}
                index={index}
                onClick={() => navigate(`/content/${item.id}`)}
                secondaryMeta="year"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-300">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'border-cyan-400/50 bg-cyan-400/14 text-cyan-200 shadow-[0_12px_28px_rgba(6,182,212,0.16)]'
          : 'border-white/10 bg-white/6 text-gray-300 hover:border-cyan-400/35 hover:bg-white/10'
      }`}
    >
      {label}
    </motion.button>
  );
}

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    onClick={onRemove}
    className="group flex items-center gap-2 rounded-full border border-cyan-400/28 bg-cyan-400/12 px-3 py-1.5 text-sm text-cyan-200 transition-all hover:bg-cyan-400/18"
  >
    <span className="capitalize font-medium">{label}</span>
    <X className="h-3 w-3 transition-transform group-hover:scale-110" />
  </motion.button>
);
