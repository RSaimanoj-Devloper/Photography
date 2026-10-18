import React from 'react';
import { ArrowRight, Camera, ShieldCheck, Download, Award } from 'lucide-react';
import { Photo } from '../types';

interface HeroProps {
  onExplorePortfolio: () => void;
  onBookSession: () => void;
  onOpenClientPortal: () => void;
  featuredPhoto: Photo;
  onPhotoClick: (photo: Photo) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplorePortfolio,
  onBookSession,
  onOpenClientPortal,
  featuredPhoto,
  onPhotoClick,
}) => {
  return (
    <section className="relative w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Split-Screen Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Kicker */}
            <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
              Fine Art · Architectural · Intimate Monographs
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-light tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.08] mb-6 text-balance">
              Capturing the stillness between light and human narrative.
            </h1>

            {/* Lead copy */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mb-8 max-w-xl">
              Editorial commissions, documentary nuptials, and architectural series crafted with medium-format precision and natural window light falloff. Each commission includes a private biometric-secured proofing portal and instant archival high-resolution master downloads.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onBookSession}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
              >
                Inquire & Book Session
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplorePortfolio}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Works
              </button>

              <button
                onClick={onOpenClientPortal}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Client Access
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              onClick={() => onPhotoClick(featuredPhoto)}
              className="group relative w-full h-[400px] sm:h-[480px] lg:h-full min-h-[440px] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md transition-transform duration-300 hover:scale-[1.006]"
            >
              <img
                src={featuredPhoto.imageUrl}
                alt={featuredPhoto.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Measured contrast gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Floating Monograph Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1.5 font-mono">
                  <span>{featuredPhoto.exif.camera}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPhoto.exif.lens}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPhoto.exif.shutterSpeed}</span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal mb-1">
                      {featuredPhoto.title}
                    </h3>
                    <p className="text-xs text-neutral-300 max-w-md line-clamp-2">
                      {featuredPhoto.story}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-300 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/20 whitespace-nowrap">
                    View Monograph Details
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metric Strip below the split */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Medium Format & 35mm</span>
            </div>
            <div className="text-2xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
              100 Megapixel
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Hasselblad & Leica Master Quality
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Biometric Protection</span>
            </div>
            <div className="text-2xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
              WebAuthn & PIN
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Passkey & Touch ID Client Gates
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
              <Download className="w-3.5 h-3.5" />
              <span>Digital Archive Delivery</span>
            </div>
            <div className="text-2xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
              Zero Compression
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Batch Master Downloads
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Global Commissions</span>
            </div>
            <div className="text-2xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
              128+ Monographs
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Paris · Kyoto · London · Scandinavia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
