import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/batidas (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/batidas')
      .send({ momento: '2024-01-01T08:00:00'})
      .expect(201)
      .expect({ "dia": "2024-01-01", "pontos": ["08:00:00"] });
  });

  it('/v1/folhas-de-ponto (GET)', async () => {
    await request(app.getHttpServer())
      .post('/v1/batidas')
      .send({ momento: '2024-01-01T08:00:00'})
    await request(app.getHttpServer())
      .post('/v1/batidas')
      .send({ momento: '2024-01-01T12:00:00'})
    await request(app.getHttpServer())
      .post('/v1/batidas')
      .send({ momento: '2024-01-01T13:00:00'})
    await request(app.getHttpServer())
      .post('/v1/batidas')
      .send({ momento: '2024-01-01T17:00:00'})

    const response = await request(app.getHttpServer())
      .get('/v1/folhas-de-ponto/2024-01')

    expect(response.status).toBe(200)
    expect(response.body.horasTrabalhadas).toBe('PT8H')
    expect(response.body.horasExcendentes).toBe('PT0S')
    expect(response.body.horasDevidas).toBe('PT0S')
  });
});
