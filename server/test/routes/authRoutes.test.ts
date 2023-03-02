import jwt from 'jsonwebtoken';
import { assert } from 'chai';
import supertest, { SuperTest } from 'supertest';
import User, { IUser } from '@models/userModel';
import app from 'src/app';
import { dropTestDB } from 'test/setup.test';
import { generateObject } from 'test/testUtils';
import { userErrors } from '@errorMessages';

type TestApp = SuperTest<supertest.Test>;

const testRequirementOfUserProperties = async (
  propertyName: 'name' | 'email' | 'password' | 'passwordConfirm' | 'months',
  errorName: string,
  testApp: TestApp
) => {
  const userObj = generateObject('users');
  delete userObj[propertyName];

  const res = await testApp.post('/api/v1/createUser').send(userObj);
  const errorObj = JSON.parse(res.text);

  assert.deepEqual(res.status, 400);
  assert.deepEqual(errorObj.status, 'fail');
  assert.deepEqual(errorObj.message, `Invalid input data: ${errorName}`);
};

describe('Auth Routes', () => {
  let testApp: TestApp;
  beforeEach(() => {
    testApp = supertest(app);
  });
  afterEach(() => dropTestDB<IUser>(User, 'User'));

  describe('api/v1/createUser', () => {
    it('POST - should create a new user', async () => {
      try {
        const userObj = generateObject('users');
        const res = await testApp.post('/api/v1/createUser').send(userObj);
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
      await testRequirementOfUserProperties('name', userErrors.name, testApp);
      await testRequirementOfUserProperties('email', userErrors.email, testApp);
      await testRequirementOfUserProperties(
        'password',
        userErrors.password,
        testApp
      );
      await testRequirementOfUserProperties(
        'passwordConfirm',
        userErrors.passwordConfirm,
        testApp
      );
      await testRequirementOfUserProperties(
        'months',
        userErrors.mustContain1Month,
        testApp
      );
    });
  });

  describe('/api/v1/loginUser', () => {
    it('POST - should give successful JWT token when given accurate info', async () => {
      const createUserResponse = await testApp
        .post('/api/v1/createUser')
        .send(generateObject('users'));
      const loginUserResponse = await testApp
        .post('/api/v1/loginUser')
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
