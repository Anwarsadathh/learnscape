const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const emailService = require('../helpers/email-service');

// Ensure uploads directory exists
const ensureDir = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/scholarships');
    await ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const uniqueName = `${basename}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.fieldname, file.mimetype);
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Only JPEG, PNG, and PDF are allowed.`));
    }
  }
});

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Generate unique application ID
const generateApplicationId = () => {
  return 'SCH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Apply for scholarship
router.post('/apply', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'sslcMarksCard', maxCount: 1 },
  { name: 'hscMarksCard', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 }
]), async (req, res) => {
  try {
    const db = require('../config/connection');
    
    console.log('Scholarship application received');
    console.log('Body:', req.body);
    console.log('Files:', Object.keys(req.files || {}));

    const {
      applicantName, courseInterested, address, pin, nationality, dob, aadhaar,
      bloodGroup, gender, mobile, email, caste, category, fatherName,
      fatherOccupation, fatherQualification, annualIncome, fatherMobile,
      motherName, motherQualification, motherOccupation, localGuardian,
      guardianMobile, guardianAddress, sourceCode, agreeTerms
    } = req.body;

    // Validate required fields
    const requiredFields = {
      applicantName, courseInterested, address, pin, dob, aadhaar, bloodGroup,
      gender, mobile, email, category, fatherName, fatherOccupation,
      fatherQualification, annualIncome, fatherMobile, motherName,
      motherQualification, motherOccupation
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.toString().trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path) {
            fs.unlink(file.path).catch(console.error);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email and mobile formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    
    if (!emailRegex.test(email)) {
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path) {
            fs.unlink(file.path).catch(console.error);
          }
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    if (!mobileRegex.test(mobile) || !mobileRegex.test(fatherMobile)) {
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path) {
            fs.unlink(file.path).catch(console.error);
          }
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid mobile number format' });
    }

    // Check if application already exists with this email
    const collection = db.get().collection('scholarships');
    const existingApplication = await collection.findOne({ email });
    
    if (existingApplication) {
      // If payment is already completed, don't allow duplicate
      if (existingApplication.paymentStatus === 'completed') {
        // Clean up any uploaded files since we're rejecting
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            if (file && file.path) {
              fs.unlink(file.path).catch(console.error);
            }
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'An application with this email already exists and payment is completed',
          applicationId: existingApplication.applicationId
        });
      }

      // If payment is pending/failed, allow continuing with existing application
      // If payment is pending/failed, allow continuing with existing application
if (['pending', 'created', 'failed', 'signature_mismatch', 'incomplete'].includes(existingApplication.paymentStatus)) {
  console.log('Continuing with existing application:', existingApplication.applicationId);

  // Update existing application data
  const updateData = {
    applicantName, courseInterested, address, pin, nationality, dob: new Date(dob),
    aadhaar, bloodGroup, gender, mobile, caste: caste || '', category,
    fatherName, fatherOccupation, fatherQualification, annualIncome, fatherMobile,
    motherName, motherQualification, motherOccupation,
    localGuardian: localGuardian || '', guardianMobile: guardianMobile || '',
    guardianAddress: guardianAddress || '', sourceCode: sourceCode || '',
    updatedAt: new Date()
  };


        // ✅ FIXED FILE HANDLING - COMPLETE REWRITE
        const files = req.files || {};
        const fileUpdates = {};
        const filesToCleanup = [];
        
        const fileFields = ['photo', 'sslcMarksCard', 'hscMarksCard', 'aadhaarCard', 'transferCertificate'];
        
        console.log('Processing file updates for existing application...');
        
        fileFields.forEach(fieldName => {
          // ✅ FIXED: Check if new file was uploaded
          if (files[fieldName] && files[fieldName].length > 0 && files[fieldName][0]) {
            console.log(`New file uploaded for ${fieldName}:`, files[fieldName][0].filename);
            
            // Store new filename
            fileUpdates[fieldName] = files[fieldName][0].filename;
            
            // Mark old file for cleanup if it exists and is not null
            if (existingApplication[fieldName] && existingApplication[fieldName] !== null) {
              const oldFilePath = path.join(__dirname, '../uploads/scholarships', existingApplication[fieldName]);
              filesToCleanup.push(oldFilePath);
              console.log(`Marked old file for cleanup: ${existingApplication[fieldName]}`);
            }
          } else {
            console.log(`No new file for ${fieldName}, keeping existing`);
            // Keep existing file - don't update this field
          }
        });

        console.log('File updates:', fileUpdates);
        console.log('Files to cleanup:', filesToCleanup);

        // Clean up old files
        for (const filePath of filesToCleanup) {
          try {
            await fs.unlink(filePath);
            console.log(`Successfully deleted old file: ${filePath}`);
          } catch (error) {
            console.error('Error deleting old file:', filePath, error.message);
          }
        }

        // Merge file updates with main update data
        Object.assign(updateData, fileUpdates);

        console.log('Final update data file fields:', {
          photo: updateData.photo,
          sslcMarksCard: updateData.sslcMarksCard,
          hscMarksCard: updateData.hscMarksCard,
          aadhaarCard: updateData.aadhaarCard,
          transferCertificate: updateData.transferCertificate
        });

       // Update existing application
  await collection.updateOne(
    { _id: existingApplication._id },
    { $set: updateData }
  );

  // ✅ ALWAYS CREATE NEW PAYMENT ORDER FOR EXISTING APPLICATIONS
  const amount = 100; // ₹1 = 100 paise
  const paymentOrder = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `retry_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substr(2, 6)}`,
    notes: {
      applicationId: existingApplication.applicationId,
      applicantName,
      email,
      mobile
    }
  });

  // Update payment details with new order
  await collection.updateOne(
    { _id: existingApplication._id },
    { 
      $set: { 
        'payment.orderId': paymentOrder.id,
        'payment.amount': amount,
        'payment.currency': 'INR',
        'payment.status': 'created',
        paymentStatus: 'created',
        status: 'New',
        updatedAt: new Date()
      } 
    }
  );

  console.log('Updated existing application with new payment order:', existingApplication.applicationId);

  return res.json({
    success: true,
    message: 'Application updated successfully. Please complete your payment.',
    applicationId: existingApplication.applicationId,
    paymentRequired: true,
    continueExisting: true,
    paymentDetails: {
      key: process.env.RAZORPAY_KEY_ID,
      amount: paymentOrder.amount, // ✅ Will be 100 (₹1)
      currency: 'INR',
      orderId: paymentOrder.id, // ✅ New order with ₹1
      name: 'LearnScape Scholarship',
      description: 'Scholarship Application Fee'
    }
  });
      }
    }

    // ✅ NEW APPLICATION LOGIC
    const files = req.files || {};
    const requiredFiles = ['photo', 'sslcMarksCard', 'hscMarksCard', 'aadhaarCard', 'transferCertificate'];
    const missingFiles = requiredFiles.filter(fileField => !files[fileField] || files[fileField].length === 0);

    if (missingFiles.length > 0) {
      // Clean up uploaded files
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path) {
            fs.unlink(file.path).catch(console.error);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `Missing required documents: ${missingFiles.join(', ')}`
      });
    }

    if (agreeTerms !== 'true') {
      // Clean up uploaded files
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path) {
            fs.unlink(file.path).catch(console.error);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'You must agree to the terms and conditions'
      });
    }

    // Generate application ID
    const applicationId = generateApplicationId();

    console.log('Creating new application with files:');
    requiredFiles.forEach(field => {
      if (files[field] && files[field][0]) {
        console.log(`${field}: ${files[field][0].filename}`);
      }
    });

    // Create scholarship application data
    const scholarshipData = {
      applicationId, applicantName, courseInterested, address, pin, nationality,
      dob: new Date(dob), aadhaar, bloodGroup, gender, mobile, email,
      caste: caste || '', category, fatherName, fatherOccupation, fatherQualification,
      annualIncome, fatherMobile, motherName, motherQualification, motherOccupation,
      localGuardian: localGuardian || '', guardianMobile: guardianMobile || '',
      guardianAddress: guardianAddress || '', sourceCode: sourceCode || '',
      
      // ✅ FIXED: File names - use correct array access
      photo: files.photo[0].filename,
      sslcMarksCard: files.sslcMarksCard[0].filename,
      hscMarksCard: files.hscMarksCard[0].filename,
      aadhaarCard: files.aadhaarCard[0].filename,
      transferCertificate: files.transferCertificate[0].filename,
      
      status: 'New',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Scholarship data file fields:', {
      photo: scholarshipData.photo,
      sslcMarksCard: scholarshipData.sslcMarksCard,
      hscMarksCard: scholarshipData.hscMarksCard,
      aadhaarCard: scholarshipData.aadhaarCard,
      transferCertificate: scholarshipData.transferCertificate
    });

    // Insert scholarship into database first to get the ID
    const insertResult = await collection.insertOne(scholarshipData);
    const scholarshipId = insertResult.insertedId;

    // Create Razorpay order for application fee (50 rupees = 1000 paise)
    const amount = 100;
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `sch_${Date.now().toString().slice(-10)}_${Math.random().toString(36).substr(2, 5)}`,
      notes: {
        applicationId,
        applicantName,
        email,
        mobile
      }
    });

    // Update scholarship with payment details
    const paymentData = {
      orderId: order.id,
      amount,
      currency: 'INR',
      status: 'created'
    };

    await collection.updateOne(
      { _id: scholarshipId },
      { 
        $set: { 
          payment: paymentData,
          paymentStatus: 'created',
          updatedAt: new Date()
        } 
      }
    );

    console.log('Scholarship application created:', applicationId);

    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId,
      paymentRequired: true,
      paymentDetails: {
        key: process.env.RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        orderId: order.id,
        name: 'LearnScape Scholarship',
        description: 'Scholarship Application Fee'
      }
    });

  } catch (error) {
    console.error('Error creating scholarship application:', error);
    
    // Safe cleanup of uploaded files if there's an error
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        if (file && file.path) {
          fs.unlink(file.path).catch(console.error);
        }
      });
    }

    // Handle different error types
    if (error?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 2MB per file.'
      });
    }

    if (error?.message?.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create application. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

// Update your verify-payment route:
router.post('/verify-payment', async (req, res) => {
  try {
    const db = require('../config/connection');
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    console.log('Payment verification request:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id
    });

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;
    const collection = db.get().collection('scholarships');

    if (isAuthentic) {
      // Find scholarship by order ID
      const scholarship = await collection.findOne({
        'payment.orderId': razorpay_order_id
      });

      if (!scholarship) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Update payment details
      const updateData = {
        'payment.paymentId': razorpay_payment_id,
        'payment.signature': razorpay_signature,
        'payment.status': 'completed',
        'payment.verifiedAt': new Date(),
        status: 'Processing',
        paymentStatus: 'completed',
        updatedAt: new Date()
      };

      await collection.updateOne(
        { _id: scholarship._id },
        { $set: updateData }
      );

      console.log('Payment verified successfully for application:', scholarship.applicationId);

      // 🎉 SEND SUCCESS EMAIL
      try {
        await emailService.sendScholarshipSuccess(scholarship);
        console.log('✅ Success email sent to:', scholarship.email);
      } catch (emailError) {
        console.error('❌ Error sending success email:', emailError);
        // Don't fail the payment verification if email fails
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        applicationId: scholarship.applicationId
      });

    } else {
      // Update as signature mismatch
      const scholarship = await collection.findOne({
        'payment.orderId': razorpay_order_id
      });

      if (scholarship) {
        await collection.updateOne(
          { _id: scholarship._id },
          { 
            $set: { 
              'payment.status': 'signature_mismatch',
              status: 'payment_failed',
              paymentStatus: 'signature_mismatch',
              updatedAt: new Date()
            } 
          }
        );

        // 📧 SEND PAYMENT FAILED EMAIL
        try {
          await emailService.sendScholarshipPaymentFailed(scholarship);
          console.log('✅ Payment failed email sent to:', scholarship.email);
        } catch (emailError) {
          console.error('❌ Error sending payment failed email:', emailError);
        }
      }

      console.log('Payment signature verification failed for order:', razorpay_order_id);

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Add a new route for sending payment retry emails (optional)
router.post('/send-payment-reminder/:applicationId', async (req, res) => {
  try {
    const db = require('../config/connection');
    const { applicationId } = req.params;
    
    const collection = db.get().collection('scholarships');
    const scholarship = await collection.findOne({ applicationId });
    
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (scholarship.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    // Send payment retry email
    const emailResult = await emailService.sendScholarshipPaymentRetry(scholarship);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Payment reminder sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send payment reminder'
      });
    }

  } catch (error) {
    console.error('Error sending payment reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment reminder'
    });
  }
});

// Get application status
router.get('/status/:applicationId', async (req, res) => {
  try {
    const db = require('../config/connection');
    const { applicationId } = req.params;
    
    const collection = db.get().collection('scholarships');
    const scholarship = await collection.findOne(
      { applicationId },
      { 
        projection: { 
          applicationId: 1, 
          status: 1, 
          paymentStatus: 1, 
          createdAt: 1, 
          reviewedAt: 1 
        } 
      }
    );
    
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application: {
        applicationId: scholarship.applicationId,
        status: scholarship.status,
        paymentStatus: scholarship.paymentStatus,
        submittedAt: scholarship.createdAt,
        reviewedAt: scholarship.reviewedAt
      }
    });

  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application status'
    });
  }
});

// Get file by filename (for serving uploaded documents)
router.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/scholarships', filename);
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
    });
  } catch (error) {
    console.error('Error accessing file:', error);
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
});

module.exports = router;
