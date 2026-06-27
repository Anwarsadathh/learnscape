'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X, Star, MapPin, Calendar, Building2, Award, BookOpen,
  GraduationCap, Scale, Check, IndianRupee, Plus,
  TrendingDown, TrendingUp,
} from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';

/* ── Keyframes ──────────────────────────────────────────────────── */
const KF = `
  @keyframes barGrow{from{width:0;opacity:0}to{width:var(--tw);opacity:1}}
  @keyframes shimmer{0%{transform:translateX(-130%)}100%{transform:translateX(250%)}}
  @keyframes cmpIn{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.35)}50%{box-shadow:0 0 0 5px rgba(52,211,153,0)}}
  @keyframes feeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes modalAurora{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes modalGlow{
    0%,100%{box-shadow:0 0 50px rgba(59,130,246,.25),0 0 100px rgba(139,92,246,.12),0 40px 90px -10px rgba(0,0,0,.8)}
    33%{box-shadow:0 0 50px rgba(6,182,212,.25),0 0 100px rgba(16,185,129,.12),0 40px 90px -10px rgba(0,0,0,.8)}
    66%{box-shadow:0 0 50px rgba(139,92,246,.25),0 0 100px rgba(236,72,153,.12),0 40px 90px -10px rgba(0,0,0,.8)}
  }
  @keyframes headerSpark{0%,100%{filter:drop-shadow(0 0 4px rgba(96,165,250,.9))}50%{filter:drop-shadow(0 0 9px rgba(192,132,252,.95))}}
  @keyframes sectionAura{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes ctaShimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes slotPulse{0%,100%{border-color:rgba(139,92,246,.3);background:rgba(139,92,246,.06)}50%{border-color:rgba(59,130,246,.45);background:rgba(59,130,246,.1)}}
  @keyframes accentPulse{0%,100%{opacity:1}50%{opacity:.55}}
  @keyframes iconRing{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,.4)}50%{box-shadow:0 0 0 6px rgba(139,92,246,0)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;

/* ── Types ─────────────────────────────────────────────────────── */
interface Course { name: string; level: string; duration: string; fees: string; seats?: number; entrance?: string; }
interface College {
  _id: string; name: string; image?: string;
  locations: string[]; streams: string[]; courses: Course[];
  rating?: number; positions: number; naac?: string;
  type?: string; established?: number;
  fees?: { min: number; max: number };
  accreditations?: string[]; highlights?: string[];
}
export interface CompareModalProps {
  isOpen: boolean; onClose: () => void;
  colleges: College[]; onRemove: (id: string) => void;
}

/* ── Dark Palettes ──────────────────────────────────────────────── */
const STREAM_COLORS: Record<string, { bg: string; color: string }> = {
  'Engineering':         { bg: 'rgba(59,130,246,.12)',  color: '#60a5fa' },
  'Medical Science':     { bg: 'rgba(239,68,68,.12)',   color: '#f87171' },
  'Management':          { bg: 'rgba(168,85,247,.12)',  color: '#c084fc' },
  'Commerce':            { bg: 'rgba(245,158,11,.12)',  color: '#fbbf24' },
  'Arts and Humanities': { bg: 'rgba(236,72,153,.12)',  color: '#f472b6' },
  'Paramedical':         { bg: 'rgba(20,184,166,.12)',  color: '#2dd4bf' },
  'Law':                 { bg: 'rgba(99,102,241,.12)',  color: '#818cf8' },
  'Design':              { bg: 'rgba(249,115,22,.12)',  color: '#fb923c' },
  'Science':             { bg: 'rgba(16,185,129,.12)',  color: '#34d399' },
  'Agriculture':         { bg: 'rgba(132,204,22,.12)',  color: '#a3e635' },
  'Dental':              { bg: 'rgba(14,165,233,.12)',  color: '#38bdf8' },
};

const NAAC_D: Record<string, { bg: string; color: string; border: string }> = {
  'A++': { bg: 'rgba(245,158,11,.14)', color: '#fcd34d', border: 'rgba(245,158,11,.3)' },
  'A+':  { bg: 'rgba(250,204,21,.12)', color: '#fde68a', border: 'rgba(250,204,21,.25)' },
  'A':   { bg: 'rgba(16,185,129,.12)', color: '#34d399', border: 'rgba(16,185,129,.25)' },
  'B++': { bg: 'rgba(59,130,246,.12)', color: '#60a5fa', border: 'rgba(59,130,246,.25)' },
  'B+':  { bg: 'rgba(99,102,241,.12)', color: '#a5b4fc', border: 'rgba(99,102,241,.25)' },
  'B':   { bg: 'rgba(148,163,184,.08)', color: '#94a3b8', border: 'rgba(148,163,184,.15)' },
};

const NAAC_RANK: Record<string, number> = { 'A++': 6, 'A+': 5, 'A': 4, 'B++': 3, 'B+': 2, 'B': 1, 'C': 0 };

const LVL_D: Record<string, { bg: string; color: string; border: string }> = {
  UG:      { bg: '#172554', color: '#93c5fd', border: '#1d4ed8' },
  PG:      { bg: '#2e1065', color: '#d8b4fe', border: '#7c3aed' },
  PhD:     { bg: '#052e16', color: '#86efac', border: '#16a34a' },
  Diploma: { bg: '#431407', color: '#fdba74', border: '#ea580c' },
  Lateral: { bg: '#083344', color: '#67e8f9', border: '#0891b2' },
};

/* ── Helpers ────────────────────────────────────────────────────── */
function assetUrl(p?: string) {
  if (!p) return '';
  if (p.startsWith('http')) return p;
  return (process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api').replace(/\/api$/, '') + p;
}
function fmtFee(n: number): string {
  if (!n) return '—';
  return n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${(n / 1000).toFixed(0)}K`;
}
function parseFeeStr(s: string): number {
  if (!s || s === '—') return 0;
  return parseFloat(s.replace(/[₹,\s]/g, '').replace(/\/yr.*$/i, '').replace(/\/year.*$/i, '')) || 0;
}
function getBest(cs: College[], fn: (c: College) => number, low = false): number {
  let idx = -1, best = low ? Infinity : -Infinity;
  cs.forEach((c, i) => { const v = fn(c); if (!v || v <= 0) return; if (low ? v < best : v > best) { best = v; idx = i; } });
  return idx;
}
function countLvl(cs: Course[] = [], lvl: string) { return cs.filter(c => c.level === lvl).length; }
function barColor(pct: number) {
  if (pct <= 38) return 'linear-gradient(90deg,#34d399,#10b981)';
  if (pct <= 68) return 'linear-gradient(90deg,#fbbf24,#f59e0b)';
  return 'linear-gradient(90deg,#fb923c,#ef4444)';
}

/* ── Sub-components ─────────────────────────────────────────────── */
function BestBadge({ label = 'BEST', variant = 'green' }: { label?: string; variant?: 'green' | 'red' }) {
  const s = variant === 'red'
    ? { bg: 'rgba(239,68,68,.12)', color: '#f87171', border: 'rgba(239,68,68,.3)' }
    : { bg: 'rgba(52,211,153,.1)', color: '#34d399', border: 'rgba(52,211,153,.3)' };
  return (
    <span className="inline-flex items-center gap-0.5 flex-shrink-0 whitespace-nowrap"
      style={{ fontSize: '7.5px', fontWeight: 800, background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '2px 6px', borderRadius: 999, animation: variant === 'green' ? 'pulseRing 2.5s ease-in-out infinite' : 'none' }}>
      {variant === 'green' ? <Check size={7} strokeWidth={3} /> : <TrendingUp size={7} />}
      {label}
    </span>
  );
}

/* KEY-FIXED SecHead */
function SecHead({ icon, label, accent, cols }: { icon: React.ReactNode; label: string; accent: string; cols: number }) {
  return (
    <div className="flex items-stretch" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-[72px] sm:w-[90px] flex-shrink-0 px-3 py-2.5 flex items-center gap-1.5 border-r relative overflow-hidden"
        style={{ borderRightColor: 'rgba(255,255,255,0.06)', borderLeft: `3px solid ${accent}`, animation: 'accentPulse 2.5s ease-in-out infinite' }}>
        <div className="absolute left-0 top-0 h-full w-6 pointer-events-none"
          style={{ background: `linear-gradient(90deg,${accent}22,transparent)` }} />
        {icon}
        <span className="text-[8.5px] font-extrabold uppercase tracking-[1.4px] relative z-10" style={{ color: accent }}>{label}</span>
      </div>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={`sc-${i}`} className="flex-1 border-r last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }} />
      ))}
    </div>
  );
}

/* KEY-FIXED Row */
function Row({ label, vals, best = -1, alt = false }: { label: string; vals: React.ReactNode[]; best?: number; alt?: boolean }) {
  return (
    <div className={`flex items-stretch border-b group transition-colors hover:bg-white/[0.018] ${alt ? 'bg-white/[0.012]' : 'bg-transparent'}`}
      style={{ borderColor: 'rgba(255,255,255,0.045)' }}>
      <div className="w-[72px] sm:w-[90px] flex-shrink-0 px-3 py-3 flex items-center border-r" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <span className="text-[10.5px] text-slate-500 group-hover:text-slate-400 transition-colors leading-snug">{label}</span>
      </div>
      {/* ✅ KEY ADDED */}
      {vals.map((v, i) => (
        <div key={`rv-${i}`} className={`flex-1 px-3 py-3 flex items-center gap-1.5 border-r last:border-0 flex-wrap transition-colors ${best === i ? 'bg-emerald-500/[0.05]' : ''}`}
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
            {v ?? <span className="text-slate-700 text-[11px]">—</span>}
            {best === i && <BestBadge />}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Animated Fee Bar */
function FeeBar({ amount, max, visible }: { amount: number; max: number; visible: boolean }) {
  const pct = max > 0 ? Math.max((amount / max) * 100, 0) : 0;
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'rgba(255,255,255,0.08)' }}>
      <div className="h-full rounded-full relative overflow-hidden"
        style={{ width: visible ? `${Math.max(pct, pct > 0 ? 3 : 0)}%` : '0%', background: barColor(pct), transition: 'width 1.25s cubic-bezier(0.4,0,0.2,1)', minWidth: pct > 0 && visible ? '8px' : '0' }}>
        {visible && (
          <div className="absolute inset-0 w-[45%]"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)', animation: 'shimmer 2.2s ease-in-out 1.25s 1' }} />
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function CompareModal({ isOpen, onClose, colleges, onRemove }: CompareModalProps) {
  const [enqOpen, setEnqOpen] = useState(false);
  const [selClg, setSelClg] = useState<{ id: string; name: string } | null>(null);
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    if (isOpen) { const t = setTimeout(() => setBarsOn(true), 460); return () => clearTimeout(t); }
    setBarsOn(false);
  }, [isOpen]);

  // ── Lock body scroll when modal is open ──────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !colleges.length) return null;

  const n = colleges.length;
  const cols = n < 3 ? n + 1 : n;
  // Column width: 145px per college on mobile, 170px on desktop
  const colW = typeof window !== 'undefined' && window.innerWidth < 640 ? 145 : 170;
  const labelW = typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 90;
  const minW = `${labelW + n * colW}px`;

  /* best indices */
  const bRank   = getBest(colleges, c => c.positions, true);
  const bRate   = getBest(colleges, c => c.rating ?? 0);
  const bNaac   = getBest(colleges, c => NAAC_RANK[c.naac?.trim() ?? ''] ?? -1);
  const bMinFee = getBest(colleges, c => c.fees?.min ?? 0, true);
  const bMaxFee = getBest(colleges, c => c.fees?.max ?? 0, true);
  const bCourse = getBest(colleges, c => c.courses?.length ?? 0);
  const bUG     = getBest(colleges, c => countLvl(c.courses, 'UG'));
  const bPG     = getBest(colleges, c => countLvl(c.courses, 'PG'));
  const bPhD    = getBest(colleges, c => countLvl(c.courses, 'PhD'));
  const bStream = getBest(colleges, c => c.streams?.length ?? 0);
  const maxFeeAll = Math.max(...colleges.map(c => c.fees?.max ?? 0), 1);

  const openEnq = (c: College) => { setSelClg({ id: c._id, name: c.name }); setEnqOpen(true); };

  return (
    <>
      <style>{KF}</style>

      {/* Overlay — aurora-tinted dark scrim */}
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-[10px]" onClick={onClose}
          style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(59,130,246,0.06) 0%,rgba(5,8,20,0.9) 70%)' }} />

        {/* ── Aurora border wrapper ── */}
        <div className="relative z-10 w-full max-w-[1060px] sm:rounded-[25px] p-[1.5px]"
          style={{
            background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#10b981,#f59e0b,#ec4899,#8b5cf6,#3b82f6)',
            backgroundSize: '400% 400%',
            animation: 'modalAurora 5s ease infinite, modalGlow 5s ease infinite',
          }}>

        {/* Modal inner */}
        <div className="bg-[#060a14] sm:rounded-[23.5px] flex flex-col overflow-hidden"
          style={{ height: '100dvh', maxHeight: '900px', animation: 'cmpIn .38s cubic-bezier(0.4,0,0.2,1)' }}>

          {/* ════ AI HEADER ════ */}
          <div className="relative flex-shrink-0 overflow-hidden px-5 py-4"
            style={{ background: 'linear-gradient(135deg,#06080f 0%,#0c1424 40%,#0f2558 75%,#06080f 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '26px 26px' }} />
            {/* Glow orbs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.15),transparent 70%)' }} />
            <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)' }} />
            {/* Running aurora stripe across top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#10b981,#f59e0b,#ec4899,#3b82f6)', backgroundSize: '300% 100%', animation: 'modalAurora 4s ease infinite' }} />

            {/* Title row */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Animated icon box */}
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.4)', animation: 'iconRing 2.5s ease-in-out infinite' }}>
                  <Scale size={15} style={{ color: '#a78bfa', animation: 'headerSpark 2.2s ease-in-out infinite' }} />
                </div>
                <div>
                  <h2 className="text-[14px] font-extrabold leading-none" style={{
                    fontFamily: 'var(--font-display)',
                    background: 'linear-gradient(90deg,#60a5fa,#c084fc,#22d3ee)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    backgroundSize: '200% auto', animation: 'modalAurora 3s ease infinite',
                  }}>
                    Compare Colleges
                  </h2>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{n} of 3 selected · fees highlighted</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Legend pill */}
                <div className="hidden sm:flex items-center gap-3 rounded-full px-3 py-1.5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[{ c: '#10b981', l: 'Lowest' }, { c: '#f59e0b', l: 'Mid' }, { c: '#f97316', l: 'Premium' }].map(i => (
                    <div key={i.l} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: i.c }} />
                      <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{i.l}</span>
                    </div>
                  ))}
                </div>
                {/* Close — red glow on hover */}
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all group"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <X size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* ════ COMPACT COLLEGE STRIP — AI glow cards ════ */}
          <div className="flex-shrink-0 overflow-x-auto" style={{ background: 'linear-gradient(180deg,rgba(8,12,28,1),rgba(6,10,20,1))', borderBottom: '1px solid rgba(255,255,255,0.07)', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: minW }} className="flex">
              {/* label col */}
              <div className="w-[72px] sm:w-[90px] flex-shrink-0 px-3 py-3.5 flex items-center border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>College</span>
              </div>

              {/* college slots — each gets slotPulse border */}
              {colleges.map((college, ci) => {
                const ns = NAAC_D[college.naac?.trim() ?? ''];
                return (
                  <div key={college._id} className="flex-1 px-2 py-2.5 border-r last:border-0 min-w-0"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', animation: `slotPulse 3.5s ease-in-out ${ci * 0.35}s infinite`, animationFillMode: 'both' }}>

                    {/* Image row */}
                    <div className="relative w-full h-16 sm:h-20 rounded-[8px] overflow-hidden mb-2 bg-slate-800"
                      style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
                      {college.image ? (
                        <Image src={assetUrl(college.image)} alt={college.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap size={16} className="text-slate-600" />
                        </div>
                      )}
                      {/* Remove X on image */}
                      <button onClick={() => onRemove(college._id)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(0,0,0,0.55)' }}>
                        <X size={9} className="text-white/70" />
                      </button>
                    </div>

                    {/* Name */}
                    <p className="text-[10px] font-bold text-white leading-tight line-clamp-2 mb-1.5">{college.name}</p>

                    {/* Badges row */}
                    <div className="flex items-center gap-1 flex-wrap mb-1">
                      <span className="text-[7.5px] font-bold px-1 py-0.5 rounded-full"
                        style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                        #{college.positions}
                      </span>
                      {college.rating && (
                        <span className="flex items-center gap-0.5">
                          <Star size={7} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[7.5px] font-bold text-slate-400">{college.rating}</span>
                        </span>
                      )}
                      {college.naac && (
                        <span className="text-[7px] font-extrabold px-1 py-[1px] rounded-full border"
                          style={ns ? { background: ns.bg, color: ns.color, borderColor: ns.border } : { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}>
                          NAAC {college.naac}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* empty slot */}
              {n < 3 && (
                <div className="flex-1 px-3 py-3 flex items-center justify-center border-r last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="text-center opacity-30">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-1">
                      <Plus size={13} className="text-slate-500" />
                    </div>
                    <p className="text-[8.5px] text-slate-600 leading-relaxed">Add<br />more</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ════ SCROLLABLE CONTENT ════ */}
          <div className="flex-1 overflow-y-auto overflow-x-auto"
            style={{ background: 'linear-gradient(180deg,#06090f 0%,#060a14 100%)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: minW }}>

              {/* ╔═══════════════════════════════╗
                  ║  FEE STRUCTURE  (hero)         ║
                  ╚═══════════════════════════════╝ */}
              {/* Fee section */}
              <div className="mx-4 mt-4 mb-1 rounded-[16px] overflow-hidden"
                style={{ border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(6,10,20,1)' }}>
                {/* header */}
                <div className="px-5 py-2.5 flex items-center justify-between"
                  style={{ background: 'rgba(245,158,11,0.07)', borderBottom: '1px solid rgba(245,158,11,0.14)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <IndianRupee size={12} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-[1.5px]">Fee Structure</p>
                      <p className="text-[8.5px] text-amber-600/70 font-medium">Annual tuition · Lower is better</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">⭐ KEY FACTOR</span>
                </div>

                {/* fee visual columns */}
                <div className="flex" style={{ paddingLeft: '90px' }}>
                  {colleges.map((c, i) => {
                    const pct = maxFeeAll > 0 ? ((c.fees?.max ?? 0) / maxFeeAll) * 100 : 0;
                    const isMin = i === bMinFee;
                    const hasFees = c.fees?.min || c.fees?.max;
                    return (
                      <div key={c._id} className={`flex-1 px-4 py-4 border-r border-amber-900/20 last:border-0 ${isMin ? 'bg-emerald-500/[0.04]' : ''}`}
                        style={{ animation: 'feeIn .45s ease both', animationDelay: `${i * 0.08}s` }}>
                        <div className="mb-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold leading-none"
                              style={{ fontSize: 'clamp(18px,4vw,22px)', background: isMin ? 'linear-gradient(135deg,#34d399,#10b981)' : 'linear-gradient(135deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                              {fmtFee(c.fees?.min ?? 0)}
                            </span>
                            {hasFees && <span className="text-[10px] text-slate-500 font-medium">onwards</span>}
                          </div>
                          {hasFees
                            ? <p className="text-[10px] text-slate-500 mt-0.5">up to <span className="text-slate-300 font-bold">{fmtFee(c.fees?.max ?? 0)}</span> / year</p>
                            : <p className="text-[10px] text-slate-600 italic">Not listed</p>}
                        </div>
                        <div className="mb-2.5">
                          <div className="flex justify-between mb-1">
                            <span className="text-[8px] text-slate-600">Relative cost</span>
                            <span className="text-[8.5px] font-extrabold" style={{ color: pct <= 38 ? '#34d399' : pct <= 68 ? '#f59e0b' : '#f97316' }}>
                              {pct > 0 ? `${Math.round(pct)}%` : '—'}
                            </span>
                          </div>
                          <FeeBar amount={c.fees?.max ?? 0} max={maxFeeAll} visible={barsOn} />
                        </div>
                        {isMin && (
                          <div className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full"
                            style={{ animation: 'pulseRing 2s ease-in-out infinite' }}>
                            <Check size={8} strokeWidth={3} />Best Value
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {n < 3 && <div className="flex-1 px-4 py-4 flex items-center text-slate-700 text-[11px]">—</div>}
                </div>

                {/* Min / Max detail rows */}
                <div style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
                  {/* ✅ KEY on outer map */}
                  {([
                    { label: 'Min Fees', fn: (c: College) => c.fees?.min ?? 0, best: bMinFee, badge: 'CHEAPEST' },
                    { label: 'Max Fees', fn: (c: College) => c.fees?.max ?? 0, best: bMaxFee, badge: 'LOWEST MAX' },
                  ] as const).map(({ label, fn, best, badge }, ri) => (
                    <div key={label} className={`flex items-stretch hover:bg-white/[0.015] transition-colors ${ri === 0 ? 'border-b' : ''}`}
                      style={{ borderColor: 'rgba(245,158,11,0.1)' }}>
                      <div className="w-[72px] sm:w-[90px] flex-shrink-0 px-3 py-2.5 flex items-center border-r" style={{ borderColor: 'rgba(245,158,11,0.1)' }}>
                        <span className="text-[10.5px] font-semibold text-amber-600/80">{label}</span>
                      </div>
                      {/* ✅ KEY on inner college map */}
                      {colleges.map((c, i) => (
                        <div key={c._id} className={`flex-1 px-4 py-2.5 flex items-center gap-2 border-r last:border-0 ${best === i ? 'bg-emerald-500/[0.05]' : ''}`}
                          style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
                          <span className="text-[13px] font-extrabold text-slate-100">{fmtFee(fn(c))}</span>
                          {best === i && <BestBadge label={badge} />}
                        </div>
                      ))}
                      {n < 3 && <div key="empty-fee" className="flex-1 px-4 py-2.5 text-slate-700 text-[11px] flex items-center">—</div>}
                    </div>
                  ))}
                </div>
              </div>{/* /fee section */}

              {/* Course section */}
              <div className="mx-4 mt-2 mb-1 rounded-[16px] overflow-hidden"
                style={{ border: '1px solid rgba(168,85,247,0.12)', background: 'rgba(6,10,20,1)' }}>
                <div className="px-5 py-2.5 flex items-center justify-between"
                  style={{ background: 'rgba(168,85,247,0.07)', borderBottom: '1px solid rgba(168,85,247,0.14)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.15)' }}>
                      <GraduationCap size={12} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-[1.5px]">Course Fee Breakdown</p>
                      <p className="text-[8.5px] text-purple-500/70 font-medium">All courses · ↓ Lowest  ↑ Highest fee per college</p>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  {/* label col */}
                  <div className="w-[72px] sm:w-[90px] flex-shrink-0 px-3 py-3 border-r flex items-start" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                    <span className="text-[8.5px] text-slate-600 font-medium leading-relaxed">Individual Course Fees</span>
                  </div>

                  {/* college course columns */}
                  {colleges.map(college => {
                    const parsed = college.courses.map(c => parseFeeStr(c.fees));
                    const valid = parsed.filter(f => f > 0);
                    const minAmt = valid.length ? Math.min(...valid) : 0;
                    const maxAmt = valid.length ? Math.max(...valid) : 0;

                    return (
                      <div key={college._id} className="flex-1 border-r last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        {college.courses.length === 0 ? (
                          <div className="px-3 py-4 text-[10px] text-slate-600 text-center italic">No courses listed</div>
                        ) : college.courses.map((course, ci) => {
                          const feeAmt = parsed[ci];
                          const isMin = feeAmt > 0 && feeAmt === minAmt;
                          const isMax = feeAmt > 0 && feeAmt === maxAmt;
                          const ls = LVL_D[course.level];
                          return (
                            /* ✅ KEY on course row */
                            <div key={`${college._id}-course-${ci}`}
                              className={`px-3 py-2 border-b last:border-0 transition-colors ${isMin ? 'bg-emerald-500/[0.06]' : isMax ? 'bg-red-500/[0.05]' : 'hover:bg-white/[0.015]'}`}
                              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                              <div className="flex items-start justify-between gap-1.5 mb-1">
                                <p className="text-[10.5px] font-semibold text-slate-200 leading-snug flex-1 min-w-0"
                                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {course.name}
                                </p>
                                <div className="flex flex-col gap-0.5 items-end flex-shrink-0">
                                  {isMin && <BestBadge label="↓ MIN" variant="green" />}
                                  {isMax && <BestBadge label="↑ MAX" variant="red" />}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {course.level && (
                                  <span className="text-[7.5px] font-bold px-1.5 py-[2px] rounded border"
                                    style={ls ? { background: ls.bg, color: ls.color, borderColor: ls.border } : { background: '#1e293b', color: '#94a3b8', borderColor: '#475569' }}>
                                    {course.level}
                                  </span>
                                )}
                                <span className={`text-[11px] font-extrabold ${isMin ? 'text-emerald-400' : isMax ? 'text-red-400' : 'text-slate-300'}`}>
                                  {course.fees || '—'}
                                </span>
                                {course.duration && <span className="text-[8.5px] text-slate-600">· {course.duration}</span>}
                              </div>
                              {(course.seats || course.entrance) && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  {course.seats ? <span className="text-[8px] text-slate-600">{course.seats} seats</span> : null}
                                  {course.entrance ? <span className="text-[8px] text-slate-600 italic truncate">{course.entrance}</span> : null}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {/* summary footer per college */}
                        {college.courses.length > 0 && (
                          <div className="px-3 py-2 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex items-center gap-1">
                              <TrendingDown size={9} className="text-emerald-400" />
                              <span className="text-[8.5px] font-bold text-emerald-400">Min: {fmtFee(minAmt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp size={9} className="text-red-400" />
                              <span className="text-[8.5px] font-bold text-red-400">Max: {fmtFee(maxAmt)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {n < 3 && <div key="empty-course" className="flex-1 border-r last:border-0 flex items-center justify-center text-slate-700 text-[11px] px-3 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>—</div>}
                </div>
              </div>{/* /course section */}

              {/* ════ OVERVIEW ════ */}
              <div className="mt-4" style={{ animation: "fadeUp .45s ease .1s both" }}>
                <SecHead cols={cols} accent="#60a5fa" label="Overview" icon={<Building2 size={10} style={{ color: '#60a5fa' }} />} />
                <Row label="Ranking" best={bRank} vals={colleges.map(c => <span key={c._id} className="text-[14px] font-extrabold text-white">#{c.positions}</span>)} />
                <Row label="Rating" best={bRate} alt vals={colleges.map(c => c.rating ? (
                  <div key={c._id} className="flex items-center gap-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[13px] font-extrabold text-white">{c.rating}</span>
                    <span className="text-[10px] text-slate-500">/5</span>
                  </div>
                ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
                <Row label="Type" vals={colleges.map(c => (
                  <span key={c._id} className="text-[11px] font-semibold text-slate-300 capitalize bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 rounded-full">{c.type || '—'}</span>
                ))} />
                <Row label="Est." alt vals={colleges.map(c => c.established ? (
                  <div key={c._id} className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-slate-600" />
                    <span className="text-[12.5px] font-bold text-slate-300">{c.established}</span>
                  </div>
                ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
                <Row label="Location" vals={colleges.map(c => c.locations?.length ? (
                  <div key={c._id} className="flex items-start gap-1">
                    <MapPin size={10} className="text-slate-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300 leading-snug">{c.locations.join(', ')}</span>
                  </div>
                ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
              </div>

              {/* ════ ACCREDITATIONS ════ */}
              <div className="mt-1" style={{ animation: "fadeUp .45s ease .18s both" }}>
                <SecHead cols={cols} accent="#fbbf24" label="Accreditations" icon={<Award size={10} style={{ color: '#fbbf24' }} />} />
                <Row label="NAAC" best={bNaac} vals={colleges.map(c => {
                  if (!c.naac) return <span key={c._id} className="text-slate-600 text-[11px]">—</span>;
                  const s = NAAC_D[c.naac.trim()];
                  return (
                    <span key={c._id} className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border"
                      style={s ? { background: s.bg, color: s.color, borderColor: s.border } : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}>
                      NAAC {c.naac}
                    </span>
                  );
                })} />
                <Row label="Other" alt vals={colleges.map(c => c.accreditations?.length ? (
                  <div key={c._id} className="flex flex-wrap gap-1">
                    {c.accreditations.map(a => (
                      <span key={a} className="text-[8.5px] font-bold bg-white/[0.05] text-slate-400 border border-white/[0.08] px-1.5 py-[2px] rounded-full">{a}</span>
                    ))}
                  </div>
                ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
              </div>

              {/* ════ PROGRAMS SUMMARY ════ */}
              <div className="mt-1" style={{ animation: "fadeUp .45s ease .26s both" }}>
                <SecHead cols={cols} accent="#c084fc" label="Programs Summary" icon={<BookOpen size={10} style={{ color: '#c084fc' }} />} />
                <Row label="Total" best={bCourse} vals={colleges.map(c => <span key={c._id} className="text-[15px] font-extrabold text-white">{c.courses?.length ?? 0}</span>)} />
                {([
                  { lvl: 'UG', best: bUG, alt: true },
                  { lvl: 'PG', best: bPG, alt: false },
                  { lvl: 'PhD', best: bPhD, alt: true },
                  { lvl: 'Diploma', best: -1, alt: false },
                ] as const).map(({ lvl, best, alt }) => {
                  const ls = LVL_D[lvl];
                  return (
                    <Row key={lvl} label={lvl} best={best} alt={alt}
                      vals={colleges.map(c => {
                        const cnt = countLvl(c.courses, lvl);
                        return (
                          <div key={c._id} className="flex items-center gap-1.5">
                            <span className="text-[8px] font-bold px-1.5 py-[2px] rounded border"
                              style={{ background: ls.bg, color: ls.color, borderColor: ls.border }}>{lvl.slice(0, 2)}</span>
                            <span className="text-[13px] font-bold text-white">{cnt}</span>
                          </div>
                        );
                      })} />
                  );
                })}
              </div>

              {/* ════ STREAMS ════ */}
              <div className="mt-1" style={{ animation: "fadeUp .45s ease .34s both" }}>
                <SecHead cols={cols} accent="#f472b6" label="Streams" icon={<GraduationCap size={10} style={{ color: '#f472b6' }} />} />
                <Row label="Count" best={bStream} vals={colleges.map(c => <span key={c._id} className="text-[14px] font-extrabold text-white">{c.streams?.length ?? 0}</span>)} />
                <Row label="Available" alt vals={colleges.map(c => c.streams?.length ? (
                  <div key={c._id} className="flex flex-wrap gap-1">
                    {c.streams.map(s => {
                      const sc = STREAM_COLORS[s];
                      return (
                        <span key={s} className="text-[8.5px] font-bold px-1.5 py-[3px] rounded-full border"
                          style={sc ? { background: sc.bg, color: sc.color, borderColor: `${sc.color}40` } : { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}>
                          {s.length > 13 ? `${s.slice(0, 13)}…` : s}
                        </span>
                      );
                    })}
                  </div>
                ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
              </div>

              {/* ════ HIGHLIGHTS (conditional) ════ */}
              {colleges.some(c => c.highlights?.length) && (
                <div className="mt-1">
                  <SecHead cols={cols} accent="#fbbf24" label="Highlights" icon={<Award size={10} style={{ color: '#fbbf24' }} />} />
                  <Row label="Key Points" vals={colleges.map(c => c.highlights?.length ? (
                    <div key={c._id} className="flex flex-col gap-1.5 py-0.5">
                      {c.highlights.slice(0, 4).map((h, i) => (
                        /* ✅ KEY on highlight items */
                        <div key={`hl-${i}`} className="flex items-start gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={8} className="text-emerald-400" strokeWidth={2.5} />
                          </div>
                          <span className="text-[10.5px] text-slate-300 leading-snug">{h}</span>
                        </div>
                      ))}
                      {c.highlights.length > 4 && <span className="text-[9px] text-slate-600">+{c.highlights.length - 4} more</span>}
                    </div>
                  ) : <span key={c._id} className="text-slate-600 text-[11px]">—</span>)} />
                </div>
              )}

              {/* ════ FOOTER CTA — aurora shimmer button ════ */}
              <div className="px-4 py-5 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(90deg,rgba(59,130,246,0.04),rgba(139,92,246,0.04),rgba(59,130,246,0.04))', backgroundSize: '200% auto', animation: 'sectionAura 5s ease infinite' }}>
                {/* Mobile: stack buttons vertically; Desktop: row with label-column offset */}
                <div className="hidden sm:flex" style={{ paddingLeft: `${labelW}px` }}>
                  {colleges.map(c => (
                    <div key={c._id} className="flex-1 px-3 first:pl-0">
                      <button onClick={() => openEnq(c)}
                        className="relative overflow-hidden w-full text-[11.5px] font-bold text-white py-2.5 rounded-[10px] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6)', backgroundSize: '200% auto', animation: 'ctaShimmer 3s ease infinite', boxShadow: '0 4px 18px rgba(139,92,246,0.4),0 0 0 1px rgba(139,92,246,0.25)' }}>
                        <span className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)', animation: 'shimmer 3s ease-in-out infinite' }} />
                        <Scale size={11} className="relative z-10" />
                        <span className="relative z-10">Free Counselling</span>
                      </button>
                    </div>
                  ))}
                  {n < 3 && <div className="flex-1 px-3" />}
                </div>
                {/* Mobile CTA — 1 row, 2 small buttons */}
                <div className="flex sm:hidden gap-2 mt-1">
                  {colleges.map(c => (
                    <button key={c._id} onClick={() => openEnq(c)}
                      className="relative overflow-hidden flex-1 text-[10.5px] font-bold text-white py-2.5 rounded-[10px] flex items-center justify-center gap-1"
                      style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6)', backgroundSize: '200% auto', animation: 'ctaShimmer 3s ease infinite', boxShadow: '0 3px 12px rgba(139,92,246,0.4)' }}>
                      <span className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)', animation: 'shimmer 3s ease-in-out infinite' }} />
                      <Scale size={10} className="relative z-10 flex-shrink-0" />
                      <span className="relative z-10 truncate">{c.name.split(' ')[0]} — Apply</span>
                    </button>
                  ))}
                  {n < 3 && <div className="flex-1" />}
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>{/* /aurora border wrapper */}
      </div>

      {/* Enquiry */}
      {enqOpen && selClg && (
        <EnquiryModal isOpen={enqOpen}
          onClose={() => { setEnqOpen(false); setSelClg(null); }}
          collegeName={selClg.name} collegeId={selClg.id} />
      )}
    </>
  );
}