import express from 'express';
import { body, param } from 'express-validator';

import {
  noticeList,
  noticeCreate,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
} from '../controllers/admin-notice';
import { currentUser } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentUser, noticeList);

router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('제목을 입력해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
    body('startAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('날짜 형식이 맞지 않습니다.'),
  ],
  validateRequest,
  currentUser,
  noticeCreate
);

router.get(
  '/:noticeId',
  [
    param('noticeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('번호를 입력해주세요.')
      .isNumeric()
      .withMessage('공지사항 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  noticeDetail
);

router.put(
  '/:noticeId',
  [
    param('noticeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('번호를 입력해주세요.')
      .isNumeric()
      .withMessage('공지사항 번호를 확인해주세요.'),
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('제목을 입력해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
    body('startAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('날짜 형식이 맞지 않습니다.'),
  ],
  validateRequest,
  currentUser,
  noticeUpdate
);

router.delete(
  '/:noticeId',
  [
    param('noticeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('번호를 입력해주세요.')
      .isNumeric()
      .withMessage('공지사항 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  noticeDelete
);

export default router;
