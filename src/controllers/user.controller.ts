import { Request, Response } from 'express';
import User from '../models/user.model';
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(422).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};
