import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { GoneRequestError } from '../errors/gone-request.error';
import { YoutubeRepository } from '../repository/youtube-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { YoutubeResult } from '../result/youtube/youtube-result';

interface IYoutubeCreate {
  title: string;
  content: string;
  link: string;
  breadShopId: number;
}

interface IYoutubeListQuery {
  page?: number;
  limit?: number;
  title?: string;
}

export const youtubeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, title } = req.query as IYoutubeListQuery;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const [youtubeArray, sum] = await youtubeRepository.list(
      Number(page) || 1,
      Number(limit) || 20,
      title || undefined
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: youtubeArray,
      pagnation: {
        totalPtotalPage: Math.ceil(sum / (Number(limit) || 20)),
        limit: Number(limit) || 20,
        currentPage: Number(page) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, link, breadShopId } = req.body as IYoutubeCreate;
    const { adminUser } = req;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdInfo(breadShopId);
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집입니다.');
    }
    await youtubeRepository.createAndSave(
      title,
      content,
      link,
      breadShopInfo,
      adminUser
    );
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const youtubeInfo = await youtubeRepository.findById(Number(youtubeId));
    if (!youtubeInfo) {
      throw new GoneRequestError('존재하지 않는 게시물입니다.');
    }
    const youtubeMakeResult = new YoutubeResult(youtubeInfo);
    res.status(200).json({
      status: 200,
      message: 'success',
      data: youtubeMakeResult,
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const { adminUser } = req;
    const { title, content, link, breadShopId } = req.body as IYoutubeCreate;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findById(breadShopId);
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집입니다.');
    }
    await youtubeRepository.updateAndSave(
      Number(youtubeId),
      title,
      content,
      link,
      breadShopInfo,
      adminUser
    );
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const deleteYoutube = await youtubeRepository.deleteById(Number(youtubeId));
    if (!deleteYoutube.affected) {
      throw new GoneRequestError('존재하지 않는 게시물입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
