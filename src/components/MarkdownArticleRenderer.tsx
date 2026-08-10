import React from 'react';
import { sanitizeMarkdownText } from '../utils/markdownUtils';
import { BookOpen, Sparkles, Quote, ChevronLeft } from 'lucide-react';

interface MarkdownArticleRendererProps {
  content: string;
  className?: string;
}

export const MarkdownArticleRenderer: React.FC<MarkdownArticleRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  const lines = content.split('\n');
  let headingCounter = 1;
  const renderedElements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!currentList) return;
    const ListTag = currentList.type === 'ul' ? 'ul' : 'ol';
    const listStyle =
      currentList.type === 'ul'
        ? 'list-disc list-inside space-y-2 my-4 pr-2 font-serif text-slate-200'
        : 'list-decimal list-inside space-y-2 my-4 pr-2 font-serif text-slate-200';

    renderedElements.push(
      <ListTag key={`${keyPrefix}-list`} className={listStyle}>
        {currentList.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed sm:leading-loose text-slate-200 text-base sm:text-lg font-serif py-1">
            {formatInlineMarkdown(item)}
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  // Inline formatting helper to process **bold**, *italics*, and Quranic brackets ﴿...﴾
  function formatInlineMarkdown(text: string): React.ReactNode[] {
    const cleanText = text.trim();
    if (!cleanText) return [];

    // Split by ** or ﴿...﴾
    const parts = cleanText.split(/(\*\*[^*]+\*\*|﴿[^﴾]+﴾)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-amber-300 font-serif px-0.5">
            {inner}
          </strong>
        );
      }
      if (part.startsWith('﴿') && part.endsWith('﴾')) {
        return (
          <span key={index} className="inline-flex items-center text-emerald-300 font-bold bg-emerald-950/90 border border-emerald-700/80 px-2 py-0.5 rounded-lg text-sm sm:text-base my-1 font-serif shadow-sm">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal Rule (---)
    if (trimmed === '---' || trimmed === '***') {
      flushList(`hr-${index}`);
      renderedElements.push(
        <div key={`hr-${index}`} className="my-8 flex items-center justify-center gap-3">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-800 to-transparent flex-1" />
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 opacity-80" />
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-800 to-transparent flex-1" />
        </div>
      );
      return;
    }

    // Heading 1 (# Title) -> Convert to H2 to ensure strictly single H1 per page
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      flushList(`h1-${index}`);
      const rawTitle = trimmed.replace(/^#\s+/, '');
      const cleanTitle = sanitizeMarkdownText(rawTitle);
      const headingId = `heading-${headingCounter++}`;

      renderedElements.push(
        <h2
          key={`h2-${index}`}
          id={headingId}
          className="text-xl sm:text-2xl font-bold font-serif text-amber-300 mt-10 mb-4 pb-3 border-b border-emerald-800/80 flex items-center gap-3 scroll-mt-24"
        >
          <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shrink-0 shadow-md" />
          <span>{cleanTitle}</span>
        </h2>
      );
      return;
    }

    // Heading 2 (## Title)
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      flushList(`h2-${index}`);
      const rawTitle = trimmed.replace(/^##\s+/, '');
      const cleanTitle = sanitizeMarkdownText(rawTitle);
      const headingId = `heading-${headingCounter++}`;

      renderedElements.push(
        <h2
          key={`h2-${index}`}
          id={headingId}
          className="text-xl sm:text-2xl font-bold font-serif text-amber-300 mt-10 mb-4 pb-3 border-b border-emerald-800/80 flex items-center gap-3 scroll-mt-24"
        >
          <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shrink-0 shadow-md" />
          <span>{cleanTitle}</span>
        </h2>
      );
      return;
    }

    // Heading 3 (### Title)
    if (trimmed.startsWith('### ')) {
      flushList(`h3-${index}`);
      const rawTitle = trimmed.replace(/^###\s+/, '');
      const cleanTitle = sanitizeMarkdownText(rawTitle);
      const headingId = `heading-${headingCounter++}`;

      renderedElements.push(
        <h3
          key={`h3-${index}`}
          id={headingId}
          className="text-lg sm:text-xl font-bold font-serif text-emerald-300 mt-8 mb-3 px-4 py-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center gap-2.5 scroll-mt-24 shadow-sm"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
          <span>{cleanTitle}</span>
        </h3>
      );
      return;
    }

    // Blockquote (> text)
    if (trimmed.startsWith('> ')) {
      flushList(`quote-${index}`);
      const quoteText = trimmed.replace(/^>\s+/, '');
      renderedElements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-6 p-5 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-amber-500/30 rounded-2xl text-amber-200 font-serif text-base sm:text-lg leading-relaxed shadow-lg relative"
        >
          <Quote className="w-6 h-6 text-amber-400/40 absolute top-3 left-3 pointer-events-none" />
          <div className="relative z-10 pl-6">{formatInlineMarkdown(quoteText)}</div>
        </blockquote>
      );
      return;
    }

    // Unordered List Items (- or * )
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList(`prev-${index}`);
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Numbered List Items (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList(`prev-${index}`);
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Empty lines flush lists
    if (!trimmed) {
      flushList(`empty-${index}`);
      return;
    }

    // Standard Paragraph
    flushList(`p-${index}`);
    renderedElements.push(
      <p
        key={`p-${index}`}
        className="text-slate-100 font-serif text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose my-5 text-justify"
      >
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList('end');

  return (
    <div className={`space-y-2 dir-rtl text-right font-serif ${className}`}>
      {renderedElements}
    </div>
  );
};
