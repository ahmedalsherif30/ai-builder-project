import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, ShieldCheck, Heart, Moon, MessageSquare, Compass, Crown, Search, X, User, Radio } from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';
import { NewsTicker } from './NewsTicker';
import { isAdminUser } from '../utils/authUtils';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  setIsAdminOpen: (open: boolean) => void;
  savedDreamCount: number;
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
  onOpenTour?: () => void;
  onOpenAuth?: () => void;
  onOpenClientDashboard?: () => void;
  onOpenShareRewards?: () => void;
  onOpenNewsletterDigest?: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: Compass },
  { id: 'ai-interpreter', label: 'تفسير بالذكاء الاصطناعي', icon: Sparkles },
  { id: 'dictionary', label: 'موسوعة الأحلام', icon: BookOpen },
  { id: 'journal', label: 'ملف الرؤى الشخصي', icon: Heart },
  { id: 'services', label: 'الخدمات والاستشارات', icon: MessageSquare },
  { id: 'islamic-tools', label: 'القرآن والأدوات', icon: Moon },
] as const;

export const Header: React.FC<HeaderProps> = React.memo(({
  activeTab,
  setActiveTab,
  user,
  setIsAdminOpen,
  savedDreamCount,
  onSearch,
  initialSearchQuery = '',
  onOpenTour,
  onOpenAuth,
  onOpenClientDashboard,
  onOpenShareRewards,
  onOpenNewsletterDigest,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-amber-500/30 text-amber-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
          
          {/* Logo Component with Golden Emblem */}
          <div 
            className="flex items-center cursor-pointer group shrink-0" 
            onClick={() => handleNavClick('home')}
            aria-label="الانتقال إلى الصفحة الرئيسية"
            title="الرئيسية"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('home');
              }
            }}
          >
            <Logo size="md" />
          </div>

          {/* Expanded Search Box Engine in Header */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-full mx-2 sm:mx-4 relative"
            role="search"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="ابحث في القاموس وموسوعة الأحلام وتأويلات أحمد الشريف..."
                aria-label="خانة البحث في موسوعة الأحلام وقاموس الرموز"
                className="w-full bg-slate-900/95 hover:bg-slate-900 border-2 border-amber-500/50 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 text-amber-100 text-xs sm:text-sm md:text-base pl-9 pr-11 py-2 sm:py-2.5 rounded-2xl sm:rounded-full placeholder-slate-400 font-serif transition-all duration-200 outline-none shadow-lg shadow-black/40"
              />
              <button
                type="submit"
                className="absolute right-3 text-amber-400 hover:text-amber-300 cursor-pointer p-1 transition hover:scale-110"
                title="بحث"
                aria-label="زر البحث"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute left-3 text-slate-400 hover:text-amber-300 cursor-pointer p-1 transition hover:scale-110"
                  title="مسح البحث"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Admin Dashboard Quick Access if Admin */}
          {isAdminUser(user) && (
            <div className="hidden lg:flex items-center shrink-0">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-md shrink-0 font-serif"
                title="لوحة الإدارة"
                aria-label="لوحة الإدارة"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>لوحة الإدارة</span>
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Navigation Strip with Balanced, Parallel Single-Row Buttons */}
        <nav className="border-t border-emerald-900/40 py-2 w-full overflow-x-auto lg:overflow-x-visible scrollbar-none">
          <div className="flex flex-nowrap items-center justify-between gap-1 sm:gap-1.5 lg:gap-1.5 xl:gap-2 py-0.5 min-w-max lg:min-w-0 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const badge = item.id === 'journal' ? savedDreamCount : undefined;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs md:text-xs lg:text-[12px] xl:text-sm font-bold font-serif transition-all duration-300 cursor-pointer whitespace-nowrap border group shadow-sm shrink-0 justify-center ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 text-slate-200 hover:text-amber-300 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-all duration-300 ${isActive ? 'text-amber-400' : 'text-emerald-400 group-hover:text-amber-300 group-hover:scale-110'}`} />
                  <span className="transition-all duration-300 group-hover:text-amber-300 whitespace-nowrap">{item.label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full transition-all duration-300 group-hover:bg-amber-400 shrink-0">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Live Holy Quran Radio Button */}
            <a
              href="https://www.holyquranradio.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="انقر للانتقال إلى البث المباشر لإذاعة القرآن الكريم"
              aria-label="إذاعة القرآن الكريم"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs md:text-xs lg:text-[12px] xl:text-sm font-bold font-serif transition-all duration-300 cursor-pointer shadow-sm border bg-slate-900/80 text-amber-300 border-amber-500/50 hover:border-amber-400 hover:bg-slate-800 hover:scale-105 shrink-0 justify-center"
            >
              <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">إذاعة القرآن 📻</span>
            </a>

            {/* Spiritual Newsletter Digest Button */}
            {onOpenNewsletterDigest && (
              <button
                type="button"
                onClick={onOpenNewsletterDigest}
                title="عرض واستلام الملف الإخباري الروحي المعتمد"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs md:text-xs lg:text-[12px] xl:text-sm font-bold font-serif transition-all duration-300 cursor-pointer shadow-sm border bg-emerald-950/80 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-slate-800 shrink-0 justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">النشرة الروحية 🗞️</span>
              </button>
            )}

            {/* User Account & Quota Badge Button */}
            {onOpenClientDashboard ? (
              <button
                onClick={onOpenClientDashboard}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs md:text-xs lg:text-[12px] xl:text-sm font-bold font-serif transition-all duration-300 cursor-pointer shadow-sm border bg-slate-900/80 text-emerald-300 border-emerald-700/60 hover:border-amber-400 hover:bg-slate-800 shrink-0 justify-center"
                title="لوحة تحكم الحساب ورصيد المساحة"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">{user?.name ? user.name : 'عضو المنصة'}</span>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-mono shrink-0">
                  {user?.role === 'admin' || user?.role === 'vip' ? '👑 مفتوح' : `✨ 3/${user?.balanceCredits ?? 3}`}
                </span>
              </button>
            ) : onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs md:text-xs lg:text-[12px] xl:text-sm font-bold font-serif transition-all duration-300 cursor-pointer shadow-sm border bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400 shrink-0 justify-center"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">تسجيل (3 أحلام مجاناً)</span>
              </button>
            )}

            {/* Admin Dashboard Button for Small Screens */}
            {isAdminUser(user) && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-xs md:text-sm font-bold font-serif transition-all duration-300 cursor-pointer shadow-sm border bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shrink-0 justify-center"
                title="لوحة الإدارة"
                aria-label="لوحة الإدارة"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">لوحة الإدارة</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
});

