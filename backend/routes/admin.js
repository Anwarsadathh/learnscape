const express = require('express');
const router = express.Router();

// Admin routes here
router.get('/', (req, res) => {
  res.send('Admin panel');
});

// Get contact form submissions
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const contacts = await db.get().collection('contacts')
      .find({})
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const totalContacts = await db.get().collection('contacts').countDocuments();
    
    res.render('admin/contacts', {
      title: 'Contact Form Submissions',
      contacts,
      currentPage: page,
      totalPages: Math.ceil(totalContacts / limit),
      totalContacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    req.flash('error_msg', 'Failed to load contacts');
    res.redirect('/admin');
  }
});

module.exports = router; // Important!
