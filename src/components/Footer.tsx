import React, { useState } from 'react';
import { Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { FAQS } from '../data/mockData';
import { Logo } from './Logo';
import { LegalPoliciesModal } from './LegalPoliciesModal';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAdmin?: () => void;
  user?: UserProfile;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdmin, user }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'refund'>('privacy');

  const openLegal = (tab: 'privacy' | 'terms' | 'refund') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  const handleLinkClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-emerald-900/60 text-slate-300 pt-12 pb-8 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FAQs Accordion */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>الأسئلة الشائعة حول منصة ExplainingDream.com</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              إجابات موثوقة حول كيفية التفسير بالذكاء الاصطناعي واستخدام ملف الرؤى والخدمات الخاصة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="bg-slate-900/80 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-amber-400/50 transition space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-slate-100 text-sm sm:text-base">
                  <span>◆ {faq.question}</span>
                  <span className="text-amber-400 text-lg">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed pt-2.5 border-t border-emerald-900/40 font-serif">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-right">
            <h4 className="text-lg font-bold text-slate-100">
              الاشتراك في النشرة البريدية الروحية
            </h4>
            <p className="text-xs text-slate-300">
              احصل على أحدث المقالات ومقتطفات من كتاب 2026 للشيخ أحمد الشريف مباشرة بريدك.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="أدخل بريدك الإلكتروني..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-slate-950 border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{subscribed ? 'تم الاشتراك!' : 'اشتراك'}</span>
            </button>
          </form>
        </div>

        {/* Links & Brand Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-emerald-900/40 text-sm">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo size="md" />
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              منصة عالمية متخصصة تجمع بين المعرفة الشرعية والذكاء الاصطناعي.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-100 block text-base font-serif">أقسام المنصة:</strong>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>
                <button onClick={() => handleLinkClick('ai-interpreter')} className="hover:text-amber-300 transition cursor-pointer">
                  تفسير الأحلام بالذكاء الاصطناعي
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('dictionary')} className="hover:text-amber-300 transition cursor-pointer">
                  موسوعة تفسير الأحلام بحسب الحروف
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('journal')} className="hover:text-amber-300 transition cursor-pointer">
                  ملف الرؤى الشخصي (السجل المشفر)
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('book')} className="hover:text-amber-300 transition cursor-pointer">
                  كتاب تأويلات روحية 2026
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-100 block text-base font-serif">الأدوات والخدمات:</strong>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-amber-300 transition cursor-pointer">
                  طلب تفسير صوتي / كتابي خاص
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('islamic-tools')} className="hover:text-amber-300 transition cursor-pointer">
                  القرآن الكريم ومواقيت الصلاة
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('vip')} className="hover:text-amber-300 transition cursor-pointer">
                  العضوية الذهبية VIP
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('articles')} className="hover:text-amber-300 transition cursor-pointer">
                  مقالات ومدونة التفسير
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Legal Links */}
        <div className="border-t border-emerald-900/30 pt-6 text-center text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>جميع الحقوق محفوظة © 2026 ExplainingDream.com – أحمد الشريف</span>
          
          <div className="flex items-center gap-4 text-xs font-serif">
            <button onClick={() => openLegal('privacy')} className="hover:text-amber-300 transition cursor-pointer">
              سياسة الخصوصية
            </button>
            <span>•</span>
            <button onClick={() => openLegal('terms')} className="hover:text-amber-300 transition cursor-pointer">
              الشروط والأحكام
            </button>
            <span>•</span>
            <button onClick={() => openLegal('refund')} className="hover:text-amber-300 transition cursor-pointer">
              سياسة الاسترجاع
            </button>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition shadow-sm"
                  title="لوحة التحكم للإدارة"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>لوحة التحكم</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Legal Policies Modal */}
      <LegalPoliciesModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />
    </footer>
  );
};
