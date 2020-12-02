import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json('OK');
});

export default router;
