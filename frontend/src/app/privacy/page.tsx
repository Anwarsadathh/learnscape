'use client';

import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  FileText, 

  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = "September 9, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
       
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Your Privacy Matters</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Learn how LearnScape protects your personal information and respects your privacy rights.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">

            {/* Introduction - FIXED */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Introduction</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  {`Welcome to LearnScape ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our educational services.`}
                </p>
                <p>
                  By using our services, you agree to the collection and use of information in accordance with this policy. This policy is compliant with the Digital Personal Data Protection Act (DPDPA) 2023 of India and other applicable privacy laws.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-6">
                
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-400" />
                    Personal Information You Provide
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Name, email address, and phone number when you contact us or register for updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Academic interests and educational background when you inquire about colleges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Communication preferences and feedback you provide</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Automatically Collected Information
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>IP address, browser type, and device information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Pages visited, time spent on our website, and referral sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Search queries and interactions with our college database</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Continue with other sections... */}
            {/* Changes to Policy - FIXED */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Changes to This Privacy Policy</h2>
              </div>
              <div className="text-slate-300 leading-relaxed">
                <p>
                  {`We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "September 9, 2025" date.`}
                </p>
              </div>
            </section>

            {/* Rest of your sections remain the same */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
