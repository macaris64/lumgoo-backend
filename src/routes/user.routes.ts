import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller';
import {validateRegistration, validateUpdateUser} from "../middlewares/validation/user.middleware";

router.post('/users', validateRegistration, userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', validateUpdateUser, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
