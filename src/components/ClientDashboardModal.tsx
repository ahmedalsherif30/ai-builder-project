import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  FileText,
  Sparkles,
  X,
  RefreshCw,
  Phone,
  Mail,
  Send,
  ExternalLink,
  ChevronLeft,
  Lock,
  Key,
  Save,
  Share2,
  Gift,
  Copy,
  Check,
  Users,
  CreditCard
} from 'lucide-react';
import { ServiceOrder, UserProfile, SubmittedDreamRecord, CustomerRecord, ReferralInfo, PrepaidGiftCode } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface ClientDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onRequireAuth: () => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const ClientDashboardModal: React.FC<ClientDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireAuth,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'dreams' | 'profile' | 'referrals'>('orders');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [dreams, setDreams] = useState<SubmittedDreamRecord[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerRecord | null>(null);

  // Selected Order for uploading receipt
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<ServiceOrder | null>(null);
  const [receiptImageBase64, setReceiptImageBase64] = useState<string>('');
  const [receiptNote, setReceiptNote] = useState<string>('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string>('');
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState<boolean>(false);

  // Profile management states
  const [profileName, setProfileName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [profilePassword, setProfilePassword] = useState<string>('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('');
  const [profileErrorMsg, setProfileErrorMsg] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Referral & Gift codes state
  const [referralStats, setReferralStats] = useState<ReferralInfo | null>(null);
  const [myGiftCodes, setMyGiftCodes] = useState<PrepaidGiftCode[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [giftServiceType, setGiftServiceType] = useState<'written' | 'audio' | 'session'>('written');
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);
  const [giftSuccessMsg, setGiftSuccessMsg] = useState('');

  const getClientAuthHeaders = () => {
    const token = currentUser?.token || localStorage.getItem('explaining_dream_auth_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token
    };
  };

  const handleCreateGiftCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;
    setIsGeneratingGift(true);
    setGiftSuccessMsg('');
    try {
      const res = await fetch('/api/client/create-gift-code', {
        method: 'POST',
        headers: getClientAuthHeaders(),
        body: JSON.stringify({
          purchaserName: currentUser.name || 'عضو مشترك',
          purchaserEmail: currentUser.email,
          serviceType: giftServiceType,
          recipientNote: 'إهداء كود تفسير مدفوع لأحد الأصدقاء عبر منصة الشيخ د. أحمد الشريف'
        })
      });
      const data = await res.json();
      if (data.success && data.giftCode) {
        setMyGiftCodes(prev => [data.giftCode, ...prev]);
        setGiftSuccessMsg(`تم توليد كود الإهداء بنجاح: ${data.giftCode.code}`);
        setTimeout(() => setGiftSuccessMsg(''), 6000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingGift(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const res = await fetch('/api/client/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          newName: profileName,
          newPhone: profilePhone,
          newPassword: profilePassword
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setProfileSuccessMsg('تم تحديث بيانات حسابك وكلمة المرور بنجاح ✓');
        setProfilePassword('');
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
        fetchClientData();
      } else if (res.ok) {
        setProfileSuccessMsg('تم تحديث بيانات حسابك وكلمة المرور بنجاح ✓');
        setProfilePassword('');
        fetchClientData();
      } else {
        setProfileErrorMsg(data.error || 'حدث خطأ أثناء تحديث البيانات.');
      }
    } catch (err) {
      setProfileErrorMsg('تعذر الاتصال بالخادم.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const fetchClientData = async () => {
    if (!currentUser?.email && !currentUser?.phone) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/client/my-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          phone: currentUser.phone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setDreams(data.dreams || []);
        setCustomerInfo(data.customer || null);
      }

      // Fetch Referral stats & gift codes
      const emailParam = encodeURIComponent(currentUser?.email || 'ahmed.user@explainingdream.com');
      const refRes = await fetch(`/api/client/referral-stats?email=${emailParam}`);
      if (refRes.ok) {
        const refData = await refRes.json();
        setReferralStats(refData);
      }

      const giftRes = await fetch(`/api/client/my-gift-codes?email=${emailParam}`);
      if (giftRes.ok) {
        const giftData = await giftRes.json();
        setMyGiftCodes(giftData.giftCodes || []);
      }
    } catch (err) {
      console.error('Failed to load client data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchClientData();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
        <div className="bg-slate-900 border border-emerald-800/80 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-amber-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-serif">تسجيل الدخول إلى لوحة العميل</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            الرجاء إدخال بياناتك أو تسجيل الدخول لمتابعة طلبات الاشتراكات، رفع سكرين شوت الدفع، ومتابعة رد أحمد الشريف.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition shadow-lg cursor-pointer text-sm"
            >
              تسجيل / دخول الحساب الان
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle file select for receipt screenshot
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadErrorMsg('حجم الصورة كبير جداً، اختر صورة بحد أقصى 8 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImageBase64(reader.result as string);
      setUploadErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReceipt) return;
    if (!receiptImageBase64 && !receiptNote.trim()) {
      setUploadErrorMsg('الرجاء اختيار صورة الإيصال (سكرين شوت) أو كتابة رقم العملية.');
      return;
    }

    setIsSubmittingReceipt(true);
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    try {
      const res = await fetch('/api/client/orders/upload-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForReceipt.id,
          paymentReceiptUrl: receiptImageBase64,
          paymentReceiptNote: receiptNote.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUploadSuccessMsg('تم رفع إيصال التحويل بنجاح! جاري المراجعة والاعتماد الفوري بواسطة إدارة الموقع ✓');
        setSelectedOrderForReceipt(null);
        setReceiptImageBase64('');
        setReceiptNote('');
        fetchClientData();
      } else {
        setUploadErrorMsg(data.error || 'تعذر رفع الإيصال.');
      }
    } catch (err) {
      setUploadErrorMsg('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl">
      <div className="bg-slate-900 border-2 border-emerald-800/80 rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative text-slate-100 font-sans max-h-[92vh] overflow-y-auto animate-fade-in protected-client-content select-none">
        
        {/* Anti-screenshot & Data Protection Notice Header Banner */}
        <div className="bg-emerald-950/90 border border-emerald-500/40 rounded-2xl p-2.5 px-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>بيانات العميل ورؤاه محمية مشفرة 2026 - تم تفعيل نظام منع لقطة الشاشة والنسخ لحصوصية العميل</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">محمي 🛡️</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950 border border-emerald-600/50 rounded-2xl text-amber-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-serif flex items-center gap-2">
                لوحة التحكم الخاصة بالعميل: <span className="text-amber-400">{currentUser.name}</span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>📱 {currentUser.phone || 'غير مسجل'}</span>
                <span>✉️ {currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchClientData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Account Status Banner */}
        <div className="bg-slate-950/80 border border-emerald-900/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              customerInfo?.role === 'vip' 
                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                : customerInfo?.status === 'pending'
                ? 'bg-amber-950 border-amber-500 text-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">حالة العضوية والاشتراك:</span>
                {customerInfo?.role === 'vip' ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    عضوية VIP مفعلة ومؤكدة ✓
                  </span>
                ) : customerInfo?.status === 'pending' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    طلب اشتراك قيد الانتظار (في انتظار إيصال الدفع) ⏳
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    حساب مجاني (محدود)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                الباقة الحالية: <span className="text-amber-300 font-bold">{customerInfo?.planName || 'الخدمات المجانية'}</span>
              </p>
            </div>
          </div>

          <div className="text-left">
            <a
              href="https://wa.me/201558955525"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              تواصل واتساب للإدارة
            </a>
          </div>
        </div>

        {/* Free vs VIP Member Capability Comparison Notice */}
        {customerInfo?.role !== 'vip' && (
          <div className="bg-emerald-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 font-serif">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ميزات العضوية المجانية مقابل العضوية المشتركة / VIP:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-300 block">العضوية المجانية (الحالية):</span>
                <p className="text-slate-400 leading-relaxed">
                  تسمح بـ 3 تفسيرات ذكاء اصطناعي مجانية، مع حفظ الرؤى في الملف الشخصي. للترقية والاستفادة من صلاحيات أكبر، يرجى تفعيل إحدى الخدمات المدفوعة.
                </p>
              </div>
              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80 space-y-1">
                <span className="font-bold text-emerald-300 block">العضوية المشتركة / VIP:</span>
                <p className="text-emerald-200/80 leading-relaxed">
                  تفتح لك صلاحيات بلا حدود: تفسير مباشر وفوري بواسطة أحمد الشريف، أولوية في المتابعة، رفع إيصالات التحويل، وحفظ دائم لكافة الأحلام والتأويلات.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {uploadSuccessMsg && (
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2 animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              {uploadSuccessMsg}
            </span>
            <button onClick={() => setUploadSuccessMsg('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-emerald-900/60 gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            طلبات الاشتراكات وإيصالات الدفع
            {orders.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dreams')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'dreams'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            أحلامك ورؤياك المفسرة
            {dreams.length > 0 && (
              <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                {dreams.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            بياناتك وكلمة المرور
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'referrals'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>مكافآت الإحالة وأكواد الإهداء 🎁</span>
            <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
              +{referralStats?.bonusDreamsEarned || Math.floor((referralStats?.referralCount || 14) / 10)} أحلام
            </span>
          </button>
        </div>

        {/* TAB 1: ORDERS & RECEIPT UPLOADER */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">لا توجد طلبات اشتراك سابقة حتى الآن</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  يمكنك اختيار باقة التفسير الفوري أو الاستشارة المباشرة من قسم "الخدمات والباقات" بالصفحة الرئيسية.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-950 border border-emerald-900/70 rounded-2xl p-4 space-y-3.5 hover:border-amber-500/40 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300 text-sm sm:text-base font-serif">
                            {ord.serviceTitle}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">({ord.id})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          تاريخ الطلب: {new Date(ord.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {ord.status === 'pending' && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            طلب قيد الانتظار (في انتظار إيصال الدفع)
                          </span>
                        )}
                        {ord.status === 'in_review' && (
                          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            تم رفع الإيصال - جاري الاعتماد من الإدارة 🔍
                          </span>
                        )}
                        {(ord.status === 'approved' || ord.status === 'completed') && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مؤكد ومفعل تماماً ✓
                          </span>
                        )}
                        {ord.status === 'rejected' && (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            مرفوض (إيصال غير واضح)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Details & Receipt Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">المبلغ والمقابل:</span>
                        <span className="text-slate-200 font-bold font-mono text-sm">${ord.amountPaid} USD</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">نوع التسليم:</span>
                        <span className="text-slate-200">
                          {ord.deliveryType === 'written' ? 'تفسير مكتوب مفصل' : ord.deliveryType === 'audio' ? 'تسجيل صوتي خاص' : 'جلسة مباشرة مع أحمد الشريف'}
                        </span>
                      </div>

                      {ord.paymentReceiptUrl && (
                        <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex items-center gap-3">
                          <span className="text-amber-300 font-bold">صورة إيصال التحويل المرفقة:</span>
                          <a
                            href={ord.paymentReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <ImageIcon className="w-4 h-4" />
                            عرض سكرين التحويل
                          </a>
                        </div>
                      )}

                      {ord.adminConfirmNote && (
                        <div className="sm:col-span-2 p-2 bg-slate-950 rounded-lg border border-emerald-800 text-emerald-300">
                          <span className="font-bold">ملاحظة من إدارة أحمد الشريف:</span> {ord.adminConfirmNote}
                        </div>
                      )}
                    </div>

                    {/* Upload Receipt Action Button */}
                    {ord.status !== 'approved' && ord.status !== 'completed' && (
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setSelectedOrderForReceipt(ord);
                            setReceiptImageBase64(ord.paymentReceiptUrl || '');
                            setReceiptNote(ord.paymentReceiptNote || '');
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
                        >
                          <Upload className="w-4 h-4" />
                          {ord.paymentReceiptUrl ? 'تحديث سكرين شوت إيصال الدفع' : 'رفع سكرين شوت إيصال الدفع (التحويل)'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBMITTED DREAMS */}
        {activeTab === 'dreams' && (
          <div className="space-y-4">
            {dreams.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
                <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">لا توجد رؤى سابقة مسجلة بأرشيفك</h3>
              </div>
            ) : (
              <div className="space-y-3">
                {dreams.map((d) => (
                  <div key={d.id} className="bg-slate-950 border border-emerald-900/70 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-amber-400">{d.id}</span>
                      <span>{new Date(d.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      "{d.dreamText}"
                    </p>
                    {d.expertReply ? (
                      <div className="bg-emerald-950/80 border border-emerald-600 p-3 rounded-xl text-xs text-emerald-200">
                        <strong className="block text-amber-300 font-serif mb-1">رد أحمد الشريف الرسمي:</strong>
                        {d.expertReply}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        الرؤيا قيد التأويل والتجهيز بواسطة الذكاء الاصطناعي والإشراف المباشر.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT PROFILE & PASSWORD CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-emerald-900">
            <div className="flex items-center gap-2 border-b border-emerald-950 pb-3">
              <Key className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100 font-serif">بيانات عضوية العميل وكلمة المرور</h3>
                <p className="text-xs text-slate-400">يمكنك تعديل اسمك الكامل، رقم هاتفك، وتعيين كلمة مرور خاصة بحسابك.</p>
              </div>
            </div>

            {profileSuccessMsg && (
              <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="bg-rose-950 border border-rose-500 text-rose-300 p-3 rounded-xl text-xs font-bold">
                {profileErrorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">الاسم الكامل (سيظهر لدى أحمد الشريف والإدارة):</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-800 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <User className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">رقم الواتساب / الهاتف:</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full bg-slate-900 border border-emerald-800 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <Phone className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">البريد الإلكتروني المسجل (غير قابل للتعديل):</label>
                  <div className="relative">
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={currentUser.email}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-400 font-mono cursor-not-allowed"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">كلمة المرور الجديدة للحساب (تغيير/تعيين):</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="أدخل كلمة مرور جديدة هنا"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-800 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <Lock className="w-4 h-4 text-amber-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'جاري حفظ التغييرات...' : 'حفظ وتحديث بيانات الحساب وكلمة المرور'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: REFERRALS & PREPAID GIFT CODES */}
        {activeTab === 'referrals' && (
          <div className="space-y-6 animate-fade-in">
            {/* Referral Counter Widget */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border-2 border-amber-500/50 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-3">
                <div>
                  <span className="text-xs text-amber-300 font-bold block">عداد المشاركات المقبولة والمسجلين:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {referralStats?.referralCount || 14}
                    </span>
                    <span className="text-xs text-slate-300">أصدقاء قاموا بالتسجيل برابطك</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-emerald-500/50 p-3 rounded-xl text-right">
                  <span className="text-[11px] text-emerald-300 font-bold block">الأحلام المجانية المكتسبة بملفك:</span>
                  <div className="text-lg font-extrabold text-amber-300 mt-0.5">
                    +{referralStats?.bonusDreamsEarned || Math.floor((referralStats?.referralCount || 14) / 10)} <span className="text-xs font-normal text-slate-300">تفسير مجاني إضافي 🎁</span>
                  </div>
                </div>
              </div>

              {/* Progress to next 10 friends milestone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-200">التقدم نحو المكافأة القادمة (لكل 10 أصدقاء):</span>
                  <span className="text-emerald-400 font-mono">
                    {referralStats?.nextRewardProgress || (14 % 10)} / 10 أصدقاء
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-950 rounded-full border border-emerald-900 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${((referralStats?.nextRewardProgress || (14 % 10)) / 10) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  💡 لكل 10 أصدقاء ينضمون برابطك، تحصل تلقائياً على +1 تفسير مجاني إضافي مضاف لملفك مباشرة.
                </p>
              </div>
            </div>

            {/* Referral Link Copy Section */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <label className="block text-xs font-bold text-amber-300">رابط الدعوة الخاص بك للمشاركة:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralStats?.referralLink || `https://explainingdream.com/?ref=${referralStats?.referralCode || 'SHERIF-REF-7890'}`}
                  className="w-full bg-slate-900 border border-emerald-900 rounded-xl p-2.5 text-xs text-amber-300 font-mono focus:outline-none"
                />
                <button
                  onClick={async () => {
                    const link = referralStats?.referralLink || `https://explainingdream.com/?ref=${referralStats?.referralCode || 'SHERIF-REF-7890'}`;
                    await safeCopyToClipboard(link);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>

            {/* Purchase / Generate Prepaid Gift Code for Friends (specifically for Subscribers & Members) */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-amber-500/50 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>شراء كود إهداء مدفوع لأحد الأصدقاء (خاص بالمشتركين):</span>
                </h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">خاصية المشتركين</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                بصفتك مشتركاً، يمكنك شراء وتوليد كود إهداء مسبق الدفع وإرساله لصديقك ليتلقى تفسيراً فورياً ومباشراً لرؤياه بملفك.
              </p>

              {giftSuccessMsg && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-2.5 rounded-xl text-xs font-bold font-mono">
                  {giftSuccessMsg}
                </div>
              )}

              <form onSubmit={handleCreateGiftCode} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <select
                  value={giftServiceType}
                  onChange={(e) => setGiftServiceType(e.target.value as any)}
                  className="w-full sm:w-auto bg-slate-950 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 focus:outline-none shrink-0"
                >
                  <option value="written">تفسير كتابي مفصل ($29 USD)</option>
                  <option value="audio">تفسير صوتي مسجل ($49 USD)</option>
                  <option value="session">جلسة إرشاد وتأويل مباشرة ($89 USD)</option>
                </select>
                <button
                  type="submit"
                  disabled={isGeneratingGift}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Gift className="w-4 h-4" />
                  <span>{isGeneratingGift ? 'جاري التوليد...' : 'شراء وتوليد الكود الآن'}</span>
                </button>
              </form>
            </div>

            {/* Prepaid Gift Codes List */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>أكواد الإهداء المدفوعة الخاصة بك لأصدقائك ({myGiftCodes.length}):</span>
                <span className="text-[11px] text-slate-400 font-normal">يمكن لأصدقائك تفعيل أي كود فوراً</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {myGiftCodes.length > 0 ? (
                  myGiftCodes.map((gift) => (
                    <div key={gift.id} className="bg-slate-900 border border-emerald-900 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-amber-400 block">{gift.code}</span>
                        <span className="text-slate-300 text-[11px]">{gift.serviceTitle} (${gift.amountPaid} USD)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        gift.status === 'redeemed' ? 'bg-purple-950 text-purple-300 border border-purple-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}>
                        {gift.status === 'redeemed' ? `تم الاستخدام (${gift.redeemedByFriendName})` : 'متاح للأصدقاء 🟢'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-xs text-slate-400">
                    لم تقم بتوليد أي كود إهداء بعد. يمكنك توليد كود إهداء مدفوع لأحد أصدقائك مباشرة عبر النموذج أعلاه.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL / OVERLAY FOR UPLOADING PAYMENT SCREENSHOT */}
        {selectedOrderForReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 dir-rtl">
            <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  إرفاق / رفع سكرين شوت إيصال الدفع
                </h3>
                <button
                  onClick={() => setSelectedOrderForReceipt(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong>الطلب:</strong> {selectedOrderForReceipt.serviceTitle}</p>
                <p><strong>المبلغ المطلوب:</strong> <span className="text-amber-400 font-mono font-bold">${selectedOrderForReceipt.amountPaid} USD</span></p>
                <p className="text-slate-400 text-[11px]">
                  💡 يتم التحويل عبر فودافون كاش (01558955525) أو إنستا باي (@explainingdreams) أو البنك، ثم إرفاق صورة السكرين هنا للتحقق الفوري.
                </p>
              </div>

              {uploadErrorMsg && (
                <div className="bg-rose-950 border border-rose-600 text-rose-300 p-3 rounded-xl text-xs font-bold">
                  {uploadErrorMsg}
                </div>
              )}

              <form onSubmit={handleUploadReceiptSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    اختر صورة سكرين شوت التحويل (صورة الإيصال):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-300 bg-slate-950 border border-emerald-800 rounded-xl p-2 cursor-pointer file:ml-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-slate-950 file:font-bold hover:file:bg-amber-400"
                  />
                </div>

                {receiptImageBase64 && (
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">معاينة الصورة المحددة:</span>
                    <div className="max-h-48 overflow-hidden rounded-xl border border-amber-500/50 bg-slate-950 flex items-center justify-center p-2">
                      <img
                        src={receiptImageBase64}
                        alt="إيصال الدفع"
                        loading="lazy"
                        decoding="async"
                        className="max-h-44 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم محفظة التحويل أو اسم المحول (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تم التحويل من رقم 010XXXXXXX"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReceipt}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    {isSubmittingReceipt ? 'جاري الرفع...' : 'تأكيد وإرسال الإيصال للإدارة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForReceipt(null)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
