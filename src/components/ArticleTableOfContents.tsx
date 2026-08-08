import React, { useState } from 'react';
import { extractHeadings, HeadingItem } from '../utils/markdownUtils';
import { List, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

interface ArticleTableOfContentsProps {
  content: string;
}

export const ArticleTableOfContents: React.FC<ArticleTableOfContentsProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(true);
  const headings = extractHeadings(content);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="my-6 bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-lg transition dir-rtl">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none border-b border-emerald-900/60 pb-3"
      >
        <div className="flex items-center gap-2.5 font-bold font-serif text-amber-300 text-sm sm:text-base">
          <List className="w-5 h-5 text-amber-400" />
          <span>جدول محتويات المقال الفهرسي</span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
            {headings.length} أقسام
          </span>
        </div>

        <button className="text-slate-400 hover:text-amber-300 transition">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="mt-3.5 space-y-2 pr-1 max-h-72 overflow-y-auto font-serif">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-right flex items-start gap-2 text-xs sm:text-sm py-1.5 px-2.5 rounded-xl transition cursor-pointer hover:bg-emerald-950/80 hover:text-amber-300 ${
                heading.level === 3 ? 'pr-6 text-slate-300' : 'font-bold text-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 shrink-0 mt-1 ${heading.level === 3 ? 'text-emerald-500' : 'text-amber-400'}`} />
              <span className="line-clamp-1">{heading.text}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};
