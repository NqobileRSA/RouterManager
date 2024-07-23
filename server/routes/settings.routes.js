import express from 'express';
import {
  changeLoginDetails,
  changeWifipassword,
} from '../controller/settings.controllers.js';

const router = express.Router();

router
  .post('/loginDetails', changeLoginDetails)
  .post('wifiPassword', changeWifipassword);

export default router;
