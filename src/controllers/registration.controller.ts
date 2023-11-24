import { Request, Response, NextFunction } from 'express';

import { generateToken, verifyToken } from '../utils/jwt.utils';
import User, {UserResponse} from "../models/user.model";
import {APIError} from "../utils/errors";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string;
        const _user = new User(req.body);
        const existingUser = await User.findOne({
          $or: [
            { email: req.body.email },
            { username: req.body.username }
          ]
        });
        if (existingUser) {
            throw new APIError(409, 'Email or username already in use')
        }
        try {
            await _user.save();
        } catch (error) {
            throw new APIError(500, 'Internal Server Error')
        }

        try {
            token = generateToken(_user._id);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error')
        }

        const user: UserResponse = {
            id: (_user._id).toString(),
            username: _user.username,
            email: _user.email,
            fullname: _user.fullname,
        }

        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string;

        const { email, password } = req.body;
        const _user = await User.findOne({ email });

        if (!_user || !(await _user.comparePassword(password))) {
            throw new APIError(401, 'Invalid credentials')
        }

        try {
            token = generateToken(_user._id);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error')
        }

        const user: UserResponse = {
            id: (_user._id).toString(),
            username: _user.username,
            email: _user.email,
            fullname: _user.fullname,
        }

        res.json({ user, token });
    } catch (error) {
        next(error);
    }
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        try {
            verifyToken(token);
            res.send({ valid: true });
        }
        catch (error) {
            throw new APIError(401, 'Invalid token')
        }
    } catch (error) {
        next(error);
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        let _user;
        try {
            _user = await User.findOne({ _id: userId });
            if (!_user) {
                throw new APIError(404, 'User not found')
            }
        } catch (error) {
            throw new APIError(500, 'Internal Server Error')
        }

        const user: UserResponse = {
            id: userId,
            username: _user.username,
            email: _user.email,
            fullname: _user.fullname,
        }

        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
}
