import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Sparkles,
  X,
  Eye,
  Tag,
  Share2,
  Check,
} from 'lucide-react';
import { MOCK_ARTICLES } from '../data/mockData';
import { Article } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface HomeArticlesStripProps {
  onNavigateToArticles: () => void;
}

export const HomeArticlesStrip: React.FC<HomeArticlesStripProps> = React.memo(({
  onNavigateToArticles,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Take 6 featured articles
  const topArticles = MOCK_ARTICLES.slice(0, 6);

  const handleShareArticle = async () => {
    await safeCopyToClipboard(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-900/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-700/80 px-3 py-1 rounded-full text-xs text-amber-300 font-serif mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>مقالات ودراسات طبعة 2026 (210 مقالاً)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
            أحدث دراسات ومقالات تأويل الأحلام
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif mt-1 max-w-2xl">
            مقالات علمية وروحانية استناداً إلى قواعد كتاب "تأويلات روحية لفهم المشاهدات المنامية" لـ أحمد الشريف.
          </p>
        </div>

        <button
          onClick={onNavigateToArticles}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer shrink-0"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>تصفح جميع المقالات المرجعية (210)</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6-Article Prominent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {topArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/70 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Image Thumbnail */}
            <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
              <img
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/50 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold font-serif shadow-md">
                {article.category}
              </div>

              {/* Read Time */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/90 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-800 shadow-sm font-serif">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-serif">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.publishedAt}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors font-serif leading-snug line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Action Button Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1 font-serif">
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1 font-serif">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{article.views} مشاهدة</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-700/80 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-emerald-900/60 pb-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {selectedArticle.category}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>وقت القراءة: {selectedArticle.readTime}</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-serif">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span>الكاتب: {selectedArticle.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>تاريخ النشر: {selectedArticle.publishedAt}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Hero Image */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-emerald-800/60">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Excerpt Banner */}
            <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-4 text-xs text-emerald-200 font-serif leading-relaxed">
              <strong className="text-amber-300 block mb-1">ملخص المقال:</strong>
              {selectedArticle.excerpt}
            </div>

            {/* Content Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 font-serif whitespace-pre-line">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>الوسوم:</span>
                </span>
                {selectedArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-0.5 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleShareArticle}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">تم نسخ رابط المقال!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>مشاركة المقال</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onNavigateToArticles();
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>الانتقال للمكتبة الشاملة (60)</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
});
