// routes/admin/dashboard.js
const express = require('express');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const db = require('../../config/connection');

    // Get real page views from database
    const pageViewsDoc = await db.get().collection('page_views')
      .findOne({ _id: 'total_views' });
    
    const realPageViews = pageViewsDoc?.count || 0;

    // Get counts from different collections
    const [
      totalColleges,
      totalEnquiries,
      totalContacts,
      newEnquiriesCount,
      newContactsCount,
      pendingEnquiries
    ] = await Promise.all([
      // Total colleges
      db.get().collection('colleges').countDocuments({}),
      
      // Total enquiries
      db.get().collection('expert_queries').countDocuments({}),
      
      // Total contacts
      db.get().collection('contacts').countDocuments({}).catch(() => 0),
      
      // New enquiries (last 30 days)
      db.get().collection('expert_queries').countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      
      // New contacts (last 30 days)
      db.get().collection('contacts').countDocuments({
        submittedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }).catch(() => 0),

      // Pending enquiries (status: 'new')
      db.get().collection('expert_queries').countDocuments({
        status: 'new'
      })
    ]);

    // LOG ALL THE VALUES TO CONSOLE
    console.log('=== DASHBOARD STATS LOGGING ===');
    console.log('📊 Total Colleges:', totalColleges);
    console.log('📧 Total Enquiries:', totalEnquiries);
    console.log('📞 Total Contacts:', totalContacts);
    console.log('⏰ Pending Enquiries:', pendingEnquiries);
    console.log('👀 Total Page Views:', realPageViews);
    console.log('📈 New Enquiries (30d):', newEnquiriesCount);
    console.log('📈 New Contacts (30d):', newContactsCount);
    console.log('================================');

    // Calculate growth percentages
    const enquiryGrowth = totalEnquiries > 0 
      ? Math.round((newEnquiriesCount / totalEnquiries) * 100) 
      : 0;
    const contactGrowth = totalContacts > 0 
      ? Math.round((newContactsCount / totalContacts) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        totalColleges,
        totalEnquiries,
        totalContacts,
        pendingEnquiries,  // This shows enquiries with status 'new'
        pageViews: realPageViews, // Real page views instead of mock data
        growth: {
          colleges: `+${Math.floor(Math.random() * 20) + 5}%`,
          enquiries: `+${enquiryGrowth}%`,
          contacts: `+${contactGrowth}%`,
          pageViews: `+${Math.floor(Math.random() * 20) + 5}%`
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get recent activities
router.get('/activities', async (req, res) => {
  try {
    const db = require('../../config/connection');
    const limit = parseInt(req.query.limit) || 10;

    // Get recent enquiries and contacts
    const [recentEnquiries, recentContacts, recentColleges] = await Promise.all([
      db.get().collection('expert_queries')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      
      db.get().collection('contacts')
        .find({})
        .sort({ submittedAt: -1 })
        .limit(5)
        .toArray(),
      
      db.get().collection('colleges')
        .find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray()
    ]);

    const activities = [];

    // Add college activities
    recentColleges.forEach(college => {
      activities.push({
        id: college._id,
        action: 'New college added',
        description: `${college.name} added to the platform`,
        user: 'Admin',
        time: getTimeAgo(college.createdAt),
        type: 'college'
      });
    });

    // Add enquiry activities
    recentEnquiries.forEach(enquiry => {
      activities.push({
        id: enquiry._id,
        action: 'New enquiry received',
        description: `${enquiry.name} inquired about ${enquiry.collegeName || 'admission'}`,
        user: enquiry.name,
        time: getTimeAgo(enquiry.createdAt),
        type: 'enquiry'
      });
    });

    // Add contact activities
    recentContacts.forEach(contact => {
      activities.push({
        id: contact._id,
        action: 'New contact message',
        description: `${contact.name} sent a message: ${contact.subject}`,
        user: contact.name,
        time: getTimeAgo(contact.submittedAt),
        type: 'contact'
      });
    });

    // Sort by most recent and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: limitedActivities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

module.exports = router;
