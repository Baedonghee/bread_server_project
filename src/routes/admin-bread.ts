import express from 'express';
import { body, param } from 'express-validator';
import {
  breadList,
  breadCreate,
  breadUpdate,
  breadDetail,
  breadDelete,
} from '../controllers/admin-bread';
import { currentUser } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentUser, breadList);

router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 이름을 입력해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 소개를 입력해주세요.'),
    body('imageUrl').isArray().withMessage('빵 이미지를 첨부해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadCreate
);

router.get(
  '/:breadId',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadDetail
);

router.put(
  '/:breadId',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 번호를 확인해주세요.'),
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 이름을 입력해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 소개를 입력해주세요.'),
    body('imageUrl').isArray().withMessage('빵 이미지를 첨부해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadUpdate
);

router.delete(
  '/:breadId',
  [
    param('breadId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadDelete
);

export default router;
