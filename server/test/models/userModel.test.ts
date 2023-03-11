// import { assert } from 'chai';
import { HydratedDocument } from 'mongoose';
import { userErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import { validateMissingOrIncorrectProperty } from './testModelUtils';
import User, { IUser } from '@models/userModel';
// import { generateObject } from 'test/testUtils';

type UserDocument = HydratedDocument<IUser>;

// const testRequirementOfUserProperties = async (
//   propertyName: 'name' | 'email' | 'password' | 'passwordConfirm' | 'months',
//   errorName: string,
//   testApp: TestApp
// ) => {
//   const userObj = generateObject('users');
//   delete userObj[propertyName];

//   const res = await testApp.post('/api/v1/auth/createUser').send(userObj);
//   const errorObj = JSON.parse(res.text);

//   assert.deepEqual(res.status, 400);
//   assert.deepEqual(errorObj.status, 'fail');
//   assert.deepEqual(errorObj.message, `Invalid input data: ${errorName}`);
// };

describe('User Model', () => {
  afterEach(async () => await dropTestDB<IUser>(User, 'User'));
  
  it('should contain at least 1 month', async () => {
    const user: UserDocument = new User();

    await validateMissingOrIncorrectProperty<IUser>(
      user,
      'months',
      userErrors.mustContain1Month
    );
  });
});
