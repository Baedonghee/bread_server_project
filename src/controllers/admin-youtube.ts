import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { YoutubeRespository } from '../repository/youtube-repository';

interface IYoutubeCreate {
  title: string;
  content: string;
  link: string;
  breadId: number;
}

export const youtubeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const youtubeRespository = getCustomRepository(YoutubeRespository);
    const youtubeArray = await youtubeRespository.list();
    res.status(200).json({
      status: 200,
      message: 'success',
      list: youtubeArray,
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, link, breadId } = req.body as IYoutubeCreate;
    const { adminUser } = req;
    const youtubeRespository = getCustomRepository(YoutubeRespository);
    await youtubeRespository.createAndSave(
      title,
      content,
      link,
      breadId,
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

export const youtubeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const youtubeRespository = getCustomRepository(YoutubeRespository);
    const youtubeInfo = await youtubeRespository.findById(Number(youtubeId));
    if (!youtubeInfo) {
      throw new GoneRequestError('존재하지 않는 게시물입니다.');
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      data: youtubeInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const youtubeUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const { adminUser } = req;
    const { title, content, link, breadId } = req.body as IYoutubeCreate;
    const youtubeRespository = getCustomRepository(YoutubeRespository);
    await youtubeRespository.updateAndSave(
      Number(youtubeId),
      title,
      content,
      link,
      breadId,
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

export const youtubeDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { youtubeId } = req.params;
    const youtubeRespository = getCustomRepository(YoutubeRespository);
    const deleteYoutube = await youtubeRespository.deleteById(
      Number(youtubeId)
    );
    if (!deleteYoutube.affected) {
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
