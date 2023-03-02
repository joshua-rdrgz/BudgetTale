import { Router } from 'express';
import authController from '@controllers/authController';

const router = Router();

// ASSIGN ROUTES

// api/v1/createUser
router.post('/createUser', authController.createUser);

// api/v1/loginUser
router.post('/loginUser', authController.loginUser);

export default router;