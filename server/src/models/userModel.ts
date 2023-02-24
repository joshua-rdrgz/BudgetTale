import { Schema, model, Types } from 'mongoose';
import { IMonth, monthSchema } from './monthModel';
import { userErrors } from '@errorMessages';

export interface IUser {
  months: Types.Array<IMonth>;
}

const userSchema = new Schema<IUser>({
  months: {
    type: [monthSchema],
    // makes default Date.now functional: See https://mongoosejs.com/docs/subdocs.html#subdocument-defaults for details
    default: () => [],
    validate: {
      validator: function (transactions: Types.Array<IMonth>) {
        return transactions.length >= 1;
      },
      message: userErrors.mustContain1Month,
    },
  },
});

const User = model<IUser>('User', userSchema);

export default User;
