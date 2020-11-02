import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { dateReg } from '../utils/format';

interface IEventCreate {
  title: string;
  link: string;
  startAt: string;
  endAt: string;
}

export const validateRequestEvent = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { title, link, startAt, endAt } = req.body as IEventCreate;

  if (!title) {
    throw new BadRequestError('제목을 입력해주세요.');
  } else if (!link) {
    throw new BadRequestError('링크를 입력해주세요.');
  } else if (!startAt) {
    throw new BadRequestError('시작날짜를 입력해주세요.');
  } else if (!dateReg(startAt)) {
    throw new BadRequestError('시작날짜 형식이 맞지 않습니다.');
  } else if (!endAt) {
    throw new BadRequestError('마감날짜를 입력해주세요.');
  } else if (!dateReg(endAt)) {
    throw new BadRequestError('마감날짜 형식이 맞지 않습니다.');
  }

  next();
};
