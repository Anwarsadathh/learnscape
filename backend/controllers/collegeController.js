const College = require('../models/College');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

// Get all colleges with pagination and filtering
exports.getColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { isActive: true };
    
    // Add filters
    if (req.query.stream) {
      filter.streams = { $in: [req.query.stream] };
    }
    
    if (req.query.location) {
      filter.locations = { $in: [req.query.location] };
    }
    
    const colleges = await College.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await College.countDocuments(filter);
    
    res.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges'
    });
  }
};

// Search colleges and courses
exports.searchColleges = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const colleges = await College.find(
      {
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { streams: { $regex: query, $options: 'i' } },
              { 'courses.name': { $regex: query, $options: 'i' } },
              { locations: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      }
    ).limit(20);

    res.json({
      success: true,
      results: colleges
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};

// Get college by ID
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
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
    console.error('Error fetching college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college'
    });
  }
};

// Add college (Admin only)
exports.addCollege = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const collegeData = {
      ...req.body,
      courses: JSON.parse(req.body.courses || '[]'),
      overviewPoints: JSON.parse(req.body.overviewPoints || '[]')
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        collegeData.image = `/uploads/colleges/${req.files.image[0].filename}`;
      }
      if (req.files.brochure) {
        collegeData.brochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
      }
      if (req.files.feeStructureDoc) {
        collegeData.feeStructureDoc = `/uploads/fee-structures/${req.files.feeStructureDoc[0].filename}`;
      }
    }

    const college = new College(collegeData);
    await college.save();

    res.status(201).json({
      success: true,
      message: 'College added successfully',
      data: college
    });
  } catch (error) {
    console.error('Error adding college:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'College with this name or position already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add college'
    });
  }
};
