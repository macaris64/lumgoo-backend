import express from 'express';
const router = express.Router();

import * as registrationController from '../controllers/registration.controller';
import { validateLogin, validateRegistration, validateVerification } from '../middlewares/validation.middleware';

router.post('/register', validateRegistration, registrationController.register);
router.post('/login', validateLogin, registrationController.login);
router.post('/verifyToken', validateVerification, registrationController.verify);

export default router;
