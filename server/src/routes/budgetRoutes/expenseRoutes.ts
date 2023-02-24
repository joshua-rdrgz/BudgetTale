import { Router } from 'express';
import nonCreatedRoute from '@routes/nonCreatedRoutes';

const router = Router();

// ASSIGN ROUTES
// api/v1/users/:userId/months/:monthId/budgets/expenses
router.route('/').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// api/v1/users/:userId/months/:monthId/budgets/expenses/:catGroupId
router.route('/:catGroupId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// api/v1/users/:userId/months/:monthId/budgets/expenses/:catGroupId/:categoryId
router.route('/:catGroupId/:categoryId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

export default router;
