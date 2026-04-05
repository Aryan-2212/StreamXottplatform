import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, Info, Play, Plus, Share2, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockContent } from '../data/mockData';
import { useWatchlist } from '../watchlistContext';
import MediaCard from '../components/MediaCard';

export default function ContentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const content = mockContent.find((item) => item.id === id);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#02060c] text-white">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Content Not Found</h2>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const similarContent = mockContent
    .filter((item) => item.id !== content.id && (item.genre.some((genre) => content.genre.includes(genre)) || item.type === content.type))
    .slice(0, 6);

  const inWatchlist = isInWatchlist(content.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(content.id);
      return;
    }
    addToWatchlist(content.id);
  };

  return (
    <div className="min-h-screen bg-[#02060c] text-white">
      <div className="relative h-[62vh] sm:h-[72vh]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${content.backdrop || content.thumbnail})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02060c] via-[#02060c]/78 to-[#02060c]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02060c] via-[#02060c]/12 to-[#02060c]/34" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 z-10 rounded-full border border-white/12 bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {content.accessType === 'included' ? (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Included with subscription
              </span>
            ) : (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/14 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                <Crown className="h-3.5 w-3.5" />
                Premium content
              </span>
            )}

            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{content.title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-1 rounded-full bg-white/8 px-3 py-1.5">
                <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                <span className="font-semibold">{content.rating}</span>
              </div>
              <span className="text-gray-300">{content.year}</span>
              <span className="text-gray-300">{content.duration}</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.14em]">
                {content.language}
              </span>
            </div>

            <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">{content.description}</p>

            <div className="flex flex-wrap gap-3">
              {content.accessType === 'included' ? (
                <Button onClick={() => navigate(`/player/${content.id}`)} size="lg" className="bg-white px-8 text-black hover:bg-gray-200">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Play Now
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate(`/player/${content.id}`)}
                    size="lg"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 px-8 text-black hover:from-amber-300 hover:to-amber-500"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Subscribe to Watch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/15 bg-white/6 text-white hover:bg-white/10"
                    onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Info className="mr-2 h-5 w-5" />
                    View Details
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <div id="about-section">
              <h2 className="mb-4 text-2xl font-semibold">About</h2>
              <p className="leading-relaxed text-gray-300">{content.description}</p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {content.genre.map((genre) => (
                  <span key={genre} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm capitalize text-gray-200">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition-all ${
                    inWatchlist
                      ? 'border-cyan-400/50 bg-cyan-400/12 text-cyan-200'
                      : 'border-white/10 bg-white/6 text-white hover:border-cyan-400/35 hover:bg-white/10'
                  }`}
                >
                  {inWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white transition-colors hover:border-cyan-400/35 hover:bg-white/10">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-white/8 bg-[#0f172a]/86 p-6 shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
              <div className="space-y-4">
                <InfoRow label="Type" value={content.type} capitalize />
                <InfoRow label="Language" value={content.language} capitalize />
                <InfoRow label="Release Year" value={String(content.year)} />
                <InfoRow label="Duration" value={content.duration} />
                <div>
                  <h4 className="mb-1 text-sm text-gray-400">Rating</h4>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                    <span className="font-semibold text-white">{content.rating}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">More Like This</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {similarContent.map((item, index) => (
                <MediaCard
                  key={item.id}
                  content={item}
                  index={index}
                  onClick={() => navigate(`/content/${item.id}`)}
                  secondaryMeta="year"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <h4 className="mb-1 text-sm text-gray-400">{label}</h4>
      <p className={`text-white ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}
