import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { BreadRepository } from '../repository/bread-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { BreadShopUserFavoriteRepository } from '../repository/bread-shop-user-favorites-repository';
import { BreadUserFavoritesRepository } from '../repository/bread-user-favorites-repository';
import { RankBreadResult } from '../result/rank/bread';
import { RankBreadShopResult } from '../result/rank/bread-shop';

export const breadRankList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadRepository = getCustomRepository(BreadRepository);
    const userId = req.userAndNon ? req.userAndNon.id : 0;
    const breadArray = await breadRepository.rankList(1, 8, userId);
    const list = [] as { id: number; title: string; image: string }[];
    const breadUserFavoritesRepository = getCustomRepository(
      BreadUserFavoritesRepository
    );
    for (let i = 0; i < breadArray.length; i++) {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const breadFavoriteCheck = await breadUserFavoritesRepository.checkId(
          userId,
          breadArray[i].id
        );
        if (breadFavoriteCheck) {
          breadArray[i].like = true;
        }
      }
      const rankBreadResult = new RankBreadResult(breadArray[i]);
      list.push(rankBreadResult);
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const breadShopRankList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const userId = req.userAndNon ? req.userAndNon.id : 0;
    const breadShopList = await breadShopRepository.rankList(1, 8, userId);
    const list = [] as {
      id: number;
      title: string;
      image: string;
      address: string;
    }[];
    const breadShopUserFavoriteRepository = getCustomRepository(
      BreadShopUserFavoriteRepository
    );
    for (let i = 0; i < breadShopList.length; i++) {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const breadShopFavoriteCheck = await breadShopUserFavoriteRepository.checkId(
          userId,
          breadShopList[i].id
        );
        if (breadShopFavoriteCheck) {
          breadShopList[i].like = true;
        }
      }
      const rankBreadShopResult = new RankBreadShopResult(breadShopList[i]);
      list.push(rankBreadShopResult);
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
    });
  } catch (err) {
    next(err);
  }
};
