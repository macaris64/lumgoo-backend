import {NextFunction, Request, Response} from 'express';
import Movie, {IMovie} from '../models/movie.model';
import mongoose from "mongoose";
import {APIError} from "../utils/errors";
import {getMovieRecommendationsFromAI, getMultipleMoviesDataFromAI} from "../utils/openai";
import {transformMovieFilter, validateMovieFilterObject} from "../models/ai.model";
import {createOrUpdateMovie, processMovieAI} from "../utils/db/movie";
import TmdbApi from "../utils/themovieapi";
import {getSlug} from "../utils/functions";
import {getGenreByName, getGenreByTmdbId} from "../utils/db/genre";
import {createOrUpdateActor} from "../utils/db/actor";

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
        const slim = req.body.slim;
        let filter = req.body.filter;
        if (!slim) {
            validateMovieFilterObject(filter)
            filter = transformMovieFilter(filter);
        }
        const aiResponse = await getMovieRecommendationsFromAI(filter, slim).catch(error => {
            next(error)
        });
        if (!aiResponse) {
            throw new APIError(404, 'No movies found');
        }
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

        const processAiResponse = async (aiResponse: any) => {
            try {
                if (!aiResponse || !aiResponse.data || aiResponse.data.length === 0) {
                    throw new APIError(404, 'No movies found');
                }
                await Promise.all(aiResponse.data.map(processMovieAI))
            } catch (error) {
                next(error)
            }
        }
        await processAiResponse(aiResponse)

        res.status(200).json(aiResponse);
    } catch (error) {
        next(error);
    }
}

export const searchMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            keyword,
            genreId,
            actorId
        } = req.query;

        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const skipIndex = (page - 1) * limit;
        const searchQuery: any = {};
        if (keyword) {
            searchQuery['title'] = { $regex: new RegExp(keyword as string, 'i') };
        }
        if (genreId) {
            const genreIdArray = Array.isArray(genreId) ? genreId : [genreId];
            searchQuery['genre'] = { $in: genreIdArray };
        }
        if (actorId) {
            const actorIdArray = Array.isArray(actorId) ? actorId : [actorId];
            searchQuery['actors.actorId'] = { $in: actorIdArray };
        }
        try {
            const movies = await Movie.find(searchQuery).limit(limit).skip(skipIndex);
            if (!movies || movies.length === 0) {
                throw new APIError(404, 'No movies found');
            }
            res.status(200).json(movies);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
}

export const getNowPlayingMovies = async (req: Request, res: Response, next: NextFunction) => {
    const toISOString = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString();
    }
    const movieApi = new TmdbApi();
    try {
        const ping = await movieApi.getNowPlayingMovies("1");
        const totalPages = ping.total_pages;
        for (let i = 1; i <= totalPages; i++) {
            const nowPlayingApiResponse = await movieApi.getNowPlayingMovies(i.toString());
            if (nowPlayingApiResponse.results && nowPlayingApiResponse.results.length > 0) {
                nowPlayingApiResponse.results.map(async (_movie: any) => {
                    let movie: any = {};
                    let genres: any = [];
                    movie = {
                        title: _movie.title,
                        tmdbId: _movie.id.toString(),
                        actors: [],
                        genre: [],
                        director: [],
                        musicBy: [],
                        plot: _movie.overview,
                        releaseDate: _movie.release_date ? toISOString(_movie.release_date) : null,
                    }
                    const movieByIdApiResponse = await movieApi.getMovieById(movie.tmdbId);
                    if (movieByIdApiResponse) {
                        movie = {
                            ...movie,
                            imdbId: movieByIdApiResponse.imdb_id,
                            runtime: movieByIdApiResponse.runtime?.toString(),
                            country: movieByIdApiResponse.production_countries.map((country: any) => country.name),
                            language: movieByIdApiResponse.spoken_languages.map((language: any) => language.name),
                            budget: movieByIdApiResponse.budget,
                            boxOffice: movieByIdApiResponse.revenue,
                            productionCompanies: movieByIdApiResponse.production_companies.map((company: any) => company.name),
                            officialWebsite: movieByIdApiResponse.homepage,
                        }
                        genres = movieByIdApiResponse.genres.map((genre: any) => genre.id);
                        for (const _genre of genres) {
                            const genre = await getGenreByTmdbId(_genre);
                            movie.genre.push(genre?._id.toString());
                        }
                    }
                    const movieCreditsApiResponse = await movieApi.getMovieCreditsById(movie.tmdbId);
                    if (movieCreditsApiResponse) {
                        for (const crew of movieCreditsApiResponse.crew) {
                            if (crew.job == 'Director' || crew.job == "Co-director") {
                                movie.director.push(crew.name);
                            }
                            if (crew.job == 'Music' || crew.job == "Original Music Composer") {
                                movie.musicBy.push(crew.name);
                            }
                        }
                        for (const cast of movieCreditsApiResponse.cast) {
                            const moviePersonApiResponse = await movieApi.getPersonById(cast.id);
                            if (moviePersonApiResponse) {
                                const actorObject = {
                                    name: moviePersonApiResponse.name,
                                    tmdbId: moviePersonApiResponse.id,
                                    imdbId: moviePersonApiResponse.imdb_id,
                                    birthday: new Date(moviePersonApiResponse.birthday),
                                    country: [moviePersonApiResponse.place_of_birth],
                                    bio: moviePersonApiResponse.biography,
                                    gender: moviePersonApiResponse.gender == 2 ? 'Male' : 'Female',
                                    deathday: moviePersonApiResponse.deathday ? new Date(moviePersonApiResponse.deathday) : null
                                }
                                const actor = await createOrUpdateActor(actorObject);
                                if (actor && actor._id) {
                                    movie.actors.push({
                                        actorId: actor?._id.toString(),
                                        character: cast.character
                                    });
                                }
                            }
                        }
                    }
                    try {
                        console.log('page ' + i +  ' :' + movie.title);
                        await createOrUpdateMovie(movie);
                        return;
                    } catch (error) {
                        next(error);
                    }
                })
            }
        }
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
}
