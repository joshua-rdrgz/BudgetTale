import { Schema, model } from 'mongoose';
import { validateUniqueName } from '@models/modelUtils';
import { categoryErrors } from '@errors';

export interface IIncomeCategories {
  name: string;
  amount: number;
}

export const incomeCategorySchema = new Schema<IIncomeCategories>({
  name: {
    type: String,
    required: [true, categoryErrors.name],
    unique: true,
    validate: {
      validator: async function (categoryName: string) {
        const result: boolean = await validateUniqueName<IIncomeCategories>(
          categoryName,
          IncomeCategory
        );
        return result;
      },
      message: categoryErrors.notUniqueName,
    },
  },
  amount: {
    type: Number,
    required: [true, categoryErrors.amount],
    min: [0.01, categoryErrors.incomeAmount],
  },
});

const IncomeCategory = model<IIncomeCategories>(
  'Income Category',
  incomeCategorySchema
);

export default IncomeCategory;
