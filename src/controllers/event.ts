import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { EventRepository } from '../repository/event-repository';
import { EventResult } from '../result/event/event-result';

interface IEventListQuery {
  page?: number;
  limit?: number;
}

export const eventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as IEventListQuery;
    const eventRepository = getCustomRepository(EventRepository);
    const [eventList, sum] = await eventRepository.listAndPaging(
      Number(page) || 1,
      Number(limit) || 20
    );
    const list = [] as {
      id: number;
      title: string;
      imageUrl: string;
      link: string;
      startAt: Date;
      endAt: Date;
      close: boolean;
    }[];
    eventList.forEach((eventData) => {
      const eventResult = new EventResult(eventData);
      list.push(eventResult);
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
      pagination: {
        totalPtotalPage: Math.ceil(sum / (Number(limit) || 20)),
        limit: Number(limit) || 20,
        currentPage: Number(page) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};
