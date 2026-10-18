import React, { useState } from 'react';
import { Heart, Maximize2, Download, SlidersHorizontal } from 'lucide-react';
import { Photo, PhotoCategory } from '../types';

interface PortfolioGalleryProps {
  photos: Photo[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onPhotoClick: (photo: Photo) => void;
  onDownloadPhoto: (photo: Photo, e: React.MouseEvent) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  photos,
  favorites,
  onToggleFavorite,
  onPhotoClick,
  onDownloadPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('all');
  const [sortOrder, setSortOrder] = useState<'featured' | 'views' | 'year'>('featured');

  const filteredPhotos = photos.filter((photo) => {
    if (selectedCategory === 'all') return true;
    return photo.category === selectedCategory;
  }).sort((a, b) => {
    if (sortOrder === 'views') return b.views - a.views;
    if (sortOrder === 'year') return b.exif.year - a.exif.year;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section id="portfolio-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            Selected Portfolio Series
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
            Curated Visual Works
          </h2>
        </div>

        {/* Interactive Filter Tabs (functional segmented control buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Works ({photos.length})
          </button>
          <button
            onClick={() => setSelectedCategory('editorial')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'editorial'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Editorial
          </button>
          <button
            onClick={() => setSelectedCategory('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'architecture'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setSelectedCategory('portrait')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'portrait'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Portraits
          </button>
          <button
            onClick={() => setSelectedCategory('wedding')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'wedding'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Weddings
          </button>
        </div>
      </div>

      {/* Sorting & Filter Utility Toolbar */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-8">
        <div>
          Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filteredPhotos.length}</span> plates
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'featured' | 'views' | 'year')}
            className="bg-transparent border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
          >
            <option value="featured" className="dark:bg-neutral-900">Featured Curation</option>
            <option value="views" className="dark:bg-neutral-900">Most Viewed</option>
            <option value="year" className="dark:bg-neutral-900">Most Recent Year</option>
          </select>
        </div>
      </div>

      {/* Bento / Masonry Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredPhotos.map((photo, index) => {
          const isFav = favorites.includes(photo.id);
          // Make first and fourth photo wider on large screens for an editorial Bento rhythm
          const isSpanTwo = index === 0 || index === 3;

          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(photo)}
              className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${
                isSpanTwo ? 'md:col-span-2 aspect-[16/10]' : 'col-span-1 aspect-[4/5]'
              }`}
            >
              {/* Image with graceful hover scale */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Top Quick Actions (Favorite & Download) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  onClick={(e) => onToggleFavorite(photo.id, e)}
                  className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                    isFav
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/20 hover:bg-white/40 text-white'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to client favorites'}
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={(e) => onDownloadPhoto(photo, e)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                  title="Download Master Resolution"
                  aria-label="Download image"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="p-2 rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Metadata (Clean unboxed typography, no pill enclosures) */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono mb-1">
                  <span className="capitalize">{photo.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{photo.exif.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{photo.exif.year}</span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl text-white font-normal mb-1.5 leading-snug">
                  {photo.title}
                </h3>

                <p className="text-xs text-neutral-300 line-clamp-2 max-w-xl font-light">
                  {photo.story}
                </p>

                {/* Subtle camera spec line */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300 font-mono tabular-nums">
                  <span>{photo.exif.camera}</span>
                  <span>{photo.exif.lens} · {photo.exif.aperture} · {photo.exif.shutterSpeed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
