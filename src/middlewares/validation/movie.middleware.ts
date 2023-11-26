import {NextFunction, Request, Response} from "express";
import {validateParams} from "./validate.middleware";
import {validatorObject} from "../../models/movie.model";
import {APIError} from "../../utils/errors";

export const validateCreateMovie = (req: Request, res: Response, next: NextFunction) => {
    if (!validateParams(req.body, validatorObject)) {
        throw new APIError(422, 'Validation error');
    }

    try {
        const errors: string[] = [];
        const {title} = req.body;
        if (!title) {
            errors.push('Title is required');
        }
        if (errors.length > 0) {
            throw new APIError(422, 'Validation error');
        }
    } catch (error) {
        next(error);
    }

    next();
}

export const validateUpdateMovie = (req: Request, res: Response, next: NextFunction) => {
    delete req.body._id;
    delete req.body.slug;
    next();
}
