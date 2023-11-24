import {NextFunction, Request, Response} from 'express';
import {APIError} from "../../utils/errors";
import {validateEmail} from "./validate.middleware";
import {getSlug} from "../../utils/functions";
import {verifyToken} from "../../utils/jwt.utils";
import {TokenPayload} from "../../models/token.model";


const validateToken = (token: string | undefined) => {
    try {
        if (!token) {
            throw new APIError(401, 'Unauthorized')
        }
        const _token = token.split(' ');
        if (_token[0] !== 'Bearer') {
            throw new APIError(401, 'Unauthorized')
        }
        return verifyToken(_token[1])

    } catch (error) {
        throw error
    }
}

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors: string[] = [];
        const { username, email, password, passwordConfirmation } = req.body;

        if (!username) {
            errors.push('Username is required');
        }

        if (!email) {
            errors.push('Email is required');
        } else if (!validateEmail(email)) {
            errors.push('Invalid email format');
        }

        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        } else if (password !== passwordConfirmation) {
            errors.push('Passwords do not match');
        }
        if (errors.length > 0) {
            throw new APIError(422, 'Validation error');
        }
        req.body.slug = getSlug(username)
    } catch (error) {
        next(error);
    }

    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors: string[] = [];
        const { email, password } = req.body;

        if (!email) {
            errors.push('Email is required');
        } else if (!validateEmail(email)) {
            errors.push('Invalid email format');
        }

        if (!password) {
            errors.push('Password is required');
        }

        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        if (errors.length > 0) {
            throw new APIError(422, 'Validation error');
        }
    } catch (error) {
        next(error);
    }

    next();
}

export const validateVerification = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors: string[] = [];
        const { token } = req.body;

        if (!token) {
            errors.push('Token is required');
        }

        if (errors.length > 0) {
            throw new APIError(422, 'Validation error');
        }
    } catch (error) {
        next(error);
    }

    next();
}

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
    delete req.body._id;
    delete req.body.password;
    next();
}

export const validateMe = (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = validateToken(req.headers.authorization) as TokenPayload;
        req.body.userId = decodedToken.id;
    } catch (error) {
        next(error)
    }
    next()
}
