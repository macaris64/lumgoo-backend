import express from 'express';
const router = express.Router();

import * as genreController from '../controllers/genre.controller';
import {validateCreateGenre} from "../middlewares/validation/genre.middleware";

router.post('/genres', validateCreateGenre, genreController.createGenre);
router.get('/genres', genreController.getAllGenres);
router.get('/genres/:id', genreController.getGenreById);
router.delete('/genres/:id', genreController.deleteGenre);

export default router;
