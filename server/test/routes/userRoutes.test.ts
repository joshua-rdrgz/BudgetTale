import chai, { assert, expect } from 'chai';
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
      assert.deepEqual(res.body.data.users.length, 0); // no users yet, will update
    });

    it('POST - should create a new user', async () => {
      try {
        const userObj = generateObject('users');
        const res = await testApp.post('/api/v1/users').send(userObj);
        const resData = res.body.data.user;
        const data = await User.findById(resData._id);

        assert.deepEqual(res.statusCode, 201);
        assert.deepEqual(data._id.toString(), resData._id);
        assert.deepEqual(await User.countDocuments(), 1);
      } catch (err) {
        console.log(err);
      }
    });

    it('POST - should fail if incorrect object given', async () => {
      const userObj = generateObject('users', false);
      const res = await testApp.post('/api/v1/users').send(userObj);
      const errorObj = JSON.parse(res.text);

      assert.deepEqual(res.status, 400);
      assert.deepEqual(errorObj.status, 'fail');
      assert.deepEqual(
        errorObj.message,
        `Invalid input data: ${userErrors.mustContain1Month}`
      );
    });
  });
});
