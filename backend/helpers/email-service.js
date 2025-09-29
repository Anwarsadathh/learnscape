const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
  // Send scholarship application success email
  async sendScholarshipSuccess(scholarshipData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
        to: [scholarshipData.email],
        subject: `🎉 Scholarship Application Successful - ${scholarshipData.applicationId}`,
        html: this.getScholarshipSuccessHTML(scholarshipData),
      });
      if (error) {
        console.error('❌ Error sending scholarship success email:', error);
        return { success: false, error };
      }
      console.log('✅ Scholarship success email sent to:', scholarshipData.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Scholarship success email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send scholarship payment failed email
  async sendScholarshipPaymentFailed(scholarshipData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
        to: [scholarshipData.email],
        subject: `⚠️ Payment Issue - Complete Your Scholarship Application`,
        html: this.getScholarshipPaymentFailedHTML(scholarshipData),
      });
      if (error) {
        console.error('❌ Error sending payment failed email:', error);
        return { success: false, error };
      }
      console.log('✅ Payment failed email sent to:', scholarshipData.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Payment failed email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send scholarship payment retry reminder
  async sendScholarshipPaymentRetry(scholarshipData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
        to: [scholarshipData.email],
        subject: `🔄 Complete Your Scholarship Payment - ${scholarshipData.applicationId}`,
        html: this.getScholarshipPaymentRetryHTML(scholarshipData),
      });
      if (error) {
        console.error('❌ Error sending payment retry email:', error);
        return { success: false, error };
      }
      console.log('✅ Payment retry email sent to:', scholarshipData.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Payment retry email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send confirmation email to the enquirer
  async sendEnquiryConfirmation(enquiryData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape <noreply@learnscapeedu.com>',
        to: [enquiryData.email],
        subject: `Thank you for your enquiry, ${enquiryData.name}!`,
        html: this.getEnquiryConfirmationHTML(enquiryData),
      });
      if (error) {
        console.error('❌ Error sending confirmation email:', error);
        return { success: false, error };
      }
      console.log('✅ Confirmation email sent to:', enquiryData.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send notification email to admin
  async sendAdminNotification(enquiryData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape System <system@learnscapeedu.com>',
        to: [process.env.ADMIN_EMAIL],
        subject: `🆕 New Enquiry: ${enquiryData.name} - ${enquiryData.collegeName}`,
        html: this.getAdminNotificationHTML(enquiryData),
      });
      if (error) {
        console.error('❌ Error sending admin notification:', error);
        return { success: false, error };
      }
      console.log('✅ Admin notification sent to:', process.env.ADMIN_EMAIL);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Admin notification error:', error);
      return { success: false, error: error.message };
    }
  },
// ✅ NEW: Send scholarship approved email
async sendScholarshipApproved(scholarshipData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
      to: [scholarshipData.email],
      subject: `🎉 Congratulations! Your Scholarship Application Approved - ${scholarshipData.applicationId}`,
      html: this.getScholarshipApprovedHTML(scholarshipData),
    });
    if (error) {
      console.error('❌ Error sending scholarship approved email:', error);
      return { success: false, error };
    }
    console.log('✅ Scholarship approved email sent to:', scholarshipData.email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Scholarship approved email error:', error);
    return { success: false, error: error.message };
  }
},

// ✅ NEW: Send scholarship rejected email
async sendScholarshipRejected(scholarshipData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
      to: [scholarshipData.email],
      subject: `📋 Update on Your Scholarship Application - ${scholarshipData.applicationId}`,
      html: this.getScholarshipRejectedHTML(scholarshipData),
    });
    if (error) {
      console.error('❌ Error sending scholarship rejected email:', error);
      return { success: false, error };
    }
    console.log('✅ Scholarship rejected email sent to:', scholarshipData.email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Scholarship rejected email error:', error);
    return { success: false, error: error.message };
  }
},

// ✅ NEW: Send scholarship processing email
async sendScholarshipProcessing(scholarshipData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LearnScape Scholarships <scholarships@learnscapeedu.com>',
      to: [scholarshipData.email],
      subject: `📝 Your Scholarship Application is Under Review - ${scholarshipData.applicationId}`,
      html: this.getScholarshipProcessingHTML(scholarshipData),
    });
    if (error) {
      console.error('❌ Error sending scholarship processing email:', error);
      return { success: false, error };
    }
    console.log('✅ Scholarship processing email sent to:', scholarshipData.email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Scholarship processing email error:', error);
    return { success: false, error: error.message };
  }
},

  // Send contact confirmation email to user
  async sendContactConfirmation(contactData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape <noreply@learnscapeedu.com>',
        to: [contactData.email],
        subject: `Thank you for contacting us, ${contactData.name}!`,
        html: this.getContactConfirmationHTML(contactData),
      });
      if (error) {
        console.error('❌ Error sending contact confirmation:', error);
        return { success: false, error };
      }
      console.log('✅ Contact confirmation sent to:', contactData.email);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Contact confirmation error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send contact notification to admin
  async sendContactNotification(contactData) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LearnScape System <system@learnscapeedu.com>',
        to: [process.env.ADMIN_EMAIL],
        subject: `📧 New Contact Message: ${contactData.subject}`,
        html: this.getContactNotificationHTML(contactData),
      });
      if (error) {
        console.error('❌ Error sending contact notification:', error);
        return { success: false, error };
      }
      console.log('✅ Contact notification sent to admin');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Contact notification error:', error);
      return { success: false, error: error.message };
    }
  },
// ✅ Scholarship approved email template
getScholarshipApprovedHTML(scholarship) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Approved - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 500px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #10b981, #059669);
            padding: 25px;
            text-align: center;
            color: white;
        }
        .celebration { font-size: 40px; margin-bottom: 10px; }
        .content { padding: 25px; }
        .approved-box {
            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
            border: 1px solid #34d399;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .next-steps {
            background: #f0f9ff;
            border: 1px solid #7dd3fc;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="celebration">🎉</div>
            <h1>Scholarship Approved!</h1>
            <p>Congratulations ${scholarship.applicantName}</p>
        </div>
        
        <div class="content">
            <div class="approved-box">
                <h2 style="color: #065f46; margin-bottom: 10px;">✅ Application Approved</h2>
                <p style="color: #047857;">Your scholarship application has been successfully approved by our review team.</p>
            </div>
            
            <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
            <p><strong>Course:</strong> ${scholarship.courseInterested}</p>
            
            <div class="next-steps">
                <h3 style="color: #0369a1; margin-bottom: 10px;">What happens next?</h3>
                <ul style="padding-left: 20px; color: #0c4a6e;">
                    <li>Our counselor will contact you within 24 hours</li>
                    <li>Complete the admission process guidance</li>
                    <li>Receive scholarship benefits and support</li>
                </ul>
            </div>
            
            ${scholarship.adminNotes ? `<div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 12px; margin: 15px 0;">
                <strong>Admin Note:</strong> ${scholarship.adminNotes}
            </div>` : ''}
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Scholarships</strong></p>
            <p>📧 learnscapeinfo@gmail.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>`;
},

// ✅ Scholarship rejected email template
getScholarshipRejectedHTML(scholarship) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Application Update - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 500px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #64748b, #475569);
            padding: 25px;
            text-align: center;
            color: white;
        }
        .content { padding: 25px; }
        .status-box {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .reapply-section {
            background: #f0f9ff;
            border: 1px solid #7dd3fc;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Application Update</h1>
            <p>Thank you for your interest, ${scholarship.applicantName}</p>
        </div>
        
        <div class="content">
            <div class="status-box">
                <h3 style="color: #dc2626; margin-bottom: 10px;">Application Status Update</h3>
                <p style="color: #7f1d1d;">After careful review, we are unable to approve your scholarship application at this time.</p>
            </div>
            
            <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
            
            ${scholarship.adminNotes ? `<div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 12px; margin: 15px 0;">
                <strong>Review Notes:</strong> ${scholarship.adminNotes}
            </div>` : ''}
            
            <div class="reapply-section">
                <h3 style="color: #0369a1; margin-bottom: 10px;">Don't Give Up!</h3>
                <p style="color: #0c4a6e; margin-bottom: 10px;">You can reapply for future scholarship opportunities.</p>
                <ul style="padding-left: 20px; color: #0c4a6e;">
                    <li>Check our website for new scholarship programs</li>
                    <li>Improve your profile based on feedback</li>
                    <li>Contact our counselors for guidance</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Scholarships</strong></p>
            <p>📧 learnscapeinfo@gmail.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>`;
},

// ✅ Scholarship processing email template
getScholarshipProcessingHTML(scholarship) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Under Review - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 500px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #f59e0b, #d97706);
            padding: 25px;
            text-align: center;
            color: white;
        }
        .content { padding: 25px; }
        .review-box {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .timeline {
            background: #f0f9ff;
            border: 1px solid #7dd3fc;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 30px; margin-bottom: 10px;">📝</div>
            <h1>Under Review</h1>
            <p>Your application is being processed</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${scholarship.applicantName}</strong>,</p>
            
            <div class="review-box">
                <h3 style="color: #92400e; margin-bottom: 10px;">⏳ Application Under Review</h3>
                <p style="color: #a16207;">Our expert team is carefully reviewing your scholarship application.</p>
            </div>
            
            <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
            <p><strong>Course:</strong> ${scholarship.courseInterested}</p>
            
            <div class="timeline">
                <h3 style="color: #0369a1; margin-bottom: 10px;">Review Process</h3>
                <ul style="padding-left: 20px; color: #0c4a6e;">
                    <li>✅ Application received and payment confirmed</li>
                    <li>🔄 Currently: Expert review in progress</li>
                    <li>⏱️ Expected completion: Within 3-5 business days</li>
                    <li>📧 You'll be notified of the decision</li>
                </ul>
            </div>
            
            ${scholarship.adminNotes ? `<div style="background: #e0f2fe; border: 1px solid #0284c7; border-radius: 8px; padding: 12px; margin: 15px 0;">
                <strong>Review Update:</strong> ${scholarship.adminNotes}
            </div>` : ''}
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Scholarships</strong></p>
            <p>📧 learnscapeinfo@gmail.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>`;
},

  // Scholarship success email template (updated with actual logo)
getScholarshipSuccessHTML(scholarship) {
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Success - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; 
            line-height: 1.4; 
            color: #1a1a1a; 
            background: #f0f2f5;
            font-size: 13px;
        }
        .container { 
            max-width: 480px; 
            margin: 15px auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(23,57,116,0.15);
        }
        .header { 
            background: linear-gradient(135deg, #173974 0%, #2563eb 100%);
            padding: 25px 20px;
            text-align: center;
            color: white;
        }
        .logo-container {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255,255,255,0.2);
            padding: 15px;
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255,255,255,0); }
        }
        .logo-container img {
            width: 100%;
            height: auto;
            max-width: 50px;
            filter: brightness(0) invert(1);
            object-fit: contain;
        }
        .header h1 { 
            font-size: 22px; 
            font-weight: 800; 
            margin-bottom: 5px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
        }
        .header p { 
            font-size: 11px; 
            color: rgba(255,255,255,0.9);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content { padding: 25px 20px; }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #173974;
            margin-bottom: 12px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .greeting::before,
        .greeting::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, #173974, transparent);
            max-width: 50px;
        }
        .message {
            font-size: 11px;
            line-height: 1.6;
            color: #4b5563;
            text-align: center;
            margin-bottom: 20px;
            padding: 0 10px;
        }
        .celebration-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(16,185,129,0.25);
        }
        .celebration-box::before {
            content: '✨';
            position: absolute;
            top: -5px;
            left: 10px;
            font-size: 20px;
            animation: float 3s ease-in-out infinite;
        }
        .celebration-box::after {
            content: '🎊';
            position: absolute;
            bottom: -5px;
            right: 10px;
            font-size: 20px;
            animation: float 3s ease-in-out infinite reverse;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .celebration-box h3 {
            color: white;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 5px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .celebration-box p {
            color: rgba(255,255,255,0.95);
            font-size: 10px;
            font-weight: 500;
        }
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
        }
        .details-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, #173974, #7c3aed);
        }
        .details-card h3 {
            font-size: 11px;
            font-weight: 700;
            color: #173974;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(226,232,240,0.5);
            font-size: 10px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label {
            font-weight: 600;
            color: #64748b;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .detail-value {
            color: #1e293b;
            font-weight: 600;
            font-size: 10px;
            text-align: right;
        }
        .status-badge {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(16,185,129,0.3);
        }
        .contact-info {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-radius: 10px;
            padding: 12px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #fbbf24;
        }
        .contact-info h4 {
            color: #78350f;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .contact-info p {
            color: #92400e;
            font-size: 9px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        .contact-info strong {
            font-weight: 700;
        }
        .footer {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-brand {
            color: #173974;
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 5px;
            letter-spacing: -0.3px;
        }
        .footer p {
            color: #64748b;
            font-size: 9px;
            line-height: 1.5;
            margin-bottom: 5px;
        }
        .footer-meta {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
            line-height: 1.4;
        }
        /* Mobile Responsive */
        @media (max-width: 500px) {
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 20px 15px; }
            .header h1 { font-size: 20px; }
            .detail-row { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 2px; 
            }
            .detail-value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="${process.env.WEBSITE_URL || 'https://learnscapeedu.com'}/logo.png" alt="LearnScape Logo" />
            </div>
            <h1>Application Successful!</h1>
            <p>Scholarship ID: ${scholarship.applicationId}</p>
        </div>
        
        <div class="content">
            <div class="greeting">Congratulations, ${scholarship.applicantName}!</div>
            
            <div class="message">
                Your scholarship application has been successfully submitted. Our expert team is reviewing your profile and will contact you within 24-48 hours.
            </div>
            
            <div class="celebration-box">
                <h3>Payment Confirmed ✓</h3>
                <p>Application fee of ₹1 processed successfully</p>
            </div>
            
            <div class="details-card">
                <h3>📋 Application Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Application ID</span>
                    <span class="detail-value">${scholarship.applicationId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">${scholarship.applicantName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Course</span>
                    <span class="detail-value">${scholarship.courseInterested}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${scholarship.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Mobile</span>
                    <span class="detail-value">+91 ${scholarship.mobile}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">
                        <span class="status-badge">Under Review</span>
                    </span>
                </div>
            </div>
            
            <div class="contact-info">
                <h4>Need Help?</h4>
                <p><strong>📧</strong> scholarships@learnscapeedu.com</p>
                <p><strong>📞</strong> +91 860 600 4306</p>
                <p><strong>⏱️</strong> Response within 24 hours</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-brand">LearnScape Education</div>
            <p>Empowering students to achieve their dreams</p>
            <div class="footer-meta">
                Application ID: ${scholarship.applicationId}<br>
                Submitted: ${formattedDate}<br>
                This is an automated confirmation email
            </div>
        </div>
    </div>
</body>
</html>
    `;
},


  // Payment failed email template
  getScholarshipPaymentFailedHTML(scholarship) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Payment - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 460px; 
            margin: 15px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #f59e0b, #dc2626);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .warning-icon {
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        .content { padding: 20px; }
        .alert-box {
            background: #fef3c7;
            border: 1px solid #fb923c;
            border-radius: 10px;
            padding: 12px;
            margin: 15px 0;
            text-align: center;
        }
        .retry-button {
            display: inline-block;
            background: linear-gradient(135deg, #173974, #2563eb);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 15px; 
            text-align: center; 
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="warning-icon">⚠️</div>
            <h1>Payment Incomplete</h1>
            <p>Complete your scholarship application</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <h3>Action Required</h3>
                <p>Your payment was not completed. Please retry to finalize your application.</p>
            </div>
            
            <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
            <p><strong>Name:</strong> ${scholarship.applicantName}</p>
            
            <div style="text-align: center;">
                <a href="${process.env.WEBSITE_URL}/scholarships" class="retry-button">Complete Payment Now</a>
            </div>
            
            <p><small>If you continue to face issues, please contact our support team.</small></p>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Support</strong></p>
            <p>📧 learnscapeinfo@gmail.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>
    `;
  },

  // Payment retry email template
  getScholarshipPaymentRetryHTML(scholarship) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Payment - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 460px; 
            margin: 15px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #173974, #2563eb);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .content { padding: 20px; }
        .reminder-box {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            border-radius: 10px;
            padding: 12px;
            margin: 15px 0;
        }
        .complete-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 15px; 
            text-align: center; 
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Payment Reminder</h1>
            <p>Complete your scholarship application</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>${scholarship.applicantName}</strong>,</p>
            
            <div class="reminder-box">
                <h3>Complete Your Application</h3>
                <p>Your scholarship application is almost ready. Just complete the payment to proceed.</p>
            </div>
            
            <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
            <p><strong>Amount:</strong> ₹1 only</p>
            
            <div style="text-align: center;">
                <a href="${process.env.WEBSITE_URL}/scholarships" class="complete-button">Pay Now</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Support</strong></p>
            <p>📧 learnscapeinfo@gmail.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>
    `;
  },

  // Enquiry confirmation email template (updated with actual logo)
getEnquiryConfirmationHTML(enquiry) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
            font-size: 13px;
            line-height: 1.4;
        }
        .container { 
            max-width: 500px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(23,57,116,0.15);
        }
        .header { 
            background: linear-gradient(135deg, #173974 0%, #2563eb 100%);
            padding: 25px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.03) 10px,
                rgba(255,255,255,0.03) 20px
            );
            animation: slide 20s linear infinite;
        }
        @keyframes slide {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }
        .header-content { position: relative; z-index: 1; }
        
        .logo-container {
            width: 70px;
            height: 70px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255,255,255,0.2);
            padding: 12px;
            animation: thankYouPulse 2s ease-in-out infinite;
        }
        @keyframes thankYouPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }
        .logo-container img {
            width: 100%;
            height: auto;
            max-width: 46px;
            filter: brightness(0) invert(1);
            object-fit: contain;
        }
        .header h1 { 
            font-size: 22px; 
            font-weight: 800; 
            margin-bottom: 5px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
        }
        .header p { 
            font-size: 11px; 
            color: rgba(255,255,255,0.9);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        .content { 
            padding: 25px; 
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #173974;
            margin-bottom: 15px;
            text-align: center;
        }
        .message {
            font-size: 12px;
            line-height: 1.6;
            color: #4b5563;
            text-align: center;
            margin-bottom: 20px;
        }
        .info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
        }
        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, #173974, #2563eb);
        }
        .info-card h3 {
            font-size: 12px;
            font-weight: 700;
            color: #173974;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11px;
            border-bottom: 1px solid rgba(226,232,240,0.5);
        }
        .info-row:last-child { border-bottom: none; }
        .info-label {
            font-weight: 600;
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .info-value {
            color: #1e293b;
            font-weight: 600;
            font-size: 11px;
            text-align: right;
        }
        .next-steps {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid #93c5fd;
        }
        .next-steps h3 {
            color: #1e40af;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .next-steps ul {
            padding-left: 20px;
            margin: 0;
            font-size: 11px;
            color: #1e40af;
        }
        .next-steps li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .next-steps li::marker {
            color: #3b82f6;
        }
        .contact-info {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-radius: 10px;
            padding: 12px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #fbbf24;
        }
        .contact-info p {
            color: #92400e;
            font-size: 10px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        .contact-info strong {
            font-weight: 700;
            color: #78350f;
        }
        .footer { 
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            padding: 20px; 
            text-align: center; 
            border-top: 1px solid #e5e7eb;
        }
        .footer-brand {
            color: #173974;
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 5px;
            letter-spacing: -0.3px;
        }
        .footer p {
            color: #64748b;
            font-size: 9px;
            line-height: 1.5;
            margin-bottom: 3px;
        }
        .footer-meta {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
            line-height: 1.4;
        }
        /* Mobile Responsive */
        @media (max-width: 500px) {
            .container { margin: 10px; border-radius: 12px; }
            .header, .content, .footer { padding: 20px 15px; }
            .header h1 { font-size: 20px; }
            .info-row { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 2px; 
                padding: 8px 0;
            }
            .info-value { text-align: left; }
            .logo-container {
                width: 60px;
                height: 60px;
            }
            .logo-container img {
                max-width: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="logo-container">
                    <img src="${process.env.WEBSITE_URL || 'https://learnscapeedu.com'}/logo.png" alt="LearnScape Logo" />
                </div>
                <h1>Thank You!</h1>
                <p>We've received your enquiry</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Dear ${enquiry.name},</div>
            
            <div class="message">
                Thank you for your interest in ${enquiry.collegeName || 'our educational services'}. We have received your enquiry and our expert counselors will contact you soon.
            </div>
            
            <div class="info-card">
                <h3>📋 Your Enquiry Details</h3>
                <div class="info-row">
                    <span class="info-label">College</span>
                    <span class="info-value">${enquiry.collegeName || 'General Enquiry'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Course</span>
                    <span class="info-value">${enquiry.courseName || 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Mobile</span>
                    <span class="info-value">+91 ${enquiry.mobile}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value">${enquiry.email}</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>What happens next?</h3>
                <ul>
                    <li>Our counselor will call you within 24 hours</li>
                    <li>Get personalized course and career guidance</li>
                    <li>Receive admission assistance and support</li>
                    <li>Access to exclusive scholarships and offers</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p><strong>📞</strong> For urgent queries: +91 860 600 4306</p>
                <p><strong>📧</strong> Email: info@learnscapeedu.com</p>
                <p><strong>⏱️</strong> Response within 24 hours</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-brand">LearnScape Education</div>
            <p>🌐 www.learnscapeedu.com</p>
            <p>Empowering students to achieve their dreams</p>
            <div class="footer-meta">
                Enquiry received: ${new Date().toLocaleString('en-IN')}<br>
                This is an automated confirmation email
            </div>
        </div>
    </div>
</body>
</html>
    `;
},


  // Admin notification email template
  getAdminNotificationHTML(enquiry) {
    const formattedDate = new Date().toLocaleString('en-IN');
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Enquiry - LearnScape Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #dc2626, #ea580c);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .alert-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
        .content { padding: 25px; }
        .enquiry-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { 
            font-weight: 600; 
            color: #64748b; 
            min-width: 100px;
        }
        .detail-value { 
            color: #1e293b; 
            font-weight: 500;
            text-align: right;
        }
        .priority-high {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            color: #dc2626;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
        }
        .action-buttons {
            text-align: center;
            margin: 25px 0;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px 10px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 12px;
        }
        .btn-primary {
            background: #173974;
            color: white;
        }
        .btn-secondary {
            background: #64748b;
            color: white;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon">🔔</div>
            <h1>New Enquiry Alert</h1>
            <p>LearnScape Admin Dashboard</p>
        </div>
        
        <div class="content">
            <div class="priority-high">
                <h3>⚡ High Priority Enquiry</h3>
                <p>New college enquiry requires immediate attention</p>
            </div>
            
            <div class="enquiry-details">
                <h3 style="color: #173974; margin-bottom: 15px; font-size: 16px;">Enquiry Details</h3>
                
                <div class="detail-row">
                    <span class="detail-label">Student Name:</span>
                    <span class="detail-value">${enquiry.name}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${enquiry.email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Mobile:</span>
                    <span class="detail-value">+91 ${enquiry.mobile}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">College:</span>
                    <span class="detail-value">${enquiry.collegeName || 'General Enquiry'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Course:</span>
                    <span class="detail-value">${enquiry.courseName || 'Not specified'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${enquiry.type || 'college_enquiry'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Source:</span>
                    <span class="detail-value">${enquiry.source || 'Website'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                
                ${enquiry.message ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <div class="detail-label" style="margin-bottom: 8px;">Message:</div>
                    <div style="background: white; padding: 12px; border-radius: 8px; font-size: 12px; color: #374151; line-height: 1.5;">
                        "${enquiry.message}"
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="action-buttons">
                <a href="tel:+91${enquiry.mobile}" class="btn btn-primary">📞 Call Now</a>
                <a href="mailto:${enquiry.email}" class="btn btn-secondary">📧 Send Email</a>
            </div>
            
            <div style="background: #dbeafe; border-radius: 8px; padding: 12px; margin: 20px 0; font-size: 12px; text-align: center;">
                <strong>⏱️ Response Time Target:</strong> Within 2 hours<br>
                <strong>📊 Priority:</strong> High - College Enquiry
            </div>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Admin System</strong></p>
            <p>This is an automated notification. Please respond promptly to maintain service quality.</p>
            <p>Admin Panel: <a href="${process.env.WEBSITE_URL}/admin">dashboard.learnscapeedu.com</a></p>
        </div>
    </div>
</body>
</html>
    `;
  },

  // Contact confirmation email template
  getContactConfirmationHTML(contact) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us - LearnScape</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 500px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #173974, #2563eb);
            padding: 25px;
            text-align: center;
            color: white;
        }
        .content { padding: 25px; }
        .message-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 Message Received</h1>
            <p>Thank you for contacting LearnScape</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${contact.name}</strong>,</p>
            <br>
            <p>Thank you for reaching out to us. We have received your message regarding "<strong>${contact.subject}</strong>" and will respond within 24 hours.</p>
            
            <div class="message-box">
                <h3>Your Message:</h3>
                <p style="margin-top: 10px; font-style: italic; color: #64748b;">"${contact.message}"</p>
            </div>
            
            <p>Our team will contact you at <strong>${contact.email}</strong> ${contact.phone ? `or <strong>+91 ${contact.phone}</strong>` : ''} with a detailed response.</p>
            
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">For urgent matters, please call us at <strong>+91 860 600 4306</strong>.</p>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Education</strong></p>
            <p>📧 info@learnscapeedu.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>
    `;
  },

  // Contact admin notification email template
  getContactNotificationHTML(contact) {
    const formattedDate = new Date().toLocaleString('en-IN');
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message - LearnScape Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            background: #f0f2f5;
            color: #1a1a1a;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .content { padding: 25px; }
        .contact-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
        }
        .detail-row:last-child { border-bottom: none; }
        .message-content {
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 15px;
            margin: 15px 0;
            font-size: 12px;
            line-height: 1.6;
            color: #374151;
        }
        .footer { 
            background: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>LearnScape Admin Dashboard</p>
        </div>
        
        <div class="content">
            <div class="contact-details">
                <h3 style="color: #173974; margin-bottom: 15px;">Contact Details</h3>
                
                <div class="detail-row">
                    <span><strong>Name:</strong></span>
                    <span>${contact.name}</span>
                </div>
                
                <div class="detail-row">
                    <span><strong>Email:</strong></span>
                    <span>${contact.email}</span>
                </div>
                
                ${contact.phone ? `
                <div class="detail-row">
                    <span><strong>Phone:</strong></span>
                    <span>+91 ${contact.phone}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span><strong>Subject:</strong></span>
                    <span>${contact.subject}</span>
                </div>
                
                <div class="detail-row">
                    <span><strong>Type:</strong></span>
                    <span>${contact.queryType || 'General'}</span>
                </div>
                
                <div class="detail-row">
                    <span><strong>Submitted:</strong></span>
                    <span>${formattedDate}</span>
                </div>
                
                <div style="margin-top: 15px;">
                    <strong style="color: #173974;">Message:</strong>
                    <div class="message-content">
                        ${contact.message}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
                <a href="mailto:${contact.email}" style="display: inline-block; background: #173974; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 5px;">
                    📧 Reply to ${contact.name}
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Admin System</strong></p>
            <p>Please respond to this contact message within 24 hours.</p>
        </div>
    </div>
</body>
</html>
    `;
  }
};

module.exports = emailService;
