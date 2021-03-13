import { EventRepository } from './../repository/event-repository';
import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { BannerEventResult } from '../result/banner/banner-event-result';

export const bannerEventList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventRepository = getCustomRepository(EventRepository);
    const eventList = await eventRepository.listAndBanner();
    const list = [] as {
      imageUrl: string;
      link: string;
    }[];
    eventList.forEach((eventData) => {
      const bannerEventResult = new BannerEventResult(eventData);
      list.push(bannerEventResult);
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      list,
    });
  } catch (err) {
    next(err);
  }
};
