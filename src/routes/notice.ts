import express from 'express';
import { noticeList } from '../controllers/notice';

const router = express.Router();

router.get('/', noticeList);

export default router;
