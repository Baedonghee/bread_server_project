import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { BadRequestError } from '../errors/bad-request-error';
import { CurrentAdminForbidden } from '../errors/current-admin-forbidden';
import { ValidateFileError } from '../errors/validate-file-error';
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

export const adminDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentUser;
    const adminRespository = getCustomRepository(AdminRespository);
    const adminUser = await adminRespository.findById(id);
    if (!adminUser) {
      throw new CurrentAdminForbidden('권한이 없습니다.');
    }
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
    let imageUrl = '';
    const { id } = req.currentUser;
    const { password, name } = req.body as ISignup;
    if (req.file) {
      const { location }: any = req.file;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      imageUrl = location;
    }
    if (!(password || name || imageUrl)) {
      throw new ValidateFileError('변경 항목을 보내주세요.');
    }
    const updateProfile = {} as {
      password: string;
      name: string;
      imageUrl: string;
    };
    if (password) {
      const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/;
      if (!(password.length > 7 && password.length < 21)) {
        throw new ValidateFileError('비밀번호는 8~20자로 입력해주세요.');
      } else if (!passwordReg.test(password)) {
        throw new ValidateFileError('비밀번호 조합을 맞춰주세요.');
      } else {
        const hashed = await Password.toHash(password);
        updateProfile.password = hashed;
      }
    }
    if (name) {
      updateProfile.name = name;
    }
    if (imageUrl) {
      updateProfile.imageUrl = imageUrl;
    }
    const adminRespository = getCustomRepository(AdminRespository);
    await adminRespository.updateAndProfile(Number(id), updateProfile);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export default { adminSignUp, adminSignIn };
