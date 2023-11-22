import { Request, Response, NextFunction } from 'express';

import {APIError} from "../utils/errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof APIError) {
    console.log('API Error: ', err);
    res.status(err.status).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
