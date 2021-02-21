import express from 'express';
import { body, param } from 'express-validator';
import {
  breadShopReviewCreate,
  breadShopReviewDelete,
  breadShopReviewList,
  breadShopReviewUpdate,
} from '../controllers/review';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/:breadShopId', [
  param('breadShopId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('빵집 번호를 입력해주세요.')
    .isNumeric()
    .withMessage('빵집 번호를 확인해주세요.'),
  validateRequest,
  breadShopReviewList,
]);

router.post(
  '/:breadShopId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('리뷰 내용을 입력해주세요.'),
    body('imageUrl').isArray().withMessage('빵 이미지를 첨부해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopReviewCreate
);

router.put(
  '/:breadShopId/:reviewId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
    param('reviewId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('리뷰 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('리뷰 번호를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('리뷰 내용을 입력해주세요.'),
    body('imageUrl').isArray().withMessage('빵 이미지를 첨부해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopReviewUpdate
);

router.delete(
  '/:reviewId',
  [
    param('reviewId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('리뷰 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('리뷰 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopReviewDelete
);

export default router;
