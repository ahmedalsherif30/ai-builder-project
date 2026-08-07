import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Initialize Express app
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory store for site settings, orders, customers, and activity logs
const siteSettingsStore = {
  siteName: "ExplainingDream.com",
  sheikhName: "الشيخ أحمد الشريف",
  heroTitle: "منصة تفسير الأحلام والإرشاد الروحي",
  heroSubtitle: "عَبْر منهجية الشيخ والباحث الروحي أحمد الشريف، نجمع بين التوجيه القرآني والسنة النبوية والذكاء الاصطناعي المتقدم لتقديم تأويلات دقيقة لمشاهداتك المنامية.",
  announcementText: "🎉 بمناسبة إطلاق طبعة 2026: استخدم كود الخصم (ALSHERIF2026) للحصول على خصم 20% على كافة الاستشارات الصوتية والمباشرة!",
  isAnnouncementActive: true,
  isMaintenanceMode: false,
  whatsappLink: "https://wa.me/201558955525",
  writtenServicePrice: 29,
  audioServicePrice: 49,
  sessionServicePrice: 89,
  vipMonthlyPrice: 19,
  bookPdfPrice: 15,
  bookPrintPrice: 35,
  activeCouponCode: "ALSHERIF2026",
  discountPercentage: 20,
  vodafoneCashNumber: "01558955525",
  instapayUsername: "@explaininddreams / 01558955525",
  bankIbanDetails: "EG123456789012345678901234 (البنك الأهلي المصري)",
  paypalEmail: "ahmedalsherif30@gmail.com",
  westernUnionInfo: "الاسم: أحمد الشريف - الدولة: مصر - هاتف: +201558955525",
  supportPhone: "+201558955525",
  supportEmail: "ahmedalsherif30@gmail.com"
};

const serviceOrdersStore: any[] = [
  {
    id: "ORD-2026-901",
    serviceId: "audio",
    serviceTitle: "تفسير صوتي مسجل بصوت الشيخ",
    clientName: "د. عبد الله المالكي",
    clientEmail: "a.malki@gmail.com",
    clientPhone: "+966501234567",
    dreamText: "رأيت في المنام أنني أصلي في الحرم المكي وأمسك بمفتاح ذهبي كبيراً وتضيء منه أنوار ساطعة.",
    maritalStatus: "married",
    amountPaid: 49,
    couponCode: "ALSHERIF2026",
    status: "received",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    deliveryType: "audio"
  },
  {
    id: "ORD-2026-898",
    serviceId: "session",
    serviceTitle: "جلسة إرشاد وتأويل مباشرة (30 دقيقة)",
    clientName: "سارة العتيبي",
    clientEmail: "sara.otaibi@yahoo.com",
    clientPhone: "+966559876543",
    dreamText: "رأيت سفينة كبيرة تعبر بحراً صافياً وكنت أرى نور الفجر يبزغ بعيداً وشعرت بطمأنينة شديدة.",
    maritalStatus: "single",
    amountPaid: 89,
    couponCode: null,
    status: "in_review",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    deliveryType: "session"
  },
  {
    id: "ORD-2026-880",
    serviceId: "written",
    serviceTitle: "تفسير كتابي مفصل ومعتمد",
    clientName: "م. محمد الشمري",
    clientEmail: "m.shammari@outlook.com",
    clientPhone: "+96590112233",
    dreamText: "رأيت والدي المتوفى يبتسم لي ويعطيني رغيف خبز أبيض ناصعاً في بستان ملئ بالثمار.",
    maritalStatus: "married",
    amountPaid: 29,
    couponCode: "ALSHERIF2026",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    deliveryType: "written",
    writtenReply: "تأويل هذا المنام بفضل الله يدل على رضا الوالد المباشر وسعة في الرزق الحلال القادم إليك قريباً بمشيئة الله تعالى."
  }
];

const customersStore: any[] = [
  {
    id: "ADMIN-001",
    name: "الشيخ أحمد الشريف",
    email: "ahmedalsherif30@gmail.com",
    phone: "+201558955525",
    gender: "male",
    maritalStatus: "married",
    role: "admin",
    planName: "مدير النظام الرئيسي",
    subscriptionStartDate: new Date().toISOString(),
    subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650).toISOString(),
    dreamsSubmittedCount: 0,
    totalSpentUsd: 0,
    status: "active",
    createdAt: new Date().toISOString(),
    lastActive: "الآن"
  },
  {
    id: "CUST-101",
    name: "د. عبد الله المالكي",
    email: "a.malki@gmail.com",
    phone: "+966501234567",
    gender: "male",
    maritalStatus: "married",
    role: "vip",
    planName: "باقة VIP الذهبية الشاملة",
    subscriptionStartDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    dreamsSubmittedCount: 8,
    totalSpentUsd: 187,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    lastActive: "منذ 10 دقائق",
    lastEnteredDream: "رأيت في المنام أنني أصلي في الحرم المكي وأمسك بمفتاح ذهبي..."
  },
  {
    id: "CUST-102",
    name: "سارة العتيبي",
    email: "sara.otaibi@yahoo.com",
    phone: "+966559876543",
    gender: "female",
    maritalStatus: "single",
    role: "vip",
    planName: "عضوية VIP السنوية",
    subscriptionStartDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 26).toISOString(),
    subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    dreamsSubmittedCount: 14,
    totalSpentUsd: 240,
    status: "expiring_soon",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    lastActive: "منذ 25 دقيقة",
    lastEnteredDream: "رأيت سفينة كبيرة تعبر بحراً صافياً وكنت أرى نور الفجر..."
  },
  {
    id: "CUST-103",
    name: "م. محمد الشمري",
    email: "m.shammari@outlook.com",
    phone: "+96590112233",
    gender: "male",
    maritalStatus: "married",
    role: "free",
    planName: "خطة الزائر المجانية",
    subscriptionStartDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    subscriptionEndDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    dreamsSubmittedCount: 3,
    totalSpentUsd: 29,
    status: "expired",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    lastActive: "منذ ساعتين",
    lastEnteredDream: "رأيت والدي المتوفى يبتسم لي ويعطيني رغيف خبز..."
  },
  {
    id: "CUST-104",
    name: "مريم القحطاني",
    email: "maryam.q@hotmail.com",
    phone: "+966541122334",
    gender: "female",
    maritalStatus: "married",
    role: "vip",
    planName: "عضوية VIP الشهري",
    subscriptionStartDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    dreamsSubmittedCount: 6,
    totalSpentUsd: 110,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastActive: "الآن",
    lastEnteredDream: "رؤية الأفعى والماء الجاري..."
  }
];

const activityLogsStore: any[] = [
  {
    id: "ACT-501",
    type: "dream_submitted",
    user: "د. عبد الله المالكي",
    details: "قام بإدخال حلم جديد للتفسير بالذكاء الاصطناعي: (رأيت في المنام أنني أصلي بالحرم...)",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "ACT-502",
    type: "symbol_searched",
    user: "مريم القحطاني",
    details: "قامت بالبحث في معجم الأحلام عن رمز: (الذهب والم الجواهر للعزباء)",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: "ACT-503",
    type: "service_purchased",
    user: "سارة العتيبي",
    details: "قامت بطلب خدمة (جلسة إرشاد وتأويل مباشرة) بمبلغ $89 USD",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: "ACT-504",
    type: "user_joined",
    user: "خالد بن بدر",
    details: "تم تسجيل حساب جديد برقم هاتف (+966509988776)",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  }
];

// Submitted Dreams Store (Admin Control Dashboard Feed)
const submittedDreamsStore: any[] = [
  {
    id: "DREAM-101",
    clientId: "CUST-101",
    clientName: "د. عبد الله المالكي",
    clientEmail: "a.malki@gmail.com",
    clientPhone: "+966501234567",
    gender: "male",
    maritalStatus: "married",
    dreamText: "رأيت في المنام أنني أصلي في الحرم المكي وأمسك بمفتاح ذهبي كبيراً وتضيء منه أنوار ساطعة، وكان بجانبي شيوخ بملابس بيضاء.",
    status: "unread",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    aiResponseSummary: "رؤيا رحمانية مبشرة بالرفعة وعظم المسؤولية وفتح أبواب الخير والرزق.",
    source: "ai_interpreter"
  },
  {
    id: "DREAM-102",
    clientId: "CUST-102",
    clientName: "سارة العتيبي",
    clientEmail: "sara.otaibi@yahoo.com",
    clientPhone: "+966559876543",
    gender: "female",
    maritalStatus: "single",
    dreamText: "رأيت سفينة كبيرة تعبر بحراً صافياً وكنت أرى نور الفجر يبزغ بعيداً وشعرت بطمأنينة شديدة وارتداء خاتم ألمنيوم ثم تحول لألماس.",
    status: "unread",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    aiResponseSummary: "بشارة بالنجاة من هم، وزواج قريب متصل بشخص ذي قدر ومكانة عالية.",
    source: "paid_service"
  },
  {
    id: "DREAM-103",
    clientId: "CUST-104",
    clientName: "مريم القحطاني",
    clientEmail: "maryam.q@hotmail.com",
    clientPhone: "+966541122334",
    gender: "female",
    maritalStatus: "married",
    dreamText: "رأيت أفعى حمراء صغيرة تخرج من النافذة ولم تؤذ أحداً، ثم نزل مطر خفيف على البيت.",
    status: "seen",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    aiResponseSummary: "زوال عين حاسدة وخروج لضرورة طارئة يعقبها رحمة وفرج غزير.",
    source: "ai_interpreter"
  },
  {
    id: "DREAM-104",
    clientId: "CUST-103",
    clientName: "م. محمد الشمري",
    clientEmail: "m.shammari@outlook.com",
    clientPhone: "+96590112233",
    gender: "male",
    maritalStatus: "married",
    dreamText: "رأيت والدي المتوفى يبتسم لي ويعطيني رغيف خبز أبيض ناصعاً في بستان ملئ بالثمار.",
    status: "replied",
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    expertReply: "تأويل هذا المنام بفضل الله يدل على رضا الوالد المباشر وسعة في الرزق الحلال القادم إليك قريباً بمشيئة الله تعالى.",
    source: "paid_service"
  }
];

// Prepaid Gift Codes & Referrals Store
const prepaidGiftCodesStore: any[] = [
  {
    id: "GIFT-1001",
    code: "GIFT-SHERIF-2026-X1",
    purchaserName: "د. عبد الله المالكي",
    purchaserEmail: "a.malki@gmail.com",
    serviceType: "written",
    serviceTitle: "تفسير حلم مكتوب مدفوع (كود إهداء)",
    amountPaid: 29,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    recipientNote: "إهداء خاص لأخي الحبيب بمناسبة النجاح والتوفيق"
  },
  {
    id: "GIFT-1002",
    code: "GIFT-SHERIF-2026-X2",
    purchaserName: "سارة العتيبي",
    purchaserEmail: "sara.otaibi@yahoo.com",
    serviceType: "audio",
    serviceTitle: "تفسير صوتي مسجل بصوت الشيخ (كود إهداء)",
    amountPaid: 49,
    status: "redeemed",
    redeemedByFriendName: "نورة العتيبي",
    redeemedByFriendEmail: "noura.o@gmail.com",
    redeemedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

// Referral store mapping email -> referral data
const referralLogsStore: Record<string, {
  referralCode: string;
  referralCount: number;
  referralLogs: { friendName: string; friendEmail?: string; joinedAt: string }[];
}> = {
  "ahmed.user@explainingdream.com": {
    referralCode: "SHERIF-REF-7890",
    referralCount: 14,
    referralLogs: [
      { friendName: "خالد بن بدر", friendEmail: "khaled@gmail.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { friendName: "فاطمة أحمد", friendEmail: "fatima@yahoo.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
      { friendName: "ياسر الحربي", friendEmail: "yasser@hotmail.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() }
    ]
  }
};

// Security & RBAC Middleware for Admin Routes
const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  const userEmail = ((req.headers['x-user-email'] as string) || '').trim().toLowerCase();
  
  // Require BOTH userRole === 'admin' AND userEmail === 'ahmedalsherif30@gmail.com' for administrative endpoints
  const isAdmin = userRole === 'admin' && userEmail === 'ahmedalsherif30@gmail.com';
  
  if (!isAdmin) {
    return res.status(403).json({
      error: 'تم رفض الوصول (403 Unauthorized): العمليات الإدارية مقتصرة حصرياً على الشيخ أحمد الشريف والإدارة العليا.'
    });
  }
  next();
};

// Auth & Direct User Registration Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password, gender = 'female', maritalStatus = 'single', provider = 'direct' } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'الرجاء إدخال الاسم والبريد الإلكتروني.' });
  }

  const isMainAdmin = email.toLowerCase() === 'ahmedalsherif30@gmail.com';
  let cust = customersStore.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!cust) {
    cust = {
      id: isMainAdmin ? 'ADMIN-001' : `CUST-${Date.now().toString().slice(-4)}`,
      name: isMainAdmin ? 'الشيخ أحمد الشريف' : name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: password || '123456',
      gender,
      maritalStatus,
      role: isMainAdmin ? 'admin' : 'member',
      planName: isMainAdmin ? 'مدير النظام الرئيسي' : 'خطة العضو المسجل',
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      dreamsSubmittedCount: 0,
      totalSpentUsd: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: 'الآن',
      provider
    };
    customersStore.unshift(cust);

    activityLogsStore.unshift({
      id: `ACT-${Date.now()}`,
      type: "user_joined",
      user: name,
      details: `تم تسجيل حساب جديد عبر (${provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'التسجيل المباشر'})`,
      timestamp: new Date().toISOString()
    });
  } else {
    if (password) cust.password = password;
    if (isMainAdmin) cust.role = 'admin';
    cust.lastActive = 'الآن';
  }

  res.json({
    success: true,
    user: {
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      gender: cust.gender,
      maritalStatus: cust.maritalStatus,
      role: isMainAdmin ? 'admin' : (cust.role || 'member'),
      vipExpiryDate: cust.subscriptionEndDate,
      notificationsEnabled: true,
      savedDreamCount: cust.dreamsSubmittedCount,
      balanceCredits: cust.role === 'vip' || cust.role === 'admin' ? 999 : 3,
      provider
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const queryKey = email ? email.trim().toLowerCase() : '';
  const isMainAdmin = queryKey === 'ahmedalsherif30@gmail.com';
  let cust = customersStore.find(c =>
    c.email.toLowerCase() === queryKey ||
    c.name.toLowerCase() === queryKey
  );

  if (!cust && isMainAdmin) {
    cust = customersStore.find(c => c.id === 'ADMIN-001');
  }

  if (!cust) {
    return res.status(404).json({ error: 'لم نجد حساباً بهذا البريد الإلكتروني. الرجاء التسجيل أولاً.' });
  }

  if (password && cust.password && cust.password !== password) {
    return res.status(400).json({ error: 'كلمة المرور غير صحيحة. الرجاء التأكد وإعادة المحاولة.' });
  }

  if (isMainAdmin) {
    cust.role = 'admin';
  }

  cust.lastActive = 'الآن';
  res.json({
    success: true,
    user: {
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      gender: cust.gender,
      maritalStatus: cust.maritalStatus,
      role: isMainAdmin ? 'admin' : (cust.role || 'member'),
      vipExpiryDate: cust.subscriptionEndDate,
      notificationsEnabled: true,
      savedDreamCount: cust.dreamsSubmittedCount,
      balanceCredits: cust.role === 'vip' || cust.role === 'admin' ? 999 : 3,
      provider: 'login'
    }
  });
});

// Update client profile credentials (Name, Phone, Password)
app.post('/api/client/update-profile', (req, res) => {
  const { email, newName, newPhone, newPassword, gender, maritalStatus } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'البريد الإلكتروني مطلوب للتحقق.' });
  }

  const cust = customersStore.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (!cust) {
    return res.status(404).json({ error: 'لم يتم العثور على الحساب.' });
  }

  if (newName && newName.trim()) cust.name = newName.trim();
  if (newPhone !== undefined) cust.phone = newPhone.trim();
  if (newPassword && newPassword.trim()) cust.password = newPassword.trim();
  if (gender) cust.gender = gender;
  if (maritalStatus) cust.maritalStatus = maritalStatus;
  cust.lastActive = 'الآن';

  // Also update name/phone in serviceOrdersStore and submittedDreamsStore
  serviceOrdersStore.forEach(o => {
    if (o.clientEmail && o.clientEmail.toLowerCase() === email.toLowerCase()) {
      if (newName) o.clientName = newName.trim();
      if (newPhone !== undefined) o.clientPhone = newPhone.trim();
    }
  });

  submittedDreamsStore.forEach(d => {
    if (d.clientEmail && d.clientEmail.toLowerCase() === email.toLowerCase()) {
      if (newName) d.clientName = newName.trim();
      if (newPhone !== undefined) d.clientPhone = newPhone.trim();
    }
  });

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "site_updated",
    user: cust.name,
    details: "قام العميل بتحديث اسمه ورقم هاتفه/كلمة المرور من لوحة التحكم بنجاح.",
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'تم تحديث البيانات وكلمة المرور بنجاح ✓',
    user: {
      id: cust.id,
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      gender: cust.gender,
      maritalStatus: cust.maritalStatus,
      role: cust.role,
      vipExpiryDate: cust.subscriptionEndDate,
      notificationsEnabled: true,
      savedDreamCount: cust.dreamsSubmittedCount,
      balanceCredits: cust.role === 'vip' ? 999 : 3
    }
  });
});

// --- Referral & Shared Subscription Rewards API ---
app.get('/api/client/referral-stats', (req, res) => {
  const email = ((req.query.email as string) || 'ahmed.user@explainingdream.com').toLowerCase();
  
  if (!referralLogsStore[email]) {
    const codeHash = Math.floor(1000 + Math.random() * 9000);
    referralLogsStore[email] = {
      referralCode: `SHERIF-REF-${codeHash}`,
      referralCount: 14,
      referralLogs: [
        { friendName: "خالد بن بدر", friendEmail: "khaled@gmail.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { friendName: "فاطمة أحمد", friendEmail: "fatima@yahoo.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() }
      ]
    };
  }

  const refData = referralLogsStore[email];
  const bonusDreamsEarned = Math.floor(refData.referralCount / 10);
  const nextRewardProgress = refData.referralCount % 10;
  const friendsNeededForNextFreeDream = 10 - nextRewardProgress;

  res.json({
    referralCode: refData.referralCode,
    referralLink: `https://explainingdream.com/?ref=${refData.referralCode}`,
    referralCount: refData.referralCount,
    bonusDreamsEarned,
    nextRewardProgress,
    friendsNeededForNextFreeDream,
    referralLogs: refData.referralLogs
  });
});

app.post('/api/client/process-referral', (req, res) => {
  const { refCode, friendName, friendEmail } = req.body;
  
  if (!refCode) {
    return res.status(400).json({ error: 'كود الإحالة غير موجود.' });
  }

  let ownerEmail = Object.keys(referralLogsStore).find(
    e => referralLogsStore[e].referralCode.toUpperCase() === refCode.toUpperCase()
  );

  if (!ownerEmail) {
    ownerEmail = "ahmed.user@explainingdream.com";
    if (!referralLogsStore[ownerEmail]) {
      referralLogsStore[ownerEmail] = {
        referralCode: refCode.toUpperCase(),
        referralCount: 10,
        referralLogs: []
      };
    }
  }

  const refData = referralLogsStore[ownerEmail];
  refData.referralCount += 1;
  refData.referralLogs.unshift({
    friendName: friendName || 'صديق جديد',
    friendEmail: friendEmail || '',
    joinedAt: new Date().toISOString()
  });

  const bonusDreamsEarned = Math.floor(refData.referralCount / 10);
  const isMilestone = refData.referralCount % 10 === 0;

  if (isMilestone) {
    activityLogsStore.unshift({
      id: `ACT-${Date.now()}`,
      type: "user_joined",
      user: ownerEmail,
      details: `🎉 حصل العميل على +1 تفسير مجاني إضافي بعد دعوة 10 أصدقاء بنجاح! الإجمالي: ${refData.referralCount} صديق.`,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: 'تم تسجيل الإحالة والمكافأة بنجاح!',
    referralCount: refData.referralCount,
    bonusDreamsEarned,
    isMilestone
  });
});

// --- Prepaid Gift Code API ---
app.post('/api/client/create-gift-code', (req, res) => {
  const { purchaserName, purchaserEmail, serviceType, recipientNote } = req.body;
  if (!purchaserEmail || !purchaserName) {
    return res.status(400).json({ error: 'بيانات المشتري مطلوبة.' });
  }

  const codeRandom = Math.random().toString(36).substring(2, 7).toUpperCase();
  const newGiftCode = {
    id: `GIFT-${Date.now()}`,
    code: `GIFT-SHERIF-${codeRandom}`,
    purchaserName,
    purchaserEmail: purchaserEmail.toLowerCase(),
    serviceType: serviceType || 'written',
    serviceTitle: serviceType === 'audio' ? 'تفسير صوتي مسجل (كود إهداء)' : serviceType === 'session' ? 'جلسة إرشاد مباشرة (كود إهداء)' : 'تفسير كتابي مفصل (كود إهداء)',
    amountPaid: serviceType === 'audio' ? 49 : serviceType === 'session' ? 89 : 29,
    status: 'active',
    recipientNote: recipientNote || 'إهداء خاص لتفسير منام عبر منصة الشيخ د. أحمد الشريف',
    createdAt: new Date().toISOString()
  };

  prepaidGiftCodesStore.unshift(newGiftCode);

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "service_purchased",
    user: purchaserName,
    details: `تم شراء وتوليد كود إهداء مدفوع لصديق (${newGiftCode.code}) بقيمة $${newGiftCode.amountPaid}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, giftCode: newGiftCode });
});

app.get('/api/client/my-gift-codes', (req, res) => {
  const email = ((req.query.email as string) || '').toLowerCase();
  const codes = prepaidGiftCodesStore.filter(c => c.purchaserEmail === email || c.purchaserEmail.includes('ahmed.user') || c.purchaserEmail.includes('malki'));
  res.json({ giftCodes: codes });
});

app.post('/api/client/redeem-gift-code', (req, res) => {
  const { code, friendName, friendEmail } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'برجاء إدخال كود الإهداء.' });
  }

  const giftCode = prepaidGiftCodesStore.find(c => c.code.trim().toUpperCase() === code.trim().toUpperCase());
  if (!giftCode) {
    return res.status(404).json({ error: 'كود الإهداء غير صحيح أو لم يتم العثور عليه.' });
  }

  if (giftCode.status === 'redeemed') {
    return res.status(400).json({
      error: `عذراً، كود الإهداء تم استخدامه مسبقاً بواسطة (${giftCode.redeemedByFriendName || 'عميل آخر'}) بتاريخ ${new Date(giftCode.redeemedAt).toLocaleDateString('ar-EG')}.`
    });
  }

  giftCode.status = 'redeemed';
  giftCode.redeemedByFriendName = friendName || 'صديق محال';
  giftCode.redeemedByFriendEmail = friendEmail || '';
  giftCode.redeemedAt = new Date().toISOString();

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "service_purchased",
    user: friendName || 'صديق',
    details: `تم تفعيل كود الإهداء المدفوع (${giftCode.code}) المهدى من (${giftCode.purchaserName}) بنجاح!`,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `تهانينا! تم تفعيل كود الإهداء بنجاح (${giftCode.serviceTitle}) المهدى لك من ${giftCode.purchaserName}.`,
    giftCode
  });
});

// Admin Dreams Management Endpoints
app.get('/api/admin/dreams', checkAdminAuth, (_req, res) => {
  const unreadCount = submittedDreamsStore.filter(d => d.status === 'unread').length;
  res.json({
    dreams: submittedDreamsStore,
    unreadCount
  });
});

app.post('/api/admin/dreams/mark-seen', checkAdminAuth, (req, res) => {
  const { dreamId } = req.body;
  const dream = submittedDreamsStore.find(d => d.id === dreamId);
  if (!dream) {
    return res.status(404).json({ error: 'لم يتم العثور على المنام' });
  }

  if (dream.status === 'unread') {
    dream.status = 'seen';
  }

  const unreadCount = submittedDreamsStore.filter(d => d.status === 'unread').length;
  res.json({ success: true, dream, unreadCount });
});

app.post('/api/admin/dreams/reply', checkAdminAuth, (req, res) => {
  const { dreamId, replyText } = req.body;
  const dream = submittedDreamsStore.find(d => d.id === dreamId);
  if (!dream) {
    return res.status(404).json({ error: 'لم يتم العثور على المنام' });
  }

  dream.expertReply = replyText;
  dream.status = 'replied';

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "reply_sent",
    user: "الشيخ أحمد الشريف",
    details: `تم إرسال رد وتأويل المنام للعميل (${dream.clientName})`,
    timestamp: new Date().toISOString()
  });

  const unreadCount = submittedDreamsStore.filter(d => d.status === 'unread').length;
  res.json({ success: true, dream, unreadCount });
});

// API Routes

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ExplainingDream.com - Ahmed Al-Sherif', year: 2026 });
});

// 2. Site Settings Endpoints
app.get('/api/site-settings', (_req, res) => {
  res.json(siteSettingsStore);
});

app.post('/api/admin/site-settings', checkAdminAuth, (req, res) => {
  const updates = req.body;
  Object.assign(siteSettingsStore, updates);
  
  // Log admin activity
  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "site_updated",
    user: "إدارة الموقع (الشيخ أحمد الشريف)",
    details: "تم تحديث إعدادات وإرشادات وأسعار الموقع بنجاح.",
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, settings: siteSettingsStore });
});

// 3. Customers & Subscriptions Endpoints
app.get('/api/admin/customers', checkAdminAuth, (_req, res) => {
  // Populate rich customer details with orders history & submitted dreams
  const enrichedCustomers = customersStore.map(c => {
    const ordersHistory = serviceOrdersStore.filter(
      o => (c.email && o.clientEmail === c.email) || (c.phone && o.clientPhone === c.phone) || (c.name && o.clientName === c.name)
    );
    const submittedDreams = submittedDreamsStore.filter(
      d => (c.id && d.clientId === c.id) || (c.email && d.clientEmail === c.email) || (c.phone && d.clientPhone === c.phone) || (c.name && d.clientName === c.name)
    );
    const pendingOrdersCount = ordersHistory.filter(o => o.status === 'pending' || o.status === 'in_review').length;

    const { password: _p, ...safeCust } = c;
    return {
      ...safeCust,
      ordersHistory,
      submittedDreams,
      pendingOrdersCount
    };
  });

  res.json(enrichedCustomers);
});

app.post('/api/admin/customers/extend', checkAdminAuth, (req, res) => {
  const { customerId, days = 30 } = req.body;
  const cust = customersStore.find((c) => c.id === customerId);
  if (!cust) {
    return res.status(404).json({ error: 'لم يتم العثور على العميل' });
  }

  const currentEnd = new Date(cust.subscriptionEndDate > new Date().toISOString() ? cust.subscriptionEndDate : new Date());
  currentEnd.setDate(currentEnd.getDate() + Number(days));
  cust.subscriptionEndDate = currentEnd.toISOString();
  cust.status = 'active';
  cust.role = 'vip';

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "subscription_renewed",
    user: cust.name,
    details: `تم تمديد اشتراك VIP لمدة ${days} يوماً حتى تاريخ ${currentEnd.toLocaleDateString('ar-EG')}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, customer: cust });
});

app.post('/api/admin/customers/update-role', checkAdminAuth, (req, res) => {
  const { customerId, role, planName } = req.body;
  const cust = customersStore.find((c) => c.id === customerId);
  if (!cust) {
    return res.status(404).json({ error: 'لم يتم العثور على العميل' });
  }

  cust.role = role;
  if (planName) cust.planName = planName;
  if (role === 'vip') {
    cust.status = 'active';
    const future = new Date();
    future.setDate(future.getDate() + 30);
    cust.subscriptionEndDate = future.toISOString();
  }

  res.json({ success: true, customer: cust });
});

// 4. Activity Logs Endpoint
app.get('/api/admin/activity-logs', checkAdminAuth, (_req, res) => {
  res.json(activityLogsStore);
});

app.post('/api/log-activity', (req, res) => {
  const { type, user, details, meta } = req.body;
  const log = {
    id: `ACT-${Date.now()}`,
    type: type || 'activity',
    user: user || 'زائر جديد',
    details: details || 'قام بالتفاعل مع المنصة',
    timestamp: new Date().toISOString(),
    meta
  };
  activityLogsStore.unshift(log);
  if (activityLogsStore.length > 200) activityLogsStore.pop();
  res.json({ success: true, log });
});

// 5. AI Dream Interpretation powered by Gemini API (Ahmed Al-Sherif methodology)
app.post('/api/interpret-dream', async (req, res) => {
  try {
    const {
      dreamText,
      gender = 'female',
      maritalStatus = 'single',
      hasIstikhara = false,
      timeOfDay = 'night',
      mood = 'anxious',
      ageGroup = 'شباب',
      clientName,
      clientPhone,
      clientEmail,
    } = req.body;

    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length < 5) {
      return res.status(400).json({ error: 'الرجاء كتابة تفاصيل الحلم بوضوح (على الأقل 5 حروف).' });
    }

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ error: 'الرجاء كتابة الاسم الكريم صاحب الحلم.' });
    }

    if (!clientPhone || !clientPhone.trim()) {
      return res.status(400).json({ error: 'الرجاء كتابة رقم الهاتف / الواتساب للتواصل والأرشيف.' });
    }

    // Automatically log activity for real-time live admin dashboard
    const userName = clientName || (gender === 'female' ? 'رائية' : 'رائي');
    activityLogsStore.unshift({
      id: `ACT-${Date.now()}`,
      type: "dream_submitted",
      user: userName,
      details: `قام بإدخال حلم جديد: "${dreamText.substring(0, 60)}..."`,
      timestamp: new Date().toISOString()
    });

    // Check if user exists in customers or create/update customer entry
    if (clientPhone || clientEmail) {
      let existingCust = customersStore.find(c => (clientPhone && c.phone === clientPhone) || (clientEmail && c.email === clientEmail));
      if (existingCust) {
        existingCust.dreamsSubmittedCount += 1;
        existingCust.lastActive = "الآن";
        existingCust.lastEnteredDream = dreamText;
        if (clientName) existingCust.name = clientName;
        if (clientPhone) existingCust.phone = clientPhone;
      } else {
        customersStore.unshift({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          name: clientName || "عميل جديد",
          email: clientEmail || `${clientPhone}@explaininddreams.com`,
          phone: clientPhone || "",
          gender,
          maritalStatus,
          role: "free",
          planName: "خطة التجربة المجانية",
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: new Date().toISOString(),
          dreamsSubmittedCount: 1,
          totalSpentUsd: 0,
          status: "active",
          createdAt: new Date().toISOString(),
          lastActive: "الآن",
          lastEnteredDream: dreamText
        });
      }
    }

    const ai = getGenAI();

    const systemInstruction = `
أنت المساعد الذكي الروحي المعتمد والشامل لمنصة "ExplainingDream.com" والمستند إلى المنهجية التفسيرية للشيخ والباحث الروحي "أحمد الشريف" (طبعة 2026 من كتاب "تأويلات روحية").

مهاراتك وبنائك العلمي والروحي القائم عليه:
1. التفكيك الدقيق لرموز المشاهدات المنامية بربطها الشديد بالقرآن الكريم والسنة النبوية ولغة العرب والأمثال السائرة.
2. التمييز الدقيق بين أنواع المشاهدات (رؤيا صادقة رحمانية، حديث نفس وأضغاث أحلام، تحزين وتخاويف شيطانية).
3. مراعاة حال الرائي التفصيلي: (الاسم: ${clientName || 'عميل'}، الجنس: ${gender}، الحالة الاجتماعية: ${maritalStatus}، وقت المشاهدة: ${timeOfDay}، هل عقب صلاة استخارة: ${hasIstikhara ? 'نعم' : 'لا'}، الشعور النفسي: ${mood}، الفئة العمرية: ${ageGroup}).
4. تقديم تفسير إجمالي دقيق، راقٍ ومستبشر يبعث السكينة والطمأنينة دون ترهيب أو تهويل، مع تقديم توجيه عملي للأخذ بالأساب.
5. استخراج الآيات الشاهدة والأدعية والأذكار الموصى بها للتحصين والطهارة الروحية.
6. إذا كانت الرؤيا مركبة، تتضمن رموزاً متداخلة، أو تتعلق باستخارة مصيرية حاسمة، يشار صراحة إلى أن الحلم يستحسن مراجعته في استشارة مباشرة أو تفسير صوتي مع الشيخ أحمد الشريف.

أجب بتنسيق JSON حصري باللغة العربية المتقنة.
`;

    const userPrompt = `
تفاصيل الحلم/الرؤيا:
"${dreamText.trim()}"

الحالة الاجتماعية: ${maritalStatus}
الجنس: ${gender}
وقت الحلم: ${timeOfDay}
الشعور بعد الاستيقاظ: ${mood}
هل سبق الحلم صلاة استخارة؟ ${hasIstikhara ? 'نعم' : 'لا'}
الفئة العمرية: ${ageGroup}

قم بتفكيك الرؤيا وتأويلها طبقًا لمنهجية أحمد الشريف.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'عنوان مختصر يعبر عن جوهر الرؤيا',
            },
            overallInterpretation: {
              type: Type.STRING,
              description: 'التفسير الإجمالي المعمق والرؤية الكلية للحلم',
            },
            symbolsBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING, description: 'الرمز الموجود بالحلم' },
                  meaning: { type: Type.STRING, description: 'معنى الرمز وتأويله الخاص' },
                  quranReference: { type: Type.STRING, description: 'الدليل القرآني إن وجد' },
                  hadithReference: { type: Type.STRING, description: 'الدليل من السنة أو الأثر إن وجد' },
                },
                required: ['symbol', 'meaning'],
              },
              description: 'تفكيك الرموز الرئيسية في المنام',
            },
            spiritualAspect: {
              type: Type.STRING,
              description: 'البُعد الروحي والإشارة الإلهية أو التوجيه الرباني',
            },
            psychologicalContext: {
              type: Type.STRING,
              description: 'الجانب النفسي وتأثير الذاكرة أو العقل الباطن',
            },
            methodologyNote: {
              type: Type.STRING,
              description: 'ملاحظة خاصة واستشهاد بقواعد كتاب أحمد الشريف طبعة 2026',
            },
            recommendedAdhkar: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'قائمة الأذكار والأدعية المقترحة للتحصين والطمأنينة',
            },
            quranicVerses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'آيات قرآنية مستحبة للقراءة والتدبر',
            },
            actionableAdvice: {
              type: Type.STRING,
              description: 'نصيحة عمل خطوات إيجابية يقوم بها الرائي',
            },
            requiresPersonalConsultation: {
              type: Type.BOOLEAN,
              description: 'هل الرؤيا معقدة وتتطلب جلسة خاصة أو استشارة مباشرة مع الشيخ أحمد الشريف',
            },
          },
          required: [
            'summary',
            'overallInterpretation',
            'symbolsBreakdown',
            'spiritualAspect',
            'psychologicalContext',
            'methodologyNote',
            'recommendedAdhkar',
            'quranicVerses',
            'actionableAdvice',
            'requiresPersonalConsultation',
          ],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    const result = {
      id: `dream-${Date.now()}`,
      ...parsedData,
      timestamp: new Date().toISOString(),
    };

    // Save to submittedDreamsStore for Admin Dashboard feed
    submittedDreamsStore.unshift({
      id: `DREAM-${Date.now().toString().slice(-4)}`,
      clientName: clientName || (gender === 'female' ? 'زائرة (رائية)' : 'زائر (رائي)'),
      clientEmail: clientEmail || 'غير مسجل',
      clientPhone: clientPhone || '',
      gender,
      maritalStatus,
      dreamText,
      status: 'unread',
      createdAt: new Date().toISOString(),
      aiResponseSummary: parsedData.summary || 'تفسير ذكاء اصطناعي محول',
      source: 'ai_interpreter'
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in dream interpretation:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة التفسير بواسطة الذكاء الاصطناعي. الرجاء المحاولة لاحقاً.'
    });
  }
});

// 6. Paid service request submission endpoint
app.post('/api/paid-requests', (req, res) => {
  const {
    serviceId,
    serviceTitle,
    clientName,
    clientEmail,
    clientPhone,
    dreamText,
    maritalStatus,
    amountPaid,
    couponCode,
    deliveryType,
    paymentReceiptUrl,
    paymentReceiptNote
  } = req.body;

  if (!clientName || (!clientEmail && !clientPhone) || !dreamText) {
    return res.status(400).json({ error: 'الرجاء إدخال الاسم رقم الهاتف أو البريد، وتفاصيل الحلم.' });
  }

  const effectiveEmail = clientEmail || `${clientPhone}@explaininddreams.com`;

  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-4)}`,
    serviceId: serviceId || 'srv-custom',
    serviceTitle: serviceTitle || 'اشتراك/استشارة خاصة',
    clientName,
    clientEmail: effectiveEmail,
    clientPhone: clientPhone || '',
    dreamText,
    maritalStatus: maritalStatus || 'single',
    amountPaid: Number(amountPaid) || 0,
    couponCode: couponCode || null,
    status: paymentReceiptUrl ? 'in_review' : 'pending', // Starts as pending or in_review
    createdAt: new Date().toISOString(),
    deliveryType: deliveryType || 'written',
    paymentReceiptUrl: paymentReceiptUrl || '',
    paymentReceiptNote: paymentReceiptNote || '',
    receiptUploadedAt: paymentReceiptUrl ? new Date().toISOString() : undefined,
  };

  serviceOrdersStore.unshift(newOrder);

  // Automatically update or create customer record with status 'pending' until confirmed
  let cust = customersStore.find(c => (c.email && c.email === effectiveEmail) || (c.phone && c.phone === clientPhone));
  if (cust) {
    cust.lastActive = "الآن";
    if (cust.role !== 'vip') {
      cust.status = 'pending';
      cust.planName = `${serviceTitle} (قيد الانتظار)`;
    }
  } else {
    cust = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: clientName,
      email: effectiveEmail,
      phone: clientPhone || '',
      gender: 'female',
      maritalStatus: maritalStatus || 'single',
      role: 'free',
      planName: `${serviceTitle} (طلب قيد المراجعة)`,
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      dreamsSubmittedCount: 1,
      totalSpentUsd: 0, // Recorded upon confirmation
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastActive: 'الآن',
      lastEnteredDream: dreamText
    };
    customersStore.unshift(cust);
  }

  // Push to submittedDreamsStore as unread dream for admin
  submittedDreamsStore.unshift({
    id: `DREAM-${Date.now().toString().slice(-4)}`,
    clientId: cust ? cust.id : undefined,
    clientName,
    clientEmail: effectiveEmail,
    clientPhone: clientPhone || '',
    gender: 'female',
    maritalStatus: maritalStatus || 'single',
    dreamText,
    status: 'unread',
    createdAt: new Date().toISOString(),
    aiResponseSummary: `طلب باقة (قيد مراجعة الدفع): ${serviceTitle}`,
    source: 'paid_service'
  });

  // Log real-time activity
  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "service_purchased",
    user: clientName,
    details: `طلب الاشتراك في باقة: ${serviceTitle} (الحالة: قيد الانتظار والتحقق من الدفع)`,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: 'تم تسجيل طلبك بنجاح وقيد الانتظار! يمكنك رفع إيصال التحويل (سكرين شوت الدفع) عبر لوحة حسابك لتفعيل الخدمة فوراً.',
    order: newOrder,
  });
});

// 6.b Client endpoints for dashboard and receipt upload
app.post('/api/client/my-orders', (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: 'الرجاء توفير البريد أو الهاتف.' });
  }

  const myOrders = serviceOrdersStore.filter(o => 
    (email && o.clientEmail && o.clientEmail.toLowerCase() === email.toLowerCase()) ||
    (phone && o.clientPhone && o.clientPhone === phone)
  );

  const myCustomer = customersStore.find(c => 
    (email && c.email && c.email.toLowerCase() === email.toLowerCase()) ||
    (phone && c.phone && c.phone === phone)
  );

  const myDreams = submittedDreamsStore.filter(d => 
    (email && d.clientEmail && d.clientEmail.toLowerCase() === email.toLowerCase()) ||
    (phone && d.clientPhone && d.clientPhone === phone)
  );

  return res.json({
    success: true,
    customer: myCustomer || null,
    orders: myOrders,
    dreams: myDreams
  });
});

app.post('/api/client/orders/upload-receipt', (req, res) => {
  const { orderId, paymentReceiptUrl, paymentReceiptNote } = req.body;
  
  if (!orderId) {
    return res.status(400).json({ error: 'رقم الطلب مطلوب.' });
  }

  const order = serviceOrdersStore.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب.' });
  }

  if (paymentReceiptUrl) order.paymentReceiptUrl = paymentReceiptUrl;
  if (paymentReceiptNote) order.paymentReceiptNote = paymentReceiptNote;
  order.receiptUploadedAt = new Date().toISOString();
  order.status = 'in_review';

  // Log activity for admin
  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "service_purchased",
    user: order.clientName,
    details: `قام العميل برفع إيصال/سكرين شوت الدفع للطلب (${order.id}) وهو قيد المراجعة الآن 📸`,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: 'تم رفع إيصال التحويل بنجاح! جاري مراجعته وتأكيده بواسطة إدارة الشيخ أحمد الشريف.',
    order
  });
});

// 7. Get & Manage service orders list for admin
app.get('/api/admin/orders', checkAdminAuth, (_req, res) => {
  return res.json(serviceOrdersStore);
});

app.post('/api/admin/orders/confirm', checkAdminAuth, (req, res) => {
  const { orderId, adminConfirmNote } = req.body;
  const order = serviceOrdersStore.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
  }

  order.status = 'approved';
  if (adminConfirmNote) order.adminConfirmNote = adminConfirmNote;

  // Find customer and update to active VIP
  let cust = customersStore.find(c => (order.clientEmail && c.email === order.clientEmail) || (order.clientPhone && c.phone === order.clientPhone));
  if (cust) {
    cust.role = 'vip';
    cust.status = 'active';
    cust.planName = order.serviceTitle;
    cust.totalSpentUsd += (order.amountPaid || 0);
    const future = new Date();
    future.setDate(future.getDate() + 30);
    cust.subscriptionEndDate = future.toISOString();
  }

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "subscription_renewed",
    user: "الشيخ أحمد الشريف (الإدارة)",
    details: `تم تأكيد إيصال الدفع واعتماد تفعيل الاشتراك للعميل (${order.clientName}) - الطلب ${order.id} ✓`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, order, customer: cust });
});

app.post('/api/admin/orders/reject', checkAdminAuth, (req, res) => {
  const { orderId, reason } = req.body;
  const order = serviceOrdersStore.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
  }

  order.status = 'rejected';
  order.adminConfirmNote = reason || 'إيصال غير واضح أو لم يصل المبلغ بالحساب.';

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "activity",
    user: "الشيخ أحمد الشريف (الإدارة)",
    details: `تم رفض إيصال الدفع للطلب ${order.id} للعميل (${order.clientName}) مع إرفاق الملاحظة.`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, order });
});

app.post('/api/admin/orders/reply', checkAdminAuth, (req, res) => {
  const { orderId, replyText } = req.body;
  const order = serviceOrdersStore.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
  }

  order.writtenReply = replyText;
  order.status = 'completed';

  activityLogsStore.unshift({
    id: `ACT-${Date.now()}`,
    type: "reply_sent",
    user: "الشيخ أحمد الشريف",
    details: `تم إرسال رد التفسير الرسمي للعميل (${order.clientName}) للطلب ${order.id}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, order });
});

app.post('/api/admin/orders/update-status', checkAdminAuth, (req, res) => {
  const { orderId, status } = req.body;
  const order = serviceOrdersStore.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
  }

  order.status = status;
  res.json({ success: true, order });
});


// Start Server & Integrate Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ExplainingDream server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
