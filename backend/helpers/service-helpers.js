const { ObjectId } = require('mongodb');
const db = require('../config/connection');
const collection = require('../config/collection');

module.exports = {
  // Get all colleges
  getColleges: async () => {
    try {
      console.log('service-helpers: Getting all colleges...');
      const colleges = await db
        .get()
        .collection(collection.COLLEGE_COLLECTION || 'collegeoruni')
        .find({})
        .sort({ name: 1 })
        .toArray();
      
      console.log(`service-helpers: Found ${colleges.length} colleges`);
      return colleges;
    } catch (error) {
      console.error('Error in getColleges:', error);
      throw error;
    }
  },

  // Get college by ID
  getCollegeById: async (id) => {
    try {
      const college = await db
        .get()
        .collection(collection.COLLEGE_COLLECTION || 'collegeoruni')
        .findOne({ _id: new ObjectId(id) });
      
      return college;
    } catch (error) {
      console.error('Error in getCollegeById:', error);
      throw error;
    }
  },
submitExpertQuery: async (queryData) => {
  try {
    const result = await db
      .get()
      .collection(collection.EXPERT_QUERY_COLLECTION || 'enquiries')
      .insertOne(queryData);
    
    return result;
  } catch (error) {
    console.error('Error in submitExpertQuery:', error);
    throw error;
  }
},
  // Search colleges
  searchColleges: async (query = '', filters = {}) => {
    try {
      const searchConditions = [];
      
      if (query && query.trim()) {
        const searchRegex = new RegExp(query.trim(), 'i');
        searchConditions.push({
          $or: [
            { name: searchRegex },
            { streams: { $in: [searchRegex] } },
            { locations: { $in: [searchRegex] } },
            { 'courses.name': searchRegex },
            { 'overview.heading': searchRegex },
            { 'overview.description': searchRegex }
          ]
        });
      }

      if (filters.stream) {
        searchConditions.push({ streams: { $in: [new RegExp(filters.stream, 'i')] } });
      }

      if (filters.location) {
        searchConditions.push({ locations: { $in: [new RegExp(filters.location, 'i')] } });
      }

      const finalQuery = searchConditions.length > 0 ? { $and: searchConditions } : {};

      const colleges = await db
        .get()
        .collection(collection.COLLEGE_COLLECTION || 'colleges')
        .find(finalQuery)
        .sort({ name: 1 })
        .toArray();

      return colleges;
    } catch (error) {
      console.error('Error in searchColleges:', error);
      return [];
    }
  },

  // Get active banners
  getActiveBanners: async () => {
    try {
      const banners = await db
        .get()
        .collection(collection.BANNER_COLLECTION || 'banners')
        .find({ isActive: true })
        .sort({ position: 1 })
        .toArray();
      
      return banners;
    } catch (error) {
      console.error('Error in getActiveBanners:', error);
      return [];
    }
  },

  // Submit enquiry
  submitEnquiry: async (enquiryData) => {
    try {
      const result = await db
        .get()
        .collection(collection.ENQUIRY_COLLECTION || 'enquiries')
        .insertOne(enquiryData);
      
      return result;
    } catch (error) {
      console.error('Error in submitEnquiry:', error);
      throw error;
    }
  },

  // Submit expert query
  submitExpertQuery: async (queryData) => {
    try {
      const result = await db
        .get()
        .collection(collection.EXPERT_QUERY_COLLECTION || 'expert_queries')
        .insertOne(queryData);
      
      return result;
    } catch (error) {
      console.error('Error in submitExpertQuery:', error);
      throw error;
    }
  },

  // Submit scholarship application
  submitScholarshipApplication: async (applicationData) => {
    try {
      const result = await db
        .get()
        .collection(collection.SCHOLARSHIP_COLLECTION || 'scholarships')
        .insertOne(applicationData);
      
      return result;
    } catch (error) {
      console.error('Error in submitScholarshipApplication:', error);
      throw error;
    }
  },

  // Get all enquiries
  getEnquiries: async () => {
    try {
      const enquiries = await db
        .get()
        .collection(collection.ENQUIRY_COLLECTION || 'enquiries')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return enquiries;
    } catch (error) {
      console.error('Error in getEnquiries:', error);
      throw error;
    }
  },

  // Get scholarship applications
  getScholarshipApplications: async () => {
    try {
      const applications = await db
        .get()
        .collection(collection.SCHOLARSHIP_COLLECTION || 'scholarships')
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();
      
      return applications;
    } catch (error) {
      console.error('Error in getScholarshipApplications:', error);
      throw error;
    }
  }
};
