'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../../components/admin/AdminLayout';
import {
  ChevronLeft, Plus, Trash2, Loader2,
  CheckCircle, AlertCircle, Upload, X, GraduationCap, Link2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface Course {
  name: string; level: string; duration: string;
  fees: string; seats: string; entrance: string;
}
interface OverviewPoint { heading: string; description: string; }
interface CollegeForm {
  name: string; slug: string;
  streams: string[]; locations: string;
  positions: string; naac: string; rating: string;
  type: string; established: string;
  accreditations: string; highlights: string;
  CollegeLink: string; portalLink: string; portalLinkAC: string;
  fees: { min: string; max: string };
  overview: { heading: string; description: string; points: OverviewPoint[] };
  courses: Course[];
  // URL fields for media (used when user picks URL mode)
  imageUrl: string;
  brochureUrl: string;
  feeStructureUrl: string;
}

// ─── Constants ───────────────────────────────────────────────
const STREAMS = [
  'Engineering', 'Medical Science', 'Management', 'Commerce',
  'Arts and Humanities', 'Paramedical', 'Law', 'Design',
  'Science', 'Agriculture', 'Dental',
];
const COL_TYPES  = ['private', 'government', 'deemed', 'autonomous'];
const LEVELS     = ['UG', 'PG', 'PhD', 'Diploma', 'Lateral'];
const EMPTY_COURSE: Course = { name: '', level: 'UG', duration: '', fees: '', seats: '', entrance: '' };
const EMPTY_POINT: OverviewPoint = { heading: '', description: '' };

// ─── Shared Input Styles ─────────────────────────────────────
const inp = 'w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 text-sm transition-colors';
const lbl = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5';

// ─── Section Card ────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 space-y-5">
      <h2 className="text-[15px] font-semibold text-white border-b border-slate-700/60 pb-3 flex items-center gap-2">
        {icon && <span className="text-blue-400">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── File/URL Upload Field ────────────────────────────────────
type MediaMode = 'upload' | 'url';

interface MediaFieldProps {
  label: string;
  accept: string;
  file: File | null;
  urlValue: string;
  mode: MediaMode;
  preview?: string; // only for image
  onFileChange: (f: File | null) => void;
  onUrlChange: (v: string) => void;
  onModeChange: (m: MediaMode) => void;
  fileInputClass: string;
  inpClass: string;
  lblClass: string;
}

function MediaField({
  label, accept, file, urlValue, mode, preview,
  onFileChange, onUrlChange, onModeChange,
  fileInputClass, inpClass, lblClass,
}: MediaFieldProps) {
  const isImage = accept.startsWith('image');

  return (
    <div>
      {/* Label + Toggle */}
      <div className="flex items-center justify-between mb-1.5">
        <label className={`${lblClass} mb-0`}>{label}</label>
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden text-[10px] font-bold">
          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-2.5 h-2.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => onModeChange('url')}
            className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-2.5 h-2.5" /> URL
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        /* ── URL Mode ── */
        <div className="space-y-2">
          <input
            type="url"
            value={urlValue}
            onChange={e => onUrlChange(e.target.value)}
            placeholder={isImage ? 'https://example.com/image.jpg' : 'https://example.com/file.pdf'}
            className={inpClass}
          />
          {isImage && urlValue && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlValue}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                onClick={() => onUrlChange('')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
          {!isImage && urlValue && (
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-[11px] text-green-400 font-semibold">✓ URL set</span>
              <span className="text-[11px] text-slate-400 truncate flex-1">{urlValue}</span>
              <button onClick={() => onUrlChange('')} className="text-red-400 hover:text-red-300 ml-1 flex-shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Upload Mode ── */
        <div className="space-y-2">
          {isImage ? (
            preview ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                <button
                  onClick={() => onFileChange(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">No image selected</span>
              </div>
            )
          ) : (
            <div className="w-full h-20 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
              {file ? (
                <div className="text-center px-3">
                  <p className="text-xs text-green-400 font-semibold mb-0.5">✓ Selected</p>
                  <p className="text-[11px] text-slate-400 break-all">{file.name}</p>
                  <button onClick={() => onFileChange(null)} className="mt-1 text-[11px] text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">No file selected</span>
                </>
              )}
            </div>
          )}
          <input
            type="file"
            accept={accept}
            onChange={e => onFileChange(e.target.files?.[0] || null)}
            className={fileInputClass}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function AddCollegePage() {
  const router = useRouter();

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  // File states
  const [imageFile,        setImageFile]        = useState<File | null>(null);
  const [brochureFile,     setBrochureFile]     = useState<File | null>(null);
  const [feeStructureFile, setFeeStructureFile] = useState<File | null>(null);
  const [imagePreview,     setImagePreview]     = useState('');

  // Media mode states
  const [imageMode,        setImageMode]        = useState<MediaMode>('upload');
  const [brochureMode,     setBrochureMode]     = useState<MediaMode>('upload');
  const [feeStructureMode, setFeeStructureMode] = useState<MediaMode>('upload');

  const [form, setForm] = useState<CollegeForm>({
    name: '', slug: '', streams: [], locations: '',
    positions: '', naac: '', rating: '', type: 'private', established: '',
    accreditations: '', highlights: '',
    CollegeLink: '', portalLink: '', portalLinkAC: '',
    fees: { min: '', max: '' },
    overview: { heading: '', description: '', points: [{ ...EMPTY_POINT }] },
    courses: [{ ...EMPTY_COURSE }],
    imageUrl: '', brochureUrl: '', feeStructureUrl: '',
  });

  // ── Helpers ──────────────────────────────────────────────
  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    setForm(f => ({ ...f, name: val, slug }));
  };

  const toggleStream = (s: string) =>
    setForm(f => ({
      ...f,
      streams: f.streams.includes(s) ? f.streams.filter(x => x !== s) : [...f.streams, s],
    }));

  const updateCourse = (i: number, key: keyof Course, val: string) =>
    setForm(f => { const c = [...f.courses]; c[i] = { ...c[i], [key]: val }; return { ...f, courses: c }; });
  const addCourse    = () => setForm(f => ({ ...f, courses: [...f.courses, { ...EMPTY_COURSE }] }));
  const removeCourse = (i: number) => setForm(f => ({ ...f, courses: f.courses.filter((_, idx) => idx !== i) }));

  const updatePoint  = (i: number, key: keyof OverviewPoint, val: string) =>
    setForm(f => { const p = [...f.overview.points]; p[i] = { ...p[i], [key]: val }; return { ...f, overview: { ...f.overview, points: p } }; });
  const addPoint     = () => setForm(f => ({ ...f, overview: { ...f.overview, points: [...f.overview.points, { ...EMPTY_POINT }] } }));
  const removePoint  = (i: number) => setForm(f => ({ ...f, overview: { ...f.overview, points: f.overview.points.filter((_, idx) => idx !== i) } }));

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim())         { setError('College name is required.');   return; }
    if (!form.slug.trim())         { setError('Slug is required.');           return; }
    if (form.streams.length === 0) { setError('Select at least one stream.'); return; }
  if (!form.positions)           { setError('Sort position is required.');  return; }

    if (imageFile) {
      if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
        setError('College image must be JPG or PNG only.');
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setError('College image must be under 5 MB.');
        return;
      }
    }

    if (brochureFile) {
      if (brochureFile.type !== 'application/pdf') {
        setError('Brochure must be a PDF file only.');
        return;
      }
      if (brochureFile.size > 5 * 1024 * 1024) {
        setError('Brochure must be under 5 MB.');
        return;
      }
    }

    if (feeStructureFile) {
      if (feeStructureFile.type !== 'application/pdf') {
        setError('Fee structure must be a PDF file only.');
        return;
      }
      if (feeStructureFile.size > 5 * 1024 * 1024) {
        setError('Fee structure must be under 5 MB.');
        return;
      }
    }

    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('name',          form.name.trim());
      fd.append('slug',          form.slug.trim());
      fd.append('positions',     form.positions || '1');
      fd.append('naac',          form.naac);
      fd.append('rating',        form.rating);
      fd.append('type',          form.type);
      fd.append('established',   form.established);
      fd.append('CollegeLink',   form.CollegeLink);
      fd.append('portalLink',    form.portalLink);
      fd.append('portalLinkAC',  form.portalLinkAC);
      fd.append('accreditations', form.accreditations);
      fd.append('highlights',    form.highlights);
      fd.append('streams',       form.streams.join(','));
      fd.append('locations',     form.locations);
      fd.append('fees',          JSON.stringify({
        min: parseInt(form.fees.min) || 0,
        max: parseInt(form.fees.max) || 0,
      }));
      fd.append('courses',  JSON.stringify(form.courses.filter(c => c.name.trim())));
      fd.append('overview', JSON.stringify(form.overview));

      // Media — send file OR url depending on mode
      if (imageMode === 'upload' && imageFile)               fd.append('image',           imageFile);
      else if (imageMode === 'url' && form.imageUrl)         fd.append('imageUrl',         form.imageUrl);

      if (brochureMode === 'upload' && brochureFile)         fd.append('brochure',         brochureFile);
      else if (brochureMode === 'url' && form.brochureUrl)   fd.append('brochureUrl',       form.brochureUrl);

      if (feeStructureMode === 'upload' && feeStructureFile) fd.append('feeStructureDoc',   feeStructureFile);
      else if (feeStructureMode === 'url' && form.feeStructureUrl) fd.append('feeStructureUrl', form.feeStructureUrl);

      const res  = await fetch('/api/admin/colleges', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create college');

      setSuccess(true);
      setTimeout(() => router.push('/admin/colleges'), 1800);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save college.');
    } finally { setSaving(false); }
  };

  // ── Success Screen ────────────────────────────────────────
  if (success) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">College Added!</h2>
            <p className="text-slate-400 text-sm">Redirecting to colleges list...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const fileInputCls = 'w-full text-sm text-slate-400 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:cursor-pointer file:bg-blue-600 file:text-white hover:file:bg-blue-700';
  const fileInputClsNeutral = 'w-full text-sm text-slate-400 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:cursor-pointer file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600';

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">

        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <Link href="/admin/colleges"
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Add New College</h1>
            <p className="text-slate-400 text-sm mt-0.5">Fill in all details and save to publish.</p>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto hover:text-red-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ══ SECTION 1 — Basic Information ══ */}
        <Section title="Basic Information" icon={<GraduationCap className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>College Name *</label>
              <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. RV College of Engineering" className={inp} />
            </div>
            <div>
              <label className={lbl}>Slug *</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="rv-college-of-engineering" className={inp} />
              <p className="text-[11px] text-slate-500 mt-1">Auto-generated · edit if needed</p>
            </div>
            <div>
              <label className={lbl}>Institution Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className={`${inp} appearance-none cursor-pointer`}>
                {COL_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>NAAC Grade</label>
              <input value={form.naac} onChange={e => setForm(f => ({ ...f, naac: e.target.value }))}
                placeholder="A+, A, B++, B+..." className={inp} />
            </div>
            <div>
              <label className={lbl}>Rating (0 – 5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating}
                onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                placeholder="4.5" className={inp} />
            </div>
            <div>
              <label className={lbl}>Established Year</label>
              <input type="number" value={form.established}
                onChange={e => setForm(f => ({ ...f, established: e.target.value }))}
                placeholder="1963" className={inp} />
            </div>
            <div>
              <label className={lbl}>Sort Position *</label>
              <input type="number" min="1" value={form.positions}
                onChange={e => setForm(f => ({ ...f, positions: e.target.value }))}
                placeholder="1 = top of list" className={inp} />
            </div>
            <div>
              <label className={lbl}>Locations (comma-separated)</label>
              <input value={form.locations}
                onChange={e => setForm(f => ({ ...f, locations: e.target.value }))}
                placeholder="Bangalore, Karnataka" className={inp} />
            </div>
          </div>

          {/* Streams */}
          <div>
            <label className={lbl}>Streams *</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {STREAMS.map(s => {
                const active = form.streams.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleStream(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      active
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>
            {form.streams.length > 0 && (
              <p className="text-[11px] text-slate-500 mt-2">Selected: {form.streams.join(', ')}</p>
            )}
          </div>
        </Section>

        {/* ══ SECTION 2 — Fees, Links & Accreditations ══ */}
        <Section title="Fees, Links & Accreditations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Min Fees / Year (₹)</label>
              <input type="number" value={form.fees.min}
                onChange={e => setForm(f => ({ ...f, fees: { ...f.fees, min: e.target.value } }))}
                placeholder="180000" className={inp} />
            </div>
            <div>
              <label className={lbl}>Max Fees / Year (₹)</label>
              <input type="number" value={form.fees.max}
                onChange={e => setForm(f => ({ ...f, fees: { ...f.fees, max: e.target.value } }))}
                placeholder="220000" className={inp} />
            </div>
            <div>
              <label className={lbl}>College Website URL</label>
              <input value={form.CollegeLink}
                onChange={e => setForm(f => ({ ...f, CollegeLink: e.target.value }))}
                placeholder="https://www.rvce.edu.in" className={inp} />
            </div>
            <div>
              <label className={lbl}>Admission Portal URL</label>
              <input value={form.portalLink}
                onChange={e => setForm(f => ({ ...f, portalLink: e.target.value }))}
                placeholder="https://..." className={inp} />
            </div>
            <div>
              <label className={lbl}>Alternate Portal URL</label>
              <input value={form.portalLinkAC}
                onChange={e => setForm(f => ({ ...f, portalLinkAC: e.target.value }))}
                placeholder="https://..." className={inp} />
            </div>
            <div>
              <label className={lbl}>Accreditations (comma-separated)</label>
              <input value={form.accreditations}
                onChange={e => setForm(f => ({ ...f, accreditations: e.target.value }))}
                placeholder="NAAC A+, NBA, AICTE" className={inp} />
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>Highlights (one per line)</label>
              <textarea value={form.highlights}
                onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
                rows={4}
                placeholder={"Ranked #1 Engineering College in Karnataka by NIRF 2024\n100% placement rate with avg. package of ₹8.5 LPA\nNAAC A+ accredited"}
                className={`${inp} resize-none`} />
            </div>
          </div>
        </Section>

        {/* ══ SECTION 3 — Media & Documents ══ */}
        <Section title="Media & Documents" icon={<Upload className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* College Image */}
            <MediaField
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              label="College Image"
              file={imageFile}
              urlValue={form.imageUrl}
              mode={imageMode}
              preview={imagePreview}
              onFileChange={handleImageFileChange}
              onUrlChange={v => setForm(f => ({ ...f, imageUrl: v }))}
              onModeChange={setImageMode}
              fileInputClass={fileInputCls}
              inpClass={inp}
              lblClass={lbl}
            />

            {/* Brochure PDF */}
            <MediaField
              label="Brochure (PDF)"
              accept=".pdf,application/pdf"
              file={brochureFile}
              urlValue={form.brochureUrl}
              mode={brochureMode}
              onFileChange={setBrochureFile}
              onUrlChange={v => setForm(f => ({ ...f, brochureUrl: v }))}
              onModeChange={setBrochureMode}
              fileInputClass={fileInputClsNeutral}
              inpClass={inp}
              lblClass={lbl}
            />

            {/* Fee Structure PDF */}
            <MediaField
              label="Fee Structure (PDF)"
              accept=".pdf,application/pdf"
              file={feeStructureFile}
              urlValue={form.feeStructureUrl}
              mode={feeStructureMode}
              onFileChange={setFeeStructureFile}
              onUrlChange={v => setForm(f => ({ ...f, feeStructureUrl: v }))}
              onModeChange={setFeeStructureMode}
              fileInputClass={fileInputClsNeutral}
              inpClass={inp}
              lblClass={lbl}
            />
          </div>
        </Section>

        {/* ══ SECTION 4 — Overview / About ══ */}
        <Section title="Overview / About">
          <div>
            <label className={lbl}>Section Heading</label>
            <input value={form.overview.heading}
              onChange={e => setForm(f => ({ ...f, overview: { ...f.overview, heading: e.target.value } }))}
              placeholder="About RV College of Engineering" className={inp} />
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea value={form.overview.description}
              onChange={e => setForm(f => ({ ...f, overview: { ...f.overview, description: e.target.value } }))}
              rows={5} placeholder="Detailed description about the college, its history, achievements..."
              className={`${inp} resize-none`} />
          </div>

          {/* Key Points */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`${lbl} mb-0`}>Key Points</label>
              <button type="button" onClick={addPoint}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Point
              </button>
            </div>
            <div className="space-y-3">
              {form.overview.points.map((pt, i) => (
                <div key={i} className="flex gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input value={pt.heading} onChange={e => updatePoint(i, 'heading', e.target.value)}
                      placeholder="e.g. Academic Excellence" className={inp} />
                    <textarea value={pt.description} onChange={e => updatePoint(i, 'description', e.target.value)}
                      placeholder="Brief description of this point..." rows={2}
                      className={`${inp} resize-none`} />
                  </div>
                  {form.overview.points.length > 1 && (
                    <button type="button" onClick={() => removePoint(i)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 flex-shrink-0 mt-0.5 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══ SECTION 5 — Courses & Fees ══ */}
        <Section title={`Courses & Fees (${form.courses.length})`}>
          <div className="flex justify-end -mt-2">
            <button type="button" onClick={addCourse}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-800/60 rounded-lg">
                  {['Course Name', 'Level', 'Duration', 'Fees / yr', 'Seats', 'Entrance', ''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {form.courses.map((course, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-2 py-2.5">
                      <input value={course.name} onChange={e => updateCourse(i, 'name', e.target.value)}
                        placeholder="B.E. Computer Science" className={`${inp} text-xs py-2 min-w-[160px]`} />
                    </td>
                    <td className="px-2 py-2.5">
                      <select value={course.level} onChange={e => updateCourse(i, 'level', e.target.value)}
                        className={`${inp} text-xs py-2 appearance-none w-[76px]`}>
                        {LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2.5">
                      <input value={course.duration} onChange={e => updateCourse(i, 'duration', e.target.value)}
                        placeholder="4 Years" className={`${inp} text-xs py-2 w-[90px]`} />
                    </td>
                    <td className="px-2 py-2.5">
                      <input value={course.fees} onChange={e => updateCourse(i, 'fees', e.target.value)}
                        placeholder="₹1,80,000/yr" className={`${inp} text-xs py-2 w-[120px]`} />
                    </td>
                    <td className="px-2 py-2.5">
                      <input type="number" value={course.seats} onChange={e => updateCourse(i, 'seats', e.target.value)}
                        placeholder="60" className={`${inp} text-xs py-2 w-[60px]`} />
                    </td>
                    <td className="px-2 py-2.5">
                      <input value={course.entrance} onChange={e => updateCourse(i, 'entrance', e.target.value)}
                        placeholder="KCET" className={`${inp} text-xs py-2 w-[100px]`} />
                    </td>
                    <td className="px-2 py-2.5">
                      {form.courses.length > 1 && (
                        <button type="button" onClick={() => removeCourse(i)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ══ SAVE BAR ══ */}
        <div className="flex items-center gap-4 pt-2 sticky bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent py-4 -mx-6 px-6">
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : 'Save College'
            }
          </button>
          <Link href="/admin/colleges"
            className="px-5 py-3 text-slate-400 hover:text-white font-medium transition-colors text-sm rounded-xl hover:bg-slate-800">
            Cancel
          </Link>
          {form.name && (
            <span className="ml-auto text-xs text-slate-500">
              {form.courses.filter(c => c.name.trim()).length} courses ·{' '}
              {form.streams.length} streams ·{' '}
              {form.overview.points.length} overview points
            </span>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}