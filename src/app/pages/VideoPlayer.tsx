import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowLeft,
  SkipForward,
  SkipBack,
  Settings,
  Subtitles,
  X,
} from 'lucide-react';
import { mockContent } from '../data/mockData';

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showAd, setShowAd] = useState(true);
  const [adCountdown, setAdCountdown] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [subtitleLang, setSubtitleLang] = useState('Off');
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(80);

  const content = mockContent.find(c => c.id === id);

  // Auto-hide controls
  useEffect(() => {
    if (showAd) return;
    
    if (isPlaying && showControls) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showControls, isPlaying, showAd]);

  // Ad countdown
  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const timer = setTimeout(() => {
        setAdCountdown(adCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showAd && adCountdown === 0) {
      setShowAd(false);
    }
  }, [showAd, adCountdown]);

  // Simulate video progress
  useEffect(() => {
    if (!showAd && isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, showAd]);

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 px-6 py-2 bg-cyan-500 text-black rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSkipAd = () => {
    if (adCountdown === 0) {
      setShowAd(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  const handleSkipForward = () => {
    setProgress(Math.min(100, progress + 5));
  };

  const handleSkipBackward = () => {
    setProgress(Math.max(0, progress - 5));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((progress / 100) * 7200); // 2 hours in seconds
  const totalTime = 7200;

  return (
    <div
      className="relative h-screen bg-black text-white overflow-hidden"
      onMouseMove={() => !showAd && setShowControls(true)}
      onClick={() => !showAd && setShowControls(true)}
    >
      {/* Video Placeholder */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Ad Overlay */}
      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black flex items-center justify-center z-50"
          >
            <div className="text-center">
              <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto">
                <p className="text-gray-400 mb-4">Advertisement</p>
                <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                  <p className="text-gray-500">Ad Content</p>
                </div>
                {adCountdown > 0 ? (
                  <p className="text-sm text-gray-400">
                    Video will start in {adCountdown} seconds...
                  </p>
                ) : (
                  <button
                    onClick={handleSkipAd}
                    className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                  >
                    Skip Ad
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      {!showAd && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50 z-40"
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/content/${content.id}`)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-right">
                  <h2 className="text-xl font-semibold">{content.title}</h2>
                  <p className="text-sm text-gray-300">
                    {content.type === 'show' ? 'S1 E1' : content.year}
                  </p>
                </div>
              </div>

              {/* Center Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center gap-12">
                <button
                  onClick={handleSkipBackward}
                  className="w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  <SkipBack className="w-8 h-8" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all flex items-center justify-center group"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={handleSkipForward}
                  className="w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  <SkipForward className="w-8 h-8" />
                </button>
              </div>

              {/* Buffering Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div
                    className="relative h-1 bg-gray-600 rounded-full cursor-pointer group"
                    onClick={handleSeek}
                  >
                    <div
                      className="absolute h-full bg-cyan-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-cyan-500 rounded-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalTime)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current" />
                      )}
                    </button>
                    <button
                      onClick={handleSkipBackward}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSkipForward}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>
                    <div className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${volume}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                        subtitleLang !== 'Off' ? 'text-cyan-400' : ''
                      }`}
                    >
                      <Subtitles className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Settings className="w-6 h-6" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Skip Intro Button */}
                {progress > 10 && progress < 20 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={() => setProgress(20)}
                    className="absolute right-6 bottom-32 px-6 py-3 bg-white/90 hover:bg-white text-black backdrop-blur-sm rounded-lg font-semibold transition-colors"
                  >
                    Skip Intro
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Settings Menu */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-6 bottom-32 bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden z-50 min-w-[200px]"
          >
            <div className="p-2">
              <div className="flex items-center justify-between p-2 border-b border-gray-800 mb-2">
                <h3 className="font-semibold">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-2 py-1 text-xs text-gray-400">Quality</div>
                {['Auto', '1080p', '720p', '480p'].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuality(q);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors ${
                      quality === q ? 'text-cyan-400 font-semibold' : ''
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitles Menu */}
      <AnimatePresence>
        {showSubtitles && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-6 bottom-32 bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden z-50 min-w-[200px]"
          >
            <div className="p-2">
              <div className="flex items-center justify-between p-2 border-b border-gray-800 mb-2">
                <h3 className="font-semibold">Subtitles</h3>
                <button
                  onClick={() => setShowSubtitles(false)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {['Off', 'English', 'Hindi', 'Tamil', 'Telugu'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSubtitleLang(lang);
                      setShowSubtitles(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors ${
                      subtitleLang === lang ? 'text-cyan-400 font-semibold' : ''
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Up Next Preview */}
      {progress > 90 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-24 right-6 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 max-w-xs z-50"
        >
          <p className="text-xs text-gray-400 mb-2">Up Next</p>
          <div className="flex gap-3">
            <div className="w-24 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
              <img
                src={content.thumbnail}
                alt="Next episode"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-2">Next Episode Title</p>
              <p className="text-xs text-gray-400 mt-1">45m</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
