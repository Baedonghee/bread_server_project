import express from 'express';
import { body, param } from 'express-validator';

import {
  shopDetail,
  shopUpdate,
  shopValid,
  shopCreate,
  shopList,
} from './../controllers/admin-shop';
import { currentAdmin } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentAdmin, shopList);

router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상점이름을 입력해주세요.'),
    body('phoneNumber')
      .trim()
      .isLength({ min: 1 })
      .withMessage('핸드폰번호를 입력해주세요.')
      .matches(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/)
      .withMessage('핸드폰번호 양식을 맞춰주세요.'),
  ],
  currentAdmin,
  validateRequest,
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
  currentAdmin,
  shopDetail
);

router.put(
  '/:shopId',
  [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상점이름을 입력해주세요.'),
    body('phoneNumber')
      .trim()
      .isLength({ min: 1 })
      .withMessage('핸드폰번호를 입력해주세요.')
      .matches(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/)
      .withMessage('핸드폰번호 양식을 맞춰주세요.'),
  ],
  validateRequest,
  currentAdmin,
  shopUpdate
);

router.patch(
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
  currentAdmin,
  shopValid
);

export default router;
