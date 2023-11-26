import {NextFunction, Request, Response} from 'express';
import Genre from '../models/genre.model';
import {APIError} from "../utils/errors";
import {createOrUpdateGenre} from "../utils/db/genre";
import mongoose from "mongoose";


export const createGenre = async (req: Request, res: Response, next: NextFunction) => {
    let genre;
    try {
        genre = await createOrUpdateGenre(req.body);
    } catch (error) {
        next(error)
    }
    res.status(201).json(genre);
}

export const getAllGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const skipIndex = (page - 1) * limit;
        try {
            const actors = await Genre.find().limit(limit).skip(skipIndex);
            res.status(200).json(actors);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
}

export const getGenreById = async (req: Request, res: Response, next: NextFunction) => {
    let genre;
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        try {
            genre = await Genre.findById(req.params.id);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
        if (!genre) {
            throw new APIError(404, 'Genre not found');
        }
        res.status(200).json(genre);
    } catch (error) {
        next(error);
    }
}

export const deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        let genre = await Genre.findById(req.params.id);

        if (!genre) {
            throw new APIError(404, 'Genre not found');
        }

        try {
            genre.set({ isDeleted: true });
            genre.set({ deletedAt: Date.now() });
            await genre.save();
            res.status(204).json({});
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
