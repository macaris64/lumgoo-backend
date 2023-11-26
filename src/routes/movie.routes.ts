import express from 'express';
const router = express.Router();

import * as movieController from '../controllers/movie.controller';
import {validateCreateMovie, validateUpdateMovie} from "../middlewares/validation/movie.middleware";

router.post('/movies', validateCreateMovie, movieController.createMovie);
router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.put('/movies/:id', validateUpdateMovie, movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);

router.post('/ai/movie-recommendations', movieController.getMovieRecommendationsFromOpenAI);
router.post('/ai/movies-data', movieController.getMultipleMovieDataFromOpenAI);

router.get('/movie-search', movieController.searchMovie);

export default router;
