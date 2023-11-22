import { Request, Response, NextFunction } from 'express';

import { generateToken, verifyToken } from '../utils/jwt.utils';
import User, {UserResponse} from "../models/user.model";
import {APIError} from "../utils/errors";

export const register = async (req: Request, res: Response) => {
    try {
        let user: UserResponse;
        let token: string;
        const _user = new User(req.body);
        const existingUser = await User.findOne({
          $or: [
            { email: req.body.email },
            { username: req.body.username }
          ]
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or username already in use' });
        }
        await _user.save();

        token = generateToken(_user._id);

        user = {
            id: (_user._id).toString(),
            username: _user.username,
            email: _user.email,
            fullname: _user.fullname,
        }

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user: UserResponse;
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

        user = {
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

export const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        try {
            verifyToken(token);
            res.send({ valid: true });
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}