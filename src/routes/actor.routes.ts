import express from 'express';
const router = express.Router();

import * as actorController from '../controllers/actor.controller';
import {validateCreateActor, validateUpdateActor} from "../middlewares/validation/actor.middleware";

router.post('/actors', validateCreateActor, actorController.createActor);
router.get('/actors', actorController.getAllActors);
router.get('/actors/:id', actorController.getActorById);
router.put('/actors/:id', validateUpdateActor, actorController.updateActor);
router.delete('/actors/:id', actorController.deleteActor);

export default router;
