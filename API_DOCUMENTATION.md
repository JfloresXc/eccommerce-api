# E-commerce API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Categories

#### GET /api/categories
Get all active categories.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "isActive": true,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:00:00.000Z"
  }
]
```

#### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "isActive": true
}
```

#### GET /api/categories/:id
Get a category by ID.

#### PATCH /api/categories/:id
Update a category.

#### DELETE /api/categories/:id
Delete a category.

---

### Products

#### GET /api/products
Get products with pagination, filtering, and search.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `category` (optional): Filter by category ID
- `search` (optional): Full-text search in name and description

**Examples:**

Get first page with 10 products:
```
GET /api/products?page=1&limit=10
```

Filter by category:
```
GET /api/products?category=507f1f77bcf86cd799439011
```

Search products:
```
GET /api/products?search=laptop
```

Combined filters:
```
GET /api/products?page=2&limit=20&category=507f1f77bcf86cd799439011&search=gaming
```

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop",
      "price": 1299.99,
      "stock": 15,
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Electronics",
        "slug": "electronics"
      },
      "images": [
        "https://example.com/laptop1.jpg",
        "https://example.com/laptop2.jpg"
      ],
      "isActive": true,
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### GET /api/products/:id
Get a product by ID with populated category.

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": 1299.99,
  "stock": 15,
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices"
  },
  "images": ["https://example.com/laptop1.jpg"],
  "isActive": true,
  "createdAt": "2025-10-28T10:00:00.000Z",
  "updatedAt": "2025-10-28T10:00:00.000Z"
}
```

#### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4080",
  "price": 1299.99,
  "stock": 15,
  "category": "507f1f77bcf86cd799439011",
  "images": [
    "https://example.com/laptop1.jpg",
    "https://example.com/laptop2.jpg"
  ],
  "isActive": true
}
```

#### PATCH /api/products/:id
Update a product.

**Request Body (all fields optional):**
```json
{
  "name": "Updated Gaming Laptop",
  "price": 1199.99,
  "stock": 20
}
```

#### DELETE /api/products/:id
Delete a product.

---

## Architecture

### Technology Stack
- **Framework**: NestJS 11
- **Database**: MongoDB with Mongoose ODM
- **Validation**: class-validator & class-transformer
- **Configuration**: @nestjs/config with environment variables

### Project Structure
```
src/
├── common/                    # Shared utilities
│   ├── dto/                  # Pagination DTOs
│   └── interfaces/           # Repository interface
├── config/                    # Configuration files
│   ├── database.config.ts
│   └── app.config.ts
├── database/                  # Database module
│   └── database.module.ts
├── modules/                   # Feature modules
│   ├── categories/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.repository.ts
│   │   └── categories.module.ts
│   └── products/
│       ├── dto/
│       ├── entities/
│       ├── products.controller.ts
│       ├── products.service.ts
│       ├── products.repository.ts
│       └── products.module.ts
├── app.module.ts
└── main.ts
```

### Design Patterns
- **Repository Pattern**: Abstracts database operations
- **Dependency Injection**: NestJS built-in DI container
- **DTOs**: Data validation and transformation
- **Modular Architecture**: Each feature is a separate module

### Database Indexes
- **Products**:
  - Text index on `name` and `description` for full-text search
  - Index on `category` for filtering
  - Index on `name` for sorting
- **Categories**:
  - Unique index on `slug`
  - Index on `name`

### Validation
All endpoints use automatic validation with the following rules:
- Required fields are enforced
- Type checking (string, number, boolean)
- Range validation (min/max for numbers)
- MongoDB ObjectId validation
- Whitelist mode (strips unknown properties)

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+
- pnpm 10+

### Installation
```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=3000
NODE_ENV=development
```

### Running the Application
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

### Testing
```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

---

## Features

✅ **Pagination**: Efficient pagination with metadata
✅ **Full-text Search**: MongoDB text search on products
✅ **Filtering**: Filter products by category
✅ **Validation**: Automatic request validation
✅ **Type Safety**: Full TypeScript support
✅ **Population**: Automatic category population in products
✅ **CORS**: Enabled for cross-origin requests
✅ **Repository Pattern**: Clean separation of concerns
✅ **Error Handling**: Proper HTTP status codes and error messages

---

## Future Enhancements

- Authentication & Authorization (JWT)
- User management
- Shopping cart
- Orders management
- Payment integration
- Image upload to cloud storage
- Product reviews and ratings
- Inventory management
- Admin dashboard
- API documentation with Swagger
- Rate limiting
- Caching (Redis)
- Logging and monitoring
