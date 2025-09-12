const { body, validationResult } = require('express-validator');

const validateEnquiry = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid mobile number'),
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
];

const validateCollege = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('College name must be at least 2 characters long'),
  body('streams')
    .isArray({ min: 1 })
    .withMessage('At least one stream must be selected'),
  body('locations')
    .isArray({ min: 1 })
    .withMessage('At least one location must be provided'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    req.flash('error_msg', errors.array()[0].msg);
    return res.redirect('back');
  }
  next();
};

module.exports = {
  validateEnquiry,
  validateCollege,
  handleValidationErrors
};
