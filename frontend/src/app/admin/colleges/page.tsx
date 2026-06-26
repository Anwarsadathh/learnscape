'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Trash2,
  Search,
  Eye,
  X,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Building2,
  ChevronUp,
} from 'lucide-react'
import AdminLayout from '../../../components/admin/AdminLayout'

interface Course {
  id?: string
  name: string
  level: string
  duration: string
  fees: string
  seats: string
  entrance: string
}

interface OverviewPoint {
  id?: string
  heading: string
  description: string
}

interface Overview {
  heading: string
  description: string
  points: OverviewPoint[]
}

type CollegeType = 'government' | 'private' | 'deemed' | 'autonomous'

interface College {
  id?: string
  _id?: string
  name: string
  slug: string
  streams: string[]
  locations: string[]
  positions: string | number
  image?: string
  brochure?: string
  feeStructureDoc?: string
  courses: Course[]
  overview?: Overview
  portalLink?: string
  portalLinkAC?: string
  portalLinkFV?: string
  CollegeLink?: string
  rating?: number
  naac?: string
  fees?: {
    min: number
    max: number
  }
  type?: CollegeType
  established?: number
  accreditations?: string[]
  highlights?: string[]
}

interface PaginationInfo {
  total?: number
  totalPages?: number
  current?: number
  limit?: number | string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function CollegesManagementPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 400)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalColleges, setTotalColleges] = useState(0)
  const [pageSize, setPageSize] = useState<number | 'all'>(20)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [onlyNoImage, setOnlyNoImage] = useState(false)

  const filteredTitle = useMemo(() => {
    if (debouncedSearch.trim()) return `Search results for "${debouncedSearch}"`
    return 'Manage Colleges'
  }, [debouncedSearch])

  const getCollegeId = (college: College) => college.id || college._id || ''

  const getImageSrc = (image?: string) => {
    if (!image) return ''
    if (image.startsWith('http://') || image.startsWith('https://')) return image
    const baseUrl = API_BASE.replace(/\/api$/, '')
    return `${baseUrl}${image}`
  }

  const fetchColleges = useCallback(
    async (page = 1, search = '', limit: number | 'all' = pageSize) => {
      try {
        if (!loading) setTableLoading(true)
        else setLoading(true)

        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(search.trim() ? { search: search.trim() } : {}),
        })

        const response = await fetch(`${API_BASE}/admin/colleges?${queryParams}`, {
          cache: 'no-store',
          credentials: 'include',
        })

        const data = await response.json()

        if (data.success) {
          const list = Array.isArray(data.data) ? data.data : []
          const pagination: PaginationInfo = data.pagination || {}

          setColleges(list)
          setTotalPages(Number(pagination.totalPages) || 1)
          setTotalColleges(Number(pagination.total) || list.length)
          setCurrentPage(Number(pagination.current) || page)
          setError(null)
        } else {
          setError(data.message || 'Failed to load colleges')
        }
      } catch {
        setError('Network error occurred while loading colleges')
      } finally {
        setLoading(false)
        setTableLoading(false)
      }
    },
    [pageSize, loading]
  )

  useEffect(() => {
    fetchColleges(1, debouncedSearch, pageSize)
  }, [debouncedSearch, pageSize, fetchColleges])

  // client-side filter for "no image"
  const visibleColleges = useMemo(() => {
    if (!onlyNoImage) return colleges
    return colleges.filter((c) => !c.image || !String(c.image).trim())
  }, [colleges, onlyNoImage])

  const handleView = async (collegeId: string) => {
    if (!collegeId) return

    try {
      const response = await fetch(`${API_BASE}/admin/colleges/${collegeId}`, {
        cache: 'no-store',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setSelectedCollege(data.data)
        setShowModal(true)
      } else {
        alert(data.message || 'Failed to load college details')
      }
    } catch {
      alert('Error loading college details')
    }
  }

  const handleDelete = async (collegeId: string, collegeName: string) => {
    if (!collegeId) return

    const ok = window.confirm(
      `Are you sure you want to delete ${collegeName}? This action cannot be undone.`
    )
    if (!ok) return

    try {
      const response = await fetch(`${API_BASE}/admin/colleges/${collegeId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const result = await response.json()

      if (response.ok && result.success) {
        const nextPage =
          pageSize !== 'all' && colleges.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage
        fetchColleges(nextPage, debouncedSearch, pageSize)
      } else {
        alert(result.message || 'Failed to delete college')
      }
    } catch {
      alert('Error deleting college')
    }
  }

  // arrow action: move a college to the top of the current list (client-side only)
  const handleMoveToTop = (college: College) => {
    const id = getCollegeId(college)
    if (!id) return

    setColleges((prev) => {
      const idx = prev.findIndex((c) => getCollegeId(c) === id)
      if (idx <= 0) return prev
      const updated = [...prev]
      const [item] = updated.splice(idx, 1)
      updated.unshift(item)
      return updated
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
              {filteredTitle}
            </h1>
            <p className="text-slate-400">View and manage college information</p>
          </div>

          <Link
            href="/admin/colleges/add"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white transition-all hover:shadow-lg"
          >
            Add new College
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="font-medium text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 transition-colors hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-md flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setCurrentPage(1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="text-sm text-slate-400">
                {tableLoading
                  ? 'Refreshing...'
                  : pageSize === 'all'
                  ? `Showing all ${visibleColleges.length}`
                  : `Showing ${visibleColleges.length} on this page`}
              </div>

              <div className="text-sm font-medium text-slate-300">
                Total Colleges:{' '}
                <span className="text-white">{totalColleges}</span>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={onlyNoImage}
                  onChange={(e) => {
                    setOnlyNoImage(e.target.checked)
                    setCurrentPage(1)
                  }}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                <span>Only colleges without image</span>
              </label>

              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-slate-400">
                  Show
                </label>
                <select
                  id="pageSize"
                  value={String(pageSize)}
                  onChange={(e) => {
                    const value = e.target.value
                    setCurrentPage(1)
                    setPageSize(value === 'all' ? 'all' : Number(value))
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    College
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Streams
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Locations
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Loading colleges...
                    </td>
                  </tr>
                ) : visibleColleges.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No colleges found
                    </td>
                  </tr>
                ) : (
                  visibleColleges.map((college) => {
                    const collegeId = getCollegeId(college)

                    return (
                      <tr
                        key={collegeId || college.slug || college.name}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {college.image ? (
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-800">
                                <Image
                                  src={getImageSrc(college.image)}
                                  alt={college.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                <Building2 className="h-5 w-5" />
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-white">
                                {college.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                {college.rating ? (
                                  <span>{college.rating}</span>
                                ) : null}
                                {college.naac ? (
                                  <span>NAAC {college.naac}</span>
                                ) : null}
                                {college.type ? (
                                  <span className="capitalize">
                                    {college.type}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(college.streams || [])
                              .slice(0, 2)
                              .map((stream, idx) => (
                                <span
                                  key={`${collegeId || college.slug}-stream-${stream}-${idx}`}
                                  className="rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs text-blue-300"
                                >
                                  {stream}
                                </span>
                              ))}
                            {(college.streams || []).length > 2 && (
                              <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">
                                +{(college.streams || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-300">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">
                              {(college.locations || []).join(', ')}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-orange-500/20 px-2 py-1 text-sm font-semibold text-orange-300">
                            {college.positions}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(collegeId)}
                              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-500/20 hover:text-blue-400"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <Link
                              href={`/admin/colleges/edit/${collegeId}`}
                              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-green-500/20 hover:text-green-400"
                              title="Edit College"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(collegeId, college.name)
                              }
                              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-500/20 hover:text-red-400"
                              title="Delete College"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            {/* Arrow for no-image colleges to move them up in the current list */}
                            {!college.image && (
                              <button
                                onClick={() => handleMoveToTop(college)}
                                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-yellow-500/20 hover:text-yellow-300"
                                title="Move to top of this list"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
            <button
              onClick={() => {
                const nextPage = Math.max(1, currentPage - 1)
                setCurrentPage(nextPage)
                fetchColleges(nextPage, debouncedSearch, pageSize)
              }}
              disabled={pageSize === 'all' || currentPage === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="text-sm text-slate-400">
              {pageSize === 'all'
                ? `Showing all ${totalColleges} colleges`
                : `Page ${currentPage} of ${Math.max(
                    totalPages,
                    1
                  )} • Total ${totalColleges} colleges`}
            </div>

            <button
              onClick={() => {
                const nextPage = Math.min(totalPages, currentPage + 1)
                setCurrentPage(nextPage)
                fetchColleges(nextPage, debouncedSearch, pageSize)
              }}
              disabled={pageSize === 'all' || currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-slate-300 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showModal && selectedCollege && (
          <ModalShell
            title={selectedCollege.name}
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-5 text-slate-200">
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <InfoBox label="Slug" value={selectedCollege.slug || '-'} />
                <InfoBox
                  label="Position"
                  value={String(selectedCollege.positions || '-')}
                />
                <InfoBox label="Type" value={selectedCollege.type || '-'} />
                <InfoBox label="NAAC" value={selectedCollege.naac || '-'} />
                <InfoBox
                  label="Established"
                  value={
                    selectedCollege.established
                      ? String(selectedCollege.established)
                      : '-'
                  }
                />
                <InfoBox
                  label="Rating"
                  value={
                    selectedCollege.rating
                      ? String(selectedCollege.rating)
                      : '-'
                  }
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-300">
                  Streams
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedCollege.streams || []).map((stream, i) => (
                    <span
                      key={`${getCollegeId(
                        selectedCollege
                      )}-view-stream-${stream}-${i}`}
                      className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300"
                    >
                      {stream}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-300">
                  Locations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedCollege.locations || []).map((location, i) => (
                    <span
                      key={`${getCollegeId(
                        selectedCollege
                      )}-view-location-${location}-${i}`}
                      className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCollege.overview?.description && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">
                    Overview
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {selectedCollege.overview.description}
                  </p>
                </div>
              )}

              {(selectedCollege.courses || []).length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">
                    Courses
                  </h3>
                  <div className="max-h-64 space-y-2 overflow-auto pr-1">
                    {selectedCollege.courses.map((course, idx) => (
                      <div
                        key={
                          course.id ||
                          `${getCollegeId(
                            selectedCollege
                          )}-course-${course.name}-${idx}`
                        }
                        className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                      >
                        <div className="font-medium text-white">
                          {course.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {course.level} • {course.duration} • {course.fees}
                          {course.seats ? ` • Seats ${course.seats}` : ''}
                          {course.entrance ? ` • ${course.entrance}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Link
                  href={`/admin/colleges/edit/${getCollegeId(selectedCollege)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Edit Page
                </Link>
              </div>
            </div>
          </ModalShell>
        )}
      </div>
    </AdminLayout>
  )
}

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center py-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
      <div className="mb-1 text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-sm text-white">{value}</div>
    </div>
  )
}