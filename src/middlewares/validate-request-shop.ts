import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { phoneNumberReg } from '../utils/format';

interface IShopCreate {
  name: string;
  phoneNumber: string;
}

export const validateRequestShop = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { name, phoneNumber } = req.body as IShopCreate;

  if (!name) {
    throw new BadRequestError('이름을 입력해주세요.');
  } else if (!phoneNumber) {
    throw new BadRequestError('핸드폰번호를 입력해주세요.');
  } else if (!phoneNumberReg(phoneNumber)) {
    throw new BadRequestError('핸드폰번호 양식을 맞춰주세요.');
  }

  next();
};
