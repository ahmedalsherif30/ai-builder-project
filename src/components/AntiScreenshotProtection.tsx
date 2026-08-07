import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

interface AntiScreenshotProtectionProps {
  isAdmin?: boolean;
}

export const AntiScreenshotProtection: React.FC<AntiScreenshotProtectionProps> = ({ isAdmin = false }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isScreenBlackedOut, setIsScreenBlackedOut] = useState(false);

  useEffect(() => {
    // If admin, we can keep protection active or relax if needed, but per rule: "اجعل العميل لا ياخذ او يلتقط اسكرين شوت"
    // We apply full protection for clients.
    
    const triggerProtection = (msg: string) => {
      setWarningMessage(msg);
      setShowWarning(true);
      setIsScreenBlackedOut(true);

      // Clear clipboard to prevent copied screenshot data where possible
      if (document.hasFocus && document.hasFocus() && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('محتوى محمي - منصة تفسير الأحلام للشيخ د. أحمد الشريف').catch(() => {
          // Silently ignore clipboard focus/permission errors
        });
      }

      // Hide blackout overlay after 1.8s
      setTimeout(() => {
        setIsScreenBlackedOut(false);
      }, 1800);

      // Hide warning toast after 4s
      setTimeout(() => {
        setShowWarning(false);
      }, 4000);
    };

    // 1. Listen for keydown / keyup
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        triggerProtection('تم رصد محاولة التقاط شاشة (PrintScreen)! المحتوى محمي.');
        return false;
      }

      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        triggerProtection('تم تعطيل خاصية الطباعة وحفظ الصفحة لسرية بيانات العميل.');
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        triggerProtection('تم تعطيل حفظ الصفحة مسبقاً لحماية حقوق الملكية.');
        return false;
      }

      // Windows + Shift + S / Cmd + Shift + 4 / Cmd + Shift + 3 (Snipping Tool shortcuts)
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4' || e.key === '5')
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerProtection('تم منع أداة لقطة الشاشة (Snipping Tool). المحتوى محمي.');
        return false;
      }

      // F12 or Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U (Inspect / View Source)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))
      ) {
        // Allow F12 only if explicitly admin, otherwise prevent
        if (!isAdmin) {
          e.preventDefault();
          e.stopPropagation();
          triggerProtection('تم تعطيل فحص العنصر لسرية منصة تفسير الأحلام.');
          return false;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        triggerProtection('تم رصد محاولة التقاط شاشة (PrintScreen)!');
        return false;
      }
    };

    // 2. Prevent Context Menu (Right-Click)
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent right click context menu across client view
      e.preventDefault();
      triggerProtection('تم تعطيل القائمة الجانبية لحماية محتوى وإيصالات ورؤى المنصة.');
      return false;
    };

    // 3. Prevent Dragging Images
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Attach Event Listeners
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [isAdmin]);

  return (
    <>
      {/* Blackout Flash Shield overlay triggered on PrintScreen attempt */}
      {isScreenBlackedOut && (
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center mb-5 animate-pulse">
            <ShieldAlert className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-2">🛡️ محتوى محمي ضد التقاط الشاشة</h2>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            عذراً، تماشياً مع سياسة الخصوصية وحماية بيانات الرؤى والشروحات الخاصة بالشيخ د. أحمد الشريف، تم إلغاء التقاط الشاشة وحظر حفظ الصور.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>نظام الأمان والحماية المشفرة 2026</span>
          </div>
        </div>
      )}

      {/* Security Toast Warning */}
      {showWarning && !isScreenBlackedOut && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-[99990] max-w-md bg-slate-900/95 border border-amber-500/80 text-amber-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-bounce">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-right dir-rtl">
            <h4 className="text-sm font-bold text-amber-300">تنبيه أمان منصة الأحلام</h4>
            <p className="text-xs text-slate-200 leading-relaxed">{warningMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};
