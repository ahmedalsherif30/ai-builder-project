import React from 'react';
import officialLogoImg from '../assets/images/official_logo_1784988232589.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'emblem-only' | 'emblem-with-side-text';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  variant = 'emblem-with-side-text' 
}) => {
  const sizeMap = {
    sm: { container: 'w-9 h-9', textTitle: 'text-xs', textSub: 'text-[9px]' },
    md: { container: 'w-12 h-12', textTitle: 'text-sm sm:text-base', textSub: 'text-[10px] sm:text-xs' },
    lg: { container: 'w-16 h-16', textTitle: 'text-lg sm:text-xl', textSub: 'text-xs' },
    xl: { container: 'w-24 h-24 sm:w-28 sm:h-28', textTitle: 'text-2xl sm:text-3xl', textSub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Emblem Circle */}
      <div className={`relative ${currentSize.container} shrink-0 rounded-full bg-slate-950 p-0.5 border border-amber-500/70 shadow-lg shadow-amber-500/20 group transition-transform duration-300 hover:scale-105`}>
        {/* Decorative Golden Ring Glow */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-500 opacity-40 blur-sm group-hover:opacity-80 transition duration-300" />
        
        {/* Actual Logo Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img 
            src={officialLogoImg} 
            alt="شعار تفسير الأحلام - أحمد الشريف" 
            className="w-full h-full object-cover rounded-full"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-right font-serif leading-tight">
          <span className={`${currentSize.textTitle} font-extrabold bg-gradient-to-r from-amber-200 via-emerald-100 to-amber-300 bg-clip-text text-transparent tracking-tight transition-all duration-300 group-hover:from-amber-300 group-hover:via-amber-100 group-hover:to-emerald-300 hover:text-amber-300 cursor-pointer`}>
            تفسير الأحلام
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`${currentSize.textSub} font-semibold text-emerald-400 hover:text-amber-300 group-hover:text-amber-300 transition-all duration-300 tracking-wide font-sans cursor-pointer`}>
              أحمد الشريف
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono transition-all duration-300 group-hover:bg-amber-500/40 group-hover:text-amber-200 group-hover:border-amber-400">
              2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

