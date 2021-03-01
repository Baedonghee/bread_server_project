import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { BreadRepository } from '../repository/bread-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { RankBreadResult } from '../result/rank/bread';
import { RankBreadShopResult } from '../result/rank/bread-shop';

export const breadRankList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadRepository = getCustomRepository(BreadRepository);
    const breadArray = await breadRepository.rankList(
      1,
      8,
      req.userAndNon ? req.userAndNon.id : 0
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
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const breadShopRankList = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const [breadShopList] = await breadShopRepository.rankList(1, 8);
    const list = [] as {
      id: number;
      title: string;
      image: string;
      address: string;
    }[];
    breadShopList.forEach((breadShopData) => {
      const rankBreadShopResult = new RankBreadShopResult(breadShopData);
      list.push(rankBreadShopResult);
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
