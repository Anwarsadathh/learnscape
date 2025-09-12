'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Award, Mail, Phone, Home, Clock } from 'lucide-react';

const ScholarshipSuccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8 py-22 px-4">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full mb-4 sm:mb-6 animate-bounce">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-2">
            Thank you for applying to our scholarship program. Your payment has been processed and your application is now under review.
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden mb-6 sm:mb-8 mx-2 sm:mx-0">
          <div className="h-1 sm:h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
          
          <div className="p-4 sm:p-8 md:p-12">
            {/* What's Next Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                What Happens Next?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mb-3 sm:mb-4">
                    <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Email Confirmation</h3>
                  <p className="text-xs sm:text-sm text-gray-600">You'll receive a confirmation email within 24 hours with your application details.</p>
                </div>
                
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Review Process</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Our team will review your application within 3-5 business days.</p>
                </div>
                
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-3 sm:mb-4">
                    <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Results</h3>
                  <p className="text-xs sm:text-sm text-gray-600">We'll contact you with the scholarship decision via email or phone.</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3">📋 Important Information</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                <li>• Keep this confirmation for your records</li>
                <li>• Check your email regularly for updates</li>
                <li>• Contact us if you don't receive confirmation within 24 hours</li>
                <li>• Your application fee of ₹1 has been successfully processed</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Need Help?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-600 mb-1">📧 Email Support</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">scholarships@learnscape.com</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">📞 Phone Support</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">+91 860 600 4306</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:shadow-lg transition-all w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipSuccess;
