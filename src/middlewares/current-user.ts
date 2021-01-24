import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';

import { User } from './../entity/user';
import { UserRepository } from '../repository/user-repository';
import { CurrentUserForbidden } from '../errors/current-user-forbidden';

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
      user: User;
    }
  }
}

export const currentUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw new CurrentUserForbidden('권한이 없습니다.');
  }

  try {
    const payload = jwt.verify(req.headers.authorization, userPublicKEY, {
      algorithms: ['RS256'],
    }) as UserPayload;
    const { id } = payload;
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findById(id);
    if (!user) {
      throw new CurrentUserForbidden('권한이 없습니다.');
    }
    req.user = user;
    req.currentUser = payload;
  } catch (err) {
    throw new CurrentUserForbidden('권한이 없습니다.');
  }

  next();
};
