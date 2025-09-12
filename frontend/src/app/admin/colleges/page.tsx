'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  X,
  MapPin,
  Save,
  FileText,
  GraduationCap,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
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

interface College {
  _id: string;
  name: string;
  streams: string[];
  locations: string[];
  positions: string;
  rating?: number;
  image?: string;
  brochure?: string;
  feeStructureDoc?: string;
  courses: Course[];
  overview?: Overview;
  portalLink?: string;
  CollegeLink?: string;
}

const CollegesManagementPage = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available streams options
  const availableStreams = [
    'Paramedical',
    'Medical Science',
    'Arts and Humanities',
    'Commerce',
    'Engineering',
    'Management'
  ];

  // Available locations options
  const availableLocations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Mysore',
    'Kochi',
    'Coimbatore',
    'Chandigarh',
    'Bhopal'
  ];

  // Form data state
  const [formData, setFormData] = useState<Partial<College>>({
    name: '',
    streams: [],
    locations: [],
    positions: '1',
    rating: 4.5,
    courses: [],
    overview: {
      heading: '',
      description: '',
      points: []
    },
    portalLink: '',
    CollegeLink: ''
  });

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [feeStructureFile, setFeeStructureFile] = useState<File | null>(null);

  const fetchColleges = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });
      
      const response = await fetch(`/api/colleges?${queryParams}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data.success) {
        setColleges(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(page);
        setError(null);
      } else {
        setError('Failed to load colleges');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const resetForm = () => {
    setFormData({
      name: '',
      streams: [],
      locations: [],
      positions: '1',
      rating: 4.5,
      courses: [],
      overview: {
        heading: '',
        description: '',
        points: []
      },
      portalLink: '',
      CollegeLink: ''
    });
    setImageFile(null);
    setBrochureFile(null);
    setFeeStructureFile(null);
  };

  const handleAdd = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const handleView = async (collegeId: string) => {
    try {
      const response = await fetch(`/api/admin/colleges/${collegeId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCollege(data.data);
        setModalMode('view');
        setShowModal(true);
      } else {
        alert('Failed to load college details');
      }
    } catch {
      alert('Error loading college details');
    }
  };

  const handleEdit = async (collegeId: string) => {
    try {
      const response = await fetch(`/api/admin/colleges/${collegeId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.data);
        setModalMode('edit');
        setShowModal(true);
      } else {
        alert('Failed to load college for editing');
      }
    } catch {
      alert('Error loading college for editing');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('name', formData.name || '');
      formDataToSend.append('positions', formData.positions || '1');
      formDataToSend.append('rating', formData.rating?.toString() || '4.5');
      formDataToSend.append('portalLink', formData.portalLink || '');
      formDataToSend.append('CollegeLink', formData.CollegeLink || '');
      
      // Add arrays as comma-separated strings
      if (formData.streams && formData.streams.length > 0) {
        formDataToSend.append('streams', formData.streams.join(','));
      }
      if (formData.locations && formData.locations.length > 0) {
        formDataToSend.append('locations', formData.locations.join(','));
      }
      
      // Add complex objects as JSON strings
      if (formData.courses && formData.courses.length > 0) {
        formDataToSend.append('courses', JSON.stringify(formData.courses));
      }
      if (formData.overview) {
        formDataToSend.append('overview', JSON.stringify(formData.overview));
      }
      
      // Add files if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (brochureFile) {
        formDataToSend.append('brochure', brochureFile);
      }
      if (feeStructureFile) {
        formDataToSend.append('feeStructureDoc', feeStructureFile);
      }
      
      const url = modalMode === 'add' 
        ? '/api/admin/colleges'
        : `/api/admin/colleges/${formData._id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(`College ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        setShowModal(false);
        resetForm();
        fetchColleges(currentPage, searchTerm);
      } else {
        alert(result.message || `Failed to ${modalMode} college`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Error ${modalMode === 'add' ? 'creating' : 'updating'} college`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (collegeId: string, collegeName: string) => {
    if (!confirm(`Are you sure you want to delete ${collegeName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/colleges/${collegeId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('College deleted successfully');
        fetchColleges(currentPage, searchTerm);
      } else {
        alert('Failed to delete college');
      }
    } catch {
      alert('Error deleting college');
    }
  };

  // Stream selection handlers
  const handleStreamToggle = (stream: string) => {
    const currentStreams = formData.streams || [];
    const isSelected = currentStreams.includes(stream);
    
    if (isSelected) {
      setFormData({
        ...formData,
        streams: currentStreams.filter(s => s !== stream)
      });
    } else {
      setFormData({
        ...formData,
        streams: [...currentStreams, stream]
      });
    }
  };

  // Location selection handlers
  const handleLocationToggle = (location: string) => {
    const currentLocations = formData.locations || [];
    const isSelected = currentLocations.includes(location);
    
    if (isSelected) {
      setFormData({
        ...formData,
        locations: currentLocations.filter(l => l !== location)
      });
    } else {
      setFormData({
        ...formData,
        locations: [...currentLocations, location]
      });
    }
  };

  // Course management functions
  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [...(formData.courses || []), { name: '', level: '', duration: '', fees: '' }]
    });
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setFormData({ ...formData, courses: updatedCourses });
  };

  const removeCourse = (index: number) => {
    const updatedCourses = (formData.courses || []).filter((_, i) => i !== index);
    setFormData({ ...formData, courses: updatedCourses });
  };

  // Overview points management
  const addOverviewPoint = () => {
    const currentOverview = formData.overview || { heading: '', description: '', points: [] };
    setFormData({
      ...formData,
      overview: {
        ...currentOverview,
        points: [...currentOverview.points, { heading: '', description: '' }]
      }
    });
  };

  const updateOverviewPoint = (index: number, field: keyof OverviewPoint, value: string) => {
    const currentOverview = formData.overview || { heading: '', description: '', points: [] };
    const updatedPoints = [...currentOverview.points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setFormData({
      ...formData,
      overview: { ...currentOverview, points: updatedPoints }
    });
  };

  const removeOverviewPoint = (index: number) => {
    const currentOverview = formData.overview || { heading: '', description: '', points: [] };
    const updatedPoints = currentOverview.points.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      overview: { ...currentOverview, points: updatedPoints }
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Manage Colleges
          </h1>
          <p className="text-slate-400">Add, edit, and manage college information</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-sm">!</span>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search and Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Add Button */}
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New College
            </button>
          </div>
        </div>

        {/* Colleges Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">College</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Streams</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Locations</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      Loading colleges...
                    </td>
                  </tr>
                ) : colleges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No colleges found
                    </td>
                  </tr>
                ) : (
                  colleges.map((college) => (
                    <tr key={college._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {college.image && (
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                              <Image
                                src={`http://localhost:5000${college.image}`}
                                alt={college.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-white font-semibold">{college.name}</h3>
                            {college.rating && (
                              <p className="text-yellow-400 text-sm">★ {college.rating}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {college.streams.slice(0, 2).map((stream, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                            >
                              {stream}
                            </span>
                          ))}
                          {college.streams.length > 2 && (
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                              +{college.streams.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{college.locations.join(', ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-sm font-semibold rounded-full">
                          #{college.positions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(college._id)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(college._id)}
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all"
                            title="Edit College"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(college._id, college.name)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete College"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FIXED WIDTH MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
              
              {/* Modal Header - Fixed */}
              <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === 'add' ? 'Add New College' : 
                   modalMode === 'edit' ? 'Edit College' : 'College Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {modalMode === 'view' && selectedCollege ? (
                  /* COMPLETE VIEW MODE */
                  <div className="space-y-8">
                    
                    {/* Basic Information Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            College Information
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-slate-400">College Name</label>
                              <p className="text-white font-semibold text-lg">{selectedCollege.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-slate-400">Position</label>
                                <p className="text-orange-300 font-semibold text-xl">#{selectedCollege.positions}</p>
                              </div>
                              <div>
                                <label className="text-sm text-slate-400">Rating</label>
                                <p className="text-yellow-400 font-semibold text-xl">★ {selectedCollege.rating || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Streams Offered</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCollege.streams.map((stream, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                              >
                                {stream}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Locations
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCollege.locations.map((location, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-2 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {selectedCollege.image && (
                          <div className="bg-slate-800/50 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">College Image</h3>
                            <div className="w-full h-64 relative rounded-lg overflow-hidden">
                              <Image
                                src={`http://localhost:5000${selectedCollege.image}`}
                                alt={selectedCollege.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-800/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-slate-400">Portal Link</label>
                              <p className="text-blue-400 break-all">
                                {selectedCollege.portalLink || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-slate-400">College Website</label>
                              <p className="text-blue-400 break-all">
                                {selectedCollege.CollegeLink || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Courses Section */}
                    {selectedCollege.courses && selectedCollege.courses.length > 0 && (
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Courses Offered ({selectedCollege.courses.length})
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-700/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Course Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Level</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Duration</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Fees</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-600">
                              {selectedCollege.courses.map((course, idx) => (
                                <tr key={idx} className="hover:bg-slate-700/30">
                                  <td className="px-4 py-3 text-white font-medium">{course.name}</td>
                                  <td className="px-4 py-3 text-slate-300">{course.level}</td>
                                  <td className="px-4 py-3 text-slate-300">{course.duration}</td>
                                  <td className="px-4 py-3 text-green-400 font-semibold">₹{course.fees}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Overview Section */}
                    {selectedCollege.overview && (
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
                        {selectedCollege.overview.heading && (
                          <h4 className="text-white font-semibold text-xl mb-3">{selectedCollege.overview.heading}</h4>
                        )}
                        {selectedCollege.overview.description && (
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                            {selectedCollege.overview.description}
                          </p>
                        )}
                        
                        {selectedCollege.overview.points && selectedCollege.overview.points.length > 0 && (
                          <div>
                            <h5 className="text-white font-semibold mb-3">Key Points</h5>
                            <div className="space-y-4">
                              {selectedCollege.overview.points.map((point, idx) => (
                                <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-500">
                                  <h6 className="text-white font-semibold mb-2">{point.heading}</h6>
                                  <p className="text-slate-300 text-sm leading-relaxed">{point.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ADD/EDIT MODE CONTENT */
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">College Name *</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter college name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Position *</label>
                        <input
                          type="number"
                          value={formData.positions || ''}
                          onChange={(e) => setFormData({...formData, positions: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter position"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating || ''}
                          onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="4.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Image Upload</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* STREAMS MULTI-SELECT */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Streams *</label>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 min-h-[100px]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableStreams.map((stream) => {
                            const isSelected = formData.streams?.includes(stream);
                            return (
                              <label key={stream} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleStreamToggle(stream)}
                                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                                />
                                <span className={`text-sm ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                                  {stream}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {formData.streams && formData.streams.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <p className="text-xs text-slate-400 mb-2">Selected streams:</p>
                            <div className="flex flex-wrap gap-1">
                              {formData.streams.map((stream, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                  {stream}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LOCATIONS MULTI-SELECT */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Locations *</label>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 min-h-[100px]">
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                          {availableLocations.map((location) => {
                            const isSelected = formData.locations?.includes(location);
                            return (
                              <label key={location} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleLocationToggle(location)}
                                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                                />
                                <span className={`text-sm ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                                  {location}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {formData.locations && formData.locations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <p className="text-xs text-slate-400 mb-2">Selected locations:</p>
                            <div className="flex flex-wrap gap-1">
                              {formData.locations.map((location, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Portal Link</label>
                        <input
                          type="url"
                          value={formData.portalLink || ''}
                          onChange={(e) => setFormData({...formData, portalLink: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/admissions"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">College Website</label>
                        <input
                          type="url"
                          value={formData.CollegeLink || ''}
                          onChange={(e) => setFormData({...formData, CollegeLink: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://college-website.com"
                        />
                      </div>
                    </div>

                    {/* Courses Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-slate-300">Courses</label>
                        <button
                          type="button"
                          onClick={addCourse}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add Course
                        </button>
                      </div>
                      
                      {formData.courses && formData.courses.map((course, index) => (
                        <div key={index} className="bg-slate-800/50 p-4 rounded-lg mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                              type="text"
                              value={course.name}
                              onChange={(e) => updateCourse(index, 'name', e.target.value)}
                              placeholder="Course Name"
                              className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={course.level}
                              onChange={(e) => updateCourse(index, 'level', e.target.value)}
                              placeholder="Level (B.Tech, M.Tech)"
                              className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={course.duration}
                              onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                              placeholder="Duration (4 years)"
                              className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={course.fees}
                                onChange={(e) => updateCourse(index, 'fees', e.target.value)}
                                placeholder="Fees (200000)"
                                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeCourse(index)}
                                className="px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overview Section */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-4">Overview</label>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={formData.overview?.heading || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            overview: { ...(formData.overview || { heading: '', description: '', points: [] }), heading: e.target.value }
                          })}
                          placeholder="Overview Heading"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        <textarea
                          value={formData.overview?.description || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            overview: { ...(formData.overview || { heading: '', description: '', points: [] }), description: e.target.value }
                          })}
                          placeholder="Overview Description"
                          rows={4}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-300">Key Points</span>
                            <button
                              type="button"
                              onClick={addOverviewPoint}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Add Point
                            </button>
                          </div>
                          
                          {formData.overview?.points.map((point, index) => (
                            <div key={index} className="bg-slate-800/30 p-3 rounded-lg mb-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={point.heading}
                                  onChange={(e) => updateOverviewPoint(index, 'heading', e.target.value)}
                                  placeholder="Point heading"
                                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOverviewPoint(index)}
                                  className="px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </button>
                              </div>
                              <textarea
                                value={point.description}
                                onChange={(e) => updateOverviewPoint(index, 'description', e.target.value)}
                                placeholder="Point description"
                                rows={2}
                                className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Brochure (PDF)</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Fee Structure (PDF)</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setFeeStructureFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer - Fixed */}
              {modalMode !== 'view' && (
                <div className="border-t border-slate-700 bg-slate-900 px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Saving...' : `${modalMode === 'add' ? 'Create' : 'Update'} College`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CollegesManagementPage;
