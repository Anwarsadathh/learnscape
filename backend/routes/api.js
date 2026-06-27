const express = require('express');
const router = express.Router();
const serviceHelpers = require('../helpers/service-helpers');
const emailService = require('../helpers/email-service');

// ── Submit enquiry / expert query ─────────────────────────────
router.post('/submit-expert-query', async (req, res) => {
  try {
    const {
      name, email, mobile, message,
      courseName, collegeName, collegeId,
      type, downloadType,   // ← downloadType: 'brochure' | 'fee-structure' | undefined
    } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Name, email, and mobile are required fields' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }

    // ── Derive source label from type/downloadType ───────────
    const sourceMap = {
      brochure_download:      'Website - Brochure Download',
      'fee-structure_download': 'Website - Fee Structure Download',
      collegeenquiry:         'Website - Apply Button',
    };
    const source = sourceMap[type] || 'Website - Apply Button';

    const enquiryData = {
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      mobile:       mobile.trim(),
      message:      message?.trim() || '',
      courseName:   courseName?.trim() || 'General Inquiry',
      collegeName:  collegeName?.trim() || '',
      collegeId:    collegeId || '',
      type:         type || 'collegeenquiry',
      downloadType: downloadType || null,   // ← 'brochure' | 'fee-structure' | null
      source,
      status:       'new',
      createdAt:    new Date(),
      updatedAt:    new Date(),
    };

    const result = await serviceHelpers.submitExpertQuery(enquiryData);

    if (result.insertedId) {
      enquiryData._id = result.insertedId;

      // ── Logging ──────────────────────────────────────────
      const icon = downloadType ? '📥' : '🆕';
      console.log(`${icon} NEW ENQUIRY [${type || 'collegeenquiry'}]:`);
      console.log('   Name:', enquiryData.name);
      console.log('   College:', enquiryData.collegeName);
      if (downloadType) console.log('   Download:', downloadType);
      console.log('   Status: new  |  ID:', result.insertedId);

      // ── Send emails (non-blocking) ────────────────────────
      Promise.all([
        emailService.sendEnquiryConfirmation(enquiryData),
        emailService.sendAdminNotification(enquiryData),
      ]).then(([conf, admin]) => {
        console.log('📧 Confirmation:', conf.success ? '✅' : '❌', '| Admin:', admin.success ? '✅' : '❌');
      }).catch(err => console.error('📧 Email error:', err));

      // ── Pending count ─────────────────────────────────────
      const db = require('../config/connection');
      const pendingCount = await db.get().collection('expert_queries')
        .countDocuments({ status: 'new' });
      console.log('📊 Total Pending:', pendingCount);

      res.json({
        success: true,
        message: downloadType
          ? `You can now download the ${downloadType}. We'll also reach out within 24 hours.`
          : "Enquiry submitted! We'll contact you within 24 hours.",
        enquiryId: result.insertedId,
      });
    } else {
      throw new Error('Failed to insert enquiry');
    }
  } catch (error) {
    console.error('❌ Error submitting enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry. Please try again later.' });
  }
});

// ── Get all enquiries (admin panel) ──────────────────────────
router.get('/enquiries', async (req, res) => {
  try {
    const db = require('../config/connection');
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;
    const { status, type, search } = req.query;

    const filterQuery = {};
    if (status) filterQuery.status = status;
    if (type)   filterQuery.type   = type;
    if (search) {
      filterQuery.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { email:       { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
        { courseName:  { $regex: search, $options: 'i' } },
        { downloadType:{ $regex: search, $options: 'i' } },
      ];
    }

    const totalCount = await db.get().collection('expert_queries').countDocuments(filterQuery);
    const enquiries  = await db.get().collection('expert_queries')
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      success: true,
      data: enquiries,
      pagination: { current: page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

// ── Update enquiry status (admin) ────────────────────────────
router.patch('/enquiries/:id/status', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../config/connection');
    const { status } = req.body;

    const VALID = ['new', 'contacted', 'converted', 'closed'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const enquiry = await db.get().collection('expert_queries')
      .findOne({ _id: new ObjectId(req.params.id) });

    const result = await db.get().collection('expert_queries')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    console.log('🔄 STATUS UPDATE:', enquiry?.name, '|', enquiry?.status, '→', status);

    const pendingCount = await db.get().collection('expert_queries')
      .countDocuments({ status: 'new' });
    console.log('📊 Pending After Update:', pendingCount);

    res.json({ success: true, message: 'Enquiry status updated successfully' });
  } catch (error) {
    console.error('❌ Error updating enquiry status:', error);
    res.status(500).json({ success: false, message: 'Failed to update enquiry status' });
  }
});

module.exports = router;