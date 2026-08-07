export interface TickerNewsItem {
  id: string;
  type: 'news';
  text: string;
}

export interface TickerReviewItem {
  id: string;
  type: 'review';
  flag: string;
  name: string;
  text: string;
  isFulfilled: boolean;
}

export type TickerItem = TickerNewsItem | TickerReviewItem;

export const TICKER_ITEMS: TickerItem[] = [
  { id: 't1', type: 'news', text: '📢 إطلاق الإصدار الحديث 2026 لموسوعة تفسير الأحلام الشاملة بالذكاء الاصطناعي وفق المنهاج الشرعي.' },
  { id: 't2', type: 'news', text: '📘 متوفر الآن: كتاب "تأويلات روحية لفهم المشاهدات المنامية" طبعة 2026 الموثقة للشيخ د. أحمد الشريف.' },
  { id: 't3', type: 'review', flag: '🇦🇪', name: 'رانيم', text: 'اللي فسرته لي صار لي بالظبط شكراً لك 🥰🥰', isFulfilled: true },
  { id: 't4', type: 'news', text: '🎙️ استشارات مباشرة: تقديم تفسير الرؤى والأحلام كتابة وصوتاً بخصوصية وسرية تامة.' },
  { id: 't5', type: 'review', flag: '🇮🇶', name: 'أم يوسف (العراق)', text: 'تفسيرك جدا دقيق وانسان متواضع جداً والكثير متفقين على تجربتك الممتازة.', isFulfilled: true },
  { id: 't6', type: 'news', text: '⭐ بفضل الله وحمده: تقييمات موثقة وآراء طيبة حقيقية من المستفيدين في مختلف الدول العربية.' },
  { id: 't7', type: 'review', flag: '🇸🇦', name: 'أبو فهد', text: 'افضل مفسر أحلام.. صادق جداً بتفسيرك ربي يوفقك ويزيدك من فضله.', isFulfilled: false },
  { id: 't8', type: 'news', text: '🕋 جديد المكتبة الإيمانية: القرآن الكريم كاملاً بصوت كبار القراء ومواقيت الصلاة الدقيقة.' },
  { id: 't9', type: 'review', flag: '🇰🇼', name: 'أم عبد الله', text: 'امانه امور معينه قلتها وقلت مستحيل لكن تفسيرك دقيق جدا لمن تحققت 👌', isFulfilled: true },
  { id: 't10', type: 'news', text: '💎 خدمات كبار الشخصيات VIP: أولوية التعبير الفوري والمتابعة المباشرة مع الشيخ أحمد الشريف.' },
  { id: 't11', type: 'review', flag: '🇪🇬', name: 'أحمد كيمو', text: 'ماشاء الله عليك مفسر فاهم وتفسيرك صحيح 100% ربنا ينفع بيك.', isFulfilled: true },
  { id: 't12', type: 'review', flag: '🇯🇴', name: 'دعاء أبو سيدين', text: 'تفسيرك لحلمي طلع صح 100/100 وحدث ذلك بالظبط!', isFulfilled: true },
];
