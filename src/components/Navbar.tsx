import React from 'react';
import { Search, Bell, Sun, Moon, Lock, Calendar } from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  unreadCount: number;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenSearch,
  unreadCount,
  onOpenNotifications,
  onBookClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 bg-white/90 dark:bg-neutral-950/90 border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, no descriptor tags) */}
        <button
          onClick={() => setActiveTab('portfolio')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-label="Lumen and Monolith Home"
        >
          <span className="font-editorial text-xl sm:text-2xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0">
            LUMEN & MONOLITH
          </span>
        </button>

        {/* Zone 2: Clean, single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'portfolio'
                ? 'text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-white'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('client-portal')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'client-portal'
                ? 'text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-white'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 opacity-70" />
            Client Gallery
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'journal'
                ? 'text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-white'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Journal & Tips
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'booking'
                ? 'text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-white'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Book Session
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'analytics'
                ? 'text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-white'
                : 'hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Studio Analytics
          </button>
        </nav>

        {/* Zone 3: Search, Notifications, Theme & Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Search photos, galleries, articles (Cmd+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Real-time notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900 dark:bg-white" />
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onBookClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide uppercase text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            Inquire & Book
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 py-2.5 px-2 bg-neutral-50/70 dark:bg-neutral-950/70 text-xs">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-2 py-1 ${activeTab === 'portfolio' ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('client-portal')}
          className={`px-2 py-1 ${activeTab === 'client-portal' ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}
        >
          Client Gallery
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-2 py-1 ${activeTab === 'journal' ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}
        >
          Journal
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-2 py-1 ${activeTab === 'booking' ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}
        >
          Book
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2 py-1 ${activeTab === 'analytics' ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-500'}`}
        >
          Studio
        </button>
      </div>
    </header>
  );
};
