import express from 'express';
import { body, param } from 'express-validator';
import { youtubeDelete, youtubeUpdate } from './../controllers/admin-youtube';
import {
  youtubeCreate,
  youtubeList,
  youtubeDetail,
} from '../controllers/admin-youtube';
import { currentAdmin } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentAdmin, youtubeList);

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
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.')
      .isURL()
      .withMessage('링크 형식이 맞지 않습니다.'),
    body('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  youtubeCreate
);

router.get(
  '/:youtubeId',
  [
    param('youtubeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('유튜브번호를 입력해주세요.')
      .isNumeric()
      .withMessage('유튜브 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  youtubeDetail
);

router.put(
  '/:youtubeId',
  [
    param('youtubeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('유튜브번호를 입력해주세요.')
      .isNumeric()
      .withMessage('유튜브 번호를 확인해주세요.'),
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('제목을 입력해주세요.'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('내용을 입력해주세요.'),
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.')
      .isURL()
      .withMessage('링크 형식이 맞지 않습니다.'),
    body('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 정보를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  youtubeUpdate
);

router.delete(
  '/:youtubeId',
  [
    param('youtubeId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('유튜브번호를 입력해주세요.')
      .isNumeric()
      .withMessage('유튜브 번호를 확인해주세요.'),
  ],
  validateRequest,
  currentAdmin,
  youtubeDelete
);

export default router;
