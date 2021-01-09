import express from 'express';
import { body, param } from 'express-validator';
import {
  breadShopList,
  breadShopCreate,
  breadShopDelete,
  breadShopDetail,
  breadShopUpdate,
} from '../controllers/admin-bread-shop';
import { currentUser } from '../middlewares/current-admin';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/', currentUser, breadShopList);

router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집이름을 입력해주세요.'),
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.'),
    body('parkingEnabled')
      .trim()
      .isLength({ min: 1 })
      .withMessage('주차여부를 입력해주세요.')
      .isBoolean()
      .withMessage('주차여부 형식을 맞춰주세요.'),
    body('openTime')
      .trim()
      .isLength({ min: 1 })
      .withMessage('오픈시간을 입력해주세요.')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('오픈시간 형식을 맞춰주세요.'),
    body('closeTime')
      .trim()
      .isLength({ min: 1 })
      .withMessage('마감시간을 입력해주세요.')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('마감시간 형식을 맞춰주세요.'),
    body('lat')
      .trim()
      .isLength({ min: 1 })
      .withMessage('위도를 입력해주세요.')
      .isNumeric()
      .withMessage('위도 형식을 확인해주세요.'),
    body('lon')
      .trim()
      .isLength({ min: 1 })
      .withMessage('경도를 입력해주세요.')
      .isNumeric()
      .withMessage('경도 형식을 확인해주세요.'),
    body('address')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상세주소를 입력해주세요.'),
    body('day').isArray().withMessage('휴일 형식을 확인해주세요.'),
    body('imageUrlShop').isArray().withMessage('빵집 이미지를 첨부해주세요.'),
    body('imageUrlMenu')
      .isArray()
      .withMessage('빵집 메뉴 이미지를 첨부해주세요.'),
    body('shopUserId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집회원 id를 보내주세요.')
      .isNumeric()
      .withMessage('빵집회원 id 형식을 확인해주세요.'),
    body('breadId').isArray().withMessage('빵 id 형식을 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopCreate
);

router.put(
  '/:breadShopId',
  [
    param('breadShopId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집 번호를 입력해주세요.')
      .isNumeric()
      .withMessage('빵집 번호를 확인해주세요.'),
    body('title')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집이름을 입력해주세요.'),
    body('link')
      .trim()
      .isLength({ min: 1 })
      .withMessage('링크를 입력해주세요.'),
    body('parkingEnabled')
      .trim()
      .isLength({ min: 1 })
      .withMessage('주차여부를 입력해주세요.')
      .isBoolean()
      .withMessage('주차여부 형식을 맞춰주세요.'),
    body('openTime')
      .trim()
      .isLength({ min: 1 })
      .withMessage('오픈시간을 입력해주세요.')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('오픈시간 형식을 맞춰주세요.'),
    body('closeTime')
      .trim()
      .isLength({ min: 1 })
      .withMessage('마감시간을 입력해주세요.')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('마감시간 형식을 맞춰주세요.'),
    body('lat')
      .trim()
      .isLength({ min: 1 })
      .withMessage('위도를 입력해주세요.')
      .isNumeric()
      .withMessage('위도 형식을 확인해주세요.'),
    body('lon')
      .trim()
      .isLength({ min: 1 })
      .withMessage('경도를 입력해주세요.')
      .isNumeric()
      .withMessage('경도 형식을 확인해주세요.'),
    body('address')
      .trim()
      .isLength({ min: 1 })
      .withMessage('상세주소를 입력해주세요.'),
    body('imageUrlShop').isArray().withMessage('빵집 이미지를 첨부해주세요.'),
    body('imageUrlMenu')
      .isArray()
      .withMessage('빵집 메뉴 이미지를 첨부해주세요.'),
    body('shopUserId')
      .trim()
      .isLength({ min: 1 })
      .withMessage('빵집회원 id를 보내주세요.')
      .isNumeric()
      .withMessage('빵집회원 id 형식을 확인해주세요.'),
    body('breadId').isArray().withMessage('빵 id 형식을 확인해주세요.'),
  ],
  validateRequest,
  currentUser,
  breadShopUpdate
);

router.get(
  '/:breadShopId',
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
  breadShopDetail
);

router.delete(
  '/:breadShopId',
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
  breadShopDelete
);

export default router;
