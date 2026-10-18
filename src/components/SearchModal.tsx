import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Image as ImageIcon, Lock, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Photo, ClientGallery, BlogPost, BookingPackage } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  galleries: ClientGallery[];
  posts: BlogPost[];
  packages: BookingPackage[];
  onSelectPhoto: (photo: Photo) => void;
  onSelectGallery: (gallery: ClientGallery) => void;
  onSelectPost: (post: BlogPost) => void;
  onSelectPackage: (pkg: BookingPackage) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  photos,
  galleries,
  posts,
  packages,
  onSelectPhoto,
  onSelectGallery,
  onSelectPost,
  onSelectPackage,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedPhotos = q
    ? photos.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.exif.location.toLowerCase().includes(q) ||
          p.exif.camera.toLowerCase().includes(q) ||
          p.exif.lens.toLowerCase().includes(q) ||
          p.story.toLowerCase().includes(q)
      )
    : photos.slice(0, 3);

  const matchedGalleries = q
    ? galleries.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.clientName.toLowerCase().includes(q) ||
          g.sessionType.toLowerCase().includes(q) ||
          g.accessPin.toLowerCase().includes(q)
      )
    : galleries;

  const matchedPosts = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    : posts.slice(0, 2);

  const matchedPackages = q
    ? packages.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(q) ||
          pkg.subtitle.toLowerCase().includes(q) ||
          pkg.features.some((f) => f.toLowerCase().includes(q))
      )
    : [];

  const totalResults = matchedPhotos.length + matchedGalleries.length + matchedPosts.length + matchedPackages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location, camera, client session, lighting technique..."
            className="w-full text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-neutral-400 border border-neutral-300 dark:border-neutral-700 px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {totalResults === 0 ? (
            <div className="text-center py-10 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              No results found for "{query}". Try "wedding", "Hasselblad", "Kyoto", or "window light".
            </div>
          ) : (
            <>
              {/* Client Galleries Section */}
              {matchedGalleries.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 px-2 mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Client Galleries ({matchedGalleries.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedGalleries.map((gallery) => (
                      <div
                        key={gallery.id}
                        onClick={() => {
                          onSelectGallery(gallery);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={gallery.coverImage}
                            alt={gallery.title}
                            className="w-10 h-10 rounded object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                              {gallery.title}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              {gallery.sessionType} · PIN: {gallery.accessPin}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Photos Section */}
              {matchedPhotos.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 px-2 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Portfolio Plates ({matchedPhotos.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => {
                          onSelectPhoto(photo);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-10 h-10 rounded object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                              {photo.title}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              {photo.category} · {photo.exif.location} · {photo.exif.camera}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono">View EXIF</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts Section */}
              {matchedPosts.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 px-2 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Journal Articles ({matchedPosts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                          {post.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          {post.category} · {post.readTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages Section */}
              {matchedPackages.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 px-2 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Commission Packages</span>
                  </div>
                  <div className="space-y-1">
                    {matchedPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          onSelectPackage(pkg);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                            {pkg.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            ${pkg.price.toLocaleString()} USD · {pkg.duration}
                          </div>
                        </div>
                        <span className="text-xs text-neutral-900 dark:text-neutral-100 font-semibold font-mono">
                          Reserve →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>Quick search active</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
