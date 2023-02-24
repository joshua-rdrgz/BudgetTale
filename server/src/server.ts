import dotenv from 'dotenv';
import mongoose from 'mongoose';

// HANDLE UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1); // 1 stands for 'uncaught exception';
});

dotenv.config();
import app from './app';

const DB = process.env.DB_DEV.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
).replace('<DB_TYPE>', process.env.DB_DEV_NAME);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('server started at http://localhost:' + process.env.PORT);
  console.log('Press CTRL + C to quit....');
});

// HANDLE UNHANDLED REJECTIONS
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // 1 stands for 'uncaught exception';
  });
});
