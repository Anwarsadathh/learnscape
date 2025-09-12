'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Info,
  CheckCircle,
  Users,
  Clock,
  BookOpen,
  Mail,
  Phone,
  Scale,
  UserX,
  CreditCard,
  Copyright,
  Globe
} from 'lucide-react';

const TermsAndConditionsPage = () => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm mb-6">
            <Scale className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-300 uppercase tracking-wider">Legal Agreement</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Terms & Conditions
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
  {`Please read these terms carefully before using LearnScape's educational services.`}
</p>

          
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">

            {/* Acceptance of Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  {`By accessing or using the LearnScape platform ("we," "us," "our"), you ("user," "you") agree to be bound by these Terms & Conditions ("Terms") and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`}
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-1">Important Note:</h4>
                      <p className="text-sm text-slate-300">
                        These Terms constitute a legal agreement between you and LearnScape. By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Description */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Services Description</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  LearnScape provides an online educational platform that offers:
                </p>
                <div className="grid gap-3">
                  {[
                    "College and university information and search services",
                    "Educational content and resources",
                    "Contact facilitation between students and educational institutions",
                    "Career guidance and assessment tools",
                    "Educational news and updates"
                  ].map((service, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* User Obligations */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">User Obligations</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>As a user of LearnScape, you agree to:</p>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Permitted Uses:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Use our services for lawful educational purposes only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Maintain the confidentiality of your account credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Provide accurate information when submitting forms or applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Respect intellectual property rights</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                  <h4 className="font-semibold text-red-300 mb-3">Prohibited Activities:</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Using our services for any illegal or unauthorized purpose</li>
                    <li>• Attempting to gain unauthorized access to our systems</li>
                    <li>• Uploading malicious content or spam</li>
                    <li>• Impersonating others or providing false information</li>
                    <li>• Interfering with or disrupting our services</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Copyright className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Intellectual Property Rights</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  All content and materials on LearnScape, including but not limited to text, graphics, logos, images, and software, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Our Rights</h4>
                    <ul className="text-sm space-y-1">
                      <li>• All platform content and design</li>
                      <li>• LearnScape branding and trademarks</li>
                      <li>• Proprietary algorithms and systems</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Your Rights</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Limited license to use our services</li>
                      <li>• Personal, non-commercial use only</li>
                      <li>• No right to redistribute content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Payment Terms</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  Most of our services are currently free of charge. However, if we introduce premium services in the future:
                </p>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>All fees will be clearly displayed before purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Payments are processed securely through trusted payment providers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Refund policies will be clearly stated at the time of purchase</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Privacy and Data Protection</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-indigo-300 mb-2">Data Protection Commitment:</h4>
                      <p className="text-sm text-slate-300">
                        We comply with the Digital Personal Data Protection Act (DPDPA) 2023 and other applicable Indian data protection laws. 
                        Please read our <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link> for detailed information about how we handle your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <UserX className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Account Termination</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  We reserve the right to suspend or terminate your access to LearnScape at any time, with or without notice, for conduct that violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                </p>
                <div className="grid gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Grounds for Termination:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Violation of these Terms</li>
                      <li>• Fraudulent or illegal activity</li>
                      <li>• Abuse of our services or other users</li>
                      <li>• Extended period of inactivity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-300 mb-2">Important Legal Notice:</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        LearnScape provides educational information services {`"as is"`} and {`"as available"`} without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on our platform.
                      </p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• We are not responsible for decisions made based on information from our platform</li>
                        <li>• We do not guarantee admission to any educational institution</li>
                        <li>• Our liability is limited to the maximum extent permitted by Indian law</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Governing Law and Jurisdiction</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.
                </p>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Dispute Resolution:</h4>
                  <p className="text-sm">
                    We encourage users to contact us directly to resolve any disputes. If a dispute cannot be resolved amicably, 
                    it will be subject to the jurisdiction of the appropriate courts in India.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Changes to These Terms</h2>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-4">
                <p>
                  {`We may update these Terms from time to time. When we do, we will post the updated Terms on this page and update the "Last Updated" date. Your continued use of LearnScape after any changes constitutes acceptance of the new Terms.`}
                </p>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Notification of Changes:</h4>
                  <p className="text-sm">
                    For significant changes, we will provide advance notice through our website or by email. 
                    We recommend reviewing these Terms periodically.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
              </div>
              <div className="text-slate-300 leading-relaxed">
                <p className="mb-6">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h4 className="font-semibold text-white mb-3">General Support</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">learnscapeinfo@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="text-sm">+91 860 600 4306</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
            <Link href="/" className="hover:text-blue-400 transition-colors">Back to Home</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
