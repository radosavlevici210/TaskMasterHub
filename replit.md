# Rest Express Application

## Overview

This is a full-stack web application built with Express.js backend and React frontend. The application uses a modern TypeScript stack with Vite for frontend tooling, Drizzle ORM for database operations, and PostgreSQL as the database. The project is configured for development on Replit with integrated PostgreSQL support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables and theming support
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with resolvers for validation
- **Package Manager**: npm with lockfile for dependency consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database serverless)
- **Development**: Hot reload with tsx for TypeScript execution
- **API Structure**: RESTful API endpoints with /api prefix routing
- **Error Handling**: Centralized error handling middleware

## Key Components

### Database Layer
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migration System**: Drizzle Kit for database migrations stored in `./migrations`
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **User Model**: Basic user entity with username/password authentication structure

### Server Components
- **Route Registration**: Modular route registration system in `server/routes.ts`
- **Storage Abstraction**: `IStorage` interface with `MemStorage` implementation for development
- **Middleware**: Request logging, JSON parsing, and error handling
- **Development Integration**: Vite middleware integration for hot reloading

### Frontend Components
- **Component System**: Shadcn/ui components with New York style configuration
- **Path Aliases**: Configured aliases for `@/components`, `@/lib`, `@/hooks`, etc.
- **Build Configuration**: Separate build processes for client and server

## Data Flow

1. **Request Processing**: Express server receives requests and routes them through middleware
2. **API Routing**: Routes prefixed with `/api` are handled by the backend
3. **Storage Operations**: CRUD operations abstracted through `IStorage` interface
4. **Response Handling**: Centralized error handling and JSON response formatting
5. **Development Flow**: Vite middleware serves frontend assets with hot reload
6. **Production Flow**: Static assets served from `dist/public` directory

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured for Neon Database)
- **Connection**: Environment variable `DATABASE_URL` required for database connectivity

### UI Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Class Variance Authority**: For component variant management

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production server build

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts the development server with hot reload
- **Port**: Application runs on port 5000 locally, exposed on port 80 externally
- **Database**: Requires provisioned PostgreSQL database with `DATABASE_URL` environment variable

### Production Deployment
- **Build Process**: 
  1. `vite build` compiles frontend assets
  2. `esbuild` bundles server code for production
- **Start Command**: `npm run start` runs the production server
- **Deployment Target**: Configured for autoscale deployment on Replit
- **Static Assets**: Frontend built to `dist/public` directory

### Database Management
- **Schema Push**: `npm run db:push` applies schema changes using Drizzle Kit
- **Migration**: Migrations stored in `./migrations` directory
- **Type Safety**: Drizzle generates TypeScript types from schema

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```