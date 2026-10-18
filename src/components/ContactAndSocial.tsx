import React, { useState } from 'react';
import { Send, Instagram, Mail, MapPin, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface ContactAndSocialProps {
  onDirectInquirySent: (name: string, email: string, message: string) => void;
}

export const ContactAndSocial: React.FC<ContactAndSocialProps> = ({ onDirectInquirySent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial & Gallery Representation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    onDirectInquirySent(name, email, message);
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  const instagramPosts = [
    {
      id: 'ig-1',
      imageUrl: '/src/assets/images/portfolio_fashion_monochrome_1792335435317.jpg',
      caption: 'Study in pleats and shadow. Paris Fashion Week monograph.',
      likes: '4.8k',
    },
    {
      id: 'ig-2',
      imageUrl: '/src/assets/images/portfolio_architectural_minimalism_1792335435129.jpg',
      caption: 'Morning sun over concrete geometries in Kyoto.',
      likes: '3.2k',
    },
    {
      id: 'ig-3',
      imageUrl: '/src/assets/images/portfolio_intimate_wedding_1792335436088.jpg',
      caption: 'Quiet unchoreographed laughter in the Cotswolds.',
      likes: '6.9k',
    },
    {
      id: 'ig-4',
      imageUrl: '/src/assets/images/portfolio_cinematic_portrait_1792335436053.jpg',
      caption: 'Northern atelier window daylight. Zero synthetic fill.',
      likes: '5.1k',
    },
  ];

  return (
    <section id="contact-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 6 cols: Contact & Representation Form */}
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
            Studio Inquiries & Press
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-8 leading-relaxed">
            For global editorial assignments, print acquisition, gallery exhibition inquiries, or private commissions, reach our London and Kyoto studios directly.
          </p>

          <div className="space-y-4 mb-8 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-neutral-400" />
              <span>commissions@lumen-monolith.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>Studio 4, Redchurch Street, Shoreditch, London · Kyoto Atelier, Kamigyo-ku</span>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>
                Thank you, {name}. Your inquiry has been routed to our studio team. We will review your brief promptly.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@studio.com"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                >
                  <option value="Editorial & Commercial">Editorial & Commercial Commission</option>
                  <option value="Intimate Wedding">Intimate Wedding Narrative</option>
                  <option value="Archival Fine Art Print">Archival Fine Art Print Acquisition</option>
                  <option value="Press & Exhibition">Press, Talk & Exhibition Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Message / Project Scope *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your timeline, location, publication, or creative vision..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right 6 cols: Social Media Community & Instagram Grid */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              Community & Visual Stream
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-editorial font-light text-neutral-900 dark:text-neutral-100">
                Instagram Feed · @lumen.monolith
              </h3>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow 48.2k</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4-Image Instagram Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {instagramPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative rounded-xl overflow-hidden aspect-square bg-neutral-950 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white text-xs">
                    <p className="line-clamp-2 text-[11px] mb-1">{post.caption}</p>
                    <span className="font-mono text-[10px] text-neutral-300">♥ {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Network Channels */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-8">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Behance Portfolio</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">VSCO Grid</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Vimeo Showreels</a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Substack Monograph</a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-editorial text-xl font-normal text-neutral-900 dark:text-neutral-100 mb-1">
              Join the Monograph Collector List
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              Receive quarterly print drops, exhibition invitations, and lighting monographs.
            </p>

            {newsletterSubscribed ? (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Thank you for subscribing. We will never share your address.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
