/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { kakaoLocalAddress } from '../services/kakao';

interface IAddressQuery {
  page?: number;
  limit?: number;
  name?: string;
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
