import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { YoutubeRepository } from '../repository/youtube-repository';

interface IYoutubeListQuery {
  page?: number;
  limit?: number;
}

export const youtubeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as IYoutubeListQuery;
    const youtubeRepository = getCustomRepository(YoutubeRepository);
    const [youtubeList, sum] = await youtubeRepository.listAndPick(
      Number(page) || 1,
      Number(limit) || 20
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: youtubeList,
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
