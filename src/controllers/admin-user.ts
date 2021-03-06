import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { BadRequestError } from '../errors/bad-request-error';
import { CurrentAdminForbidden } from '../errors/current-admin-forbidden';
import { AdminRepository } from '../repository/admin-repository';
import { Password } from '../services/password';
import { authType } from '../utils/format';
import { adminJwt } from '../utils/jwt';

interface ISignup {
  email: string;
  password: string;
  name: string;
  type: string;
  imageUrl: string;
}

export const adminSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, type } = req.body as ISignup;
    const adminRepository = getCustomRepository(AdminRepository);
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
    const token = await adminJwt(
      adminRegister.id,
      adminRegister.email,
      adminRegister.name,
      adminRegister.imageUrl
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
    const adminRepository = getCustomRepository(AdminRepository);
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
    if (!existingAdmin.enabled) {
      throw new BadRequestError('탈퇴된 회원입니다.');
    }
    const token = await adminJwt(
      existingAdmin.id,
      existingAdmin.email,
      existingAdmin.name,
      existingAdmin.imageUrl
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
        email: req.currentAdmin?.email,
        name: req.currentAdmin?.name,
        imageUrl: req.currentAdmin?.imageUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const adminDetail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    res.status(200).json({
      status: 200,
      message: 'success',
      data: adminUser,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentAdmin;
    const { password, name, imageUrl } = req.body as ISignup;
    const updateProfile = {} as {
      password: string;
      name: string;
      imageUrl: string;
    };
    const hashed = await Password.toHash(password);
    updateProfile.password = hashed;
    updateProfile.name = name;
    updateProfile.imageUrl =
      imageUrl ||
      'https://s3.ap-northeast-2.amazonaws.com/image.mercuryeunoia.com/images/user/default_image.jpeg';
    const adminRepository = getCustomRepository(AdminRepository);
    await adminRepository.updateAndProfile(Number(id), updateProfile);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const adminSecession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentAdmin;
    const adminRepository = getCustomRepository(AdminRepository);
    const adminUser = await adminRepository.updateAndEnabled(id);
    if (!adminUser.raw.changedRows) {
      throw new CurrentAdminForbidden('이미 탈퇴된 회원입니다.');
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const adminLogout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export default { adminSignUp, adminSignIn };
