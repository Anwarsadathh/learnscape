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
      <title>Scholarship Application Success - LearnScape</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: white; padding: 40px 30px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="confetti" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23confetti)"/></svg>'); }
          .header-content { position: relative; z-index: 1; }
          .success-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; animation: bounce 2s infinite; }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .header h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header p { font-size: 18px; opacity: 0.95; font-weight: 500; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 20px; text-align: center; }
          .message { font-size: 16px; line-height: 1.8; margin-bottom: 30px; color: #4b5563; text-align: center; }
          .celebration-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; position: relative; overflow: hidden; }
          .celebration-box::before { content: '🎉'; position: absolute; top: 10px; left: 20px; font-size: 24px; }
          .celebration-box::after { content: '🎊'; position: absolute; top: 10px; right: 20px; font-size: 24px; }
          .celebration-box h3 { color: #047857; font-size: 20px; margin-bottom: 12px; font-weight: 700; }
          .celebration-box p { color: #065f46; font-weight: 600; font-size: 16px; }
          .details-card { background: #f8fafc; border-left: 6px solid #10b981; border-radius: 12px; padding: 24px; margin: 25px 0; }
          .details-card h3 { color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; font-weight: 700; }
          .details-card h3:before { content: "📄"; margin-right: 12px; font-size: 24px; }
          .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #374151; font-size: 14px; }
          .detail-value { color: #1f2937; font-weight: 700; font-size: 14px; }
          .status-badge { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .next-steps { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 30px; margin: 30px 0; }
          .next-steps h3 { color: #1e40af; font-size: 20px; margin-bottom: 20px; text-align: center; font-weight: 700; }
          .step-item { display: flex; align-items: flex-start; margin-bottom: 16px; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .step-number { width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin-right: 16px; flex-shrink: 0; }
          .step-text { color: #374151; font-size: 14px; line-height: 1.6; }
          .step-text strong { color: #1f2937; }
          .contact-info { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
          .contact-info h4 { color: #92400e; font-size: 16px; font-weight: 700; margin-bottom: 12px; }
          .contact-info p { color: #78350f; font-size: 14px; margin-bottom: 8px; }
          .footer { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-brand { color: #1f2937; font-weight: 800; font-size: 18px; margin-bottom: 8px; }
          .footer p { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
          .social-links { margin: 20px 0; }
          .social-links a { color: #10b981; text-decoration: none; margin: 0 15px; font-weight: 600; font-size: 14px; }
          @media (max-width: 600px) {
              .container { margin: 10px; border-radius: 12px; }
              .header, .content, .footer { padding: 25px 20px; }
              .header h1 { font-size: 28px; }
              .celebration-box, .next-steps { padding: 20px; }
              .detail-row { flex-direction: column; align-items: flex-start; gap: 4px; }
              .step-item { flex-direction: column; text-align: center; }
              .step-number { margin: 0 auto 12px; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="header-content">
                  <div class="success-icon">🎓</div>
                  <h1>Application Successful!</h1>
                  <p>Your scholarship journey begins now</p>
              </div>
          </div>
          
          <div class="content">
              <div class="greeting">Congratulations, ${scholarship.applicantName}! 🎉</div>
              
              <div class="message">
                  Your scholarship application has been successfully submitted and payment verified. Our team will now review your application and get back to you soon with the next steps.
              </div>
              
              <div class="celebration-box">
                  <h3>Payment Confirmed!</h3>
                  <p>Your application fee of ₹1 has been successfully processed</p>
              </div>
              
              <div class="details-card">
                  <h3>Application Summary</h3>
                  <div class="detail-row">
                      <span class="detail-label">Application ID:</span>
                      <span class="detail-value">${scholarship.applicationId}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Applicant Name:</span>
                      <span class="detail-value">${scholarship.applicantName}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Course Interested:</span>
                      <span class="detail-value">${scholarship.courseInterested}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Email:</span>
                      <span class="detail-value">${scholarship.email}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Mobile:</span>
                      <span class="detail-value">+91 ${scholarship.mobile}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Status:</span>
                      <span class="detail-value"><span class="status-badge">Under Review</span></span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Submitted:</span>
                      <span class="detail-value">${formattedDate}</span>
                  </div>
              </div>
              
              <div class="next-steps">
                  <h3>What Happens Next? 📋</h3>
                  <div class="step-item">
                      <div class="step-number">1</div>
                      <div class="step-text">
                          <strong>Document Review:</strong> Our team will carefully review all your submitted documents and application details.
                      </div>
                  </div>
                  <div class="step-item">
                      <div class="step-number">2</div>
                      <div class="step-text">
                          <strong>Eligibility Assessment:</strong> We'll evaluate your academic background and eligibility criteria for the scholarship.
                      </div>
                  </div>
                  <div class="step-item">
                      <div class="step-number">3</div>
                      <div class="step-text">
                          <strong>Decision Notification:</strong> You'll receive an email with our decision within 5-7 business days.
                      </div>
                  </div>
                  <div class="step-item">
                      <div class="step-number">4</div>
                      <div class="step-text">
                          <strong>Next Steps:</strong> If selected, we'll guide you through the admission process and scholarship disbursement.
                      </div>
                  </div>
              </div>
              
              <div class="contact-info">
                  <h4>Need Help? We're Here for You! 💬</h4>
                  <p><strong>📧 Email:</strong> scholarships@learnscapeedu.com</p>
                  <p><strong>📞 Phone:</strong> +91 860 600 4306</p>
                  <p><strong>🕒 Response Time:</strong> Within 24 hours</p>
              </div>
          </div>
          
          <div class="footer">
              <div class="footer-brand">LearnScape Education</div>
              <p>Empowering students to achieve their academic dreams through quality education and scholarships</p>
              <div class="social-links">
                  <a href="${process.env.WEBSITE_URL}">Visit Website</a>
                  <a href="mailto:scholarships@learnscapeedu.com">Contact Support</a>
                  <a href="${process.env.WEBSITE_URL}/scholarships">Browse More</a>
              </div>
              <p style="margin-top: 20px; font-size: 11px; color: #9ca3af;">
                  Application ID: ${scholarship.applicationId} | Submitted: ${formattedDate}<br>
                  This email was sent because you successfully submitted a scholarship application on LearnScape Education.
              </p>
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
      <title>Payment Issue - Complete Your Application</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: white; padding: 40px 30px; text-align: center; }
          .warning-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
          .header p { font-size: 16px; opacity: 0.95; }
          .content { padding: 40px 30px; }
          .alert-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; margin: 25px 0; text-align: center; }
          .alert-box h3 { color: #92400e; font-size: 18px; margin-bottom: 12px; font-weight: 700; }
          .alert-box p { color: #78350f; font-weight: 500; }
          .retry-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin: 20px 0; transition: all 0.3s; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
          .retry-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
          .steps { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 25px 0; }
          .steps h4 { color: #1f2937; margin-bottom: 16px; font-weight: 700; }
          .steps ol { padding-left: 20px; color: #4b5563; }
          .steps li { margin-bottom: 8px; }
          .footer { background: #f9fafb; padding: 25px; text-align: center; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="warning-icon">⚠️</div>
              <h1>Payment Issue Detected</h1>
              <p>Complete your scholarship application</p>
          </div>
          
          <div class="content">
              <p>Hi ${scholarship.applicantName},</p>
              
              <div class="alert-box">
                  <h3>Payment Not Completed</h3>
                  <p>We noticed that your payment for the scholarship application wasn't completed successfully. Don't worry - your application details are saved!</p>
              </div>
              
              <p>To complete your scholarship application, please retry the payment process. The application fee is only <strong>₹1</strong>.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.WEBSITE_URL}/scholarships" class="retry-button">
                      Complete Payment Now 💳
                  </a>
              </div>
              
              <div class="steps">
                  <h4>How to complete your payment:</h4>
                  <ol>
                      <li>Click the "Complete Payment Now" button above</li>
                      <li>You'll be redirected to the scholarship form</li>
                      <li>Your details will be pre-filled automatically</li>
                      <li>Complete the secure payment of ₹1</li>
                      <li>Receive instant confirmation</li>
                  </ol>
              </div>
              
              <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
              <p>If you need any assistance, please contact us at scholarships@learnscapeedu.com or call +91 860 600 4306.</p>
          </div>
          
          <div class="footer">
              <p>LearnScape Education | Scholarship Support Team</p>
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
      <title>Complete Your Scholarship Payment</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%); color: white; padding: 40px 30px; text-align: center; }
          .reminder-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
          .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
          .content { padding: 40px 30px; }
          .reminder-box { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 25px 0; text-align: center; }
          .complete-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 25px; text-align: center; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="reminder-icon">🔄</div>
              <h1>Complete Your Payment</h1>
              <p>Your scholarship application is waiting</p>
          </div>
          
          <div class="content">
              <p>Hi ${scholarship.applicantName},</p>
              
              <div class="reminder-box">
                  <h3 style="color: #1e40af; margin-bottom: 12px;">Almost There!</h3>
                  <p style="color: #1e3a8a;">Your scholarship application is ready. Complete the payment of ₹1 to finalize your submission.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.WEBSITE_URL}/scholarships" class="complete-button">
                      Complete Payment (₹1) 💳
                  </a>
              </div>
              
              <p><strong>Application ID:</strong> ${scholarship.applicationId}</p>
              <p>Questions? Contact us at scholarships@learnscapeedu.com</p>
          </div>
          
          <div class="footer">
              <p>LearnScape Education</p>
          </div>
      </div>
  </body>
  </html>
  `;
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
// Add these methods to your existing emailService object

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

// Contact confirmation email template
getContactConfirmationHTML(contact) {
  const queryTypeLabels = {
    'general': 'General Query',
    'admission': 'Admission Enquiry',
    'partnership': 'Partnership Inquiry',
    'support': 'Student Support',
    'other': 'Other'
  };

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message Received - LearnScape</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .header p { font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
          .message { font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #4b5563; }
          .details-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .details-box h3 { color: #1f2937; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; }
          .details-box h3:before { content: "📋"; margin-right: 8px; }
          .detail-item { display: flex; margin-bottom: 12px; }
          .detail-label { font-weight: 600; color: #374151; width: 140px; flex-shrink: 0; }
          .detail-value { color: #6b7280; }
          .highlight { background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border: 1px solid #c7d2fe; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; }
          .highlight h3 { color: #1e40af; font-size: 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; }
          .highlight h3:before { content: "🕐"; margin-right: 8px; }
          .highlight p { color: #3730a3; font-weight: 500; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
          .footer { background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
          .social-links { margin: 15px 0; }
          .social-links a { color: #3b82f6; text-decoration: none; margin: 0 10px; font-weight: 500; }
          @media (max-width: 600px) {
              .container { margin: 10px; border-radius: 8px; }
              .header, .content, .footer { padding: 20px; }
              .details-box { padding: 15px; }
              .detail-item { flex-direction: column; margin-bottom: 15px; }
              .detail-label { width: auto; font-weight: 700; color: #1f2937; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>LearnScape Education</h1>
              <p>Message Received Successfully</p>
          </div>
          
          <div class="content">
              <div class="greeting">Hi ${contact.name}! 👋</div>
              
              <div class="message">
                  Thank you for reaching out to us! We've successfully received your message and our team is reviewing your inquiry. We appreciate you taking the time to contact LearnScape Education.
              </div>
              
              <div class="details-box">
                  <h3>Your Message Details</h3>
                  <div class="detail-item">
                      <span class="detail-label">Name:</span>
                      <span class="detail-value">${contact.name}</span>
                  </div>
                  <div class="detail-item">
                      <span class="detail-label">Email:</span>
                      <span class="detail-value">${contact.email}</span>
                  </div>
                  ${contact.phone ? `
                  <div class="detail-item">
                      <span class="detail-label">Phone:</span>
                      <span class="detail-value">${contact.phone}</span>
                  </div>
                  ` : ''}
                  <div class="detail-item">
                      <span class="detail-label">Subject:</span>
                      <span class="detail-value">${contact.subject}</span>
                  </div>
                  <div class="detail-item">
                      <span class="detail-label">Query Type:</span>
                      <span class="detail-value">${queryTypeLabels[contact.queryType] || contact.queryType}</span>
                  </div>
                  <div class="detail-item">
                      <span class="detail-label">Message:</span>
                      <span class="detail-value">${contact.message}</span>
                  </div>
              </div>
              
              <div class="highlight">
                  <h3>We'll Respond Soon</h3>
                  <p>Our team will get back to you within 24 hours with a detailed response!</p>
              </div>
              
              <div class="message">
                  In the meantime, feel free to explore our website for more information about colleges, courses, and admission processes. You can also reach out to us directly if you have any urgent queries.
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.WEBSITE_URL}" class="cta-button">
                      Explore Colleges 🎓
                  </a>
              </div>
          </div>
          
          <div class="footer">
              <p><strong>LearnScape Education</strong></p>
              <p>Empowering students to achieve their academic dreams</p>
              <div class="social-links">
                  <a href="${process.env.WEBSITE_URL}">Website</a> |
                  <a href="mailto:learnscapeinfo@gmail.com">Contact Us</a> |
                  <a href="tel:+918606004306">Call: 860 6004 306</a>
              </div>
              <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                  This email was sent because you contacted us through LearnScape Education website.<br>
                  If you have any questions, reply to this email or contact us at learnscapeinfo@gmail.com
              </p>
          </div>
      </div>
  </body>
  </html>
  `;
},

// Contact admin notification email template
getContactNotificationHTML(contact) {
  const formattedDate = new Date(contact.submittedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const queryTypeLabels = {
    'general': 'General Query',
    'admission': 'Admission Enquiry',
    'partnership': 'Partnership Inquiry',
    'support': 'Student Support',
    'other': 'Other'
  };

  const priorityLevel = contact.queryType === 'admission' ? 'HIGH' : 
                       contact.queryType === 'partnership' ? 'MEDIUM' : 'NORMAL';
  const priorityColor = priorityLevel === 'HIGH' ? '#dc2626' : 
                       priorityLevel === 'MEDIUM' ? '#f59e0b' : '#10b981';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - LearnScape Admin</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1a1a1a; background: #f6f8fa; }
          .email-container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); padding: 24px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); }
          .header-content { position: relative; z-index: 1; }
          .alert-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500; }
          .timestamp { background: rgba(255,255,255,0.15); color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 16px; display: inline-block; }
          .content { padding: 32px 24px; }
          .priority-banner { background: linear-gradient(90deg, ${priorityColor}, ${priorityColor}dd); color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; font-weight: 600; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
          .contact-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
          .contact-header { display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
          .contact-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #1e40af, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; margin-right: 16px; }
          .contact-info h3 { font-size: 20px; font-weight: 700; color: #1a202c; margin-bottom: 4px; }
          .contact-info p { color: #64748b; font-size: 14px; }
          .details-grid { display: grid; gap: 16px; margin-bottom: 20px; }
          .detail-row { display: grid; grid-template-columns: 120px 1fr; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-value { font-size: 15px; font-weight: 600; color: #1e293b; display: flex; align-items: center; }
          .detail-icon { margin-right: 8px; opacity: 0.7; }
          .message-box { background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border-left: 4px solid #1e40af; border-radius: 8px; padding: 20px; margin-top: 20px; }
          .message-box h4 { color: #1565c0; font-size: 16px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; }
          .message-box h4::before { content: '💬'; margin-right: 8px; }
          .message-text { color: #1e293b; font-size: 15px; line-height: 1.6; font-style: italic; padding: 16px; background: rgba(255,255,255,0.7); border-radius: 8px; border-left: 3px solid #1e40af; }
          .action-section { background: #f8fafc; padding: 24px; margin: 32px -24px -32px; border-top: 1px solid #e2e8f0; }
          .action-title { text-align: center; font-size: 18px; font-weight: 700; color: #1a202c; margin-bottom: 20px; }
          .button-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
          .btn { display: block; text-align: center; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.3s ease; }
          .btn-primary { background: linear-gradient(135deg, #1e40af, #7c3aed); color: white; box-shadow: 0 4px 15px rgba(30,64,175,0.4); }
          .btn-secondary { background: #ffffff; color: #4a5568; border: 2px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .stats-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
          .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
          .stat-number { font-size: 18px; font-weight: 800; color: #1e40af; display: block; margin-bottom: 4px; }
          .stat-label { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { background: #1a202c; color: #a0aec0; padding: 24px; text-align: center; font-size: 13px; line-height: 1.6; }
          .footer-brand { color: #ffffff; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
          @media (max-width: 600px) {
              .email-container { margin: 0; border-radius: 0; }
              .content { padding: 20px 16px; }
              .action-section { margin: 24px -16px -20px; padding: 20px 16px; }
              .button-row { grid-template-columns: 1fr; gap: 8px; }
              .stats-section { grid-template-columns: 1fr; gap: 8px; }
              .detail-row { grid-template-columns: 1fr; gap: 4px; }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="header-content">
                  <div class="alert-icon">📧</div>
                  <h1>New Contact Message</h1>
                  <p>LearnScape Admin Dashboard</p>
                  <div class="timestamp">⏰ ${formattedDate}</div>
              </div>
          </div>
          
          <div class="content">
              <div class="priority-banner">
                  <span style="margin-right: 8px;">📩</span>
                  ${priorityLevel} PRIORITY - New contact message received
              </div>
              
              <div class="contact-card">
                  <div class="contact-header">
                      <div class="contact-avatar">
                          ${contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div class="contact-info">
                          <h3>${contact.name}</h3>
                          <p>${queryTypeLabels[contact.queryType] || contact.queryType}</p>
                      </div>
                  </div>
                  
                  <div class="details-grid">
                      <div class="detail-row">
                          <span class="detail-label">📧 Email</span>
                          <span class="detail-value">
                              <span class="detail-icon">✉️</span>
                              ${contact.email}
                          </span>
                      </div>
                      ${contact.phone ? `
                      <div class="detail-row">
                          <span class="detail-label">📱 Phone</span>
                          <span class="detail-value">
                              <span class="detail-icon">📞</span>
                              ${contact.phone}
                          </span>
                      </div>
                      ` : ''}
                      <div class="detail-row">
                          <span class="detail-label">📋 Subject</span>
                          <span class="detail-value">
                              <span class="detail-icon">📄</span>
                              ${contact.subject}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">🏷️ Type</span>
                          <span class="detail-value">
                              <span class="detail-icon">🎯</span>
                              ${queryTypeLabels[contact.queryType] || contact.queryType}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">📊 Status</span>
                          <span class="detail-value">
                              <span class="detail-icon">🔄</span>
                              <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px;">NEW MESSAGE</span>
                          </span>
                      </div>
                  </div>
                  
                  <div class="message-box">
                      <h4>Contact Message</h4>
                      <div class="message-text">
                          "${contact.message}"
                      </div>
                  </div>
              </div>
              
              <div class="stats-section">
                  <div class="stat-card">
                      <span class="stat-number">24H</span>
                      <span class="stat-label">Response Target</span>
                  </div>
                  <div class="stat-card">
                      <span class="stat-number">${priorityLevel}</span>
                      <span class="stat-label">Priority Level</span>
                  </div>
                  <div class="stat-card">
                      <span class="stat-number">NEW</span>
                      <span class="stat-label">Message Status</span>
                  </div>
              </div>
          </div>
          
          <div class="action-section">
              <div class="action-title">📧 Take Action</div>
              
              <div class="button-row">
                  <a href="mailto:${contact.email}?subject=Re: ${contact.subject}&body=Dear ${contact.name},%0A%0AThank you for contacting LearnScape Education. I've received your message regarding '${contact.subject}' and I'm here to help you.%0A%0A[Your response here]%0A%0ABest regards,%0ALearnScape Education Team" 
                     class="btn btn-primary">
                      📧 Reply to Contact
                  </a>
                  ${contact.phone ? `
                  <a href="tel:${contact.phone}" class="btn btn-secondary">
                      📞 Call Contact
                  </a>
                  ` : `
                  <a href="mailto:${contact.email}" class="btn btn-secondary">
                      💌 Send Email
                  </a>
                  `}
              </div>
              
              <div style="background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 16px; margin-top: 20px;">
                  <h4 style="color: #234e52; margin-bottom: 8px; font-size: 14px; font-weight: 700;">📋 Response Guidelines:</h4>
                  <ul style="color: #2d5a5a; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 16px;">
                      <li>Respond within 24 hours (preferably within 4 hours)</li>
                      <li>Address their specific query type: ${queryTypeLabels[contact.queryType] || contact.queryType}</li>
                      <li>Provide helpful resources and next steps</li>
                      <li>Follow up if additional information is needed</li>
                      <li>Update contact status in admin panel after response</li>
                  </ul>
              </div>
          </div>
          
          <div class="footer">
              <div class="footer-brand">LearnScape Education</div>
              <p>This notification was generated when a new contact form was submitted on the website.</p>
              <p style="margin-top: 10px; font-size: 12px;">
                  Contact ID: ${contact._id || 'Pending'} | IP: ${contact.ipAddress || 'Unknown'} | Type: ${contact.queryType}
              </p>
          </div>
      </div>
  </body>
  </html>
  `;
},

  // Professional enquiry confirmation email template
  getEnquiryConfirmationHTML(enquiry) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enquiry Confirmation - LearnScape</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .message { font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #4b5563; }
            .details-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px; }
            .details-box h3 { color: #1f2937; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; }
            .details-box h3:before { content: "📋"; margin-right: 8px; }
            .detail-item { display: flex; margin-bottom: 12px; }
            .detail-label { font-weight: 600; color: #374151; width: 140px; flex-shrink: 0; }
            .detail-value { color: #6b7280; }
            .highlight { background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border: 1px solid #c7d2fe; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; }
            .highlight h3 { color: #1e40af; font-size: 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; }
            .highlight h3:before { content: "🕐"; margin-right: 8px; }
            .highlight p { color: #3730a3; font-weight: 500; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .footer { background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer p { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #3b82f6; text-decoration: none; margin: 0 10px; font-weight: 500; }
            @media (max-width: 600px) {
                .container { margin: 10px; border-radius: 8px; }
                .header, .content, .footer { padding: 20px; }
                .details-box { padding: 15px; }
                .detail-item { flex-direction: column; margin-bottom: 15px; }
                .detail-label { width: auto; font-weight: 700; color: #1f2937; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>LearnScape Education</h1>
                <p>Your Journey to Success Starts Here</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">Hi ${enquiry.name}! 👋</div>
                
                <div class="message">
                    Thank you for your interest in <strong>${enquiry.collegeName}</strong>! We've successfully received your enquiry and our expert counselors are already working on providing you with the best guidance.
                </div>
                
                <!-- Enquiry Details -->
                <div class="details-box">
                    <h3>Your Enquiry Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Full Name:</span>
                        <span class="detail-value">${enquiry.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${enquiry.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Mobile:</span>
                        <span class="detail-value">+91 ${enquiry.mobile}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">College:</span>
                        <span class="detail-value">${enquiry.collegeName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Course:</span>
                        <span class="detail-value">${enquiry.courseName}</span>
                    </div>
                    ${enquiry.message ? `
                    <div class="detail-item">
                        <span class="detail-label">Message:</span>
                        <span class="detail-value">${enquiry.message}</span>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Response Time Highlight -->
                <div class="highlight">
                    <h3>Quick Response Guaranteed</h3>
                    <p>Our counselors will contact you within 24 hours with personalized guidance!</p>
                </div>
                
                <div class="message">
                    While you wait, feel free to explore more colleges and courses on our website. Our team of education experts will provide you with:
                    <ul style="margin: 15px 0; padding-left: 20px; color: #4b5563;">
                        <li>Detailed admission process guidance</li>
                        <li>Scholarship and financial aid information</li>
                        <li>Career counseling and course selection</li>
                        <li>Application assistance and documentation support</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.WEBSITE_URL}" class="cta-button">
                        Explore More Colleges 🎓
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>LearnScape Education</strong></p>
                <p>Empowering students to achieve their academic dreams</p>
                <div class="social-links">
                    <a href="${process.env.WEBSITE_URL}">Website</a> |
                    <a href="mailto:learnscapeinfo@gmail.com">Contact Us</a> |
                    <a href="${process.env.WEBSITE_URL}/colleges">Browse Colleges</a>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                    This email was sent because you submitted an enquiry on LearnScape Education.<br>
                    If you have any questions, reply to this email or contact us at learnscapeinfo@gmail.com
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  },

 // Modern, professional admin notification email template
getAdminNotificationHTML(enquiry) {
  const formattedDate = new Date(enquiry.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Alert - LearnScape</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.5; 
              color: #1a1a1a; 
              background: #f6f8fa; 
          }
          .email-container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 4px 25px rgba(0,0,0,0.08); 
          }
          
          /* Header */
          .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              padding: 24px; 
              text-align: center; 
              position: relative; 
          }
          .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          }
          .header-content { position: relative; z-index: 1; }
          .alert-icon { 
              width: 48px; 
              height: 48px; 
              background: rgba(255,255,255,0.2); 
              border-radius: 50%; 
              margin: 0 auto 16px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 24px; 
          }
          .header h1 { 
              color: #ffffff; 
              font-size: 24px; 
              font-weight: 700; 
              margin-bottom: 8px; 
          }
          .header p { 
              color: rgba(255,255,255,0.9); 
              font-size: 16px; 
              font-weight: 500; 
          }
          .timestamp { 
              background: rgba(255,255,255,0.15); 
              color: #ffffff; 
              padding: 8px 16px; 
              border-radius: 20px; 
              font-size: 14px; 
              font-weight: 600; 
              margin-top: 16px; 
              display: inline-block; 
          }
          
          /* Content */
          .content { padding: 32px 24px; }
          
          /* Priority Banner */
          .priority-banner { 
              background: linear-gradient(90deg, #ff6b6b, #feca57); 
              color: white; 
              padding: 16px 20px; 
              border-radius: 8px; 
              margin-bottom: 24px; 
              font-weight: 600; 
              text-align: center; 
              box-shadow: 0 2px 10px rgba(255,107,107,0.3); 
          }
          .priority-banner .icon { 
              display: inline-block; 
              margin-right: 8px; 
              font-size: 18px; 
          }
          
          /* Student Card */
          .student-card { 
              background: #f8fafc; 
              border: 2px solid #e2e8f0; 
              border-radius: 12px; 
              padding: 24px; 
              margin-bottom: 24px; 
          }
          .student-header { 
              display: flex; 
              align-items: center; 
              margin-bottom: 20px; 
              padding-bottom: 16px; 
              border-bottom: 1px solid #e2e8f0; 
          }
          .student-avatar { 
              width: 48px; 
              height: 48px; 
              background: linear-gradient(135deg, #667eea, #764ba2); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 20px; 
              font-weight: 700; 
              margin-right: 16px; 
          }
          .student-info h3 { 
              font-size: 20px; 
              font-weight: 700; 
              color: #1a202c; 
              margin-bottom: 4px; 
          }
          .student-info p { 
              color: #64748b; 
              font-size: 14px; 
          }
          
          /* Details Grid */
          .details-grid { 
              display: grid; 
              gap: 16px; 
              margin-bottom: 20px; 
          }
          .detail-row { 
              display: grid; 
              grid-template-columns: 120px 1fr; 
              align-items: center; 
              padding: 12px 0; 
              border-bottom: 1px solid #f1f5f9; 
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { 
              font-size: 13px; 
              font-weight: 600; 
              color: #64748b; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
          }
          .detail-value { 
              font-size: 15px; 
              font-weight: 600; 
              color: #1e293b; 
              display: flex; 
              align-items: center; 
          }
          .detail-icon { 
              margin-right: 8px; 
              opacity: 0.7; 
          }
          
          /* Message Box */
          .message-box { 
              background: linear-gradient(135deg, #e3f2fd, #f3e5f5); 
              border-left: 4px solid #667eea; 
              border-radius: 8px; 
              padding: 20px; 
              margin-top: 20px; 
          }
          .message-box h4 { 
              color: #1565c0; 
              font-size: 16px; 
              font-weight: 700; 
              margin-bottom: 12px; 
              display: flex; 
              align-items: center; 
          }
          .message-box h4::before { 
              content: '💬'; 
              margin-right: 8px; 
          }
          .message-text { 
              color: #1e293b; 
              font-size: 15px; 
              line-height: 1.6; 
              font-style: italic; 
              padding: 16px; 
              background: rgba(255,255,255,0.7); 
              border-radius: 8px; 
              border-left: 3px solid #667eea; 
          }
          
          /* Action Buttons */
          .action-section { 
              background: #f8fafc; 
              padding: 24px; 
              margin: 32px -24px -32px; 
              border-top: 1px solid #e2e8f0; 
          }
          .action-title { 
              text-align: center; 
              font-size: 18px; 
              font-weight: 700; 
              color: #1a202c; 
              margin-bottom: 20px; 
          }
          .button-row { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 12px; 
              margin-bottom: 16px; 
          }
          .btn { 
              display: block; 
              text-align: center; 
              padding: 14px 20px; 
              border-radius: 8px; 
              text-decoration: none; 
              font-weight: 600; 
              font-size: 14px; 
              transition: all 0.3s ease; 
          }
          .btn-primary { 
              background: linear-gradient(135deg, #667eea, #764ba2); 
              color: white; 
              box-shadow: 0 4px 15px rgba(102,126,234,0.4); 
          }
          .btn-primary:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 6px 20px rgba(102,126,234,0.4); 
          }
          .btn-secondary { 
              background: #ffffff; 
              color: #4a5568; 
              border: 2px solid #e2e8f0; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
          }
          .btn-secondary:hover { 
              background: #f7fafc; 
              border-color: #cbd5e0; 
              transform: translateY(-1px); 
          }
          .btn-icon { 
              margin-right: 8px; 
          }
          
          /* Quick Stats */
          .stats-section { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 16px; 
              margin: 24px 0; 
          }
          .stat-card { 
              background: white; 
              border: 1px solid #e2e8f0; 
              border-radius: 8px; 
              padding: 16px; 
              text-align: center; 
              transition: all 0.3s ease; 
          }
          .stat-card:hover { 
              border-color: #667eea; 
              transform: translateY(-2px); 
          }
          .stat-number { 
              font-size: 18px; 
              font-weight: 800; 
              color: #667eea; 
              display: block; 
              margin-bottom: 4px; 
          }
          .stat-label { 
              font-size: 12px; 
              color: #64748b; 
              font-weight: 600; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
          }
          
          /* Footer */
          .footer { 
              background: #1a202c; 
              color: #a0aec0; 
              padding: 24px; 
              text-align: center; 
              font-size: 13px; 
              line-height: 1.6; 
          }
          .footer-brand { 
              color: #ffffff; 
              font-weight: 700; 
              font-size: 16px; 
              margin-bottom: 8px; 
          }
          .footer-id { 
              background: rgba(255,255,255,0.1); 
              padding: 8px 12px; 
              border-radius: 4px; 
              font-family: monospace; 
              margin-top: 12px; 
              display: inline-block; 
          }
          
          /* Mobile Responsive */
          @media (max-width: 600px) {
              .email-container { 
                  margin: 0; 
                  border-radius: 0; 
              }
              .content { 
                  padding: 20px 16px; 
              }
              .action-section { 
                  margin: 24px -16px -20px; 
                  padding: 20px 16px; 
              }
              .button-row { 
                  grid-template-columns: 1fr; 
                  gap: 8px; 
              }
              .stats-section { 
                  grid-template-columns: 1fr; 
                  gap: 8px; 
              }
              .detail-row { 
                  grid-template-columns: 1fr; 
                  gap: 4px; 
                  text-align: left; 
              }
              .detail-label { 
                  font-size: 12px; 
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <!-- Header -->
          <div class="header">
              <div class="header-content">
                  <div class="alert-icon">🎓</div>
                  <h1>New Student Lead</h1>
                  <p>LearnScape Admin Dashboard</p>
                  <div class="timestamp">⏰ ${formattedDate}</div>
              </div>
          </div>
          
          <!-- Content -->
          <div class="content">
              <!-- Priority Banner -->
              <div class="priority-banner">
                  <span class="icon">🚨</span>
                  IMMEDIATE ATTENTION REQUIRED - New student enquiry received
              </div>
              
              <!-- Student Card -->
              <div class="student-card">
                  <div class="student-header">
                      <div class="student-avatar">
                          ${enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div class="student-info">
                          <h3>${enquiry.name}</h3>
                          <p>Interested in ${enquiry.collegeName}</p>
                      </div>
                  </div>
                  
                  <!-- Details Grid -->
                  <div class="details-grid">
                      <div class="detail-row">
                          <span class="detail-label">📧 Email</span>
                          <span class="detail-value">
                              <span class="detail-icon">✉️</span>
                              ${enquiry.email}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">📱 Mobile</span>
                          <span class="detail-value">
                              <span class="detail-icon">📞</span>
                              +91 ${enquiry.mobile}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">🏛️ College</span>
                          <span class="detail-value">
                              <span class="detail-icon">🎯</span>
                              ${enquiry.collegeName}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">📚 Course</span>
                          <span class="detail-value">
                              <span class="detail-icon">🎓</span>
                              ${enquiry.courseName}
                          </span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">📊 Status</span>
                          <span class="detail-value">
                              <span class="detail-icon">🔄</span>
                              <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-size: 12px;">NEW LEAD</span>
                          </span>
                      </div>
                  </div>
                  
                  ${enquiry.message ? `
                  <div class="message-box">
                      <h4>Student's Message</h4>
                      <div class="message-text">
                          "${enquiry.message}"
                      </div>
                  </div>
                  ` : ''}
              </div>
              
              <!-- Quick Stats -->
              <div class="stats-section">
                  <div class="stat-card">
                      <span class="stat-number">24H</span>
                      <span class="stat-label">Response Target</span>
                  </div>
                  <div class="stat-card">
                      <span class="stat-number">HIGH</span>
                      <span class="stat-label">Priority Level</span>
                  </div>
                  <div class="stat-card">
                      <span class="stat-number">NEW</span>
                      <span class="stat-label">Lead Status</span>
                  </div>
              </div>
          </div>
          
          <!-- Action Section -->
          <div class="action-section">
              <div class="action-title">🎯 Take Immediate Action</div>
              
              <div class="button-row">
                  <a href="mailto:${enquiry.email}?subject=Welcome to LearnScape - ${enquiry.collegeName} Admission Guidance&body=Dear ${enquiry.name},%0A%0AThank you for choosing LearnScape! I'm excited to help you with your ${enquiry.collegeName} admission journey.%0A%0AAs your dedicated education counselor, I'll be providing you with:%0A- Detailed admission requirements and process%0A- Scholarship opportunities%0A- Application assistance%0A- Career guidance%0A%0AI'll call you within the next few hours to discuss your goals in detail.%0A%0ABest regards,%0ALearnScape Education Team" 
                     class="btn btn-primary">
                      <span class="btn-icon">📧</span>Email Student
                  </a>
                  <a href="tel:+91${enquiry.mobile}" class="btn btn-secondary">
                      <span class="btn-icon">📞</span>Call Now
                  </a>
              </div>
              
              <div style="background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 16px; margin-top: 20px;">
                  <h4 style="color: #234e52; margin-bottom: 8px; font-size: 14px; font-weight: 700;">📋 Action Checklist:</h4>
                  <ul style="color: #2d5a5a; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 16px;">
                      <li>Contact within 24 hours (preferably within 2-4 hours)</li>
                      <li>Provide comprehensive college and course information</li>
                      <li>Discuss admission timeline and requirements</li>
                      <li>Share scholarship and financial aid options</li>
                      <li>Schedule follow-up appointment if interested</li>
                      <li>Update lead status in CRM after contact</li>
                  </ul>
              </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
              <div class="footer-brand">LearnScape Education</div>
              <p>This notification was generated automatically when a new student enquiry was submitted through our website.</p>
              <div class="footer-id">
                  ID: ${enquiry._id || 'Pending'} | Source: ${enquiry.source} | Type: ${enquiry.type}
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
}
};

module.exports = emailService;
