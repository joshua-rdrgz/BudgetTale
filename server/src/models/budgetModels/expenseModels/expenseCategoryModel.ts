import mongoose, { Schema, model } from 'mongoose';
import { categoryErrors } from '@errorMessages';
import { validateUniqueName } from '@models/modelUtils';

export interface IExpenseCategories {
  name: string;
  amount: number;
}

export const expenseCategorySchema = new Schema<IExpenseCategories>({
  name: {
    type: String,
    required: [true, categoryErrors.name],
    unique: true,
    validate: {
      validator: async function (categoryName: string) {
        const result: boolean = await validateUniqueName<IExpenseCategories>(
          categoryName,
          ExpenseCategory
        );
        return result;
      },
      message: categoryErrors.notUniqueName,
    },
  },
  amount: {
    type: Number,
    required: [true, categoryErrors.amount],
    max: [-0.01, categoryErrors.expenseAmount],
  },
});

const ExpenseCategory = model<IExpenseCategories>(
  'Expense Category',
  expenseCategorySchema
);

export default ExpenseCategory;
