import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.create);

export default router;