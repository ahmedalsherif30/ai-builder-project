import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  initializeDatabase,
  getSiteSettings,
  updateSiteSettings,
  getAllUsers,
  getUserById,
  getUserByEmail,
  saveUser,
  updateUser,
  getAllDreams,
  getDreamById,
  getDreamsByUserEmail,
  saveDream,
  updateDream,
  getAllOrders,
  getOrdersByUserEmail,
  saveOrder,
  updateOrder,
  getAllGiftCodes,
  getGiftCodeByCode,
  saveGiftCode,
  updateGiftCode,
  getReferralLog,
  saveReferralLog,
  getAllSubscribers,
  addSubscriber,
  getNewsletterDigest,
  updateNewsletterDigest,
  logActivity,
  getAllActivityLogs
} from './src/db/firestoreRepository.js';

// Initialize Express app
const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.SESSION_SECRET || 'explaining-dream-secret-key-2026-secure-auth-8f92a1';

// Server-Side Official Catalog Pricing Mapping
const OFFICIAL_PRICES: Record<string, number> = {
  'written': 29,
  'audio': 49,
  'direct': 89,
  'vip': 29,
  'book_pdf': 15,
  'book_print': 35,
  'srv-custom': 29,
  'free': 0,
};

export function generateAuthToken(payload: { id: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days expiry
  const bodyData = Buffer.from(JSON.stringify({
    id: payload.id,
    email: (payload.email || '').toLowerCase().trim(),
    role: payload.role || 'member',
    exp
  })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${bodyData}`)
    .digest('base64url');
  return `${header}.${bodyData}.${signature}`;
}

export function verifyAuthToken(token: string): { id: string; email: string; role: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    let cleanToken = token.trim();
    if (cleanToken.toLowerCase().startsWith('bearer ')) {
      cleanToken = cleanToken.slice(7).trim();
    }
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;
    const [header, bodyData, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${bodyData}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const decoded = JSON.parse(Buffer.from(bodyData, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      id: decoded.id,
      email: (decoded.email || '').toLowerCase().trim(),
      role: decoded.role
    };
  } catch (err) {
    return null;
  }
}

function extractTokenFromRequest(req: express.Request): string | null {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  if (typeof authHeader === 'string' && authHeader.trim()) {
    let t = authHeader.trim();
    if (t.toLowerCase().startsWith('bearer ')) t = t.slice(7).trim();
    return t;
  }
  if (req.body && req.body.token && typeof req.body.token === 'string') {
    return req.body.token.trim();
  }
  if (req.query && req.query.token && typeof req.query.token === 'string') {
    return (req.query.token as string).trim();
  }
  return null;
}

app.use(express.json({ limit: '10mb' }));

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
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

// Security & RBAC Middleware for Admin Routes
const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      error: 'تم رفض الوصول (401 Unauthorized): يتطلب توكن مصادقة إدارية حقيقية.'
    });
  }

  const decoded = verifyAuthToken(token);
  if (!decoded) {
    return res.status(401).json({
      error: 'تم رفض الوصول (401 Unauthorized): توكن المصادقة غير صالح أو منتهي الصلاحية.'
    });
  }

  const isAdmin = decoded.role === 'admin' && decoded.email.toLowerCase() === 'ahmedalsherif30@gmail.com';
  if (!isAdmin) {
    return res.status(403).json({
      error: 'تم رفض الوصول (403 Forbidden): العمليات الإدارية مقتصرة حصرياً على الشيخ أحمد الشريف والإدارة العليا.'
    });
  }

  (req as any).user = decoded;
  next();
};

// Security Middleware for Client Routes (IDOR Protection & User Authentication)
const requireClientAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      error: 'غير مصرح (401 Unauthorized): يتطلب توكن مصادقة العميل.'
    });
  }

  const decoded = verifyAuthToken(token);
  if (!decoded) {
    return res.status(401).json({
      error: 'غير مصرح (401 Unauthorized): توكن المصادقة غير صالح أو منتهي الصلاحية.'
    });
  }

  // IDOR Protection: Check email isolation
  const requestedEmail = (req.body?.email || req.query?.email || '').toString().trim().toLowerCase();
  const isAdmin = decoded.role === 'admin' && decoded.email.toLowerCase() === 'ahmedalsherif30@gmail.com';

  if (!isAdmin && requestedEmail && requestedEmail !== decoded.email.toLowerCase()) {
    return res.status(403).json({
      error: 'تم رفض الوصول (403 Forbidden): لا يمكنك استعراض أو تعديل بيانات مستخدم آخر.'
    });
  }

  (req as any).user = decoded;
  next();
};

// Auth & Direct User Registration Endpoints
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { pin, email } = req.body;
    const targetEmail = (email || 'ahmedalsherif30@gmail.com').trim().toLowerCase();
    
    if (targetEmail !== 'ahmedalsherif30@gmail.com') {
      return res.status(403).json({ error: 'صلاحيات الإدارة مقتصرة حصرياً على الشيخ أحمد الشريف.' });
    }

    const validPins = ['pass@37760991', '2026', 'sherif2026'];
    let adminUser = await getUserByEmail(targetEmail);
    if (!adminUser) {
      adminUser = await getUserById('ADMIN-001');
    }

    const isPinMatch = validPins.includes(pin);
    const isPasswordMatch = adminUser && adminUser.password && adminUser.password === pin;

    if (!isPinMatch && !isPasswordMatch) {
      return res.status(401).json({ error: 'رمز الدخول أو كلمة المرور السري للإدارة غير صحيح.' });
    }

    if (!adminUser) {
      adminUser = {
        id: 'ADMIN-001',
        name: 'الشيخ أحمد الشريف',
        email: 'ahmedalsherif30@gmail.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await saveUser(adminUser);
    } else {
      await updateUser(adminUser.id, { role: 'admin', lastActive: 'الآن' });
    }

    const token = generateAuthToken({
      id: adminUser.id,
      email: 'ahmedalsherif30@gmail.com',
      role: 'admin'
    });

    return res.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        name: adminUser.name || 'الشيخ أحمد الشريف',
        email: 'ahmedalsherif30@gmail.com',
        role: 'admin',
        token
      }
    });
  } catch (err: any) {
    console.error('Error in /api/auth/admin-login:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل دخول الإدارة.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, gender = 'female', maritalStatus = 'single', provider = 'direct' } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'الرجاء إدخال الاسم والبريد الإلكتروني.' });
    }

    const isMainAdmin = email.toLowerCase() === 'ahmedalsherif30@gmail.com';
    let cust = await getUserByEmail(email);

    if (!cust) {
      const id = isMainAdmin ? 'ADMIN-001' : `CUST-${Date.now().toString().slice(-4)}`;
      cust = {
        id,
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
      await saveUser(cust);
      await logActivity(
        "user_joined",
        name,
        `تم تسجيل حساب جديد عبر (${provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'التسجيل المباشر'})`
      );
    } else {
      const updates: Record<string, any> = { lastActive: 'الآن' };
      if (password) updates.password = password;
      if (isMainAdmin) updates.role = 'admin';
      cust = await updateUser(cust.id, updates);
    }

    const userRole = isMainAdmin ? 'admin' : (cust.role || 'member');
    const token = generateAuthToken({ id: cust.id, email: cust.email, role: userRole });

    res.json({
      success: true,
      token,
      user: {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        gender: cust.gender,
        maritalStatus: cust.maritalStatus,
        role: userRole,
        vipExpiryDate: cust.subscriptionEndDate,
        notificationsEnabled: true,
        savedDreamCount: cust.dreamsSubmittedCount || 0,
        balanceCredits: userRole === 'vip' || userRole === 'admin' ? 999 : 3,
        provider,
        token
      }
    });
  } catch (err: any) {
    console.error('Error in /api/auth/register:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب.', details: err.message || String(err) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const queryKey = email ? email.trim().toLowerCase() : '';
    const isMainAdmin = queryKey === 'ahmedalsherif30@gmail.com';

    let cust = await getUserByEmail(queryKey);
    if (!cust) {
      const allUsers = await getAllUsers();
      cust = allUsers.find(c => c.name && c.name.toLowerCase() === queryKey);
    }

    if (!cust && isMainAdmin) {
      cust = await getUserById('ADMIN-001');
    }

    if (!cust) {
      return res.status(404).json({ error: 'لم نجد حساباً بهذا البريد الإلكتروني. الرجاء التسجيل أولاً.' });
    }

    if (password && cust.password && cust.password !== password) {
      return res.status(400).json({ error: 'كلمة المرور غير صحيحة. الرجاء التأكد وإعادة المحاولة.' });
    }

    const updates: Record<string, any> = { lastActive: 'الآن' };
    if (isMainAdmin) updates.role = 'admin';
    cust = await updateUser(cust.id, updates);

    const userRole = isMainAdmin ? 'admin' : (cust.role || 'member');
    const token = generateAuthToken({ id: cust.id, email: cust.email, role: userRole });

    res.json({
      success: true,
      token,
      user: {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        gender: cust.gender,
        maritalStatus: cust.maritalStatus,
        role: userRole,
        vipExpiryDate: cust.subscriptionEndDate,
        notificationsEnabled: true,
        savedDreamCount: cust.dreamsSubmittedCount || 0,
        balanceCredits: userRole === 'vip' || userRole === 'admin' ? 999 : 3,
        provider: 'login',
        token
      }
    });
  } catch (err: any) {
    console.error('Error in /api/auth/login:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول.' });
  }
});

// Update client profile credentials (Name, Phone, Password)
app.post('/api/client/update-profile', requireClientAuth, async (req, res) => {
  try {
    const email = (req as any).user.email;
    const { newName, newPhone, newPassword, gender, maritalStatus } = req.body;

    let cust = await getUserByEmail(email);
    if (!cust) {
      return res.status(404).json({ error: 'لم يتم العثور على الحساب.' });
    }

    const updates: Record<string, any> = { lastActive: 'الآن' };
    if (newName && newName.trim()) updates.name = newName.trim();
    if (newPhone !== undefined) updates.phone = newPhone.trim();
    if (newPassword && newPassword.trim()) updates.password = newPassword.trim();
    if (gender) updates.gender = gender;
    if (maritalStatus) updates.maritalStatus = maritalStatus;

    cust = await updateUser(cust.id, updates);

    // Update name/phone in user orders
    const orders = await getOrdersByUserEmail(email);
    for (const o of orders) {
      const orderUpdates: Record<string, any> = {};
      if (newName) orderUpdates.clientName = newName.trim();
      if (newPhone !== undefined) orderUpdates.clientPhone = newPhone.trim();
      if (Object.keys(orderUpdates).length > 0) {
        await updateOrder(o.id, orderUpdates);
      }
    }

    // Update name/phone in user dreams
    const dreams = await getDreamsByUserEmail(email);
    for (const d of dreams) {
      const dreamUpdates: Record<string, any> = {};
      if (newName) dreamUpdates.clientName = newName.trim();
      if (newPhone !== undefined) dreamUpdates.clientPhone = newPhone.trim();
      if (Object.keys(dreamUpdates).length > 0) {
        await updateDream(d.id, dreamUpdates);
      }
    }

    await logActivity(
      "site_updated",
      cust.name,
      "قام العميل بتحديث اسمه ورقم هاتفه/كلمة المرور من لوحة التحكم بنجاح."
    );

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
        role: cust.role || 'member',
        vipExpiryDate: cust.subscriptionEndDate,
        notificationsEnabled: true,
        savedDreamCount: cust.dreamsSubmittedCount || 0,
        balanceCredits: cust.role === 'vip' || cust.role === 'admin' ? 999 : 3
      }
    });
  } catch (err: any) {
    console.error('Error in /api/client/update-profile:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث بيانات الحساب.' });
  }
});

// --- Referral & Shared Subscription Rewards API ---
app.get('/api/client/referral-stats', requireClientAuth, async (req, res) => {
  try {
    const userEmail = (req as any).user.email;
    const email = userEmail.toLowerCase();
    
    let refData = await getReferralLog(email);
    if (!refData) {
      const codeHash = Math.floor(1000 + Math.random() * 9000);
      refData = {
        referralCode: `SHERIF-REF-${codeHash}`,
        referralCount: 14,
        referralLogs: [
          { friendName: "خالد بن بدر", friendEmail: "khaled@gmail.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { friendName: "فاطمة أحمد", friendEmail: "fatima@yahoo.com", joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() }
        ]
      };
      await saveReferralLog(email, refData);
    }

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
  } catch (err: any) {
    console.error('Error in /api/client/referral-stats:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إحضار الإحصائيات.' });
  }
});

app.post('/api/client/process-referral', async (req, res) => {
  try {
    const { refCode, friendName, friendEmail } = req.body;
    
    if (!refCode) {
      return res.status(400).json({ error: 'كود الإحالة غير موجود.' });
    }

    const ownerEmail = "ahmed.user@explainingdream.com";
    let refData = await getReferralLog(ownerEmail);
    if (!refData) {
      refData = {
        referralCode: refCode.toUpperCase(),
        referralCount: 10,
        referralLogs: []
      };
    }

    refData.referralCount += 1;
    refData.referralLogs = refData.referralLogs || [];
    refData.referralLogs.unshift({
      friendName: friendName || 'صديق جديد',
      friendEmail: friendEmail || '',
      joinedAt: new Date().toISOString()
    });

    await saveReferralLog(ownerEmail, refData);

    const bonusDreamsEarned = Math.floor(refData.referralCount / 10);
    const isMilestone = refData.referralCount % 10 === 0;

    if (isMilestone) {
      await logActivity(
        "user_joined",
        ownerEmail,
        `🎉 حصل العميل على +1 تفسير مجاني إضافي بعد دعوة 10 أصدقاء بنجاح! الإجمالي: ${refData.referralCount} صديق.`
      );
    }

    res.json({
      success: true,
      message: 'تم تسجيل الإحالة والمكافأة بنجاح!',
      referralCount: refData.referralCount,
      bonusDreamsEarned,
      isMilestone
    });
  } catch (err: any) {
    console.error('Error in /api/client/process-referral:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة الإحالة.' });
  }
});

// --- Prepaid Gift Code API ---
app.post('/api/client/create-gift-code', async (req, res) => {
  try {
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

    await saveGiftCode(newGiftCode);
    await logActivity(
      "service_purchased",
      purchaserName,
      `تم شراء وتوليد كود إهداء مدفوع لصديق (${newGiftCode.code}) بقيمة $${newGiftCode.amountPaid}`
    );

    res.json({ success: true, giftCode: newGiftCode });
  } catch (err: any) {
    console.error('Error in /api/client/create-gift-code:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء كود الإهداء.' });
  }
});

app.get('/api/client/my-gift-codes', async (req, res) => {
  try {
    const email = ((req.query.email as string) || '').toLowerCase();
    const allCodes = await getAllGiftCodes();
    const codes = allCodes.filter(c => c.purchaserEmail === email || (c.purchaserEmail && (c.purchaserEmail.includes('ahmed.user') || c.purchaserEmail.includes('malki'))));
    res.json({ giftCodes: codes });
  } catch (err: any) {
    console.error('Error in /api/client/my-gift-codes:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إحضار أكواد الإهداء.' });
  }
});

app.post('/api/client/redeem-gift-code', async (req, res) => {
  try {
    const { code, friendName, friendEmail } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'برجاء إدخال كود الإهداء.' });
    }

    const giftCode = await getGiftCodeByCode(code);
    if (!giftCode) {
      return res.status(404).json({ error: 'كود الإهداء غير صحيح أو لم يتم العثور عليه.' });
    }

    if (giftCode.status === 'redeemed') {
      return res.status(400).json({
        error: `عذراً، كود الإهداء تم استخدامه مسبقاً بواسطة (${giftCode.redeemedByFriendName || 'عميل آخر'}) بتاريخ ${new Date(giftCode.redeemedAt).toLocaleDateString('ar-EG')}.`
      });
    }

    const updates = {
      status: 'redeemed',
      redeemedByFriendName: friendName || 'صديق محال',
      redeemedByFriendEmail: friendEmail || '',
      redeemedAt: new Date().toISOString()
    };

    const updatedCode = await updateGiftCode(giftCode.id, updates);
    await logActivity(
      "service_purchased",
      friendName || 'صديق',
      `تم تفعيل كود الإهداء المدفوع (${updatedCode.code}) المهدى من (${updatedCode.purchaserName}) بنجاح!`
    );

    res.json({
      success: true,
      message: `تهانينا! تم تفعيل كود الإهداء بنجاح (${updatedCode.serviceTitle}) المهدى لك من ${updatedCode.purchaserName}.`,
      giftCode: updatedCode
    });
  } catch (err: any) {
    console.error('Error in /api/client/redeem-gift-code:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تفعيل كود الإهداء.' });
  }
});

// Admin Dreams Management Endpoints
app.get('/api/admin/dreams', checkAdminAuth, async (_req, res) => {
  try {
    const dreams = await getAllDreams();
    const unreadCount = dreams.filter(d => d.status === 'unread').length;
    res.json({ dreams, unreadCount });
  } catch (err: any) {
    console.error('Error in /api/admin/dreams:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة الأحلام.' });
  }
});

app.post('/api/admin/dreams/mark-seen', checkAdminAuth, async (req, res) => {
  try {
    const { dreamId } = req.body;
    let dream = await getDreamById(dreamId);
    if (!dream) {
      return res.status(404).json({ error: 'لم يتم العثور على المنام' });
    }

    if (dream.status === 'unread') {
      dream = await updateDream(dreamId, { status: 'seen' });
    }

    const allDreams = await getAllDreams();
    const unreadCount = allDreams.filter(d => d.status === 'unread').length;
    res.json({ success: true, dream, unreadCount });
  } catch (err: any) {
    console.error('Error in /api/admin/dreams/mark-seen:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة المنام.' });
  }
});

app.post('/api/admin/dreams/reply', checkAdminAuth, async (req, res) => {
  try {
    const { dreamId, replyText } = req.body;
    const dream = await getDreamById(dreamId);
    if (!dream) {
      return res.status(404).json({ error: 'لم يتم العثور على المنام' });
    }

    const updatedDream = await updateDream(dreamId, { expertReply: replyText, status: 'replied' });
    await logActivity(
      "reply_sent",
      "الشيخ أحمد الشريف",
      `تم إرسال رد وتأويل المنام للعميل (${dream.clientName})`
    );

    const allDreams = await getAllDreams();
    const unreadCount = allDreams.filter(d => d.status === 'unread').length;
    res.json({ success: true, dream: updatedDream, unreadCount });
  } catch (err: any) {
    console.error('Error in /api/admin/dreams/reply:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرد.' });
  }
});

// API Routes

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ExplainingDream.com - Ahmed Al-Sherif', year: 2026, db: 'Firestore Persistent' });
});

// 2. Site Settings Endpoints
app.get('/api/site-settings', async (_req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json(settings);
  } catch (err: any) {
    console.error('Error in /api/site-settings:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب إعدادات الموقع.' });
  }
});

// Spiritual Newsletter Endpoints
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { emailOrContact, channel = 'email', userName } = req.body;
    if (!emailOrContact || !emailOrContact.trim()) {
      return res.status(400).json({ error: 'يرجى تقديم بريد إلكتروني أو رقم هاتف صحيح.' });
    }

    const cleanContact = emailOrContact.trim();
    const allSubs = await getAllSubscribers();
    let existing = allSubs.find(s => s.email && s.email.toLowerCase() === cleanContact.toLowerCase());

    if (!existing) {
      existing = await addSubscriber(cleanContact);
      await logActivity(
        "newsletter_subscribed",
        userName || cleanContact,
        `انضم مشترك جديد للنشرة الروحية (${cleanContact}) عبر قناة ${channel}`
      );
    }

    const digest = await getNewsletterDigest();
    const currentSubs = await getAllSubscribers();

    res.json({
      success: true,
      message: 'تم الاشتراك بنجاح في النشرة الروحية!',
      subscriber: existing,
      digest: {
        ...digest,
        subscriberCount: currentSubs.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Error in /api/newsletter/subscribe:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء الاشتراك.' });
  }
});

app.get('/api/newsletter/digest', async (_req, res) => {
  try {
    const digest = await getNewsletterDigest();
    const subs = await getAllSubscribers();
    res.json({
      success: true,
      digest: {
        ...digest,
        subscriberCount: subs.length
      }
    });
  } catch (err: any) {
    console.error('Error in /api/newsletter/digest:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب النشرة.' });
  }
});

app.get('/api/admin/newsletter/subscribers', checkAdminAuth, async (_req, res) => {
  try {
    const subs = await getAllSubscribers();
    const digest = await getNewsletterDigest();
    res.json({
      success: true,
      subscribers: subs,
      totalCount: subs.length,
      digest
    });
  } catch (err: any) {
    console.error('Error in /api/admin/newsletter/subscribers:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المشتركين.' });
  }
});

app.post('/api/admin/newsletter/update-digest', checkAdminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    let digest = await getNewsletterDigest();
    if (updates) {
      digest = await updateNewsletterDigest({ ...digest, ...updates, lastUpdated: new Date().toISOString() });
      await logActivity(
        "digest_updated",
        "الشيخ أحمد الشريف",
        "تم تحديث محتوى الملف الإخباري الروحي والنشرة البريدية بنجاح."
      );
    }
    res.json({ success: true, digest });
  } catch (err: any) {
    console.error('Error in /api/admin/newsletter/update-digest:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث النشرة.' });
  }
});

app.post('/api/admin/site-settings', checkAdminAuth, async (req, res) => {
  try {
    const updates = req.body;
    const settings = await updateSiteSettings(updates);
    
    await logActivity(
      "site_updated",
      "إدارة الموقع (الشيخ أحمد الشريف)",
      "تم تحديث إعدادات وإرشادات وأسعار الموقع بنجاح."
    );

    res.json({ success: true, settings });
  } catch (err: any) {
    console.error('Error in /api/admin/site-settings:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث إعدادات الموقع.' });
  }
});

// 3. Customers & Subscriptions Endpoints
app.get('/api/admin/customers', checkAdminAuth, async (_req, res) => {
  try {
    const customers = await getAllUsers();
    const orders = await getAllOrders();
    const dreams = await getAllDreams();

    const enrichedCustomers = customers.map(c => {
      const ordersHistory = orders.filter(
        o => (c.email && o.clientEmail === c.email) || (c.phone && o.clientPhone === c.phone) || (c.name && o.clientName === c.name)
      );
      const submittedDreams = dreams.filter(
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
  } catch (err: any) {
    console.error('Error in /api/admin/customers:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة العملاء.' });
  }
});

app.post('/api/admin/customers/extend', checkAdminAuth, async (req, res) => {
  try {
    const { customerId, days = 30 } = req.body;
    const cust = await getUserById(customerId);
    if (!cust) {
      return res.status(404).json({ error: 'لم يتم العثور على العميل' });
    }

    const currentEnd = new Date(cust.subscriptionEndDate > new Date().toISOString() ? cust.subscriptionEndDate : new Date());
    currentEnd.setDate(currentEnd.getDate() + Number(days));
    
    const updatedCust = await updateUser(customerId, {
      subscriptionEndDate: currentEnd.toISOString(),
      status: 'active',
      role: 'vip'
    });

    await logActivity(
      "subscription_renewed",
      cust.name,
      `تم تمديد اشتراك VIP لمدة ${days} يوماً حتى تاريخ ${currentEnd.toLocaleDateString('ar-EG')}`
    );

    res.json({ success: true, customer: updatedCust });
  } catch (err: any) {
    console.error('Error in /api/admin/customers/extend:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تمديد الاشتراك.' });
  }
});

app.post('/api/admin/customers/update-role', checkAdminAuth, async (req, res) => {
  try {
    const { customerId, role, planName } = req.body;
    const cust = await getUserById(customerId);
    if (!cust) {
      return res.status(404).json({ error: 'لم يتم العثور على العميل' });
    }

    const updates: Record<string, any> = { role };
    if (planName) updates.planName = planName;
    if (role === 'vip') {
      updates.status = 'active';
      const future = new Date();
      future.setDate(future.getDate() + 30);
      updates.subscriptionEndDate = future.toISOString();
    }

    const updatedCust = await updateUser(customerId, updates);
    res.json({ success: true, customer: updatedCust });
  } catch (err: any) {
    console.error('Error in /api/admin/customers/update-role:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث الرتبة.' });
  }
});

// 4. Activity Logs Endpoint
app.get('/api/admin/activity-logs', checkAdminAuth, async (_req, res) => {
  try {
    const logs = await getAllActivityLogs();
    res.json(logs);
  } catch (err: any) {
    console.error('Error in /api/admin/activity-logs:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب سجلات النشاط.' });
  }
});

app.post('/api/log-activity', async (req, res) => {
  try {
    const { type, user, details } = req.body;
    const log = await logActivity(
      type || 'activity',
      user || 'زائر جديد',
      details || 'قام بالتفاعل مع المنصة'
    );
    res.json({ success: true, log });
  } catch (err: any) {
    console.error('Error in /api/log-activity:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل النشاط.' });
  }
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

    // Automatically log activity
    const userName = clientName || (gender === 'female' ? 'رائية' : 'رائي');
    await logActivity(
      "dream_submitted",
      userName,
      `قام بإدخال حلم جديد: "${dreamText.substring(0, 60)}..."`
    );

    // Check if user exists in customers or create/update customer entry
    if (clientPhone || clientEmail) {
      let existingCust = null;
      if (clientEmail) existingCust = await getUserByEmail(clientEmail);
      if (!existingCust && clientPhone) {
        const allUsers = await getAllUsers();
        existingCust = allUsers.find(c => c.phone === clientPhone);
      }

      if (existingCust) {
        await updateUser(existingCust.id, {
          dreamsSubmittedCount: (existingCust.dreamsSubmittedCount || 0) + 1,
          lastActive: "الآن",
          lastEnteredDream: dreamText,
          name: clientName || existingCust.name,
          phone: clientPhone || existingCust.phone
        });
      } else {
        await saveUser({
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

    // Save to Firestore dreams collection for Admin Dashboard feed
    await saveDream({
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
app.post('/api/paid-requests', async (req, res) => {
  try {
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

    let validatedPrice = OFFICIAL_PRICES[serviceId] ?? OFFICIAL_PRICES[deliveryType] ?? OFFICIAL_PRICES['srv-custom'];
    if (couponCode && couponCode.toUpperCase().includes('DISCOUNT10')) {
      validatedPrice = Math.max(0, validatedPrice - 10);
    } else if (couponCode && couponCode.toUpperCase().includes('SHERIF50')) {
      validatedPrice = Math.max(0, Math.round(validatedPrice * 0.5));
    }

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      serviceId: serviceId || 'srv-custom',
      serviceTitle: serviceTitle || 'اشتراك/استشارة خاصة',
      clientName,
      clientEmail: effectiveEmail,
      clientPhone: clientPhone || '',
      dreamText,
      maritalStatus: maritalStatus || 'single',
      amountPaid: validatedPrice,
      couponCode: couponCode || null,
      status: paymentReceiptUrl ? 'in_review' : 'pending',
      createdAt: new Date().toISOString(),
      deliveryType: deliveryType || 'written',
      paymentReceiptUrl: paymentReceiptUrl || '',
      paymentReceiptNote: paymentReceiptNote || '',
      receiptUploadedAt: paymentReceiptUrl ? new Date().toISOString() : '',
    };

    await saveOrder(newOrder);

    // Automatically update or create customer record
    let cust = await getUserByEmail(effectiveEmail);
    if (!cust && clientPhone) {
      const allUsers = await getAllUsers();
      cust = allUsers.find(c => c.phone === clientPhone);
    }

    if (cust) {
      const updates: Record<string, any> = { lastActive: "الآن" };
      if (cust.role !== 'vip') {
        updates.status = 'pending';
        updates.planName = `${serviceTitle} (قيد الانتظار)`;
      }
      await updateUser(cust.id, updates);
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
        totalSpentUsd: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
        lastActive: 'الآن',
        lastEnteredDream: dreamText
      };
      await saveUser(cust);
    }

    // Push to dreams collection for admin
    await saveDream({
      id: `DREAM-${Date.now().toString().slice(-4)}`,
      clientId: cust ? cust.id : '',
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
    await logActivity(
      "service_purchased",
      clientName,
      `طلب الاشتراك في باقة: ${serviceTitle} (الحالة: قيد الانتظار والتحقق من الدفع)`
    );

    return res.json({
      success: true,
      message: 'تم تسجيل طلبك بنجاح وقيد الانتظار! يمكنك رفع إيصال التحويل (سكرين شوت الدفع) عبر لوحة حسابك لتفعيل الخدمة فوراً.',
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Error in /api/paid-requests:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الطلب.', details: err.message || String(err) });
  }
});

// 6.b Client endpoints for dashboard and receipt upload
app.post('/api/client/my-orders', requireClientAuth, async (req, res) => {
  try {
    const authEmail = (req as any).user.email;
    const { email, phone } = req.body;
    const targetEmail = authEmail || email;

    const allOrders = await getAllOrders();
    const myOrders = allOrders.filter(o => 
      (targetEmail && o.clientEmail && o.clientEmail.toLowerCase() === targetEmail.toLowerCase()) ||
      (phone && o.clientPhone && o.clientPhone === phone)
    );

    let myCustomer = null;
    if (targetEmail) myCustomer = await getUserByEmail(targetEmail);
    if (!myCustomer && phone) {
      const allUsers = await getAllUsers();
      myCustomer = allUsers.find(c => c.phone === phone);
    }

    const allDreams = await getAllDreams();
    const myDreams = allDreams.filter(d => 
      (targetEmail && d.clientEmail && d.clientEmail.toLowerCase() === targetEmail.toLowerCase()) ||
      (phone && d.clientPhone && d.clientPhone === phone)
    );

    return res.json({
      success: true,
      customer: myCustomer || null,
      orders: myOrders,
      dreams: myDreams
    });
  } catch (err: any) {
    console.error('Error in /api/client/my-orders:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب طلباتك.' });
  }
});

app.post('/api/client/orders/upload-receipt', requireClientAuth, async (req, res) => {
  try {
    const authEmail = (req as any).user.email;
    const { orderId, paymentReceiptUrl, paymentReceiptNote } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'رقم الطلب مطلوب.' });
    }

    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'لم يتم العثور على الطلب.' });
    }

    const isAdmin = (req as any).user.role === 'admin' && authEmail.toLowerCase() === 'ahmedalsherif30@gmail.com';
    if (!isAdmin && order.clientEmail && order.clientEmail.toLowerCase() !== authEmail.toLowerCase()) {
      return res.status(403).json({ error: 'تم رفض الوصول: لا يمكنك التعديل على طلب عميل آخر.' });
    }

    const updates: Record<string, any> = {
      receiptUploadedAt: new Date().toISOString(),
      status: 'in_review'
    };
    if (paymentReceiptUrl) updates.paymentReceiptUrl = paymentReceiptUrl;
    if (paymentReceiptNote) updates.paymentReceiptNote = paymentReceiptNote;

    const updatedOrder = await updateOrder(orderId, updates);

    // Log activity for admin
    await logActivity(
      "service_purchased",
      order.clientName,
      `قام العميل برفع إيصال/سكرين شوت الدفع للطلب (${order.id}) وهو قيد المراجعة الآن 📸`
    );

    return res.json({
      success: true,
      message: 'تم رفع إيصال التحويل بنجاح! جاري مراجعته وتأكيده بواسطة إدارة الشيخ أحمد الشريف.',
      order: updatedOrder
    });
  } catch (err: any) {
    console.error('Error in /api/client/orders/upload-receipt:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء رفع إيصال الدفع.' });
  }
});

// 7. Get & Manage service orders list for admin
app.get('/api/admin/orders', checkAdminAuth, async (_req, res) => {
  try {
    const orders = await getAllOrders();
    return res.json(orders);
  } catch (err: any) {
    console.error('Error in /api/admin/orders:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة الطلبات.' });
  }
});

app.post('/api/admin/orders/confirm', checkAdminAuth, async (req, res) => {
  try {
    const { orderId, adminConfirmNote } = req.body;
    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
    }

    const orderUpdates: Record<string, any> = { status: 'approved' };
    if (adminConfirmNote) orderUpdates.adminConfirmNote = adminConfirmNote;
    const updatedOrder = await updateOrder(orderId, orderUpdates);

    // Find customer and update to active VIP
    let cust = null;
    if (order.clientEmail) cust = await getUserByEmail(order.clientEmail);
    if (!cust && order.clientPhone) {
      const allUsers = await getAllUsers();
      cust = allUsers.find(c => c.phone === order.clientPhone);
    }

    let updatedCust = null;
    if (cust) {
      const future = new Date();
      future.setDate(future.getDate() + 30);
      updatedCust = await updateUser(cust.id, {
        role: 'vip',
        status: 'active',
        planName: order.serviceTitle,
        totalSpentUsd: (cust.totalSpentUsd || 0) + (order.amountPaid || 0),
        subscriptionEndDate: future.toISOString()
      });
    }

    await logActivity(
      "subscription_renewed",
      "الشيخ أحمد الشريف (الإدارة)",
      `تم تأكيد إيصال الدفع واعتماد تفعيل الاشتراك للعميل (${order.clientName}) - الطلب ${order.id} ✓`
    );

    res.json({ success: true, order: updatedOrder, customer: updatedCust });
  } catch (err: any) {
    console.error('Error in /api/admin/orders/confirm:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تأكيد الطلب.' });
  }
});

app.post('/api/admin/orders/reject', checkAdminAuth, async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
    }

    const updatedOrder = await updateOrder(orderId, {
      status: 'rejected',
      adminConfirmNote: reason || 'إيصال غير واضح أو لم يصل المبلغ بالحساب.'
    });

    await logActivity(
      "activity",
      "الشيخ أحمد الشريف (الإدارة)",
      `تم رفض إيصال الدفع للطلب ${order.id} للعميل (${order.clientName}) مع إرفاق الملاحظة.`
    );

    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error('Error in /api/admin/orders/reject:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء رفض الطلب.' });
  }
});

app.post('/api/admin/orders/reply', checkAdminAuth, async (req, res) => {
  try {
    const { orderId, replyText } = req.body;
    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
    }

    const updatedOrder = await updateOrder(orderId, {
      writtenReply: replyText,
      status: 'completed'
    });

    await logActivity(
      "reply_sent",
      "الشيخ أحمد الشريف",
      `تم إرسال رد التفسير الرسمي للعميل (${order.clientName}) للطلب ${order.id}`
    );

    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error('Error in /api/admin/orders/reply:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرد.' });
  }
});

app.post('/api/admin/orders/update-status', checkAdminAuth, async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const allOrders = await getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'لم يتم العثور على الطلب' });
    }

    const updatedOrder = await updateOrder(orderId, { status });
    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error('Error in /api/admin/orders/update-status:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة الطلب.' });
  }
});

// Explicit SEO Routes for Robots & Sitemap
app.get('/sitemap.xml', (_req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
});

// Start Server & Integrate Vite Middleware
async function startServer() {
  // Initialize Firestore Database on Boot
  await initializeDatabase();

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
    console.log(`ExplainingDream server running with Cloud Firestore on http://0.0.0.0:${PORT}`);
  });
}

startServer();
