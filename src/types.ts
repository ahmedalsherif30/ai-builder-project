export type DreamerGender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'pregnant';
export type TimeOfDay = 'night' | 'dawn' | 'afternoon' | 'evening';
export type DreamMood = 'peaceful' | 'anxious' | 'confused' | 'fearful' | 'joyful';

export interface DreamInterpretationRequest {
  dreamText: string;
  clientName?: string;
  clientPhone?: string;
  gender?: DreamerGender;
  maritalStatus?: MaritalStatus;
  hasIstikhara?: boolean;
  timeOfDay?: TimeOfDay;
  mood?: DreamMood;
  ageGroup?: string;
  isRecurring?: boolean;
}

export interface DreamSymbolBreakdown {
  symbol: string;
  meaning: string;
  quranReference?: string;
  hadithReference?: string;
}

export interface DreamInterpretationResponse {
  id: string;
  summary: string;
  overallInterpretation: string;
  symbolsBreakdown: DreamSymbolBreakdown[];
  spiritualAspect: string;
  psychologicalContext: string;
  methodologyNote: string;
  recommendedAdhkar: string[];
  quranicVerses: string[];
  actionableAdvice: string;
  requiresPersonalConsultation: boolean;
  timestamp: string;
}

export interface DreamSymbol {
  id: string;
  title: string;
  letter: string;
  category: string;
  briefMeaning: string;
  detailedInterpretation: string;
  spiritualContext: string;
  quranicProof?: string;
  keywords: string[];
  viewsCount: number;
}

export interface PersonalVisionEntry {
  id: string;
  title: string;
  dreamText: string;
  date: string;
  status: 'pending' | 'interpreted' | 'fulfilled' | 'symbolic';
  aiResponse?: DreamInterpretationResponse;
  expertNotes?: string;
  mood: DreamMood;
  isPrivate: boolean;
  tags: string[];
  fulfillmentNotes?: string;
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleSeoData {
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[];
  imageAlt: string;
  imageCaption: string;
  internalLinks: { title: string; slug: string }[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
  views: number;
  featured?: boolean;
  commentsCount: number;
  bookChapterReference?: string;
  faqs?: ArticleFAQ[];
  seo?: ArticleSeoData;
}

export interface ServicePackage {
  id: string;
  title: string;
  subtitle: string;
  type: 'written' | 'audio' | 'session' | 'vip';
  price: number;
  originalPrice?: number;
  currency: string;
  features: string[];
  deliveryTime: string;
  badge?: string;
  popular?: boolean;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dreamText: string;
  maritalStatus: MaritalStatus;
  amountPaid: number;
  couponCode?: string;
  status: 'pending' | 'received' | 'in_review' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
  deliveryType: 'written' | 'audio' | 'session' | 'vip';
  scheduledSessionDate?: string;
  audioUrl?: string;
  writtenReply?: string;
  paymentReceiptUrl?: string;
  paymentReceiptNote?: string;
  receiptUploadedAt?: string;
  adminConfirmNote?: string;
}

export interface BookChapter {
  id: number;
  title: string;
  subtitle: string;
  previewContent: string;
  pageNumber: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  audio?: string;
}

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  city: string;
  dateHijri: string;
  dateGregorian: string;
  qiblaDegrees: number;
}

export interface DhikrItem {
  id: string;
  category: 'sabah' | 'masaa' | 'sleep' | 'waking';
  text: string;
  count: number;
  currentCount: number;
  benefit: string;
  source: string;
}

export interface SubmittedDreamRecord {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  gender: DreamerGender;
  maritalStatus: MaritalStatus;
  dreamText: string;
  status: 'unread' | 'seen' | 'replied';
  createdAt: string;
  aiResponseSummary?: string;
  expertReply?: string;
  source: 'ai_interpreter' | 'paid_service' | 'journal';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  gender?: DreamerGender;
  maritalStatus?: MaritalStatus;
  role: 'free' | 'vip' | 'admin' | 'member';
  vipExpiryDate?: string;
  notificationsEnabled: boolean;
  savedDreamCount: number;
  balanceCredits: number;
  provider?: 'google' | 'facebook' | 'direct';
  referralCode?: string;
  referralCount?: number;
  bonusDreamsEarned?: number;
}

export interface ReferralFriendLog {
  friendName: string;
  friendEmail?: string;
  joinedAt: string;
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  bonusDreamsEarned: number;
  nextRewardProgress: number;
  friendsNeededForNextFreeDream: number;
  referralLogs: ReferralFriendLog[];
}

export interface PrepaidGiftCode {
  id: string;
  code: string;
  purchaserName: string;
  purchaserEmail: string;
  serviceType: 'written' | 'audio' | 'session' | 'vip' | 'free_dream';
  serviceTitle: string;
  amountPaid: number;
  status: 'active' | 'redeemed' | 'expired';
  redeemedByFriendName?: string;
  redeemedByFriendEmail?: string;
  redeemedAt?: string;
  createdAt: string;
  recipientNote?: string;
}

export interface CouponCode {
  code: string;
  discountPercentage: number;
  description: string;
  validUntil: string;
}

export interface SiteSettings {
  siteName: string;
  sheikhName: string;
  heroTitle: string;
  heroSubtitle: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  isMaintenanceMode: boolean;
  whatsappLink: string;
  writtenServicePrice: number;
  audioServicePrice: number;
  sessionServicePrice: number;
  vipMonthlyPrice: number;
  bookPdfPrice: number;
  bookPrintPrice: number;
  activeCouponCode: string;
  discountPercentage: number;
  vodafoneCashNumber?: string;
  instapayUsername?: string;
  bankIbanDetails?: string;
  paypalEmail?: string;
  westernUnionInfo?: string;
  supportPhone?: string;
  supportEmail?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: DreamerGender;
  maritalStatus: MaritalStatus;
  role: 'free' | 'vip' | 'admin' | 'member';
  planName: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  dreamsSubmittedCount: number;
  totalSpentUsd: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'blocked' | 'pending';
  createdAt: string;
  lastActive: string;
  lastEnteredDream?: string;
  ordersHistory?: ServiceOrder[];
  submittedDreams?: SubmittedDreamRecord[];
  pendingOrdersCount?: number;
}

export interface ActivityLog {
  id: string;
  type: 'dream_submitted' | 'symbol_searched' | 'service_purchased' | 'user_joined' | 'subscription_renewed';
  user: string;
  details: string;
  timestamp: string;
  meta?: any;
}
