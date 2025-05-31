# Yield - Agricultural AI Application

## Overview
Yield is a full-stack web application designed to provide agricultural insights and predictions using AI/ML technologies. The application is built with a modern tech stack featuring a React frontend and a Rust backend, containerized with Docker for easy deployment.

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Development Tools**:
  - ESLint for code linting
  - TypeScript for type safety
  - Modern React development setup with hot reloading

### Backend
- **Language**: Rust
- **Web Framework**: Actix-web
- **Features**:
  - RESTful API architecture
  - Structured error handling with `thiserror`
  - Comprehensive logging with `env_logger`
  - Async runtime with Tokio
  - JSON serialization/deserialization with Serde

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **Deployment**: Multi-container setup with automated builds

## Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Dependencies and scripts
│
├── backend/                 # Rust backend application
│   ├── src/                # Source code
│   ├── tests/              # Test files
│   └── Cargo.toml          # Rust dependencies and config
│
├── docker-compose.yml      # Multi-container Docker setup
├── nginx.conf             # Nginx reverse proxy configuration
└── LICENSE                # Project license
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend development)
- Rust (for local backend development)
- pnpm (package manager for frontend)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yield
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

3. **Backend Development**
   ```bash
   cd backend
   cargo build
   cargo run
   ```

### Production Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:8000
- Backend API: http://localhost:8080

## Environment Variables

### Backend
- `RUST_LOG`: Controls log level (e.g., `info,agri_ai_backend=debug`)

### Frontend
- Environment variables can be added in `.env` files following Vite's conventions

## API Documentation

The backend provides RESTful API endpoints for agricultural data processing and predictions. Detailed API documentation should be added here.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the terms found in the LICENSE file in the root directory.

## Support

For support, please open an issue in the repository's issue tracker. 