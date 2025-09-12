const express = require('express');
const router = express.Router();
const emailService = require('../helpers/email-service'); // Add this line

const validateContactForm = (req, res, next) => {
  console.log('Validating form data:', req.body);
  
  const { name, email, subject, message, queryType } = req.body;
  const errors = [];
  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is empty'
    });
  }
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!subject || subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long');
  }
  
  if (!message || message.trim().length < 5) {
    errors.push('Message must be at least 5 characters long');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Submit contact form
router.post('/submit', validateContactForm, async (req, res) => {
  try {
    const { name, email, phone, subject, message, queryType } = req.body;
    
    const db = require('../config/connection');
    
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      queryType: queryType || 'general',
      status: 'new',
      submittedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };
    
    const result = await db.get().collection('contacts').insertOne(contactData);
    
    if (result.insertedId) {
      // Add the ID to contact data for email
      contactData._id = result.insertedId;
      
      console.log(`✅ New contact form submitted by: ${email} at ${new Date()}`);
      
      // Send emails asynchronously (don't wait for completion)
      Promise.all([
        emailService.sendContactConfirmation(contactData),
        emailService.sendContactNotification(contactData)
      ]).then(([confirmationResult, adminResult]) => {
        console.log('📧 Contact Email Results:');
        console.log('   User Confirmation:', confirmationResult.success ? '✅ Sent' : '❌ Failed');
        console.log('   Admin Notification:', adminResult.success ? '✅ Sent' : '❌ Failed');
      }).catch(error => {
        console.error('📧 Contact Email Error:', error);
      });
      
      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully! We will get back to you within 24 hours.',
        data: {
          id: result.insertedId,
          submittedAt: contactData.submittedAt
        }
      });
    } else {
      throw new Error("Failed to insert contact data");
    }
    
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// Get all contacts (for admin panel) - Updated to use Native MongoDB
router.get('/all', async (req, res) => {
  try {
    const db = require('../config/connection');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, queryType } = req.query;
    
    let filterQuery = {};
    if (status) filterQuery.status = status;
    if (queryType) filterQuery.queryType = queryType;
    
    const totalCount = await db.get().collection('contacts').countDocuments(filterQuery);
    const contacts = await db.get().collection('contacts')
      .find(filterQuery, { projection: { userAgent: 0, ipAddress: 0 } })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../config/connection');
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const result = await db.get().collection('contacts')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status, updatedAt: new Date() } }
      );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
});

module.exports = router;
