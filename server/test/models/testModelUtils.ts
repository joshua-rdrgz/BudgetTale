import { HydratedDocument } from 'mongoose';
import { assert } from 'chai';

export const validateMissingOrIncorrectProperty = async <T>(
  modelInstance: HydratedDocument<T>,
  propertyName: string,
  expectedError: string
) => {
  try {
    await modelInstance.validate();
  } catch ({ errors }) {
    assert.deepEqual(errors[propertyName].message, expectedError);
  }
};

export const validateUniqueness = async <T>(
  modelInstances: [HydratedDocument<T>, HydratedDocument<T>],
  propertyName: string,
  expectedError: string
) => {
  const [modelInstanceOne, modelInstanceTwo] = modelInstances;
  try {
    await modelInstanceOne.save();
    await modelInstanceTwo.save();
  } catch ({ errors }) {
    assert.deepEqual(errors[propertyName].message, expectedError);
  }
};
