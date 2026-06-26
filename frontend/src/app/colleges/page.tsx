'use client';
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Star,
  GraduationCap,
  X,
  Loader2,
  BookOpen,
  Bookmark,
  Grid3X3,
  List,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';

// ─── Same static stream list as the admin add-college page ──────────
const STREAMS = [
  'Engineering',
  'Medical Science',
  'Management',
  'Commerce',
  'Arts and Humanities',
  'Paramedical',
  'Law',
  'Design',
  'Science',
  'Agriculture',
  'Dental',
];

const STREAMS_PER_PAGE = 6;
const STREAM_TOTAL_PAGES = Math.ceil(STREAMS.length / STREAMS_PER_PAGE);

// Optional per-stream colour accents (matches what /api/streams returns)
const STREAM_COLORS: Record<string, { bg: string; color: string }> = {
  'Engineering':        { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa' },
  'Medical Science':    { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  'Management':         { bg: 'rgba(168,85,247,0.12)',  color: '#c084fc' },
  'Commerce':           { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  'Arts and Humanities':{ bg: 'rgba(236,72,153,0.12)',  color: '#f472b6' },
  'Paramedical':        { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf' },
  'Law':                { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  'Design':             { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c' },
  'Science':            { bg: 'rgba(16,185,129,0.12)',  color: '#34d399' },
  'Agriculture':        { bg: 'rgba(132,204,22,0.12)',  color: '#a3e635' },
  'Dental':             { bg: 'rgba(14,165,233,0.12)',  color: '#38bdf8' },
};

function getStreamStyle(label: string, active: boolean) {
  const c = STREAM_COLORS[label];
  if (active && c) return { background: c.bg, color: c.color, borderColor: `${c.color}44` };
  if (active)      return { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' };
  return { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' };
}

// ─── Types ──────────────────────────────────────────────────────────
interface College {
  _id: string;
  name: string;
  image?: string;
  locations: string[];
  streams: string[];
  courses: Course[];
  rating?: number;
  positions: number;
  naac?: string;
  type?: string;
  established?: number;
  fees?: { min: number; max: number };
  accreditations?: string[];
  overview?: {
    heading: string;
    description: string;
    points: Array<{ heading: string; description: string }>;
  };
  brochure?: string;
  feeStructureDoc?: string;
  portalLink?: string;
}

interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
}

// ─── Helpers ────────────────────────────────────────────────────────
function getAssetUrl(path?: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
  return apiUrl.replace(/\/api$/, '') + path;
}

function formatFees(fees?: { min: number; max: number }) {
  if (!fees || (!fees.min && !fees.max)) return null;
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
      : `₹${(n / 1000).toFixed(0)}K`;
  if (fees.min && fees.max) return `${fmt(fees.min)} – ${fmt(fees.max)}/yr`;
  return `${fmt(fees.min || fees.max)}/yr`;
}

// ─── Loading states ──────────────────────────────────────────────────
function CollegesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Loading colleges…</p>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-[#0f172a]/80 rounded-[18px] border border-white/10 overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-800/60" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-800 rounded-full w-16" />
          <div className="h-5 bg-slate-800 rounded-full w-20" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-8 bg-slate-800 rounded-xl flex-1" />
          <div className="h-8 bg-slate-800 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Main content ────────────────────────────────────────────────────
function CollegesContent() {
  const [colleges, setColleges]               = useState<College[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [modalOpen, setModalOpen]             = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<{ id: string; name: string } | null>(null);
  const [viewMode, setViewMode]               = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy]                   = useState<'name' | 'ranking' | 'rating'>('ranking');
  const [savedColleges, setSavedColleges]     = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const [totalColleges, setTotalColleges]     = useState(0);

  // ── Stream carousel state ─────────────────────────────────────────
  const [streamPage, setStreamPage]     = useState(0);
  const [streamVisible, setStreamVisible] = useState(true);
  const [isPaused, setIsPaused]         = useState(false);

  const pageSize = 12;
  const searchParams = useSearchParams();

  // ── Stream carousel logic ─────────────────────────────────────────
  const goToStreamPage = useCallback((index: number) => {
    setStreamVisible(false);
    setTimeout(() => {
      setStreamPage(index);
      setStreamVisible(true);
    }, 350);
  }, []);

  // Auto-rotate every 3.5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStreamVisible(false);
      setTimeout(() => {
        setStreamPage(p => (p + 1) % STREAM_TOTAL_PAGES);
        setStreamVisible(true);
      }, 350);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const visibleStreams = STREAMS.slice(
    streamPage * STREAMS_PER_PAGE,
    (streamPage + 1) * STREAMS_PER_PAGE
  );

  // ── Fetch colleges ─────────────────────────────────────────────
  const fetchColleges = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (searchQuery) params.set('search', searchQuery);
      if (selectedStreams.length) params.set('stream', selectedStreams.join(','));
      if (selectedLocations.length) params.set('location', selectedLocations.join(','));
      params.set('sort', sortBy);

      const res  = await fetch(`${API_URL}/colleges?${params}`);
      const data = await res.json();

      if (data.success) {
        setColleges(data.data || []);
        setCurrentPage(page);
        setTotalPages(
          data.pagination?.totalPages ||
          Math.ceil((data.total || data.data?.length || 0) / pageSize) || 1
        );
        setTotalColleges(data.pagination?.total || data.total || data.data?.length || 0);

        // Build deduplicated location list from first page results
        if (page === 1) {
          const all: string[] = data.data?.flatMap((c: College) => c.locations || []) || [];
          setAvailableLocations(
            Array.from(new Set(all.map((l: string) => l.trim()).filter(Boolean))) as string[]
          );
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStreams, selectedLocations, sortBy]);

  useEffect(() => { fetchColleges(1); }, [fetchColleges]);

  // Initialise from URL params
  useEffect(() => {
    const s = searchParams.get('stream');
    const l = searchParams.get('location');
    const q = searchParams.get('q');
    if (s) setSelectedStreams(s.split(','));
    if (l) setSelectedLocations(l.split(','));
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // ── Pagination helpers ─────────────────────────────────────────
  const handlePageClick = (page: number) => {
    fetchColleges(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // ── Filter helpers ─────────────────────────────────────────────
  const toggleStream   = (s: string) =>
    setSelectedStreams(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleLocation = (l: string) =>
    setSelectedLocations(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const clearAll = () => { setSelectedStreams([]); setSelectedLocations([]); setSearchQuery(''); setCurrentPage(1); };

  const activeFilterCount = selectedStreams.length + selectedLocations.length + (searchQuery ? 1 : 0);

  // ── Shared filter panel (desktop sidebar + mobile drawer) ───────
  const FilterPanel = () => (
    <div className="flex flex-col gap-6">

      {/* Sort */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[1.2px] mb-2">Sort By</p>
        <div className="flex flex-col gap-0.5">
          {(['ranking', 'name', 'rating'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => { setSortBy(opt); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[12.5px] font-semibold transition-all text-left border ${
                sortBy === opt
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-transparent'
              }`}
            >
              <ArrowUpDown size={11} />
              {opt === 'ranking' ? 'By Ranking' : opt === 'name' ? 'By Name' : 'By Rating'}
            </button>
          ))}
        </div>
      </div>

      {/* Streams — exact same list as admin add-college page */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[1.2px] mb-2 flex items-center gap-1.5">
          <GraduationCap size={10} className="text-blue-400" /> Streams
        </p>
        <div className="flex flex-col gap-0.5">
          {STREAMS.map(s => {
            const active = selectedStreams.includes(s);
            const c = STREAM_COLORS[s];
            return (
              <label
                key={s}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[12px] font-medium transition-all cursor-pointer ${
                  active ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                }`}
              >
                {/* Custom styled checkbox */}
                <span className="relative flex-shrink-0 w-4 h-4">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleStream(s)}
                    className="sr-only"
                  />
                  <span
                    className="block w-4 h-4 rounded-[4px] border transition-all"
                    style={
                      active && c
                        ? { background: c.bg, borderColor: c.color }
                        : { background: 'transparent', borderColor: '#475569' }
                    }
                  />
                  {active && (
                    <svg
                      className="absolute inset-0 w-4 h-4 p-[3px]"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke={c?.color ?? '#60a5fa'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span style={{ color: active ? (c?.color ?? '#60a5fa') : 'rgba(255,255,255,0.55)' }}>
                  {s}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Locations */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[1.2px] mb-2 flex items-center gap-1.5">
          <MapPin size={10} className="text-emerald-400" /> Locations
        </p>
        <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
          {availableLocations.map(loc => {
            const active = selectedLocations.includes(loc);
            return (
              <label
                key={loc}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[12px] font-medium transition-all cursor-pointer ${
                  active ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                }`}
              >
                {/* Custom styled checkbox */}
                <span className="relative flex-shrink-0 w-4 h-4">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleLocation(loc)}
                    className="sr-only"
                  />
                  <span
                    className="block w-4 h-4 rounded-[4px] border transition-all"
                    style={
                      active
                        ? { background: 'rgba(16,185,129,0.15)', borderColor: '#34d399' }
                        : { background: 'transparent', borderColor: '#475569' }
                    }
                  />
                  {active && (
                    <svg
                      className="absolute inset-0 w-4 h-4 p-[3px]"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#34d399"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span style={{ color: active ? '#34d399' : 'rgba(255,255,255,0.55)' }}>
                  {loc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white/[0.03] rounded-[12px] border border-white/10 p-3.5 flex flex-col gap-2">
        {[
          { label: 'Total Colleges', value: totalColleges,              color: 'text-blue-400'   },
          { label: 'Page',           value: `${currentPage}/${totalPages}`, color: 'text-purple-400' },
          { label: 'Showing',        value: colleges.length,            color: 'text-emerald-400'},
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">{row.label}</span>
            <span className={`text-[13px] font-extrabold ${row.color}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── College card ────────────────────────────────────────────────
  const CollegeCard = ({ college }: { college: College }) => {
    const saved = savedColleges.has(college._id);
    return (
      <div className="group bg-[#0f172a]/80 rounded-[18px] border border-white/10 overflow-hidden shadow-sm hover:shadow-blue-500/10 hover:border-white/[0.18] transition-all duration-300 backdrop-blur-xl flex flex-col">
        {/* Image */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          {college.image ? (
            <Image
              src={getAssetUrl(college.image)}
              alt={college.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <GraduationCap size={36} className="text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          {/* Rank badge */}
          <div className="absolute top-2.5 left-2.5 bg-slate-950/80 border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            #{college.positions}
          </div>

          {/* NAAC badge */}
          {college.naac && (
            <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
              <Award size={8} /> NAAC {college.naac}
            </div>
          )}

          {/* Save */}
          <button
            onClick={() =>
              setSavedColleges(prev => {
                const s = new Set(prev);
                s.has(college._id) ? s.delete(college._id) : s.add(college._id);
                return s;
              })
            }
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-slate-950/70 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <Bookmark size={12} className={saved ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5 flex flex-col flex-1 gap-2.5">
          <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
            {college.name}
          </h3>

          {/* Location — single line, comma-separated */}
          {college.locations?.length ? (
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-slate-500 flex-shrink-0" />
              <span className="text-[11.5px] text-slate-400 truncate">
                {college.locations.join(', ')}
              </span>
            </div>
          ) : null}

          {/* Rating + fees */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {college.rating ? (
              <div className="flex items-center gap-1">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[12px] font-bold text-white">{college.rating}</span>
                <span className="text-[10.5px] text-slate-500">/5</span>
              </div>
            ) : null}
            {formatFees(college.fees) && (
              <span className="text-[11px] font-semibold text-emerald-400">
                {formatFees(college.fees)}
              </span>
            )}
          </div>

          {/* Streams — coloured, same palette as sidebar */}
          <div className="flex flex-wrap gap-1">
            {college.streams.slice(0, 2).map(s => {
              const c = STREAM_COLORS[s];
              return (
                <span
                  key={s}
                  className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border"
                  style={
                    c
                      ? { background: c.bg, color: c.color, borderColor: `${c.color}44` }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.1)' }
                  }
                >
                  {s.length > 13 ? s.slice(0, 13) + '…' : s}
                </span>
              );
            })}
            {college.streams.length > 2 && (
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-500 border border-white/10">
                +{college.streams.length - 2}
              </span>
            )}
          </div>

          {/* Courses count */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <BookOpen size={10} />
            <span className="text-[11px]">{college.courses?.length || 0} Courses</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-1">
            <Link
              href={`/colleges/${college._id}`}
              className="flex-1 text-center text-[11.5px] font-semibold text-white border border-white/15 hover:bg-white/[0.06] py-2.5 rounded-[10px] transition-all"
            >
              View Details
            </Link>
            <button
              onClick={() => { setSelectedCollege({ id: college._id, name: college.name }); setModalOpen(true); }}
              className="flex-1 text-center text-[11.5px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-2.5 rounded-[10px] transition-all hover:-translate-y-0.5"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── List row ─────────────────────────────────────────────────────
  const CollegeRow = ({ college }: { college: College }) => (
    <div className="group bg-[#0f172a]/80 rounded-[16px] border border-white/10 p-4 hover:border-white/[0.18] transition-all duration-200 backdrop-blur-xl flex items-center gap-4">
      <div className="relative w-[72px] h-[72px] rounded-[12px] overflow-hidden flex-shrink-0 bg-slate-800">
        {college.image ? (
          <Image src={getAssetUrl(college.image)} alt={college.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={24} className="text-slate-600" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-0.5">
          <h3 className="text-[13.5px] font-bold text-white group-hover:text-blue-400 transition-colors leading-snug truncate">
            {college.name}
          </h3>
          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">#{college.positions}</span>
        </div>
        {college.locations?.length ? (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={10} className="text-slate-500" />
            <span className="text-[11px] text-slate-400 truncate">{college.locations.join(', ')}</span>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-1">
          {college.streams.slice(0, 3).map(s => {
            const c = STREAM_COLORS[s];
            return (
              <span
                key={s}
                className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border"
                style={c ? { background: c.bg, color: c.color, borderColor: `${c.color}44` } : { background: 'rgba(255,255,255,0.06)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {college.rating ? (
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[12px] font-bold text-white">{college.rating}</span>
          </div>
        ) : null}
        <Link href={`/colleges/${college._id}`} className="text-[11.5px] font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap transition-colors">
          View →
        </Link>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero header ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-400/10 border border-blue-400/20 text-blue-300 text-[10px] font-bold tracking-[1.4px] uppercase px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Premier Colleges Platform
          </div>

          <h1
            className="text-[clamp(26px,4vw,48px)] font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Explore Top{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Colleges & Universities
            </span>
          </h1>

          <p className="text-slate-400 text-[14px] mb-8 max-w-xl mx-auto">
            Discover {totalColleges > 0 ? `${totalColleges}+` : ''} premier institutions across India
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[18px] border border-white/10 p-2 flex items-center gap-2 shadow-2xl shadow-blue-500/5">
              <Search size={15} className="text-slate-500 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') fetchColleges(1); }}
                placeholder="Search colleges, courses, locations…"
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-[13.5px] focus:outline-none py-2.5"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white p-1">
                  <X size={13} />
                </button>
              )}
              <button
                onClick={() => fetchColleges(1)}
                className="flex-shrink-0 flex items-center gap-1.5 text-[12.5px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 px-4 py-2.5 rounded-[12px] transition-all hover:-translate-y-0.5"
              >
                <Search size={13} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* ── Stream pill carousel — all streams, 6 at a time, auto-rotating ── */}
            <div
              className="mt-5"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Pills container with fade + slide animation */}
              <div
                style={{
                  opacity: streamVisible ? 1 : 0,
                  transform: streamVisible ? 'translateY(0px)' : 'translateY(-8px)',
                  transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                  minHeight: '36px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {visibleStreams.map(s => {
                  const active = selectedStreams.includes(s);
                  const c = STREAM_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStream(s)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                      style={getStreamStyle(s, active)}
                    >
                      {/* Coloured dot accent */}
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                        style={{ background: c?.color ?? '#60a5fa', opacity: active ? 1 : 0.5 }}
                      />
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Page indicator dots + label */}
              <div className="flex flex-col items-center gap-2 mt-4">
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: STREAM_TOTAL_PAGES }).map((_, i) => {
                    const isActive = i === streamPage;
                    const c = STREAM_COLORS[STREAMS[i * STREAMS_PER_PAGE]];
                    return (
                      <button
                        key={i}
                        onClick={() => goToStreamPage(i)}
                        title={`Show streams ${i * STREAMS_PER_PAGE + 1}–${Math.min((i + 1) * STREAMS_PER_PAGE, STREAMS.length)}`}
                        style={{
                          width: isActive ? '22px' : '7px',
                          height: '7px',
                          borderRadius: '999px',
                          background: isActive
                            ? (c?.color ?? '#60a5fa')
                            : 'rgba(255,255,255,0.15)',
                          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s ease',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Subtle label */}
                <p
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {streamPage * STREAMS_PER_PAGE + 1}–{Math.min((streamPage + 1) * STREAMS_PER_PAGE, STREAMS.length)} of {STREAMS.length} streams · hover to pause
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-[#0f172a]/80 rounded-[14px] border border-white/10 px-4 py-3 backdrop-blur-xl">
          <div className="text-[13px]">
            {loading ? (
              <span className="flex items-center gap-2 text-slate-400">
                <Loader2 size={13} className="animate-spin text-blue-400" /> Loading…
              </span>
            ) : (
              <span className="text-white font-semibold">
                {colleges.length} <span className="text-slate-400 font-normal">of {totalColleges} colleges</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle — visible on all screens */}
            <div className="flex items-center bg-slate-800/60 rounded-[10px] p-1 border border-white/10">
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`p-1.5 rounded-[8px] transition-all ${
                    viewMode === v ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {v === 'grid' ? <Grid3X3 size={13} /> : <List size={13} />}
                </button>
              ))}
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold text-white border border-white/15 hover:bg-white/[0.06] px-3 py-2 rounded-[10px] transition-all"
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">Active:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-full">
                <Search size={10} />&ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}><X size={10} className="hover:text-red-400" /></button>
              </span>
            )}
            {selectedStreams.map(s => {
              const c = STREAM_COLORS[s];
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border"
                  style={c ? { background: c.bg, color: c.color, borderColor: `${c.color}44` } : { background: 'rgba(255,255,255,0.06)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  {s}
                  <button onClick={() => toggleStream(s)}><X size={10} /></button>
                </span>
              );
            })}
            {selectedLocations.map(l => (
              <span key={l} className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                <MapPin size={10} />{l}
                <button onClick={() => toggleLocation(l)}><X size={10} /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-[11.5px] font-semibold text-red-400 hover:text-red-300 ml-1 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="flex gap-6 items-start">

          {/* ── Desktop sidebar ── sticky stays below navbar ─────── */}
          <aside className="hidden lg:block w-[220px] xl:w-[240px] flex-shrink-0">
            <div
              className="bg-[#0f172a]/90 rounded-[18px] border border-white/10 p-4 backdrop-blur-xl shadow-sm overflow-y-auto"
              style={{ position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 96px)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[13.5px] font-extrabold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <SlidersHorizontal size={13} className="text-blue-400" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-[10.5px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                    <X size={10} /> Clear
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Cards ────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-12 text-center backdrop-blur-xl">
                <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 size={26} className="text-slate-600" />
                </div>
                <h3 className="text-[17px] font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  No colleges found
                </h3>
                <p className="text-slate-400 text-[13px] mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 px-5 py-2.5 rounded-[12px] transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* 4 columns on XL, 3 on LG, 2 on SM */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {colleges.map(c => <CollegeCard key={c._id} college={c} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {colleges.map(c => <CollegeRow key={c._id} college={c} />)}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-[12px] text-slate-500">
                      Showing{' '}
                      <span className="text-white font-semibold">{(currentPage - 1) * pageSize + 1}</span>
                      {' – '}
                      <span className="text-white font-semibold">{Math.min(currentPage * pageSize, totalColleges)}</span>
                      {' of '}
                      <span className="text-white font-semibold">{totalColleges}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-white border border-white/15 hover:bg-white/[0.06] px-3 py-2 rounded-[10px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={13} />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {getPageNumbers().map((p, i) =>
                        p === '...' ? (
                          <span key={`e${i}`} className="px-2 text-slate-500 text-[12px]">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => handlePageClick(p as number)}
                            className={`w-8 h-8 text-[12px] font-bold rounded-[9px] transition-all ${
                              currentPage === p
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'text-slate-400 border border-white/10 hover:bg-white/[0.06] hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-white border border-white/15 hover:bg-white/[0.06] px-3 py-2 rounded-[10px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span>Go to page</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        defaultValue={currentPage}
                        onBlur={e => {
                          const v = parseInt(e.target.value);
                          if (v >= 1 && v <= totalPages) handlePageClick(v);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const v = parseInt((e.target as HTMLInputElement).value);
                            if (v >= 1 && v <= totalPages) handlePageClick(v);
                          }
                        }}
                        className="w-12 text-center bg-slate-900 border border-white/10 text-white rounded-[8px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                      />
                      <span>of {totalPages}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────────────── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-slate-950 border-r border-white/10 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-[14px] font-extrabold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <SlidersHorizontal size={14} className="text-blue-400" /> Filters
              </h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel />
            </div>
            <div className="p-4 border-t border-white/10 flex gap-3">
              <button onClick={clearAll} className="flex-1 text-[12.5px] font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 py-2.5 rounded-[10px] transition-all">
                Clear All
              </button>
              <button onClick={() => { fetchColleges(1); setIsFilterOpen(false); }} className="flex-1 text-[12.5px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-2.5 rounded-[10px] transition-all">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry modal */}
      {modalOpen && selectedCollege && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedCollege(null); }}
          collegeName={selectedCollege.name}
          collegeId={selectedCollege.id}
        />
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegesLoading />}>
      <CollegesContent />
    </Suspense>
  );
}