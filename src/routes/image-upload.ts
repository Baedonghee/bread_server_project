import express from 'express';

import { uploadImage, uploadListImage } from '../controllers/upload';
import { currentAdmin } from '../middlewares/current-admin';
import { currentUser } from '../middlewares/current-user';
import { upload } from '../services/aws-s3';

const router = express.Router();

router.post(
  '/event',
  currentAdmin,
  upload('event').single('imgFile'),
  uploadImage
);

router.post(
  '/shop',
  currentAdmin,
  upload('shop').single('imgFile'),
  uploadImage
);

router.post(
  '/user',
  currentAdmin,
  upload('user').single('imgFile'),
  uploadImage
);

router.post(
  '/bread/shop',
  currentAdmin,
  upload('breadShop').array('imgFile', 8),
  uploadListImage
);

router.post(
  '/bread/menu',
  currentAdmin,
  upload('breadMenu').array('imgFile', 8),
  uploadListImage
);

router.post(
  '/bread',
  currentAdmin,
  upload('bread').array('imgFile', 8),
  uploadListImage
);

router.post(
  '/review',
  currentUser,
  upload('review').array('imgFile', 8),
  uploadListImage
);

export default router;
