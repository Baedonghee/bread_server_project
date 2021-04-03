import { getCustomRepository } from 'typeorm';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { kakaoLocalAddress } from '../services/kakao';
import { AddressSiRepository } from '../repository/address-si-repository';
import { BadRequestError } from '../errors/bad-request-error';
import { AddressGuRepository } from '../repository/address-gu-repository';

interface IAddressQuery {
  page?: number;
  limit?: number;
  name?: string;
}

interface IAddressSi {
  name: string;
}

interface IAddressGu {
  siCode: number;
  name: string;
}

export const addressList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, name } = req.query as IAddressQuery;
    const { documents, meta }: any = await kakaoLocalAddress(
      name || '',
      page,
      limit
    );
    const addressList = [] as { zibunAddress: any; roadAddress: any }[];
    documents.forEach((address: any) => {
      const addressParse = {
        zibunAddress: address.address
          ? {
              addressName: address.address.address_name,
              addressLat: address.address.y,
              addressLon: address.address.x,
            }
          : null,
        roadAddress: address.road_address
          ? {
              addressName: address.road_address.address_name,
              addressLat: address.road_address.y,
              addressLon: address.road_address.x,
            }
          : null,
      };
      addressList.push(addressParse);
    });
    const total = {
      isEnd: meta.is_end,
      totalCount: meta.total_count,
    };
    res.status(200).json({
      status: 200,
      data: {
        list: addressList,
        pagination: total,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addressSiRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body as IAddressSi;
    const addressSi = getCustomRepository(AddressSiRepository);
    await addressSi.createAndSave(name);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const addressGuRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, siCode } = req.body as IAddressGu;
    const addressSi = getCustomRepository(AddressSiRepository);
    const addressSiData = await addressSi.findById(siCode);
    if (!addressSiData) {
      throw new BadRequestError('등록된 시가 없습니다.');
    }
    const addressGu = getCustomRepository(AddressGuRepository);
    await addressGu.createAndSave(name, addressSiData);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const addressSiList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressSi = getCustomRepository(AddressSiRepository);
    const addressSiData = await addressSi.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: addressSiData,
    });
  } catch (err) {
    next(err);
  }
};

export const addressGuList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { siCode } = req.params as { siCode: string };
    const addressGu = getCustomRepository(AddressGuRepository);
    const addressGuData = await addressGu.list(Number(siCode));
    res.status(200).json({
      status: 200,
      message: 'success',
      list: addressGuData,
    });
  } catch (err) {
    next(err);
  }
};
