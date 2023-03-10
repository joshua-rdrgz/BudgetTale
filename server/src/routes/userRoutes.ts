import { Router } from 'express';
import nonCreatedRoute from '@routes/nonCreatedRoutes';
import authController from '@controllers/authController';
import userController from '@controllers/userController';

const router = Router({ mergeParams: true });

// ASSIGN ROUTES

// api/v1/users
router
  .route('/')
  .get(
    authController.protectRoute,
    authController.restrictRouteTo('admin'),
    userController.getAllUsers
  );

// api/v1/users/:userId
router.route('/:userId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

export default router;
