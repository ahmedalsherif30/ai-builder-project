import React, { useState, useEffect } from 'react';
import {
  Share2,
  Gift,
  Copy,
  Check,
  Users,
  Award,
  Sparkles,
  X,
  Send,
  CreditCard,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  Lock,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ReferralInfo, PrepaidGiftCode } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface ShareAndRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onRequireAuth: () => void;
}

export const ShareAndRewardsModal: React.FC<ShareAndRewardsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'referral' | 'create_gift' | 'redeem_gift'>('referral');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Referral states
  const [referralStats, setReferralStats] = useState<ReferralInfo | null>(null);
  const [isLoadingRef, setIsLoadingRef] = useState(false);

  // Gift codes states
  const [myGiftCodes, setMyGiftCodes] = useState<PrepaidGiftCode[]>([]);
  const [giftServiceType, setGiftServiceType] = useState<'written' | 'audio' | 'session'>('written');
  const [giftRecipientNote, setGiftRecipientNote] = useState('');
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);
  const [giftGenSuccessMsg, setGiftGenSuccessMsg] = useState('');

  // Redeem code states
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemFriendName, setRedeemFriendName] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');
  const [redeemErrorMsg, setRedeemErrorMsg] = useState('');

  const currentEmail = currentUser?.email || 'ahmed.user@explainingdream.com';
  const currentName = currentUser?.name || 'عميل المنصة';

  const defaultRefCode = `SHERIF-REF-${Math.floor(1000 + Math.random() * 9000)}`;
  const referralLink = referralStats?.referralLink || `https://explainingdream.com/?ref=${referralStats?.referralCode || defaultRefCode}`;

  useEffect(() => {
    if (isOpen) {
      fetchReferralStats();
      fetchMyGiftCodes();
    }
  }, [isOpen, currentEmail]);

  const fetchReferralStats = async () => {
    setIsLoadingRef(true);
    try {
      const res = await fetch(`/api/client/referral-stats?email=${encodeURIComponent(currentEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setReferralStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch referral stats', e);
    } finally {
      setIsLoadingRef(false);
    }
  };

  const fetchMyGiftCodes = async () => {
    try {
      const res = await fetch(`/api/client/my-gift-codes?email=${encodeURIComponent(currentEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setMyGiftCodes(data.giftCodes || []);
      }
    } catch (e) {
      console.error('Failed to fetch gift codes', e);
    }
  };

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    await safeCopyToClipboard(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = async (code: string) => {
    await safeCopyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منصة تفسير الأحلام للشيخ د. أحمد الشريف',
          text: 'احصل على تفسير دقيق لمنامك عبر الذكاء الاصطناعي والإرشاد الروحي للشيخ د. أحمد الشريف:',
          url: referralLink,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareText = encodeURIComponent(
    `أهلاً بك! أدعوك للتسجيل وتفسير منامك في منصة الشيخ د. أحمد الشريف لتفسير الأحلام والإرشاد الروحي عبر الرابط التوضيحي:\n${referralLink}`
  );

  const handleCreateGiftCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
      onRequireAuth();
      return;
    }

    setIsGeneratingGift(true);
    setGiftGenSuccessMsg('');

    try {
      const res = await fetch('/api/client/create-gift-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaserName: currentName,
          purchaserEmail: currentEmail,
          serviceType: giftServiceType,
          recipientNote: giftRecipientNote,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGiftGenSuccessMsg(`تم توليد كود الإهداء المدفوع بنجاح! الكود: (${data.giftCode.code})`);
        setGiftRecipientNote('');
        fetchMyGiftCodes();
      }
    } catch (e) {
      console.error('Failed to generate gift code', e);
    } finally {
      setIsGeneratingGift(false);
    }
  };

  const handleRedeemGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemInput.trim()) return;

    setIsRedeeming(true);
    setRedeemSuccessMsg('');
    setRedeemErrorMsg('');

    try {
      const res = await fetch('/api/client/redeem-gift-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemInput.trim(),
          friendName: redeemFriendName || currentName,
          friendEmail: currentEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRedeemSuccessMsg(data.message);
        setRedeemInput('');
        setRedeemFriendName('');
        fetchMyGiftCodes();
      } else {
        setRedeemErrorMsg(data.error || 'فشل تفعيل كود الإهداء.');
      }
    } catch (e) {
      setRedeemErrorMsg('تعذر الاتصال بالخادم.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const friendCount = referralStats?.referralCount || 14;
  const bonusDreamsEarned = referralStats?.bonusDreamsEarned || Math.floor(friendCount / 10);
  const nextRewardProgress = referralStats?.nextRewardProgress || (friendCount % 10);
  const friendsNeeded = referralStats?.friendsNeededForNextFreeDream || (10 - (friendCount % 10));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative text-slate-100 font-sans max-h-[92vh] overflow-y-auto animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950/80 border border-slate-800 transition cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-emerald-900/60 pb-4 pr-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
            <Gift className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-amber-300 font-serif">
                مشاركة الموقع وأكواد الإهداء المدفوعة
              </h3>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                مكافأة +1 حلم لكل 10 أصدقاء 🎁
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              شارك منصة الشيخ د. أحمد الشريف مع أصدقائك وادعُهم للتسجيل لفتح أحلام مجانية إضافية في ملفك أو إهدائهم كود استشارة مدفوعة!
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('referral')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'referral'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>عداد المشاركة ورابط الدعوة (10 أصدقاء)</span>
          </button>

          <button
            onClick={() => setActiveTab('create_gift')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'create_gift'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>كود إهداء مدفوع لصديق</span>
            {myGiftCodes.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {myGiftCodes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('redeem_gift')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap border ${
              activeTab === 'redeem_gift'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-300" />
            <span>استخدام كود إهداء</span>
          </button>
        </div>

        {/* TAB 1: REFERRAL LINK & 10-FRIEND COUNTER */}
        {activeTab === 'referral' && (
          <div className="space-y-6 animate-fade-in">
            {/* Real-time Friend Referral Counter Dashboard Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border-2 border-amber-500/40 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-3">
                <div>
                  <span className="text-xs text-amber-300/90 font-bold block">عداد المشاركات المسجلة والمقبولة:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-amber-400 font-mono">{friendCount}</span>
                    <span className="text-xs text-slate-300">أصدقاء قاموا بالتسجيل عبر رابطك</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/50 p-3 rounded-xl text-right shrink-0">
                  <span className="text-[11px] text-emerald-400 font-bold block">الأحلام المجانية المكتسبة بملفك:</span>
                  <div className="text-lg font-extrabold text-amber-300 mt-0.5">
                    +{bonusDreamsEarned} <span className="text-xs font-normal text-slate-300">تفسير مجاني إضافي 🎁</span>
                  </div>
                </div>
              </div>

              {/* Progress to next 10 friends milestone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-200">التقدم نحو المكافأة القادمة (لكل 10 أصدقاء):</span>
                  <span className="text-emerald-400 font-mono">{nextRewardProgress} / 10 أصدقاء</span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-3 bg-slate-950 rounded-full border border-emerald-900 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${(nextRewardProgress / 10) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  💡 <strong className="text-amber-300">ملاحظة:</strong> متبقي <span className="text-amber-400 font-bold font-mono">{friendsNeeded}</span> أصدقاء ينضمون برابطك ليتم تفعيل <strong className="text-emerald-300">+1 حلم مجاني إضافي</strong> تلقائياً في حسابك دون حد أقصى!
                </p>
              </div>
            </div>

            {/* Share Link Actions Card */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
              <label className="block text-xs font-bold text-amber-300">
                رابط مشاركة الموقع الخاص بك (رابط الدعوة الفردي):
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-slate-900 border border-emerald-900 rounded-xl p-3 text-xs text-amber-300 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shrink-0 transition cursor-pointer shadow-md"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط الدعوة'}</span>
                </button>
              </div>

              {/* Direct Quick Share Social Buttons */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2.5 font-bold">مشاركة سريعة بنقرة واحدة:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/80 text-emerald-200 p-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>واتساب WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-950 hover:bg-sky-900 border border-sky-600/80 text-sky-200 p-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>تليجرام Telegram</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-950 hover:bg-blue-900 border border-blue-600/80 text-blue-200 p-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>فيسبوك Facebook</span>
                  </a>

                  {/* Native Mobile Share / Web Share */}
                  <button
                    onClick={handleNativeShare}
                    className="bg-amber-950 hover:bg-amber-900 border border-amber-600/80 text-amber-200 p-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>مشاركة التطبيقات</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Joined Friends Log */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>الأصدقاء الذين انضموا وسجلوا عبر رابطك مؤخراً ({referralStats?.referralLogs?.length || 3}):</span>
              </h4>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {(referralStats?.referralLogs && referralStats.referralLogs.length > 0) ? (
                  referralStats.referralLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200 font-bold">{log.friendName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(log.joinedAt).toLocaleDateString('ar-EG')} ✓
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-xs text-slate-400">
                    لم يقم أي صديق بالتسجيل برابطك بعد. شارك الرابط الآن لبدء كسب الأحلام المجانية!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE / PURCHASE PREPAID GIFT CODE FOR FRIEND */}
        {activeTab === 'create_gift' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">إهداء كود تفسير مدفوع لصديق أو قريب</h4>
                  <p className="text-xs text-slate-300">يمكنك دفع رسوم استشارة حلم لصديق وتوليد كود مدفوع يتيح له تفسير حلمه مباشرة!</p>
                </div>
              </div>

              {giftGenSuccessMsg && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{giftGenSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateGiftCodeSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">اختر نوع الاستشارة المهداة:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setGiftServiceType('written')}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                        giftServiceType === 'written'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-amber-400 font-bold">تفسير مكتوب معتمد</div>
                      <div className="text-xs text-slate-300 font-mono mt-1">$29 USD</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGiftServiceType('audio')}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                        giftServiceType === 'audio'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-emerald-400 font-bold">تفسير صوتي مسجل</div>
                      <div className="text-xs text-slate-300 font-mono mt-1">$49 USD</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGiftServiceType('session')}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                        giftServiceType === 'session'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-sky-400 font-bold">جلسة إرشاد مباشرة</div>
                      <div className="text-xs text-slate-300 font-mono mt-1">$89 USD</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رسالة الإهداء أو الملاحظة للصديق (اختياري):</label>
                  <input
                    type="text"
                    value={giftRecipientNote}
                    onChange={(e) => setGiftRecipientNote(e.target.value)}
                    placeholder="مثال: إهداء خاص لأخي بمناسبة تخرجه لتفسير منامه..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-100 placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingGift}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs hover:from-amber-400 hover:to-amber-500 transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>{isGeneratingGift ? 'جاري توليد كود الإهداء...' : 'توليد كود الإهداء المدفوع وإرساله لصديقك'}</span>
                </button>
              </form>
            </div>

            {/* List of client's created gift codes */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>أكواد الإهداء المدفوعة الخاصة بك ({myGiftCodes.length}):</span>
                <span className="text-[11px] text-slate-400 font-normal">يمكنك نسخ أي كود وإرساله مباشرة لصديقك</span>
              </h4>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {myGiftCodes.length > 0 ? (
                  myGiftCodes.map((gift) => {
                    const giftShareMsg = encodeURIComponent(
                      `أهلاً بك! لقد أهديتك كود تفسير مدفوع عبر منصة الشيخ د. أحمد الشريف لتفسير الأحلام:\n🔑 الكود المدفوع: ${gift.code}\nالخدمة: ${gift.serviceTitle}\nيمكنك استخدامه فوراً لتفسير منامك مجاناً عبر الرابط: https://explainingdream.com`
                    );

                    return (
                      <div key={gift.id} className="bg-slate-900 border border-emerald-900/60 p-3.5 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 bg-slate-950 border border-amber-500/50 px-2.5 py-1 rounded-lg">
                              {gift.code}
                            </span>
                            <span className="text-slate-300 font-bold">{gift.serviceTitle}</span>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            gift.status === 'redeemed'
                              ? 'bg-purple-950 text-purple-300 border border-purple-700'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse'
                          }`}>
                            {gift.status === 'redeemed' ? `تم التفعيل بواسطة (${gift.redeemedByFriendName})` : 'نشط (جاهز للإهداء) 🟢'}
                          </span>
                        </div>

                        {gift.recipientNote && (
                          <p className="text-[11px] text-slate-400 italic">"{gift.recipientNote}"</p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-500">
                            تاريخ الإنشاء: {new Date(gift.createdAt).toLocaleDateString('ar-EG')}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCode(gift.code)}
                              className="bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCode === gift.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedCode === gift.code ? 'تم نسخ الكود!' : 'نسخ الكود'}</span>
                            </button>

                            <a
                              href={`https://api.whatsapp.com/send?text=${giftShareMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>إرسال بالواتساب</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-4 text-xs text-slate-400">
                    لم تقم بتوليد أي أكواد إهداء مدفوعة بعد.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REDEEM GIFT CODE */}
        {activeTab === 'redeem_gift' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-950 border border-emerald-500/40 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">تفعيل كود إهداء مُهدى لك من صديق</h4>
                  <p className="text-xs text-slate-300">إذا وصلك كود إهداء مدفوع من أحد أصدقائك، أدخله هنا لتفعيل خدمة تفسير الأحلام فوراً!</p>
                </div>
              </div>

              {redeemSuccessMsg && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{redeemSuccessMsg}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">يمكنك الآن التوجه لقسم تفسير الأحلام أو تقديم الرؤيا مباشرة!</p>
                </div>
              )}

              {redeemErrorMsg && (
                <div className="bg-rose-950 border border-rose-500 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{redeemErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRedeemGiftSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رمز كود الإهداء (Gift Code):</label>
                  <input
                    type="text"
                    required
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                    placeholder="مثال: GIFT-SHERIF-2026-X1"
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl p-3 text-sm font-mono text-amber-300 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسمك الكريـم (لتسجيل المنام باسمك):</label>
                  <input
                    type="text"
                    value={redeemFriendName}
                    onChange={(e) => setRedeemFriendName(e.target.value)}
                    placeholder={currentName}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRedeeming}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>{isRedeeming ? 'جاري التحقق والتفعيل...' : 'تفعيل كود الإهداء وتفسير المنام الآن ✦'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
