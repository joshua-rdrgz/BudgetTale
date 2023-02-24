import { Request, Response, NextFunction } from 'express';

type RouteFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

type ReturnedFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export default function (fn: RouteFunction) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  } as ReturnedFunction;
}
