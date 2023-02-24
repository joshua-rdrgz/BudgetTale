import { Schema, model, Types } from 'mongoose';
import { incomeCategorySchema, IIncomeCategories } from './incomeCategoryModel';
import { validateUniqueName } from '@models/modelUtils';
import { categoryGroupErrors } from '@errorMessages';

export interface IIncomeCategoryGroups {
  name: string;
  categories: Types.Array<IIncomeCategories>;
}

export const incomeCategoryGroupSchema = new Schema<IIncomeCategoryGroups>({
  name: {
    type: String,
    required: [true, categoryGroupErrors.name],
    unique: true,
    validate: {
      validator: async function (categoryGroupName: string) {
        const result: boolean = await validateUniqueName<IIncomeCategoryGroups>(
          categoryGroupName,
          IncomeCategoryGroup
        );
        return result;
      },
      message: categoryGroupErrors.notUniqueName,
    },
  },
  categories: {
    type: [incomeCategorySchema],
    default: [],
    validate: {
      validator: function (categories: IIncomeCategories[]) {
        return categories.length >= 1;
      },
      message: categoryGroupErrors.noCategories,
    },
  },
});

const IncomeCategoryGroup = model<IIncomeCategoryGroups>(
  'Income Category Group',
  incomeCategoryGroupSchema
);

export default IncomeCategoryGroup;
