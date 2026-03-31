# Salitrex Frontend

Frontend for the Salitrex Workshop Management System, built with a modern React stack focusing on type safety, performance, and a premium mobile-first user experience.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript (Strict Mode)
- **Bundler**: Vite 8
- **Package Manager**: Bun
- **Routing**: TanStack Router (File-based, Type-safe)
- **State Management**: 
  - Server State: TanStack Query
  - Client State: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI (Radix Primitives)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.5 or higher recommended)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

> **Note:** Ensure the FastAPI backend is also running (typically at `http://localhost:8000`) for full functionality.

### Build for Production

To create an optimized production build:

```bash
bun run build
```

This will run TypeScript type checking (`tsc -b`) followed by the Vite build process, outputting the static files to the `dist/` directory.

## Project Structure

```
src/
├── api/            # Axios instance and API call definitions
├── components/     # React components
│   ├── layout/     # Structural components (Sidebar, Topbar)
│   ├── shared/     # Reusable business components
│   └── ui/         # Shadcn/UI primitive components
├── hooks/          # Custom React hooks (including TanStack Query hooks)
├── lib/            # Utility functions (cn, formatters)
├── routeTree.gen.ts # Auto-generated route tree by TanStack Router
├── routes/         # File-based routing (pages)
├── schemas/        # Zod validation schemas
├── stores/         # Zustand global state stores
├── types/          # TypeScript type definitions
├── index.css       # Global styles and Tailwind configuration
└── main.tsx        # Application entry point
```

## Documentation

- **User Stories & Requirements:** See [`HUs.md`](./HUs.md) for detailed feature specifications and acceptance criteria.
- **Backend API:** Detailed in the root project `README.md` and the frontend development guide.

## Commands Reference

| Command | Description |
|---------|-------------|
| `bun run dev` | Starts the Vite development server |
| `bun run build` | Builds the app for production to `dist/` |
| `bun run lint` | Runs ESLint to check for code quality issues |
| `bun run preview` | Starts a local web server to preview the production build |
