import React from 'react';
import { motion } from 'motion/react';
import { Play, Star, Trash2 } from 'lucide-react';
import { Content } from '../types';

interface MediaCardProps {
  content: Content;
  onClick: () => void;
  index?: number;
  showProgress?: boolean;
  secondaryMeta?: 'duration' | 'year';
  onRemove?: () => void;
}

export default function MediaCard({
  content,
  onClick,
  index = 0,
  showProgress = false,
  secondaryMeta = 'duration',
  onRemove,
}: MediaCardProps) {
  const secondaryValue = secondaryMeta === 'year' ? content.year : content.duration;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.985 }}
      className="group relative shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative mb-3 overflow-hidden rounded-[20px] border border-white/8 bg-[#0f172a] shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:border-cyan-400/35 group-hover:shadow-[0_18px_45px_rgba(8,145,178,0.22)]">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/18 to-transparent" />

        <div className="absolute left-3 top-3">
          <span className={content.accessType === 'included' ? 'badge-included' : 'badge-premium'}>
            {content.accessType === 'included' ? 'Included' : 'Premium'}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          <span className="rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {content.language}
          </span>
        </div>

        {showProgress && content.progress && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-1 bg-black/55">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500" style={{ width: `${content.progress}%` }} />
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md">
            <Play className="h-6 w-6 fill-current" />
          </div>
        </div>

        {onRemove && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            className="absolute right-3 top-14 z-10 rounded-full border border-red-400/20 bg-[#3a0d13]/88 p-2 text-red-300 opacity-0 transition-all duration-200 hover:bg-[#57141d] group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <h4 className="mb-1 line-clamp-1 text-sm font-semibold text-white">{content.title}</h4>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1 text-gray-200">
          <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
          {content.rating}
        </span>
        <span className="text-gray-600">•</span>
        <span>{secondaryValue}</span>
      </div>
    </motion.div>
  );
}
