import { HydratedDocument } from 'mongoose';
import { budgetErrors } from '@errors';
import { dropTestDB } from 'test/setup.test';
import {
  validateMissingOrIncorrectProperty,
} from 'test/models/testModelUtils';
import Budget, { IBudget } from '@models/budgetModels/budgetModel';

type BudgetDocument = HydratedDocument<IBudget>;

describe('Budget Model', () => {
  afterEach(() => dropTestDB<IBudget>(Budget, 'Budget'));

  describe('incomes property', () => {
    it('should be required', async () => {
      const budget: BudgetDocument = new Budget();
      await validateMissingOrIncorrectProperty<IBudget>(
        budget,
        'incomes',
        budgetErrors.incomes
      );
    });
  });

  describe('expenses property', () => {
    it('should be required', async () => {
      const budget: BudgetDocument = new Budget();
      await validateMissingOrIncorrectProperty<IBudget>(
        budget,
        'expenses',
        budgetErrors.expenses
      );
    });
  });
});
