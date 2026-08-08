import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  runTransaction
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  gender?: string;
  maritalStatus?: string;
  role: string;
  planName?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  dreamsSubmittedCount?: number;
  freeDreamsUsed?: number;
  totalSpentUsd?: number;
  status?: string;
  createdAt?: string;
  lastActive?: string;
  lastEnteredDream?: string;
  provider?: string;
  [key: string]: any;
}

export interface Dream {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  gender?: string;
  maritalStatus?: string;
  dreamText: string;
  status: string;
  createdAt: string;
  aiResponseSummary?: string;
  expertReply?: string;
  source?: string;
  [key: string]: any;
}

export interface Order {
  id: string;
  serviceId?: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  dreamText?: string;
  maritalStatus?: string;
  amountPaid: number;
  couponCode?: string | null;
  status: string;
  createdAt: string;
  deliveryType?: string;
  paymentReceiptUrl?: string;
  paymentReceiptNote?: string;
  receiptUploadedAt?: string;
  adminConfirmNote?: string;
  writtenReply?: string;
  [key: string]: any;
}

export interface GiftCode {
  id: string;
  code: string;
  purchaserName: string;
  purchaserEmail: string;
  serviceType?: string;
  serviceTitle?: string;
  amountPaid?: number;
  status: string;
  recipientNote?: string;
  redeemedByFriendName?: string;
  redeemedByFriendEmail?: string;
  redeemedAt?: string;
  createdAt: string;
  [key: string]: any;
}

export interface ReferralLog {
  referralCode: string;
  referralCount: number;
  referralLogs: Array<{
    friendName: string;
    friendEmail: string;
    joinedAt: string;
  }>;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  channel?: string;
  subscriberCode?: string;
  status?: string;
  userName?: string;
  welcomeBonusCode?: string;
  [key: string]: any;
}

export interface ActivityLog {
  id: string;
  type: string;
  user: string;
  details: string;
  timestamp: string;
  meta?: any;
}

export interface SiteSettings {
  aiModel?: string;
  dailyFreeLimit?: number;
  maintenanceMode?: boolean;
  whatsappNumber?: string;
  welcomeMessage?: string;
  writtenServicePrice?: number;
  audioServicePrice?: number;
  sessionServicePrice?: number;
  vipMonthlyPrice?: number;
  bookPdfPrice?: number;
  bookPrintPrice?: number;
  activeCouponCode?: string;
  discountPercentage?: number;
  vodafoneCashNumber?: string;
  instapayUsername?: string;
  bankIbanDetails?: string;
  paypalEmail?: string;
  westernUnionInfo?: string;
  supportPhone?: string;
  supportEmail?: string;
  [key: string]: any;
}

// Load Firebase configuration
function loadFirebaseConfig() {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const configStr = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configStr);
    }
  } catch (err) {
    console.error('Failed to load firebase-applet-config.json:', err);
  }
  return {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDummyKeyForInitialization",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "enduring-maker-bdw77.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "enduring-maker-bdw77",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "enduring-maker-bdw77.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: process.env.FIREBASE_APP_ID || "1:1234567890:web:abcdef"
  };
}

const firebaseConfig = loadFirebaseConfig();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);

// Collection References
const USERS_COL = 'users';
const DREAMS_COL = 'dreams';
const ORDERS_COL = 'orders';
const SETTINGS_COL = 'systemSettings';
const GIFT_CODES_COL = 'giftCodes';
const REFERRALS_COL = 'referrals';
const SUBSCRIBERS_COL = 'subscribers';
const DIGEST_COL = 'newsletterDigest';
const ACTIVITY_LOGS_COL = 'activityLogs';

// ==================== DEFAULT INITIAL SEED DATA ====================
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  aiModel: "gemini-2.5-flash",
  dailyFreeLimit: 3,
  maintenanceMode: false,
  whatsappNumber: "+201558955525",
  welcomeMessage: "أهلاً بكم في منصة ExplainingDream.com لتأويل الأحلام وفق قواعد كتاب (تأويلات روحية) للباحث أحمد الشريف (طبعة 2026).",
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

const DEFAULT_USERS: User[] = [
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

const DEFAULT_ORDERS: Order[] = [
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

const DEFAULT_DREAMS: Dream[] = [
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

const DEFAULT_GIFT_CODES: GiftCode[] = [
  {
    id: "GIFT-1001",
    code: "VIP-GOLD-2026",
    serviceTitle: "بطاقة اهداء عضوية VIP الذهبية 30 يوماً",
    amountPaid: 19,
    purchaserName: "د. عبد الله المالكي",
    purchaserEmail: "a.malki@gmail.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: "GIFT-1002",
    code: "GIFT-AUDIO-FREE",
    serviceTitle: "بطاقة اهداء خدمة تفسير صوتي مسجل",
    amountPaid: 49,
    purchaserName: "سارة العتيبي",
    purchaserEmail: "sara.otaibi@yahoo.com",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];

// Initialize and Seed Firestore Database if empty
let isInitialized = false;
export async function initializeDatabase() {
  if (isInitialized) return;

  try {
    // Check if settings doc exists
    const settingsDoc = await getDoc(doc(db, SETTINGS_COL, 'site_settings'));
    if (!settingsDoc.exists()) {
      console.log('Seeding initial site settings to Firestore...');
      await setDoc(doc(db, SETTINGS_COL, 'site_settings'), DEFAULT_SITE_SETTINGS);
    }

    // Check users
    const usersSnap = await getDocs(collection(db, USERS_COL));
    if (usersSnap.empty) {
      console.log('Seeding initial users to Firestore...');
      for (const u of DEFAULT_USERS) {
        await setDoc(doc(db, USERS_COL, u.id), u);
      }
    } else {
      // Ensure main admin account exists and has admin role
      const adminDoc = await getDoc(doc(db, USERS_COL, 'ADMIN-001'));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, USERS_COL, 'ADMIN-001'), DEFAULT_USERS[0]);
      }
    }

    // Check orders
    const ordersSnap = await getDocs(collection(db, ORDERS_COL));
    if (ordersSnap.empty) {
      console.log('Seeding initial orders to Firestore...');
      for (const o of DEFAULT_ORDERS) {
        await setDoc(doc(db, ORDERS_COL, o.id), o);
      }
    }

    // Check dreams
    const dreamsSnap = await getDocs(collection(db, DREAMS_COL));
    if (dreamsSnap.empty) {
      console.log('Seeding initial dreams to Firestore...');
      for (const d of DEFAULT_DREAMS) {
        await setDoc(doc(db, DREAMS_COL, d.id), d);
      }
    }

    // Check gift codes
    const giftCodesSnap = await getDocs(collection(db, GIFT_CODES_COL));
    if (giftCodesSnap.empty) {
      console.log('Seeding initial gift codes to Firestore...');
      for (const g of DEFAULT_GIFT_CODES) {
        await setDoc(doc(db, GIFT_CODES_COL, g.id), g);
      }
    }

    isInitialized = true;
    console.log('✅ Firestore Database Initialized & Synced Successfully.');
  } catch (err) {
    console.error('❌ Error initializing Firestore database:', err);
  }
}

// ==================== SITE SETTINGS ====================
export async function getSiteSettings(): Promise<SiteSettings> {
  await initializeDatabase();
  try {
    const snap = await getDoc(doc(db, SETTINGS_COL, 'site_settings'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
  } catch (err) {
    console.error('getSiteSettings error:', err);
  }
  return DEFAULT_SITE_SETTINGS;
}

export async function updateSiteSettings(newSettings: Record<string, any>): Promise<SiteSettings> {
  await initializeDatabase();
  try {
    const current = await getSiteSettings();
    const updated = { ...current, ...newSettings };
    await setDoc(doc(db, SETTINGS_COL, 'site_settings'), updated);
    return updated;
  } catch (err) {
    console.error('updateSiteSettings error:', err);
    throw err;
  }
}

// ==================== USERS / CUSTOMERS ====================
export async function getAllUsers(): Promise<User[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, USERS_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as User));
  } catch (err) {
    console.error('getAllUsers error:', err);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  await initializeDatabase();
  try {
    const snap = await getDoc(doc(db, USERS_COL, id));
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as User;
    }
  } catch (err) {
    console.error('getUserById error:', err);
  }
  return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeDatabase();
  try {
    const q = query(collection(db, USERS_COL), where('email', '==', email.toLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { ...docSnap.data(), id: docSnap.id } as User;
    }
  } catch (err) {
    console.error('getUserByEmail error:', err);
  }
  return null;
}

export async function saveUser(user: Partial<User>): Promise<User> {
  await initializeDatabase();
  try {
    const userId = user.id || `CUST-${Date.now().toString().slice(-4)}`;
    const userData: User = {
      id: userId,
      name: user.name || 'عميل',
      email: user.email ? user.email.toLowerCase() : '',
      phone: user.phone || '',
      password: user.password || '123456',
      gender: user.gender || 'female',
      maritalStatus: user.maritalStatus || 'single',
      role: user.role || 'member',
      planName: user.planName || 'خطة العضو',
      subscriptionStartDate: user.subscriptionStartDate || new Date().toISOString(),
      subscriptionEndDate: user.subscriptionEndDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      dreamsSubmittedCount: user.dreamsSubmittedCount || 0,
      totalSpentUsd: user.totalSpentUsd || 0,
      status: user.status || 'active',
      createdAt: user.createdAt || new Date().toISOString(),
      lastActive: user.lastActive || 'الآن',
      provider: user.provider || 'direct',
      ...user
    };
    await setDoc(doc(db, USERS_COL, userId), userData);
    return userData;
  } catch (err) {
    console.error('saveUser error:', err);
    throw err;
  }
}

export async function updateUser(id: string, updates: Record<string, any>): Promise<User> {
  await initializeDatabase();
  try {
    const userRef = doc(db, USERS_COL, id);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      throw new Error(`User ${id} not found`);
    }
    const updated = { ...snap.data(), ...updates, updatedAt: new Date().toISOString() } as unknown as User;
    await setDoc(userRef, updated);
    return updated;
  } catch (err) {
    console.error('updateUser error:', err);
    throw err;
  }
}

// Atomic increment for free dream usage
export async function incrementUserDreamUsage(id: string) {
  await initializeDatabase();
  return await runTransaction(db, async (transaction) => {
    const userRef = doc(db, USERS_COL, id);
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error(`User ${id} not found`);
    }
    const data = userSnap.data() as User;
    const currentCount = data.dreamsSubmittedCount || 0;
    const currentFreeUsed = data.freeDreamsUsed || 0;
    
    transaction.update(userRef, {
      dreamsSubmittedCount: currentCount + 1,
      freeDreamsUsed: currentFreeUsed + 1,
      lastActive: "الآن",
      updatedAt: new Date().toISOString()
    });

    return {
      ...data,
      dreamsSubmittedCount: currentCount + 1,
      freeDreamsUsed: currentFreeUsed + 1
    };
  });
}

// ==================== DREAMS ====================
export async function getAllDreams(): Promise<Dream[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, DREAMS_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Dream));
  } catch (err) {
    console.error('getAllDreams error:', err);
    return [];
  }
}

export async function getDreamById(id: string): Promise<Dream | null> {
  await initializeDatabase();
  try {
    const snap = await getDoc(doc(db, DREAMS_COL, id));
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as Dream;
    }
  } catch (err) {
    console.error('getDreamById error:', err);
  }
  return null;
}

export async function getDreamsByUserId(userId: string): Promise<Dream[]> {
  await initializeDatabase();
  try {
    const q = query(collection(db, DREAMS_COL), where('clientId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Dream));
  } catch (err) {
    console.error('getDreamsByUserId error:', err);
    return [];
  }
}

export async function getDreamsByUserEmail(email: string): Promise<Dream[]> {
  await initializeDatabase();
  try {
    const q = query(collection(db, DREAMS_COL), where('clientEmail', '==', email.toLowerCase()));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Dream));
  } catch (err) {
    console.error('getDreamsByUserEmail error:', err);
    return [];
  }
}

export async function saveDream(dream: Partial<Dream>): Promise<Dream> {
  await initializeDatabase();
  try {
    const dreamId = dream.id || `DREAM-${Date.now()}`;
    const dreamData: Dream = {
      id: dreamId,
      clientId: dream.clientId || '',
      clientName: dream.clientName || 'عميل',
      clientEmail: dream.clientEmail ? dream.clientEmail.toLowerCase() : '',
      clientPhone: dream.clientPhone || '',
      gender: dream.gender || 'female',
      maritalStatus: dream.maritalStatus || 'single',
      dreamText: dream.dreamText || '',
      status: dream.status || 'unread',
      createdAt: dream.createdAt || new Date().toISOString(),
      aiResponseSummary: dream.aiResponseSummary || '',
      expertReply: dream.expertReply || '',
      source: dream.source || 'ai_interpreter',
      ...dream
    };
    await setDoc(doc(db, DREAMS_COL, dreamId), dreamData);
    return dreamData;
  } catch (err) {
    console.error('saveDream error:', err);
    throw err;
  }
}

export async function updateDream(id: string, updates: Record<string, any>): Promise<Dream> {
  await initializeDatabase();
  try {
    const dreamRef = doc(db, DREAMS_COL, id);
    const snap = await getDoc(dreamRef);
    if (!snap.exists()) {
      throw new Error(`Dream ${id} not found`);
    }
    const updated = { ...snap.data(), ...updates, updatedAt: new Date().toISOString() } as unknown as Dream;
    await setDoc(dreamRef, updated);
    return updated;
  } catch (err) {
    console.error('updateDream error:', err);
    throw err;
  }
}

// ==================== ORDERS ====================
export async function getAllOrders(): Promise<Order[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, ORDERS_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
  } catch (err) {
    console.error('getAllOrders error:', err);
    return [];
  }
}

export async function getOrdersByUserEmail(email: string): Promise<Order[]> {
  await initializeDatabase();
  try {
    const q = query(collection(db, ORDERS_COL), where('clientEmail', '==', email.toLowerCase()));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
  } catch (err) {
    console.error('getOrdersByUserEmail error:', err);
    return [];
  }
}

export async function saveOrder(order: Partial<Order>): Promise<Order> {
  await initializeDatabase();
  try {
    const orderId = order.id || `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const orderData: Order = {
      id: orderId,
      serviceId: order.serviceId || 'srv-custom',
      serviceTitle: order.serviceTitle || 'خدمة تفسير',
      clientName: order.clientName || 'عميل',
      clientEmail: order.clientEmail ? order.clientEmail.toLowerCase() : '',
      clientPhone: order.clientPhone || '',
      dreamText: order.dreamText || '',
      maritalStatus: order.maritalStatus || 'single',
      amountPaid: order.amountPaid || 0,
      couponCode: order.couponCode || null,
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString(),
      deliveryType: order.deliveryType || 'written',
      ...order
    };
    await setDoc(doc(db, ORDERS_COL, orderId), orderData);
    return orderData;
  } catch (err) {
    console.error('saveOrder error:', err);
    throw err;
  }
}

export async function updateOrder(id: string, updates: Record<string, any>): Promise<Order> {
  await initializeDatabase();
  try {
    const orderRef = doc(db, ORDERS_COL, id);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      throw new Error(`Order ${id} not found`);
    }
    const updated = { ...snap.data(), ...updates, updatedAt: new Date().toISOString() } as unknown as Order;
    await setDoc(orderRef, updated);
    return updated;
  } catch (err) {
    console.error('updateOrder error:', err);
    throw err;
  }
}

// ==================== GIFT CODES ====================
export async function getAllGiftCodes(): Promise<GiftCode[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, GIFT_CODES_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as GiftCode));
  } catch (err) {
    console.error('getAllGiftCodes error:', err);
    return [];
  }
}

export async function getGiftCodeByCode(code: string): Promise<GiftCode | null> {
  await initializeDatabase();
  try {
    const q = query(collection(db, GIFT_CODES_COL), where('code', '==', code.trim().toUpperCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as GiftCode;
    }
  } catch (err) {
    console.error('getGiftCodeByCode error:', err);
  }
  return null;
}

export async function saveGiftCode(giftCode: Partial<GiftCode>): Promise<GiftCode> {
  await initializeDatabase();
  try {
    const id = giftCode.id || `GIFT-${Date.now()}`;
    const codeData: GiftCode = {
      id,
      code: giftCode.code || `GIFT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      purchaserName: giftCode.purchaserName || 'عميل',
      purchaserEmail: giftCode.purchaserEmail ? giftCode.purchaserEmail.toLowerCase() : '',
      serviceTitle: giftCode.serviceTitle || 'بطاقة إهداء',
      amountPaid: giftCode.amountPaid || 0,
      status: giftCode.status || 'active',
      createdAt: giftCode.createdAt || new Date().toISOString(),
      ...giftCode
    };
    await setDoc(doc(db, GIFT_CODES_COL, id), codeData);
    return codeData;
  } catch (err) {
    console.error('saveGiftCode error:', err);
    throw err;
  }
}

export async function updateGiftCode(id: string, updates: Record<string, any>): Promise<GiftCode> {
  await initializeDatabase();
  try {
    const ref = doc(db, GIFT_CODES_COL, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error(`Gift code ${id} not found`);
    }
    const updated = { ...snap.data(), ...updates } as unknown as GiftCode;
    await setDoc(ref, updated);
    return updated;
  } catch (err) {
    console.error('updateGiftCode error:', err);
    throw err;
  }
}

// ==================== REFERRALS ====================
export async function getReferralLog(email: string): Promise<ReferralLog | null> {
  await initializeDatabase();
  try {
    const snap = await getDoc(doc(db, REFERRALS_COL, email.toLowerCase()));
    if (snap.exists()) {
      return snap.data() as ReferralLog;
    }
  } catch (err) {
    console.error('getReferralLog error:', err);
  }
  return null;
}

export async function saveReferralLog(email: string, logData: ReferralLog): Promise<ReferralLog> {
  await initializeDatabase();
  try {
    await setDoc(doc(db, REFERRALS_COL, email.toLowerCase()), logData);
    return logData;
  } catch (err) {
    console.error('saveReferralLog error:', err);
    throw err;
  }
}

// ==================== NEWSLETTER SUBSCRIBERS ====================
export async function getAllSubscribers(): Promise<Subscriber[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, SUBSCRIBERS_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Subscriber));
  } catch (err) {
    console.error('getAllSubscribers error:', err);
    return [];
  }
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  await initializeDatabase();
  try {
    const cleanEmail = email.toLowerCase().trim();
    const id = `SUB-${Date.now()}`;
    const newSub: Subscriber = {
      id,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      channel: 'email',
      subscriberCode: `NEWS-2026-X${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      welcomeBonusCode: 'NEWS-BONUS-2026'
    };
    await setDoc(doc(db, SUBSCRIBERS_COL, id), newSub);
    return newSub;
  } catch (err) {
    console.error('addSubscriber error:', err);
    throw err;
  }
}

// ==================== NEWSLETTER DIGEST ====================
export async function getNewsletterDigest(): Promise<Record<string, any>> {
  await initializeDatabase();
  try {
    const snap = await getDoc(doc(db, DIGEST_COL, 'weekly_digest'));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.error('getNewsletterDigest error:', err);
  }
  return {
    title: "الملف الإخباري الروحي المتجدد والمستجدات الشاملة",
    subtitle: "النشرة البريدية الرسمية لمنصة ExplainingDream.com - طبعة 2026",
    author: "الشيخ والباحث د. أحمد الشريف",
    lastUpdated: new Date().toISOString(),
    welcomeMessage: "أهلاً ومرحباً بك في النشرة الروحية البريدية المعتمدة. يسعدنا انضمامك لمجتمع منصة ExplainingDream.com لتلقي أحدث الأبحاث وتنبيهات الدروس المباشرة والبشائر المنامية.",
    breakingNews: "تحديث طبعة 2026 لكتاب (تأويلات روحية): تم رفع 120 فصلاً جديداً وموسوعة الرموز القرآنية المباشرة، مع تفعيل خدمة التفسير الصوتي الفوري عبر الواتساب والذكاء الاصطناعي.",
    featuredArticles: [
      { id: "art-1", title: "تأويل رؤية المطر والغيث في المنام وفق كتاب 2026", snippet: "دراسة تأويلية شاملة حول رمز المطر في المنام وعلاقته بالرحمة والرزق الجاري وتفريج الكروب..." },
      { id: "art-2", title: "دليل فهم الرموز المركبة في الرؤى المنامية", snippet: "كيف تجمع بين عدة رموز متضادة أو متتابعة لتصل إلى التأويل الدقيق بالاعتماد على سياق الرائي..." }
    ],
    nextBroadcastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
  };
}

export async function updateNewsletterDigest(digestData: any): Promise<Record<string, any>> {
  await initializeDatabase();
  try {
    await setDoc(doc(db, DIGEST_COL, 'weekly_digest'), digestData);
    return digestData;
  } catch (err) {
    console.error('updateNewsletterDigest error:', err);
    throw err;
  }
}

// ==================== ACTIVITY LOGS ====================
export async function logActivity(type: string, user: string, details: string): Promise<ActivityLog> {
  await initializeDatabase();
  const id = `ACT-${Date.now()}`;
  const log: ActivityLog = { id, type, user, details, timestamp: new Date().toISOString() };
  try {
    await setDoc(doc(db, ACTIVITY_LOGS_COL, id), log);
  } catch (err) {
    console.error('logActivity error:', err);
  }
  return log;
}

export async function getAllActivityLogs(): Promise<ActivityLog[]> {
  await initializeDatabase();
  try {
    const snap = await getDocs(collection(db, ACTIVITY_LOGS_COL));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as ActivityLog));
  } catch (err) {
    console.error('getAllActivityLogs error:', err);
    return [];
  }
}
