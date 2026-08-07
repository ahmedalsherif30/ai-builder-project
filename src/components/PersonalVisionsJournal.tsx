import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Lock,
  Sparkles,
  Search,
  BookOpen,
  ArrowLeft,
  User,
  UserPlus,
  LayoutDashboard,
  TrendingUp,
  Compass,
  Check,
  Copy,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Sparkle,
  Share2,
  Eye
} from 'lucide-react';
import { PersonalVisionEntry, DreamMood, UserProfile } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface PersonalVisionsJournalProps {
  entries: PersonalVisionEntry[];
  onAddEntry: (entry: Omit<PersonalVisionEntry, 'id'>) => void;
  onUpdateEntry: (id: string, updated: Partial<PersonalVisionEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToAi: () => void;
  user?: UserProfile;
  onOpenAuth?: () => void;
  onOpenClientDashboard?: () => void;
}

export const PersonalVisionsJournal: React.FC<PersonalVisionsJournalProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onNavigateToAi,
  user,
  onOpenAuth,
  onOpenClientDashboard,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'cards' | 'timeline' | 'symbols' | 'fulfillment'>('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PersonalVisionEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  // Form states for manual entry
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newMood, setNewMood] = useState<DreamMood>('peaceful');
  const [newTags, setNewTags] = useState('');

  // Note editing state inside entry modal
  const [editingNotes, setEditingNotes] = useState('');
  const [editingFulfillment, setEditingFulfillment] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    onAddEntry({
      title: newTitle,
      dreamText: newText,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'pending',
      mood: newMood,
      isPrivate: true,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTitle('');
    setNewText('');
    setNewTags('');
    setIsAddModalOpen(false);
  };

  // Metrics Calculations
  const totalEntries = entries.length;
  const fulfilledCount = entries.filter((e) => e.status === 'fulfilled').length;
  const interpretedCount = entries.filter((e) => e.status === 'interpreted' || e.aiResponse).length;
  const fulfillmentPercentage = totalEntries > 0 ? Math.round((fulfilledCount / totalEntries) * 100) : 0;

  // Extract all symbols / tags
  const symbolMap: Record<string, number> = entries.reduce((acc: Record<string, number>, entry) => {
    if (entry.tags) {
      entry.tags.forEach((t) => {
        const cleanTag = t.trim();
        if (cleanTag) {
          acc[cleanTag] = (acc[cleanTag] || 0) + 1;
        }
      });
    }
    return acc;
  }, {});

  const sortedSymbols = Object.entries(symbolMap).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  const filteredEntries = entries.filter((e) => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.dreamText.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  const getStatusBadge = (status: PersonalVisionEntry['status']) => {
    switch (status) {
      case 'fulfilled':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 font-serif shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            تحققت في الواقع ✨
          </span>
        );
      case 'interpreted':
        return (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 font-serif">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            تم تفكيك رموزها
          </span>
        );
      case 'symbolic':
        return (
          <span className="bg-teal-950 text-teal-300 border border-teal-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 font-serif">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            مشاهدة رمزية
          </span>
        );
      default:
        return (
          <span className="bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 font-serif">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            قيد المتابعة والتدبر
          </span>
        );
    }
  };

  const handleCopySpiritualPass = () => {
    const summaryText = `📜 [الملف الروحي الشخصي الموثق - ExplainingDream.com]
👤 صاحب الملف: ${user?.name || 'عضو المنصة'}
🔒 الحماية: مشفّر ومعتمد برقم أمني خاص
📊 إجمالي الرؤى الموثقة: ${totalEntries} رؤيا
✨ نسبة تحقق الدلالات: ${fulfillmentPercentage}%
أول واكبر منصة عربية تجمع بين التأويل الروحي، وتوثيق الرؤى، ومتابعة دلالاتها في ملف شخصي لكل عميل.`;

    safeCopyToClipboard(summaryText);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 protected-client-content select-none dir-rtl">
      
      {/* Anti-screenshot notice & Platform Badge */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-3.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-300 shadow-xl">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-serif">
            <b>المنصة العربية الأولى والجامعة</b> للتأويل الروحي، وتوثيق الرؤى المنامية، ومتابعة دلالاتها عبر ملف شخصي مشفّر 🔒
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full text-[11px] font-bold">
            حماية SSL 256-bit 🛡️
          </span>
          <button
            onClick={handleCopySpiritualPass}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer"
            title="نسخ كارت الملف الروحي"
          >
            {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPass ? 'تم النسخ' : 'بطاقة السجل'}</span>
          </button>
        </div>
      </div>

      {/* Feature Header: The Personal Spiritual Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1 rounded-full text-xs font-serif font-bold">
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>ملف التأويل والتوثيق الروحي الشخصي (حصرياً)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif leading-tight">
              الملف الروحي الشخصي وتوثيق دلالات الرؤى
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
              مساحتك الخاصة المحفوظة والمشفرة بالكامل لرصد أحلامك، حفظ تأويلات الشيخ أحمد الشريف والذكاء الاصطناعي، ومتابعة تحقق البشائر والدلالات في حياتك اليومية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-950/50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>رصد وتوثيق حلم جديد</span>
            </button>

            <button
              onClick={onNavigateToAi}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-medium px-4 py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تفسير فوري بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Member Profile Status Bar */}
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm font-serif">{user?.name || 'زائر المنصة الكريم'}</span>
                {user?.role === 'vip' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    👑 عضوية VIP الذهبية
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2.5 py-0.5 rounded-full">
                    حساب عضوية شخصية
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] font-serif mt-0.5">
                {user?.email || 'يمكنك تسجیل حساب عضوية مجاني لربط ملفك الروحي ومزامنته عبر أجهزتك.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>دخول / إنشاء حساب</span>
              </button>
            )}

            {onOpenClientDashboard && (
              <button
                onClick={onOpenClientDashboard}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>لوحة التحكم والاشتراك</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Professional Spiritual Metrics Containers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Metric 1: Total Visions */}
        <div className="bg-slate-900/90 border border-emerald-900/80 rounded-2xl p-4.5 space-y-2 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif font-medium">الرؤى الموثقة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">{totalEntries}</span>
            <span className="text-[11px] text-emerald-400 font-serif">حلم محفوظ</span>
          </div>
          <p className="text-[10px] text-slate-400 font-serif">مسجلة بملفك المشفر</p>
        </div>

        {/* Metric 2: Realization Rate */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4.5 space-y-2 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-serif font-medium">نسبة تحقق الدلالات</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">{fulfillmentPercentage}%</span>
            <span className="text-[11px] text-emerald-400 font-serif">في الواقع</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-emerald-900/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${fulfillmentPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Interpreted Symbols */}
        <div className="bg-slate-900/90 border border-emerald-900/80 rounded-2xl p-4.5 space-y-2 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif font-medium">المشاهدات المفسرة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">{interpretedCount}</span>
            <span className="text-[11px] text-slate-400 font-serif">رؤيا مكتملة الرموز</span>
          </div>
          <p className="text-[10px] text-emerald-400/90 font-serif">تأويل روحي معتمد</p>
        </div>

        {/* Metric 4: Spiritual State */}
        <div className="bg-slate-900/90 border border-emerald-900/80 rounded-2xl p-4.5 space-y-2 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif font-medium">الانطباع والاطمئنان</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-emerald-300 font-serif">بشائر وطمأنينة</span>
          </div>
          <p className="text-[10px] text-slate-400 font-serif">متابعة إيمانية مستمرة</p>
        </div>

      </div>

      {/* Navigation View Switcher (تنسيق الحاويات والمواضيع المحترفة) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl shadow-lg">
        
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveViewTab('cards')}
            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'cards'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-amber-300 border border-emerald-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>بطاقات الرؤى الموثقة ({filteredEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('timeline')}
            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'timeline'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-amber-300 border border-emerald-900/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>الخط الزمني الروحي</span>
          </button>

          <button
            onClick={() => setActiveViewTab('symbols')}
            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'symbols'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-amber-300 border border-emerald-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>خريطة الرموز ({sortedSymbols.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('fulfillment')}
            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'fulfillment'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-amber-300 border border-emerald-900/60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>دفتر تحقق البشائر ({fulfilledCount})</span>
          </button>
        </div>

        {/* Filter and Search Bar inside Cards View */}
        {activeViewTab === 'cards' && (
          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              placeholder="ابحث في سجل أحلامك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-900 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 font-serif"
            />
            <Search className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5" />
          </div>
        )}
      </div>

      {/* VIEW TAB 1: CARDS VIEW */}
      {activeViewTab === 'cards' && (
        <div className="space-y-4">
          
          {/* Status Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-serif">
            <span className="text-slate-400 font-bold ml-1">التصنيف:</span>
            {[
              { id: 'all', label: 'كافة الرؤى' },
              { id: 'fulfilled', label: '✨ تحققت في الواقع' },
              { id: 'interpreted', label: 'تم تفكيك رموزها' },
              { id: 'pending', label: 'قيد المتابعة والتدبر' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilterStatus(item.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                  filterStatus === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border border-emerald-900/60 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {filteredEntries.length === 0 ? (
            <div className="bg-slate-900/60 border border-dashed border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/80 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h3 className="text-lg font-bold text-slate-100 font-serif">
                  سجلك الشخصي فارغ حالياً – لا توجد أحلام مسجلة
                </h3>
                <p className="text-xs text-slate-300 font-serif leading-relaxed">
                  هذا السجل خاص ومشفّر تماماً لك، وتظهر فيه فقط الأحلام والمشاهدات المنامية التي تقوم بكتابتها وإدخالها بنفسك، أو حفظها مباشرة بعد التفسير.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>رصد حلم جديد بنفسك الآن</span>
                </button>

                <button
                  onClick={onNavigateToAi}
                  className="inline-flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>تفسير حلمك بالذكاء الاصطناعي وحفظه</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900/90 border border-emerald-900/80 hover:border-amber-500/50 rounded-2xl p-5 space-y-4 shadow-xl transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {getStatusBadge(entry.status)}
                      <span className="text-xs text-slate-400 font-serif flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
                      {entry.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40">
                      "{entry.dreamText}"
                    </p>

                    {entry.fulfillmentNotes && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-200 font-serif space-y-1">
                        <span className="font-bold flex items-center gap-1 text-amber-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          حدث تحقق الدلالة في الواقع:
                        </span>
                        <p className="line-clamp-2">{entry.fulfillmentNotes}</p>
                      </div>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-950 text-emerald-300 border border-emerald-900 px-2.5 py-0.5 rounded-full font-serif"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3.5 border-t border-emerald-900/40 flex items-center justify-between text-xs font-serif">
                    <button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setEditingNotes(entry.expertNotes || '');
                        setEditingFulfillment(entry.fulfillmentNotes || '');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض التفاصيل والملاحظات</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 transition"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 2: SPIRITUAL TIMELINE VIEW */}
      {activeViewTab === 'timeline' && (
        <div className="bg-slate-900/90 border border-emerald-900/80 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-emerald-900/60 pb-3 space-y-1">
            <h3 className="text-lg font-bold text-slate-100 font-serif flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>الخط الزمني الممتد لتطور وتأويل الرؤى</span>
            </h3>
            <p className="text-xs text-slate-400 font-serif">
              متابعة تسلسل الرؤى المنامية زمنياً وتدرج ظهور بشائرها وتأويلاتها عبر الأيام.
            </p>
          </div>

          {entries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8 font-serif">لا توجد رؤى مسجلة بالخط الزمني حالياً.</p>
          ) : (
            <div className="relative border-r-2 border-amber-500/40 mr-4 pr-6 space-y-8">
              {entries.map((entry, idx) => (
                <div key={entry.id} className="relative group">
                  {/* Timeline Dot Node */}
                  <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-950 shadow-md group-hover:scale-125 transition" />

                  <div className="bg-slate-950 border border-emerald-900/80 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-amber-300 font-bold font-serif flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        تاريخ المنام: {entry.date}
                      </span>
                      {getStatusBadge(entry.status)}
                    </div>

                    <h4 className="text-base font-bold text-slate-100 font-serif">{entry.title}</h4>

                    <p className="text-xs text-slate-300 font-serif leading-relaxed bg-slate-900/80 p-3 rounded-xl">
                      "{entry.dreamText}"
                    </p>

                    {entry.aiResponse && (
                      <div className="text-xs text-emerald-300 font-serif bg-emerald-950/60 border border-emerald-800 p-3 rounded-xl space-y-1">
                        <span className="font-bold text-amber-400 block">✨ خلاصة التأويل:</span>
                        <p className="line-clamp-2">{entry.aiResponse.overallInterpretation}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          setEditingNotes(entry.expertNotes || '');
                          setEditingFulfillment(entry.fulfillmentNotes || '');
                        }}
                        className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>فتح سجل هذه الرؤيا ←</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 3: SYMBOL MAP & FREQUENCY */}
      {activeViewTab === 'symbols' && (
        <div className="bg-slate-900/90 border border-emerald-900/80 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-emerald-900/60 pb-3 space-y-1">
            <h3 className="text-lg font-bold text-slate-100 font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>خريطة الرموز والدلالات المنامية المتكررة</span>
            </h3>
            <p className="text-xs text-slate-400 font-serif">
              استعراض الرموز الأكثر ظهوراً وتكراراً في أحلامك لمساعدتك في فهم الرسائل الروحية المتكررة.
            </p>
          </div>

          {sortedSymbols.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-slate-400 font-serif">لم تقم بإضافة وسوم أو رموز لأحلامك بعد.</p>
              <p className="text-[11px] text-slate-500 font-serif">عند إضافة حلم جديد، اكتب الوسوم والرموز مثل: ذهب, ماء, سفينة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sortedSymbols.map(([symbol, count], idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-emerald-800/80 hover:border-amber-400/80 rounded-2xl p-4 flex items-center justify-between gap-2 shadow transition"
                >
                  <span className="text-sm font-bold text-amber-300 font-serif">#{symbol}</span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {count} تكرار
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 4: REAL-LIFE FULFILLMENT DIARY */}
      {activeViewTab === 'fulfillment' && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-emerald-900/60 pb-3 space-y-1">
            <h3 className="text-lg font-bold text-amber-300 font-serif flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>دفتر توثيق ومتابعة تحقق البشائر في الواقع</span>
            </h3>
            <p className="text-xs text-slate-300 font-serif">
              قائمة بالرؤى والمشاهدات المنامية التي تحققت دلالاتها وبشائرها بالفعل في حياتك اليومية.
            </p>
          </div>

          {entries.filter((e) => e.status === 'fulfilled').length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-slate-950/60 rounded-2xl border border-dashed border-amber-500/30 p-6">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 font-serif font-bold">لم تقم بتعليم أي رؤيا كـ "تحققت في الواقع" حتى الآن.</p>
              <p className="text-[11px] text-slate-400 font-serif max-w-md mx-auto">
                عندما تتحقق بشرى أو رمز من أحلامك، افتح بطاقة الرؤيا وقم بتغيير حالتها إلى "تحققت في الواقع" وسجل تفاصيل التحقق لتظهر هنا.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries
                .filter((e) => e.status === 'fulfilled')
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-amber-400 font-bold font-serif flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        رؤيا متحققة - {entry.date}
                      </span>
                      <span className="text-xs text-slate-400 font-serif">{entry.title}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-serif leading-relaxed bg-slate-900/80 p-3 rounded-xl">
                      "{entry.dreamText}"
                    </p>

                    {entry.fulfillmentNotes && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 font-serif space-y-1">
                        <span className="font-bold text-amber-400 block">تفاصيل الحدث الواقعي:</span>
                        <p>{entry.fulfillmentNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Entry Detail & Reflection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 left-4 p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-serif block">
                  رؤية شخصية - {selectedEntry.date}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-serif">
                  {selectedEntry.title}
                </h3>
              </div>
              <div>{getStatusBadge(selectedEntry.status)}</div>
            </div>

            {/* Original Text */}
            <div className="bg-slate-950 border border-emerald-900 p-4 rounded-2xl space-y-1">
              <span className="text-xs font-bold text-emerald-300 font-serif block">
                ◆ نص الحلم المدون:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                "{selectedEntry.dreamText}"
              </p>
            </div>

            {/* AI Interpretation if available */}
            {selectedEntry.aiResponse && (
              <div className="bg-gradient-to-b from-slate-950 to-emerald-950/60 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-amber-400 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  التفسير المستخرج بالذكاء الاصطناعي (طبعة 2026):
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                  {selectedEntry.aiResponse.overallInterpretation}
                </p>

                {selectedEntry.aiResponse.symbolsBreakdown && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-emerald-300 block">تفاصيل الرموز:</span>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {selectedEntry.aiResponse.symbolsBreakdown.map((s, i) => (
                        <li key={i}>
                          <b className="text-amber-300">{s.symbol}:</b> {s.meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Status Change & Reflection Form */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-emerald-900">
                <label className="text-xs font-bold text-slate-200 font-serif">
                  تحديث حالة الرؤيا في حياتك اليومية:
                </label>
                <select
                  value={selectedEntry.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as PersonalVisionEntry['status'];
                    onUpdateEntry(selectedEntry.id, { status: newStatus });
                    setSelectedEntry({ ...selectedEntry, status: newStatus });
                  }}
                  className="bg-slate-900 border border-emerald-700 rounded-lg p-2 text-xs text-amber-300 font-bold font-serif outline-none"
                >
                  <option value="pending">قيد المتابعة والتدبر</option>
                  <option value="interpreted">تم تفكيك رموزها وتأويلها</option>
                  <option value="symbolic">مشاهدة رمزية</option>
                  <option value="fulfilled">✨ تحققت في الواقع بالخير!</option>
                </select>
              </div>

              {/* Fulfillment Notes */}
              <div>
                <label className="block text-xs text-emerald-300 font-bold mb-1 font-serif">
                  تفاصيل حدث تحقق الرؤيا في الواقع (إن تحققت):
                </label>
                <textarea
                  rows={2}
                  value={editingFulfillment}
                  onChange={(e) => setEditingFulfillment(e.target.value)}
                  placeholder="سجل كيف ومتى تحققت بشرى أو رمز هذه الرؤيا في حياتك..."
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-xs text-amber-300 font-bold mb-1 font-serif">
                  ملاحظاتك وانطباعاتك الروحية الخاصة:
                </label>
                <textarea
                  rows={2}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="اكتب أفكارك، مشاعرك، أو خواطرك أثناء المنام وبعده..."
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    onUpdateEntry(selectedEntry.id, {
                      expertNotes: editingNotes,
                      fulfillmentNotes: editingFulfillment,
                    });
                    setSelectedEntry(null);
                  }}
                  className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer font-serif"
                >
                  حفظ التحديثات في الملف الروحي
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add New Dream Manual Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-100 font-serif flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>رصد وتوثيق حلم جديد بالملف الروحي</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs font-serif">
              <div>
                <label className="block text-slate-300 font-medium mb-1">عنوان مختصر للرؤيا:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رؤية الأساور الذهبية في البستان..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">تفاصيل المنام المشاهد:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب المنام بالتفصيل والأحداث المتذكرة..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 resize-none font-serif"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">الرموز والوسوم الرئيسية (تفصل بكومة):</label>
                <input
                  type="text"
                  placeholder="ذهب, بستان, أساور"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition cursor-pointer"
                >
                  حفظ بالملف الروحي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
