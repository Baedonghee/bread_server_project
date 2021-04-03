import express from 'express';
import { query, body, param } from 'express-validator';
import {
  addressList,
  addressSiRegister,
  addressSiList,
  addressGuRegister,
  addressGuList,
} from '../controllers/util';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get(
  '/address',
  [
    query('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('주소이름을 입력해주세요.'),
  ],
  validateRequest,
  addressList
);

router.get('/address/si', addressSiList);

router.post(
  '/address/si',
  [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('시 이름을 입력해주세요.'),
  ],
  validateRequest,
  addressSiRegister
);

router.get(
  '/address/gu/:siCode',
  param('siCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('시 코드를 입력해주세요.')
    .isNumeric()
    .withMessage('시 코드는 숫자만 가능합니다.'),
  validateRequest,
  addressGuList
);

router.post(
  '/address/gu',
  [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('구 이름을 입력해주세요.'),
    body('siCode')
      .trim()
      .isLength({ min: 1 })
      .withMessage('시 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('시 번호를 확인해주세요.'),
  ],
  validateRequest,
  addressGuRegister
);

export default router;
