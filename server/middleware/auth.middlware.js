// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export { isAuthenticated };
