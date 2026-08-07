import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Volume2, VolumeX } from 'lucide-react';
import { NewsTicker } from './NewsTicker';
import {
  playDoveCooingSound,
  playCalmAdhanSound,
  stopAdhanSound,
  detectUserLocationByTimezone,
  fetchPrayerTimesForCity,
  formatTo12Hour,
  PrayerTimesData,
} from '../utils/spiritualAudioEngine';

interface AudioPrayerControllerProps {
  onOpenIslamicTools?: () => void;
  onNewsClick?: () => void;
}

export const AudioPrayerController: React.FC<AudioPrayerControllerProps> = ({ onNewsClick }) => {
  // Dove sound states
  const [doveHasPlayed, setDoveHasPlayed] = useState(false);

  // Adhan states
  const [adhanAutoEnabled] = useState(true);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [adhanPrayerName, setAdhanPrayerName] = useState<string | null>(null);

  // Location & Prayer Times state
  const [locationInfo, setLocationInfo] = useState({ city: 'Cairo', country: 'مصر', timezone: 'Africa/Cairo' });
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; timeStr: string; minutesLeft: number } | null>(null);

  // Auto play natural dove cooing sound on initial page entry / first interaction automatically
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!doveHasPlayed) {
        setDoveHasPlayed(true);
        // Gentle soft dove cooing sound automatically in background
        playDoveCooingSound(0.12);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('mousemove', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('mousemove', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [doveHasPlayed]);

  // Detect user location & fetch prayer times on mount
  useEffect(() => {
    const loc = detectUserLocationByTimezone();
    setLocationInfo(loc);

    fetchPrayerTimesForCity(loc.city).then((data) => {
      setPrayerData(data);
    });
  }, []);

  // Calculate Next Prayer & check Adhan schedule every 30 seconds
  useEffect(() => {
    if (!prayerData) return;

    const interval = setInterval(() => {
      checkNextPrayerAndScheduleAdhan(prayerData);
    }, 30000);

    checkNextPrayerAndScheduleAdhan(prayerData);

    return () => clearInterval(interval);
  }, [prayerData, adhanAutoEnabled]);

  const checkNextPrayerAndScheduleAdhan = (data: PrayerTimesData) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const nowInMinutes = currentHours * 60 + currentMinutes;

    const prayers = [
      { name: 'الفجر', timeStr: data.Fajr },
      { name: 'الظهر', timeStr: data.Dhuhr },
      { name: 'العصر', timeStr: data.Asr },
      { name: 'المغرب', timeStr: data.Maghrib },
      { name: 'العشاء', timeStr: data.Isha },
    ];

    let foundNext = null;

    for (const p of prayers) {
      const [h, m] = p.timeStr.split(':').map(Number);
      const pInMinutes = h * 60 + m;

      // Check if current minute matches prayer time exactly for Adhan trigger
      if (nowInMinutes === pInMinutes && adhanAutoEnabled && !isAdhanPlaying) {
        triggerAdhan(p.name);
      }

      if (pInMinutes > nowInMinutes && !foundNext) {
        foundNext = {
          name: p.name,
          timeStr: p.timeStr,
          minutesLeft: pInMinutes - nowInMinutes,
        };
      }
    }

    // If all prayers today passed, next is Fajr tomorrow
    if (!foundNext) {
      const [h, m] = data.Fajr.split(':').map(Number);
      const fajrTomorrow = 24 * 60 + h * 60 + m;
      foundNext = {
        name: 'الفجر',
        timeStr: data.Fajr,
        minutesLeft: fajrTomorrow - nowInMinutes,
      };
    }

    setNextPrayerInfo(foundNext);
  };

  const triggerAdhan = (prayerName?: string) => {
    if (isAdhanPlaying) {
      stopAdhanSound();
      setIsAdhanPlaying(false);
      setAdhanPrayerName(null);
      return;
    }

    setIsAdhanPlaying(true);
    setAdhanPrayerName(prayerName || 'تنبيه الأذان');
    playCalmAdhanSound(() => {
      setIsAdhanPlaying(false);
      setAdhanPrayerName(null);
    });
  };

  return (
    <>
      <div className="bg-slate-950 border-b border-amber-500/30 py-1.5 px-3 text-xs text-slate-300 font-serif">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Right (RTL): Location & Prayer Times Info & Adhan Button */}
          <div className="w-full md:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap shrink-0 py-0.5 scrollbar-none">
            <div className="flex items-center gap-1 text-emerald-400 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs whitespace-nowrap">
                <strong className="text-amber-300">{locationInfo.country} ({locationInfo.city})</strong>
              </span>
            </div>

            {nextPrayerInfo && (
              <div className="flex items-center gap-1 text-slate-300 border-r border-emerald-900/60 pr-2 sm:pr-3 pl-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs whitespace-nowrap">
                  الصلاة القادمة: <strong className="text-amber-300 font-bold">{nextPrayerInfo.name}</strong> ({formatTo12Hour(nextPrayerInfo.timeStr)}) — <span className="text-emerald-400 font-mono">{nextPrayerInfo.minutesLeft} دقيقة</span>
                </span>
              </div>
            )}

            {/* Direct Single Adhan MP3 Trigger Button - aligned inline */}
            <div className="flex items-center border-r border-emerald-900/60 pr-2 sm:pr-3 shrink-0">
              <button
                onClick={() => triggerAdhan()}
                className={`flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer border shadow-sm whitespace-nowrap leading-tight ${
                  isAdhanPlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-emerald-950/90 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-slate-900'
                }`}
                title={isAdhanPlaying ? 'إيقاف تشغيل الأذان' : 'تشغيل أذان الصلاة المباشر'}
              >
                {isAdhanPlaying ? (
                  <>
                    <VolumeX className="w-3 h-3 text-slate-950 shrink-0" />
                    <span>إيقاف الأذان 🔊</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>أذان الصلاة 🔊</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Extended News & Reviews Ticker Bar (أخبار وتقييمات) */}
          <div className="w-full md:w-auto flex-1 flex justify-center md:justify-end">
            <NewsTicker onClick={onNewsClick} />
          </div>
        </div>
      </div>
    </>
  );
};


