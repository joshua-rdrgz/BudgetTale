import { HydratedDocument } from 'mongoose';
import { monthErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import { generateObject } from 'test/testUtils';
import { validateMissingOrIncorrectProperty } from 'test/models/testModelUtils';
import Month, { IMonth } from '@models/monthModel';

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
      const monthObj = generateObject('months', false); // generates monthObj with no transactions
      const month: MonthDocument = new Month(monthObj);

      await validateMissingOrIncorrectProperty<IMonth>(
        month,
        'transactions',
        monthErrors.transactions
      );
    });
  });
});
