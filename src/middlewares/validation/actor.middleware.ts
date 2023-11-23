import {NextFunction, Request, Response} from "express";
import {validatorObject} from "../../models/actor.model";
import {APIError} from "../../utils/errors";
import {getSlug} from "../../utils/functions";
import {validateParams} from "./validate.middleware";

export const validateCreateActor = (req: Request, res: Response, next: NextFunction) => {
    if (!validateParams(req.body, validatorObject)) {
        throw new APIError(422, 'Validation error');
    }

    try {
        const errors: string[] = [];
        const {name} = req.body;

        let {slug} = req.body;
        delete req.body.slug;
        req.body.slug = getSlug(name);
        if (!name) {
            errors.push('Name is required');
        }

        if (errors.length > 0) {
            throw new APIError(422, 'Validation error');
        }
    } catch (error) {
        next(error);
    }

    next();
}

export const validateUpdateActor = (req: Request, res: Response, next: NextFunction) => {
    delete req.body._id;
    delete req.body.slug;
    next();
}
