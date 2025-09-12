// routes/admin/colleges.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/college-img');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// IMPROVED POSITION MANAGEMENT - NO DUPLICATES EVER
const updatePositions = async (db, newPosition, currentPosition = null, excludeId = null) => {
  const newPos = parseInt(newPosition);
  
  if (isNaN(newPos) || newPos < 1) {
    throw new Error('Invalid position value. Position must be a positive integer.');
  }

  const collection = db.get().collection('collegeoruni');

  // First, ensure all positions are stored as numbers
  await collection.updateMany(
    { positions: { $type: "string" } },
    [{ $set: { positions: { $toInt: "$positions" } } }]
  );

  if (currentPosition !== null) {
    const currentPos = parseInt(currentPosition);
    
    if (newPos === currentPos) {
      return; // No change needed
    }
    
    if (newPos < currentPos) {
      // Moving UP (to smaller position number)
      // All colleges with positions >= newPos and < currentPos should move down (+1)
      await collection.updateMany(
        { 
          positions: { $gte: newPos, $lt: currentPos },
          ...(excludeId && { _id: { $ne: excludeId } })
        },
        { $inc: { positions: 1 } }
      );
    } else {
      // Moving DOWN (to larger position number)  
      // All colleges with positions > currentPos and <= newPos should move up (-1)
      await collection.updateMany(
        {
          positions: { $gt: currentPos, $lte: newPos },
          ...(excludeId && { _id: { $ne: excludeId } })
        },
        { $inc: { positions: -1 } }
      );
    }
  } else {
    // New college insertion
    // All colleges with positions >= newPos should move down (+1)
    await collection.updateMany(
      { positions: { $gte: newPos } },
      { $inc: { positions: 1 } }
    );
  }
};

// Fix any existing duplicate positions
const fixDuplicatePositions = async (db) => {
  try {
    const collection = db.get().collection('collegeoruni');
    
    // Get all colleges sorted by current position, then by creation date
    const colleges = await collection.find({})
      .sort({ positions: 1, createdAt: 1 })
      .toArray();
    
    // Reassign positions sequentially starting from 1
    for (let i = 0; i < colleges.length; i++) {
      const newPosition = i + 1;
      if (colleges[i].positions !== newPosition) {
        await collection.updateOne(
          { _id: colleges[i]._id },
          { $set: { positions: newPosition } }
        );
      }
    }
    
    console.log(`Fixed positions for ${colleges.length} colleges`);
  } catch (error) {
    console.error('Error fixing duplicate positions:', error);
  }
};

// Get all colleges with pagination (for admin)
router.get('/', async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    // Fix duplicates on every get request (can be removed after initial cleanup)
    await fixDuplicatePositions(db);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let filterQuery = {};
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { streams: { $in: [new RegExp(search, 'i')] } },
        { locations: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const totalCount = await db.get().collection('collegeoruni').countDocuments(filterQuery);
    const colleges = await db.get().collection('collegeoruni')
      .find(filterQuery)
      .sort({ positions: 1 }) // Sort by position ascending
      .skip(skip)
      .limit(limit)
      .toArray();

    // Ensure positions are strings for frontend consistency
    const processedColleges = colleges.map(college => ({
      ...college,
      positions: college.positions.toString()
    }));

    res.json({
      success: true,
      data: processedColleges,
      pagination: {
        current: page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching colleges for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges'
    });
  }
});

// Get single college by ID
router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../../config/connection');
    
    const collegeId = req.params.id;
    if (!ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const college = await db.get().collection('collegeoruni')
      .findOne({ _id: new ObjectId(collegeId) });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Ensure position is a string for consistency
    college.positions = college.positions.toString();

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
});

// Create new college
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'feeStructureDoc', maxCount: 1 }
]), async (req, res) => {
  try {
    const db = require('../../config/connection');
    
    console.log('Creating new college with data:', req.body);
    
    // Validate position
    const requestedPosition = parseInt(req.body.positions) || 1;
    if (requestedPosition < 1) {
      return res.status(400).json({
        success: false,
        message: 'Position must be a positive integer starting from 1'
      });
    }

    // Parse courses if it's a string
    let courses = [];
    if (req.body.courses) {
      try {
        courses = typeof req.body.courses === 'string' 
          ? JSON.parse(req.body.courses) 
          : req.body.courses;
      } catch (e) {
        console.log('Error parsing courses:', e);
        courses = [];
      }
    }

    // Parse overview if it's a string
    let overview = { heading: '', description: '', points: [] };
    if (req.body.overview) {
      try {
        overview = typeof req.body.overview === 'string' 
          ? JSON.parse(req.body.overview) 
          : req.body.overview;
      } catch (e) {
        console.log('Error parsing overview:', e);
      }
    }

    const collegeData = {
      name: req.body.name,
      streams: Array.isArray(req.body.streams) 
        ? req.body.streams 
        : req.body.streams.split(',').map(s => s.trim()),
      locations: Array.isArray(req.body.locations) 
        ? req.body.locations 
        : req.body.locations.split(',').map(s => s.trim()),
      positions: requestedPosition, // Store as number
      rating: parseFloat(req.body.rating) || 4.5,
      courses: courses,
      overview: overview,
      portalLink: req.body.portalLink || '',
      CollegeLink: req.body.CollegeLink || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        collegeData.image = `/uploads/college-img/${req.files.image[0].filename}`;
      }
      if (req.files.brochure) {
        collegeData.brochure = `/uploads/college-img/${req.files.brochure[0].filename}`;
      }
      if (req.files.feeStructureDoc) {
        collegeData.feeStructureDoc = `/uploads/college-img/${req.files.feeStructureDoc[0].filename}`;
      }
    }

    // Update positions to prevent duplicates
    await updatePositions(db, requestedPosition);

    const result = await db.get().collection('collegeoruni').insertOne(collegeData);
    
    res.json({
      success: true,
      message: 'College created successfully',
      data: { _id: result.insertedId, ...collegeData }
    });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create college',
      error: error.message
    });
  }
});

// Update college
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'feeStructureDoc', maxCount: 1 }
]), async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../../config/connection');
    
    const collegeId = req.params.id;
    if (!ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    console.log('Updating college with ID:', collegeId);
    console.log('Update data received:', req.body);

    // Get current college to compare positions
    const currentCollege = await db.get().collection('collegeoruni')
      .findOne({ _id: new ObjectId(collegeId) });

    if (!currentCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Validate new position
    const newPosition = parseInt(req.body.positions);
    if (isNaN(newPosition) || newPosition < 1) {
      return res.status(400).json({
        success: false,
        message: 'Position must be a positive integer starting from 1'
      });
    }

    // Parse courses if it's a string
    let courses = currentCollege.courses || [];
    if (req.body.courses) {
      try {
        courses = typeof req.body.courses === 'string' 
          ? JSON.parse(req.body.courses) 
          : req.body.courses;
      } catch (e) {
        console.log('Error parsing courses:', e);
      }
    }

    // Parse overview if it's a string
    let overview = currentCollege.overview || { heading: '', description: '', points: [] };
    if (req.body.overview) {
      try {
        overview = typeof req.body.overview === 'string' 
          ? JSON.parse(req.body.overview) 
          : req.body.overview;
      } catch (e) {
        console.log('Error parsing overview:', e);
      }
    }

    const updateData = {
      name: req.body.name || currentCollege.name,
      streams: req.body.streams 
        ? (Array.isArray(req.body.streams) 
          ? req.body.streams 
          : req.body.streams.split(',').map(s => s.trim()))
        : currentCollege.streams,
      locations: req.body.locations 
        ? (Array.isArray(req.body.locations) 
          ? req.body.locations 
          : req.body.locations.split(',').map(s => s.trim()))
        : currentCollege.locations,
      positions: newPosition, // Store as number
      rating: req.body.rating ? parseFloat(req.body.rating) : currentCollege.rating,
      courses: courses,
      overview: overview,
      portalLink: req.body.portalLink !== undefined ? req.body.portalLink : currentCollege.portalLink,
      CollegeLink: req.body.CollegeLink !== undefined ? req.body.CollegeLink : currentCollege.CollegeLink,
      updatedAt: new Date()
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        updateData.image = `/uploads/college-img/${req.files.image[0].filename}`;
      }
      if (req.files.brochure) {
        updateData.brochure = `/uploads/college-img/${req.files.brochure[0].filename}`;
      }
      if (req.files.feeStructureDoc) {
        updateData.feeStructureDoc = `/uploads/college-img/${req.files.feeStructureDoc[0].filename}`;
      }
    }

    // Update positions if changed to prevent duplicates
    const currentPos = typeof currentCollege.positions === 'string' 
      ? parseInt(currentCollege.positions) 
      : currentCollege.positions;
    
    if (newPosition !== currentPos) {
      console.log(`Position change detected: ${currentPos} -> ${newPosition}`);
      await updatePositions(db, newPosition, currentPos, new ObjectId(collegeId));
    }

    const result = await db.get().collection('collegeoruni')
      .updateOne({ _id: new ObjectId(collegeId) }, { $set: updateData });

    res.json({
      success: true,
      message: 'College updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update college',
      error: error.message
    });
  }
});

// Delete college
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = require('../../config/connection');
    
    const collegeId = req.params.id;
    if (!ObjectId.isValid(collegeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    // Get college to know its position before deletion
    const collegeToDelete = await db.get().collection('collegeoruni')
      .findOne({ _id: new ObjectId(collegeId) });

    if (!collegeToDelete) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    const result = await db.get().collection('collegeoruni')
      .deleteOne({ _id: new ObjectId(collegeId) });

    if (result.deletedCount > 0) {
      // Convert position to number for comparison
      const deletedPos = typeof collegeToDelete.positions === 'string' 
        ? parseInt(collegeToDelete.positions) 
        : collegeToDelete.positions;
      
      console.log(`Deleted college at position ${deletedPos}, adjusting positions...`);
      
      // Shift all colleges with higher positions down by 1
      await db.get().collection('collegeoruni').updateMany(
        { positions: { $gt: deletedPos } },
        { $inc: { positions: -1 } }
      );
      
      console.log('Position adjustment completed after deletion');
    }

    res.json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete college'
    });
  }
});

module.exports = router;
