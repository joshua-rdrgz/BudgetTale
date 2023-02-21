import { assert } from 'chai';
import supertest from 'supertest';
import app from '../src/app';

type SuperTest = supertest.SuperTest<supertest.Test>;

describe('app', () => {
  let request: SuperTest;

  beforeEach((done) => {
    request = supertest(app);
    done();
  });

  it('should return a successful response for GET /', async () => {
    const data = await request.get('/');
    assert.deepEqual(data.status, 200);
  });
});
