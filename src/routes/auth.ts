import express from 'express';

import AuthController from '../controllers/auth';

const router = express.Router();

router.route('/login').post(AuthController.login);
router.route('/logout').post(AuthController.logout);

export default router;