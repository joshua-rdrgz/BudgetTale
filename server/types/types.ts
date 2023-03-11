import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { UserDoc } from 'budgettaleglobaltypes';

export type ReqParams<
  P extends ParamsDictionary = {},
  Q extends Query = {},
  B = {}
> = {
  params?: P;
  query?: Q;
  body?: B;
};

export interface IRequest<T extends ReqParams> extends Request {
  params: T['params'];
  query: T['query'];
  body: T['body'];
  user?: UserDoc;
}

export type MiddlewareFunction<T extends ReqParams = {}> = (
  req: IRequest<T>,
  res: Response,
  next: NextFunction
) => void;
