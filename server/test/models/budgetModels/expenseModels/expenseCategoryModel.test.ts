import { HydratedDocument } from 'mongoose';
import { categoryErrors } from '@errors';
import { dropTestDB } from 'test/setup.test';
import {
  validateMissingOrIncorrectProperty,
  validateUniqueness,
} from 'test/models/testModelUtils';
import ExpenseCategory, {
  IExpenseCategories,
} from '@models/budgetModels/expenseModels/expenseCategoryModel';

type CatDocument = HydratedDocument<IExpenseCategories>;

describe('Expense Categories', () => {
  afterEach(() =>
    dropTestDB<IExpenseCategories>(ExpenseCategory, 'ExpenseCategory')
  );

  describe('name property', () => {
    it('should have a required name', async () => {
      const category: CatDocument = new ExpenseCategory();

      await validateMissingOrIncorrectProperty<IExpenseCategories>(
        category,
        'name',
        categoryErrors.name
      );
    });

    it('should have a unique name', async () => {
      const categoryInfo: IExpenseCategories = {
        name: 'Food',
        amount: -30,
      };
      const categoryOne: CatDocument = new ExpenseCategory(categoryInfo);
      const categoryTwo: CatDocument = new ExpenseCategory(categoryInfo);

      await validateUniqueness<IExpenseCategories>(
        [categoryOne, categoryTwo],
        'name',
        categoryErrors.notUniqueName
      );
    });
  });

  describe('amount property', () => {
    it('should have an amount', async () => {
      const category: CatDocument = new ExpenseCategory();

      await validateMissingOrIncorrectProperty<IExpenseCategories>(
        category,
        'amount',
        categoryErrors.amount
      );
    });

    it('should have a maximum of -0.01', async () => {
      const category: CatDocument = new ExpenseCategory({
        name: 'Pets',
        amount: 1,
      });

      await validateMissingOrIncorrectProperty<IExpenseCategories>(
        category,
        'amount',
        categoryErrors.expenseAmount
      );
    });
  });
});
