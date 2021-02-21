import express from 'express';
import { body, param } from 'express-validator';
import {
  breadChildCommentCreate,
  breadCommentDelete,
  breadCommentList,
  breadCommentUpdate,
  breadParentCommentCreate,
  breadShopChildCommentCreate,
  breadShopCommentDelete,
  breadShopCommentList,
  breadShopCommentUpdate,
  breadShopParentCommentCreate,
} from '../controllers/comment';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get(
  '/bread/shop/:breadShopId',
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
  '/bread/shop/:breadShopId',
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
  '/bread/shop/:breadShopId/:commentId',
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
  '/bread/shop/:commentId',
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
  '/bread/shop/:commentId',
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

router.get(
  '/bread/:breadId',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 번호를 확인해주세요.'),
  ],
  validateRequest,
  breadCommentList
);

router.post(
  '/bread/:breadId',
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
  '/bread/:breadId/:commentId',
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
  '/bread/:commentId',
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
  '/bread/:commentId',
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
