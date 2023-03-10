import { Request, Response, NextFunction } from 'express';
import { UserDoc } from '../src/models/userModel';

export interface IRequest extends Request {
  user?: UserDoc;
}

export type MiddlewareFunction = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => void;