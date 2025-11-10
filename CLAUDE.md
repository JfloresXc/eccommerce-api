# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce API backend built with NestJS framework. Currently a starter template ready for e-commerce feature development.

## Package Manager

This project uses **pnpm** (version 10.15.1+). Always use `pnpm` commands, not npm or yarn.

## Development Commands

### Setup
```bash
pnpm install
```

### Running the Application
```bash
pnpm run start          # Standard start
pnpm run start:dev      # Development mode with file watching
pnpm run start:debug    # Debug mode with file watching
pnpm run start:prod     # Production mode (requires build first)
```

Default port is 3000 (configurable via PORT environment variable).

### Building
```bash
pnpm run build          # Compiles TypeScript to dist/ directory
```

### Testing
```bash
pnpm run test           # Run all unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:cov       # Run tests with coverage report
pnpm run test:e2e       # Run end-to-end tests
pnpm run test:debug     # Run tests in debug mode
```

Unit tests are located alongside source files (*.spec.ts) in src/ directory. E2E tests are in test/ directory (*.e2e-spec.ts).

### Code Quality
```bash
pnpm run lint           # Run ESLint with auto-fix
pnpm run format         # Format code with Prettier
```

## Architecture

### NestJS Module Structure

- **AppModule** ([src/app.module.ts](src/app.module.ts)) - Root module that imports all feature modules
- **Controllers** - Handle HTTP requests and define routes (decorated with `@Controller()`)
- **Services** - Contain business logic (decorated with `@Injectable()`)
- **Modules** - Organize application into cohesive blocks (decorated with `@Module()`)

### Entry Point

[src/main.ts](src/main.ts) bootstraps the NestJS application using `NestFactory.create()`.

### TypeScript Configuration

- Uses ES2023 target with NodeNext module resolution
- Decorators enabled (`experimentalDecorators: true`, `emitDecoratorMetadata: true`)
- Strict null checks enabled, but `noImplicitAny` is disabled
- Output compiled to dist/ directory

### Code Style

- **Prettier**: Single quotes, trailing commas, auto line endings
- **ESLint**: TypeScript recommended rules with type checking enabled
  - `@typescript-eslint/no-explicit-any` is disabled
  - Floating promises and unsafe arguments are warnings
  - Uses project service for type-aware linting

## Creating New Features

Use NestJS CLI to generate resources:

```bash
# Generate a complete CRUD resource
pnpm exec nest generate resource <name>

# Generate individual components
pnpm exec nest generate module <name>
pnpm exec nest generate controller <name>
pnpm exec nest generate service <name>
```

## Testing Strategy

- Unit tests use Jest and should mock dependencies
- E2E tests use supertest to test HTTP endpoints
- Place unit tests alongside source files (*.spec.ts)
- Place E2E tests in test/ directory (*.e2e-spec.ts)
