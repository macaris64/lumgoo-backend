import express from 'express';
const router = express.Router();

import * as registrationController from '../controllers/registration.controller';
import {
    validateLogin,
    validateMe,
    validateRegistration,
    validateVerification
} from '../middlewares/validation/user.middleware';

router.post('/register', validateRegistration, registrationController.register);
router.post('/login', validateLogin, registrationController.login);
router.post('/verifyToken', validateVerification, registrationController.verify);
router.get('/me', validateMe, registrationController.me);

export default router;
