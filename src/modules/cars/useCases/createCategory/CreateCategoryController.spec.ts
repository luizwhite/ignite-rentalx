import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let adminEmail: string;
let adminPassword: string;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('admin123', 8);

    await connection.query(`
      INSERT INTO USERS (
        id, name, email, password, "isAdmin", created_at, driver_license
      )
      VALUES
        ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, '${new Date().toISOString()}', 'XXXXXX')
    `);

    adminEmail = 'admin@rentx.com.br';
    adminPassword = 'admin123';
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: adminEmail,
      password: adminPassword,
    });

    expect(sessionResponse.body?.token).toBeTruthy();

    const { token } = sessionResponse.body;

    const createCategoryResponse = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(createCategoryResponse.status).toBe(201);
  });

  it('should not be able to create a new category with a name that already exists', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: adminEmail,
      password: adminPassword,
    });

    expect(sessionResponse.body?.token).toBeTruthy();

    const { token } = sessionResponse.body;

    const createCategoryResponse = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(createCategoryResponse.status).toBe(400);
  });
});
