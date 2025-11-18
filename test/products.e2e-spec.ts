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

  describe('/products/bulk/update (PATCH)', () => {
    it('should update multiple products', async () => {
      // Create some products to update
      const product1 = await productsRepository.create({ name: 'Product 1', price: 10 } as any);
      const product2 = await productsRepository.create({ name: 'Product 2', price: 20 } as any);
      const product3 = await productsRepository.create({ name: 'Product 3', price: 30 } as any);

      const updates = [
        { id: product1.id, updateProductDto: { name: 'Updated Product 1', price: 15 } },
        { id: product2.id, updateProductDto: { name: 'Updated Product 2', price: 25 } },
      ];

      const response = await request(app.getHttpServer())
        .patch('/products/bulk/update')
        .send(updates)
        .expect(200);

      expect(response.body).toEqual({ modifiedCount: 2 });

      // Verify that the products were updated
      const updatedProduct1 = await productsRepository.findById(product1.id);
      expect(updatedProduct1.name).toBe('Updated Product 1');
      expect(updatedProduct1.price).toBe(15);

      const updatedProduct2 = await productsRepository.findById(product2.id);
      expect(updatedProduct2.name).toBe('Updated Product 2');
      expect(updatedProduct2.price).toBe(25);

      // Verify that the third product was not updated
      const foundProduct3 = await productsRepository.findById(product3.id);
      expect(foundProduct3.name).toBe('Product 3');
      expect(foundProduct3.price).toBe(30);
    });

    it('should return 400 if the payload is not an array', async () => {
      await request(app.getHttpServer())
        .patch('/products/bulk/update')
        .send({ not: 'an array' })
        .expect(400);
    });

    it('should return 400 if an object in the array is missing the id', async () => {
      const updates = [{ updateProductDto: { name: 'Updated Product 1' } }];
      await request(app.getHttpServer())
        .patch('/products/bulk/update')
        .send(updates)
        .expect(400);
    });

    it('should return 400 if an object in the array is missing the updateProductDto', async () => {
        const product1 = await productsRepository.create({ name: 'Product 1', price: 10 } as any);
        const updates = [{ id: product1.id }];
        await request(app.getHttpServer())
          .patch('/products/bulk/update')
          .send(updates)
          .expect(400);
      });

    it('should return 400 if an id is not a valid Mongo ID', async () => {
      const updates = [{ id: 'invalid-id', updateProductDto: { name: 'Updated Product 1' } }];
      await request(app.getHttpServer())
        .patch('/products/bulk/update')
        .send(updates)
        .expect(400);
    });
  });
});
