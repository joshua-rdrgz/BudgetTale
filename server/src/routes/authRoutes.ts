import { Router } from 'express';
import authController from '@controllers/authController';

const router = Router();

// ASSIGN ROUTES

// api/v1/auth/createUser
router.post('/createUser', authController.createUser);

// api/v1/auth/loginUser
router.post('/loginUser', authController.loginUser);

// api/v1/auth/forgotPassword
router.post('/forgotPassword', authController.forgotPassword);

// api/v1/auth/resetPassword/:token
router.patch('/resetPassword/:token', authController.resetPassword);

export default router;