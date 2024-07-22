import express from 'express';
import session from 'express-session';
import { logIn, logOut } from '../controller/auth.controllers.js';

const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 3600000 },
  })
);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Add routes
router.post('/login', logIn);
router.post('/logout', isAuthenticated, logOut);

export default router;
