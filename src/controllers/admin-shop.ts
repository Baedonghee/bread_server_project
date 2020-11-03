import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';

import { ShopUserRespository } from '../repository/shop-repository';

interface IShopCreate {
  name: string;
  phoneNumber: string;
}

export const shopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shopRespository = getCustomRepository(ShopUserRespository);
    const shopArray = await shopRespository.list();
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
    let imageUrl = '';
    const { adminUser } = req;
    const { name, phoneNumber } = req.body as IShopCreate;
    if (req.file) {
      const { location }: any = req.file;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      imageUrl = location;
    }
    const shopRespository = getCustomRepository(ShopUserRespository);
    await shopRespository.createAndSave(name, phoneNumber, imageUrl, adminUser);
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
    const shopRespository = getCustomRepository(ShopUserRespository);
    const shopInfo = await shopRespository.findById(Number(shopId));
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
    let imageUrl = '';
    const { adminUser } = req;
    const { shopId } = req.params;
    const { name, phoneNumber } = req.body as IShopCreate;
    if (req.file) {
      const { location }: any = req.file;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      imageUrl = location;
    }
    const shopRespository = getCustomRepository(ShopUserRespository);
    await shopRespository.updateAndSave(
      Number(shopId),
      name,
      phoneNumber,
      imageUrl,
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
    const shopRespository = getCustomRepository(ShopUserRespository);
    await shopRespository.updateAndEnable(Number(shopId), enabled);
    res.status(200).json({
      status: 200,
      meesage: 'success',
    });
  } catch (err) {
    next(err);
  }
};
