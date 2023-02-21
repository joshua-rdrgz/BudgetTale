import mongoose from 'mongoose';

const connectToTestDBAndDeleteModels = async () => {
  // establishing connection to test DB
  const DB = process.env.DB_DEV.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
  ).replace('<DB_TYPE>', process.env.DB_TEST_NAME);

  try {
    await mongoose.connect(DB);
    console.log('Test DB connection successful!');
  } catch (error) {
    console.error(error);
  }

  // deletes all models so 'mocha --watch' can rebuild them without the ModelOverwriteError
  for (let model in mongoose.models) {
    delete mongoose.models[model];
  }
};

const closeConnectionToTestDB = () => {
  // clear out database and close the connection to test DB
  mongoose.connection.close(() => {
    console.log('Test DB Connection Successfully Closed.');
  });
};

before(async () => await connectToTestDBAndDeleteModels());

after(() => closeConnectionToTestDB());

export const dropTestDB = <T>(model: mongoose.Model<T>, modelName: string) => {
  console.log(`${modelName}.deleteMany({}) has been executed.`);
  return model.deleteMany({});
};
