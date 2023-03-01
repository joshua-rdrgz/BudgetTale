import { Schema, model, Types } from 'mongoose';
import validator from 'validator';
import { IMonth, monthSchema } from './monthModel';
import { userErrors } from '@errorMessages';
import { validateUniqueName } from './modelUtils';

export interface IUser {
  name: String;
  email: String;
  photo: String;
  password: String;
  passwordConfirm: String;
  months: Types.Array<IMonth>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, userErrors.name],
  },
  email: {
    type: String,
    required: [true, userErrors.email],
    unique: true,
    lowercase: true,
    validate: [
      {
        validator: function (email: string) {
          return validator.isEmail(email);
        },
        message: userErrors.validEmail,
      },
      {
        validator: async function (email: string) {
          const result: boolean = await validateUniqueName<IUser>(email, User);
          return result;
        },
        message: userErrors.uniqueEmail,
      },
    ],
  },
  photo: String,
  password: {
    type: String,
    required: [true, userErrors.password],
    minLength: [8, userErrors.passwordMinLength],
  },
  passwordConfirm: {
    type: String,
    required: [true, userErrors.passwordConfirm],
  },
  months: {
    type: [monthSchema],
    // makes default Date.now functional: See https://mongoosejs.com/docs/subdocs.html#subdocument-defaults for details
    default: () => [],
    validate: {
      validator: function (users: Types.Array<IMonth>) {
        return users.length >= 1;
      },
      message: userErrors.mustContain1Month,
    },
  },
});

const User = model<IUser>('User', userSchema);

export default User;
