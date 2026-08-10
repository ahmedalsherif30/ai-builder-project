import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Helper for local file persistence fallback
const DATA_FILE = path.join(process.cwd(), 'app_data_store.json');

function loadLocalStore(): any {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local data store:', err);
  }
  return {
    siteSettings: null,
    users: [],
    dreams: [],
    orders: [],
    giftCodes: [],
    referralLogs: {},
    subscribers: [],
    newsletterDigest: null,
    activityLogs: []
  };
}

function saveLocalStore(store: any): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local data store:', err);
  }
}

// MySQL Pool Connection setup
let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool | null {
  if (pool) return pool;
  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

  if (dbHost && dbName && dbUser) {
    try {
      pool = mysql.createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        port: dbPort,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      return pool;
    } catch (err) {
      console.error('Failed to create MySQL pool:', err);
      pool = null;
    }
  }
  return null;
}

// Data Interfaces
export interface SiteSettings {
  id?: string;
  siteName: string;
  vodafoneCashNumber: string;
  instapayUsername: string;
  supportPhone: string;
  siteDomain: string;
  officialEmail: string;
  consultationPrices: Record<string, number>;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'admin' | 'member' | 'vip' | 'free';
  tokens?: number;
  consultationCredits?: number;
  createdAt?: string;
  lastActive?: string;
  [key: string]: any;
}

export interface Dream {
  id: string;
  userEmail: string;
  dreamText: string;
  interpretation?: string;
  expertReply?: string;
  status: 'pending' | 'seen' | 'replied' | 'completed' | 'unread' | string;
  createdAt: string;
  [key: string]: any;
}

export interface Order {
  id: string;
  clientEmail: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected' | 'completed' | 'in_review' | string;
  receiptUrl?: string;
  createdAt: string;
  [key: string]: any;
}

export interface GiftCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  createdAt: string;
  [key: string]: any;
}

export interface ReferralLog {
  email?: string;
  refCode?: string;
  referralCode?: string;
  referredCount?: number;
  referralCount?: number;
  points?: number;
  history?: any[];
  referralLogs?: any[];
  [key: string]: any;
}

export interface Subscriber {
  id: string;
  contact: string;
  subscribedAt: string;
  [key: string]: any;
}

export interface NewsletterDigest {
  id?: string;
  title?: string;
  content?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  actor: string;
  timestamp: string;
}

// Database Initialization Function
export async function initializeDatabase(): Promise<void> {
  const p = getPool();
  if (p) {
    try {
      // Create tables if they do not exist
      await p.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id VARCHAR(50) PRIMARY KEY,
          data JSON NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          email VARCHAR(191) NOT NULL UNIQUE,
          role VARCHAR(50) NOT NULL DEFAULT 'member',
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS dreams (
          id VARCHAR(100) PRIMARY KEY,
          user_email VARCHAR(191) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(100) PRIMARY KEY,
          client_email VARCHAR(191) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS gift_codes (
          id VARCHAR(100) PRIMARY KEY,
          code VARCHAR(100) NOT NULL UNIQUE,
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS referral_logs (
          email VARCHAR(191) PRIMARY KEY,
          data JSON NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id VARCHAR(100) PRIMARY KEY,
          contact VARCHAR(191) NOT NULL UNIQUE,
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS newsletter_digest (
          id VARCHAR(50) PRIMARY KEY,
          data JSON NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await p.query(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id VARCHAR(100) PRIMARY KEY,
          action VARCHAR(255) NOT NULL,
          actor VARCHAR(191) NOT NULL,
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      console.log('MySQL Database Tables initialized successfully.');
    } catch (err) {
      console.error('MySQL initialization error, falling back to file store:', err);
    }
  }

  // Seed default site settings if empty
  const currentSettings = await getSiteSettings();
  if (!currentSettings || !currentSettings.siteDomain) {
    await updateSiteSettings({
      siteName: 'منصة تفسير الأحلام الرسمية - الشيخ أحمد الشريف',
      vodafoneCashNumber: '01558955525',
      instapayUsername: '@explainingdreams / 01558955525',
      supportPhone: '01558955525',
      siteDomain: 'https://explainingdream.com',
      officialEmail: 'info@explainingdream.com',
      consultationPrices: {
        written: 29,
        audio: 49,
        direct: 89,
        vip: 29,
        book_pdf: 15,
        book_print: 35
      }
    });
  }

  // Seed Admin User if not existing
  const adminEmail = 'ahmedalsherif30@gmail.com';
  let admin = await getUserByEmail(adminEmail);
  if (!admin) {
    await saveUser({
      id: 'ADMIN-001',
      email: adminEmail,
      name: 'فضيلة الشيخ أحمد الشريف',
      phone: '01558955525',
      role: 'admin',
      tokens: 9999,
      consultationCredits: 9999,
      createdAt: new Date().toISOString(),
      lastActive: 'الآن'
    });
  }
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM site_settings WHERE id = 'default' LIMIT 1`);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
    } catch (err) {
      console.error('MySQL getSiteSettings error:', err);
    }
  }
  const store = loadLocalStore();
  return store.siteSettings || {
    id: 'default',
    siteName: 'منصة تفسير الأحلام الرسمية - الشيخ أحمد الشريف',
    vodafoneCashNumber: '01558955525',
    instapayUsername: '@explainingdreams / 01558955525',
    supportPhone: '01558955525',
    siteDomain: 'https://explainingdream.com',
    officialEmail: 'info@explainingdream.com',
    consultationPrices: {
      written: 29,
      audio: 49,
      direct: 89,
      vip: 29,
      book_pdf: 15,
      book_print: 35
    }
  };
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
    id: 'default',
    updatedAt: new Date().toISOString()
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO site_settings (id, data) VALUES ('default', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [JSON.stringify(updated)]
      );
      return updated;
    } catch (err) {
      console.error('MySQL updateSiteSettings error:', err);
    }
  }

  const store = loadLocalStore();
  store.siteSettings = updated;
  saveLocalStore(store);
  return updated;
}

// Users
export async function getAllUsers(): Promise<User[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM users`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllUsers error:', err);
    }
  }
  const store = loadLocalStore();
  return store.users || [];
}

export async function getUserById(id: string): Promise<User | null> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM users WHERE id = ? LIMIT 1`, [id]);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
      return null;
    } catch (err) {
      console.error('MySQL getUserById error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.users || []).find((u: User) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail) return null;

  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM users WHERE email = ? LIMIT 1`, [cleanEmail]);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
      return null;
    } catch (err) {
      console.error('MySQL getUserByEmail error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.users || []).find((u: User) => (u.email || '').toLowerCase().trim() === cleanEmail) || null;
}

export async function saveUser(user: User): Promise<User> {
  const cleanEmail = (user.email || '').toLowerCase().trim();
  const newUser = {
    ...user,
    email: cleanEmail,
    id: user.id || `USER-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: user.createdAt || new Date().toISOString()
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO users (id, email, role, data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), role = VALUES(role), data = VALUES(data)`,
        [newUser.id, newUser.email, newUser.role || 'member', JSON.stringify(newUser)]
      );
      return newUser;
    } catch (err) {
      console.error('MySQL saveUser error:', err);
    }
  }

  const store = loadLocalStore();
  const existingIdx = (store.users || []).findIndex((u: User) => u.id === newUser.id || u.email === newUser.email);
  if (existingIdx >= 0) {
    store.users[existingIdx] = newUser;
  } else {
    store.users = [...(store.users || []), newUser];
  }
  saveLocalStore(store);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const current = await getUserById(id);
  if (!current) {
    throw new Error(`User with ID ${id} not found`);
  }
  const updatedUser = {
    ...current,
    ...updates
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `UPDATE users SET email = ?, role = ?, data = ? WHERE id = ?`,
        [updatedUser.email, updatedUser.role || 'member', JSON.stringify(updatedUser), id]
      );
      return updatedUser;
    } catch (err) {
      console.error('MySQL updateUser error:', err);
    }
  }

  const store = loadLocalStore();
  const idx = (store.users || []).findIndex((u: User) => u.id === id);
  if (idx >= 0) {
    store.users[idx] = updatedUser;
    saveLocalStore(store);
  }
  return updatedUser;
}

// Dreams
export async function getAllDreams(): Promise<Dream[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM dreams ORDER BY created_at DESC`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllDreams error:', err);
    }
  }
  const store = loadLocalStore();
  return store.dreams || [];
}

export async function getDreamById(id: string): Promise<Dream | null> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM dreams WHERE id = ? LIMIT 1`, [id]);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
      return null;
    } catch (err) {
      console.error('MySQL getDreamById error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.dreams || []).find((d: Dream) => d.id === id) || null;
}

export async function getDreamsByUserEmail(email: string): Promise<Dream[]> {
  const cleanEmail = (email || '').toLowerCase().trim();
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM dreams WHERE user_email = ? ORDER BY created_at DESC`, [cleanEmail]);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getDreamsByUserEmail error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.dreams || []).filter((d: Dream) => (d.userEmail || '').toLowerCase().trim() === cleanEmail);
}

export async function saveDream(dream: Partial<Dream>): Promise<Dream> {
  const newDream: Dream = {
    id: dream.id || `DREAM-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userEmail: (dream.userEmail || '').toLowerCase().trim(),
    dreamText: dream.dreamText || '',
    interpretation: dream.interpretation || '',
    expertReply: dream.expertReply || '',
    status: dream.status || 'pending',
    createdAt: dream.createdAt || new Date().toISOString(),
    ...dream
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO dreams (id, user_email, status, data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_email = VALUES(user_email), status = VALUES(status), data = VALUES(data)`,
        [newDream.id, newDream.userEmail, newDream.status, JSON.stringify(newDream)]
      );
      return newDream;
    } catch (err) {
      console.error('MySQL saveDream error:', err);
    }
  }

  const store = loadLocalStore();
  store.dreams = [newDream, ...(store.dreams || [])];
  saveLocalStore(store);
  return newDream;
}

export async function updateDream(id: string, updates: Partial<Dream>): Promise<Dream> {
  const current = await getDreamById(id);
  if (!current) throw new Error(`Dream ${id} not found`);

  const updatedDream: Dream = {
    ...current,
    ...updates
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `UPDATE dreams SET user_email = ?, status = ?, data = ? WHERE id = ?`,
        [updatedDream.userEmail, updatedDream.status, JSON.stringify(updatedDream), id]
      );
      return updatedDream;
    } catch (err) {
      console.error('MySQL updateDream error:', err);
    }
  }

  const store = loadLocalStore();
  const idx = (store.dreams || []).findIndex((d: Dream) => d.id === id);
  if (idx >= 0) {
    store.dreams[idx] = updatedDream;
    saveLocalStore(store);
  }
  return updatedDream;
}

// Orders
export async function getAllOrders(): Promise<Order[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM orders ORDER BY created_at DESC`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllOrders error:', err);
    }
  }
  const store = loadLocalStore();
  return store.orders || [];
}

export async function getOrdersByUserEmail(email: string): Promise<Order[]> {
  const cleanEmail = (email || '').toLowerCase().trim();
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM orders WHERE client_email = ? ORDER BY created_at DESC`, [cleanEmail]);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getOrdersByUserEmail error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.orders || []).filter((o: Order) => (o.clientEmail || '').toLowerCase().trim() === cleanEmail);
}

export async function saveOrder(order: Partial<Order>): Promise<Order> {
  const newOrder: Order = {
    id: order.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    clientEmail: (order.clientEmail || '').toLowerCase().trim(),
    serviceType: order.serviceType || 'consultation',
    amount: order.amount || 0,
    status: order.status || 'pending',
    receiptUrl: order.receiptUrl || '',
    createdAt: order.createdAt || new Date().toISOString(),
    ...order
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO orders (id, client_email, status, data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE client_email = VALUES(client_email), status = VALUES(status), data = VALUES(data)`,
        [newOrder.id, newOrder.clientEmail, newOrder.status, JSON.stringify(newOrder)]
      );
      return newOrder;
    } catch (err) {
      console.error('MySQL saveOrder error:', err);
    }
  }

  const store = loadLocalStore();
  store.orders = [newOrder, ...(store.orders || [])];
  saveLocalStore(store);
  return newOrder;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM orders WHERE id = ? LIMIT 1`, [id]);
      if (rows && rows.length > 0) {
        const current = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
        const updatedOrder = { ...current, ...updates };
        await p.query(
          `UPDATE orders SET client_email = ?, status = ?, data = ? WHERE id = ?`,
          [updatedOrder.clientEmail, updatedOrder.status, JSON.stringify(updatedOrder), id]
        );
        return updatedOrder;
      }
    } catch (err) {
      console.error('MySQL updateOrder error:', err);
    }
  }

  const store = loadLocalStore();
  const idx = (store.orders || []).findIndex((o: Order) => o.id === id);
  if (idx >= 0) {
    const updatedOrder = { ...store.orders[idx], ...updates };
    store.orders[idx] = updatedOrder;
    saveLocalStore(store);
    return updatedOrder;
  }
  throw new Error(`Order ${id} not found`);
}

// Gift Codes
export async function getAllGiftCodes(): Promise<GiftCode[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM gift_codes`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllGiftCodes error:', err);
    }
  }
  const store = loadLocalStore();
  return store.giftCodes || [];
}

export async function getGiftCodeByCode(code: string): Promise<GiftCode | null> {
  const cleanCode = (code || '').toUpperCase().trim();
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM gift_codes WHERE code = ? LIMIT 1`, [cleanCode]);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
      return null;
    } catch (err) {
      console.error('MySQL getGiftCodeByCode error:', err);
    }
  }
  const store = loadLocalStore();
  return (store.giftCodes || []).find((g: GiftCode) => (g.code || '').toUpperCase().trim() === cleanCode) || null;
}

export async function saveGiftCode(giftCode: Partial<GiftCode>): Promise<GiftCode> {
  const newCode: GiftCode = {
    id: giftCode.id || `GIFT-${Date.now()}`,
    code: (giftCode.code || '').toUpperCase().trim(),
    discountPercent: giftCode.discountPercent || 10,
    maxUses: giftCode.maxUses || 100,
    usedCount: giftCode.usedCount || 0,
    createdAt: giftCode.createdAt || new Date().toISOString(),
    ...giftCode
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO gift_codes (id, code, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code), data = VALUES(data)`,
        [newCode.id, newCode.code, JSON.stringify(newCode)]
      );
      return newCode;
    } catch (err) {
      console.error('MySQL saveGiftCode error:', err);
    }
  }

  const store = loadLocalStore();
  store.giftCodes = [...(store.giftCodes || []), newCode];
  saveLocalStore(store);
  return newCode;
}

export async function updateGiftCode(id: string, updates: Partial<GiftCode>): Promise<GiftCode> {
  const store = loadLocalStore();
  const p = getPool();

  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM gift_codes WHERE id = ? LIMIT 1`, [id]);
      if (rows && rows.length > 0) {
        const current = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
        const updated = { ...current, ...updates };
        await p.query(
          `UPDATE gift_codes SET code = ?, data = ? WHERE id = ?`,
          [updated.code, JSON.stringify(updated), id]
        );
        return updated;
      }
    } catch (err) {
      console.error('MySQL updateGiftCode error:', err);
    }
  }

  const idx = (store.giftCodes || []).findIndex((g: GiftCode) => g.id === id);
  if (idx >= 0) {
    const updated = { ...store.giftCodes[idx], ...updates };
    store.giftCodes[idx] = updated;
    saveLocalStore(store);
    return updated;
  }
  throw new Error(`Gift code ${id} not found`);
}

// Referral Log
export async function getReferralLog(email: string): Promise<ReferralLog | null> {
  const cleanEmail = (email || '').toLowerCase().trim();
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM referral_logs WHERE email = ? LIMIT 1`, [cleanEmail]);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
      return null;
    } catch (err) {
      console.error('MySQL getReferralLog error:', err);
    }
  }
  const store = loadLocalStore();
  return store.referralLogs?.[cleanEmail] || null;
}

export async function saveReferralLog(email: string, data: ReferralLog): Promise<ReferralLog> {
  const cleanEmail = (email || '').toLowerCase().trim();
  const logData = { ...data, email: cleanEmail };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO referral_logs (email, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [cleanEmail, JSON.stringify(logData)]
      );
      return logData;
    } catch (err) {
      console.error('MySQL saveReferralLog error:', err);
    }
  }

  const store = loadLocalStore();
  if (!store.referralLogs) store.referralLogs = {};
  store.referralLogs[cleanEmail] = logData;
  saveLocalStore(store);
  return logData;
}

// Subscribers
export async function getAllSubscribers(): Promise<Subscriber[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM subscribers`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllSubscribers error:', err);
    }
  }
  const store = loadLocalStore();
  return store.subscribers || [];
}

export async function addSubscriber(contact: string): Promise<Subscriber> {
  const cleanContact = (contact || '').trim();
  const newSub: Subscriber = {
    id: `SUB-${Date.now()}`,
    contact: cleanContact,
    subscribedAt: new Date().toISOString()
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO subscribers (id, contact, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE contact = VALUES(contact)`,
        [newSub.id, cleanContact, JSON.stringify(newSub)]
      );
      return newSub;
    } catch (err) {
      console.error('MySQL addSubscriber error:', err);
    }
  }

  const store = loadLocalStore();
  const existing = (store.subscribers || []).find((s: Subscriber) => s.contact === cleanContact);
  if (existing) return existing;

  store.subscribers = [...(store.subscribers || []), newSub];
  saveLocalStore(store);
  return newSub;
}

// Newsletter Digest
export async function getNewsletterDigest(): Promise<NewsletterDigest> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM newsletter_digest WHERE id = 'latest' LIMIT 1`);
      if (rows && rows.length > 0) {
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      }
    } catch (err) {
      console.error('MySQL getNewsletterDigest error:', err);
    }
  }
  const store = loadLocalStore();
  return store.newsletterDigest || {
    id: 'latest',
    title: 'الموجز الأسبوعي لتفسير الأحلام والإرشادات الإيمانية',
    content: 'أهلاً بكم في الموجز الأسبوعي لموقع تفسير الأحلام الرسمية.',
    lastUpdated: new Date().toISOString()
  };
}

export async function updateNewsletterDigest(updates: Partial<NewsletterDigest>): Promise<NewsletterDigest> {
  const current = await getNewsletterDigest();
  const updated: NewsletterDigest = {
    ...current,
    ...updates,
    id: 'latest',
    lastUpdated: new Date().toISOString()
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO newsletter_digest (id, data) VALUES ('latest', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [JSON.stringify(updated)]
      );
      return updated;
    } catch (err) {
      console.error('MySQL updateNewsletterDigest error:', err);
    }
  }

  const store = loadLocalStore();
  store.newsletterDigest = updated;
  saveLocalStore(store);
  return updated;
}

// Activity Logs
export async function logActivity(action: string, details: string, actor: string = 'النظام'): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    details,
    actor,
    timestamp: new Date().toISOString()
  };

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO activity_logs (id, action, actor, data) VALUES (?, ?, ?, ?)`,
        [newLog.id, action, actor, JSON.stringify(newLog)]
      );
      return newLog;
    } catch (err) {
      console.error('MySQL logActivity error:', err);
    }
  }

  const store = loadLocalStore();
  store.activityLogs = [newLog, ...(store.activityLogs || [])].slice(0, 500); // keep max 500
  saveLocalStore(store);
  return newLog;
}

export async function getAllActivityLogs(): Promise<ActivityLog[]> {
  const p = getPool();
  if (p) {
    try {
      const [rows]: any = await p.query(`SELECT data FROM activity_logs ORDER BY created_at DESC LIMIT 200`);
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    } catch (err) {
      console.error('MySQL getAllActivityLogs error:', err);
    }
  }
  const store = loadLocalStore();
  return store.activityLogs || [];
}
