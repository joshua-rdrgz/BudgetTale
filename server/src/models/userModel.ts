import { Schema, model, Types, PreMiddlewareFunction, HydratedDocument } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IMonth, monthSchema } from './monthModel';
import { userErrors } from '@errorMessages';
import { validateUniqueName } from './modelUtils';

export interface IUser {
  name: String;
  email: String;
  photo?: String;
  password: String;
  passwordConfirm: String;
  months: Types.Array<IMonth>;
}

interface UserDoc extends HydratedDocument<IUser> {
  password: string;
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

userSchema.pre('save', async function(this: UserDoc, next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
} as PreMiddlewareFunction);

const User = model<IUser>('User', userSchema);

export default User;
