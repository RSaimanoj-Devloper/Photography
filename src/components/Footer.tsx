import React from 'react';
import { Camera, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenClientPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenClientPortal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="font-editorial text-2xl font-light text-neutral-900 dark:text-neutral-100 tracking-wider mb-2">
              LUMEN & MONOLITH
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md font-light leading-relaxed">
              Fine art monographs, documentary weddings, and architectural series. London studio & Kyoto atelier. Available globally for bespoke commissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => setActiveTab('portfolio')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Portfolio Works
            </button>
            <button
              onClick={onOpenClientPortal}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Client Proofing Gate
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Journal & Notes
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Commission Booking
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Studio CRM & Aiven DB
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} LUMEN & MONOLITH STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Hasselblad & Leica Master Quality</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
