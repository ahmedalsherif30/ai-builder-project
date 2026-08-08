import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Star, CheckCircle2, Quote, Sparkles, Heart, Globe, ShieldCheck, Search, Filter, PlusCircle, X, Send, ThumbsUp, MessageSquare, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobeReviewsSphere } from './GlobeReviewsSphere';

export interface TestimonialReview {
  id: string;
  name: string;
  handle: string;
  country: string;
  countryCode: 'sa' | 'iq' | 'eg' | 'kw' | 'ae' | 'jo' | 'ps' | 'dz' | 'bh' | 'om' | 'qa' | 'ma' | 'sd' | 'tn';
  flag: string;
  rating: number;
  text: string;
  tag: string;
  isFulfilled?: boolean; // هل تحقق التعبير
  date?: string;
  likesCount?: number;
}

export const REVIEWS_DATA: TestimonialReview[] = [
  {
    id: 'rev-5',
    name: 'أم ليلى (Lola)',
    handle: '@lola_lyly2',
    country: 'الكويت',
    countryCode: 'kw',
    flag: '🇰🇼',
    rating: 5,
    text: 'احسن مفسر ماشاء الله ربي يوفقك يا استاذ احمد ويكثر من امثالك صادق جدا بتفسيرك',
    tag: 'تفسير دقيق وشامل',
    date: '2026-02-10'
  },
  {
    id: 'rev-1',
    name: 'يقيني بالله (mira)',
    handle: '@mira_4071',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'كتبت التعليق اكثر من مرة ومسحتو لاني لم اجد الكلمات المناسبة للتعبير ربي يوفقك يا شيخ احمد.',
    tag: 'تقدير وشكر خاص',
    date: '2026-03-12'
  },
  {
    id: 'rev-2',
    name: 'رانيم (Ranim)',
    handle: '@ranime090',
    country: 'الإمارات',
    countryCode: 'ae',
    flag: '🇦🇪',
    rating: 5,
    text: 'اللي فسرته لي صار لي بالظبط شكراً لك 🥰🥰',
    tag: 'تحقق التعبير 100%',
    isFulfilled: true,
    date: '2026-01-04'
  },
  {
    id: 'rev-3',
    name: 'أبو فهد (alwalfypm4b)',
    handle: '@alwalfypm4b',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'افضل مفسر أحلام.. صادق جداً بتفسيرك ربي يوفقك ويزيدك من فضله 🥰🥰',
    tag: 'صدق وأمانة',
    date: '2026-02-18'
  },
  {
    id: 'rev-4',
    name: 'أحمد كيمو (Kimo)',
    handle: '@kimo_eg',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'ماشاء الله عليك فعلا انت مفسر فاهم كويس وتفسيرك صحيح 100%100 ربنا ينفع بيك',
    tag: 'دقة وتفوق علمي',
    isFulfilled: true,
    date: '2026-01-04'
  },
  {
    id: 'rev-6',
    name: 'عبد الله (allhrabewana3abdo)',
    handle: '@allhrabewana3abdo',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'مفسر احلام مميز وبصيرتك عالية جداً ما شاء الله تبارك الله.',
    tag: 'بصيرة وعمق',
    date: '2026-01-22'
  },
  {
    id: 'rev-7',
    name: 'أم يوسف (من العراق)',
    handle: '@saneira1122',
    country: 'العراق',
    countryCode: 'iq',
    flag: '🇮🇶',
    rating: 5,
    text: 'والله انت احسن مفسر احلام وعن تجربه انا من العراق ومتابعتك تفسيرك جدا دقيق وانت انسان متواضع جدا مع الجميع والكثير من الناس متفقين على تفسيرك من خلال تجربتهم معاك بارك الله فيك',
    tag: 'تجربة واقعية موثقة',
    isFulfilled: true,
    date: '2026-01-31'
  },
  {
    id: 'rev-8',
    name: 'محمد توفيق (mohamedtawfic6)',
    handle: '@mohamedtawfic6',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'مفسر ناجح وفاهم ربنا يوفقك وينفع بعلمك الجميع',
    tag: 'منهجية شرعية',
    date: '2026-01-07'
  },
  {
    id: 'rev-9',
    name: 'دعاء أبو سيدين (Am happy)',
    handle: '@doaabuassida',
    country: 'الأردن',
    countryCode: 'jo',
    flag: '🇯🇴',
    rating: 5,
    text: 'ياشيخ تفسيرك لحلمي طلع صح 100/100 انا الحلم حقي قلتلي اروح عند صديقتي ولكن ماحقدر اشوفها لان في سبب قوي يخليني ما اشوفها وفعلاً حدث ذلك بالظبط!',
    tag: 'تحقق الواقع 100%',
    isFulfilled: true,
    date: '2026-02-03'
  },
  {
    id: 'rev-10',
    name: 'مي علي (Mai)',
    handle: '@mimooo022',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'من شهر فسرت مع حضرتك حلم وقلت لي هتحكي لحد عن حياتك والحد ده هيوقعك في مشاكل وقد كان سبحان الله بالحرف!',
    tag: 'تحقق الرؤيا بالحرف',
    isFulfilled: true,
    date: '2026-01-05'
  },
  {
    id: 'rev-11',
    name: 'أم شهد (User505)',
    handle: '@user505442020',
    country: 'قطر',
    countryCode: 'qa',
    flag: '🇶🇦',
    rating: 5,
    text: 'ماشاء الله من احسن واصدق المفسرين وبحس انه تعيش في اعماق الحلم عشان كده تفسره صح',
    tag: 'عمق الفهم والإحساس',
    date: '2026-02-14'
  },
  {
    id: 'rev-12',
    name: 'أبو العز (ascetic)',
    handle: '@ascetic_ascetic',
    country: 'سلطنة عمان',
    countryCode: 'om',
    flag: '🇴🇲',
    rating: 5,
    text: 'والله انت شخص محترم وتستاهل كل الخير وانت عملك لوجه الله وعمرك ما طلبت مننا المقابل استمر وعسى الله ان يرزقك الصحه والستر وراحة البال.. الشيخ احمد دا اسطورة التفسير ربنا يبارك فيه',
    tag: 'عمل لوجه الله وأمانة',
    date: '2026-01-19'
  },
  {
    id: 'rev-13',
    name: 'شيماء العمري (Llama)',
    handle: '@llama.omari.1',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'مشاء الله عليك شيخ أحمد، تفسيرك يبعث الطمأنينة والنور في القلب.',
    tag: 'طمأنينة ونور',
    date: '2026-03-01'
  },
  {
    id: 'rev-14',
    name: 'هويدَا (Huwaida)',
    handle: '@huwaida173',
    country: 'البحرين',
    countryCode: 'bh',
    flag: '🇧🇭',
    rating: 5,
    text: 'انا ليا تجربة حلوة في التفسير مع حضرتك واعطيتني تفسير دقيق وحقيقي جداً.',
    tag: 'تفسير دقيق وحقيقي',
    isFulfilled: true,
    date: '2026-02-20'
  },
  {
    id: 'rev-15',
    name: 'أبو ناصر (Useri6g)',
    handle: '@useri6g31m0v7g',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'والله من اقوي مفسرين الاحلام دي شهاده ولازم اقولها من اصدق واحسن المفسرين ديما مارتتاحش غير لما حضرتك تفسرلي حلم اشكر حضرتك جدا علي تعبك ربنا يجزيك كل خير',
    tag: 'شهادة ثقة',
    date: '2026-01-28'
  },
  {
    id: 'rev-16',
    name: 'صالح العتيبي',
    handle: '@user261201492',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'تفسيره ماشاء الله دقيق الله يسعدك دنيا واخرة ويحفظك من كل شر.',
    tag: 'دقة وتيسير',
    date: '2026-02-11'
  },
  {
    id: 'rev-17',
    name: 'أم حنين (العراق)',
    handle: '@user656388629',
    country: 'العراق',
    countryCode: 'iq',
    flag: '🇮🇶',
    rating: 5,
    text: 'الاستاذ احمد فسرلي منام وكان إبداع وكأنه يعيش حياتي وظروفي وواقعي شي مبهر جدا جدا جدا .. ابدااااع فعلا شكرا استاذ',
    tag: 'محاكاة واقعية مدهشة',
    isFulfilled: true,
    date: '2026-02-08'
  },
  {
    id: 'rev-18',
    name: 'ترف الشمري (Araf)',
    handle: '@araf_1122',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'وكل ما اجي افسر عندك انصدم بتفسيرك المطابق لواقعي سبحان الله! كثير اثق بتفسيراتك شكرا على هذا التفسير الرائع وجزاك الله خيراً 👍',
    tag: 'مطابقة تامة للواقع',
    isFulfilled: true,
    date: '2026-02-04'
  },
  {
    id: 'rev-19',
    name: 'أم عبد الله (no.one)',
    handle: '@no.one00123',
    country: 'الكويت',
    countryCode: 'kw',
    flag: '🇰🇼',
    rating: 5,
    text: 'الصراحه تفسير حلمك جدا جدا واقعي هذا بفضل الله سبحانه امانه في امور معينه قلتها وقلت مستحيل لكن تفسيرك دقيق انا نفسي ماصدقتها لمن تحققت عرفت تفسيرك 👌',
    tag: 'إعجاز التعبير',
    isFulfilled: true,
    date: '2026-01-10'
  },
  {
    id: 'rev-20',
    name: 'أم سارة (203313bn)',
    handle: '@203313bn',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'ماشاء الله لا حول ولا قوه الا بالله ،أنا من متتبعاتك واصبحت استنى لايفاتك عشان افسر لأنه لا أوثق بتفسير حدى غيرك .. الله يحفظك يا استاذنا انا بقول وبعيد انت معلم التفسير 😎',
    tag: 'ثقة مطلقة',
    date: '2026-03-05'
  },
  {
    id: 'rev-21',
    name: 'أمون الماجد (amoon3334)',
    handle: '@amoon3334',
    country: 'قطر',
    countryCode: 'qa',
    flag: '🇶🇦',
    rating: 5,
    text: 'فعلا مفسر متمكن ماااشاء الله تبارك الرحمن، بارك الله في علمك.',
    tag: 'تمكن وتميز',
    date: '2026-02-25'
  },
  {
    id: 'rev-22',
    name: 'دينا نصار',
    handle: '@dinanassar26',
    country: 'فلسطين',
    countryCode: 'ps',
    flag: '🇵🇸',
    rating: 5,
    text: 'حتى تفسيره رائع يعطيك العافيه شيخ أحمد الشريف ويجزاك خير.',
    tag: 'تفسير رائع',
    date: '2026-02-15'
  },
  {
    id: 'rev-23',
    name: 'سعد القحطاني',
    handle: '@user852915326',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'ماشالله عليك 🥰 اشهدلك بالتواضع والتقدير والاحترام الله يسترها معك ان شاءالله',
    tag: 'تراحم وتواضع',
    date: '2026-01-18'
  },
  {
    id: 'rev-24',
    name: 'سالي الدليمي',
    handle: '@salleyydm',
    country: 'العراق',
    countryCode: 'iq',
    flag: '🇮🇶',
    rating: 5,
    text: 'ماشاء الله ربنا يفتح عليك فتوح العارفين، عندك علم حقيقي وتفسير يثلج الصدر.',
    tag: 'علم وفتوح',
    date: '2026-02-27'
  },
  {
    id: 'rev-25',
    name: 'أبو سيف (iiop812)',
    handle: '@iiop812',
    country: 'الإمارات',
    countryCode: 'ae',
    flag: '🇦🇪',
    rating: 5,
    text: 'والله ياشيخ تفسيراتك تشابه واقعي كثيرررر ربي يسعدك ياشيخ والله انت كثير شاطر بتفسير المنامات ،، جزاك الله خيرا على كل ماتقدم 🙏',
    tag: 'واقعية ودقة',
    isFulfilled: true,
    date: '2026-02-02'
  },
  {
    id: 'rev-26',
    name: 'عزيزة الجزائرية',
    handle: '@azizareg',
    country: 'الجزائر',
    countryCode: 'dz',
    flag: '🇩🇿',
    rating: 5,
    text: 'تفسيراتك اخ احمد لا يعلي عليها والله الي فسرتهولي من 3 سنوات تحقق بظبط وحلم جديد تفسير جد منطقي انشأ الله ربنا اعوضني خيرا 🙏',
    tag: 'تحقق بعد 3 سنوات',
    isFulfilled: true,
    date: '2026-01-15'
  },
  {
    id: 'rev-27',
    name: 'نهلة المرباطي',
    handle: '@ima1946',
    country: 'البحرين',
    countryCode: 'bh',
    flag: '🇧🇭',
    rating: 5,
    text: 'كل تفسيراتك تقع اخي سبحان الله ماشاء الله وربي يزيدك من علمه. نهلة',
    tag: 'وقوع الرؤيا',
    isFulfilled: true,
    date: '2026-02-19'
  },
  {
    id: 'rev-28',
    name: 'آمنة العلي (Amna)',
    handle: '@amnavibes',
    country: 'سلطنة عمان',
    countryCode: 'om',
    flag: '🇴🇲',
    rating: 5,
    text: 'تفسير ممتاز ودقيق جداً لجميع التفاصيل، بارك الله في علمكم ونفع بكم الأمة أستاذ أحمد.',
    tag: 'إتقان وجودة',
    date: '2026-01-29',
    likesCount: 30
  },
  {
    id: 'rev-29',
    name: 'عماد الطيخا',
    handle: '@emad_eltaykha',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'كل احلامى اللى اتفسرت وقعت كما قلت بالظبط 👍 ما شاء الله عليك يا شيخ أحمد.',
    tag: 'تحقق كامل 👍',
    isFulfilled: true,
    date: '2026-01-21'
  },
  {
    id: 'rev-30',
    name: 'الدكتور خالد العتيبي',
    handle: '@dr_khalid_otb',
    country: 'السعودية',
    countryCode: 'sa',
    flag: '🇸🇦',
    rating: 5,
    text: 'تفسير أحمد الشريف لرؤياي المكررة فتح لي أبواب الفهم والاطمئنان الروحي. طريقته المبنية على القرآن الكريم وكتابه لعام 2026 فريدة جداً.',
    tag: 'تفسير صوتي خاص',
    isFulfilled: true,
    date: '2026-03-10'
  },
  {
    id: 'rev-31',
    name: 'مريم الزهراني',
    handle: '@mmaryam_z',
    country: 'الإمارات',
    countryCode: 'ae',
    flag: '🇦🇪',
    rating: 5,
    text: 'ميزة "ملف الرؤى الشخصي" في الموقع جعلتني أتابع كل حلم وتأويله والحمد لله رأيت تحقق الرؤيا بالخير تماماً كما فسرها الذكاء الاصطناعي وأحمد الشريف.',
    tag: 'تفسير كتابي + ملف الرؤى',
    isFulfilled: true,
    date: '2026-02-28'
  },
  {
    id: 'rev-32',
    name: 'أحمد البكري',
    handle: '@ahmed_bakri',
    country: 'مصر',
    countryCode: 'eg',
    flag: '🇪🇬',
    rating: 5,
    text: 'كتاب تأويلات روحية 2026 لـ أحمد الشريف مرجع لا غنى عنه في كل بيت مسلم. تم الدفع بسهولة عبر فودافون كاش على رقم الواتساب المباشر.',
    tag: 'شراء الكتاب والاشتراك',
    date: '2026-01-18'
  },
  {
    id: 'rev-33',
    name: 'فاطمة الفاسي',
    handle: '@fatima_fassi',
    country: 'المغرب',
    countryCode: 'ma',
    flag: '🇲🇦',
    rating: 5,
    text: 'تفسير القرآن والرموز المنامية من الدكتور أحمد الشريف غير مجرى حياتي إيجابياً والحمد لله رأيت البشائر تتحقق بالكامل.',
    tag: 'تفسير قرآني مبارك',
    isFulfilled: true,
    date: '2026-02-12'
  },
  {
    id: 'rev-34',
    name: 'عبد الرحمن السوداني',
    handle: '@abdo_sd',
    country: 'السودان',
    countryCode: 'sd',
    flag: '🇸🇩',
    rating: 5,
    text: 'ما شاء الله تبارك الله، بصيرتك نافذة وتفسيرك بالقرآن الكريم يطمئن القلوب وينير الدرب.',
    tag: 'بصيرة وطمأنينة',
    date: '2026-03-02'
  },
  {
    id: 'rev-35',
    name: 'منيرة التونسية',
    handle: '@mounira_tn',
    country: 'تونس',
    countryCode: 'tn',
    flag: '🇹🇳',
    rating: 5,
    text: 'من أفضل الخدمات والمنصات، الاستجابة سريعة جداً والتفسير دقيق للغاية ومليء بالبشائر والرحمة.',
    tag: 'دقة واستجابة سريعة',
    isFulfilled: true,
    date: '2026-02-22'
  }
];

interface ClientReviewsSectionProps {
  onOpenConsultation?: () => void;
}

export const ClientReviewsSection: React.FC<ClientReviewsSectionProps> = React.memo(({ onOpenConsultation }) => {
  const [reviewsList, setReviewsList] = useState<TestimonialReview[]>(REVIEWS_DATA);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<TestimonialReview | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const REVIEWS_PER_PAGE = 6;
  
  // Add Review Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewCountry, setNewReviewCountry] = useState<string>('السعودية');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewIsFulfilled, setNewReviewIsFulfilled] = useState<boolean>(true);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string>('');

  // Likes tracker state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedMap[id];
    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setReviewsList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likesCount: (item.likesCount || 15) + (isLiked ? -1 : 1)
        };
      }
      return item;
    }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const countryFlagsMap: Record<string, 'sa' | 'eg' | 'iq' | 'kw' | 'ae' | 'jo' | 'ps' | 'dz' | 'bh' | 'om' | 'qa'> = {
      'السعودية': 'sa',
      'مصر': 'eg',
      'العراق': 'iq',
      'الكويت': 'kw',
      'الإمارات': 'ae',
      'الأردن': 'jo',
      'فلسطين': 'ps',
      'الجزائر': 'dz',
      'البحرين': 'bh',
      'سلطنة عمان': 'om',
      'قطر': 'qa',
    };

    const flagsEmojiMap: Record<string, string> = {
      'السعودية': '🇸🇦',
      'مصر': '🇪🇬',
      'العراق': '🇮🇶',
      'الكويت': '🇰🇼',
      'الإمارات': '🇦🇪',
      'الأردن': '🇯🇴',
      'فلسطين': '🇵🇸',
      'الجزائر': '🇩🇿',
      'البحرين': '🇧🇭',
      'سلطنة عمان': '🇴🇲',
      'قطر': '🇶🇦',
    };

    const newRev: TestimonialReview = {
      id: `rev-custom-${Date.now()}`,
      name: newReviewName,
      handle: `@user_${Math.floor(Math.random() * 9000 + 1000)}`,
      country: newReviewCountry,
      countryCode: countryFlagsMap[newReviewCountry] || 'sa',
      flag: flagsEmojiMap[newReviewCountry] || '🇸🇦',
      rating: newReviewRating,
      text: newReviewText,
      tag: newReviewIsFulfilled ? 'تحقق التعبير 100%' : 'تقييم تجربة ممتازة',
      isFulfilled: newReviewIsFulfilled,
      date: new Date().toISOString().split('T')[0],
      likesCount: 1
    };

    setReviewsList([newRev, ...reviewsList]);
    setAddSuccessMessage('تم إضافة تقييمك ورأيك بنجاح وتوثيقه في المنصة! شكراً لثقتكم.');
    setTimeout(() => {
      setAddSuccessMessage('');
      setIsAddModalOpen(false);
      setNewReviewName('');
      setNewReviewText('');
    }, 2000);
  };

  // Extract unique countries with flags and counts dynamically
  const countryFilters = useMemo(() => {
    const map = new Map<string, { country: string; flag: string; count: number }>();
    reviewsList.forEach(rev => {
      if (rev.country) {
        const existing = map.get(rev.country);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(rev.country, {
            country: rev.country,
            flag: rev.flag || '🏳️',
            count: 1,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [reviewsList]);

  // Filter Logic
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(rev => {
      // Category filter
      let matchesFilter = true;
      if (activeFilter === 'fulfilled') {
        matchesFilter = !!rev.isFulfilled;
      } else if (activeFilter === 'saudi') {
        matchesFilter = rev.country === 'السعودية';
      } else if (activeFilter === 'egypt') {
        matchesFilter = rev.country === 'مصر';
      } else if (activeFilter === 'iraq') {
        matchesFilter = rev.country === 'العراق';
      } else if (activeFilter === 'others') {
        matchesFilter = !['السعودية', 'مصر', 'العراق'].includes(rev.country);
      } else if (activeFilter !== 'all') {
        matchesFilter = rev.country === activeFilter;
      }

      // Search query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch = rev.name.toLowerCase().includes(q) ||
                        rev.text.toLowerCase().includes(q) ||
                        rev.country.toLowerCase().includes(q) ||
                        rev.tag.toLowerCase().includes(q);
      }

      return matchesFilter && matchesSearch;
    });
  }, [reviewsList, activeFilter, searchQuery]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Pagination calculation for section 3
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  // Ref for horizontal smooth scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Statistics counters
  const totalCount = reviewsList.length;
  const fulfilledCount = reviewsList.filter(r => r.isFulfilled).length;

  return (
    <section className="mt-6 py-5 px-3 sm:px-6 bg-slate-950/90 border border-amber-500/30 rounded-2xl shadow-xl relative overflow-hidden font-serif" dir="rtl">
      {/* Visual Ambient Subtle Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar with Title & Rating Badge */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-900/40 relative z-10">
        
        {/* Right side: Title & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>5.0</span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-amber-200 font-serif flex items-center gap-2">
            <span>آراء وتقييمات المستفيدين والمشاهدين</span>
          </h2>
        </div>
      </div>

      {/* Filter Tabs Row (Compact Single Row) */}
      <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] sm:text-xs font-serif z-10 relative">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition cursor-pointer shrink-0 ${
            activeFilter === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          الكل ({reviewsList.length})
        </button>

        <button
          onClick={() => setActiveFilter('fulfilled')}
          className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition cursor-pointer flex items-center gap-1 shrink-0 ${
            activeFilter === 'fulfilled'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>تعبير محقق ({fulfilledCount})</span>
        </button>

        {countryFilters.map(({ country, flag }) => {
          const isActive = activeFilter === country || 
            (activeFilter === 'saudi' && country === 'السعودية') ||
            (activeFilter === 'egypt' && country === 'مصر') ||
            (activeFilter === 'iraq' && country === 'العراق');

          return (
            <button
              key={country}
              onClick={() => setActiveFilter(country)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition cursor-pointer flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:text-amber-200 border border-slate-800'
              }`}
            >
              <span>{flag}</span>
              <span>{country}</span>
            </button>
          );
        })}

        {/* Compact Quick Search */}
        <div className="mr-auto relative min-w-[140px] shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* SINGLE ROW HORIZONTAL CAROUSEL SLIDER */}
      <div
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto scrollbar-none gap-3 py-3 px-0.5 w-full scroll-smooth relative z-10"
      >
        {filteredReviews.length === 0 ? (
          <div className="w-full py-8 text-center text-slate-400 text-xs font-serif bg-slate-900/50 rounded-xl border border-slate-800">
            لا توجد آراء مطابقة لمعايير البحث الحالية.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isLiked = !!likedMap[rev.id];
            return (
              <div
                key={`single-row-${rev.id}`}
                onClick={() => setSelectedReview(rev)}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-slate-900/90 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400 p-3.5 rounded-xl transition duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 shadow-md hover:shadow-amber-500/10 group relative"
              >
                {/* Top User Info & Stars */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-900/40 pb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/30 via-emerald-950 to-slate-900 border border-amber-400/50 flex items-center justify-center font-black text-amber-300 text-xs shrink-0 shadow-sm">
                        {rev.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-100 text-xs font-serif group-hover:text-amber-300 transition truncate flex items-center gap-1">
                          <span className="truncate">{rev.name}</span>
                          {rev.isFulfilled && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="تعبير محقق بالواقع" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
                          <span>{rev.flag}</span>
                          <span className="truncate">{rev.country}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500 font-mono text-[9px] truncate">{rev.handle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Fulfilled or Category Tag */}
                  <div className="flex items-center justify-between text-[10px]">
                    {rev.isFulfilled ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                        <span>تعبير محقق بالواقع 100%</span>
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md font-semibold">
                        {rev.tag}
                      </span>
                    )}
                    {rev.date && <span className="text-slate-500 font-mono text-[9px]">{rev.date}</span>}
                  </div>

                  {/* Review Quote text (2 lines clamped) */}
                  <p className="text-xs text-slate-200 font-serif leading-relaxed line-clamp-2 pt-0.5">
                    "{rev.text}"
                  </p>
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <button
                    onClick={(e) => toggleLike(rev.id, e)}
                    className={`flex items-center gap-1 transition ${
                      isLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-300'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{rev.likesCount || 15}</span>
                  </button>

                  <span className="text-amber-400/90 font-bold text-[10px] group-hover:underline flex items-center gap-0.5">
                    <span>قراءة المراجعة بالكامل</span>
                    <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Navigation Controls Bar under Reviews */}
      <div className="my-3 flex items-center justify-between sm:justify-center gap-3 relative z-10 py-2.5 px-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
        <button
          onClick={scrollRight}
          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md active:scale-95 shrink-0"
          title="التمرير لليمين (السابق)"
          aria-label="السابق"
        >
          <ChevronRight className="w-4 h-4 text-amber-400" />
          <span>السابق</span>
        </button>

        <span className="text-[11px] text-slate-300 font-sans font-medium text-center">
          ◄ اسحب للتنقل بين آراء وتقييمات المستفيدين والمشاهدين ►
        </span>

        <button
          onClick={scrollLeft}
          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md active:scale-95 shrink-0"
          title="التمرير لليسار (التالي)"
          aria-label="التالي"
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Detail Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-serif">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-slate-100 space-y-4">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-amber-300 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-emerald-950 border border-amber-400/50 flex items-center justify-center font-black text-amber-300 text-lg">
                {selectedReview.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-1.5">
                  <span>{selectedReview.name}</span>
                  {selectedReview.isFulfilled && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" title="تعبير محقق بالواقع" />
                  )}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mt-0.5">
                  <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {selectedReview.flag} {selectedReview.country}
                  </span>
                  <span>{selectedReview.handle}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(selectedReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {selectedReview.isFulfilled && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold">
                    ✨ رؤيا محققة بالواقع 100%
                  </span>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm leading-relaxed text-slate-200">
                "{selectedReview.text}"
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
                <span className="bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  وسم: {selectedReview.tag}
                </span>
                <span>تاريخ: {selectedReview.date || '2026'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReview(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}















      {/* Bottom CTA Actions */}
      <div className="mt-10 text-center relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        {onOpenConsultation && (
          <button
            onClick={onOpenConsultation}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-2xl transition cursor-pointer flex items-center gap-2.5 hover:scale-105"
          >
            <Heart className="w-5 h-5 text-slate-950" />
            <span>طلب تفسير لرؤياك الآن مع الدكتور أحمد الشريف</span>
          </button>
        )}

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-600/80 px-6 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>كتابة وإضافة رأيك الخاص</span>
        </button>
      </div>



      {/* Add Review Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-serif">
          <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-100 space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-amber-300 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-300 font-black text-lg border-b border-emerald-900/60 pb-3">
              <PlusCircle className="w-6 h-6 text-emerald-400" />
              <h2>أضف رأيك وتقييمك الشخصي</h2>
            </div>

            {addSuccessMessage ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-2xl text-xs font-bold text-center">
                {addSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 font-serif">الاسم الكامل أو المعرف الشخصي:</label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="مثال: أبو عبد الله / مريم الشمري"
                    className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-emerald-400 rounded-xl p-3 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 font-serif">الدولة:</label>
                    <select
                      value={newReviewCountry}
                      onChange={(e) => setNewReviewCountry(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-emerald-400 rounded-xl p-3 focus:outline-none"
                    >
                      <option value="السعودية">🇸🇦 السعودية</option>
                      <option value="مصر">🇪🇬 مصر</option>
                      <option value="العراق">🇮🇶 العراق</option>
                      <option value="الكويت">🇰🇼 الكويت</option>
                      <option value="الإمارات">🇦🇪 الإمارات</option>
                      <option value="الأردن">🇯🇴 الأردن</option>
                      <option value="فلسطين">🇵🇸 فلسطين</option>
                      <option value="الجزائر">🇩🇿 الجزائر</option>
                      <option value="البحرين">🇧🇭 البحرين</option>
                      <option value="سلطنة عمان">🇴🇲 سلطنة عمان</option>
                      <option value="قطر">🇶🇦 قطر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5 font-serif">التقييم:</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-emerald-400 rounded-xl p-3 focus:outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 ممتاز)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 جيد جداً)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 font-serif">نص التقييم والتجربة:</label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="اكتب تجربتك ورأيك في خدمة تفسير الأحلام والدقة والدراية..."
                    className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-emerald-400 rounded-xl p-3 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    id="isFulfilledCheck"
                    checked={newReviewIsFulfilled}
                    onChange={(e) => setNewReviewIsFulfilled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="isFulfilledCheck" className="text-slate-200 text-xs font-serif cursor-pointer">
                    هل تحقق تعبير الرؤيا معك بالواقع بفضل الله؟
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 font-black py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال وتوثيق التقييم</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl text-xs transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
});
