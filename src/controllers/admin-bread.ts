import { getCustomRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { linkReg } from '../utils/format';
import { BreadRepository } from '../repository/bread-repository';
import { BreadImageRepository } from '../repository/bread-image-repository';
import { GoneRequestError } from '../errors/gone-request.error';

interface IBreadCreate {
  title: string;
  content: string;
  imageUrl: string[];
}

export const breadList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadRepository = getCustomRepository(BreadRepository);
    const breadArray = await breadRepository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: breadArray,
    });
  } catch (err) {
    next(err);
  }
};

export const breadCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const { title, content, imageUrl } = req.body as IBreadCreate;
    imageUrl.forEach((image) => {
      if (!linkReg(image)) {
        throw new BadRequestError('빵 이미지 형식을 맞춰주세요.');
      }
    });
    const breadRepository = getCustomRepository(BreadRepository);
    const breadData = await breadRepository.createAndSave(
      title,
      content,
      adminUser
    );
    for (let i = 0; i < imageUrl.length; i++) {
      const breadImageRepository = getCustomRepository(BreadImageRepository);
      await breadImageRepository.createAndSave(imageUrl[i], breadData);
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const { breadId } = req.params;
    const { title, content, imageUrl } = req.body as IBreadCreate;
    const breadRepository = getCustomRepository(BreadRepository);
    const breadData = await breadRepository.findByIdCheck(Number(breadId));
    if (!breadData) {
      throw new GoneRequestError('빵 정보가 존재하지 않습니다.');
    }
    const { images } = breadData;
    const newBreadImageArray = [] as string[];
    const deleteBreadImageArray = [] as number[];
    if (imageUrl.length) {
      imageUrl.forEach((newBreadImage) => {
        const checkImage = images.some(
          (breadImage) => breadImage.imageUrl === newBreadImage
        );
        if (!checkImage) {
          newBreadImageArray.push(newBreadImage);
        }
      });
      images.forEach((deleteBreadImage) => {
        const checkImage = imageUrl.some(
          (breadImage) => breadImage === deleteBreadImage.imageUrl
        );
        if (!checkImage) {
          deleteBreadImageArray.push(deleteBreadImage.id);
        }
      });
    }
    await breadRepository.updateAndSave(
      Number(breadId),
      title,
      content,
      adminUser
    );
    const breadImageRepository = getCustomRepository(BreadImageRepository);
    for (let i = 0; i < newBreadImageArray.length; i++) {
      await breadImageRepository.createAndSave(
        newBreadImageArray[i],
        breadData
      );
    }
    if (deleteBreadImageArray.length) {
      await breadImageRepository.deleteById(deleteBreadImageArray);
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadId } = req.params;
    const breadRepository = getCustomRepository(BreadRepository);
    const breadInfo = await breadRepository.findById(Number(breadId));
    if (!breadInfo) {
      throw new GoneRequestError('존재하지 않는 빵입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: breadInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const breadDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadId } = req.params;
    const breadRepository = getCustomRepository(BreadRepository);
    const breadInfo = await breadRepository.findByIdCheck(Number(breadId));
    if (!breadInfo) {
      throw new GoneRequestError('존재하지 않는 빵입니다.');
    }
    await breadRepository.deleteById(Number(breadId));
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
