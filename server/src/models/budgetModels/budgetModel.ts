import { Schema, Types, model } from 'mongoose';
import {
  incomeCategoryGroupSchema,
  IIncomeCategoryGroups,
} from './incomeModels/incomeCategoryGroupModel';
import {
  expenseCategoryGroupSchema,
  IExpenseCategoryGroups,
} from './expenseModels/expenseCategoryGroupModel';
import { budgetErrors } from '@errorMessages';

export interface IBudget {
  incomes: Types.Array<IIncomeCategoryGroups>;
  expenses: Types.Array<IExpenseCategoryGroups>;
}

export const budgetSchema = new Schema<IBudget>({
  incomes: {
    type: [incomeCategoryGroupSchema],
    default: () => [],
    validate: {
      validator: function (categoryGroups: IIncomeCategoryGroups[]) {
        return categoryGroups.length >= 1;
      },
      message: budgetErrors.incomes,
    },
  },
  expenses: {
    type: [expenseCategoryGroupSchema],
    default: () => [],
    validate: {
      validator: function (categoryGroups: IExpenseCategoryGroups[]) {
        return categoryGroups.length >= 1;
      },
      message: budgetErrors.expenses,
    },
  },
});

const Budget = model<IBudget>('Budget', budgetSchema);

export default Budget;
