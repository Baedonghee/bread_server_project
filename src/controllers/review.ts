import { BreadShopReviewResult } from './../result/review/review';
import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { BadRequestError } from '../errors/bad-request-error';
import { GoneRequestError } from '../errors/gone-request.error';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { BreadShopReviewImageRepository } from '../repository/bread-shop-review-image-repository';
import { BreadShopReviewRepository } from '../repository/bread-shop-review-repository';
import { linkReg } from '../utils/format';

interface IReview {
  content: string;
  imageUrl: string[];
}

export const breadShopReviewList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const breadShopReviewRepository = getCustomRepository(
      BreadShopReviewRepository
    );
    const breadShopReviewList = await breadShopReviewRepository.list(
      Number(breadShopId)
    );
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const list: unknown[] = [] as BreadShopReviewResult | any;
    breadShopReviewList.forEach((breadShopReviewData) => {
      const breadMakeResult = new BreadShopReviewResult(breadShopReviewData);
      list.push(breadMakeResult);
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopReviewCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const { content, imageUrl } = req.body as IReview;
    imageUrl.forEach((images) => {
      if (!linkReg(images)) {
        throw new BadRequestError('리뷰 이미지 형식을 맞춰주세요.');
      }
    });
    const breadShopReviewRepository = getCustomRepository(
      BreadShopReviewRepository
    );
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopReviewImageRepository = getCustomRepository(
      BreadShopReviewImageRepository
    );
    const breadShopData = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopData) {
      throw new GoneRequestError('빵집 정보가 존재하지 않습니다.');
    }
    const breadShopReviewData = await breadShopReviewRepository.createAndSave(
      content,
      req.user,
      breadShopData
    );
    for (let i = 0; i < imageUrl.length; i++) {
      await breadShopReviewImageRepository.createAndSave(
        imageUrl[i],
        breadShopReviewData
      );
    }
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: breadShopReviewData.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopReviewUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId, reviewId } = req.params;
    const { content, imageUrl } = req.body as IReview;
    imageUrl.forEach((images) => {
      if (!linkReg(images)) {
        throw new BadRequestError('리뷰 이미지 형식을 맞춰주세요.');
      }
    });
    const breadShopReviewRepository = getCustomRepository(
      BreadShopReviewRepository
    );
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopReviewImageRepository = getCustomRepository(
      BreadShopReviewImageRepository
    );
    const breadShopData = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopData) {
      throw new GoneRequestError('빵집 정보가 존재하지 않습니다.');
    }
    const breadShopReviewData = await breadShopReviewRepository.findById(
      Number(reviewId)
    );
    if (!breadShopReviewData) {
      throw new GoneRequestError('리뷰 정보가 존재하지 않습니다.');
    }
    const { images } = breadShopReviewData;
    const newBreadShopReviewArray = [] as string[];
    const deleteBreadShopReviewImageArray = [] as number[];
    if (imageUrl.length) {
      imageUrl.forEach((newBreadShopReviewImage) => {
        const checkImage = images.some(
          (breadReviewImage) =>
            breadReviewImage.imageUrl === newBreadShopReviewImage
        );
        if (!checkImage) {
          newBreadShopReviewArray.push(newBreadShopReviewImage);
        }
      });
      images.forEach((deleteBreadImage) => {
        const checkImage = imageUrl.some(
          (breadShopReviewImage) =>
            breadShopReviewImage === deleteBreadImage.imageUrl
        );
        if (!checkImage) {
          deleteBreadShopReviewImageArray.push(deleteBreadImage.id);
        }
      });
    }
    await breadShopReviewRepository.updateAndSave(Number(reviewId), content);
    for (let i = 0; i < newBreadShopReviewArray.length; i++) {
      await breadShopReviewImageRepository.createAndSave(
        newBreadShopReviewArray[i],
        breadShopReviewData
      );
    }
    if (deleteBreadShopReviewImageArray.length) {
      await breadShopReviewImageRepository.deleteById(
        deleteBreadShopReviewImageArray
      );
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopReviewDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const breadShopReviewRepository = getCustomRepository(
      BreadShopReviewRepository
    );
    const breadShopReviewInfo = await breadShopReviewRepository.findById(
      Number(reviewId)
    );
    if (!breadShopReviewInfo) {
      throw new GoneRequestError('존재하지 않는 리뷰입니다.');
    }
    await breadShopReviewRepository.deleteById(Number(reviewId));
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
