import { Router } from 'express';
import monthRouter from '@routes/monthRoutes';
import nonCreatedRoute from '@routes/nonCreatedRoutes';

const router = Router({ mergeParams: true });

// ASSIGN ROUTES
// api/v1/users
router.route('/').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// api/v1/users/:userId
router.route('/:userId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// ATTACH NESTED ROUTES: api/v1/users/:userId/months
router.use('/:userId/months', monthRouter);

export default router;
