/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { ValidateFileError } from '../errors/validate-file-error';

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ValidateFileError('이미지 파일을 첨부해주세요.');
    }
    const { location }: any = req.file;
    res.json({
      status: 200,
      data: {
        imageUrl: location,
      },
      message: 'success',
    });
  } catch (err) {
    next(err);
  }
};
