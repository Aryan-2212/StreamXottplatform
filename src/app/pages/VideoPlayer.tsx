import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { mockContent } from '../data/mockData';

const DEFAULT_VIDEO_SOURCE = 'https://www.w3schools.com/html/mov_bbb.mp4';

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const content = mockContent.find((item) => item.id === id);

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgressState] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const posterImage = useMemo(
    () => (content ? content.backdrop || content.thumbnail : ''),
    [content],
  );

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
    }, 2200);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    queueHideControls();
    return clearHideControlsTimeout;
  }, [isPlaying, hasEnded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEnded, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    attemptAutoplay();
  }, []);

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

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    setShowControls(true);

    if (hasEnded) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    if (video.paused || video.ended) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      queueHideControls();
      return;
    }

    video.pause();
    setIsPlaying(false);
    clearHideControlsTimeout();
  }

  function updateProgress() {
    const video = videoRef.current;
    if (!video) return;

    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
    const nextCurrentTime = video.currentTime;
    const nextProgress = nextDuration > 0 ? (nextCurrentTime / nextDuration) * 100 : 0;

    setDuration(nextDuration);
    setCurrentTime(nextCurrentTime);
    setProgressState(nextProgress);
  }

  function setProgress(event: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(duration, ratio * duration));

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
    setProgressState((nextTime / duration) * 100);
  }

  function updateTimeDisplay() {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
  }

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;

    const nextVolume = Number(event.target.value) / 100;
    setVolume(nextVolume);
    video.volume = nextVolume;

    if (nextVolume === 0) {
      setIsMuted(true);
      video.muted = true;
      return;
    }

    setIsMuted(false);
    video.muted = false;
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
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

  function handleLoadedMetadata() {
    updateTimeDisplay();
    updateProgress();
  }

  function handleVideoClick() {
    togglePlay();
  }

  function handleVideoEnded() {
    setIsPlaying(false);
    setHasEnded(true);
    setShowControls(true);
    clearHideControlsTimeout();
  }

  function handleBack() {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    navigate(`/content/${content.id}`);
  }

  function formatTime(timeInSeconds: number) {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
      return '0:00';
    }

    const totalSeconds = Math.floor(timeInSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
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
      onMouseLeave={() => {
        if (isPlaying && !hasEnded) {
          setShowControls(false);
        }
      }}
      onTouchStart={() => {
        setShowControls(true);
        queueHideControls();
      }}
    >
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-contain"
        poster={posterImage}
        playsInline
        preload="metadata"
        onClick={handleVideoClick}
        onTimeUpdate={() => {
          updateProgress();
          updateTimeDisplay();
        }}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true);
          setHasEnded(false);
          queueHideControls();
        }}
        onPause={() => {
          if (!hasEnded) {
            setIsPlaying(false);
            setShowControls(true);
          }
        }}
        onEnded={handleVideoEnded}
      >
        <source src={DEFAULT_VIDEO_SOURCE} type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/8 to-black/65" />

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
                className="rounded-full border border-white/12 bg-black/45 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-black/65"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="max-w-[65vw] rounded-full border border-white/8 bg-black/35 px-4 py-2 text-right backdrop-blur-md">
                <p className="truncate text-sm font-semibold text-white sm:text-base">{content.title}</p>
                <p className="text-xs text-gray-300 sm:text-sm">
                  {content.year} • {content.duration}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/35 bg-black/48 text-white shadow-[0_0_30px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all hover:scale-105 hover:bg-black/62 sm:h-24 sm:w-24"
                aria-label={hasEnded ? 'Replay video' : isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying && !hasEnded ? (
                  <Pause className="h-9 w-9 sm:h-10 sm:w-10" />
                ) : (
                  <Play className="ml-1 h-9 w-9 fill-current sm:h-10 sm:w-10" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="rounded-[24px] border border-white/10 bg-black/55 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5">
                <div
                  className="group relative mb-3 h-2 cursor-pointer rounded-full bg-white/15 sm:mb-4"
                  onClick={setProgress}
                  aria-label="Seek video"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-cyan-400 opacity-0 shadow-[0_0_18px_rgba(34,211,238,0.55)] transition-opacity group-hover:opacity-100"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={togglePlay}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying && !hasEnded ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="rounded-full bg-white/8 p-3 transition-all hover:bg-white/14"
                      aria-label={isMuted || volume === 0 ? 'Unmute video' : 'Mute video'}
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
                      value={isMuted ? 0 : Math.round(volume * 100)}
                      onInput={handleVolumeChange}
                      className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-400 sm:w-28"
                      aria-label="Volume"
                    />

                    <div className="text-sm font-medium text-gray-200">
                      {formatTime(currentTime)} / {formatTime(duration)}
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
