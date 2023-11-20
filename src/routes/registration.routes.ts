import express from 'express';
const router = express.Router();

import * as registrationController from '../controllers/registration.controller';
import { validateLogin, validateRegistration } from '../middlewares/validation.middleware';

router.post('/register', validateRegistration, registrationController.register);
router.post('/login', validateLogin, registrationController.login);

export default router;
