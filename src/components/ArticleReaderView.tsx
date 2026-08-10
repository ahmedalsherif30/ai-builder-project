import React, { useState } from 'react';
import { Article } from '../types';
import { ARTICLE_CONFIG } from '../config/articleConfig';
import { MarkdownArticleRenderer } from './MarkdownArticleRenderer';
import { RelatedArticles } from './RelatedArticles';
import { ArticleNavigation } from './ArticleNavigation';
import { calculateReadingTime } from '../utils/markdownUtils';
import { MOCK_ARTICLES } from '../data/articlesData';
import { safeCopyToClipboard } from '../utils/copyToClipboard';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Sparkles,
  Tag,
  Share2,
  Check,
  Home,
  ChevronLeft,
} from 'lucide-react';

interface ArticleReaderViewProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onOpenAiInterpreter?: () => void;
  onClose?: () => void;
  allArticles?: Article[];
}

export const ArticleReaderView: React.FC<ArticleReaderViewProps> = ({
  article,
  onSelectArticle,
  onOpenAiInterpreter,
  onClose,
  allArticles = MOCK_ARTICLES,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic calculated reading time
  const readingTime = calculateReadingTime(article.content);

  // Handle Share / Copy Link
  const handleShare = async () => {
    const url = window.location.href;
    await safeCopyToClipboard(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article
      dir={ARTICLE_CONFIG.direction}
      className={`${ARTICLE_CONFIG.fontFamily} ${ARTICLE_CONFIG.textAlign} space-y-8 w-full ${ARTICLE_CONFIG.containerMaxWidth} mx-auto text-slate-100 py-4 px-2 sm:px-4`}
    >
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center flex-wrap gap-1.5 border-b border-emerald-900/60 pb-3">
        <span
          onClick={() => {
            if (onClose) onClose();
          }}
          className="flex items-center gap-1 hover:text-amber-300 transition cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span>الرئيسية</span>
        </span>
        <ChevronLeft className="w-3 h-3 text-slate-600" />
        <span className="hover:text-amber-300 transition cursor-pointer">
          المقالات المرجعية
        </span>
        <ChevronLeft className="w-3 h-3 text-slate-600" />
        <span className="text-amber-400 font-bold">{article.category}</span>
        <ChevronLeft className="w-3 h-3 text-slate-600" />
        <span className="text-slate-300 line-clamp-1">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b border-emerald-900/80 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif shadow-sm">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{article.category}</span>
          <span>•</span>
          <span>{ARTICLE_CONFIG.bookTitle} ({ARTICLE_CONFIG.bookEdition})</span>
        </div>

        {/* Article Main H1 Title */}
        <h1 className={`${ARTICLE_CONFIG.titleSize} text-slate-100 tracking-normal`}>
          {article.title}
        </h1>

        {/* Author, Publication Date & Calculated Reading Time */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300 bg-slate-950/90 border border-emerald-900/60 p-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <User className="w-4 h-4 text-amber-400" />
            <span>المؤلف: {article.author || ARTICLE_CONFIG.defaultAuthor}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>تاريخ النشر: <b className="font-mono text-slate-200">{article.publishedAt}</b></span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>زمن القراءة: <b className="text-amber-300 font-bold">{readingTime}</b></span>
          </div>
        </div>
      </header>

      {/* Featured Topic Image (Responsive, ZERO CLS) */}
      <div className="rounded-2xl overflow-hidden border border-emerald-900/80 max-h-80 aspect-video shadow-xl relative bg-slate-950">
        <img
          src={article.imageUrl}
          alt={article.seo?.imageAlt || `${article.title} - ${ARTICLE_CONFIG.bookTitle}`}
          loading="eager"
          // @ts-ignore fetchpriority HTML attribute
          fetchPriority="high"
          decoding="async"
          width="1200"
          height="630"
          className="w-full h-full object-cover transition transform hover:scale-105 duration-700"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
          }}
        />
      </div>

      {/* Main Narrative Article Content */}
      <div className="bg-slate-950 border border-emerald-900/80 p-5 sm:p-8 rounded-3xl space-y-4 text-slate-200 leading-relaxed shadow-lg">
        <MarkdownArticleRenderer content={article.content} />
      </div>



      {/* Tags Section */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/60">
          <Tag className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-bold">الوسوم المعتمدة:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-950 border border-emerald-900 text-slate-300 text-xs px-3 py-1 rounded-xl hover:border-amber-500/40 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}



      {/* Smart Related Articles Section */}
      <RelatedArticles
        currentArticle={article}
        allArticles={allArticles}
        onSelectArticle={onSelectArticle}
        limit={ARTICLE_CONFIG.relatedArticlesCount}
      />

      {/* Sequential Previous & Next Article Navigation */}
      <ArticleNavigation
        currentArticle={article}
        allArticles={allArticles}
        onSelectArticle={onSelectArticle}
      />

      {/* Article Reader Action Footer */}
      <footer className="pt-6 border-t border-emerald-900/80 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-900/90 p-4 rounded-2xl">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-emerald-900 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copiedLink ? 'تم نسخ رابط المقال' : 'مشاركة المقال'}</span>
        </button>

        <button
          onClick={() => {
            if (onClose) onClose();
            if (onOpenAiInterpreter) onOpenAiInterpreter();
          }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold cursor-pointer transition shadow-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>تعبير الرؤيا بالذكاء الاصطناعي (منهج طبعة 2026)</span>
        </button>
      </footer>
    </article>
  );
};
