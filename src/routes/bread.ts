import express from 'express';
import { breadDetail, breadList } from '../controllers/bread';

const router = express.Router();

router.get('', breadList);

router.get('/:breadId', breadDetail);

export default router;
