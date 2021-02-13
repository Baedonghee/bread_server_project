import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { BreadCommentRepository } from '../repository/bread-comment-repository';
import { BreadRepository } from '../repository/bread-repository';

interface IComment {
  content: string;
}

interface ICommentQuery {
  page?: number;
  limit?: number;
}

export const breadCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query as ICommentQuery;
    const { breadId } = req.params;
    const breadCommentRepository = getCustomRepository(BreadCommentRepository);
    const [breadCommentArray, sum] = await breadCommentRepository.list(
      Number(page) || 1,
      Number(limit) || 20,
      Number(breadId)
    );
    res.status(200).json({
      status: 200,
      message: 'success',
      list: breadCommentArray,
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

export const breadParentCommentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breadId } = req.params;
    const { content } = req.body as IComment;
    const breadCommentRepository = getCustomRepository(BreadCommentRepository);
    const breadRepository = getCustomRepository(BreadRepository);
    const breadData = await breadRepository.findByIdInfo(Number(breadId));
    if (!breadData) {
      throw new GoneRequestError('빵 정보가 존재하지 않습니다.');
    }
    const breadCommentData = await breadCommentRepository.createAndSave(
      breadData,
      req.user,
      content
    );
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: breadCommentData.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const breadChildCommentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId, breadId } = req.params;
    const { content } = req.body as IComment;
    const breadCommentRepository = getCustomRepository(BreadCommentRepository);
    const breadParentCommentData = await breadCommentRepository.findById(
      Number(commentId)
    );
    if (!breadParentCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    const breadRepository = getCustomRepository(BreadRepository);
    const breadData = await breadRepository.findByIdInfo(Number(breadId));
    if (!breadData) {
      throw new GoneRequestError('빵 정보가 존재하지 않습니다.');
    }
    const breadChildCommentData = await breadCommentRepository.createAndSave(
      breadData,
      req.user,
      content,
      breadParentCommentData
    );
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: breadChildCommentData.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const breadCommentUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body as IComment;
    const breadCommentRepository = getCustomRepository(BreadCommentRepository);
    const breadCommentData = await breadCommentRepository.findById(
      Number(commentId)
    );
    if (!breadCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    await breadCommentRepository.updateAndContent(Number(commentId), content);
    res.status(201).json({
      status: 201,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const breadCommentDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const breadCommentRepository = getCustomRepository(BreadCommentRepository);
    const breadCommentData = await breadCommentRepository.findById(
      Number(commentId)
    );
    if (!breadCommentData) {
      throw new GoneRequestError('댓글 정보가 존재하지 않습니다.');
    }
    await breadCommentRepository.deleteById(Number(commentId));
    res.status(200).json({
      status: 200,
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
