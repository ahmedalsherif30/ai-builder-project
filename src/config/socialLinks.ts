export interface SocialPlatformConfig {
  id: string;
  name: string;
  nameAr: string;
  handle: string;
  url: string;
  badgeColor?: string;
  category?: 'social' | 'contact';
}

export const OFFICIAL_SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    nameAr: 'إنستغرام',
    handle: '@explainingdreams',
    url: 'https://www.instagram.com/explainingdreams',
    badgeColor: 'from-fuchsia-600 via-pink-600 to-amber-500',
    category: 'social',
  },
  {
    id: 'threads',
    name: 'Threads',
    nameAr: 'ثريدز',
    handle: '@explainingdreams',
    url: 'https://www.threads.net/@explainingdreams',
    badgeColor: 'from-slate-700 to-slate-900',
    category: 'social',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    nameAr: 'سناب شات',
    handle: '@explainingdream',
    url: 'https://www.snapchat.com/add/explainingdream',
    badgeColor: 'from-yellow-500 to-amber-600',
    category: 'social',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    nameAr: 'بينتريست',
    handle: '@explainingdreams',
    url: 'https://www.pinterest.com/explainingdreams',
    badgeColor: 'from-red-600 to-rose-700',
    category: 'social',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    nameAr: 'تيك توك',
    handle: '@explainingdreams',
    url: 'https://www.tiktok.com/@explainingdreams',
    badgeColor: 'from-cyan-900 via-slate-900 to-pink-950',
    category: 'social',
  },
  {
    id: 'line',
    name: 'LINE',
    nameAr: 'لاين',
    handle: 'explainingdreams',
    url: 'https://line.me/ti/p/~explainingdreams',
    badgeColor: 'from-emerald-500 to-green-600',
    category: 'social',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    nameAr: 'لينكد إن',
    handle: 'explainingdreams',
    url: 'https://www.linkedin.com/company/explainingdreams',
    badgeColor: 'from-blue-600 to-indigo-700',
    category: 'social',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    nameAr: 'يوتيوب',
    handle: '@explainingdreams',
    url: 'https://www.youtube.com/@explainingdreams',
    badgeColor: 'from-red-600 to-red-700',
    category: 'social',
  },
];

export const OFFICIAL_CONTACT_CHANNELS = {
  whatsapp: {
    name: 'WhatsApp',
    nameAr: 'محادثة واتساب المباشرة',
    number: '+201558955525',
    url: 'https://wa.me/201558955525',
    displayText: '+20 155 895 5525',
  },
  email: {
    primary: {
      name: 'البريد الرسمي العام',
      email: 'info@explainingdream.com',
      url: 'mailto:info@explainingdream.com',
    },
    directAdmin: {
      name: 'بريد الإدارة المباشر',
      email: 'ahmedalsherif30@gmail.com',
      url: 'mailto:ahmedalsherif30@gmail.com',
    },
  },
};
