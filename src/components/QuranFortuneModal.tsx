import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, BookOpen, Heart, Volume2, X } from 'lucide-react';
import { QuranFortuneVerse, getRandomFortuneVerse, QURANIC_FORTUNE_VERSES } from '../data/asmaAllahData';
import { playDoveCooingSound } from '../utils/spiritualAudioEngine';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface QuranFortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuranFortuneModal: React.FC<QuranFortuneModalProps> = ({ isOpen, onClose }) => {
  const [currentVerse, setCurrentVerse] = useState<QuranFortuneVerse>(getRandomFortuneVerse());
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Generate a fresh random verse on open or on demand
  useEffect(() => {
    if (isOpen) {
      const verse = getRandomFortuneVerse();
      setCurrentVerse(verse);
      playDoveCooingSound(0.08);
    }
  }, [isOpen]);

  const handleNextVerse = () => {
    setIsRotating(true);
    playDoveCooingSound(0.1);
    setTimeout(() => {
      // Pick a different verse from array
      let nextVerse = getRandomFortuneVerse();
      while (nextVerse.id === currentVerse.id && QURANIC_FORTUNE_VERSES.length > 1) {
        nextVerse = getRandomFortuneVerse();
      }
      setCurrentVerse(nextVerse);
      setIsRotating(false);
    }, 250);
  };

  const handleCopy = async () => {
    const textToCopy = `✨ [رسالة قرآنية مباركة من موقع تأويلات روحية]\n\nالآية الكريمة: (${currentVerse.text}) - ${currentVerse.surah} [آية ${currentVerse.ayahNumber}]\n\nنور الآية وبشارتها لك: ${currentVerse.spiritualMessage}\n\nالنصيحة الروحية: ${currentVerse.actionableAdvice}`;
    await safeCopyToClipboard(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl" dir="rtl">
      
      {/* Modal Card Box */}
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-right overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
                رسالتك القرآنية ونفحتك اليومية 🔮✨
              </h3>
              <p className="text-[11px] text-slate-400 font-serif">
                آية استبشار ونور إلهي تتجدد في كل دخول لتنير قلبك وتيسر أمرك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-amber-300 border border-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verse Category Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold font-serif border ${currentVerse.typeBadgeColor}`}>
            {currentVerse.typeLabel}
          </span>
          <span className="text-xs text-amber-400 font-serif font-bold">
            {currentVerse.surah} – آية ({currentVerse.ayahNumber})
          </span>
        </div>

        {/* Main Verse Box */}
        <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 shadow-inner transition-all duration-300 ${
          isRotating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="text-xs text-amber-400/80 font-serif">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          
          <blockquote className="text-xl sm:text-2xl font-bold text-amber-200 font-serif leading-relaxed px-2">
            "{currentVerse.text}"
          </blockquote>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </div>

        {/* Spiritual Message & Actionable Advice */}
        <div className={`space-y-3 transition-all duration-300 ${isRotating ? 'opacity-30' : 'opacity-100'}`}>
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl space-y-1">
            <h4 className="text-xs font-bold text-emerald-300 font-serif flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
              <span>نور الآية وبشارتها لك اليوم:</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
              {currentVerse.spiritualMessage}
            </p>
          </div>

          <div className="bg-amber-950/30 border border-amber-800/50 p-3.5 rounded-2xl space-y-1">
            <h4 className="text-xs font-bold text-amber-400 font-serif flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>توجيه روحاني مستحب:</span>
            </h4>
            <p className="text-xs text-slate-300 font-serif">
              {currentVerse.actionableAdvice}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-900/60">
          
          {/* Re-roll Verse Button */}
          <button
            onClick={handleNextVerse}
            disabled={isRotating}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-serif text-xs px-4 py-3 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 border border-amber-300"
          >
            <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            <span>استبشِر بآية مباركة أخرى 🔮</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="bg-slate-950 hover:bg-slate-800 border border-emerald-800 text-amber-300 px-4 py-3 rounded-2xl text-xs font-bold font-serif transition cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ' : 'مشاركة الآية'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
