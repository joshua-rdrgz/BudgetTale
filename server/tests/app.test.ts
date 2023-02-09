import app from '../src/app';
import supertest from 'supertest';

type SuperTest = supertest.SuperTest<supertest.Test>;

describe('app', () => {
  let request: SuperTest;

  beforeEach(async () => {
    request = await supertest(app);
  });

  it('should return a successful response for GET /', async () => {
    const data = await request.get('/');
    return expect(data.status).toBe(200);
  });
});

