import React from 'react';
import { MessageSquare, Crown, Sparkles, Smartphone, Gift, Compass, Share2 } from 'lucide-react';

interface FloatingCtaBarProps {
  onNavigateToServices: () => void;
  onNavigateToVip: () => void;
  onOpenRewards: () => void;
  onOpenTour?: () => void;
  onOpenShareRewards?: () => void;
}

export const FloatingCtaBar: React.FC<FloatingCtaBarProps> = React.memo(({
  onNavigateToServices,
  onNavigateToVip,
  onOpenRewards,
  onOpenTour,
  onOpenShareRewards,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-500/40 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Info / Pitch */}
        <div className="flex items-center gap-2.5 text-slate-200">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-xs sm:text-sm font-serif">
            <p className="font-bold text-amber-300 text-xs sm:text-sm">
              هل تريد تفسيراً مؤكداً لرؤياك من أحمد الشريف؟
            </p>
            <p className="text-xs text-slate-300 hidden sm:block">
              تفسير كتابي أو صوتي خاص | دعم المحفظة الإلكترونية وإنستا باي والدفع المباشر
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
              title="دليل واستكشاف الموقع"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline">الجولة الإرشادية</span>
            </button>
          )}

          <button
            onClick={onOpenRewards}
            className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-800 text-amber-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>المكافآت</span>
          </button>

          <button
            onClick={onNavigateToVip}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>العضوية VIP</span>
          </button>

          <button
            onClick={onNavigateToServices}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold px-4.5 py-2 rounded-xl text-xs sm:text-sm shadow-lg transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>احصل على تفسير احترافي الآن</span>
          </button>
        </div>

      </div>
    </div>
  );
});
