import { Schema, Types, model } from 'mongoose';
import {
  expenseCategorySchema,
  IExpenseCategories,
} from './expenseCategoryModel';
import { categoryGroupErrors } from '@errorMessages';
import { validateUniqueName } from '@models/modelUtils';

export interface IExpenseCategoryGroups {
  name: string;
  categories: Types.Array<IExpenseCategories>;
}

export const expenseCategoryGroupSchema = new Schema<IExpenseCategoryGroups>({
  name: {
    type: String,
    required: [true, categoryGroupErrors.name],
    unique: true,
    validate: {
      validator: async function (categoryGroupName: string) {
        const result: boolean =
          await validateUniqueName<IExpenseCategoryGroups>(
            categoryGroupName,
            ExpenseCategoryGroup
          );
        return result;
      },
      message: categoryGroupErrors.notUniqueName,
    },
  },
  categories: {
    type: [expenseCategorySchema],
    default: [],
    validate: {
      validator: function (categories: IExpenseCategories[]) {
        return categories.length >= 1;
      },
      message: categoryGroupErrors.noCategories,
    },
  },
});

const ExpenseCategoryGroup = model<IExpenseCategoryGroups>(
  'Expense Category Groups',
  expenseCategoryGroupSchema
);

export default ExpenseCategoryGroup;
