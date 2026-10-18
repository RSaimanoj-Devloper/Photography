import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Download, Info, ZoomIn, ZoomOut, Share2, Check } from 'lucide-react';
import { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDownloadPhoto: (photo: Photo, e: React.MouseEvent) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
  favorites,
  onToggleFavorite,
  onDownloadPhoto,
}) => {
  const [showInfo, setShowInfo] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'i' || e.key === 'I') setShowInfo((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isFav = favorites.includes(photo.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity">
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 h-16 px-6 flex items-center justify-between z-20 text-white border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-editorial text-lg text-neutral-200">
            {photo.title}
          </span>
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            [{currentIndex + 1} / {photos.length}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* EXIF Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showInfo ? 'bg-white/20 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle EXIF Camera Data (I)"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Copy share link"
          >
            {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>

          {/* Favorite */}
          <button
            onClick={(e) => onToggleFavorite(photo.id, e)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isFav ? 'text-rose-500' : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Download master */}
          <button
            onClick={(e) => onDownloadPhoto(photo, e)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer ml-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Master</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-3"
            title="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12 overflow-hidden select-none">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className={`max-h-[82vh] max-w-[88vw] object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-grab active:cursor-grabbing' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Prev & Next Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10"
          title="Previous Image (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10"
          title="Next Image (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide-out EXIF Data & Monograph Sidebar */}
      {showInfo && (
        <aside className="absolute right-4 bottom-4 sm:bottom-6 sm:right-6 max-w-sm w-full bg-neutral-900/95 border border-white/15 text-white p-5 rounded-xl backdrop-blur-lg shadow-2xl z-20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              EXIF & Monograph Details
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-neutral-400 hover:text-white text-xs cursor-pointer"
            >
              Hide
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-light">
            {photo.story}
          </p>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-mono tabular-nums">
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Camera Body</div>
              <div className="text-neutral-100 font-medium">{photo.exif.camera}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Optics / Lens</div>
              <div className="text-neutral-100 font-medium">{photo.exif.lens}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Aperture & Shutter</div>
              <div className="text-neutral-100 font-medium">{photo.exif.aperture} · {photo.exif.shutterSpeed}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">ISO Sensitivity</div>
              <div className="text-neutral-100 font-medium">ISO {photo.exif.iso}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Location</div>
              <div className="text-neutral-100 font-medium truncate">{photo.exif.location}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Focal Length</div>
              <div className="text-neutral-100 font-medium">{photo.exif.focalLength}</div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
