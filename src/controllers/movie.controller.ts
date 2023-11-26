import {NextFunction, Request, Response} from 'express';
import Movie, {IMovie} from '../models/movie.model';
import mongoose from "mongoose";
import {APIError} from "../utils/errors";
import {getMovieRecommendationsFromAI, getMultipleMoviesDataFromAI} from "../utils/openai";
import {transformMovieFilter, validateMovieFilterObject} from "../models/ai.model";
import {createOrUpdateMovie} from "../utils/db/movie";

export const createMovie = async (req: Request, res: Response, next: NextFunction) => {
    let movie;
    try {
        movie = await createOrUpdateMovie(req.body);
    } catch (error) {
        next(error)
    }
    res.status(201).json(movie);
}

export const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const skipIndex = (page - 1) * limit;
        try {
            const movies = await Movie.find().limit(limit).skip(skipIndex);
            res.status(200).json(movies);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
}

export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    let movie;
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        try {
            movie = await Movie.findById(req.params.id);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
        if (!movie) {
            throw new APIError(404, 'Movie not found');
        }
        res.status(200).json(movie);
    } catch (error) {
        next(error);
    }
}

export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let movie;
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        try {
            movie = await Movie.findByIdAndUpdate(req.params.id, req.body);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new APIError(422, 'Validation Error');
            } else
                throw new APIError(500, 'Internal Server Error');
        }
        if (!movie) {
            throw new APIError(404, 'Movie not found');
        }
        res.status(200).json(movie);
    } catch (error) {
        next(error);
    }
}

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        let movie = await Movie.findById(req.params.id);
        if (!movie) {
            throw new APIError(404, 'Movie not found');
        }
        try {
            movie.set({ isDeleted: true });
            movie.set({ deletedAt: new Date() });
            await movie.save();
            res.status(204).json();
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new APIError(422, 'Validation Error');
            } else if (error instanceof mongoose.Error) {
                throw new APIError(500, 'Internal Server Error');
            } else {
                throw new APIError(500, 'Internal Server Error');
            }
        }
    } catch (error) {
        next(error);
    }
}

export const getMovieRecommendationsFromOpenAI = async (req: Request, res: Response, next: NextFunction) => {
    /* Example filter object
        {
            "filter": {
                "name": ["interstellar", "tenet"],
                "genre": ["dark humor"],
                "actorName": [],
                "releaseDate": [],
                "director": [],
                "country": []
            }
        }
     */
    try {
        const filter = req.body.filter;
        validateMovieFilterObject(filter)
        const transformedFilter = transformMovieFilter(filter);
        const aiResponse = await getMovieRecommendationsFromAI(transformedFilter).catch(error => {
            next(error)
        });
        let movie;
        for (const title of Object.values(aiResponse)) {
            movie = {
                title: title,
            }
            try {
                await createOrUpdateMovie(movie)
            } catch (error) {
                next(error)
            }
        }
        res.status(200).json(aiResponse);
    } catch (error) {
        next(error);
    }
}

export const getMultipleMovieDataFromOpenAI = async (req: Request, res: Response, next: NextFunction) => {
    /*
        {
            "movieTitles": ["Interstellar"]
        }
     */
    try {
        const movieTitles = req.body.movieTitles as string[];
        if (!movieTitles) {
            throw new APIError(400, 'Movie titles array is required');
        }
        if (movieTitles.length === 0) {
            throw new APIError(400, 'Movie titles array is empty');
        }
        const aiResponse = await getMultipleMoviesDataFromAI(movieTitles).catch(error => {
            next(error)
        });
        let movie;

        aiResponse.data.map(async(_movie: any) => {
            movie = {
                title: _movie.name,
                genre: _movie.genre,
                imdbId: _movie.imdbId,
                releaseDate: _movie.year,
                imdbRating: _movie.imdbRating,
                director: _movie.director,
                plot: _movie.plot,
                runtime: _movie.runtime,
                country: _movie.country,
                musicBy: _movie.musicBy,
                streamingAvailability: _movie.platformAndLinks,
            }
            try {
                await createOrUpdateMovie(movie)
            } catch (error) {
                next(error)
            }
        })
        res.status(200).json(aiResponse);
    } catch (error) {
        next(error);
    }
}
