import express from 'express';
import morgan from 'morgan';

import AppError from '@errors/apiError';
import globalErrorHandler from '@errors/errorController';
import authRouter from '@routes/authRoutes';
import userRouter from '@routes/userRoutes';
import monthRouter from '@routes/monthRoutes';

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// ROUTE MOUNTING
app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/months', monthRouter);

// ERROR HANDLING
app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

export default app;
