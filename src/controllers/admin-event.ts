import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import { EventRespository } from './../repository/event-repository';
import { ValidateFileError } from '../errors/validate-file-error';
import { GoneRequestError } from '../errors/gone-request.error';

interface IEventCreate {
  title: string;
  link: string;
  startAt: string;
  endAt: string;
}

export const eventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventRespository = getCustomRepository(EventRespository);
    const eventArray = await eventRespository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: eventArray,
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
    if (!req.file) {
      throw new ValidateFileError('이미지 파일을 첨부해주세요.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, link, startAt, endAt } = req.body as IEventCreate;
    const { location }: any = req.file;
    const { adminUser } = req;
    const eventRespository = getCustomRepository(EventRespository);
    await eventRespository.createAndSave(
      title,
      location,
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
    let imageUrl = '';
    const { eventId } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, link, startAt, endAt } = req.body as IEventCreate;
    if (req.file) {
      const { location }: any = req.file;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      imageUrl = location;
    }
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
