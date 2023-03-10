import { Response, NextFunction } from 'express';
import { IRequest, MiddlewareFunction } from '@types';

type RouteFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function (fn: RouteFunction) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  } as MiddlewareFunction;
}
