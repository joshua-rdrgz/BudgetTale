import { Schema, model, Types } from 'mongoose';
import { budgetSchema, IBudget } from './budgetModels/budgetModel';
import {
  transactionSchema,
  ITransactions,
  ITransaction,
} from './transactionModels/transactionModel';
import { monthErrors } from '@errors';

export interface IMonth {
  budget: IBudget;
  transactions: Types.Array<ITransactions>;
}

const monthSchema = new Schema<IMonth>({
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
