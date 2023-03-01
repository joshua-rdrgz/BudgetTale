import { Router } from 'express';
import nonCreatedRoute from '@routes/nonCreatedRoutes';

const router = Router();

// ASSIGN ROUTES
// api/v1/months/:monthId/transactions
router.route('/').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// api/v1/months/:monthId/transactions/:transactionId
router.route('/:transactionId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

export default router;
