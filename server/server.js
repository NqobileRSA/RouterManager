import express from 'express';

import { ENV_VARS } from './config/config_env.js';

import authRoutes from './routes/auth.routes.js';

const app = express();

const PORT = ENV_VARS.PORT;

// middleware
app.use(express.json());

// routes
app.use('/api/v1/auth', authRoutes);

// start app
app.listen(PORT, () => {
  console.info(`Listening Port : ${PORT}`);
});
