import { Request, Response } from 'express';

import { generateToken } from '../utils/jwt.utils';
import User from "../models/user.model";

export const register = async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        console.log(req.body)
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
