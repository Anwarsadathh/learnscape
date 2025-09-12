const express = require('express');
const router = express.Router();
const serviceHelpers = require('../helpers/service-helpers');
const emailService = require('../helpers/email-service'); // Add this line

// Submit enquiry/expert query
router.post('/submit-expert-query', async (req, res) => {
  try {
    const { name, email, mobile, message, courseName, collegeName, collegeId, type } = req.body;
    
    // Basic validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and mobile are required fields",
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }
    
    // Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    const enquiryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      message: message?.trim() || '',
      courseName: courseName?.trim() || 'General Inquiry',
      collegeName: collegeName?.trim() || '',
      collegeId: collegeId || '',
      type: type || 'college_enquiry',
      status: "new",
      source: "Website - Apply Button",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save enquiry to database
    const result = await serviceHelpers.submitExpertQuery(enquiryData);
    
    if (result.insertedId) {
      // Add the ID to enquiry data for email
      enquiryData._id = result.insertedId;
      
      // LOG THE NEW PENDING ENQUIRY
      console.log('🆕 NEW PENDING ENQUIRY CREATED:');
      console.log('   Name:', enquiryData.name);
      console.log('   Email:', enquiryData.email);
      console.log('   College:', enquiryData.collegeName);
      console.log('   Status:', enquiryData.status);
      console.log('   ID:', result.insertedId);
      
      // Send emails (don't wait for completion to avoid delays)
      Promise.all([
        emailService.sendEnquiryConfirmation(enquiryData),
        emailService.sendAdminNotification(enquiryData)
      ]).then(([confirmationResult, adminResult]) => {
        console.log('📧 Email Results:');
        console.log('   Confirmation:', confirmationResult.success ? '✅ Sent' : '❌ Failed');
        console.log('   Admin Alert:', adminResult.success ? '✅ Sent' : '❌ Failed');
      }).catch(error => {
        console.error('📧 Email Error:', error);
      });
      
      // Update pending count
      const db = require('../config/connection');
      const pendingCount = await db.get().collection('expert_queries')
        .countDocuments({ status: 'new' });
      console.log('📊 Total Pending Enquiries Now:', pendingCount);
      
      res.json({
        success: true,
        message: "Enquiry submitted successfully! We'll contact you within 24 hours.",
        enquiryId: result.insertedId
      });
    } else {
      throw new Error("Failed to insert enquiry data");
    }
  } catch (error) {
    console.error("❌ Error submitting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry. Please try again later.",
    });
  }
});


// Get all enquiries (for admin panel)
router.get('/enquiries', async (req, res) => {
  try {
    const db = require('../config/connection');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, type, search } = req.query;
    
    // Build filter query
    let filterQuery = {};
    if (status) filterQuery.status = status;
    if (type) filterQuery.type = type;
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeName: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const totalCount = await db.get().collection('expert_queries').countDocuments(filterQuery);
    const enquiries = await db.get().collection('expert_queries')
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    res.json({
      success: true,
      data: enquiries,
      pagination: {
        current: page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries'
    });
  }
});

// In your status update route
router.patch('/enquiries/:id/status', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../config/connection');
    const { status } = req.body;
    
    if (!['new', 'contacted', 'converted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Get enquiry details before update
    const enquiry = await db.get().collection('expert_queries')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    const result = await db.get().collection('expert_queries')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status, updatedAt: new Date() } }
      );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
    
    // LOG STATUS CHANGE
    console.log('🔄 ENQUIRY STATUS UPDATED:');
    console.log('   Name:', enquiry?.name);
    console.log('   Old Status:', enquiry?.status);
    console.log('   New Status:', status);
    
    // Get updated pending count
    const pendingCount = await db.get().collection('expert_queries')
      .countDocuments({ status: 'new' });
    console.log('📊 Pending Enquiries After Update:', pendingCount);
    
    res.json({
      success: true,
      message: 'Enquiry status updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating enquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status'
    });
  }
});

module.exports = router;
