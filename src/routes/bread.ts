import express from 'express';
import { breadList } from '../controllers/bread';

const router = express.Router();

router.get('', breadList);

export default router;
