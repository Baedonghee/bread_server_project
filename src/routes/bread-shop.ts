import express from 'express';
import { breadShopList } from '../controllers/bread-shop';

const router = express.Router();

router.get('', breadShopList);

export default router;
