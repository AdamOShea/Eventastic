import express from 'express';
const router = express.Router();

import { createUser, loginUser, findOneUser } from '../controllers/user.js';

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
router.post('/find-one-user', findOneUser);

export default router;  // Use default export
