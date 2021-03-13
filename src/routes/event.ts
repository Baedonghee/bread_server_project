import express from 'express';
import { eventList } from '../controllers/event';

const router = express.Router();

router.get('/', eventList);

export default router;
