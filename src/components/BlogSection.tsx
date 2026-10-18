import React, { useState } from 'react';
import { Clock, Calendar, ArrowRight, X, Bookmark, Share2, Check } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['all', 'Technique & Lighting', 'Gear & Philosophy', 'Wedding Monographs'];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            The Studio Journal
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
            Projects, Gear & Lighting Notes
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Journal Entries' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid (3-column layout on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Cover Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content info */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata with separators */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2.5 font-mono">
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-editorial text-2xl font-normal text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Read Kicker */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {post.author.name}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-100 group-hover:translate-x-0.5 transition-transform">
                  Read Journal Entry
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-left">
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 font-mono">
                {selectedPost.category} · {selectedPost.publishDate}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Share article"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 space-y-6">
              <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 font-light leading-tight">
                {selectedPost.title}
              </h2>

              <p className="text-base text-neutral-600 dark:text-neutral-400 italic font-serif">
                {selectedPost.subtitle}
              </p>

              {/* Cover Photo */}
              <div className="rounded-xl overflow-hidden aspect-[16/9] bg-neutral-950">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Paragraphs */}
              <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-4">
                {selectedPost.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Tags unboxed */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Tags:</span>
                {selectedPost.tags.map((tag, i) => (
                  <React.Fragment key={tag}>
                    <span>#{tag}</span>
                    {i < selectedPost.tags.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
