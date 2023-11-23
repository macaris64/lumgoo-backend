import {NextFunction, Request, Response} from 'express';
import Actor from '../models/actor.model';
import mongoose from "mongoose";
import {APIError} from "../utils/errors";

export const createActor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingActor = await Actor.findOne({
            $or: [
                { name: req.body.name },
                { slug: req.body.slug }
            ]
        });
        if (existingActor) {
            throw new APIError(409, 'Actor already exists');
        }
        let actor = new Actor(req.body);
        try {
            await actor.save();
            res.status(201).json(actor);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new APIError(422, 'Validation Error');
            } else if (error instanceof mongoose.Error) {
                throw new APIError(500, 'Internal Server Error');
            }
        }
    } catch (error) {
        next(error);
    }
}

export const getAllActors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const skipIndex = (page - 1) * limit;
        try {
            const actors = await Actor.find().limit(limit).skip(skipIndex);
            res.status(200).json(actors);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
}

export const getActorById = async (req: Request, res: Response, next: NextFunction) => {
    let actor;
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        try {
            actor = await Actor.findById(req.params.id);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
        if (!actor) {
            throw new APIError(404, 'Actor not found');
        }
        res.status(200).json(actor);
    } catch (error) {
        next(error);
    }
}

export const updateActor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        let actor = await Actor.findById(req.params.id);
        if (!actor) {
            throw new APIError(404, 'Actor not found');
        }
        try {
            actor.set(req.body);
            await actor.save();
            res.status(200).json(actor);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new APIError(422, 'Validation Error');
            } else if (error instanceof mongoose.Error) {
                throw new APIError(500, 'Internal Server Error');
            }
        }
    } catch (error) {
        next(error);
    }
}

export const deleteActor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            throw new APIError(400, 'ID is required');
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new APIError(422, 'Invalid ID');
        }
        let actor = await Actor.findById(req.params.id);
        if (!actor) {
            throw new APIError(404, 'Actor not found');
        }
        try {
            actor.set({ isDeleted: true });
            actor.set({ deletedAt: Date.now() });
            await actor.save();
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
        next(error)
    }
}
