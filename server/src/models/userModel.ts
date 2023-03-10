import crypto from 'crypto';
import {
  Schema,
  Model,
  Types,
  PreSaveMiddlewareFunction,
  HydratedDocument,
  model,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IMonth, monthSchema } from './monthModel';
import { userErrors } from '@errorMessages';
import { validateUniqueName } from './modelUtils';

export interface IUser {
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'admin';
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  months: Types.Array<IMonth>;
}

interface IUserMethods {
  verifyCorrectPassword(
    passwordReceived: string,
    passwordActual: string
  ): Promise<boolean>;
  passwordChangedAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

export interface UserDoc extends HydratedDocument<IUser, IUserMethods> {
  password: string;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
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
        validator: async function (email: string): Promise<boolean> {
          const result: boolean = await validateUniqueName<IUser>(email, User);
          return result;
        },
        message: userErrors.uniqueEmail,
      },
    ],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, userErrors.password],
    minLength: [8, userErrors.passwordMinLength],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, userErrors.passwordConfirm],
    validate: {
      validator: function (passwordConfirm: string): boolean {
        return passwordConfirm === this.password;
      },
      message: 'Password and Confirm Password must match.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // months: {
  //   type: [monthSchema],
  //   // makes default Date.now functional: See https://mongoosejs.com/docs/subdocs.html#subdocument-defaults for details
  //   default: () => [],
  //   validate: {
  //     validator: function (users: Types.Array<IMonth>) {
  //       return users.length >= 1;
  //     },
  //     message: userErrors.mustContain1Month,
  //   },
  // },
});

// USER MODEL PRE MIDDLEWARE
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
} as PreSaveMiddlewareFunction<UserDoc>);

// USER MODEL METHOD INSTANCES
userSchema.methods.createPasswordResetToken = function (this: UserDoc) {
  const MINUTES_IN_MILS_UNTIL_EXPIRES = 10 * 60 * 1000;
  // 1) Create random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) Encrypt the token, set passwordResetToken / passwordResetExpires on user
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(
    Date.now() + MINUTES_IN_MILS_UNTIL_EXPIRES
  );

  return resetToken;
};

userSchema.methods.verifyCorrectPassword = async function (
  passwordReceived: string,
  passwordActual: string
) {
  return await bcrypt.compare(passwordReceived, passwordActual);
};

userSchema.methods.passwordChangedAfter = function (
  this: UserDoc,
  JWTTimestamp
) {
  // TRUE === user's JWT issued before change in password
  // FALSE === user's JWT issued after change in password
  if (this.passwordChangedAt) {
    const currentPasswordChangedAt = this.passwordChangedAt.getTime() / 1000;
    return currentPasswordChangedAt > JWTTimestamp;
  }
  return false;
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
