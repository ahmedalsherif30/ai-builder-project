import React from 'react';
import { Article } from '../types';
import { ArticleReaderView } from './ArticleReaderView';
import { X } from 'lucide-react';
import { MOCK_ARTICLES } from '../data/articlesData';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
  onSelectArticle?: (article: Article) => void;
  onOpenAiInterpreter?: () => void;
  onOpenPrivateConsultation?: () => void;
  onOpenVipInfo?: () => void;
  isAdmin?: boolean;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onSelectArticle,
  onOpenAiInterpreter,
}) => {
  const handleSelectArticle = (newArticle: Article) => {
    if (onSelectArticle) {
      onSelectArticle(newArticle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden font-serif dir-rtl">
      <div
        id="article-reader-scroll-container"
        className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 max-h-[94vh] overflow-y-auto shadow-2xl relative flex flex-col my-auto text-slate-100 scroll-smooth"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق المقال"
          className="sticky top-0 left-0 p-2 bg-slate-950/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-xl border border-emerald-900 cursor-pointer z-20 transition shadow-md self-start"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Article Reader */}
        <ArticleReaderView
          article={article}
          onSelectArticle={handleSelectArticle}
          onOpenAiInterpreter={onOpenAiInterpreter}
          onClose={onClose}
          allArticles={MOCK_ARTICLES}
        />
      </div>
    </div>
  );
};
