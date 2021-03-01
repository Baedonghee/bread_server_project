import express from 'express';
import { breadRankList, breadShopRankList } from '../controllers/rank';
import { currentCheckUser } from '../middlewares/current-user-check';

const router = express.Router();

router.get('/bread', currentCheckUser, breadRankList);

router.get('/bread/shop', breadShopRankList);

export default router;
