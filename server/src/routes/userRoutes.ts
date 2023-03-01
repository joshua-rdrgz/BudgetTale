import { Router } from 'express';
import monthRouter from '@routes/monthRoutes';
import nonCreatedRoute from '@routes/nonCreatedRoutes';
import userController from '@controllers/userController';
import authController from '@controllers/authController';

const router = Router({ mergeParams: true });

// ASSIGN ROUTES
// api/v1/users

router.post('/createUser', authController.createUser);

router
  .route('/')
  .get(userController.getAllUsers)

// api/v1/users/:userId
router.route('/:userId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

export default router;
