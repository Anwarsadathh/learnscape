const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: String,
  amount: { type: Number, required: true }, // Amount in paise
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'completed', 'failed', 'incomplete', 'signature_mismatch', 'pending'],
    default: 'created'
  },
  method: String,
  signature: String,
  verifiedAt: Date,
  razorpayDetails: {
    bank: String,
    wallet: String,
    vpa: String
  }
}, { timestamps: true });

const scholarshipSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    default: function() {
      return 'SCH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  
  // Personal Details
  applicantName: { type: String, required: true },
  courseInterested: { type: String, required: true },
  address: { type: String, required: true },
  pin: { type: String, required: true },
  nationality: { type: String, default: 'Indian' },
  dob: { type: Date, required: true },
  aadhaar: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  caste: String,
  category: { type: String, required: true, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
  
  // Family Details
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherQualification: { type: String, required: true },
  annualIncome: { type: String, required: true },
  fatherMobile: { type: String, required: true },
  motherName: { type: String, required: true },
  motherQualification: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  localGuardian: String,
  guardianMobile: String,
  guardianAddress: String,
  sourceCode: String,
  
  // Document Files
  photo: String,
  sslcMarksCard: String,
  hscMarksCard: String,
  aadhaarCard: String,
  transferCertificate: String,
  
  // Application Status
  status: {
    type: String,
    enum: ['New', 'Processing', 'Approved', 'Rejected', 'pending', 'payment_failed'],
    default: 'New'
  },
  
  // Payment Information
  payment: paymentSchema,
  paymentStatus: {
    type: String,
    enum: ['completed', 'failed', 'incomplete', 'signature_mismatch', 'pending'],
    default: 'pending'
  },
  
  // Admin Notes
  adminNotes: String,
  reviewedBy: String,
  reviewedAt: Date,
  
}, { timestamps: true });

// Update paymentStatus based on payment.status
scholarshipSchema.pre('save', function(next) {
  if (this.payment && this.payment.status) {
    this.paymentStatus = this.payment.status;
  }
  next();
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
