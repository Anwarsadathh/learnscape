const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/banners',
    'uploads/college-img',
    'uploads/brochures',
    'uploads/fee-structures',
    'uploads/scholarships'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on fieldname or route
    if (file.fieldname === 'bannerImage') {
      uploadPath = 'uploads/banners/';
    } else if (file.fieldname === 'image') {
      uploadPath = 'uploads/college-img/';
    } else if (file.fieldname === 'brochure') {
      uploadPath = 'uploads/brochures/';
    } else if (file.fieldname === 'feeStructureDoc') {
      uploadPath = 'uploads/fee-structures/';
    } else if (req.route && req.route.path.includes('scholarship')) {
      uploadPath = 'uploads/scholarships/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and PDF files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
