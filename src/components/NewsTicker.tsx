import React from 'react';
import { Zap } from 'lucide-react';
import { TICKER_ITEMS } from '../data/tickerData';

interface NewsTickerProps {
  onClick?: () => void;
}

const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

export const NewsTicker: React.FC<NewsTickerProps> = React.memo(({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center relative flex-1 w-full max-w-xl xl:max-w-3xl h-8 sm:h-9 bg-zinc-950/90 border border-amber-500/40 hover:border-amber-400 rounded-full py-0.5 px-2 overflow-hidden shadow-inner group cursor-pointer transition"
      title="أخبار المنصة وآراء المستفيدين - انقر للتفاصيل الكاملة"
      aria-label="أخبار المنصة وآراء المستفيدين"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Static Badge */}
      <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ml-1.5 sm:ml-2 shadow-sm z-10">
        <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0 animate-pulse" />
        <span className="whitespace-nowrap">أخبار وتقييمات</span>
      </div>

      {/* Slow Marquee Container */}
      <div className="overflow-hidden relative w-full flex items-center">
        <div className="animate-ticker-rtl flex items-center gap-8 whitespace-nowrap text-xs text-slate-200 font-serif">
          {tickerItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2 shrink-0 hover:text-amber-300 transition">
              {item.type === 'news' ? (
                <span className="text-amber-200 font-bold flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  {item.text}
                </span>
              ) : (
                <>
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <span>{item.flag}</span>
                    <span>{item.name}:</span>
                  </span>
                  <span className="text-slate-200 font-normal">
                    "{item.text}"
                  </span>
                  {item.isFulfilled && (
                    <span className="bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md font-sans font-bold">
                      ✓ تم التعبير
                    </span>
                  )}
                </>
              )}
              <span className="text-amber-500/40 mr-2">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
