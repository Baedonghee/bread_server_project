import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { RankBreadResult } from './../result/rank/bread';
import { BreadRepository } from '../repository/bread-repository';

interface IBreadListQuery {
  page?: number;
  limit?: number;
}

export const breadList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as IBreadListQuery;
    const breadRepository = getCustomRepository(BreadRepository);
    const [breadArray, sum] = await breadRepository.rankList(
      Number(page) || 1,
      Number(limit) || 20
    );
    const list = [] as { id: number; title: string; image: string }[];
    breadArray.forEach((breadData) => {
      const rankBreadResult = new RankBreadResult(breadData);
      list.push(rankBreadResult);
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
      pagination: {
        totalPage: Math.ceil(sum / (Number(limit) || 20)),
        limit: Number(limit) || 20,
        currentPage: Number(page) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};
