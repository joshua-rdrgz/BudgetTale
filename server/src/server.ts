import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import app from './app';

const DB = process.env.DB_DEV
  .replace('<PASSWORD>', process.env.DB_PASSWORD)
  .replace('<DB_TYPE>', process.env.DB_DEV_NAME);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

app.listen(process.env.PORT, () => {
  console.log('server started at http://localhost:' + process.env.PORT);
  console.log('Press CTRL + C to quit....');
});
