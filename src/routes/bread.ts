import express from 'express';
import { param } from 'express-validator';
import {
  breadDetail,
  breadFavoriteAdd,
  breadFavoriteDelete,
  breadList,
} from '../controllers/bread';
import { currentUser } from '../middlewares/current-user';
import { currentCheckUser } from '../middlewares/current-user-check';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('', currentCheckUser, breadList);

router.post(
  '/favorite/:breadId',
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
  breadFavoriteAdd
);

router.delete(
  '/favorite/:breadId',
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
  breadFavoriteDelete
);

router.get('/:breadId', breadDetail);

export default router;
