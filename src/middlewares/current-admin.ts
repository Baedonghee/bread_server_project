import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import { AdminUser } from './../entity/admin-user';
import { CurrentAdminForbidden } from '../errors/current-admin-forbidden';
import { AdminRepository } from '../repository/admin-repository';

const adminPublicKEY = fs.readFileSync(
  path.join(__dirname, '../config/admin_public.key'),
  'utf8'
);

interface AdminPayload {
  id: number;
  email: string;
  name: string;
  imageUrl: string;
}

declare global {
  namespace Express {
    interface Request {
      currentAdmin: AdminPayload;
      adminUser: AdminUser;
    }
  }
}

export const currentAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw new CurrentAdminForbidden('권한이 없습니다.');
  }

  try {
    const payload = jwt.verify(req.headers.authorization, adminPublicKEY, {
      algorithms: ['RS256'],
    }) as AdminPayload;
    const { id } = payload;
    const adminRepository = getCustomRepository(AdminRepository);
    const adminUser = await adminRepository.findById(id);
    if (!adminUser) {
      throw new CurrentAdminForbidden('권한이 없습니다.');
    }
    req.adminUser = adminUser;
    req.currentAdmin = payload;
  } catch (err) {
    throw new CurrentAdminForbidden('권한이 없습니다.');
  }

  next();
};
