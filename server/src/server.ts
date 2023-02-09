import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import moongose, { ConnectOptions } from 'mongoose';

dotenv.config({ path: './config.env' });
import app from './app';
import mongoose from 'mongoose';

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

if (require.main === module) {
  // true if file is executed
  app.listen(process.env.PORT, () => {
    console.log('server started at http://localhost:' + process.env.PORT);
    console.log('Press CTRL + C to quit....');
  });
}

export default app;
