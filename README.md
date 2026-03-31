# Salitrex - Workshop Management System

## Overview
Salitrex is a comprehensive management system for an automotive workshop, initially focusing on the Paint Module. It allows tracking clients, vehicles, service entries, and generating daily delivery reports.

## Architecture
The project follows a split-stack architecture:

- **Backend**: FastAPI (Python 3.10+) using a Modular Monolith pattern.
- **Frontend**: React 19 + TypeScript (strict) + Vite 8.
- **Database**: PostgreSQL (SQLite for local development).
- **Auth**: JWT (python-jose) + bcrypt (passlib).
- **Storage**: AWS S3 (for vehicle photos/videos).

### Frontend Stack (Planned)
- **Routing**: TanStack Router (file-based, type-safe).
- **Styling**: Tailwind CSS v4 + Shadcn/UI (Premium dark aesthetic).
- **State**: TanStack Query (server state) + Zustand (client state).
- **Forms**: React Hook Form + Zod.
- **Icons**: Lucide React.

## Project Structure

```
salitrex-v1/
├── backend/                    # FastAPI Application
│   ├── app/
│   │   ├── core/               # Config, Database, Security, Seeders
│   │   ├── modules/
│   │   │   ├── auth/           # Auth: JWT login, register, user CRUD
│   │   │   ├── crm/            # CRM: Clients + Cars CRUD
│   │   │   ├── income/         # Income: Vehicle entries + S3 photo upload
│   │   │   ├── paint/          # Paint: Price calculator, jobs, config
│   │   │   └── common/         # Shared utilities (S3 storage)
│   │   └── main.py             # Entry point
│   ├── alembic/                # Database migrations
│   └── requirements.txt        # Python dependencies
├── frontend/                   # React Application (Vite scaffold)
│   ├── src/
│   │   ├── App.tsx             # Main component (starter template)
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Styles
│   ├── vite.config.ts          # Vite configuration
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- **Python**: 3.10+
- **Bun**: v1.3.5+ (or npm/pnpm). Install via `curl -fsSL https://bun.sh/install | bash`.
- **PostgreSQL**: Running locally or via Docker (SQLite used as default for dev).

### 1. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies and run:
```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```
- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### 2. Frontend Setup
Navigate to the `frontend/` directory:
```bash
cd frontend
bun install
bun run dev
```
The application will be available at: `http://localhost:5173`

## Backend Modules

| Module | Prefix | Description |
|--------|--------|-------------|
| **Auth** | `/api/v1/auth` | Register, login (JWT), user CRUD (admin/operator roles) |
| **CRM** | `/api/v1/crm` | Clients CRUD + search, Cars CRUD |
| **Income** | `/api/v1/income` | Vehicle entries with S3 photo uploads (entry/process/finished/exit) |
| **Paint** | `/api/v1/paint` | Price calculator (area × price/cm²), paint jobs with margin validation, config |

## Current Status

- ✅ **Backend**: Fully implemented — 4 modules, ~20 endpoints, JWT auth, S3 integration
- 🚧 **Frontend**: Vite + React 19 scaffold — business logic implementation in progress

---
*This project uses Bun as the frontend package manager and Vite as the bundler.*
