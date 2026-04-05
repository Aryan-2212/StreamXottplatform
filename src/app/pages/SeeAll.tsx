import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';
import { Content, AccessType } from '../types';

type CategoryType = 'recommended' | 'movies' | 'sports' | 'shows' | 'kids' | 'trending';

export default function SeeAll() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: CategoryType }>();
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year'>('relevance');
  const [filterTab, setFilterTab] = useState<'all' | AccessType>('all');

  // Get title based on category
  const getTitle = () => {
    switch (category) {
      case 'recommended':
        return 'Recommended for You';
      case 'movies':
        return 'Movies';
      case 'sports':
        return 'Sports';
      case 'shows':
        return 'TV Shows';
      case 'kids':
        return 'Kids & Family';
      case 'trending':
        return 'Trending Now';
      default:
        return 'Browse All';
    }
  };

  // Filter content based on category
  const getCategoryContent = () => {
    switch (category) {
      case 'recommended':
        return mockContent.filter(c => c.trending);
      case 'movies':
        return mockContent.filter(c => c.type === 'movie');
      case 'sports':
        return mockContent.filter(c => c.type === 'sports');
      case 'shows':
        return mockContent.filter(c => c.type === 'show');
      case 'kids':
        return mockContent.filter(c => c.type === 'kids');
      case 'trending':
        return mockContent.filter(c => c.trending);
      default:
        return mockContent;
    }
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let results = getCategoryContent();

    // Apply access type filter
    if (filterTab !== 'all') {
      results = results.filter(item => item.accessType === filterTab);
    }

    // Sort
    if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      results.sort((a, b) => b.year - a.year);
    }

    return results;
  }, [category, filterTab, sortBy]);

  const showTabs = category === 'movies' || category === 'shows';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
          </div>

          {/* Tabs for Movies/Shows */}
          {showTabs && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterTab === 'all'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('included')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterTab === 'included'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Included
              </button>
              <button
                onClick={() => setFilterTab('premium')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterTab === 'premium'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Premium
              </button>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('relevance')}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  sortBy === 'relevance'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Relevance
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  sortBy === 'rating'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Rating
              </button>
              <button
                onClick={() => setSortBy('year')}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  sortBy === 'year'
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 sm:px-6 py-6">
        <p className="text-gray-400 mb-6">
          {filteredContent.length} {filteredContent.length === 1 ? 'title' : 'titles'} found
        </p>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredContent.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              onClick={() => navigate(`/content/${item.id}`)}
              className="cursor-pointer group"
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
                <div className="absolute bottom-2 right-2">
                  <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded uppercase">
                    {item.language}
                  </span>
                </div>
                {/* Progress Bar for Continue Watching */}
                {item.progress && (
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
              <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>⭐ {item.rating}</span>
                <span>•</span>
                <span>{item.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No content found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or explore other categories
            </p>
            <div className="flex gap-3 justify-center">
              {filterTab !== 'all' && (
                <Button
                  onClick={() => setFilterTab('all')}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Clear Filters
                </Button>
              )}
              <Button
                onClick={() => navigate('/home')}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Go Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
