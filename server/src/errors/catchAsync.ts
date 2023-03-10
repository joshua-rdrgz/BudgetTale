import { Request, Response, NextFunction } from 'express';
import { UserDoc } from '@models/userModel';

interface IRequest extends Request {
  user?: UserDoc;
}

type RouteFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

type ReturnedFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => void;

export default function (fn: RouteFunction) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  } as ReturnedFunction;
}
