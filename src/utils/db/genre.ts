import Genre from "../../models/genre.model";
import {APIError} from "../errors";
import {getSlug} from "../functions";
import mongoose from "mongoose";

export const createOrUpdateGenre = async (genreObject: any) => {
    if (!genreObject) {
        throw new Error('Genre object is required');
    }

    genreObject.slug = getSlug(genreObject.name);

    try {
        let existingGenre = await Genre.findOne(
            {
                $or: [
                    { name: genreObject.name },
                    { slug: genreObject.slug }
                ]
            });
        if (existingGenre) {
            genreObject.modifiedAt = Date.now();
            const updateData = {
                ...genreObject,
                name: undefined,
                slug: undefined,
                id: undefined,
            };
            existingGenre = await Genre.findByIdAndUpdate(existingGenre._id, updateData, {new: true});
            return existingGenre;
        } else {
            const newGenre = new Genre(genreObject);
            await newGenre.save();
            return newGenre
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new APIError(422, 'Validation Error');
        } else {
            throw new APIError(500, 'Internal Server Error');
        }
    }
}

export const getGenreByName = async (name: string) => {
    if (!name) {
        throw new Error('Genre name is required');
    }

    try {
         const genre = await Genre.findOne({name: name});
         if (!genre) {
             return await createOrUpdateGenre({name: name});
         }
    } catch (error) {
        throw new APIError(500, 'Internal Server Error');
    }
}

export const processGenresAI = async (genres: string[]) => {
    const genreIds = [];
    for (const genreName of genres) {
        try {
            const genre = await getGenreByName(genreName);
            if (genre) {
                genreIds.push(genre.id);
            } else {
                const newGenre = await createOrUpdateGenre({name: genreName});
                if (newGenre)
                    genreIds.push(newGenre.id);
            }
        } catch (error) {
            throw new APIError(500, `Error processing genre: ${genreName}, ${error}`);
        }
    }

    return genreIds;
}

