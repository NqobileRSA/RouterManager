import express from 'express';
import session from 'express-session';
import { ENV_VARS } from './config/config_env.js';
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import { isAuthenticated } from './middleware/auth.middlware.js';

const app = express();
const PORT = ENV_VARS.PORT;

// middleware
app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/settings', isAuthenticated, settingsRoutes);

// start app
app.listen(PORT, () => {
  console.info(`Listening Port : ${PORT}`);
});
