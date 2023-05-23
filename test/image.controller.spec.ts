import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ImageUploadService } from '../src/image/image-upload.service';
import { ImageUpdateDto } from '../src/image/dtos/image-update.dto';
import * as fs from 'fs-extra';

describe('ImageController (e2e)', () => {
  let app: INestApplication;
  let imageUploadService: ImageUploadService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    imageUploadService =
      moduleFixture.get<ImageUploadService>(ImageUploadService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/image/save (POST) - should process and save the image', async () => {
    const imageUpdateDto: ImageUpdateDto = {
      imageUrl:
        'https://assets.storage.trakto.io/AkpvCuxXGMf3npYXajyEZ8A2APn2/0e406885-9d03-4c72-bd92-c6411fbe5c49.jpeg',
      compress: 0.9,
    };

    jest
      .spyOn(imageUploadService, 'processImage')
      .mockImplementation(async () => {
        const originalPath = `original_${Date.now()}.jpg`;
        const thumbPath = `thumb_${Date.now()}.jpg`;

        await fs.writeFile(originalPath, 'original image content');
        await fs.writeFile(thumbPath, 'thumbnail image content');

        return {
          originalPath,
          thumbPath,
          metadata: {
            width: 100,
            height: 100,
          },
        };
      });

    const response = await request(app.getHttpServer())
      .post('/image/save')
      .send(imageUpdateDto)
      .expect(HttpStatus.OK);

    expect(response.body.localpath.original).toBeDefined();
    expect(response.body.localpath.thumb).toBeDefined();
    expect(response.body.metadata).toBeDefined();
  });

  it('/image/save (POST) - should handle invalid URL', async () => {
    const imageUpdateDto: ImageUpdateDto = {
      imageUrl: 'invalid-url',
      compress: 0.9,
    };

    const response = await request(app.getHttpServer())
      .post('/image/save')
      .send(imageUpdateDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.errors[0].code).toBe(404);
    expect(response.body.errors[0].message).toBe('Invalid URL');
  });
});
