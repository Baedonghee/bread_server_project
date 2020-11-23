import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { GoneRequestError } from '../errors/gone-request.error';
import { ShopUserRepository } from '../repository/shop-repository';

interface IShopCreate {
  name: string;
  phoneNumber: string;
  imageUrl?: string;
}

export const shopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shopRepository = getCustomRepository(ShopUserRepository);
    const shopArray = await shopRepository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: shopArray,
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
