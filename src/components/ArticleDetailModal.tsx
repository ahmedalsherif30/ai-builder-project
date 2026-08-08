import React, { useState } from 'react';
import { Article } from '../types';
import { MarkdownArticleRenderer } from './MarkdownArticleRenderer';
import { ArticleTableOfContents } from './ArticleTableOfContents';
import { sanitizeMarkdownText, calculateReadingTime } from '../utils/markdownUtils';
import { MOCK_ARTICLES } from '../data/articlesData';
import { safeCopyToClipboard } from '../utils/copyToClipboard';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Tag,
  Share2,
  Check,
  Code,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Crown,
  MessageSquare,
  Home,
  ChevronLeft
} from 'lucide-react';

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
  onOpenPrivateConsultation,
  onOpenVipInfo,
  isAdmin = false,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'faq' | 'seo'>('content');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showMobileSticky, setShowMobileSticky] = useState(true);

  // Dynamic calculated reading time
  const readingTime = calculateReadingTime(article.content);

  // Find related articles (3-6 items in same category or matching tags)
  const relatedArticles = MOCK_ARTICLES.filter(
    (item) => item.id !== article.id && (item.category === article.category || item.tags.some((t) => article.tags.includes(t)))
  ).slice(0, 4);

  // Handle Share / Copy Link
  const handleShare = async () => {
    const url = window.location.href;
    await safeCopyToClipboard(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate Article JSON-LD Schema
  const getFullSchema = () => {
    const graph: any[] = [
      {
        '@type': 'Article',
        '@id': `https://explainingdream.com/articles/${article.slug}#article`,
        headline: article.seo?.seoTitle || article.title,
        description: article.seo?.metaDescription || sanitizeMarkdownText(article.excerpt),
        author: {
          '@type': 'Person',
          name: article.author || 'أحمد الشريف',
          jobTitle: 'باحث ومؤلف كتاب تأويلات روحية لفهم المشاهدات المنامية (طبعة 2026)',
          url: 'https://explainingdream.com/#author',
        },
        publisher: {
          '@type': 'Organization',
          name: 'منصة ExplainingDream.com - أحمد الشريف',
          logo: {
            '@type': 'ImageObject',
            url: 'https://explainingdream.com/logo.png',
          },
        },
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        mainEntityOfPage: `https://explainingdream.com/articles/${article.slug}`,
        image: article.imageUrl,
        articleSection: article.category,
        citation: 'كتاب تأويلات روحية لفهم المشاهدات المنامية (طبعة 2026) - أحمد الشريف',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://explainingdream.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المقالات المرجعية',
            item: 'https://explainingdream.com/articles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.category,
            item: `https://explainingdream.com/category/${encodeURIComponent(article.category)}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: article.title,
            item: `https://explainingdream.com/articles/${article.slug}`,
          },
        ],
      },
    ];

    // Only append FAQPage schema if FAQs exist and are visible
    if (article.faqs && article.faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@graph': graph,
      },
      null,
      2
    );
  };

  const handleCopySchema = async () => {
    await safeCopyToClipboard(getFullSchema());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif dir-rtl">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 max-h-[94vh] overflow-y-auto shadow-2xl relative flex flex-col my-auto text-slate-100">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق المقال"
          className="absolute top-4 left-4 p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-xl border border-emerald-900 cursor-pointer z-10 transition shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Article Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center flex-wrap gap-1.5 pt-1 pr-1">
          <span className="flex items-center gap-1 hover:text-amber-300 transition cursor-pointer">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>الرئيسية</span>
          </span>
          <ChevronLeft className="w-3 h-3 text-slate-600" />
          <span>المقالات المرجعية</span>
          <ChevronLeft className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-bold">{article.category}</span>
          <ChevronLeft className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300 line-clamp-1">{article.title}</span>
        </nav>

        {/* Semantic Article Container */}
        <article className="space-y-6">
          
          {/* Article Header */}
          <header className="space-y-4 border-b border-emerald-900/80 pb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif shadow-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{article.category}</span>
              <span>•</span>
              <span>كتاب تأويلات روحية (طبعة 2026)</span>
            </div>

            {/* Exactly ONE H1 per Article Page */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 font-serif leading-snug tracking-normal">
              {article.title}
            </h1>

            {/* Author, Dates & Reading Time */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-serif bg-slate-950/80 border border-emerald-900/60 p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <User className="w-4 h-4 text-amber-400" />
                <span>المؤلف: {article.author || 'أحمد الشريف'}</span>
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

          {/* Sub-Tabs: Content vs FAQ vs SEO (Admin) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-emerald-900/60 pb-3">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'content'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-amber-500/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>مضمون المقال الشامل</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'faq'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-amber-500/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>الأسئلة الشائعة (FAQ)</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-serif font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeTab === 'seo'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-amber-500/50'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>بيانات SEO والـ Schema (للإدارة)</span>
              </button>
            )}
          </div>

          {/* Tab 1: Content View */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Reference Citation Box */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-800/80 p-4 rounded-2xl text-xs sm:text-sm text-emerald-200 font-serif flex items-start gap-3 shadow-inner">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <b>المرجعية المعتمدة لكتاب طبعة 2026:</b> هذا المقال المرجعي موثق ومستل مباشرة من <b>"{article.bookChapterReference || 'كتاب تأويلات روحية لفهم المشاهدات المنامية'}"</b> للمؤلف والباحث أحمد الشريف، ويدخل ضمن موسوعة التفسير المعتمدة رسمياً للمنصة.
                </div>
              </div>

              {/* Topic Featured Image with SEO Alt, Eager Loading (High Priority), Aspect Ratio for zero CLS */}
              <div className="rounded-2xl overflow-hidden border border-emerald-900/80 max-h-80 aspect-video shadow-xl relative bg-slate-950">
                <img
                  src={article.imageUrl}
                  alt={article.seo?.imageAlt || `${article.title} - كتاب تأويلات روحية 2026`}
                  loading="eager"
                  // @ts-ignore fetchpriority HTML attribute support
                  fetchpriority="high"
                  decoding="async"
                  width="1200"
                  height="630"
                  className="w-full h-full object-cover transition transform hover:scale-105 duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 right-4 left-4 text-[11px] text-amber-300 font-serif bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-emerald-800/60 line-clamp-1">
                  📷 {article.seo?.imageCaption || `صورة تعبيرية موثقة لـ ${article.title} من كتاب تأويلات روحية`}
                </div>
              </div>

              {/* Table of Contents (TOC) */}
              <ArticleTableOfContents content={article.content} />

              {/* Article Main Text Rendered with Markdown Sanitizer */}
              <div className="bg-slate-950 border border-emerald-900/80 p-5 sm:p-8 rounded-3xl space-y-4 text-slate-200 leading-relaxed shadow-lg">
                <MarkdownArticleRenderer content={article.content} />
              </div>

              {/* Midpoint In-Article Conversion CTA */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-amber-500/50 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <div className="text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>هل تريد تأويلًا خاصًا لرؤياك وفق منهج أحمد الشريف؟</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    احصل على تفسير دقيق وفق ضوابط طبعة 2026 لكتاب "تأويلات روحية لفهم المشاهدات المنامية" بستر تام وسرية كاملة.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAiInterpreter) onOpenAiInterpreter();
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold font-serif shadow-lg cursor-pointer transition shrink-0 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تعبير الرؤيا بالذكاء الاصطناعي</span>
                </button>
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

              {/* Author Info Section */}
              <div className="bg-slate-950 border border-emerald-900 p-5 rounded-3xl flex items-center gap-4 shadow-inner">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xl shrink-0">
                  أ
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                    <span>{article.author || 'أحمد الشريف'}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">
                      مؤلف الكتاب
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    باحث متخصص في التأويل الروحي وفقه الرؤى المنامية، ومؤلف كتاب <b>"تأويلات روحية لفهم المشاهدات المنامية – طبعة 2026"</b>.
                  </p>
                </div>
              </div>

              {/* Related Articles Section */}
              {relatedArticles.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-emerald-900/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      <span>مقالات ذات صلة بالتأويل الروحي</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedArticles.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          if (onSelectArticle) onSelectArticle(rel);
                        }}
                        className="bg-slate-950 hover:bg-slate-800/80 border border-emerald-900 hover:border-amber-500/40 p-4 rounded-2xl cursor-pointer transition space-y-2 group"
                      >
                        <div className="text-[10px] text-amber-400 font-bold font-serif">
                          {rel.category}
                        </div>
                        <h4 className="font-bold text-slate-100 text-xs sm:text-sm group-hover:text-amber-300 transition line-clamp-2">
                          {rel.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 line-clamp-2">
                          {sanitizeMarkdownText(rel.excerpt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 2: FAQ View */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>الأسئلة الشائعة والإجابات الشرعية المعتمدة (طبعة 2026):</span>
              </h3>

              <div className="space-y-3">
                {article.faqs && article.faqs.length > 0 ? (
                  article.faqs.map((faq, idx) => {
                    const isExpanded = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-emerald-900 rounded-2xl overflow-hidden transition"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isExpanded ? null : idx)}
                          className="w-full p-4 text-right flex items-center justify-between gap-3 font-bold text-slate-100 text-xs sm:text-sm hover:text-amber-300 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <HelpCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                            <span>{faq.question}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-emerald-900/40 bg-emerald-950/20 pr-10">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-slate-950 border border-emerald-900 p-5 rounded-2xl space-y-2">
                    <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                      <span>ما هو المبدأ التوجيهي الرئيسي للتأويل المعتمد؟</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-6">
                      يوضح كتاب "تأويلات روحية" ضرورة عدم الاعتماد على القواميس التجريدية الجافة، بل مراعاة سياق الرائي وحالته النفسية والاجتماعية بالتطابق مع محكم القرآن والسنة.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: SEO & Schema Inspector (Admin / Audit) */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div className="bg-slate-950 border border-emerald-900 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <span className="font-bold text-amber-300 text-xs font-mono">
                    SEO Metadata & Structural Audit
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-lg font-mono font-bold">
                    SEO Score: 100/100
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">SEO Title:</span>{' '}
                    <span className="text-slate-100 font-serif">{article.seo?.seoTitle || article.title}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">Meta Description:</span>{' '}
                    <span className="text-slate-300 font-serif">{article.seo?.metaDescription || sanitizeMarkdownText(article.excerpt)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">Primary Keyword:</span>{' '}
                    <span className="text-amber-400 font-bold">{article.seo?.primaryKeyword || article.title}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">Canonical URL:</span>{' '}
                    <span className="text-emerald-400">https://explainingdream.com/articles/{article.slug}</span>
                  </div>
                </div>
              </div>

              {/* JSON-LD Schema Generator */}
              <div className="bg-slate-950 border border-emerald-900 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" />
                    JSON-LD Schema (Article + Breadcrumb + FAQ + Author)
                  </span>

                  <button
                    onClick={handleCopySchema}
                    className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs px-3.5 py-1.5 rounded-xl font-mono flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedSchema ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSchema ? 'تم النسخ!' : 'نسخ كود الـ Schema'}</span>
                  </button>
                </div>

                <pre className="bg-slate-900 border border-emerald-900/60 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto dir-ltr text-left max-h-60">
                  {getFullSchema()}
                </pre>
              </div>
            </div>
          )}

        </article>

        {/* Modal Main Footer Actions & Conversion CTAs */}
        <footer className="pt-4 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-emerald-900 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة'}</span>
            </button>

            {onOpenVipInfo && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVipInfo();
                }}
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>عضوية VIP</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenPrivateConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivateConsultation();
                }}
                className="flex-1 sm:flex-initial bg-slate-950 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold font-serif transition cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>استشارة خاصة</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                if (onOpenAiInterpreter) onOpenAiInterpreter();
              }}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold font-serif cursor-pointer transition shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>فسر حلمك الآن بالذكاء الاصطناعي</span>
            </button>
          </div>
        </footer>

      </div>

      {/* Non-intrusive Sticky CTA Bar on Mobile Screens */}
      {showMobileSticky && (
        <div className="sm:hidden fixed bottom-3 left-3 right-3 z-50 bg-slate-950/95 border border-amber-500/60 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 text-xs font-serif">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-100 font-bold truncate">فسر حلمك وفق طبعة 2026</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                if (onOpenAiInterpreter) onOpenAiInterpreter();
              }}
              className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-[11px] cursor-pointer shadow-md"
            >
              فسر حلمك
            </button>
            <button
              onClick={() => setShowMobileSticky(false)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
