const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Landscape API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
