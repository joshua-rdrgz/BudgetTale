import { Router } from 'express';
import authController from '@controllers/authController';

const router = Router();

// ASSIGN ROUTES

// api/v1/createUser
router.post('/createUser', authController.createUser);

export default router;