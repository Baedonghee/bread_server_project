import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { AddressGuRepository } from '../repository/address-gu-repository';
import { AddressSiRepository } from '../repository/address-si-repository';
import { BreadShopKindRepository } from '../repository/bread-shop-kind-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { BreadShopUserFavoriteRepository } from '../repository/bread-shop-user-favorites-repository';
import { BreadShopDetailResult } from '../result/bread-shop/bread-shop-detail-result';
import { RankBreadShopResult } from '../result/rank/bread-shop';
import { kakaoAddress } from '../services/kakao';

interface IBreadShopListQuery {
  page?: number;
  limit?: number;
  si_code?: number;
  gu_code?: number;
  lon?: number;
  lat?: number;
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
      lat,
      lon,
      title,
    } = req.query as IBreadShopListQuery;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const userId = req.userAndNon ? req.userAndNon.id : 0;
    let address = '';
    let addressName = '전체';
    if (lat && lon) {
      const { zibunAddress } = (await kakaoAddress(lon, lat)) as {
        zibunAddress: string;
      };
      if (zibunAddress) {
        const addressSplit = zibunAddress.split(' ');
        address = addressSplit[0];
        addressName = `${addressSplit[0]} ${addressSplit[1]}`;
      }
    }
    if (siCode && !address) {
      const addressSi = getCustomRepository(AddressSiRepository);
      const addressSiData = await addressSi.findById(siCode);
      address = addressSiData ? addressSiData.name : '';
      if (guCode) {
        const addressGu = getCustomRepository(AddressGuRepository);
        const addressGuData = await addressGu.findById(guCode);
        address = addressGuData ? addressGuData.name : '';
        addressName = `${addressSiData ? addressSiData.name : ''} ${address}`;
      } else {
        addressName = `${address}`;
      }
    }
    const list = [] as {
      id: number;
      title: string;
      image: string;
      address: string;
    }[];
    const breadShopArray = await breadShopRepository.rankList(
      Number(page) || 1,
      Number(limit) || 20,
      userId,
      title,
      address
    );
    const sum = await breadShopRepository.findAllCount(title, address);
    const breadShopUserFavoriteRepository = getCustomRepository(
      BreadShopUserFavoriteRepository
    );
    for (let i = 0; i < breadShopArray.length; i++) {
      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const breadShopFavoriteCheck = await breadShopUserFavoriteRepository.checkId(
          userId,
          breadShopArray[i].id
        );
        if (breadShopFavoriteCheck) {
          breadShopArray[i].like = true;
        }
      }
      const rankBreadShopResult = new RankBreadShopResult(breadShopArray[i]);
      list.push(rankBreadShopResult);
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: {
        addressName,
      },
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
    const userId = req.userAndNon ? req.userAndNon.id : 0;
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
    const breadShopKindRepository = getCustomRepository(
      BreadShopKindRepository
    );
    const breadShopKindInfo = await breadShopKindRepository.listAndBreadShopId(
      Number(breadShopId)
    );
    let like = false;
    if (userId) {
      const breadShopUserFavoriteRepository = getCustomRepository(
        BreadShopUserFavoriteRepository
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const breadShopFavoriteCheck = await breadShopUserFavoriteRepository.checkId(
        userId,
        Number(breadShopId)
      );
      like = !!breadShopFavoriteCheck;
    }
    const breadMakeResult = new BreadShopDetailResult(
      breadShopInfo,
      breadShopKindInfo,
      like
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      data: breadMakeResult,
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopFavoriteAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    const breadShopUserFavoritesRepository = getCustomRepository(
      BreadShopUserFavoriteRepository
    );
    const breadShopUserInfo = await breadShopUserFavoritesRepository.findById(
      req.user.id,
      Number(breadShopId)
    );
    if (!breadShopUserInfo) {
      await breadShopUserFavoritesRepository.createAndSave(
        req.user,
        Number(breadShopId)
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

export const breadShopFavoriteDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    const breadShopUserFavoriteRepository = getCustomRepository(
      BreadShopUserFavoriteRepository
    );
    await breadShopUserFavoriteRepository.deleteById(
      req.user,
      Number(breadShopId)
    );
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
