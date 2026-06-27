'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Trash2, Search, Eye, X, MapPin, ExternalLink,
  ChevronLeft, ChevronRight, AlertCircle, Building2,
  ChevronUp, ImageOff, Filter,
} from 'lucide-react'
import AdminLayout from '../../../components/admin/AdminLayout'

/* ── Types ──────────────────────────────────────────────────────── */
interface Course { id?: string; name: string; level: string; duration: string; fees: string; seats: string; entrance: string }
interface OverviewPoint { id?: string; heading: string; description: string }
interface Overview { heading: string; description: string; points: OverviewPoint[] }
type CollegeType = 'government' | 'private' | 'deemed' | 'autonomous'
interface College {
  id?: string; _id?: string; name: string; slug: string;
  streams: string[]; locations: string[]; positions: string | number;
  image?: string; brochure?: string; feeStructureDoc?: string;
  courses: Course[]; overview?: Overview;
  portalLink?: string; portalLinkAC?: string; portalLinkFV?: string; CollegeLink?: string;
  rating?: number; naac?: string; fees?: { min: number; max: number };
  type?: CollegeType; established?: number; accreditations?: string[]; highlights?: string[];
}
interface PaginationInfo { total?: number; totalPages?: number; current?: number; limit?: number | string }

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/* ── Initials avatar helper ─────────────────────────────────────── */
const AVATAR_COLORS = [
  ['#1e3a5f','#60a5fa'], ['#1e3a2f','#34d399'], ['#3b1e5f','#a78bfa'],
  ['#5f3b1e','#fbbf24'], ['#5f1e1e','#f87171'], ['#1e4a5f','#22d3ee'],
]
function getAvatarColors(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

/* ── College avatar (handles missing + broken images) ───────────── */
function CollegeAvatar({
  college, src, broken, onBroken,
}: { college: College; src: string; broken: boolean; onBroken: () => void }) {
  const [bg, fg] = getAvatarColors(college.name)

  if (!src || broken) {
    return (
      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center text-[13px] font-bold select-none"
        style={{ background: bg, color: fg, border: `1px solid ${fg}33` }}>
        {getInitials(college.name)}
        {broken && src && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center" title="Image URL broken">
            <X className="w-2 h-2 text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
      <Image src={src} alt={college.name} fill className="object-cover" unoptimized onError={onBroken} />
    </div>
  )
}

/* ── Debounce hook ──────────────────────────────────────────────── */
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

/* ── Image filter type ──────────────────────────────────────────── */
type ImageFilter = 'all' | 'no_image' | 'broken_image' | 'any_issue'

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════ */
export default function CollegesManagementPage() {
  const [colleges, setColleges]           = useState<College[]>([])
  const [loading, setLoading]             = useState(true)
  const [tableLoading, setTableLoading]   = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [searchTerm, setSearchTerm]       = useState('')
  const debouncedSearch                   = useDebouncedValue(searchTerm, 400)
  const [currentPage, setCurrentPage]     = useState(1)
  const [totalPages, setTotalPages]       = useState(1)
  const [totalColleges, setTotalColleges] = useState(0)
  const [pageSize, setPageSize]           = useState<number | 'all'>(20)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [showModal, setShowModal]         = useState(false)
  const [imageFilter, setImageFilter]     = useState<ImageFilter>('all')

  // Track broken image URLs at runtime
  const [brokenImages, setBrokenImages]   = useState<Set<string>>(new Set())
  const markBroken = useCallback((id: string) => {
    setBrokenImages(prev => { const s = new Set(prev); s.add(id); return s })
  }, [])

  const getCollegeId = (c: College) => c.id || c._id || ''
  const getImageSrc  = (image?: string) => {
    if (!image) return ''
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    return API_BASE.replace(/\/api$/, '') + image
  }

  const fetchColleges = useCallback(async (page = 1, search = '', limit: number | 'all' = pageSize) => {
    try {
      if (!loading) setTableLoading(true); else setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(search.trim() ? { search: search.trim() } : {}) })
      const res  = await fetch(`${API_BASE}/admin/colleges?${params}`, { cache: 'no-store', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        const list: College[] = Array.isArray(data.data) ? data.data : []
        const pg: PaginationInfo = data.pagination || {}
        setColleges(list)
        setTotalPages(Number(pg.totalPages) || 1)
        setTotalColleges(Number(pg.total) || list.length)
        setCurrentPage(Number(pg.current) || page)
        setError(null)
      } else {
        setError(data.message || 'Failed to load colleges')
      }
    } catch { setError('Network error occurred') }
    finally { setLoading(false); setTableLoading(false) }
  }, [pageSize, loading])

  useEffect(() => { fetchColleges(1, debouncedSearch, pageSize) }, [debouncedSearch, pageSize])

  // Apply client-side image filter
  const visibleColleges = useMemo(() => {
    if (imageFilter === 'all') return colleges
    return colleges.filter(c => {
      const id  = getCollegeId(c)
      const src = c.image?.trim() || ''
      const isBroken  = !!src && brokenImages.has(id)
      const isMissing = !src
      if (imageFilter === 'no_image')     return isMissing
      if (imageFilter === 'broken_image') return isBroken
      if (imageFilter === 'any_issue')    return isMissing || isBroken
      return true
    })
  }, [colleges, imageFilter, brokenImages])

  // Counts for filter badges
  const missingCount = useMemo(() => colleges.filter(c => !c.image?.trim()).length, [colleges])
  const brokenCount  = useMemo(() => colleges.filter(c => {
    const id = getCollegeId(c); return !!c.image?.trim() && brokenImages.has(id)
  }).length, [colleges, brokenImages])

  const handleView = async (id: string) => {
    if (!id) return
    try {
      const res  = await fetch(`${API_BASE}/admin/colleges/${id}`, { cache: 'no-store', credentials: 'include' })
      const data = await res.json()
      if (data.success) { setSelectedCollege(data.data); setShowModal(true) }
      else alert(data.message || 'Failed to load college details')
    } catch { alert('Error loading college details') }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!id || !window.confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      const res    = await fetch(`${API_BASE}/admin/colleges/${id}`, { method: 'DELETE', credentials: 'include' })
      const result = await res.json()
      if (res.ok && result.success) {
        const next = pageSize !== 'all' && colleges.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage
        fetchColleges(next, debouncedSearch, pageSize)
      } else alert(result.message || 'Failed to delete college')
    } catch { alert('Error deleting college') }
  }

  const handleMoveToTop = (college: College) => {
    const id = getCollegeId(college)
    if (!id) return
    setColleges(prev => {
      const idx = prev.findIndex(c => getCollegeId(c) === id)
      if (idx <= 0) return prev
      const arr = [...prev]; const [item] = arr.splice(idx, 1); arr.unshift(item); return arr
    })
  }

  /* ── Filter option config ──────────────────────────────────────── */
  const filterOptions: { value: ImageFilter; label: string; count?: number; color: string }[] = [
    { value: 'all',          label: 'All',           count: colleges.length, color: 'slate' },
    { value: 'no_image',     label: 'No Image',      count: missingCount,    color: 'yellow' },
    { value: 'broken_image', label: 'Broken Image',  count: brokenCount,     color: 'red'    },
    { value: 'any_issue',    label: 'Any Issue',     count: missingCount + brokenCount, color: 'orange' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Manage Colleges</h1>
            <p className="mt-1 text-slate-400 text-sm">
              {tableLoading ? 'Refreshing…' : `${totalColleges} total · ${visibleColleges.length} shown`}
            </p>
          </div>
          <Link href="/admin/colleges/add"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30">
            + Add College
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search colleges…" value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setCurrentPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Page size */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Show</span>
              <select value={String(pageSize)}
                onChange={e => { setCurrentPage(1); setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value)) }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          {/* ── Image filter pills ── */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
              <ImageOff className="h-3.5 w-3.5" /> Image Filter:
            </div>
            {filterOptions.map(opt => {
              const active = imageFilter === opt.value
              const colorMap: Record<string, string> = {
                slate:  active ? 'bg-slate-600 text-white border-slate-500'  : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300',
                yellow: active ? 'bg-yellow-500/25 text-yellow-300 border-yellow-500/50' : 'border-slate-700 text-slate-400 hover:border-yellow-500/40 hover:text-yellow-400',
                red:    active ? 'bg-red-500/25 text-red-300 border-red-500/50'           : 'border-slate-700 text-slate-400 hover:border-red-500/40 hover:text-red-400',
                orange: active ? 'bg-orange-500/25 text-orange-300 border-orange-500/50' : 'border-slate-700 text-slate-400 hover:border-orange-500/40 hover:text-orange-400',
              }
              return (
                <button key={opt.value} onClick={() => setImageFilter(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${colorMap[opt.color]}`}>
                  {opt.label}
                  {opt.count !== undefined && opt.count > 0 && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-bold">{opt.count}</span>
                  )}
                </button>
              )
            })}

            {/* Broken image legend */}
            {brokenCount > 0 && (
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                = broken URL detected live
              </div>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/60">
                <tr>
                  {['College', 'Streams', 'Location', 'Position', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-14 text-center text-slate-400 text-sm">Loading colleges…</td></tr>
                ) : visibleColleges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <ImageOff className="h-10 w-10 opacity-30" />
                        <p className="text-sm">
                          {imageFilter !== 'all'
                            ? `No colleges match the "${filterOptions.find(o=>o.value===imageFilter)?.label}" filter on this page`
                            : 'No colleges found'}
                        </p>
                        {imageFilter !== 'all' && (
                          <button onClick={() => setImageFilter('all')} className="text-xs text-blue-400 hover:text-blue-300">
                            Clear filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : visibleColleges.map(college => {
                  const id     = getCollegeId(college)
                  const src    = getImageSrc(college.image)
                  const broken = !!src && brokenImages.has(id)
                  const noImg  = !college.image?.trim()

                  return (
                    <tr key={id || college.slug || college.name}
                      className={`transition-colors hover:bg-slate-800/40 ${broken ? 'bg-red-950/10' : noImg ? 'bg-yellow-950/10' : ''}`}>

                      {/* College */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <CollegeAvatar college={college} src={src} broken={broken} onBroken={() => markBroken(id)} />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-[13px] leading-snug truncate max-w-[220px]">{college.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {college.rating  && <span className="text-[10.5px] text-slate-500">⭐ {college.rating}</span>}
                              {college.naac    && <span className="text-[10.5px] text-slate-500">NAAC {college.naac}</span>}
                              {college.type    && <span className="text-[10.5px] text-slate-500 capitalize">{college.type}</span>}
                              {/* Image status badge */}
                              {broken && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                                  <X className="h-2.5 w-2.5" /> Broken URL
                                </span>
                              )}
                              {noImg && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/12 border border-yellow-500/25 px-1.5 py-0.5 text-[9px] font-bold text-yellow-500">
                                  <ImageOff className="h-2.5 w-2.5" /> No Image
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Streams */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(college.streams || []).slice(0, 2).map((s, i) => (
                            <span key={i} className="rounded-full border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 text-[10.5px] text-blue-300">{s}</span>
                          ))}
                          {(college.streams || []).length > 2 && (
                            <span className="rounded-full bg-slate-700/70 px-2 py-0.5 text-[10.5px] text-slate-400">+{(college.streams||[]).length-2}</span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[12px]">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">{(college.locations||[]).join(', ')}</span>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-orange-500/20 border border-orange-500/25 px-2.5 py-1 text-[12px] font-bold text-orange-300">
                          {college.positions}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <ActionBtn title="View Details" icon={<Eye className="h-4 w-4" />}
                            onClick={() => handleView(id)} hoverClass="hover:bg-blue-500/20 hover:text-blue-400" />
                          <Link href={`/admin/colleges/edit/${id}`}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-emerald-500/20 hover:text-emerald-400"
                            title="Edit College">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <ActionBtn title="Delete College" icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => handleDelete(id, college.name)} hoverClass="hover:bg-red-500/20 hover:text-red-400" />
                          {(noImg || broken) && (
                            <ActionBtn title="Move to top of list" icon={<ChevronUp className="h-4 w-4" />}
                              onClick={() => handleMoveToTop(college)} hoverClass="hover:bg-yellow-500/20 hover:text-yellow-300" />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3.5">
            <button onClick={() => { const p = Math.max(1, currentPage-1); setCurrentPage(p); fetchColleges(p, debouncedSearch, pageSize) }}
              disabled={pageSize==='all' || currentPage===1}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-xs text-slate-500">
              {pageSize === 'all'
                ? `All ${totalColleges} colleges`
                : `Page ${currentPage} / ${Math.max(totalPages,1)} · ${totalColleges} total`}
            </span>
            <button onClick={() => { const p = Math.min(totalPages, currentPage+1); setCurrentPage(p); fetchColleges(p, debouncedSearch, pageSize) }}
              disabled={pageSize==='all' || currentPage===totalPages}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Detail Modal ── */}
        {showModal && selectedCollege && (
          <ModalShell title={selectedCollege.name} onClose={() => setShowModal(false)}>
            <div className="space-y-5 text-slate-200">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  { label: 'Slug',        value: selectedCollege.slug || '-' },
                  { label: 'Position',    value: String(selectedCollege.positions || '-') },
                  { label: 'Type',        value: selectedCollege.type || '-' },
                  { label: 'NAAC',        value: selectedCollege.naac || '-' },
                  { label: 'Established', value: selectedCollege.established ? String(selectedCollege.established) : '-' },
                  { label: 'Rating',      value: selectedCollege.rating ? String(selectedCollege.rating) : '-' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">{f.label}</p>
                    <p className="text-sm text-white">{f.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Streams</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCollege.streams||[]).map((s,i) => (
                    <span key={i} className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs text-blue-300">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Locations</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCollege.locations||[]).map((l,i) => (
                    <span key={i} className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300">{l}</span>
                  ))}
                </div>
              </div>

              {selectedCollege.overview?.description && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Overview</p>
                  <p className="text-sm leading-relaxed text-slate-400">{selectedCollege.overview.description}</p>
                </div>
              )}

              {(selectedCollege.courses||[]).length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Courses ({selectedCollege.courses.length})
                  </p>
                  <div className="max-h-60 space-y-2 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {selectedCollege.courses.map((c, i) => (
                      <div key={c.id || i} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {[c.level, c.duration, c.fees, c.seats ? `${c.seats} seats` : '', c.entrance].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Link href={`/admin/colleges/edit/${getCollegeId(selectedCollege)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                  <ExternalLink className="h-4 w-4" /> Open Edit Page
                </Link>
              </div>
            </div>
          </ModalShell>
        )}
      </div>
    </AdminLayout>
  )
}

/* ── Small reusable action button ───────────────────────────────── */
function ActionBtn({ title, icon, onClick, hoverClass }: { title: string; icon: React.ReactNode; onClick: () => void; hoverClass: string }) {
  return (
    <button onClick={onClick} title={title}
      className={`rounded-lg p-2 text-slate-400 transition-all ${hoverClass}`}>
      {icon}
    </button>
  )
}

/* ── Modal shell ─────────────────────────────────────────────────── */
function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center py-10">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h2 className="text-[15px] font-bold text-white truncate pr-4">{title}</h2>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex-shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}