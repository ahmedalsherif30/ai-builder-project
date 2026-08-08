import React, { useState } from 'react';
import { Send, Smartphone, Mail, CheckCircle2, X, Bell } from 'lucide-react';

interface SubscribeChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDigest?: (data: { code: string; contact: string; digest?: any }) => void;
}

export const SubscribeChannelModal: React.FC<SubscribeChannelModalProps> = ({
  isOpen,
  onClose,
  onOpenDigest,
}) => {
  const [channel, setChannel] = useState<'whatsapp' | 'telegram' | 'email'>('whatsapp');
  const [contactInfo, setContactInfo] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo || !contactInfo.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrContact: contactInfo.trim(),
          channel,
          userName: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setTimeout(() => {
          setSubscribed(false);
          onClose();
          if (onOpenDigest) {
            onOpenDigest({
              code: data.subscriber?.subscriberCode || 'NEWS-2026-X800',
              contact: contactInfo.trim(),
              digest: data.digest
            });
          }
        }, 1200);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-serif">
              قناة النشرات والتنبيهات المنامية
            </h3>
            <p className="text-xs text-emerald-400 font-serif">
              احصل على أحدث المقالات والعروض والتنبيهات الخاصة مباشرة
            </p>
          </div>
        </div>

        {subscribed ? (
          <div className="bg-emerald-950 border border-emerald-700 p-5 rounded-2xl text-center space-y-2 text-emerald-200 text-xs font-serif">
            <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="font-bold text-sm text-slate-100">تم اشتراكك بنجاح!</p>
            <p>سنرسل لك أحدث مقالات التفسير وتنبيهات الدروس المباشرة للشيخ أحمد الشريف.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-serif">
            
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">اختر وسيلة التلقي المفضل:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-900 text-amber-300 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-emerald-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('telegram')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    channel === 'telegram'
                      ? 'bg-emerald-900 text-amber-300 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-emerald-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>تيليجرام</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    channel === 'email'
                      ? 'bg-emerald-900 text-amber-300 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-emerald-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>بريد</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {channel === 'email' ? 'أدخل بريدك الإلكتروني:' : 'أدخل رقم الهاتف مع مفتاح الدولة:'}
              </label>
              <input
                type={channel === 'email' ? 'email' : 'tel'}
                required
                placeholder={channel === 'email' ? 'example@gmail.com' : '+20 155 895 5525'}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs dir-ltr"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/60 text-[11px] text-slate-400">
              * ننشر بمعدل 4 مقالات علمية يومياً من محتوى طبعة 2026 لكتاب تأويلات روحية.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold py-3 rounded-xl hover:from-amber-400 hover:to-emerald-400 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'جاري الاشتراك وتجهيز الملف...' : 'اشتراك مجاني واستلام الملف الإخباري'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
