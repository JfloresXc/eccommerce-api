import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductsRepository } from '../src/modules/products/products.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productsRepository: ProductsRepository;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(uri),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    productsRepository = moduleFixture.get<ProductsRepository>(ProductsRepository);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  });

  afterEach(async () => {
    if (productsRepository) {
      await productsRepository.productModel.deleteMany({});
    }
  });

  describe('/products/bulk/delete (DELETE)', () => {
    it('should delete multiple products', async () => {
      // Create some products to delete
      const product1 = await productsRepository.create({ name: 'Product 1', price: 10 } as any);
      const product2 = await productsRepository.create({ name: 'Product 2', price: 20 } as any);
      const product3 = await productsRepository.create({ name: 'Product 3', price: 30 } as any);

      const idsToDelete = [product1.id, product2.id];

      const response = await request(app.getHttpServer())
        .delete('/products/bulk/delete')
        .send({ ids: idsToDelete })
        .expect(200);

      expect(response.body).toEqual({ deletedCount: 2 });

      // Verify that the products were deleted
      const foundProduct1 = await productsRepository.findById(product1.id);
      expect(foundProduct1).toBeNull();

      const foundProduct2 = await productsRepository.findById(product2.id);
      expect(foundProduct2).toBeNull();

      // Verify that the third product was not deleted
      const foundProduct3 = await productsRepository.findById(product3.id);
      expect(foundProduct3).toBeDefined();
    });

    it('should return 400 if ids is not an array', async () => {
      await request(app.getHttpServer())
        .delete('/products/bulk/delete')
        .send({ ids: 'not-an-array' })
        .expect(400);
    });

    it('should return 400 if ids is an empty array', async () => {
        await request(app.getHttpServer())
          .delete('/products/bulk/delete')
          .send({ ids: [] })
          .expect(400);
      });

    it('should return 400 if ids contains invalid mongo ids', async () => {
      await request(app.getHttpServer())
        .delete('/products/bulk/delete')
        .send({ ids: ['invalid-id'] })
        .expect(400);
    });
  });
});
