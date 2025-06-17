# Quantum Particle Simulator

## Overview

This is a full-stack quantum particle physics simulator built with React, TypeScript, and Express. The application allows users to create and interact with various particle types in real-time simulations, featuring advanced physics calculations, collision detection, and WebSocket-based real-time updates. Users can manipulate gravity wells, electromagnetic forces, and observe quantum mechanical behaviors in an interactive 3D-like environment.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Communication**: WebSocket implementation for live simulation updates
- **UI Framework**: Tailwind CSS with shadcn/ui components for a modern interface

## Key Components

### Frontend Architecture
- **React with TypeScript**: Main UI framework with strict type checking
- **Vite**: Fast development server and build tool with HMR support
- **Custom Physics Engine**: Real-time particle simulation with collision detection
- **Canvas-based Rendering**: HTML5 Canvas for high-performance particle visualization
- **State Management**: React hooks and context for simulation state
- **WebSocket Client**: Real-time communication with the server

### Backend Architecture
- **Express.js**: RESTful API server with middleware for logging and error handling
- **WebSocket Server**: Real-time bidirectional communication for simulation updates
- **Drizzle ORM**: Type-safe database operations with automatic migrations
- **Session Management**: PostgreSQL-based session storage
- **Route Organization**: Modular route structure with proper error handling

### Database Schema
- **Users Table**: User authentication and profile management
- **Simulations Table**: Stored simulation configurations and metadata
- **Simulation Stats Table**: Time-series data for performance analytics and replay functionality

## Data Flow

1. **Client Initialization**: React app loads and establishes WebSocket connection
2. **Simulation Engine**: Physics calculations run in browser using custom particle engine
3. **Real-time Updates**: Simulation data streamed via WebSocket to connected clients
4. **Database Persistence**: Simulation configurations and statistics saved to PostgreSQL
5. **API Communication**: RESTful endpoints for CRUD operations on simulations

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features
- **Express.js**: Web server framework
- **TypeScript**: Type safety across the entire codebase

### Database & ORM
- **PostgreSQL**: Primary database (configured via Drizzle)
- **Drizzle ORM**: Type-safe database operations
- **@neondatabase/serverless**: Serverless PostgreSQL connection pooling

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Radix UI**: Accessible primitive components

### Real-time Communication
- **ws**: WebSocket implementation for real-time updates
- **@tanstack/react-query**: Server state management

### Physics & Visualization
- **Custom Physics Engine**: Built-in particle simulation
- **Canvas API**: High-performance 2D rendering

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Development Mode**: `npm run dev` - Runs both client and server in development
- **Production Build**: `npm run build` - Creates optimized production bundles
- **Production Start**: `npm run start` - Serves the built application
- **Database Migrations**: `npm run db:push` - Applies schema changes

### Environment Configuration
- **NODE_ENV**: Environment detection (development/production)
- **DATABASE_URL**: PostgreSQL connection string (required)
- **Port Configuration**: Server runs on port 5000, mapped to external port 80

### Build Process
1. **Client Build**: Vite bundles React app with optimizations
2. **Server Build**: esbuild packages Express server as ESM module
3. **Static Assets**: Client build output served from Express server
4. **Database Setup**: Automatic migration on deployment

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```