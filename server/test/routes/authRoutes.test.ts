import jwt from 'jsonwebtoken';
import { assert } from 'chai';
import supertest, { SuperTest } from 'supertest';
import app from 'src/app';
import User from '@models/userModel';
import { dropTestDB } from 'test/setup.test';
import { generateObject } from 'test/testUtils';
import { IUser } from 'budgettaleglobaltypes';

type TestApp = SuperTest<supertest.Test>;

describe('Auth Routes', () => {
  let testApp: TestApp;
  beforeEach(() => {
    testApp = supertest(app);
  });
  afterEach(() => dropTestDB<IUser>(User, 'User'));

  describe('api/v1/auth/createUser', () => {
    it('POST - should create a new user', async () => {
      try {
        const userObj = generateObject('users') as IUser;
        const res = await testApp.post('/api/v1/auth/createUser').send(userObj);
        const resData = res.body.data.user;
        const data = await User.findById(resData._id);

        assert.deepEqual(res.statusCode, 201);
        assert.deepEqual(data._id.toString(), resData._id);
        assert.deepEqual(await User.countDocuments(), 1);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('/api/v1/auth/loginUser', () => {
    it('POST - should give successful JWT token when given accurate info', async () => {
      const createUserResponse = await testApp
        .post('/api/v1/auth/createUser')
        .send(generateObject('users'));
      const loginUserResponse = await testApp
        .post('/api/v1/auth/loginUser')
        .send({ email: 'testing@gmail.com', password: 'testpassword' });
      
      const createUserData = createUserResponse.body.data.user;
      const loginData = JSON.parse(loginUserResponse.text);
      const loginDecoded = jwt.decode(loginData.token) as jwt.JwtPayload;

      assert.deepEqual(loginData.status, 'success');
      assert.isDefined(loginData.token);
      assert.deepEqual(loginDecoded.id, createUserData._id);
    });
  });
});
