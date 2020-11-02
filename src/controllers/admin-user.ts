import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { BadRequestError } from '../errors/bad-request-error';
import { AdminRespository } from '../repository/admin-repository';
import { Password } from '../services/password';
import { authType } from '../utils/format';
import { userJwt } from '../utils/jwt';

interface ISignup {
  email: string;
  password: string;
  name: string;
  type: string;
}

export const adminSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, type } = req.body as ISignup;
    const adminRepository = getCustomRepository(AdminRespository);
    const existingAdmin = await adminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new BadRequestError('이메일이 존재합니다.');
    }
    const hashed = await Password.toHash(password);
    const adminSignupType = authType(type);
    const adminRegister = await adminRepository.createAndSave(
      email,
      hashed,
      adminSignupType,
      name
    );
    const token = await userJwt(
      adminRegister.id,
      adminRegister.email,
      adminRegister.name
    );
    res.status(201).json({
      status: 201,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const adminSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as ISignup;
    const adminRepository = getCustomRepository(AdminRespository);
    const existingAdmin = await adminRepository.findByEmail(email);
    const errorMessage = '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.';
    if (!existingAdmin) {
      throw new BadRequestError(errorMessage);
    }
    const comparePassword = await Password.toCompare(
      password,
      existingAdmin.password
    );
    if (!comparePassword) {
      throw new BadRequestError(errorMessage);
    }
    const token = await userJwt(
      existingAdmin.id,
      existingAdmin.email,
      existingAdmin.name
    );
    res.status(200).json({
      status: 200,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const adminCurrent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: 200,
      data: {
        email: req.currentUser?.email,
        name: req.currentUser?.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { adminSignUp, adminSignIn };
