import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { AdminUser } from './../entity/admin-user';
import { CurrentAdminForbidden } from '../errors/current-admin-forbidden';
import { AdminRepository } from '../repository/admin-repository';

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
      adminUser: AdminUser;
    }
  }
}

export const currentUser = async (
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
    const { id } = payload;
    const adminRepository = getCustomRepository(AdminRepository);
    const adminUser = await adminRepository.findById(id);
    if (!adminUser) {
      throw new CurrentAdminForbidden('권한이 없습니다.');
    }
    req.adminUser = adminUser;
    req.currentUser = payload;
  } catch (err) {
    throw new CurrentAdminForbidden('권한이 없습니다.');
  }

  next();
};
