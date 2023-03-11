import { HydratedDocument, Types } from 'mongoose';

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
  // months: Types.Array<IMonth>;
}

export interface IUserMethods {
  verifyCorrectPassword(
    passwordReceived: string,
    passwordActual: string
  ): Promise<boolean>;
  passwordChangedAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

export interface UserDoc extends HydratedDocument<IUser, IUserMethods> {
  password: string;
}
