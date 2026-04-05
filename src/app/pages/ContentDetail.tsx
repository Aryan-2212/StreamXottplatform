import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Play, Plus, Share2, ArrowLeft, Info, Star, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';
import { Content } from '../types';
import { useWatchlist } from '../watchlistContext';

export default function ContentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const content = mockContent.find(c => c.id === id);

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Get similar content
  const similarContent = mockContent.filter(
    c => c.id !== content.id &&
    (c.genre.some(g => content.genre.includes(g)) || c.type === content.type)
  ).slice(0, 6);

  const handlePlay = () => {
    if (content.accessType === 'premium') {
      // Show subscribe modal (for demo, just navigate to player)
      navigate(`/player/${content.id}`);
    } else {
      navigate(`/player/${content.id}`);
    }
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist(content.id)) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content.id);
    }
  };

  const inWatchlist = isInWatchlist(content.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {content.accessType === 'included' ? (
              <span className="inline-block px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded mb-3">
                INCLUDED WITH SUBSCRIPTION
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded mb-3">
                PREMIUM CONTENT
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{content.rating}</span>
              </div>
              <span className="text-gray-300">{content.year}</span>
              <span className="text-gray-300">{content.duration}</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs uppercase">
                {content.language}
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-300 line-clamp-3 mb-6">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {content.accessType === 'included' ? (
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 px-8"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Play Now
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePlay}
                    size="lg"
                    className="bg-amber-500 text-black hover:bg-amber-600 px-8"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Subscribe to Watch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-gray-800/90 border-gray-500 hover:bg-gray-700 backdrop-blur-sm text-white"
                    onClick={() => {
                      const aboutSection = document.getElementById('about-section');
                      aboutSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Info className="w-5 h-5 mr-2" />
                    View Details
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div id="about-section">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">{content.description}</p>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {content.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 bg-gray-800 rounded-full text-sm capitalize"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    inWatchlist
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Check className="w-5 h-5" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Watchlist
                    </>
                  )}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Type</h4>
                <p className="text-white capitalize">{content.type}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Language</h4>
                <p className="text-white capitalize">{content.language}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Release Year</h4>
                <p className="text-white">{content.year}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Duration</h4>
                <p className="text-white">{content.duration}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Rating</h4>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{content.rating}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Content */}
        {similarContent.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/content/${item.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                    />
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
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-current" />
                    </div>
                  </div>
                  <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>⭐ {item.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}