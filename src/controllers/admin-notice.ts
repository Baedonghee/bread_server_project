import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { NoticeRespository } from '../repository/notice-repository';
import { GoneRequestError } from '../errors/gone-request.error';

interface INoticeCreate {
  title: string;
  content: string;
  startAt: string;
}

export const noticeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const noticeRespository = getCustomRepository(NoticeRespository);
    const noticeArray = await noticeRespository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: noticeArray,
    });
  } catch (err) {
    next(err);
  }
};

export const noticeCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, startAt } = req.body as INoticeCreate;
    const { adminUser } = req;
    const noticeRespository = getCustomRepository(NoticeRespository);
    await noticeRespository.createAndSave(
      title,
      content,
      new Date(startAt),
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

export const noticeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { noticeId } = req.params;
    const noticeRespository = getCustomRepository(NoticeRespository);
    const noticeInfo = await noticeRespository.findById(Number(noticeId));
    if (!noticeInfo) {
      throw new GoneRequestError('존재하지 않는 게시물입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: noticeInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const noticeUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { noticeId } = req.params;
    const { title, content, startAt } = req.body as INoticeCreate;
    const { adminUser } = req;
    const noticeRespository = getCustomRepository(NoticeRespository);
    await noticeRespository.updateAndSave(
      Number(noticeId),
      title,
      content,
      new Date(startAt),
      adminUser
    );
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const noticeDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { noticeId } = req.params;
    const noticeRespository = getCustomRepository(NoticeRespository);
    const deleteNotice = await noticeRespository.deleteById(Number(noticeId));
    if (!deleteNotice.affected) {
      throw new GoneRequestError('존재하지 않는 게시물입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
