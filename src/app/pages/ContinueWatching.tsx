import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';
import MediaCard from '../components/MediaCard';

export default function ContinueWatching() {
  const navigate = useNavigate();
  const continueWatchingContent = mockContent.filter((item) => item.progress && item.progress > 0);

  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <div className="sticky top-0 z-50 border-b border-white/8 bg-[#02060c]/94 backdrop-blur-xl">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="rounded-full border border-white/10 bg-white/6 p-2 transition-colors hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <PlayCircle className="h-6 w-6 text-cyan-300" />
              <h1 className="text-2xl font-bold tracking-tight">Continue Watching</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        {continueWatchingContent.length > 0 ? (
          <>
            <p className="mb-6 text-gray-400">
              {continueWatchingContent.length} {continueWatchingContent.length === 1 ? 'title' : 'titles'} in progress
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {continueWatchingContent.map((item, index) => (
                <MediaCard
                  key={item.id}
                  content={item}
                  index={index}
                  onClick={() => navigate(`/player/${item.id}`)}
                  showProgress
                  secondaryMeta="year"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-white/8 bg-[#111827]">
                <PlayCircle className="h-16 w-16 text-gray-700" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">No content in progress</h3>
              <p className="mb-6 text-gray-400">Start watching something and come back to continue.</p>
              <Button onClick={() => navigate('/home')} className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:from-cyan-300 hover:to-cyan-500">
                Explore Content
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
