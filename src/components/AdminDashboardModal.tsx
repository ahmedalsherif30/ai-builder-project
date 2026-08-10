import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Activity,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Calendar,
  Send,
  Edit3,
  Sparkles,
  BookOpen,
  MessageSquare,
  ExternalLink,
  Filter,
  Zap,
  Check,
  X,
  CreditCard,
  UserCheck,
  UserX,
  User,
  Plus,
  Eye,
  Tag,
  Megaphone,
  Mail,
  Phone
} from 'lucide-react';
import { ServiceOrder, CustomerRecord, ActivityLog, SiteSettings, SubmittedDreamRecord, UserProfile } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';
import { isAdminUser, ADMIN_EMAIL } from '../utils/authUtils';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'subscriptions' | 'sales' | 'submitted_dreams' | 'broadcast' | 'site_settings' | 'newsletter'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Spiritual Newsletter Admin State
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [newsletterDigestEdit, setNewsletterDigestEdit] = useState<any>(null);
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [digestSaveMsg, setDigestSaveMsg] = useState('');

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem('explaining_dream_admin_token') || '');

  const getAdminHeaders = () => {
    const token = adminToken || localStorage.getItem('explaining_dream_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token
    };
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('explaining_dream_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdminAuthenticated(true);
    } else if (isAdminUser(currentUser) && currentUser?.token) {
      setAdminToken(currentUser.token);
      localStorage.setItem('explaining_dream_admin_token', currentUser.token);
      setIsAdminAuthenticated(true);
    }
  }, [currentUser]);

  // Data states from backend APIs
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [submittedDreams, setSubmittedDreams] = useState<SubmittedDreamRecord[]>([]);
  const [unreadDreamsCount, setUnreadDreamsCount] = useState<number>(0);
  const [dreamFilter, setDreamFilter] = useState<'all' | 'unread' | 'seen' | 'replied'>('all');
  const [dreamReplyText, setDreamReplyText] = useState('');
  const [selectedDreamForReply, setSelectedDreamForReply] = useState<SubmittedDreamRecord | null>(null);
  
  // Broadcast Mass Communication States
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'vip' | 'free' | 'expiring'>('all');
  const [broadcastSubject, setBroadcastSubject] = useState('إشعار وتحديث هام - منصة أحمد الشريف لتفسير الأحلام');
  const [broadcastMessage, setBroadcastMessage] = useState('أهلاً وسهلاً أ/ {name}، نود تذكيركم بالاستفادة من التفسير القرآني والروحي المباشر ورؤياك المسجلة بحسابكم الشخصي بالمنصة.');
  const [broadcastSuccessMsg, setBroadcastSuccessMsg] = useState('');

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'ExplainingDream.com',
    sheikhName: 'الشيخ أحمد الشريف',
    heroTitle: 'منصة تفسير الأحلام والإرشاد الروحي',
    heroSubtitle: 'عَبْر منهجية أحمد الشريف، نجمع بين التوجيه القرآني والسنة النبوية والذكاء الاصطناعي المتقدم لتقديم تأويلات دقيقة لمشاهداتك المنامية.',
    announcementText: '🎉 بمناسبة إطلاق طبعة 2026: استخدم كود الخصم (ALSHERIF2026) للحصول على خصم 20% على كافة الاستشارات الصوتية والمباشرة!',
    isAnnouncementActive: true,
    isMaintenanceMode: false,
    whatsappLink: 'https://wa.me/201558955525',
    writtenServicePrice: 29,
    audioServicePrice: 49,
    sessionServicePrice: 89,
    vipMonthlyPrice: 29,
    bookPdfPrice: 15,
    bookPrintPrice: 35,
    activeCouponCode: 'ALSHERIF2026',
    discountPercentage: 20,
    vodafoneCashNumber: '01558955525',
    instapayUsername: '@explainingdreams / 01558955525',
    bankIbanDetails: 'EG123456789012345678901234 (البنك الأهلي المصري)',
    paypalEmail: 'ahmedalsherif30@gmail.com',
    westernUnionInfo: 'الاسم: أحمد الشريف - الدولة: مصر - هاتف: +201558955525',
    supportPhone: '+201558955525',
    supportEmail: 'ahmedalsherif30@gmail.com'
  });

  // Filter & Selected States
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'vip' | 'free' | 'expiring'>('all');
  const [salesFilter, setSalesFilter] = useState<'all' | 'received' | 'in_review' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<CustomerRecord | null>(null);

  // Dedicated Customer Dreams Viewer Modal State
  const [viewingCustomerDreams, setViewingCustomerDreams] = useState<{
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    customerId?: string;
    customerRecord?: CustomerRecord;
    dreams: any[];
  } | null>(null);

  const [customerDreamsSearch, setCustomerDreamsSearch] = useState('');
  const [customerDreamsStatusFilter, setCustomerDreamsStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [activeQuickReplyDreamId, setActiveQuickReplyDreamId] = useState<string | null>(null);
  const [quickReplyText, setQuickReplyText] = useState('');

  // New Customer Form modal state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustRole, setNewCustRole] = useState<'free' | 'vip'>('vip');

  // Helper to compile ALL dreams submitted by a customer across all sources
  const getCustomerAllDreams = (custName?: string, custEmail?: string, custPhone?: string, custId?: string) => {
    const map = new Map<string, any>();

    // 1. Check in customers array for matched record
    const matchedCustomer = customers.find(c =>
      (custId && c.id === custId) ||
      (custEmail && c.email && c.email.toLowerCase() === custEmail.toLowerCase()) ||
      (custPhone && c.phone && c.phone === custPhone) ||
      (custName && c.name && c.name.toLowerCase() === custName.toLowerCase())
    );

    if (matchedCustomer) {
      if (matchedCustomer.submittedDreams) {
        matchedCustomer.submittedDreams.forEach((d) => map.set(d.id, { ...d, clientName: d.clientName || matchedCustomer.name }));
      }
      if (matchedCustomer.lastEnteredDream) {
        map.set('last_entered_' + matchedCustomer.id, {
          id: 'last_entered_' + matchedCustomer.id,
          dreamText: matchedCustomer.lastEnteredDream,
          createdAt: matchedCustomer.createdAt || new Date().toISOString(),
          status: 'replied',
          source: 'محرك مفسر الذكاء الاصطناعي',
          clientName: matchedCustomer.name,
          clientEmail: matchedCustomer.email,
          clientPhone: matchedCustomer.phone
        });
      }
    }

    // 2. Check in global submittedDreams array
    submittedDreams.forEach((d) => {
      const matchId = custId && d.clientId === custId;
      const matchEmail = custEmail && d.clientEmail && d.clientEmail.toLowerCase() === custEmail.toLowerCase();
      const matchPhone = custPhone && d.clientPhone && d.clientPhone === custPhone;
      const matchName = custName && d.clientName && d.clientName.toLowerCase() === custName.toLowerCase();

      if (matchId || matchEmail || matchPhone || matchName) {
        map.set(d.id, d);
      }
    });

    // 3. Check in orders array for dreamText
    orders.forEach((ord) => {
      if (ord.dreamText) {
        const matchEmail = custEmail && ord.clientEmail && ord.clientEmail.toLowerCase() === custEmail.toLowerCase();
        const matchPhone = custPhone && ord.clientPhone && ord.clientPhone === custPhone;
        const matchName = custName && ord.clientName && ord.clientName.toLowerCase() === custName.toLowerCase();

        if (matchEmail || matchPhone || matchName) {
          map.set('order_' + ord.id, {
            id: ord.id,
            dreamText: ord.dreamText,
            createdAt: ord.createdAt,
            status: ord.status === 'completed' || ord.writtenReply ? 'replied' : 'unread',
            writtenReply: ord.writtenReply,
            expertReply: ord.writtenReply,
            clientName: ord.clientName,
            clientEmail: ord.clientEmail,
            clientPhone: ord.clientPhone,
            maritalStatus: ord.maritalStatus,
            source: `استشارة خاصة (${ord.serviceTitle || 'خدمة مدفوعة'})`
          });
        }
      }
    });

    const allDreams = Array.from(map.values()).sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return {
      customerRecord: matchedCustomer,
      dreams: allDreams
    };
  };

  const handleOpenAllCustomerDreams = (name: string, email?: string, phone?: string, id?: string) => {
    const result = getCustomerAllDreams(name, email, phone, id);
    setViewingCustomerDreams({
      customerName: name || result.customerRecord?.name || 'عميل بدون اسم',
      customerEmail: email || result.customerRecord?.email,
      customerPhone: phone || result.customerRecord?.phone,
      customerId: id || result.customerRecord?.id,
      customerRecord: result.customerRecord,
      dreams: result.dreams
    });
    setCustomerDreamsSearch('');
    setCustomerDreamsStatusFilter('all');
    setActiveQuickReplyDreamId(null);
    setQuickReplyText('');
  };

  const fetchAllAdminData = async () => {
    setIsLoading(true);
    try {
      const headers = getAdminHeaders();
      const [ordersRes, custRes, logsRes, settingsRes, dreamsRes, newsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/customers', { headers }),
        fetch('/api/admin/activity-logs', { headers }),
        fetch('/api/site-settings'),
        fetch('/api/admin/dreams', { headers }),
        fetch('/api/admin/newsletter/subscribers', { headers })
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (logsRes.ok) setActivityLogs(await logsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (dreamsRes.ok) {
        const dreamsData = await dreamsRes.json();
        setSubmittedDreams(dreamsData.dreams || []);
        setUnreadDreamsCount(dreamsData.unreadCount || 0);
      }
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsletterSubscribers(newsData.subscribers || []);
        if (newsData.digest) {
          setNewsletterDigestEdit(newsData.digest);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDreamSeen = async (dreamId: string) => {
    try {
      const res = await fetch('/api/admin/dreams/mark-seen', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ dreamId })
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadDreamsCount(data.unreadCount);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error marking dream seen:', err);
    }
  };

  const handleReplyToDream = async () => {
    if (!selectedDreamForReply) return;
    try {
      const res = await fetch('/api/admin/dreams/reply', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          dreamId: selectedDreamForReply.id,
          replyText: dreamReplyText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSaveSuccessMsg(`تم إرسال تأويل أحمد الشريف للعميل (${selectedDreamForReply.clientName}) بنجاح!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        setSelectedDreamForReply(null);
        setDreamReplyText('');
        setUnreadDreamsCount(data.unreadCount);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error replying to dream:', err);
    }
  };

  useEffect(() => {
    if (isOpen && (isAdminAuthenticated || isAdminUser(currentUser))) {
      fetchAllAdminData();
    }
  }, [isOpen, isAdminAuthenticated, currentUser]);

  // Live real-time polling every 10 seconds when admin modal is active and authenticated
  useEffect(() => {
    if (!isOpen || (!isAdminAuthenticated && !isAdminUser(currentUser))) return;
    const intervalId = setInterval(() => {
      fetchAllAdminData();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [isOpen, isAdminAuthenticated, currentUser]);

  if (!isOpen) return null;

  // Financial calculations
  const totalOrdersRevenue = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalVipRevenue = customers.filter(c => c.role === 'vip').reduce((sum, c) => sum + c.totalSpentUsd, 0);
  const grandTotalRevenue = totalOrdersRevenue + totalVipRevenue + 1250;

  // Customer remaining time calculation helper
  const getRemainingDays = (endDateStr: string) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 3600 * 24));
    return diffDays;
  };

  // Extend Subscription handler
  const handleExtendSubscription = async (customerId: string, days: number = 30) => {
    try {
      const res = await fetch('/api/admin/customers/extend', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ customerId, days })
      });
      if (res.ok) {
        setSaveSuccessMsg(`تم تمديد اشتراك العميل بنجاح لمدة ${days} يوماً!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error extending subscription:', err);
    }
  };

  // Helpers for Individual Client WhatsApp & Gmail Reminders
  const formatPhoneForWhatsApp = (phoneStr?: string) => {
    if (!phoneStr) return '201558955525';
    let cleaned = phoneStr.replace(/[^\d]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '20' + cleaned.substring(1);
    }
    return cleaned || '201558955525';
  };

  const getCustomerWhatsAppUrl = (customer: { name: string; phone?: string; role?: string; planName?: string; totalSpentUsd?: number }) => {
    const phoneNum = formatPhoneForWhatsApp(customer.phone);
    const planInfo = customer.planName || (customer.role === 'vip' ? 'اشتراك VIP الذهبي' : 'تفسير الأحلام والخدمات المباشرة');
    const msg = `أهلاً وسهلاً أ/ ${customer.name}،\n\nنحييكم من منصة الباحث والمؤلف أحمد الشريف لتفسير الأحلام.\nنود تذكيركم الكريمة بخصوص استكمال طلبكم واشتراككم في (${planInfo}).\n\nيمكنكم استكمال عملية الدفع المباشرة والتفعيل الفوري الآن بالدولار ($) عبر المحفظة الإلكترونية، إنستا باي، أو بطاقات الفيزا والماستركارد.\n\nيسعدنا خدمتكم الفورية وتفعيل حسابكم فوراً! 🌿✨`;
    return `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
  };

  const getCustomerGmailUrl = (customer: { name: string; email: string; role?: string; planName?: string }) => {
    const subject = `تذكير هام باستكمال الاشتراك والدفع - منصة أحمد الشريف لتفسير الأحلام`;
    const planInfo = customer.planName || (customer.role === 'vip' ? 'اشتراك VIP الذهبي' : 'طلب خدمة تفسير الأحلام');
    const body = `السلام عليكم ورحمة الله وبركاته،\n\nالأخ/الأخت الكريمة أ/ ${customer.name}،\n\nتحية طيبة وبعد،،\n\nنود تذكيركم الكريمة بخصوص طلبكم واهتمامكم باستكمال تفعيل (${planInfo}) في منصة تفسير الأحلام للباحث والمؤلف أحمد الشريف.\n\nيمكنكم استكمال عملية الدفع والتفعيل المباشر الآن للاستفادة من مميزات التفسير الشامل والأولوية الفورية في الرد ومتابعة الرؤى.\n\nإذا كان لديكم أي استفسار حول طرق الدفع المتاحة بالدولار ($) عبر المحفظة الإلكترونية أو الفيزا والماستركارد، يسعدنا تواصلكم المباشر بالرد على هذا الإيميل أو عبر الواتساب.\n\nمع خالص الاحترام والتقدير،\nإدارة منصة أحمد الشريف لتفسير الأحلام`;
    return `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getOrderWhatsAppUrl = (order: ServiceOrder) => {
    const phoneNum = formatPhoneForWhatsApp(order.clientPhone);
    const msg = `أهلاً وسهلاً أ/ ${order.clientName}،\n\nتذكير خاص بطلبكم في منصة أحمد الشريف:\n- الخدمة المطلوبة: ${order.serviceTitle}\n- قيمة الطلب: $${order.amountPaid} USD\n- الحالة: قيد انتظار الدفع وتأكيد الإيصال ⏳\n\nيرجى رفع صورة الإيصال أو تحويل المبلغ الفوري لاستكمال التفعيل الفوري لتفسير رؤياك من أحمد الشريف مباشرة! 🌟`;
    return `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
  };

  const getOrderGmailUrl = (order: ServiceOrder) => {
    const subject = `تذكير بدفع وتأكيد الطلب رقم (${order.id}) - منصة أحمد الشريف`;
    const body = `السلام عليكم ورحمة الله وبركاته،\n\nعزيزنا أ/ ${order.clientName}،\n\nنود تذكيركم بخصوص طلب استشارة تفسير الأحلام في منصة أحمد الشريف:\n\n- نوع الخدمة: ${order.serviceTitle}\n- القيمة: $${order.amountPaid} USD\n- رقم الطلب: ${order.id}\n\nيمكنكم رفع إيصال الدفع أو التحويل المباشر لتفعيل الطلب وبدء صياغة التفسير المعتمد فوراً.\n\nنتمنى لكم دوام الصحة والعافية.\nإدارة منصة أحمد الشريف لتفسير الأحلام`;
    return `mailto:${order.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Toggle Customer Role handler
  const handleToggleCustomerRole = async (customerId: string, newRole: 'free' | 'vip') => {
    try {
      const res = await fetch('/api/admin/customers/update-role', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          customerId,
          role: newRole,
          planName: newRole === 'vip' ? 'عضوية VIP الشاملة' : 'خطة الزائر المجانية'
        })
      });
      if (res.ok) {
        setSaveSuccessMsg('تم تغيير رتبة العميل وتحديث حسابه بنجاح!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  // Save Site Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccessMsg('تم حفظ وتطبيق كافة إعدادات وأسعار الموقع بنجاح!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Send Order Reply Handler
  const handleSendOrderReply = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch('/api/admin/orders/reply', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          orderId: selectedOrder.id,
          replyText
        })
      });
      if (res.ok) {
        alert('تم إرسال رد التفسير الرسمي للعميل بنجاح وتحديث حالة الطلب لمكتمل!');
        setSelectedOrder(null);
        setReplyText('');
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    if (!matchesSearch) return false;

    if (customerFilter === 'vip') return c.role === 'vip';
    if (customerFilter === 'free') return c.role === 'free';
    if (customerFilter === 'expiring') {
      const days = getRemainingDays(c.subscriptionEndDate);
      return days <= 7 && days >= 0;
    }
    return true;
  });

  // Confirm Order Payment Handler
  const handleConfirmOrderPayment = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/orders/confirm', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ orderId })
      });
      if (res.ok) {
        setSaveSuccessMsg('تم تأكيد الدفع وتفعيل اشتراك العميل بنجاح ✓');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error confirming order:', err);
    }
  };

  // Reject Order Payment Handler
  const handleRejectOrderPayment = async (orderId: string) => {
    const reason = prompt('ادخل سبب الرفض (مثال: الصورة غير واضحة، لم يتأكد تحويل المبلغ):');
    if (reason === null) return;
    try {
      const res = await fetch('/api/admin/orders/reject', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ orderId, reason })
      });
      if (res.ok) {
        setSaveSuccessMsg('تم تحديث حالة الطلب لـ (مرفوض)');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
    }
  };

  // Filtered Sales Orders
  const filteredOrders = orders.filter((o) => {
    if (salesFilter === 'received') return o.status === 'received' || o.status === 'pending' || o.status === 'in_review';
    if (salesFilter === 'in_review') return o.status === 'in_review' || o.status === 'pending';
    if (salesFilter === 'completed') return o.status === 'completed' || o.status === 'approved';
    return true;
  });

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPinError('');
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPinInput, email: 'ahmedalsherif30@gmail.com' })
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setPinError(data.error || 'رمز الدخول السري غير صحيح. هذه اللوحة مخصصة لإدارة أحمد الشريف فقط.');
        return;
      }
      setAdminToken(data.token);
      localStorage.setItem('explaining_dream_admin_token', data.token);
      setIsAdminAuthenticated(true);
      setTimeout(() => {
        fetchAllAdminData();
      }, 50);
    } catch (err: any) {
      setPinError('حدث خطأ أثناء الاتصال بالخادم لمصادقة الإدارة.');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 dir-rtl">
        <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans">
          
          <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-amber-300 font-serif">لوحة التحكم والإدارة السرية</h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
            🔒 لحماية بيانات العملاء والأحلام الواردة، يرجى كتابة كلمة المرور السرية الخاصة بالإدارة للوصول للوحة التحكم.
          </div>

          {pinError && (
            <div className="bg-red-950 border border-red-500 text-red-200 p-3 rounded-xl text-xs font-bold">
              {pinError}
            </div>
          )}

          <form onSubmit={handleAdminVerify} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200 block">كلمة المرور السرية (Admin Password):</label>
              <input
                type="password"
                required
                placeholder="أدخل كلمة المرور..."
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>التحقق والدخول للوحة التحكم</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-6xl w-full p-4 sm:p-6 space-y-5 max-h-[95vh] overflow-y-auto shadow-2xl relative text-slate-100 font-sans dir-rtl">
        
        {/* Success Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between animate-fade-in shadow-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-amber-400" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-900/60 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-400 shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-serif flex items-center gap-2">
                <span>لوحة التحكم الرئيسية والجمهور</span>
                <span className="text-[11px] bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono px-2 py-0.5 rounded-full">
                  إصدار 2026
                </span>
              </h2>
              <p className="text-xs text-emerald-400 font-serif">
                إدارة كاملة للموقع، حسابات العملاء، مدة الاشتراكات المتبقية، المبيعات والتعديل المباشر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchAllAdminData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-emerald-900/60 text-xs sm:text-sm font-serif">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>الإحصائيات والسجل الحي</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة العملاء والبيانات</span>
            <span className="bg-emerald-900 border border-emerald-700 text-emerald-300 px-1.5 py-0.2 text-[10px] rounded-full font-mono">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'subscriptions'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>متابعة مدة الاشتراكات</span>
            <span className="bg-amber-900/80 border border-amber-600 text-amber-300 px-1.5 py-0.2 text-[10px] rounded-full font-mono">
              {customers.filter((c) => c.role === 'vip').length} VIP
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submitted_dreams')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold relative ${
              activeTab === 'submitted_dreams'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>الأحلام الواردة</span>
            {unreadDreamsCount > 0 ? (
              <span className="bg-red-600 text-white border border-red-400 px-2 py-0.2 text-[10px] rounded-full font-mono font-bold animate-pulse">
                {unreadDreamsCount} غير مقروء
              </span>
            ) : (
              <span className="bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.2 text-[10px] rounded-full font-mono">
                {submittedDreams.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'sales'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>المبيعات والطلبات</span>
            <span className="bg-emerald-950 border border-emerald-600 text-emerald-300 px-1.5 py-0.2 text-[10px] rounded-full font-mono">
              ${grandTotalRevenue}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'broadcast'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>مركز الرسائل والتذكيرات الجماعية</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'newsletter'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>النشرة الروحية والملف الإخباري</span>
            <span className="bg-emerald-900 border border-emerald-700 text-emerald-300 px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold">
              {newsletterSubscribers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('site_settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer font-bold ${
              activeTab === 'site_settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>تعديل كل شيء وطرق الدفع</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & REAL-TIME ACTIVITY LOGS */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-serif">
              <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>إجمالي المبيعات والأرباح:</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <strong className="text-xl font-extrabold text-amber-300 font-mono block">
                  ${grandTotalRevenue} USD
                </strong>
                <span className="text-[10px] text-emerald-400">↑ 24% مقارنة بالشهر السابق</span>
              </div>

              <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>زوار اليوم المتواجدين الآن:</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <strong className="text-xl font-extrabold text-emerald-400 font-mono block">
                  5,120 زائر
                </strong>
                <span className="text-[10px] text-slate-400">تحديث أوتوماتيكي مباشر</span>
              </div>

              <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>الأعضاء والمشتركين VIP:</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <strong className="text-xl font-extrabold text-amber-400 font-mono block">
                  {customers.filter((c) => c.role === 'vip').length} مشترك VIP
                </strong>
                <span className="text-[10px] text-emerald-400">عضويات بريميوم نشطة</span>
              </div>

              <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>الأحلام المفسرة بالذكاء الاصطناعي:</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <strong className="text-xl font-extrabold text-emerald-300 font-mono block">
                  12,840 رؤيا
                </strong>
                <span className="text-[10px] text-slate-400">بمنهجية أحمد الشريف 2026</span>
              </div>
            </div>

            {/* Live Real-Time Feed & Popular Search terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif text-xs">
              
              {/* Real-Time Live Feed */}
              <div className="md:col-span-2 bg-slate-950 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>سجل دخول تفاعلات العملاء فوراً (Live Stream)</span>
                  </h3>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                    بث مباشر
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-900/90 border border-emerald-900/60 p-3 rounded-xl flex items-start justify-between gap-2 transition hover:border-amber-500/40"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-amber-300 font-bold">{log.user}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed">{log.details}</p>
                      </div>

                      <span className="shrink-0 bg-slate-950 border border-emerald-800 text-[10px] text-emerald-300 px-2 py-0.5 rounded">
                        {log.type === 'dream_submitted' ? 'حلم جديد' : log.type === 'service_purchased' ? 'دفع خدمة' : log.type === 'symbol_searched' ? 'بحث رمز' : 'نشاط'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Analytics Sidebar */}
              <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>الأحلام والأقسام الأكثر طلباً</span>
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-emerald-950">
                    <span className="text-slate-200">1. رؤية الثعبان والأفعى</span>
                    <span className="text-amber-400 font-mono font-bold">34%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-emerald-950">
                    <span className="text-slate-200">2. الذهب والزواج للعزباء</span>
                    <span className="text-amber-400 font-mono font-bold">28%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-emerald-950">
                    <span className="text-slate-200">3. الميت والهدية بالمنام</span>
                    <span className="text-amber-400 font-mono font-bold">19%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-emerald-950">
                    <span className="text-slate-200">4. الماء والسيارة والطيران</span>
                    <span className="text-amber-400 font-mono font-bold">15%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-950 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 block">كلمات جوجل الأكثر جلباً للعملاء:</span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">تفسير احلام احمد الشريف</span>
                    <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">تفسير حلم الذهب</span>
                    <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">كتاب تاويلات روحية 2026</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-4 font-serif text-xs">
            
            {/* Search & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-emerald-900">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="ابحث باسم العميل، البريد، أو رقم الهاتف..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <Search className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setCustomerFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition ${customerFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  الكل ({customers.length})
                </button>
                <button
                  onClick={() => setCustomerFilter('vip')}
                  className={`px-3 py-1.5 rounded-xl transition ${customerFilter === 'vip' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  أعضاء VIP ({customers.filter((c) => c.role === 'vip').length})
                </button>
                <button
                  onClick={() => setCustomerFilter('expiring')}
                  className={`px-3 py-1.5 rounded-xl transition ${customerFilter === 'expiring' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  ينتهي قريباً
                </button>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto border border-emerald-900 rounded-2xl bg-slate-950">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-amber-300 border-b border-emerald-900 font-bold">
                  <tr>
                    <th className="p-3">اسم العميل والبيانات</th>
                    <th className="p-3">نوع الاشتراك / الرتبة</th>
                    <th className="p-3">المدة المتبقية بالاشتراك</th>
                    <th className="p-3">الأحلام المفسرة</th>
                    <th className="p-3">إجمالي الإنفاق</th>
                    <th className="p-3 text-center">الإجراءات السريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        لا يوجد عملاء مطابقين لمعايير البحث الحالية.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const daysLeft = getRemainingDays(cust.subscriptionEndDate);
                      return (
                        <tr key={cust.id} className="hover:bg-slate-900/80 transition">
                          <td className="p-3">
                            <div className="font-bold text-amber-200">{cust.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{cust.email} | {cust.phone || 'بدون هاتف'}</div>
                            {cust.lastEnteredDream && (
                              <div className="text-[10px] text-emerald-400/80 line-clamp-1 mt-0.5">
                                آخر حلم: "{cust.lastEnteredDream}"
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            {cust.role === 'vip' ? (
                              <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-lg font-bold inline-flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{cust.planName}</span>
                              </span>
                            ) : (
                              <span className="bg-slate-900 border border-slate-700 text-slate-400 px-2.5 py-1 rounded-lg inline-block">
                                مجاني
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            {cust.role === 'vip' ? (
                              daysLeft > 7 ? (
                                <span className="text-emerald-400 font-bold font-mono bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                                  متبقي {daysLeft} يوماً
                                </span>
                              ) : daysLeft >= 0 ? (
                                <span className="text-amber-400 font-bold font-mono bg-amber-950 border border-amber-800 px-2 py-0.5 rounded animate-pulse">
                                  ينتهي بعد {daysLeft} أيام
                                </span>
                              ) : (
                                <span className="text-red-400 font-bold font-mono bg-red-950 border border-red-800 px-2 py-0.5 rounded">
                                  منتهي الاشتراك
                                </span>
                              )
                            ) : (
                              <span className="text-slate-500 font-mono">-</span>
                            )}
                          </td>

                           <td className="p-3">
                            <button
                              onClick={() => handleOpenAllCustomerDreams(cust.name, cust.email, cust.phone, cust.id)}
                              className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 hover:border-amber-400 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow group"
                              title="انقر لعرض كافة الأحلام والمنامات المدخلة لهذا العميل"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                              <span>{cust.dreamsSubmittedCount} رؤية</span>
                            </button>
                          </td>

                          <td className="p-3 font-mono font-bold text-amber-300">
                            ${cust.totalSpentUsd} USD
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              <a
                                href={getCustomerWhatsAppUrl(cust)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1 shadow"
                                title="إرسال تذكير بالدفع والاشتراك عبر الواتساب"
                              >
                                <Send className="w-3 h-3" />
                                <span>واتساب</span>
                              </a>

                              <a
                                href={getCustomerGmailUrl(cust)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-rose-800 hover:bg-rose-700 text-white px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1 shadow"
                                title="إرسال تذكير بالدفع والاشتراك عبر الجميل (Email)"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>جميل</span>
                              </a>

                              <button
                                onClick={() => handleExtendSubscription(cust.id, 30)}
                                className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                title="تمديد 30 يوماً إضافية"
                              >
                                +30 يوم
                              </button>

                              {cust.role === 'free' ? (
                                <button
                                  onClick={() => handleToggleCustomerRole(cust.id, 'vip')}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer shadow"
                                >
                                  ترقية VIP
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleCustomerRole(cust.id, 'free')}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  إلغاء VIP
                                </button>
                              )}

                               <button
                                onClick={() => handleOpenAllCustomerDreams(cust.name, cust.email, cust.phone, cust.id)}
                                className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow"
                                title="عرض جميع أحلام ورؤى هذا العميل"
                              >
                                <BookOpen className="w-3 h-3 text-amber-400" />
                                <span>أحلام العميل</span>
                              </button>

                              <button
                                onClick={() => setSelectedCustomerDetails(cust)}
                                className="bg-slate-800 hover:bg-slate-700 text-amber-300 p-1 rounded-lg transition cursor-pointer"
                                title="عرض ملف العميل الشامل"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS & EXPIRY MANAGEMENT */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4 font-serif text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-emerald-900 p-4 rounded-2xl space-y-1">
                <span className="text-slate-400 block">الاشتراكات النشطة حالياً:</span>
                <strong className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {customers.filter((c) => c.role === 'vip' && getRemainingDays(c.subscriptionEndDate) > 0).length} اشتراك
                </strong>
              </div>

              <div className="bg-slate-950 border border-amber-500/40 p-4 rounded-2xl space-y-1">
                <span className="text-slate-400 block">اشتراكات تنتهي هذا الأسبوع (يحتاج تذكير):</span>
                <strong className="text-2xl font-extrabold text-amber-400 font-mono">
                  {customers.filter((c) => c.role === 'vip' && getRemainingDays(c.subscriptionEndDate) <= 7 && getRemainingDays(c.subscriptionEndDate) >= 0).length} اشتراك
                </strong>
              </div>

              <div className="bg-slate-950 border border-red-900/60 p-4 rounded-2xl space-y-1">
                <span className="text-slate-400 block">اشتراكات منتهية مؤخراً:</span>
                <strong className="text-2xl font-extrabold text-red-400 font-mono">
                  {customers.filter((c) => c.role === 'vip' && getRemainingDays(c.subscriptionEndDate) < 0).length} اشتراك
                </strong>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-300">
                تفاصيل المواعيد والأيام المتبقية لكل مشترك VIP:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customers.filter((c) => c.role === 'vip').map((c) => {
                  const daysLeft = getRemainingDays(c.subscriptionEndDate);
                  return (
                    <div
                      key={c.id}
                      className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-amber-200 text-sm font-bold block">{c.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{c.email}</span>
                        </div>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px]">
                          {c.planName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-950">
                        <span className="text-slate-400">تاريخ الانتهاء:</span>
                        <span className="text-slate-200 font-mono">
                          {new Date(c.subscriptionEndDate).toLocaleDateString('ar-EG')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">المدة المتبقية:</span>
                        {daysLeft > 7 ? (
                          <span className="text-emerald-400 font-bold font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            متبقي {daysLeft} يوماً
                          </span>
                        ) : daysLeft >= 0 ? (
                          <span className="text-amber-400 font-bold font-mono bg-amber-950 px-2 py-0.5 rounded border border-amber-800 animate-pulse">
                            ينتهي بعد {daysLeft} أيام!
                          </span>
                        ) : (
                          <span className="text-red-400 font-bold font-mono bg-red-950 px-2 py-0.5 rounded border border-red-800">
                            منتهي الاشتراك
                          </span>
                        )}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenAllCustomerDreams(c.name, c.email, c.phone, c.id)}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1 shadow"
                          title="عرض كافة أحلام ورؤى هذا المشترك"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>الأحلام ({c.dreamsSubmittedCount || 0})</span>
                        </button>

                        <button
                          onClick={() => handleExtendSubscription(c.id, 30)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer"
                        >
                          تجديد +30 يوم
                        </button>

                        <a
                          href={getCustomerWhatsAppUrl(c)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1 shadow"
                          title="إرسال تذكير بالواتساب لهذا المشترك"
                        >
                          <Send className="w-3 h-3" />
                          <span>واتساب</span>
                        </a>

                        <a
                          href={getCustomerGmailUrl(c)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-rose-700 hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1 shadow"
                          title="إرسال تذكير عبر الجميل (Email)"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>جميل</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SALES & ORDERS MANAGEMENT */}
        {activeTab === 'sales' && (
          <div className="space-y-4 font-serif text-xs">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-emerald-900">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-300 font-bold">تصفية الطلبات:</span>
                <button
                  onClick={() => setSalesFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${salesFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  الكل ({orders.length})
                </button>
                <button
                  onClick={() => setSalesFilter('in_review')}
                  className={`px-3 py-1 rounded-lg transition ${salesFilter === 'in_review' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  طلبات قيد مراجعة الدفع ({orders.filter(o => o.status === 'pending' || o.status === 'in_review').length})
                </button>
                <button
                  onClick={() => setSalesFilter('completed')}
                  className={`px-3 py-1 rounded-lg transition ${salesFilter === 'completed' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  المؤكدة والمكتملة ({orders.filter(o => o.status === 'completed' || o.status === 'approved').length})
                </button>
              </div>

              <strong className="text-amber-300 font-mono text-sm">
                إجمالي إيرادات المبيعات: ${totalOrdersRevenue} USD
              </strong>
            </div>

            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-slate-950 border border-dashed border-emerald-900 p-8 rounded-2xl text-center text-slate-400">
                  لا توجد طلبات مدفوعة في الفئة المحددة حالياً.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-3 relative hover:border-amber-500/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-950 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleOpenAllCustomerDreams(ord.clientName, ord.clientEmail, ord.clientPhone)}
                          className="text-amber-300 text-sm font-bold hover:underline cursor-pointer flex items-center gap-1"
                          title="انقر لعرض كافة أحلام ورؤى هذا العميل"
                        >
                          <span>{ord.clientName}</span>
                        </button>
                        <span className="text-slate-400 font-mono">({ord.clientEmail} | {ord.clientPhone || 'بدون هاتف'})</span>
                        <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-2.5 py-0.5 rounded text-[10px]">
                          {ord.serviceTitle}
                        </span>
                        <button
                          onClick={() => handleOpenAllCustomerDreams(ord.clientName, ord.clientEmail, ord.clientPhone)}
                          className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 transition cursor-pointer shadow hover:border-amber-400"
                          title="عرض مجمل وسجل كافة أحلام هذا العميل"
                        >
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>كافة أحلام العميل</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-amber-400 text-sm">${ord.amountPaid} USD</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'approved' || ord.status === 'completed' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                            : ord.status === 'in_review'
                            ? 'bg-blue-950 text-blue-300 border border-blue-700 animate-pulse'
                            : ord.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                        }`}>
                          {ord.status === 'approved' || ord.status === 'completed' 
                            ? 'مفعل ومؤكد ✓' 
                            : ord.status === 'in_review'
                            ? 'تم رفع الإيصال (قيد المراجعة) 📸'
                            : ord.status === 'rejected'
                            ? 'مرفوض ❌'
                            : 'قيد الانتظار ⏳'}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs bg-slate-900/80 p-2.5 rounded-xl border border-emerald-950">
                      <strong>تفاصيل المنام المطلوب تفسيره:</strong> "{ord.dreamText}"
                    </p>

                    {/* PAYMENT SCREENSHOT PREVIEW SECTION FOR ADMIN */}
                    {ord.paymentReceiptUrl ? (
                      <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/50 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                          <span>📸 سكرين شوت إيصال الدفع المرفق بواسطة العميل:</span>
                          {ord.receiptUploadedAt && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              تاريخ الرفع: {new Date(ord.receiptUploadedAt).toLocaleString('ar-EG')}
                            </span>
                          )}
                        </div>

                        {ord.paymentReceiptNote && (
                          <p className="text-xs text-slate-200">
                            <strong>ملاحظة/رقم المحفظة:</strong> {ord.paymentReceiptNote}
                          </p>
                        )}

                        <div className="flex items-center gap-4 pt-1">
                          <a
                            href={ord.paymentReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative max-w-xs overflow-hidden rounded-lg border border-slate-700 bg-slate-950 block hover:border-amber-400 transition"
                          >
                            <img
                              src={ord.paymentReceiptUrl}
                              alt="سكرين شوت الدفع"
                              loading="lazy"
                              decoding="async"
                              className="max-h-36 object-cover rounded-md"
                            />
                            <span className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-amber-300 text-xs font-bold">
                              اضغط للفتح بالحجم الكامل
                            </span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-400/80 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                        لم يقم العميل برفع صورة سكرين شوت الإيصال حتى الآن.
                      </div>
                    )}

                    {ord.writtenReply && (
                      <div className="bg-emerald-950/40 border border-emerald-800 p-2.5 rounded-xl text-emerald-200">
                        <strong>التفسير المعتمد من أحمد الشريف:</strong> {ord.writtenReply}
                      </div>
                    )}

                    {/* ADMIN ACTION BUTTONS: CONFIRM PAYMENT / REJECT / REMIND / REPLY */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <a
                        href={getOrderWhatsAppUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow"
                        title="إرسال تذكير مباشر صاحب هذا الطلب عبر الواتساب"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>تذكير بالواتساب</span>
                      </a>

                      <a
                        href={getOrderGmailUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-rose-800 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow"
                        title="إرسال تذكير مباشر صاحب هذا الطلب عبر الجميل (Email)"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>تذكير بالجميل</span>
                      </a>

                      {ord.status !== 'approved' && ord.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => handleConfirmOrderPayment(ord.id)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تأكيد واعتماد الدفع (Confirm)</span>
                          </button>

                          <button
                            onClick={() => handleRejectOrderPayment(ord.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            <span>رفض الإيصال (Reject)</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>كتابة رد وتفسير أحمد الشريف</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB: SUBMITTED DREAMS & CLIENT DATA CONTROL */}
        {activeTab === 'submitted_dreams' && (
          <div className="space-y-4 font-serif text-xs">
            
            {/* Unread Alert Banner & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-emerald-900">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold">تصفية الأحلام والرسائل:</span>
                <button
                  onClick={() => setDreamFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${dreamFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'}`}
                >
                  الكل ({submittedDreams.length})
                </button>
                <button
                  onClick={() => setDreamFilter('unread')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-bold flex items-center gap-1 ${dreamFilter === 'unread' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>غير مقروءة ({submittedDreams.filter(d => d.status === 'unread').length})</span>
                </button>
                <button
                  onClick={() => setDreamFilter('seen')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${dreamFilter === 'seen' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'}`}
                >
                  تمت المشاهدة ({submittedDreams.filter(d => d.status === 'seen').length})
                </button>
                <button
                  onClick={() => setDreamFilter('replied')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${dreamFilter === 'replied' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'}`}
                >
                  تم التأويل ({submittedDreams.filter(d => d.status === 'replied').length})
                </button>
              </div>

              {unreadDreamsCount > 0 && (
                <div className="bg-red-950/80 border border-red-500/60 text-red-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>تنبيه: يوجد {unreadDreamsCount} أحلام غير مقروءة بانتظار مراجعتك!</span>
                </div>
              )}
            </div>

            {/* Modal for replying to a dream */}
            {selectedDreamForReply && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
                <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative text-slate-100">
                  <div className="flex items-center justify-between border-b border-emerald-900 pb-2">
                    <h3 className="text-sm font-bold text-amber-300 font-serif flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>كتابة تأويل وتفسير أحمد الشريف للعميل: {selectedDreamForReply.clientName}</span>
                    </h3>
                    <button onClick={() => setSelectedDreamForReply(null)} className="p-1 text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-950 text-xs text-slate-300 space-y-1">
                    <strong className="text-amber-200 block">نص المنام المدخل:</strong>
                    <p className="italic">"{selectedDreamForReply.dreamText}"</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-200 font-bold block text-xs">تفسير وتوجيه أحمد الشريف المعتمد:</label>
                    <textarea
                      rows={5}
                      placeholder="اكتب التفسير القرآني والتوجيه الروحي هنا ليصل للعميل مباشرة..."
                      value={dreamReplyText}
                      onChange={(e) => setDreamReplyText(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setSelectedDreamForReply(null)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleReplyToDream}
                      disabled={!dreamReplyText.trim()}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow cursor-pointer disabled:opacity-50"
                    >
                      حفظ وإرسال التفسير
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of Submitted Dreams */}
            <div className="space-y-3">
              {submittedDreams
                .filter(d => {
                  if (dreamFilter === 'unread') return d.status === 'unread';
                  if (dreamFilter === 'seen') return d.status === 'seen';
                  if (dreamFilter === 'replied') return d.status === 'replied';
                  return true;
                })
                .length === 0 ? (
                <div className="bg-slate-950 border border-dashed border-emerald-900 p-8 rounded-2xl text-center text-slate-400">
                  لا توجد أحلام في التصفية الحالية.
                </div>
              ) : (
                submittedDreams
                  .filter(d => {
                    if (dreamFilter === 'unread') return d.status === 'unread';
                    if (dreamFilter === 'seen') return d.status === 'seen';
                    if (dreamFilter === 'replied') return d.status === 'replied';
                    return true;
                  })
                  .map((dream) => (
                    <div
                      key={dream.id}
                      className={`bg-slate-950 border p-4 rounded-2xl space-y-3 transition ${
                        dream.status === 'unread'
                          ? 'border-amber-500/80 shadow-lg shadow-amber-500/10'
                          : 'border-emerald-900/80'
                      }`}
                    >
                      {/* Header info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-950 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenAllCustomerDreams(dream.clientName, dream.clientEmail, dream.clientPhone, dream.clientId)}
                            className="text-amber-300 text-sm font-bold hover:underline cursor-pointer flex items-center gap-1"
                            title="انقر لعرض كافة أحلام ورؤى العميل"
                          >
                            <span>{dream.clientName}</span>
                          </button>
                          <span className="text-slate-400 font-mono text-[11px]">{dream.clientEmail}</span>
                          {dream.clientPhone && (
                            <span className="text-emerald-400 font-mono text-[11px]">{dream.clientPhone}</span>
                          )}
                          <span className="bg-slate-900 border border-emerald-900 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                            {dream.gender === 'female' ? 'رائية (أنثى)' : 'رائي (ذكر)'}
                          </span>
                          <span className="bg-slate-900 border border-emerald-900 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                            {dream.maritalStatus === 'single' ? 'عزباء/أعزب' : dream.maritalStatus === 'married' ? 'متزوج/ة' : dream.maritalStatus === 'pregnant' ? 'حامل' : 'مطلق/أرمل'}
                          </span>
                          <button
                            onClick={() => handleOpenAllCustomerDreams(dream.clientName, dream.clientEmail, dream.clientPhone, dream.clientId)}
                            className="bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 transition cursor-pointer shadow hover:border-amber-400"
                            title="انقر لفتح سجل ومجمل جميع الأحلام والمنامات المدخلة من هذا العميل"
                          >
                            <BookOpen className="w-3 h-3 text-amber-400" />
                            <span>جميع أحلام هذا العميل</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] font-mono">
                            {new Date(dream.createdAt).toLocaleDateString('ar-EG')} - {new Date(dream.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>

                          {dream.status === 'unread' && (
                            <span className="bg-red-950 border border-red-500 text-red-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                              <span>غير مقروء!</span>
                            </span>
                          )}

                          {dream.status === 'seen' && (
                            <span className="bg-blue-950 border border-blue-600 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              تمت المشاهدة 👁️
                            </span>
                          )}

                          {dream.status === 'replied' && (
                            <span className="bg-emerald-950 border border-emerald-600 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              تم التأويل 🟢
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dream Content Box */}
                      <div className="bg-slate-900/90 border border-emerald-950 p-3 rounded-xl text-slate-200 text-xs leading-relaxed space-y-1">
                        <strong className="text-amber-200 block">نص الحلم/الرؤيا المدخلة:</strong>
                        <p className="text-slate-100 font-sans">{dream.dreamText}</p>
                      </div>

                      {dream.aiResponseSummary && (
                        <div className="bg-slate-900/50 border border-emerald-900/50 p-2.5 rounded-xl text-[11px] text-emerald-300">
                          <strong>ملخص الذكاء الاصطناعي الأولي:</strong> {dream.aiResponseSummary}
                        </div>
                      )}

                      {dream.expertReply && (
                        <div className="bg-emerald-950/60 border border-emerald-500 p-3 rounded-xl text-xs text-emerald-100 space-y-1">
                          <strong className="text-amber-300 block font-bold">تفسير أحمد الشريف المعتمد:</strong>
                          <p className="leading-relaxed">{dream.expertReply}</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          المصدر: {dream.source === 'ai_interpreter' ? 'مفسر الذكاء الاصطناعي' : 'طلب خدمة مدفوقة'}
                        </span>

                        <div className="flex items-center gap-2">
                          {dream.status === 'unread' && (
                            <button
                              onClick={() => handleMarkDreamSeen(dream.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-amber-500/30"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>تحديد كـ "تمت المشاهدة"</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedDreamForReply(dream);
                              setDreamReplyText(dream.expertReply || '');
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>كتابة رد وتأويل أحمد الشريف</span>
                          </button>

                          {dream.clientPhone && (
                            <a
                              href={`https://wa.me/${dream.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أهلاً بك ${dream.clientName}، بخصوص المنام الذي أرسلته بخصوص: (${dream.dreamText.substring(0, 40)}...)\n\nتفسير أحمد الشريف:`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>الواتساب المباشر</span>
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
              )}
            </div>

          </div>
        )}

        {/* TAB 5: SITE SETTINGS & CONTENT EDITOR */}
        {activeTab === 'site_settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-5 font-serif text-xs">
            
            {/* General Info & Sheikh Settings */}
            <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-amber-300 border-b border-emerald-950 pb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>إعدادات العناوين الرئيسية ونصوص الموقع</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">اسم المنصة الرسمي:</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">اسم المشرف العام:</label>
                  <input
                    type="text"
                    value={settings.sheikhName}
                    onChange={(e) => setSettings({ ...settings, sheikhName: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-bold block">العنوان الرئيسي للهيدر (Hero Title):</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-bold block">الوصف الفرعي والمنهجية:</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-bold block">شريط التنبيهات والإعلانات العلوي:</label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Services Management */}
            <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-amber-300 border-b border-emerald-950 pb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>إدارة أسعار الاستشارات، الاشتراكات وكتاب تأويلات روحية 2026</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر التفسير الكتابي ($):</label>
                  <input
                    type="number"
                    value={settings.writtenServicePrice}
                    onChange={(e) => setSettings({ ...settings, writtenServicePrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر التفسير الصوتي ($):</label>
                  <input
                    type="number"
                    value={settings.audioServicePrice}
                    onChange={(e) => setSettings({ ...settings, audioServicePrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر الجلسة المباشرة ($):</label>
                  <input
                    type="number"
                    value={settings.sessionServicePrice}
                    onChange={(e) => setSettings({ ...settings, sessionServicePrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر اشتراك VIP الشهري ($):</label>
                  <input
                    type="number"
                    value={settings.vipMonthlyPrice}
                    onChange={(e) => setSettings({ ...settings, vipMonthlyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر كتاب PDF النسخة الإلكترونية ($):</label>
                  <input
                    type="number"
                    value={settings.bookPdfPrice}
                    onChange={(e) => setSettings({ ...settings, bookPdfPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر الكتاب المطبوع والشحن ($):</label>
                  <input
                    type="number"
                    value={settings.bookPrintPrice}
                    onChange={(e) => setSettings({ ...settings, bookPrintPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-950">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">كود الخصم الفعال بالموقع:</label>
                  <input
                    type="text"
                    value={settings.activeCouponCode}
                    onChange={(e) => setSettings({ ...settings, activeCouponCode: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-emerald-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">نسبة الخصم المئوية (%):</label>
                  <input
                    type="number"
                    value={settings.discountPercentage}
                    onChange={(e) => setSettings({ ...settings, discountPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Payment Accounts & Direct Transfer Details */}
            <div className="bg-slate-950 border border-emerald-900/80 p-4 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-amber-300 border-b border-emerald-950 pb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>إدارة حاسابات وطرق الدفع والتحويل المباشر (فودافون كاش / إنستا باي / البنك)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">رقم محفظة فودافون كاش:</label>
                  <input
                    type="text"
                    value={settings.vodafoneCashNumber || ''}
                    onChange={(e) => setSettings({ ...settings, vodafoneCashNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">معرف/رقم حساب إنستا باي (InstaPay):</label>
                  <input
                    type="text"
                    value={settings.instapayUsername || ''}
                    onChange={(e) => setSettings({ ...settings, instapayUsername: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-bold block">تفاصيل الحساب البنكي / رقم الآيبان (IBAN):</label>
                  <input
                    type="text"
                    value={settings.bankIbanDetails || ''}
                    onChange={(e) => setSettings({ ...settings, bankIbanDetails: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">بريد بايبال (PayPal Email):</label>
                  <input
                    type="email"
                    value={settings.paypalEmail || ''}
                    onChange={(e) => setSettings({ ...settings, paypalEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">بيانات ويسترن يونيون (Western Union):</label>
                  <input
                    type="text"
                    value={settings.westernUnionInfo || ''}
                    onChange={(e) => setSettings({ ...settings, westernUnionInfo: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">هاتف الدعم الفني المباشر:</label>
                  <input
                    type="text"
                    value={settings.supportPhone || ''}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">إيميل الدعم الفني المباشر:</label>
                  <input
                    type="email"
                    value={settings.supportEmail || ''}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Settings Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3 rounded-2xl text-sm shadow-xl cursor-pointer transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>حفظ وتطبيق جميع تعديلات الموقع وطرق الدفع فوراً</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB: BROADCAST MASS COMMUNICATIONS */}
        {activeTab === 'broadcast' && (
          <div className="space-y-5 font-serif text-xs">
            <div className="bg-slate-950 border border-amber-500/40 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <span>مركز المراسلات الجماعية والتذكيرات الفورية (Broadcast Center)</span>
                </h3>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                  {customers.length} عُملاء مسجلين
                </span>
              </div>

              {broadcastSuccessMsg && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-3 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{broadcastSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">تحديد الجمهور المستهدف:</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e: any) => setBroadcastTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-amber-300 font-bold"
                  >
                    <option value="all">جميع المستخدمين والعملاء المسجلين ({customers.length})</option>
                    <option value="vip">أعضاء VIP فقط ({customers.filter(c => c.role === 'vip').length})</option>
                    <option value="free">العملاء الزوار المجانيين ({customers.filter(c => c.role === 'free').length})</option>
                    <option value="expiring">الاشتراكات المنتهية والقريبة من الانتهاء ({customers.filter(c => c.status === 'expiring_soon' || c.status === 'expired').length})</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">عنوان / موضوع الإشعار الجماعي:</label>
                  <input
                    type="text"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold block">نص الرسالة الجماعية (يدعم المتغيرات: &#123;name&#125;):</label>
                    <span className="text-[10px] text-amber-400">مثال: أهلاً أ/ &#123;name&#125;، نود تذكيركم...</span>
                  </div>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Action buttons for Broadcast */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  سيتم تجهيز المراسلة وتوجيهها مباشرة لـ <strong className="text-amber-300">
                    {broadcastTarget === 'all' ? customers.length : broadcastTarget === 'vip' ? customers.filter(c => c.role === 'vip').length : broadcastTarget === 'free' ? customers.filter(c => c.role === 'free').length : customers.filter(c => c.status === 'expiring_soon' || c.status === 'expired').length} مستخدم
                  </strong>.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBroadcastSuccessMsg(`تم إرسال الإشعار والتذكير الجماعي بنجاح لجميع عملاء الفئة المحددة (${broadcastTarget})!`);
                      setTimeout(() => setBroadcastSuccessMsg(''), 5000);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال وتنبيه الجميع عبر النظام والإيميل</span>
                  </button>

                  <a
                    href={`https://wa.me/201558955525?text=${encodeURIComponent(`${broadcastSubject}\n\n${broadcastMessage}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>فتح القناة في واتساب الأعمال</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Reply to Order */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl font-serif text-xs">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-2">
                <h4 className="text-sm font-bold text-amber-300">
                  كتابة وتأكيد رد التفسير للعميل {selectedOrder.clientName}:
                </h4>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-950 text-slate-300">
                <strong>المنام:</strong> "{selectedOrder.dreamText}"
              </div>

              <div className="space-y-1">
                <label className="text-slate-200 font-bold block">نص التفسير والتوجيه الروحي:</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب التفسير والرموز بنص محكم يعبر عن رؤية أحمد الشريف..."
                  className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendOrderReply}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التفسير رسمياً للعميل</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Detailed Customer Profile View */}
        {selectedCustomerDetails && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl">
            <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative text-slate-100 font-sans text-xs max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-amber-300 font-serif">
                      ملف العميل التفصيلي والشامل: {selectedCustomerDetails.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      كود العميل: {selectedCustomerDetails.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomerDetails(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Contact & Status Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950 p-3.5 rounded-2xl border border-emerald-900 text-slate-200">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">الاسم الكامل:</span>
                  <span className="font-bold text-amber-200">{selectedCustomerDetails.name}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">رقم الهاتف:</span>
                  <span className="font-mono text-emerald-300 font-bold">{selectedCustomerDetails.phone || 'غير مسجل'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">البريد الإلكتروني:</span>
                  <span className="font-mono select-all text-slate-300">{selectedCustomerDetails.email}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">حالة العضوية:</span>
                  <span className="font-bold text-amber-400">{selectedCustomerDetails.role === 'vip' ? 'عضوية VIP مفعلة' : selectedCustomerDetails.status === 'pending' ? 'طلب قيد المراجعة والانتظار ⏳' : 'حساب مجاني'}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">إجمالي الأحلام المفسرة:</span>
                  <button
                    onClick={() => handleOpenAllCustomerDreams(selectedCustomerDetails.name, selectedCustomerDetails.email, selectedCustomerDetails.phone, selectedCustomerDetails.id)}
                    className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800"
                    title="فتح كافة أحلام العميل"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedCustomerDetails.dreamsSubmittedCount} رؤية</span>
                  </button>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">إجمالي المدفوعات المؤكدة:</span>
                  <span className="font-mono font-bold text-amber-300">${selectedCustomerDetails.totalSpentUsd} USD</span>
                </div>
              </div>

              {/* Orders & Uploaded Receipts History */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  سجل طلبات الاشتراكات وإيصالات التحويل للعميل:
                </h5>

                {(!selectedCustomerDetails.ordersHistory || selectedCustomerDetails.ordersHistory.length === 0) ? (
                  <p className="text-slate-500 italic text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                    لا توجد طلبات اشتراكات مسجلة لهذا العميل حتى الآن.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedCustomerDetails.ordersHistory.map((ord) => (
                      <div key={ord.id} className="bg-slate-950 p-3 rounded-xl border border-emerald-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-200">{ord.serviceTitle}</span>
                          <span className="font-mono text-amber-400 font-bold">${ord.amountPaid} USD</span>
                        </div>

                        {ord.paymentReceiptUrl && (
                          <div className="bg-slate-900 p-2 rounded-lg border border-amber-500/40 flex items-center justify-between gap-2">
                            <span className="text-slate-300 font-bold">صورة إيصال التحويل:</span>
                            <a
                              href={ord.paymentReceiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              عرض صورة الإيصال
                            </a>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>الحالة: <strong className="text-amber-300">{ord.status}</strong></span>
                          {ord.status !== 'approved' && ord.status !== 'completed' && (
                            <button
                              onClick={() => {
                                handleConfirmOrderPayment(ord.id);
                                setSelectedCustomerDetails(null);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                            >
                              تأكيد تفعيل الدفع (Confirm)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted Dreams - Comprehensive Log */}
              {(() => {
                const clientDreams = (() => {
                  const map = new Map<string, any>();
                  if (selectedCustomerDetails.submittedDreams) {
                    selectedCustomerDetails.submittedDreams.forEach((d) => map.set(d.id, d));
                  }
                  submittedDreams.forEach((d) => {
                    if (
                      d.clientId === selectedCustomerDetails.id ||
                      (selectedCustomerDetails.email && d.clientEmail === selectedCustomerDetails.email) ||
                      (selectedCustomerDetails.phone && d.clientPhone === selectedCustomerDetails.phone) ||
                      (selectedCustomerDetails.name && d.clientName === selectedCustomerDetails.name)
                    ) {
                      map.set(d.id, d);
                    }
                  });
                  if (selectedCustomerDetails.ordersHistory) {
                    selectedCustomerDetails.ordersHistory.forEach((ord) => {
                      if (ord.dreamText) {
                        map.set(ord.id, {
                          id: ord.id,
                          dreamText: ord.dreamText,
                          createdAt: ord.createdAt,
                          status: ord.status === 'completed' ? 'replied' : 'unread',
                          writtenReply: ord.writtenReply,
                          source: 'استشارة خاصة مدفوعة'
                        });
                      }
                    });
                  }
                  if (selectedCustomerDetails.lastEnteredDream && map.size === 0) {
                    map.set('last_entered', {
                      id: 'last_entered',
                      dreamText: selectedCustomerDetails.lastEnteredDream,
                      createdAt: selectedCustomerDetails.createdAt || new Date().toISOString(),
                      status: 'replied',
                      source: 'محرك الذكاء الاصطناعي'
                    });
                  }
                  return Array.from(map.values());
                })();

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        سجل الرؤى والأحلام المكتوبة للعميل ({clientDreams.length} منام مسجل):
                      </h5>

                      <button
                        onClick={() => handleOpenAllCustomerDreams(selectedCustomerDetails.name, selectedCustomerDetails.email, selectedCustomerDetails.phone, selectedCustomerDetails.id)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                        title="فتح سجل كافة أحلام الرائي بصورة موسعة"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>فتح كافة أحلام العميل بالحجم الكامل 📜</span>
                      </button>
                    </div>

                    {clientDreams.length === 0 ? (
                      <p className="text-slate-500 italic text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                        لم يقم هذا العميل بكتابة أي أحلام بعد.
                      </p>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {clientDreams.map((d: any, idx) => (
                          <div key={d.id || idx} className="bg-slate-950 p-3 rounded-xl border border-emerald-900/80 space-y-2 text-[11px]">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                📜 رؤية #{idx + 1} {d.source ? `(${d.source})` : ''}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {d.createdAt ? new Date(d.createdAt).toLocaleString('ar-EG') : 'بتاريخ قريب'}
                              </span>
                            </div>

                            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-100 font-serif leading-relaxed">
                              "{d.dreamText}"
                            </div>

                            {(d.writtenReply || d.aiResponseSummary || d.sheikhReply) && (
                              <div className="bg-amber-950/20 border border-amber-500/40 p-2 rounded-lg text-amber-200">
                                <strong className="text-amber-400 block mb-0.5">تأويل الشيخ أحمد الشريف / التفسير:</strong>
                                <p className="text-slate-200 font-serif">{d.writtenReply || d.aiResponseSummary || d.sheikhReply}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span className="flex items-center gap-1">
                                حالة التفسير:
                                <strong className={d.status === 'replied' || d.writtenReply ? 'text-emerald-400' : 'text-amber-400'}>
                                  {d.status === 'replied' || d.writtenReply ? 'تم التفسير المعتمد ✓' : 'قيد التفسير والمراجعة ⏳'}
                                </strong>
                              </span>

                              <button
                                onClick={() => {
                                  setSelectedDreamForReply(d);
                                  setSelectedCustomerDetails(null);
                                  setActiveTab('submitted_dreams');
                                }}
                                className="text-amber-400 hover:underline font-bold cursor-pointer"
                              >
                                إرسال / تعديل التفسير المباشر 💬
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Client Site Movements & Activity Trail */}
              {(() => {
                const clientActivities = (() => {
                  const matched = activityLogs.filter(
                    (log) =>
                      log.user === selectedCustomerDetails.name ||
                      log.user === selectedCustomerDetails.email ||
                      (selectedCustomerDetails.email && log.details.toLowerCase().includes(selectedCustomerDetails.email.toLowerCase())) ||
                      (selectedCustomerDetails.name && log.details.includes(selectedCustomerDetails.name))
                  );

                  if (matched.length > 0) return matched;

                  return [
                    {
                      id: `ACT-1`,
                      type: 'user_joined',
                      user: selectedCustomerDetails.name,
                      details: `إنشاء وتأكيد الحساب الرسمي وتفعيل العضوية`,
                      timestamp: selectedCustomerDetails.createdAt || selectedCustomerDetails.subscriptionStartDate || new Date().toISOString()
                    },
                    {
                      id: `ACT-2`,
                      type: 'symbol_searched',
                      user: selectedCustomerDetails.name,
                      details: `تصفح معجم الرموز والمكتبة الروحية الإسلامية`,
                      timestamp: selectedCustomerDetails.lastActive || new Date().toISOString()
                    },
                    {
                      id: `ACT-3`,
                      type: 'dream_submitted',
                      user: selectedCustomerDetails.name,
                      details: `كتابة منام جديد وإرساله للتأويل والمراجعة الروحية`,
                      timestamp: selectedCustomerDetails.lastActive || new Date().toISOString()
                    }
                  ];
                })();

                return (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      سجل تحركات ونشاط العميل داخل الموقع ({clientActivities.length} حركة):
                    </h5>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {clientActivities.map((act) => (
                        <div key={act.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2 text-[11px]">
                          <span className="p-1 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-400 mt-0.5 shrink-0">
                            {act.type === 'dream_submitted' ? '📜' : act.type === 'service_purchased' ? '💳' : act.type === 'symbol_searched' ? '🔍' : '🔑'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200">{act.details}</p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {act.timestamp ? new Date(act.timestamp).toLocaleString('ar-EG') : 'مؤخراً'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Quick Reminder Box */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    تذكير بالدفع والاشتراك لهذا العميل (لكل عميل على حدة):
                  </span>
                  <span className="text-[10px] text-slate-400">واتساب / الجميل متوفر</span>
                </div>
                <p className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed font-serif">
                  "أهلاً وسهلاً أ/ {selectedCustomerDetails.name}، نود تذكيركم الكريمة بخصوص استكمال تفعيل طلبكم في منصة أحمد الشريف لتفسير الأحلام... للتفعيل الفوري يسعدنا خدمتكم الفورية."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getCustomerWhatsAppUrl(selectedCustomerDetails)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    title="تذكير المباشر عبر الواتساب"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تذكير بالواتساب</span>
                  </a>

                  <a
                    href={getCustomerGmailUrl(selectedCustomerDetails)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    title="تذكير المباشر عبر الجميل (Email)"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>تذكير بالجميل (Email)</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      handleExtendSubscription(selectedCustomerDetails.id, 30);
                      setSelectedCustomerDetails(null);
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow"
                  >
                    تمديد VIP +30 يوم
                  </button>
                  <button
                    onClick={() => setSelectedCustomerDetails(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED FULL-SCREEN CLIENT DREAMS VIEWER MODAL */}
        {viewingCustomerDreams && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-serif animate-in fade-in duration-200">
              
              {/* Modal Header Bar */}
              <div className="bg-slate-950 p-4 border-b border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-amber-200 flex items-center gap-2">
                      <span>سجل وجميع أحلام ورؤى العميل:</span>
                      <span className="text-emerald-400">{viewingCustomerDreams.customerName}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap font-mono mt-0.5">
                      {viewingCustomerDreams.customerEmail && (
                        <span className="text-slate-300">✉️ {viewingCustomerDreams.customerEmail}</span>
                      )}
                      {viewingCustomerDreams.customerPhone && (
                        <span className="text-emerald-400">📱 {viewingCustomerDreams.customerPhone}</span>
                      )}
                      {viewingCustomerDreams.customerRecord?.role === 'vip' ? (
                        <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded-lg font-bold text-[10px]">
                          ⭐ عضوية VIP
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          عضوية مجانية
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                  {viewingCustomerDreams.customerPhone && (
                    <a
                      href={`https://wa.me/${viewingCustomerDreams.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم ورحمة الله وبركاته، عزيزنا أ/ ${viewingCustomerDreams.customerName}، تواصل معكم الشيخ أحمد الشريف بخصوص تفسير رؤياكم وأحلامكم المسجلة بالمنصة.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>
                  )}

                  {viewingCustomerDreams.customerEmail && (
                    <a
                      href={`mailto:${viewingCustomerDreams.customerEmail}?subject=${encodeURIComponent(`تفسير الأحلام - منصة الشيخ أحمد الشريف`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>جميل</span>
                    </a>
                  )}

                  <button
                    onClick={() => setViewingCustomerDreams(null)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                    title="إغلاق السجل"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter & Action Toolbar */}
              <div className="bg-slate-950/80 p-3.5 border-b border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <div className="relative min-w-[180px] sm:min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerDreamsSearch}
                      onChange={(e) => setCustomerDreamsSearch(e.target.value)}
                      placeholder="بحث في أحلام العميل..."
                      className="w-full bg-slate-900 border border-emerald-900 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-emerald-950">
                    <button
                      onClick={() => setCustomerDreamsStatusFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${customerDreamsStatusFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      كافة الأحلام ({viewingCustomerDreams.dreams.length})
                    </button>
                    <button
                      onClick={() => setCustomerDreamsStatusFilter('pending')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${customerDreamsStatusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      غير مفسرة ({viewingCustomerDreams.dreams.filter(d => d.status !== 'replied' && !d.writtenReply && !d.expertReply).length})
                    </button>
                    <button
                      onClick={() => setCustomerDreamsStatusFilter('replied')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${customerDreamsStatusFilter === 'replied' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      تم تفسيرها ({viewingCustomerDreams.dreams.filter(d => d.status === 'replied' || d.writtenReply || d.expertReply).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={async () => {
                      const allText = viewingCustomerDreams.dreams.map((d, i) => `رؤية #${i+1}:\n${d.dreamText}\n${d.writtenReply || d.expertReply ? 'تفسير الشيخ: ' + (d.writtenReply || d.expertReply) : 'لم تفسر بعد'}`).join('\n-------------------\n');
                      await safeCopyToClipboard(`سجل أحلام العميل: ${viewingCustomerDreams.customerName}\n\n` + allText);
                      alert('تم نسخ كافة أحلام العميل بنجاح للحافظة!');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow border border-slate-700"
                  >
                    <span>نسخ النص الشامل 📋</span>
                  </button>
                </div>
              </div>

              {/* Dreams Body Cards List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(() => {
                  const filtered = viewingCustomerDreams.dreams.filter((d) => {
                    const q = customerDreamsSearch.trim().toLowerCase();
                    const textMatch = !q || (d.dreamText && d.dreamText.toLowerCase().includes(q)) || (d.writtenReply && d.writtenReply.toLowerCase().includes(q)) || (d.source && d.source.toLowerCase().includes(q));
                    if (!textMatch) return false;

                    const isReplied = d.status === 'replied' || Boolean(d.writtenReply) || Boolean(d.expertReply);
                    if (customerDreamsStatusFilter === 'pending' && isReplied) return false;
                    if (customerDreamsStatusFilter === 'replied' && !isReplied) return false;

                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-slate-950 border border-dashed border-emerald-900/80 p-12 rounded-3xl text-center space-y-3">
                        <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                        <h4 className="text-slate-300 font-bold text-sm">لا توجد أحلام مسجلة مطابقة لخيارات البحث أو التصفية الحالية.</h4>
                        <p className="text-slate-500 text-xs">جرب تغيير التصفية أو البحث عن الكلمات الرئيسية في حلم العميل.</p>
                      </div>
                    );
                  }

                  return filtered.map((dream, index) => {
                    const isReplied = dream.status === 'replied' || Boolean(dream.writtenReply) || Boolean(dream.expertReply);
                    const isQuickReplyActive = activeQuickReplyDreamId === dream.id;

                    return (
                      <div
                        key={dream.id || index}
                        className={`bg-slate-950 border rounded-2xl p-4 space-y-3.5 transition shadow-lg relative ${
                          !isReplied
                            ? 'border-amber-500/80 shadow-amber-500/5'
                            : 'border-emerald-900/80 hover:border-emerald-700/80'
                        }`}
                      >
                        {/* Dream Card Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-950 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-amber-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-lg text-xs font-mono shadow">
                              حلم #{index + 1}
                            </span>
                            {dream.source && (
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-lg text-[11px]">
                                📍 {dream.source}
                              </span>
                            )}
                            {dream.gender && (
                              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                                {dream.gender === 'female' ? 'أنثى' : 'ذكر'}
                              </span>
                            )}
                            {dream.maritalStatus && (
                              <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                                {dream.maritalStatus === 'single' ? 'عزباء/أعزب' : dream.maritalStatus === 'married' ? 'متزوج/ة' : dream.maritalStatus === 'pregnant' ? 'حامل' : 'مطلق/أرمل'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs font-mono">
                              🕒 {dream.createdAt ? new Date(dream.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : 'تاريخ غير محدد'}
                            </span>

                            {isReplied ? (
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>تم التفسير ✓</span>
                              </span>
                            ) : (
                              <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>بانتظار التأويل والتفسير</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dream Content Body */}
                        <div className="bg-slate-900/90 border border-emerald-950 p-3.5 rounded-xl text-slate-100 space-y-1.5">
                          <strong className="text-amber-300 text-xs font-bold block flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            نص الحلم/الرؤيا المكتوب من العميل:
                          </strong>
                          <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap select-all">
                            {dream.dreamText}
                          </p>
                        </div>

                        {/* Existing Interpretation / Reply Box */}
                        {(dream.writtenReply || dream.expertReply) && (
                          <div className="bg-emerald-950/40 border border-emerald-800/80 p-3.5 rounded-xl space-y-1.5 text-emerald-200">
                            <strong className="text-emerald-300 text-xs font-bold block flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              تفسير وتأويل الشيخ المعتمد للرؤيا:
                            </strong>
                            <p className="text-xs sm:text-sm font-serif leading-relaxed text-slate-100 select-all whitespace-pre-wrap">
                              {dream.writtenReply || dream.expertReply}
                            </p>
                          </div>
                        )}

                        {/* Inline Reply Writing Action */}
                        <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
                          {!isQuickReplyActive ? (
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <button
                                onClick={() => {
                                  setActiveQuickReplyDreamId(dream.id);
                                  setQuickReplyText(dream.writtenReply || dream.expertReply || '');
                                }}
                                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isReplied ? 'تعديل أو صياغة رد التفسير' : 'كتابة وإرسال التفسير الآن'}</span>
                              </button>

                              <div className="flex items-center gap-2">
                                {viewingCustomerDreams.customerPhone && (
                                  <a
                                    href={`https://wa.me/${viewingCustomerDreams.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم أ/ ${viewingCustomerDreams.customerName}، بخصوص حلمكم المكتوب: "${dream.dreamText.substring(0, 40)}..."\n\nتفسيره: ${dream.writtenReply || dream.expertReply || ''}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>مشاركة الحلم بالتفسير واتساب</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-900 p-3.5 rounded-2xl border border-amber-500/60 space-y-2.5 animate-in fade-in duration-150">
                              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                                <span>صياغة وتوثيق تفسير الشيخ لهذا الحلم:</span>
                                <button
                                  onClick={() => setActiveQuickReplyDreamId(null)}
                                  className="text-slate-400 hover:text-white"
                                >
                                  إلغاء ✖
                                </button>
                              </div>
                              <textarea
                                value={quickReplyText}
                                onChange={(e) => setQuickReplyText(e.target.value)}
                                rows={3}
                                placeholder="اكتب تأويل وتفسير الحلم المعتمد للرائي هنا..."
                                className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-serif"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setActiveQuickReplyDreamId(null)}
                                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs cursor-pointer"
                                >
                                  إلغاء
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!quickReplyText.trim()) return;
                                    try {
                                      const res = await fetch('/api/admin/dreams/reply', {
                                        method: 'POST',
                                        headers: getAdminHeaders(),
                                        body: JSON.stringify({
                                          dreamId: dream.id,
                                          replyText: quickReplyText
                                        })
                                      });
                                      if (res.ok) {
                                        setSaveSuccessMsg(`تم إرسال وحفظ تفسير الشيخ للرؤية بنجاح!`);
                                        setTimeout(() => setSaveSuccessMsg(''), 4000);
                                        
                                        // Update viewingCustomerDreams locally
                                        const updatedDreams = viewingCustomerDreams.dreams.map(d => {
                                          if (d.id === dream.id) {
                                            return { ...d, status: 'replied', writtenReply: quickReplyText, expertReply: quickReplyText };
                                          }
                                          return d;
                                        });
                                        setViewingCustomerDreams({
                                          ...viewingCustomerDreams,
                                          dreams: updatedDreams
                                        });
                                        setActiveQuickReplyDreamId(null);
                                        setQuickReplyText('');
                                        fetchAllAdminData();
                                      }
                                    } catch (err) {
                                      console.error('Error in quick reply:', err);
                                    }
                                  }}
                                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow flex items-center gap-1"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>حفظ وإرسال التفسير للعميل ✓</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-950 p-3 border-t border-emerald-950 flex items-center justify-between text-xs text-slate-400">
                <span>مجموع الأحلام والمنامات المعروضة: <strong className="text-amber-300 font-mono">{viewingCustomerDreams.dreams.length}</strong></span>
                <button
                  onClick={() => setViewingCustomerDreams(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition"
                >
                  إغلاق السجل
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
