import Movie from "../../models/movie.model";
import {getSlug} from "../functions";
import {APIError} from "../errors";
import mongoose from "mongoose";
import {processActorsAI} from "./actor";
import {processGenresAI} from "./genre";

export const createOrUpdateMovie = async (movieObject: any) => {
    if (!movieObject) {
        throw new Error('Movie object is required');
    }

    movieObject.slug = getSlug(movieObject.title);

    try {
        let existingMovie = await Movie.findOne(
            {
                $or: [
                    { title: movieObject.title },
                    { slug: movieObject.slug }
                ]
            });
        if (existingMovie) {
            movieObject.modifiedAt = Date.now();
            const updateData = {
                ...movieObject,
                title: undefined,
                slug: undefined,
                id: undefined,
            };
            existingMovie = await Movie.findByIdAndUpdate(existingMovie._id, updateData, {new: true});
            return existingMovie;
        } else {
            const newMovie = new Movie(movieObject);
            await newMovie.save();
            return newMovie
        }
    } catch (error) {
        console.log(error)
        if (error instanceof mongoose.Error.ValidationError) {
            throw new APIError(422, 'Validation Error');
        } else {
            throw new APIError(500, 'Internal Server Error');
        }
    }
}

export const processMovieAI = async (_movie: any) => {
    const movie = {
        title: _movie.name,
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
        const createdOrUpdatedMovie = await createOrUpdateMovie(movie);
        if (!createdOrUpdatedMovie) {
            throw new Error(`Failed to create or update movie: ${_movie.name}`);
        }

        const actorLinks = await processActorsAI(_movie.actors);
        if (createdOrUpdatedMovie.actors && actorLinks.length > createdOrUpdatedMovie.actors.length)
            await updateMovieWithActors(createdOrUpdatedMovie, actorLinks);

        const genreIds = await processGenresAI(_movie.genre);
        if (createdOrUpdatedMovie.genre && genreIds.length > createdOrUpdatedMovie.genre.length)
            await updateMovieWithGenres(createdOrUpdatedMovie, genreIds)
    } catch (error) {
        // Proper error handling
        console.error(error);
        // If you are within an Express middleware, you can call next(error) here
    }
}

const updateMovieWithActors = async (movie: any, actorLinks: any) => {
    const movieActors = actorLinks.map((actorLink: any) => {
        return {
            actorId: actorLink.actor_id,
            characterName: actorLink.character,
        }
    });
    movie.actors = movieActors;
    await movie.save();
}

const updateMovieWithGenres = async (movie: any, genreIds: any) => {
    movie.genre = genreIds;
    await movie.save();
}
