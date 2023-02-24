import { HydratedDocument } from 'mongoose';
import { categoryGroupErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import {
  validateMissingOrIncorrectProperty,
  validateUniqueness,
} from 'test/models/testModelUtils';
import IncomeCategoryGroup, {
  IIncomeCategoryGroups,
} from '@models/budgetModels/incomeModels/incomeCategoryGroupModel';

type CatGroupDocument = HydratedDocument<IIncomeCategoryGroups>;

describe('Income Category Group Model', () => {
  afterEach(() =>
    dropTestDB<IIncomeCategoryGroups>(
      IncomeCategoryGroup,
      'IncomeCategoryGroup'
    )
  );
  describe('name property', () => {
    it('should be required', async () => {
      const catGroup: CatGroupDocument = new IncomeCategoryGroup();
      await validateMissingOrIncorrectProperty<IIncomeCategoryGroups>(
        catGroup,
        'name',
        categoryGroupErrors.name
      );
    });
    it('should be unique', async () => {
      const travelCatGroup: IIncomeCategoryGroups = {
        name: 'Job',
        categories: [
          { name: 'Paycheck', amount: 500 },
        ] as IIncomeCategoryGroups['categories'],
      };
      const catGroup1: CatGroupDocument = new IncomeCategoryGroup(
        travelCatGroup
      );
      const catGroup2: CatGroupDocument = new IncomeCategoryGroup(
        travelCatGroup
      );

      await validateUniqueness<IIncomeCategoryGroups>(
        [catGroup1, catGroup2],
        'name',
        categoryGroupErrors.notUniqueName
      );
    });
  });

  describe('categories property', () => {
    it('should have at least 1 category', async () => {
      const catGroup: CatGroupDocument = new IncomeCategoryGroup({
        name: 'Entertainment',
        categories: [] as IIncomeCategoryGroups['categories'],
      });

      await validateMissingOrIncorrectProperty<IIncomeCategoryGroups>(
        catGroup,
        'categories',
        categoryGroupErrors.noCategories
      );
    });
  });
});
