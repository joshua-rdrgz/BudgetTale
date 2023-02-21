import { Schema, model } from 'mongoose';
import { transactionErrors } from '@errors';

export interface ITransactions {
  // for monthModel.ts
  transactions: ITransaction[];
}

export interface ITransaction {
  // exported for testing
  category: string;
  date: Date;
  description: string;
  amount: number;
  title: string;
}

export const transactionSchema = new Schema<ITransaction>({
  category: {
    // TODO: ensure category exists
    type: String,
    required: [true, transactionErrors.category],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, transactionErrors.date],
  },
  description: {
    type: String,
    required: [true, transactionErrors.description],
  },
  amount: {
    // TODO: pos/neg value based on category
    type: Number,
    required: [true, transactionErrors.amount],
  },
  title: {
    type: String,
    required: [true, transactionErrors.title],
  },
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
