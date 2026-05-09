import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  }, 30000);

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });

  describe('auth', () => {
    it('registers an admin and logs in', async () => {
      const stamp = Date.now();
      const email = `e2e-admin-${stamp}@example.com`;
      const password = 'password123';

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password,
          companyName: `E2E Company ${stamp}`,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('User created successfully');
        });

      const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(200);

      expect(login.body.access_token).toBeDefined();
      expect(typeof login.body.access_token).toBe('string');
    });
  });
});
