import express from 'express';
import { youtubeList } from '../controllers/youtube';

const router = express.Router();

router.get('/', youtubeList);

export default router;
