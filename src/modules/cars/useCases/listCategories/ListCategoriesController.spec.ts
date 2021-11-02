import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ICreateCategoryDTO } from '@modules/cars/repositories/ICategoriesRepository';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let categoriesData: ICreateCategoryDTO[];

let adminEmail: string;
let adminPassword: string;
let uuidv4Regex: RegExp;

describe('List Categories Controller', () => {
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

    uuidv4Regex = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      'i'
    );

    categoriesData = [
      {
        name: 'Category Supertest 01',
        description: 'Category Supertest 01',
      },
      {
        name: 'Category Supertest 02',
        description: 'Category Supertest 02',
      },
      {
        name: 'Category Supertest 03',
        description: 'Category Supertest 03',
      },
    ];
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: adminEmail,
      password: adminPassword,
    });

    expect(sessionResponse.body?.token).toBeTruthy();

    const { token } = sessionResponse.body;

    await Promise.all(
      categoriesData.map(async (categoryData) => {
        await request(app)
          .post('/categories')
          .send(categoryData)
          .set({
            Authorization: `Bearer ${token}`,
          });
      })
    );

    const listCategoriesResponse = await request(app)
      .get('/categories')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(listCategoriesResponse.status).toBe(200);
    expect(listCategoriesResponse.body).toBeInstanceOf(Array);
    expect(listCategoriesResponse.body.length).toBe(3);
    expect(listCategoriesResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...categoriesData[0],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          ...categoriesData[1],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          ...categoriesData[2],
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );
  });
});
