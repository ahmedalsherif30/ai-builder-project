// Test GitHub Sync
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { AudioPrayerController } from './components/AudioPrayerController';
import { HeroSection } from './components/HeroSection';
import { AiDreamInterpreter } from './components/AiDreamInterpreter';
import { BookShowcase, IslamicToolsStrip } from './components/BookShowcase';
import { PaidServicesSection } from './components/PaidServicesSection';
import { HomeArticlesStrip } from './components/HomeArticlesStrip';
import { FloatingCtaBar } from './components/FloatingCtaBar';
import { FloatingRegisterPrompt } from './components/FloatingRegisterPrompt';
import { Footer } from './components/Footer';
import { AntiScreenshotProtection } from './components/AntiScreenshotProtection';
import { CustomerJourney6Steps } from './components/CustomerJourney6Steps';
import { PersonalVisionEntry, UserProfile } from './types';
import { isAdminUser } from './utils/authUtils';

// Lazy-loaded heavy components and modals for code splitting and ultra-fast initial load
const DreamEncyclopedia = lazy(() => import('./components/DreamEncyclopedia').then(m => ({ default: m.DreamEncyclopedia })));
const PersonalVisionsJournal = lazy(() => import('./components/PersonalVisionsJournal').then(m => ({ default: m.PersonalVisionsJournal })));
const IslamicLibrary = lazy(() => import('./components/IslamicLibrary').then(m => ({ default: m.IslamicLibrary })));
const VipMembershipSection = lazy(() => import('./components/VipMembershipSection').then(m => ({ default: m.VipMembershipSection })));
const ArticlesSection = lazy(() => import('./components/ArticlesSection').then(m => ({ default: m.ArticlesSection })));
const MasterSrsViewer = lazy(() => import('./components/MasterSrsViewer').then(m => ({ default: m.MasterSrsViewer })));
const AdminDashboardModal = lazy(() => import('./components/AdminDashboardModal').then(m => ({ default: m.AdminDashboardModal })));
const StartHereSection = lazy(() => import('./components/StartHereSection').then(m => ({ default: m.StartHereSection })));
const AboutUsSection = lazy(() => import('./components/AboutUsSection').then(m => ({ default: m.AboutUsSection })));
const RewardsPointsModal = lazy(() => import('./components/RewardsPointsModal').then(m => ({ default: m.RewardsPointsModal })));
const SubscribeChannelModal = lazy(() => import('./components/SubscribeChannelModal').then(m => ({ default: m.SubscribeChannelModal })));
const GuidedTourModal = lazy(() => import('./components/GuidedTourModal').then(m => ({ default: m.GuidedTourModal })));
const UserAuthModal = lazy(() => import('./components/UserAuthModal').then(m => ({ default: m.UserAuthModal })));
const ClientDashboardModal = lazy(() => import('./components/ClientDashboardModal').then(m => ({ default: m.ClientDashboardModal })));
const ShareAndRewardsModal = lazy(() => import('./components/ShareAndRewardsModal').then(m => ({ default: m.ShareAndRewardsModal })));
const ClientReviewsSection = lazy(() => import('./components/ClientReviewsSection').then(m => ({ default: m.ClientReviewsSection })));
const SpiritualNewsletterDigestModal = lazy(() => import('./components/SpiritualNewsletterDigestModal').then(m => ({ default: m.SpiritualNewsletterDigestModal })));

const SectionFallback = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3 text-amber-400">
    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-bold font-serif text-slate-400">جاري تحميل المحتوى...</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sharedDreamText, setSharedDreamText] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClientDashboardOpen, setIsClientDashboardOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isShareRewardsOpen, setIsShareRewardsOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string>('');
  const [referralWelcomeMsg, setReferralWelcomeMsg] = useState<string>('');
  const [isNewsletterDigestOpen, setIsNewsletterDigestOpen] = useState(false);
  const [newsletterDigestData, setNewsletterDigestData] = useState<{
    code?: string;
    contact?: string;
    digest?: any;
  }>({});

  const handleOpenNewsletterDigest = useCallback((data?: { code?: string; contact?: string; digest?: any }) => {
    if (data) {
      setNewsletterDigestData(data);
    } else {
      fetch('/api/newsletter/digest')
        .then(res => res.json())
        .then(resData => {
          if (resData.success) {
            setNewsletterDigestData(prev => ({ ...prev, digest: resData.digest }));
          }
        })
        .catch(err => console.error('Error fetching digest:', err));
    }
    setIsNewsletterDigestOpen(true);
  }, []);

  useEffect(() => {
    // Check URL parameters for referral code
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralWelcomeMsg(`🎉 أهلاً بك! لقد انضممت عبر كود إحالة صديقك (${refCode}). تم تسجيل انضمامك وفتح مكافآتك!`);
      fetch('/api/client/process-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refCode,
          friendName: 'زائر جديد عبر الإحالة',
          friendEmail: ''
        })
      }).catch(err => console.error('Referral process error:', err));
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setGlobalSearchQuery(query);
    setActiveTab('dictionary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Client User Profile state initialized from localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('explaining_dreams_user_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {
      console.error('Failed to load user profile from localStorage', e);
    }
    return {
      id: 'user-client-1',
      name: 'عضو المنصة (العميل)',
      email: 'client@explainingdream.com',
      role: 'member',
      notificationsEnabled: true,
      savedDreamCount: 0,
      balanceCredits: 3,
    };
  });

  // Sync user profile to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user && user.email) {
        localStorage.setItem('explaining_dreams_user_2026', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to save user profile to localStorage', e);
    }
  }, [user]);

  // Personal Visions Journal entries loaded from LocalStorage
  const [journalEntries, setJournalEntries] = useState<PersonalVisionEntry[]>(() => {
    try {
      const saved = localStorage.getItem('explaining_dreams_journal_2026');
      if (saved) {
        const parsed: PersonalVisionEntry[] = JSON.parse(saved);
        // Filter out any leftover initial mock seed entry if user did not create it
        return parsed.filter(e => e.id !== 'journal-seed-1');
      }
    } catch (e) {
      console.error('Failed to load journal entries from localStorage', e);
    }
    return [];
  });

  // Keep savedDreamCount in user profile synced with journalEntries count
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      savedDreamCount: journalEntries.length,
    }));
  }, [journalEntries.length]);

  // Save journal entries to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('explaining_dreams_journal_2026', JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  }, [journalEntries]);

  // Handler: Save entry from AI or Manual
  const handleAddJournalEntry = useCallback((entry: Omit<PersonalVisionEntry, 'id'>) => {
    const newEntry: PersonalVisionEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  }, []);

  const handleUpdateJournalEntry = useCallback((id: string, updated: Partial<PersonalVisionEntry>) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  }, []);

  const handleDeleteJournalEntry = useCallback((id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Navigators
  const handleStartInterpretationFromHero = useCallback((text: string) => {
    setSharedDreamText(text);
    setActiveTab('ai-interpreter');
  }, []);

  const handleNavigateToPaidServices = useCallback((text: string) => {
    setSharedDreamText(text);
    setActiveTab('services');
  }, []);

  return (
    <div className="min-h-screen bg-black bg-islamic-stars text-amber-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black dir-rtl pb-16" dir="rtl">
      
      {/* Client Anti-Screenshot & Content Security Protection */}
      <AntiScreenshotProtection isAdmin={isAdminUser(user)} />

      {/* Audio & Prayer Times Controller */}
      <AudioPrayerController
        onOpenIslamicTools={() => setActiveTab('islamic-tools')}
        onNewsClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 1200, behavior: 'smooth' });
        }}
      />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        setIsAdminOpen={setIsAdminOpen}
        savedDreamCount={journalEntries.length}
        onSearch={handleSearch}
        initialSearchQuery={globalSearchQuery}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenAuth={() => {
          setAuthReason('قم بتسجيل دخولك وحفظ بياناتك للوصول لسجل أحلامك المفسرة واستشاراتك الخاصة');
          setIsAuthOpen(true);
        }}
        onOpenClientDashboard={() => setIsClientDashboardOpen(true)}
        onOpenShareRewards={() => setIsShareRewardsOpen(true)}
        onOpenNewsletterDigest={() => handleOpenNewsletterDigest()}
      />

      {/* Referral Welcome Notification Banner */}
      {referralWelcomeMsg && (
        <div className="bg-gradient-to-r from-emerald-950 via-amber-950 to-emerald-950 border-b border-amber-500/50 p-3 text-center text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-2 animate-fade-in shadow-lg">
          <span>{referralWelcomeMsg}</span>
          <button
            onClick={() => setReferralWelcomeMsg('')}
            className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-xs px-2 py-0.5 rounded-md cursor-pointer border border-amber-500/40 mr-2"
          >
            إغلاق ✕
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        <Suspense fallback={<SectionFallback />}>
          {activeTab === 'home' && (
            <div className="space-y-16">
              {/* 1. Hero Hub: Primary AI Interpreter & Direct Interaction */}
              <HeroSection
                onStartInterpretation={handleStartInterpretationFromHero}
                setActiveTab={setActiveTab}
                onSearch={handleSearch}
                onOpenTour={() => setIsTourOpen(true)}
                user={user}
                journalCount={journalEntries.length}
                onOpenClientDashboard={() => setIsClientDashboardOpen(true)}
                onOpenAuth={() => {
                  setAuthReason('قم بتسجيل دخولك وحفظ بياناتك للوصول لسجل أحلامك المفسرة واستشاراتك الخاصة');
                  setIsAuthOpen(true);
                }}
                onOpenShareRewards={() => setIsShareRewardsOpen(true)}
              />

              {/* 2. Customer Journey: 6 Steps How Platform Works */}
              <CustomerJourney6Steps
                onNavigateToAi={() => setActiveTab('ai-interpreter')}
                onNavigateToAuth={() => {
                  setAuthReason('قم بتسجيل دخولك وحفظ بياناتك للوصول لسجل أحلامك المفسرة واستشاراتك الخاصة');
                  setIsAuthOpen(true);
                }}
                onNavigateToJournal={() => setActiveTab('journal')}
                onNavigateToServices={() => setActiveTab('services')}
                onNavigateToDashboard={() => setIsClientDashboardOpen(true)}
              />

              {/* 3. Flagship Reference Book Showcase */}
              <BookShowcase
                onNavigateToServices={() => setActiveTab('services')}
              />

              {/* 4. Daily Articles & Reference Studies (170 Articles) */}
              <HomeArticlesStrip onNavigateToArticles={() => setActiveTab('articles')} />

              {/* 5. Services & Islamic Tools Section (الخدمات والأدوات الإيمانية المباركة) */}
              <IslamicToolsStrip onNavigateToIslamic={() => setActiveTab('islamic-tools')} />

              {/* 6. Direct Sheikh Consultations & Premium Services */}
              <PaidServicesSection
                initialDreamText={sharedDreamText}
                onOrderSuccess={() => setActiveTab('journal')}
              />

              {/* 7. Single-Row Compact Interactive Client Reviews Section */}
              <ClientReviewsSection onOpenConsultation={() => setActiveTab('services')} />


            </div>
          )}

          {activeTab === 'start-here' && (
            <StartHereSection
              onNavigateToAi={() => setActiveTab('ai-interpreter')}
              onNavigateToServices={() => setActiveTab('services')}
              onNavigateToBook={() => setActiveTab('book')}
              onNavigateToAuth={() => {
                setAuthReason('قم بتسجيل دخولك وحفظ بياناتك للوصول لسجل أحلامك المفسرة واستشاراتك الخاصة');
                setIsAuthOpen(true);
              }}
              onNavigateToJournal={() => setActiveTab('journal')}
              onNavigateToDashboard={() => setIsClientDashboardOpen(true)}
            />
          )}

          {activeTab === 'about-us' && <AboutUsSection />}

          {activeTab === 'ai-interpreter' && (
            <AiDreamInterpreter
              initialDreamText={sharedDreamText}
              onSaveToJournal={handleAddJournalEntry}
              onNavigateToPaidServices={handleNavigateToPaidServices}
              currentUser={user}
              onUpdateUser={setUser}
              onRequireAuth={(reason) => {
                setAuthReason(reason || 'يرجى تسجيل الدخول أو إنشاء حسابك للحصول على مساحتك المبدئية (3 أحلام).');
                setIsAuthOpen(true);
              }}
            />
          )}

          {activeTab === 'dictionary' && (
            <DreamEncyclopedia
              initialSearchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              onSelectSymbolForAi={(symbolTitle) => {
                setSharedDreamText(`رأيت في المنام رمز (${symbolTitle}) وأريد معرفة معناه بدقة.`);
                setActiveTab('ai-interpreter');
              }}
            />
          )}

          {activeTab === 'journal' && (
            <PersonalVisionsJournal
              entries={journalEntries}
              onAddEntry={handleAddJournalEntry}
              onUpdateEntry={handleUpdateJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
              onNavigateToAi={() => setActiveTab('ai-interpreter')}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenClientDashboard={() => setIsClientDashboardOpen(true)}
            />
          )}

          {activeTab === 'book' && (
            <BookShowcase
              onNavigateToServices={() => setActiveTab('services')}
              onNavigateToIslamic={() => setActiveTab('islamic-tools')}
            />
          )}

          {activeTab === 'services' && (
            <PaidServicesSection
              initialDreamText={sharedDreamText}
              onOrderSuccess={() => setActiveTab('journal')}
            />
          )}

          {activeTab === 'islamic-tools' && (
            <IslamicLibrary
              onUnlockFreeDream={() => {
                setUser((prev) => ({
                  ...prev,
                  balanceCredits: (prev.balanceCredits || 0) + 1,
                }));
              }}
            />
          )}

          {activeTab === 'articles' && <ArticlesSection user={user} />}

          {activeTab === 'vip' && (
            <VipMembershipSection
              onUpgradeSuccess={() => {
                setUser((prev) => ({ ...prev, role: 'vip' }));
                alert('مبارك! تم تفعيل عضوية VIP الذهبية بنجاح.');
              }}
            />
          )}

          {activeTab === 'srs' && (
            <MasterSrsViewer onNavigateToTab={(tab) => setActiveTab(tab)} />
          )}
        </Suspense>
      </main>

      {/* Floating CTA Bottom Bar */}
      <FloatingCtaBar
        onNavigateToServices={() => setActiveTab('services')}
        onNavigateToVip={() => setActiveTab('vip')}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenShareRewards={() => setIsShareRewardsOpen(true)}
      />

      {/* Floating First-Visit Registration Badge Prompt */}
      <FloatingRegisterPrompt
        isLoggedIn={Boolean(user && user.email && user.email !== 'client@explainingdream.com')}
        onRegister={() => {
          setAuthReason('إنشاء حساب جديد بالمنصة والحصول على 3 تفسيرات مجانية مع ملفك الروحي الخاص');
          setIsAuthOpen(true);
        }}
      />

      <Suspense fallback={null}>
        {/* Share Website & Referral Rewards Modal */}
        {isShareRewardsOpen && (
          <ShareAndRewardsModal
            isOpen={isShareRewardsOpen}
            onClose={() => setIsShareRewardsOpen(false)}
            currentUser={user}
            onRequireAuth={() => {
              setIsShareRewardsOpen(false);
              setAuthReason('قم بتسجيل الدخول لتتبع عدد الأصدقاء ومكافآتك');
              setIsAuthOpen(true);
            }}
          />
        )}

        {/* Guided Tour Interactive Modal */}
        {isTourOpen && (
          <GuidedTourModal
            isOpen={isTourOpen}
            onClose={() => setIsTourOpen(false)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* User Auth & Data Registration Modal */}
        {isAuthOpen && (
          <UserAuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            requiredActionReason={authReason}
            onSuccessAuth={(loggedUser) => {
              setUser(loggedUser);
              setIsAuthOpen(false);
            }}
          />
        )}

        {/* Rewards Points System Modal */}
        {isRewardsOpen && (
          <RewardsPointsModal
            isOpen={isRewardsOpen}
            onClose={() => setIsRewardsOpen(false)}
            onNavigateToServices={() => setActiveTab('services')}
          />
        )}

        {/* Channel / Newsletter Subscribe Modal */}
        {isSubscribeOpen && (
          <SubscribeChannelModal
            isOpen={isSubscribeOpen}
            onClose={() => setIsSubscribeOpen(false)}
            onOpenDigest={handleOpenNewsletterDigest}
          />
        )}

        {/* Spiritual Newsletter Dynamic News Digest Modal */}
        {isNewsletterDigestOpen && (
          <SpiritualNewsletterDigestModal
            isOpen={isNewsletterDigestOpen}
            onClose={() => setIsNewsletterDigestOpen(false)}
            subscriberCode={newsletterDigestData.code || 'NEWS-2026-X800'}
            subscriberContact={newsletterDigestData.contact || user?.email || ''}
            digestData={newsletterDigestData.digest}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Client Dashboard Modal */}
        {isClientDashboardOpen && (
          <ClientDashboardModal
            isOpen={isClientDashboardOpen}
            onClose={() => setIsClientDashboardOpen(false)}
            currentUser={user}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
            onRequireAuth={() => {
              setIsClientDashboardOpen(false);
              setAuthReason('يرجى تسجيل الدخول أو إنشاء حساب لمتابعة طلباتك وتأكيد إيصال الدفع');
              setIsAuthOpen(true);
            }}
          />
        )}

        {/* Admin Control Panel Modal */}
        {isAdminOpen && (
          <AdminDashboardModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            currentUser={user}
          />
        )}
      </Suspense>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        user={user}
        onOpenNewsletterDigest={handleOpenNewsletterDigest}
      />

    </div>
  );
}
