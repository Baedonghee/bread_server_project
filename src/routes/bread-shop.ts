import express from 'express';
import { breadShopDetail, breadShopList } from '../controllers/bread-shop';

const router = express.Router();

router.get('', breadShopList);

router.get('/:breadShopId', breadShopDetail);

export default router;
