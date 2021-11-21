require('dotenv').config();
const { Pool, Client } = require('pg');

describe('PostgreSQL', () => {
  let testPool, client;

  beforeAll(async () => {
    testPool = new Pool({ database: 'testing' });
  });

  beforeEach(async () => {
    client = await testPool.connect();
  });

  afterEach(async () => {
    await client.release();
  });

  afterAll(async () => {
    await testPool.end();
  });


  it('should connect to the database', async () => {
    try {
      const { rows } = await client.query('SELECT 2^3 AS "result"');
      expect(rows[0].result).toBe(8);
      expect(typeof rows[0].result).toBe('number');
      expect(rows[1]).toBeUndefined();
    } catch (err) {
      throw err;
    }
  });


  it('should return values', async () => {
    try {
      const { rows } = await client.query('SELECT * FROM test');
      expect(rows[0].summary)?.toBe('This test works great!');
      expect(rows[0].reviewer_email)?.toBe('first.last@gmail.com');
    } catch (err) {
      throw err;
    }
  });

});
