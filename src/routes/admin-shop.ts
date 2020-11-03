import express from 'express';
import { body, param } from 'express-validator';

import {
  shopDetail,
  shopUpdate,
  shopValid,
  shopCreate,
  shopList,
} from './../controllers/admin-shop';
import { currentUser } from '../middlewares/current-admin';
import { validateRequestShop } from '../middlewares/validate-request-shop';
import { upload } from '../services/aws-s3';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentUser, shopList);

router.post(
  '/',
  upload('shop').single('imgFile'),
  currentUser,
  validateRequestShop,
  shopCreate
);

router.get(
  '/:shopId',
  [
    param('shopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상점 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('상점 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  shopDetail
);

router.put(
  '/:shopId',
  upload('shop').single('imgFile'),
  validateRequestShop,
  currentUser,
  shopUpdate
);

router.post(
  '/:shopId/valid',
  [
    param('shopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상점 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('상점 번호를 확인해주세요.'),
    body('enabled').isBoolean().withMessage('유효값을 확인해주세요'),
  ],
  validateRequest,
  currentUser,
  shopValid
);

export default router;
