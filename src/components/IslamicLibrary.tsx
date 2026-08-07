import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, BookOpen, Volume2, VolumeX, Compass, Clock, Heart, Calculator, Calendar, Sparkles, RefreshCw, CheckCircle2, Play, Pause, Square, Sliders, Settings, Repeat, Search, Gift, Award, Star, X, Check, HelpCircle } from 'lucide-react';
import { MOCK_ADHKAR } from '../data/mockData';
import { ASMA_ALLAH_99, AsmaAllahItem } from '../data/asmaAllahData';
import { DhikrItem } from '../types';
import { detectUserLocationByTimezone, fetchPrayerTimesForCity, formatTo12Hour, playCalmAdhanSound, playDoveCooingSound } from '../utils/spiritualAudioEngine';
import { QuranFortuneModal } from './QuranFortuneModal';

interface IslamicLibraryProps {
  onUnlockFreeDream?: () => void;
}

export const IslamicLibrary: React.FC<IslamicLibraryProps> = ({ onUnlockFreeDream }) => {
  const [activeTab, setActiveTab] = useState<'quran' | 'prayers' | 'adhkar' | 'asma' | 'zakat'>('quran');

  // Fortune Quran Verse Modal
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false);

  // Audio test states
  const [isPlaying, setIsPlaying] = useState(false);
  const [surahList, setSurahList] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1); // Default Al-Fatiha
  const [surahDetail, setSurahDetail] = useState<any | null>(null);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [quranLoading, setQuranLoading] = useState(false);

  // Audio Playback & Settings State
  const [audioType, setAudioType] = useState<'adhan' | 'quran'>('adhan');
  const [audioVolume, setAudioVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [audioBitrate, setAudioBitrate] = useState<'128' | '64'>('128');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAdhanRef = useRef<(() => void) | null>(null);

  const currentAudioUrl = `https://cdn.islamic.network/quran/audio-surah/${audioBitrate}/${reciter}/${selectedSurah}.mp3`;

  // Sync audio src when Surah, Reciter or Bitrate changes
  useEffect(() => {
    if (audioRef.current && audioType === 'quran') {
      audioRef.current.src = currentAudioUrl;
      audioRef.current.load();
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch((err) => console.log('Audio autoplay info:', err));
      }
    }
  }, [selectedSurah, reciter, audioBitrate, audioType]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : audioVolume;
    }
  }, [audioVolume, isMuted]);

  // Sync speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  // Unified single-button play/pause/mute handler
  const handleSingleAudioToggle = () => {
    if (audioType === 'adhan') {
      if (!isPlaying) {
        const stopFn = playCalmAdhanSound(() => {
          setIsPlaying(false);
          setIsMuted(false);
        });
        stopAdhanRef.current = stopFn;
        setIsPlaying(true);
        setIsMuted(false);
      } else if (!isMuted) {
        if (stopAdhanRef.current) {
          stopAdhanRef.current();
          stopAdhanRef.current = null;
        }
        setIsMuted(true);
        setIsPlaying(false);
      } else {
        const stopFn = playCalmAdhanSound(() => {
          setIsPlaying(false);
          setIsMuted(false);
        });
        stopAdhanRef.current = stopFn;
        setIsPlaying(true);
        setIsMuted(false);
      }
    } else {
      if (!audioRef.current) return;
      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        }).catch((err) => console.error('Playback error:', err));
      } else if (!isMuted) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else {
        setIsMuted(false);
        audioRef.current.muted = false;
        audioRef.current.play().catch((err) => console.error(err));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioType === 'quran') {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (!isRepeat) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Prayer times state
  const [city, setCity] = useState(() => detectUserLocationByTimezone().city);
  const [prayerTimes, setPrayerTimes] = useState<any>({
    Fajr: '04:32',
    Sunrise: '05:50',
    Dhuhr: '12:22',
    Asr: '15:42',
    Maghrib: '18:54',
    Isha: '20:24',
    dateHijri: '10 صفر 1448 هـ',
    qiblaDegrees: 136,
  });

  useEffect(() => {
    fetchPrayerTimesForCity(city).then((data) => {
      setPrayerTimes(data);
    });
  }, [city]);

  // Adhkar & Digital Misbaha State
  const [dhikrCategory, setDhikrCategory] = useState<'sabah' | 'masaa' | 'sleep'>('sabah');
  const [adhkarItems, setAdhkarItems] = useState<DhikrItem[]>(MOCK_ADHKAR);
  
  // Persistent Tasbeeh Counter
  const [misbahaCount, setMisbahaCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('explaining_dreams_misbaha_count_2026');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  
  const [misbahaPhrase, setMisbahaPhrase] = useState('سبحان الله وبحمده، سبحان الله العظيم');
  const [showTasbeehBonusModal, setShowTasbeehBonusModal] = useState(false);
  const [bonusEarnedCount, setBonusEarnedCount] = useState(0);

  // Save misbaha count & check for 1000 milestone rewards
  const incrementMisbaha = (amount: number = 1) => {
    setMisbahaCount((prevCount) => {
      const newCount = prevCount + amount;
      try {
        localStorage.setItem('explaining_dreams_misbaha_count_2026', String(newCount));
      } catch (e) {
        console.error(e);
      }

      // Check if crossed a new 1000 milestone
      const oldMilestone = Math.floor(prevCount / 1000);
      const newMilestone = Math.floor(newCount / 1000);

      if (newMilestone > oldMilestone) {
        // Award free dream reward!
        playDoveCooingSound(0.2);
        setBonusEarnedCount(newMilestone);
        setShowTasbeehBonusModal(true);
        if (onUnlockFreeDream) {
          onUnlockFreeDream();
        }
      }

      return newCount;
    });
  };

  // Asma Allah Al-Husna 99 State
  const [asmaCategory, setAsmaCategory] = useState<string>('all');
  const [asmaSearch, setAsmaSearch] = useState<string>('');
  const [selectedAsmaModal, setSelectedAsmaModal] = useState<AsmaAllahItem | null>(null);

  // Zakat Calculator State
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(75);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (res.ok) {
          const data = await res.json();
          setSurahList(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch Quran Surahs API:', err);
      }
    }
    fetchSurahs();
  }, []);

  useEffect(() => {
    async function fetchSurahDetail() {
      setQuranLoading(true);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/${reciter}`);
        if (res.ok) {
          const data = await res.json();
          setSurahDetail(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch Surah detail API:', err);
      } finally {
        setQuranLoading(false);
      }
    }
    fetchSurahDetail();
  }, [selectedSurah, reciter]);

  const handleDhikrClick = (id: string) => {
    setAdhkarItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, currentCount: item.currentCount + 1 };
        }
        return item;
      })
    );
    // Also add to global misbaha count
    incrementMisbaha(1);
  };

  const calculateZakat = () => {
    const totalWealth = cashAmount + goldGrams * goldPricePerGram;
    const nisabValue = 85 * goldPricePerGram;
    if (totalWealth >= nisabValue) {
      return {
        totalWealth,
        zakatDue: totalWealth * 0.025,
        isEligible: true,
        nisabValue,
      };
    }
    return {
      totalWealth,
      zakatDue: 0,
      isEligible: false,
      nisabValue,
    };
  };

  const zakatResult = calculateZakat();

  // Filtered Asma Allah
  const filteredAsmaAllah = ASMA_ALLAH_99.filter((item) => {
    const matchesCategory = asmaCategory === 'all' || item.category === asmaCategory;
    const matchesSearch =
      !asmaSearch.trim() ||
      item.name.includes(asmaSearch) ||
      item.meaning.includes(asmaSearch) ||
      item.spiritualVirtue.includes(asmaSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Quran Fortune Verse Popup Modal */}
      <QuranFortuneModal
        isOpen={isFortuneModalOpen}
        onClose={() => setIsFortuneModalOpen(false)}
      />

      {/* Header & Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-4 py-1.5 rounded-full text-xs font-serif shadow-lg">
          <Moon className="w-4 h-4 text-amber-400" />
          <span>مكتبة القرآن والنفحات الإيمانية الـ 2026</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 font-serif">
          الخدمات والأدوات الإيمانية المباركة
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
          تلاوة القرآن وتفسيره، مواقيت الصلاة والقبلة، السبحة الإلكترونية ومكافأة الـ 1000 تسبيحة، وأسماء الله الحسنى الـ 99 الروحية.
        </p>

        {/* PROMINENT QURAN FORTUNE VERSE BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => setIsFortuneModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold font-serif text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-950/50 transition cursor-pointer flex items-center justify-center gap-2.5 border-2 border-amber-300 mx-auto transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            <span>🔮 اضغط هنا لاستبشار اليوم: رسالتك القرآنية (آية تتغير في كل دخول)</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs (4 Main Tabs) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
        {[
          { id: 'quran', label: '1. القرآن الكريم وتلاوته', icon: BookOpen },
          { id: 'prayers', label: '2. مواقيت الصلاة والقبلة', icon: Compass },
          { id: 'adhkar', label: '3. السبحة الإلكترونية والأذكار', icon: Heart },
          { id: 'asma', label: '4. أسماء الله الحسنى (الـ 99 اسماً)', icon: Star },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 sm:px-5 py-3 rounded-2xl font-bold font-serif transition cursor-pointer whitespace-nowrap border flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-xl shadow-amber-950/40 scale-105'
                : 'bg-slate-900 border-emerald-900/80 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. QURAN TAB */}
      {activeTab === 'quran' && (
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
          
          <audio
            ref={audioRef}
            src={currentAudioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            preload="metadata"
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
            
            {/* Surah Selector */}
            <div className="w-full lg:w-auto flex items-center gap-2">
              <label className="text-xs text-amber-300 font-serif font-bold whitespace-nowrap">
                السورة:
              </label>
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                className="w-full sm:w-56 bg-slate-950 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-serif cursor-pointer"
              >
                {surahList.length > 0 ? (
                  surahList.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                    </option>
                  ))
                ) : (
                  <option value={1}>1. سورة الفاتحة (7 آية)</option>
                )}
              </select>
            </div>

            {/* Audio Mode & Single Play/Mute Button */}
            <div className="w-full lg:w-auto flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 border border-amber-500/40 p-2 rounded-2xl shadow-inner relative">
              
              <select
                value={audioType}
                onChange={(e) => {
                  if (isPlaying) {
                    if (stopAdhanRef.current) {
                      stopAdhanRef.current();
                      stopAdhanRef.current = null;
                    }
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlaying(false);
                  }
                  setAudioType(e.target.value as 'adhan' | 'quran');
                }}
                className="bg-slate-900 border border-emerald-800 text-amber-300 rounded-xl px-2.5 py-1.5 text-xs font-serif font-bold cursor-pointer hover:border-amber-400 focus:outline-none"
              >
                <option value="adhan">🕌 صوت الأذان الشرعي</option>
                <option value="quran">📖 تلاوة القرآن الكريم</option>
              </select>

              <button
                onClick={handleSingleAudioToggle}
                className={`px-3.5 py-1.5 rounded-xl font-bold font-serif text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md border ${
                  isPlaying
                    ? isMuted
                      ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300'
                }`}
                title="زر واحد لتشغيل وكتم الصوت"
              >
                {!isPlaying ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    <span>تشغيل {audioType === 'adhan' ? 'الأذان' : 'التلاوة'}</span>
                  </>
                ) : isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white" />
                    <span>إلغاء الكتم</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                    <span>كتم الصوت</span>
                  </>
                )}
              </button>

              {audioType === 'quran' && (
                <div className="hidden sm:flex flex-col items-center min-w-[80px] px-1 text-[10px] font-mono text-amber-300">
                  <span>
                    {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
                  </span>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-xl transition cursor-pointer border flex items-center gap-1 ${
                  showSettings
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 border-emerald-800 text-amber-300 hover:bg-slate-800'
                }`}
                title="إعدادات الصوت"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[10px] font-serif hidden md:inline">الإعدادات</span>
              </button>

              {showSettings && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 w-72 bg-slate-950 border border-amber-500/50 rounded-2xl p-4 shadow-2xl space-y-3 font-serif text-xs text-slate-200">
                  <div className="flex items-center justify-between border-b border-emerald-900/80 pb-2">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-amber-400" />
                      إعدادات التحكم في الصوت
                    </span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-amber-300 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>مستوى الصوت:</span>
                      <span className="text-amber-300 font-bold">{Math.round(audioVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioVolume}
                      onChange={(e) => {
                        setAudioVolume(parseFloat(e.target.value));
                        if (parseFloat(e.target.value) > 0) setIsMuted(false);
                      }}
                      className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px]">سرعة التلاوة:</div>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                            playbackSpeed === speed
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-900 border-emerald-900 text-slate-300 hover:text-amber-300'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px]">تكرار السورة تلقائياً:</span>
                    <button
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 ${
                        isRepeat
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-900 text-slate-400 border-emerald-900/80 hover:text-amber-300'
                      }`}
                    >
                      <Repeat className="w-3 h-3" />
                      <span>{isRepeat ? 'مُفعل' : 'مُعطل'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-900/50">
                    <span className="text-[11px]">جودة الصوت:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setAudioBitrate('128')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          audioBitrate === '128'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-emerald-900'
                        }`}
                      >
                        عالية (128k)
                      </button>
                      <button
                        onClick={() => setAudioBitrate('64')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          audioBitrate === '64'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-emerald-900'
                        }`}
                      >
                        اقتصادية (64k)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reciter Selector */}
            <div className="w-full lg:w-auto flex items-center gap-2">
              <label className="text-xs text-amber-300 font-serif font-bold whitespace-nowrap">
                القارئ:
              </label>
              <select
                value={reciter}
                onChange={(e) => setReciter(e.target.value)}
                className="w-full sm:w-56 bg-slate-950 border border-emerald-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-serif cursor-pointer"
              >
                <option value="ar.alafasy">مشاري بن راشد العفاسي</option>
                <option value="ar.abdulbasitmurattal">عبد الباسط عبد الصمد (مرتل)</option>
                <option value="ar.minshawi">محمد صديق المنشاوي</option>
                <option value="ar.alhusary">محمود خليل الحصري</option>
                <option value="ar.shaatree">أبو بكر الشاطري</option>
                <option value="ar.sudais">عبد الرحمن السدسي</option>
                <option value="ar.ghamadi">سعد الغامدي</option>
              </select>
            </div>

          </div>

          {quranLoading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-serif flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>جاري تحميل الآيات المباركة...</span>
            </div>
          ) : surahDetail ? (
            <div className="space-y-6">
              <div className="text-center py-2 bg-slate-950/60 rounded-xl border border-emerald-900/40">
                <h3 className="text-2xl font-bold text-amber-200 font-serif">
                  سورة {surahDetail.name}
                </h3>
                <p className="text-xs text-emerald-400 font-serif mt-1">
                  {surahDetail.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} – عدد آياتها {surahDetail.numberOfAyahs}
                </p>
                {surahDetail.number !== 9 && (
                  <div className="text-sm font-serif text-amber-300/90 pt-3">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
              </div>

              <div className="bg-slate-950 border border-emerald-900/80 rounded-2xl p-6 sm:p-8 font-serif leading-loose text-base sm:text-xl text-slate-100 text-justify space-y-4 shadow-inner">
                {surahDetail.ayahs?.map((ayah: any) => (
                  <span key={ayah.number} className="inline group hover:text-amber-300 transition">
                    {ayah.text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '')}{' '}
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950 text-amber-400 border border-amber-500/40 text-xs font-bold font-mono mx-1">
                      {ayah.numberInSurah}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

        </div>
      )}

      {/* 2. PRAYER TIMES & QIBLA TAB */}
      {activeTab === 'prayers' && (
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-serif">
                مواقيت الصلاة حسب بلده وتوقيته المحلي
              </h3>
              <p className="text-xs text-emerald-400 font-serif">
                التاريخ الهجري الحالي: {prayerTimes.dateHijri} | البلد: {prayerTimes.country || 'مصر'} ({prayerTimes.city})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300 font-serif">اختر المدينة:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-slate-950 border border-emerald-800 rounded-xl p-2 text-xs text-amber-300 font-bold font-serif"
              >
                <option value="Cairo">القاهرة (مصر)</option>
                <option value="Makkah">مكة المكرمة (السعودية)</option>
                <option value="Riyadh">الرياض (السعودية)</option>
                <option value="Dubai">دبي (الإمارات)</option>
                <option value="Amman">عمّان (الأردن)</option>
                <option value="Kuwait">الكويت</option>
                <option value="Baghdad">بغداد (العراق)</option>
                <option value="Casablanca">الدار البيضاء (المغرب)</option>
                <option value="Muscat">مسقط (عُمان)</option>
                <option value="Doha">الدوحة (قطر)</option>
                <option value="London">لندن (المملكة المتحدة)</option>
                <option value="New York">نيويورك (الولايات المتحدة)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 border border-emerald-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>التنبيه التلقائي للصلاة:</strong> يقوم الموقع بالأذان تلقائياً بصوت شيخ هادئ فور حلول وقت الصلاة.</span>
            </div>
            <span className="text-emerald-400 font-bold shrink-0">مفعل تلقائياً 🕌</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'الفجر', time: prayerTimes.Fajr },
              { name: 'الشروق', time: prayerTimes.Sunrise },
              { name: 'الظهر', time: prayerTimes.Dhuhr },
              { name: 'العصر', time: prayerTimes.Asr },
              { name: 'المغرب', time: prayerTimes.Maghrib },
              { name: 'العشاء', time: prayerTimes.Isha },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-emerald-900 p-4 rounded-2xl text-center space-y-1 hover:border-amber-400/60 transition"
              >
                <span className="text-xs text-slate-400 font-serif block">{p.name}</span>
                <strong className="text-lg font-extrabold text-amber-300 font-mono block">
                  {formatTo12Hour(p.time)}
                </strong>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl p-6 text-center max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-serif font-bold text-sm">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>اتجاه القبلة نحو الكعبة المشرفة: {prayerTimes.qiblaDegrees}°</span>
            </div>

            <div className="w-32 h-32 rounded-full border-4 border-emerald-800/60 mx-auto relative flex items-center justify-center bg-slate-900 shadow-inner">
              <div
                className="w-1 h-14 bg-gradient-to-t from-amber-500 to-emerald-400 rounded-full origin-bottom transition-transform duration-700"
                style={{ transform: `rotate(${prayerTimes.qiblaDegrees}deg)` }}
              />
              <div className="w-4 h-4 bg-amber-400 rounded-full shadow-lg z-10" />
            </div>

            <p className="text-[11px] text-slate-400 font-serif">
              * بوصلة حقيقية موجهة تلقائياً نحو القبلة في مكة المكرمة.
            </p>
          </div>

        </div>
      )}

      {/* 3. ADHKAR & DIGITAL MISBAHA WITH 1000 TASBEEH FREE DREAM REWARD */}
      {activeTab === 'adhkar' && (
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          
          {/* 1000 TASBEEH REWARD CELEBRATION MODAL */}
          {showTasbeehBonusModal && (
            <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in dir-rtl" dir="rtl">
              <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                  <Gift className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-amber-300 font-serif">
                    🎉 هنيئاً لك! أتممت 1,000 تسبيحة مباركة!
                  </h3>
                  <p className="text-sm text-slate-200 font-serif leading-relaxed">
                    تقبل الله طاعتك وذكرك العاطر! بفضل تسبيحك الدائم، تم فتح وربح <strong className="text-amber-400">1 حلم مفسر مجاني 🎁</strong> في ملفك الشخصي الروحاني!
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-200 font-serif space-y-1">
                  <div className="font-bold text-emerald-400 text-sm">رصيد أحلامك المجانية المكتسبة:</div>
                  <div>تم إضافة الرصيد تلقائياً إلى حسابك، يمكنك الآن استخدامه فوراً لتفسير أي رؤيا في المنصة.</div>
                </div>

                <button
                  onClick={() => setShowTasbeehBonusModal(false)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-serif px-6 py-3.5 rounded-2xl shadow-xl transition cursor-pointer border border-amber-300"
                >
                  استلام المكافأة والعودة للذكر 📿
                </button>
              </div>
            </div>
          )}

          {/* Sub-tabs */}
          <div className="flex items-center justify-center gap-2 border-b border-emerald-900/60 pb-4 text-xs font-serif">
            <button
              onClick={() => setDhikrCategory('sabah')}
              className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition ${
                dhikrCategory === 'sabah' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:text-amber-300'
              }`}
            >
              ☀️ أذكار الصباح
            </button>
            <button
              onClick={() => setDhikrCategory('masaa')}
              className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition ${
                dhikrCategory === 'masaa' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:text-amber-300'
              }`}
            >
              🌙 أذكار المساء
            </button>
            <button
              onClick={() => setDhikrCategory('sleep')}
              className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition ${
                dhikrCategory === 'sleep' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:text-amber-300'
              }`}
            >
              🛌 أذكار النوم
            </button>
          </div>

          {/* Digital Misbaha Widget (With 1000 Tasbeeh Free Dream Progress) */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3.5 py-1 rounded-full text-xs font-bold font-serif">
              <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>مكافأة التسبيح: كل 1,000 تسبيحة تفتح لك حلم مفسر مجاني 🎁</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-amber-300/80 font-serif block font-bold">
                📿 العداد الإلكتروني للتسبيح الألفي
              </span>
              <p className="text-base sm:text-lg font-serif text-slate-100 font-bold">
                "{misbahaPhrase}"
              </p>
            </div>

            {/* Main Animated Bead Button */}
            <div
              onClick={() => incrementMisbaha(1)}
              className="w-36 h-36 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 flex flex-col items-center justify-center mx-auto cursor-pointer active:scale-95 transition-all duration-150 shadow-2xl shadow-amber-950/80 relative group hover:border-amber-300"
            >
              <div className="absolute inset-0 rounded-full bg-amber-400/10 group-hover:bg-amber-400/20 transition rounded-full" />
              <span className="text-4xl font-extrabold text-amber-300 font-mono tracking-wider drop-shadow-md">
                {misbahaCount}
              </span>
              <span className="text-[11px] text-slate-400 font-serif mt-1 font-bold group-hover:text-amber-200">
                انقر للتسبيح ✨
              </span>
            </div>

            {/* Quick Count Adders (+10, +33, +100) */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {[
                { label: '+10', add: 10 },
                { label: '+33 (تسبيحة كاملة)', add: 33 },
                { label: '+100', add: 100 },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => incrementMisbaha(btn.add)}
                  className="bg-slate-900 hover:bg-emerald-900 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* 1000 Progress Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-900 space-y-2 text-right">
              <div className="flex justify-between items-center text-xs font-serif">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  التقدم نحو الحلم المجاني القادم:
                </span>
                <span className="text-amber-300 font-bold font-mono">
                  {misbahaCount % 1000} / 1000 تسبيحة
                </span>
              </div>

              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-emerald-900">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((misbahaCount % 1000) / 1000) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-serif pt-1">
                <span>المتبقي: {1000 - (misbahaCount % 1000)} تسبيحة للحصول على المكافأة</span>
                <span className="text-emerald-400 font-bold">
                  إجمالي المكافآت المحققة: {Math.floor(misbahaCount / 1000)} حلم مجاني
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('هل أنت تأكد من تصفير عداد التسبيح؟')) {
                  setMisbahaCount(0);
                  localStorage.setItem('explaining_dreams_misbaha_count_2026', '0');
                }
              }}
              className="text-xs text-slate-500 hover:text-amber-400 underline font-serif cursor-pointer block mx-auto"
            >
              تصفير العداد
            </button>
          </div>

          {/* Adhkar Items Cards */}
          <div className="grid grid-cols-1 gap-4">
            {adhkarItems
              .filter((item) => item.category === dhikrCategory)
              .map((dhikr) => (
                <div
                  key={dhikr.id}
                  onClick={() => handleDhikrClick(dhikr.id)}
                  className="bg-slate-950 border border-emerald-900 p-5 rounded-2xl space-y-3 cursor-pointer hover:border-amber-400/50 transition relative"
                >
                  <p className="text-sm sm:text-base text-slate-100 font-serif leading-relaxed">
                    {dhikr.text}
                  </p>

                  <div className="flex items-center justify-between text-xs border-t border-emerald-900/40 pt-3">
                    <span className="text-emerald-400 font-serif">{dhikr.benefit}</span>

                    <span className="bg-emerald-900 text-amber-300 border border-emerald-700 px-3 py-1 rounded-full font-mono font-bold">
                      {dhikr.currentCount} / {dhikr.count}
                    </span>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* 4. ASMA ALLAH AL-HUSNA 99 NAMES & SPIRITUAL EXPLANATION TAB */}
      {(activeTab === 'asma' || activeTab === 'adhkar') && (
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-emerald-900/60 pb-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold font-serif">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>موسوعة أسماء الله الحسنى الـ 99 الروحية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
              أسماء الله الحسنى الـ 99 وشرحها وتأويلها الروحي
            </h3>
            <p className="text-xs text-slate-300 font-serif">
              "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا" – استكشف معاني الأسماء الجليلة وفضل الذكر والدعاء بها في قضاء الحاجات ونور الأحلام.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={asmaSearch}
                onChange={(e) => setAsmaSearch(e.target.value)}
                placeholder="ابحث باسم من أسماء الله الحسنى..."
                className="w-full bg-slate-950 border border-emerald-800 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-100 placeholder-slate-500 font-serif focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-xs font-serif">
              {[
                { id: 'all', label: 'جميع الأسماء (99)' },
                { id: 'رحمة ولطف', label: 'الرحمة واللطف' },
                { id: 'عظمة وقدرة', label: 'العظمة والقدرة' },
                { id: 'علم وحكمة', label: 'العلم والحكمة' },
                { id: 'رزق وحفظ', label: 'الرزق والحفظ' },
                { id: 'إحسان وجود', label: 'الإحسان والجود' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setAsmaCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition cursor-pointer ${
                    asmaCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-emerald-900 text-slate-300 hover:text-amber-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* 99 Names Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredAsmaAllah.map((item) => (
              <div
                key={item.number}
                onClick={() => setSelectedAsmaModal(item)}
                className="bg-slate-950 border border-emerald-900 hover:border-amber-400/80 p-4 rounded-2xl text-center space-y-2 cursor-pointer transition transform hover:-translate-y-1 shadow-lg group relative"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center mx-auto">
                  {item.number}
                </div>

                <strong className="text-lg font-bold text-amber-300 font-serif block group-hover:text-amber-200">
                  {item.name}
                </strong>

                <p className="text-[11px] text-slate-300 font-serif line-clamp-2 leading-tight">
                  {item.meaning}
                </p>

                <div className="pt-1 border-t border-emerald-950 text-[10px] text-emerald-400 font-serif font-bold flex items-center justify-center gap-1">
                  <span>تفاصيل الاسم الشاملة</span>
                  <span>←</span>
                </div>
              </div>
            ))}
          </div>

          {/* Single Asma Allah Detailed Modal */}
          {selectedAsmaModal && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl" dir="rtl">
              <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 space-y-6 text-right shadow-2xl">
                
                <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-amber-300 rounded-full font-mono text-xs font-bold">
                      الاسم رقم #{selectedAsmaModal.number}
                    </span>
                    <span className="px-3 py-1 bg-amber-950 border border-amber-800 text-amber-300 rounded-full font-serif text-xs font-bold">
                      {selectedAsmaModal.category}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedAsmaModal(null)}
                    className="p-1 rounded-xl bg-slate-950 text-slate-400 hover:text-amber-300 border border-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-2 bg-slate-950 p-6 rounded-2xl border border-amber-500/40">
                  <h3 className="text-3xl font-extrabold text-amber-300 font-serif">
                    {selectedAsmaModal.name}
                  </h3>
                  <p className="text-sm font-serif text-slate-200 leading-relaxed">
                    {selectedAsmaModal.meaning}
                  </p>
                </div>

                <div className="bg-emerald-950/50 border border-emerald-800 p-4 rounded-2xl space-y-1 text-xs">
                  <h4 className="font-bold text-emerald-300 font-serif flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>فضل الذكر والأثر الروحي لهذا الاسم المبارك:</span>
                  </h4>
                  <p className="text-slate-200 font-serif leading-relaxed">
                    {selectedAsmaModal.spiritualVirtue}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMisbahaPhrase(`يا ${selectedAsmaModal.name.replace(/[^\u0621-\u064A]/g, '')} ارحمني واغفر لي`);
                      setSelectedAsmaModal(null);
                      setActiveTab('adhkar');
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold font-serif text-xs px-4 py-3 rounded-2xl shadow-lg hover:from-amber-400 cursor-pointer border border-amber-300"
                  >
                    📿 سبّح بهذا الاسم في العداد الرقمي
                  </button>

                  <button
                    onClick={() => setSelectedAsmaModal(null)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-4 py-3 rounded-2xl text-xs font-bold font-serif cursor-pointer border border-slate-800"
                  >
                    إغلاق
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. ZAKAT TAB */}
      {activeTab === 'zakat' && (
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-2xl mx-auto">
          
          <h3 className="text-xl font-bold text-slate-100 font-serif text-center">
            حاسبة الزكاة الشرعية الإلكترونية
          </h3>

          <div className="space-y-4 text-xs font-serif">
            <div>
              <label className="block text-slate-300 font-medium mb-1">السيولة النقدية والمدخرات ($ USD):</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-400 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">وزن الذهب المملوك بالجرام (غرام):</label>
              <input
                type="number"
                value={goldGrams}
                onChange={(e) => setGoldGrams(Number(e.target.value))}
                className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-400 text-sm font-mono"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-900 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>حد النصاب الشرعي (85 غرام ذهب):</span>
                <span className="font-bold text-amber-300 font-mono">${zakatResult.nisabValue} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>مجموع ثروتك المحسوبة:</span>
                <span className="font-bold text-slate-100 font-mono">${zakatResult.totalWealth} USD</span>
              </div>
              <div className="border-t border-emerald-900 pt-2 flex justify-between items-center text-sm">
                <span className="font-bold text-amber-400">مقدار الزكاة الواجب إخراجها (2.5%):</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ${zakatResult.zakatDue.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
