import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Share2, AlertCircle, CheckCircle2, BookOpen, ShieldCheck, User, Moon, Sun, ArrowRight, RefreshCw, Feather, MessageSquare, Copy, Heart, Mic, PhoneCall, Crown, Gift, Send, ExternalLink, Headphones } from 'lucide-react';
import { DreamInterpretationRequest, DreamInterpretationResponse, MaritalStatus, DreamerGender, TimeOfDay, DreamMood, PersonalVisionEntry, UserProfile } from '../types';

import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface AiDreamInterpreterProps {
  initialDreamText?: string;
  onSaveToJournal: (entry: Omit<PersonalVisionEntry, 'id'>) => void;
  onNavigateToPaidServices: (dreamText: string) => void;
  currentUser?: UserProfile | null;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onRequireAuth?: (reason?: string) => void;
}

export const AiDreamInterpreter: React.FC<AiDreamInterpreterProps> = ({
  initialDreamText = '',
  onSaveToJournal,
  onNavigateToPaidServices,
  currentUser,
  onUpdateUser,
  onRequireAuth,
}) => {
  const [dreamText, setDreamText] = useState(initialDreamText);
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [gender, setGender] = useState<DreamerGender>(currentUser?.gender || 'female');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(currentUser?.maritalStatus || 'single');
  const [hasIstikhara, setHasIstikhara] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('dawn');
  const [mood, setMood] = useState<DreamMood>('peaceful');
  const [ageGroup, setAgeGroup] = useState('شباب (20-35)');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DreamInterpretationResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync client details if currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !clientName) setClientName(currentUser.name);
      if (currentUser.phone && !clientPhone) setClientPhone(currentUser.phone);
      if (currentUser.gender) setGender(currentUser.gender);
      if (currentUser.maritalStatus) setMaritalStatus(currentUser.maritalStatus);
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialDreamText && initialDreamText.trim()) {
      setDreamText(initialDreamText);
    }
  }, [initialDreamText]);

  const isUnlimited = currentUser?.role === 'admin' || currentUser?.role === 'vip';
  const balanceCredits = isUnlimited ? 999 : (currentUser?.balanceCredits ?? 3);

  const handleDirectWhatsApp = () => {
    const whatsappNumber = '201558955525';
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته، الشيخ أحمد الشريف.
أود طلب استشارة وتأويل مباشر لمنامي عبر منصة ExplainingDream.com.

الاسم: ${clientName || 'عميل'}
رقم الهاتف: ${clientPhone || ''}
تفاصيل المنام: ${dreamText}

عنوان التفسير المبدئي من الذكاء الاصطناعي: ${result?.summary || ''}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !currentUser.email) {
      onRequireAuth?.('يرجى إنشاء حسابك (عبر Google أو Facebook أو البريد) للحصول على مساحتك المبدئية المجانية (3 أحلام).');
      return;
    }

    if (!isUnlimited && balanceCredits <= 0) {
      setErrorMsg('⚠️ لقد استنفذت مساحتك المبدئية المجانية (3 أحلام). لتزويد وتوسيع مساحتك وتفسير أحلام جديدة، يرجى تغيير خطتك بالاشتراك في إحدى الخدمات المدفوعة.');
      onNavigateToPaidServices(dreamText);
      return;
    }

    if (!clientName.trim()) {
      setErrorMsg('الرجاء كتابة اسمك الكريم لمتابعة التفسير.');
      return;
    }

    if (!clientPhone.trim() || clientPhone.trim().length < 6) {
      setErrorMsg('الرجاء كتابة رقم الهاتف / الواتساب بصورة صحيحة لمتابعة التفسير.');
      return;
    }

    if (!dreamText.trim() || dreamText.trim().length < 5) {
      setErrorMsg('الرجاء كتابة تفاصيل الحلم أو المنام بدقة (5 أحرف على الأقل).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          gender,
          maritalStatus,
          hasIstikhara,
          timeOfDay,
          mood,
          ageGroup,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل الاتصال بخدمة الذكاء الاصطناعي.');
      }

      setResult(data);

      // Deduct 1 credit for free members upon successful interpretation
      if (!isUnlimited && currentUser && onUpdateUser) {
        const newCredits = Math.max(0, balanceCredits - 1);
        const updatedUser: UserProfile = {
          ...currentUser,
          balanceCredits: newCredits,
        };
        onUpdateUser(updatedUser);
        try {
          localStorage.setItem('explaining_dreams_user_2026', JSON.stringify(updatedUser));
        } catch (e) {
          console.error('Failed to update localStorage credit balance', e);
        }
      }
    } catch (err: any) {
      console.error('Error fetching dream interpretation:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء إعداد التفسير. يرجى إعادة المحاولة.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToJournal({
      title: result.summary || 'رؤية منامية',
      dreamText: dreamText,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'interpreted',
      aiResponse: result,
      mood: mood,
      isPrivate: true,
      tags: result.symbolsBreakdown?.map((s) => s.symbol) || ['حلم'],
    });
    setIsSaved(true);
  };

  const handleCopy = async () => {
    if (!result) return;
    const textToCopy = `
تفسير المنام - منصة ExplainingDream.com (أحمد الشريف 2026):
العنوان: ${result.summary}
التفسير الإجمالي: ${result.overallInterpretation}
الرموز: ${result.symbolsBreakdown.map((s) => `${s.symbol}: ${s.meaning}`).join(' | ')}
البُعد الروحي: ${result.spiritualAspect}
الأذكار الموصى بها: ${result.recommendedAdhkar.join(', ')}
    `.trim();

    await safeCopyToClipboard(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>المساعد الروحي للذكاء الاصطناعي – طبعة 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
          تفسير الأحلام وفق منهجية أحمد الشريف
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-serif max-w-2xl mx-auto">
          أدخل تفاصيل منامك وحالتك الشخصية بدقة لتتلقى تأويلاً شاملاً يفكك الرموز ويربطها بالقرآن الكريم والسنة النبوية الشريفة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-emerald-900/60 rounded-2xl p-6 shadow-xl shadow-emerald-950/40 h-fit">
          
          {/* User Free Quota & Plan Status Header */}
          <div className="mb-4 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-serif bg-slate-950/90 border-emerald-900/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              {isUnlimited ? (
                <span className="text-emerald-300 font-bold">👑 حساب VIP / مدير: مساحة غير محدودة لتفسير الأحلام</span>
              ) : (
                <span className="text-slate-200">
                  المساحة المبدئية المجانية: <strong className="text-amber-400 font-bold">{balanceCredits} من 3 أحلام متبقية</strong>
                </span>
              )}
            </div>
            {!isUnlimited && balanceCredits <= 0 && (
              <button
                type="button"
                onClick={() => onNavigateToPaidServices(dreamText)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition shadow cursor-pointer animate-pulse"
              >
                تزويد المساحة 🚀
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Client Name and Phone inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-amber-300 mb-1.5">
                  الاسم الكريم: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكامل..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950/90 border border-emerald-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-amber-300 mb-1.5">
                  رقم الهاتف / الواتساب: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: +966501234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950/90 border border-emerald-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 font-mono text-right transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-emerald-200 mb-2">
                تفاصيل المنام أو المشاهدة الروحية: <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="اكتب كل ما تتذكره من المنام والأشخاص والرموز والألوان والأماكن المشاهدة..."
                className="w-full bg-slate-950/90 border border-emerald-800/60 rounded-xl p-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition resize-none"
              />
            </div>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-sm">
              <div>
                <label className="block text-amber-200 mb-1.5 font-bold text-xs sm:text-sm">الجنس:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as DreamerGender)}
                  className="w-full bg-black border border-emerald-800/80 rounded-xl p-2.5 text-amber-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                >
                  <option value="female">أنثى</option>
                  <option value="male">ذكر</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200 mb-1.5 font-bold text-xs sm:text-sm">الحالة الاجتماعية:</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full bg-black border border-emerald-800/80 rounded-xl p-2.5 text-amber-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                >
                  <option value="single">عزباء / أعزب</option>
                  <option value="married">متزوج / متزوجة</option>
                  <option value="pregnant">حامل</option>
                  <option value="divorced">مطلق / مطلقة</option>
                  <option value="widowed">أرمل / أرملة</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200 mb-1.5 font-bold text-xs sm:text-sm">
                  تاريخ الميلاد <span className="text-emerald-400 font-normal text-[10px]">(اختياري)</span>:
                </label>
                <input
                  type="date"
                  className="w-full bg-black border border-emerald-800/80 rounded-xl p-2 text-amber-100 text-xs focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                />
              </div>

              <div>
                <label className="block text-amber-200 mb-1.5 font-bold text-xs sm:text-sm">وقت الحلم:</label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                  className="w-full bg-black border border-emerald-800/80 rounded-xl p-2.5 text-amber-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                >
                  <option value="dawn">وقت السحر / قبيل الفجر</option>
                  <option value="night">أول الليل / منتصف الليل</option>
                  <option value="afternoon">قيلولة النهار</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200 mb-1.5 font-bold text-xs sm:text-sm">الشعور بعد الاستيقاظ:</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as DreamMood)}
                  className="w-full bg-black border border-emerald-800/80 rounded-xl p-2.5 text-amber-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
                >
                  <option value="peaceful">سكينة واطمئنان</option>
                  <option value="anxious">قلق وحيرة</option>
                  <option value="joyful">استبشار وفرح</option>
                  <option value="fearful">خوف انزعاج</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-1 flex items-center justify-between text-sm text-slate-200 bg-slate-950/70 border border-emerald-900/50 p-3 rounded-xl">
              <span className="font-medium">هل كان المنام عقب صلاة استخارة؟</span>
              <button
                type="button"
                onClick={() => setHasIstikhara(!hasIstikhara)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition text-xs sm:text-sm active:scale-95 cursor-pointer ${
                  hasIstikhara ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {hasIstikhara ? 'نعم' : 'لا'}
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/60 border border-red-800 text-red-200 text-sm p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isUnlimited && balanceCredits <= 0 ? (
              <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-emerald-950/90 border-2 border-amber-500/60 p-4 rounded-xl text-center space-y-3 shadow-lg">
                <div className="inline-flex p-2 bg-amber-500/20 text-amber-400 rounded-full">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-amber-300 font-serif">
                  نفدت المساحة المبدئية المجانية لحسابك (3 أحلام)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-serif">
                  لتزويد وتوسيع مساحتك وتفسير أحلامك القادمة بالذكاء الاصطناعي أو مباشرة مع الشيخ أحمد الشريف، يرجى تغيير خطتك بالاشتراك في إحدى الخدمات المدفوعة.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateToPaidServices(dreamText)}
                  className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>تزويد المساحة وتغيير الخطة بالاشتراك الآن 🚀</span>
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 active:scale-[0.98] text-slate-950 font-bold py-3.5 rounded-xl text-base shadow-lg shadow-amber-950/30 transition duration-200 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                    <span>جاري استخراج المعاني وتفكيك الرموز...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>استخراج التأويل المنامي الروحي ({isUnlimited ? 'مفتوح' : `متبقي ${balanceCredits} أحلام`})</span>
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-slate-400 text-center font-serif leading-relaxed">
              * التفسيرات مبنية على القواعد المقررة في طبعة 2026 لكتاب "تأويلات روحية" للشيخ أحمد الشريف.
            </p>
          </form>
        </div>

        {/* Result Display Column */}
        <div className="lg:col-span-7">
          {!result && !isLoading && (
            <div className="bg-slate-900/50 border border-dashed border-emerald-800/40 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center mb-4 text-amber-400">
                <Moon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 font-serif mb-2">
                في انتظار إدخال تفاصيل رؤياك
              </h3>
              <p className="text-xs text-slate-400 max-w-md font-serif leading-relaxed">
                اكتب حلمك في القائمة الجانبية ثم انقر على "استخراج التأويل" لتظهر لك قراءة تفصيلية تشمل الرموز، الدليل القرآني، التوجيه النفسي، والأذكار الموصى بها.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-slate-900/80 border border-emerald-800/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[380px] space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 animate-spin flex items-center justify-center p-1">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-100 font-serif">
                جاري مضاهاة الرموز مع كتاب "تأويلات روحية" (أحمد الشريف)
              </h3>
              <p className="text-xs text-slate-400 max-w-sm font-serif">
                نحلل السياق، الحالة الاجتماعية، الآيات الشاهدة، والبعد النفسي والروحي للرؤيا...
              </p>
            </div>
          )}

          {result && (
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-950/80 space-y-6">
              
              {/* Result Header */}
              <div className="border-b border-emerald-800/40 pb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono uppercase">
                    تأويل روحي موثق
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 font-serif mt-1">
                    {result.summary}
                  </h3>
                  <p className="text-xs text-emerald-400/80 font-serif mt-0.5">
                    منهجية أحمد الشريف – طبعة 2026
                  </p>
                </div>

                {/* Top Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                    title="نسخ التفسير"
                  >
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`p-2 rounded-lg text-xs flex items-center gap-1 border cursor-pointer ${
                      isSaved
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isSaved ? 'محفوظ في ملفك' : 'حفظ بالملف'}</span>
                  </button>
                </div>
              </div>

              {/* Overall Interpretation */}
              <div className="bg-slate-950/80 border border-emerald-900/60 rounded-xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-amber-400 font-serif flex items-center gap-2">
                  <Feather className="w-5 h-5" />
                  التفسير الإجمالي المعمق:
                </h4>
                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-serif">
                  {result.overallInterpretation}
                </p>
              </div>

              {/* Symbol Breakdown Table */}
              {result.symbolsBreakdown && result.symbolsBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-bold text-emerald-200 font-serif flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    تفكيك الرموز الرئيسية في المنام:
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {result.symbolsBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/90 border border-emerald-800/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-sm"
                      >
                        <div className="sm:w-1/3">
                          <span className="font-bold text-amber-300 font-serif text-base">
                            ◆ {item.symbol}
                          </span>
                        </div>
                        <div className="sm:w-2/3 space-y-1.5">
                          <p className="text-slate-100 font-serif text-sm sm:text-base leading-relaxed">{item.meaning}</p>
                          {item.quranReference && (
                            <p className="text-xs sm:text-sm text-emerald-400 font-serif">
                              📖 الشاهد القرآني: {item.quranReference}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spiritual & Psychological Nuances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4 space-y-1.5">
                  <span className="font-bold text-emerald-300 font-serif text-base flex items-center gap-1.5">
                    ✨ البُعد الروحي والإلهام:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-serif">
                    {result.spiritualAspect}
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-4 space-y-1.5">
                  <span className="font-bold text-amber-300 font-serif text-base flex items-center gap-1.5">
                    🧠 الجانب النفسي والوجداني:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-serif">
                    {result.psychologicalContext}
                  </p>
                </div>
              </div>

              {/* Recommended Adhkar & Verses */}
              <div className="bg-slate-950/80 border border-emerald-900/60 rounded-xl p-5 space-y-4">
                <div>
                  <h5 className="text-sm font-bold text-amber-400 font-serif mb-2">
                    🤲 أذكار وتوجيهات التحصين الموصى بها:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedAdhkar?.map((dhikr, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs sm:text-sm px-3 py-1.5 rounded-xl font-medium"
                      >
                        {dhikr}
                      </span>
                    ))}
                  </div>
                </div>

                {result.quranicVerses && result.quranicVerses.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-emerald-300 font-serif mb-1.5">
                      📖 آيات قرآنية ذات صلة للتدبر:
                    </h5>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-200 space-y-1 font-serif leading-relaxed">
                      {result.quranicVerses.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Methodology Note from Ahmed Al-Sherif */}
              <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border border-amber-500/30 p-3.5 rounded-xl text-xs text-slate-300 font-serif flex items-start gap-2">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">
                    ملاحظة منهجية من كتاب "تأويلات روحية" (2026) للشيخ أحمد الشريف:
                  </strong>
                  <p>{result.methodologyNote}</p>
                </div>
              </div>

              {/* Immediate Post-Interpretation Available Services Hub */}
              <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100 font-serif">
                        الخدمات والاستشارات المباشرة المتاحة فوراً مع الشيخ أحمد الشريف
                      </h4>
                      <p className="text-xs text-amber-300 font-serif">
                        هل تود توثيق التفسير بصوت الشيخ، أو حجز جلسة استشارية خاصة لمتابعة التعبير؟
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition shrink-0 cursor-pointer border border-emerald-400/40"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>تواصل مباشر واتساب الشيخ (+201558955525)</span>
                  </button>
                </div>

                {/* Services Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Audio Interpretation */}
                  <div className="bg-slate-950/90 border border-emerald-800/80 hover:border-amber-400/80 p-4 rounded-xl flex flex-col justify-between space-y-3 transition group shadow-md">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-serif">
                          <Mic className="w-4 h-4 text-emerald-400" />
                          تفسير صوتي مسجل
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-500/30 px-2 py-0.5 rounded">
                          $49 USD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                        تسجيل صوتي خاص من الشيخ أحمد الشريف يفكك رموزك ويوجهك خطوة بخطوة عبر الواتساب.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToPaidServices(dreamText)}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 hover:text-amber-300 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5 text-amber-400" />
                      <span>طلب التفسير الصوتي</span>
                    </button>
                  </div>

                  {/* Live Consultation Session */}
                  <div className="bg-slate-950/90 border border-emerald-800/80 hover:border-amber-400/80 p-4 rounded-xl flex flex-col justify-between space-y-3 transition group shadow-md">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-serif">
                          <PhoneCall className="w-4 h-4 text-amber-400" />
                          جلسة إرشاد مباشرة (30د)
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-500/30 px-2 py-0.5 rounded">
                          $89 USD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                        مكالمة هاتفية أو زوم لمناقشة الرؤى المركبة، حالات الاستخارة، والمشكلات الروحية.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToPaidServices(dreamText)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>حجز الجلسة المباشرة</span>
                    </button>
                  </div>

                  {/* VIP Upgrade */}
                  <div className="bg-slate-950/90 border border-emerald-800/80 hover:border-amber-400/80 p-4 rounded-xl flex flex-col justify-between space-y-3 transition group shadow-md">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-serif">
                          <Crown className="w-4 h-4 text-amber-300" />
                          عضوية VIP غير المحدودة
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-500/30 px-2 py-0.5 rounded">
                          $29 / شهرياً
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                        تفسير لا محدود للأحلام بالذكاء الاصطناعي، أولوية المراجعة البشرية، وأرشيف دائم.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToPaidServices(dreamText)}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>اشتراك VIP الآن</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
