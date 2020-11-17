import express from 'express';

import { uploadImage } from '../controllers/upload';
import { currentUser } from '../middlewares/current-admin';
import { upload } from '../services/aws-s3';

const router = express.Router();

router.post(
  '/event',
  currentUser,
  upload('event').single('imgFile'),
  uploadImage
);

router.post(
  '/shop',
  currentUser,
  upload('shop').single('imgFile'),
  uploadImage
);

router.post(
  '/user',
  currentUser,
  upload('user').single('imgFile'),
  uploadImage
);

export default router;
