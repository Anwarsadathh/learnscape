'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Shield,
  Target,
  Heart,
  Phone, 
  MapPin, 
  Award,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Calendar,
  FileText,
  Info,
  Home,
  Upload,
  Camera,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface FormData {
  // Personal Details
  applicantName: string;
  courseInterested: string;
  address: string;
  pin: string;
  nationality: string;
  dob: string;
  aadhaar: string;
  bloodGroup: string;
  gender: string;
  mobile: string;
  email: string;
  caste: string;
  category: string;
  
  // Family Details
  fatherName: string;
  fatherOccupation: string;
  fatherQualification: string;
  annualIncome: string;
  fatherMobile: string;
  motherName: string;
  motherQualification: string;
  motherOccupation: string;
  localGuardian: string;
  guardianMobile: string;
  guardianAddress: string;
  sourceCode: string;
  
  // Files
  photo: File | null;
  sslcMarksCard: File | null;
  hscMarksCard: File | null;
  aadhaarCard: File | null;
  transferCertificate: File | null;
  
  // Agreement
  agreeTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface PaymentDetails {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: RazorpayResponse) => void;
      prefill: {
        name: string;
        email: string;
        contact: string;
      };
      theme: {
        color: string;
      };
      modal: {
        ondismiss: () => void;
      };
    }) => {
      open: () => void;
    };
  }
}

const ScholarshipForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
const [storedPaymentDetails, setStoredPaymentDetails] = useState<PaymentDetails | null>(null);


  const [formData, setFormData] = useState<FormData>({
    applicantName: '',
    courseInterested: '',
    address: '',
    pin: '',
    nationality: 'Indian',
    dob: '',
    aadhaar: '',
    bloodGroup: '',
    gender: '',
    mobile: '',
    email: '',
    caste: '',
    category: '',
    fatherName: '',
    fatherOccupation: '',
    fatherQualification: '',
    annualIncome: '',
    fatherMobile: '',
    motherName: '',
    motherQualification: '',
    motherOccupation: '',
    localGuardian: '',
    guardianMobile: '',
    guardianAddress: '',
    sourceCode: '',
    photo: null,
    sslcMarksCard: null,
    hscMarksCard: null,
    aadhaarCard: null,
    transferCertificate: null,
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const totalSteps = 4;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Extract UTM parameters and source code
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sourceCode = searchParams.get('ref') || searchParams.get('source') || '';
    if (sourceCode) {
      setFormData(prev => ({ ...prev, sourceCode }));
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch(step) {
      case 1: // Personal Details
        if (!formData.applicantName.trim()) newErrors.applicantName = 'Name is required';
        if (!formData.courseInterested.trim()) newErrors.courseInterested = 'Course is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.pin.trim()) newErrors.pin = 'PIN code is required';
        else if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = 'Invalid PIN code';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar number is required';
        else if (!/^\d{12}$/.test(formData.aadhaar.replace(/\s/g, ''))) newErrors.aadhaar = 'Invalid Aadhaar number';
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.photo) newErrors.photo = 'Photo is required';
        break;
        
      case 2: // Family Details
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s name is required';
        if (!formData.fatherOccupation.trim()) newErrors.fatherOccupation = 'Father\'s occupation is required';
        if (!formData.fatherQualification.trim()) newErrors.fatherQualification = 'Father\'s qualification is required';
        if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
        if (!formData.fatherMobile.trim()) newErrors.fatherMobile = 'Father\'s mobile is required';
        else if (!/^[6-9]\d{9}$/.test(formData.fatherMobile)) newErrors.fatherMobile = 'Invalid mobile number';
        if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s name is required';
        if (!formData.motherQualification.trim()) newErrors.motherQualification = 'Mother\'s qualification is required';
        if (!formData.motherOccupation.trim()) newErrors.motherOccupation = 'Mother\'s occupation is required';
        break;
        
      case 3: // Documents
        if (!formData.sslcMarksCard) newErrors.sslcMarksCard = '10th marks card is required';
        if (!formData.hscMarksCard) newErrors.hscMarksCard = '12th marks card is required';
        if (!formData.aadhaarCard) newErrors.aadhaarCard = 'Aadhaar card is required';
        if (!formData.transferCertificate) newErrors.transferCertificate = 'Transfer certificate is required';
        break;
        
      case 4: // Agreement
        if (!formData.agreeTerms) newErrors.agreeTerms = 'Please agree to terms and conditions';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, files } = e.target;
  if (files && files) {
   const file = files[0]; // ✅ CORRECT - files[0] is a File object
    
    // Now file.size and file.type will work
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB' }));
      return;
    }
    
    const validTypes = name === 'photo' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(file.type)) {
      const typeText = name === 'photo' ? 'JPG, PNG' : 'PDF, JPG, PNG';
      setErrors(prev => ({ ...prev, [name]: `Please upload ${typeText} files only` }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: file }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};



// Update handleSubmit to store payment details
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // If payment is pending, trigger payment instead of submitting again
  if (submitStatus === 'success' && paymentPending && storedPaymentDetails) {
    await initiatePayment(storedPaymentDetails);
    return;
  }
  
  if (!validateStep(4)) return;
  
  setIsSubmitting(true);
  setSubmitStatus('idle');
  setErrorMessage('');
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
    
    // Create FormData for file upload
    const submitData = new FormData();
    
    // Add all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        submitData.append(key, value);
      } else if (typeof value === 'boolean') {
        submitData.append(key, value ? 'true' : 'false');
      } else if (value) {
        submitData.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_URL}/scholarships/apply`, {
      method: 'POST',
      body: submitData
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      setSubmitStatus('success');
      
      // If payment is required, initiate payment
      if (data.paymentRequired && data.paymentDetails) {
        setPaymentPending(true);
        setStoredPaymentDetails(data.paymentDetails); // ✅ Store payment details
        
        // Show different message for continuing vs new application
        if (data.continueExisting) {
          setErrorMessage('');
        }
        
        await initiatePayment(data.paymentDetails);
      } else {
        setTimeout(() => {
          router.push('/scholarships/success');
        }, 2000);
      }
    } else {
      throw new Error(data.message || 'Failed to submit application');
    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitStatus('error');
    
    // Handle specific error messages
    const errorMsg = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
    
    if (errorMsg.includes('already exists and payment is completed')) {
      setErrorMessage('You have already submitted an application with this email address. Please contact support if you need assistance.');
    } else {
      setErrorMessage(errorMsg);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const initiatePayment = async (paymentDetails: PaymentDetails) => {
    const options = {
      key: paymentDetails.key,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      name: 'LearnScape Scholarship',
      description: 'Scholarship Application Fee',
      order_id: paymentDetails.orderId,
      handler: async (response: RazorpayResponse) => {
        await verifyPayment(response);
      },
      prefill: {
        name: formData.applicantName,
        email: formData.email,
        contact: formData.mobile,
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: () => {
          setPaymentPending(false);
          setErrorMessage('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (paymentResponse: RazorpayResponse) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
      const response = await fetch(`${API_URL}/scholarships/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentResponse),
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentPending(false);
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/scholarships/success');
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentPending(false);
      setErrorMessage('Payment verification failed. Please contact support.');
    }
  };

  // Beautiful Premium Step Indicator
  const renderStepIndicator = () => (
    <div className="relative mb-8 sm:mb-12">
      {/* Desktop Step Indicator */}
      <div className="hidden sm:flex items-center justify-between max-w-3xl mx-auto">
        {[
          { num: 1, label: 'Personal', icon: User, color: 'blue' },
          { num: 2, label: 'Family', icon: Home, color: 'purple' },
          { num: 3, label: 'Documents', icon: FileText, color: 'pink' },
          { num: 4, label: 'Submit', icon: Award, color: 'green' }
        ].map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          
          return (
            <div key={step.num} className="flex-1 flex items-center">
              <div className="relative">
                {/* Glow effect for active step */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-full blur-lg opacity-40 animate-pulse`}></div>
                )}
                
                {/* Step circle */}
                <div className={`
                  relative w-14 h-14 rounded-full flex flex-col items-center justify-center 
                  border-2 transition-all duration-300 group cursor-pointer
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white shadow-lg shadow-green-500/25' 
                    : isActive 
                      ? `bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 border-${step.color}-400 text-white shadow-lg shadow-${step.color}-500/25`
                      : 'bg-slate-100 border-slate-300 text-slate-500 hover:border-slate-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                {/* Step label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isActive || isCompleted ? `text-${step.color}-600` : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
              
              {/* Connector line */}
              {index < 3 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  currentStep > step.num 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                    : 'bg-slate-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-slate-200">
            <span className="text-sm font-bold text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* Current step info */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Family Details'}
            {currentStep === 3 && 'Upload Documents'}
            {currentStep === 4 && 'Review & Submit'}
          </h3>
          <p className="text-sm text-slate-400">
            {currentStep === 1 && 'Tell us about yourself'}
            {currentStep === 2 && 'Family background information'}
            {currentStep === 3 && 'Upload required documents'}
            {currentStep === 4 && 'Review and complete application'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
     switch(currentStep) {
    case 1:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-3">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Step 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
            <p className="text-sm sm:text-base text-gray-600">Tell us about yourself</p>
          </div>

          {/* Photo Upload Section - Mobile Optimized */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photograph <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-400 ${
                formData.photo ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${errors.photo ? 'border-red-400 bg-red-50' : ''}`}>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo"
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.photo ? formData.photo.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                </label>
              </div>
              {errors.photo && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.photo}
                </p>
              )}
            </div>

            <div className="w-full sm:w-2/3 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.applicantName ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.applicantName && (
                    <p className="mt-1 text-xs text-red-500">{errors.applicantName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Course Interested <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseInterested"
                    value={formData.courseInterested}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.courseInterested ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="e.g., B.Tech Computer Science"
                  />
                  {errors.courseInterested && (
                    <p className="mt-1 text-xs text-red-500">{errors.courseInterested}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.dob ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.gender ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.mobile ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.aadhaar ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                  />
                  {errors.aadhaar && (
                    <p className="mt-1 text-xs text-red-500">{errors.aadhaar}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.bloodGroup ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-xs text-red-500">{errors.bloodGroup}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.category ? 'border-red-400' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Caste
                  </label>
                  <input
                    type="text"
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.address ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.pin ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="560001"
                    maxLength={6}
                  />
                  {errors.pin && (
                    <p className="mt-1 text-xs text-red-500">{errors.pin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Indian"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 mb-3">
              <Home className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Step 2</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Family Information</h2>
            <p className="text-sm sm:text-base text-gray-600">Tell us about your family background</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Father's Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Father&apos;s Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.fatherName ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Father's full name"
              />
              {errors.fatherName && (
                <p className="mt-1 text-xs text-red-500">{errors.fatherName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Father&apos;s Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.fatherOccupation ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Job title/Business"
              />
              {errors.fatherOccupation && (
                <p className="mt-1 text-xs text-red-500">{errors.fatherOccupation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Father&apos;s Education <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherQualification"
                value={formData.fatherQualification}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.fatherQualification ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Highest qualification"
              />
              {errors.fatherQualification && (
                <p className="mt-1 text-xs text-red-500">{errors.fatherQualification}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Father&apos;s Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="fatherMobile"
                  value={formData.fatherMobile}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.fatherMobile ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
              {errors.fatherMobile && (
                <p className="mt-1 text-xs text-red-500">{errors.fatherMobile}</p>
              )}
            </div>

            {/* Mother's Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mother&apos;s Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.motherName ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Mother's full name"
              />
              {errors.motherName && (
                <p className="mt-1 text-xs text-red-500">{errors.motherName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mother&apos;s Education <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherQualification"
                value={formData.motherQualification}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.motherQualification ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Highest qualification"
              />
              {errors.motherQualification && (
                <p className="mt-1 text-xs text-red-500">{errors.motherQualification}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mother&apos;s Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.motherOccupation ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Job title/Homemaker"
              />
              {errors.motherOccupation && (
                <p className="mt-1 text-xs text-red-500">{errors.motherOccupation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Annual Family Income <span className="text-red-500">*</span>
              </label>
              <select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.annualIncome ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Select Income Range</option>
                <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                <option value="1-3 Lakhs">₹1 - 3 Lakhs</option>
                <option value="3-5 Lakhs">₹3 - 5 Lakhs</option>
                <option value="5-8 Lakhs">₹5 - 8 Lakhs</option>
                <option value="8-12 Lakhs">₹8 - 12 Lakhs</option>
                <option value="Above 12 Lakhs">Above ₹12 Lakhs</option>
              </select>
              {errors.annualIncome && (
                <p className="mt-1 text-xs text-red-500">{errors.annualIncome}</p>
              )}
            </div>

            {/* Optional Guardian Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Local Guardian
              </label>
              <input
                type="text"
                name="localGuardian"
                value={formData.localGuardian}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="If different from parents"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Guardian Mobile
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="guardianMobile"
                  value={formData.guardianMobile}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Source Code
              </label>
              <input
                type="text"
                name="sourceCode"
                value={formData.sourceCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Referral code (if any)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Guardian Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="guardianAddress"
                value={formData.guardianAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Guardian address (if different from yours)"
              />
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-3">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Step 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
            <p className="text-sm sm:text-base text-gray-600">Upload required documents (PDF, JPG, PNG - Max 2MB each)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 10th Marks Card */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">10th Grade Marks Card</h3>
                  <p className="text-xs sm:text-sm text-red-600">Required Document</p>
                </div>
              </div>
              <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-400 ${
                formData.sslcMarksCard ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${errors.sslcMarksCard ? 'border-red-400 bg-red-50' : ''}`}>
                <input
                  type="file"
                  name="sslcMarksCard"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="sslcMarksCard"
                />
                <label htmlFor="sslcMarksCard" className="cursor-pointer">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.sslcMarksCard ? formData.sslcMarksCard.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 2MB</p>
                </label>
              </div>
              {errors.sslcMarksCard && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.sslcMarksCard}
                </p>
              )}
            </div>

            {/* 12th Marks Card */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">12th Grade Marks Card</h3>
                  <p className="text-xs sm:text-sm text-red-600">Required Document</p>
                </div>
              </div>
              <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-400 ${
                formData.hscMarksCard ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${errors.hscMarksCard ? 'border-red-400 bg-red-50' : ''}`}>
                <input
                  type="file"
                  name="hscMarksCard"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="hscMarksCard"
                />
                <label htmlFor="hscMarksCard" className="cursor-pointer">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.hscMarksCard ? formData.hscMarksCard.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 2MB</p>
                </label>
              </div>
              {errors.hscMarksCard && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.hscMarksCard}
                </p>
              )}
            </div>

            {/* Aadhaar Card */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Aadhaar Card</h3>
                  <p className="text-xs sm:text-sm text-red-600">Required Document</p>
                </div>
              </div>
              <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-400 ${
                formData.aadhaarCard ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${errors.aadhaarCard ? 'border-red-400 bg-red-50' : ''}`}>
                <input
                  type="file"
                  name="aadhaarCard"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="aadhaarCard"
                />
                <label htmlFor="aadhaarCard" className="cursor-pointer">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.aadhaarCard ? formData.aadhaarCard.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 2MB</p>
                </label>
              </div>
              {errors.aadhaarCard && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.aadhaarCard}
                </p>
              )}
            </div>

            {/* Transfer Certificate */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Transfer Certificate</h3>
                  <p className="text-xs sm:text-sm text-red-600">Required Document</p>
                </div>
              </div>
              <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all hover:border-blue-400 ${
                formData.transferCertificate ? 'border-green-400 bg-green-50' : 'border-gray-300'
              } ${errors.transferCertificate ? 'border-red-400 bg-red-50' : ''}`}>
                <input
                  type="file"
                  name="transferCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="transferCertificate"
                />
                <label htmlFor="transferCertificate" className="cursor-pointer">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.transferCertificate ? formData.transferCertificate.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">TC/CC/Migration Certificate</p>
                </label>
              </div>
              {errors.transferCertificate && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.transferCertificate}
                </p>
              )}
            </div>
          </div>

          {/* Document Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">Document Guidelines</h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <li>• All documents should be clear and readable</li>
                  <li>• Maximum file size: 2MB per document</li>
                  <li>• Accepted formats: PDF, JPG, PNG</li>
                  <li>• Ensure all text and details are visible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
     case 4:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-3">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">Final Step</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
            <p className="text-sm sm:text-base text-gray-600">Please review your information before submitting</p>
          </div>

          {/* Application Fee Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">Application Fee</h4>
               <p className="text-blue-800 text-xs sm:text-sm">
  A nominal application processing fee of <strong>₹1</strong> is required to complete your scholarship application.
  This fee helps us maintain the quality of our scholarship program and process applications efficiently.
</p>
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Declaration
            </h3>
            <div className="text-gray-700 space-y-3 text-xs sm:text-sm">
              <p className="font-medium">I hereby declare that:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  All information provided in this application is true and accurate to the best of my knowledge.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  I understand that any false information may result in the rejection of my application.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  I agree to abide by all terms and conditions of the scholarship program.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  I consent to the processing of my personal data for scholarship evaluation purposes.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-lg mt-4 sm:mt-6 border">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded mt-0.5"
              />
              <label htmlFor="agreeTerms" className="text-gray-700 font-medium text-xs sm:text-sm cursor-pointer">
                I have read and understood the declaration above. I agree to all terms and conditions and confirm 
                that all information provided is accurate and truthful.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.agreeTerms}
              </p>
            )}
          </div>
            {/* Error Message */}
            {submitStatus === 'error' && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-red-900 mb-1">Submission Error</h4>
                    <p className="text-red-800 text-xs sm:text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

          {/* Success Message - REPLACE THIS BLOCK */}
{submitStatus === 'success' && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5" />
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-green-900 mb-1">
          {paymentPending 
            ? 'Application Ready for Payment!' 
            : 'Application Submitted Successfully!'}
        </h4>
        <p className="text-green-800 text-xs sm:text-sm">
          {paymentPending 
            ? 'Please complete the payment to finalize your application.'
            : 'You will receive a confirmation email within 24 hours.'}
        </p>
      </div>
    </div>
  </div>
)}

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-12">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Limited Scholarships Available</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block text-white mb-1 sm:mb-2">Unlock Your</span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Educational Dreams
              </span>
            </span>
          </h1>
          
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto px-4">
            Apply for our prestigious scholarship program and transform your future with quality education
          </p>

          {/* Quick Stats - Mobile Optimized */}
          <div className="flex justify-center gap-4 sm:gap-8 mt-6 sm:mt-8">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-400">₹10L+</div>
              <div className="text-xs text-slate-500">Scholarships Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-400">5000+</div>
              <div className="text-xs text-slate-500">Students Benefited</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-400">95%</div>
              <div className="text-xs text-slate-500">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Form Container with White Background */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* Subtle gradient accent at top */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          
          <div className="p-4 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              {renderStep()}

            {/* Navigation - Mobile Optimized */}
<div className="flex items-center justify-between mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
  <button
    type="button"
    onClick={handlePrevious}
    className={`
      flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 
      bg-gray-100 text-gray-700 rounded-xl text-sm sm:text-base
      font-medium hover:bg-gray-200 transition-all
      ${currentStep === 1 ? 'invisible' : ''}
    `}
  >
    <ChevronRight className="w-4 h-4 rotate-180" />
    <span className="hidden sm:inline">Previous</span>
  </button>

  {/* Mobile Progress Dots - Fixed Position */}
  <div className="flex items-center gap-1.5 sm:gap-2">
    {[1, 2, 3, 4].map((step) => (
      <div
        key={step}
        className={`
          h-1.5 sm:h-2 transition-all rounded-full
          ${currentStep === step 
            ? 'w-6 sm:w-8 bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'w-1.5 sm:w-2 bg-gray-300'
          }
        `}
      />
    ))}
  </div>

  {/* REPLACE THIS BUTTON BLOCK */}
 {currentStep < totalSteps ? (
  <button
    type="button"
    onClick={handleNext}
    className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
  >
    <span className="hidden sm:inline">Next</span>
    <span className="sm:hidden">Next</span>
    <ChevronRight className="w-4 h-4" />
  </button>
) : (
  <button
    type={submitStatus === 'success' && paymentPending ? "button" : "submit"}
    onClick={submitStatus === 'success' && paymentPending ? async () => {
      // Retry payment with stored payment details
      if (storedPaymentDetails) {
        await initiatePayment(storedPaymentDetails);
      }
    } : undefined}
    disabled={isSubmitting}
    className="flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-medium hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  >
    {isSubmitting ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="hidden sm:inline">{submitStatus === 'success' && paymentPending ? 'Processing...' : 'Submitting...'}</span>
        <span className="sm:hidden">{submitStatus === 'success' && paymentPending ? 'Process...' : 'Submit...'}</span>
      </>
    ) : (
      <>
        {submitStatus === 'success' && paymentPending ? (
          <>
            <span className="hidden sm:inline">Complete Payment</span>
            <span className="sm:hidden">Pay Now</span>
            <CreditCard className="w-4 h-4" />
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Submit Application</span>
            <span className="sm:hidden">Submit</span>
            <Award className="w-4 h-4" />
          </>
        )}
      </>
    )}
  </button>
)}
</div>

            </form>
          </div>
        </div>

        {/* Benefits Section - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-12">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">100% Secure</h3>
            <p className="text-xs sm:text-sm text-slate-400">Your data is encrypted and protected</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Quick Process</h3>
            <p className="text-xs sm:text-sm text-slate-400">Get results within 3-5 business days</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Full Support</h3>
            <p className="text-xs sm:text-sm text-slate-400">24/7 assistance throughout your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipForm;
