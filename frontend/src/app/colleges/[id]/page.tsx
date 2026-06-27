'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import EnquiryModal from '@/components/EnquiryModal';
import {
  MapPin, Star, Phone, Download, ExternalLink, GraduationCap,
  ArrowRight, CheckCircle, BookOpen, Building2, Calendar, Award,
  ChevronRight, Share2, IndianRupee, ArrowLeft, Lock,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────── */
interface Course {
  name: string; level: string; duration: string; fees: string;
  seats?: number; entrance?: string;
}
interface OverviewPoint { heading: string; description: string; }
interface College {
  _id: string; name: string; slug: string; streams: string[]; locations: string[];
  image?: string; brochure?: string; feeStructureDoc?: string; courses: Course[];
  overview?: { heading: string; description: string; points: OverviewPoint[] };
  portalLink?: string; portalLinkAC?: string; CollegeLink?: string;
  rating?: number; naac?: string; fees?: { min: number; max: number };
  type?: string; established?: number; accreditations?: string[];
  highlights?: string[]; positions?: number;
}

/* ── Constants ─────────────────────────────────────────────────── */
const NAVBAR_HEIGHT = 72;

const LEVEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  UG:      { bg: '#172554', color: '#93c5fd', border: '#1d4ed8' },
  PG:      { bg: '#2e1065', color: '#d8b4fe', border: '#7c3aed' },
  PhD:     { bg: '#052e16', color: '#86efac', border: '#16a34a' },
  Diploma: { bg: '#431407', color: '#fdba74', border: '#ea580c' },
  Lateral: { bg: '#083344', color: '#67e8f9', border: '#0891b2' },
};

const ACCREDITATION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  /* ── NAAC grades ─────────────────────────────────────────────── */
  'NAAC A++': { bg: 'rgba(245,158,11,0.14)',  text: '#fcd34d', border: 'rgba(245,158,11,0.30)' },
  'NAAC A+':  { bg: 'rgba(250,204,21,0.14)',  text: '#fde68a', border: 'rgba(250,204,21,0.30)' },
  'NAAC A':   { bg: 'rgba(16,185,129,0.14)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.30)' },
  'NAAC B++': { bg: 'rgba(59,130,246,0.14)',  text: '#93c5fd', border: 'rgba(59,130,246,0.28)' },
  'NAAC B+':  { bg: 'rgba(99,102,241,0.14)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.28)' },
  'NAAC B':   { bg: 'rgba(100,116,139,0.12)', text: '#cbd5e1', border: 'rgba(100,116,139,0.25)' },
  'NAAC C':   { bg: 'rgba(239,68,68,0.10)',   text: '#fca5a5', border: 'rgba(239,68,68,0.22)' },
  /* ── Accreditation bodies ─────────────────────────────────────── */
  Autonomous:          { bg: 'rgba(59,130,246,0.14)',  text: '#93c5fd', border: 'rgba(59,130,246,0.28)' },
  NBA:                 { bg: 'rgba(168,85,247,0.14)',  text: '#d8b4fe', border: 'rgba(168,85,247,0.28)' },
  AICTE:               { bg: 'rgba(16,185,129,0.14)',  text: '#86efac', border: 'rgba(16,185,129,0.28)' },
  UGC:                 { bg: 'rgba(236,72,153,0.14)',  text: '#f9a8d4', border: 'rgba(236,72,153,0.28)' },
  NIRF:                { bg: 'rgba(14,165,233,0.14)',  text: '#7dd3fc', border: 'rgba(14,165,233,0.28)' },
  DCI:                 { bg: 'rgba(20,184,166,0.14)',  text: '#5eead4', border: 'rgba(20,184,166,0.28)' },
  'DCI Approved':      { bg: 'rgba(20,184,166,0.14)',  text: '#5eead4', border: 'rgba(20,184,166,0.28)' },
  MCI:                 { bg: 'rgba(239,68,68,0.12)',   text: '#fca5a5', border: 'rgba(239,68,68,0.25)' },
  BCI:                 { bg: 'rgba(249,115,22,0.12)',  text: '#fdba74', border: 'rgba(249,115,22,0.25)' },
  PCI:                 { bg: 'rgba(132,204,22,0.12)',  text: '#bef264', border: 'rgba(132,204,22,0.25)' },
  INC:                 { bg: 'rgba(236,72,153,0.12)',  text: '#f9a8d4', border: 'rgba(236,72,153,0.25)' },
  /* ── Institution type as accreditation ───────────────────────── */
  'Deemed to be University': { bg: 'rgba(139,92,246,0.14)', text: '#c4b5fd', border: 'rgba(139,92,246,0.28)' },
  'Deemed University':       { bg: 'rgba(139,92,246,0.14)', text: '#c4b5fd', border: 'rgba(139,92,246,0.28)' },
};

/* ── College type → color map ──────────────────────────────────── */
const TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  private:    { bg: 'rgba(96,165,250,0.12)',  text: '#93c5fd', border: 'rgba(96,165,250,0.28)' },
  government: { bg: 'rgba(52,211,153,0.12)',  text: '#6ee7b7', border: 'rgba(52,211,153,0.28)' },
  govt:       { bg: 'rgba(52,211,153,0.12)',  text: '#6ee7b7', border: 'rgba(52,211,153,0.28)' },
  deemed:     { bg: 'rgba(167,139,250,0.12)', text: '#c4b5fd', border: 'rgba(167,139,250,0.28)' },
  autonomous: { bg: 'rgba(251,191,36,0.12)',  text: '#fde68a', border: 'rgba(251,191,36,0.28)' },
  central:    { bg: 'rgba(249,115,22,0.12)',  text: '#fdba74', border: 'rgba(249,115,22,0.28)' },
  state:      { bg: 'rgba(34,211,238,0.12)',  text: '#67e8f9', border: 'rgba(34,211,238,0.28)' },
};
function getTypeStyle(type: string) {
  return TYPE_STYLES[type?.toLowerCase().trim()] || {
    bg: 'rgba(100,116,139,0.12)', text: '#cbd5e1', border: 'rgba(100,116,139,0.22)',
  };
}

/* ── Helpers ───────────────────────────────────────────────────── */
function getAccreditationStyle(value: string) {
  return ACCREDITATION_STYLES[value?.trim()] || {
    bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.88)', border: 'rgba(255,255,255,0.12)',
  };
}
function formatFees(fees?: { min: number; max: number }) {
  if (!fees || (!fees.min && !fees.max)) return null;
  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${(n / 1000).toFixed(0)}K`;
  if (fees.min && fees.max) return `${fmt(fees.min)} – ${fmt(fees.max)} / yr`;
  return `${fmt(fees.min || fees.max)} / yr`;
}
function getAssetUrl(path?: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
  return apiUrl.replace(/\/api$/, '') + path;
}

/* ── Sub-components ────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[18px] font-extrabold text-white mb-5 flex items-center gap-2"
      style={{ fontFamily: 'var(--font-display)' }}>
      {children}
    </h2>
  );
}

/* ── AI Animated TabLockPrompt ────────────────────────────────── */
const LOCK_KF = `
  @keyframes lockAurora{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes lockGlow{
    0%,100%{box-shadow:0 0 40px rgba(59,130,246,.25),0 0 80px rgba(139,92,246,.12)}
    50%{box-shadow:0 0 40px rgba(139,92,246,.25),0 0 80px rgba(6,182,212,.12)}
  }
  @keyframes lockIconSpark{0%,100%{filter:drop-shadow(0 0 5px rgba(96,165,250,.85))}50%{filter:drop-shadow(0 0 12px rgba(192,132,252,.95))}}
  @keyframes lockIconPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes lockShimmer{0%{transform:translateX(-140%) skewX(-18deg)}100%{transform:translateX(230%) skewX(-18deg)}}
  @keyframes lockFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes lockDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
`;

function TabLockPrompt({ collegeName, tabLabel, onUnlockClick }: {
  collegeName: string; tabLabel: string; onUnlockClick: () => void;
}) {
  return (
    <>
      <style>{LOCK_KF}</style>

      {/* Aurora gradient border wrapper */}
      <div className="rounded-[22px] p-[1.5px]"
        style={{
          background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#10b981,#f59e0b,#8b5cf6,#3b82f6)',
          backgroundSize: '300% 300%',
          animation: 'lockAurora 5s ease infinite, lockGlow 5s ease infinite',
        }}>

        <div className="bg-[#060a14] rounded-[20.5px] p-10 flex flex-col items-center text-center relative overflow-hidden"
          style={{ animation: 'lockFadeUp .4s cubic-bezier(0.4,0,0.2,1)' }}>

          {/* Running top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#10b981,#3b82f6)', backgroundSize: '200% auto', animation: 'lockAurora 3s ease infinite' }} />

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />

          {/* Glow orb behind icon */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.14),transparent 70%)' }} />

          {/* Lock icon */}
          <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.18))',
              border: '1px solid rgba(139,92,246,0.4)',
              animation: 'lockIconPulse 3s ease-in-out infinite',
            }}>
            <Lock size={26} style={{ color: '#a78bfa', animation: 'lockIconSpark 2.5s ease-in-out infinite' }} />
          </div>

          {/* Title — aurora gradient text */}
          <h3 className="relative z-10 text-[20px] font-extrabold mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(90deg,#60a5fa,#c084fc,#22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              backgroundSize: '200% auto', animation: 'lockAurora 4s ease infinite',
            }}>
            Unlock {tabLabel}
          </h3>

          <p className="relative z-10 text-[13px] mb-7 leading-relaxed max-w-xs"
            style={{ color: 'rgba(255,255,255,0.45)' }}>
            Fill a quick enquiry form to access {tabLabel.toLowerCase()} details for{' '}
            <span className="font-semibold" style={{ color: '#60a5fa' }}>{collegeName}</span>.
          </p>


          {/* CTA — matches site standard (blue-400, dark text) */}
          <button onClick={onUnlockClick}
            className="relative overflow-hidden z-10 flex items-center justify-center gap-2 text-[13.5px] font-bold text-slate-950 px-7 py-3.5 rounded-[14px] transition-all hover:-translate-y-0.5 hover:bg-blue-300"
            style={{
              background: '#60a5fa',
              boxShadow: '0 4px 18px rgba(96,165,250,0.35)',
            }}>
            {/* Shimmer streak */}
            <span className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.35) 50%,transparent 65%)', animation: 'lockShimmer 3s ease-in-out infinite' }} />
            <span className="w-2 h-2 rounded-full bg-slate-950 relative z-10"
              style={{ animation: 'lockDot 1.6s ease-in-out infinite' }} />
            <span className="relative z-10">Get Free Counselling to Unlock</span>
          </button>

          <p className="relative z-10 text-[11px] mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Free · No spam · Takes 30 seconds
          </p>
        </div>
      </div>
    </>
  );
}

/* ── SidebarCTA ───────────────────────────────────────────────── */
function SidebarCTA({ college, onEnquiry, onDownload }: {
  college: College;
  onEnquiry: () => void;
  onDownload: (type: 'brochure' | 'fee-structure', url: string) => void;
}) {
  return (
    <div className="bg-[#0f172a]/90 rounded-[22px] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl"
      style={{ position: 'sticky', top: `${NAVBAR_HEIGHT + 16}px` }}>
      <div className="px-5 py-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 bg-blue-400/10 border border-blue-400/20 text-blue-300 text-[9px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          Free Counselling
        </div>
        <h3 className="text-[16px] font-extrabold text-white leading-snug mb-1"
          style={{ fontFamily: 'var(--font-display)' }}>
          Interested in {college.name.split(' ').slice(0, 3).join(' ')}?
        </h3>
        <p className="text-[11.5px] text-white/55">Get expert guidance on admission, fees &amp; eligibility.</p>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <button onClick={onEnquiry}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-3.5 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
          Get Free Counselling
        </button>
        <a href="tel:+918606004306"
          className="w-full flex items-center justify-center gap-2 text-[12.5px] font-semibold text-white border border-white/15 hover:bg-white/5 py-3 rounded-[12px] transition-all duration-200">
          <Phone size={14} strokeWidth={2} /> Call Our Counsellor
        </a>
        <div className="mt-1 flex flex-col gap-2.5 pt-4 border-t border-white/10">
          {college.established && (
            <div className="flex items-center gap-2.5">
              <Calendar size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">Est. {college.established}</span>
            </div>
          )}
          {college.type && (
            <div className="flex items-center gap-2.5">
              <Building2 size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300 capitalize">{college.type} Institution</span>
            </div>
          )}
          {formatFees(college.fees) && (
            <div className="flex items-center gap-2.5">
              <IndianRupee size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">{formatFees(college.fees)}</span>
            </div>
          )}
          {college.locations?.length ? (
            <div className="flex items-center gap-2.5">
              <MapPin size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">{college.locations.join(', ')}</span>
            </div>
          ) : null}
        </div>
        {(college.brochure || college.feeStructureDoc) && (
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
            {college.brochure && (
              <button onClick={() => onDownload('brochure', college.brochure!)}
                className="flex items-center gap-2 text-[11.5px] font-semibold text-blue-400 hover:text-blue-300 transition-colors text-left">
                <Download size={12} strokeWidth={2.5} /> Download Brochure
              </button>
            )}
            {college.feeStructureDoc && (
              <button onClick={() => onDownload('fee-structure', college.feeStructureDoc!)}
                className="flex items-center gap-2 text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors text-left">
                <Download size={12} strokeWidth={2.5} /> Fee Structure PDF
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CourseTable — desktop table + mobile cards ───────────────── */
function CourseTable({ courses }: { courses: Course[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? courses : courses.slice(0, 8);
  if (!courses?.length) return null;

  const LevelBadge = ({ level }: { level: string }) => (
    level ? (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap border"
        style={{ background: LEVEL_COLORS[level]?.bg || '#1e293b', color: LEVEL_COLORS[level]?.color || '#cbd5e1', borderColor: LEVEL_COLORS[level]?.border || '#475569' }}>
        {level}
      </span>
    ) : null
  );

  return (
    <div className="overflow-hidden rounded-[16px] border border-white/10 bg-slate-950/50">

      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.03]">
              {['Course', 'Level', 'Duration', 'Fees'].map(h => (
                <th key={h} className="px-3 py-2.5 text-[9.5px] font-bold text-slate-400 uppercase tracking-[0.8px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((course, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/[0.03] transition-colors">
                <td className="px-3 py-2.5 max-w-[200px]">
                  <span className="text-[11.5px] font-semibold text-white leading-snug block">{course.name}</span>
                  {course.entrance && <span className="text-[9.5px] text-slate-500 mt-0.5 block">{course.entrance}</span>}
                </td>
                <td className="px-3 py-2.5"><LevelBadge level={course.level} /></td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-[11px] text-slate-400">{course.duration}</span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-[11.5px] font-semibold text-emerald-400">{course.fees}</span>
                  {course.seats ? <span className="text-[9px] text-slate-600 ml-1.5">{course.seats} seats</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (hidden on sm+) ── */}
      <div className="sm:hidden">
        {/* Mobile column headers */}
        <div className="grid grid-cols-3 gap-0 bg-white/[0.03] border-b border-white/10 px-3 py-2">
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-[0.7px]">Course</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-[0.7px] text-center">Level / Dur</span>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-[0.7px] text-right">Fees</span>
        </div>
        {visible.map((course, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 px-3 py-2.5 border-b border-white/[0.06] items-center hover:bg-white/[0.02] transition-colors">
            {/* Course name */}
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold text-white leading-tight line-clamp-2">{course.name}</p>
              {course.entrance && <p className="text-[8.5px] text-slate-600 mt-0.5 truncate">{course.entrance}</p>}
            </div>
            {/* Level + Duration */}
            <div className="flex flex-col items-center gap-1">
              <LevelBadge level={course.level} />
              {course.duration && <span className="text-[8.5px] text-slate-500 text-center">{course.duration}</span>}
            </div>
            {/* Fees */}
            <div className="text-right">
              <span className="text-[10.5px] font-bold text-emerald-400">{course.fees || '—'}</span>
              {course.seats ? <p className="text-[8px] text-slate-600 mt-0.5">{course.seats} seats</p> : null}
            </div>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {courses.length > 8 && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/[0.03]">
          <button onClick={() => setShowAll(!showAll)}
            className="text-[12px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            {showAll ? 'Show less' : `Show all ${courses.length} courses`}
            <ChevronRight size={13} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════ */
export default function CollegeDetailPage() {
  const params  = useParams<{ id: string }>();
  const id      = params?.id;

  const [college, setCollege]           = useState<College | null>(null);
  const [loading, setLoading]           = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [activeTab, setActiveTab]       = useState<'overview' | 'courses' | 'admission'>('overview');
  const [streamColors, setStreamColors] = useState<Record<string, { bg: string; color: string }>>({});
  const [enquiryOpen, setEnquiryOpen]   = useState(false);
  const [gateOpen, setGateOpen]         = useState(false);
  const [unlocked, setUnlocked]         = useState(false);

  // ── Download gate state ───────────────────────────────────────
  const [downloadGateOpen, setDownloadGateOpen] = useState(false);
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const [downloadPending, setDownloadPending]   = useState<{ type: 'brochure' | 'fee-structure'; url: string } | null>(null);

  // ── Persist unlock across page loads ────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      if (localStorage.getItem(`enquiry_unlocked_${id}`) === '1') setUnlocked(true);
      if (localStorage.getItem(`download_unlocked_${id}`) === '1') setDownloadUnlocked(true);
    }
  }, [id]);

  // ── On counselling enquiry success: unlock tabs ──────────────
  const handleUnlock = () => {
    setUnlocked(true);
    setGateOpen(false);
    setEnquiryOpen(false);
    if (id && typeof window !== 'undefined') {
      localStorage.setItem(`enquiry_unlocked_${id}`, '1');
    }
  };

  // ── On download enquiry success: unlock + trigger download ───
  const handleDownloadUnlock = () => {
    setDownloadUnlocked(true);
    setDownloadGateOpen(false);
    if (id && typeof window !== 'undefined') {
      localStorage.setItem(`download_unlocked_${id}`, '1');
    }
    if (downloadPending) {
      window.open(getAssetUrl(downloadPending.url), '_blank', 'noopener,noreferrer');
      setDownloadPending(null);
    }
  };

  // ── Tab click ─────────────────────────────────────────────────
  const handleTabChange = (tab: 'overview' | 'courses' | 'admission') => {
    setActiveTab(tab);
    if (tab !== 'overview' && !unlocked) setGateOpen(true);
  };

  // ── Fetch stream colours ─────────────────────────────────────
  useEffect(() => {
    fetch('/api/streams')
      .then(r => r.json())
      .then((data: Array<{ label: string; color: string; bg: string }>) => {
        if (!Array.isArray(data)) return;
        const map: Record<string, { bg: string; color: string }> = {};
        data.forEach(s => { map[s.label] = { bg: s.bg, color: s.color }; });
        setStreamColors(map);
      })
      .catch(() => {});
  }, []);

  // ── Fetch college ────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch(`/api/colleges/${id}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        if (data.success && data.data) { setCollege(data.data); return; }
        if (data._id || data.name)     { setCollege(data); return; }
        setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── openDownload: gate first-time users behind enquiry form ──
  const openDownload = (type: 'brochure' | 'fee-structure', url: string) => {
    if (downloadUnlocked) {
      // Already filled — download directly
      window.open(getAssetUrl(url), '_blank', 'noopener,noreferrer');
      return;
    }
    // Gate: show enquiry form, download triggers on success
    setDownloadPending({ type, url });
    setDownloadGateOpen(true);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: college?.name, url: window.location.href });
      else if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  /* ── Loading ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Not found ─────────────────────────────────────────────── */
  if (notFound || !college) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Building2 size={28} className="text-blue-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-[22px] font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          College not found
        </h1>
        <p className="text-[13px] text-slate-400 mb-6">This college doesn&apos;t exist or may have been removed.</p>
        <Link href="/colleges" className="bg-blue-600 text-white font-bold text-[13px] px-5 py-2.5 rounded-[12px] hover:bg-blue-500 transition-colors">
          Browse All Colleges
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'courses',   label: `Courses & Fees (${college.courses?.length || 0})` },
    { id: 'admission', label: 'Admission' },
  ] as const;

  const tabColor = (id: string) =>
    id === 'overview' ? '#67e8f9' : id === 'courses' ? '#6ee7b7' : '#c4b5fd';
  const tabUnderline = (id: string) =>
    id === 'overview' ? '#22d3ee' : id === 'courses' ? '#34d399' : '#8b5cf6';

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ══════════════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-[11px] text-white/45 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/colleges" className="hover:text-white transition-colors">Colleges</Link>
              <ChevronRight size={10} />
              <span className="text-white/75 truncate max-w-[200px]">{college.name}</span>
            </div>
            <Link href="/colleges"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white border border-white/15 hover:bg-white/5 px-3 py-2 rounded-[11px] transition-all duration-200 flex-shrink-0">
              <ArrowLeft size={12} /> Back
            </Link>
          </div>

          {/* College hero row */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Image */}
            <div className="relative w-full lg:w-[280px] h-[180px] lg:h-[190px] rounded-[20px] overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10">
              {college.image ? (
                <Image src={getAssetUrl(college.image)} alt={college.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-full opacity-20">
                  <GraduationCap size={48} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Accreditation badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {college.naac && (() => {
                  const s = getAccreditationStyle(`NAAC ${college.naac}`);
                  return (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                      NAAC {college.naac}
                    </span>
                  );
                })()}
                {college.type && (() => {
                  const ts = getTypeStyle(college.type!);
                  return (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize border"
                      style={{ background: ts.bg, color: ts.text, borderColor: ts.border }}>
                      {college.type}
                    </span>
                  );
                })()}
                {college.accreditations?.map(a => {
                  const s = getAccreditationStyle(a);
                  return (
                    <span key={a} className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                      {a}
                    </span>
                  );
                })}
              </div>

              <h1 className="text-[clamp(20px,3vw,32px)] font-extrabold text-white leading-tight mb-3"
                style={{ fontFamily: 'var(--font-display)' }}>
                {college.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-4">
                {college.locations?.length ? (
                  <div className="flex items-center gap-1.5 text-white/65 text-[12.5px]">
                    <MapPin size={13} /> {college.locations.join(', ')}
                  </div>
                ) : null}
                {college.rating ? (
                  <div className="flex items-center gap-1.5 text-white/65 text-[12.5px]">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-white">{college.rating}</span> / 5.0
                  </div>
                ) : null}
                {college.established ? (
                  <div className="flex items-center gap-1.5 text-white/65 text-[12.5px]">
                    <Calendar size={13} /> Est. {college.established}
                  </div>
                ) : null}
              </div>

              {/* Stream pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {college.streams?.map(s => {
                  const sc = streamColors[s] ?? { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' };
                  return (
                    <span key={s} className="text-[11px] font-bold px-3 py-1 rounded-full border border-white/10"
                      style={{ background: sc.bg, color: sc.color }}>
                      {s}
                    </span>
                  );
                })}
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setEnquiryOpen(true)}
                  className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 px-3.5 py-2.5 rounded-[11px] transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                  Get Free Counselling
                </button>
                {college.CollegeLink && (
                  <a href={college.CollegeLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white border border-white/15 hover:bg-white/5 px-3.5 py-2.5 rounded-[11px] transition-all duration-200 flex-shrink-0">
                    <ExternalLink size={12} /> Official Website
                  </a>
                )}
                <button onClick={handleShare}
                  className="w-9 h-9 flex items-center justify-center text-white border border-white/15 hover:bg-white/5 rounded-[11px] transition-all duration-200 flex-shrink-0">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ──────────────────────────────────────── */}
        <div className="border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const isLocked = !unlocked && tab.id !== 'overview';
              const active   = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                  className="relative text-[13px] font-semibold px-4 py-3.5 transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
                  style={{ color: active ? tabColor(tab.id) : 'rgba(255,255,255,0.55)' }}>
                  {isLocked && <Lock size={10} className="text-slate-500" />}
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                      style={{ backgroundColor: tabUnderline(tab.id) }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════ */}
      <div className="bg-slate-950 min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ── Main content ─────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  {college.highlights?.length ? (
                    <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                      <SectionHeading><Award size={18} className="text-blue-400" /> College Highlights</SectionHeading>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {college.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle size={11} className="text-blue-400" strokeWidth={2.5} />
                            </div>
                            <span className="text-[13px] text-slate-300 leading-relaxed">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(college.overview?.heading || college.overview?.description) && (
                    <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                      <SectionHeading>
                        <BookOpen size={18} className="text-blue-400" />
                        {college.overview?.heading || 'About the College'}
                      </SectionHeading>
                      <p className="text-[13.5px] text-slate-300 leading-[1.8] mb-5">{college.overview?.description}</p>
                      {college.overview?.points?.length ? (
                        <div className="flex flex-col gap-4 mt-4 border-t border-white/10 pt-5">
                          {college.overview.points.map((pt, i) => (
                            <div key={i}>
                              <h4 className="font-bold text-[13.5px] text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                                {pt.heading}
                              </h4>
                              <p className="text-[13px] text-slate-400 leading-relaxed">{pt.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: BookOpen, label: 'Courses',     value: college.courses?.length || 0 },
                      { icon: Award,    label: 'NAAC Grade',  value: college.naac || '—' },
                      { icon: Calendar, label: 'Established', value: college.established || '—' },
                      { icon: Star,     label: 'Rating',      value: college.rating ? `${college.rating}/5` : '—' },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="bg-[#0f172a]/80 rounded-[16px] border border-white/10 p-4 text-center shadow-sm backdrop-blur-xl">
                          <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2">
                            <Icon size={16} className="text-blue-400" strokeWidth={1.8} />
                          </div>
                          <div className="font-extrabold text-[16px] text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            {item.value}
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">{item.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Downloads */}
                  {(college.brochure || college.feeStructureDoc) && (
                    <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-5 shadow-sm backdrop-blur-xl">
                      <SectionHeading><Download size={18} className="text-blue-400" /> Downloads</SectionHeading>
                      <div className="flex flex-wrap gap-3">
                        {college.brochure && (
                          <button onClick={() => openDownload('brochure', college.brochure!)}
                            className="flex items-center gap-2.5 text-[13px] font-semibold text-white bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 px-4 py-3 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5">
                            <Download size={14} strokeWidth={2.5} className="text-blue-400" /> Download Brochure
                          </button>
                        )}
                        {college.feeStructureDoc && (
                          <button onClick={() => openDownload('fee-structure', college.feeStructureDoc!)}
                            className="flex items-center gap-2.5 text-[13px] font-semibold text-white bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-4 py-3 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5">
                            <Download size={14} strokeWidth={2.5} className="text-emerald-400" /> Fee Structure PDF
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* COURSES TAB */}
              {activeTab === 'courses' && (
                unlocked ? (
                  <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                    <SectionHeading><GraduationCap size={18} className="text-blue-400" /> Courses &amp; Fees</SectionHeading>
                    {college.courses?.length ? (
                      <CourseTable courses={college.courses} />
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-[13px]">Course details not yet added.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <TabLockPrompt
                    collegeName={college.name}
                    tabLabel={`Courses (${college.courses?.length || 0})`}
                    onUnlockClick={() => setGateOpen(true)}
                  />
                )
              )}

              {/* ADMISSION TAB */}
              {activeTab === 'admission' && (
                unlocked ? (
                  <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                    <SectionHeading><Award size={18} className="text-blue-400" /> Admission Process</SectionHeading>
                    <div className="flex flex-col gap-4 mb-7">
                      {[
                        { step: '01', title: 'Check Eligibility',     desc: 'Verify minimum marks, entrance exam scores, and category requirements for your chosen course.' },
                        { step: '02', title: 'Apply Online',           desc: 'Fill the application form on the official college portal or through our counsellors.' },
                        { step: '03', title: 'Document Submission',    desc: 'Submit mark sheets, ID proof, passport photos, category certificates if applicable.' },
                        { step: '04', title: 'Counselling & Seat',     desc: 'Attend counselling round, pay seat confirmation fee, and secure your admission.' },
                      ].map(s => (
                        <div key={s.step} className="flex gap-4">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-[13px] text-blue-400 border border-blue-500/20"
                            style={{ background: 'rgba(59,130,246,0.08)', fontFamily: 'var(--font-display)' }}>
                            {s.step}
                          </div>
                          <div className="pt-1">
                            <h4 className="font-bold text-[13.5px] text-white mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h4>
                            <p className="text-[12.5px] text-slate-400 leading-relaxed">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {(college.portalLink || college.portalLinkAC) && (
                      <div className="flex flex-col gap-2 pt-5 border-t border-white/10">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[1px] mb-1">Apply Now</p>
                        {college.portalLink && (
                          <a href={college.portalLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            <ExternalLink size={13} /> Official Admission Portal
                          </a>
                        )}
                        {college.portalLinkAC && (
                          <a href={college.portalLinkAC} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            <ExternalLink size={13} /> Alternate Application Portal
                          </a>
                        )}
                      </div>
                    )}
                    <button onClick={() => setEnquiryOpen(true)}
                      className="mt-6 w-full flex items-center justify-center gap-2 text-[13px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-3.5 rounded-[12px] transition-all duration-200">
                      Get Admission Guidance — Free <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <TabLockPrompt
                    collegeName={college.name}
                    tabLabel="Admission"
                    onUnlockClick={() => setGateOpen(true)}
                  />
                )
              )}
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="lg:col-span-1">
              <SidebarCTA college={college} onEnquiry={() => setEnquiryOpen(true)} onDownload={openDownload} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Gate modal (locked tab click) ─────────────────── */}
      {gateOpen && (
        <EnquiryModal
          isOpen={gateOpen}
          onClose={() => setGateOpen(false)}
          collegeName={college.name}
          collegeId={college._id}
          onSuccess={handleUnlock}
        />
      )}

      {/* ── Sidebar / hero enquiry modal ──────────────────── */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        collegeName={college.name}
        collegeId={college._id}
        onSuccess={handleUnlock}
      />

      {/* ── Download gate modal ───────────────────────────────── */}
      {downloadGateOpen && (
        <EnquiryModal
          isOpen={downloadGateOpen}
          onClose={() => { setDownloadGateOpen(false); setDownloadPending(null); }}
          collegeName={college.name}
          collegeId={college._id}
          onSuccess={handleDownloadUnlock}
          downloadType={downloadPending?.type}
        />
      )}
    </div>
  );
}