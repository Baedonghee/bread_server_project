/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { BadRequestError } from '../errors/bad-request-error';
import { BreadShopImageRepository } from '../repository/bread-shop-image-repository';
import { BreadShopMenuImageRepository } from '../repository/bread-shop-menu-image-repository';
import { BreadShopHolidayRepository } from '../repository/bread-shop-holiday-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';
import { linkReg } from '../utils/format';
import { kakaoAddress } from '../services/kakao-address';
import { BreadShopAddressRepository } from '../repository/bread-shop-address-repository';
import { ShopUserRepository } from '../repository/shop-repository';
import { GoneRequestError } from '../errors/gone-request.error';

interface IBreadShopCreate {
  title: string;
  link: string;
  parkingEnabled: boolean;
  openTime: string;
  closeTime: string;
  shopUserId: number;
  lat: number;
  lon: number;
  imageUrlShop: string[];
  imageUrlMenu: string[];
  day: string[];
}

export const breadShopList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopArray = await breadShopRepository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: breadShopArray,
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const {
      title,
      link,
      parkingEnabled,
      openTime,
      closeTime,
      shopUserId,
      lat,
      lon,
      day,
      imageUrlShop,
      imageUrlMenu,
    } = req.body as IBreadShopCreate;
    imageUrlShop.forEach((imageShop) => {
      if (!linkReg(imageShop)) {
        throw new BadRequestError('상점 이미지 형식을 맞춰주세요.');
      }
    });
    imageUrlMenu.forEach((imageMenu) => {
      if (!linkReg(imageMenu)) {
        throw new BadRequestError('상점 메뉴 이미지 형식을 맞춰주세요.');
      }
    });
    const shopRepository = getCustomRepository(ShopUserRepository);
    const shopInfo = await shopRepository.findById(Number(shopUserId));
    if (!shopInfo) {
      throw new GoneRequestError('빵집 회원이 존재하지 않습니다.');
    }
    const address = (await kakaoAddress(lon, lat)) as {
      roadAddress: string;
      zibunAddress: string;
    };

    const breadShopAddressRepository = getCustomRepository(
      BreadShopAddressRepository
    );
    const breadShopAddressData = await breadShopAddressRepository.createAndSave(
      lat,
      lon,
      address.roadAddress,
      address.zibunAddress
    );
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopData = await breadShopRepository.createAndSave(
      title,
      link,
      parkingEnabled,
      openTime,
      closeTime,
      breadShopAddressData,
      shopInfo,
      adminUser
    );
    for (let i = 0; i < imageUrlShop.length; i++) {
      const breadShopImageRepository = getCustomRepository(
        BreadShopImageRepository
      );
      await breadShopImageRepository.createAndSave(
        imageUrlShop[i],
        breadShopData
      );
    }
    for (let i = 0; i < imageUrlMenu.length; i++) {
      const breadShopMenuImageRepository = getCustomRepository(
        BreadShopMenuImageRepository
      );
      await breadShopMenuImageRepository.createAndSave(
        imageUrlMenu[i],
        breadShopData
      );
    }
    for (let i = 0; i < day.length; i++) {
      const breadShopHolidayRepository = getCustomRepository(
        BreadShopHolidayRepository
      );
      await breadShopHolidayRepository.createAndSave(day[i], breadShopData);
    }
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminUser } = req;
    const { breadShopId } = req.params;
    const {
      title,
      link,
      parkingEnabled,
      openTime,
      closeTime,
      shopUserId,
      lat,
      lon,
      day,
      imageUrlShop,
      imageUrlMenu,
    } = req.body as IBreadShopCreate;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdCheck(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    const shopRepository = getCustomRepository(ShopUserRepository);
    const shopInfo = await shopRepository.findById(Number(shopUserId));
    if (!shopInfo) {
      throw new GoneRequestError('빵집 회원이 존재하지 않습니다.');
    }
    const newBreadShopImageArray = [] as string[];
    const deleteBreadShopImageArray = [] as number[];
    const newBreadShopMenuImageArray = [] as string[];
    const deleteBreadShopMenuImageArray = [] as number[];
    const newBreadShopDayArray = [] as string[];
    const deleteBreadShopDayArray = [] as number[];
    const { images, menuImages, holidays } = breadShopInfo;
    if (imageUrlShop.length) {
      imageUrlShop.forEach((newBreadShopImage) => {
        const checkImage = images.some(
          (breadShopImage) => breadShopImage.imageUrl === newBreadShopImage
        );
        if (!checkImage) {
          newBreadShopImageArray.push(newBreadShopImage);
        }
      });
      images.forEach((deleteBreadShopImage) => {
        const checkImage = imageUrlShop.some(
          (breadShopImage) => breadShopImage === deleteBreadShopImage.imageUrl
        );
        if (!checkImage) {
          deleteBreadShopImageArray.push(deleteBreadShopImage.id);
        }
      });
    }
    if (imageUrlMenu.length) {
      imageUrlMenu.forEach((newBreadShopMenuImage) => {
        const checkImage = menuImages.some(
          (breadShopMenuImage) =>
            breadShopMenuImage.imageUrl === newBreadShopMenuImage
        );
        if (!checkImage) {
          newBreadShopMenuImageArray.push(newBreadShopMenuImage);
        }
      });
      menuImages.forEach((deleteBreadShopMenuImage) => {
        const checkImage = imageUrlMenu.some(
          (breadShopMenuImage) =>
            breadShopMenuImage === deleteBreadShopMenuImage.imageUrl
        );
        if (!checkImage) {
          deleteBreadShopMenuImageArray.push(deleteBreadShopMenuImage.id);
        }
      });
    }
    if (day && day.length) {
      day.forEach((newBreadShopDay) => {
        const checkDay = holidays.some(
          (breadShopDay) => breadShopDay.day === newBreadShopDay
        );
        if (!checkDay) {
          newBreadShopDayArray.push(newBreadShopDay);
        }
      });
      holidays.forEach((deleteBreadShopDay) => {
        const checkDay = day.some(
          (breadShopDay) => breadShopDay === deleteBreadShopDay.day
        );
        if (!checkDay) {
          deleteBreadShopDayArray.push(deleteBreadShopDay.id);
        }
      });
    } else {
      holidays.forEach((holiday) => {
        deleteBreadShopDayArray.push(holiday.id);
      });
    }
    let breadShopAddressData = null;
    let deleteAddressId;
    const breadShopAddressRepository = getCustomRepository(
      BreadShopAddressRepository
    );
    if (breadShopInfo.address) {
      const {
        lat: beforeLat,
        lon: beforeLon,
        id: addressId,
      } = breadShopInfo.address;
      if (beforeLat !== Number(lat) || beforeLon !== Number(lon)) {
        deleteAddressId = addressId;
        const address = (await kakaoAddress(lon, lat)) as {
          roadAddress: string;
          zibunAddress: string;
        };
        breadShopAddressData = await breadShopAddressRepository.createAndSave(
          lat,
          lon,
          address.roadAddress,
          address.zibunAddress
        );
      }
    }
    await breadShopRepository.updateAndSave(
      Number(breadShopId),
      title,
      link,
      parkingEnabled,
      openTime,
      closeTime,
      breadShopAddressData,
      shopInfo,
      adminUser
    );
    if (deleteAddressId) {
      await breadShopAddressRepository.deleteById(deleteAddressId);
    }
    const breadShopImageRepository = getCustomRepository(
      BreadShopImageRepository
    );
    for (let i = 0; i < newBreadShopImageArray.length; i++) {
      await breadShopImageRepository.createAndSave(
        newBreadShopImageArray[i],
        breadShopInfo
      );
    }
    if (deleteBreadShopImageArray.length) {
      await breadShopImageRepository.deleteById(deleteBreadShopImageArray);
    }
    const breadShopMenuImageRepository = getCustomRepository(
      BreadShopMenuImageRepository
    );
    for (let i = 0; i < newBreadShopMenuImageArray.length; i++) {
      await breadShopMenuImageRepository.createAndSave(
        newBreadShopMenuImageArray[i],
        breadShopInfo
      );
    }
    if (deleteBreadShopMenuImageArray.length) {
      await breadShopMenuImageRepository.deleteById(
        deleteBreadShopMenuImageArray
      );
    }
    const breadShopHolidayRepository = getCustomRepository(
      BreadShopHolidayRepository
    );
    for (let i = 0; i < newBreadShopDayArray.length; i++) {
      await breadShopHolidayRepository.createAndSave(
        newBreadShopDayArray[i],
        breadShopInfo
      );
    }
    if (deleteBreadShopDayArray.length) {
      await breadShopHolidayRepository.deleteById(deleteBreadShopDayArray);
    }
    res.status(201).json({
      status: 201,
      message: 'success',
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
    const breadShopInfo = await breadShopRepository.findById(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: breadShopInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopInfo = await breadShopRepository.findByIdCheck(
      Number(breadShopId)
    );
    if (!breadShopInfo) {
      throw new GoneRequestError('존재하지 않는 빵집 입니다.');
    }
    await breadShopRepository.deleteById(Number(breadShopId));
    const breadShopAddressRepository = getCustomRepository(
      BreadShopAddressRepository
    );
    await breadShopAddressRepository.deleteById(
      Number(breadShopInfo.address.id)
    );
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
