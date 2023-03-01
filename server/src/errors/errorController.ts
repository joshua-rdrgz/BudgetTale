import { Request, Response, NextFunction } from 'express';
import AppError from '@errors/apiError';

// DefinitelyTyped's definition of 'err' is 'any', so this is acceptable!

export default function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    let error: AppError = { ...err };
    error.name = err.name;

    // MONGOOSE ERROR HANDLING
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.statusCode === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
}

// HELPER FUNCTIONS

function sendErrorDev(err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: AppError, res: Response) {
  if (err.isOperational) {
    // Operational Error (trusted), send to client.
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Non-Operational Error (not trusted), don't leak details to client.
    console.error('💥💥💥 ERROR 💥💥💥 : ', err);
    res.status(500).json({
      status: 'error',
      message: 'Uh oh!  Something went wrong!',
    });
  }
}

function handleCastErrorDB(err: any) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err: any) {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: "${value}".  Please use another value!`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err: any) {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
}
