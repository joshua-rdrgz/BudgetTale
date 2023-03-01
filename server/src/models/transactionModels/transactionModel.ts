import { Schema, model } from 'mongoose';
import { transactionErrors } from '@errorMessages';

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
    default: new Date(Date.now()),
    required: [true, transactionErrors.date],
  },
  description: {
    type: String,
    required: [true, transactionErrors.description],
    minLength: [15, transactionErrors.descriptionMinLength],
    maxLength: [100, transactionErrors.descriptionMaxLength],
  },
  amount: {
    // TODO: pos/neg value based on category
    type: Number,
    required: [true, transactionErrors.amount],
  },
  title: {
    type: String,
    required: [true, transactionErrors.title],
    minLength: [5, transactionErrors.titleMinLength],
    maxLength: [30, transactionErrors.titleMaxLength],
  },
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
