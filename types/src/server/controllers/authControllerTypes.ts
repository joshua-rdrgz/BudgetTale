import { IUser, UserDoc } from "../models/userModelTypes";

export interface IReqCreateUser {
  body: {
    name: IUser['name'];
    email: IUser['email'];
    role: IUser['role'];
    password: IUser['password'];
    passwordConfirm: IUser['passwordConfirm'];
    // months: IUser['months'];
  };
}

export interface IReqLoginUser {
  body: {
    email: IUser['email'];
    password: IUser['password'];
  };
}

export interface IReqForgotPassword {
  body: {
    email: IUser['email'];
  };
}

export interface IReqResetPassword {
  params: {
    token: string;
  };
  body: {
    password: IUser['password'];
    passwordConfirm: IUser['passwordConfirm'];
  };
}

export interface ISuccessfulResAuth {
  status: 'success';
  token: string;
}

export interface ISuccessfulResAuthUser {
  status: 'success';
  token: string;
  data: {
    user: UserDoc;
  }
}