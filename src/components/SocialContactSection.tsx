import React from 'react';
import { ExternalLink, MessageSquareText } from 'lucide-react';
import { OFFICIAL_SOCIAL_PLATFORMS } from '../config/socialLinks';
import {
  FacebookIcon,
  InstagramIcon,
  ThreadsIcon,
  SnapchatIcon,
  TikTokIcon,
  LineIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from './SocialIcons';

export const SocialContactSection: React.FC = () => {
  const getPlatformIcon = (id: string) => {
    const iconClass = "w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110";
    switch (id) {
      case 'facebook':
        return <FacebookIcon className={`${iconClass} text-blue-400`} />;
      case 'instagram':
        return <InstagramIcon className={`${iconClass} text-pink-400`} />;
      case 'threads':
        return <ThreadsIcon className={`${iconClass} text-slate-300`} />;
      case 'snapchat':
        return <SnapchatIcon className={`${iconClass} text-yellow-400`} />;
      case 'tiktok':
        return <TikTokIcon className={`${iconClass} text-teal-300`} />;
      case 'line':
        return <LineIcon className={`${iconClass} text-emerald-400`} />;
      case 'youtube':
        return <YouTubeIcon className={`${iconClass} text-red-500`} />;
      case 'whatsapp':
        return <WhatsAppIcon className={`${iconClass} text-emerald-400`} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  return (
    <div className="w-full bg-slate-950/80 border-y border-emerald-900/50 py-10 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-emerald-950/80 to-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full text-amber-300 text-xs font-bold shadow-inner">
            <MessageSquareText className="w-3.5 h-3.5 text-amber-400" />
            <span>قنوات التواصل الرسمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            تابع ExplainingDream وتواصل معنا
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            انضم إلى مجتمعنا الرسمي عبر كافة شبكات التواصل الاجتماعي للحصول على مقتطفات التأويل، التحديثات الروحية اليومية، والاستشارات المباشرة.
          </p>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {OFFICIAL_SOCIAL_PLATFORMS.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`زيارة حساب منصة ${platform.nameAr} (${platform.handle})`}
              title={`زيارة حساب ${platform.nameAr} - ${platform.handle}`}
              className="group relative flex items-center gap-3 bg-slate-900/90 hover:bg-slate-900 border border-emerald-900/70 hover:border-amber-400/60 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] min-h-[52px] overflow-hidden"
            >
              {/* Subtle accent backdrop glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${platform.badgeColor} opacity-0 group-hover:opacity-5 transition duration-300 pointer-events-none`} />

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-amber-500/40 transition">
                {getPlatformIcon(platform.id)}
              </div>

              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-100 text-xs sm:text-sm group-hover:text-amber-300 transition truncate">
                    {platform.nameAr}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden xl:inline font-mono">
                    {platform.name}
                  </span>
                </div>
                <span className="block text-[11px] sm:text-xs text-amber-400/90 font-mono truncate tracking-tight">
                  {platform.handle}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
};
