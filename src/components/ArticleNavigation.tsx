import React from 'react';
import { Article } from '../types';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { sanitizeMarkdownText } from '../utils/markdownUtils';

interface ArticleNavigationProps {
  currentArticle: Article;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const ArticleNavigation: React.FC<ArticleNavigationProps> = ({
  currentArticle,
  allArticles,
  onSelectArticle,
}) => {
  if (!allArticles || allArticles.length === 0) return null;

  const currentIndex = allArticles.findIndex(
    (a) => a.id === currentArticle.id || a.slug === currentArticle.slug
  );

  if (currentIndex === -1) return null;

  // Previous article in sequence
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  
  // Next article in sequence
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  if (!prevArticle && !nextArticle) return null;

  const handleArticleClick = (art: Article) => {
    onSelectArticle(art);
    // Smooth scroll reader container to top
    const modalContainer = document.getElementById('article-reader-scroll-container');
    if (modalContainer) {
      modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-8 border-t border-emerald-900/80 space-y-4 font-serif">
      <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <span>التنقل التسلسلي بين المقالات المرجعية</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Article (المقال السابق) */}
        {prevArticle ? (
          <button
            onClick={() => handleArticleClick(prevArticle)}
            className="group bg-slate-950 hover:bg-slate-900 border border-emerald-900 hover:border-amber-500/60 p-4 sm:p-5 rounded-2xl text-right transition duration-300 cursor-pointer flex flex-col justify-between space-y-2 shadow-md hover:shadow-xl"
          >
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>المقال السابق</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-normal">{prevArticle.category}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
              {prevArticle.title}
            </h4>

            <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
              {sanitizeMarkdownText(prevArticle.excerpt)}
            </p>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Article (المقال التالي) */}
        {nextArticle ? (
          <button
            onClick={() => handleArticleClick(nextArticle)}
            className="group bg-slate-950 hover:bg-slate-900 border border-emerald-900 hover:border-amber-500/60 p-4 sm:p-5 rounded-2xl text-right transition duration-300 cursor-pointer flex flex-col justify-between space-y-2 shadow-md hover:shadow-xl"
          >
            <div className="flex items-center justify-end gap-2 text-xs text-amber-400 font-bold">
              <span className="text-slate-400 font-normal">{nextArticle.category}</span>
              <span className="text-slate-600">•</span>
              <span>المقال التالي</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 leading-snug">
              {nextArticle.title}
            </h4>

            <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
              {sanitizeMarkdownText(nextArticle.excerpt)}
            </p>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
};
