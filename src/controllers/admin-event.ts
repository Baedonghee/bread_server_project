import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { EventRespository } from './../repository/event-repository';
import { GoneRequestError } from '../errors/gone-request.error';

interface IEventCreate {
  title: string;
  link: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
}

interface IEventListQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  title?: string;
}

export const eventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page,
      limit,
      startDate,
      endDate,
      title,
    } = req.query as IEventListQuery;
    const eventRepository = getCustomRepository(EventRespository);
    const [eventArray, sum] = await eventRepository.list(
      Number(page) || 1,
      Number(limit) || 20,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      title || undefined
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: eventArray,
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

export const eventCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, link, imageUrl, startAt, endAt } = req.body as IEventCreate;
    const { adminUser } = req;
    const eventRespository = getCustomRepository(EventRespository);
    await eventRespository.createAndSave(
      title,
      imageUrl,
      link,
      new Date(startAt),
      new Date(endAt),
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

export const eventDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const eventRespository = getCustomRepository(EventRespository);
    const eventInfo = await eventRespository.findById(Number(eventId));
    if (!eventInfo) {
      throw new GoneRequestError('존재하지 않는 이벤트 입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: eventInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const eventUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const { title, link, imageUrl, startAt, endAt } = req.body as IEventCreate;
    const { adminUser } = req;
    const eventRespository = getCustomRepository(EventRespository);
    await eventRespository.updateAndSave(
      Number(eventId),
      title,
      imageUrl,
      link,
      new Date(startAt),
      new Date(endAt),
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

export const eventDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const eventRespository = getCustomRepository(EventRespository);
    const deleteEvent = await eventRespository.deleteById(Number(eventId));
    if (!deleteEvent.affected) {
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
