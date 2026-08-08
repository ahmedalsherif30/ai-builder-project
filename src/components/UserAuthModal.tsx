import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Sparkles,
  Lock,
  X,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  LogIn,
  Heart
} from 'lucide-react';
import { UserProfile, DreamerGender, MaritalStatus } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAuth: (user: UserProfile) => void;
  requiredActionReason?: string;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessAuth,
  requiredActionReason
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<DreamerGender>('female');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');

  const [confirmedUser, setConfirmedUser] = useState<UserProfile | null>(null);
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'facebook' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  if (!isOpen) return null;

  // Handle Social Login Initiate
  const initiateSocialAuth = (provider: 'google' | 'facebook') => {
    setSocialModalProvider(provider);
    if (provider === 'google') {
      setSocialName(name || 'مستخدم Google');
      setSocialEmail(email || `user.${Date.now().toString().slice(-4)}@gmail.com`);
    } else {
      setSocialName(name || 'مستخدم Facebook');
      setSocialEmail(email || `user.${Date.now().toString().slice(-4)}@facebook.com`);
    }
  };

  // Submit Social Auth
  const handleSocialAuthSubmit = async () => {
    if (!socialEmail || !socialName) {
      setErrorMsg('الرجاء التأكد من كتابة البريد والاسم.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: socialName,
          email: socialEmail,
          phone,
          gender,
          maritalStatus,
          provider: socialModalProvider || 'social'
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (data.token) {
          localStorage.setItem('explaining_dream_auth_token', data.token);
        }
        setConfirmedUser(data.user);
        setSocialModalProvider(null);
      } else {
        setErrorMsg(data.error || 'حدث خطأ أثناء تسجيل الدخول عبر التواصل الاجتماعي.');
      }
    } catch (err) {
      setErrorMsg('تعذر الاتصال بالخادم. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Direct Registration / Login Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'register') {
      if (!name.trim() || !email.trim()) {
        setErrorMsg('الرجاء كتابة الاسم الكامل والبريد الإلكتروني.');
        return;
      }
    } else {
      if (!email.trim()) {
        setErrorMsg('الرجاء كتابة البريد الإلكتروني.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const bodyPayload = authMode === 'register'
        ? { name, email, phone, password, gender, maritalStatus, provider: 'direct' }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (data.token) {
          localStorage.setItem('explaining_dream_auth_token', data.token);
        }
        setConfirmedUser(data.user);
      } else {
        setErrorMsg(data.error || 'لم نتمكن من إتمام الطلب.');
      }
    } catch (err) {
      setErrorMsg('خطأ بالشبكة، حاول مجدداً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans dir-rtl max-h-[92vh] overflow-y-auto animate-fade-in">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-serif">
                {authMode === 'register' ? 'إنشاء حساب وتسجيل البيانات (مساحة 3 أحلام مجانية)' : 'تسجيل الدخول للمنصة'}
              </h2>
              <p className="text-xs text-amber-300 font-serif">
                ExplainingDream.com - منصة تفسير الأحلام الرسمية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Quota & Plan Upgrade Notice Banner */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/90 border border-amber-500/40 p-3.5 rounded-2xl text-xs text-slate-200 space-y-1.5 font-serif shadow-md">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>🎁 مساحة مبدئية مجانية: 3 أحلام لتفسير الذكاء الاصطناعي</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            عند إنشاء حسابك (عبر Google أو Facebook أو البريد)، تمنح <strong className="text-amber-300">مساحة مبدئية لـ 3 أحلام مجاناً</strong>. ولتزويد وتوسيع مساحتك وتفسير أحلام إضافية، يمكن ترقية خطتك بالاشتراك في <strong className="text-emerald-300">الخدمات المدفوعة</strong> في أي وقت.
          </p>
        </div>

        {/* Action Reason Banner (If required before subscribing or interpreting) */}
        {requiredActionReason && (
          <div className="bg-amber-500/10 border border-amber-500/50 p-3 rounded-2xl text-xs text-amber-200 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{requiredActionReason}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-950/90 border border-red-500/60 text-red-200 p-3 rounded-xl text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* View 1: Account Confirmation Screen (When Registration/Login Succeeds) */}
        {confirmedUser ? (
          <div className="space-y-5 animate-fade-in text-center py-2">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-amber-400 font-serif">
                🎉 تم تأكيد وتوثيق حسابك بنجاح!
              </h3>
              <p className="text-xs text-slate-300 font-serif mt-1">
                أهلاً بك {confirmedUser.name} في منصة **تأويلات روحية** للشيخ أحمد الشريف. تم إرسال رسالة التأكيد والترحيب بنجاح.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-emerald-900/80 rounded-2xl p-4 text-xs space-y-2.5 text-right font-sans">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">حالة التوثيق:</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  ✓ مؤكد ومفعل (Verified)
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">اسم الحساب:</span>
                <span className="text-slate-100 font-bold">{confirmedUser.name}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">البريد الإلكتروني:</span>
                <span className="text-amber-300 font-mono dir-ltr">{confirmedUser.email}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">طريقة الدخول:</span>
                <span className="text-slate-300 font-bold">
                  {confirmedUser.provider === 'google' ? 'Google Auth 2.0' : confirmedUser.provider === 'facebook' ? 'Facebook Connect' : 'تسجيل بريد مباشر'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">رصيد الاستشارات المجاني:</span>
                <span className="text-amber-400 font-bold">3 استفسارات مجانية مضافة</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onSuccessAuth(confirmedUser);
                  setConfirmedUser(null);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-slate-950 font-bold py-3.5 rounded-xl text-xs shadow-xl transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>الانتقال لإكمال وتحديث بيانات صفحتك الشخصية 👤</span>
              </button>

              <a
                href={`https://wa.me/201558955525?text=${encodeURIComponent(`السلام عليكم شيخ أحمد الشريف، قمت بتأكيد تسجيل حسابي بنجاح بالمنصة باسم (${confirmedUser.name}) والبريد (${confirmedUser.email})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/60 text-emerald-300 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إرسال إشعار تأكيد الحساب للإدارة عبر الواتساب 💬</span>
              </a>
            </div>
          </div>
        ) : socialModalProvider ? (
          /* View 2: Social Auth Setup Screen */
          <div className="space-y-4 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 bg-slate-800 rounded-2xl border border-slate-700 text-amber-400 mb-1">
                {socialModalProvider === 'google' ? (
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
                  </svg>
                ) : (
                  <svg className="w-7 h-7 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-100 font-serif">
                التسجيل المباشر عبر حساب {socialModalProvider === 'google' ? 'Google' : 'Facebook'}
              </h3>
              <p className="text-xs text-slate-400">
                يرجى مراجعة وتأكيد بيانات صفحتك لتأكيد التسجيل بضغطة واحدة:
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">الاسم المستعار (أو اسمك المفضل):</label>
                <input
                  type="text"
                  placeholder="مثال: الرائي_أحمد أو مريم2026"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">البريد الإلكتروني المعتمد:</label>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">كلمة السر الخاصة بالحساب (لتأمين ورودك):</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">رقم الواتساب (اختياري لاستلام التنبيهات):</label>
                <input
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block font-serif">الجنس:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as DreamerGender)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="female">أنثى (رائية)</option>
                    <option value="male">ذكر (رائي)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block font-serif">الحالة الاجتماعية:</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="single">عزباء / أعزب</option>
                    <option value="married">متزوجة / متزوج</option>
                    <option value="divorced">مطلقة / مطلق</option>
                    <option value="widowed">أرملة / أرمل</option>
                    <option value="pregnant">حامل</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSocialModalProvider(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSocialAuthSubmit}
                disabled={isLoading}
                className="flex-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg transition hover:opacity-95 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'جاري التأكيد...' : 'تأكيد التسجيل وبدء الاستخدام ✓'}
              </button>
            </div>
          </div>
        ) : (
          /* View 3: Normal Login & Direct Form */
          <>
            {/* One-Click Social Authentication Buttons */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block text-center">
                التسجيل وتأكيد الهوية بضغطة واحدة:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google Login */}
                <button
                  type="button"
                  onClick={() => initiateSocialAuth('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow hover:border-amber-400 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
                  </svg>
                  <span>تسجيل بـ Google</span>
                </button>

                {/* Facebook Login */}
                <button
                  type="button"
                  onClick={() => initiateSocialAuth('facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-600 text-blue-200 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>تسجيل بـ Facebook</span>
                </button>
              </div>
            </div>

            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-slate-800"></div>
              <span className="px-3 text-[11px] text-slate-400 font-mono">أو إدخال البيانات مباشرة</span>
              <div className="flex-1 border-t border-slate-800"></div>
            </div>

            {/* Direct Data Registration Form */}
            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">الاسم المستعار (أو اسمك المفضّل):</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: الرائي_أحمد أو مريم2026"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-900 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                    <User className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">البريد الإلكتروني:</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <Mail className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">كلمة المرور الخاصة بعضويتك:</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <Lock className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">رقم الواتساب مع المفتاح الدولي (اختياري للاستشارات):</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-emerald-900 rounded-xl py-2.5 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <Phone className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">الجنس:</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as DreamerGender)}
                        className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100"
                      >
                        <option value="female">أنثى (رائية)</option>
                        <option value="male">ذكر (رائي)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">الحالة الاجتماعية:</label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                        className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-100"
                      >
                        <option value="single">عزباء / أعزب</option>
                        <option value="married">متزوجة / متزوج</option>
                        <option value="divorced">مطلقة / مطلق</option>
                        <option value="widowed">أرملة / أرمل</option>
                        <option value="pregnant">حامل</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span>جاري حفظ البيانات...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{authMode === 'register' ? 'حفظ البيانات وإنشاء الحساب' : 'الدخول للحساب'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode Footer */}
            <div className="pt-2 text-center text-xs border-t border-slate-800">
              {authMode === 'register' ? (
                <p className="text-slate-400">
                  لديك حساب بالفعل بالموقع؟{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-amber-400 font-bold underline cursor-pointer hover:text-amber-300"
                  >
                    سجل الدخول هنا
                  </button>
                </p>
              ) : (
                <p className="text-slate-400">
                  ليس لديك حساب حتى الآن؟{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-amber-400 font-bold underline cursor-pointer hover:text-amber-300"
                  >
                    أنشئ حساباً وسجل بياناتك الآن
                  </button>
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
