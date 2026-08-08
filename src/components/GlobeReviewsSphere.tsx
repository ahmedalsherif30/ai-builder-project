import React, { useRef, useEffect, useState } from 'react';
import { TestimonialReview } from './ClientReviewsSection';
import { Globe, RotateCw, Pause, Play, Sparkles, Star, CheckCircle2, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

interface GlobeReviewsSphereProps {
  reviews: TestimonialReview[];
  onSelectReview: (review: TestimonialReview) => void;
}

// Country coordinates
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'sa': { lat: 23.8849, lng: 45.0792 },
  'eg': { lat: 26.8206, lng: 30.8025 },
  'iq': { lat: 33.2232, lng: 43.6793 },
  'kw': { lat: 29.3117, lng: 47.4818 },
  'ae': { lat: 23.4241, lng: 53.8478 },
  'jo': { lat: 30.5852, lng: 36.2384 },
  'ps': { lat: 31.9522, lng: 35.2332 },
  'dz': { lat: 28.0339, lng: 1.6596 },
  'bh': { lat: 26.0667, lng: 50.5577 },
  'om': { lat: 21.5126, lng: 55.9233 },
  'qa': { lat: 25.3548, lng: 51.1839 },
  'ma': { lat: 31.7917, lng: -7.0926 },
  'tn': { lat: 33.8869, lng: 9.5375 },
  'sd': { lat: 12.8628, lng: 30.2176 },
};

function getReviewCoords(countryCode: string, index: number) {
  const base = COUNTRY_COORDS[countryCode.toLowerCase()] || { lat: 24, lng: 40 };
  const offsetAngle = (index * 137.5 * Math.PI) / 180;
  const radius = (index % 3) * 1.8;
  return {
    lat: base.lat + Math.sin(offsetAngle) * radius,
    lng: base.lng + Math.cos(offsetAngle) * radius,
  };
}

export const GlobeReviewsSphere: React.FC<GlobeReviewsSphereProps> = ({ reviews, onSelectReview }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotation angles & physics
  const rotYRef = useRef<number>(0.8);
  const rotXRef = useRef<number>(0.25);
  const velYRef = useRef<number>(0.0035);
  const velXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);

  // Filter reviews based on country selector
  const activeReviews = selectedCountry === 'all'
    ? reviews
    : reviews.filter((r) => r.countryCode === selectedCountry);

  const activeReview = activeReviews[activeReviewIndex % Math.max(1, activeReviews.length)] || reviews[0];

  const projectedNodesRef = useRef<
    Array<{
      review: TestimonialReview;
      screenX: number;
      screenY: number;
      z: number;
      radius: number;
      isFront: boolean;
      alpha: number;
    }>
  >([]);

  // Unique countries list
  const countries = Array.from(new Set(reviews.map((r) => r.countryCode))).map((code) => {
    const found = reviews.find((r) => r.countryCode === code);
    return {
      code,
      name: found?.country || code,
      flag: found?.flag || '🌍',
      count: reviews.filter((r) => r.countryCode === code).length,
    };
  });

  // Pointer interactions for 3D Globe Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    velYRef.current = 0;
    velXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    const sensitivity = 0.006;
    rotYRef.current += dx * sensitivity;
    rotXRef.current += dy * sensitivity;
    rotXRef.current = Math.max(-1.2, Math.min(1.2, rotXRef.current));
    velYRef.current = dx * sensitivity * 0.4;
    velXRef.current = dy * sensitivity * 0.4;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetCamera = () => {
    rotYRef.current = 0.8;
    rotXRef.current = 0.25;
    velYRef.current = 0.0035;
    velXRef.current = 0;
    setIsAutoRotating(true);
  };

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const width = 280;
    const height = 280;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let pulseTimer = 0;

    const render = () => {
      pulseTimer += 0.04;
      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = 105;

      ctx.clearRect(0, 0, width, height);

      if (!isDraggingRef.current) {
        if (isAutoRotating) {
          rotYRef.current += velYRef.current || 0.0035;
        } else {
          rotYRef.current += velYRef.current;
          rotXRef.current += velXRef.current;
          velYRef.current *= 0.94;
          velXRef.current *= 0.94;
        }
      }

      // Atmospheric Glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, globeRadius * 1.2);
      bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      bgGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.1)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Outer Ring
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Glassy Fill
      const sphereFill = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, globeRadius);
      sphereFill.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      sphereFill.addColorStop(0.7, 'rgba(6, 78, 59, 0.5)');
      sphereFill.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = sphereFill;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Grid Latitudes & Longitudes
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
      ctx.lineWidth = 0.8;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 15) {
          const phi = (lat * Math.PI) / 180;
          const lambda = (lng * Math.PI) / 180 + rotYRef.current;

          let x1 = globeRadius * Math.cos(phi) * Math.sin(lambda);
          let y1 = -globeRadius * Math.sin(phi);
          let z1 = globeRadius * Math.cos(phi) * Math.cos(lambda);

          let y2 = y1 * Math.cos(rotXRef.current) - z1 * Math.sin(rotXRef.current);
          let z2 = y1 * Math.sin(rotXRef.current) + z1 * Math.cos(rotXRef.current);

          if (z2 > 0) {
            const sx = cx + x1;
            const sy = cy + y2;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitudes
      for (let lng = -180; lng < 180; lng += 45) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 15) {
          const phi = (lat * Math.PI) / 180;
          const lambda = (lng * Math.PI) / 180 + rotYRef.current;

          let x1 = globeRadius * Math.cos(phi) * Math.sin(lambda);
          let y1 = -globeRadius * Math.sin(phi);
          let z1 = globeRadius * Math.cos(phi) * Math.cos(lambda);

          let y2 = y1 * Math.cos(rotXRef.current) - z1 * Math.sin(rotXRef.current);
          let z2 = y1 * Math.sin(rotXRef.current) + z1 * Math.cos(rotXRef.current);

          if (z2 > 0) {
            const sx = cx + x1;
            const sy = cy + y2;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Project Review Nodes
      const projectedNodes: Array<{
        review: TestimonialReview;
        screenX: number;
        screenY: number;
        z: number;
        radius: number;
        isFront: boolean;
        alpha: number;
      }> = [];

      reviews.forEach((rev, idx) => {
        const { lat, lng } = getReviewCoords(rev.countryCode, idx);
        const phi = (lat * Math.PI) / 180;
        const lambda = (lng * Math.PI) / 180 + rotYRef.current;

        let x1 = globeRadius * Math.cos(phi) * Math.sin(lambda);
        let y1 = -globeRadius * Math.sin(phi);
        let z1 = globeRadius * Math.cos(phi) * Math.cos(lambda);

        let y2 = y1 * Math.cos(rotXRef.current) - z1 * Math.sin(rotXRef.current);
        let z2 = y1 * Math.sin(rotXRef.current) + z1 * Math.cos(rotXRef.current);

        const screenX = cx + x1;
        const screenY = cy + y2;

        const isFront = z2 > -globeRadius * 0.1;
        const depthFactor = (z2 + globeRadius) / (2 * globeRadius);
        const alpha = Math.max(0.15, Math.min(1, depthFactor));
        const radius = isFront ? 4 + depthFactor * 4 : 2;

        projectedNodes.push({
          review: rev,
          screenX,
          screenY,
          z: z2,
          radius,
          isFront,
          alpha,
        });
      });

      projectedNodes.sort((a, b) => a.z - b.z);
      projectedNodesRef.current = projectedNodes;

      // Draw Nodes
      projectedNodes.forEach((node) => {
        if (!node.isFront) {
          ctx.fillStyle = `rgba(217, 119, 6, ${node.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, node.radius, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        const isCurrentActive = activeReview?.id === node.review.id;
        const pulse = Math.sin(pulseTimer + node.screenX * 0.1) * 1.5;

        // Glow Aura
        const auraRadius = (node.radius + 4 + pulse) * (isCurrentActive ? 1.8 : 1);
        const auraGrad = ctx.createRadialGradient(
          node.screenX,
          node.screenY,
          1,
          node.screenX,
          node.screenY,
          auraRadius
        );
        if (isCurrentActive) {
          auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.95)');
          auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        } else if (node.review.isFulfilled) {
          auraGrad.addColorStop(0, 'rgba(52, 211, 153, 0.85)');
          auraGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else {
          auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
          auraGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
        }

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Center
        ctx.fillStyle = isCurrentActive ? '#f59e0b' : node.review.isFulfilled ? '#10b981' : '#fbbf24';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isCurrentActive ? 2 : 1;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, node.radius + (isCurrentActive ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [reviews, isAutoRotating, activeReview]);

  // Click on Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (const node of projectedNodesRef.current) {
      if (!node.isFront) continue;
      const dist = Math.hypot(node.screenX - clickX, node.screenY - clickY);
      if (dist <= node.radius + 10) {
        onSelectReview(node.review);
        // Find index in activeReviews
        const idx = activeReviews.findIndex((r) => r.id === node.review.id);
        if (idx !== -1) setActiveReviewIndex(idx);
        break;
      }
    }
  };

  return (
    <div className="relative bg-slate-950/90 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden my-6 max-w-6xl mx-auto" dir="rtl">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Globe className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-200 font-serif">
              مستكشف التقييمات التفاعلي 3D حسب الدول
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              حرك الكرة بالماوس أو اختار الدولة لعرض التقييمات الموثقة
            </p>
          </div>
        </div>

        {/* Rotate Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold font-serif flex items-center gap-1 transition cursor-pointer shadow ${
              isAutoRotating
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoRotating ? 'إيقاف' : 'دوران'}</span>
          </button>
          <button
            onClick={resetCamera}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-800/80 text-emerald-300 rounded-xl transition cursor-pointer shadow"
            title="إعادة ضبط"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: 3D Globe + Review Spotlight + Country Filter */}
      <div className="relative z-10 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Left/Center: Compact 3D Globe Canvas (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative bg-slate-900/60 border border-slate-800 rounded-2xl p-3 backdrop-blur-md">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={handleCanvasClick}
            className="touch-none select-none rounded-2xl cursor-grab active:cursor-grabbing"
          />
          <span className="mt-1 text-[11px] text-amber-300/80 font-serif flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>اسحب بالماوس للتدوير • اضغط على أي نقطة مضيئة</span>
          </span>
        </div>

        {/* Right: Active Review Spotlight Card & Country Navigation (8 Columns) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Country Selection Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setSelectedCountry('all'); setActiveReviewIndex(0); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-serif transition shrink-0 cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              جميع الدول 🌍
            </button>
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => { setSelectedCountry(c.code); setActiveReviewIndex(0); }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold font-serif flex items-center gap-1 transition shrink-0 cursor-pointer ${
                  selectedCountry === c.code
                    ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.2 rounded-full text-amber-300">
                  {c.count}
                </span>
              </button>
            ))}
          </div>

          {/* Active Review Spotlight Showcase Card */}
          {activeReview && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/50 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-950 border border-amber-400/60 flex items-center justify-center text-amber-300 font-black text-lg shadow-md shrink-0">
                    {activeReview.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-amber-200 text-sm sm:text-base font-serif">
                        {activeReview.name}
                      </h4>
                      {activeReview.isFulfilled && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-serif flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>تعبير محقق</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mt-0.5">
                      <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{activeReview.flag} {activeReview.country}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono text-[11px]">{activeReview.handle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-amber-500/30 shrink-0">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-100 font-serif leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                "{activeReview.text}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20 font-serif font-bold">
                  🏷️ {activeReview.tag}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveReviewIndex((prev) => (prev > 0 ? prev - 1 : activeReviews.length - 1))}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer"
                    title="التقييم السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 font-sans font-bold">
                    {(activeReviewIndex % activeReviews.length) + 1} / {activeReviews.length}
                  </span>
                  <button
                    onClick={() => setActiveReviewIndex((prev) => (prev + 1) % activeReviews.length)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer"
                    title="التقييم التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectReview(activeReview)}
                    className="mr-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
