import { Request, Response, NextFunction } from 'express';
import {APIError} from "../../utils/errors";
import {validateEmail} from "./validate.middleware";

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
