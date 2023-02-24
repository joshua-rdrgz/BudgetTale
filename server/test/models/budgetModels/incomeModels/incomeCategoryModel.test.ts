import { HydratedDocument } from 'mongoose';
import { categoryErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import {
  validateMissingOrIncorrectProperty,
  validateUniqueness,
} from 'test/models/testModelUtils';
import IncomeCategory, {
  IIncomeCategories,
} from '@models/budgetModels/incomeModels/incomeCategoryModel';

type CatDocument = HydratedDocument<IIncomeCategories>;

describe('Income Categories', () => {
  afterEach(() =>
    dropTestDB<IIncomeCategories>(IncomeCategory, 'IncomeCategory')
  );

  describe('name property', () => {
    it('should have a required name', async () => {
      const category: CatDocument = new IncomeCategory();

      await validateMissingOrIncorrectProperty<IIncomeCategories>(
        category,
        'name',
        categoryErrors.name
      );
    });

    it('should have a unique name', async () => {
      const categoryInfo: IIncomeCategories = {
        name: 'Food',
        amount: 30,
      };
      const categoryOne: CatDocument = new IncomeCategory(categoryInfo);
      const categoryTwo: CatDocument = new IncomeCategory(categoryInfo);

      await validateUniqueness<IIncomeCategories>(
        [categoryOne, categoryTwo],
        'name',
        categoryErrors.notUniqueName
      );
    });
  });

  describe('amount property', () => {
    it('should have an amount', async () => {
      const category: CatDocument = new IncomeCategory();

      await validateMissingOrIncorrectProperty<IIncomeCategories>(
        category,
        'amount',
        categoryErrors.amount
      );
    });

    it('should have a minimum of 0.01', async () => {
      const category: CatDocument = new IncomeCategory({
        name: 'Pets',
        amount: -1,
      });

      await validateMissingOrIncorrectProperty<IIncomeCategories>(
        category,
        'amount',
        categoryErrors.incomeAmount
      );
    });
  });
});
