import { assert } from 'chai';
import supertest, { SuperTest } from 'supertest';
import User, { IUser } from '@models/userModel';
import app from 'src/app';
import { dropTestDB } from 'test/setup.test';
import { generateObject } from 'test/testUtils';
import { userErrors } from '@errorMessages';

type TestApp = SuperTest<supertest.Test>;

describe('User Routes', () => {
  let testApp: TestApp;
  beforeEach(() => {
    testApp = supertest(app);
  });
  afterEach(() => dropTestDB<IUser>(User, 'User'));

  describe('api/v1/users', () => {
    it('GET - should get an array of all users on the platform', async () => {
      const res = await testApp.get('/api/v1/users');
      assert.deepEqual(res.statusCode, 200);
      assert.deepEqual(res.body.data.users.length, 0);
    });
  });
});
