import mongoose from 'mongoose';

export const validateUniqueName = async function <T>(
  name: string,
  model: mongoose.Model<T>
): Promise<boolean> {
  const modelInstance = await model.findOne({ name });
  return !modelInstance; // returns false if duplicate found, which triggers error
};
