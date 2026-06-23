'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  GraduationCap,
  FileText,
  Link2,
} from 'lucide-react';

type CollegeType = 'private' | 'government' | 'deemed' | 'autonomous';

interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
  seats: string;
  entrance: string;
}

interface OverviewPoint {
  heading: string;
  description: string;
}

interface Overview {
  heading: string;
  description: string;
  points: OverviewPoint[];
}

interface CollegeResponse {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  streams: string[];
  locations: string[] | string;
  positions: number | string;
  image?: string;
  brochure?: string;
  feeStructureDoc?: string;
  naac?: string;
  rating?: number | string;
  type?: CollegeType;
  established?: number | string;
  accreditations?: string[] | string;
  highlights?: string[] | string;
  CollegeLink?: string;
  portalLink?: string;
  portalLinkAC?: string;
  fees?: {
    min?: number | string;
    max?: number | string;
  };
  overview?: Overview;
  courses?: Course[];
}

interface CollegeFormState {
  name: string;
  slug: string;
  streams: string[];
  locations: string[];
  positions: string;
  image: string;
  brochure: string;
  feeStructureDoc: string;
  naac: string;
  rating: string;
  type: CollegeType;
  established: string;
  accreditations: string[];
  highlights: string[];
  CollegeLink: string;
  portalLink: string;
  portalLinkAC: string;
  fees: {
    min: string;
    max: string;
  };
  overview: Overview;
  courses: Course[];
}

type MediaMode = 'url' | 'upload';

const EMPTY_COURSE: Course = {
  name: '',
  level: 'UG',
  duration: '',
  fees: '',
  seats: '',
  entrance: '',
};

const EMPTY_POINT: OverviewPoint = {
  heading: '',
  description: '',
};

const INITIAL_FORM: CollegeFormState = {
  name: '',
  slug: '',
  streams: [],
  locations: [],
  positions: '1',
  image: '',
  brochure: '',
  feeStructureDoc: '',
  naac: '',
  rating: '',
  type: 'private',
  established: '',
  accreditations: [],
  highlights: [],
  CollegeLink: '',
  portalLink: '',
  portalLinkAC: '',
  fees: {
    min: '',
    max: '',
  },
  overview: {
    heading: '',
    description: '',
    points: [{ ...EMPTY_POINT }],
  },
  courses: [{ ...EMPTY_COURSE }],
};

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

const COL_TYPES: CollegeType[] = ['private', 'government', 'deemed', 'autonomous'];
const LEVELS = ['UG', 'PG', 'PhD', 'Diploma', 'Lateral'];

const inp =
  'w-full px-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500 text-sm transition-colors';

const lbl =
  'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5';

const fileInput =
  'w-full text-sm text-slate-400 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:cursor-pointer';

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
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

function MediaField({
  label,
  type,
  mode,
  setMode,
  urlValue,
  onUrlChange,
  file,
  onFileChange,
  previewUrl,
  onClear,
}: {
  label: string;
  type: 'image' | 'pdf';
  mode: MediaMode;
  setMode: (mode: MediaMode) => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={lbl} style={{ marginBottom: 0 }}>
          {label}
        </label>

        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <input
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/file.pdf'}
            className={inp}
          />

          {type === 'image' && urlValue && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700">
              <Image
                src={urlValue}
                alt={label}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={onClear}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {type === 'pdf' && urlValue && (
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm min-w-0">
                <FileText className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span className="truncate">{urlValue}</span>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="text-red-400 hover:text-red-300 transition-colors ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {type === 'image' ? (
            previewUrl ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700">
                <Image
                  src={previewUrl}
                  alt={`${label} preview`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={onClear}
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
            <div className="w-full h-36 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 px-3 text-center">
              {file ? (
                <>
                  <p className="text-xs text-green-400 font-semibold mb-1">✓ Selected</p>
                  <p className="text-[11px] text-slate-400 break-all">{file.name}</p>
                  <button
                    type="button"
                    onClick={onClear}
                    className="mt-2 text-[11px] text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">No PDF selected</span>
                </>
              )}
            </div>
          )}

          <input
            type="file"
           accept={type === 'image' ? '.jpg,.jpeg,.png,image/jpeg,image/png' : '.pdf,application/pdf'}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className={`${fileInput} ${
              type === 'image'
                ? 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                : 'file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600'
            }`}
          />
        </div>
      )}
    </div>
  );
}

export default function EditCollegePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CollegeFormState>(INITIAL_FORM);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [feeStructureFile, setFeeStructureFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState('');

  const [imageMode, setImageMode] = useState<MediaMode>('url');
  const [brochureMode, setBrochureMode] = useState<MediaMode>('url');
  const [feeStructureMode, setFeeStructureMode] = useState<MediaMode>('url');

  const pageTitle = useMemo(() => {
    return form.name ? `Edit ${form.name}` : 'Edit College';
  }, [form.name]);

  const normalizeToStringArray = (value: string[] | string | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const autoSlug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE}/admin/colleges/${id}`, {
          cache: 'no-store',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load college');
        }

        const college: CollegeResponse = data.data;

        setForm({
          name: college.name || '',
          slug: college.slug || '',
          streams: normalizeToStringArray(college.streams),
          locations: normalizeToStringArray(college.locations),
          positions: String(college.positions ?? '1'),
          image: college.image || '',
          brochure: college.brochure || '',
          feeStructureDoc: college.feeStructureDoc || '',
          naac: college.naac || '',
          rating: String(college.rating ?? ''),
          type: college.type || 'private',
          established: String(college.established ?? ''),
          accreditations: normalizeToStringArray(college.accreditations),
          highlights: normalizeToStringArray(college.highlights),
          CollegeLink: college.CollegeLink || '',
          portalLink: college.portalLink || '',
          portalLinkAC: college.portalLinkAC || '',
          fees: {
            min: String(college.fees?.min ?? ''),
            max: String(college.fees?.max ?? ''),
          },
          overview: {
            heading: college.overview?.heading || '',
            description: college.overview?.description || '',
            points:
              college.overview?.points?.length
                ? college.overview.points.map((p) => ({
                    heading: p.heading || '',
                    description: p.description || '',
                  }))
                : [{ ...EMPTY_POINT }],
          },
          courses:
            college.courses?.length
              ? college.courses.map((course) => ({
                  name: course.name || '',
                  level: course.level || 'UG',
                  duration: course.duration || '',
                  fees: course.fees || '',
                  seats: course.seats || '',
                  entrance: course.entrance || '',
                }))
              : [{ ...EMPTY_COURSE }],
        });

        setImageMode(college.image ? 'url' : 'upload');
        setBrochureMode(college.brochure ? 'url' : 'upload');
        setFeeStructureMode(college.feeStructureDoc ? 'url' : 'upload');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load college.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCollege();
  }, [API_BASE, id]);

  const handleNameChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === '' || prev.slug === autoSlug(prev.name) ? autoSlug(val) : prev.slug,
    }));
  };

  const toggleStream = (stream: string) => {
    setForm((prev) => ({
      ...prev,
      streams: prev.streams.includes(stream)
        ? prev.streams.filter((s) => s !== stream)
        : [...prev.streams, stream],
    }));
  };

  const updateCourse = (i: number, key: keyof Course, val: string) => {
    setForm((prev) => {
      const courses = [...prev.courses];
      courses[i] = { ...courses[i], [key]: val };
      return { ...prev, courses };
    });
  };

  const addCourse = () => {
    setForm((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...EMPTY_COURSE }],
    }));
  };

  const removeCourse = (i: number) => {
    setForm((prev) => ({
      ...prev,
      courses:
        prev.courses.length > 1
          ? prev.courses.filter((_, idx) => idx !== i)
          : prev.courses,
    }));
  };

  const updatePoint = (i: number, key: keyof OverviewPoint, val: string) => {
    setForm((prev) => {
      const points = [...prev.overview.points];
      points[i] = { ...points[i], [key]: val };
      return {
        ...prev,
        overview: { ...prev.overview, points },
      };
    });
  };

  const addPoint = () => {
    setForm((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        points: [...prev.overview.points, { ...EMPTY_POINT }],
      },
    }));
  };

  const removePoint = (i: number) => {
    setForm((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        points:
          prev.overview.points.length > 1
            ? prev.overview.points.filter((_, idx) => idx !== i)
            : prev.overview.points,
      },
    }));
  };

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setImagePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const clearBrochure = () => {
    setBrochureFile(null);
    setForm((prev) => ({ ...prev, brochure: '' }));
  };

  const clearFeeStructure = () => {
    setFeeStructureFile(null);
    setForm((prev) => ({ ...prev, feeStructureDoc: '' }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('College name is required.');
      return;
    }
    if (!form.slug.trim()) {
      setError('Slug is required.');
      return;
    }
    if (form.streams.length === 0) {
      setError('Select at least one stream.');
      return;
    }
    if (!form.positions.trim()) {
      setError('Sort position is required.');
      return;
    }

// ✅ Client-side file validation
    if (imageFile) {
      const allowed = ['image/jpeg', 'image/png'];
      if (!allowed.includes(imageFile.type)) {
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

    try {
      setSaving(true);
      setError('');


      const payload = new FormData();

      payload.append('name', form.name.trim());
      payload.append('slug', form.slug.trim());
      payload.append('positions', form.positions || '1');
      payload.append('naac', form.naac);
      payload.append('rating', form.rating || '0');
      payload.append('type', form.type);
      payload.append('established', form.established || '');
      payload.append('CollegeLink', form.CollegeLink);
      payload.append('portalLink', form.portalLink);
      payload.append('portalLinkAC', form.portalLinkAC);
      payload.append('streams', form.streams.join(','));
      payload.append('locations', form.locations.join(','));
      payload.append('feesMin', form.fees.min || '0');
      payload.append('feesMax', form.fees.max || '0');
      payload.append('accreditations', JSON.stringify(form.accreditations.filter(Boolean)));
      payload.append('highlights', JSON.stringify(form.highlights.filter(Boolean)));
      payload.append(
        'courses',
        JSON.stringify(form.courses.filter((c) => c.name.trim()))
      );
      payload.append('overview', JSON.stringify(form.overview));

      if (imageMode === 'url') {
        payload.append('image', form.image);
      } else if (imageFile) {
        payload.append('image', imageFile);
      }

      if (brochureMode === 'url') {
        payload.append('brochure', form.brochure);
      } else if (brochureFile) {
        payload.append('brochure', brochureFile);
      }

      if (feeStructureMode === 'url') {
        payload.append('feeStructureDoc', form.feeStructureDoc);
      } else if (feeStructureFile) {
        payload.append('feeStructureDoc', feeStructureFile);
      }

      const res = await fetch(`${API_BASE}/admin/colleges/${id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update college');
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/colleges'), 1600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update college.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading college details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (success) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">College Updated!</h2>
            <p className="text-slate-400 text-sm">Redirecting to colleges list...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/colleges"
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Update college details and save changes.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="ml-auto hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Section title="Basic Information" icon={<GraduationCap className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>College Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. RV College of Engineering"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="rv-college-of-engineering"
                className={inp}
              />
              <p className="text-[11px] text-slate-500 mt-1">Auto-generated · edit if needed</p>
            </div>

            <div>
              <label className={lbl}>Institution Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CollegeType }))}
                className={`${inp} appearance-none cursor-pointer`}
              >
                {COL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={lbl}>NAAC Grade</label>
              <input
                value={form.naac}
                onChange={(e) => setForm((f) => ({ ...f, naac: e.target.value }))}
                placeholder="A+, A, B++..."
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Rating (0 – 5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                placeholder="4.5"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Established Year</label>
              <input
                type="number"
                value={form.established}
                onChange={(e) => setForm((f) => ({ ...f, established: e.target.value }))}
                placeholder="1963"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Sort Position *</label>
              <input
                type="number"
                min="1"
                value={form.positions}
                onChange={(e) => setForm((f) => ({ ...f, positions: e.target.value }))}
                placeholder="1 = top of list"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Locations (comma-separated)</label>
              <input
                value={form.locations.join(', ')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    locations: e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Bangalore, Karnataka"
                className={inp}
              />
            </div>
          </div>

          <div>
            <label className={lbl}>Streams *</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {STREAMS.map((stream) => {
                const active = form.streams.includes(stream);
                return (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => toggleStream(stream)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                      active
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {stream}
                  </button>
                );
              })}
            </div>

            {form.streams.length > 0 && (
              <p className="text-[11px] text-slate-500 mt-2">
                Selected: {form.streams.join(', ')}
              </p>
            )}
          </div>
        </Section>

        <Section title="Fees, Links & Accreditations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Min Fees / Year (₹)</label>
              <input
                type="number"
                value={form.fees.min}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fees: { ...f.fees, min: e.target.value } }))
                }
                placeholder="180000"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Max Fees / Year (₹)</label>
              <input
                type="number"
                value={form.fees.max}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fees: { ...f.fees, max: e.target.value } }))
                }
                placeholder="220000"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>College Website URL</label>
              <input
                value={form.CollegeLink}
                onChange={(e) => setForm((f) => ({ ...f, CollegeLink: e.target.value }))}
                placeholder="https://www.rvce.edu.in"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Admission Portal URL</label>
              <input
                value={form.portalLink}
                onChange={(e) => setForm((f) => ({ ...f, portalLink: e.target.value }))}
                placeholder="https://..."
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Alternate Portal URL</label>
              <input
                value={form.portalLinkAC}
                onChange={(e) => setForm((f) => ({ ...f, portalLinkAC: e.target.value }))}
                placeholder="https://..."
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Accreditations (comma-separated)</label>
              <input
                value={form.accreditations.join(', ')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    accreditations: e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="NAAC A+, NBA, AICTE"
                className={inp}
              />
            </div>

            <div className="md:col-span-2">
              <label className={lbl}>Highlights (one per line)</label>
              <textarea
                value={form.highlights.join('\n')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    highlights: e.target.value
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                rows={4}
                placeholder={`Ranked #1 Engineering College in Karnataka by NIRF 2024
100% placement rate with avg. package of ₹8.5 LPA
NAAC A+ accredited`}
                className={`${inp} resize-none`}
              />
            </div>
          </div>
        </Section>

        <Section title="Media & Documents" icon={<Upload className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MediaField
              label="College Image"
              type="image"
              mode={imageMode}
              setMode={setImageMode}
              urlValue={form.image}
              onUrlChange={(value) => setForm((f) => ({ ...f, image: value }))}
              file={imageFile}
              onFileChange={handleImageFileChange}
              previewUrl={imagePreview}
              onClear={clearImage}
            />

            <MediaField
              label="Brochure PDF"
              type="pdf"
              mode={brochureMode}
              setMode={setBrochureMode}
              urlValue={form.brochure}
              onUrlChange={(value) => setForm((f) => ({ ...f, brochure: value }))}
              file={brochureFile}
              onFileChange={setBrochureFile}
              onClear={clearBrochure}
            />

            <MediaField
              label="Fee Structure PDF"
              type="pdf"
              mode={feeStructureMode}
              setMode={setFeeStructureMode}
              urlValue={form.feeStructureDoc}
              onUrlChange={(value) => setForm((f) => ({ ...f, feeStructureDoc: value }))}
              file={feeStructureFile}
              onFileChange={setFeeStructureFile}
              onClear={clearFeeStructure}
            />
          </div>
        </Section>

        <Section title="Overview / About">
          <div>
            <label className={lbl}>Section Heading</label>
            <input
              value={form.overview.heading}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  overview: { ...f.overview, heading: e.target.value },
                }))
              }
              placeholder="About RV College of Engineering"
              className={inp}
            />
          </div>

          <div>
            <label className={lbl}>Description</label>
            <textarea
              value={form.overview.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  overview: { ...f.overview, description: e.target.value },
                }))
              }
              rows={5}
              placeholder="Detailed description about the college, its history, achievements..."
              className={`${inp} resize-none`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={lbl} style={{ marginBottom: 0 }}>
                Key Points
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Point
              </button>
            </div>

            <div className="space-y-3">
              {form.overview.points.map((pt, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/60"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      value={pt.heading}
                      onChange={(e) => updatePoint(i, 'heading', e.target.value)}
                      placeholder="e.g. Academic Excellence"
                      className={inp}
                    />
                    <textarea
                      value={pt.description}
                      onChange={(e) => updatePoint(i, 'description', e.target.value)}
                      placeholder="Brief description of this point..."
                      rows={2}
                      className={`${inp} resize-none`}
                    />
                  </div>

                  {form.overview.points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePoint(i)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 flex-shrink-0 mt-0.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title={`Courses & Fees (${form.courses.length})`}>
          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={addCourse}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-slate-800/60 rounded-lg">
                  {['Course Name', 'Level', 'Duration', 'Fees / yr', 'Seats', 'Entrance', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap first:rounded-l-lg last:rounded-r-lg"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {form.courses.map((course, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-2 py-2.5">
                      <input
                        value={course.name}
                        onChange={(e) => updateCourse(i, 'name', e.target.value)}
                        placeholder="B.E. Computer Science"
                        className={`${inp} text-xs py-2 min-w-[160px]`}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <select
                        value={course.level}
                        onChange={(e) => updateCourse(i, 'level', e.target.value)}
                        className={`${inp} text-xs py-2 appearance-none w-[76px]`}
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-2 py-2.5">
                      <input
                        value={course.duration}
                        onChange={(e) => updateCourse(i, 'duration', e.target.value)}
                        placeholder="4 Years"
                        className={`${inp} text-xs py-2 w-[90px]`}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <input
                        value={course.fees}
                        onChange={(e) => updateCourse(i, 'fees', e.target.value)}
                        placeholder="₹1,80,000/yr"
                        className={`${inp} text-xs py-2 w-[120px]`}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <input
                        type="number"
                        value={course.seats}
                        onChange={(e) => updateCourse(i, 'seats', e.target.value)}
                        placeholder="60"
                        className={`${inp} text-xs py-2 w-[60px]`}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <input
                        value={course.entrance}
                        onChange={(e) => updateCourse(i, 'entrance', e.target.value)}
                        placeholder="KCET"
                        className={`${inp} text-xs py-2 w-[100px]`}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      {form.courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(i)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                        >
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

        <div className="flex items-center gap-4 pt-2 sticky bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent py-4 -mx-6 px-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              'Update College'
            )}
          </button>

          <Link
            href="/admin/colleges"
            className="px-5 py-3 text-slate-400 hover:text-white font-medium transition-colors text-sm rounded-xl hover:bg-slate-800"
          >
            Cancel
          </Link>

          {form.name && (
            <span className="ml-auto text-xs text-slate-500">
              {form.courses.filter((c) => c.name.trim()).length} courses · {form.streams.length}{' '}
              streams · {form.overview.points.length} overview points
            </span>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}