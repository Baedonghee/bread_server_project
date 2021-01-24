import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { BadRequestError } from '../errors/bad-request-error';
import { CurrentUserForbidden } from '../errors/current-user-forbidden';
import { UserRepository } from '../repository/user-repository';
import { Password } from '../services/password';
import { authType } from '../utils/format';
import { userJwt } from '../utils/jwt';

interface ISignup {
  email: string;
  password: string;
  name: string;
  imageUrl?: string;
  gender?: boolean;
  age?: number;
  type: string;
}

export const userSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      password,
      name,
      imageUrl,
      gender,
      age,
      type,
    } = req.body as ISignup;
    const userRepository = getCustomRepository(UserRepository);
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('이메일이 존재합니다.');
    }
    const hashed = await Password.toHash(password);
    const userRegister = await userRepository.createAndSave(
      email,
      hashed,
      name,
      imageUrl,
      gender ?? null,
      age ?? null,
      authType(type)
    );
    const token = await userJwt(
      userRegister.id,
      userRegister.email,
      userRegister.name,
      userRegister.imageUrl
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

export const userSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as ISignup;
    const userRepository = getCustomRepository(UserRepository);
    const existingUser = await userRepository.findByEmail(email);
    const errorMessage = '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.';
    if (!existingUser) {
      throw new BadRequestError(errorMessage);
    }
    const comparePassword = await Password.toCompare(
      password,
      existingUser.password
    );
    if (!comparePassword) {
      throw new BadRequestError(errorMessage);
    }
    if (!existingUser.enabled) {
      throw new BadRequestError('탈퇴된 회원입니다.');
    }
    const token = await userJwt(
      existingUser.id,
      existingUser.email,
      existingUser.name,
      existingUser.imageUrl
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

export const userCurrent = (
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
        imageUrl: req.currentUser?.imageUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const userDetail = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    res.status(200).json({
      status: 200,
      message: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const userUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentUser;
    const { password, name, imageUrl, gender, age } = req.body as ISignup;
    const updateProfile = {} as {
      password: string;
      name: string;
      imageUrl: string;
      gender?: boolean | null;
      age?: number | null;
    };
    const hashed = await Password.toHash(password);
    updateProfile.password = hashed;
    updateProfile.name = name;
    updateProfile.imageUrl =
      imageUrl ||
      'https://s3.ap-northeast-2.amazonaws.com/image.mercuryeunoia.com/images/user/default_image.jpeg';
    updateProfile.gender = gender ?? null;
    updateProfile.age = age ?? null;
    const userRepository = getCustomRepository(UserRepository);
    await userRepository.updateAndProfile(Number(id), updateProfile);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const userSecession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentUser;
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.updateAndEnabled(id);
    if (!user.raw.changedRows) {
      throw new CurrentUserForbidden('이미 탈퇴된 회원입니다.');
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const userLogout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
