import { Response, NextFunction } from 'express';
import { ReqParams, IRequest, MiddlewareFunction } from '@types';

type RouteFunction<T extends ReqParams> = (
  req: IRequest<T>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default function <T extends ReqParams>(fn: RouteFunction<T>) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  } as MiddlewareFunction<T>;
}
