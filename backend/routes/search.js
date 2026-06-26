// routes/search.js
const express = require('express');
const router = express.Router();

// Search suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const db = require('../config/connection');
    const query = q.toLowerCase().trim();
    
    // Search colleges, streams, and locations
    const colleges = await db.get().collection('colleges')
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { streams: { $in: [new RegExp(query, 'i')] } },
          { locations: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .limit(15)
      .toArray();

    let suggestions = [];

    // Add college suggestions
    colleges.forEach(college => {
      if (college.name.toLowerCase().includes(query)) {
        suggestions.push({
          id: `college-${college._id}`,
          name: college.name,
          type: 'college',
          metadata: {
            location: college.locations?.[0],
            rating: college.rating
          }
        });
      }
    });

    // Add unique stream suggestions
    const streamSet = new Set();
    colleges.forEach(college => {
      college.streams?.forEach(stream => {
        if (stream.toLowerCase().includes(query) && !streamSet.has(stream.toLowerCase())) {
          streamSet.add(stream.toLowerCase());
          suggestions.push({
            id: `stream-${stream.replace(/\s+/g, '-').toLowerCase()}`,
            name: stream,
            type: 'stream'
          });
        }
      });
    });

    // Add unique location suggestions
    const locationSet = new Set();
    colleges.forEach(college => {
      college.locations?.forEach(location => {
        if (location.toLowerCase().includes(query) && !locationSet.has(location.toLowerCase())) {
          locationSet.add(location.toLowerCase());
          suggestions.push({
            id: `location-${location.replace(/\s+/g, '-').toLowerCase()}`,
            name: location,
            type: 'location'
          });
        }
      });
    });

    // Sort suggestions by relevance and limit results
    suggestions = suggestions
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.name.toLowerCase().startsWith(query);
        const bExact = b.name.toLowerCase().startsWith(query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by type priority (colleges first)
        const typeOrder = { college: 0, stream: 1, location: 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      })
      .slice(0, 8);

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: error.message
    });
  }
});

module.exports = router;
