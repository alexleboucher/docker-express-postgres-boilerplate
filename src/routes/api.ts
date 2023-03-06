import express from 'express';
import 'express-async-errors';

import authRoutes from './auth';

const router = express.Router();

router.use('/auth', authRoutes);

router.route('/health')
    .get((req, res) => res.send('Server is up!'))

export default router;