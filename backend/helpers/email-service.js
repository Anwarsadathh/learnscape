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

  // Scholarship success email template
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
        .success-badge {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }
        .header h1 { 
            font-size: 22px; 
            font-weight: 800; 
            margin-bottom: 5px;
        }
        .content { padding: 25px 20px; }
        .celebration-box {
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: white;
        }
        .details-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 11px;
        }
        .status-badge {
            background: #10b981;
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: 700;
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-badge">🎓</div>
            <h1>Application Successful!</h1>
            <p>ID: ${scholarship.applicationId}</p>
        </div>
        
        <div class="content">
            <div class="celebration-box">
                <h3>Payment Confirmed ✓</h3>
                <p>Application fee processed successfully</p>
            </div>
            
            <div class="details-card">
                <h3>Application Details</h3>
                <div class="detail-row">
                    <span>Name:</span>
                    <span>${scholarship.applicantName}</span>
                </div>
                <div class="detail-row">
                    <span>Course:</span>
                    <span>${scholarship.courseInterested}</span>
                </div>
                <div class="detail-row">
                    <span>Status:</span>
                    <span class="status-badge">Under Review</span>
                </div>
            </div>
            
            <p>Our team will review your application and contact you within 24-48 hours.</p>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Education</strong></p>
            <p>📧 scholarships@learnscapeedu.com | 📞 +91 860 600 4306</p>
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
            <p>📧 scholarships@learnscapeedu.com | 📞 +91 860 600 4306</p>
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
            <p>📧 scholarships@learnscapeedu.com | 📞 +91 860 600 4306</p>
        </div>
    </div>
</body>
</html>
    `;
  },

  // Enquiry confirmation email template
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
        .thank-you-icon {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
        }
        .content { padding: 25px; }
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
        }
        .next-steps {
            background: #dbeafe;
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
            <div class="thank-you-icon">🙏</div>
            <h1>Thank You!</h1>
            <p>We've received your enquiry</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${enquiry.name}</strong>,</p>
            <br>
            <p>Thank you for your interest in ${enquiry.collegeName || 'our educational services'}. We have received your enquiry and our expert counselors will contact you soon.</p>
            
            <div class="info-card">
                <h3>Your Enquiry Details:</h3>
                <div class="info-row">
                    <span>College:</span>
                    <span>${enquiry.collegeName || 'General Enquiry'}</span>
                </div>
                <div class="info-row">
                    <span>Course:</span>
                    <span>${enquiry.courseName || 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span>Mobile:</span>
                    <span>+91 ${enquiry.mobile}</span>
                </div>
                <div class="info-row">
                    <span>Email:</span>
                    <span>${enquiry.email}</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>What happens next?</h3>
                <ul style="padding-left: 20px; margin-top: 10px; font-size: 12px;">
                    <li>Our counselor will call you within 24 hours</li>
                    <li>Get personalized course and career guidance</li>
                    <li>Receive admission assistance and support</li>
                    <li>Access to exclusive scholarships and offers</li>
                </ul>
            </div>
            
            <p style="font-size: 12px; color: #64748b;">If you have any urgent queries, please call us at <strong>+91 860 600 4306</strong>.</p>
        </div>
        
        <div class="footer">
            <p><strong>LearnScape Education</strong></p>
            <p>📧 info@learnscapeedu.com | 📞 +91 860 600 4306</p>
            <p>🌐 www.learnscapeedu.com</p>
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
