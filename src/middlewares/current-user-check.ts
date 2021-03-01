import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';

import { User } from './../entity/user';
import { UserRepository } from '../repository/user-repository';

const userPublicKEY = fs.readFileSync(
  path.join(__dirname, '../config/user_public.key'),
  'utf8'
);

interface UserPayload {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload;
      userAndNon: User | null;
    }
  }
}

export const currentCheckUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const payload = jwt.verify(req.headers.authorization, userPublicKEY, {
        algorithms: ['RS256'],
      }) as UserPayload;
      const { id } = payload;
      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.findById(id);
      req.userAndNon = user || null;
      req.currentUser = payload;
    } else {
      req.userAndNon = null;
    }
  } catch (err) {
    req.userAndNon = null;
  }

  next();
};
