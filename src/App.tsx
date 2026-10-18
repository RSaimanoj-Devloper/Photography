/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioGallery } from './components/PortfolioGallery';
import { LightboxModal } from './components/LightboxModal';
import { ClientGalleryPortal } from './components/ClientGalleryPortal';
import { BookingSection } from './components/BookingSection';
import { BlogSection } from './components/BlogSection';
import { StudioAnalyticsDashboard } from './components/StudioAnalyticsDashboard';
import { ContactAndSocial } from './components/ContactAndSocial';
import { SearchModal } from './components/SearchModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';

import {
  INITIAL_PHOTOS,
  CLIENT_GALLERIES,
  BOOKING_PACKAGES,
  BOOKING_ADDONS,
  BLOG_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANALYTICS,
  INITIAL_AIVEN_STATE,
} from './data/mockData';

import {
  Photo,
  ClientGallery,
  BlogPost,
  BookingPackage,
  BookingInquiry,
  NotificationItem,
  AnalyticsData,
  AivenSyncState,
} from './types';

import { downloadSingleImage } from './utils/downloadHelper';

export default function App() {
  // Theme state: dark mode default for photography editorial contrast
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lumen_theme');
      if (stored) return stored === 'dark';
      return true; // default dark obsidian
    }
    return true;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('portfolio');

  // Core Data States
  const [photos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [galleries] = useState<ClientGallery[]>(CLIENT_GALLERIES);
  const [packages] = useState<BookingPackage[]>(BOOKING_PACKAGES);
  const [addons] = useState(BOOKING_ADDONS);
  const [posts] = useState<BlogPost[]>(BLOG_POSTS);

  // Inquiries Pipeline
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([
    {
      id: 'inq-initial-1',
      referenceNumber: 'LUM-2026-4821',
      clientName: 'Sarah Jenkins',
      clientEmail: 'sarah.sterling@example.com',
      clientPhone: '+44 7700 900142',
      packageId: 'pkg-wedding',
      packageName: 'Cinematic Wedding Narrative',
      requestedDate: '2026-11-20',
      requestedTime: '15:00 - Golden Hour Twilight',
      selectedAddons: ['addon-album'],
      totalPrice: 4850,
      location: 'Cotswolds / Oxford, United Kingdom',
      visionNotes: 'Natural window lighting and candid meadow documentary.',
      status: 'confirmed',
      createdAt: 'Oct 14, 2026',
    },
    {
      id: 'inq-initial-2',
      referenceNumber: 'LUM-2026-3190',
      clientName: 'Atelier Kengo Architects',
      clientEmail: 'commissions@atelier-kengo.jp',
      clientPhone: '+81 75 412 8840',
      packageId: 'pkg-architecture',
      packageName: 'Architectural & Spatial Series',
      requestedDate: '2026-12-05',
      requestedTime: '06:30 - Dawn First Light',
      selectedAddons: ['addon-drone'],
      totalPrice: 2600,
      location: 'Kamigyo-ku, Kyoto, Japan',
      visionNotes: 'Exposed concrete daylight shadows & twilight illumination.',
      status: 'reviewing',
      createdAt: 'Oct 17, 2026',
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lumen_favorites');
      return stored ? JSON.parse(stored) : ['photo-1', 'photo-4'];
    }
    return ['photo-1', 'photo-4'];
  });

  // Lightbox Modal
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<Photo | null>(null);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Studio Analytics & Aiven DB Sync
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [aivenState, setAivenState] = useState<AivenSyncState>(INITIAL_AIVEN_STATE);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync theme to HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lumen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lumen_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('lumen_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast(favorites.includes(id) ? 'Removed from favorites' : 'Saved to favorites');
  };

  const handleDownloadPhoto = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSingleImage(photo.imageUrl, `${photo.title.replace(/\s+/g, '_')}_Master_100MP`);
    showToast(`Master resolution file for "${photo.title}" downloaded.`);

    // Increment analytics
    setAnalytics((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1,
    }));
  };

  const handleBookingSubmitted = (inquiry: BookingInquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);

    // Dispatch real-time milestone notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Booking Reserved',
      message: `${inquiry.clientName} booked "${inquiry.packageName}" for ${inquiry.requestedDate}.`,
      timestamp: 'Just now',
      type: 'booking',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update analytics
    setAnalytics((prev) => ({
      ...prev,
      projectedRevenue: prev.projectedRevenue + inquiry.totalPrice,
    }));
  };

  const handleProofingSubmitted = (galleryTitle: string, selectedCount: number) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Client Proofs Received',
      message: `${galleryTitle} approved ${selectedCount} plates for album design.`,
      timestamp: 'Just now',
      type: 'proofing',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Proofing review submitted for ${galleryTitle}`);
  };

  const handleGalleryDownloaded = (galleryTitle: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Master Gallery Downloaded',
      message: `Full high-res archive downloaded for ${galleryTitle}.`,
      timestamp: 'Just now',
      type: 'download',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`All master files downloaded.`);
  };

  const handleDirectInquirySent = (name: string, email: string, message: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Studio Inquiry',
      message: `${name} (${email}) sent a message: "${message.slice(0, 40)}..."`,
      timestamp: 'Just now',
      type: 'booking',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Inquiry dispatched to studio.`);
  };

  const handleTriggerAivenSync = () => {
    setAivenState((prev) => ({
      ...prev,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      recordsConsistent: prev.recordsConsistent + inquiries.length,
      latencyMs: +(6.5 + Math.random() * 2.5).toFixed(1),
    }));

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Aiven DB Re-Synchronized',
      message: 'Cloud PostgreSQL nodes synchronized with 100% data consistency.',
      timestamp: 'Just now',
      type: 'sync',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateInquiryStatus = (
    inquiryId: string,
    status: 'new' | 'reviewing' | 'confirmed' | 'completed'
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
    showToast(`Inquiry status updated to "${status}".`);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onBookClick={() => {
          setActiveTab('booking');
          const el = document.getElementById('booking-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'portfolio' && (
          <>
            {/* Split-Screen Hero */}
            <Hero
              onExplorePortfolio={() => {
                const el = document.getElementById('portfolio-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBookSession={() => {
                setActiveTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenClientPortal={() => {
                setActiveTab('client-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              featuredPhoto={photos[0]}
              onPhotoClick={(photo) => setActiveLightboxPhoto(photo)}
            />

            {/* Portfolio Bento Gallery */}
            <PortfolioGallery
              photos={photos}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPhotoClick={(photo) => setActiveLightboxPhoto(photo)}
              onDownloadPhoto={handleDownloadPhoto}
            />

            {/* Inquiries & Social Media Stream */}
            <ContactAndSocial onDirectInquirySent={handleDirectInquirySent} />
          </>
        )}

        {activeTab === 'client-portal' && (
          <ClientGalleryPortal
            galleries={galleries}
            onProofingSubmitted={handleProofingSubmitted}
            onGalleryDownloaded={handleGalleryDownloaded}
          />
        )}

        {activeTab === 'journal' && (
          <BlogSection posts={posts} />
        )}

        {activeTab === 'booking' && (
          <BookingSection
            packages={packages}
            addons={addons}
            onBookingSubmitted={handleBookingSubmitted}
          />
        )}

        {activeTab === 'analytics' && (
          <StudioAnalyticsDashboard
            analytics={analytics}
            aivenState={aivenState}
            onTriggerAivenSync={handleTriggerAivenSync}
            photos={photos}
            inquiries={inquiries}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenClientPortal={() => {
          setActiveTab('client-portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Lightbox Modal */}
      {activeLightboxPhoto && (
        <LightboxModal
          photo={activeLightboxPhoto}
          photos={photos}
          onClose={() => setActiveLightboxPhoto(null)}
          onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onDownloadPhoto={handleDownloadPhoto}
        />
      )}

      {/* Omnibar Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        photos={photos}
        galleries={galleries}
        posts={posts}
        packages={packages}
        onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
        onSelectGallery={() => setActiveTab('client-portal')}
        onSelectPost={() => setActiveTab('journal')}
        onSelectPackage={() => setActiveTab('booking')}
      />

      {/* Real-time Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-neutral-700 dark:border-neutral-200 transition-all animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
