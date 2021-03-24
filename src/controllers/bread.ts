import { BreadUserFavoritesRepository } from './../repository/bread-user-favorites-repository';
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
    const breadArray = await breadRepository.rankList(
      Number(page) || 1,
      Number(limit) || 20,
      req.userAndNon ? req.userAndNon.id : 0
    );
    const sum = await breadRepository.findAllCount();
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

export const breadFavoriteAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadId } = req.params;
    const breadRepository = getCustomRepository(BreadRepository);
    const breadInfo = await breadRepository.findByIdInfo(Number(breadId));
    if (!breadInfo) {
      throw new GoneRequestError('존재하지 않는 빵입니다.');
    }
    const breadUserFavoritesRepository = getCustomRepository(
      BreadUserFavoritesRepository
    );
    const breadUserInfo = await breadUserFavoritesRepository.findById(
      req.user.id,
      Number(breadId)
    );
    if (!breadUserInfo) {
      await breadUserFavoritesRepository.createAndSave(
        req.user,
        Number(breadId)
      );
    }
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadFavoriteDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadId } = req.params;
    const breadRepository = getCustomRepository(BreadRepository);
    const breadInfo = await breadRepository.findByIdInfo(Number(breadId));
    if (!breadInfo) {
      throw new GoneRequestError('존재하지 않는 빵입니다.');
    }
    const breadUserFavoritesRepository = getCustomRepository(
      BreadUserFavoritesRepository
    );
    await breadUserFavoritesRepository.deleteById(req.user, Number(breadId));
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
