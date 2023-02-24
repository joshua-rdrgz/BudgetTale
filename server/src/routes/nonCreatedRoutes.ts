import { Request, Response, NextFunction } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
  res.status(500).json({
    status: 'fail',
    message: 'This route has not been created yet, check back later!',
    path: req.originalUrl,
  });
}
