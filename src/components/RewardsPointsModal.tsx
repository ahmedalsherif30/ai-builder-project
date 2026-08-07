import React, { useState } from 'react';
import { Gift, Share2, Copy, Check, Award, Star, Users, ArrowRight, Sparkles, X } from 'lucide-react';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface RewardsPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToServices: () => void;
}

export const RewardsPointsModal: React.FC<RewardsPointsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToServices,
}) => {
  const [copied, setCopied] = useState(false);
  const [points, setPoints] = useState(150);
  const referralLink = "https://explainingdream.com/?ref=SHERIF2026";

  if (!isOpen) return null;

  const handleCopy = async () => {
    await safeCopyToClipboard(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 font-serif">
              نظام النقاط والمكافآت التشجيعية
            </h3>
            <p className="text-xs text-emerald-400 font-serif">
              اجمع النقاط واستبدلها بخصومات حقيقية على الاستشارات والكتاب
            </p>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-serif block">رصيد نقاطك الحالي</span>
            <div className="text-3xl font-extrabold text-amber-300 font-mono mt-0.5">
              {points} <span className="text-sm font-serif font-normal text-emerald-300">نقطة</span>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[11px] bg-emerald-900 text-emerald-200 border border-emerald-700 px-2.5 py-1 rounded-full font-serif">
              تساوي خصم بقيمة $5 USD
            </span>
          </div>
        </div>

        {/* How to earn points */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200 font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>طرق كسب النقاط الفورية:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif">
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900 flex items-center justify-between">
              <span className="text-slate-300">دعوة صديق جديد للموقع</span>
              <span className="text-amber-400 font-mono font-bold">+100 نقطة</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900 flex items-center justify-between">
              <span className="text-slate-300">تدوين حلم في ملفك الشخصي</span>
              <span className="text-amber-400 font-mono font-bold">+30 نقطة</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900 flex items-center justify-between">
              <span className="text-slate-300">قراءة مقال علمي يومي</span>
              <span className="text-amber-400 font-mono font-bold">+10 نقاط</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900 flex items-center justify-between">
              <span className="text-slate-300">قراءة أذكار الصباح والمساء</span>
              <span className="text-amber-400 font-mono font-bold">+20 نقطة</span>
            </div>
          </div>
        </div>

        {/* Share Referral Link */}
        <div className="space-y-2 pt-2 border-t border-emerald-900/60">
          <label className="block text-xs font-bold text-slate-200 font-serif">
            رابط دعوتك الخاص للاضطلاع بالمكافآت:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-amber-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Direct Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigateToServices();
            }}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold py-3 rounded-xl text-xs hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>استبدل نقاطك بخصم على الاستشارة الآن</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
