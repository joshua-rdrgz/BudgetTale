import { HydratedDocument } from 'mongoose';
import { monthErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import { validateMissingOrIncorrectProperty } from 'test/models/testModelUtils';
import Month, { IMonth } from '@models/monthModel';
import { IIncomeCategoryGroups } from '@models/budgetModels/incomeModels/incomeCategoryGroupModel';
import { IExpenseCategoryGroups } from '@models/budgetModels/expenseModels/expenseCategoryGroupModel';
import { IBudget } from '@models/budgetModels/budgetModel';

type MonthDocument = HydratedDocument<IMonth>;

describe('Month Model', () => {
  afterEach(async () => await dropTestDB<IMonth>(Month, 'Month'));

  describe('budget property', () => {
    it('should be required', async () => {
      const month: MonthDocument = new Month({ transactions: [] });

      await validateMissingOrIncorrectProperty<IMonth>(
        month,
        'budget',
        monthErrors.budget
      );
    });
  });

  describe('transactions property', () => {
    it('should be required', async () => {
      const monthObj: Omit<IMonth, 'transactions' | 'month'> = {
        budget: {
          incomes: [
            {
              name: 'Category Group 1',
              categories: [
                {
                  name: 'Category 1',
                  amount: 1,
                },
              ] as IIncomeCategoryGroups['categories'],
            },
          ] as IBudget['incomes'],
          expenses: [
            {
              name: 'Category Group 1',
              categories: [
                {
                  name: 'Category 1',
                  amount: -1,
                },
              ] as IExpenseCategoryGroups['categories'],
            },
          ] as IBudget['expenses'],
        },
      };
      const month: MonthDocument = new Month(monthObj);

      await validateMissingOrIncorrectProperty<IMonth>(
        month,
        'transactions',
        monthErrors.transactions
      );
    });
  });
});
