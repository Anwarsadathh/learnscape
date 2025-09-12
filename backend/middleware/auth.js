const verifyLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    res.redirect('/admin/');
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    res.redirect('/admin/');
  }
};

module.exports = {
  verifyLogin,
  verifyAdmin
};
