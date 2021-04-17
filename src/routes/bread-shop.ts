import express from 'express';
import { param } from 'express-validator';
import {
  breadShopDetail,
  breadShopFavoriteAdd,
  breadShopFavoriteDelete,
  breadShopList,
} from '../controllers/bread-shop';
import { currentUser } from '../middlewares/current-user';
import { currentCheckUser } from '../middlewares/current-user-check';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('', currentCheckUser, breadShopList);

router.post(
  '/favorite/:breadShopId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopFavoriteAdd
);

router.delete(
  '/favorite/:breadShopId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopFavoriteDelete
);

router.get('/:breadShopId', currentCheckUser, breadShopDetail);

export default router;
