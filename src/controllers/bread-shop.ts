import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { AddressGuRepository } from '../repository/address-gu-repository';
import { AddressSiRepository } from '../repository/address-si-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { RankBreadShopResult } from '../result/rank/bread-shop';

interface IBreadShopListQuery {
  page?: number;
  limit?: number;
  si?: number;
  gu?: number;
  title?: string;
}

export const breadShopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, si, gu, title } = req.query as IBreadShopListQuery;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    let address = '';
    if (si) {
      if (gu) {
        const addressGu = getCustomRepository(AddressGuRepository);
        const addressGuData = await addressGu.findById(gu);
        address = addressGuData ? addressGuData.name : '';
      } else {
        const addressSi = getCustomRepository(AddressSiRepository);
        const addressSiData = await addressSi.findById(si);
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
    console.log(breadShopArray);
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
