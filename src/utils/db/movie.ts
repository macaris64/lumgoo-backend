import Movie, {IMovie} from "../../models/movie.model";
import {getSlug} from "../functions";
import {APIError} from "../errors";
import mongoose from "mongoose";

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
        if (error instanceof mongoose.Error.ValidationError) {
            throw new APIError(422, 'Validation Error');
        } else {
            throw new APIError(500, 'Internal Server Error');
        }
    }
}
