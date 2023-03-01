import { Router } from 'express';
import incomeRouter from '@routes/budgetRoutes/incomeRoutes';
import expenseRouter from '@routes/budgetRoutes/expenseRoutes';
import nonCreatedRoute from '@routes/nonCreatedRoutes';

const router = Router();

// ASSIGN ROUTES
// api/v1/months/:monthId/budgets
router.route('/').all(function (req, res, next) {
  nonCreatedRoute(req, res, next);
});

// ATTACH NESTED ROUTES: api/v1/months/:monthId/budgets/incomes
router.use('/incomes', incomeRouter);

// NESTED ROUTES: api/v1/months/:monthId/budgets/expenses
router.use('/expenses', expenseRouter);

export default router;
