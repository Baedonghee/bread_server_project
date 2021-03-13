import express from 'express';
import { bannerEventList } from '../controllers/banner';

const router = express.Router();

router.get('/event', bannerEventList);

export default router;
