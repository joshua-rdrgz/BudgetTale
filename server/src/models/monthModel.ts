import { Schema, model, Types } from 'mongoose';
import { budgetSchema, IBudget } from './budgetModels/budgetModel';
import {
  transactionSchema,
  ITransactions,
} from './transactionModels/transactionModel';
import { monthErrors } from '@errorMessages';

export interface IMonth {
  month: string;
  budget: IBudget;
  transactions: Types.Array<ITransactions>;
}

export const monthSchema = new Schema<IMonth>({
  month: {
    type: String,
    default: new Date(Date.now()).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  },
  budget: {
    type: budgetSchema,
    required: [true, monthErrors.budget],
  },
  transactions: {
    type: [transactionSchema],
    // makes default Date.now functional: See https://mongoosejs.com/docs/subdocs.html#subdocument-defaults for details
    default: () => [],
    validate: {
      validator: function (transactions: Types.Array<ITransactions>) {
        return transactions.length >= 1;
      },
      message: monthErrors.transactions,
    },
  },
});

const Month = model<IMonth>('Month', monthSchema);

export default Month;
