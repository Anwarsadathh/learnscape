const express = require('express');
const router = express.Router();
const path = require('path');
const { ObjectId } = require('mongodb');

// Fix duplicate positions (similar to colleges)
const fixDuplicateApplicationIds = async (db) => {
  try {
    const collection = db.collection('scholarships');
    
    // Get all scholarships sorted by creation date
    const scholarships = await collection.find({})
      .sort({ createdAt: 1 })
      .toArray();
    
    // Ensure unique application IDs
    for (let i = 0; i < scholarships.length; i++) {
      if (!scholarships[i].applicationId) {
        const newApplicationId = 'SCH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        await collection.updateOne(
          { _id: scholarships[i]._id },
          { $set: { applicationId: newApplicationId } }
        );
      }
    }
    
    console.log(`Fixed application IDs for ${scholarships.length} scholarships`);
  } catch (error) {
    console.error('Error fixing duplicate application IDs:', error);
  }
};

// Get all scholarship applications with pagination (for admin)
router.get('/', async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    // Fix duplicates on every get request (can be removed after initial cleanup)
    await fixDuplicateApplicationIds(db.get());
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const paymentStatus = req.query.paymentStatus || '';
    const sourceCode = req.query.sourceCode || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';

    let filterQuery = {};
    
    if (search) {
      filterQuery.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filterQuery.status = status;
    if (paymentStatus) filterQuery.paymentStatus = paymentStatus;
    if (sourceCode) filterQuery.sourceCode = sourceCode;

    if (startDate && endDate) {
      filterQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const collection = db.get().collection('scholarships');
    
    const totalCount = await collection.countDocuments(filterQuery);
    const scholarships = await collection
      .find(filterQuery)
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .skip(skip)
      .limit(limit)
      .toArray();

    // Calculate statistics using aggregation
    const stats = await collection.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          totalRevenue: { 
            $sum: { 
              $cond: [
                { $eq: ['$paymentStatus', 'completed'] },
                '$payment.amount',
                0
              ]
            }
          },
          paidApplications: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
          },
          failedPayments: {
            $sum: { 
              $cond: [
                { $in: ['$paymentStatus', ['failed', 'signature_mismatch']] },
                1, 
                0
              ]
            }
          },
          pendingPayments: {
            $sum: { 
              $cond: [
                { $in: ['$paymentStatus', ['pending', 'created', 'incomplete']] },
                1, 
                0
              ]
            }
          }
        }
      }
    ]).toArray();

    // Get unique source codes for filter dropdown
    const sourceCodes = await collection.distinct('sourceCode', { 
      sourceCode: { $exists: true, $ne: '' } 
    });

    res.json({
      success: true,
      data: scholarships,
      pagination: {
        current: page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      statistics: stats[0] || {
        totalApplications: 0,
        totalRevenue: 0,
        paidApplications: 0,
        failedPayments: 0,
        pendingPayments: 0
      },
      sourceCodes
    });
  } catch (error) {
    console.error('Error fetching scholarship applications for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarship applications'
    });
  }
});

// Get single scholarship application by ID
router.get('/:id', async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    const scholarshipId = req.params.id;
    if (!ObjectId.isValid(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship ID'
      });
    }

    const scholarship = await db.get().collection('scholarships')
      .findOne({ _id: new ObjectId(scholarshipId) });

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    res.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Error fetching scholarship application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarship application'
    });
  }
});

// Update scholarship application status
router.put('/:id/status', async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    const scholarshipId = req.params.id;
    if (!ObjectId.isValid(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship ID'
      });
    }

    console.log('Updating scholarship with ID:', scholarshipId);
    console.log('Update data received:', req.body);

    // Get current scholarship
    const currentScholarship = await db.get().collection('scholarships')
      .findOne({ _id: new ObjectId(scholarshipId) });

    if (!currentScholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    const { status, adminNotes } = req.body;

    const updateData = {
      status: status || currentScholarship.status,
      adminNotes: adminNotes || currentScholarship.adminNotes,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.get().collection('scholarships')
      .updateOne({ _id: new ObjectId(scholarshipId) }, { $set: updateData });

    res.json({
      success: true,
      message: 'Scholarship application status updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating scholarship application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update scholarship application status',
      error: error.message
    });
  }
});

// Delete scholarship application
router.delete('/:id', async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    const scholarshipId = req.params.id;
    if (!ObjectId.isValid(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship ID'
      });
    }

    // Get scholarship to know details before deletion
    const scholarshipToDelete = await db.get().collection('scholarships')
      .findOne({ _id: new ObjectId(scholarshipId) });

    if (!scholarshipToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    const result = await db.get().collection('scholarships')
      .deleteOne({ _id: new ObjectId(scholarshipId) });

    if (result.deletedCount > 0) {
      console.log(`Deleted scholarship application: ${scholarshipToDelete.applicationId}`);
    }

    res.json({
      success: true,
      message: 'Scholarship application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scholarship application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scholarship application'
    });
  }
});

// Get uploaded file by filename
router.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/scholarships', filename);
    
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

// Retry payment for failed applications
router.post('/:id/retry-payment', async (req, res) => {
  try {
    const db = require('../../config/connection');
    const Razorpay = require('razorpay');
    
    const scholarshipId = req.params.id;
    if (!ObjectId.isValid(scholarshipId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship ID'
      });
    }

    const scholarship = await db.get().collection('scholarships')
      .findOne({ _id: new ObjectId(scholarshipId) });
    
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship application not found'
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create new Razorpay order
    const amount = 100; // ₹50 in paise
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `retry_${scholarship.applicationId}_${Date.now()}`,
      notes: {
        applicationId: scholarship.applicationId,
        applicantName: scholarship.applicantName,
        email: scholarship.email,
        retry: true
      }
    });

    // Update payment details
    const updateData = {
      'payment.orderId': order.id,
      'payment.status': 'created',
      'payment.paymentId': null,
      'payment.signature': null,
      'payment.verifiedAt': null,
      status: 'pending',
      updatedAt: new Date()
    };

    await db.get().collection('scholarships')
      .updateOne({ _id: new ObjectId(scholarshipId) }, { $set: updateData });

    res.json({
      success: true,
      message: 'New payment order created',
      paymentDetails: {
        orderId: order.id,
        amount,
        applicationId: scholarship.applicationId
      }
    });

  } catch (error) {
    console.error('Error creating retry payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create retry payment'
    });
  }
});

module.exports = router;
