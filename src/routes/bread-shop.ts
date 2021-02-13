import express from 'express';
import { body, param } from 'express-validator';
import {
  breadShopChildCommentCreate,
  breadShopCommentDelete,
  breadShopCommentList,
  breadShopCommentUpdate,
  breadShopParentCommentCreate,
} from '../controllers/bread-shop';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get(
  '/:breadShopId/comment',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
  ],
  validateRequest,
  breadShopCommentList
);

router.post(
  '/:breadShopId/comment',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 정보를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopParentCommentCreate
);

router.post(
  '/:breadShopId/comment/:commentId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 정보를 확인해주세요.'),
    param('commentId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('댓글 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('댓글 번호를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopChildCommentCreate
);

router.put(
  '/comment/:commentId',
  [
    param('commentId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('댓글 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('댓글 번호를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopCommentUpdate
);

router.delete(
  '/comment/:commentId',
  [
    param('commentId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('댓글 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('댓글 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopCommentDelete
);

export default router;
