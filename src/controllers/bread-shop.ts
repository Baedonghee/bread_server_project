import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { AddressGuRepository } from '../repository/address-gu-repository';
import { AddressSiRepository } from '../repository/address-si-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { BreadShopDetailResult } from '../result/bread-shop/bread-shop-detail-result';
import { RankBreadShopResult } from '../result/rank/bread-shop';

interface IBreadShopListQuery {
  page?: number;
  limit?: number;
  si_code?: number;
  gu_code?: number;
  title?: string;
}

export const breadShopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page,
      limit,
      si_code: siCode,
      gu_code: guCode,
      title,
    } = req.query as IBreadShopListQuery;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    let address = '';
    if (siCode) {
      if (guCode) {
        const addressGu = getCustomRepository(AddressGuRepository);
        const addressGuData = await addressGu.findById(guCode);
        address = addressGuData ? addressGuData.name : '';
      } else {
        const addressSi = getCustomRepository(AddressSiRepository);
        const addressSiData = await addressSi.findById(siCode);
        address = addressSiData ? addressSiData.name : '';
      }
    }
    const list = [] as {
      id: number;
      title: string;
      image: string;
      address: string;
    }[];
    const [breadShopArray, sum] = await breadShopRepository.rankList(
      Number(page) || 1,
      Number(limit) || 20,
      title,
      address
    );
    breadShopArray.forEach((breadShopData) => {
      const rankBreadShopResult = new RankBreadShopResult(breadShopData);
      list.push(rankBreadShopResult);
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

export const breadShopDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdWithBread(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    await breadShopRepository.updateAndRank(
      breadShopInfo.id,
      breadShopInfo.rank + 1
    );
    const breadMakeResult = new BreadShopDetailResult(breadShopInfo);
    res.status(200).json({
      status: 200,
      message: 'success',
      data: breadMakeResult,
    });
  } catch (err) {
    next(err);
  }
};
