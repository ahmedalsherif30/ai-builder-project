import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, MessageSquareText } from 'lucide-react';
import { OFFICIAL_SOCIAL_PLATFORMS, OFFICIAL_CONTACT_CHANNELS } from '../config/socialLinks';
import {
  InstagramIcon,
  ThreadsIcon,
  SnapchatIcon,
  PinterestIcon,
  TikTokIcon,
  LineIcon,
  LinkedInIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from './SocialIcons';

export const SocialContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const getPlatformIcon = (id: string) => {
    const iconClass = "w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110";
    switch (id) {
      case 'instagram':
        return <InstagramIcon className={`${iconClass} text-pink-400`} />;
      case 'threads':
        return <ThreadsIcon className={`${iconClass} text-slate-300`} />;
      case 'snapchat':
        return <SnapchatIcon className={`${iconClass} text-yellow-400`} />;
      case 'pinterest':
        return <PinterestIcon className={`${iconClass} text-rose-500`} />;
      case 'tiktok':
        return <TikTokIcon className={`${iconClass} text-teal-300`} />;
      case 'line':
        return <LineIcon className={`${iconClass} text-emerald-400`} />;
      case 'linkedin':
        return <LinkedInIcon className={`${iconClass} text-blue-400`} />;
      case 'youtube':
        return <YouTubeIcon className={`${iconClass} text-red-500`} />;
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

        {/* Direct Contact Cards (WhatsApp & Email) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* WhatsApp Direct Chat Card */}
          <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <span>تواصل مباشر عبر واتساب</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-sans">متاح الآن</span>
                </h3>
                <p className="text-xs text-slate-300">
                  للاستفسارات العاجلة ومتابعة الطلبات المباشرة:
                  <span className="text-emerald-300 font-mono font-bold mr-1 dir-ltr inline-block">
                    {OFFICIAL_CONTACT_CHANNELS.whatsapp.displayText}
                  </span>
                </p>
              </div>
            </div>

            <a
              href={OFFICIAL_CONTACT_CHANNELS.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل مع الدعم المباشر عبر واتساب"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 whitespace-nowrap active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>محادثة واتساب المباشرة</span>
            </a>
          </div>

          {/* Official Email Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                  البريد الإلكتروني الرسمي
                </h3>
                <p className="text-xs text-amber-300/90 font-mono select-all font-bold">
                  {OFFICIAL_CONTACT_CHANNELS.email.primary.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleCopyEmail(OFFICIAL_CONTACT_CHANNELS.email.primary.email)}
                className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                title="نسخ البريد الإلكتروني"
              >
                {copiedEmail === OFFICIAL_CONTACT_CHANNELS.email.primary.email ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              <a
                href={OFFICIAL_CONTACT_CHANNELS.email.primary.url}
                className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 whitespace-nowrap active:scale-[0.98]"
                aria-label="راسلنا عبر البريد الإلكتروني"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>راسلنا الآن</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
