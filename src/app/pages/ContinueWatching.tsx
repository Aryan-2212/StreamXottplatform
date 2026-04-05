import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';

export default function ContinueWatching() {
  const navigate = useNavigate();

  // Get content with progress
  const continueWatchingContent = mockContent.filter(item => item.progress && item.progress > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-cyan-400" />
              <h1 className="text-2xl font-bold">Continue Watching</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        {continueWatchingContent.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">
              {continueWatchingContent.length}{' '}
              {continueWatchingContent.length === 1 ? 'title' : 'titles'} in progress
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {continueWatchingContent.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => navigate(`/player/${item.id}`)}
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
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="h-1 bg-gray-800">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <div className="px-2 py-1 bg-black/80 backdrop-blur-sm">
                        <p className="text-xs text-gray-300">{item.progress}% complete</p>
                      </div>
                    </div>
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
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center">
                <Play className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No content in progress</h3>
              <p className="text-gray-400 mb-6">
                Start watching something and come back to continue
              </p>
              <Button
                onClick={() => navigate('/home')}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Explore Content
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
