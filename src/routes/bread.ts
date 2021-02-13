import express from 'express';
import { body, param } from 'express-validator';
import {
  breadChildCommentCreate,
  breadCommentDelete,
  breadCommentList,
  breadCommentUpdate,
  breadParentCommentCreate,
} from '../controllers/bread';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get(
  '/:breadId/comment',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('댓글 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('댓글 번호를 확인해주세요.'),
  ],
  validateRequest,
  breadCommentList
);

router.post(
  '/:breadId/comment',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 정보를 확인해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadParentCommentCreate
);

router.post(
  '/:breadId/comment/:commentId',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 정보를 확인해주세요.'),
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
  breadChildCommentCreate
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
  breadCommentUpdate
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
  breadCommentDelete
);

export default router;
