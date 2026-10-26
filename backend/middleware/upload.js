const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureUploadDirs = () => {
  const dirs = [
    'uploads', 'uploads/banners', 'uploads/college-img',
    'uploads/brochures', 'uploads/fee-structures', 'uploads/scholarships'
  ];
  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      console.warn('Skipping upload dir (read-only filesystem?):', dir, err.message);
    }
  });
};
ensureUploadDirs();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'bannerImage')       uploadPath = 'uploads/banners/';
    else if (file.fieldname === 'image')         uploadPath = 'uploads/college-img/';
    else if (file.fieldname === 'brochure')      uploadPath = 'uploads/brochures/';
    else if (file.fieldname === 'feeStructureDoc') uploadPath = 'uploads/fee-structures/';
    else if (req.route && req.route.path.includes('scholarship')) uploadPath = 'uploads/scholarships/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // ✅ CHANGE 1: .toLowerCase() prevents .JPG .PHP etc sneaking through
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ✅ CHANGE 2: strict allowlist — checks BOTH mime type AND extension
const fileFilter = (req, file, cb) => {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const allowedImages = {
    mime: ['image/jpeg', 'image/png'],
    ext:  ['.jpg', '.jpeg', '.png'],
  };
  const allowedDocs = {
    mime: ['application/pdf'],
    ext:  ['.pdf'],
  };

  const isImage = allowedImages.mime.includes(mime) && allowedImages.ext.includes(ext);
  const isPDF   = allowedDocs.mime.includes(mime)   && allowedDocs.ext.includes(ext);

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG images and PDF documents are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;