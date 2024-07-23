import express from 'express';
import {
  getBlockedDevices,
  getConnectedDevices,
} from '../controller/devices.controllers.js';

const router = express.Router();

router
  .get('/connected', getConnectedDevices)
  .get('/blocked', getBlockedDevices);

export default router;
