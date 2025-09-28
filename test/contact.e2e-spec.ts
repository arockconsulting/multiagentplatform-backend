```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateContactDto } from '../src/contacts/dto/create-contact.dto';
import { UpdateContactDto } from '../src/contacts/dto/update-contact.dto';

describe('ContactController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createContactDto: CreateContactDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  };

  const updateContactDto: UpdateContactDto = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '098-765-4321',
  };

  let contactId: string;

  it('/contacts (POST)', () => {
    return request(app.getHttpServer())
      .post('/contacts')
      .send(createContactDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toBeDefined();
        contactId = response.body.id;
        expect(response.body.firstName).toEqual(createContactDto.firstName);
        expect(response.body.lastName).toEqual(createContactDto.lastName);
        expect(response.body.email).toEqual(createContactDto.email);
        expect(response.body.phone).toEqual(createContactDto.phone);
      });
  });

  it('/contacts (GET)', () => {
    return request(app.getHttpServer())
      .get('/contacts')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  it('/contacts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/contacts/${contactId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(contactId);
        expect(response.body.firstName).toEqual(createContactDto.firstName);
        expect(response.body.lastName).toEqual(createContactDto.lastName);
        expect(response.body.email).toEqual(createContactDto.email);
        expect(response.body.phone).toEqual(createContactDto.phone);
      });
  });

  it('/contacts/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/contacts/${contactId}`)
      .send(updateContactDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(contactId);
        expect(response.body.firstName).toEqual(updateContactDto.firstName);
        expect(response.body.lastName).toEqual(updateContactDto.lastName);
        expect(response.body.email).toEqual(updateContactDto.email);
        expect(response.body.phone).toEqual(updateContactDto.phone);
      });
  });

  it('/contacts/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/contacts/${contactId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(contactId);
      });
  });

  it('/contacts/:id (GET) - Should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/contacts/${contactId}`)
      .expect(404);
  });

  it('/contacts (POST) - Should return 400 for invalid email', () => {
    const invalidContactDto: CreateContactDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '123-456-7890',
    };

    return request(app.getHttpServer())
      .post('/contacts')
      .send(invalidContactDto)
      .expect(400);
  });

  it('/contacts (POST) - Should return 400 for missing firstName', () => {
    const invalidContactDto = {
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
    };

    return request(app.getHttpServer())
      .post('/contacts')
      .send(invalidContactDto)
      .expect(400);
  });
});
```