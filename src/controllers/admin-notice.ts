import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { NoticeRepository } from '../repository/notice-repository';
import { GoneRequestError } from '../errors/gone-request.error';

interface INoticeCreate {
  title: string;
  content: string;
  startAt: string;
}

interface INoticeListQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  title?: string;
}

export const noticeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, startDate, title } = req.query as INoticeListQuery;
    const noticeRespository = getCustomRepository(NoticeRepository);
    const [noticeArray, sum] = await noticeRespository.list(
      Number(page) || 1,
      Number(limit) || 20,
      startDate ? new Date(startDate) : undefined,
      title || undefined
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: noticeArray,
      pagination: {
        totalPage: Math.ceil(sum / (Number(limit) || 20)),
        size: Number(limit) || 20,
        currentPage: Number(page) || 1,
      },
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
    const noticeRepository = getCustomRepository(NoticeRepository);
    await noticeRepository.createAndSave(
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
    const noticeRepository = getCustomRepository(NoticeRepository);
    const noticeInfo = await noticeRepository.findById(Number(noticeId));
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
    const noticeRepository = getCustomRepository(NoticeRepository);
    await noticeRepository.updateAndSave(
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
    const noticeRepository = getCustomRepository(NoticeRepository);
    const deleteNotice = await noticeRepository.deleteById(Number(noticeId));
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
