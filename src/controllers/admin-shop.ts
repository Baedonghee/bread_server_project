import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { GoneRequestError } from '../errors/gone-request.error';
import { ShopUserRepository } from '../repository/shop-repository';

interface IShopCreate {
  name: string;
  phoneNumber: string;
  imageUrl?: string;
}

interface IShopListQuery {
  page?: number;
  limit?: number;
  name?: string;
  valid?: string;
}

export const shopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, name, valid } = req.query as IShopListQuery;
    const shopRepository = getCustomRepository(ShopUserRepository);
    const [shopArray, sum] = await shopRepository.list(
      Number(page) || 1,
      Number(limit) || 20,
      name || undefined,
      valid ? (valid === 'true' ? true : false) : undefined
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: shopArray,
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

export const shopCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const { name, phoneNumber, imageUrl } = req.body as IShopCreate;
    const shopRespository = getCustomRepository(ShopUserRepository);
    await shopRespository.createAndSave(
      name,
      phoneNumber,
      imageUrl || '',
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

export const shopDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId } = req.params;
    const shopRepository = getCustomRepository(ShopUserRepository);
    const shopInfo = await shopRepository.findById(Number(shopId));
    if (!shopInfo) {
      throw new GoneRequestError('빵집 회원이 존재하지 않습니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: shopInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const shopUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const { shopId } = req.params;
    const { name, phoneNumber, imageUrl } = req.body as IShopCreate;
    const shopRespository = getCustomRepository(ShopUserRepository);
    await shopRespository.updateAndSave(
      Number(shopId),
      name,
      phoneNumber,
      imageUrl || '',
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

export const shopValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shopId } = req.params;
    const { enabled } = req.body as { enabled: boolean };
    const shopRepository = getCustomRepository(ShopUserRepository);
    await shopRepository.updateAndEnable(Number(shopId), enabled);
    res.status(200).json({
      status: 200,
      meesage: 'success',
    });
  } catch (err) {
    next(err);
  }
};
