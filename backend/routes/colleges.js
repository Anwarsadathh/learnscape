// routes/colleges.js - Enhanced with pagination
const express = require('express');
const router = express.Router();
const collections = require('../config/collection');

// routes/colleges.js - Enhanced with pagination
router.get('/', async (req, res) => {
  try {
    const db = require('../config/connection');
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const { stream, location, search, sort } = req.query;
    
    // Build filter query
    let filterQuery = {};
    let sortQuery = { positions: 1 }; // Default sort by ranking
    
    if (stream) {
      const streams = stream.split(',');
      filterQuery.streams = { $in: streams.map(s => new RegExp(s, 'i')) };
    }
    
    if (location) {
      const locations = location.split(',');
      filterQuery.locations = { $in: locations.map(l => new RegExp(l, 'i')) };
    }
    
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { streams: { $in: [new RegExp(search, 'i')] } },
        { locations: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Handle sorting
    if (sort === 'name') {
      sortQuery = { name: 1 };
    } else if (sort === 'rating') {
      sortQuery = { rating: -1 };
    }
    
    // Get total count for pagination
    const totalCount = await db.get().collection('colleges').countDocuments(filterQuery);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Fetch colleges with pagination
    const colleges = await db
      .get()
      .collection('colleges')
      .find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get all unique streams and locations for filters
    const allStreams = await db.get().collection('colleges').distinct('streams');
    const allLocations = await db.get().collection('colleges').distinct('locations');
    
    res.json({
      success: true,
      data: colleges,
      pagination: {
        current: page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages
      },
      filters: {
        streams: allStreams,
        locations: allLocations
      }
    });
  } catch (err) {
    console.error('Error fetching colleges:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges',
      error: err.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../config/connection');
    
    const collegeId = req.params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }
    
    const college = await db.get().collection('colleges')
      .findOne({ _id: new ObjectId(collegeId) });
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }
    
    res.json({
      success: true,
      data: college
    });
    
  } catch (error) {
    console.error('Error fetching college details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college details',
      error: error.message
    });
  }
});

module.exports = router;
