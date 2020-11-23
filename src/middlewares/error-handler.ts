import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.serializeErrors()[0].message || 'Something went wrong';
  res.status(status).send({
    status,
    message,
  });
};
