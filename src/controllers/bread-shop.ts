import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { BreadShopCommentRepository } from '../repository/bread-shop-comment-repository';
import { BreadShopRepository } from '../repository/bread-shop-repository';

interface IComment {
  content: string;
}

interface ICommentQuery {
  page?: number;
  limit?: number;
}

export const breadShopCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as ICommentQuery;
    const { breadShopId } = req.params;
    const breadShopCommentRepository = getCustomRepository(
      BreadShopCommentRepository
    );
    const [breadShopCommentArray, sum] = await breadShopCommentRepository.list(
      Number(page) || 1,
      Number(limit) || 20,
      Number(breadShopId)
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: breadShopCommentArray,
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

export const breadShopParentCommentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadShopId } = req.params;
    const { content } = req.body as IComment;
    const breadShopCommentRepository = getCustomRepository(
      BreadShopCommentRepository
    );
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopData = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopData) {
      throw new GoneRequestError('빵집 정보가 존재하지 않습니다.');
    }
    const breadShopCommentData = await breadShopCommentRepository.createAndSave(
      breadShopData,
      req.user,
      content
    );
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: breadShopCommentData.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopChildCommentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId, breadShopId } = req.params;
    const { content } = req.body as IComment;
    const breadShopCommentRepository = getCustomRepository(
      BreadShopCommentRepository
    );
    const breadShopParentCommentData = await breadShopCommentRepository.findById(
      Number(commentId)
    );
    if (!breadShopParentCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    const breadShopRepository = getCustomRepository(BreadShopRepository);
    const breadShopData = await breadShopRepository.findByIdInfo(
      Number(breadShopId)
    );
    if (!breadShopData) {
      throw new GoneRequestError('빵집 정보가 존재하지 않습니다.');
    }
    const breadShopChildCommentData = await breadShopCommentRepository.createAndSave(
      breadShopData,
      req.user,
      content,
      breadShopParentCommentData
    );
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: breadShopChildCommentData.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopCommentUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body as IComment;
    const breadShopCommentRepository = getCustomRepository(
      BreadShopCommentRepository
    );
    const breadShopCommentData = await breadShopCommentRepository.findById(
      Number(commentId)
    );
    if (!breadShopCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    await breadShopCommentRepository.updateAndContent(
      Number(commentId),
      content
    );
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadShopCommentDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const breadShopCommentRepository = getCustomRepository(
      BreadShopCommentRepository
    );
    const breadShopCommentData = await breadShopCommentRepository.findById(
      Number(commentId)
    );
    if (!breadShopCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    await breadShopCommentRepository.deleteById(Number(commentId));
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
