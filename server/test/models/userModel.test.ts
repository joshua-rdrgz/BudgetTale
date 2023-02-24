import { HydratedDocument } from 'mongoose';
import { userErrors } from '@errorMessages';
import { dropTestDB } from 'test/setup.test';
import { validateMissingOrIncorrectProperty } from './testModelUtils';
import User, { IUser } from '@models/userModel';

type UserDocument = HydratedDocument<IUser>;

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
