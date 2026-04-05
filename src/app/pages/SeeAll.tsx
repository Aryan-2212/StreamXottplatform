import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';
import { AccessType } from '../types';
import MediaCard from '../components/MediaCard';

type CategoryType = 'recommended' | 'movies' | 'sports' | 'shows' | 'kids' | 'trending';

export default function SeeAll() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: CategoryType }>();
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year'>('relevance');
  const [filterTab, setFilterTab] = useState<'all' | AccessType>('all');

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

  const getCategoryContent = () => {
    switch (category) {
      case 'recommended':
        return mockContent.filter((content) => content.trending);
      case 'movies':
        return mockContent.filter((content) => content.type === 'movie');
      case 'sports':
        return mockContent.filter((content) => content.type === 'sports');
      case 'shows':
        return mockContent.filter((content) => content.type === 'show');
      case 'kids':
        return mockContent.filter((content) => content.type === 'kids');
      case 'trending':
        return mockContent.filter((content) => content.trending);
      default:
        return mockContent;
    }
  };

  const filteredContent = useMemo(() => {
    let results = getCategoryContent();

    if (filterTab !== 'all') {
      results = results.filter((item) => item.accessType === filterTab);
    }

    if (sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      results = [...results].sort((a, b) => b.year - a.year);
    }

    return results;
  }, [category, filterTab, sortBy]);

  const showTabs = category === 'movies' || category === 'shows';

  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#02060c]/94 backdrop-blur-xl">
        <div className="px-4 py-4 sm:px-6">
          <div className="mb-4 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">{getTitle()}</h1>
          </div>

          {showTabs && (
            <div className="mb-4 flex gap-2">
              {['all', 'included', 'premium'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab as 'all' | AccessType)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    filterTab === tab
                      ? 'border-cyan-400/50 bg-cyan-400/14 text-cyan-200'
                      : 'border-white/10 bg-white/6 text-gray-300 hover:border-cyan-400/35 hover:bg-white/10'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <div className="flex gap-2">
              {(['relevance', 'rating', 'year'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                    sortBy === option
                      ? 'border-cyan-400/50 bg-cyan-400/14 font-semibold text-cyan-200'
                      : 'border-white/10 bg-white/6 text-gray-300 hover:border-cyan-400/35 hover:bg-white/10'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <p className="mb-6 text-gray-400">
          {filteredContent.length} {filteredContent.length === 1 ? 'title' : 'titles'} found
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredContent.map((item, index) => (
            <MediaCard
              key={item.id}
              content={item}
              index={index}
              onClick={() => navigate(`/content/${item.id}`)}
              showProgress={Boolean(item.progress)}
              secondaryMeta="year"
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/8 bg-[#111827]">
              <Clapperboard className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No content found</h3>
            <p className="mb-6 text-gray-400">Try adjusting your filters or explore other categories.</p>
            <div className="flex justify-center gap-3">
              {filterTab !== 'all' && (
                <Button onClick={() => setFilterTab('all')} variant="outline" className="border-white/12 bg-white/6 hover:bg-white/10">
                  Clear Filters
                </Button>
              )}
              <Button onClick={() => navigate('/home')} className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:from-cyan-300 hover:to-cyan-500">
                Go Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
