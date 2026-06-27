import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('DwelloSphere API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Auth ───────────────────────────────────────────────
  describe('Auth', () => {
    const testUser = {
      email: `e2e-${Date.now()}@test.com`,
      password: 'password123',
      firstName: 'E2E',
      lastName: 'User',
    };
    let token: string;

    it('POST /api/v1/auth/register - should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });

    it('POST /api/v1/auth/register - should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('POST /api/v1/auth/login - should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });

    it('POST /api/v1/auth/login - should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'wrongpass' })
        .expect(401);
    });

    it('GET /api/v1/auth/profile - should return profile with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.email).toBe(testUser.email);
    });

    it('GET /api/v1/auth/profile - should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);
    });
  });

  // ─── Properties ─────────────────────────────────────────
  describe('Properties', () => {
    it('GET /api/v1/properties - should list properties', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/properties')
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.total).toBeDefined();
    });

    it('GET /api/v1/properties/:id - should return 404 for nonexistent', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/properties/nonexistent')
        .expect(404);
    });

    it('POST /api/v1/properties - should reject without auth', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/properties')
        .send({})
        .expect(401);
    });
  });

  // ─── Bookings ───────────────────────────────────────────
  describe('Bookings', () => {
    it('GET /api/v1/bookings/my - should reject without auth', async () => {
      await request(app.getHttpServer()).get('/api/v1/bookings/my').expect(401);
    });

    it('GET /api/v1/bookings/agent - should reject without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/bookings/agent')
        .expect(401);
    });
  });
});
