# Salitrex - Workshop Management System

## Overview
Salitrex is a comprehensive management system for an automotive workshop, initially focusing on the Paint Module. It allows tracking clients, vehicles, service entries, and generating daily delivery reports.

## Architecture
The project follows a split-stack architecture:

- **Backend**: FastAPI (Python) using a Modular Monolith pattern.
- **Frontend**: React + TypeScript + bun (Vite).
- **Database**: PostgreSQL.
- **Storage**: AWS S3 (for vehicle photos/videos).

## Project Structure

```
salitrex/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── core/           # Config, Database, Security
│   │   ├── modules/        # Domain Modules (Auth, CRM, Workshop)
│   │   └── main.py         # Entry point
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React Application
│   ├── src/                # Components, Pages, Hooks
│   └── bun.lockb           # Bun lockfile (to be generated)
└── README.md
```

## Getting Started

### Prerequisites
- **Python**: 3.10+
- **Node.js/npm**: Required if Bun is not installed or supported.
- **Bun**: Recommended for Frontend (Install via `powershell -c "irm bun.sh/install.ps1 | iex"`).
- **PostgreSQL**: Running locally or via Docker.

### 1. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations (once models are ready):
```bash
alembic upgrade head
```

Start the development server:
```bash
uvicorn app.main:app --reload
```
Swagger UI will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
Navigate to the `frontend/` directory:
```bash
cd frontend
```

Install dependencies (using Bun or npm):
```bash
# Option A: Bun (Recommended)
bun install

# Option B: npm (If Bun fails)
npm install
```

Start the development server:
```bash
# Bun
bun run dev

# npm
npm run dev
```

## Development Status
- [x] Phase 1: Planning & Architecture
- [x] Phase 2: Project Initialization
- [/] Phase 3: Database & Models (Current)

