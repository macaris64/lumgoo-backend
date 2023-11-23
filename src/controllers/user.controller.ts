import {NextFunction, Request, Response} from 'express';
import User from '../models/user.model';
import { MongoServerError } from 'mongodb';
import mongoose from "mongoose";
import {APIError} from "../utils/errors";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const username = req.body.username;
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
        if (existingUser) {
            throw new APIError(409, 'Email or username already in use');
        }
        try {
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new APIError(422, 'Validation Error');
            }else {
                throw new APIError(500, 'Internal Server Error');
            }
        }
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const skipIndex = (page - 1) * limit;
        try {
            const users = await User.find().limit(limit).skip(skipIndex);
            res.status(200).json(users);
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            throw new APIError(422, 'Invalid ID')
        if(!req.params.id)
            throw new APIError(400, 'ID is required')

        const user = await User.findById(req.params.id);
        if (!user)
            throw new APIError(404, 'User not found')

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            throw new APIError(422, 'Invalid ID')
        if(!req.params.id)
            throw new APIError(400, 'ID is required')

        req.body.modifiedAt = Date.now();
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!user)
            throw new APIError(404, 'User not found')

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            throw new APIError(422, 'Invalid ID')
        if(!req.params.id)
            throw new APIError(400, 'ID is required')

        const user = await User.findById(req.params.id);
        if (!user)
            throw new APIError(404, 'User not found')
        try {
            user.set({deletedAt: Date.now()});
            user.set({isDeleted: true});
            await user.save();
            res.status(204).json({});
        } catch (error) {
            throw new APIError(500, 'Internal Server Error');
        }
    } catch (error) {
        next(error);
    }
};
