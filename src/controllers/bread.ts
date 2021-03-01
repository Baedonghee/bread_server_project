import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { RankBreadResult } from './../result/rank/bread';
import { BreadRepository } from '../repository/bread-repository';
import { GoneRequestError } from '../errors/gone-request.error';
import { BreadResult } from '../result/bread/bread-result';

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
    await breadRepository.updateAndRank(breadInfo.id, breadInfo.rank + 1);
    const breadResult = new BreadResult(breadInfo);
    res.status(200).json({
      status: 200,
      message: 'success',
      data: breadResult,
    });
  } catch (err) {
    next(err);
  }
};
