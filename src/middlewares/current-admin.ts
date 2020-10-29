import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CurrentAdminForbidden } from '../errors/current-admin-forbidden';

interface UserPayload {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw new CurrentAdminForbidden('권한이 없습니다.');
  }

  try {
    const payload = jwt.verify(
      req.headers.authorization,
      process.env.JWT_KEY || ''
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    throw new CurrentAdminForbidden('권한이 없습니다.');
  }

  next();
};
