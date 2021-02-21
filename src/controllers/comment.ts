import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { GoneRequestError } from '../errors/gone-request.error';
import { BreadCommentRepository } from '../repository/bread-comment-repository';
import { BreadRepository } from '../repository/bread-repository';
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
