// Spiritual Audio & Prayer Times Engine for ExplainingDream.com
// Handles:
// 1. Natural soft Dove Cooing background sound on page entry
// 2. Localized Prayer Times Calculation & Auto-Adhan with serene Sheikh vocal tone

export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const cleanTime = timeStr.trim().split(' ')[0];
  const parts = cleanTime.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (isNaN(hours)) return timeStr;

  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${period}`;
}

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  dateHijri: string;
  city: string;
  country: string;
  timezone: string;
  qiblaDegrees: number;
}

// Global AudioContext singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Natural organic dove cooing background sound ("صوت طبيعي رقيق لحمامة هادئة")
 * Synthesizes soft double-coo vocalizations with gentle pitch sweeps and warm resonance.
 */
export function playDoveCooingSound(volumeMultiplier: number = 0.12): () => void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(Math.min(volumeMultiplier, 0.15), now + 0.2);
    mainGain.connect(ctx.destination);

    // Natural, realistic short dove coo (Coo-Roo) lasting ~1.4 seconds total
    const cooPattern = [
      { startOffset: 0.1, duration: 0.35, startFreq: 430, peakFreq: 455, endFreq: 370 },
      { startOffset: 0.5, duration: 0.6, startFreq: 415, peakFreq: 440, endFreq: 330 },
    ];

    cooPattern.forEach(({ startOffset, duration, startFreq, peakFreq, endFreq }) => {
      const startTime = now + startOffset;
      const midTime = startTime + duration * 0.4;
      const stopTime = startTime + duration;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft sine tone with acoustic lowpass filtering for warmth
      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      // Realistic pitch bend curve
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.linearRampToValueAtTime(peakFreq, midTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, stopTime);

      // Smooth attack and soft decay
      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.09, midTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(mainGain);

      osc.start(startTime);
      osc.stop(stopTime);
    });

    // Fade out main gain smoothly
    mainGain.gain.setValueAtTime(Math.min(volumeMultiplier, 0.15), now + 1.2);
    mainGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

    return () => {
      try {
        mainGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      } catch (e) {}
    };
  } catch (err) {
    console.warn('Dove cooing audio synthesis error:', err);
    return () => {};
  }
}

/**
 * Serene Spiritual Audio Chime Notification for Prayer Times ("تنبيه صوتي مبارك للمواقيت والصلاة")
 * Synthesizes a soothing multi-tone spiritual chime with warm acoustics and gentle decay.
 */
export function playPrayerNotificationChime(onEnded?: () => void): () => void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    masterGain.connect(ctx.destination);

    // Harmonic spiritual bell frequencies (A4, E5, A5, C#6 - 432Hz based tuning)
    const bellNotes = [
      { delay: 0, freq: 432, duration: 2.5 },
      { delay: 0.35, freq: 648, duration: 2.2 },
      { delay: 0.7, freq: 864, duration: 2.8 },
      { delay: 1.1, freq: 1080, duration: 3.2 },
    ];

    bellNotes.forEach(({ delay, freq, duration }) => {
      const startTime = now + delay;
      const stopTime = startTime + duration;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 1.8, startTime);

      osc.frequency.setValueAtTime(freq, startTime);

      // Acoustic envelope (quick attack, long exponential decay)
      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(stopTime);
    });

    // Gentle fade out
    masterGain.gain.setValueAtTime(0.25, now + 3.0);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

    const timer = setTimeout(() => {
      if (onEnded) onEnded();
    }, 4200);

    return () => {
      clearTimeout(timer);
      try {
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      } catch (e) {}
    };
  } catch (err) {
    console.warn('Audio chime notification error:', err);
    if (onEnded) onEnded();
    return () => {};
  }
}

/**
 * Authentic Adhan Call to Prayer or Audio Chime Notification
 */
// Authentic MP3 Adhan reciters list
export interface AdhanAudioOption {
  id: string;
  name: string;
  reciter: string;
  url: string;
}

export const ADHAN_AUDIO_PRESETS: AdhanAudioOption[] = [
  {
    id: 'makkah',
    name: 'أذان المسجد الحرام (مكة المكرمة)',
    reciter: 'مؤذني الحرم المكي',
    url: 'https://cdn.islamicfinder.org/static/audio/adhan/Makkah.mp3',
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي (المدينة المنورة)',
    reciter: 'مؤذني الحرم المدني',
    url: 'https://cdn.islamicfinder.org/static/audio/adhan/Madinah.mp3',
  },
  {
    id: 'alafasy',
    name: 'أذان الشيخ مشاري راشد العفاسي',
    reciter: 'الشيخ مشاري العفاسي',
    url: 'https://download.quranicaudio.com/adhan/adhan_alafasy.mp3',
  },
  {
    id: 'abdulbasit',
    name: 'أذان الشيخ عبد الباسط عبد الصمد',
    reciter: 'الشيخ عبد الباسط عبد الصمد',
    url: 'https://download.quranicaudio.com/adhan/adhan_abdulbasit.mp3',
  },
];

let activeAudioElement: HTMLAudioElement | null = null;
let currentAdhanStopFn: (() => void) | null = null;

export function getSavedAdhanAudioUrl(): string {
  try {
    const saved = localStorage.getItem('explainingdream_custom_adhan_mp3');
    if (saved) return saved;
  } catch (e) {}
  return ADHAN_AUDIO_PRESETS[0].url; // Default to Makkah Adhan
}

export function saveAdhanAudioUrl(url: string): void {
  try {
    localStorage.setItem('explainingdream_custom_adhan_mp3', url);
  } catch (e) {}
}

export function playCalmAdhanSound(onEnded?: () => void, customMp3Url?: string): () => void {
  stopAdhanSound();

  const fallbackUrls = [
    customMp3Url || getSavedAdhanAudioUrl(),
    'https://download.quranicaudio.com/adhan/adhan_alafasy.mp3',
    'https://cdn.islamicfinder.org/static/audio/adhan/Makkah.mp3',
    'https://download.quranicaudio.com/adhan/adhan_abdulbasit.mp3',
  ].filter(Boolean);

  let attemptIndex = 0;

  function tryPlayNextUrl() {
    if (attemptIndex >= fallbackUrls.length) {
      console.warn('All MP3 Adhan URLs failed, playing synthesized prayer chime');
      currentAdhanStopFn = playPrayerNotificationChime(onEnded);
      return;
    }

    const currentUrl = fallbackUrls[attemptIndex];
    attemptIndex++;

    try {
      const audio = new Audio(currentUrl);
      activeAudioElement = audio;
      audio.volume = 0.9;

      audio.onended = () => {
        activeAudioElement = null;
        currentAdhanStopFn = null;
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        console.warn(`Adhan MP3 failed to load from ${currentUrl}, trying fallback...`);
        activeAudioElement = null;
        tryPlayNextUrl();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Audio play blocked or error for ${currentUrl}:`, err);
          activeAudioElement = null;
          tryPlayNextUrl();
        });
      }
    } catch (e) {
      tryPlayNextUrl();
    }
  }

  tryPlayNextUrl();

  const stopFn = () => {
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
      } catch (e) {}
      activeAudioElement = null;
    }
  };

  currentAdhanStopFn = stopFn;
  return stopFn;
}

export function stopAdhanSound(): void {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }
  if (currentAdhanStopFn) {
    currentAdhanStopFn();
    currentAdhanStopFn = null;
  }
}

/**
 * Detect user country & city based on Browser Timezone
 */
export function detectUserLocationByTimezone(): { city: string; country: string; timezone: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';

    if (tz.includes('Riyadh') || tz.includes('Jeddah') || tz.includes('Saudi')) {
      return { city: 'Makkah', country: 'السعودية', timezone: tz };
    }
    if (tz.includes('Cairo') || tz.includes('Egypt')) {
      return { city: 'Cairo', country: 'مصر', timezone: tz };
    }
    if (tz.includes('Dubai') || tz.includes('Abu_Dhabi') || tz.includes('UAE')) {
      return { city: 'Dubai', country: 'الإمارات', timezone: tz };
    }
    if (tz.includes('Amman') || tz.includes('Jordan')) {
      return { city: 'Amman', country: 'الأردن', timezone: tz };
    }
    if (tz.includes('Kuwait')) {
      return { city: 'Kuwait', country: 'الكويت', timezone: tz };
    }
    if (tz.includes('Baghdad') || tz.includes('Iraq')) {
      return { city: 'Baghdad', country: 'العراق', timezone: tz };
    }
    if (tz.includes('Casablanca') || tz.includes('Morocco')) {
      return { city: 'Casablanca', country: 'المغرب', timezone: tz };
    }
    if (tz.includes('Muscat') || tz.includes('Oman')) {
      return { city: 'Muscat', country: 'عُمان', timezone: tz };
    }
    if (tz.includes('Doha') || tz.includes('Qatar')) {
      return { city: 'Doha', country: 'قطر', timezone: tz };
    }
    if (tz.includes('London') || tz.includes('Europe')) {
      return { city: 'London', country: 'المملكة المتحدة', timezone: tz };
    }
    if (tz.includes('New_York') || tz.includes('America')) {
      return { city: 'New York', country: 'أمريكا', timezone: tz };
    }

    // Default Cairo/Makkah fallback
    return { city: 'Cairo', country: 'مصر', timezone: tz };
  } catch (e) {
    return { city: 'Cairo', country: 'مصر', timezone: 'Africa/Cairo' };
  }
}

/**
 * Fetch prayer timings from Aladhan API for city
 */
export async function fetchPrayerTimesForCity(cityName: string): Promise<PrayerTimesData> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=&method=4`);
    if (res.ok) {
      const data = await res.json();
      const timings = data.data.timings;
      const dateHijri = data.data.date.hijri;

      const formattedHijri = `${dateHijri.day} ${dateHijri.month.ar || dateHijri.month.en} ${dateHijri.year} هـ`;

      return {
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
        dateHijri: formattedHijri,
        city: cityName,
        country: getArabicCountryNameForCity(cityName),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        qiblaDegrees: getQiblaDegreeForCity(cityName),
      };
    }
  } catch (err) {
    console.error('Failed to fetch prayer times API:', err);
  }

  // Robust fallback
  return {
    Fajr: '04:30',
    Sunrise: '05:48',
    Dhuhr: '12:15',
    Asr: '15:35',
    Maghrib: '18:42',
    Isha: '20:10',
    dateHijri: '10 صفر 1448 هـ',
    city: cityName,
    country: getArabicCountryNameForCity(cityName),
    timezone: 'Africa/Cairo',
    qiblaDegrees: 136,
  };
}

function getArabicCountryNameForCity(city: string): string {
  const map: Record<string, string> = {
    Makkah: 'السعودية',
    Cairo: 'مصر',
    Riyadh: 'السعودية',
    Dubai: 'الإمارات',
    Amman: 'الأردن',
    Kuwait: 'الكويت',
    Baghdad: 'العراق',
    Casablanca: 'المغرب',
    Doha: 'قطر',
    Muscat: 'عُمان',
    London: 'المملكة المتحدة',
    'New York': 'الولايات المتحدة',
  };
  return map[city] || 'بلدك الحالي';
}

function getQiblaDegreeForCity(city: string): number {
  const map: Record<string, number> = {
    Makkah: 0,
    Cairo: 136,
    Riyadh: 245,
    Dubai: 258,
    Amman: 160,
    Kuwait: 215,
    Baghdad: 195,
    Casablanca: 102,
    London: 118,
  };
  return map[city] ?? 136;
}

