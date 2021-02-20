import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { kakaoLogin } from '../services/kakao';
import { googleLogin } from '../services/google';
import { facebookLogin } from '../services/facebook';
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

export const userSocialSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, type } = req.body as { token: string; type: string };
    const userRepository = getCustomRepository(UserRepository);
    if (type === 'kakao') {
      const kakaoData = (await kakaoLogin(token)) as {
        email: string;
        name: string;
        imageUrl?: string;
      };
      const existingUser = await userRepository.findByEmail(kakaoData.email);
      if (existingUser) {
        if (existingUser.type !== authType(type)) {
          throw new BadRequestError('다른 소셜이 존재합니다.');
        }
        const token = await userJwt(
          existingUser.id,
          existingUser.email,
          existingUser.name,
          existingUser.imageUrl
        );
        res.status(201).json({
          status: 201,
          data: {
            token,
          },
        });
      } else {
        const userRegister = await userRepository.createAndSave(
          kakaoData.email,
          '',
          kakaoData.name,
          kakaoData.imageUrl,
          null,
          null,
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
      }
    } else if (type === 'google') {
      const data = (await googleLogin(token)) as {
        name: string;
        picture: string;
        email: string;
      };
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        if (existingUser.type !== authType(type)) {
          throw new BadRequestError('다른 소셜이 존재합니다.');
        }
        const token = await userJwt(
          existingUser.id,
          existingUser.email,
          existingUser.name,
          existingUser.imageUrl
        );
        res.status(201).json({
          status: 201,
          data: {
            token,
          },
        });
      } else {
        const userRegister = await userRepository.createAndSave(
          data.email,
          '',
          data.name,
          data.picture,
          null,
          null,
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
      }
    } else if (type === 'facebook') {
      const data = (await facebookLogin(token)) as {
        name: string;
        email: string;
        picture: string;
      };
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        if (existingUser.type !== authType(type)) {
          throw new BadRequestError('다른 소셜이 존재합니다.');
        }
        const token = await userJwt(
          existingUser.id,
          existingUser.email,
          existingUser.name,
          existingUser.imageUrl
        );
        res.status(201).json({
          status: 201,
          data: {
            token,
          },
        });
      } else {
        const userRegister = await userRepository.createAndSave(
          data.email,
          '',
          data.name,
          data.picture,
          null,
          null,
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
      }
    } else {
      throw new BadRequestError('type이 올바르지 않습니다.');
    }
  } catch (err) {
    next(err);
  }
};

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
    if (existingUser.type !== 0) {
      throw new BadRequestError('소셜 로그인 계정이 있습니다.');
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

export const userCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const existingUser = await userRepository.findById(req.user.id);
    if (!existingUser) {
      throw new BadRequestError(
        '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.'
      );
    }
    res.status(200).json({
      status: 200,
      data: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        imageUrl: existingUser.imageUrl,
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
