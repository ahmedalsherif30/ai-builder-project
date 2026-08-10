/**
 * Centralized Typography & Reading Configuration for ExplainingDream Articles
 * Based on the book: «تأويلات روحية لفهم المشاهدات المنامية» - للباحث والمؤلف أحمد الشريف (طبعة 2026)
 *
 * Changing values in this configuration updates the typography, colors, line heights,
 * and maximum reading widths across ALL articles centrally.
 */

export const ARTICLE_CONFIG = {
  // Editorial Identity
  bookTitle: 'تأويلات روحية لفهم المشاهدات المنامية',
  bookEdition: 'طبعة 2026 المعتمدة',
  defaultAuthor: 'أحمد الشريف',
  authorRole: 'باحث ومؤلف كتاب تأويلات روحية',

  // Layout & Width Constraints for Optimal Line Length (65-75 ch)
  containerMaxWidth: 'max-w-3xl', // Central width for continuous reading comfort
  direction: 'rtl' as const,
  textAlign: 'text-right' as const,

  // Typography Settings
  fontFamily: 'font-serif', // Classical Arabic serif typeface for spiritual/editorial feel
  
  // Font Sizes
  titleSize: 'text-2xl sm:text-3xl md:text-4xl font-bold leading-snug', // Article H1
  h2Size: 'text-xl sm:text-2xl md:text-3xl font-bold leading-snug mt-10 mb-4 text-amber-300 border-b border-emerald-800/80 pb-3 flex items-center gap-3', // Subheadings H2
  h3Size: 'text-lg sm:text-xl font-bold leading-snug mt-8 mb-4 text-emerald-300', // Subheadings H3
  bodySize: 'text-base sm:text-lg text-slate-100 leading-relaxed sm:leading-loose', // Main Body Text
  metaSize: 'text-xs sm:text-sm text-slate-300', // Meta Data (Author, Date, Read Time)

  // Colors
  textColor: 'text-slate-100',
  mutedTextColor: 'text-slate-300',
  accentGoldColor: 'text-amber-300',
  accentEmeraldColor: 'text-emerald-400',
  backgroundColor: 'bg-slate-950',
  cardBackgroundColor: 'bg-slate-900',
  borderColor: 'border-emerald-900/80',

  // Narrative Paragraph Spacing
  paragraphMargin: 'my-4',
  blockquoteStyle: 'my-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-emerald-950/80 border border-amber-500/30 rounded-2xl text-amber-200 font-serif italic text-sm sm:text-base shadow-inner leading-relaxed',

  // Navigation Settings
  relatedArticlesCount: 4,
};
