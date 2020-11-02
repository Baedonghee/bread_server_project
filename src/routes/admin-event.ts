import { eventDelete, eventUpdate } from './../controllers/admin-event';
import express from 'express';
import { param } from 'express-validator';

import { currentUser } from './../middlewares/current-admin';
import {
  eventCreate,
  eventDetail,
  eventList,
} from '../controllers/admin-event';
import { validateRequest } from '../middlewares/validate-request';
import { validateRequestEvent } from '../middlewares/validate-request-event';
import { upload } from '../services/aws-s3';

const router = express.Router();

router.get('/', currentUser, eventList);

router.post(
  '/',
  upload('event').single('imgFile'),
  validateRequestEvent,
  currentUser,
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
  currentUser,
  eventDetail
);

router.put(
  '/:eventId',
  upload('event').single('imgFile'),
  validateRequestEvent,
  currentUser,
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
  currentUser,
  eventDelete
);

export default router;
