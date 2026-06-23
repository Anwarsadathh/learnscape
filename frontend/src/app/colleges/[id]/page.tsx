'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import EnquiryModal from '@/components/EnquiryModal';
import {
  MapPin,
  Star,
  Phone,
  Download,
  ExternalLink,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Building2,
  Calendar,
  Award,
  ChevronRight,
  Share2,
  IndianRupee,
  ArrowLeft,
} from 'lucide-react';

interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
  seats?: number;
  entrance?: string;
}

interface OverviewPoint {
  heading: string;
  description: string;
}

interface College {
  _id: string;
  name: string;
  slug: string;
  streams: string[];
  locations: string[];
  image?: string;
  brochure?: string;
  feeStructureDoc?: string;
  courses: Course[];
  overview?: {
    heading: string;
    description: string;
    points: OverviewPoint[];
  };
  portalLink?: string;
  portalLinkAC?: string;
  CollegeLink?: string;
  rating?: number;
  naac?: string;
  fees?: {
    min: number;
    max: number;
  };
  type?: string;
  established?: number;
  accreditations?: string[];
  highlights?: string[];
  positions?: number;
}

const LEVEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  UG: { bg: '#172554', color: '#93c5fd', border: '#1d4ed8' },
  PG: { bg: '#2e1065', color: '#d8b4fe', border: '#7c3aed' },
  PhD: { bg: '#052e16', color: '#86efac', border: '#16a34a' },
  Diploma: { bg: '#431407', color: '#fdba74', border: '#ea580c' },
  Lateral: { bg: '#083344', color: '#67e8f9', border: '#0891b2' },
};

const ACCREDITATION_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  'NAAC A+': {
    bg: 'rgba(250, 204, 21, 0.14)',
    text: '#fde68a',
    border: 'rgba(250, 204, 21, 0.28)',
  },
  'NAAC A++': {
    bg: 'rgba(245, 158, 11, 0.14)',
    text: '#fcd34d',
    border: 'rgba(245, 158, 11, 0.28)',
  },
  Autonomous: {
    bg: 'rgba(59, 130, 246, 0.14)',
    text: '#93c5fd',
    border: 'rgba(59, 130, 246, 0.28)',
  },
  NBA: {
    bg: 'rgba(168, 85, 247, 0.14)',
    text: '#d8b4fe',
    border: 'rgba(168, 85, 247, 0.28)',
  },
  AICTE: {
    bg: 'rgba(16, 185, 129, 0.14)',
    text: '#86efac',
    border: 'rgba(16, 185, 129, 0.28)',
  },
  UGC: {
    bg: 'rgba(236, 72, 153, 0.14)',
    text: '#f9a8d4',
    border: 'rgba(236, 72, 153, 0.28)',
  },
  NIRF: {
    bg: 'rgba(14, 165, 233, 0.14)',
    text: '#7dd3fc',
    border: 'rgba(14, 165, 233, 0.28)',
  },
};

function getAccreditationStyle(value: string) {
  return (
    ACCREDITATION_STYLES[value?.trim()] || {
      bg: 'rgba(255,255,255,0.08)',
      text: 'rgba(255,255,255,0.88)',
      border: 'rgba(255,255,255,0.12)',
    }
  );
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
  const root = apiUrl.replace(/\/api$/, '');
  return `${root}${path}`;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[18px] font-extrabold text-white mb-5 flex items-center gap-2"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {children}
    </h2>
  );
}

function SidebarCTA({
  college,
  onEnquiry,
  onDownload,
}: {
  college: College;
  onEnquiry: () => void;
  onDownload: (type: 'brochure' | 'fee-structure', url: string) => void;
}) {
  return (
    <div className="bg-[#0f172a]/90 rounded-[22px] border border-white/10 overflow-hidden shadow-2xl sticky top-24 backdrop-blur-xl">
      <div className="px-5 py-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 bg-blue-400/10 border border-blue-400/20 text-blue-300 text-[9px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
          Free Counselling
        </div>

        <h3
          className="text-[16px] font-extrabold text-white leading-snug mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Interested in {college.name.split(' ').slice(0, 3).join(' ')}?
        </h3>

        <p className="text-[11.5px] text-white/55">
          Get expert guidance on admission, fees &amp; eligibility.
        </p>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <button
          onClick={onEnquiry}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-3.5 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
          Get Free Counselling
        </button>

        <a
          href="tel:+918606004306"
          className="w-full flex items-center justify-center gap-2 text-[12.5px] font-semibold text-white border border-white/15 hover:bg-white/5 py-3 rounded-[12px] transition-all duration-200"
        >
          <Phone size={14} strokeWidth={2} /> Call Our Counsellor
        </a>

        <div className="mt-1 flex flex-col gap-2.5 pt-4 border-t border-white/10">
          {college.established ? (
            <div className="flex items-center gap-2.5">
              <Calendar size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">Est. {college.established}</span>
            </div>
          ) : null}

          {college.type ? (
            <div className="flex items-center gap-2.5">
              <Building2 size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300 capitalize">
                {college.type} Institution
              </span>
            </div>
          ) : null}

          {formatFees(college.fees) ? (
            <div className="flex items-center gap-2.5">
              <IndianRupee size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">{formatFees(college.fees)}</span>
            </div>
          ) : null}

          {college.locations?.length ? (
            <div className="flex items-center gap-2.5">
              <MapPin size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-[12px] text-slate-300">{college.locations.join(', ')}</span>
            </div>
          ) : null}
        </div>

        {(college.brochure || college.feeStructureDoc) && (
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
            {college.brochure ? (
              <button
                onClick={() => onDownload('brochure', college.brochure!)}
                className="flex items-center gap-2 text-[11.5px] font-semibold text-blue-400 hover:text-blue-300 transition-colors text-left"
              >
                <Download size={12} strokeWidth={2.5} />
                Download Brochure
              </button>
            ) : null}

            {college.feeStructureDoc ? (
              <button
                onClick={() => onDownload('fee-structure', college.feeStructureDoc!)}
                className="flex items-center gap-2 text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors text-left"
              >
                <Download size={12} strokeWidth={2.5} />
                Fee Structure PDF
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseTable({ courses }: { courses: Course[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? courses : courses.slice(0, 8);

  if (!courses?.length) return null;

  return (
    <div className="overflow-hidden rounded-[16px] border border-white/10 bg-slate-950/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <thead>
            <tr className="bg-white/[0.03]">
              {['Course', 'Level', 'Duration', 'Fees'].map((heading) => (
                <th
                  key={heading}
                  className="px-3 py-2.5 text-[9.5px] font-bold text-slate-400 uppercase tracking-[0.8px] whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visible.map((course, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/[0.03] transition-colors">
                <td className="px-3 py-2.5 max-w-[160px]">
                  <span className="text-[11.5px] font-semibold text-white leading-snug block">
                    {course.name}
                  </span>
                </td>

                <td className="px-3 py-2.5">
                  {course.level ? (
                    <span
                      className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap border"
                      style={{
                        background: LEVEL_COLORS[course.level]?.bg || '#1e293b',
                        color: LEVEL_COLORS[course.level]?.color || '#cbd5e1',
                        borderColor: LEVEL_COLORS[course.level]?.border || '#475569',
                      }}
                    >
                      {course.level}
                    </span>
                  ) : null}
                </td>

                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-[11px] text-slate-400">{course.duration}</span>
                </td>

                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-[11.5px] font-semibold text-emerald-400">{course.fees}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length > 8 && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/[0.03]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[12px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            {showAll ? 'Show less' : `Show all ${courses.length} courses`}
            <ChevronRight size={13} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CollegeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'admission'>('overview');
  const [streamColors, setStreamColors] = useState<Record<string, { bg: string; color: string }>>(
    {}
  );

  useEffect(() => {
    fetch('/api/streams')
      .then((r) => r.json())
      .then((data: Array<{ label: string; color: string; bg: string }>) => {
        if (!Array.isArray(data)) return;
        const map: Record<string, { bg: string; color: string }> = {};
        data.forEach((s) => {
          map[s.label] = { bg: s.bg, color: s.color };
        });
        setStreamColors(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/colleges/${id}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;

        if (data.success && data.data) {
          setCollege(data.data);
          return;
        }

        if (data._id || data.name) {
          setCollege(data);
          return;
        }

        setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const openDownload = (_type: 'brochure' | 'fee-structure', url: string) => {
    const finalUrl = getAssetUrl(url);
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: college?.name, url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      //
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !college) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Building2 size={28} className="text-blue-400" strokeWidth={1.5} />
        </div>

        <h1
          className="text-[22px] font-extrabold text-white mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          College not found
        </h1>

        <p className="text-[13px] text-slate-400 mb-6">
          This college doesn&apos;t exist or may have been removed.
        </p>

        <Link
          href="/colleges"
          className="bg-blue-600 text-white font-bold text-[13px] px-5 py-2.5 rounded-[12px] hover:bg-blue-500 transition-colors"
        >
          Browse All Colleges
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: `Courses (${college.courses?.length || 0})` },
    { id: 'admission', label: 'Admission' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 relative z-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-[11px] text-white/45 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={10} />
              <Link href="/colleges" className="hover:text-white transition-colors">
                Colleges
              </Link>
              <ChevronRight size={10} />
              <span className="text-white/75 truncate max-w-[200px]">{college.name}</span>
            </div>

            <Link
              href="/colleges"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white border border-white/15 hover:bg-white/5 px-3 py-2 rounded-[11px] transition-all duration-200 flex-shrink-0"
            >
              <ArrowLeft size={12} />
              Back
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="relative w-full lg:w-[280px] h-[180px] lg:h-[190px] rounded-[20px] overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10">
              {college.image ? (
                <Image
                  src={getAssetUrl(college.image)}
                  alt={college.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full opacity-20">
                  <GraduationCap size={48} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {college.naac ? (() => {
                  const style = getAccreditationStyle(`NAAC ${college.naac}`);
                  return (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{
                        background: style.bg,
                        color: style.text,
                        borderColor: style.border,
                      }}
                    >
                      NAAC {college.naac}
                    </span>
                  );
                })() : null}

                {college.type ? (
                  <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-1 rounded-full capitalize border border-white/10">
                    {college.type}
                  </span>
                ) : null}

                {college.accreditations?.map((a) => {
                  const style = getAccreditationStyle(a);
                  return (
                    <span
                      key={a}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{
                        background: style.bg,
                        color: style.text,
                        borderColor: style.border,
                      }}
                    >
                      {a}
                    </span>
                  );
                })}
              </div>

              <h1
                className="text-[clamp(20px,3vw,32px)] font-extrabold text-white leading-tight mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {college.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-4">
                {college.locations?.length ? (
                  <div className="flex items-center gap-1.5 text-white/65 text-[12.5px]">
                    <MapPin size={13} />
                    {college.locations.join(', ')}
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
                    <Calendar size={13} />
                    Est. {college.established}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {college.streams?.map((s) => {
                  const sc = streamColors[s] ?? {
                    bg: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.85)',
                  };

                  return (
                    <span
                      key={s}
                      className="text-[11px] font-bold px-3 py-1 rounded-full border border-white/10"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 px-3.5 py-2.5 rounded-[11px] transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                  Get Free Counselling
                </button>

                {college.CollegeLink ? (
                  <a
                    href={college.CollegeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white border border-white/15 hover:bg-white/5 px-3.5 py-2.5 rounded-[11px] transition-all duration-200 flex-shrink-0"
                  >
                    <ExternalLink size={12} />
                    Official Website
                  </a>
                ) : null}

                <button
                  onClick={handleShare}
                  className="w-9 h-9 flex items-center justify-center text-white border border-white/15 hover:bg-white/5 rounded-[11px] transition-all duration-200 flex-shrink-0"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative text-[13px] font-semibold px-4 py-3.5 transition-all duration-200 whitespace-nowrap"
                style={{
                  color: activeTab === tab.id ? '#60a5fa' : 'rgba(255,255,255,0.55)',
                }}
              >
                {tab.label}
                {activeTab === tab.id ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-400 rounded-full" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {activeTab === 'overview' && (
                <>
                  {college.highlights?.length ? (
                    <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                      <SectionHeading>
                        <Award size={18} className="text-blue-400" />
                        College Highlights
                      </SectionHeading>

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

                      <p className="text-[13.5px] text-slate-300 leading-[1.8] mb-5">
                        {college.overview?.description}
                      </p>

                      {college.overview?.points?.length ? (
                        <div className="flex flex-col gap-4 mt-4 border-t border-white/10 pt-5">
                          {college.overview.points.map((pt, i) => (
                            <div key={i}>
                              <h4
                                className="font-bold text-[13.5px] text-white mb-1"
                                style={{ fontFamily: 'var(--font-display)' }}
                              >
                                {pt.heading}
                              </h4>
                              <p className="text-[13px] text-slate-400 leading-relaxed">
                                {pt.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: BookOpen, label: 'Courses', value: college.courses?.length || 0 },
                      { icon: Award, label: 'NAAC Grade', value: college.naac || '—' },
                      { icon: Calendar, label: 'Established', value: college.established || '—' },
                      { icon: Star, label: 'Rating', value: college.rating ? `${college.rating}/5` : '—' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="bg-[#0f172a]/80 rounded-[16px] border border-white/10 p-4 text-center shadow-sm backdrop-blur-xl"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-2">
                            <Icon size={16} className="text-blue-400" strokeWidth={1.8} />
                          </div>

                          <div
                            className="font-extrabold text-[16px] text-white"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {item.value}
                          </div>

                          <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                            {item.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(college.brochure || college.feeStructureDoc) && (
                    <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-5 shadow-sm backdrop-blur-xl">
                      <SectionHeading>
                        <Download size={18} className="text-blue-400" />
                        Downloads
                      </SectionHeading>

                      <div className="flex flex-wrap gap-3">
                        {college.brochure ? (
                          <button
                            onClick={() => openDownload('brochure', college.brochure!)}
                            className="flex items-center gap-2.5 text-[13px] font-semibold text-white bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 px-4 py-3 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5"
                          >
                            <Download size={14} strokeWidth={2.5} className="text-blue-400" />
                            Download Brochure
                          </button>
                        ) : null}

                        {college.feeStructureDoc ? (
                          <button
                            onClick={() => openDownload('fee-structure', college.feeStructureDoc!)}
                            className="flex items-center gap-2.5 text-[13px] font-semibold text-white bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-4 py-3 rounded-[12px] transition-all duration-200 hover:-translate-y-0.5"
                          >
                            <Download size={14} strokeWidth={2.5} className="text-emerald-400" />
                            Fee Structure PDF
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'courses' && (
                <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                  <SectionHeading>
                    <GraduationCap size={18} className="text-blue-400" />
                    Courses &amp; Fees
                  </SectionHeading>

                  {college.courses?.length ? (
                    <CourseTable courses={college.courses} />
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-[13px]">Course details not yet added.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'admission' && (
                <div className="bg-[#0f172a]/80 rounded-[20px] border border-white/10 p-6 shadow-sm backdrop-blur-xl">
                  <SectionHeading>
                    <Award size={18} className="text-blue-400" />
                    Admission Process
                  </SectionHeading>

                  <div className="flex flex-col gap-4 mb-7">
                    {[
                      {
                        step: '01',
                        title: 'Check Eligibility',
                        desc: 'Verify minimum marks, entrance exam scores, and category requirements for your chosen course.',
                      },
                      {
                        step: '02',
                        title: 'Apply Online',
                        desc: 'Fill the application form on the official college portal or through our counsellors.',
                      },
                      {
                        step: '03',
                        title: 'Document Submission',
                        desc: 'Submit mark sheets, ID proof, passport photos, category certificates if applicable.',
                      },
                      {
                        step: '04',
                        title: 'Counselling & Seat',
                        desc: 'Attend counselling round, pay seat confirmation fee, and secure your admission.',
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-[13px] text-blue-400 border border-blue-500/20"
                          style={{ background: 'rgba(59,130,246,0.08)', fontFamily: 'var(--font-display)' }}
                        >
                          {s.step}
                        </div>

                        <div className="pt-1">
                          <h4
                            className="font-bold text-[13.5px] text-white mb-0.5"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {s.title}
                          </h4>
                          <p className="text-[12.5px] text-slate-400 leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(college.portalLink || college.portalLinkAC) && (
                    <div className="flex flex-col gap-2 pt-5 border-t border-white/10">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[1px] mb-1">
                        Apply Now
                      </p>

                      {college.portalLink ? (
                        <a
                          href={college.portalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink size={13} />
                          Official Admission Portal
                        </a>
                      ) : null}

                      {college.portalLinkAC ? (
                        <a
                          href={college.portalLinkAC}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink size={13} />
                          Alternate Application Portal
                        </a>
                      ) : null}
                    </div>
                  )}

                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="mt-6 w-full flex items-center justify-center gap-2 text-[13px] font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 py-3.5 rounded-[12px] transition-all duration-200"
                  >
                    Get Admission Guidance — Free <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <SidebarCTA
                college={college}
                onEnquiry={() => setEnquiryOpen(true)}
                onDownload={openDownload}
              />
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        collegeName={college.name}
        collegeId={college._id}
      />
    </div>
  );
}