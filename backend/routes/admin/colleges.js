const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const db = require('../../config/connection');

/* ========= UPLOAD DIRS ========= */

const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../uploads/college-img'),
    path.join(__dirname, '../../uploads/brochures'),
    path.join(__dirname, '../../uploads/fee-structures')
  ];

  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.warn('Skipping upload dir (read-only filesystem?):', dir, err.message);
    }
  });
};

ensureUploadDirs();

const getUploadPathByField = fieldname => {
  if (fieldname === 'image') {
    return path.join(__dirname, '../../uploads/college-img');
  }

  if (fieldname === 'brochure') {
    return path.join(__dirname, '../../uploads/brochures');
  }

  if (fieldname === 'feeStructureDoc') {
    return path.join(__dirname, '../../uploads/fee-structures');
  }

  return path.join(__dirname, '../../uploads');
};

const isLocalUploadPath = filePath =>
  typeof filePath === 'string' && filePath.startsWith('/uploads/');

const toAbsoluteUploadPath = filePath =>
  path.join(__dirname, '../../', filePath.replace(/^\//, ''));

const deleteLocalFile = filePath => {
  try {
    if (!isLocalUploadPath(filePath)) return;

    const absolutePath = toAbsoluteUploadPath(filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log('Deleted old file:', absolutePath);
    }
  } catch (error) {
    console.error('Failed to delete file:', filePath, error.message);
  }
};

/* ========= MULTER CONFIG ========= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPathByField(file.fieldname);

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    } catch (err) {
      console.warn('Could not create upload dir (read-only filesystem?):', uploadPath, err.message);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (file.fieldname === 'image') {
    const ok =
      ['image/jpeg', 'image/png'].includes(mime) &&
      ['.jpg', '.jpeg', '.png'].includes(ext);

    return ok
      ? cb(null, true)
      : cb(new Error('College image must be JPG or PNG only.'));
  }

  if (file.fieldname === 'brochure' || file.fieldname === 'feeStructureDoc') {
    const ok = mime === 'application/pdf' && ext === '.pdf';

    return ok
      ? cb(null, true)
      : cb(new Error(`${file.fieldname} must be a PDF file only.`));
  }

  cb(new Error('Unexpected file field: ' + file.fieldname));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

const uploadFields = (req, res, next) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'brochure', maxCount: 1 },
    { name: 'feeStructureDoc', maxCount: 1 }
  ])(req, res, err => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

/* ========= HELPERS ========= */

const parseJSONField = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseArrayField = value => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
};

const normalizeCourses = (courses = []) => {
  if (!Array.isArray(courses)) return [];

  return courses
    .filter(course => course && course.name)
    .map(course => ({
      name: course.name?.trim() || '',
      level: course.level?.trim() || 'UG',
      duration: course.duration?.trim() || '',
      fees: course.fees?.trim() || '',
      seats: Number(course.seats) || 0,
      entrance: course.entrance?.trim() || ''
    }));
};

const normalizeOverview = (overview = {}) => ({
  heading: overview.heading?.trim() || '',
  description: overview.description?.trim() || '',
  points: Array.isArray(overview.points)
    ? overview.points.map(point => ({
        heading: point.heading?.trim() || '',
        description: point.description?.trim() || ''
      }))
    : []
});

const normalizeCollegePayload = (body, files = {}, existingCollege = {}) => {
  const courses = normalizeCourses(
    parseJSONField(body.courses, existingCollege.courses || [])
  );

  const overview = normalizeOverview(
    parseJSONField(body.overview, existingCollege.overview || {})
  );

  const accreditations =
    typeof body.accreditations === 'string' &&
    body.accreditations.trim().startsWith('[')
      ? parseJSONField(body.accreditations, existingCollege.accreditations || [])
      : parseArrayField(body.accreditations ?? existingCollege.accreditations);

  const highlights =
    typeof body.highlights === 'string' && body.highlights.trim().startsWith('[')
      ? parseJSONField(body.highlights, existingCollege.highlights || [])
      : typeof body.highlights === 'string'
      ? body.highlights.split('\n').map(v => v.trim()).filter(Boolean)
      : Array.isArray(body.highlights)
      ? body.highlights.map(v => String(v).trim()).filter(Boolean)
      : existingCollege.highlights || [];

  const removeImage = String(body.removeImage || '') === 'true';
  const removeBrochure = String(body.removeBrochure || '') === 'true';
  const removeFeeStructureDoc = String(body.removeFeeStructureDoc || '') === 'true';

  const imageUrl =
    typeof body.imageUrl === 'string'
      ? body.imageUrl.trim()
      : typeof body.image === 'string'
      ? body.image.trim()
      : '';

  const brochureUrl =
    typeof body.brochureUrl === 'string'
      ? body.brochureUrl.trim()
      : typeof body.brochure === 'string'
      ? body.brochure.trim()
      : '';

  const feeStructureUrl =
    typeof body.feeStructureUrl === 'string'
      ? body.feeStructureUrl.trim()
      : typeof body.feeStructureDoc === 'string'
      ? body.feeStructureDoc.trim()
      : '';

  const payload = {
    name: String(body.name ?? existingCollege.name ?? '').trim(),
    slug: String(body.slug ?? existingCollege.slug ?? '').trim(),
    streams: parseArrayField(body.streams ?? existingCollege.streams),
    locations: parseArrayField(body.locations ?? existingCollege.locations),
    positions: Number(body.positions ?? existingCollege.positions) || 1,

    image: removeImage ? '' : existingCollege.image || '',
    brochure: removeBrochure ? '' : existingCollege.brochure || '',
    feeStructureDoc: removeFeeStructureDoc ? '' : existingCollege.feeStructureDoc || '',

    courses,
    overview,

    portalLink: String(body.portalLink ?? existingCollege.portalLink ?? '').trim(),
    portalLinkAC: String(body.portalLinkAC ?? existingCollege.portalLinkAC ?? '').trim(),
    CollegeLink: String(body.CollegeLink ?? existingCollege.CollegeLink ?? '').trim(),

    rating: Number(body.rating ?? existingCollege.rating) || 0,
    naac: String(body.naac ?? existingCollege.naac ?? '').trim(),

    fees: {
      min:
        Number(
          body.feesMin ??
            body['fees[min]'] ??
            body?.fees?.min ??
            existingCollege.fees?.min
        ) || 0,
      max:
        Number(
          body.feesMax ??
            body['fees[max]'] ??
            body?.fees?.max ??
            existingCollege.fees?.max
        ) || 0
    },

    type: String(body.type ?? existingCollege.type ?? 'private').trim(),
    established: Number(body.established ?? existingCollege.established) || 0,
    accreditations,
    highlights,
    updatedAt: new Date()
  };

  if (!existingCollege.createdAt) {
    payload.createdAt = new Date();
  }

  if (files.image?.[0]) {
    payload.image = `/uploads/college-img/${files.image[0].filename}`;
  } else if (!removeImage && imageUrl) {
    payload.image = imageUrl;
  }

  if (files.brochure?.[0]) {
    payload.brochure = `/uploads/brochures/${files.brochure[0].filename}`;
  } else if (!removeBrochure && brochureUrl) {
    payload.brochure = brochureUrl;
  }

  if (files.feeStructureDoc?.[0]) {
    payload.feeStructureDoc = `/uploads/fee-structures/${files.feeStructureDoc[0].filename}`;
  } else if (!removeFeeStructureDoc && feeStructureUrl) {
    payload.feeStructureDoc = feeStructureUrl;
  }

  console.log('--- normalizeCollegePayload ---');
  console.log('removeImage:', removeImage);
  console.log('removeBrochure:', removeBrochure);
  console.log('removeFeeStructureDoc:', removeFeeStructureDoc);
  console.log('body.image:', body.image);
  console.log('body.imageUrl:', body.imageUrl);
  console.log('files.image:', files.image?.[0]?.filename || null);
  console.log('existingCollege.image:', existingCollege.image || '');
  console.log('payload.image:', payload.image);
  console.log('payload.brochure:', payload.brochure);
  console.log('payload.feeStructureDoc:', payload.feeStructureDoc);

  return payload;
};

const updatePositions = async (
  dbConn,
  newPosition,
  currentPosition = null,
  excludeId = null
) => {
  const newPos = parseInt(newPosition, 10);

  if (isNaN(newPos) || newPos < 1) {
    throw new Error('Invalid position value. Position must be a positive integer.');
  }

  const collection = dbConn.get().collection('colleges');

  await collection.updateMany(
    { positions: { $type: 'string' } },
    [{ $set: { positions: { $toInt: '$positions' } } }]
  );

  if (currentPosition !== null) {
    const currentPos = parseInt(currentPosition, 10);

    if (newPos === currentPos) return;

    if (newPos < currentPos) {
      await collection.updateMany(
        {
          positions: { $gte: newPos, $lt: currentPos },
          ...(excludeId && { _id: { $ne: excludeId } })
        },
        { $inc: { positions: 1 } }
      );
    } else {
      await collection.updateMany(
        {
          positions: { $gt: currentPos, $lte: newPos },
          ...(excludeId && { _id: { $ne: excludeId } })
        },
        { $inc: { positions: -1 } }
      );
    }
  } else {
    await collection.updateMany(
      { positions: { $gte: newPos } },
      { $inc: { positions: 1 } }
    );
  }
};

const fixDuplicatePositions = async dbConn => {
  const collection = dbConn.get().collection('colleges');
  const colleges = await collection
    .find({})
    .sort({ positions: 1, createdAt: 1 })
    .toArray();

  for (let i = 0; i < colleges.length; i++) {
    const newPosition = i + 1;
    if (Number(colleges[i].positions) !== newPosition) {
      await collection.updateOne(
        { _id: colleges[i]._id },
        { $set: { positions: newPosition } }
      );
    }
  }
};

/* ========= ROUTES ========= */

// GET /api/admin/colleges
router.get('/', async (req, res) => {
  try {
    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = req.query.limit;

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const isAll = rawLimit === 'all';

    const limit =
      !isAll && Number.isInteger(parseInt(rawLimit, 10)) && parseInt(rawLimit, 10) > 0
        ? Math.min(parseInt(rawLimit, 10), 100)
        : isAll
        ? 0
        : 10;

    const skip = isAll ? 0 : (page - 1) * limit;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const filterQuery = {};

    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');

      filterQuery.$or = [
        { name: regex },
        { slug: regex },
        { streams: { $in: [regex] } },
        { locations: { $in: [regex] } },
        { naac: regex },
        { accreditations: { $in: [regex] } }
      ];
    }

    const collection = db.get().collection('colleges');
    const totalCount = await collection.countDocuments(filterQuery);

    let query = collection.find(filterQuery).sort({ positions: 1 });
    if (!isAll) query = query.skip(skip).limit(limit);

    const colleges = await query.toArray();

    res.json({
      success: true,
      data: colleges,
      pagination: {
        current: isAll ? 1 : page,
        limit: isAll ? 'all' : limit,
        total: totalCount,
        totalPages: isAll ? 1 : Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('GET /colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colleges',
      error: error.message
    });
  }
});

// GET /api/admin/colleges/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const collection = db.get().collection('colleges');

    let college = null;

    if (ObjectId.isValid(identifier)) {
      college = await collection.findOne({ _id: new ObjectId(identifier) });
    }

    if (!college) {
      college = await collection.findOne({ slug: identifier });
    }

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
    console.error('GET /colleges/:identifier error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college',
      error: error.message
    });
  }
});

// POST /api/admin/colleges
router.post('/', uploadFields, async (req, res) => {
  try {
    const collection = db.get().collection('colleges');
    const payload = normalizeCollegePayload(req.body, req.files);

    if (!payload.name || !payload.slug) {
      return res.status(400).json({
        success: false,
        message: 'Name and slug are required'
      });
    }

    if (payload.positions < 1) {
      return res.status(400).json({
        success: false,
        message: 'Position must be at least 1'
      });
    }

    if (payload.fees.min > payload.fees.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum fee cannot be greater than maximum fee'
      });
    }

    const existingSlug = await collection.findOne({ slug: payload.slug });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    await updatePositions(db, payload.positions);
    const result = await collection.insertOne(payload);

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: { _id: result.insertedId, ...payload }
    });
  } catch (error) {
    console.error('POST /colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create college',
      error: error.message
    });
  }
});

// PUT /api/admin/colleges/:id
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const collection = db.get().collection('colleges');
    const currentCollege = await collection.findOne({ _id: new ObjectId(id) });

    if (!currentCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    console.log('--- PUT /admin/colleges/:id START ---');
    console.log('id:', id);
    console.log('req.body.image:', req.body.image);
    console.log('req.body.imageUrl:', req.body.imageUrl);
    console.log('req.body.removeImage:', req.body.removeImage);
    console.log('req.body.removeBrochure:', req.body.removeBrochure);
    console.log('req.body.removeFeeStructureDoc:', req.body.removeFeeStructureDoc);
    console.log('req.files?.image:', req.files?.image?.[0]?.filename || null);
    console.log('currentCollege.image:', currentCollege.image || '');
    console.log('currentCollege.brochure:', currentCollege.brochure || '');
    console.log('currentCollege.feeStructureDoc:', currentCollege.feeStructureDoc || '');

    const payload = normalizeCollegePayload(req.body, req.files, currentCollege);

    console.log('payload.image:', payload.image);
    console.log('payload.brochure:', payload.brochure);
    console.log('payload.feeStructureDoc:', payload.feeStructureDoc);

    if (!payload.name || !payload.slug) {
      return res.status(400).json({
        success: false,
        message: 'Name and slug are required'
      });
    }

    if (payload.positions < 1) {
      return res.status(400).json({
        success: false,
        message: 'Position must be at least 1'
      });
    }

    if (payload.fees.min > payload.fees.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum fee cannot be greater than maximum fee'
      });
    }

    const duplicateSlug = await collection.findOne({
      slug: payload.slug,
      _id: { $ne: new ObjectId(id) }
    });

    if (duplicateSlug) {
      return res.status(409).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    const currentPos = Number(currentCollege.positions) || 1;
    const newPos = Number(payload.positions) || 1;

    if (newPos !== currentPos) {
      await updatePositions(db, newPos, currentPos, new ObjectId(id));
    }

    const oldImage = currentCollege.image || '';
    const oldBrochure = currentCollege.brochure || '';
    const oldFeeStructureDoc = currentCollege.feeStructureDoc || '';

    if (req.files?.image?.[0] && oldImage && oldImage !== payload.image) {
      deleteLocalFile(oldImage);
    }

    if (req.files?.brochure?.[0] && oldBrochure && oldBrochure !== payload.brochure) {
      deleteLocalFile(oldBrochure);
    }

    if (
      req.files?.feeStructureDoc?.[0] &&
      oldFeeStructureDoc &&
      oldFeeStructureDoc !== payload.feeStructureDoc
    ) {
      deleteLocalFile(oldFeeStructureDoc);
    }

    if (String(req.body.removeImage || '') === 'true') {
      deleteLocalFile(oldImage);
    }

    if (String(req.body.removeBrochure || '') === 'true') {
      deleteLocalFile(oldBrochure);
    }

    if (String(req.body.removeFeeStructureDoc || '') === 'true') {
      deleteLocalFile(oldFeeStructureDoc);
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );

    const updatedCollege = await collection.findOne({ _id: new ObjectId(id) });

    console.log('updatedCollege.image:', updatedCollege?.image || '');
    console.log('updatedCollege.brochure:', updatedCollege?.brochure || '');
    console.log('updatedCollege.feeStructureDoc:', updatedCollege?.feeStructureDoc || '');
    console.log('--- PUT /admin/colleges/:id END ---');

    res.json({
      success: true,
      message: 'College updated successfully',
      data: updatedCollege
    });
  } catch (error) {
    console.error('PUT /colleges/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update college',
      error: error.message
    });
  }
});

// DELETE /api/admin/colleges/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college ID'
      });
    }

    const collection = db.get().collection('colleges');
    const collegeToDelete = await collection.findOne({ _id: new ObjectId(id) });

    if (!collegeToDelete) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    deleteLocalFile(collegeToDelete.image);
    deleteLocalFile(collegeToDelete.brochure);
    deleteLocalFile(collegeToDelete.feeStructureDoc);

    await collection.deleteOne({ _id: new ObjectId(id) });

    const deletedPos = Number(collegeToDelete.positions) || 1;

    await collection.updateMany(
      { positions: { $gt: deletedPos } },
      { $inc: { positions: -1 } }
    );

    res.json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /colleges/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete college',
      error: error.message
    });
  }
});

module.exports = router;