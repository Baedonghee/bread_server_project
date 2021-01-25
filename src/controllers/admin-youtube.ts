import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { GoneRequestError } from '../errors/gone-request.error';
import { YoutubeRepository } from '../repository/youtube-repository';

interface IYoutubeCreate {
  title: string;
  content: string;
  link: string;
  breadId: number;
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
    const { title, content, link, breadId } = req.body as IYoutubeCreate;
    const { adminUser } = req;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    await youtubeRepository.createAndSave(
      title,
      content,
      link,
      breadId,
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
    res.status(200).json({
      status: 200,
      message: 'success',
      data: youtubeInfo,
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
    const { title, content, link, breadId } = req.body as IYoutubeCreate;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    await youtubeRepository.updateAndSave(
      Number(youtubeId),
      title,
      content,
      link,
      breadId,
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
