import { Request, Response, NextFunction } from 'express';
import {APIError} from "../utils/errors";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  try {
    if (!apiKey) {
      throw new APIError(501, 'Unauthorized: Invalid API key');
    }
    if (apiKey && apiKey !== process.env.API_KEY) {
      throw new APIError(501, 'Unauthorized: Invalid API key');
    }
    next();
  } catch (error) {
    next(error);
  }
};
