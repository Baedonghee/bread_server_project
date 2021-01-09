import express from 'express';
import { query } from 'express-validator';
import { addressList } from '../controllers/util';
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

export default router;
