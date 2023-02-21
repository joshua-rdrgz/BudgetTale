import { HydratedDocument } from 'mongoose';
import { categoryGroupErrors } from '@errors';
import { dropTestDB } from 'test/setup.test';
import {
  validateMissingOrIncorrectProperty,
  validateUniqueness,
} from 'test/models/testModelUtils';
import ExpenseCategoryGroup, {
  IExpenseCategoryGroups,
} from '@models/budgetModels/expenseModels/expenseCategoryGroupModel';

type CatGroupDocument = HydratedDocument<IExpenseCategoryGroups>;

describe('Expense Category Group Model', () => {
  afterEach(() =>
    dropTestDB<IExpenseCategoryGroups>(
      ExpenseCategoryGroup,
      'ExpenseCategoryGroup'
    )
  );
  describe('name property', () => {
    it('should be required', async () => {
      const catGroup: CatGroupDocument = new ExpenseCategoryGroup();
      await validateMissingOrIncorrectProperty<IExpenseCategoryGroups>(
        catGroup,
        'name',
        categoryGroupErrors.name
      );
    });
    it('should be unique', async () => {
      const travelCatGroup: IExpenseCategoryGroups = {
        name: 'Travel',
        categories: [
          { name: 'Airfare', amount: -500 },
        ] as IExpenseCategoryGroups['categories'],
      };
      const catGroup1: CatGroupDocument = new ExpenseCategoryGroup(
        travelCatGroup
      );
      const catGroup2: CatGroupDocument = new ExpenseCategoryGroup(
        travelCatGroup
      );

      await validateUniqueness<IExpenseCategoryGroups>(
        [catGroup1, catGroup2],
        'name',
        categoryGroupErrors.notUniqueName
      );
    });
  });

  describe('categories property', () => {
    it('should have at least 1 category', async () => {
      const catGroup: CatGroupDocument = new ExpenseCategoryGroup({
        name: 'Entertainment',
        categories: [] as IExpenseCategoryGroups['categories'],
      });

      await validateMissingOrIncorrectProperty<IExpenseCategoryGroups>(
        catGroup,
        'categories',
        categoryGroupErrors.noCategories
      );
    });
  });
});
