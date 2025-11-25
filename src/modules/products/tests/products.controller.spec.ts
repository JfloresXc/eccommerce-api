import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { QueryProductDto } from '../dto/query-product.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination-response.dto';
import { Product } from '../entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call productsService.findAll with the correct query', async () => {
      const query: QueryProductDto = { page: 1, limit: 10 };
      const result = new PaginatedResponseDto<Product>([], 0, 0, 0);
      mockProductsService.findAll.mockResolvedValue(result);

      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should return a paginated response', async () => {
      const query: QueryProductDto = { page: 1, limit: 10 };
      const result = new PaginatedResponseDto<Product>([], 0, 0, 0);
      mockProductsService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(query);

      expect(response).toBeInstanceOf(PaginatedResponseDto);
    });
  });
});
