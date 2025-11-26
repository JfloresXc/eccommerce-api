import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductsRepository } from '../src/modules/products/products.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';

describe('ProductsController (e2e) - addPriceBefore', () => {
  let app: INestApplication;
  let productsRepository: ProductsRepository;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'database.uri') {
            return uri;
          }
          if (key === 'app.jwtSecret') {
            return 'test-secret';
          }
          return null;
        }),
      })
      .compile();

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

  describe('/products/addPriceBefore (POST)', () => {
    it('should add priceBefore to some products', async () => {
      // Create some products to update
      await productsRepository.create({ name: 'Product 1', price: 10, category: 'cat', categoryId: 1, image: 'img', id: 1, stock: 1 } as any);
      await productsRepository.create({ name: 'Product 2', price: 20, category: 'cat', categoryId: 1, image: 'img', id: 2, stock: 1 } as any);
      await productsRepository.create({ name: 'Product 3', price: 30, category: 'cat', categoryId: 1, image: 'img', id: 3, stock: 1 } as any);

      const response = await request(app.getHttpServer())
        .post('/products/addPriceBefore')
        .expect(201);

      expect(response.body).toHaveProperty('updatedCount');

      const products = await productsRepository.find({});
      const updatedProducts = products.filter(p => p.priceBefore);

      expect(updatedProducts.length).toBe(response.body.updatedCount);

      updatedProducts.forEach(product => {
        expect(product.priceBefore).toBeGreaterThan(product.price);
      });
    });
  });
});
