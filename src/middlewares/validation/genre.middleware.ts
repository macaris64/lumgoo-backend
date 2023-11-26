import {NextFunction, Request, Response} from "express";
import {validateParams} from "./validate.middleware";
import {validatorObject} from "../../models/genre.model";
import {APIError} from "../../utils/errors";

export const validateCreateGenre = (req: Request, res: Response, next: NextFunction) => {
    if (!validateParams(req.body, validatorObject)) {
        throw new APIError(422, 'Validation error');
    }
    next();
}
