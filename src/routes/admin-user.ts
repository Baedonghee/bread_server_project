import express from 'express';
import { body } from 'express-validator';

import {
  adminSignUp,
  adminSignIn,
  adminCurrent,
  adminDetail,
  adminUpdate,
} from '../controllers/admin-user';
import { currentUser } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';
import { upload } from '../services/aws-s3';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이메일을 입력해주세요.')
      .isEmail()
      .withMessage('이메일을 형식이 아닙니다.'),
    body('password')
      .trim()
      .isLength({ min: 1 })
      .withMessage('비밀번호를 입력해주세요.')
      .isLength({ min: 8, max: 20 })
      .withMessage('비밀번호는 8~20자로 입력해주세요.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage('비밀번호 조합을 맞춰주세요.'),
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이름을 입력해주세요.'),
    body('type')
      .trim()
      .isLength({ min: 1 })
      .withMessage('로그인타입을 보내주세요.'),
  ],
  validateRequest,
  adminSignUp
);

router.post(
  '/signin',
  [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이메일을 입력해주세요.')
      .isEmail()
      .withMessage('이메일을 형식이 아닙니다.'),
    body('password')
      .trim()
      .isLength({ min: 1 })
      .withMessage('비밀번호를 입력해주세요.'),
  ],
  validateRequest,
  adminSignIn
);

router.get('/current', currentUser, adminCurrent);

router.get('/profile', currentUser, adminDetail);

router.put(
  '/profile',
  upload('user').single('imgFile'),
  currentUser,
  adminUpdate
);

export default router;
