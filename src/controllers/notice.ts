import { NoticeRepository } from './../repository/notice-repository';
import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { NoticeResult } from '../result/notice/notice-result';

interface INoticeListQuery {
  page?: number;
  limit?: number;
}

export const noticeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as INoticeListQuery;
    const noticeRepository = getCustomRepository(NoticeRepository);
    const [noticeList, sum] = await noticeRepository.listAndPaging(
      Number(page) || 1,
      Number(limit) || 20
    );
    const list = [] as {
      id: number;
      title: string;
      content: string;
      startAt: Date;
    }[];
    noticeList.forEach((noticeData) => {
      const noticeResult = new NoticeResult(noticeData);
      list.push(noticeResult);
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
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
