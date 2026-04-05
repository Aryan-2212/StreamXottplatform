import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { mockContent } from '../data/mockData';

const SIMULATED_DURATION = 7200;
const SEEK_INTERVAL = 10;

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const content = mockContent.find((item) => item.id === id);
  const playerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const progress = (currentTime / SIMULATED_DURATION) * 100;

  const clearHideControlsTimeout = () => {
    if (hideControlsTimeoutRef.current) {
      window.clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }
  };

  const queueHideControls = () => {
    clearHideControlsTimeout();

    if (!isPlaying || hasEnded) {
      return;
    }

    hideControlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2400);
  };

  useEffect(() => {
    if (!isPlaying || hasEnded) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentTime((previous) => {
        const nextValue = previous + 1;

        if (nextValue >= SIMULATED_DURATION) {
          setIsPlaying(false);
          setHasEnded(true);
          setShowControls(true);
          clearHideControlsTimeout();
          return SIMULATED_DURATION;
        }

        return nextValue;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPlaying, hasEnded]);

  useEffect(() => {
    queueHideControls();
    return clearHideControlsTimeout;
  }, [isPlaying, hasEnded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isTyping =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.isContentEditable;

      if (isTyping) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }

      if (event.code === 'ArrowRight') {
        event.preventDefault();
        skipForward();
      }

      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        skipBackward();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasEnded, isPlaying, currentTime]);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Content Not Found</h2>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 rounded-lg bg-cyan-500 px-6 py-2 text-black"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  function togglePlay() {
    setShowControls(true);

    if (hasEnded) {
      setCurrentTime(0);
      setHasEnded(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((previous) => !previous);
  }

  function updateProgress() {
    return;
  }

  function setProgress(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(SIMULATED_DURATION, ratio * SIMULATED_DURATION));

    setCurrentTime(nextTime);
    setHasEnded(nextTime >= SIMULATED_DURATION);
    setShowControls(true);
  }

  function updateTimeDisplay() {
    return;
  }

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  }

  function toggleMute() {
    if (isMuted || volume === 0) {
      setIsMuted(false);
      setVolume((previous) => (previous === 0 ? 80 : previous));
      return;
    }

    setIsMuted(true);
  }

  async function toggleFullscreen() {
    const player = playerRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
      await player.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  }

  function skipForward() {
    setShowControls(true);
    setCurrentTime((previous) => {
      const nextTime = Math.min(SIMULATED_DURATION, previous + SEEK_INTERVAL);

      if (nextTime >= SIMULATED_DURATION) {
        setHasEnded(true);
        setIsPlaying(false);
      }

      return nextTime;
    });
  }

  function skipBackward() {
    setShowControls(true);
    setHasEnded(false);
    setCurrentTime((previous) => Math.max(0, previous - SEEK_INTERVAL));
  }

  function handleBack() {
    clearHideControlsTimeout();
    navigate(-1);
  }

  function handleSurfaceClick() {
    setShowControls(true);
    togglePlay();
  }

  function formatTime(timeInSeconds: number) {
    const totalSeconds = Math.max(0, Math.floor(timeInSeconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <div
      ref={playerRef}
      className="relative h-screen overflow-hidden bg-black text-white"
      onMouseMove={() => {
        setShowControls(true);
        queueHideControls();
      }}
      onTouchStart={() => {
        setShowControls(true);
        queueHideControls();
      }}
    >
      <button
        onClick={handleSurfaceClick}
        className="absolute inset-0 z-0 h-full w-full cursor-pointer bg-cover bg-center text-left"
        style={{ backgroundImage: `url(${content.backdrop || content.thumbnail})` }}
        aria-label={isPlaying ? 'Pause player' : 'Play player'}
      >
        <span className="sr-only">{content.title}</span>
      </button>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/92 via-black/54 to-black/30" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/18 to-black/60" />

      <AnimatePresence>
        {(showControls || !isPlaying || hasEnded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20"
          >
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 sm:p-6">
              <button
                onClick={handleBack}
                className="rounded-full border border-white/12 bg-black/55 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-black/70"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="max-w-[65vw] rounded-full border border-white/8 bg-black/38 px-4 py-2 text-right backdrop-blur-md">
                <p className="truncate text-sm font-semibold text-white sm:text-base">{content.title}</p>
                <p className="text-xs text-gray-300 sm:text-sm">
                  {content.year} • {content.duration}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center gap-5 sm:gap-8">
              <button
                onClick={skipBackward}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/48 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/65 sm:h-20 sm:w-20"
                aria-label="Go back 10 seconds"
              >
                <div className="relative flex items-center justify-center">
                  <RotateCcw className="h-7 w-7 sm:h-8 sm:w-8" />
                  <span className="absolute text-[10px] font-semibold sm:text-xs">10</span>
                </div>
              </button>

              <button
                onClick={togglePlay}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/35 bg-black/48 text-white shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all hover:scale-105 hover:bg-black/62 sm:h-24 sm:w-24"
                aria-label={hasEnded ? 'Replay player' : isPlaying ? 'Pause player' : 'Play player'}
              >
                {isPlaying && !hasEnded ? (
                  <Pause className="h-9 w-9 sm:h-10 sm:w-10" />
                ) : (
                  <Play className="ml-1 h-9 w-9 fill-current sm:h-10 sm:w-10" />
                )}
              </button>

              <button
                onClick={skipForward}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/48 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/65 sm:h-20 sm:w-20"
                aria-label="Go forward 10 seconds"
              >
                <div className="relative flex items-center justify-center">
                  <RotateCw className="h-7 w-7 sm:h-8 sm:w-8" />
                  <span className="absolute text-[10px] font-semibold sm:text-xs">10</span>
                </div>
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="rounded-[24px] border border-white/10 bg-black/55 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5">
                <div
                  className="group relative mb-3 h-2 cursor-pointer rounded-full bg-white/15 sm:mb-4"
                  onClick={setProgress}
                  aria-label="Seek playback"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-400 opacity-0 shadow-[0_0_18px_rgba(34,211,238,0.55)] transition-opacity group-hover:opacity-100"
                    style={{ left: `calc(${Math.min(progress, 100)}% - 8px)` }}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={togglePlay}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label={isPlaying ? 'Pause player' : 'Play player'}
                    >
                      {isPlaying && !hasEnded ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={skipBackward}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label="Go back 10 seconds"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>

                    <button
                      onClick={skipForward}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label="Go forward 10 seconds"
                    >
                      <RotateCw className="h-5 w-5" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label={isMuted || volume === 0 ? 'Unmute player' : 'Mute player'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={isMuted ? 0 : volume}
                      onInput={handleVolumeChange}
                      className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-400 sm:w-28"
                      aria-label="Volume"
                    />

                    <div className="text-sm font-medium text-gray-200">
                      {formatTime(currentTime)} / {formatTime(SIMULATED_DURATION)}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 sm:gap-3">
                    {hasEnded && (
                      <button
                        onClick={togglePlay}
                        className="rounded-full border border-cyan-300/28 bg-cyan-400/12 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-400/18"
                      >
                        Replay
                      </button>
                    )}

                    <button
                      onClick={toggleFullscreen}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
