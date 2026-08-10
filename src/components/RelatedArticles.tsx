import React from 'react';
import { Article } from '../types';
import { BookOpen, Clock, User, ArrowLeft } from 'lucide-react';
import { sanitizeMarkdownText } from '../utils/markdownUtils';

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
  limit?: number;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticle,
  allArticles,
  onSelectArticle,
  limit = 4,
}) => {
  if (!allArticles || allArticles.length === 0) return null;

  // Find articles matching category or overlapping tags
  const related = allArticles
    .filter((art) => art.id !== currentArticle.id && art.slug !== currentArticle.slug)
    .map((art) => {
      let score = 0;
      if (art.category === currentArticle.category) score += 5;
      
      const tagOverlap = art.tags?.filter((t) => currentArticle.tags?.includes(t)) || [];
      score += tagOverlap.length * 2;

      if (art.title.includes(currentArticle.category)) score += 3;

      return { article: art, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);

  if (related.length === 0) return null;

  const handleArticleClick = (art: Article) => {
    onSelectArticle(art);
    const modalContainer = document.getElementById('article-reader-scroll-container');
    if (modalContainer) {
      modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-8 border-t border-emerald-900/80 space-y-4 font-serif">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>مقالات وسياقات ذات صلة بالتأويل الروحي</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((art) => (
          <div
            key={art.id}
            onClick={() => handleArticleClick(art)}
            className="group bg-slate-950 hover:bg-slate-900 border border-emerald-900/80 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition duration-300 flex items-start gap-3.5 shadow-md hover:shadow-xl"
          >
            <img
              src={art.imageUrl}
              alt={art.title}
              loading="lazy"
              decoding="async"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-emerald-900/60 group-hover:scale-105 transition-transform shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
              }}
            />

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold">
                <span className="truncate">{art.category}</span>
                <span className="text-slate-500 flex items-center gap-1 font-sans">
                  <Clock className="w-3 h-3 text-emerald-400" /> {art.readTime}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-xs sm:text-sm group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                {art.title}
              </h4>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sanitizeMarkdownText(art.excerpt)}
              </p>

              <div className="text-[11px] text-amber-400/90 font-bold flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                <span>اقرأ الدراسة</span>
                <ArrowLeft className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
