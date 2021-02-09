import express from 'express';
import { breadRankList, breadShopRankList } from '../controllers/rank';

const router = express.Router();

router.get('/bread', breadRankList);

router.get('/bread/shop', breadShopRankList);

export default router;
