import { Router } from 'express';
import budgetRouter from '@routes/budgetRoutes/budgetRoutes';
import transactionRouter from '@routes/transactionRoutes';
import nonCreatedRoute from '@routes/nonCreatedRoutes';

const router = Router();

// ASSIGN ROUTES
// api/v1/users/:userId/months
router.route('/').all(function (req, res, next) {
  console.log('api/v1/users/:userId/months triggered!');
  nonCreatedRoute(req, res, next);
});

// api/v1/users/:userId/months/:monthId
router.route('/:monthId').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// ATTACH NESTED ROUTES: api/v1/users/:userId/months/:monthId/budgets
router.use('/:monthId/budgets', budgetRouter);

// ATTACH NESTED ROUTES: api/v1/users/:userId/months/:monthId/transactions
router.use('/:monthId/transactions', transactionRouter);

export default router;
