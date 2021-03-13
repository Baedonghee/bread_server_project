import express from 'express';
import { param, body } from 'express-validator';

import { eventDelete, eventUpdate } from './../controllers/admin-event';
import { currentAdmin } from './../middlewares/current-admin';
import {
  eventCreate,
  eventDetail,
  eventList,
} from '../controllers/admin-event';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentAdmin, eventList);

router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('제목을 입력해주세요.'),
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.'),
    body('imageUrl')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이미지url을 입력해주세요.'),
    body('banner')
      .trim()
      .isLength({ min: 1 })
      .withMessage('배너 여부를 입력해주세요.')
      .isBoolean()
      .withMessage('배너 여부 형식을 맞춰주세요.'),
    body('startAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('시작날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('시작날짜 형식이 맞지 않습니다.'),
    body('endAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('마감날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('마감날짜 형식이 맞지 않습니다.'),
  ],
  validateRequest,
  currentAdmin,
  eventCreate
);

router.get(
  '/:eventId',
  [
    param('eventId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이벤트 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('이벤트 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  eventDetail
);

router.put(
  '/:eventId',
  [
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('제목을 입력해주세요.'),
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.'),
    body('imageUrl')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이미지url을 입력해주세요.'),
    body('startAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('시작날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('시작날짜 형식이 맞지 않습니다.'),
    body('endAt')
      .trim()
      .isLength({ min: 1 })
      .withMessage('마감날짜를 입력해주세요.')
      .matches(
        /^([0-9]{4})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/
      )
      .withMessage('마감날짜 형식이 맞지 않습니다.'),
  ],
  validateRequest,
  currentAdmin,
  eventUpdate
);

router.delete(
  '/:eventId',
  [
    param('eventId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('이벤트 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('이벤트 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  eventDelete
);

export default router;
